<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0003: painel de apagar dados na política

## Data
2026-09-17

## Resumo
Entrega o comando "Apagar meus dados" ponta a ponta. Em
`src/components/PoliticaDePrivacidade.jsx`, a seção "Direitos do titular"
ganha um painel de três estados (repouso, confirmando e apagado) com estado
local, `useState`; só aparece com `podeApagar` (a sessão), mas o estado final
sobrevive ao fim dela, porque a vista é montada antes da guarda de login
(TDR 0020). Em `src/App.jsx`, `handleApagarDados()` orquestra a ordem do
TDR 0027 — descartar pendências, reautenticar por popup, apagar o documento
e apagar a conta — devolvendo `{ status: 'sucesso' | 'cancelado' | 'falha' }`
e emitindo os avisos das falhas parciais; o ramo da política passa a
renderizar `<Avisos />` (o fluxo emite avisos ainda nessa vista) e a receber
`podeApagar`, `onApagar` e `onExportar` (a exportação já existente, sem
duplicação). Os testes co-localizados cobrem os três estados e a ausência
sem sessão; um arquivo novo de integração (`src/App.apagarDados.test.jsx`)
prova a ordem, a desistência, as falhas parciais e o descarte das
pendências; e `e2e/apagarDados.spec.js` prova o fluxo inteiro contra os
emuladores.

**Bug encontrado fora do escopo declarado (desvio).** O e2e expôs que
`reauthenticateWithGoogle()` (`src/lib/firebase.js:75`, Tarefa 0031-0002)
chamava `reauthenticateWithPopup(auth, ...)`, mas o SDK modular exige o
`User` no primeiro argumento (`reauthenticateWithPopup(user, provider)`),
não a instância `Auth` — o SDK faz `user.auth.app` e lança
`TypeError: Cannot read properties of undefined (reading 'app')`. O bug
deixava a exclusão morta de ponta a ponta (o unitário da Tarefa 0031-0002
afirmava o argumento errado). Corrigido para `auth.currentUser`, com o
teste de `firebase.test.js` ajustado; ver `## Plano da alteração › Desvios`.

## Discovery
- Código:
  - `src/App.jsx` é o único componente com estado e concentra toda
    leitura/escrita da coleção (TDR 0014). Tem o estado `vistaInterna`
    (`null | 'politica' | 'termos'`, TDR 0020), checado **antes** da guarda
    de login (linha 658), o que sustenta o estado final da política mesmo
    depois de a sessão terminar. O ramo da política devolvia só
    `<PoliticaDePrivacidade onVoltar=... />` — sem `<Avisos />`, que é
    renderizado no ramo principal e no `CatalogoCompartilhado.jsx`.
  - `src/components/PoliticaDePrivacidade.jsx` era função pura de `onVoltar`,
    sem estado; a seção "Direitos do titular" só tinha o texto do canal de
    contato. O CSS co-localizado usa os tokens de `theme.css` e
    `.politica__corpo p` já define 14px/`--muted` para todo parágrafo (exige
    especificidade maior nas regras novas de parágrafo).
  - `src/lib/colecaoRemota.js` já tem `apagarColecao(uid, { aoEsperar })`
    (resultado discriminado, nunca lança, `comAvisoDeEspera`) e
    `mensagemDeErro`; `src/lib/firebase.js` já tem
    `reauthenticateWithGoogle()` e `deleteUserAccount()`, que **lançam** —
    quem chama traduz (estilo de `signInWithGoogle()`, tratado em
    `LoginButton.jsx`, que ignora `auth/popup-closed-by-user` e
    `auth/cancelled-popup-request`).
  - `src/lib/gravacaoAgregada.js` já expõe `descartarPendencias()`, usado
    pela importação; a instância é criada uma vez em `App.jsx` e injeta
    `gravarAlteracoes` (mockável nos testes).
  - `src/lib/avisos.js`: `emitirAviso({ severidade, mensagem, detalhe, tipo })`;
    falha é `role="alert"` e persiste; aviso/sucesso são `role="status"` e
    expiram em 5s.
  - **Bug de runtime descoberto**: a assinatura do SDK
    (`node_modules/@firebase/auth/dist/esm/index-CvXU3_1x.js`) é
    `reauthenticateWithPopup(user, provider, resolver)` e lê
    `user.auth.app`; passar `auth` lançava `TypeError`. Só o e2e pegou,
    porque o unitário da Tarefa 0031-0002 mockava o SDK e afirmava o
    argumento errado. Comportamento atual divergia do pedido → tratado como
    desvio e corrigido (nível 1: contornar bug).
  - Testes: um arquivo de integração por funcionalidade de `App.jsx`, com
    `vi.mock("firebase/auth")`, `vi.mock("./lib/firebase")`,
    `vi.mock("./lib/colecaoRemota.js")` e `Catalogo.jsx` capturando props;
    `PoliticaDePrivacidade.test.jsx` é teste de componente.
- Documentação:
  - `docs/idr/0060-...` § Decisão — os três estados e seus textos; o bloco
    só aparece com sessão, mas o estado "apagado" sobrevive ao fim dela; a
    mensagem final não usa a fila de avisos.
  - `docs/tdr/0027-...` § Decisão — ordem fixa, desistência do popup sem
    aviso e falhas parciais. O § Status está defasado (cita só 0001 e 0003)
    — observação, não arquivo impactado.
  - `docs/tdr/0020-...` — a vista interna é checada antes da guarda de
    login.
  - `docs/idr/0029-...` — severidades e o campo `tipo` dos avisos;
    `docs/idr/0038-...` — precedente de operação que mexe na sessão.
  - `docs/teste-e2e.md` §§ Fixture de dados, Estrutura de arquivos;
    `e2e/README.md`; `docs/interface.md` § Política de privacidade (linhas
    698–728); `docs/requisitos.md` § Acesso § "Apagar meus dados" (requisito
    vigente, não alterado). As referências bastaram; li a mais o `AGENTS.md`
    § Onde fica cada coisa e o `docs/interface.md` § Medidas.

## Plano da alteração
1. `src/components/PoliticaDePrivacidade.jsx` — estados locais (`repouso`,
   `confirmando`, `apagado` e `emVoo`) e props `podeApagar`, `onApagar`,
   `onExportar`; o bloco entra na seção "Direitos do titular" e só aparece
   com `podeApagar` **ou** com o estado `apagado`.
2. `src/components/PoliticaDePrivacidade.css` — estilos do painel, do botão
   destrutivo (`--notif-red`), dos secundários (`--border`/`--gold`), do
   cartão de confirmação (`--panel`) e do estado final.
3. `src/App.jsx` — importar `apagarColecao`, `reauthenticateWithGoogle` e
   `deleteUserAccount`; nova `handleApagarDados()` na ordem do TDR 0027,
   com os avisos de falha; passar as props novas ao ramo da política e
   renderizar `<Avisos />` junto dele.
4. `src/App.apagarDados.test.jsx` (criar) — os seis casos abaixo.
5. `src/components/PoliticaDePrivacidade.test.jsx` — três estados, ausência
   sem sessão, exportação antes, botões desabilitados em voo e persistência
   do estado final.
6. `e2e/apagarDados.spec.js` (criar) — login pelo popup fake do Google,
   atestação, uma figurinha, exclusão pelo painel, estado final e reentrada
   com a coleção vazia; confere `users/{uid}` direto no emulador.
7. `docs/interface.md` § Política de privacidade — descrever o painel e os
   três estados, citando o IDR 0060 e o TDR 0027.
8. `docs/teste-e2e.md`, `e2e/README.md` e `AGENTS.md` — citar o spec e o
   arquivo de teste novos.
- Verificação prevista:
  - painel só com sessão / três estados / exportar antes / estado final após
    fim de sessão → testes de componente e de `App.jsx`;
  - ordem e falhas parciais → `App.apagarDados.test.jsx` (ordem por
    `invocationCallOrder`, mocks de `apagarColecao`/`deleteUserAccount`);
  - pendências descartadas → `App.apagarDados.test.jsx` com temporizadores
    falsos e `gravarAlteracoes` mockado;
  - spec e2e → `npm run test:e2e` (emuladores + JDK 21);
  - `npm run lint && npm run test && npm run build` verdes.
- Riscos:
  - `.politica__corpo p` tem especificidade 0,1,1 — as regras novas de
    parágrafo precisam de prefixo `.politica__corpo` (resolvido no plano).
  - o popup do Google no e2e é o ponto frágil; confirmado na validação (ver
    `## Validação` e `## Decisões tomadas`).
- Desvios:
  - **`src/lib/firebase.js` + `src/lib/firebase.test.js`** (arquivos da
    Tarefa 0031-0002, declarados fora do escopo): corrigido
    `reauthenticateWithGoogle()` para passar `auth.currentUser` a
    `reauthenticateWithPopup`, e ajustado o unitário que afirmava o
    argumento errado. Motivo: sem a correção, a reautenticação lança
    `TypeError` e a exclusão não funciona ponta a ponta — o critério do e2e
    é inatingível. É o nível 1 do guia ("contornar bug ou limitação",
    "desviar da tarefa por causa do código atual sem mudar o resultado");
    nada de decisão documentada foi mudado (o TDR 0027 só exige que as
    funções existam).
  - **`e2e/apagarDados.spec.js`**: a reentrada depois da exclusão usa
    `loginComEmailSenha` com o mesmo e-mail, e não o popup fake — o fake do
    Google no emulador guarda a conta apagada e passa a falhar com
    `Internal state invariant broken: no user with ID`. O spec passou a
    conferir `users/{uid}` direto no emulador (antes e depois), o que
    sustenta a prova da exclusão independentemente da reentrada.

## Decisões tomadas
- `handleApagarDados()` devolve `{ status: 'sucesso' | 'cancelado' | 'falha' }`
  e a política decide o que mostrar; os avisos saem do `App.jsx` — nível 1,
  sobre a forma da API interna entre os dois (não muda comportamento).
- Erro de reautenticação que **não** seja popup fechado/cancelado vira aviso
  de falha (`tipo: 'apagar'`) e aborta antes de apagar — premissa
  conservadora para um caso não descrito no TDR 0027 (o TDR só tipifica a
  desistência e as falhas do documento/conta). Nível 2, sinalizada aqui.
- Renderizar `<Avisos />` no ramo da política — nível 1, mecânica: sem ele
  as falhas parciais do TDR 0027, emitidas enquanto a vista está aberta, não
  apareceriam (a tela de login também não a renderiza, IDR 0060).
- Correção de `reauthenticateWithGoogle()` — nível 1, "contornar bug";
  registrada em `## Plano da alteração › Desvios`. Sem registro de decisão
  novo: nada decidido no TDR 0027 muda.
- Reentrada do e2e via `loginComEmailSenha` — nível 1, contorno de limitação
  do emulador; registrada nos desvios. Sem registro.

## Impedimentos
Nenhum bloqueio. O `TypeError` da reautenticação foi um impedimento de
execução resolvido como desvio de nível 1 (correção de bug em código já
entregue, necessária ao critério ponta a ponta), não como decisão
significativa.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — `Found 0 warnings and 0 errors.` (92 arquivos).
- `npm run test` — `Test Files 45 passed (45)`, `Tests 613 passed (613)`.
- `npm run build` — `✓ built in 484ms` (aviso pré-existente de chunk
  > 500 kB, sem relação com a tarefa).
- `npm run test:e2e` (emuladores Auth+Firestore; JDK 21 no `PATH` —
  `$env:JAVA_HOME\bin`, senão o `java` do PATH resolve 1.8 e o emulador não
  sobe) — `4 passed (19.0s)`:
  `catalogo.spec.js` (fumaça), `catalogoCompartilhado.spec.js` (2) e
  `apagarDados.spec.js` (~14s). Rodado duas vezes seguidas, verde nas duas.
- `npm run test:rules` — não se aplica: `firestore.rules` não foi tocado
  nesta tarefa.

## Critérios de aceite
- [x] O painel só aparece com sessão; sem sessão a seção mostra apenas o
      canal de contato — `PoliticaDePrivacidade.jsx:41`
      (`mostrarBloco = podeApagar || estado === 'apagado'`); `App.jsx:752`
      (`podeApagar={Boolean(user)}`); teste
      `PoliticaDePrivacidade.test.jsx:57` ("sem sessão não mostra o comando,
      só o canal de contato").
- [x] O passo de confirmação oferece exportar antes e exige um segundo
      clique para apagar — `PoliticaDePrivacidade.jsx:131` ("Exportar minha
      coleção antes") e `:140` ("Apagar definitivamente"), alcançados por
      `:145` ("Apagar meus dados"); dois cliques no `e2e/apagarDados.spec.js`
      e nos testes de `App`
      (`App.apagarDados.test.jsx:136`, ordem `reautenticar → apagar
      documento → apagar conta`).
- [x] Teste prova que fechar o popup de reautenticação não apaga nem o
      documento nem a conta — `App.apagarDados.test.jsx:177`, com
      `reauthenticateWithGoogle` rejeitando `auth/popup-closed-by-user`:
      `apagarColecao` e `deleteUserAccount` não chamados e nenhum
      `role="alert"`.
- [x] Teste prova que as pendências da gravação agregada são descartadas
      antes de apagar — `App.apagarDados.test.jsx:225`: um ajuste agenda o
      debounce e, depois do fluxo, 20s de temporizador não produzem nenhuma
      chamada a `gravarAlteracoes`.
- [x] Teste prova que falha ao apagar o documento não chega a apagar a
      conta — `App.apagarDados.test.jsx:193`: `apagarColecao` com
      `status: 'erro'`, `deleteUserAccount` não chamado e faixa vermelha
      ("Falha ao apagar — toque para detalhes") com o detalhe técnico.
- [x] O estado final continua visível depois de a sessão acabar —
      `App.apagarDados.test.jsx:156` (zera a sessão via
      `onAuthStateChanged`) e `PoliticaDePrivacidade.test.jsx:139` (com
      `podeApagar` virando falso); a tela final traz "Voltar à tela de
      login" e leva à tela de login.
- [x] O spec e2e passa contra os emuladores — `npm run test:e2e`, `4 passed
      (19.0s)`; `e2e/apagarDados.spec.js:97` confere o documento existindo
      antes e `:119` confere que sumiu.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas
      acima.

## Arquivos alterados
- `src/components/PoliticaDePrivacidade.jsx` — painel de três estados na
  seção "Direitos do titular", com estado local e as props novas.
- `src/components/PoliticaDePrivacidade.css` — estilos do painel, dos
  botões e do estado final.
- `src/components/PoliticaDePrivacidade.test.jsx` — casos dos três estados,
  ausência sem sessão, exportar, em voo e estado final persistente.
- `src/App.jsx` — `handleApagarDados()` na ordem do TDR 0027, avisos,
  limpeza do estado local e o ramo da política com props e `<Avisos />`.
- `src/App.apagarDados.test.jsx` — criar: seis testes de integração.
- `src/lib/firebase.js` — desvio: `reauthenticateWithGoogle()` passa
  `auth.currentUser` a `reauthenticateWithPopup`.
- `src/lib/firebase.test.js` — desvio: o caso afirma o `User`, não a
  instância `Auth`, e o caso sem config deixa de esperar a chamada ao SDK.
- `e2e/apagarDados.spec.js` — criar: fluxo ponta a ponta e conferência do
  documento no emulador.
- `e2e/README.md` — lista os specs, incluindo o novo.
- `docs/interface.md` — § Política de privacidade descreve o painel e os
  três estados.
- `docs/teste-e2e.md` — § Estrutura de arquivos e § Limitações citam o spec
  novo e o helper de popup exercitado.
- `AGENTS.md` — § Onde fica cada coisa cita `src/App.apagarDados.test.jsx` e
  `e2e/apagarDados.spec.js`.
- `docs/plano/0031-.../0003-painel-de-apagar-dados-na-politica.md` — status
  para `Concluída`.
- `docs/plano/README.md` — status da tarefa acompanha.
- `docs/plano/0031-.../logs/0003-log-painel-de-apagar-dados-na-politica.md`
  — este log.
