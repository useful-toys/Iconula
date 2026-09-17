<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0028-0002]: notação `▯`/`×` sem `·` na seção e no tooltip da faixa

## Status
Pendente

## Objetivo
Aplicar a notação compacta de progresso (`12/20 60% ▯8 ×3`, sem `·` entre os
campos) no cabeçalho da seção e no tooltip da faixa de bandeiras, mantendo os
`·` estruturais (identificação↔resumo na seção; sigla↔nome no tooltip).

## Documentos de referência
- `docs/requisitos.md` § UX — a notação nova.
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — a notação
  em todos os títulos.
- `docs/idr/0052-tooltip-nas-bandeiras-da-faixa.md` § Decisão — o tooltip
  `BRA · Brasil · 12/20 60% ▯8 ×3`.
- `docs/interface.md` § Corpo e § Cabeçalho — as strings vigentes.

## Padrões e convenções aplicáveis
- Nome acessível escreve por extenso a notação compacta — IDR 0018.
- `interface.md` no estado atual, com lastro em registro — guia § Documentação
  viva.

## Escopo e instruções de implementação
1. Em `Secao.jsx`, trocar `▢` por `▯` e remover os `·` entre os campos do
   resumo (coladas/total, percentual, faltantes, repetidas), mantendo o `·`
   entre a identificação e o resumo.
2. No tooltip da faixa (onde o texto `SIGLA · Nome · …` é montado), a mesma
   troca, mantendo o `·` entre sigla e nome.
3. Atualizar os testes que afirmam `▢` ou a sequência com `·`.
4. Atualizar `interface.md` § Corpo (cabeçalho de seção) e § Cabeçalho
   (tooltip da faixa).

**Fora do escopo**: o placar e o super-grupo (Tarefa 0028-0001).

## Decisões já tomadas (não reabrir)
- Notação `▯`/`×` sem `·` entre campos — `docs/idr/0018-usuario-especialista-e-minimalismo.md`.
- Conteúdo do tooltip (sigla, nome e progresso) — `docs/idr/0052-tooltip-nas-bandeiras-da-faixa.md`.

## Arquivos impactados
- `src/components/Secao.jsx` — modificar
- `src/components/FaixaDeSecoes.jsx` — modificar
- `src/components/Secao.test.jsx` — modificar
- `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Corpo, § Cabeçalho)

## Critérios de aceite
- [ ] Seção exibe `Brasil BRA 24 · 12/20 60% ▯8 ×3` — sem `·` no resumo, `▯`
      no faltante, `·` único entre identificação e resumo.
- [ ] Tooltip exibe `BRA · Brasil · 12/20 60% ▯8 ×3`.
- [ ] `npm run lint && npm run test && npm run build` verdes.
