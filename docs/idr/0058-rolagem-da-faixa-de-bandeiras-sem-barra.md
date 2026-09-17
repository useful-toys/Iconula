<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0058: Rolagem da faixa de bandeiras sem barra — arrasto e fade nas bordas

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

## Decisão

- Remover a barra de rolagem visível em todas as plataformas.
- Indicador de continuidade: fade em degradê nas bordas esquerda/direita da
  faixa, da cor do cabeçalho (`--turf`) para transparente; condicional à
  posição de rolagem — fade esquerdo só quando rolou, direito só quando
  ainda há conteúdo — via JS (a faixa já tem JS no tooltip, IDR 0052).
- Desktop (`pointer: fine`): arrastar com o mouse rola a faixa; `cursor:
  grab` no hover e `grabbing` durante o arrasto; distinguir **clique** de
  **arrasto** por limiar de movimento (~5px) — clique salta, arrasto rola,
  nunca os dois.
- Mobile (`pointer: coarse`): segue sem barra e com momentum nativo;
  `overscroll-behavior-x: contain` trava o "voltar página" no swipe
  horizontal.
- A rodinha do mouse não é interceptada: continua rolando a página.

## Consequências

- A faixa perde a dica de que rola (a barra); o fade assume esse papel sem
  gastar um pixel de altura.
- Novo JS de arrasto e de posição do fade em `FaixaDeSecoes` — segundo
  componente com JS, junto do tooltip (IDR 0052).
- `interface.md` § Cabeçalho (faixa) e § Medidas mudam;
  `FaixaDeSecoes.css`/`FaixaDeSecoes.jsx` mudam.
- A distinção clique×arrasto é crítica: salto não dispara num arrasto, e
  arrasto não salta.
- Acessibilidade: o salto continua por teclado (foco nas bandeiras); o
  arrasto é extra de mouse, não substitui o teclado.
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Rodinha → horizontal** (proposto pelo humano): recusado — scroll
  hijacking; a página "trava" ao rolar com o cursor sobre a faixa sticky.
- **Fade sempre nas duas pontas** (só CSS): mais simples, mas mente no
  início da lista (fade esquerdo sem conteúdo oculto).
- **Manter a barra fina visível**: menos minimalista, mas preserva a dica
  de rolagem sem JS.
