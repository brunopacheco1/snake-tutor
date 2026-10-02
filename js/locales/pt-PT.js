// SPDX-License-Identifier: Apache-2.0
// European Portuguese catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "pt-PT", name: "Português (Portugal)", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Executa um script Python linha a linha, diretamente no teu browser.",
  "pane.script": "Script",
  "file.open": "Abrir…",
  "file.openTitle": "Abrir um ficheiro .py do teu computador",
  "file.download": "Transferir",
  "file.downloadTitle": "Guardar este script como ficheiro .py",
  "file.example": "Exemplo",
  "file.exampleTitle": "Substituir o script pelo exemplo",
  "file.dropHint": "Larga aqui o teu ficheiro .py",
  "file.confirmReplace": "Substituir o teu script pelo exemplo?",
  "file.stopFirst": "Para o programa antes de abrir outro ficheiro.",
  "file.notPython": "«{file}» não é um ficheiro Python (.py).",
  "file.tooLarge": "«{file}» tem mais de 1 MB — escolhe um script mais pequeno.",
  "layout.resize": "Arrasta para redimensionar",
  "lang.label": "Idioma",
  "lang.auto": "Automático ({language})",
  "lang.beta": "{language} (beta)",
  "lang.report": "Comunicar um problema de tradução",
  "lang.reportTitle": "Abre o GitHub num novo separador — precisas de uma conta GitHub para comunicar",
  "lang.changed": "Idioma: {language}",
  "controls.label": "Controlos de depuração",
  "controls.start": "Iniciar",
  "controls.startTitle": "Iniciar (F5) — executar o programa desde o início",
  "controls.continue": "Continuar",
  "controls.continueTitle": "Continuar (F5) — executar até ao próximo ponto de interrupção",
  "controls.stepOver": "Passar por cima",
  "controls.stepOverTitle": "Passar por cima (F10) — executar esta linha",
  "controls.stepInto": "Entrar",
  "controls.stepIntoTitle": "Entrar (F11) — entrar na função",
  "controls.stepOut": "Sair",
  "controls.stepOutTitle": "Sair (Shift+F11) — terminar esta função",
  "controls.restart": "Reiniciar",
  "controls.restartTitle": "Reiniciar (Ctrl/Cmd+Shift+F5) — parar e executar de novo desde o início",
  "controls.stop": "Parar",
  "controls.stopTitle": "Parar (Shift+F5) — terminar o programa já",
  "status.loading": "A carregar…",
  "status.preparing": "A preparar…",
  "status.loadingPython": "A carregar o Python…",
  "status.downloading": "A transferir o Python…",
  "status.startingDebugger": "A iniciar o depurador…",
  "status.restarting": "A reiniciar o Python…",
  "status.readyHtml": "Pronto — prime <strong>{start}</strong> (F5) para depurar.",
  "status.runningHtml": "<strong>Em execução…</strong> prime {stop} (Shift+F5) para terminar o programa.",
  "status.pausedHtml": "<strong>Em pausa antes da linha {line}.</strong> {stepOver} (F10) executa-a.",
  "status.inputHtml": "<strong>À espera de uma resposta</strong> — escreve na consola e prime Enter.",
  "status.errorHtml": "<strong>{type}</strong>. Corrige o erro e prime {start} (F5) novamente.",
  "status.errorAtLineHtml": "<strong>{type}</strong> na linha {line}. Corrige o erro e prime {start} (F5) novamente.",
  "status.pythonFailedHtml": "<strong>Não foi possível carregar o Python.</strong> Recarrega a página para tentar novamente.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Consola",
  "console.outputLabel": "Saída da consola",
  "console.inputLabel": "Escreve a tua resposta e prime Enter",
  "console.finished": "Programa terminado.",
  "console.stopped": "Programa parado.",
  "console.syntaxError": "O Python não conseguiu perceber o código, por isso o programa não começou (vê a mensagem a vermelho acima).",
  "console.syntaxErrorAtLine": "O Python não conseguiu perceber o código na linha {line}, por isso o programa não começou (vê a mensagem a vermelho acima).",
  "console.runtimeError": "O programa parou devido a um erro (vê a mensagem a vermelho acima).",
  "console.runtimeErrorAtLine": "O programa parou devido a um erro na linha {line} (vê a mensagem a vermelho acima).",
  "console.fatal": "Não foi possível iniciar o Python: {error}. Verifica a tua ligação à Internet e recarrega a página.",
  "vars.title": "Memória",
  "vars.hint": "As variáveis aparecem aqui enquanto o programa está em pausa.",
  "vars.returned": "↩ {function}() devolveu {value}",
  "vars.callStack": "Pilha de chamadas",
  "vars.mainProgram": "programa principal",
  "vars.line": "linha {line}",
  "vars.variables": "Variáveis",
  "vars.locals": "Variáveis locais — {function}()",
  "vars.globals": "Variáveis globais",
  "vars.noneYet": "Ainda não há variáveis.",
  "vars.none": "Nenhuma.",
  "vars.more": {"one": "… mais {count}", "other": "… mais {count}"},
  "editor.breakpointTitle": "Ponto de interrupção (clica para remover)",
  "blocker.title": "O Snake Tutor não consegue iniciar nesta janela do browser",
  "blocker.fromDiskHtml": "Esta página foi aberta diretamente a partir de um ficheiro, por isso o Python não pode funcionar. Abre-a antes através de um endereço web: executa <code>python3 -m http.server</code> na pasta dela e depois abre <code>http://localhost:8000</code>.",
  "blocker.isolation": "O Snake Tutor não conseguiu ativar uma funcionalidade do browser de que precisa para executar o Python. Recarrega a página e evita janelas privadas ou anónimas.",
  "blocker.reload": "Recarregar",
};

export const sample = `# Bem-vindo ao Snake Tutor!
# Prime «Iniciar» (F5) e depois «Passar por cima» (F10) para executar uma linha de cada vez.
# Observa a linha destacada e o painel Memória à medida que avanças.

def greet(name):
    message = "Olá, " + name + "!"
    return message

name = input("Como te chamas? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("O total é", total)
`;
