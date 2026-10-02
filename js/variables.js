// SPDX-License-Identifier: Apache-2.0
// Variables panel: call stack, the selected frame's variables, and module globals.
export function createVariables(element, { onSelectFrame }) {
  const open = new Set(); // keys of expanded containers, kept across steps
  let previous = null; // values at the previous pause (null on the first pause)
  let current = null;

  // Frames are keyed from the bottom of the stack so a frame keeps its key while
  // deeper calls come and go.
  const frameKey = (frames, index) => `${frames.length - 1 - index}:${frames[index].name}`;

  function collect(map, prefix, vars) {
    for (const v of vars) {
      const key = `${prefix}/${v.name}`;
      map.set(key, v.value);
      if (v.children) collect(map, key, v.children);
    }
  }

  function renderVar(v, key) {
    const changed = previous !== null && previous.get(key) !== v.value;
    const row = document.createElement("div");
    row.className = "var-row";
    row.innerHTML = `<span class="var-name"></span><span class="var-type"></span><span class="var-value"></span>`;
    row.children[0].textContent = v.name;
    row.children[1].textContent = v.type;
    row.children[2].textContent = v.value;
    if (changed) row.classList.add("changed");

    if (!v.children) {
      row.classList.add("leaf");
      return row;
    }
    const details = document.createElement("details");
    details.open = open.has(key);
    details.addEventListener("toggle", () => (details.open ? open.add(key) : open.delete(key)));
    const summary = document.createElement("summary");
    summary.append(row);
    details.append(summary);
    const children = document.createElement("div");
    children.className = "var-children";
    for (const child of v.children) children.append(renderVar(child, `${key}/${child.name}`));
    if (v.more) {
      const more = document.createElement("div");
      more.className = "var-more";
      more.textContent = `… ${v.more} more`;
      children.append(more);
    }
    details.append(children);
    return details;
  }

  function section(title, vars, prefix, emptyText) {
    const wrap = document.createElement("section");
    wrap.className = "var-section";
    const heading = document.createElement("h3");
    heading.textContent = title;
    wrap.append(heading);
    if (!vars.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = emptyText;
      wrap.append(empty);
    }
    for (const v of vars) wrap.append(renderVar(v, `${prefix}/${v.name}`));
    return wrap;
  }

  function render(pause, selected) {
    element.replaceChildren();
    if (!pause) {
      const hint = document.createElement("p");
      hint.className = "muted";
      hint.textContent = "Variables appear here while the program is paused.";
      element.append(hint);
      return;
    }
    const { frames } = pause;

    if (pause.returned) {
      const ret = document.createElement("div");
      ret.className = "returned";
      ret.textContent = `↩ ${pause.returned.name}() returned ${pause.returned.value}`;
      element.append(ret);
    }

    const stack = document.createElement("section");
    stack.className = "var-section";
    stack.innerHTML = `<h3>Call stack</h3>`;
    const list = document.createElement("ol");
    list.className = "stack";
    frames.forEach((frame, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === selected ? "frame selected" : "frame";
      button.innerHTML = `<span class="frame-name"></span><span class="frame-line"></span>`;
      button.children[0].textContent = frame.name === "<module>" ? "main program" : `${frame.name}()`;
      button.children[1].textContent = `line ${frame.line}`;
      button.addEventListener("click", () => onSelectFrame(index));
      item.append(button);
      list.append(item);
    });
    stack.append(list);
    element.append(stack);

    const frame = frames[selected];
    const isModule = selected === frames.length - 1;
    element.append(
      section(
        isModule ? "Variables" : `Local variables — ${frame.name}()`,
        frame.locals,
        frameKey(frames, selected),
        "No variables yet.",
      ),
    );
    if (!isModule) {
      const module = frames.length - 1;
      element.append(section("Global variables", frames[module].locals, frameKey(frames, module), "None."));
    }
  }

  return {
    // Call once per pause: remembers values so the next pause can highlight changes.
    update(pause, selected = 0) {
      previous = current;
      current = new Map();
      if (pause) pause.frames.forEach((f, i) => collect(current, frameKey(pause.frames, i), f.locals));
      render(pause, selected);
    },
    select(pause, selected) {
      render(pause, selected);
    },
    reset() {
      previous = null;
      current = null;
      open.clear();
      render(null);
    },
  };
}
