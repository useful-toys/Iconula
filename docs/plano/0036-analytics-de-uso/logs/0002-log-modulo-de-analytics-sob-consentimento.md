<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0002: Módulo de analytics sob consentimento

## Data
2026-09-18

## Resumo
Cria `src/lib/analytics.js`, o único módulo que toca o Google Analytics: lê e
grava o consentimento em `localStorage` (chave
`iconula.consentimento-analytics.v1`) e carrega o `gtag.js` dinamicamente só
quando há `'aceito'`, há Measurement ID e o host não é de preview. Nada mais
usa o módulo nesta fase (a montagem no `App.jsx` é da Tarefa 0036-0003).

Antes: nenhuma forma de carregar analytics no app. Depois: funções puras de
consentimento e um carregador único, idempotente, sem SDK do Firebase e com
gate rígido (IDR 0071).

## Discovery
- Código: `src/lib/` não tem nenhum módulo de script dinâmico nem uso de
  `import.meta.env` em teste além de `firebase.js`. O padrão de módulo sem
  React e de `localStorage` que degrada em silêncio vem de
  `src/lib/preferenciasDeVista.js` (leitura/escrita em `try/catch`, chave
  versionada, valor fora do domínio → padrão conservador). O padrão de teste
  co-localizado é `describe` com `beforeEach`/`afterEach`, `localStorage.clear()`
  e `vi.restoreAllMocks()` (`src/lib/preferenciasDeVista.test.js`); variáveis
  `VITE_*` são fixadas com `vi.stubEnv` (`src/lib/firebase.test.js`).
  `VITE_GA_MEASUREMENT_ID` já existe em `.env.example` (Tarefa 0036-0001).
  Nenhum uso atual do módulo ou impacto fora dos "Arquivos impactados".
  Comportamento atual confere com a tarefa.
- Documentação: li o [ADR 0011](../../../adr/0011-analytics-de-uso-com-google-analytics-4.md)
  § Decisão/Consequências (gtag em runtime por módulo mínimo, Measurement ID via
  env, sem SDK) e o [IDR 0071](../../../idr/0071-banner-de-consentimento-para-analytics.md)
  § Decisão (gate rígido, recusar mantém o app funcional, previews não disparam
  analytics). As referências bastaram; o MDR 0007 já fixa chave e valores.

## Plano da alteração
1. Criar `src/lib/analytics.js` — constantes (chave, id do script, URL do gtag);
   `consentimentoAnalytics()` lê a chave e só reconhece `'aceito' | 'recusado'`,
   caindo em `'nao-decidido'` para ausência/valor desconhecido/exceção de
   leitura; `gravarConsentimentoAnalytics(valor)` só grava os dois valores e
   ignora exceção; helper interno `idDeMedicao()` lê
   `import.meta.env.VITE_GA_MEASUREMENT_ID`; guarda de ambiente de preview
   (hostname de canal `iconula--pr<N>-*.web.app` ou `localhost`/loopback sem a
   variável); `carregarAnalytics()` sai sem efeito sem id, em preview, ou se o
   script já existe (idempotência por `document.getElementById`), senão injeta o
   `<script async>` e define `window.gtag`/`window.dataLayer` chamando
   `gtag('js', new Date())` e `gtag('config', id)`;
   `iniciarAnalyticsSeConsentido()` só chama o carregador com `'aceito'` e fora
   de preview. Sem nenhum `import`.
2. Criar `src/lib/analytics.test.js` — consentimento ausente/desconhecido →
   `'nao-decidido'`; gravação de `'aceito'`/`'recusado'` persiste e é lida de
   volta; falha de leitura/escrita não quebra nem vira `'aceito'`; carregador
   injeta um único `<script>` com a URL do gtag e enfileira `js`/`config` no
   `dataLayer`; sem variável não injeta; segunda chamada não duplica; hostname de
   canal bloqueia; `iniciarAnalyticsSeConsentido()` carrega só com `'aceito'`.
3. Sem registros de decisão novos e sem `docs/*.md` (nada de comportamento
   visível nem de arquitetura muda nesta tarefa).
4. Verificação: `npm run lint && npm run test && npm run build`; busca do
   arquivo por import de Firebase (critério do escopo).
- Verificação prevista: idempotência/variável ausente/preview/consentimento →
  testes; ausência de import de Firebase → busca no arquivo; exposição das
  funções → import no teste.
- Riscos: o gate de localhost depende da presença da variável (o texto do escopo
  diz "localhost **sem a variável**"); em dev com `.env.local` contendo o id, o
  gtag carrega no localhost — comportamento literalmente pedido, registrado em
  "Decisões tomadas". Nenhum outro.
- Desvios: nenhum.

## Decisões tomadas
- Nomes e assinaturas do módulo seguem o escopo (`consentimentoAnalytics`,
  `gravarConsentimentoAnalytics`, `carregarAnalytics`,
  `iniciarAnalyticsSeConsentido`) — nível 1, sem registro (API interna já
  descrita na tarefa).
- Idempotência por presença do `<script>` com id próprio no DOM, não por flag de
  módulo — nível 1, sem registro: sobrevive a recargas do módulo e é
  observável no teste.
- Guarda de localhost lida ao pé da letra: `localhost`/loopback **sem** a
  variável não carrega (subsumido pela checagem de variável); com a variável,
  carrega — nível 1, sem registro.
- Incluir `gtag('js', new Date())` antes de `gtag('config', id)`, como no
  snippet canônico do gtag — nível 1, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída; exit 0)
```

```
$ npm run test
 Test Files  54 passed (54)
      Tests  705 passed (705)
   Duration  124.26s
```

```
$ npm run build
✓ 177 modules transformed.
✓ built in 1.85s
(!) Some chunks are larger than 500 kB after minification.
```
(Aviso de chunk grande é pré-existente e não tem relação com a tarefa.)

## Critérios de aceite
- [x] `src/lib/analytics.js` não importa nenhum SDK do Firebase e expõe as
      funções de consentimento e carregamento — busca no arquivo (0 `import`) e
      teste que consome as funções.
- [x] `iniciarAnalyticsSeConsentido()` só carrega o gtag com `'aceito'` —
      teste.
- [x] `carregarAnalytics()` é idempotente e não carrega sem
      `VITE_GA_MEASUREMENT_ID` — teste.
- [x] O guard de preview impede o carregamento em hostname de canal — teste.
- [x] Testes cobrem os casos acima e passam em `npm run test` — 705 passed,
      16 deles em `src/lib/analytics.test.js`.

## Arquivos alterados
- `src/lib/analytics.js` — criado; consentimento e carregador do gtag.
- `src/lib/analytics.test.js` — criado; testes do módulo.
- `docs/plano/0036-analytics-de-uso/0002-modulo-de-analytics-sob-consentimento.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0002-log-modulo-de-analytics-sob-consentimento.md`
  — este log.
