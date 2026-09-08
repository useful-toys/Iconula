<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0004: "Ir para" seção é salto de navegação, não filtro

## Status

Aceito. Detalha o papel do seletor de seções apontado lateralmente pelo
[IDR 0001](0001-filtro-de-status-so-na-disposicao-lista.md).

## Contexto

A POC traz um combo de seleção de grupos. O padrão comum em trackers
concorrentes (StickerTracker, Clube da Copa etc.) é selecionar um time e
ver **somente** aquele time — uma filtragem de seção, que esconde o
resto do catálogo.

Isso tensava com a regra de percurso por rolagem da tela inteira
([IDR 0005](0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md)):
filtrar a vista a uma seção quebra o catálogo contínuo. Mas percorrer 48
seções só rolando é lento para chegar a uma seção distante.

## Decisão

- O seletor "ir para" seção **move o percurso** até a seção escolhida —
  um salto dentro do catálogo completo
- Nunca restringe a vista a uma seção: o catálogo permanece inteiro,
  antes e depois do salto
- Vale para ambas as disposições (lista e álbum)

## Consequências

- O contexto nunca se perde: o que vem antes e depois da seção
  permanece visível ao redor
- Complementa a rolagem como percurso: o salto acelera sem trocar de
  paradigma
- Diferencia o produto dos trackers que filtram por time

## Alternativas consideradas

- **Combo que filtra a vista a uma seção** (padrão concorrentes):
  esconde o resto do catálogo e quebra o percurso único
- **Sem seletor** (só rolagem manual): percurso puro, mas lento — 48
  seções é longa distância
