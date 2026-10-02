# Implementation Plan: Multi-Language Interface

**Branch**: `002-multi-language-ui` | **Date**: 2026-10-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-multi-language-ui/spec.md`

## Summary

Translate every piece of text Snake Tutor itself shows into 7 locales: English, Français, Deutsch,
Italiano, Português (Portugal), Português (Brasil) and Lëtzebuergesch. The starting language
follows the system language. A learner's explicit choice is saved only in their browser, and an
"Automatic (system)" option clears it. Python's own output is never translated.

Approach: a dependency-free `js/i18n.js` module plus one ES-module catalog per locale. Static
markup is tagged with `data-i18n*` attributes and dynamic text goes through `t(key, params)`.
A language switch re-applies translations and re-renders panes from their current state, without
touching the script, breakpoints or the running Python session. All non-English catalogs ship as
**beta**, with a link to report problems on the public issue tracker.

## Technical Context

**Language/Version**: JavaScript (ES2022 modules) in the browser; Python 3.14 via Pyodide 314.0.7 (unchanged)

**Primary Dependencies**: None new. Uses the built-in `Intl.PluralRules` and `navigator.languages`; CodeMirror 5.65.21 and Pyodide as before.

**Storage**: Browser `localStorage`, key `snake-tutor:lang` (absent = Automatic). Separate from the existing `snake-tutor:v1` script storage.

**Testing**: `node --test` (existing). New `tests/i18n.test.mjs` for the pure i18n logic and catalog checks, plus running each locale's sample through the real debugger in Pyodide. Browser verification follows [quickstart.md](quickstart.md).

**Target Platform**: Current desktop Chrome, Edge, Firefox and Safari; static hosting on GitHub Pages.

**Project Type**: Static single-page web app (no backend)

**Performance Goals**: Language switch applies in under 100 ms with no network access. Catalogs add ≤ 40 KB uncompressed to the first load. *Measured at implementation (T044): switch ≤ 1.5 ms while paused; catalogs 41.0 KB uncompressed (56 bytes over the estimate) and 9.3 KB gzip, accepted as is.*

**Constraints**: No build step, no server, no new third-party runtime code. Python-produced text is shown verbatim. A language switch never modifies the script or the debug session.

**Scale/Scope**: 7 locales × ~75 message keys + 1 example program each; ~6 source files touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Status |
|-----------|------------|--------|
| I. Newcomer-First Simplicity | One extra control (a native language `<select>`) on the main screen. Control names follow VS Code's own translations, and shortcuts are unchanged (research R5). It removes a language barrier for beginners. | ✅ Pass |
| II. Static-Only Delivery | Catalogs are static ES modules served from GitHub Pages. No server, no build, no new CDN asset. The deploy workflow already copies `js/`. | ✅ Pass |
| III. Faithful Python Semantics | Exception types and messages, tracebacks and program output are passed through as parameters and never translated (FR-006). The debugger core in `py/` is unchanged. Sample programs are checked against real CPython. | ✅ Pass |
| IV. Private by Default | The preference is stored only in `localStorage`. The report link opens GitHub with only the locale code in the URL; no script or other data is sent (research R9). No analytics. | ✅ Pass |
| V. Test-Backed Debugger Core | Stepping engine unchanged. New automated tests for language logic and catalogs, and every localized sample runs through the real debugger in CI. UI verified in the browser per quickstart. | ✅ Pass |
| Technical Constraints | Plain JS, no framework or bundler; no new dependency, so NOTICE is unchanged. The VS Code terms are used as plain words (no files copied). | ✅ Pass |

**Post-design re-check (after Phase 1)**: still passing. The design adds one module, seven data
files and a one-field change to the worker protocol (`status.text` → `status.key`). No
complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-multi-language-ui/
├── plan.md                         # This file
├── research.md                     # Phase 0: decisions R1–R13
├── data-model.md                   # Phase 1: Locale, Catalog, Language preference
├── quickstart.md                   # Phase 1: validation guide
├── contracts/
│   ├── i18n-module.md              # js/i18n.js API and page responsibilities
│   ├── locale-catalog.md           # catalog format + full key list
│   └── worker-protocol-delta.md    # status message now carries a key
└── tasks.md                        # Phase 2 (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
index.html                 # data-i18n* attributes; language <select> + report link in script header
css/app.css                # selector/beta-link styles; toolbar flex-wrap for long labels
js/
├── i18n.js                # NEW: resolution, preference, t(), applyTranslations, onChange
├── locales/               # NEW: one catalog per locale (meta, messages, sample)
│   ├── en.js
│   ├── fr.js
│   ├── de.js
│   ├── it.js
│   ├── pt-PT.js
│   ├── pt-BR.js
│   └── lb.js
├── app.js                 # use t(); SAMPLE → i18n.sample(); re-render on change; selector wiring
├── console.js             # input aria-label via t()
├── variables.js           # all headings/labels via t(); plural "more"
├── editor.js              # breakpoint tooltip via t()
└── worker.js              # status messages post { key } instead of English text
.github/ISSUE_TEMPLATE/
└── translation.yml        # NEW: "Translation problem" issue form (target of the report link)
tests/
├── debugger.test.mjs      # unchanged
└── i18n.test.mjs          # NEW: resolution, preference, catalogs, plurals, samples in Pyodide
specs/001-browser-debugger/contracts/worker-protocol.md   # status row updated
README.md                  # short "Languages" section + how to add/review a translation
```

**Structure Decision**: Keep the existing flat static layout (`index.html`, `css/`, `js/`, `py/`,
`tests/`). Locale catalogs go in `js/locales/` so the deploy workflow's existing `cp -r js`
publishes them without changes.

## Implementation Notes

- **Order**: build `i18n.js` and `en.js` first and move every English string into the catalog
  with no visible change (`npm test` plus a browser smoke test). Then the selector, then
  detection and persistence, then the six translated catalogs and samples, then beta and report.
  This follows the spec's P1 → P2 → P3 stories.
- **Dynamic Start/Continue**: `render()` sets the label and title from `t()` on every call, so
  a language change just calls `render()`.
- **Console input during `input()`**: the field gets `data-i18n-aria-label="console.inputLabel"`,
  so `applyTranslations(document)` relabels a field that is already open.
- **`confirm()` dialog**: the text comes from `t("file.confirmReplace")`. The browser's OK/Cancel
  buttons follow the browser's own language, which is acceptable and out of our control.
- **Translation authoring**: drafts for the six non-English catalogs are written during
  implementation, with VS Code terms checked against microsoft/vscode-loc. All ship with
  `reviewed: false` (beta) until a fluent speaker signs off by flipping that flag.

## Complexity Tracking

No constitution violations, so nothing to justify.
