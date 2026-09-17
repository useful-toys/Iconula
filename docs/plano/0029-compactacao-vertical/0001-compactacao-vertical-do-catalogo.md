<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0029-0001]: compactação vertical do catálogo

## Status
Pendente

## Objetivo
Apertar os respiros verticais dentro e entre as seções do catálogo: respiro
interno da moldura (topo/baixo) `8px → 4px` (lados seguem 8px), `padding` do
cabeçalho `4px 8px → 2px 8px`, vão cabeçalho→grade `4px → 2px` e vão entre
seções `10px → 8px`, mantendo o anel de 2px nítido entre caixas vizinhas.

## Documentos de referência
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão e § Histórico —
  os valores novos.
- `docs/interface.md` § Medidas — valores vigentes.
- `docs/idr/0046-cores-de-selecoes.md` — o respiro da moldura (8px) que muda.

## Padrões e convenções aplicáveis
- Blocos distintos continuam distintos: nenhum espaçamento chega a zero —
  IDR 0050.
- `interface.md` § Medidas no estado atual, com lastro em registro.

## Escopo e instruções de implementação
1. Em `Secao.css`: `.secao__moldura` `padding: 8px → 4px 8px` (topo/baixo 4px,
   lados 8px); `.secao__cabecalho` `padding: 4px 8px → 2px 8px`; `.secao__moldura`
   `gap: 4px → 2px`.
2. Em `theme.css`: `--section-gap: 10px → 8px`.
3. Atualizar `interface.md` § Medidas com os novos valores.

**Fora do escopo**: a compactação do cabeçalho (Tarefa 0029-0002); o título de
seção (Fase 0028).

## Decisões já tomadas (não reabrir)
- Valores da compactação vertical do catálogo — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`.

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Moldura com respiro topo/baixo de 4px e lados de 8px.
- [ ] Cabeçalho de seção com `padding: 2px 8px`; vão cabeçalho→grade de 2px.
- [ ] `--section-gap: 8px`.
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- `npm run dev` — verificar visualmente que o anel de 2px continua nítido entre
  caixas vizinhas.
