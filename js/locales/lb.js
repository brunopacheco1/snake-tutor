// SPDX-License-Identifier: Apache-2.0
// Luxembourgish catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "lb", name: "Lëtzebuergesch", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Féier e Python-Skript Zeil fir Zeil aus, direkt an dengem Browser.",
  "pane.script": "Skript",
  "file.open": "Opmaachen…",
  "file.openTitle": "Eng .py-Datei vun dengem Computer opmaachen",
  "file.download": "Eroflueden",
  "file.downloadTitle": "Dëse Skript als .py-Datei späicheren",
  "file.example": "Beispill",
  "file.exampleTitle": "De Skript duerch d’Beispill ersetzen",
  "file.dropHint": "Zéi deng .py-Datei heihin",
  "file.confirmReplace": "Däi Skript duerch d’Beispill ersetzen?",
  "file.stopFirst": "Stopp de Programm, ier s de eng aner Datei opmëss.",
  "file.notPython": "„{file}“ ass keng Python-Datei (.py).",
  "file.tooLarge": "„{file}“ ass méi grouss wéi 1 MB – wiel w.e.g. e méi klenge Skript.",
  "layout.resize": "Zéien, fir d’Gréisst z’änneren",
  "lang.label": "Sprooch",
  "lang.auto": "Automatesch ({language})",
  "lang.beta": "{language} (Beta)",
  "lang.report": "E Feeler an der Iwwersetzung mellen",
  "lang.reportTitle": "Mécht GitHub an engem neien Tab op – fir e Feeler ze mellen, brauchs de e GitHub-Kont",
  "controls.label": "Debug-Steierung",
  "controls.start": "Starten",
  "controls.startTitle": "Starten (F5) – de Programm vu vir un ausféieren",
  "controls.continue": "Weider",
  "controls.continueTitle": "Weider (F5) – bis bei den nächsten Haltepunkt ausféieren",
  "controls.stepOver": "Iwwersprangen",
  "controls.stepOverTitle": "Iwwersprangen (F10) – dës Zeil ausféieren",
  "controls.stepInto": "Erageen",
  "controls.stepIntoTitle": "Erageen (F11) – an d’Funktioun erageen",
  "controls.stepOut": "Erausgoen",
  "controls.stepOutTitle": "Erausgoen (Shift+F11) – dës Funktioun fäerdeg ausféieren",
  "controls.restart": "Nei starten",
  "controls.restartTitle": "Nei starten (Ctrl/Cmd+Shift+F5) – stoppen an nach eng Kéier vu vir un ausféieren",
  "controls.stop": "Stoppen",
  "controls.stopTitle": "Stoppen (Shift+F5) – de Programm elo ophalen",
  "status.loading": "Gëtt gelueden…",
  "status.preparing": "Gëtt virbereet…",
  "status.loadingPython": "Python gëtt gelueden…",
  "status.downloading": "Python gëtt erofgelueden…",
  "status.startingDebugger": "Debugger gëtt gestart…",
  "status.restarting": "Python gëtt nei gestart…",
  "status.readyHtml": "Prett – dréck op <strong>{start}</strong> (F5), fir ze debuggen.",
  "status.runningHtml": "<strong>Leeft…</strong> Dréck op {stop} (Shift+F5), fir de Programm opzehalen.",
  "status.pausedHtml": "<strong>Ugehale virun der Zeil {line}.</strong> {stepOver} (F10) féiert se aus.",
  "status.inputHtml": "<strong>Waart op eng Äntwert</strong> – tipp an d’Konsol an dréck op Enter.",
  "status.errorHtml": "<strong>{type}</strong>. Verbesser de Feeler an dréck nach eng Kéier op {start} (F5).",
  "status.errorAtLineHtml": "<strong>{type}</strong> an der Zeil {line}. Verbesser de Feeler an dréck nach eng Kéier op {start} (F5).",
  "status.pythonFailedHtml": "<strong>Python konnt net geluede ginn.</strong> Lued d’Säit nei, fir et nach eng Kéier ze probéieren.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Konsol",
  "console.outputLabel": "Ausgab vun der Konsol",
  "console.inputLabel": "Tipp deng Äntwert an dréck op Enter",
  "console.finished": "Programm fäerdeg.",
  "console.stopped": "Programm gestoppt.",
  "console.syntaxError": "Python huet de Code net verstanen, dofir ass de Programm net gestart (kuck déi rout Meldung uewendriwwer).",
  "console.syntaxErrorAtLine": "Python huet de Code an der Zeil {line} net verstanen, dofir ass de Programm net gestart (kuck déi rout Meldung uewendriwwer).",
  "console.runtimeError": "De Programm ass wéinst engem Feeler stoe bliwwen (kuck déi rout Meldung uewendriwwer).",
  "console.runtimeErrorAtLine": "De Programm ass wéinst engem Feeler an der Zeil {line} stoe bliwwen (kuck déi rout Meldung uewendriwwer).",
  "console.fatal": "Python konnt net gestart ginn: {error}. Kontrolléier deng Internetverbindung a lued d’Säit nei.",
  "vars.title": "Späicher",
  "vars.hint": "D’Variabelen erschéngen hei, wann de Programm ugehalen ass.",
  "vars.returned": "↩ {function}() huet {value} zréckginn",
  "vars.callStack": "Opruff-Stack",
  "vars.mainProgram": "Haaptprogramm",
  "vars.line": "Zeil {line}",
  "vars.variables": "Variabelen",
  "vars.locals": "Lokal Variabelen – {function}()",
  "vars.globals": "Global Variabelen",
  "vars.noneYet": "Nach keng Variabelen.",
  "vars.none": "Keng.",
  "vars.more": {"one": "… nach {count}", "other": "… nach {count}"},
  "editor.breakpointTitle": "Haltepunkt (klick, fir en ewechzehuelen)",
  "blocker.title": "Snake Tutor kann an dëser Browserfënster net starten",
  "blocker.fromDiskHtml": "D’Säit gouf direkt vun denger Festplack opgemaach. Stell den Dossier amplaz iwwer e Server zur Verfügung, zum Beispill mat <code>python3 -m http.server</code>, a maach dann <code>http://localhost:8000</code> op.",
  "blocker.isolation": "Snake Tutor féiert Python an dengem Browser aus a brauch dofir eng Funktioun, déi Cross-Origin-Isolatioun heescht. E klengen Helfer (e Service Worker) schalt se un, wann d’Säit déi éischte Kéier gelueden gëtt. Dat huet hei net geklappt. Lued d’Säit nei a vermeit privat / Inkognito-Fënsteren, well déi den Helfer blockéieren.",
  "blocker.reload": "Nei lueden",
};

export const sample = `# Wëllkomm bei Snake Tutor!
# Dréck op „Starten“ (F5) an dann op „Iwwersprangen“ (F10), fir eng Zeil no der anerer auszeféieren.
# Kuck dobäi op déi markéiert Zeil an op de Beräich „Späicher“.

def greet(name):
    message = "Moien, " + name + "!"
    return message

name = input("Wéi heeschs du? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("Am Ganzen:", total)
`;
