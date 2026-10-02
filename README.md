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
