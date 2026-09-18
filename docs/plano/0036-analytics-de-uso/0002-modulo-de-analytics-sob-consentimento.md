<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0002: Módulo de analytics sob consentimento

## Status
Pendente

## Objetivo
Criar `src/lib/analytics.js`: um módulo mínimo que carrega o `gtag.js`
dinamicamente só quando há consentimento e fora de preview, expondo a leitura
do consentimento e o carregador. É a única peça que toca o Google Analytics —
nenhum componente chama o gtag diretamente.

## Documentos de referência
- `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md` § Decisão — entrega por gtag, módulo mínimo, sem lógica espalhada.
- `docs/idr/0071-banner-de-consentimento-para-analytics.md` § Decisão — gate rígido e filtro de preview.
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` § localStorage — consentimento de analytics — chave e valores.
- `src/lib/preferenciasDeVista.js` — padrão de módulo sem React e de leitura/escrita de `localStorage`.

## Padrões e convenções aplicáveis
- Módulos sem React ficam em `src/lib/` — `docs/adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md`.
- Teste co-localizado ao lado do módulo (`.test.js`) — `docs/adr/0009-testes-co-localizados.md`.
- Leitura/escrita de `localStorage` degrada em silêncio para o padrão conservador — `docs/model-dr/0007-persistencia-no-armazenamento-local.md`.

## Escopo e instruções de implementação
1. Criar `src/lib/analytics.js` com:
   - `consentimentoAnalytics()` → `'aceito' | 'recusado' | 'nao-decidido'`, lendo a chave `iconula.consentimento-analytics.v1`; valor desconhecido ou falha de leitura → `'nao-decidido'`.
   - `gravarConsentimentoAnalytics(valor)` → grava `'aceito' | 'recusado'`; falha ignorada.
   - `carregarAnalytics()` → injeta o `<script>` do gtag (`https://www.googletagmanager.com/gtag/js?id=...`) e chama `gtag('config', ...)` usando o Measurement ID vindo de `import.meta.env.VITE_GA_MEASUREMENT_ID`; idempotente (não carrega duas vezes) e sem efeito quando a variável não existe.
   - guarda de preview: hostname de canal (`iconula--pr<N>-*.web.app`) ou `localhost` sem a variável → não carrega.
   - `iniciarAnalyticsSeConsentido()` → se `consentimentoAnalytics()` é `'aceito'` e não é preview, chama `carregarAnalytics()`.
   - Não importa `firebase/analytics` nem qualquer SDK do Firebase.
2. Criar `src/lib/analytics.test.js` cobrindo: consentimento ausente/desconhecido → `'nao-decidido'`; `'aceito'`/`'recusado'` persistem; `carregarAnalytics` injeta o script uma única vez e respeita a ausência da variável; o guard de preview impede o carregamento no hostname de canal.
3. Nada mais usa o módulo nesta tarefa (a integração no `App.jsx` é da Tarefa 0036-0003).

**Fora do escopo**: o banner e sua montagem nas telas (Tarefa 0036-0003); a política (Tarefa 0036-0004).

## Decisões já tomadas (não reabrir)
- GA4 por gtag sob consentimento, sem SDK — `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md`.
- Gate rígido e preview sem analytics — `docs/idr/0071-banner-de-consentimento-para-analytics.md`.
- Chave `iconula.consentimento-analytics.v1` com `'aceito' | 'recusado'` — `docs/model-dr/0007-persistencia-no-armazenamento-local.md`.

## Decisões em aberto nesta tarefa
- Nomes e assinaturas exatas das funções do módulo — nível 1; seguir os nomes do escopo salvo se o discovery indicar convenção local diferente.

## Arquivos impactados
- `src/lib/analytics.js` — criar
- `src/lib/analytics.test.js` — criar

## Critérios de aceite
- [ ] `src/lib/analytics.js` não importa nenhum SDK do Firebase e expõe as funções de consentimento e carregamento.
- [ ] `iniciarAnalyticsSeConsentido()` só carrega o gtag com `'aceito'`.
- [ ] `carregarAnalytics()` é idempotente e não carrega sem `VITE_GA_MEASUREMENT_ID`.
- [ ] O guard de preview impede o carregamento em hostname de canal.
- [ ] Testes cobrem os casos acima e passam em `npm run test`.
