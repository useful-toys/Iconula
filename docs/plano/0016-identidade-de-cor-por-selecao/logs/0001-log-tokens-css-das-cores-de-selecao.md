<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0016-0001: tokens CSS das cores de seleção

## Data
2026-09-13

## Resumo
Antes: `theme.css` tinha os 11 tokens da paleta e os 15 das cores de grupo
(IDR 0045), mas nenhum token de seleção; `docs/interface.md` § Identidade
visual › Paleta listava a paleta e os grupos. Depois: entram 50 tokens novos
— as 48 cores das seleções (`--selection-alg` a `--selection-uzb`) e os
alias `--selection-fwc` (de `--group-fwc`) e `--selection-coc` (de
`--group-coc`) —, com os valores exatos da tabela do IDR 0046, e a Paleta
ganha um bloco remetendo à tabela do IDR 0046. Mudança puramente aditiva:
nenhuma linha existente foi alterada. Os tokens nascem sem consumidor, como
a Tarefa 0015-0001 fez com as cores de grupo; a Tarefa 0016-0002 é que os
aplica no cabeçalho de seção.

Arquivos e papéis: `src/theme.css` recebe o bloco `/* Cores de seleção */`;
`docs/interface.md` § Identidade visual › Paleta recebe o bloco dos tokens de
seleção (uma linha agregada para as 48, remetendo à tabela do IDR 0046, e os
dois alias) e uma nota de lastro. Nenhuma divergência entre tarefa,
documentação e código: os 48 valores conferem com a tabela do IDR 0046.

## Discovery
- Código: `src/theme.css` tem um único `:root`; o bloco `/* Cores de grupo */`
  ocupa as linhas 17–35 e termina em `--group-coc`. Os tokens de seleção
  entram no mesmo `:root`, depois dos grupos. Nenhum arquivo de teste cita
  `theme.css` (só `main.jsx` o importa), então a verificação é por busca e
  diff — os consumidores vêm na Tarefa 0016-0002. Comportamento atual confere
  com a tarefa: não existe nenhum token `--selection-*`.
- Documentação: as referências bastaram. Conferido `docs/idr/0046` § Decisão,
  § Cores das seleções (48 nomes e valores) e § Hierarquia de cores, os
  especiais do IDR 0045 (`--group-fwc`/`--group-coc`), o IDR 0042 (contraste
  ≥ 3:1, já refletido nos valores) e a tabela de `docs/interface.md` linhas
  549–583. Conferido também `src/data/catalogo.js`: 50 seções — 48 seleções
  (ALG…UZB) mais FWC e COC —, casando uma a uma com a tabela do IDR 0046.

## Plano da alteração
1. `src/theme.css` — bloco `/* Cores de seleção */` no `:root`, após
   `--group-coc`: `--selection-alg` a `--selection-uzb` com os 48 valores do
   IDR 0046 e os alias `--selection-fwc: var(--group-fwc)` e
   `--selection-coc: var(--group-coc)`.
2. `docs/interface.md` § Identidade visual › Paleta — bloco novo: uma linha
   para os 48 tokens de seleção remetendo à tabela do IDR 0046, as linhas dos
   alias e uma nota abaixo da tabela citando o IDR 0046.
3. Nenhum teste novo: a tarefa não cria comportamento; os critérios são
   busca e diff, e o consumo vem na Tarefa 0016-0002.
4. Nenhum registro novo: a decisão é o IDR 0046, já vigente; a tarefa só a
   implementa.
- Verificação prevista: 50 tokens com os valores exatos do IDR 0046 → busca
  em `theme.css`; toda sigla de `catalogo.js` com token → busca cruzada;
  Paleta cita o IDR 0046 → leitura do trecho; lint/test/build → comandos.
- Riscos: nenhum valor divergir do IDR 0046; nenhuma sigla ficar de fora.
  Nenhum risco estrutural — mudança aditiva de variáveis CSS.
- Desvios: a registrar se houver.

## Decisões tomadas
- No `docs/interface.md`, representar os 48 tokens de seleção por uma única
  linha agregada (`--selection-<sigla>`) que remete à tabela do IDR 0046, em
  vez de 48 linhas com valores — a tarefa pede "em bloco, remetendo à tabela
  do IDR 0046". Nível 1 (apresentação de documento, reversível), sem
  registro.

## Impedimentos
- Ruído de ambiente: `package-lock.json` do worktree vinha com o campo
  `name` reajustado por `npm install` (`iconula-button` → `iconula`), fora do
  escopo; revertido com `git restore --worktree` antes de começar, mesmo
  precedente das Tarefas 0005-0001, 0013-0001 e 0015-0001.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 64ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  416 passed (416)
   Duration  55.96s
```
Os avisos `act(...)` de `Avisos` são pré-existentes, sem relação com esta
tarefa.

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-MJAb61ct.css                     21.47 kB │ gzip:   4.73 kB
dist/assets/index-CTSHGrpA.js                     412.02 kB │ gzip: 124.32 kB
✓ built in 585ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm-CJjNDZ4A.js`,
505.90 kB), sem relação com esta tarefa.

### Busca e diff
```
$ Select-String -Path src/theme.css -Pattern '^\s*--selection-'   # 50 tokens
$ (siglas de src/data/catalogo.js sem token em theme.css)         # nenhuma
$ (comparação valor a valor IDR 0046 × theme.css)  # 48/48 batem
$ git diff --stat -- src/theme.css   # 56 inserções, 0 remoções (aditivo)
```

## Critérios de aceite
- [x] 50 tokens em `theme.css`: 48 seleções com os valores exatos do IDR 0046
      e os 2 alias — busca retorna 50 linhas; a comparação valor a valor
      IDR 0046 × `theme.css` casa os 48; os alias são
      `--selection-fwc: var(--group-fwc)` e
      `--selection-coc: var(--group-coc)`
- [x] Toda sigla de seleção de `src/data/catalogo.js` tem token — as 50
      siglas do catálogo (48 seleções + FWC e COC) têm token correspondente
- [x] `docs/interface.md` § Identidade visual cita o IDR 0046 — bloco novo
      na Paleta (`interface.md:577-579`) e nota `interface.md:588` com link
      para o IDR 0046

## Arquivos alterados
- `src/theme.css` — bloco `/* Cores de seleção */` com os 50 tokens
- `docs/interface.md` — § Identidade visual › Paleta com o bloco de seleção
  e a nota do IDR 0046
- `docs/plano/0016-identidade-de-cor-por-selecao/0001-tokens-css-das-cores-de-selecao.md`
  — status `Em andamento` → `Concluída`
- `docs/plano/README.md` — fase 16 e tarefa 0001: `Pendente` → status de
  execução
- `docs/plano/0016-identidade-de-cor-por-selecao/logs/0001-log-tokens-css-das-cores-de-selecao.md`
  — este log (criado)
