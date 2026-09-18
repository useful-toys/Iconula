<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0005: Documentação e setup

## Data
2026-09-18

## Resumo
Documentação viva e de setup do analytics de uso. Antes, `arquitetura.md`,
`devops.md`, `interface.md`, `setup-firebase.md` e `setup-gcloud.md` ainda
descreviam o estado sem GA4: os serviços Firebase eram só Hosting, Auth e
Firestore; a CSP não citava as origens do analytics; a lista de variáveis não
tinha `VITE_GA_MEASUREMENT_ID`; `interface.md` não descrevia o banner e ainda
dizia "sem banner de cookies" no armazenamento local da política; e nenhum doc
de setup registrava o Analytics. Depois, os cinco documentos citam o GA4 com o
lastro dos registros da fase (ADR 0011, IDR 0071, DDR 0001) e `setup-firebase.md`
traz o Measurement ID `G-KQ72XBGSTM`.

## Discovery
- Código: `src/lib/analytics.js` é o único módulo que toca o GA4 — carrega o
  `gtag.js` em runtime, sob consentimento, e ignora preview/local sem variável
  (`analytics.js:100-131`); `iniciarAnalyticsSeConsentido()` faz o gate no
  `localStorage` (`:137-141`). `BannerDeConsentimento.jsx` só existe enquanto o
  consentimento é `nao-decidido`, com "Recusar"/"Aceitar" e link "Ver a
  política" (`BannerDeConsentimento.jsx:24-71`); `App.jsx` monta o banner em
  fluxo antes da tela de login (`:902`) e antes do cabeçalho da tela principal
  (`:943`), sempre independente da sessão. `BannerDeConsentimento.css` confirma
  a faixa em fluxo (não fixa). `VITE_GA_MEASUREMENT_ID` não é lida em nenhum
  componente — só em `analytics.js:70`.
- Documentação: li o ADR 0011 § Decisão/Consequências (GA4 por gtag, região
  Brasil, `VITE_GA_MEASUREMENT_ID`, retenção de 14 meses, consentimento e que
  `setup-firebase.md`/`setup-gcloud.md` refletem o Analytics), o IDR 0071
  § Decisão/Consequências (banner nas duas telas, gate rígido, escolha lembrada
  por dispositivo, previews fora) e o DDR 0001 § CSP para Google Analytics
  (origens `googletagmanager`, `google-analytics` e `region1.google-analytics`).
  Também reli o log da Tarefa 0036-0004, que apontou a divergência de
  `docs/interface.md` § Tela de privacidade (`:775`) e a de `docs/requisitos.md`
  § Privacidade (`:297-299`). A Tarefa 0036-0001 já havia varrido
  `VITE_GA_MEASUREMENT_ID` para `.env.example`, GitHub Actions Variables e
  `setup-github.md`. As referências bastaram.
- APIs do Google Cloud: `gcloud services list --enabled --project iconula`
  (somente leitura, previsto na tarefa) não mostra `analyticsadmin.googleapis.com`
  nem `analyticsdata.googleapis.com`; o único item com "analytics" é
  `analyticshub.googleapis.com` (Analytics Hub API — recurso de troca de dados
  do BigQuery, sem papel na medição do app).

## Plano da alteração
1. `docs/arquitetura.md` — § Serviços Firebase: bullet do Google Analytics (GA4,
   região Brasil, sob consentimento, lastro ADR 0011); § Camadas no cliente:
   citar `src/lib/analytics.js` na linha de `src/lib/`; § Decisões-chave: linha
   do ADR 0011.
2. `docs/devops.md` — § CSP e headers: citar as origens do GA4 remetendo ao
   DDR 0001; § Secrets e variáveis: acrescentar `VITE_GA_MEASUREMENT_ID`.
3. `docs/interface.md` — § Tela de login e § Tela principal: descrever a faixa
   de consentimento (quando aparece, "Recusar"/"Aceitar", link da política),
   com lastro no IDR 0071; § Tela de privacidade: trocar "sem banner de cookies"
   pela descrição do banner e da chave no armazenamento local (lastro IDR 0071);
   § Pendências de interface segue "Nenhuma".
4. `docs/setup-firebase.md` — nova seção "Google Analytics (GA4)": habilitado e
   linkado no console, região Brasil, Measurement ID `G-KQ72XBGSTM`, variável
   `VITE_GA_MEASUREMENT_ID` (com linha nova na tabela de variáveis de ambiente)
   e um passo no "Reproduzindo do zero".
5. `docs/setup-gcloud.md` — § APIs habilitadas: registrar o estado real das APIs
   de analytics verificado com o `gcloud services list` (sem API do GA4; o
   Analytics Hub do BigQuery é o único item correlato) e um passo no
   "Reproduzindo do zero".
6. Status da tarefa e do README; este log; nenhum registro de decisão novo (a
   tarefa implementa o ADR 0011, o IDR 0071 e o DDR 0001, já vigentes).
- Verificação prevista: GA4/analytics.js/ADR 0011 em `arquitetura.md` → busca;
  origens da CSP e `VITE_GA_MEASUREMENT_ID` em `devops.md` → busca; banner nas
  duas telas e "Nenhuma" em `interface.md` → busca; Measurement ID e
  `VITE_GA_MEASUREMENT_ID` em `setup-firebase.md` → busca; estado das APIs em
  `setup-gcloud.md` → busca + saída do `gcloud`.
- Riscos: descrever o banner sem contrariar o IDR 0071 (mitigado por citar só o
  que o código e o registro já decidem); nenhum outro. Nenhum toque em
  `docs/requisitos.md` nem em `.github/workflows/`.
- Desvios: nenhum (a troca em § Tela de privacidade está coberta pela
  observação da delegação).

## Decisões tomadas
- Nenhuma decisão nova: a tarefa implementa o ADR 0011, o IDR 0071 e o
  DDR 0001, já vigentes.
- Em `docs/setup-gcloud.md` § Analytics, registrar a leitura literal do
  `gcloud services list` (única API com "analytics" é o Analytics Hub do
  BigQuery) em vez de afirmar que o link habilitou algo (nível 1, sem
  registro): o comando só prova o estado, não a origem da habilitação.
- Não tocar em `docs/requisitos.md` § Privacidade (`:297-299`), que ainda
  diz "sem banner de cookies" — a execução não altera esse arquivo; fica
  registrado nas Observações.

## Impedimentos
Nenhum. O `gcloud services list` é somente leitura e estava previsto na
tarefa, então não exigiu aprovação.

## Setup realizado
Nenhum — a tarefa só documenta configuração já feita (o Analytics foi
linkado pelo humano em 2026-09-18) e verifica o estado com um comando de
leitura, registrado na Validação.

## Validação
```
$ npm run lint
> oxlint
(sem saída; exit 0)
```

```
$ npm run test
 Test Files  55 passed (55)
      Tests  711 passed (711)
   Duration  94.95s
```

```
$ npm run build
✓ built in 668ms
(!) Some chunks are larger than 500 kB after minification.
```
(O aviso de chunk grande é pré-existente — já registrado nos logs das
Tarefas 0036-0002 e 0036-0004 — e não tem relação com a tarefa. Testes de
regras não se aplicam: `firestore.rules` não foi tocado.)

```
$ gcloud services list --enabled --project iconula | grep -i analytics
analyticshub.googleapis.com                  Analytics Hub API
```
Sem `analyticsadmin.googleapis.com` nem `analyticsdata.googleapis.com` —
lastro do trecho novo de `docs/setup-gcloud.md`.

## Critérios de aceite
- [x] `docs/arquitetura.md` cita o GA4, `src/lib/analytics.js` e o ADR 0011 —
      `arquitetura.md:78-82` (serviço), `:89` (camada `src/lib/`), `:173`
      (Decisões-chave).
- [x] `docs/devops.md` cita as origens novas da CSP e a variável
      `VITE_GA_MEASUREMENT_ID` — `devops.md:113-117` (googletagmanager,
      google-analytics e region1) e `:183` (variável).
- [x] `docs/interface.md` descreve o banner nas duas telas, lastreado no
      IDR 0071, e § Pendências de interface segue "Nenhuma" — `:33-38`
      (tela principal), `:686-691` (tela de login), `:789-790` (armazenamento
      local da política) e `:1208-1210` ("Nenhuma").
- [x] `docs/setup-firebase.md` documenta habilitar/linkar o Analytics, região
      Brasil e o Measurement ID — `:252-276` (seção "Google Analytics (GA4)",
      com `G-KQ72XBGSTM`), `:191` (tabela de variáveis) e `:443-445`
      (reproduzir do zero).
- [x] `docs/setup-gcloud.md` registra o estado real das APIs de analytics
      (verificado via `gcloud services list`) — `:51-70` (Analytics Hub sem
      `analyticsadmin`/`analyticsdata`) e `:324-326` (reproduzir do zero).

## Arquivos alterados
- `docs/arquitetura.md` — GA4 nos serviços, `analytics.js` na camada de
  `src/lib/` e o ADR 0011 nas decisões-chave.
- `docs/devops.md` — origens do GA4 na CSP e `VITE_GA_MEASUREMENT_ID` nas
  variáveis do repositório.
- `docs/interface.md` — banner nas telas de login e principal e a chave do
  consentimento no armazenamento local da política.
- `docs/setup-firebase.md` — seção "Google Analytics (GA4)", variável na
  tabela e passo do "Reproduzindo do zero".
- `docs/setup-gcloud.md` — estado das APIs de analytics e passo do
  "Reproduzindo do zero".
- `docs/plano/0036-analytics-de-uso/0005-documentacao-e-setup.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0005-log-documentacao-e-setup.md` —
  este log.

## Observações
- `docs/requisitos.md` § Privacidade (`:297-299`) ainda diz "sem banner de
  cookies" — contradição conhecida, a tratar no `/planejar`; a execução não
  altera esse arquivo.
- Divergência antiga fora do escopo: `docs/interface.md:693`,
  `docs/setup-firebase.md:129,209` e `docs/setup-gcloud.md:28` citam
  "ADR 0005" (e o link `adr/0005-login-google-sdk-modular.md`, que não
  existe) para o login Google, quando o ADR do login é o 0004; o ADR 0005 é
  o da persistência. Não corrigida aqui.
- Divergência antiga fora do escopo: `docs/setup-firebase.md:280-290`
  (§ Cloud Firestore) ainda descreve o documento com o "único campo
  `teamName`", schema aposentado desde a Fase 7. Não corrigida aqui.

