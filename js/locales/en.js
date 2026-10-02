// SPDX-License-Identifier: Apache-2.0
// English catalog: the reference for every other locale (see
// specs/002-multi-language-ui/contracts/locale-catalog.md).
export const meta = { code: "en", name: "English", reviewed: true };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Step through a Python script line by line, right in your browser.",
  "pane.script": "Script",
  "file.open": "Open…",
  "file.openTitle": "Open a .py file from your computer",
  "file.download": "Download",
  "file.downloadTitle": "Save this script as a .py file",
  "file.example": "Example",
  "file.exampleTitle": "Replace the script with the example",
  "file.dropHint": "Drop your .py file here",
  "file.confirmReplace": "Replace your script with the example?",
  "file.stopFirst": "Stop the program before opening another file.",
  "file.notPython": "\"{file}\" is not a Python (.py) file.",
  "file.tooLarge": "\"{file}\" is larger than 1 MB — please choose a smaller script.",
  "layout.resize": "Drag to resize",

  "lang.label": "Language",
  "lang.auto": "Automatic ({language})",
  "lang.beta": "{language} (beta)",
  "lang.report": "Report a translation problem",
  "lang.reportTitle": "Opens GitHub in a new tab — you need a GitHub account to report",

  "controls.label": "Debug controls",
  "controls.start": "Start",
  "controls.startTitle": "Start (F5) — run the program from the top",
  "controls.continue": "Continue",
  "controls.continueTitle": "Continue (F5) — run to the next breakpoint",
  "controls.stepOver": "Step Over",
  "controls.stepOverTitle": "Step Over (F10) — run this line",
  "controls.stepInto": "Step Into",
  "controls.stepIntoTitle": "Step Into (F11) — go inside the function",
  "controls.stepOut": "Step Out",
  "controls.stepOutTitle": "Step Out (Shift+F11) — finish this function",
  "controls.restart": "Restart",
  "controls.restartTitle": "Restart (Ctrl/Cmd+Shift+F5) — stop and run again from the top",
  "controls.stop": "Stop",
  "controls.stopTitle": "Stop (Shift+F5) — end the program now",

  "status.loading": "Loading…",
  "status.preparing": "Preparing…",
  "status.loadingPython": "Loading Python…",
  "status.downloading": "Downloading Python…",
  "status.startingDebugger": "Starting debugger…",
  "status.restarting": "Restarting Python…",
  "status.readyHtml": "Ready — press <strong>{start}</strong> (F5) to debug.",
  "status.runningHtml": "<strong>Running…</strong> press {stop} (Shift+F5) to end the program.",
  "status.pausedHtml": "<strong>Paused before line {line}.</strong> {stepOver} (F10) runs it.",
  "status.inputHtml": "<strong>Waiting for input</strong> — type in the Console and press Enter.",
  "status.errorHtml": "<strong>{type}</strong>. Fix it and press {start} (F5) again.",
  "status.errorAtLineHtml": "<strong>{type}</strong> on line {line}. Fix it and press {start} (F5) again.",
  "status.pythonFailedHtml": "<strong>Python failed to load.</strong> Reload the page to try again.",
  "status.pythonVersion": "Python {version}",

  "console.title": "Console",
  "console.outputLabel": "Console output",
  "console.inputLabel": "Type your answer and press Enter",
  "console.finished": "Program finished.",
  "console.stopped": "Program stopped.",
  "console.syntaxError":
    "Python could not understand the code, so the program did not start (see the red message above).",
  "console.syntaxErrorAtLine":
    "Python could not understand the code on line {line}, so the program did not start (see the red message above).",
  "console.runtimeError": "The program stopped because of an error (see the red message above).",
  "console.runtimeErrorAtLine": "The program stopped because of an error on line {line} (see the red message above).",
  "console.fatal": "Could not start Python: {error}. Check your internet connection and reload the page.",

  "vars.title": "Memory",
  "vars.hint": "Variables appear here while the program is paused.",
  "vars.returned": "↩ {function}() returned {value}",
  "vars.callStack": "Call stack",
  "vars.mainProgram": "main program",
  "vars.line": "line {line}",
  "vars.variables": "Variables",
  "vars.locals": "Local variables — {function}()",
  "vars.globals": "Global variables",
  "vars.noneYet": "No variables yet.",
  "vars.none": "None.",
  "vars.more": { one: "… {count} more", other: "… {count} more" },
  "editor.breakpointTitle": "Breakpoint (click to remove)",

  "blocker.title": "Snake Tutor can't start in this browser window",
  "blocker.fromDiskHtml":
    "The page was opened directly from your disk. Serve the folder instead, for example with " +
    "<code>python3 -m http.server</code>, then open <code>http://localhost:8000</code>.",
  "blocker.isolation":
    "Snake Tutor runs Python inside your browser and needs a feature called cross-origin isolation, " +
    "which a small helper (a service worker) switches on the first time the page loads. It did not " +
    "turn on here. Try reloading, and avoid private / incognito windows, which block the helper.",
  "blocker.reload": "Reload",
};

export const sample = `# Welcome to Snake Tutor!
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
