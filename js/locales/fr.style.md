<!-- SPDX-License-Identifier: Apache-2.0 -->
# Style guide: Français (`fr`)

Rules every text in [`fr.js`](fr.js) follows, and the reference for its fluent-speaker
review (spec FR-016, FR-020). Change this guide and the catalog together, in the same pull request.

## Form of address

Informal **tu** throughout ("Appuie sur…", "ton script"), including the example program.

## Punctuation and typography

- Non-breaking space (U+00A0) before `?`, `!`, `:` and `;`, and inside « » quotes: « Démarrer ».
- Typographic apostrophe ’ (U+2019), not '.
- Dash with spaces: " — " (em dash), as in the English catalog.
- Ellipsis character … (U+2026).
- Keyboard shortcuts stay exactly as in English (`F5`, `Shift+F11`, `Ctrl/Cmd+Shift+F5`), and so do
  Python's own words (`print()`, `input()`, exception names).
- Plain language (FR-019): everyday words, at most two sentences per message, say what happened
  and what to do next.

## Core debugging terms

Source: VS Code French language pack 1.131.0 (`vscode-language-pack-fr`, checked 2026-10-02). A later VS Code rename is adopted only at this language's next review or edit.

| Concept | Term | Note |
|---------|------|------|
| Start | Démarrer | VS Code: "Démarrer le débogage", shortened |
| Continue | Continuer |  |
| Step Over | Pas à pas principal |  |
| Step Into | Pas à pas détaillé |  |
| Step Out | Pas à pas sortant |  |
| Restart | Redémarrer |  |
| Stop | Arrêter |  |
| Breakpoint | point d’arrêt |  |
| Call stack | Pile des appels |  |
| Variables | Variables |  |
| Console | Console |  |

Button tooltips follow the pattern "‹term› (‹shortcut›) — ‹what it does›", e.g. the Step Over
tooltip.
