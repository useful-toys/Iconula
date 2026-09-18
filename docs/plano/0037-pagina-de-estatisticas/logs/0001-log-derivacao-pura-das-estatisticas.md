<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0037-0001: Derivação pura das estatísticas da coleção

## Data
2026-09-18

## Resumo
A página de estatísticas (IDR 0072) precisa dos cinco blocos de dados antes
de a vista existir. Antes, não havia derivação: só `calcularPlacar` sobre um
conjunto de códigos. Agora `src/lib/estatisticas.js` reúne funções puras que,
da coleção em memória e do catálogo recebido por parâmetro, devolvem resumo
geral, progresso por grupo (FWC + A–L + COC), progresso por seção (50),
repetidas por seção e histograma de contagens com a cauda agrupada. O módulo
segue o molde de `src/lib/textoDeTroca.js` — recebe `secoes` e `figurinhas` em
vez de importar `src/data/` — e só depende de `calcularPlacar`
(`src/lib/progresso.js`), sem React e sem Firestore. `estatisticas.test.js`
cobre a coleção vazia (0/994), os limites 0/99, o agrupamento da cauda do
histograma e a consistência resumo geral = soma das seções/grupos. Nada nos
`docs/*.md` da raiz mudou: a especificação da vista e a documentação viva são
das Tarefas 0037-0002 e 0037-0004.

## Discovery
- Código: `src/lib/progresso.js` exporta `calcularPlacar(contagens, codigos)` — a base reutilizável do resumo e de cada recorte. `src/lib/textoDeTroca.js` é o precedente de função pura em `src/lib/` que recebe o catálogo por parâmetro (`contagens`, `secoes`, `figurinhas`), sem importar `src/data/`; os testes (`textoDeTroca.test.js`) usam um catálogo mínimo local. `src/data/catalogo.js` expõe `secoes` (50, com `sigla`, `nome`, `tipo`, `grupo`) e `figurinhas` (994, com `codigo`, `secao`, `posicao`); FWC e COC têm `grupo: null`. Cada grupo A–L tem 4 seleções (80 códigos), FWC 20, COC 14. `src/components/Secao.jsx` e `SuperGrupo.jsx` já usam `calcularPlacar` sobre listas de códigos. Testes co-localizados com Vitest (`describe`/`it`/`expect`).
- Documentação: além das referências, li `docs/idr/0021-selo-conta-unidades-sobrando.md` (repetidas = códigos distintos com contagem ≥ 2) e o precedente de API de `src/lib/textoDeTroca.js`. As referências bastaram para o conteúdo dos cinco blocos.

## Plano da alteração
1. Criar `src/lib/estatisticas.js` com funções puras que recebem `contagens`, `secoes` e `figurinhas` (molde de `textoDeTroca.js`), sem importar React nem Firestore:
   - `calcularResumo(contagens, figurinhas)`: delega a `calcularPlacar` sobre os 994 códigos.
   - `calcularProgressoPorSecao(contagens, secoes, figurinhas)`: 50 entradas na ordem do catálogo, cada uma `{ sigla, nome, ...placar }`.
   - `calcularProgressoPorGrupo(contagens, secoes, figurinhas)`: 14 entradas na ordem do álbum (FWC, A–L, COC), cada uma `{ grupo, nome, ...placar }`.
   - `calcularRepetidasPorSecao(contagens, secoes, figurinhas)`: por seção, `{ sigla, nome, codigos }` com os códigos distintos de contagem ≥ 2 na ordem do álbum.
   - `calcularHistograma(contagens, figurinhas, { maxIndividual })`: faixas de 0 a `maxIndividual` (padrão 5) e uma cauda agrupada `"6+"`, cada faixa `{ contagem, rotulo, total }`.
   - `derivarEstatisticas(contagens, secoes, figurinhas)`: os cinco blocos de uma vez, agrupando os códigos por seção numa única passada.
2. Criar `src/lib/estatisticas.test.js` com catálogo mínimo local para os recortes e o catálogo real para os invariantes (0/994, 14 grupos, 50 seções, consistência resumo = soma das seções, histograma com 99 na cauda).
- Verificação prevista: critérios por teste (`estatisticas.test.js`), lint/test/build; ausência de imports de React/Firestore por inspeção do arquivo.
- Riscos: definir a ordem da cauda do histograma; resolver com `maxIndividual` padrão 5 e teste explícito do 99.
- Desvios: nenhum.

## Decisões tomadas
- API recebe `secoes` e `figurinhas` por parâmetro (molde de `textoDeTroca.js`, ADR 0009) em vez de importar `src/data/` — nível 1.
- Ordem dos 14 grupos: FWC, A–L, COC (convenção do IDR 0028) — nível 1.
- Histograma com faixas individuais 0–5 e cauda `"6+"` por padrão, ajustável por `maxIndividual` — nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` (oxlint): sem saída, sem avisos.
- `npm run test` (Vitest): `Test Files 56 passed (56)`, `Tests 728 passed (728)`.
- `npm run build` (vite): `✓ built in 1.11s`; único aviso é o pré-existente
  de chunk acima de 500 kB.
- `npm run test:rules`: não se aplica (nenhuma alteração em `firestore.rules`).

## Critérios de aceite
- [x] `estatisticas.js` exporta funções puras para os cinco blocos, sem
      importar React nem o SDK do Firestore — `src/lib/estatisticas.js:19` só
      importa `./progresso.js`; exporta `calcularResumo`,
      `calcularProgressoPorSecao`, `calcularProgressoPorGrupo`,
      `calcularRepetidasPorSecao`, `calcularHistograma` e o agregador
      `derivarEstatisticas` (linhas 117–195); nenhuma ocorrência de `react` ou
      `firestore` no arquivo.
- [x] `estatisticas.test.js` cobre coleção vazia, limites 0/99 e a
      consistência resumo geral = soma das seções — coleção vazia em
      `calcularResumo` (linha 34) e no histograma (linha 121); limite 99 no
      resumo (linha 53) e na cauda do histograma (linha 134); consistência em
      "mantém o resumo geral igual à soma das seções" (linha 160) e na soma dos
      grupos (linha 168).

## Arquivos alterados
- `src/lib/estatisticas.js` — criar: derivação pura dos cinco blocos.
- `src/lib/estatisticas.test.js` — criar: 17 testes dos recortes e dos
  invariantes sobre o catálogo real.
- `docs/plano/0037-pagina-de-estatisticas/0001-derivacao-pura-das-estatisticas.md`
  — status `Pendente` → `Em andamento`.
- `docs/plano/README.md` — status da fase 37 e da tarefa 0001 para
  `Em andamento`.
- `docs/plano/0037-pagina-de-estatisticas/logs/0001-log-derivacao-pura-das-estatisticas.md`
  — este log.
