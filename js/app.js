// SPDX-License-Identifier: Apache-2.0
// Wires the panes together and runs the debug-session state machine
// (see specs/001-browser-debugger/data-model.md).
import { Cmd, Runner } from "./runner.js";
import { createEditor } from "./editor.js";
import { createConsole } from "./console.js";
import { createVariables } from "./variables.js";

const STORAGE_KEY = "snake-tutor:v1";
const MAX_FILE_BYTES = 1024 * 1024;
const SAMPLE = `# Welcome to Snake Tutor!
# Press "Start" (F5), then "Step Over" (F10) to run one line at a time.
# Watch the highlighted line and the Memory panel as you go.

def greet(name):
    message = "Hello, " + name + "!"
    return message

name = input("What is your name? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("The total is", total)
`;

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

function setStatus(html) {
  $("status").innerHTML = html;
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
  $("continue-label").textContent = state === "paused" ? "Continue" : "Start";
  buttons.continue.title = state === "paused" ? "Continue (F5) — run to the next breakpoint" : "Start (F5)";
  editor.setReadOnly(active());

  if (state === "running") editor.setCurrentLine(null);
  if (state === "loading") return;
  if (state === "idle") {
    setStatus(`Ready — press <strong>Start</strong> (F5) to debug. <span class="muted-inline">Python ${pythonVersion}</span>`);
  } else if (state === "running") {
    setStatus("<strong>Running…</strong> press Stop (Shift+F5) to end the program.");
  } else if (state === "paused") {
    setStatus(`<strong>Paused before line ${pause.line}.</strong> Step Over (F10) runs it.`);
  } else if (state === "input") {
    setStatus("<strong>Waiting for input</strong> — type in the Console and press Enter.");
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
    terminal.system("Program stopped.");
    editor.clearMarks();
    variables.reset();
    setStatus("Restarting Python…");
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
      setStatus(message.text);
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
      terminal.system(`Could not start Python: ${message.text}. Check your internet connection and reload the page.`);
      setStatus("<strong>Python failed to load.</strong> Reload the page to try again.");
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
    terminal.system("Program finished.");
  } else if (message.status === "stopped") {
    terminal.system("Program stopped.");
  } else {
    const line = message.error && message.error.line;
    const where = line ? ` on line ${line}` : "";
    editor.setErrorLine(line);
    terminal.system(
      /^(Syntax|Indentation|Tab)Error$/.test(message.error.type)
        ? `Python could not understand the code${where}, so the program did not start (see the red message above).`
        : `The program stopped because of an error${where} (see the red message above).`,
    );
  }
  setState("idle");
  if (message.status === "error") {
    const { type, line } = message.error;
    setStatus(`<strong>${type}</strong>${line ? ` on line ${line}` : ""}. Fix it and press Start (F5) again.`);
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
  document.title = `${fileName} — Snake Tutor`;
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
  loadScript("main.py", SAMPLE);
}

async function openFile(file) {
  if (!file) return;
  if (active()) {
    terminal.system("Stop the program before opening another file.");
    return;
  }
  if (!/\.py$/i.test(file.name) && file.type && !file.type.startsWith("text/")) {
    terminal.system(`"${file.name}" is not a Python (.py) file.`);
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    terminal.system(`"${file.name}" is larger than 1 MB — please choose a smaller script.`);
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
  if (editor.getValue() !== SAMPLE && !confirm("Replace your script with the example?")) return;
  loadScript("main.py", SAMPLE);
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
  const fromDisk = location.protocol === "file:";
  $("blocker-text").innerHTML = fromDisk
    ? "The page was opened directly from your disk. Serve the folder instead, for example with " +
      "<code>python3 -m http.server</code>, then open <code>http://localhost:8000</code>."
    : "Snake Tutor runs Python inside your browser and needs a feature called cross-origin isolation, " +
      "which a small helper (a service worker) switches on the first time the page loads. It did not " +
      "turn on here. Try reloading, and avoid private / incognito windows, which block the helper.";
  $("blocker").hidden = false;
}

restore();
variables.reset();
render();

if (window.crossOriginIsolated) {
  setStatus("Loading Python…");
  runner = new Runner(onMessage);
} else {
  // coi-serviceworker reloads the page once it is installed; only complain if that never happens.
  setStatus("Preparing…");
  setTimeout(showBlocker, location.protocol === "file:" ? 0 : 4000);
}
