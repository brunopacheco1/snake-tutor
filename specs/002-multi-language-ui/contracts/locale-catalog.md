# Contract: Locale catalog (`js/locales/<code>.js`)

```js
// SPDX-License-Identifier: Apache-2.0
export const meta = { code: "fr", name: "Français", reviewed: false };
export const messages = { "controls.stepOver": "Pas à pas principal", /* … */ };
export const sample = `# Bienvenue dans Snake Tutor !\n…`;
```

## Rules

1. Keys are identical across all catalogs (the English catalog is the reference).
2. `{param}` placeholders listed below MUST appear in every translation. Their order may change.
3. Only keys ending in `Html` may contain markup, and only `<strong>…</strong>` or
   `<code>…</code>`.
4. Keyboard shortcuts (`F5`, `F10`, `F11`, `Shift+F11`, `Shift+F5`, `Ctrl/Cmd+Shift+F5`,
   `Enter`) are written literally and are never translated (FR-005).
5. Every control tooltip is "‹VS Code name› (‹shortcut›) — ‹plain-language description›" (FR-005).
   Address the learner informally (FR-017): fr "tu", de "du", it "tu", pt-PT "tu", pt-BR "você", lb "du".
6. Python terms that come from Python itself (`print()`, `input()`, `.py`, exception names) stay
   as they are.
7. A new language is added by creating a catalog and listing it in `js/i18n.js` (FR-013).

## Keys

Source column = where the English string lives today.

### Page and script pane (`index.html`, `js/app.js`)

| Key | English | Params |
|-----|---------|--------|
| `title.app` | Snake Tutor | |
| `title.file` | {file} — Snake Tutor | file |
| `meta.description` | Step through a Python script line by line, right in your browser. | |
| `pane.script` | Script | |
| `file.open` | Open… | |
| `file.openTitle` | Open a .py file from your computer | |
| `file.download` | Download | |
| `file.downloadTitle` | Save this script as a .py file | |
| `file.example` | Example | |
| `file.exampleTitle` | Replace the script with the example | |
| `file.dropHint` | Drop your .py file here | |
| `file.confirmReplace` | Replace your script with the example? | |
| `file.stopFirst` | Stop the program before opening another file. | |
| `file.notPython` | "{file}" is not a Python (.py) file. | file |
| `file.tooLarge` | "{file}" is larger than 1 MB — please choose a smaller script. | file |
| `layout.resize` | Drag to resize | |

### Language selector (new)

| Key | English | Params |
|-----|---------|--------|
| `lang.label` | Language | |
| `lang.auto` | Automatic ({language}) | language |
| `lang.beta` | {language} (beta) | language |
| `lang.report` | Report a translation problem | |
| `lang.reportTitle` | Opens GitHub in a new tab — you need a GitHub account to report | |
| `lang.changed` | Language: {language} | language |

### Debug controls (`index.html`, `js/app.js` `render`)

| Key | English | Params |
|-----|---------|--------|
| `controls.label` | Debug controls | |
| `controls.start` | Start | |
| `controls.startTitle` | Start (F5) — run the program from the top | |
| `controls.continue` | Continue | |
| `controls.continueTitle` | Continue (F5) — run to the next breakpoint | |
| `controls.stepOver` | Step Over | |
| `controls.stepOverTitle` | Step Over (F10) — run this line | |
| `controls.stepInto` | Step Into | |
| `controls.stepIntoTitle` | Step Into (F11) — go inside the function | |
| `controls.stepOut` | Step Out | |
| `controls.stepOutTitle` | Step Out (Shift+F11) — finish this function | |
| `controls.restart` | Restart | |
| `controls.restartTitle` | Restart (Ctrl/Cmd+Shift+F5) — stop and run again from the top | |
| `controls.stop` | Stop | |
| `controls.stopTitle` | Stop (Shift+F5) — end the program now | |

### Status line (`js/app.js`, `js/worker.js`)

| Key | English | Params |
|-----|---------|--------|
| `status.loading` | Loading… | |
| `status.preparing` | Preparing… | |
| `status.loadingPython` | Loading Python… | |
| `status.downloading` | Downloading Python… | |
| `status.startingDebugger` | Starting debugger… | |
| `status.restarting` | Restarting Python… | |
| `status.readyHtml` | Ready — press <strong>{start}</strong> (F5) to debug. | start |
| `status.runningHtml` | <strong>Running…</strong> press {stop} (Shift+F5) to end the program. | stop |
| `status.pausedHtml` | <strong>Paused before line {line}.</strong> {stepOver} (F10) runs it. | line, stepOver |
| `status.inputHtml` | <strong>Waiting for input</strong> — type in the Console and press Enter. | |
| `status.errorHtml` | <strong>{type}</strong>. Fix it and press {start} (F5) again. | type, start |
| `status.errorAtLineHtml` | <strong>{type}</strong> on line {line}. Fix it and press {start} (F5) again. | type, line, start |
| `status.pythonFailedHtml` | <strong>Python failed to load.</strong> Reload the page to try again. | |
| `status.pythonVersion` | Python {version} | version |

Control names inside status messages are passed in as params (`t("controls.start")`), so they
always match the buttons.

### Console (`js/app.js`, `js/console.js`)

| Key | English | Params |
|-----|---------|--------|
| `console.title` | Console | |
| `console.outputLabel` | Console output | |
| `console.inputLabel` | Type your answer and press Enter | |
| `console.finished` | Program finished. | |
| `console.stopped` | Program stopped. | |
| `console.syntaxError` | Python could not understand the code, so the program did not start (see the red message above). | |
| `console.syntaxErrorAtLine` | Python could not understand the code on line {line}, so the program did not start (see the red message above). | line |
| `console.runtimeError` | The program stopped because of an error (see the red message above). | |
| `console.runtimeErrorAtLine` | The program stopped because of an error on line {line} (see the red message above). | line |
| `console.fatal` | Could not start Python: {error}. Check your internet connection and reload the page. | error |

### Memory panel (`js/variables.js`, `js/editor.js`)

| Key | English | Params |
|-----|---------|--------|
| `vars.title` | Memory | |
| `vars.hint` | Variables appear here while the program is paused. | |
| `vars.returned` | ↩ {function}() returned {value} | function, value |
| `vars.callStack` | Call stack | |
| `vars.mainProgram` | main program | |
| `vars.line` | line {line} | line |
| `vars.variables` | Variables | |
| `vars.locals` | Local variables — {function}() | function |
| `vars.globals` | Global variables | |
| `vars.noneYet` | No variables yet. | |
| `vars.none` | None. | |
| `vars.more` | `{ one: "… {count} more", other: "… {count} more" }` | count (plural) |
| `editor.breakpointTitle` | Breakpoint (click to remove) | |

### Startup blocker (`index.html`, `js/app.js` `showBlocker`)

| Key | English | Params |
|-----|---------|--------|
| `blocker.title` | Snake Tutor can't start in this browser window | |
| `blocker.fromDiskHtml` | This page was opened straight from a file, so Python cannot run. Open it through a web address instead: run <code>python3 -m http.server</code> in its folder, then open <code>http://localhost:8000</code>. | |
| `blocker.isolation` | Snake Tutor could not switch on a browser feature it needs to run Python. Reload the page, and avoid private or incognito windows. | |
| `blocker.reload` | Reload | |
