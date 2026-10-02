// SPDX-License-Identifier: Apache-2.0
// Main-thread side of the page ⇄ worker protocol.
export const Cmd = {
  CONTINUE: 1,
  STEP_OVER: 2,
  STEP_INTO: 3,
  STEP_OUT: 4,
  STOP: 5,
  INPUT: 6,
  BREAKPOINTS: 7,
};

const encoder = new TextEncoder();

export class Runner {
  constructor(onMessage) {
    this.onMessage = onMessage;
    this.control = new Int32Array(new SharedArrayBuffer(16));
    this.data = new Uint8Array(new SharedArrayBuffer(1 << 20));
    this.interrupt = new Uint8Array(new SharedArrayBuffer(1));
    this.spawn();
  }

  spawn() {
    this.worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    this.worker.onmessage = (event) => this.onMessage(event.data);
    this.worker.onerror = (event) => this.onMessage({ type: "fatal", text: event.message });
    this.worker.postMessage({
      type: "init",
      control: this.control,
      data: this.data,
      interrupt: this.interrupt,
    });
  }

  start(source, breakpoints, name) {
    this.worker.postMessage({ type: "start", source, breakpoints, name });
  }

  send(code, payload = "") {
    const bytes = encoder.encode(payload).subarray(0, this.data.length);
    this.data.set(bytes);
    this.control[1] = code;
    this.control[2] = bytes.length;
    Atomics.store(this.control, 0, 1);
    Atomics.notify(this.control, 0);
  }

  // `running` = the program is executing freely, so only an interrupt can reach it.
  stop(running) {
    if (running) this.interrupt[0] = 2; // SIGINT -> KeyboardInterrupt
    this.send(Cmd.STOP);
  }

  // Last resort when Python ignores Stop (e.g. stuck inside a long C call).
  hardReset() {
    this.worker.terminate();
    Atomics.store(this.control, 0, 0);
    this.interrupt[0] = 0;
    this.spawn();
  }
}
