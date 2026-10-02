# SPDX-License-Identifier: Apache-2.0
"""Stepping engine for Snake Tutor.

Runs a learner's script under the standard library ``bdb`` debugger and talks to the
page through the ``tutor_host`` module (registered from JavaScript):

* ``tutor_host.emit(json_text)`` sends one event to the page.
* ``tutor_host.wait()`` blocks until the page sends a command and returns
  ``"<code>\\n<payload>"``.

See specs/001-browser-debugger/contracts/worker-protocol.md.
"""

import bdb
import builtins
import json
import linecache
import os
import re
import reprlib
import sys
import traceback
import types

import tutor_host

CONTINUE, STEP_OVER, STEP_INTO, STEP_OUT, STOP, INPUT, BREAKPOINTS = range(1, 8)

MAX_VALUE_CHARS = 120
MAX_CHILDREN = 50
MAX_DEPTH = 3

_repr = reprlib.Repr()
_repr.maxstring = MAX_VALUE_CHARS
_repr.maxother = MAX_VALUE_CHARS
_repr.maxlist = _repr.maxtuple = _repr.maxset = _repr.maxfrozenset = 20
_repr.maxdict = 20
_repr.maxlevel = 3


class StopRequested(BaseException):
    """Raised inside the learner's program when the page presses Stop."""


def emit(message):
    tutor_host.emit(json.dumps(message))


def wait():
    code, _, payload = str(tutor_host.wait()).partition("\n")
    return int(code), payload


def flush():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.flush()
        except Exception:
            pass


# ---------------------------------------------------------------- snapshots

def short_repr(value):
    try:
        text = _repr.repr(value)
    except Exception as exc:  # a learner's __repr__ may itself be broken
        text = f"<repr failed: {type(exc).__name__}>"
    if len(text) > MAX_VALUE_CHARS:
        text = text[: MAX_VALUE_CHARS - 3] + "..."
    return text


def _children(value):
    """Yield (label, child) pairs for values worth expanding in the UI."""
    if isinstance(value, (str, bytes, bytearray, int, float, complex, bool, type(None))):
        return
    if isinstance(value, dict):
        for key, child in value.items():
            yield f"[{short_repr(key)}]", child
    elif isinstance(value, (list, tuple, range)):
        for index, child in enumerate(value):
            yield f"[{index}]", child
    elif isinstance(value, (set, frozenset)):
        for child in value:
            yield "·", child
    elif isinstance(value, (types.FunctionType, types.ModuleType, type)):
        return
    else:
        attrs = getattr(value, "__dict__", None)
        if isinstance(attrs, dict):
            for key, child in attrs.items():
                if not key.startswith("__"):
                    yield f".{key}", child


def snapshot(name, value, depth=0, path=()):
    if isinstance(value, types.FunctionType):
        text = f"<function {value.__name__}>"
    elif isinstance(value, type):
        text = f"<class {value.__name__}>"
    else:
        text = short_repr(value)
    var = {"name": name, "type": type(value).__name__, "value": text}
    if depth >= MAX_DEPTH or id(value) in path:
        return var
    try:
        items = _children(value)
        children = []
        more = 0
        for label, child in items:
            if len(children) < MAX_CHILDREN:
                children.append(snapshot(label, child, depth + 1, path + (id(value),)))
            else:
                more += 1
    except Exception:
        return var
    if children or more:
        var["children"] = children
        if more:
            var["more"] = more
    return var


def visible(name, value):
    return not (name.startswith("__") and name.endswith("__")) and not isinstance(
        value, types.ModuleType
    )


def frame_snapshot(frame):
    return {
        "name": frame.f_code.co_qualname if frame.f_code.co_name != "<module>" else "<module>",
        "line": frame.f_lineno,
        "locals": [
            snapshot(name, value)
            for name, value in list(frame.f_locals.items())
            if visible(name, value)
        ],
    }


# ---------------------------------------------------------------- debugger

class TutorDebugger(bdb.Bdb):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.returned = None

    def in_script(self, frame):
        return frame.f_code.co_filename == self.path

    def script_frames(self, frame):
        frames = []
        while frame is not None:
            if self.in_script(frame):
                frames.append(frame)
            frame = frame.f_back
        return frames

    def apply_breakpoints(self, lines):
        self.clear_all_file_breaks(self.path)
        for line in lines:
            # set_break returns an error string for lines that do not exist; ignore those.
            self.set_break(self.path, int(line))

    # bdb hooks ---------------------------------------------------------

    def user_line(self, frame):
        if not self.in_script(frame):
            # Stepped into library code: keep stepping until we are back in the script.
            self.set_step()
            return
        self.interaction(frame)

    def user_return(self, frame, return_value):
        if self.in_script(frame) and frame.f_code.co_name != "<module>":
            self.returned = {"name": frame.f_code.co_qualname, "value": short_repr(return_value)}

    def interaction(self, frame):
        flush()
        emit(
            {
                "type": "paused",
                "line": frame.f_lineno,
                "frames": [frame_snapshot(f) for f in self.script_frames(frame)],
                "returned": self.returned,
            }
        )
        self.returned = None
        while True:
            code, payload = wait()
            if code == BREAKPOINTS:
                self.apply_breakpoints(json.loads(payload))
                continue
            if code == STOP:
                raise StopRequested
            if code == CONTINUE:
                self.set_continue()
            elif code == STEP_OVER:
                self.set_next(frame)
            elif code == STEP_INTO:
                self.set_step()
            elif code == STEP_OUT:
                self.set_return(frame)
            else:
                continue
            break
        emit({"type": "running"})

    def tutor_input(self, prompt=""):
        sys.stdout.write(str(prompt))
        flush()
        emit({"type": "input", "prompt": str(prompt)})
        while True:
            code, payload = wait()
            if code == STOP:
                raise StopRequested
            if code == BREAKPOINTS:
                self.apply_breakpoints(json.loads(payload))
            elif code == INPUT:
                emit({"type": "running"})
                return payload


# ---------------------------------------------------------------- entry point

def _script_path(name):
    name = re.sub(r"[^\w.-]", "_", os.path.basename(name or "")) or "main.py"
    if not name.endswith(".py"):
        name += ".py"
    return os.path.join(os.path.expanduser("~"), name)


def _error(exc, path, name):
    """Plain Python-style traceback limited to the learner's own file."""
    te = traceback.TracebackException.from_exception(exc)
    te.stack = traceback.StackSummary.from_list([f for f in te.stack if f.filename == path])
    text = "".join(te.format()).replace(f'"{path}"', f'"{name}"').replace(path, name)
    line = te.stack[-1].lineno if te.stack else getattr(exc, "lineno", None)
    if isinstance(exc, SyntaxError) and exc.filename == path:
        line = exc.lineno
    return text, line


def run(source, breakpoints=(), name="main.py"):
    path = _script_path(name)
    display = os.path.basename(path)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(source)
    linecache.checkcache(path)

    debugger = TutorDebugger(path)
    original_input = builtins.input
    result = {"type": "done", "status": "ok"}
    try:
        try:
            code = compile(source, path, "exec")
        except SyntaxError as exc:
            text, line = _error(exc, path, display)
            sys.stderr.write(text)
            result = {"type": "done", "status": "error",
                      "error": {"type": type(exc).__name__, "message": exc.msg, "line": line}}
            return
        builtins.input = debugger.tutor_input
        debugger.apply_breakpoints(list(breakpoints))
        emit({"type": "running"})
        debugger.run(code, {"__name__": "__main__", "__file__": path, "__builtins__": builtins})
    except (StopRequested, KeyboardInterrupt):
        result = {"type": "done", "status": "stopped"}
    except SystemExit as exc:
        if exc.code not in (None, 0):
            sys.stderr.write(f"SystemExit: {exc.code}\n")
    except BaseException as exc:
        text, line = _error(exc, path, display)
        sys.stderr.write(text)
        result = {"type": "done", "status": "error",
                  "error": {"type": type(exc).__name__, "message": str(exc), "line": line}}
    finally:
        sys.settrace(None)
        builtins.input = original_input
        debugger.clear_all_breaks()
        flush()
        emit(result)
