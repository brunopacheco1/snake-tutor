# Data Model: Multi-Language Interface

All of this lives in the browser. Nothing is sent to a server.

## Locale

A supported interface language. It is defined in its catalog module's `meta` export.

| Field | Type | Rules |
|-------|------|-------|
| `code` | string | One of `en`, `fr`, `de`, `it`, `pt-PT`, `pt-BR`, `lb`. Also used as the `<html lang>` value. Unique. |
| `name` | string | The language's own name: `English`, `Français`, `Deutsch`, `Italiano`, `Português (Portugal)`, `Português (Brasil)`, `Lëtzebuergesch`. |
| `reviewed` | boolean | `true` once a fluent speaker has reviewed the catalog. Controls the "beta" label (FR-014). `en` is always `true`. |

The fallback locale is `en`. The selector lists the locales in this order: `en`, `fr`, `de`,
`it`, `pt-PT`, `pt-BR`, `lb`.

## Catalog

The text for one Locale. Each catalog is a single module, `js/locales/<code>.js`.

| Field | Type | Rules |
|-------|------|-------|
| `meta` | Locale | See above. |
| `messages` | `Record<key, string \| PluralForms>` | Its key set MUST equal the key set of the `en` catalog (enforced by a test). Values may contain `{param}` placeholders, and every placeholder used in `en` MUST appear in the translation. Only keys ending in `Html` may contain markup, and only `<strong>` and `<code>`. |
| `sample` | string | The example program. It MUST have the same line count, statements and identifiers as the `en` sample; only comments and string literals differ. |

`PluralForms` is an object keyed by `Intl.PluralRules` categories (`one`, `other`, plus any other
category the language needs), with `other` required. Resolution: `Intl.PluralRules(code).select(n)`,
falling back to `other`.

The full key list and the parameters of each key are in
[contracts/locale-catalog.md](contracts/locale-catalog.md).

## Language preference

Stored in the learner's browser under `localStorage["snake-tutor:lang"]`.

| Stored state | Meaning |
|--------------|---------|
| key absent | **Automatic**: follow the system language (default). |
| a supported `code` | **Explicit**: always use this locale. |
| anything else | Invalid: treated as Automatic, and the key is removed. |

Storage that is unavailable (it throws) behaves like "key absent" for reads and a no-op for
writes. A choice still applies for the current visit (spec US2 scenario 5).

### State transitions

```text
            choose a language                choose "Automatic (system)"
 Automatic ──────────────────▶ Explicit(code) ──────────────────────────▶ Automatic
     ▲                           │   ▲                                   (key removed,
     │                           │   │ choose another language            system language
     │   invalid stored value    │   └──────────────┘                     applied now)
     └───────────────────────────┘ (on load)
```

## Active locale (derived, not stored)

```text
active = preference is Explicit(code) ? code
       : resolveSystem(navigator.languages)          // research R3; "en" if no match
```

Derived state shown in the UI:
- **Selector value**: `auto` or `code`. The "Automatic" option's label always names the language
  Automatic gives on this system (`systemLocale()`), with the beta suffix when that locale is beta,
  e.g. `Automatic (Deutsch (beta))` or `Automatic (English)` (FR-002, FR-018), even while an
  explicit language is selected.
- **Beta**: `!catalogFor(active).meta.reviewed`, which shows the "(beta)" suffix and the report
  link (FR-014, FR-015).

## Relationship to existing state

- The script, file name and breakpoints stay in `localStorage["snake-tutor:v1"]`, and a
  language change never touches them (FR-012).
- The debug session state (`idle | running | paused | input`) does not change on a language
  switch. Panes re-render from the state they already hold (`pause`, `selectedFrame`).
- Console lines that were already written are not re-translated (spec Edge Cases).
