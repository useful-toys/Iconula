<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0016-0001]: tokens CSS das cores de seleção

## Status
Concluída

## Objetivo
Criar em `theme.css` os tokens das 48 seleções e os alias dos dois especiais,
com os valores OKLCH já decididos — base da Tarefa 0002.

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § Decisão e § Cores das seleções —
  nomes dos tokens, valores finais e alias
- `docs/idr/0045-cores-de-super-grupos.md` § Especiais — `--group-fwc` e
  `--group-coc`, alvos dos alias
- `src/theme.css` — tokens de grupo da Fase 15
- `docs/interface.md` § Identidade visual › Paleta

## Padrões e convenções aplicáveis
- Valores copiados do IDR 0046, sem reconverter nem ajustar — IDR 0046
- `--selection-fwc` e `--selection-coc` apontam para `--group-fwc` e
  `--group-coc` — IDR 0046

## Escopo e instruções de implementação
1. Em `src/theme.css`, sob um comentário "Cores de seleção": `--selection-alg`
   a `--selection-uzb` com os valores da tabela do IDR 0046, e os alias
   `--selection-fwc` e `--selection-coc`.
2. Em `docs/interface.md` § Identidade visual › Paleta, acrescentar os
   tokens de seleção (em bloco, remetendo à tabela do IDR 0046) e os alias,
   com uso "identidade da seleção (cabeçalho de seção)".

**Fora do escopo**: aplicar as cores (Tarefa 0016-0002); cores de grupo
(Fase 15).

## Decisões já tomadas (não reabrir)
- Cores, valores OKLCH, repetições aceitas e alias — ver
  `docs/idr/0046-cores-de-selecoes.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Identidade visual)

## Critérios de aceite
- [ ] 50 tokens em `theme.css`: 48 seleções com os valores exatos do IDR 0046
      e os 2 alias (busca)
- [ ] Toda sigla de seleção de `src/data/catalogo.js` tem token (busca)
- [ ] `docs/interface.md` § Identidade visual cita o IDR 0046
