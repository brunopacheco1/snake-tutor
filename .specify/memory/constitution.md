<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0 (MINOR: licensing constraint added)
- Previous: (template) → 1.0.0
- Principles defined: I. Newcomer-First Simplicity; II. Static-Only Delivery;
  III. Faithful Python Semantics; IV. Private by Default; V. Test-Backed Debugger Core
- Added sections: Technical Constraints; Development Workflow
- Removed sections: none
- Deferred TODOs: none
-->

# Snake Tutor Constitution

## Core Principles

### I. Newcomer-First Simplicity

The audience is people writing their first Python programs. Every screen MUST be usable without
reading documentation: one script, one set of debug controls, one console, one variables view.

- Features that add configuration, panels, or jargon MUST justify the value they add for a
  beginner; when in doubt, leave it out.
- Controls MUST use the same names and keyboard shortcuts as VS Code (Continue F5, Step Over F10,
  Step Into F11, Step Out Shift+F11, Stop Shift+F5) so skills transfer to a real editor.
- Error messages shown to the learner MUST be plain-language and point at the offending line.

### II. Static-Only Delivery (NON-NEGOTIABLE)

The product MUST deploy as static files to GitHub Pages: no application server, no database,
no build step required to serve it.

- All Python execution happens in the learner's browser.
- Any capability that normally needs server-set HTTP headers MUST be achieved client-side
  (e.g. a service worker) or degrade gracefully with a clear message.
- Third-party runtime assets MAY be loaded from a public CDN, pinned to an exact version.

### III. Faithful Python Semantics

What the learner sees MUST match what CPython would do: same output, same exceptions, same
variable values. The debugger MUST observe the real interpreter (tracing), never re-implement
or simulate Python evaluation.

### IV. Private by Default

Learner code and input MUST never leave the browser. No analytics, no accounts, no uploads.
Persisting the current script locally (browser storage) is allowed for convenience.

### V. Test-Backed Debugger Core

The stepping engine (breakpoints, step over/into/out, frame and variable snapshots) MUST have
automated tests that run in CI against real Python. UI changes MUST be verified in a browser
before release.

## Technical Constraints

- Plain HTML, CSS and JavaScript (ES modules); no framework or bundler unless a principle above
  would otherwise be violated.
- Supported browsers: current Chrome, Edge, Firefox and Safari on desktop.
- The project is open source under Apache-2.0 (LICENSE, NOTICE). New dependencies MUST use an
  Apache-2.0-compatible license (e.g. MIT, BSD, Apache-2.0, MPL-2.0) and be recorded in NOTICE.
- Single script file per session; multi-file projects and third-party package installation are
  out of scope until amended.

## Development Workflow

- Work follows Spec Kit: specify → plan → tasks → implement; specs live in `specs/`.
- Every change to `main` is deployed to GitHub Pages by a GitHub Actions workflow.
- Pull requests MUST state which principles they touch and how compliance was checked.

## Governance

This constitution supersedes other project practices. Amendments require a pull request that
updates this file, bumps the version (MAJOR: principle removed or redefined; MINOR: principle or
section added; PATCH: wording), and records the change in the Sync Impact Report. Reviews MUST
check plans and code against the principles; any deliberate deviation MUST be recorded in the
plan's Complexity Tracking table.

**Version**: 1.1.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
