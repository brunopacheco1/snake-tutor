// SPDX-License-Identifier: Apache-2.0
// Interface languages: active locale, message lookup and DOM translation.
// Contract: specs/002-multi-language-ui/contracts/i18n-module.md
// Must not touch document/navigator/localStorage at import time (imported by node --test).
import * as en from "./locales/en.js";
import * as fr from "./locales/fr.js";
import * as de from "./locales/de.js";
import * as it from "./locales/it.js";
import * as ptPT from "./locales/pt-PT.js";
import * as ptBR from "./locales/pt-BR.js";
import * as lb from "./locales/lb.js";

// Selector order. Adding a language = adding its catalog here (FR-013).
const BUNDLED = [en, fr, de, it, ptPT, ptBR, lb];
const catalogs = new Map(BUNDLED.map((catalog) => [catalog.meta.code, catalog]));
const listeners = new Set();
let pref = "auto";
let active = "en";

export const LOCALES = BUNDLED.map((catalog) => catalog.meta);

export const locale = () => active;
export const preference = () => pref;

const isSupported = (code) => catalogs.has(code);

function update(nextPref, nextActive) {
  pref = nextPref;
  if (nextActive === active) return;
  active = nextActive;
  for (const listener of listeners) listener(active);
}

// ---------------------------------------------------------------- system language & preference

const STORAGE_KEY = "snake-tutor:lang";
let systemLanguages = [];
let store = null;

// First supported language in the system's preferred list (research R3).
export function resolveSystem(tags) {
  for (const tag of tags ?? []) {
    const lower = String(tag).toLowerCase();
    if (lower === "pt-br") return "pt-BR";
    const base = lower.split("-")[0];
    if (base === "pt") return "pt-PT";
    if (isSupported(base)) return base;
  }
  return "en";
}

// Key absent → "auto"; a supported code → that code; anything else is removed and read as "auto".
export function readPreference(storage = store) {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    if (value === null || value === undefined) return "auto";
    if (isSupported(value)) return value;
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (e.g. private window): behave as Automatic.
  }
  return "auto";
}

export function writePreference(value, storage = store) {
  try {
    if (value === "auto") storage?.removeItem(STORAGE_KEY);
    else storage?.setItem(STORAGE_KEY, value);
  } catch {
    // The choice still applies for this visit; it just is not remembered.
  }
}

// The locale "Automatic" stands for on this system, whatever the current preference.
export const systemLocale = () => resolveSystem(systemLanguages);

const resolve = (value) => (value === "auto" ? systemLocale() : value);

export function init({ languages, storage } = {}) {
  try {
    systemLanguages = languages ?? (navigator.languages?.length ? navigator.languages : [navigator.language]);
  } catch {
    systemLanguages = [];
  }
  try {
    store = storage === undefined ? localStorage : storage;
  } catch {
    store = null;
  }
  const value = readPreference();
  update(value, resolve(value));
  return active;
}

export function setPreference(value) {
  if (value !== "auto" && !isSupported(value)) return active;
  writePreference(value);
  update(value, resolve(value));
  return active;
}

export function onChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Lets tests (and future tooling) add a catalog without editing this file.
export function registerLocale(catalog) {
  catalogs.set(catalog.meta.code, catalog);
}

export function unregisterLocale(code) {
  if (code !== "en") catalogs.delete(code);
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function t(key, params = {}) {
  const own = catalogs.get(active)?.messages[key];
  const code = own === undefined ? "en" : active;
  let value = own ?? en.messages[key];
  if (value === undefined) return key;
  if (typeof value === "object") {
    const form = new Intl.PluralRules(code).select(Number(params.count));
    value = value[form] ?? value.other;
  }
  const html = key.endsWith("Html");
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? (html ? escapeHtml(params[name]) : String(params[name])) : match,
  );
}

export const isBeta = (code = active) => !catalogs.get(code)?.meta.reviewed;

export const sample = (code = active) => (catalogs.get(code) ?? en).sample;

export const isAnySample = (text) => [...catalogs.values()].some((c) => c.sample === text);

export function applyTranslations(root) {
  for (const el of root.querySelectorAll("[data-i18n]")) {
    const key = el.dataset.i18n;
    if (key.endsWith("Html")) el.innerHTML = t(key);
    else el.textContent = t(key);
  }
  for (const el of root.querySelectorAll("[data-i18n-title]")) el.title = t(el.dataset.i18nTitle);
  for (const el of root.querySelectorAll("[data-i18n-aria-label]")) {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  }
  if (root.documentElement) {
    root.documentElement.lang = active;
    root.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
  }
}
