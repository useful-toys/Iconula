<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0011: Analytics de uso com Google Analytics 4, entregue por gtag sob consentimento

## Status

Aceito.

## Contexto

- Pedido do humano: enxergar quanto o app é usado pelo público — contas,
  uso ativo ao longo do tempo e comportamento por feature.
- `docs/requisitos.md` dizia "sem analytics no MVP" (§ Dados e isolamento) e
  listava "Analytics anônimo de uso" em § Requisitos futuros; a política de
  privacidade declarava "não há analytics" e "não exibe banner" — traço
  deliberado do produto.
- Restrições do humano: manter a aplicação sem lógica de telemetria
  espalhada no código, custo R$0 e sem infra própria. O humano aceitou,
  em troca, o banner de consentimento que o GA4 exige.
- Ambiente: projeto Firebase `iconula` no plano Spark; CSP restritiva
  ([DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md));
  bundle enxuto por princípio (o SDK do Firestore já é carregado sob demanda —
  [ADR 0005](0005-persistencia-no-firestore.md)).
- Configurado pelo humano no console (2026-09-18): Google Analytics
  habilitado e linkado ao projeto, região de dados **Brasil**, Measurement ID
  `G-KQ72XBGSTM`.

## Decisão

- **Ferramenta: Google Analytics 4**, property linkada ao projeto Firebase.
- **Entrega por `gtag.js`** carregado em runtime por um módulo mínimo
  (`src/lib/analytics.js`), **após o consentimento** — não pelo SDK
  `firebase/analytics` (colocaria código no app e pesaria o bundle) nem pelo
  snippet CDN do console (re-inicializa o Firebase com config hardcoded,
  duplicando o que `src/lib/firebase.js` já faz).
- **Measurement ID via variável de ambiente** `VITE_GA_MEASUREMENT_ID`
  (substituída no build), nunca hardcoded.
- **Sem lógica de medição nos componentes**: o módulo expõe um único
  carregador consentido; não há chamadas de evento espalhadas.
- **Região Brasil** → os dados de analytics ficam no Brasil; a política
  declara **sem transferência internacional** para essa finalidade.
- **Retenção de 14 meses** no GA4 (padrão), declarada na política.
- O pedido "comportamento por feature" fica **fora desta decisão**: os eventos
  automáticos do gtag (pageview, sessão, engajamento) cobrem contas e uso
  ativo; eventos customizados exigiriam reintroduzir código de medição.

## Consequências

- CSP abre duas origens em `firebase.json` — ver
  [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md).
- Novo componente de banner e a chave de consentimento em `localStorage` —
  ver [IDR 0071](../idr/0071-banner-de-consentimento-para-analytics.md) e
  [MDR 0007](../model-dr/0007-persistencia-no-armazenamento-local.md).
- A política de privacidade ganha a operação de analytics (consentimento,
  art. 7º I) e a versão sobe — reaceite na entrada
  ([IDR 0062](../idr/0062-reaceite-reusa-a-tela-de-atestacao.md)).
- Nova variável `VITE_GA_MEASUREMENT_ID` em `.env.example` e nas GitHub
  Actions Variables (não secret, como as `VITE_FIREBASE_*`).
- `docs/setup-firebase.md` e `docs/setup-gcloud.md` refletem o Analytics.
- O Analytics deixa de ser requisito futuro e entra como requisito
  (`docs/requisitos.md`), com consentimento — não é "anônimo" no sentido
  estrito: usa cookies/identificadores sob consentimento.
- Implementação: Fase 0036, Tarefas 0036-0002 (módulo), 0036-0003 (banner),
  0036-0004 (política) e 0036-0001 (CSP/variável).

## Alternativas consideradas

- **Plausible / Umami / GoatCounter** (cookieless, sem banner): preservam o
  "sem cookies", mas a nuvem é paga e o self-host exige VPS — conflita com
  "R$0 sem infra própria". Descartado.
- **Contadores próprios no Firestore**: privacidade limpa, mas sem funil nem
  engajamento, e cada evento consome escrita da cota Spark (o projeto é
  econômico em requisições por princípio). Descartado.
- **SDK `firebase/analytics`**: import estático pesaria o bundle e exigiria
  código no app — o oposto do pedido. Descartado.
- **Snippet CDN do console** (`firebase-app.js` + `firebase-analytics.js`):
  re-inicializa o app com config hardcoded e baixa mais JS do que o gtag
  sozinho. Descartado.
- **Consent Mode v2** (ping cookieless antes do aceite): manda dados ao
  Google antes do consentimento — menos limpo sob LGPD. Ficou de fora em favor
  do gate rígido (ver [IDR 0071](../idr/0071-banner-de-consentimento-para-analytics.md)).

## Histórico

- 2026-09-18 — Criado no planejamento do analytics de uso (Fase 0036);
  implementação nas Tarefas 0036-0001 a 0036-0005.
