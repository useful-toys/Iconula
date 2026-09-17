<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0030-0002]: ícones Material Symbols vendorizados como SVG inline

## Status
Concluída

## Objetivo
Vendorizar quatro ícones Material Symbols (`numbers`, `sort_by_alpha`,
`view_list`, `view_module`) como SVG em `src/assets/`, servidos pelo próprio
Hosting — sem fonte nova e sem mudança na CSP — para a Tarefa 0030-0003 usá-los
nos controles.

## Documentos de referência
- `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md` § Decisão —
  os quatro ícones e o SVG inline.
- `docs/idr/0059-rotulos-compactos-dos-controles.md` — o uso nos controles.

## Padrões e convenções aplicáveis
- Asset servido pelo próprio Hosting, sem CDN em runtime — TDR 0013, ADR 0006.
- Licença Apache 2.0 do Material Symbols, sem custo.

## Escopo e instruções de implementação
1. Baixar os quatro SVGs do Material Symbols e colocá-los em `src/assets/`
   (nomes claros, ex.: `material-numbers.svg`, `material-sort-by-alpha.svg`,
   `material-view-list.svg`, `material-view-module.svg`), como os demais
   assets do projeto.
2. Registrar o setup no log (comando/fonte dos arquivos), sem segredos.

**Fora do escopo**: usar os ícones nos controles (Tarefa 0030-0003).

## Decisões já tomadas (não reabrir)
- Ícones Material Symbols como SVG inline, não como fonte — ver
  `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md`.

## Arquivos impactados
- `src/assets/` — criar (4 SVGs)

## Critérios de aceite
- [x] Os quatro SVGs existem em `src/assets/` e renderizam os ícones
      `numbers`, `sort_by_alpha`, `view_list`, `view_module`.
- [x] `npm run lint && npm run test && npm run build` verdes.
