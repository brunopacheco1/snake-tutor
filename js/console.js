// SPDX-License-Identifier: Apache-2.0
// Console pane: program output plus an inline field for input().
import { t } from "./i18n.js";

export function createConsole(element) {
  const output = document.createElement("div");
  output.className = "console-output";
  element.append(output);

  let field = null;

  function write(text, kind = "stdout") {
    if (!text) return;
    const last = output.lastElementChild;
    if (last && last.dataset.kind === kind && kind !== "system") {
      last.textContent += text;
    } else {
      const span = document.createElement("span");
      span.dataset.kind = kind;
      span.className = `out-${kind}`;
      span.textContent = text;
      output.append(span);
    }
    if (field) output.append(field);
    element.scrollTop = element.scrollHeight;
  }

  function cancelInput() {
    if (field) field.remove();
    field = null;
  }

  // Shows a text field right after the prompt; calls onSubmit(line) on Enter.
  function requestInput(onSubmit) {
    cancelInput();
    field = document.createElement("input");
    field.type = "text";
    field.className = "console-input";
    // Tagged so a language switch relabels a field that is already open.
    field.dataset.i18nAriaLabel = "console.inputLabel";
    field.setAttribute("aria-label", t("console.inputLabel"));
    field.autocomplete = "off";
    field.spellcheck = false;
    field.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const line = field.value;
      cancelInput();
      write(`${line}\n`, "input");
      onSubmit(line);
    });
    output.append(field);
    element.scrollTop = element.scrollHeight;
    field.focus();
  }

  element.addEventListener("click", () => {
    if (field && !window.getSelection().toString()) field.focus();
  });

  return {
    write,
    system(text) {
      const last = output.lastElementChild;
      const needsBreak = last && !last.textContent.endsWith("\n");
      write(`${needsBreak ? "\n" : ""}${text}\n`, "system");
    },
    clear() {
      cancelInput();
      output.replaceChildren();
    },
    requestInput,
    cancelInput,
  };
}
