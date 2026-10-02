// SPDX-License-Identifier: Apache-2.0
// French catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "fr", name: "Français", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Exécute un script Python ligne par ligne, directement dans ton navigateur.",
  "pane.script": "Script",
  "file.open": "Ouvrir…",
  "file.openTitle": "Ouvrir un fichier .py depuis ton ordinateur",
  "file.download": "Télécharger",
  "file.downloadTitle": "Enregistrer ce script dans un fichier .py",
  "file.example": "Exemple",
  "file.exampleTitle": "Remplacer le script par l’exemple",
  "file.dropHint": "Dépose ton fichier .py ici",
  "file.confirmReplace": "Remplacer ton script par l’exemple ?",
  "file.stopFirst": "Arrête le programme avant d’ouvrir un autre fichier.",
  "file.notPython": "« {file} » n’est pas un fichier Python (.py).",
  "file.tooLarge": "« {file} » dépasse 1 Mo — choisis un script plus petit.",
  "layout.resize": "Faire glisser pour redimensionner",
  "lang.label": "Langue",
  "lang.auto": "Automatique ({language})",
  "lang.beta": "{language} (bêta)",
  "lang.report": "Signaler un problème de traduction",
  "lang.reportTitle": "Ouvre GitHub dans un nouvel onglet — il te faut un compte GitHub pour signaler un problème",
  "controls.label": "Commandes de débogage",
  "controls.start": "Démarrer",
  "controls.startTitle": "Démarrer (F5) — exécuter le programme depuis le début",
  "controls.continue": "Continuer",
  "controls.continueTitle": "Continuer (F5) — exécuter jusqu’au prochain point d’arrêt",
  "controls.stepOver": "Pas à pas principal",
  "controls.stepOverTitle": "Pas à pas principal (F10) — exécuter cette ligne",
  "controls.stepInto": "Pas à pas détaillé",
  "controls.stepIntoTitle": "Pas à pas détaillé (F11) — entrer dans la fonction",
  "controls.stepOut": "Pas à pas sortant",
  "controls.stepOutTitle": "Pas à pas sortant (Shift+F11) — terminer cette fonction",
  "controls.restart": "Redémarrer",
  "controls.restartTitle": "Redémarrer (Ctrl/Cmd+Shift+F5) — arrêter et relancer depuis le début",
  "controls.stop": "Arrêter",
  "controls.stopTitle": "Arrêter (Shift+F5) — terminer le programme maintenant",
  "status.loading": "Chargement…",
  "status.preparing": "Préparation…",
  "status.loadingPython": "Chargement de Python…",
  "status.downloading": "Téléchargement de Python…",
  "status.startingDebugger": "Démarrage du débogueur…",
  "status.restarting": "Redémarrage de Python…",
  "status.readyHtml": "Prêt — appuie sur <strong>{start}</strong> (F5) pour déboguer.",
  "status.runningHtml": "<strong>Exécution…</strong> appuie sur {stop} (Shift+F5) pour arrêter le programme.",
  "status.pausedHtml": "<strong>En pause avant la ligne {line}.</strong> {stepOver} (F10) l’exécute.",
  "status.inputHtml": "<strong>En attente d’une saisie</strong> — tape dans la console et appuie sur Entrée.",
  "status.errorHtml": "<strong>{type}</strong>. Corrige l’erreur et appuie de nouveau sur {start} (F5).",
  "status.errorAtLineHtml": "<strong>{type}</strong> à la ligne {line}. Corrige l’erreur et appuie de nouveau sur {start} (F5).",
  "status.pythonFailedHtml": "<strong>Python n’a pas pu être chargé.</strong> Recharge la page pour réessayer.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Console",
  "console.outputLabel": "Sortie de la console",
  "console.inputLabel": "Tape ta réponse et appuie sur Entrée",
  "console.finished": "Programme terminé.",
  "console.stopped": "Programme arrêté.",
  "console.syntaxError": "Python n’a pas compris le code, le programme n’a donc pas démarré (voir le message en rouge ci-dessus).",
  "console.syntaxErrorAtLine": "Python n’a pas compris le code à la ligne {line}, le programme n’a donc pas démarré (voir le message en rouge ci-dessus).",
  "console.runtimeError": "Le programme s’est arrêté à cause d’une erreur (voir le message en rouge ci-dessus).",
  "console.runtimeErrorAtLine": "Le programme s’est arrêté à cause d’une erreur à la ligne {line} (voir le message en rouge ci-dessus).",
  "console.fatal": "Impossible de démarrer Python : {error}. Vérifie ta connexion Internet et recharge la page.",
  "vars.title": "Mémoire",
  "vars.hint": "Les variables apparaissent ici lorsque le programme est en pause.",
  "vars.returned": "↩ {function}() a renvoyé {value}",
  "vars.callStack": "Pile des appels",
  "vars.mainProgram": "programme principal",
  "vars.line": "ligne {line}",
  "vars.variables": "Variables",
  "vars.locals": "Variables locales — {function}()",
  "vars.globals": "Variables globales",
  "vars.noneYet": "Pas encore de variables.",
  "vars.none": "Aucune.",
  "vars.more": {"one": "… et {count} de plus", "other": "… et {count} de plus"},
  "editor.breakpointTitle": "Point d’arrêt (clique pour le supprimer)",
  "blocker.title": "Snake Tutor ne peut pas démarrer dans cette fenêtre du navigateur",
  "blocker.fromDiskHtml": "La page a été ouverte directement depuis ton disque. Sers plutôt le dossier avec un serveur, par exemple avec <code>python3 -m http.server</code>, puis ouvre <code>http://localhost:8000</code>.",
  "blocker.isolation": "Snake Tutor exécute Python dans ton navigateur et a besoin d’une fonctionnalité appelée isolation cross-origin, qu’un petit assistant (un service worker) active au premier chargement de la page. Elle ne s’est pas activée ici. Recharge la page et évite les fenêtres de navigation privée, qui bloquent cet assistant.",
  "blocker.reload": "Recharger",
};

export const sample = `# Bienvenue dans Snake Tutor !
# Appuie sur « Démarrer » (F5), puis sur « Pas à pas principal » (F10) pour exécuter une ligne à la fois.
# Observe la ligne surlignée et le panneau Mémoire au fur et à mesure.

def greet(name):
    message = "Bonjour, " + name + " !"
    return message

name = input("Comment t’appelles-tu ? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("Le total est de", total)
`;
