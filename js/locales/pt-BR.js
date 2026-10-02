// SPDX-License-Identifier: Apache-2.0
// Brazilian Portuguese catalog. Keys and placeholders must match js/locales/en.js.
// reviewed: false until a fluent speaker signs it off (shown as beta).
export const meta = { code: "pt-BR", name: "Português (Brasil)", reviewed: false };

export const messages = {
  "title.app": "Snake Tutor",
  "title.file": "{file} — Snake Tutor",
  "meta.description": "Execute um script Python linha por linha, direto no seu navegador.",
  "pane.script": "Script",
  "file.open": "Abrir…",
  "file.openTitle": "Abrir um arquivo .py do seu computador",
  "file.download": "Baixar",
  "file.downloadTitle": "Salvar este script como arquivo .py",
  "file.example": "Exemplo",
  "file.exampleTitle": "Substituir o script pelo exemplo",
  "file.dropHint": "Solte seu arquivo .py aqui",
  "file.confirmReplace": "Substituir seu script pelo exemplo?",
  "file.stopFirst": "Interrompa o programa antes de abrir outro arquivo.",
  "file.notPython": "\"{file}\" não é um arquivo Python (.py).",
  "file.tooLarge": "\"{file}\" tem mais de 1 MB — escolha um script menor.",
  "layout.resize": "Arraste para redimensionar",
  "lang.label": "Idioma",
  "lang.auto": "Automático ({language})",
  "lang.beta": "{language} (beta)",
  "lang.report": "Relatar um problema de tradução",
  "lang.reportTitle": "Abre o GitHub em uma nova aba — você precisa de uma conta no GitHub para relatar",
  "controls.label": "Controles de depuração",
  "controls.start": "Iniciar",
  "controls.startTitle": "Iniciar (F5) — executar o programa desde o começo",
  "controls.continue": "Continuar",
  "controls.continueTitle": "Continuar (F5) — executar até o próximo ponto de parada",
  "controls.stepOver": "Contornar",
  "controls.stepOverTitle": "Contornar (F10) — executar esta linha",
  "controls.stepInto": "Intervir",
  "controls.stepIntoTitle": "Intervir (F11) — entrar na função",
  "controls.stepOut": "Sair",
  "controls.stepOutTitle": "Sair (Shift+F11) — terminar esta função",
  "controls.restart": "Reiniciar",
  "controls.restartTitle": "Reiniciar (Ctrl/Cmd+Shift+F5) — interromper e executar de novo desde o começo",
  "controls.stop": "Interromper",
  "controls.stopTitle": "Interromper (Shift+F5) — encerrar o programa agora",
  "status.loading": "Carregando…",
  "status.preparing": "Preparando…",
  "status.loadingPython": "Carregando o Python…",
  "status.downloading": "Baixando o Python…",
  "status.startingDebugger": "Iniciando o depurador…",
  "status.restarting": "Reiniciando o Python…",
  "status.readyHtml": "Pronto — pressione <strong>{start}</strong> (F5) para depurar.",
  "status.runningHtml": "<strong>Executando…</strong> pressione {stop} (Shift+F5) para encerrar o programa.",
  "status.pausedHtml": "<strong>Pausado antes da linha {line}.</strong> {stepOver} (F10) a executa.",
  "status.inputHtml": "<strong>Aguardando uma resposta</strong> — digite no console e pressione Enter.",
  "status.errorHtml": "<strong>{type}</strong>. Corrija o erro e pressione {start} (F5) novamente.",
  "status.errorAtLineHtml": "<strong>{type}</strong> na linha {line}. Corrija o erro e pressione {start} (F5) novamente.",
  "status.pythonFailedHtml": "<strong>Não foi possível carregar o Python.</strong> Recarregue a página para tentar de novo.",
  "status.pythonVersion": "Python {version}",
  "console.title": "Console",
  "console.outputLabel": "Saída do console",
  "console.inputLabel": "Digite sua resposta e pressione Enter",
  "console.finished": "Programa concluído.",
  "console.stopped": "Programa interrompido.",
  "console.syntaxError": "O Python não conseguiu entender o código, então o programa não foi iniciado (veja a mensagem em vermelho acima).",
  "console.syntaxErrorAtLine": "O Python não conseguiu entender o código na linha {line}, então o programa não foi iniciado (veja a mensagem em vermelho acima).",
  "console.runtimeError": "O programa parou por causa de um erro (veja a mensagem em vermelho acima).",
  "console.runtimeErrorAtLine": "O programa parou por causa de um erro na linha {line} (veja a mensagem em vermelho acima).",
  "console.fatal": "Não foi possível iniciar o Python: {error}. Verifique sua conexão com a internet e recarregue a página.",
  "vars.title": "Memória",
  "vars.hint": "As variáveis aparecem aqui enquanto o programa está pausado.",
  "vars.returned": "↩ {function}() retornou {value}",
  "vars.callStack": "Pilha de Chamadas",
  "vars.mainProgram": "programa principal",
  "vars.line": "linha {line}",
  "vars.variables": "Variáveis",
  "vars.locals": "Variáveis locais — {function}()",
  "vars.globals": "Variáveis globais",
  "vars.noneYet": "Nenhuma variável ainda.",
  "vars.none": "Nenhuma.",
  "vars.more": {"one": "… mais {count}", "other": "… mais {count}"},
  "editor.breakpointTitle": "Ponto de parada (clique para remover)",
  "blocker.title": "O Snake Tutor não pode iniciar nesta janela do navegador",
  "blocker.fromDiskHtml": "A página foi aberta diretamente do seu disco. Em vez disso, sirva a pasta com um servidor, por exemplo com <code>python3 -m http.server</code>, e abra <code>http://localhost:8000</code>.",
  "blocker.isolation": "O Snake Tutor executa o Python dentro do seu navegador e precisa de um recurso chamado isolamento de origem cruzada (cross-origin isolation), que um pequeno ajudante (um service worker) ativa na primeira vez que a página carrega. Ele não foi ativado aqui. Tente recarregar e evite janelas privadas / anônimas, que bloqueiam o ajudante.",
  "blocker.reload": "Recarregar",
};

export const sample = `# Boas-vindas ao Snake Tutor!
# Pressione “Iniciar” (F5) e depois “Contornar” (F10) para executar uma linha por vez.
# Acompanhe a linha destacada e o painel Memória enquanto avança.

def greet(name):
    message = "Olá, " + name + "!"
    return message

name = input("Qual é o seu nome? ")
print(greet(name))

numbers = [3, 1, 4, 1, 5]
total = 0
for n in numbers:
    total = total + n
print("O total é", total)
`;
