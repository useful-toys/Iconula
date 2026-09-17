<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0029-0003]: data/hora de persistência em Roboto Condensed

## Status
Pendente

## Objetivo
Exibir a data/hora de persistência (`atualizadoEm` do título — `12:34`,
`17/09 12:34` ou `—`) em Roboto Condensed 500, no lugar de Poppins, mantendo
13px/`--muted`/tabular e o peso 400→500 do peso vendido.

## Documentos de referência
- `docs/interface.md` § Medidas — "o relógio um ponto menor (13px) também em
  `--muted`".
- `docs/tdr/0013-tipografia-vendorizada.md` — Roboto Condensed 500 vendorizada.
- `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md` — o que o
  relógio mostra.

## Padrões e convenções aplicáveis
- O relógio continua como registro do estado ("quando foi salvo"), não como
  aviso — IDR 0027.
- `interface.md` § Medidas no estado atual.

## Escopo e instruções de implementação
1. Em `Cabecalho.css`, em `.cabecalho__relogio`: `font-family: 'Roboto
   Condensed', 'Poppins', system-ui, sans-serif` e `font-weight: 500`,
   mantendo `font-size: 13px`, `tabular-nums` e `--muted`.
2. Atualizar `interface.md` § Medidas (o relógio passa a Roboto Condensed 500).

**Fora do escopo**: qualquer mudança no formato da data/hora ou no `updatedAt`
(TDR 0016).

## Decisões já tomadas (não reabrir)
- Relógio = `updatedAt`, não a carga — `docs/idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md`.

## Arquivos impactados
- `src/components/Cabecalho.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.cabecalho__relogio` com `font-family: 'Roboto Condensed'` e
      `font-weight: 500`.
- [ ] 13px, `tabular-nums` e `--muted` mantidos.
- [ ] `npm run lint && npm run test && npm run build` verdes.
