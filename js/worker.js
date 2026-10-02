// SPDX-License-Identifier: Apache-2.0
// Python worker (module worker): loads Pyodide and runs py/tutor_debugger.py.
// Protocol: specs/001-browser-debugger/contracts/worker-protocol.md
// A module worker is required: importScripts() of cross-origin scripts fails under
// the coi-serviceworker in some browsers, while CORS-mode import() works.
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

const INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const STOP = 5;

let pyodide;
let run;
let control;
let data;
let interrupt;
let doneSent = false;

const post = (message) => self.postMessage(message);

function emit(json) {
  const message = JSON.parse(json);
  if (message.type === "done") doneSent = true;
  post(message);
}

// Blocks this worker until the page writes a command into shared memory.
function wait() {
  Atomics.wait(control, 0, 0);
  const code = control[1];
  // TextDecoder refuses views on shared memory in some browsers, so copy first.
  const text = new TextDecoder().decode(data.slice(0, control[2]));
  Atomics.store(control, 0, 0);
  // Stop is handled by the command; make sure a pending interrupt does not also fire.
  if (code === STOP) interrupt[0] = 0;
  return `${code}\n${text}`;
}

function stream(type) {
  const decoder = new TextDecoder();
  return {
    write(buffer) {
      post({ type, text: decoder.decode(buffer, { stream: true }) });
      return buffer.length;
    },
  };
}

async function boot(message) {
  ({ control, data, interrupt } = message);
  post({ type: "status", text: "Downloading Python…" });
  pyodide = await loadPyodide({ indexURL: INDEX_URL });
  pyodide.setInterruptBuffer(interrupt);
  pyodide.setStdout(stream("stdout"));
  pyodide.setStderr(stream("stderr"));
  pyodide.registerJsModule("tutor_host", { emit, wait });

  post({ type: "status", text: "Starting debugger…" });
  const source = await (await fetch(new URL("../py/tutor_debugger.py", self.location.href))).text();
  pyodide.FS.mkdirTree("/tutor");
  pyodide.FS.writeFile("/tutor/tutor_debugger.py", source);
  pyodide.runPython("import sys; sys.path.insert(0, '/tutor')");
  run = pyodide.pyimport("tutor_debugger").run;
  post({ type: "ready", version: pyodide.runPython("import sys; sys.version.split()[0]") });
}

function start({ source, breakpoints, name }) {
  Atomics.store(control, 0, 0);
  interrupt[0] = 0;
  doneSent = false;
  const lines = pyodide.toPy(breakpoints);
  try {
    run(source, lines, name);
  } catch (error) {
    // Only reachable if an interrupt lands outside the learner's code.
    if (!doneSent) post({ type: "stderr", text: `${error.message}\n` });
  } finally {
    lines.destroy();
    interrupt[0] = 0;
    if (!doneSent) post({ type: "done", status: "stopped" });
  }
}

self.onmessage = async ({ data: message }) => {
  try {
    if (message.type === "init") await boot(message);
    else if (message.type === "start") start(message);
  } catch (error) {
    post({ type: "fatal", text: String(error && error.message ? error.message : error) });
  }
};
