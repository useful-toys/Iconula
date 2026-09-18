<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0003]: painel de apagar dados na política

## Status
Pendente

## Objetivo

Entregar o comando "Apagar meus dados" funcionando ponta a ponta: painel
de dois passos na política, orquestração na ordem que não deixa estado
meio-apagado, e um cenário e2e contra os emuladores provando que nem o
documento nem a gravação pendente sobrevivem.

## Documentos de referência

- `docs/idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md`
  § Decisão — os três estados e o que cada um mostra.
- `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md` § Decisão —
  a ordem dos quatro passos, a desistência e as falhas parciais.
- `docs/tdr/0020-privacidade-como-vista-interna.md` — a vista interna é
  checada antes da guarda de login; é o que sustenta o estado final.
- `docs/idr/0029-avisos-flutuantes-com-tres-severidades.md` — severidades
  e o campo `tipo` dos avisos.
- `docs/idr/0038-sair-da-conta-aborta-se-o-flush-falhar.md` — precedente
  de operação que mexe na sessão e na gravação pendente.
- `docs/teste-e2e.md` §§ Fixture de dados no Firestore Emulator,
  Estrutura de arquivos — helpers e onde o spec novo entra.
- `docs/interface.md` § Política de privacidade — a seção que passa a
  descrever o painel.

## Padrões e convenções aplicáveis

- Sem router: a vista interna é estado em `App.jsx` (TDR 0020).
- Sem `window.confirm()` nesta tarefa — a confirmação é o painel
  (IDR 0060), diferente da importação (IDR 0041).
- Texto visível em PT-BR; nome acessível por extenso; nenhum componente
  com rolagem própria.
- Um arquivo de teste por funcionalidade de `App.jsx`
  (`App.<funcionalidade>.test.jsx`), como já vale para importar e
  atestação.

## Escopo e instruções de implementação

1. Em `src/components/PoliticaDePrivacidade.jsx`, acrescentar à seção
   "Direitos do titular" um bloco com três estados em estado local:
   repouso, confirmando e apagado, com os textos e botões do IDR 0060.
   O bloco recebe por props se pode apagar, a ação de apagar e a de
   exportar; sem sessão, nada disso é renderizado e a seção mostra só o
   canal de contato. Estilo no CSS co-localizado.
2. Em `src/App.jsx`, orquestrar a exclusão na ordem do TDR 0027 —
   descartar pendências, reautenticar, apagar documento, apagar conta —,
   com os avisos descritos lá (falha ao apagar o documento aborta antes
   de tocar a conta; falha ao apagar a conta avisa em dourado e encerra
   a sessão) e limpeza do estado local no sucesso. Passar à política a
   exportação já existente, sem duplicar a lógica.
3. Cobrir em `src/App.apagarDados.test.jsx`: caminho feliz; desistência
   no popup sem apagar nada; falha ao apagar o documento; falha ao
   apagar a conta; e o caso central — nenhuma gravação pendente
   sobrevive ao apagamento.
4. Cobrir em `src/components/PoliticaDePrivacidade.test.jsx` os três
   estados e a ausência do bloco sem sessão.
5. Acrescentar um spec e2e que entra com login, registra ao menos uma
   figurinha, abre a política pelo rodapé, apaga os dados e confirma a
   tela final; depois, que entrar de novo traz coleção vazia. Reusar os
   helpers de login e fixture existentes.
6. Atualizar `docs/interface.md` § Política de privacidade com o painel
   e seus três estados; `docs/teste-e2e.md` § Estrutura de arquivos e
   `e2e/README.md` com o spec novo; `AGENTS.md` § Onde fica cada coisa
   com o arquivo de teste novo de `App.jsx` e o spec e2e.

**Fora do escopo**: o texto de conformidade da política (Tarefa
0031-0005); o link de contato montado em runtime (Tarefa 0031-0004); a
regra de `delete` (Tarefa 0031-0001) e as funções de SDK (Tarefa
0031-0002), das quais esta tarefa depende.

## Decisões já tomadas (não reabrir)

- Onde o comando vive, os três estados e por que a mensagem final não
  usa a fila de avisos — ver
  `docs/idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md`.
- A ordem da exclusão, a reautenticação incondicional e o tratamento das
  falhas parciais — ver
  `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md`.
- O menu de ações continua com três itens — ver
  `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md`.

## Arquivos impactados

- `src/components/PoliticaDePrivacidade.jsx` — modificar
- `src/components/PoliticaDePrivacidade.css` — modificar
- `src/components/PoliticaDePrivacidade.test.jsx` — modificar
- `src/App.jsx` — modificar
- `src/App.apagarDados.test.jsx` — criar
- `e2e/apagarDados.spec.js` — criar
- `e2e/README.md` — modificar
- `docs/interface.md` — modificar (§ Política de privacidade)
- `docs/teste-e2e.md` — modificar (§ Estrutura de arquivos)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite

- [ ] O painel só aparece com sessão; sem sessão a seção mostra apenas o
      canal de contato
- [ ] O passo de confirmação oferece exportar antes e exige um segundo
      clique para apagar
- [ ] Teste prova que fechar o popup de reautenticação não apaga nem o
      documento nem a conta
- [ ] Teste prova que as pendências da gravação agregada são descartadas
      antes de apagar
- [ ] Teste prova que falha ao apagar o documento não chega a apagar a
      conta
- [ ] O estado final continua visível depois de a sessão acabar
- [ ] O spec e2e passa contra os emuladores
- [ ] `npm run lint && npm run test && npm run build` verdes

## Validação adicional

- `npm run test:e2e` (emuladores Auth + Firestore).
- Roteiro visual em `npm run dev`: abrir a política pelo rodapé,
  percorrer os três estados e conferir que o botão fica desabilitado
  enquanto a operação está em voo.
