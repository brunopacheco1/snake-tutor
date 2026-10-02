<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Deutsch (`de`)

Rules every text in [`de.js`](de.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **du** throughout ("Drücke…", "dein Skript"), including the example program. Imperatives are capitalised after a full stop.

## Punctuation and typography

- German quotes „…“ (U+201E, U+201C).
- Dash with spaces: " – " (en dash). The tab title keeps the shared "‹file› — Snake Tutor" form.
- Ellipsis character … (U+2026); "Wird geladen…" with no space before it.
- Avoid abbreviations such as "bzw." or "z. B." in messages: they read as extra sentences (FR-019).
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: VS Code German language pack 1.131.0 (`vscode-language-pack-de`, checked 2026-10-02). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Starten | VS Code: "Debuggen starten", shortened |
| Continue | Weiter |  |
| Step Over | Prozedurschritt |  |
| Step Into | Einzelschritt |  |
| Step Out | Ausführen bis Rücksprung |  |
| Restart | Neu starten |  |
| Stop | Stopp |  |
| Breakpoint | Haltepunkt |  |
| Call stack | Aufrufliste |  |
| Variables | Variablen |  |
| Console | Konsole |  |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
