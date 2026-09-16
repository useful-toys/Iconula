<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0024-0003: Login duplo, fixture, scripts, teste de fumaça e documentação

## Data
2026-09-16

## Resumo
Antes desta tarefa, `e2e/` só tinha a infraestrutura de ferramenta
(Tarefa 0024-0001) e os emuladores condicionados por variável de ambiente
(Tarefa 0024-0002), sem nenhum teste real. Esta tarefa entrega o que falta
para rodar um teste E2E de ponta a ponta: `e2e/helpers/login.js` (dois
helpers — popup fake do Google e e-mail/senha instantâneo, este último
seminando a sessão diretamente no IndexedDB do navegador a partir de um
login feito pelo próprio Playwright/Node contra o emulador, sem tocar
`src/`), `e2e/helpers/fixture.js` (grava `users/{uid}` no Firestore
Emulator com as regras de segurança desligadas, via
`@firebase/rules-unit-testing`), `e2e/catalogo.spec.js` (teste de fumaça:
login rápido + fixture + placar exibido corresponde ao estado gravado),
os scripts `test:e2e`/`test:e2e:dev` (com dois `playwright*.config.js`,
cada um com seu `webServer`) e `docs/teste-e2e.md`. `vite.config.js` passa
a excluir `e2e/**` da coleção do Vitest — sem isso, `npm run test`
tentava rodar `catalogo.spec.js` em `jsdom` contra `@playwright/test` e
quebrava (ver `## Decisões tomadas`). Os quatro comandos de validação
(`lint`, `test`, `build`, `test:e2e`, `test:e2e:dev`) rodam verdes.

## Discovery
- Código: `src/lib/firebase.js` exporta só `signInWithGoogle`
  (`signInWithPopup`), sem função de e-mail/senha — os helpers de E2E
  precisam da sua própria instância do SDK, não da do app.
  `src/lib/colecaoRemota.js` é o único módulo que toca o Firestore; seu
  schema (`contagens`, `updatedAt`, `atestadoEm`) é o de MDR 0002.
  `firestore.rules` exige `updatedAt`/`atestadoEm` como timestamp quando
  presentes — a fixture não precisa satisfazer isso porque usa
  `withSecurityRulesDisabled`, o mesmo padrão de
  `firestore.rules.test.js` (`semearDocumentoDoDono`). `App.jsx` só
  libera o catálogo com `precisaAtestar === false`, decidido pela leitura
  de `atestadoEm` em `carregarColecao` — por isso a fixture sempre grava
  `atestadoEm` junto. `Cabecalho.jsx` exibe `{coladas}/994` e
  `{percentual}%` em `.cabecalho__titulo`. `src/data/catalogo.js` expõe a
  seção "Extras FIFA" com códigos reais `FWC00`–`FWC19` (20 ao todo,
  renumerados na Fase 14) — usados como contagens conhecidas no teste de
  fumaça. `vite.config.js` ainda não excluía `e2e/**`: o include padrão
  do Vitest casa `*.spec.js`, não só `*.test.js`, então
  `e2e/catalogo.spec.js` seria coletado e quebraria `npm run test`
  (confirmado rodando `npm run test` antes de adicionar a exclusão: 117
  arquivos coletados incluíam o spec e falhavam ao importar
  `@playwright/test` fora de um test runner do Playwright) — a Tarefa
  0024-0001 já havia sinalizado esse risco no próprio log, sem tocar o
  arquivo por não ter ainda nenhum `.spec.js`.
- Documentação: ADR 0010 § Decisão (login duplo, fixture, scripts,
  escopo) foi a referência principal. `docs/setup-firebase.md` § Emulador
  (desenvolvimento), já escrito pela Tarefa 0024-0002, descreve as portas
  e a variável — reaproveitado sem mudança. Nenhuma leitura além das
  referências da tarefa foi necessária.

## Plano da alteração
1. `e2e/helpers/env.js` (novo, não previsto na tarefa — ver `## Decisões
   tomadas`): lê `apiKey`/`projectId` de `.env.local`, reusado por
   `login.js` e `fixture.js`.
2. `e2e/helpers/login.js`: `loginComPopupFake(page, opcoes)` dirige a UI
   fake do Google Auth Emulator (popup real do Playwright, clique em
   "Entrar com Google" → "Add new account" → preenche e-mail/nome →
   confirma); `loginComEmailSenha(page, opcoes)` autentica (cria na
   primeira vez) um usuário fixo por e-mail/senha com uma instância do
   SDK própria deste helper (Node), depois grava a sessão resultante
   (`credencial.user.toJSON()`) no IndexedDB do navegador
   (`firebaseLocalStorageDb`/`firebaseLocalStorage`, chave
   `firebase:authUser:<apiKey>:[DEFAULT]` — o mesmo formato que
   `firebase/auth` usa para persistir `currentUser`), para que
   `App.jsx` encontre a sessão já pronta no próximo carregamento.
3. `e2e/helpers/fixture.js`: `gravarFixture(uid, contagens)` usa
   `@firebase/rules-unit-testing` (`initializeTestEnvironment` +
   `withSecurityRulesDisabled`) para gravar `users/{uid}` com as
   contagens, `updatedAt` e `atestadoEm`.
4. `e2e/catalogo.spec.js`: login rápido, grava 20 códigos reais (`FWC00`–
   `FWC19`, contagem 1 cada) via fixture, recarrega e confere
   `.cabecalho__titulo` contra `20/994`, `2%` e `974`.
5. `playwright.config.js` (ajustado) e `playwright.dev.config.js` (novo,
   não listado nos "Arquivos impactados" — ver `## Decisões tomadas`):
   cada um com `webServer` próprio (build+preview na porta 4173; dev
   server na porta 5173) e `env: { VITE_USE_FIREBASE_EMULATOR: '1' }`.
6. `package.json`: scripts `test:e2e`/`test:e2e:dev`, no molde de
   `test:rules` (`npx --yes firebase-tools@15.29.0 emulators:exec
   --only auth,firestore --project demo-iconula "playwright test
   [--config=...]"`).
7. `vite.config.js` (ajustado, fora dos "Arquivos impactados" da tarefa —
   ver `## Decisões tomadas`): `exclude` ganha `'e2e/**'`.
8. `docs/teste-e2e.md`: motivação, visão geral, conexão com o emulador,
   estratégia de login dupla, fixture, scripts/pré-requisitos, estrutura
   de arquivos, limitações, referências.
9. `AGENTS.md` § Onde fica cada coisa, `docs/devops.md` § Validação
   local, `docs/arquitetura.md` § Build, deploy e qualidade: linhas novas
   citando ADR 0010/`docs/teste-e2e.md`.
- Verificação prevista: `npm run test:e2e` e `npm run test:e2e:dev`
  passam → rodar os dois com JDK 21+ no `PATH`; placar reflete a fixture
  → asserções do próprio `catalogo.spec.js`; `npm run lint && npm run
  test && npm run build` verdes → rodar e conferir saída;
  `docs/teste-e2e.md` cobre a ordem pedida → leitura do arquivo.
- Riscos: formato de persistência do IndexedDB do Firebase Auth é
  interno ao SDK (não é API pública) — mitigado testando de ponta a
  ponta contra o emulador real antes de fechar a tarefa, e documentando
  o mecanismo em `login.js`; muda se uma major do `firebase` alterar o
  formato.
- Desvios: nenhum no plano em si — dois ajustes durante a implementação,
  ambos em `## Decisões tomadas` (projeto do Firebase usado pelos
  helpers; `e2e/helpers/env.js` extraído).

## Decisões tomadas
- **`e2e/helpers/env.js` extraído** de `login.js`/`fixture.js` — nível 1:
  os dois helpers precisam ler `VITE_FIREBASE_API_KEY`/
  `VITE_FIREBASE_PROJECT_ID` de `.env.local`; extrair a leitura para um
  terceiro módulo evita duplicar o parser em dois arquivos. Não é um
  "Arquivo impactado" citado pela tarefa, mas vive dentro do mesmo
  `e2e/helpers/` que ela já previa criar.
- **Helpers usam o `projectId` real do app (`.env.local`), não
  `demo-iconula`** — nível 1, contorno de bug encontrado na validação: a
  primeira versão inicializava a instância de SDK dos helpers com
  `projectId: 'demo-iconula'` (o mesmo do `--project` da linha de comando
  do emulador). O teste de fumaça passava a autenticação, mas o placar
  ficava em `0/994` mesmo depois da fixture — o Auth/Firestore Emulator
  isola dados por `projectId` como um namespace independente da flag
  `--project` da CLI (confirmado gravando e lendo de volta via um script
  Node avulso: com `projectId: 'demo-iconula'` a leitura pelo app real
  — que usa `VITE_FIREBASE_PROJECT_ID=iconula` — sempre voltava
  "vazio"; com `projectId: 'iconula'` nos helpers, a leitura bateu com o
  que a fixture gravou). Corrigido lendo `VITE_FIREBASE_PROJECT_ID` de
  `.env.local` em `env.js` e usando-o nas duas instâncias de SDK
  (`login.js`, `fixture.js`) — o `demo-iconula` do `--project` da CLI
  continua existindo (identifica o emulador para a ferramenta
  `firebase-tools`), só deixou de ser o `projectId` que os helpers usam
  para autenticar/gravar.
- **`vite.config.js` ganha `exclude: ['e2e/**']`** — nível 1, previsto
  como avaliação desta tarefa pelo log da Tarefa 0024-0001 (não está nos
  "Arquivos impactados" da Tarefa 0024-0003, mas o próprio log anterior
  já apontava a necessidade): sem a exclusão, `npm run test` coletava
  `e2e/catalogo.spec.js` (o include padrão do Vitest casa `*.spec.js`) e
  quebrava ao importar `@playwright/test` fora de um test runner do
  Playwright — confirmado rodando `npm run test` antes do ajuste.
- **`playwright.dev.config.js` como arquivo separado**, em vez de um único
  `playwright.config.js` parametrizado por variável de ambiente — nível
  1: evita depender de sintaxe de variável de ambiente inline em script
  npm (`VAR=valor comando`), que não é portável para `cmd.exe` no
  Windows sem uma dependência extra (`cross-env`); cada script passa
  `--config` explícito.
- **`webServer` do Playwright** (em vez de compor `vite build && vite
  preview`/`vite dev` manualmente com espera e derrubada próprias) —
  nível 1: é o mecanismo oficial do Playwright para subir/derrubar um
  servidor ao redor da suíte, evita reinventar espera de prontidão e
  cleanup, e permite `env: { VITE_USE_FIREBASE_EMULATOR: '1' }` sem
  tocar variável de ambiente do processo do `npm run test:e2e` em si.
- **20 códigos reais da seção FWC (`FWC00`–`FWC19`) como contagens
  conhecidas do teste de fumaça** — nível 1: seção inteira e pequena
  (20 de 994), dá números redondos de conferir (`20/994`, `974`
  faltantes, `2%` — `round(20/994×100)`) e evita inventar códigos fora
  do catálogo real.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
npm run lint
> oxlint
(sem avisos ou erros)

npm run test
> vitest run
Test Files  117 passed (117)
     Tests  1430 passed (1430)
(uma repetição anterior travou com "Worker exited unexpectedly with exit
code 3221225794" — crash nativo do worker do Vitest no Windows, não
relacionado ao código desta tarefa; refeita limpa, sem essa falha)

npm run build
> vite build
✓ 136 modules transformed.
✓ built in 1.62s
(!) Some chunks are larger than 500 kB after minification.
(aviso pré-existente — SDK do Firestore, ver logs das Tarefas 0024-0001/0002)

npm run test:e2e (JDK 21 no PATH)
> firebase emulators:exec --only auth,firestore --project demo-iconula "playwright test"
Running 1 test using 1 worker
  ok 1 [chromium] › e2e\catalogo.spec.js:21:1 › placar exibido corresponde ao estado gravado na fixture (4.6s)
1 passed (9.8s)

npm run test:e2e:dev (JDK 21 no PATH)
> firebase emulators:exec --only auth,firestore --project demo-iconula "playwright test --config=playwright.dev.config.js"
Running 1 test using 1 worker
  ok 1 [chromium] › e2e\catalogo.spec.js:21:1 › placar exibido corresponde ao estado gravado na fixture (6.5s)
1 passed (11.0s)
```
JDK do `PATH` do shell é 1.8 (`java -version`); `JAVA_HOME` aponta para
Temurin 21.0.9 — usado via `PATH="$JAVA_HOME/bin:$PATH"` para as
validações acima, como já documentado para `npm run test:rules`.

## Critérios de aceite
- [x] `npm run test:e2e` passa localmente — ver `## Validação`.
- [x] `npm run test:e2e:dev` passa localmente — ver `## Validação`.
- [x] O teste de fumaça usa o helper de e-mail/senha, grava um estado
      conhecido com o helper de fixture e confere que o placar exibido
      corresponde a esse estado, não à coleção vazia —
      `e2e/catalogo.spec.js:21-33` (`loginComEmailSenha` + `gravarFixture`
      + asserções `20/994`/`2%`/`974`).
- [x] O helper de popup fake do Google existe e está pronto para uso por
      um teste futuro — `e2e/helpers/login.js:31-44`
      (`loginComPopupFake`); testado manualmente de ponta a ponta contra
      o emulador durante a implementação (clique → popup → "Add new
      account" → preenche e-mail/nome → confirma → popup fecha → app
      autentica), verificação funcional formal por teste próprio fica
      fora desta entrega (ADR 0010).
- [x] `docs/teste-e2e.md` existe e cobre, nesta ordem, do geral ao
      específico: motivação, visão geral, conexão com o emulador,
      estratégia de login, fixture, scripts, estrutura de arquivos e
      limitações, citando ADR 0010 — `docs/teste-e2e.md`.
- [x] `AGENTS.md`, `docs/devops.md` e `docs/arquitetura.md` atualizados
      conforme o escopo, citando ADR 0010 — `AGENTS.md` (tabela § Onde
      fica cada coisa), `docs/devops.md` § Validação local,
      `docs/arquitetura.md` § Build, deploy e qualidade.
- [x] `npm run lint && npm run test && npm run build` verdes — ver
      `## Validação`.

## Arquivos alterados
- `e2e/helpers/env.js` — criado (não listado na tarefa, ver `## Decisões
  tomadas`).
- `e2e/helpers/login.js` — criado.
- `e2e/helpers/fixture.js` — criado.
- `e2e/catalogo.spec.js` — criado.
- `playwright.config.js` — ajustado: `webServer` (build+preview, porta
  4173), `use.baseURL`.
- `playwright.dev.config.js` — criado (não listado na tarefa, ver
  `## Decisões tomadas`): `webServer` (dev server, porta 5173).
- `package.json` — scripts `test:e2e`, `test:e2e:dev`.
- `vite.config.js` — `exclude` ganha `'e2e/**'` (não listado na tarefa,
  ver `## Decisões tomadas`).
- `docs/teste-e2e.md` — criado.
- `AGENTS.md` — § Onde fica cada coisa: linhas para `e2e/` e
  `docs/teste-e2e.md`.
- `docs/devops.md` — § Validação local: linha para `test:e2e`/
  `test:e2e:dev`.
- `docs/arquitetura.md` — § Build, deploy e qualidade: menção aos testes
  E2E.
- `docs/plano/0024-testes-e2e-com-emuladores-do-firebase/0003-login-duplo-fixture-scripts-e-fumaca.md` — status `Concluída`.
- `docs/plano/README.md` — linha da Tarefa 0003 → `Concluída`.
