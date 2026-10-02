// SPDX-License-Identifier: Apache-2.0
// Runs py/tutor_debugger.py inside Pyodide with a scripted fake `tutor_host`.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadPyodide } from "pyodide";

const [CONTINUE, STEP_OVER, STEP_INTO, STEP_OUT, STOP, INPUT, BREAKPOINTS] = [1, 2, 3, 4, 5, 6, 7];

let py;
let events;
let queue;
let output;

before(async () => {
  py = await loadPyodide();
  const decoder = new TextDecoder();
  const write = (buf) => { output += decoder.decode(buf); return buf.length; };
  py.setStdout({ write });
  py.setStderr({ write });
  py.registerJsModule("tutor_host", {
    emit: (json) => events.push(JSON.parse(json)),
    // When the script runs out of commands, stop so a buggy test cannot hang.
    wait: () => {
      const [code, payload = ""] = queue.shift() ?? [STOP];
      return `${code}\n${payload}`;
    },
  });
  py.FS.mkdirTree("/tutor");
  py.FS.writeFile("/tutor/tutor_debugger.py", await readFile(new URL("../py/tutor_debugger.py", import.meta.url), "utf8"));
  py.runPython("import sys; sys.path.insert(0, '/tutor')");
});

function session(source, commands = [], { breakpoints = [], name = "main.py" } = {}) {
  events = [];
  queue = commands.map((c) => (Array.isArray(c) ? c : [c]));
  output = "";
  const run = py.pyimport("tutor_debugger").run;
  const bps = py.toPy(breakpoints);
  run(source.replace(/^\n/, ""), bps, name);
  bps.destroy();
  run.destroy();
  const paused = events.filter((e) => e.type === "paused");
  return { events, output, paused, lines: paused.map((e) => e.line), done: events.at(-1) };
}

const vars = (pause, frame = 0) =>
  Object.fromEntries(pause.frames[frame].locals.map((v) => [v.name, v.value]));

// ---------------------------------------------------------------- US1

test("pauses on the first line and steps over line by line", () => {
  const src = `
x = 1
y = x + 1
x = y * 10
`;
  const s = session(src, [STEP_OVER, STEP_OVER, STEP_OVER]);
  assert.deepEqual(s.lines, [1, 2, 3]);
  assert.deepEqual(vars(s.paused[0]), {});
  assert.deepEqual(vars(s.paused[2]), { x: "1", y: "2" });
  assert.deepEqual(s.done, { type: "done", status: "ok" });
});

test("snapshots show types and expandable containers", () => {
  const src = `
data = {"a": [1, 2], "b": "hi"}
pass
`;
  const s = session(src, [STEP_OVER, STEP_OVER]);
  const data = s.paused[1].frames[0].locals.find((v) => v.name === "data");
  assert.equal(data.type, "dict");
  assert.deepEqual(data.children.map((c) => c.name), ["['a']", "['b']"]);
  assert.deepEqual(data.children[0].children.map((c) => c.value), ["1", "2"]);
});

test("hides dunders and imported modules", () => {
  const s = session("import math\nr = math.pi\npass\n", [STEP_OVER, STEP_OVER, STEP_OVER]);
  assert.deepEqual(Object.keys(vars(s.paused[2])), ["r"]);
});

// ---------------------------------------------------------------- US2

test("print output and input() go through the console", () => {
  const src = `
name = input("Name? ")
print("Hi", name)
`;
  const s = session(src, [CONTINUE, [INPUT, "Ada"]]);
  assert.equal(s.output, "Name? Hi Ada\n");
  assert.deepEqual(s.events.find((e) => e.type === "input"), { type: "input", prompt: "Name? " });
  assert.equal(s.done.status, "ok");
});

test("uncaught exception reports type, message, line and a traceback", () => {
  const src = `
def boom():
    return 1 / 0
boom()
`;
  const s = session(src, [CONTINUE]);
  assert.equal(s.done.status, "error");
  assert.deepEqual(s.done.error, { type: "ZeroDivisionError", message: "division by zero", line: 2 });
  assert.match(s.output, /File "main.py", line 3, in <module>/);
  assert.match(s.output, /ZeroDivisionError: division by zero/);
  assert.doesNotMatch(s.output, /bdb|tutor_debugger/);
});

test("syntax errors are reported without starting a session", () => {
  const s = session("x = 1\nif x\n    pass\n", [], { name: "hello.py" });
  assert.equal(s.paused.length, 0);
  assert.equal(s.done.status, "error");
  assert.equal(s.done.error.type, "SyntaxError");
  assert.equal(s.done.error.line, 2);
  assert.match(s.output, /File "hello.py", line 2/);
});

// ---------------------------------------------------------------- US3

const FUNC = `
def add(a, b):
    total = a + b
    return total
result = add(2, 3)
print(result)
`;

test("step into a function shows its frame on top of the module", () => {
  const s = session(FUNC, [STEP_OVER, STEP_INTO, STEP_OVER]);
  assert.deepEqual(s.lines, [1, 4, 2, 3]);
  const inside = s.paused[2];
  assert.deepEqual(inside.frames.map((f) => [f.name, f.line]), [["add", 2], ["<module>", 4]]);
  assert.deepEqual(vars(inside), { a: "2", b: "3" });
});

test("step out returns to the caller and reports the return value", () => {
  const s = session(FUNC, [STEP_OVER, STEP_INTO, STEP_OUT, STEP_OVER]);
  assert.deepEqual(s.lines, [1, 4, 2, 5]);
  assert.deepEqual(s.paused[3].returned, { name: "add", value: "5" });
  assert.equal(vars(s.paused[3]).result, "5");
});

test("step over a call does not enter it", () => {
  const s = session(FUNC, [STEP_OVER, STEP_OVER, STEP_OVER]);
  assert.deepEqual(s.lines, [1, 4, 5]);
});

test("recursion shows one frame per call", () => {
  const src = `
def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)
fact(3)
`;
  const s = session(src, [CONTINUE], { breakpoints: [3] });
  const deepest = s.paused.at(-1);
  assert.deepEqual(deepest.frames.map((f) => f.name), ["fact", "fact", "fact", "<module>"]);
});

test("stepping into library code never shows library frames", () => {
  const src = `
import json
text = json.dumps([1])
pass
`;
  const s = session(src, [STEP_INTO, STEP_INTO, STEP_INTO, STEP_INTO]);
  assert.deepEqual(s.lines, [1, 2, 3]);
});

// ---------------------------------------------------------------- US4

test("continue stops at each breakpoint hit", () => {
  const src = `
total = 0
for i in range(3):
    total += i
print(total)
`;
  const s = session(src, [CONTINUE, CONTINUE, CONTINUE, CONTINUE], { breakpoints: [3] });
  assert.deepEqual(s.lines, [1, 3, 3, 3]);
  assert.deepEqual(s.paused.slice(1).map((p) => vars(p).i), ["0", "1", "2"]);
  assert.equal(s.output, "3\n");
});

test("breakpoints can change while paused", () => {
  const src = "a = 1\nb = 2\nc = 3\n";
  const s = session(src, [[BREAKPOINTS, "[3]"], CONTINUE, CONTINUE]);
  assert.deepEqual(s.lines, [1, 3]);
});

test("stop while paused ends the session as stopped", () => {
  const s = session("x = 1\ny = 2\n", [STEP_OVER, STOP]);
  assert.deepEqual(s.lines, [1, 2]);
  assert.deepEqual(s.done, { type: "done", status: "stopped" });
});

test("stop while waiting for input ends the session", () => {
  const s = session('input("? ")\nprint("never")\n', [CONTINUE, STOP]);
  assert.equal(s.done.status, "stopped");
  assert.doesNotMatch(s.output, /never/);
});

test("builtins.input is restored after a session", () => {
  session("x = 1\n", [CONTINUE]);
  assert.equal(py.runPython("import builtins; builtins.input.__module__"), "builtins");
});
