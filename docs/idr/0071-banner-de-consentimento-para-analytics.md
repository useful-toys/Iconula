<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0071: Banner de consentimento para analytics

## Status

Aceito.

## Contexto

- O app nunca teve analytics, e a política declarava "não exibe banner" —
  ausência deliberada (ver [IDR 0061](0061-conteudo-de-conformidade-da-politica-e-dos-termos.md),
  `docs/requisitos.md` § Privacidade).
- Com o GA4 (ver [ADR 0011](../adr/0011-analytics-de-uso-com-google-analytics-4.md)),
  os cookies e identificadores usados são dado pessoal sob a LGPD — exigem
  consentimento e, portanto, um banner.
- Pedido do humano: enxergar o uso, sem infra própria e sem lógica de
  medição no código; aceitou o banner em troca.
- O GA4 mede visitantes, inclusive deslogados — o banner precisa existir na
  tela de login também.

## Decisão

- **Banner de consentimento** nas duas telas — tela de login e tela
  principal —, com duas ações: "Aceitar" e "Recusar".
- **Gate rígido**: o gtag só é carregado depois de "Aceitar". Nada é enviado
  ao Google antes do consentimento (sem ping cookieless).
- **Recusar mantém o app 100% funcional**, apenas sem analytics — o banner
  some e não reaparece (escolha lembrada).
- **Escolha lembrada em `localStorage`** (ver
  [MDR 0007](../model-dr/0007-persistencia-no-armazenamento-local.md)): na
  próxima abertura, aceito carrega o gtag direto; recusado não carrega; nunca
  decidido mostra o banner.
- **Previews não disparam analytics**: o módulo de carregamento ignora
  hostnames de canal de preview (`iconula--pr<N>-*.web.app`).
- O banner é um componente próprio (`BannerDeConsentimento.jsx`), montado
  antes do conteúdo, com link para a política de privacidade e texto curto em
  PT-BR explicando que o app usa analytics com consentimento.

## Consequências

- Reverte a ausência deliberada de banner: a política deixa de dizer "não
  exibe banner" e passa a descrever o banner de consentimento
  ([IDR 0061](0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)).
- `App.jsx` monta o banner independentemente do estado de sessão, cobrindo
  login e tela principal.
- A escolha é por dispositivo, como as demais preferências
  ([IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md)).
- Sem custo de cota: nenhuma escrita no Firestore, só `localStorage`.
- Implementação: Fase 0036, Tarefa 0036-0003 (banner e integração);
  o módulo que carrega o gtag sob consentimento é a Tarefa 0036-0002.

## Alternativas consideradas

- **Consent Mode v2** (ping cookieless antes do aceite): permitiria modelagem
  básica sem consentimento, mas envia dados ao Google antes do aceite —
  menos limpo sob LGPD. Descartado.
- **Banner só na tela principal**: perderia a medição de visitantes
  deslogados, que é parte do "uso do público". Descartado.
- **Modal bloqueante em vez de faixa**: atrito desnecessário — o app funciona
  sem analytics, então o consentimento não pode travar o uso. Descartado.
- **Recusar reverte com aviso de erro**: analytics é opcional, não há erro a
  comunicar — "Recusar" simplesmente não carrega o gtag. Descartado.

## Histórico

- 2026-09-18 — Criado no planejamento do analytics de uso (Fase 0036);
  implementação na Tarefa 0036-0003.
