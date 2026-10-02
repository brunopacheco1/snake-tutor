---

description: "Task list for the Multi-Language Interface feature"
---

# Tasks: Multi-Language Interface

**Input**: Design documents from `/specs/002-multi-language-ui/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Included. Constitution Principle V and research R13 require automated tests that run in
CI (`npm test` → `node --test tests/*.test.mjs`). Test tasks come before the implementation they
cover and must fail first.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested
on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: US1 / US2 / US3 from spec.md
- Paths are relative to the repository root (flat static layout: `index.html`, `css/`, `js/`, `py/`, `tests/`)

## Ground rules for every task

- Plain ES modules, no new dependencies, no build step (Constitution II, Technical Constraints).
- Every new source file starts with `// SPDX-License-Identifier: Apache-2.0` (or `/* … */` in CSS),
  like the existing files.
- Never translate Python-produced text (exception type/message, tracebacks, program output,
  variable values). Pass it as a `t()` parameter (FR-006).
- A language change must never call `loadScript`, `terminal.clear`, or any `runner` method, and
  must never write `localStorage["snake-tutor:v1"]` (FR-012).
- The key names, English texts and params are fixed by
  [contracts/locale-catalog.md](contracts/locale-catalog.md). The `js/i18n.js` API is fixed by
  [contracts/i18n-module.md](contracts/i18n-module.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the empty structure the later phases fill in.

- [X] T001 Create directory `js/locales/` and confirm `.github/workflows/pages.yml` already publishes it (its `cp -r … js …` step copies subfolders; no workflow change needed)
- [X] T002 [P] Create `tests/i18n.test.mjs` with the SPDX header, `import { test } from "node:test"`, `import assert from "node:assert/strict"`, and one placeholder `test("i18n module loads", async () => { await import("../js/i18n.js"); })` so `npm test` picks the file up

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Move every English string out of the code into an English catalog, served through
`js/i18n.js`. **There is no visible change**: the app must look and behave exactly as before.
Every user story builds on this.

**⚠️ CRITICAL**: No user-story work starts until this phase is complete and `npm test` passes.

### Tests for Foundational

- [X] T003 [P] In `tests/i18n.test.mjs`, add failing tests for `t()`: (a) `t("controls.stepOver")` returns `"Step Over"`; (b) `t("vars.line", {line: 7})` returns `"line 7"`; (c) `t("status.errorHtml", {type: "<b>X</b>", start: "Start"})` HTML-escapes the `type` param (contains `&lt;b&gt;`); (d) `t("vars.more", {count: 1})` and `{count: 5}` return `"… 1 more"` and `"… 5 more"`; (e) a key missing from the active catalog but present in `en` returns the English text (simulate by passing a test catalog through an exported test hook or by checking against `en` directly); (f) every key of `en.messages` whose name does not end in `Html` contains no `<`

### Implementation for Foundational

- [X] T004 Create `js/locales/en.js` exporting `meta = { code: "en", name: "English", reviewed: true }`, `messages` with **every key** listed in [contracts/locale-catalog.md](contracts/locale-catalog.md) and the exact English text from its tables (`vars.more` is `{ one: "… {count} more", other: "… {count} more" }`), and `sample` set to the current `SAMPLE` string copied verbatim from `js/app.js`
- [X] T005 Create `js/i18n.js` implementing, from [contracts/i18n-module.md](contracts/i18n-module.md): `LOCALES` (just `[en.meta]` for now), `locale()`, `preference()`, `setPreference(value)` (in memory only for now: accepts a known code, ignores anything else, notifies listeners only when the active locale changes), `onChange(listener) → unsubscribe`, `t(key, params)` (active catalog → `en` → `key`; `{name}` substitution; `PluralForms` resolved with `new Intl.PluralRules(locale()).select(params.count)` falling back to `other`; HTML-escape `& < > " '` in params only for keys ending in `Html`), `isBeta(code)`, `sample(code)` (falls back to `en.sample` when a catalog has none), `isAnySample(text)`, and `applyTranslations(root)` (handles `[data-i18n]` → `textContent`, or `innerHTML` for `*Html` keys; `[data-i18n-title]` → `title`; `[data-i18n-aria-label]` → `aria-label`; when `root` is a `Document`, also set `documentElement.lang` and the `<meta name="description">` content from `meta.description`). Do not touch `document`, `navigator` or `localStorage` at import time, because the module must load under Node.
- [X] T006 Tag all static text in `index.html` with i18n attributes using the keys from the contract: brand/`<title>` (`title.app`), `aria-label="Script"` (`pane.script`), Open…/title (`file.open`, `file.openTitle`; wrap the "Open…" text node in a `<span data-i18n="file.open">` so the hidden `<input>` survives), Download/Example and their titles, drop hint, both splitters' `title` (`layout.resize`), toolbar `aria-label` (`controls.label`), each button's title and its label text (wrap each label in `<span data-i18n="controls.stepOver">` etc.; keep `id="continue-label"` on the Start span), status `Loading…` (`status.loading`), panel titles Console/Memory (`console.title`, `vars.title`), console `aria-label` (`console.outputLabel`), blocker heading and Reload button (`blocker.title`, `blocker.reload`). Keep the English text in the HTML as the no-JS fallback.
- [X] T007 Refactor `js/app.js` to use `t()` for every user-visible string: `render()` (Start/Continue label and title via `controls.start|continue` and `controls.startTitle|continueTitle`; statuses `status.readyHtml` with `{start: t("controls.start")}` plus `<span class="muted-inline">` + `t("status.pythonVersion", {version})`, `status.runningHtml` with `{stop}`, `status.pausedHtml` with `{line, stepOver}`, `status.inputHtml`), `stop()` (`console.stopped`, `status.restarting`), `onMessage` (`fatal` → `console.fatal` with `{error: message.text}` and `status.pythonFailedHtml`; `status` → `setStatus(t(message.key))`), `finish()` (`console.finished`, `console.stopped`, `console.syntaxError[AtLine]` / `console.runtimeError[AtLine]` with `{line}`, `status.errorHtml` / `status.errorAtLineHtml` with `{type, line, start}`; `type` stays raw), `setFileName` (`title.file`), `openFile` (`file.stopFirst`, `file.notPython`, `file.tooLarge` with `{file}`), sample button (`file.confirmReplace`; compare with `i18n.isAnySample(editor.getValue())` and load `i18n.sample()`), `restore()` fallback (`i18n.sample()`), `showBlocker` (`blocker.fromDiskHtml` → `innerHTML`, `blocker.isolation` → `textContent`), boot statuses (`status.loadingPython`, `status.preparing`). Delete the `SAMPLE` constant. Call `applyTranslations(document)` first, before `restore()`.
- [X] T008 [P] Refactor `js/variables.js` to use `t()` from `./i18n.js`: `vars.hint`, `vars.returned` `{function, value}`, `vars.callStack` (build the `<h3>` with `textContent`, not `innerHTML`), `vars.mainProgram`, `vars.line` `{line}`, `vars.variables`, `vars.locals` `{function}`, `vars.globals`, `vars.noneYet`, `vars.none`, `vars.more` `{count: v.more}`
- [X] T009 [P] Refactor `js/console.js`: set the input field's attribute `data-i18n-aria-label="console.inputLabel"` and its `aria-label` to `t("console.inputLabel")`, so `applyTranslations(document)` can relabel a field that is already open
- [X] T010 [P] Refactor `js/editor.js`: the breakpoint marker title uses `t("editor.breakpointTitle")`
- [X] T011 [P] Change `js/worker.js` `boot()` to post `{ type: "status", key: "status.downloading" }` and `{ type: "status", key: "status.startingDebugger" }` instead of English `text` (per [contracts/worker-protocol-delta.md](contracts/worker-protocol-delta.md)); update the `status` row in `specs/001-browser-debugger/contracts/worker-protocol.md` to `key` with the two allowed values
- [X] T012 Run `npm test` (all of T003 now passes, existing debugger tests unchanged), then start the `snake-tutor` preview (`.claude/launch.json`, port 8765) and smoke-test: load page → Start → Step Over → `input()` → finish → `1/0` error → Stop. Confirm every text matches the pre-change English exactly and there are no console errors.

**Checkpoint**: All UI text flows through the catalog, and nothing visible has changed.

---

## Phase 3: User Story 1 - Use Snake Tutor in my own language (Priority: P1) 🎯 MVP

**Goal**: A learner picks one of the 7 languages from a selector, and every tool-provided text
switches immediately, mid-session included, without a reload. Python output stays verbatim.
Non-English languages are labelled beta and offer a report link.

**Independent Test**: Choose each language in turn and run the example (start, every step command,
`input()`, finish, an error, stop). No tool text remains in another language, shortcuts are
unchanged, and the session survives a switch. Follow quickstart §4, §5, §6, §8.

### Tests for User Story 1

- [X] T013 [P] [US1] In `tests/i18n.test.mjs`, add failing catalog-completeness tests looping over all 7 locale modules (`en, fr, de, it, pt-PT, pt-BR, lb`): (a) `meta.code` equals the file name and `meta.name` equals, respectively, `English`, `Français`, `Deutsch`, `Italiano`, `Português (Portugal)`, `Português (Brasil)`, `Lëtzebuergesch`; (b) the `messages` key set equals `en`'s exactly; (c) every `{param}` in the English value appears in the translation (for `PluralForms`, check each form); (d) only `*Html` keys contain `<`, and only `<strong>`, `</strong>`, `<code>`, `</code>`; (e) every `PluralForms` has `other`; (f) every value that contains `F5`, `F10`, `F11` or `Shift+F11` in English contains the same shortcut text; (g) `LOCALES` order is `en, fr, de, it, pt-PT, pt-BR, lb`; (h) `isBeta("en") === false`
- [X] T014 [P] [US1] In `tests/i18n.test.mjs`, add failing tests for switching: after `setPreference("fr")`, `locale() === "fr"`, a registered `onChange` listener fired once with `"fr"`, and `t("controls.stop")` returns the French catalog's value; `setPreference("fr")` again does not fire the listener; `setPreference("xx")` is ignored

### Implementation for User Story 1

- [X] T015 [P] [US1] Create `js/locales/fr.js` (`meta = { code: "fr", name: "Français", reviewed: false }`) translating every `en` key. Debug-control names follow the VS Code French pack (research R5): Démarrer, Continuer, Pas à pas principal, Pas à pas détaillé, Pas à pas sortant, Redémarrer, Arrêter. Verify them against `microsoft/vscode-loc` `i18n/vscode-language-pack-fr` and note any correction in research.md R5. No `sample` export yet (falls back to English until US3).
- [X] T016 [P] [US1] Create `js/locales/de.js` (`code: "de"`, `name: "Deutsch"`, `reviewed: false`). VS Code German control names: Starten, Fortsetzen, Prozedurschritt, Einzelschritt, Rücksprung, Neu starten, Beenden (verify against `vscode-language-pack-de`). → Verified: Continue = Weiter, Step Out = Ausführen bis Rücksprung, Stop = Stopp (research R5).
- [X] T017 [P] [US1] Create `js/locales/it.js` (`code: "it"`, `name: "Italiano"`, `reviewed: false`). VS Code Italian control names: Avvia, Continua, Esegui istruzione/routine, Esegui istruzione, Esci da istruzione/routine, Riavvia, Arresta (verify against `vscode-language-pack-it`).
- [X] T018 [P] [US1] Create `js/locales/pt-BR.js` (`code: "pt-BR"`, `name: "Português (Brasil)"`, `reviewed: false`), using Brazilian vocabulary ("arquivo", "tela"). VS Code pt-BR control names: Iniciar, Continuar, Contornar, Intervir, Sair, Reiniciar, Parar (verify against `vscode-language-pack-pt-BR`). → Verified: Stop = Interromper (research R5).
- [X] T019 [P] [US1] Create `js/locales/pt-PT.js` (`code: "pt-PT"`, `name: "Português (Portugal)"`, `reviewed: false`), using European vocabulary ("ficheiro", "ecrã"). No VS Code pack exists, so use the project terms from research R5: Iniciar, Continuar, Passar por cima, Entrar, Sair, Reiniciar, Parar.
- [X] T020 [P] [US1] Create `js/locales/lb.js` (`code: "lb"`, `name: "Lëtzebuergesch"`, `reviewed: false`). No VS Code pack exists, so use the project terms from research R5: Starten, Weider, Iwwersprangen, Erageen, Erausgoen, Nei starten, Stoppen. Use standard Luxembourgish orthography (2019 reform).
- [X] T021 [US1] Register the six new catalogs in `js/i18n.js` (static imports; `LOCALES` in order `en, fr, de, it, pt-PT, pt-BR, lb`)
- [X] T022 [US1] In `index.html`, add to the script-pane header (after `.spacer`, before Open…) a `<label class="lang">` with a visually hidden `<span data-i18n="lang.label">Language</span>` and `<select id="lang-select" data-i18n-aria-label="lang.label">`, then `<a id="lang-report" class="lang-report" target="_blank" rel="noopener noreferrer" hidden data-i18n="lang.report">Report a translation problem</a>`
- [X] T023 [US1] In `js/app.js`, populate `#lang-select` from `LOCALES`. Each option's text is `meta.name`, or `t("lang.beta", {language: meta.name})` when `isBeta(code)`; the value is the code. Select the active locale; on `change`, call `i18n.setPreference(value)`. Register one `i18n.onChange` handler that, in order: `applyTranslations(document)`, `render()`, re-renders the variables pane (`pause ? variables.select(pause, selectedFrame) : variables.reset()`), rebuilds the selector option labels, updates `document.title` via `setFileName(fileName)` without saving, and updates the report link. The handler must not call `loadScript`, `terminal.clear`/`system`, `scheduleSave`, or any `runner` method (FR-003, FR-012).
- [X] T024 [US1] In `js/app.js`, make `#lang-report` visible only when `isBeta(locale())`, with `href = "https://github.com/brunopacheco1/snake-tutor/issues/new?template=translation.yml&labels=translation&title=" + encodeURIComponent("[" + locale() + "] ")`. The URL must carry nothing but the locale code (FR-015, Constitution IV).
- [X] T025 [P] [US1] Create `.github/ISSUE_TEMPLATE/translation.yml`: a GitHub issue form named "Translation problem" with `labels: [translation]`, fields for language (dropdown of the 7 names), "Where does the text appear?", "Current text", "Suggested text", and an optional "Anything else?". Add a note asking reporters not to paste private code.
- [X] T026 [P] [US1] In `css/app.css`, style `.lang` / `#lang-select` like the existing `.btn-quiet` controls (same height, font, colors via the existing CSS variables, in both light and dark themes), add a visually hidden utility for the label span, style `.lang-report` as a small muted link, and set the debug `.toolbar` to `flex-wrap: wrap` with a row gap so long labels (German, Italian) wrap instead of clipping (research R10, SC-005)
- [X] T027 [US1] Run `npm test` (T013 and T014 pass), then verify in the browser preview following [quickstart.md](quickstart.md) §4 (switch mid-input and mid-pause), §5 (full walkthrough in all 7 locales at 1280×800 and 1024×768, no clipping, `ZeroDivisionError: division by zero` identical in every locale), §6 (beta label and report link) and §8 (`<html lang>`, translated accessible names). Fix any untranslated text you find by adding it to all catalogs and the contract table.

**Checkpoint**: The tool is fully usable in all 7 languages via manual selection. The MVP is shippable.

---

## Phase 4: User Story 2 - The right language from the first visit, remembered afterwards (Priority: P2)

**Goal**: Automatic mode follows the system language (`navigator.languages`). An explicit choice
persists in `localStorage["snake-tutor:lang"]`, and the "Automatic (system)" entry clears it.

**Independent Test**: Follow quickstart §2 (system-language table) and §3 (explicit choice
survives reload; Automatic clears it; an invalid value is treated as Automatic).

### Tests for User Story 2

- [X] T028 [P] [US2] In `tests/i18n.test.mjs`, add failing table-driven tests for `resolveSystem` (research R3): `["pt-BR"]→"pt-BR"`, `["pt-br"]→"pt-BR"`, `["pt-PT"]→"pt-PT"`, `["pt"]→"pt-PT"`, `["pt-AO"]→"pt-PT"`, `["lb-LU","de"]→"lb"`, `["de-LU"]→"de"`, `["fr-LU"]→"fr"`, `["fr-CA"]→"fr"`, `["it-CH"]→"it"`, `["es","it"]→"it"`, `["es"]→"en"`, `[]→"en"`, `undefined→"en"`
- [X] T029 [P] [US2] In `tests/i18n.test.mjs`, add failing tests for the preference, using a fake storage object (`getItem/setItem/removeItem` over a `Map`) and one whose methods throw: key absent → `"auto"`; `"it"` → `"it"`; `"xx"` → `"auto"` and the key is removed; throwing storage → `"auto"` with no exception; `writePreference("auto")` removes the key; `writePreference("de")` sets `"de"`; a throwing `writePreference` does not throw. Also test `init({ languages: ["de-AT"], storage })`: with the key absent → `"de"`; with the key `"it"` → `"it"`; `setPreference("auto")` then returns `"de"` and the key is gone.

### Implementation for User Story 2

- [X] T030 [US2] In `js/i18n.js`, implement `resolveSystem(tags)` exactly per research R3, and `readPreference(storage)` / `writePreference(value, storage)` per data-model "Language preference" (key `snake-tutor:lang`; *"key absent → Automatic"*, *"a supported code → Explicit"*, *"anything else → Invalid: treated as Automatic, and the key is removed"*; every storage access in `try/catch`). Implement `init({ languages = navigator.languages ?? [navigator.language], storage = localStorage } = {})` (resolving defaults lazily inside a `try`), and extend `setPreference` to accept `"auto"` and persist through `writePreference`. The active locale is `preference === "auto" ? resolveSystem(languages) : preference`.
- [X] T031 [US2] In `js/app.js`, call `i18n.init()` as the very first statement, before `applyTranslations(document)`. In the selector, prepend an option with value `auto` whose label is `t("lang.auto", {language: <active locale's display name, with the beta suffix when applicable>})`. Select `auto` when `preference() === "auto"`, otherwise the code, and refresh the label in the `onChange` handler (FR-002: "While on Automatic, the selector MUST show which language is in effect").
- [X] T032 [US2] Run `npm test` (T028 and T029 pass), then verify in the browser preview following [quickstart.md](quickstart.md) §2 and §3. Use Chrome launched with `--lang=…` or browser language settings, plus DevTools → Application → Local Storage to inspect and corrupt `snake-tutor:lang`. Confirm a private window (storage blocked) still switches language for the visit.

**Checkpoint**: US1 and US2 work together. First visits land in the system language, and choices persist.

---

## Phase 5: User Story 3 - An example program in my language (Priority: P3)

**Goal**: The built-in example's comments, prompt and printed text are in the active language.
The structure and identifiers are identical across locales.

**Independent Test**: Follow quickstart §7: in each locale, Example → run with input `Ada` →
localized prompt and output; switching language never replaces an edited script.

### Tests for User Story 3

- [X] T033 [P] [US3] Create `tests/samples.test.mjs` (SPDX header). In a `before()`, load Pyodide and `py/tutor_debugger.py` exactly like the `before()` and `session()` helpers in `tests/debugger.test.mjs` (copy them; the fake `tutor_host.wait()` pops from a command queue). Run each sample with the queue `[CONTINUE, [INPUT, "Ada"]]` (codes `CONTINUE = 1`, `INPUT = 6`), the same pattern as the existing "print output and input() go through the console" test. For each of the 7 locales: (a) `sample.split("\n").length` equals `en`'s; (b) after replacing every comment with nothing and every string literal with `""` (regex is fine; the samples have no escaped quotes), the code equals `en`'s transformed the same way, line by line; (c) the last event is `{ type: "done", status: "ok" }`; (d) the captured output contains `Ada` and its last non-empty line ends with `14` (the sum of `[3, 1, 4, 1, 5]`); (e) for non-English locales, the sample differs from `en`'s (it is actually translated)

### Implementation for User Story 3

- [X] T034 [P] [US3] Add a `sample` export to `js/locales/fr.js`: the English sample with only comments and string literals translated (keep identifiers `greet`, `name`, `message`, `numbers`, `total`, `n`, and the same line count). The comment naming the buttons must use this catalog's own `controls.start` / `controls.stepOver` texts and the F5/F10 shortcuts.
- [X] T035 [P] [US3] Add `sample` to `js/locales/de.js` (same rules as T034)
- [X] T036 [P] [US3] Add `sample` to `js/locales/it.js` (same rules as T034)
- [X] T037 [P] [US3] Add `sample` to `js/locales/pt-PT.js` (same rules as T034; European vocabulary)
- [X] T038 [P] [US3] Add `sample` to `js/locales/pt-BR.js` (same rules as T034; Brazilian vocabulary)
- [X] T039 [P] [US3] Add `sample` to `js/locales/lb.js` (same rules as T034)
- [X] T040 [US3] In `js/i18n.js`, remove the English fallback in `sample(code)` (every catalog now has one) and add a test in `tests/i18n.test.mjs` that every catalog exports a non-empty `sample` string. In `js/app.js`, confirm the Example button skips the confirmation when `isAnySample(editor.getValue())`, that a first visit with no saved script loads `i18n.sample()` in the active language, and that the `onChange` handler never replaces the script (FR-012), not even when it is an unedited sample.
- [X] T041 [US3] Run `npm test` (T033 and T040 pass), then verify quickstart §7 in the browser for all 7 locales

**Checkpoint**: All three user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T042 [P] Add a "Languages" section to `README.md`: the 7 supported languages; that the language follows the system unless chosen in the selector; that non-English translations are beta and how to report problems (link to the issue form); how to add a language (new `js/locales/<code>.js` + register in `js/i18n.js` + run `npm test`); and how a reviewer graduates one (set `reviewed: true`)
- [X] T043 [P] Update the Notes in `specs/002-multi-language-ui/checklists/requirements.md`, replacing the stale "a single Portuguese variant" decision with "two Portuguese translations (pt-PT, pt-BR)", and record any VS Code term corrections from T015–T018 in `specs/002-multi-language-ui/research.md` R5
- [X] T044 Measure the switch time in the browser (wrap `setPreference` in `performance.now()` via the JS console while paused with the Memory panel populated) and confirm it is < 100 ms; confirm the combined size of `js/locales/*.js` is ≤ 40 KB (`wc -c js/locales/*.js`), per plan.md Performance Goals
- [X] T045 Confirm `NOTICE` needs no change (no new dependency; VS Code terms are used as words, not copied files), and that `git grep -n "Downloading Python\|Starting debugger" js/worker.js` returns nothing
- [X] T046 Run the complete [quickstart.md](quickstart.md) (§1–§8) one final time in the browser preview, and attach screenshots of the debugger paused in German and in Luxembourgish (with the beta link visible) as proof

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none.
- **Foundational (Phase 2)**: needs Setup. **Blocks all user stories.** It has no visible effect by itself.
- **US1 (Phase 3)**: needs Foundational.
- **US2 (Phase 4)**: needs Foundational. It extends the US1 selector (T031 edits code from T023), so in practice it follows US1. Its logic (T028–T030) can be built in parallel with US1.
- **US3 (Phase 5)**: needs the six catalog files from US1 (T015–T020) to exist. It is independent of US2.
- **Polish (Phase 6)**: after the stories you intend to ship.

### Within phases

- Tests (T003, T013–T014, T028–T029, T033) are written first and must fail before implementation.
- T004 → T005 → T006/T007 (T007 needs both); T008–T011 need only T005.
- T015–T020 → T021 → T023 → T024; T022 before T023.
- T030 → T031.
- T034–T039 → T040.

### Parallel opportunities

- Phase 2: T008, T009, T010, T011 together (different files) once T005 is done.
- Phase 3: the six catalogs T015–T020 together, plus T025 and T026 alongside them.
- Phase 4: T028 and T029 together; the US2 logic in `js/i18n.js` can run alongside US1's catalog work if coordinated (both touch `js/i18n.js`, so merge carefully).
- Phase 5: the six sample tasks T034–T039 together, with T033.
- Phase 6: T042 and T043 together.

---

## Parallel Example: User Story 1

```bash
# After T014, write all six catalogs at once (one file each):
Task: "T015 Create js/locales/fr.js …"
Task: "T016 Create js/locales/de.js …"
Task: "T017 Create js/locales/it.js …"
Task: "T018 Create js/locales/pt-BR.js …"
Task: "T019 Create js/locales/pt-PT.js …"
Task: "T020 Create js/locales/lb.js …"
# Meanwhile, independent files:
Task: "T025 Create .github/ISSUE_TEMPLATE/translation.yml"
Task: "T026 Selector/report-link styles and toolbar wrap in css/app.css"
```

## Parallel Example: User Story 3

```bash
Task: "T033 tests/samples.test.mjs"
Task: "T034 sample in js/locales/fr.js"   # … through T039 lb.js
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 + Phase 2: refactor to the catalog with no visible change, and prove it with tests and a smoke test.
2. Phase 3: six catalogs, selector, beta link. **Stop and validate** with quickstart §4–§6, §8.
3. Ship. Learners can already choose their language manually; it starts in English and isn't remembered yet.

### Incremental delivery

1. + US2: system language and persistence, so most learners never touch the selector.
2. + US3: localized example programs.
3. Polish: README, measurements, final quickstart pass.

Each increment is deployable on its own (every push to `main` deploys to GitHub Pages), and none
of them changes the debugger core in `py/`.

---

## Notes

- [P] = different files, no dependency on unfinished tasks.
- Commit after each task or logical group. Run `npm test` before every commit.
- All non-English catalogs ship with `reviewed: false`. Graduating one later means only flipping that flag (FR-016).
- If you discover user-visible text not listed in `contracts/locale-catalog.md`, add the key to the contract **and** to all 7 catalogs in the same change, or the completeness test (T013) fails.

---

## Phase 7: Convergence

- [X] T047 Rewrite every text in `js/locales/fr.js` (all `messages` and the `sample`) to address the learner informally with "tu" (e.g. "Appuyez sur" → "Appuie sur", "Corrigez l’erreur" → "Corrige l’erreur", "Tapez votre réponse" → "Tape ta réponse", "votre ordinateur" → "ton ordinateur", "Comment vous appelez-vous ?" → "Comment t’appelles-tu ?", "Observez" → "Observe"), keeping keys, `{placeholders}`, shortcuts, VS Code control names and the sample's code structure unchanged; run `npm test` per FR-017 (contradicts)
- [X] T048 Rewrite every text in `js/locales/pt-PT.js` (all `messages` and the `sample`) to address the learner informally with European Portuguese "tu" (e.g. "Prima" → "Prime", "o seu ficheiro" → "o teu ficheiro", "Corrija o erro" → "Corrige o erro", "Escreva a sua resposta" → "Escreve a tua resposta", "Recarregue a página" → "Recarrega a página", "Como se chama?" → "Como te chamas?", "Observe" → "Observa"), keeping keys, `{placeholders}`, shortcuts, control names and the sample's code structure unchanged; run `npm test` per FR-017 (contradicts)
- [X] T049 Add a new key `lang.reportTitle` (English: "Opens GitHub in a new tab — you need a GitHub account to report") to `js/locales/en.js` and translate it in all six other catalogs following FR-017's informal address; tag `#lang-report` in `index.html` with `data-i18n-title="lang.reportTitle"` (keep `target="_blank" rel="noopener noreferrer"` and the URL carrying only the locale code); add the key to the "Language selector" table in `specs/002-multi-language-ui/contracts/locale-catalog.md`; confirm in the browser preview that the tooltip appears in each language per FR-015 (partial)
- [X] T050 Give the Start, Restart and Stop tooltips a plain-language description after the shortcut in all 7 catalogs (English: "Start (F5) — run the program from the top", "Restart (Ctrl/Cmd+Shift+F5) — stop and run again from the top", "Stop (Shift+F5) — end the program now"; translate with informal address and the catalog's own VS Code control name), update the matching rows in `specs/002-multi-language-ui/contracts/locale-catalog.md`, and run `npm test` per FR-005 (partial)
- [X] T051 Update the "Review a language" bullet in `README.md` to describe the FR-016 process: a fluent speaker reviews every text of the language (including the example) in a pull request, the maintainer merges the change setting `reviewed: true`, and later edits to a reviewed language need a fluent speaker's approval in their own pull request per FR-016 (partial)
- [X] T052 Extend `specs/002-multi-language-ui/quickstart.md` §6 with the expected report-link tooltip (opens GitHub in a new tab, needs an account, URL carries only `[<code>]`) and §5 with "every control tooltip shows its shortcut plus a plain-language description", so browser validation covers FR-015 and FR-005 (partial)
