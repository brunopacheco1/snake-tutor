// SPDX-License-Identifier: Apache-2.0
// Wires the panes together and runs the debug-session state machine
// (see specs/001-browser-debugger/data-model.md).
import { Cmd, Runner } from "./runner.js";
import { createEditor } from "./editor.js";
import { createConsole } from "./console.js";
import { createVariables } from "./variables.js";
import * as i18n from "./i18n.js";

const { t } = i18n;

// Before anything renders: pick the saved language, or follow the system's.
i18n.init();

const STORAGE_KEY = "snake-tutor:v1";
const MAX_FILE_BYTES = 1024 * 1024;

const $ = (id) => document.getElementById(id);
const buttons = {
  continue: $("btn-continue"),
  over: $("btn-over"),
  into: $("btn-into"),
  out: $("btn-out"),
  restart: $("btn-restart"),
  stop: $("btn-stop"),
};

let state = "loading"; // loading | idle | running | paused | input
let pause = null;
let selectedFrame = 0;
let fileName = "main.py";
let pythonVersion = "";
let restartPending = false;
let stopTimer = null;
let renderTimer = null;
let saveTimer = null;
let runner = null;

const active = () => state === "running" || state === "paused" || state === "input";

// ---------------------------------------------------------------- panes

const editor = createEditor($("editor"), {
  onChange: scheduleSave,
  onBreakpointsChange(lines) {
    scheduleSave();
    if (active()) runner.send(Cmd.BREAKPOINTS, JSON.stringify(lines));
  },
});
const terminal = createConsole($("console"));
const variables = createVariables($("variables"), { onSelectFrame: selectFrame });

function selectFrame(index) {
  if (!pause) return;
  selectedFrame = index;
  variables.select(pause, index);
  editor.setFrameLine(index === 0 ? null : pause.frames[index].line);
  if (index === 0) editor.setCurrentLine(pause.line);
}

// ---------------------------------------------------------------- state

// The status is kept as a function so a language switch can redraw it in place.
let statusView = () => "";

function setStatus(view) {
  statusView = view;
  $("status").innerHTML = view();
}

function setState(next) {
  state = next;
  clearTimeout(renderTimer);
  // Steps go paused -> running -> paused within milliseconds; delaying the
  // "running" look avoids flicker.
  if (next === "running") renderTimer = setTimeout(render, 150);
  else render();
}

function render() {
  const enabled = {
    continue: state === "idle" || state === "paused",
    over: state === "paused",
    into: state === "paused",
    out: state === "paused",
    restart: active(),
    stop: active(),
  };
  for (const [name, button] of Object.entries(buttons)) button.disabled = !enabled[name];
  $("continue-label").textContent = t(state === "paused" ? "controls.continue" : "controls.start");
  buttons.continue.title = t(state === "paused" ? "controls.continueTitle" : "controls.startTitle");
  editor.setReadOnly(active());

  if (state === "running") editor.setCurrentLine(null);
  if (state === "loading") return;
  if (state === "idle") {
    setStatus(
      () =>
        `${t("status.readyHtml", { start: t("controls.start") })} ` +
        `<span class="muted-inline">${t("status.pythonVersion", { version: pythonVersion })}</span>`,
    );
  } else if (state === "running") {
    setStatus(() => t("status.runningHtml", { stop: t("controls.stop") }));
  } else if (state === "paused") {
    const line = pause.line;
    setStatus(() => t("status.pausedHtml", { line, stepOver: t("controls.stepOver") }));
  } else if (state === "input") {
    setStatus(() => t("status.inputHtml"));
  }
}

// ---------------------------------------------------------------- actions

function start() {
  if (state !== "idle") return;
  terminal.clear();
  editor.clearMarks();
  variables.reset();
  pause = null;
  setState("running");
  runner.start(editor.getValue(), editor.breakpoints(), fileName);
}

function resume(command) {
  if (state !== "paused") return;
  setState("running");
  runner.send(command);
}

function continueOrStart() {
  if (state === "idle") start();
  else resume(Cmd.CONTINUE);
}

function stop() {
  if (!active()) return;
  runner.stop(state === "running");
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => {
    // Python did not respond (e.g. stuck inside a long built-in call): start a fresh one.
    terminal.cancelInput();
    terminal.system(t("console.stopped"));
    editor.clearMarks();
    variables.reset();
    setStatus(() => t("status.restarting"));
    setState("loading");
    runner.hardReset();
  }, 2000);
}

function restart() {
  if (active()) {
    restartPending = true;
    stop();
  } else {
    start();
  }
}

// ---------------------------------------------------------------- worker events

function onMessage(message) {
  switch (message.type) {
    case "status":
      setStatus(() => t(message.key));
      break;
    case "ready":
      pythonVersion = message.version;
      setState("idle");
      if (restartPending) {
        restartPending = false;
        start();
      }
      break;
    case "stdout":
    case "stderr":
      terminal.write(message.text, message.type);
      break;
    case "running":
      if (active()) setState("running");
      break;
    case "paused":
      $("variables").classList.remove("no-flash");
      pause = message;
      selectedFrame = 0;
      variables.update(message, 0);
      editor.setFrameLine(null);
      editor.setCurrentLine(message.line);
      setState("paused");
      break;
    case "input":
      setState("input");
      terminal.requestInput((line) => {
        if (state !== "input") return;
        setState("running");
        runner.send(Cmd.INPUT, line);
      });
      break;
    case "done":
      finish(message);
      break;
    case "fatal":
      terminal.system(t("console.fatal", { error: message.text }));
      setStatus(() => t("status.pythonFailedHtml"));
      break;
  }
}

function finish(message) {
  clearTimeout(stopTimer);
  terminal.cancelInput();
  editor.clearMarks();
  pause = null;
  variables.reset();
  if (message.status === "ok") {
    terminal.system(t("console.finished"));
  } else if (message.status === "stopped") {
    terminal.system(t("console.stopped"));
  } else {
    const line = message.error && message.error.line;
    const kind = /^(Syntax|Indentation|Tab)Error$/.test(message.error.type) ? "syntaxError" : "runtimeError";
    editor.setErrorLine(line);
    terminal.system(t(`console.${kind}${line ? "AtLine" : ""}`, { line }));
  }
  setState("idle");
  if (message.status === "error") {
    // The exception type is Python's own text and is never translated.
    const { type, line } = message.error;
    setStatus(() =>
      t(line ? "status.errorAtLineHtml" : "status.errorHtml", { type, line, start: t("controls.start") }),
    );
  }
  if (restartPending) {
    restartPending = false;
    start();
  }
}

// ---------------------------------------------------------------- controls & keys

buttons.continue.addEventListener("click", continueOrStart);
buttons.over.addEventListener("click", () => resume(Cmd.STEP_OVER));
buttons.into.addEventListener("click", () => resume(Cmd.STEP_INTO));
buttons.out.addEventListener("click", () => resume(Cmd.STEP_OUT));
buttons.restart.addEventListener("click", restart);
buttons.stop.addEventListener("click", stop);

window.addEventListener("keydown", (event) => {
  const mod = event.ctrlKey || event.metaKey;
  let action = null;
  if (event.key === "F5") action = mod && event.shiftKey ? restart : event.shiftKey ? stop : continueOrStart;
  else if (event.key === "F10") action = () => resume(Cmd.STEP_OVER);
  else if (event.key === "F11") action = () => resume(event.shiftKey ? Cmd.STEP_OUT : Cmd.STEP_INTO);
  if (!action) return;
  event.preventDefault();
  action();
});

// ---------------------------------------------------------------- script files

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: fileName, source: editor.getValue(), breakpoints: editor.breakpoints() }),
      );
    } catch {
      // Storage may be unavailable (private mode); the script just won't persist.
    }
  }, 300);
}

function setFileName(name) {
  fileName = name || "main.py";
  $("file-name").textContent = fileName;
  document.title = t("title.file", { file: fileName });
}

function loadScript(name, source, breakpoints = []) {
  setFileName(name);
  editor.setValue(source, breakpoints);
  scheduleSave();
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.source === "string") {
      loadScript(saved.name, saved.source, saved.breakpoints || []);
      return;
    }
  } catch {
    // fall through to the sample
  }
  loadScript("main.py", i18n.sample());
}

async function openFile(file) {
  if (!file) return;
  if (active()) {
    terminal.system(t("file.stopFirst"));
    return;
  }
  if (!/\.py$/i.test(file.name) && file.type && !file.type.startsWith("text/")) {
    terminal.system(t("file.notPython", { file: file.name }));
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    terminal.system(t("file.tooLarge", { file: file.name }));
    return;
  }
  loadScript(file.name.replace(/\.[^.]*$/, "") + ".py", await file.text());
  editor.clearMarks();
}

$("file-input").addEventListener("change", (event) => {
  openFile(event.target.files[0]);
  event.target.value = "";
});

$("btn-download").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([editor.getValue()], { type: "text/x-python" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: fileName });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("btn-sample").addEventListener("click", () => {
  if (active()) return;
  if (!i18n.isAnySample(editor.getValue()) && !confirm(t("file.confirmReplace"))) return;
  loadScript("main.py", i18n.sample());
});

const scriptPane = document.querySelector(".script-pane");
scriptPane.addEventListener("dragover", (event) => {
  event.preventDefault();
  scriptPane.classList.add("dragover");
});
scriptPane.addEventListener("dragleave", (event) => {
  if (!scriptPane.contains(event.relatedTarget)) scriptPane.classList.remove("dragover");
});
scriptPane.addEventListener("drop", (event) => {
  event.preventDefault();
  scriptPane.classList.remove("dragover");
  openFile(event.dataTransfer.files[0]);
});

// ---------------------------------------------------------------- language

const langSelect = $("lang-select");
const langReport = $("lang-report");
const REPORT_URL = "https://github.com/brunopacheco1/snake-tutor/issues/new?template=translation.yml&labels=translation&title=";

const languageLabel = (meta) => (i18n.isBeta(meta.code) ? t("lang.beta", { language: meta.name }) : meta.name);

function renderLanguage() {
  const pref = i18n.preference();
  const systemMeta = i18n.LOCALES.find((meta) => meta.code === i18n.systemLocale());
  // "Automatic" names the language it gives on this system (FR-002).
  const auto = new Option(t("lang.auto", { language: systemMeta.name }), "auto", false, pref === "auto");
  langSelect.replaceChildren(
    auto,
    ...i18n.LOCALES.map((meta) => {
      const option = new Option(languageLabel(meta), meta.code, false, meta.code === pref);
      // Each name is read in its own language, e.g. "Deutsch" as German on a French page (FR-018).
      option.lang = meta.code;
      return option;
    }),
  );
  // Only the locale code goes into the link: never the script or anything else (FR-015).
  langReport.hidden = !i18n.isBeta();
  langReport.href = REPORT_URL + encodeURIComponent(`[${i18n.locale()}] `);
}

langSelect.addEventListener("change", () => i18n.setPreference(langSelect.value));

// Redraws every piece of tool text in place. It must never touch the script, the
// console history or the Python session (FR-003, FR-012).
i18n.onChange(() => {
  i18n.applyTranslations(document);
  // render() would reset the status line (e.g. replace an error with "Ready"); keep the current one.
  const view = statusView;
  render();
  setStatus(view);
  // Same values in new words: don't replay the "changed" flash (until the next real pause).
  $("variables").classList.add("no-flash");
  if (pause) variables.select(pause, selectedFrame);
  else variables.reset();
  document.title = t("title.file", { file: fileName });
  renderLanguage();
  // Tell screen readers once, in the new language; focus stays on the selector (FR-018).
  const activeMeta = i18n.LOCALES.find((meta) => meta.code === i18n.locale());
  $("lang-announce").textContent = t("lang.changed", { language: activeMeta.name });
});

// ---------------------------------------------------------------- splitters

function splitter(handle, onMove, onKey) {
  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    handle.classList.add("dragging");
    const move = (e) => onMove(e);
    const up = () => {
      handle.classList.remove("dragging");
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      editor.refresh();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
  handle.addEventListener("keydown", onKey);
}

const layout = $("layout");
const side = $("side");
const consolePanel = document.querySelector(".console-panel");
const variablesPanel = document.querySelector(".variables-panel");

function setLeft(percent) {
  layout.style.setProperty("--left", `${Math.min(80, Math.max(20, percent))}%`);
  editor.refresh();
}
function setConsoleHeight(px) {
  const max = variablesPanel.getBoundingClientRect().bottom - consolePanel.getBoundingClientRect().top - 90;
  side.style.setProperty("--console", `${Math.min(max, Math.max(90, px))}px`);
}

splitter(
  $("split-v"),
  (e) => {
    const box = layout.getBoundingClientRect();
    setLeft(((e.clientX - box.left) / box.width) * 100);
  },
  (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const box = layout.getBoundingClientRect();
    const left = document.querySelector(".script-pane").getBoundingClientRect().width;
    setLeft(((left + (e.key === "ArrowLeft" ? -20 : 20)) / box.width) * 100);
  },
);
splitter(
  $("split-h"),
  (e) => setConsoleHeight(e.clientY - consolePanel.getBoundingClientRect().top),
  (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    setConsoleHeight(consolePanel.getBoundingClientRect().height + (e.key === "ArrowUp" ? -20 : 20));
  },
);

// ---------------------------------------------------------------- boot

function showBlocker() {
  $("blocker-text").dataset.i18n = location.protocol === "file:" ? "blocker.fromDiskHtml" : "blocker.isolation";
  i18n.applyTranslations($("blocker"));
  $("blocker").hidden = false;
}

i18n.applyTranslations(document);
renderLanguage();
restore();
variables.reset();
render();

if (window.crossOriginIsolated) {
  setStatus(() => t("status.loadingPython"));
  runner = new Runner(onMessage);
} else {
  // coi-serviceworker reloads the page once it is installed; only complain if that never happens.
  setStatus(() => t("status.preparing"));
  setTimeout(showBlocker, location.protocol === "file:" ? 0 : 4000);
}
