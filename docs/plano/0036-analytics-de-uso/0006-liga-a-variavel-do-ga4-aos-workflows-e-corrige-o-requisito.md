<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0006: Liga a variável do GA4 aos workflows e corrige o resquício do requisito

## Status
Concluída

## Objetivo
Fazer `VITE_GA_MEASUREMENT_ID` chegar ao build dos dois workflows de deploy —
hoje a variável existe no repositório, mas não é injetada, então o GA4 fica
inerte em produção e preview — e remover a contradição deixada em
`docs/requisitos.md` § Privacidade ("por isso não há banner de cookies"), que
contraria § Medir o uso de forma consentida. Corrige duas lacunas encontradas
na execução da fase.

## Documentos de referência
- `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md` § Decisão e § Consequências — Measurement ID via env, substituída no build.
- `.github/workflows/firebase-hosting-merge.yml` e `.github/workflows/firebase-hosting-pull-request.yml` — bloco `env:` do passo `npm ci --ignore-scripts && npm run build`.
- `docs/setup-github.md` § Variáveis do repositório — tabela, comandos e parágrafo de referência nos workflows.
- `docs/devops.md` § Secrets e variáveis — lista das variáveis.
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md` — decisão vizinha de hosting (o DDR desta tarefa é criado em `docs/devops-dr/`).
- `docs/requisitos.md` § Privacidade (bullet do armazenamento local) e § Medir o uso de forma consentida.
- `docs/idr/0071-banner-de-consentimento-para-analytics.md` — banner e chave.

## Padrões e convenções aplicáveis
- Variável de build não é secret: injetada via `vars.*`, nunca `secrets.*` — `docs/setup-github.md` § Variáveis do repositório.
- Mudança em workflow exige decisão em DDR (novo ou existente) e reflexo em `docs/devops.md` — `AGENTS.md` § Convenções.
- `docs/requisitos.md` só muda por `/esmiucar` ou `/planejar`; nesta tarefa a edição é exceção autorizada pelo humano (nível 3) — `docs/plano/CLAUDE.md` § Mudança de requisitos.
- Actions pinadas por SHA e `permissions: contents: read` — `docs/devops-dr/0003-pinning-de-actions-por-sha.md`.

## Escopo e instruções de implementação
1. `.github/workflows/firebase-hosting-merge.yml` e `.github/workflows/firebase-hosting-pull-request.yml`: acrescentar `VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}` ao bloco `env:` do passo `npm ci --ignore-scripts && npm run build`, sem tocar nas `VITE_FIREBASE_*`, nas permissions nem nos demais passos.
2. Criar `docs/devops-dr/0012-injecao-das-variaveis-de-build-nos-workflows.md` (estrutura do guia DDR): as variáveis `VITE_*` do build, incluindo `VITE_GA_MEASUREMENT_ID`, são injetadas via `vars.*` no `env:` dos dois workflows de deploy; criar a linha correspondente no `docs/devops-dr/README.md`.
3. `docs/devops.md` § Secrets e variáveis: registrar que as variáveis são injetadas no build via `vars.*`, com lastro no DDR 0012.
4. `docs/setup-github.md`: atualizar o parágrafo "Referenciadas nos workflows…" para incluir `VITE_GA_MEASUREMENT_ID`.
5. `docs/requisitos.md` § Privacidade: no bullet do armazenamento local, remover "— por isso não há banner de cookies" e declarar a chave do banner de consentimento entre os itens guardados; não criar requisito novo (o analytics consentido já está em § Medir o uso de forma consentida).

**Fora do escopo**: o módulo/carregador (Tarefa 0036-0002) e o banner (Tarefa 0036-0003); `setup-firebase.md`/`setup-gcloud.md` (Tarefa 0036-0005); a Fase 37.

## Decisões já tomadas (não reabrir)
- Measurement ID via env, substituída no build — `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md`.
- Gate rígido e banner nas duas telas — `docs/idr/0071-banner-de-consentimento-para-analytics.md`.
- Chave `iconula.consentimento-analytics.v1` no `localStorage` — `docs/model-dr/0007-persistencia-no-armazenamento-local.md`.
- CSP do GA4 — `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`.

## Impedimentos específicos
- A edição de `docs/requisitos.md` é nível 3 (só `/esmiucar`/`/planejar` alteram requisitos). **Autorizada pelo humano em 2026-09-18**, por remover resquício que contradiz requisito já registrado no planejamento.

## Arquivos impactados
- `.github/workflows/firebase-hosting-merge.yml` — modificar
- `.github/workflows/firebase-hosting-pull-request.yml` — modificar
- `docs/devops-dr/0012-injecao-das-variaveis-de-build-nos-workflows.md` — criar
- `docs/devops-dr/README.md` — modificar (índice)
- `docs/devops.md` — modificar (§ Secrets e variáveis)
- `docs/setup-github.md` — modificar
- `docs/requisitos.md` — modificar (§ Privacidade; exceção autorizada)

## Critérios de aceite
- [ ] Os dois workflows passam `VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}` no `env:` do build, e nada mais mudou neles.
- [ ] `docs/devops-dr/0012-*.md` existe, com a estrutura do guia DDR, e tem linha no índice.
- [ ] `docs/devops.md` § Secrets e variáveis cita a injeção via `vars.*` com lastro no DDR 0012.
- [ ] `docs/setup-github.md` cita `VITE_GA_MEASUREMENT_ID` como referenciada nos workflows.
- [ ] `docs/requisitos.md` § Privacidade não contém mais "não há banner de cookies" e declara a chave do banner; § Medir o uso de forma consentida permanece.
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- Busca por `VITE_GA_MEASUREMENT_ID` nos dois workflows e em `docs/*.md`.
