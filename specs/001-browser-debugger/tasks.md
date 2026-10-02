# Tasks: Browser Step Debugger for Python Newcomers

**Input**: Design documents from `/specs/001-browser-debugger/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/worker-protocol.md

**Tests**: Required for the debugger core by Constitution Principle V.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Create static layout skeleton, `.nojekyll`, `package.json` (dev dep `pyodide@314.0.7`, `npm test`) and `.gitignore`
- [X] T002 [P] Vendor `coi-serviceworker.js` (0.1.7, MIT) at repo root and load it first in `index.html`

## Phase 2: Foundational (blocks all stories)

- [X] T003 Implement shared-memory channel + worker bootstrap (Pyodide load, `tutor_host` bridge, stdout/stderr, interrupt buffer) in `js/worker.js`
- [X] T004 Implement main-thread client (`init`, `start`, `send(cmd, payload)`, `stop()`, events) in `js/runner.js`
- [X] T005 Implement `run(source, breakpoints)` skeleton in `py/tutor_debugger.py` (write `/home/pyodide/main.py`, compile, run under `bdb`, report `done`)
- [X] T006 [P] Write test harness with fake `tutor_host` in `tests/debugger.test.mjs`
- [X] T007 Build the two-pane layout with three right panels and resizable splitter in `index.html` + `css/app.css`
- [X] T008 Cross-origin isolation check and plain-language failure message in `js/app.js`

## Phase 3: User Story 1 — Step line by line (P1) 🎯 MVP

**Independent test**: step through a 5-line script; highlight and variables update each step.

- [X] T009 [P] [US1] Tests: first pause is line 1; Step Over visits each line; variable snapshot values in `tests/debugger.test.mjs`
- [X] T010 [US1] Pause on line events, frame + variable snapshots (`Var` per data-model) in `py/tutor_debugger.py`
- [X] T011 [P] [US1] CodeMirror wrapper: python mode, line numbers, current-line highlight + scroll in `js/editor.js`
- [X] T012 [P] [US1] Variables panel rendering with change highlighting in `js/variables.js`
- [X] T013 [US1] Controls + state machine (Start, Step Over, Stop) and status text in `js/app.js`

## Phase 4: User Story 2 — Console output and input (P1)

**Independent test**: `input()` prompt answered in console; greeting printed; errors shown in red.

- [X] T014 [P] [US2] Tests: `input()` receives text; uncaught exception and syntax error reported with line in `tests/debugger.test.mjs`
- [X] T015 [US2] `input()` hook, stdout flushing, exception/syntax-error reporting in `py/tutor_debugger.py`
- [X] T016 [P] [US2] Console pane with inline input field and Enter-to-submit in `js/console.js`
- [X] T017 [US2] Wire `input` state + error-line marking in `js/app.js` / `js/editor.js`

## Phase 5: User Story 3 — Functions and call stack (P2)

**Independent test**: Step Into shows 2 frames; Step Out returns with return value.

- [X] T018 [P] [US3] Tests: step into/out, return value, recursion frames, stdlib frames skipped in `tests/debugger.test.mjs`
- [X] T019 [US3] Step Into / Step Out / Continue, return capture, skip non-script frames in `py/tutor_debugger.py`
- [X] T020 [US3] Call stack list with frame selection in `js/variables.js`; selected-frame line marker in `js/editor.js`
- [X] T021 [US3] Remaining buttons (Continue, Step Into, Step Out, Restart) + VS Code shortcuts in `js/app.js`

## Phase 6: User Story 4 — Breakpoints and editing (P2)

**Independent test**: breakpoint in loop pauses each iteration; infinite loop stoppable.

- [X] T022 [P] [US4] Tests: breakpoints with Continue; BREAKPOINTS command while paused; STOP command in `tests/debugger.test.mjs`
- [X] T023 [US4] Breakpoint support + STOP handling in `py/tutor_debugger.py`
- [X] T024 [US4] Gutter breakpoint toggling, read-only while running in `js/editor.js`; live breakpoint sync in `js/app.js`
- [X] T025 [US4] Interrupt-buffer stop for free-running code in `js/runner.js`

## Phase 7: User Story 5 — Zero-setup public link (P3)

- [X] T026 [US5] Sample script on first visit, localStorage persistence, open file / drag-drop / download in `js/app.js`
- [X] T027 [P] [US5] GitHub Pages deploy workflow in `.github/workflows/pages.yml`
- [X] T028 [P] [US5] CI test workflow in `.github/workflows/test.yml`

## Phase 8: Polish

- [X] T029 [P] README with usage, local run and deployment steps in `README.md`
- [X] T030 Run quickstart.md validation in a real browser

## Dependencies

Setup → Foundational → US1 → US2 → (US3, US4 in either order) → US5 → Polish.
US1 + US2 together form the MVP (both P1).

## Parallel examples

- US1: T009, T011, T012 in parallel, then T010 → T013.
- US5: T027 and T028 in parallel.

## Implementation Strategy

MVP = Phases 1–4; validate in browser; then add US3/US4; ship with US5.
