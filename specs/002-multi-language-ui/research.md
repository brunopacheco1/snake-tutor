# Research: Multi-Language Interface

All Technical Context unknowns are resolved below. Each entry: **Decision**, **Rationale**,
**Alternatives considered**.

## R1. How to translate the interface without a framework or build step

**Decision**: A small hand-written module `js/i18n.js` (~150 lines) plus one ES-module catalog
per locale in `js/locales/<code>.js`. Static markup in `index.html` is tagged with
`data-i18n="key"` (text), `data-i18n-title="key"`, `data-i18n-aria-label="key"`; dynamic text
from JavaScript calls `t(key, params)`. Changing language re-applies the tagged markup and asks
each pane to re-render.

**Rationale**: The constitution allows plain HTML/CSS/JS with no bundler. The app has roughly
70 user-facing messages, which a dictionary lookup with `{placeholder}` substitution handles
easily. Plurals (only "… N more") use the browser's built-in `Intl.PluralRules`, which needs no
library and includes CLDR rules for every target language, Luxembourgish included.

**Alternatives considered**:
- *i18next / FormatJS from a CDN*: these handle plurals and ICU formatting, but they add a runtime
  dependency, a NOTICE entry and a lot of API surface for ~70 strings. Rejected because Principle I
  asks to keep things simple.
- *JSON catalogs loaded with `fetch()`*: these work, but they add an async load and an error path
  before first paint. ES modules can be imported statically and run unchanged under `node --test`.
- *One HTML page per language*: duplicates the markup and the switch needs a reload, which breaks
  FR-003 (no reload, session kept).

## R2. Loading strategy for catalogs

**Decision**: Import all 7 catalogs statically from `js/i18n.js`.

**Rationale**: Each catalog is about 4–6 KB, ~35 KB in total uncompressed and much less once
GitHub Pages compresses it, which is tiny next to Pyodide (~10 MB). With every catalog already
loaded, a switch is synchronous and instant (SC-002, FR-003), and no switch can fail on the
network.

**Alternatives considered**: Dynamic `import()` per language saves ~30 KB but makes switching
async and lets it fail. Rejected; the saving is negligible here.

## R3. Detecting the system language

**Decision**: Read `navigator.languages` (falling back to `[navigator.language]`). Walk the list
in order. For each tag, lower-case it and:
1. if it is exactly `pt-br`, pick `pt-BR`;
2. otherwise take the base subtag (`fr-CA` → `fr`); `pt` → `pt-PT`; `lb`, `en`, `fr`, `de`, `it`
   map to themselves;
3. the first match wins. If nothing matches, use `en`.

**Rationale**: Browsers fill `navigator.languages` from the OS locale by default. That is as close
to "the system language" as a static web page can get without asking permission. Matching by
order respects a learner who lists e.g. `lb, de, fr`. The Portuguese rule follows the
clarification (pt-BR → Brasil, all other Portuguese → Portugal).

**Alternatives considered**: `Accept-Language` needs a server, which breaks Principle II.
`Intl.DateTimeFormat().resolvedOptions().locale` reflects formatting settings rather than the
UI language and is inconsistent across browsers.

## R4. Persisting the preference

**Decision**: `localStorage` key `snake-tutor:lang`. The value is a supported locale code. If the
key is missing, the preference is Automatic. Choosing Automatic **removes** the key. Every read
and write is wrapped in `try/catch`. An unknown or corrupted value is treated as Automatic and
removed.

**Rationale**: This mirrors the existing `snake-tutor:v1` script storage and its private-mode
handling (`js/app.js` `scheduleSave`). A separate key means a language change never rewrites
the stored script (FR-012). Storing nothing for Automatic means a later OS change is picked up
(clarification Q3).

**Alternatives considered**: Adding the language to the `snake-tutor:v1` object would couple two
unrelated concerns, and a corrupt script entry would reset the language. Cookies would be sent to
the server, against the spirit of Principle IV.

## R5. Debug-control names per language (FR-005)

**Decision**: Take control names from the official VS Code language packs
([microsoft/vscode-loc](https://github.com/microsoft/vscode-loc), MIT) where one exists, and verify
each string against the pack's `main.i18n.json` during implementation. Expected values:

| Control | en | fr | de | it | pt-BR | pt-PT* | lb* |
|---------|----|----|----|----|-------|--------|-----|
| Start | Start | Démarrer | Starten | Avvia | Iniciar | Iniciar | Starten |
| Continue | Continue | Continuer | Weiter | Continua | Continuar | Continuar | Weider |
| Step Over | Step Over | Pas à pas principal | Prozedurschritt | Esegui istruzione/routine | Contornar | Passar por cima | Iwwersprangen |
| Step Into | Step Into | Pas à pas détaillé | Einzelschritt | Esegui istruzione | Intervir | Entrar | Erageen |
| Step Out | Step Out | Pas à pas sortant | Ausführen bis Rücksprung | Esci da istruzione/routine | Sair | Sair | Erausgoen |
| Restart | Restart | Redémarrer | Neu starten | Riavvia | Reiniciar | Reiniciar | Nei starten |
| Stop | Stop | Arrêter | Stopp | Arresta | Interromper | Parar | Stoppen |

Verified 2026-10-02 against `main.i18n.json` of the fr, de, it and pt-BR packs
(`vs/workbench/contrib/debug/browser/debugCommands`). Corrections from the first draft: de
Continue "Weiter" (not "Fortsetzen"), de Step Out "Ausführen bis Rücksprung", de Stop "Stopp"
(not "Beenden"), pt-BR Stop "Interromper" (not "Parar"). Panel terms were taken from the same
packs: call stack (Pile des appels, Aufrufliste, Stack di chiamate, Pilha de Chamadas) and
breakpoint (point d'arrêt, Haltepunkt, punto di interruzione, ponto de parada).

\* VS Code ships no pt-PT or Luxembourgish pack, so the project chooses these terms (spec
Assumptions). They start as **beta** and the fluent-speaker review confirms them.

**Rationale**: Principle I requires skills to carry over to VS Code. A learner who later installs
VS Code in their language will see the same words.

**Alternatives considered**: Leaving control names in English everywhere would contradict
FR-004, and English-only button labels are a barrier for beginners.

## R6. Text that contains markup (status line)

**Decision**: The status line keeps its `<strong>` emphasis. Catalog values may contain
`<strong>…</strong>` and `<code>…</code>` only, in keys whose name ends in `Html`
(e.g. `status.pausedHtml`). Every substituted `{param}` value is HTML-escaped before insertion.
All other keys are inserted with `textContent`.

**Rationale**: Today `setStatus()` assigns `innerHTML`, and some parameters (exception type,
file name) come from the learner's program. Escaping parameters keeps that safe, and the naming
rule makes the few HTML-bearing strings easy to spot in review. The catalog test checks that
non-`Html` keys contain no `<`.

**Alternatives considered**: Splitting each message into separate bold and plain keys breaks
word order in German and Luxembourgish, where the verb moves.

## R7. Worker status messages

**Decision**: The worker posts `{type: "status", key: "status.downloading" | "status.startingDebugger"}`
instead of English `text`. The page translates the key. `fatal` keeps its raw `text`, which is a
browser or Pyodide error and is shown inside a translated sentence.

**Rationale**: The worker must not need the catalogs (smaller worker, a single place for
language state). This is a small, backward-compatible change to the worker protocol (see
[contracts/worker-protocol-delta.md](contracts/worker-protocol-delta.md)).

## R8. Localized example program (FR-011)

**Decision**: Each catalog carries a `sample` string. Every locale's sample has the **same
structure**: same line count, same statements, same identifiers (`greet`, `name`, `message`,
`numbers`, `total`, `n`). Only comments and string literals are translated. "Load example"
replaces the script with the current locale's sample. The "replace your script?" confirmation is
skipped when the editor already holds *any* locale's sample, unchanged. On first run, with no
saved script, the current locale's sample is shown.

**Rationale**: Identical structure means the line numbers in documentation and tests match
across languages, and a test can run every sample through the real debugger and check the same
pause lines and output shape. English identifiers keep the code valid and transferable.

**Alternatives considered**: Translating identifiers too (`saudar`, `nome`) is valid Python 3,
but it hides the fact that real-world code and Python itself use English names, and it would
make tests per language. Rejected.

## R9. "Beta" label and report link (FR-014–016)

**Decision**: Each catalog's metadata has `reviewed: boolean`. At release only `en` is
`reviewed: true`; the others are `false` until a reviewer signs off. When the active locale is
not reviewed, the selector shows "Name (beta)" and a small "Report a translation problem" link
appears next to it. The link points to
`https://github.com/brunopacheco1/snake-tutor/issues/new?template=translation.yml&labels=translation&title=%5B<code>%5D%20`.
A new GitHub issue form, `.github/ISSUE_TEMPLATE/translation.yml`, asks which text is wrong and
what it should say. The link opens in a new tab with `rel="noopener noreferrer"`.

**Rationale**: Only the locale code goes in the URL: no script and no user data (FR-015,
Principle IV). Turning `reviewed` to `true` is the whole graduation step (FR-016).

**Alternatives considered**: An in-app feedback form would need a server or a third-party
service, which breaks Principles II and IV. A `mailto:` link exposes an address and is
unreliable on machines without a mail client.

## R10. Layout with longer translations (SC-005)

**Decision**: The debug toolbar is allowed to wrap onto a second row (`flex-wrap: wrap`).
Button labels never truncate. The language `<select>` sits in the script-pane header and
truncates only its own visible label, never the options. This is checked at 1280×800 and
1024×768 in all 7 locales during browser verification.

**Rationale**: German ("Prozedurschritt") and Italian ("Esegui istruzione/routine") are 2–3×
longer than English, and wrapping is the simplest overflow-free answer.

## R11. Making the page language and title correct (FR-009)

**Decision**: On every switch: `document.documentElement.lang = code` (`pt-PT`, `pt-BR`, `lb`, …),
`document.title = t("title.file", {file})`, and the `<meta name="description">` content is
updated too. The console input's `aria-label`, the splitters' `title` and the variables-panel
headings all come from the catalog.

## R12. Flash of English before translation

**Decision**: `js/app.js` calls `i18n.init()` and `applyTranslations(document)` as its first
statements, before `restore()` and `render()`. `index.html` keeps English text as the no-JS
fallback.

**Rationale**: Module scripts run before `DOMContentLoaded`. With all catalogs bundled (R2),
translation is synchronous, so any English flash is at most one frame during first load.
Hiding the body until translation finishes would leave a blank page if JavaScript failed, which
is worse for beginners.

## R13. Testing approach

**Decision**: Add `tests/i18n.test.mjs` to the existing `node --test` suite:
- **Language resolution**: table-driven cases for R3, including `pt-BR`/`pt`/`pt-AO`/`lb-LU`/`es`,
  and for empty or missing lists.
- **Preference handling**: stored code wins; a missing or garbage value means Automatic; throwing
  storage is tolerated.
- **Catalog completeness**: every locale has exactly the English keys; every `{param}` in English
  appears in each translation; only `*Html` keys contain markup.
- **Fallback**: a missing key returns the English text, never the key.
- **Plurals**: `vars.more` for 1 and 5 in every locale.
- **Samples**: every locale's sample has the same line count as English and runs through the
  real `tutor_debugger.run` (reusing the Pyodide harness) to completion with one `input()`,
  printing two lines.

UI behaviour (live switch mid-pause, layout, screen-reader labels) is checked in the browser,
following [quickstart.md](quickstart.md).

**Rationale**: Principle V already runs Node + Pyodide in CI. These tests are pure functions plus
one Pyodide run per sample, adding only a few seconds.
