<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0026: Ícones Material Symbols vendorizados como SVG inline

## Status

Aceito.

## Contexto

- Os controles do cabeçalho trocam os rótulos de texto por ícones
  ([IDR 0059](../idr/0059-rotulos-compactos-dos-controles.md)).
- O app já vendoriza assets servidos pelo próprio Hosting, sem CDN nem
  requisição de terceiro em runtime: bandeiras Twemoji
  ([ADR 0006](../adr/0006-bandeiras-emoji-unicode.md)), Poppins e Roboto
  Condensed ([TDR 0013](0013-tipografia-vendorizada.md)) e o
  `google-logo.svg`.
- Material Symbols é licenciada Apache 2.0 e distribui um SVG por ícone.

## Decisão

- Vendorizar os ícones Material Symbols como **SVG inline** em
  `src/assets/`, no mesmo padrão do botão compartilhar — não como fonte.
- Ícones usados: `numbers`, `sort_by_alpha`, `view_list`, `view_module`
  (ordenação e disposição; o filtro usa glifos de texto —
  [IDR 0059](../idr/0059-rotulos-compactos-dos-controles.md)).

## Consequências

- Sem fonte nova e sem mudança na CSP — o SVG é asset do próprio Hosting,
  como as bandeiras e o `google-logo.svg`.
- ~2 KB somados ao bundle (4 ícones).
- Novo padrão de ícone nos controles (antes, glifo Unicode), mas
  consistente com o SVG inline já usado no compartilhar.
- Sem setup de infraestrutura (Firebase/Google Cloud/GitHub/DNS) — só o
  asset no repositório.
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Fonte Material Symbols vendorizada** com subset de ligaduras: uso por
  ligadura, porém subset de fonte variável com ligadura é mais trabalhoso
  e soma ~10–30 KB; recusada — o SVG é menor e não introduz fonte.
- **Glifos Unicode** (`123`/`A-Z`, `≡`/`▦`, `▯`/`■`/`×`): zero
  dependência, mas menos reconhecíveis; o humano preferiu os ícones
  Material.
