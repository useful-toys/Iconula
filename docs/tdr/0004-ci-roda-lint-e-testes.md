<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0004: Workflow de CI separado para lint e testes

## Status

Aceito

## Contexto

- Review de segurança: os workflows de CI
  (`.github/workflows/firebase-hosting-*.yml`) faziam só `npm ci && npm
  run build` — `npm test` (Vitest) e `npm run lint` (oxlint) existiam no
  projeto mas nunca rodavam em CI.
- Isso não é, em si, uma falha de segurança, mas tem duas consequências
  de segurança indiretas:

- **É o veículo dos controles dos outros itens.** A regra
  `react/no-danger` ([TDR 0003](0003-lint-proibe-dangerously-set-inner-html.md))
  só barra uma regressão se o lint realmente rodar em CI — sem isso, é
  só um comentário no `.oxlintrc.json`.
- **Reproduz a ilusão de controle do `build_and_preview`.** Esse job é o
  required status check da branch (ver
  [ADR 0004](../adr/0004-branch-protection-preview-required.md)); a
  expectativa razoável é que "o check passou" signifique "o código está
  saudável". Hoje significa só "compilou". Um controle que promete mais
  do que entrega é pior que a ausência dele, porque desloca a atenção de
  quem revisa.

## Decisão

Criar um workflow novo e independente, `.github/workflows/ci.yml`, em vez
de acrescentar `npm run lint`/`npm test` ao job existente
`build_and_preview` (em `firebase-hosting-pull-request.yml`):

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262   # v4.4.0
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: 22
          cache: npm
      - run: npm ci --ignore-scripts
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Por que um job/workflow separado, e não só somar dois `run` ao job de
deploy.

- **Roda em PRs de fork.** `build_and_preview` tem
  `if: head.repo.full_name == github.repository` — de propósito, para
  não expor os secrets de deploy (`FIREBASE_SERVICE_ACCOUNT_ICONULA`) a
  um PR de fork. Isso significa que hoje um PR de fork não roda lint nem
  teste nenhum. `ci.yml` não usa nenhum secret, então pode (e deve) rodar
  para qualquer PR, fork incluído.
- **Vira um status check com nome próprio** (`ci`), que pode ser exigido
  na proteção de branch independentemente do `build_and_preview` — uma
  falha de lint/teste fica visualmente distinta de uma falha de deploy.
- **`actions/checkout` e `actions/setup-node` pinados por SHA** (em vez
  de `@v4`), com o número de versão como comentário — reduz a superfície
  de supply-chain de uma tag sendo movida para apontar para outro commit.
  Os workflows de deploy existentes ainda usam `@v4` (não alterado nesta
  decisão; considerar migrar junto numa próxima revisão desses arquivos).
- **`npm ci --ignore-scripts`**: testado localmente (`npm run lint`,
  `npm test`, `npm run build`, todos passando) — nenhuma dependência
  deste projeto precisa de scripts de instalação (`postinstall` etc.),
  então desabilitá-los reduz a superfície de execução de código arbitrário
  durante `npm ci`.

**Descoberta durante a implementação**:

- Primeira versão do workflow usava `node-version: 20` (mesma versão dos
  dois workflows de deploy); lint e build passaram, mas `npm test`
  falhou com `TypeError: webidl.util.markAsUncloneable is not a
  function` dentro de `jsdom`.
- Causa: `jsdom` (v30, via `vitest`) declara `"engines": { "node":
  "^22.22.2 || ^24.15.0 || >=26.0.0" }` — Node 20 nunca foi suportado.
  Não tinha sido notado antes porque os testes nunca rodavam em CI
  (exatamente o problema que este TDR resolve) e localmente o Node
  instalado já era >= 26.
- Correção: `node-version: 22` nos **três** workflows (`ci.yml`,
  `firebase-hosting-merge.yml`, `firebase-hosting-pull-request.yml`,
  para não deixar os workflows de deploy discrepantes) e `engines.node`
  adicionado ao `package.json` com a mesma faixa, para que a
  incompatibilidade apareça localmente (`npm install`/`npm ci` avisam)
  em vez de só em CI.

## Consequências

- PRs com teste quebrado ou violação de lint (incluindo `react/no-danger`)
  não conseguem mais ser mesclados sem alguém desabilitar o required
  check manualmente — inclusive PRs de fork, que antes não tinham
  nenhuma verificação automática.
- A proteção de branch precisa ser atualizada para incluir `ci` (nome do
  job) na lista de required status checks, seguindo a mesma sequência já
  documentada em [docs/github.md](../github.md) para `build_and_preview`:
  fazer o push do workflow, deixar rodar uma vez num PR, só então
  referenciar o nome na regra.
- `firebase-hosting-merge.yml` (deploy em produção) continua sem rodar
  lint/teste diretamente — nesse ponto o código já passou pelo `ci.yml`
  no PR que foi mesclado. Push direto em `main` sem passar por PR
  continuaria sem essa verificação, mas a proteção de branch já deveria
  impedir isso.
