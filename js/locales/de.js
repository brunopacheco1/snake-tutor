// SPDX-License-Identifier: Apache-2.0
// German catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "de", name: "Deutsch", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Führe ein Python-Skript Zeile für Zeile aus – direkt in deinem Browser.",
  "pane.script": "Skript",
  "file.open": "Öffnen…",
  "file.openTitle": "Eine .py-Datei von deinem Computer öffnen",
  "file.download": "Herunterladen",
  "file.downloadTitle": "Dieses Skript als .py-Datei speichern",
  "file.example": "Beispiel",
  "file.exampleTitle": "Das Skript durch das Beispiel ersetzen",
  "file.dropHint": "Lege deine .py-Datei hier ab",
  "file.confirmReplace": "Dein Skript durch das Beispiel ersetzen?",
  "file.stopFirst": "Stoppe das Programm, bevor du eine andere Datei öffnest.",
  "file.notPython": "„{file}“ ist keine Python-Datei (.py).",
  "file.tooLarge": "„{file}“ ist größer als 1 MB – bitte wähle ein kleineres Skript.",
  "layout.resize": "Ziehen, um die Größe zu ändern",
  "lang.label": "Sprache",
  "lang.auto": "Automatisch ({language})",
  "lang.beta": "{language} (Beta)",
  "lang.report": "Übersetzungsfehler melden",
  "lang.reportTitle": "Öffnet GitHub in einem neuen Tab – zum Melden brauchst du ein GitHub-Konto",
  "lang.changed": "Sprache: {language}",
  "controls.label": "Debug-Steuerung",
  "controls.start": "Starten",
  "controls.startTitle": "Starten (F5) – das Programm von Anfang an ausführen",
  "controls.continue": "Weiter",
  "controls.continueTitle": "Weiter (F5) – bis zum nächsten Haltepunkt ausführen",
  "controls.stepOver": "Prozedurschritt",
  "controls.stepOverTitle": "Prozedurschritt (F10) – diese Zeile ausführen",
  "controls.stepInto": "Einzelschritt",
  "controls.stepIntoTitle": "Einzelschritt (F11) – in die Funktion hineingehen",
  "controls.stepOut": "Ausführen bis Rücksprung",
  "controls.stepOutTitle": "Ausführen bis Rücksprung (Shift+F11) – diese Funktion zu Ende ausführen",
  "controls.restart": "Neu starten",
  "controls.restartTitle": "Neu starten (Ctrl/Cmd+Shift+F5) – stoppen und von vorne ausführen",
  "controls.stop": "Stopp",
  "controls.stopTitle": "Stopp (Shift+F5) – das Programm sofort beenden",
  "status.loading": "Wird geladen…",
  "status.preparing": "Wird vorbereitet…",
  "status.loadingPython": "Python wird geladen…",
  "status.downloading": "Python wird heruntergeladen…",
  "status.startingDebugger": "Debugger wird gestartet…",
  "status.restarting": "Python wird neu gestartet…",
  "status.readyHtml": "Bereit – drücke <strong>{start}</strong> (F5), um zu debuggen.",
  "status.runningHtml": "<strong>Läuft…</strong> Drücke {stop} (Shift+F5), um das Programm zu beenden.",
  "status.pausedHtml": "<strong>Angehalten vor Zeile {line}.</strong> {stepOver} (F10) führt sie aus.",
  "status.inputHtml": "<strong>Wartet auf Eingabe</strong> – tippe in die Konsole und drücke die Eingabetaste.",
  "status.errorHtml": "<strong>{type}</strong>. Behebe den Fehler und drücke erneut {start} (F5).",
  "status.errorAtLineHtml": "<strong>{type}</strong> in Zeile {line}. Behebe den Fehler und drücke erneut {start} (F5).",
  "status.pythonFailedHtml": "<strong>Python konnte nicht geladen werden.</strong> Lade die Seite neu, um es noch einmal zu versuchen.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Konsole",
  "console.outputLabel": "Konsolenausgabe",
  "console.inputLabel": "Tippe deine Antwort und drücke die Eingabetaste",
  "console.finished": "Programm beendet.",
  "console.stopped": "Programm gestoppt.",
  "console.syntaxError": "Python konnte den Code nicht verstehen, deshalb wurde das Programm nicht gestartet (siehe die rote Meldung oben).",
  "console.syntaxErrorAtLine": "Python konnte den Code in Zeile {line} nicht verstehen, deshalb wurde das Programm nicht gestartet (siehe die rote Meldung oben).",
  "console.runtimeError": "Das Programm wurde wegen eines Fehlers angehalten (siehe die rote Meldung oben).",
  "console.runtimeErrorAtLine": "Das Programm wurde wegen eines Fehlers in Zeile {line} angehalten (siehe die rote Meldung oben).",
  "console.fatal": "Python konnte nicht gestartet werden: {error}. Prüfe deine Internetverbindung und lade die Seite neu.",
  "vars.title": "Speicher",
  "vars.hint": "Variablen erscheinen hier, während das Programm angehalten ist.",
  "vars.returned": "↩ {function}() hat {value} zurückgegeben",
  "vars.callStack": "Aufrufliste",
  "vars.mainProgram": "Hauptprogramm",
  "vars.line": "Zeile {line}",
  "vars.variables": "Variablen",
  "vars.locals": "Lokale Variablen – {function}()",
  "vars.globals": "Globale Variablen",
  "vars.noneYet": "Noch keine Variablen.",
  "vars.none": "Keine.",
  "vars.more": {"one": "… {count} weiteres", "other": "… {count} weitere"},
  "editor.breakpointTitle": "Haltepunkt (zum Entfernen klicken)",
  "blocker.title": "Snake Tutor kann in diesem Browserfenster nicht starten",
  "blocker.fromDiskHtml": "Diese Seite wurde direkt aus einer Datei geöffnet, deshalb kann Python nicht laufen. Öffne sie stattdessen über eine Webadresse: Führe in ihrem Ordner <code>python3 -m http.server</code> aus und öffne dann <code>http://localhost:8000</code>.",
  "blocker.isolation": "Snake Tutor konnte eine Browserfunktion nicht einschalten, die es zum Ausführen von Python braucht. Lade die Seite neu und vermeide private oder Inkognito-Fenster.",
  "blocker.reload": "Neu laden",
};

export const sample = `# Willkommen bei Snake Tutor!
# Drücke „Starten“ (F5) und dann „Prozedurschritt“ (F10), um eine Zeile nach der anderen auszuführen.
# Beobachte dabei die hervorgehobene Zeile und den Bereich „Speicher“.

def greet(name):
    message = "Hallo, " + name + "!"
    return message

name = input("Wie heißt du? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("Die Summe ist", total)
`;
