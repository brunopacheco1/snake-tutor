# Implementation Plan: Browser Step Debugger for Python Newcomers

**Branch**: `001-browser-debugger` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-browser-debugger/spec.md`

## Summary

A static single-page app (GitHub Pages) with a script editor on the left and, on the right, debug
controls, an interactive console and a variables/call-stack panel. Real CPython runs in the browser
via **Pyodide** inside a **Web Worker**. A small Python module built on the standard library `bdb`
debugger traces the script and pauses on each step by **blocking the worker** with
`Atomics.wait` on a `SharedArrayBuffer`; the page wakes it with step/continue/input/stop commands.
`SharedArrayBuffer` requires cross-origin isolation headers that GitHub Pages cannot set, so a
vendored **coi-serviceworker** adds them client-side (see [research.md](./research.md) R2).

## Technical Context

**Language/Version**: JavaScript (ES2022 modules) in the browser; Python 3.14 (Pyodide 314.0.7) for
the debugger core

**Primary Dependencies**: Pyodide 314.0.7 (jsDelivr CDN), CodeMirror 5.65.21 (cdnjs), coi-serviceworker
0.1.7 (vendored, MIT)

**Storage**: `localStorage` for last script, file name and breakpoints

**Testing**: `node --test` running the debugger core inside Pyodide (npm `pyodide` package); manual +
browser-automation checks of the UI per [quickstart.md](./quickstart.md)

**Target Platform**: Desktop Chrome, Edge, Firefox, Safari (current versions); GitHub Pages hosting

**Project Type**: Static web application (no backend)

**Performance Goals**: step round-trip < 200 ms for 500-line scripts; ready < 5 s on repeat visits

**Constraints**: static hosting only; no server-set headers; learner code never leaves the browser

**Scale/Scope**: one script per session; ~10 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Newcomer-First Simplicity | 4 panels only; VS Code button names and shortcuts; plain-language errors | PASS |
| II. Static-Only Delivery | Pure static files; COOP/COEP provided by service worker; CDN assets pinned | PASS |
| III. Faithful Python Semantics | Real CPython (Pyodide) + stdlib `bdb` tracing; no simulated evaluation | PASS |
| IV. Private by Default | Code runs in worker; only CDN fetches are runtime/library files; no analytics | PASS |
| V. Test-Backed Debugger Core | `node --test` suite runs core against Pyodide in CI | PASS |

Post-design re-check: PASS (no violations; Complexity Tracking empty).

## Project Structure

### Documentation (this feature)

```text
specs/001-browser-debugger/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── worker-protocol.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html                 # layout: script pane | controls / console / variables
coi-serviceworker.js       # vendored; adds COOP/COEP so SharedArrayBuffer works on GitHub Pages
.nojekyll
css/app.css
js/
├── app.js                 # UI state machine, wiring, keyboard shortcuts, persistence
├── editor.js              # CodeMirror wrapper: current-line highlight, breakpoints, error marks
├── console.js             # console pane with inline input
├── variables.js           # call stack + variables tree with change highlighting
├── runner.js              # main-thread side of the worker protocol (SharedArrayBuffer channel)
└── worker.js              # loads Pyodide, bridges tutor_host <-> channel
py/
└── tutor_debugger.py      # bdb-based stepping engine + input() hook + snapshots
tests/
└── debugger.test.mjs      # node:test suite against Pyodide
package.json               # dev-only: pyodide for tests
.github/workflows/
├── test.yml
└── pages.yml
```

**Structure Decision**: single static project at repo root so GitHub Pages can serve it directly; the
Python core is a separate `.py` file so it is testable outside the browser.

## Complexity Tracking

No violations.
