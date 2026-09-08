<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0001: Filtro de status apenas na disposição lista

## Status

Aceito.

## Contexto

A regra inicial de UX (registrar no `requisitos.md`) dizia "navegação
por rolagem da tela inteira, **não por filtros**" — decidida quando a
única referência era o princípio de minimalismo, antes de qualquer
protótipo.

Uma POC de painel de acompanhamento (artifact HTML autocontido) mostrou
o valor prático dos filtros de status (todas/faltando/repetidas) para o
caso de uso "consultar o que falta" — um dos dois fluxos essenciais do
produto. Ficou evidente a tensão entre a regra do scroll e a consulta
filtrada.

Também da POC: o seletor de seleções parecia um filtro, mas seu papel
real é navegação — pular direto a um grupo.

## Decisão

- Filtro de status (todas/faltantes/repetidas) existe **apenas na
  disposição lista**
- A disposição álbum — que imita a página física — **nunca é
  filtrada**: espelhar o álbum real é o propósito dessa disposição
- O seletor "ir para" seção é navegação por salto, não filtro —
  detalhado no [IDR 0004](0004-ir-para-secao-e-salto-de-navegacao.md)

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
