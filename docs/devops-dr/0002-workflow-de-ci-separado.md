<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0002: Workflow de CI separado para lint e testes

## Status

Aceito (migra TDR 0004)

## Contexto

- Os workflows de deploy faziam só `npm ci && npm run build` — lint e
  testes nunca rodavam em CI.
- A regra `react/no-danger` (TDR 0003) só funciona se o lint rodar em
  CI — sem isso, é só um comentário no `.oxlintrc.json`.
- O job `build_and_preview` é required status check, mas só verificava
  "compilou", não "está saudável".

## Decisão

Criar workflow independente, `.github/workflows/ci.yml`:

- **Trigger**: `pull_request` (qualquer PR) + `push` na `main`
- **Permissions**: `contents: read` (mínimo necessário)
- **Steps**: checkout → setup-node (22) → setup-java (21, para emulador)
  → `npm ci --ignore-scripts` → lint → test → test:rules → build
- **Roda em PRs de fork**: não usa secrets, ao contrário do
  `build_and_preview` que carrega `FIREBASE_SERVICE_ACCOUNT_ICONULA`
- **Status check próprio** (`ci`): falha de lint/teste visualmente
  distinta de falha de deploy
- **Actions pinadas por SHA** (DDR 0003)
- **`npm ci --ignore-scripts`**: nenhuma dependência precisa de
  `postinstall`; desabilitar reduz superfície de execução

### Descoberta: Node 22 obrigatório

- Primeira versão usava Node 20; `npm test` falhou com erro no `jsdom`
- Causa: `jsdom` v30 exige `"node": "^22.22.2 || ^24.15.0 || >=26.0.0"`
- Correção: `node-version: 22` nos **três** workflows + `engines.node`
  no `package.json`

## Consequências

- PRs com teste quebrado ou violação de lint não podem ser mesclados —
  inclusive PRs de fork
- `ci` e `build_and_preview` são required status checks na `main`
- `firebase-hosting-merge.yml` não roda lint/teste diretamente — o
  código já passou pelo `ci.yml` no PR que foi mesclado
- `npm run test:rules` precisa de JDK 21+ (emulador do Firestore roda
  na JVM)

## Alternativas consideradas

- **Somar lint/teste ao job `build_and_preview`**: rejeitado — esse job
  não roda em PR de fork (protege secrets de deploy), então forks
  continuariam sem verificação
