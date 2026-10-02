<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Lëtzebuergesch (`lb`)

Rules every text in [`lb.js`](lb.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **du** throughout ("Dréck op…", "deng Datei"), including the example program. Standard orthography (2019 reform); apply the n-rule (Eifeler Regel), e.g. "a lued" but "an dréck".

## Punctuation and typography

- German-style quotes „…“ (U+201E, U+201C).
- Typographic apostrophe ’ in contractions: "d’Säit", "z’änneren".
- Dash with spaces: " – " (en dash).
- Ellipsis character … (U+2026).
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: no VS Code language pack exists for Luxembourgish — project terms, not yet reviewed by a fluent speaker (FR-016). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Starten | project term |
| Continue | Weider | project term |
| Step Over | Iwwersprangen | project term |
| Step Into | Erageen | project term |
| Step Out | Erausgoen | project term |
| Restart | Nei starten | project term |
| Stop | Stoppen | project term |
| Breakpoint | Haltepunkt | project term |
| Call stack | Opruff-Stack | project term |
| Variables | Variabelen | project term |
| Console | Konsol | project term |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
