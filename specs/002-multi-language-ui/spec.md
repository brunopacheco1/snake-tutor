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

### Session 2026-10-03

- Q: What should the spec require for using the language menu with a keyboard and a screen reader? → A: Reachable with Tab and operable with arrow keys and Enter like the other controls; labelled "Language" in the active language; entries announce beta status; each language name is marked with its own language; US1 scenario 4 is checked with VoiceOver on Safari and NVDA on Firefox.
- Q: When the learner switches language, should a screen reader announce the change? → A: Yes — once, politely, in the new language (e.g. "Langue : Français"); focus stays on the selector.
- Q: What contrast and zoom levels must the new language controls meet? → A: Text contrast ≥ 4.5:1 and focus outlines/control borders ≥ 3:1 in both light and dark themes; at 200% browser zoom at 1024×768, no language control or label is clipped or overlapping.
- Q: When a translation is too long for the space it has, how may the layout respond? → A: Toolbars and headers may wrap onto more rows; button names, headings and status text are never shortened or hidden; only the language menu's closed state may be shortened with "…", and its open list always shows full names.
- Q: How should SC-006's "no open reports of misleading terms for core debugging concepts" be measured? → A: Core concepts are the six debug controls, breakpoint, call stack, variables, console and the error explanations; a reviewed language passes if no translation report about these has been open for more than 30 days.
- Q: What test should a translated message pass to count as "plain language" for a beginner? → A: Everyday words (no technical terms beyond the debug control names and Python's own words); says what happened, with the line number for errors when known; says what the learner can do next; at most two sentences — for beta and reviewed texts alike.
- Q: What should happen when a language turns out to contain a misleading translation that can't be fixed quickly? → A: The maintainer first marks it as beta again; if the misleading term about a core concept is still unfixed after 30 days, the language is removed and learners who had chosen it fall back to Automatic.
- Q: Should each language have a short written style guide covering punctuation, quote marks and the chosen word for each core concept? → A: Yes — one style guide per language, kept with the translations, recording the form of address, punctuation and quote conventions, and the term for each core concept; translations follow it and reviewers check against it.
- Q: What exactly must be the same across languages for the example program to count as "behaving identically"? → A: Same code line by line (same identifiers and line count; only comments and string contents differ); with the same input it pauses on the same lines and shows the same variable values — only printed wording differs.
- Q: How should Snake Tutor depend on VS Code's translations over time? → A: Terms are used as words (no VS Code files copied, no NOTICE entry); each style guide records the terms with the VS Code version checked; a VS Code rename is adopted only at that language's next review or edit.

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
   accessible labels are in the selected language and the page declares that language. This is
   checked with VoiceOver on Safari and with NVDA on Firefox.

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
- Longer translations (German, Italian, Portuguese, Luxembourgish) must not overflow or
  truncate buttons, tooltips or panel headings at the supported window sizes (see SC-005).
- Python output, exception names/messages and the learner's own code and `print()` text are
  never translated.
- Learner-controlled text inserted into a translated message (a file name, an exception type,
  a function name, a value) is shown exactly as given, as plain text, never translated and
  never interpreted as formatting.
- An error with no known line number gets its own explanation in every language, without
  the "on line N" part.
- A message that contains a count (e.g. "… 3 more") uses the plural rules of the active
  language, including languages whose plural forms differ from English.
- Whatever the learner types into the example's `input()` — empty text, accents, non-Latin
  characters — is handled exactly as Python handles it; the example never rejects input.

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
  error explanations, the startup-failure screen, the browser tab title and the page
  description shown in search results and link previews. The product name "Snake Tutor" is
  never translated. Tool text includes labels the tool chooses itself, such as "main program"
  for the top-level frame. Text drawn by the browser itself (dialog OK/Cancel buttons,
  file-picker labels) follows the browser's own language and is out of scope.
- **FR-005**: Debug control labels MUST be exactly the names Visual Studio Code uses in that
  language where such a translation exists, even when the term is unusual for beginners. Each
  control's tooltip MUST add its keyboard shortcut and a plain-language description of what it
  does (e.g. "Contornar (F10) — executar esta linha"). Keyboard shortcuts MUST stay identical in
  every language. This applies to the six debug controls (Start/Continue, Step Over, Step Into,
  Step Out, Restart, Stop); the source is the official VS Code language packs, as verified and
  recorded in research.md R5. Each language's style guide (FR-020) records these terms with
  the VS Code version they were checked against; a later VS Code rename is adopted only at
  that language's next review or edit, which re-checks the terms. Other debugging terms (call stack, breakpoint, variables) SHOULD
  use the VS Code term where one exists.
- **FR-006**: Python's own output — exception types and messages, tracebacks, and anything the
  learner's program prints — MUST be shown exactly as Python produced it, in every language.
  This includes the type names and value representations in the Memory panel (e.g. `int`,
  `str`, `<function greet>`).
- **FR-007**: While the preference is Automatic (including on a first visit), the tool MUST
  select the first supported language in the system's preferred-language list (matching on the
  base language, except Portuguese, which matches on region as described in Edge Cases),
  falling back to English.
- **FR-008**: The learner's explicit language choice MUST be remembered locally in the browser
  and take precedence over the system language on later visits; it MUST NOT be sent anywhere.
  Only the language code is stored, separately from the saved script, and Automatic stores
  nothing.
  Choosing "Automatic" MUST clear the remembered choice and apply the system language
  immediately.
- **FR-009**: The page MUST declare the active language so assistive technologies and browser
  features (spell-check, translation prompts) behave correctly, using the codes `en`, `fr`,
  `de`, `it`, `pt-PT`, `pt-BR` and `lb`.
- **FR-010**: If a translation is missing for any text, the English text MUST be shown for
  that item. This is a safety net only: a release MUST NOT contain missing translations (see
  SC-001).
- **FR-011**: The built-in example program MUST be provided in each supported language
  (comments, prompts and printed text), behaving identically across languages: the code is the
  same line by line, with the same identifiers and line count, and only comments and the text
  inside string literals differ. Given the same input, it pauses on the same lines and shows
  the same variable values, except for values built from translated text (e.g. the greeting
  `message`); only that wording and the printed wording differ.
- **FR-012**: Switching language MUST never modify the learner's current script.
- **FR-013**: Adding a further language later MUST require only supplying its translations and
  its style guide (FR-020), without changing the tool's behaviour elsewhere.
- **FR-014**: Every translation not yet reviewed by a fluent speaker MUST be marked "beta" next
  to its name in the language selector, in the form "‹name› (‹beta›)", where ‹beta› is the
  word for "beta" in the active interface language (e.g. "Deutsch (bêta)" while the interface
  is in French). Beta translations MUST otherwise behave exactly like
  reviewed ones, including automatic selection from the system language.
- **FR-015**: While a beta translation is active, the interface MUST offer a "Report a
  translation problem" link (in that language) pointing to the project's public issue
  tracker on GitHub. The link's label or tooltip MUST state, in that language, that it opens
  GitHub in a new tab and needs a GitHub account. The only data the link may carry is the
  active language code; it MUST NOT carry the learner's script or anything else, and MUST NOT
  pass on the referring page. The issue form it opens is written in English, accepts reports in
  English or in the language being reported, and asks reporters not to paste private code.
- **FR-016**: Removing the "beta" label from a reviewed translation MUST require no change
  other than marking that translation as reviewed. A translation becomes reviewed only through
  a pull request in which a fluent speaker of that language has reviewed every text of it
  (including the example program), merged by the project maintainer. Later changes to a
  reviewed translation need a fluent speaker's approval in their own pull request; the
  translation stays reviewed. If a translation is found to contain a misleading term for a
  core debugging concept (SC-006), the maintainer MUST mark it as beta again; if that term is
  still unfixed after 30 days, the language MUST be removed from the selector, and learners
  who had chosen it fall back to Automatic (see Edge Cases).
- **FR-017**: Every translation MUST address the learner informally and consistently across all
  its texts, including the example program: French "tu", German "du", Italian "tu", European
  Portuguese "tu", Brazilian Portuguese "você", Luxembourgish "du". Where a sentence can avoid
  addressing the learner directly, that is also acceptable.
- **FR-018**: The language selector MUST be reachable with the Tab key and operable with the
  arrow keys and Enter, like the other controls. Its accessible name MUST be "Language" in the
  active language, and each entry MUST announce its beta status. Each language's own name in
  the selector MUST be marked with that language, so assistive technology pronounces it
  correctly (e.g. "Deutsch" as German while the interface is in French). After a language
  change, assistive technology MUST be told once, politely and in the new language, which
  language is now active (e.g. "Langue : Français"), without moving the keyboard focus away
  from the selector.
- **FR-019**: Every tool message, in every translation and whether beta or reviewed, MUST be
  plain language: (1) everyday words, with no technical terms other than the debug control
  names and Python's own words; (2) it says what happened and, for an error, the line number
  when one is known; (3) it says what the learner can do next, where there is something to do;
  (4) it has at most two sentences. Text that Python or the browser supplies inside a message
  (e.g. a loading error) is exempt.
- **FR-020**: Each non-English language MUST have a style guide, kept with the translations,
  that records its form of address (FR-017), its punctuation and quotation conventions (e.g.
  the French space before "?" and ":", German „…“ quotes) and the term used for each core
  debugging concept (the six debug controls, breakpoint, call stack, variables, console). Every
  translation MUST follow its style guide, and the FR-016 review checks the translation
  against it; a change to a reviewed style guide follows the same review rule as the
  translation.

### Key Entities

- **Language**: a supported interface language — its code, its own display name, whether it is
  the fallback (English), and its review status (reviewed or beta).
- **Translation set**: for one language, the text for every tool-provided message plus the
  localized example program.
- **Style guide**: for one non-English language, its form of address, punctuation and quote
  conventions, and the term for each core debugging concept.
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
  supported desktop window sizes of 1280×800 and 1024×768. Toolbars and headers may wrap onto
  more rows; button names, headings and status text are never shortened with "…" or hidden.
  Only the language selector's closed state may be shortened with "…"; its open list always
  shows each name in full.
- **SC-006**: All 7 translations are available at release; every translation is labelled
  "beta" until it has been reviewed as described in FR-016. Once reviewed, a language passes if
  no translation report about a core debugging concept has been open for more than 30 days;
  the core concepts are the six debug controls (Start/Continue, Step Over, Step Into, Step Out,
  Restart, Stop), breakpoint, call stack, variables, console and the error explanations.
- **SC-007**: A learner using a beta translation can reach the translation-problem report page
  in at most 2 interactions.
- **SC-008**: The language selector, the beta label and the report link have a text contrast of
  at least 4.5:1, and their focus outlines and control borders at least 3:1, in both the light
  and the dark theme; at 200% browser zoom in a 1024×768 window, none of them is clipped or
  overlaps other content.

## Assumptions

- The system language is read from the browser's preferred-language list, which by default
  mirrors the operating system's language settings.
- Regional variants other than the two Portuguese ones (e.g. Swiss German, Canadian French) are
  out of scope; they use the main translation for their language. Portuguese is the exception
  because European and Brazilian Portuguese differ in everyday interface words (e.g.
  "ficheiro"/"arquivo", "ecrã"/"tela") a beginner meets constantly.
- One European Portuguese text serves every non-Brazilian Portuguese region (pt-AO, pt-MZ, …).
  This is revisited if translation reports from those regions show it is unclear.
- Using VS Code's terms as words needs no NOTICE entry, because no VS Code files are copied.
- Only the Snake Tutor interface is translated; Python itself (keywords, built-in names,
  exception messages) remains in English, as in every real Python installation — this keeps
  the tool faithful to real Python (Constitution III).
- Where Visual Studio Code has no translation (e.g. Luxembourgish), the project chooses its own
  debug-control names, keeping them consistent across the interface.
- The README and project documentation stay in English; only the in-app interface is in scope.
  The README's "Languages" section is where translators and reviewers find how to add or
  review a language, and it links to the style guides.
- Translations ship with the site as static content; no translation service, account or
  network call is involved (Constitution II and IV).
- Right-to-left languages are out of scope for this feature.
- Narrow and mobile screen widths are out of scope; the constitution supports desktop browsers
  only.
- A "fluent speaker" is someone the project maintainer accepts as having native or equivalent
  command of the language; the pull-request review (FR-016) is the record of it.
