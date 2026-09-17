<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0028-0001]: notação `▯`/`×` sem `·` no placar e no super-grupo

## Status
Pendente

## Objetivo
Aplicar a notação compacta de progresso (`N/M P% ▯F ×R` — sem `·` entre os
campos, `▯` para faltantes, `×` para repetidas) no placar do cabeçalho e no
título do super-grupo, mantendo os `·` estruturais (nome↔placar e
placar↔relógio). O `×` de repetidas não muda.

## Documentos de referência
- `docs/requisitos.md` § UX — a notação nova (`12/20 60% ▯8 ×3`,
  `ICONULA 2026 · 412/994 41% ▯582 ×37 · 12:34`).
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — os glifos
  `▯`/`×` e a mesma notação em todos os títulos.
- `docs/interface.md` § Cabeçalho e § Corpo — as strings vigentes com `▢` e `·`.

## Padrões e convenções aplicáveis
- Texto visível em PT-BR; nome acessível escreve por extenso a notação
  compacta — `docs/requisitos.md` § Requisitos Não Funcionais, IDR 0018.
- `interface.md` no estado atual, com lastro em registro — guia § Documentação
  viva.

## Escopo e instruções de implementação
1. Em `Cabecalho.jsx`, trocar `▢` por `▯` e remover os `·` entre os campos de
   progresso (coladas/total, percentual, faltantes, repetidas), mantendo os
   `·` que separam "ICONULA 2026" do placar e o placar do relógio.
2. Em `SuperGrupo.jsx`, a mesma troca no título do super-grupo
   (`Grupo C · 34/80 43% ▯46 ×12`).
3. Atualizar os testes que afirmam `▢` ou a sequência com `·`.
4. Atualizar `interface.md` § Cabeçalho (título) e § Corpo (super-grupo) para a
   notação nova.

**Fora do escopo**: a seção e o tooltip da faixa (Tarefa 0028-0002); o relógio
(Tarefa 0029-0003).

## Decisões já tomadas (não reabrir)
- Notação `▯`/`×` sem `·` entre campos, com `·` estruturais mantidos — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`.
- Requisito da notação já atualizado — `docs/requisitos.md` § UX.

## Arquivos impactados
- `src/components/Cabecalho.jsx` — modificar
- `src/components/SuperGrupo.jsx` — modificar
- `src/components/Cabecalho.test.jsx` — modificar
- `src/components/SuperGrupo.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Corpo)

## Critérios de aceite
- [ ] Placar exibe `ICONULA 2026 · 412/994 41% ▯582 ×37 · 12:34` — sem `·`
      entre os campos de progresso e `▯` no faltante.
- [ ] Super-grupo exibe `Grupo C · 34/80 43% ▯46 ×12`.
- [ ] Nome acessível continua por extenso ("… faltantes, … repetidas").
- [ ] `npm run lint && npm run test && npm run build` verdes.
