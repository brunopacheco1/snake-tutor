// SPDX-License-Identifier: Apache-2.0
// CodeMirror 5 wrapper: script text, breakpoints and debug line markers.
/* global CodeMirror */
import { t } from "./i18n.js";

export function createEditor(element, { onChange, onBreakpointsChange }) {
  const cm = CodeMirror(element, {
    mode: "python",
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    gutters: ["breakpoints", "CodeMirror-linenumbers"],
    extraKeys: {
      Tab: (editor) =>
        editor.somethingSelected() ? editor.indentSelection("add") : editor.replaceSelection("    "),
      "Shift-Tab": (editor) => editor.indentSelection("subtract"),
    },
  });

  const marks = { current: null, frame: null, error: null };
  const lineClass = { current: "line-current", frame: "line-frame", error: "line-error" };

  function marker() {
    const dot = document.createElement("div");
    dot.className = "breakpoint";
    dot.dataset.i18nTitle = "editor.breakpointTitle";
    dot.title = t("editor.breakpointTitle");
    return dot;
  }

  function breakpoints() {
    const lines = [];
    cm.eachLine((handle) => {
      if (handle.gutterMarkers && handle.gutterMarkers.breakpoints) lines.push(cm.getLineNumber(handle) + 1);
    });
    return lines;
  }

  function toggleBreakpoint(lineIndex) {
    const info = cm.lineInfo(lineIndex);
    const has = info.gutterMarkers && info.gutterMarkers.breakpoints;
    cm.setGutterMarker(lineIndex, "breakpoints", has ? null : marker());
    onBreakpointsChange(breakpoints());
  }

  cm.on("gutterClick", (_editor, lineIndex) => toggleBreakpoint(lineIndex));
  cm.on("changes", () => {
    clearMark("error");
    onChange(cm.getValue());
  });

  function clearMark(kind) {
    if (marks[kind] !== null) {
      cm.removeLineClass(marks[kind], "wrap", lineClass[kind]);
      marks[kind] = null;
    }
  }

  function setMark(kind, line) {
    clearMark(kind);
    if (!line || line < 1 || line > cm.lineCount()) return;
    marks[kind] = cm.addLineClass(line - 1, "wrap", lineClass[kind]);
    cm.scrollIntoView({ line: line - 1, ch: 0 }, 80);
  }

  return {
    getValue: () => cm.getValue(),
    setValue(text, lines = []) {
      cm.setValue(text);
      cm.clearHistory();
      for (const line of lines) {
        if (line >= 1 && line <= cm.lineCount()) cm.setGutterMarker(line - 1, "breakpoints", marker());
      }
      onBreakpointsChange(breakpoints());
    },
    breakpoints,
    setReadOnly(readOnly) {
      cm.setOption("readOnly", readOnly);
      element.classList.toggle("is-readonly", readOnly);
    },
    setCurrentLine: (line) => setMark("current", line),
    setFrameLine: (line) => setMark("frame", line),
    setErrorLine: (line) => setMark("error", line),
    clearMarks() {
      clearMark("current");
      clearMark("frame");
      clearMark("error");
    },
    refresh: () => cm.refresh(),
    focus: () => cm.focus(),
  };
}
