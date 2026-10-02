# Feature Specification: Multi-Language Interface

**Feature Branch**: `002-multi-language-ui`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Add support to multiple languages, such as French, Portuguese, German, Luxembourg, English and Italian"

## Clarifications

### Session 2026-10-02

- Q: Does "Luxembourg" mean the Luxembourgish language? → A: Yes — Luxembourgish (Lëtzebuergesch, `lb`).
- Q: Can the language be taken from the system and the preference persisted locally? → A: Yes — the initial language follows the system/browser preferred languages, and an explicit choice is persisted locally in the learner's browser only.
- Q: Should the language selector include an "Automatic (system language)" option to return to following the system? → A: Yes — "Automatic (system)" is the default entry; choosing it clears the remembered choice and the tool follows the system language again.
- Q: Which Portuguese should the interface use: Portugal's (pt-PT), Brazil's (pt-BR), or one neutral text? → A: Both — two separate translations, Português (Portugal) and Português (Brasil), each listed in the selector and matched automatically from the system language.
- Q: Should a translation not yet checked by a fluent speaker still ship? → A: Yes — all translations ship at once; unreviewed ones are labelled "beta" until reviewed and are corrected from learner feedback.
- Q: When VS Code's official name for a debug button is likely to confuse a beginner, should Snake Tutor still use it? → A: Yes — the button label is always VS Code's exact name; its tooltip must add a plain-language description of what the button does.
- Q: How should each translation address the learner, informally or formally? → A: Informally everywhere — tu (French), du (German), tu (Italian), tu (Portugal), você (Brazil), du (Luxembourgish).
- Q: What should the "Report a translation problem" link tell learners, and what is it allowed to send? → A: It may carry only the active language code; its label or tooltip must say it opens GitHub in a new tab and needs a GitHub account; it must not pass on the referring page.
- Q: Who can mark a translation as reviewed, and does it go back to beta when its text changes later? → A: A fluent speaker reviews the whole language in a pull request and the maintainer merges the change that marks it reviewed; later edits need a fluent speaker's approval in their own pull request, and the language stays reviewed.
- Q: Does SC-001 count console messages printed before a language switch, and does an English fallback count as a failure? → A: SC-001 covers text shown after the switch; earlier console lines are exempt; any English fallback in a non-English language fails the release.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use Snake Tutor in my own language (Priority: P1)

A newcomer whose first language is French, Portuguese (Portugal or Brazil), German, Luxembourgish
or Italian opens
Snake Tutor and switches the interface to their language. Every piece of text the tool itself
shows — button labels and tooltips, panel headings, console status messages ("Program
finished.", "Program stopped."), the variables placeholder, confirmation prompts, error
explanations and the "can't start in this browser" screen — appears in that language, so the
learner can concentrate on Python rather than on a foreign-language interface.

**Why this priority**: This is the whole point of the feature. Beginners already face a new
language (Python); a second foreign language in the tool doubles the barrier. Delivering only
this story already gives every supported-language learner a fully usable tool.

**Independent Test**: Choose each supported language in turn, run the example program through
start, step over, step into, step out, an `input()` answer and to completion, and confirm that
no tool-provided text remains in another language.

**Acceptance Scenarios**:

1. **Given** the interface is in English, **When** the learner picks "Français" from the
   language selector, **Then** all tool-provided text switches to French immediately, without
   reloading the page and without losing the script, breakpoints or a running/paused session.
2. **Given** the interface is in German, **When** the learner hovers over the Step Over button,
   **Then** the tooltip is in German and still shows the shortcut F10.
3. **Given** the interface is in Luxembourgish, **When** the program ends with an exception,
   **Then** the plain-language explanation pointing at the offending line is in Luxembourgish,
   while the Python exception name and message are shown exactly as Python produced them.
4. **Given** any supported language, **When** a screen reader reads the controls, **Then**
   accessible labels are in the selected language and the page declares that language.

---

### User Story 2 - The right language from the first visit, remembered afterwards (Priority: P2)

A learner opens Snake Tutor for the first time. The tool starts in the learner's preferred
system language when it is one of the supported languages, and in English otherwise. If the
learner changes the language, that choice is remembered the next time they open Snake Tutor on
the same browser. Choosing "Automatic" in the selector returns to following the
system language.

**Why this priority**: Most learners never look for a language setting; starting in the right
language removes that step. Remembering the choice avoids repeating it on every visit. The
feature is still useful without this (manual selection works), hence P2.

**Independent Test**: Set the browser's preferred language to Portuguese, open the tool in a
fresh profile and confirm it starts in Portuguese; switch to Italian, reload and confirm it
stays in Italian; choose "Automatic" and confirm it returns to Portuguese.

**Acceptance Scenarios**:

1. **Given** a first visit with system language `pt-BR`, **When** the page loads, **Then** the
   interface is in Brazilian Portuguese; with `pt-PT` it is in European Portuguese.
2. **Given** a first visit with system language Spanish (unsupported), **When** the page loads,
   **Then** the interface is in English.
3. **Given** the learner previously chose Italian, **When** they reopen the tool, **Then** it
   starts in Italian regardless of the system language.
4. **Given** the learner previously chose Italian and their system language is German,
   **When** they choose "Automatic", **Then** the interface switches to German
   immediately and on later visits follows the system language again.
5. **Given** browser storage is unavailable (e.g. private window), **When** the learner changes
   language, **Then** the change still applies for the current visit and nothing breaks.

---

### User Story 3 - An example program in my language (Priority: P3)

When the learner loads the built-in example program, its comments, prompts and printed text are
in the selected interface language, so a beginner can understand what the example does and what
it asks them to type.

**Why this priority**: The example is the first program most newcomers run; an English-only
example undermines the localized interface. It is lower priority because the tool remains fully
usable without it.

**Independent Test**: Select each language, click "Example", run it and confirm the comments,
`input()` prompt and printed output are in that language and the program behaves identically.

**Acceptance Scenarios**:

1. **Given** the interface is in French, **When** the learner loads the example, **Then** its
   comments, prompt and printed messages are in French and variable/function names stay valid
   Python identifiers.
2. **Given** the learner has edited their script, **When** they switch language, **Then** their
   script is never replaced or modified.

---

### Edge Cases

- Learner switches language while the program is paused or waiting for `input()`: the session
  continues unaffected; only tool text changes. Lines already printed in the console are not
  rewritten.
- System language is a regional variant (`fr-CA`, `de-AT`, `it-CH`, `de-LU`) — it maps to the
  matching supported language.
- System language is Portuguese: `pt-BR` gets Português (Brasil); `pt-PT`, plain `pt` and every
  other Portuguese region (e.g. `pt-AO`, `pt-MZ`) get Português (Portugal).
- System language is `lb` / `lb-LU` — Luxembourgish is selected; a browser reporting only
  `fr-LU` or `de-LU` gets French or German respectively.
- A remembered language that is no longer supported (or a corrupted stored value) is treated
  as Automatic: the system language rule applies, then English.
- A translated string is missing for some text: the English text is shown for that item
  rather than a blank or an internal key.
- Longer translations (German, Portuguese) must not overflow or truncate buttons, tooltips or
  panel headings at the supported window sizes.
- Python output, exception names/messages and the learner's own code and `print()` text are
  never translated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The interface MUST be available in English, French, German, Italian, European
  Portuguese (Portugal), Brazilian Portuguese (Brasil) and Luxembourgish — 7 translations.
- **FR-002**: The interface MUST provide a visible language selector, reachable from the main
  screen in one click, whose first entry is "Automatic (‹language›)" (formerly referred to as
  "Automatic (system)"; translated, selected by default, ‹language› being the language the system
  setting gives) followed by each language under its own name (English, Français, Deutsch, Italiano,
  Português (Portugal), Português (Brasil), Lëtzebuergesch). While on Automatic, the selector MUST show which language is in
  effect.
- **FR-003**: Changing the language MUST update all tool-provided text immediately, without a
  page reload and without affecting the script, breakpoints, console contents or debugging
  session.
- **FR-004**: All tool-provided text MUST be translated: visible labels, tooltips, accessible
  labels, placeholders, console status messages, the message text of confirmation dialogs,
  error explanations, the startup-failure screen and the browser tab title suffix. Text drawn by
  the browser itself (dialog OK/Cancel buttons, file-picker labels) follows the browser's own
  language and is out of scope.
- **FR-005**: Debug control labels MUST be exactly the names Visual Studio Code uses in that
  language where such a translation exists, even when the term is unusual for beginners. Each
  control's tooltip MUST add its keyboard shortcut and a plain-language description of what it
  does (e.g. "Contornar (F10) — executar esta linha"). Keyboard shortcuts MUST stay identical in
  every language.
- **FR-006**: Python's own output — exception types and messages, tracebacks, and anything the
  learner's program prints — MUST be shown exactly as Python produced it, in every language.
- **FR-007**: While the preference is Automatic (including on a first visit), the tool MUST
  select the first supported language in the system's preferred-language list (matching on the
  base language, except Portuguese, which matches on region as described in Edge Cases),
  falling back to English.
- **FR-008**: The learner's explicit language choice MUST be remembered locally in the browser
  and take precedence over the system language on later visits; it MUST NOT be sent anywhere.
  Choosing "Automatic" MUST clear the remembered choice and apply the system language
  immediately.
- **FR-009**: The page MUST declare the active language so assistive technologies and browser
  features (spell-check, translation prompts) behave correctly.
- **FR-010**: If a translation is missing for any text, the English text MUST be shown for
  that item. This is a safety net only: a release MUST NOT contain missing translations (see
  SC-001).
- **FR-011**: The built-in example program MUST be provided in each supported language
  (comments, prompts and printed text), behaving identically across languages.
- **FR-012**: Switching language MUST never modify the learner's current script.
- **FR-013**: Adding a further language later MUST require only supplying its translations,
  without changing the tool's behaviour elsewhere.
- **FR-014**: Every translation not yet reviewed by a fluent speaker MUST be marked "beta" next
  to its name in the language selector. Beta translations MUST otherwise behave exactly like
  reviewed ones, including automatic selection from the system language.
- **FR-015**: While a beta translation is active, the interface MUST offer a "Report a
  translation problem" link (in that language) pointing to the project's public issue
  tracker on GitHub. The link's label or tooltip MUST state, in that language, that it opens
  GitHub in a new tab and needs a GitHub account. The only data the link may carry is the
  active language code; it MUST NOT carry the learner's script or anything else, and MUST NOT
  pass on the referring page.
- **FR-016**: Removing the "beta" label from a reviewed translation MUST require no change
  other than marking that translation as reviewed. A translation becomes reviewed only through
  a pull request in which a fluent speaker of that language has reviewed every text of it
  (including the example program), merged by the project maintainer. Later changes to a
  reviewed translation need a fluent speaker's approval in their own pull request; the
  translation stays reviewed.
- **FR-017**: Every translation MUST address the learner informally and consistently across all
  its texts, including the example program: French "tu", German "du", Italian "tu", European
  Portuguese "tu", Brazilian Portuguese "você", Luxembourgish "du". Where a sentence can avoid
  addressing the learner directly, that is also acceptable.

### Key Entities

- **Language**: a supported interface language — its code, its own display name, whether it is
  the fallback (English), and its review status (reviewed or beta).
- **Translation set**: for one language, the text for every tool-provided message plus the
  localized example program.
- **Language preference**: either Automatic (default — follow the system language) or one
  specific supported language; an explicit language is stored only in the learner's browser.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In each of the 7 translations, a full debugging walkthrough of the example program
  (start, every step command, `input()`, finish, an error case, stop) shows 0 tool-provided
  texts in another language. Console lines printed before a language switch are exempt (they
  stay as printed); an English fallback (FR-010) in any non-English translation counts as a
  failure.
- **SC-002**: A learner can switch language in under 5 seconds and at most 2 interactions from
  the main screen.
- **SC-003**: 100% of first visits with a supported system language open in that language
  with no learner action.
- **SC-004**: Switching language mid-session loses 0 characters of the script and 0
  breakpoints, and a paused program can be resumed normally afterwards.
- **SC-005**: No label, button or heading is clipped or overflows in any language at the
  supported desktop window sizes.
- **SC-006**: All 7 translations are available at release; every translation is labelled
  "beta" until it has been reviewed as described in FR-016, and once reviewed it has no open reports of
  misleading terms for core debugging concepts.
- **SC-007**: A learner using a beta translation can reach the translation-problem report page
  in at most 2 interactions.

## Assumptions

- The system language is read from the browser's preferred-language list, which by default
  mirrors the operating system's language settings.
- Regional variants other than the two Portuguese ones (e.g. Swiss German, Canadian French) are
  out of scope; they use the main translation for their language.
- Only the Snake Tutor interface is translated; Python itself (keywords, built-in names,
  exception messages) remains in English, as in every real Python installation — this keeps
  the tool faithful to real Python (Constitution III).
- Where Visual Studio Code has no translation (e.g. Luxembourgish), the project chooses its own
  debug-control names, keeping them consistent across the interface.
- The README and project documentation stay in English; only the in-app interface is in scope.
- Translations ship with the site as static content; no translation service, account or
  network call is involved (Constitution II and IV).
- Right-to-left languages are out of scope for this feature.
- A "fluent speaker" is someone the project maintainer accepts as having native or equivalent
  command of the language; the pull-request review (FR-016) is the record of it.
