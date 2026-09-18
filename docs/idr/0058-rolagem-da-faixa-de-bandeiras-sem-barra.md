<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0058: Rolagem da faixa de bandeiras sem barra — arrasto, fade e setas nas bordas

## Status

Aceito.

## Contexto

- A faixa de bandeiras ([IDR 0016](0016-salto-pela-faixa-de-bandeiras.md))
  é a única exceção à regra de scroll único
  ([IDR 0008](0008-uma-unica-pagina-scrollavel.md)), rolável
  horizontalmente. Hoje a barra de rolagem aparece fina (6px) no desktop e
  some no toque (`@media (pointer: coarse)`).
- O humano quer eliminar a barra visível — poluição visual e uma linha de
  altura — e substituí-la por arrasto e um indicador de continuidade que
  não gaste espaço: fade nas bordas.
- O humano propôs também traduzir a rodinha do mouse em rolagem horizontal;
  recusado (scroll hijacking) — a faixa rola por arrasto, `shift` + rodinha
  e gesto horizontal do trackpad, já nativos.
- Depois de ver o fade em uso, o humano o achou sutil demais como dica: pediu
  setas explícitas em cada borda, visíveis só no sentido em que ainda há
  conteúdo, e que tocar na seta role a faixa.
- O fade estava sendo pintado atrás das bandeiras — elas são `position:
  relative`, então, na ordem de pintura, ficavam por cima do degradê. Corrigido
  com `z-index` no mesmo PR.

## Decisão

- Remover a barra de rolagem visível em todas as plataformas.
- Indicador de continuidade: fade em degradê nas bordas esquerda/direita da
  faixa, da cor do cabeçalho (`--turf`) para transparente; condicional à
  posição de rolagem — fade esquerdo só quando rolou, direito só quando
  ainda há conteúdo — via JS (a faixa já tem JS no tooltip, IDR 0052). O
  degradê fica acima das bandeiras (`z-index`), que venceriam na ordem de
  pintura.
- Setas de rolagem, uma sobre cada borda, acima do fade: seta Material
  (`chevron_left`/`chevron_right`, [TDR 0026](../tdr/0026-icones-material-symbols-vendorizados-como-svg.md))
  visível só no sentido em que ainda há conteúdo; desabilitada, fica
  invisível e fora da ordem de tabulação. Tocar nela rola 4 bandeiras —
  ~128px (`30px` do botão + `2px` de `gap`), com `scrollBy({ behavior:
  'smooth' })`. O fade e o arrasto seguem valendo como complementos.
- Desktop (`pointer: fine`): arrastar com o mouse rola a faixa; `cursor:
  grab` no hover e `grabbing` durante o arrasto; distinguir **clique** de
  **arrasto** por limiar de movimento (~5px) — clique salta, arrasto rola,
  nunca os dois.
- Mobile (`pointer: coarse`): segue sem barra e com momentum nativo;
  `overscroll-behavior-x: contain` trava o "voltar página" no swipe
  horizontal.
- A rodinha do mouse não é interceptada: continua rolando a página.

## Consequências

- A faixa perde a dica de que rola (a barra); o fade e as setas assumem esse
  papel sem gastar um pixel de altura.
- Novo JS de arrasto, de posição do fade e das setas em `FaixaDeSecoes` —
  segundo componente com JS, junto do tooltip (IDR 0052).
- As setas acrescentam dois alvos focáveis à faixa; desabilitadas, saem da
  ordem de tabulação e do alcance do ponteiro.
- `interface.md` § Cabeçalho (faixa) e § Medidas mudam;
  `FaixaDeSecoes.css`/`FaixaDeSecoes.jsx` e os SVGs
  `src/assets/material-chevron-*.svg` mudam.
- A distinção clique×arrasto é crítica: salto não dispara num arrasto, e
  arrasto não salta.
- Acessibilidade: o salto continua por teclado (foco nas bandeiras); o
  arrasto é extra de mouse, não substitui o teclado.
- Implementação: Fase 0030, Tarefa 0030-0001 (fade e arrasto); setas e
  correção do empilhamento do fade: `bugfix/corrige_alinhamento_e_fade`
  (PR #87).

## Alternativas consideradas

- **Rodinha → horizontal** (proposto pelo humano): recusado — scroll
  hijacking; a página "trava" ao rolar com o cursor sobre a faixa sticky.
- **Fade sempre nas duas pontas** (só CSS): mais simples, mas mente no
  início da lista (fade esquerdo sem conteúdo oculto).
- **Manter a barra fina visível**: menos minimalista, mas preserva a dica
  de rolagem sem JS.
- **Só setas, sem fade**: menos elementos na faixa, mas perde a suavidade do
  degradê na borda; o humano preferiu manter os dois.

## Histórico

- 2026-09-18 — Setas de rolagem acrescentadas às bordas, clicáveis (4
  bandeiras por toque) e visíveis só no sentido em que há conteúdo; o fade
  permanece como indício complementar. Corrigido o empilhamento do fade, que
  era pintado atrás das bandeiras. Antes, o indício era só o fade.
