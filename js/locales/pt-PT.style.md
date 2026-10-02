<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Português (Portugal) (`pt-PT`)

Rules every text in [`pt-PT.js`](pt-PT.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **tu** throughout ("Prime…", "o teu ficheiro"), including the example program. Use European vocabulary: ficheiro, ecrã, transferir, guardar, consola.

## Punctuation and typography

- Guillemets «…» with no inner spaces: «{file}».
- Dash with spaces: " — " (em dash).
- Ellipsis character … (U+2026); progressive forms with "A …" ("A carregar…").
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: no VS Code language pack exists for European Portuguese — project terms, not yet reviewed by a fluent speaker (FR-016). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Iniciar | project term |
| Continue | Continuar | project term |
| Step Over | Passar por cima | project term |
| Step Into | Entrar | project term |
| Step Out | Sair | project term |
| Restart | Reiniciar | project term |
| Stop | Parar | project term |
| Breakpoint | ponto de interrupção | project term |
| Call stack | Pilha de chamadas | project term |
| Variables | Variáveis | project term |
| Console | Consola | project term |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
