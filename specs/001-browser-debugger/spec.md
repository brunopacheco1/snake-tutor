# Feature Specification: Browser Step Debugger for Python Newcomers

**Feature Branch**: `001-browser-debugger`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "A webpage that helps newcomers develop in Python. The interface must be simple and intuitive: the developer adds a single script file and navigates through it as in debug mode, similar to VS Code. Left frame shows the script; right frame is split into three: debugging buttons, a console (with input typed directly into it), and memory / current frame. A cursor / line highlighter shows where execution is. Deployable on GitHub Pages."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Step through a script line by line (Priority: P1)

A learner opens the page, loads (or pastes) a single Python script, presses **Start Debugging**,
and walks through the program one line at a time. The line about to run is highlighted in the
script pane, and after each step the variables panel shows the current values.

**Why this priority**: This is the core learning loop: seeing *which line runs next* and *what
the variables hold* is the whole point of the product.

**Independent Test**: Load a 5-line script that assigns and updates variables; press Step Over
repeatedly and confirm the highlight moves line by line and the variable values update after
each step.

**Acceptance Scenarios**:

1. **Given** a script is loaded, **When** the learner presses Start Debugging, **Then** execution
   pauses before the first executable line and that line is highlighted.
2. **Given** execution is paused, **When** the learner presses Step Over, **Then** exactly one line
   runs, the highlight moves to the next line to run, and the variables panel reflects the new state.
3. **Given** execution reaches the end of the script, **When** the last line runs, **Then** the
   highlight disappears, the console shows the program exited, and the controls return to the
   "ready to start" state.

---

### User Story 2 - See printed output and type input in the console (Priority: P1)

Output from `print()` appears in the console pane as it happens. When the program calls
`input()`, the console shows the prompt and the learner types the answer directly in the console
and presses Enter; the program continues with that value.

**Why this priority**: Nearly every beginner exercise uses `print` and `input`; without them most
first programs cannot run.

**Independent Test**: Run `name = input("Name? ")` followed by `print("Hi", name)`; type a name in
the console and confirm the greeting appears.

**Acceptance Scenarios**:

1. **Given** a running script reaches `input("Name? ")`, **When** the prompt appears, **Then** the
   console shows `Name? ` with a text cursor ready for typing, and the debug controls indicate the
   program is waiting for input.
2. **Given** the console is waiting for input, **When** the learner types `Ada` and presses Enter,
   **Then** `Ada` is echoed, the program continues, and `name` shows `'Ada'` in the variables panel.
3. **Given** a script raises an uncaught exception, **When** it occurs, **Then** the console shows
   the Python error type and message and the offending line is marked as an error in the script pane.

---

### User Story 3 - Navigate function calls and inspect the call stack (Priority: P2)

The learner steps **into** a function call, sees the function's own local variables and the call
stack (which function called which), steps **out** back to the caller, and can **Continue** to run
until the next breakpoint or the end.

**Why this priority**: Functions and scope are the next big concept after variables; seeing frames
appear and disappear makes them concrete.

**Independent Test**: Load a script with a function called from the main body; Step Into it, confirm
the stack shows two frames and the local variables, Step Out, confirm the stack returns to one frame.

**Acceptance Scenarios**:

1. **Given** paused on a line that calls a user-defined function, **When** the learner presses Step
   Into, **Then** the highlight moves to the first line inside the function and the call stack shows
   the function on top of the module frame.
2. **Given** paused inside a function, **When** the learner presses Step Out, **Then** execution
   resumes until the function returns and pauses at the caller, with the return value visible.
3. **Given** paused anywhere, **When** the learner selects a lower frame in the call stack, **Then**
   the variables panel shows that frame's variables and its current line is indicated in the script.
4. **Given** paused, **When** the learner presses Stop, **Then** the program ends immediately and the
   controls return to the "ready to start" state.

---

### User Story 4 - Set breakpoints and edit the script (Priority: P2)

The learner clicks in the gutter next to a line number to toggle a breakpoint, edits the script in the
left pane between runs, and presses Continue to run until a breakpoint is hit.

**Why this priority**: Breakpoints make longer programs (loops) practical to debug; editing in place
avoids round-tripping to another tool.

**Independent Test**: Set a breakpoint inside a loop body, press Continue, confirm it pauses there on
each iteration.

**Acceptance Scenarios**:

1. **Given** a script is shown, **When** the learner clicks the gutter of line 4, **Then** a breakpoint
   marker appears; clicking again removes it.
2. **Given** breakpoints exist, **When** the learner presses Continue, **Then** execution runs until the
   next breakpoint line and pauses there, or to the end if none is hit.
3. **Given** no debug session is running, **When** the learner edits the script, **Then** the next run
   uses the edited code; editing is disabled while a session is running.

---

### User Story 5 - Open the tool from a public link with no setup (Priority: P3)

Anyone can open the tool from a public web address with no install, no account and no sign-in, and
their script is still there when they reload the page.

**Why this priority**: Zero-setup access is essential for a newcomer audience, but the debugging
experience (P1/P2) must exist first.

**Independent Test**: Open the published address in a fresh browser profile, load a script, debug it,
reload, confirm the script is still present.

**Acceptance Scenarios**:

1. **Given** a fresh browser, **When** the learner opens the published address, **Then** the page is
   ready to debug a sample script without any installation or sign-in.
2. **Given** the learner has edited a script, **When** they reload the page, **Then** the last script
   is restored.

---

### Edge Cases

- Script has a syntax error: no session starts; the console shows the error and the line is marked.
- Infinite loop while running freely (Continue with no breakpoint hit): Stop must still end it within
  a couple of seconds and the page must stay responsive.
- Empty script or a script with only comments: Start shows "nothing to run" and ends immediately.
- Learner presses Enter on an empty console input: the program receives an empty string.
- Very large values (long lists, deep nesting, long strings): the variables panel truncates display
  and lets the learner expand containers one level at a time.
- Recursion: each recursive call is a separate frame in the call stack.
- File loaded is not a `.py` text file or is larger than 1 MB: it is rejected with a clear message.
- The Python runtime is still downloading on first visit: controls are disabled and a progress
  message is shown.
- Program uses modules unavailable in the browser (e.g. network sockets, GUI toolkits): the resulting
  Python error is shown normally.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST show two side-by-side areas: the script on the left and, on the right, three
  stacked panels — debug controls (top), console (middle), variables / current frame (bottom).
- **FR-002**: Learners MUST be able to load one Python script by choosing a file, dragging it onto the
  page, or typing/pasting into the script pane; a sample script MUST be shown on first visit.
- **FR-003**: The script pane MUST display line numbers and syntax highlighting.
- **FR-004**: While paused, the script pane MUST highlight the next line to execute and scroll it into view.
- **FR-005**: Debug controls MUST include Start/Continue, Step Over, Step Into, Step Out, Restart and Stop,
  enabled only when meaningful, with VS Code keyboard shortcuts (F5, F10, F11, Shift+F11, Ctrl/Cmd+Shift+F5,
  Shift+F5).
- **FR-006**: The program MUST run with real Python semantics; output and errors MUST match standard Python.
- **FR-007**: `print` output and error output MUST appear in the console in order, errors visually distinct.
- **FR-008**: When the program requests input, the console MUST accept typed input inline and deliver it on
  Enter; the controls MUST show a "waiting for input" state.
- **FR-009**: The variables panel MUST show the selected frame's local variables (and module globals when in a
  function) with name, type and value; changed values since the previous step MUST be highlighted.
- **FR-010**: The variables panel MUST show the call stack; selecting a frame shows that frame's variables.
- **FR-011**: Learners MUST be able to toggle breakpoints by clicking the gutter; Continue pauses at them.
- **FR-012**: Stop MUST terminate the program at any time, including during an infinite loop or while
  waiting for input.
- **FR-013**: Uncaught exceptions and syntax errors MUST be reported in the console and marked on the line.
- **FR-014**: The last script and breakpoints MUST be kept in the learner's browser across reloads.
- **FR-015**: Learner code and input MUST NOT be sent to any server.
- **FR-016**: The tool MUST be publishable as a static site on GitHub Pages with no server component.
- **FR-017**: The layout MUST let learners resize the left/right split.
- **FR-018**: Learners MUST be able to download the current script as a `.py` file.

### Key Entities

- **Script**: the single Python source being debugged; text, file name, set of breakpoint line numbers.
- **Debug Session**: one run of the script; state is one of ready, running, paused, waiting-for-input, ended.
- **Frame**: one active function call; function name, current line, local variables.
- **Variable Snapshot**: name, type, display value, expandable children, and whether it changed since the
  last pause.
- **Console Entry**: an ordered piece of output (stdout, stderr, echoed input, system message).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can start debugging the sample script within 30 seconds of the page
  finishing loading, without instructions.
- **SC-002**: After the first visit, the page is ready to debug in under 5 seconds on a typical broadband connection.
- **SC-003**: Each step (over/into/out) updates the highlight and variables in under 200 ms for scripts up to
  500 lines.
- **SC-004**: For a suite of 20 beginner programs, console output is identical to standard Python output.
- **SC-005**: Stop ends a runaway loop within 2 seconds in 100% of trials.
- **SC-006**: In usability tests, at least 8 of 10 beginners correctly state which line runs next and the value
  of a named variable after stepping through a 10-line script.

## Assumptions

- Target users are beginners on desktop/laptop browsers; phone layouts are out of scope for v1.
- One script per session; importing a second user file and installing third-party packages are out of scope.
- Python standard library modules that can run in a browser are available; networking, threads and GUI are not.
- A one-time download of the Python runtime (tens of MB) on first visit is acceptable; it is cached afterwards.
- Watch expressions, conditional breakpoints and editing variable values are out of scope for v1.
- Internet access is needed on first visit to fetch the Python runtime.
