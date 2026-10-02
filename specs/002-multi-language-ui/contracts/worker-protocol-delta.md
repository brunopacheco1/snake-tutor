# Contract change: Page ⇄ Python Worker

This amends [specs/001-browser-debugger/contracts/worker-protocol.md](../../001-browser-debugger/contracts/worker-protocol.md).
Only the `status` message changes; commands, shared memory and every other message stay the same.

| type | Before | After |
|------|--------|-------|
| `status` | `text`: English progress text | `key`: catalog key, one of `status.downloading`, `status.startingDebugger` |

- The page renders `t(message.key)`. The worker never sees a language.
- `fatal.text` stays a raw error string, and the page wraps it in `console.fatal`.
- `done.error.type` / `.message` stay exactly as Python produced them (FR-006).

The 001 contract's `status` row is updated in the same change.
