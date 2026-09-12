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

### Ferramentas de validação local

Os mesmos scripts rodam local e no CI — `npm run lint`, `npm test`,
`npm run test:rules`, `npm run build` —, então qualquer falha de CI é
reproduzível localmente sem depender de push.

| Script | Ferramenta | O que valida |
|---|---|---|
| `npm run lint` | **oxlint** | Regras estáticas: `react/no-danger` (XSS), `react/rules-of-hooks`, entre outras. Config em `.oxlintrc.json`. |
| `npm test` | **Vitest** + **jsdom** + **React Testing Library** + **@testing-library/user-event** | Testes de unidade e integração dos componentes React. Ambiente `jsdom` configurado em `vite.config.js` (`test.environment: "jsdom"`, `globals: true`). `vite.config.js` exclui `.claude/**` (worktrees de outras branches) e `**/*.rules.test.js` (config própria). |
| `npm run test:rules` | **Vitest** + **@firebase/rules-unit-testing** + **firebase-tools emulators:exec** + **JDK 21+** | Testes das regras de segurança do Firestore contra o emulador. Config separada em `vitest.rules.config.js` (`environment: "node"`, `testTimeout: 20000`, `hookTimeout: 30000`). O emulador roda na JVM, por isso a exigência de JDK 21+. |
| `npm run build` | **Vite** | Build de produção em `dist/`. |

- **Versões fixas no `package.json`**: oxlint `^1.79.0`, Vitest `^5.0.0`,
  jsdom `^30.0.1`, `@firebase/rules-unit-testing` `^5.0.2`,
  `@testing-library/react` `^16.3.3`, `@testing-library/user-event`
  `^14.6.7`, firebase-tools `15.29.0` (usado pelo `npm run test:rules`).
- **Node 22 obrigatório** (`engines.node` no `package.json`): `jsdom` v30
  exige `"node": "^22.22.2 || ^24.15.0 || >=26.0.0"`.
- **JDK 21+ obrigatório** para `npm run test:rules`: o emulador do
  Firestore roda na JVM e o `firebase-tools` exige JDK 21+.

### Descoberta: Node 22 obrigatório

- Primeira versão usava Node 20; `npm test` falhou com erro no `jsdom`
- Causa: `jsdom` v30 exige `"node": "^22.22.2 || ^24.15.0 || >=26.0.0"`
- Correção: `node-version: 22` nos **três** workflows + `engines.node`
  no `package.json`

### Descoberta: JDK distribution temurin

- O `setup-java` do CI usa `distribution: temurin` (Eclipse Adoptium) em
  vez de deixar o default da imagem do runner.
- Motivo: a imagem `ubuntu-latest` do GitHub Actions traz mais de um JDK
  instalado, e o default pode mudar entre versões da imagem. Fixar a
  distribuição evita que os testes de regras quebrem por troca de imagem.
- Temurin é a distribuição recomendada pelo Adoptium Working Group,
  gratuita e com suporte de longo prazo.

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

## Histórico

- **2026-09-12**: adicionada seção "Ferramentas de validação local" — os
  DDRs e o devops.md mencionavam os passos do CI sem nomear as ferramentas
  concretas (oxlint, Vitest, jsdom, React Testing Library,
  rules-unit-testing, configs). A documentação estava espalhada em TDRs
  antigos (0003, 0004, 0008) e no AGENTS.md, sem consolidação nos DDRs.
