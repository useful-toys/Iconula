<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0007: Placar único de 994 e progresso por seção

## Status

Aceito.

## Contexto

A POC exibia o placar sobre as 980 da numeração oficial, com o progresso
da coleção Coca-Cola num cartão à parte, fora do total principal — o
modelo "bônus". Ficou em aberto: as figurinhas especiais e a Coca-Cola
contam no placar?

O usuário decidiu: **todas contam** — o objetivo é completar a coleção
inteira, e um pedaço real dela fora do placar principal esconderia
progresso. Sobre a forma de ver progresso: os números (total, tenho,
repetidas) para o todo **e para cada seção** — sem tela separada.

## Decisão

- Placar único sobre as 994 do catálogo: seleções, especiais e
  Coca-Cola contam no mesmo total
- No cabeçalho, placar estilo placar de estádio — coladas do total,
  com barra de progresso — e cartões de estatísticas: percentual,
  faltantes, repetidas
- Progresso por seção no cabeçalho de cada grupo: total, coladas e
  repetidas da seção

## Consequências

- O "álbum completo" do produto é 994 — coerente com o universo do
  catálogo em `requisitos.md`
- Sem tela separada de estatísticas: a visão geral vive no cabeçalho, a
  por seção vive no grupo — o progresso aparece onde a ação acontece
- Faltantes é derivado (total − coladas) e exibido junto, sem gravação
  própria

## Alternativas consideradas

- **Bônus à parte, como a POC** (placar 980 + Coca-Cola separado): um
  pedaço da coleção ficaria fora do placar principal
- **Progresso só geral**: perde a visão por seção que guia a troca ("o
  que falta do Brasil?")
- **Tela separada de estatísticas**: mais navegação, contra o
  minimalismo e a tela única
