# Contract: `js/i18n.js`

This ES module is the only place that knows about languages. It has no DOM access at import
time, so `node --test` can import it.

## Exports

| Export | Signature | Behaviour |
|--------|-----------|-----------|
| `LOCALES` | `Locale[]` | `meta` of every catalog, in selector order (see data-model). |
| `resolveSystem` | `(tags: string[] \| undefined) → code` | Pure. Implements research R3. An empty or undefined list returns `"en"`. |
| `readPreference` | `(storage?) → "auto" \| code` | Reads `snake-tutor:lang`. Invalid values are removed and read as `"auto"`. If storage throws, returns `"auto"`. |
| `writePreference` | `(value: "auto" \| code, storage?) → void` | `"auto"` removes the key, and a code sets it. Never throws. |
| `systemLocale` | `() → code` | `resolveSystem` of the system languages captured by `init`: the locale "Automatic" gives, used for its label. |
| `registerLocale` / `unregisterLocale` | `(catalog)` / `(code)` | Add or remove a catalog at runtime (used by tests). `en` cannot be removed. |
| `init` | `({ languages, storage }?) → code` | Resolves the active locale from the preference and system languages, and returns it. Defaults: `navigator.languages`, `localStorage`. |
| `locale` | `() → code` | The active locale. |
| `preference` | `() → "auto" \| code` | The current preference. |
| `setPreference` | `(value: "auto" \| code) → code` | Persists the value, recomputes the active locale, notifies listeners when it changed, and returns the active locale. |
| `onChange` | `(listener: (code) → void) → unsubscribe` | Listeners run synchronously after a change. |
| `t` | `(key, params?) → string` | Looks the key up in the active catalog, then in `en`. If both miss, returns `key` (only a test-time failure, since the completeness test forbids it). Substitutes `{name}` placeholders. If the value is `PluralForms`, `params.count` selects the form. For `*Html` keys, every param is HTML-escaped. |
| `isBeta` | `(code?) → boolean` | `!meta.reviewed` for the code (default: active). |
| `sample` | `(code?) → string` | The example program for the code (default: active). |
| `isAnySample` | `(text) → boolean` | True when `text` exactly equals any locale's sample. |
| `applyTranslations` | `(root: ParentNode) → void` | For each `[data-i18n]` sets `textContent` (or `innerHTML` when the key ends in `Html`); for `[data-i18n-title]` sets `title`; for `[data-i18n-aria-label]` sets `aria-label`. Also sets `documentElement.lang` when `root` is a Document. |

## Invariants

- `t()` never returns an empty string or `undefined` for a key that exists in `en` (FR-010).
- Python-originated values (exception type and message, printed output, variable values) are
  only ever passed in as `params`. They are never looked up as keys (FR-006).
- Switching locale never touches `snake-tutor:v1` (FR-012).

## Page responsibilities (in `js/app.js`)

On `onChange`:
1. `applyTranslations(document)`.
2. `render()` (status line, Start/Continue label and tooltip).
3. `variables.select(pause, selectedFrame)` if paused, else `variables.reset()`.
4. Update the language selector state, the beta link and `document.title`.
5. Never call `loadScript`, `terminal.clear`, or any runner method.
