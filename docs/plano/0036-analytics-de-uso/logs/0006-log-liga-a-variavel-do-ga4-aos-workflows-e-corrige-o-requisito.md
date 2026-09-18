<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0006: Liga a variável do GA4 aos workflows e corrige o resquício do requisito

## Data
2026-09-18

## Resumo
Fecha duas lacunas da Fase 0036. Antes, a variável `VITE_GA_MEASUREMENT_ID`
existia no repositório (Tarefa 0036-0001) mas não era injetada no build dos
workflows de deploy — o GA4 ficaria inerte em produção e preview; agora os
dois workflows passam `VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}`
no `env:` do passo de build, documentado no novo DDR 0012. Antes, o bullet do
armazenamento local em `docs/requisitos.md` § Privacidade dizia "— por isso não
há banner de cookies", contradizendo § Medir o uso de forma consentida; o
resquício saiu e o bullet declara a chave `iconula.consentimento-analytics.v1`
do banner. Arquivos: os dois workflows (linha nova no `env:` de build), DDR
0012 (decisão), `docs/devops-dr/README.md` (índice), `docs/devops.md` §
Secrets e variáveis (lastro no DDR 0012), `docs/setup-github.md` (parágrafo
"Referenciadas nos workflows…") e `docs/requisitos.md` (exceção autorizada).

## Discovery
- Código: não se aplica (sem código-fonte; só workflows e documentação).
- Workflows: `firebase-hosting-merge.yml` e `firebase-hosting-pull-request.yml`
  têm, no passo `npm ci --ignore-scripts && npm run build`, um bloco `env:` com
  as seis `VITE_FIREBASE_*` via `vars.*` — e nada de `VITE_GA_MEASUREMENT_ID`.
  O `env:` é só desse passo; os demais passos usam `secrets.*` (service
  account). `permissions: contents: read` no topo de ambos.
- Documentação: a variável já existe em `.env.example` (Tarefa 0036-0001), em
  `docs/setup-github.md` § Variáveis do repositório (tabela, comando e o
  parágrafo "Referenciadas nos workflows…", que ainda dizia só
  `vars.VITE_FIREBASE_*`) e em `docs/devops.md` § Secrets e variáveis.
- `docs/requisitos.md` § Privacidade (linha 310) trazia, no bullet do
  armazenamento local, "— por isso não há banner de cookies", contradizendo
  § Medir o uso de forma consentida (linha 349, GA4 consentido). A chave do
  banner é `iconula.consentimento-analytics.v1`
  (`docs/model-dr/0007-persistencia-no-armazenamento-local.md` § localStorage
  — consentimento de analytics; `docs/idr/0071-banner-de-consentimento-para-analytics.md`).
- DDR: a pasta `docs/devops-dr/` está no 0011; `0012` está livre (conferido em
  `origin/main` e na branch). Não há DDR existente sobre injeção de variáveis
  de build — é decisão nova.

## Plano da alteração
1. Acrescentar `VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}` ao
   `env:` do passo de build dos dois workflows, sem tocar no mais.
2. Criar `docs/devops-dr/0012-injecao-das-variaveis-de-build-nos-workflows.md`
   (estrutura do guia DDR) e a linha no índice.
3. `docs/devops.md` § Secrets e variáveis: declarar a injeção via `vars.*` no
   `env:` do build, com lastro no DDR 0012.
4. `docs/setup-github.md`: atualizar o parágrafo "Referenciadas nos workflows…"
   para incluir `VITE_GA_MEASUREMENT_ID`.
5. `docs/requisitos.md` § Privacidade: remover o resquício do banner e declarar
   a chave do consentimento entre os itens guardados (exceção nível 3
   autorizada pelo humano em 2026-09-18).
6. Marcar status `Concluída` na tarefa e na linha do README.

- Verificação prevista:
  - critério 1 → busca por `VITE_GA_MEASUREMENT_ID` nos dois workflows e
    `git diff` mostrando só a linha acrescentada;
  - critério 2 → leitura do DDR 0012 e do índice;
  - critério 3 → busca por DDR 0012 em `docs/devops.md`;
  - critério 4 → busca por `VITE_GA_MEASUREMENT_ID` em `docs/setup-github.md`;
  - critério 5 → busca por "banner de cookies" (ausente) e pela chave em
    `docs/requisitos.md`, com § Medir o uso de forma consentida presente;
  - critério 6 → `npm run lint && npm run test && npm run build`.
- Riscos: nenhum técnico — mudança de configuração e documentação; o build
  local não lê a variável (o gtag só carrega no navegador, sob consentimento).
- Desvios: nenhum.

## Decisões tomadas
- Edição de `docs/requisitos.md` § Privacidade — exceção nível 3 autorizada
  pelo humano em 2026-09-18 (prompt de delegação): remove o resquício que
  contradizia requisito já registrado no planejamento; não cria requisito
  novo. Lastro: `docs/model-dr/0007-persistencia-no-armazenamento-local.md` e
  `docs/idr/0071-banner-de-consentimento-para-analytics.md`.
- Injeção das variáveis `VITE_*` via `vars.*` no `env:` do passo de build dos
  dois workflows — decisão significativa já registrada no planejamento,
  materializada no novo `docs/devops-dr/0012-injecao-das-variaveis-de-build-nos-workflows.md`.
- Sem decisões de nível 1 ou 2 novas.

## Impedimentos
Nenhum. A edição de `docs/requisitos.md` seria nível 3, mas veio coberta pela
autorização explícita do humano no prompt de delegação (2026-09-18).

## Setup realizado
Nenhum (a variável já existe no repositório desde a Tarefa 0036-0001; sem
comandos `gh`).

## Validação
- `npm run lint` — exit 0 (oxlint sem avisos).
- `npm run test` — `Test Files 55 passed (55)`, `Tests 711 passed (711)`,
  exit 0.
- `npm run build` — `✓ 180 modules transformed`, `✓ built in 1.04s`, exit 0;
  aviso de chunk >500 kB pré-existente e alheio à mudança (nenhum
  código-fonte foi tocado).
- `npm run test:rules` — não se aplica (não tocou `firestore.rules`).
- Busca: `VITE_GA_MEASUREMENT_ID` presente nos dois workflows
  (`firebase-hosting-merge.yml:38`, `firebase-hosting-pull-request.yml:53`).

## Critérios de aceite
- [x] Os dois workflows passam `VITE_GA_MEASUREMENT_ID: ${{ vars.VITE_GA_MEASUREMENT_ID }}`
  no `env:` do build, e nada mais mudou neles — `git diff` mostra uma linha
  nova em cada arquivo.
- [x] `docs/devops-dr/0012-*.md` existe, com a estrutura do guia DDR, e tem
  linha no índice — arquivo criado e linha em `docs/devops-dr/README.md`.
- [x] `docs/devops.md` § Secrets e variáveis cita a injeção via `vars.*` com
  lastro no DDR 0012 — parágrafo acrescentado.
- [x] `docs/setup-github.md` cita `VITE_GA_MEASUREMENT_ID` como referenciada
  nos workflows — parágrafo "Referenciadas nos workflows…" atualizado.
- [x] `docs/requisitos.md` § Privacidade não contém mais "não há banner de
  cookies" e declara a chave do banner; § Medir o uso de forma consentida
  permanece — busca confirma.
- [x] `npm run lint && npm run test && npm run build` verdes.

## Arquivos alterados
- `.github/workflows/firebase-hosting-merge.yml` — linha `VITE_GA_MEASUREMENT_ID` no `env:` do build.
- `.github/workflows/firebase-hosting-pull-request.yml` — idem.
- `docs/devops-dr/0012-injecao-das-variaveis-de-build-nos-workflows.md` — novo DDR.
- `docs/devops-dr/README.md` — linha do DDR 0012 no índice.
- `docs/devops.md` — parágrafo da injeção via `vars.*` (§ Secrets e variáveis).
- `docs/setup-github.md` — parágrafo "Referenciadas nos workflows…".
- `docs/requisitos.md` — bullet do armazenamento local (§ Privacidade).
- `docs/plano/0036-analytics-de-uso/0006-liga-a-variavel-do-ga4-aos-workflows-e-corrige-o-requisito.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0006-log-liga-a-variavel-do-ga4-aos-workflows-e-corrige-o-requisito.md` — este log.
