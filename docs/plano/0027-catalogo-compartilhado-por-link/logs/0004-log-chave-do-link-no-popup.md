<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0004: chave do link do catálogo no popup Compartilhar

## Data
2026-09-16

## Resumo
O popup Compartilhar ganhou o terceiro bloco com a chave do link do catálogo:
`Link do catálogo: ligado` / `Link do catálogo: desligado`, um `role="switch"`
com `aria-checked`. Tocar não fecha o popup, o foco fica na chave e um segundo
toque durante a gravação não dispara outra. O estado vem da carga do login
(`linkAtivo`; ausente ou documento novo → desligado); alternar grava na hora,
fora da gravação agregada e sem `updatedAt`, avisa `Link ligado`/`Link
desligado`, e a falha reverte a chave com aviso de falha e detalhe técnico;
sem rede, a espera das escritas avisa a conexão instável. Sair da conta
descarta o estado.

Arquivos e papéis:
- `src/lib/colecaoRemota.js` — `carregarColecao` passou a devolver
  `linkAtivo` (`dados.linkAtivo === true`) e nasceu `gravarLinkAtivo(uid,
  ativo, { aoEsperar })`, com `setDoc(..., { merge: true })` só com
  `linkAtivo`, sem `updatedAt`, mesmo contrato discriminado e
  `comAvisoDeEspera` das demais escritas.
- `src/App.jsx` — estado `linkAtivo` alimentado pela carga (`encontrado` e
  `vazio`), `handleAlternarLink` otimista com reversão e avisos, reset no
  callback de `onAuthStateChanged` quando a sessão some, e as props novas do
  `MenuDeCompartilhar`.
- `src/components/MenuDeCompartilhar.jsx` e `.css` — terceiro bloco com a
  chave (trilho + bolinha), trava contra o segundo toque e sem fechar o popup.
- `src/lib/colecaoRemota.test.js`, `src/components/MenuDeCompartilhar.test.jsx`
  e o novo `src/App.linkDoCatalogo.test.jsx` — cobertura dos critérios.
- `docs/interface.md` (§ Menu de ações › Compartilhar e § Avisos),
  `docs/modelo-firebase.md` (§ Mecanismo de gravação) e `AGENTS.md`
  (§ Onde fica cada coisa).

Divergência encontrada: `docs/model-dr/0003` continua dizendo "Três funções de
escrita" (ver Observações). Fora do que a tarefa toca; não corrigida aqui.

## Discovery
- Código: `carregarColecao` ainda não devolvia `linkAtivo`; `colecaoRemota.js`
  tinha três escritas e `gravarAtestacao` é o precedente de campo isolado com
  `merge: true` e sem `updatedAt`. `MenuDeCompartilhar.jsx` tinha dois blocos de
  `role="menuitem"` separados por um filete, e o fechamento vem de `mousedown`
  fora/`Esc`/`blur` — todos preservados com a chave dentro do container.
  `App.jsx` não tinha estado de link; a vista do link (`alvoDoCatalogo`) suprime
  a carga. Os testes de App mockam `colecaoRemota.js` por funcionalidade (o
  export novo ausente no mock é tolerado). `MenuDeCompartilhar.test.jsx`
  afirmava 1 filete. Comportamento atual confere com a tarefa.
- Documentação: as referências bastaram; conferi à parte `firestore.rules`
  (aceita `linkAtivo` booleano no `create`/`update`, então desligar gravando
  `false` passa) e `docs/interface.md` § Avisos e § Camadas.

## Plano da alteração
1. `src/lib/colecaoRemota.js`: `linkAtivo` na carga; `gravarLinkAtivo` nova.
2. `src/lib/colecaoRemota.test.js`: carga com/sem o campo; escrita (payload sem
   `updatedAt`, `false`, erro, indisponível, espera).
3. `src/components/MenuDeCompartilhar.jsx` (+ `.css`): terceiro bloco com
   `role="switch"`, trava de segundo toque, sem fechar; ajuste dos filetes.
4. `src/components/MenuDeCompartilhar.test.jsx`: chave, estado, foco, segundo
   toque, `Esc`.
5. `src/App.jsx`: estado, carga, alternar otimista com reversão/avisos, reset no
   logout, props.
6. `src/App.linkDoCatalogo.test.jsx`: integração.
7. `docs/interface.md`, `docs/modelo-firebase.md`, `AGENTS.md`.
- Verificação prevista: critérios → testes nomeados; validação lint/test/build;
  `test:rules` não se aplica (sem `firestore.rules`).
- Riscos: contagens de filete/menuitem dos testes existentes; foco sem fechar;
  leitura dupla no login.
- Desvios: nenhum de escopo. O reset do link saiu de um `useEffect` para o
  callback de `onAuthStateChanged` porque o lint acusou
  `react(set-state-in-effect)` — mesmo comportamento, sem o aviso.

## Decisões tomadas
- Desligar grava `linkAtivo: false` em vez de `deleteField` — nível 1, a
  "Decisão em aberto" da tarefa; o valor explícito mantém o campo presente e é
  aceito pelas regras; registrado só no log, sem documento próprio.
- Nome e assinatura da função nova: `gravarLinkAtivo(uid, ativo, { aoEsperar })`
  — nível 1 (API interna), no log.
- Tratar `status !== 'sucesso'` (incluindo `indisponivel`, inalcançável na tela
  principal) como falha que reverte — nível 1, conservador, no log.
- Aparência da chave: trilho de 30×16px com bolinha de 10px, `--gold` quando
  ligado e `--bg-deep`/`--border`/`--muted` quando desligado; estado dito em
  texto, não só pela cor — nível 2 (detalhe visível não especificado), sinalizado
  no relatório. Puramente estético: sem registro de decisão.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (88 files). Um aviso
  inicial de `react(set-state-in-effect)` foi corrigido antes do commit.
- `npm run test` → `Test Files 43 passed (43)` / `Tests 571 passed (571)`, com
  os avisos de `act(...)` do componente `Avisos` já presentes nos testes de App
  pré-existentes (`App.importar`, `App.gravacao`, `App.copiar`, ...).
- `npm run build` → `✓ built in 653ms`; aviso de chunk > 500 kB já conhecido
  (chunks do Firebase carregados sob demanda).
- `npm run test:rules` → não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] O popup mostra o terceiro bloco com a chave no estado vindo da carga
      (true, false e ausente) — `MenuDeCompartilhar.test.jsx` "mostra a chave
      ligada...", "mostra a chave desligada quando o estado é false", "estado
      ausente é desligado"; `App.linkDoCatalogo.test.jsx` "a carga ligada abre o
      popup com a chave ligada", "a carga sem o campo abre a chave desligada".
- [x] Alternar grava só `linkAtivo`, sem `updatedAt` e fora da agregação, e
      avisa — `colecaoRemota.test.js` "grava só linkAtivo com merge:true, sem
      updatedAt" e "nunca usa deleteField nem serverTimestamp";
      `App.linkDoCatalogo.test.jsx` "ligar grava só linkAtivo, fora da
      agregação, e avisa 'Link ligado'" e "desligar grava false e avisa 'Link
      desligado'".
- [x] Falha volta a chave e emite a falha com detalhe — `App.linkDoCatalogo.test.jsx`
      "falha ao ligar reverte a chave e avisa com o detalhe técnico" e "falha ao
      desligar reverte a chave...".
- [x] Tocar na chave não fecha o popup; `Esc` fecha — `MenuDeCompartilhar.test.jsx`
      "tocar na chave não fecha o popup e mantém o foco nela" e "Esc continua
      fechando o popup depois de tocar na chave".
- [x] A chave anuncia nome e estado por extenso — `MenuDeCompartilhar.test.jsx`
      consulta por `role="switch"` com nome "Link do catálogo: ligado"/"desligado"
      e `aria-checked`.
- [x] `docs/interface.md`, `docs/modelo-firebase.md` e `AGENTS.md` atualizados
      nas seções indicadas.

## Arquivos alterados
- `src/lib/colecaoRemota.js` — `linkAtivo` na carga e `gravarLinkAtivo`.
- `src/lib/colecaoRemota.test.js` — testes da carga e da nova escrita.
- `src/components/MenuDeCompartilhar.jsx` — terceiro bloco com a chave.
- `src/components/MenuDeCompartilhar.css` — estilo da chave (trilho e bolinha).
- `src/components/MenuDeCompartilhar.test.jsx` — testes da chave e ajuste dos
  filetes.
- `src/App.jsx` — estado/persistência do link e props do popup.
- `src/App.linkDoCatalogo.test.jsx` — testes de integração (novo).
- `docs/interface.md` — § Menu de ações › Compartilhar e § Avisos.
- `docs/modelo-firebase.md` — § Mecanismo de gravação (quarta escrita).
- `AGENTS.md` — § Onde fica cada coisa.
- `docs/plano/0027-catalogo-compartilhado-por-link/0004-chave-do-link-no-popup.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0027-catalogo-compartilhado-por-link/logs/0004-log-chave-do-link-no-popup.md`
  — este log.

## Observações
- `docs/model-dr/0003` § "Três funções de escrita" ficou desatualizado com a
  quarta escrita (`gravarLinkAtivo`); não está nos "Arquivos impactados" da
  tarefa, então não foi tocado. `docs/modelo-firebase.md` já cita as quatro,
  apoiado no MDR 0002, que prevê a gravação de `linkAtivo` na Tarefa 0027-0004.
- A validação adicional no emulador (ligar/desligar com `VITE_USE_FIREBASE_EMULATOR`
  e abrir `/catalogo/<uid>` anônimo) não pôde ser feita neste ambiente: fica
  `pendente` com o roteiro da tarefa. A compatibilidade com as regras está
  coberta por composição: `firestore.rules.test.js` prova a escrita de
  `{ linkAtivo: true|false }` e `colecaoRemota.test.js` prova o payload exato da
  função.
