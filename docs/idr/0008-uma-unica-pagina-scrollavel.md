<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0008: Uma única página scrollável — jamais scroll dentro de scroll

## Status

Aceito. Generaliza para o app inteiro a regra que o
[IDR 0005](0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md)
aplicou ao percurso do catálogo. Exceção pontual registrada pelo
[IDR 0016](0016-salto-pela-faixa-de-bandeiras.md): a faixa de
bandeiras do salto tem rolagem horizontal própria — rasa, uma linha,
não compete com a rolagem vertical da página.

## Contexto

- Regra declarada pelo usuário durante a especificação de UX ("jamais
  scroll dentro de scroll — isso já é especificação de UX") e
  reforçada depois: tudo será sempre uma página scrollável; nenhum
  componente terá scroll próprio.
- Risco em SPAs com catálogo grande e cabeçalho informativo: cair no
  padrão dashboard (painel lateral fixo, grade de seção com scrollbar
  própria, área de avisos como log rolável). Cada scroll aninhado
  quebra o modelo mental de percurso único e, em touch, causa scroll
  trapping — o dedo "preso" no painel em vez de rolar a página.

## Decisão

- Cada tela do app é uma única página scrollável
- Nenhum componente tem rolagem própria: grades de seção, listas,
  avisos e cabeçalhos se acomodam na página
- Cabeçalho fixo (sticky) não viola a regra — acompanha a rolagem da
  página; o que a regra proíbe é conteúdo rolável dentro de componente

## Consequências

- A área de avisos ([IDR 0002](0002-avisos-de-sincronizacao-visiveis.md))
  não pode virar um log com scroll próprio — notificações precisam ser
  efêmeras, empilháveis com limite, ou colapsáveis
- Listas densas (as 994 figurinhas) exigem virtualização que preserve a
  rolagem da página, sem criar contêiner com overflow próprio
- Os layouts por faixa de tela (pendência em `interface.md`) devem
  respeitar a regra em todas as faixas

## Alternativas consideradas

- **Painéis com scroll próprio** (padrão dashboard: sidebar + conteúdo
  rolando em paralelo): quebra o percurso único e atrapalha o touch
- **Scroll por seção na disposição grade**: caso particular, já
  descartado no IDR 0005
