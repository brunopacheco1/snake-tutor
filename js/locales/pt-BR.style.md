<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Português (Brasil) (`pt-BR`)

Rules every text in [`pt-BR.js`](pt-BR.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **você** throughout ("Pressione…", "seu script"), including the example program. Use Brazilian vocabulary: arquivo, tela, baixar, salvar, console.

## Punctuation and typography

- Curly quotes “…” in sentences (e.g. the example program); straight double quotes "…" around file
  names: "{file}".
- Dash with spaces: " — " (em dash).
- Ellipsis character … (U+2026); progressive forms with -ndo ("Carregando…").
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: VS Code Brazilian Portuguese language pack 1.131.0 (`vscode-language-pack-pt-BR`, checked 2026-10-02). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Iniciar | VS Code: "Iniciar a Depuração", shortened |
| Continue | Continuar |  |
| Step Over | Contornar |  |
| Step Into | Intervir |  |
| Step Out | Sair |  |
| Restart | Reiniciar |  |
| Stop | Interromper |  |
| Breakpoint | ponto de parada |  |
| Call stack | Pilha de Chamadas | VS Code capitalisation kept |
| Variables | Variáveis |  |
| Console | Console |  |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
