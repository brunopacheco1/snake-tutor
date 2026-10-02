# Contract: Page ⇄ Python Worker

## Shared memory (created by the page, sent once in `init`)

- `control: Int32Array(SharedArrayBuffer(16))`
  - `[0]` flag: `0` = no command, `1` = command ready
  - `[1]` command code (below)
  - `[2]` byte length of payload in `data`
- `data: Uint8Array(SharedArrayBuffer(1 MiB))` — UTF-8 payload
- `interrupt: Uint8Array(SharedArrayBuffer(1))` — Pyodide interrupt buffer (`2` = SIGINT)

Sending a command: write payload → set `[1]`, `[2]` → `Atomics.store(control, 0, 1)` →
`Atomics.notify(control, 0)`. Worker: `Atomics.wait(control, 0, 0)`, read, `Atomics.store(control, 0, 0)`.

## Commands (page → worker, via shared memory, only while paused or waiting for input)

| Code | Name | Payload |
|------|------|---------|
| 1 | CONTINUE | — |
| 2 | STEP_OVER | — |
| 3 | STEP_INTO | — |
| 4 | STEP_OUT | — |
| 5 | STOP | — |
| 6 | INPUT | the typed line |
| 7 | BREAKPOINTS | JSON `number[]`; worker applies and keeps waiting |

## Messages (postMessage)

Page → worker:

- `{type: "init", control, data, interrupt}`
- `{type: "start", source, breakpoints}` — only when idle

Worker → page:

| type | fields | meaning |
|------|--------|---------|
| `status` | `key`: `"status.downloading"` \| `"status.startingDebugger"` | loading progress; the page translates the key (see specs/002-multi-language-ui/contracts/worker-protocol-delta.md) |
| `ready` | `version` | Python available |
| `stdout` / `stderr` | `text` | output chunk |
| `running` | — | executing freely |
| `paused` | `line`, `frames: Frame[]`, `returned?: {name, value}` | waiting for a step command |
| `input` | `prompt` | waiting for an INPUT command |
| `done` | `status: "ok" \| "error" \| "stopped"`, `error?: {type, message, line?}` | session ended |

## Python ↔ JS bridge (`tutor_host` module registered in Pyodide)

- `emit(json: str)` — post one worker → page message
- `wait() -> [code: int, payload: str]` — block until a command arrives

`py/tutor_debugger.py` exposes `run(source: str, breakpoints: list[int])`.
