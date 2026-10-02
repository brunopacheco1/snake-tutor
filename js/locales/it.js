// SPDX-License-Identifier: Apache-2.0
// Italian catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "it", name: "Italiano", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Esegui uno script Python riga per riga, direttamente nel tuo browser.",
  "pane.script": "Script",
  "file.open": "Apri…",
  "file.openTitle": "Apri un file .py dal tuo computer",
  "file.download": "Scarica",
  "file.downloadTitle": "Salva questo script come file .py",
  "file.example": "Esempio",
  "file.exampleTitle": "Sostituisci lo script con l’esempio",
  "file.dropHint": "Trascina qui il tuo file .py",
  "file.confirmReplace": "Sostituire il tuo script con l’esempio?",
  "file.stopFirst": "Arresta il programma prima di aprire un altro file.",
  "file.notPython": "«{file}» non è un file Python (.py).",
  "file.tooLarge": "«{file}» è più grande di 1 MB: scegli uno script più piccolo.",
  "layout.resize": "Trascina per ridimensionare",
  "lang.label": "Lingua",
  "lang.auto": "Automatica ({language})",
  "lang.beta": "{language} (beta)",
  "lang.report": "Segnala un problema di traduzione",
  "lang.reportTitle": "Apre GitHub in una nuova scheda — per segnalare ti serve un account GitHub",
  "lang.changed": "Lingua: {language}",
  "controls.label": "Controlli di debug",
  "controls.start": "Avvia",
  "controls.startTitle": "Avvia (F5) — esegui il programma dall’inizio",
  "controls.continue": "Continua",
  "controls.continueTitle": "Continua (F5) — esegui fino al prossimo punto di interruzione",
  "controls.stepOver": "Esegui istruzione/routine",
  "controls.stepOverTitle": "Esegui istruzione/routine (F10) — esegui questa riga",
  "controls.stepInto": "Esegui istruzione",
  "controls.stepIntoTitle": "Esegui istruzione (F11) — entra nella funzione",
  "controls.stepOut": "Esci da istruzione/routine",
  "controls.stepOutTitle": "Esci da istruzione/routine (Shift+F11) — completa questa funzione",
  "controls.restart": "Riavvia",
  "controls.restartTitle": "Riavvia (Ctrl/Cmd+Shift+F5) — arresta ed esegui di nuovo dall’inizio",
  "controls.stop": "Arresta",
  "controls.stopTitle": "Arresta (Shift+F5) — termina subito il programma",
  "status.loading": "Caricamento…",
  "status.preparing": "Preparazione…",
  "status.loadingPython": "Caricamento di Python…",
  "status.downloading": "Download di Python…",
  "status.startingDebugger": "Avvio del debugger…",
  "status.restarting": "Riavvio di Python…",
  "status.readyHtml": "Pronto — premi <strong>{start}</strong> (F5) per avviare il debug.",
  "status.runningHtml": "<strong>In esecuzione…</strong> premi {stop} (Shift+F5) per terminare il programma.",
  "status.pausedHtml": "<strong>In pausa prima della riga {line}.</strong> {stepOver} (F10) la esegue.",
  "status.inputHtml": "<strong>In attesa di input</strong> — scrivi nella console e premi Invio.",
  "status.errorHtml": "<strong>{type}</strong>. Correggi l’errore e premi di nuovo {start} (F5).",
  "status.errorAtLineHtml": "<strong>{type}</strong> alla riga {line}. Correggi l’errore e premi di nuovo {start} (F5).",
  "status.pythonFailedHtml": "<strong>Impossibile caricare Python.</strong> Ricarica la pagina per riprovare.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Console",
  "console.outputLabel": "Output della console",
  "console.inputLabel": "Scrivi la tua risposta e premi Invio",
  "console.finished": "Programma terminato.",
  "console.stopped": "Programma arrestato.",
  "console.syntaxError": "Python non ha capito il codice, quindi il programma non è partito (vedi il messaggio rosso qui sopra).",
  "console.syntaxErrorAtLine": "Python non ha capito il codice alla riga {line}, quindi il programma non è partito (vedi il messaggio rosso qui sopra).",
  "console.runtimeError": "Il programma si è fermato a causa di un errore (vedi il messaggio rosso qui sopra).",
  "console.runtimeErrorAtLine": "Il programma si è fermato a causa di un errore alla riga {line} (vedi il messaggio rosso qui sopra).",
  "console.fatal": "Impossibile avviare Python: {error}. Controlla la connessione a Internet e ricarica la pagina.",
  "vars.title": "Memoria",
  "vars.hint": "Le variabili compaiono qui quando il programma è in pausa.",
  "vars.returned": "↩ {function}() ha restituito {value}",
  "vars.callStack": "Stack di chiamate",
  "vars.mainProgram": "programma principale",
  "vars.line": "riga {line}",
  "vars.variables": "Variabili",
  "vars.locals": "Variabili locali — {function}()",
  "vars.globals": "Variabili globali",
  "vars.noneYet": "Ancora nessuna variabile.",
  "vars.none": "Nessuna.",
  "vars.more": {"one": "… e {count} altro", "other": "… e altri {count}"},
  "editor.breakpointTitle": "Punto di interruzione (clic per rimuoverlo)",
  "blocker.title": "Snake Tutor non può avviarsi in questa finestra del browser",
  "blocker.fromDiskHtml": "Questa pagina è stata aperta direttamente da un file, quindi Python non può funzionare. Aprila invece da un indirizzo web: esegui <code>python3 -m http.server</code> nella sua cartella, poi apri <code>http://localhost:8000</code>.",
  "blocker.isolation": "Snake Tutor non è riuscito ad attivare una funzione del browser che gli serve per eseguire Python. Ricarica la pagina ed evita le finestre private o in incognito.",
  "blocker.reload": "Ricarica",
};

export const sample = `# Benvenuto in Snake Tutor!
# Premi «Avvia» (F5), poi «Esegui istruzione/routine» (F10) per eseguire una riga alla volta.
# Osserva la riga evidenziata e il pannello Memoria mentre procedi.

def greet(name):
    message = "Ciao, " + name + "!"
    return message

name = input("Come ti chiami? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("Il totale è", total)
`;
