<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0030-0003]: rótulos compactos dos controles

## Status
Pendente

## Objetivo
Trocar os rótulos de texto dos controles por ícones: ordenação
`numbers`/`sort_by_alpha` e disposição `view_list`/`view_module` em SVG inline
Material, e o filtro em glifos de texto `Todas | ▯ | ▮ | ×` — mantendo o nome
por extenso no `aria-label` e no tooltip (IDR 0048).

## Documentos de referência
- `docs/idr/0059-rotulos-compactos-dos-controles.md` § Decisão — os ícones e
  os glifos.
- `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md` — os SVGs
  (gerados pela Tarefa 0030-0002).
- `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md` — o tooltip
  com o nome por extenso.

## Padrões e convenções aplicáveis
- Cor nunca é o único sinal; nome acessível por extenso — IDR 0018, IDR 0048.
- O estado ativo continua em dourado sobre `--bg-deep`.

## Escopo e instruções de implementação
1. Em `Controles.jsx`, substituir `rotulo` de ORDENACOES e DISPOSICOES pelos
   SVGs inline (importados dos assets da Tarefa 0030-0002); o filtro usa
   `Todas` (texto) e os glifos `▯`, `▮`, `×` — cada opção mantém `aria-label`
   e `data-tooltip` com o nome por extenso.
2. Atualizar `interface.md` § Controles (rótulos novos).
3. Atualizar `Controles.test.jsx` (afirma os rótulos antigos).

**Fora do escopo**: o espaçamento dos controles (Tarefa 0030-0004); o feedback
de confirmação (Tarefa 0030-0005).

## Decisões já tomadas (não reabrir)
- Ícones Material no layout e glifos no filtro — ver
  `docs/idr/0059-rotulos-compactos-dos-controles.md`.

## Arquivos impactados
- `src/components/Controles.jsx` — modificar
- `src/components/Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Controles)

## Critérios de aceite
- [ ] Ordenação mostra `numbers`/`sort_by_alpha`; disposição
      `view_list`/`view_module`; filtro `Todas | ▯ | ▮ | ×`.
- [ ] `aria-label` e tooltip com o nome por extenso em cada opção.
- [ ] `npm run lint && npm run test && npm run build` verdes.
