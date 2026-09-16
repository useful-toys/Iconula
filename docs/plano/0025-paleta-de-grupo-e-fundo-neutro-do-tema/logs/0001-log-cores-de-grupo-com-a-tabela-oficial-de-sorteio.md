<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0025-0001: cores de grupo com a tabela oficial de sorteio

## Data
2026-09-16

## Resumo
As 12 cores dos super-grupos (A–L) deixaram de vir de um hex sem procedência e
passaram a vir da tabela oficial de sorteio da Copa 2026, em duas variantes: a
**original** (RGB exato, sem ajuste) para traços finos — a barra esquerda de
3px do título do super-grupo e a barra inferior de 2px da faixa de bandeiras —
e a **ajustada** (luminosidade corrigida para ≥ 3:1 contra `--turf`) para os
fundos tingidos. Só D, F, I e L têm variantes distintas; nos outros 8 grupos a
original já atinge o contraste mínimo e um único token serve às duas
finalidades.

Mudanças: `src/theme.css` recebe os 12 valores ajustados e os 4 tokens
`--group-<x>-raw` (valor original); `src/components/SuperGrupo.css` e
`src/components/FaixaDeSecoes.css` passam a consumir a variante original no
traço, via a variável `--group-color-raw` definida só nos 4 grupos que a têm
(nos demais o valor cai em `--group-color`, que já é a original);
`docs/interface.md` § Paleta reflete os valores novos. Nenhuma divergência
entre tarefa, IDR 0045 e código foi encontrada: o código atual usava um único
token por grupo, e a tarefa apenas separa as duas finalidades.

## Discovery
- Código: `src/theme.css` define `--group-a`…`--group-l` (um token por grupo),
  `--coc-red`, `--group-fwc` e `--group-coc`. `SuperGrupo.css` mapeia a prop
  `grupo` (letra A–L) para `--group-color` em 12 classes
  `.super-grupo__titulo--<letra>`; `--group-color` alimenta a borda esquerda de
  3px e o `color-mix` 30% do fundo. `FaixaDeSecoes.css` mapeia a chave do
  grupo (A–L + FWC/COC) para `--group-color` em 14 classes
  `.faixa-de-secoes__botao--grupo-<chave>`; `--group-color` alimenta o
  `color-mix` 60% do fundo, o `::after` (barra inferior a 80%) e o hover a
  80%. O comportamento atual confere com a tarefa (um token por grupo, usado
  tanto no traço quanto no fundo). Nenhum teste toca em tokens CSS: as buscas
  por `oklch`/`--group`/`theme.css` nos `*.test.*` não retornaram nada.
  Impacto fora dos "Arquivos impactados": nenhum — só `SuperGrupo.css` e
  `FaixaDeSecoes.css` consomem `--group-*`; FWC e COC não têm variante
  original e ficam fora do escopo.
- Documentação: bastaram as referências (IDR 0045, incl. § Decisão e a tabela,
  e `docs/interface.md` § Paleta). Conferido também o IDR 0022 (tema escuro
  único, `--turf` como superfície de contraste) para confirmar que a
  neutralização do fundo é da Tarefa 0025-0002 e não afeta esta.

## Plano da alteração
1. `src/theme.css`: atualizar `--group-a`…`--group-l` para os valores de "Cor
   ajustada" e acrescentar `--group-d-raw`, `--group-f-raw`, `--group-i-raw`,
   `--group-l-raw` com os valores de "Cor original"; ajustar o comentário do
   bloco para descrever as duas variantes.
2. `src/components/SuperGrupo.css`: no `.super-grupo__titulo`, a
   `border-left: 3px` passa a `var(--group-color-raw, var(--group-color,
   transparent))`; as classes de D, F, I e L ganham `--group-color-raw`; o
   `background` (30% sobre `--panel`) continua com `--group-color` (ajustada).
   Atualizar o comentário.
3. `src/components/FaixaDeSecoes.css`: o `::after` (barra inferior) passa a
   misturar 80% de `var(--group-color-raw, var(--group-color))`; as classes de
   D, F, I e L ganham `--group-color-raw`; fundo base (60%) e hover (80%)
   continuam com `--group-color` (ajustada). Atualizar o comentário.
4. `docs/interface.md` § Paleta: valores dos 12 tokens, 4 linhas `-raw` novas e
   o parágrafo explicando as duas variantes, citando o IDR 0045.
5. Validação: `npm run lint && npm run test && npm run build`.

- Verificação prevista:
  - 12 tokens com a cor ajustada → leitura do trecho e conferência com a tabela
    do IDR 0045;
  - `-raw` só em D/F/I/L → busca por `-raw` em `theme.css`;
  - barra/borda na original, fundo na ajustada → leitura das regras de
    `SuperGrupo.css` e `FaixaDeSecoes.css`;
  - `docs/interface.md` § Paleta atualizado → leitura do trecho.
- Riscos: nenhum funcional — só CSS de cor; o maior risco é divergir dos
  valores da tabela, mitigado copiando-os literalmente. A barra da faixa tinha
  80% da cor ajustada e passa a 80% da original, mudando a cor percebida das
  bandeiras de D, F, I e L (esperado pela tarefa).
- Desvios: nenhum.

## Decisões tomadas
- Nível 1 (sem registro): consumir a variante original por
  `var(--group-color-raw, var(--group-color))`, definindo `--group-color-raw`
  só nas classes de D, F, I e L, em vez de repetir a variável nas 12–14
  classes de cada componente. Evita 8–10 declarações redundantes por arquivo e
  mantém a paridade entre `SuperGrupo.css` e `FaixaDeSecoes.css`; o resultado é
  o previsto na tarefa (os 4 tokens `-raw`). Decisão interna de CSS, sem
  mudança de comportamento, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 62ms on 85 files with 105 rules using 4 threads.

$ npm run test
Test Files  41 passed (41)
     Tests  514 passed (514)

$ npm run build
✓ 136 modules transformed.
dist/assets/index--aRR5-9k.css   29.31 kB │ gzip:   5.63 kB
✓ built in 573ms
```
`npm run build` emite o aviso `Some chunks are larger than 500 kB after
minification` (chunk `index.esm-CkhBFdrK.js`, 505.90 kB) — pré-existente,
relativo ao bundle do SDK do Firebase, não tocado por esta tarefa.

## Critérios de aceite
- [x] Os 12 tokens `--group-a`...`--group-l` têm os valores de "Cor ajustada"
      do IDR 0045 — `src/theme.css:28-41` (ex.: `--group-d: oklch(0.513 0.129
      254.8)`, `--group-l: oklch(0.530 0.140 21.8)`)
- [x] Existem tokens `-raw` para D, F, I e L com os valores de "Cor original",
      e nenhum `-raw` redundante nos outros 8 grupos — busca por `-raw`:
      `--group-d-raw`, `--group-f-raw`, `--group-i-raw`, `--group-l-raw` em
      `src/theme.css:31,34,38,42`; nenhum outro token `-raw` no projeto
- [x] A barra do título do super-grupo e a barra inferior da faixa usam a cor
      original; os fundos tingidos usam a ajustada —
      `src/components/SuperGrupo.css:24`
      (`border-left: 3px solid var(--group-color-raw, var(--group-color,
      transparent))`) e `:26` (`background: … var(--group-color) …
      30%`); `src/components/FaixaDeSecoes.css:186` (barra a 80% de
      `--group-color-raw`) contra `:78` (fundo a 60% de `--group-color`) e
      `:227` (hover a 80% de `--group-color`)
- [x] `docs/interface.md` § Paleta reflete os valores novos — tabela
      (`docs/interface.md:751-768`) com os 12 valores ajustados e as 4 linhas
      `-raw`, e o parágrafo explicando as duas variantes citando o IDR 0045
- [ ] Verificação visual em `npm run dev` — pendente: sem navegador neste
      ambiente; roteiro no relatório

## Arquivos alterados
- `src/theme.css` — 12 tokens `--group-a`…`--group-l` com os valores ajustados
  da tabela oficial; novos `--group-d-raw`, `--group-f-raw`, `--group-i-raw`,
  `--group-l-raw`; comentário do bloco descrevendo as duas variantes
- `src/components/SuperGrupo.css` — borda esquerda de 3px passa a usar a cor
  original; `--group-color-raw` definido em D, F, I e L; comentário atualizado
- `src/components/FaixaDeSecoes.css` — barra inferior de 2px passa a usar a cor
  original; `--group-color-raw` definido em D, F, I e L; comentários atualizados
- `docs/interface.md` — § Paleta: valores novos e linhas `-raw`, parágrafo das
  duas variantes
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/0001-cores-de-grupo-com-a-tabela-oficial-de-sorteio.md`
  — status
- `docs/plano/README.md` — status da fase e da tarefa
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/logs/0001-log-cores-de-grupo-com-a-tabela-oficial-de-sorteio.md`
  — este log
