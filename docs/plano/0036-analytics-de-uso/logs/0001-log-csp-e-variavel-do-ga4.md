<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0001: CSP e variável do GA4

## Data
2026-09-18

## Resumo
Abre a CSP do `firebase.json` para as origens do Google Analytics 4 e cria a
variável de build `VITE_GA_MEASUREMENT_ID`: no `.env.example`, na tabela de
variáveis do `docs/setup-github.md` e nas GitHub Actions Variables. Sem essa
etapa o `gtag.js` da Tarefa 0036-0002 não carregaria em produção.

A CSP ganhou `https://www.googletagmanager.com` em `script-src` e
`https://www.google-analytics.com` + `https://region1.google-analytics.com` em
`connect-src`; as demais diretivas e origens ficaram intactas, conforme o
DDR 0001. O `.env.example` ganhou `VITE_GA_MEASUREMENT_ID=` com o comentário de
onde tirar o valor (não é secret). O `docs/setup-github.md` ganhou a linha da
variável na tabela e o comando de criação.

Execução **retomada**: a tentativa anterior esbarrou no único credencial de
GitHub do ambiente (token de GitHub App sem permissão de Actions;
`gh variable set`/`list` → HTTP 403). O humano então criou a variável
manualmente no repositório `useful-toys/Iconula`, e a confirmação de
2026-09-18 atende o critério "a variável existe no repositório". O wiring de
`VITE_GA_MEASUREMENT_ID` nos workflows ficou fora do escopo — será tratado por
tarefa nova via `/planejar`.

## Discovery
- Código/configuração: `firebase.json` traz a CSP com `script-src` e
  `connect-src` ainda sem as origens do GA4, exatamente como a tarefa supõe.
  `.env.example` lista só as seis `VITE_FIREBASE_*`. Os workflows
  `firebase-hosting-merge.yml` e `firebase-hosting-pull-request.yml` passam as
  `VITE_FIREBASE_*` via `vars.*` no bloco `env:` do `npm run build`, mas **não**
  passam `VITE_GA_MEASUREMENT_ID` — nenhuma tarefa da fase prevê esse wiring
  (observação para as próximas tarefas). Não há teste que leia `firebase.json`
  ou a CSP. Nenhum impacto fora dos "Arquivos impactados".
- Documentação: li o [ADR 0011](../../../adr/0011-analytics-de-uso-com-google-analytics-4.md)
  § Decisão/Consequências e o
  [DDR 0001](../../../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md)
  § CSP para Google Analytics (GA4) / Política consolidada: as origens exatas e
  o fato de `img-src` não mudar estão decididos. As referências bastaram.

## Plano da alteração
1. `firebase.json`: acrescentar `https://www.googletagmanager.com` ao
   `script-src` e `https://www.google-analytics.com` +
   `https://region1.google-analytics.com` ao `connect-src`, sem tocar nas
   demais diretivas.
2. `.env.example`: acrescentar `VITE_GA_MEASUREMENT_ID=` com comentário de onde
   tirar o valor (console do Firebase, fluxo de dados Web).
3. `docs/setup-github.md` § Variáveis do repositório: nova linha
   `VITE_GA_MEASUREMENT_ID` e o comando de criação com o valor como
   `<REDACTED>` no log.
4. Setup: `gh variable set VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula
   --body "<REDACTED>"` (comando exato coberto pela confirmação do humano);
   registrar no log com `<REDACTED>`.
5. Verificação: `npm run lint && npm run test && npm run build`;
   `gh variable list --repo useful-toys/Iconula`; busca no `firebase.json`.
- Verificação prevista: origens no `firebase.json` → leitura/busca; variável no
  `.env.example` → leitura; variável no repositório → `gh variable list`; doc →
  leitura.
- Riscos: nenhum teste que valide a CSP (a verificação real exige preview
  deploy, fora do escopo). Nenhum.
- Desvios: o passo 4 (setup) não pôde ser executado pelo agente — sem permissão
  de Actions no ambiente. O humano executou a criação manualmente e confirmou
  o resultado em 2026-09-18; a verificação "variável no repositório" passou a
  ser por confirmação do humano, não por `gh variable list`.

## Decisões tomadas
- Nenhuma decisão nova. As origens e a variável já estão decididas no ADR 0011
  e no DDR 0001; a tarefa as implementa.

## Impedimentos
Nível 3 — `gh variable set` é configuração pública do repositório e exige
aprovação explícita com o comando exato. A aprovação foi dada em 2026-09-18
para `gh variable set VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula --body
"<REDACTED>"`. Como o agente não tem a permissão de Actions no ambiente, o
humano executou a criação manualmente e confirmou o resultado em 2026-09-18; o
critério "a variável existe no repositório" passa a ser atendido por essa
confirmação (ver `## Setup realizado`).

## Setup realizado

### 1. Criar a variável `VITE_GA_MEASUREMENT_ID` no repositório
- Ambiente: GitHub
- Aprovação do humano: 2026-09-18 (nível 3) —
  `gh variable set VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula --body "<REDACTED>"`
- Comando executado (executado **manualmente pelo humano**, 2026-09-18):
  ```
  gh variable set VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula --body "<REDACTED>"
  ```
  O agente não tem permissão de Actions no ambiente: o único credencial é um
  token de GitHub App (prefixo `ghu_`), e `gh variable set`/`list` retornam
  `HTTP 403: Resource not accessible by integration`; o
  `GITHUB_CODESPACE_TOKEN` responde 401 *Bad credentials*.
- Saída relevante: confirmação do humano de que a variável foi criada com o
  valor `<REDACTED>`.
- Efeito: `vars.VITE_GA_MEASUREMENT_ID` passa a existir no repositório. O
  wiring nos workflows (`firebase-hosting-merge.yml` e
  `firebase-hosting-pull-request.yml`) **não** foi feito — está fora do escopo
  desta tarefa e será tratado por tarefa nova.
- Verificação: confirmação do humano (2026-09-18). A verificação por
  `gh variable list --repo useful-toys/Iconula` não é possível no ambiente
  (mesmo 403 de permissão).
- Como reverter: `gh variable delete VITE_GA_MEASUREMENT_ID --repo useful-toys/Iconula`.
- Documento atualizado: `docs/setup-github.md` § Variáveis do repositório.

## Validação
```
$ npm run lint
> oxlint
(sem avisos)
```
```
$ npm run test
 Test Files  53 passed (53)
      Tests  689 passed (689)
```
```
$ npm run build
✓ built in 1.50s
(!) Some chunks are larger than 500 kB after minification.
```
(Aviso de chunk grande é pré-existente e não tem relação com a tarefa.)

## Critérios de aceite
- [x] `firebase.json` tem `https://www.googletagmanager.com` em `script-src` e
      `https://www.google-analytics.com` + `https://region1.google-analytics.com`
      em `connect-src`, e nenhuma outra origem nova — conferido no arquivo.
- [x] `.env.example` tem `VITE_GA_MEASUREMENT_ID` — conferido no arquivo.
- [x] A variável existe no repositório — **atendido por confirmação do humano
      (2026-09-18)**: criada manualmente em `useful-toys/Iconula` com o valor
      `<REDACTED>`. O agente não consegue verificar por `gh variable list`
      (403 de permissão de Actions).
- [x] `docs/setup-github.md` cita `VITE_GA_MEASUREMENT_ID` na tabela de
      variáveis — conferido no arquivo.

## Arquivos alterados
- `firebase.json` — origens do GA4 no `script-src` e no `connect-src`.
- `.env.example` — `VITE_GA_MEASUREMENT_ID=` com comentário.
- `docs/setup-github.md` — linha e comando da variável `VITE_GA_MEASUREMENT_ID`.
- `docs/plano/0036-analytics-de-uso/0001-csp-e-variavel-do-ga4.md` — status.
- `docs/plano/README.md` — status da fase e da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0001-log-csp-e-variavel-do-ga4.md` — este log.
