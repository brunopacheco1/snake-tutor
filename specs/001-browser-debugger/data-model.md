# Data Model

## Script (persisted in localStorage key `snake-tutor:v1`)

| Field | Type | Rules |
|-------|------|-------|
| name | string | defaults to `main.py`; must end in `.py` when loaded from disk |
| source | string | ≤ 1 MB |
| breakpoints | number[] | 1-based line numbers, unique, sorted |

## Debug Session (UI state machine)

```text
loading ──ready──▶ idle ──start──▶ running ◀──continue/step── paused
                    ▲                │  ▲                        ▲
                    │                │  └──input submitted── waiting-input
                    └──done/stop─────┴─────────────────────────────┘
```

| State | Editable | Enabled controls |
|-------|----------|------------------|
| loading | yes | none |
| idle | yes | Start |
| running | no | Stop, Restart |
| paused | no | Continue, Step Over/Into/Out, Stop, Restart |
| waiting-input | no | Stop, Restart (console input focused) |

## Frame

| Field | Type | Notes |
|-------|------|-------|
| name | string | function name, `<module>` for top level |
| line | number | current line in the script |
| locals | Var[] | user-visible locals (dunders and imported modules hidden) |

Frames are ordered innermost-first. Module-level globals are the `locals` of the `<module>` frame.

## Var (snapshot of one value)

| Field | Type | Notes |
|-------|------|-------|
| name | string | variable name, index `[0]`, key `['a']` or attribute `.x` |
| type | string | `type(value).__name__` |
| value | string | `repr`, truncated to 120 chars |
| children | Var[]? | for list/tuple/set/dict/objects with `__dict__`; ≤ 50 items, depth ≤ 3 |
| more | number? | count of omitted children |

`changed` is computed in the UI by comparing `(frame name, depth index, var name) → value` against
the previous pause.

## Console Entry

`{ kind: "stdout" | "stderr" | "input" | "system", text }`, appended in order.
