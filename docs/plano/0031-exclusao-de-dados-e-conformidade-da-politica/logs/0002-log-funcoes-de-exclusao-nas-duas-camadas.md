<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0002: funções de exclusão nas duas camadas

## Data
2026-09-17

## Resumo
Esta tarefa liga o cliente à regra de `delete` publicada na Tarefa
0031-0001, sem interface ainda: `colecaoRemota.js` ganha `apagarColecao` e
`firebase.js` ganha `reauthenticateWithGoogle()` e `deleteUserAccount()`,
as três operações que a Tarefa 0031-0003 vai orquestrar na ordem do
TDR 0027. Antes, nenhuma das duas camadas sabia apagar nada — o módulo do
Firestore não tinha operação de exclusão e o do Auth só sabia entrar.
`apagarColecao` segue o contrato do módulo (resultado discriminado, guarda
de `app` nulo, nunca lança, aviso de espera sem rede); as duas do Auth
seguem `signInWithGoogle()`, delegando à API modular e deixando o erro
para quem chama. `firebase.js` continua sem importar `firebase/firestore`.
`firebase.test.js` nasce (sucesso, erro e ausência de config para cada
função) e `colecaoRemota.test.js` cobre `apagarColecao`; `docs/arquitetura.md`
e `AGENTS.md` passam a descrever as operações, citando o TDR 0027.

## Discovery
- Código: `src/lib/colecaoRemota.js` é o único módulo que toca o SDK do
  Firestore, importado dinamicamente; cada operação tem guarda de `app`
  nulo no topo (`{ status: 'indisponivel' }`), `try/catch` que devolve
  `{ status: 'erro', erro }` e usa `comAvisoDeEspera(promessa, aoEsperar)`
  quando a operação pode ficar pendente sem rede. Já existem
  `carregarColecao`, `carregarCatalogoCompartilhado`, `gravarAlteracoes`,
  `gravarImportacao`, `gravarAtestacao` e `gravarLinkAtivo`; os helpers
  `CAMINHO_DOCUMENTO(uid)`, `obterFirestore()` e `comAvisoDeEspera` são
  reaproveitáveis. `firebase.js` importa `firebase/app` e `firebase/auth`
  (modular), inicializa `app`/`auth` só com a config completa e exporta
  `signInWithGoogle()` como delegador fino a `signInWithPopup(auth, new
  GoogleAuthProvider())`, sem `try/catch` — quem chama traduz o erro
  (`LoginButton.jsx`, `TelaDeLogin.jsx`). O módulo não tem teste
  co-localizado; `colecaoRemota.test.js` mocka `./firebase.js` (só
  `app`), `firebase/firestore` e usa `vi.hoisted` para os spies. O
  comportamento atual confere com a tarefa: a Tarefa 0031-0001 publicou a
  regra de `delete` e ainda não há cliente que a use.
- Documentação: lidos o TDR 0027 § Decisão (funções e ordem da exclusão),
  o ADR 0005 (SDK do Firestore sob demanda e política de erro) e o
  ADR 0004 (API modular, popup obrigatório); em `docs/arquitetura.md`,
  §§ Serviços Firebase, Camadas no cliente e Dados e fluxo, para saber
  onde as operações novas entram. As referências bastaram.

## Plano da alteração
1. `src/lib/colecaoRemota.js` — nova `apagarColecao(uid, { aoEsperar })`,
   com a mesma forma das demais: guarda de `app` nulo, `deleteDoc` do
   documento `users/{uid}` via SDK dinâmico e `comAvisoDeEspera`; devolve
   `sucesso` | `erro` | `indisponivel`, nunca lança.
2. `src/lib/colecaoRemota.test.js` — acrescentar `deleteDoc` ao mock de
   `firebase/firestore` e um bloco de casos de `apagarColecao`: sucesso,
   erro do SDK, `app` indisponível, não mexe em `setDoc`/`serverTimestamp`
   e espera sem rede (tempo-limite chama `aoEsperar`).
3. `src/lib/firebase.js` — importar `reauthenticateWithPopup` e
   `deleteUser` de `firebase/auth` e acrescentar
   `reauthenticateWithGoogle()` (reautentica o usuário corrente com
   popup do Google) e `deleteUserAccount()` (apaga `auth.currentUser`),
   no mesmo estilo delegador de `signInWithGoogle()`, sem `try/catch`.
4. `src/lib/firebase.test.js` — criar: mocka `firebase/app` e
   `firebase/auth`, recarrega o módulo com `vi.resetModules()` e
   `vi.stubEnv` configurando e esvaziando as `VITE_FIREBASE_*`; prova
   que as duas funções novas delegam à API modular correta (sucesso), que
   o erro do SDK é propagado e que, sem config (`auth === null`), a
   chamada não resolve silenciosamente — o erro do SDK vaza para quem
   chama. Cobre também que `getAuth`/`initializeApp` não rodam sem
   config.
5. `docs/arquitetura.md` — § Serviços Firebase: a linha do Auth cita a
   reautenticação e a exclusão de conta (TDR 0027); § Camadas no cliente:
   a linha de `src/lib/` passa a citar as operações novas nas duas
   camadas (`colecaoRemota.js` apaga o documento; `firebase.js` faz login,
   reautenticação e exclusão de conta).
6. `AGENTS.md` — § Onde fica cada coisa: as linhas de `src/lib/firebase.js`
   e de `src/lib/colecaoRemota.js` passam a mencionar as operações novas.
- Verificação prevista:
  - `apagarColecao` com resultado discriminado, sem lançar e com `app`
    nulo → testes de `colecaoRemota.test.js`;
  - funções novas em `firebase.js` com API modular → testes de
    `firebase.test.js` e leitura do arquivo;
  - `firebase.js` sem `firebase/firestore` → busca no arquivo;
  - `docs/arquitetura.md` e `AGENTS.md` citando as operações → busca nos
    arquivos;
  - `npm run lint && npm run test && npm run build` verdes.
- Riscos: nenhum de comportamento corrente — nada chama as funções novas
  ainda (a orquestração é da Tarefa 0031-0003) e `firebase.js` já
  inicializava o Auth. O ponto delicado é o teste de `firebase.js`:
  o módulo lê `import.meta.env` na carga, então a alternância
  configurado/indisponível exige `vi.resetModules()` + `vi.stubEnv` para
  não depender de `.env.local` (presente na máquina, ausente no CI).
- Desvios: nenhum

## Decisões tomadas
- Nomes das três funções novas — `apagarColecao` (verbo em pt-BR, como
  `carregarColecao`/`gravarAlteracoes`), `reauthenticateWithGoogle` e
  `deleteUserAccount` (espelham a API modular, como `signInWithGoogle`) —
  decisão de nível 1, sem registro.
- Nos testes de `firebase.js`, o caso "indisponível" é o erro do SDK que
  vaza para quem chama com `auth` nulo: o módulo **lança** (contrato de
  `signInWithGoogle()`, que a tarefa manda seguir), não devolve resultado
  discriminado como `colecaoRemota.js`. Decisão de nível 1, sobre a forma
  de provar o critério, não sobre comportamento.
- Citações do TDR 0027 em `docs/arquitetura.md` e `AGENTS.md`: o registro
  já existe (criado no planejamento) e lastreia a alteração — nada novo a
  registrar.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- Execução focada durante a implementação:
  `npx vitest run src/lib/firebase.test.js src/lib/colecaoRemota.test.js` —
  `Test Files 2 passed (2)`, `Tests 70 passed (70)`.
- `npm run lint` — `Found 0 warnings and 0 errors.` (90 arquivos)
- `npm run test` — `Test Files 44 passed (44)`, `Tests 600 passed (600)`
  (eram 43/586 na Tarefa 0031-0001: +1 arquivo, +14 testes — 8 de
  `firebase.test.js` e 6 de `apagarColecao`).
- `npm run build` — `✓ built in 674ms` (aviso pré-existente de chunk
  > 500 kB, sem relação com a tarefa).
- `npm run test:rules` — não se aplica: `firestore.rules` não foi tocado
  nesta tarefa (a regra de `delete` foi publicada e validada na Tarefa
  0031-0001).

## Critérios de aceite
- [x] A função de apagar o documento devolve resultado discriminado e
      nunca lança, inclusive com `app` indisponível —
      `src/lib/colecaoRemota.js:482` (`apagarColecao`), com
      `sucesso`/`erro`/`indisponivel`; testes em
      `src/lib/colecaoRemota.test.js:671` (sucesso, erro, indisponível,
      nada de `setDoc`/`serverTimestamp`/`deleteField`, espera sem rede).
- [x] As funções de reautenticar e apagar conta vivem em
      `src/lib/firebase.js` e usam a API modular —
      `src/lib/firebase.js:74` (`reauthenticateWithGoogle`) e `:81`
      (`deleteUserAccount`), importando `deleteUser` e
      `reauthenticateWithPopup` de `firebase/auth` (`:11` e `:13`); testes
      em `src/lib/firebase.test.js:104` e `:126`.
- [x] `src/lib/firebase.js` continua sem importar `firebase/firestore` —
      busca por `firestore` no arquivo retorna só o comentário
      pré-existente das linhas 42–44; nenhum `import`.
- [x] Testes cobrem sucesso, erro e indisponível para cada função nova —
      `apagarColecao`: `colecaoRemota.test.js:672` (sucesso), `:688`
      (erro) e `:698` (indisponível); `reauthenticateWithGoogle`:
      `firebase.test.js:105` (sucesso), `:116` (erro) e `:159`
      (indisponível — sem config, o erro vaza em vez de resolver);
      `deleteUserAccount`: `firebase.test.js:127`, `:134` e `:165`.
- [x] `docs/arquitetura.md` e `AGENTS.md` descrevem as operações novas,
      citando o TDR 0027 — `docs/arquitetura.md:70` (§ Serviços Firebase,
      Auth, com o link do TDR 0027 em `:73`) e `:83` (§ Camadas no
      cliente, `src/lib/`); `AGENTS.md:93` e `:95` (§ Onde fica cada
      coisa).
- [x] `npm run lint && npm run test && npm run build` verdes — saídas
      acima.

## Arquivos alterados
- `src/lib/colecaoRemota.js` — nova `apagarColecao(uid, { aoEsperar })`,
  com `deleteDoc` do documento `users/{uid}` e o contrato das demais
- `src/lib/colecaoRemota.test.js` — `deleteDoc` no mock e 6 casos novos de
  `apagarColecao`
- `src/lib/firebase.js` — `reauthenticateWithGoogle()` e
  `deleteUserAccount()` com os imports modulares novos
- `src/lib/firebase.test.js` — criar: mocka os SDKs e recarrega o módulo
  com `vi.stubEnv` para cobrir configurado e sem config
- `docs/arquitetura.md` — § Serviços Firebase e § Camadas no cliente
  citam a exclusão, o TDR 0027 e as funções novas
- `AGENTS.md` — § Onde fica cada coisa descreve as operações novas nas
  linhas de `firebase.js` e `colecaoRemota.js`
- `docs/plano/0031-exclusao-de-dados-e-conformidade-da-politica/0002-funcoes-de-exclusao-nas-duas-camadas.md`
  — status para `Concluída`
- `docs/plano/README.md` — status da tarefa acompanha
- `docs/plano/0031-exclusao-de-dados-e-conformidade-da-politica/logs/0002-log-funcoes-de-exclusao-nas-duas-camadas.md`
  — este log
