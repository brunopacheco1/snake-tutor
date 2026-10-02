# Research: Browser Step Debugger

## R1 — Running Python on a static site

- **Decision**: Pyodide 314.0.7 (CPython 3.14 compiled to WebAssembly), loaded from jsDelivr.
- **Rationale**: Real CPython (Principle III), full stdlib including `bdb`, `sys.settrace` works, no server.
- **Alternatives**: Skulpt / Brython (re-implementations — semantics drift, rejected by Principle III);
  server-side execution (violates Principles II and IV).

## R2 — Pausing execution and blocking `input()` (the hard part)

A debugger must *suspend* Python mid-execution and resume later. In a browser, Python runs on a JS
thread that cannot simply sleep.

- **Decision**: Run Pyodide in a Web Worker. When the debugger pauses (or `input()` is called), Python
  calls a JS function that blocks the worker with `Atomics.wait` on a `SharedArrayBuffer` until the
  page writes a command and calls `Atomics.notify`.
- **Constraint**: `SharedArrayBuffer` is only available when the page is *cross-origin isolated*, which
  normally needs the server to send `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp`. **GitHub Pages does not allow custom headers.**
- **Workaround**: vendor `coi-serviceworker` (MIT). On first load it registers a service worker that
  re-serves every response with those headers, then reloads once; from then on the page is isolated.
  Cross-origin assets must send CORS/CORP headers — verified 2026-10-02 that jsDelivr and cdnjs both
  return `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`.
- **Finding (implementation)**: under the service worker, `importScripts()` of cross-origin scripts
  fails in Chromium even though the CDN sends CORP, while CORS-mode `import()` works. The Python worker
  is therefore an ES **module worker** that imports `pyodide.mjs`.
- **Failure mode**: if isolation is still unavailable (e.g. private windows that block service workers,
  opening from `file://`), the page shows a plain message explaining how to fix it.
- **Alternatives**:
  - JSPI / `run_sync` stack switching — avoids SAB but not supported in all target browsers yet.
  - Record-then-replay (run whole program, record trace, scrub through it) — no SAB needed, but
    `input()` cannot be interactive mid-trace and infinite loops are hard to bound. Kept as a possible
    fallback, not built in v1.
  - Host elsewhere (Netlify/Cloudflare Pages set headers via `_headers`) — works but drops GitHub Pages.

## R3 — Stepping engine

- **Decision**: subclass stdlib `bdb.Bdb`; map Step Over/Into/Out/Continue to `set_next`, `set_step`,
  `set_return`, `set_continue`; breakpoints via `set_break` on the script written to Pyodide's virtual
  file system (`/home/pyodide/main.py`).
- **Rationale**: battle-tested semantics identical to `pdb`; `set_continue` removes tracing when no
  breakpoints exist so free-running code is fast.
- Stepping into code from other files (stdlib) is treated as "keep stepping" so learners only ever see
  their own script.

## R4 — Stopping a running program

- **Decision**: two paths. While paused/waiting, send a STOP command (raises a private `BaseException`
  subclass in Python). While running freely, write `2` (SIGINT) into Pyodide's interrupt buffer
  (`pyodide.setInterruptBuffer`) which raises `KeyboardInterrupt` — this ends infinite loops (SC-005).

## R5 — Editor

- **Decision**: CodeMirror 5 from cdnjs: Python mode, line numbers, custom breakpoint gutter,
  `addLineClass` for current/error lines. Works with plain `<script>` tags — no bundler (Constitution
  Technical Constraints). CodeMirror 6 rejected: requires ES module bundling or a module CDN.

## R6 — Output streaming

- **Decision**: `pyodide.setStdout/setStderr` with a `write` handler (unbuffered) so `print(..., end="")`
  prompts show immediately; Python flushes `sys.stdout` before every pause and `input()`.

## R7 — Testing

- **Decision**: `node --test` with the npm `pyodide` package; tests register a fake `tutor_host` module
  whose `wait()` returns scripted commands synchronously. Runs the exact `py/tutor_debugger.py` shipped
  to the browser.
