// SPDX-License-Identifier: Apache-2.0
// Every locale's example program must be the same program as the English one,
// and must run to completion in the real debugger (spec FR-011).
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadPyodide } from "pyodide";

const CONTINUE = 1;
const INPUT = 6;
const STOP = 5;
const CODES = ["en", "fr", "de", "it", "pt-PT", "pt-BR", "lb"];
const catalogs = Object.fromEntries(
  await Promise.all(CODES.map(async (code) => [code, await import(`../js/locales/${code}.js`)])),
);

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
    wait: () => {
      const [code, payload = ""] = queue.shift() ?? [STOP];
      return `${code}\n${payload}`;
    },
  });
  py.FS.mkdirTree("/tutor");
  py.FS.writeFile("/tutor/tutor_debugger.py", await readFile(new URL("../py/tutor_debugger.py", import.meta.url), "utf8"));
  py.runPython("import sys; sys.path.insert(0, '/tutor')");
});

function run(source) {
  events = [];
  queue = [[CONTINUE], [INPUT, "Ada"]];
  output = "";
  const runner = py.pyimport("tutor_debugger").run;
  const bps = py.toPy([]);
  runner(source, bps, "main.py");
  bps.destroy();
  runner.destroy();
  return { done: events.at(-1), output };
}

// Comments removed and string literals emptied: what is left is the program's structure.
const skeleton = (source) =>
  source
    .split("\n")
    .map((line) => line.replace(/"[^"]*"/g, '""').replace(/#.*$/, "").trimEnd());

const english = catalogs.en.sample;

for (const code of CODES) {
  test(`${code} example is the English program with translated text, and runs`, () => {
    const { sample } = catalogs[code];
    assert.equal(typeof sample, "string", `${code} must export a sample`);
    assert.equal(sample.split("\n").length, english.split("\n").length);
    assert.deepEqual(skeleton(sample), skeleton(english));
    if (code !== "en") assert.notEqual(sample, english, `${code} sample must be translated`);

    const { done, output: printed } = run(sample);
    assert.deepEqual(done, { type: "done", status: "ok" }, printed);
    assert.match(printed, /Ada/);
    const lines = printed.split("\n").filter((line) => line.trim());
    assert.match(lines.at(-1), /14$/);
  });
}
