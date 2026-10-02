// SPDX-License-Identifier: Apache-2.0
// Language logic and catalog checks for js/i18n.js and js/locales/*.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as i18n from "../js/i18n.js";
import * as en from "../js/locales/en.js";

const { t } = i18n;

// ---------------------------------------------------------------- t()

test("t() looks up English text", () => {
  i18n.setPreference("en");
  assert.equal(t("controls.stepOver"), "Step Over");
});

test("t() substitutes parameters", () => {
  assert.equal(t("vars.line", { line: 7 }), "line 7");
  assert.equal(t("vars.locals", { function: "greet" }), "Local variables — greet()");
});

test("t() escapes parameters of Html keys only", () => {
  const html = t("status.errorHtml", { type: "<b>X</b>", start: "Start" });
  assert.match(html, /&lt;b&gt;X&lt;\/b&gt;/);
  assert.match(html, /^<strong>/);
  assert.equal(t("file.notPython", { file: "<a>.txt" }), '"<a>.txt" is not a Python (.py) file.');
});

test("t() picks plural forms", () => {
  assert.equal(t("vars.more", { count: 1 }), "… 1 more");
  assert.equal(t("vars.more", { count: 5 }), "… 5 more");
});

test("t() falls back to English for a key missing in the active catalog", () => {
  i18n.registerLocale({ meta: { code: "x-test", name: "Test", reviewed: false }, messages: { "controls.stop": "HALT" } });
  i18n.setPreference("x-test");
  assert.equal(t("controls.stop"), "HALT");
  assert.equal(t("controls.start"), "Start");
  i18n.unregisterLocale("x-test");
  i18n.setPreference("en");
});

test("only Html keys contain markup in English", () => {
  for (const [key, value] of Object.entries(en.messages)) {
    if (key.endsWith("Html")) continue;
    for (const text of typeof value === "string" ? [value] : Object.values(value)) {
      assert.ok(!text.includes("<"), `${key} must not contain markup`);
    }
  }
});

// ---------------------------------------------------------------- US1: catalogs

const CODES = ["en", "fr", "de", "it", "pt-PT", "pt-BR", "lb"];
const NAMES = ["English", "Français", "Deutsch", "Italiano", "Português (Portugal)", "Português (Brasil)", "Lëtzebuergesch"];
const catalogs = await Promise.all(CODES.map((code) => import(`../js/locales/${code}.js`).catch(() => null)));
const forms = (value) => (typeof value === "string" ? [value] : Object.values(value));
const placeholders = (text) => new Set(text.match(/\{\w+\}/g) ?? []);
const SHORTCUTS = ["Shift+F11", "Shift+F5", "Ctrl/Cmd+Shift+F5", "F5", "F10", "F11"];

CODES.forEach((code, index) => {
  test(`${code} catalog is complete and well-formed`, () => {
    const catalog = catalogs[index];
    assert.ok(catalog, `js/locales/${code}.js must exist`);
    assert.deepEqual(catalog.meta.code, code);
    assert.equal(catalog.meta.name, NAMES[index]);
    assert.deepEqual(Object.keys(catalog.messages).sort(), Object.keys(en.messages).sort());
    for (const [key, english] of Object.entries(en.messages)) {
      const value = catalog.messages[key];
      if (typeof english === "object") {
        assert.equal(typeof value, "object", `${code} ${key} must have plural forms`);
        assert.ok(value.other, `${code} ${key} needs an "other" form`);
      }
      const wanted = placeholders(forms(english).join(" "));
      for (const text of forms(value)) {
        assert.ok(text.trim(), `${code} ${key} is empty`);
        for (const p of wanted) assert.ok(text.includes(p), `${code} ${key} is missing ${p}`);
        const tags = text.match(/<\/?[a-z]+[^>]*>/g) ?? [];
        if (!key.endsWith("Html")) assert.equal(tags.length, 0, `${code} ${key} must not contain markup`);
        for (const tag of tags) assert.match(tag, /^<\/?(strong|code)>$/, `${code} ${key} has disallowed markup ${tag}`);
      }
      // Shortcuts are never translated (FR-005).
      const englishText = forms(english).join(" ");
      for (const shortcut of SHORTCUTS) {
        if (englishText.includes(shortcut)) {
          for (const text of forms(value)) assert.ok(text.includes(shortcut), `${code} ${key} must keep ${shortcut}`);
        }
      }
    }
  });
});

test("LOCALES lists every language in selector order", () => {
  assert.deepEqual(i18n.LOCALES.map((m) => m.code), CODES);
  assert.equal(i18n.isBeta("en"), false);
});

// ---------------------------------------------------------------- US1: switching

test("setPreference switches language and notifies once", () => {
  i18n.setPreference("en");
  const seen = [];
  const off = i18n.onChange((code) => seen.push(code));
  assert.equal(i18n.setPreference("fr"), "fr");
  assert.equal(i18n.locale(), "fr");
  assert.equal(t("controls.stop"), catalogs[1].messages["controls.stop"]);
  i18n.setPreference("fr");
  i18n.setPreference("xx");
  assert.equal(i18n.locale(), "fr");
  assert.deepEqual(seen, ["fr"]);
  off();
  i18n.setPreference("en");
});

// ---------------------------------------------------------------- US2: system language

test("resolveSystem maps system languages to supported locales", () => {
  const cases = [
    [["pt-BR"], "pt-BR"], [["pt-br"], "pt-BR"], [["pt-PT"], "pt-PT"], [["pt"], "pt-PT"], [["pt-AO"], "pt-PT"],
    [["lb-LU", "de"], "lb"], [["de-LU"], "de"], [["fr-LU"], "fr"], [["fr-CA"], "fr"], [["it-CH"], "it"],
    [["es", "it"], "it"], [["es"], "en"], [[], "en"], [undefined, "en"], [["EN-gb"], "en"],
  ];
  for (const [tags, expected] of cases) assert.equal(i18n.resolveSystem(tags), expected, JSON.stringify(tags));
});

// ---------------------------------------------------------------- US2: persisted preference

const KEY = "snake-tutor:lang";
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}
const brokenStorage = {
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
};

test("readPreference / writePreference follow the stored-state rules", () => {
  assert.equal(i18n.readPreference(memoryStorage()), "auto");
  assert.equal(i18n.readPreference(memoryStorage({ [KEY]: "it" })), "it");
  const corrupt = memoryStorage({ [KEY]: "xx" });
  assert.equal(i18n.readPreference(corrupt), "auto");
  assert.equal(corrupt.map.has(KEY), false);
  assert.equal(i18n.readPreference(brokenStorage), "auto");

  const store = memoryStorage({ [KEY]: "it" });
  i18n.writePreference("auto", store);
  assert.equal(store.map.has(KEY), false);
  i18n.writePreference("de", store);
  assert.equal(store.map.get(KEY), "de");
  assert.doesNotThrow(() => i18n.writePreference("fr", brokenStorage));
});

test("init and setPreference combine system language and stored choice", () => {
  const store = memoryStorage();
  assert.equal(i18n.init({ languages: ["de-AT"], storage: store }), "de");
  assert.equal(i18n.preference(), "auto");

  store.map.set(KEY, "it");
  assert.equal(i18n.init({ languages: ["de-AT"], storage: store }), "it");
  assert.equal(i18n.setPreference("auto"), "de");
  assert.equal(store.map.has(KEY), false);
  assert.equal(i18n.setPreference("pt-BR"), "pt-BR");
  assert.equal(store.map.get(KEY), "pt-BR");

  // Storage blocked (private window): the choice still applies for this visit.
  assert.equal(i18n.init({ languages: ["fr"], storage: brokenStorage }), "fr");
  assert.equal(i18n.setPreference("lb"), "lb");
  assert.equal(i18n.locale(), "lb");

  i18n.init({ languages: ["en"], storage: memoryStorage() });
});

test("systemLocale reports what Automatic gives, even while a language is chosen", () => {
  const store = memoryStorage({ "snake-tutor:lang": "pt-BR" });
  assert.equal(i18n.init({ languages: ["fr-LU", "de-LU"], storage: store }), "pt-BR");
  assert.equal(i18n.systemLocale(), "fr");
  i18n.init({ languages: ["en"], storage: memoryStorage() });
});

// ---------------------------------------------------------------- US3: example programs

test("every catalog ships its own example program", () => {
  CODES.forEach((code, index) => {
    assert.equal(typeof catalogs[index].sample, "string", code);
    assert.ok(catalogs[index].sample.trim(), code);
    assert.equal(i18n.sample(code), catalogs[index].sample);
    assert.ok(i18n.isAnySample(catalogs[index].sample));
  });
  assert.equal(i18n.isAnySample("print('mine')\n"), false);
});
