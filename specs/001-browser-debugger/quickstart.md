# Quickstart & Validation

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. The first load reloads itself once (service worker installs the
isolation headers). Status should end at "Ready".

## Automated tests

```bash
npm install
npm test
```

## Manual validation (maps to spec user stories)

1. **US1** — Press F5 on the sample: line 1 highlighted. F10 repeatedly: highlight advances, changed
   variables flash.
2. **US2** — Continue to the `input()` line: console shows prompt + caret; type `Ada`, Enter: greeting
   printed. Script `1/0` shows `ZeroDivisionError` in red and marks the line.
3. **US3** — On a call line press F11: stack shows 2 frames; Shift+F11 returns, "returned" value shown.
   Click the `<module>` frame in the stack: its variables shown.
4. **US4** — Click gutter on a loop line, F5: pauses there each iteration. Edit script while idle: next
   run uses new code. `while True: pass` + F5 then Shift+F5: stops within 2 s.
5. **US5** — Reload: script and breakpoints restored. Publish via GitHub Pages and repeat 1–4.
