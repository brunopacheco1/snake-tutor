# Quickstart: Validating the Multi-Language Interface

## Prerequisites

- Node 22 and `npm install` (as for the existing tests).
- A local static server: `python3 -m http.server 8765` (or the `snake-tutor` entry in
  `.claude/launch.json`). Then open http://localhost:8765.
- A desktop Chrome/Edge, Firefox or Safari.

## 1. Automated checks

```bash
npm test
```

Expected: the existing debugger tests and the new `tests/i18n.test.mjs` pass. The new tests
cover language resolution, preference handling, catalog completeness, placeholders, markup
rules, plurals, English fallback, and every locale's example program running through the real
debugger. See research R13.

## 2. System language on first visit (US2, FR-007, SC-003)

Use a fresh profile or private window for each case, or clear `snake-tutor:lang` in DevTools →
Application → Local Storage. To change the browser language, use the browser's language
settings. In Chrome you can also launch with `--lang=pt-BR`.

| Browser languages | Expected interface |
|-------------------|--------------------|
| `pt-BR` | Português (Brasil) |
| `pt-PT` or `pt` | Português (Portugal) |
| `lb-LU, de` | Lëtzebuergesch |
| `de-LU` | Deutsch |
| `es, it` | Italiano |
| `es` | English |

In each case the selector shows `Automatic (<language>)`, and `document.documentElement.lang`
equals the locale code.

## 3. Explicit choice and back to Automatic (US2, FR-008, clarification Q3)

1. With the system language set to German, choose **Italiano**, then reload. The interface stays
   Italian, and `localStorage["snake-tutor:lang"] === "it"`.
2. Choose **Automatic**. The interface switches to German immediately, and the key is removed.
3. Reload. It is still German and still Automatic.
4. Set the stored value to `"xx"` and reload. The interface is German and the key has been removed.

## 4. Switch mid-session (US1 scenario 1, FR-003, FR-012, SC-004)

1. Load the example, set a breakpoint on the `print(greet(name))` line, and press F5.
2. When `input()` asks for a name, switch the language to **Deutsch** and then type `Ada` + Enter.
   The prompt and the console field remain, the program continues, and console lines that were
   already printed are unchanged.
3. At the breakpoint, switch to **Français**. The status line, buttons, tooltips, "Call stack" and
   "Variables" headings change, the current line highlight and variable values stay, and the
   script text and breakpoints are unchanged.
4. Press F10 and F5 to finish. "Program finished." appears in French.

## 5. Full walkthrough per language (SC-001, SC-005)

For each of the 7 locales at 1280×800 and 1024×768: Example → Start → Step Over → Step Into →
Step Out → answer `input()` → Continue to the end → introduce `1/0` and run again → Stop
during a run.

Expected:
- No tool-provided text appears in another language. Hover every button: each tooltip shows the
  control name, its shortcut and a plain-language description (FR-005).
- Every text addresses the learner informally (FR-017).
- Shortcut keys in tooltips are unchanged.
- No button or heading is clipped (the toolbar may wrap).
- The `ZeroDivisionError: division by zero` text is identical in every language (FR-006), and
  only the surrounding sentence is translated.

## 6. Beta label and report link (FR-014, FR-015, SC-007)

1. Choose any non-English locale. The selector shows `… (beta)`, and a "report a translation
   problem" link in that language is visible.
2. Hover the link: its tooltip says, in that language, that it opens GitHub in a new tab and
   needs a GitHub account (FR-015).
3. Click it. A new tab opens on the GitHub "new issue" form with the translation template and the
   title prefixed `[<code>]`. The URL contains no script text.
4. Choose English. No beta label and no link.

## 7. Example program (US3, FR-011)

For each locale: click **Example** (confirm if asked) and run it with input `Ada`. The comments,
the prompt and both printed lines are in that language, the identifiers are the same as in
English, and the output shape is the same.
Edit the script, then switch language: the script is not replaced.

### 5a. 200% zoom (SC-008)

At 1024×768 with the browser zoomed to 200%, for each locale: the language selector, the beta
label and the report link are fully visible and don't overlap anything (the header may wrap
onto several rows).

*Result 2026-10-03:* passed in all 7 locales (checked with page zoom 2 in Chrome). Header height
grows to at most about 316 px (Luxembourgish). Outside this feature: at 200% the right-hand pane
(debug buttons, console) extends past the window and needs horizontal scrolling in every
language, English included.

## 8. Accessibility (US1 scenario 4, FR-009, FR-018)

Run with **VoiceOver on Safari** and with **NVDA on Firefox**, in at least French and
Luxembourgish:

1. Tab to the toolbar: each button's name is read in the active language.
2. Tab to the language selector: it's announced as "Langue" / "Sprooch", with its current value.
3. Open it with the arrow keys: each language name is pronounced in its own language (e.g.
   "Deutsch" as German), and beta entries say "(bêta)" / "(Beta)".
4. Choose another language with Enter: the screen reader says "Langue : Français" or
   "Sprooch: Lëtzebuergesch" once, and focus stays on the selector.
5. The page language (`<html lang>`) changes, so text afterwards is read with the new voice.

*Result:* not yet run. This needs a person with these screen readers (task T059).
