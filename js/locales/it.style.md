<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Italiano (`it`)

Rules every text in [`it.js`](it.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **tu** throughout ("Premi…", "il tuo script"), including the example program.

## Punctuation and typography

- Guillemets «…» with no inner spaces: «{file}».
- Typographic apostrophe ’ (U+2019): "l’esempio".
- Dash with spaces: " — " (em dash).
- Ellipsis character … (U+2026).
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: VS Code Italian language pack 1.131.0 (`vscode-language-pack-it`, checked 2026-10-02). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Avvia | VS Code: "Avvia debug", shortened |
| Continue | Continua |  |
| Step Over | Esegui istruzione/routine |  |
| Step Into | Esegui istruzione |  |
| Step Out | Esci da istruzione/routine |  |
| Restart | Riavvia |  |
| Stop | Arresta |  |
| Breakpoint | punto di interruzione |  |
| Call stack | Stack di chiamate |  |
| Variables | Variabili |  |
| Console | Console |  |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
