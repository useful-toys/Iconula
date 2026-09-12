<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0001: Filtro de status apenas na disposição lista

## Status

Aceito, com três pontos revistos depois: a decisão "sem seletor de
seção" foi **revogada** pelos [IDR 0014](0014-salto-direto-para-secao.md)
e [IDR 0016](0016-salto-pela-faixa-de-bandeiras.md) — o salto direto
voltou, pela faixa de bandeiras, e continua não sendo filtro. O
comportamento do filtro sobre seções sem resultado foi completado pelo
[IDR 0025](0025-filtro-oculta-secoes-vazias.md): elas somem da vista.

O conjunto de valores do filtro foi ampliado pelo
[IDR 0033](0033-filtro-de-coladas.md): entrou coladas (contagem ≥ 1)
entre faltantes e repetidas; a regra de o filtro existir só na
disposição lista não mudou.

## Contexto

- Regra inicial de UX (`requisitos.md`): percurso só por rolagem da
  tela inteira, **não por filtros** — decidida antes de qualquer
  protótipo, só com o princípio de minimalismo como referência.
- POC de painel de acompanhamento mostrou o valor prático dos filtros
  de status (todas/faltando/repetidas) para "consultar o que falta" —
  um dos dois fluxos essenciais do produto; ficou evidente a tensão com
  a regra do scroll.
- Também da POC: o seletor de seleções parecia um filtro, mas seu papel
  real é navegação — pular direto a um grupo.

## Decisão

- Filtro de status (todas/faltantes/repetidas) existe **apenas na
  disposição lista**
- A disposição álbum — que imita a página física — **nunca é
  filtrada**: espelhar o álbum real é o propósito dessa disposição
- Sem seletor de seção: o percurso é só rolagem — o "ir para" do
  [IDR 0004](0004-rejeitado-ir-para-secao-e-salto-de-navegacao.md) acabou
  rejeitado

## Consequências

- A regra de UX no `requisitos.md` foi reescrita: rolagem continua
  sendo a base do percurso; filtros existem só na lista
- As listas de faltantes e repetidas em tela realizam-se pelo filtro na
  disposição lista

## Alternativas consideradas

- **Sem filtros** (regra original intacta): preserva o minimalismo,
  mas abre mão da consulta rápida demonstrada pela POC
- **Filtros em ambas as disposições**: quebra o espelhamento da página
  física do álbum, que é a razão de existir da disposição álbum
- **Tratar "ir para" como filtro**: não — é salto de navegação
