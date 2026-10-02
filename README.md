# 🐍 Snake Tutor

A step-by-step Python debugger for newcomers that runs entirely in the browser — no install,
no account, and your code never leaves your computer.

**▶ Try it live: [bruno.pacheco.lu/snake-tutor](https://bruno.pacheco.lu/snake-tutor/)**

- **Left:** your script (open a `.py` file, drag one in, or just type).
- **Right, top:** debug buttons with the same names and shortcuts as VS Code.
- **Right, middle:** the console — `print()` output appears here and you answer `input()` right in it.
- **Right, bottom:** memory — the call stack and every variable, with changes highlighted after each step.

| Action | Button | Shortcut |
|--------|--------|----------|
| Start / Continue | ▶ | F5 |
| Step Over | ↷ | F10 |
| Step Into | ↓ | F11 |
| Step Out | ↑ | Shift+F11 |
| Restart | ⟳ | Ctrl/Cmd+Shift+F5 |
| Stop | ■ | Shift+F5 |

Click next to a line number to set a breakpoint.

## Languages

Snake Tutor speaks English, Français, Deutsch, Italiano, Português (Portugal), Português (Brasil)
and Lëtzebuergesch. It starts in your system's language and falls back to English; pick another
from the menu at the top of the script pane and it is remembered in this browser only.
**Automatic** goes back to following the system. Python itself — error messages, tracebacks,
your program's output — always stays exactly as Python prints it.

Translations other than English are marked **beta** until a fluent speaker has reviewed them.
Spotted something wrong? Use **Report a translation problem** next to the menu, or
[open a translation issue](https://github.com/brunopacheco1/snake-tutor/issues/new?template=translation.yml&labels=translation).

- **Add a language**: copy [js/locales/en.js](js/locales/en.js) to `js/locales/<code>.js`, translate
  `messages` and `sample` (keep every key, `{placeholder}`, shortcut and the example's code
  unchanged), import it in [js/i18n.js](js/i18n.js), then run `npm test` — the tests check that
  nothing is missing and that the example still runs.
- **Review a language**: a fluent speaker reviews every text of the language — including the
  example program — in a pull request, and the maintainer merges the change that sets
  `reviewed: true` in its `meta`, which removes the beta label. Later edits to a reviewed language
  need a fluent speaker's approval in their own pull request.

## How it works

Real CPython ([Pyodide](https://pyodide.org), Python 3.14) runs in a Web Worker. The stepping
engine ([py/tutor_debugger.py](py/tutor_debugger.py)) is built on the standard library `bdb`
module. When the program pauses — or calls `input()` — the worker blocks on a
`SharedArrayBuffer` until you press a button or hit Enter.

`SharedArrayBuffer` requires "cross-origin isolation" HTTP headers, which **GitHub Pages cannot
set**. [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker) (vendored, MIT) adds
them from a service worker: the very first visit reloads the page once, then everything works.
Details: [specs/001-browser-debugger/research.md](specs/001-browser-debugger/research.md).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 (opening `index.html` straight from disk will not work).

## Tests

```bash
npm install
npm test
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or `master`). [.github/workflows/pages.yml](.github/workflows/pages.yml) runs the
   tests and publishes the site to `https://<user>.github.io/<repo>/` (or your custom domain).
4. Enable **Enforce HTTPS** — the service worker that makes debugging work only runs over HTTPS.

## Spec-driven development

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit). The constitution lives in
[.specify/memory/constitution.md](.specify/memory/constitution.md) and the feature spec, plan and
tasks in [specs/001-browser-debugger/](specs/001-browser-debugger/).

## License

Snake Tutor is open source under the [Apache License 2.0](LICENSE). Third-party components and
their licenses are listed in [NOTICE](NOTICE). Contributions are accepted under the same license.
