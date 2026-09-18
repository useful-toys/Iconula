<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0012: Injeção das variáveis de build nos workflows

## Status

Aceito.

## Contexto

- Vite substitui `import.meta.env.VITE_*` em tempo de build: a variável precisa
  existir no ambiente do `npm run build`, não em runtime.
- Os dois workflows de deploy (`firebase-hosting-merge.yml` e
  `firebase-hosting-pull-request.yml`) já injetavam as `VITE_FIREBASE_*` no
  bloco `env:` do passo de build.
- A Fase 0036 criou `VITE_GA_MEASUREMENT_ID` no repositório e no `.env.example`
  (Tarefa 0036-0001), mas ela não chegava ao build dos workflows — o GA4
  ficaria inerte em produção e preview.
- As variáveis não são secretas: são config pública do Web App e o gtag é
  carregado no navegador ([ADR 0011](../adr/0011-analytics-de-uso-com-google-analytics-4.md)).

## Decisão

- As variáveis de build `VITE_*` são injetadas no `env:` do passo
  `npm ci --ignore-scripts && npm run build` dos dois workflows de deploy,
  via GitHub Actions **Variables** (`vars.*`), nunca `secrets.*`.
- `VITE_GA_MEASUREMENT_ID` entra na mesma lista das `VITE_FIREBASE_*`.
- O `env:` fica restrito ao passo de build; os passos seguintes continuam
  usando `secrets.*` para a service account.

## Consequências

- O mesmo conjunto de variáveis alimenta produção (merge) e preview (PR) —
  preview também mede, mas o módulo de analytics ignora hostnames de canal de
  preview ([IDR 0071](../idr/0071-banner-de-consentimento-para-analytics.md)).
- Criar uma nova variável de build exige, no mesmo PR, criá-la no repositório
  ([docs/setup-github.md](../setup-github.md) § Variáveis do repositório) e
  acrescentá-la ao `env:` dos dois workflows.
- Variables (não Secrets) evitam alarme de secret-scanning e deixam
  `gh variable list` mostrar o valor.
- Implementação: Fase 0036, Tarefa 0036-0006.

## Alternativas consideradas

- **Guardar a variável como secret**: esconderia um valor que vai ao bundle de
  qualquer forma e acionaria o secret-scanning — sem ganho. Descartado.
- **Injetar só no workflow de produção**: o preview deixaria de exercitar o
  carregamento consentido do GA4 antes do merge. Descartado.
- **Hardcoded no `firebase.json` ou no código**: contraria o uso de variável de
  ambiente decidido no [ADR 0011](../adr/0011-analytics-de-uso-com-google-analytics-4.md).
  Descartado.
- **`env:` no nível do job**: daria as variáveis a todos os passos, inclusive
  os que carregam a credencial de deploy. Descartado.

## Histórico

- 2026-09-18 — Criado na execução da Fase 0036, Tarefa 0036-0006: as variáveis
  de build passam a ser injetadas nos workflows via `vars.*`, incluindo
  `VITE_GA_MEASUREMENT_ID`.
