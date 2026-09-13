<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0015-0001: tokens CSS das cores de grupo

## Data
2026-09-13

## Resumo
Antes: `theme.css` só tinha os 11 tokens da paleta e nenhuma identidade de
grupo; `docs/interface.md` § Paleta listava esses 11 tokens. Depois: entram
15 tokens novos — as 12 cores dos super-grupos A–L, `--coc-red` e os alias
`--group-fwc` (de `--gold`) e `--group-coc` (de `--coc-red`) —, com os
valores exatos do IDR 0045, e a tabela de `interface.md` os lista, citando
o IDR 0045. Mudança puramente aditiva: nenhuma linha existente foi
alterada, `--notif-red` continua `oklch(0.6 0.18 25)`. Os tokens nascem
sem consumidor, como a Fase 1 fez com os dados; as Tarefas 0015-0002 e
0015-0003 é que os aplicam no título do super-grupo e na faixa de
bandeiras.

Arquivos e papéis: `src/theme.css` recebe o bloco `/* Cores de grupo */`;
`docs/interface.md` § Identidade visual › Paleta recebe as 15 linhas e uma
nota de lastro no IDR 0045. Nenhuma divergência entre tarefa, documentação
e código: os valores conferem com a tabela do IDR 0045.

## Discovery
- Código: `src/theme.css` tem um único `:root` com os 11 tokens OKLCH da
  paleta e as variáveis de espaçamento; os tokens de grupo entram no mesmo
  bloco. Não há teste que leia `theme.css` (nenhum `.test.js`/`.test.jsx`
  cita o arquivo), então a verificação é por busca e diff — as Tarefas
  0015-0002 e 0015-0003 é que provam o consumo. Nenhum componente usa
  `--group-*` ainda; os tokens nascem sem consumidor por uma tarefa, como
  a Fase 1 fez com dados. Comportamento atual confere com a tarefa: a
  paleta não tem nenhum token de grupo.
- Documentação: as referências bastaram. Conferido `docs/idr/0045` § Decisão,
  § Cores dos super-grupos e § Especiais (nomes e valores), o IDR 0042
  (contraste ≥ 3:1, já refletido nos valores) e a tabela atual de
  `docs/interface.md` § Identidade visual › Paleta (linhas 549–561).

## Plano da alteração
1. `src/theme.css` — bloco `/* Cores de grupo */` no `:root`, após
   `--notif-red`: `--group-a` a `--group-l` com os valores do IDR 0045,
   `--coc-red` e os alias `--group-fwc: var(--gold)` e
   `--group-coc: var(--coc-red)`.
2. `docs/interface.md` § Identidade visual › Paleta — 15 linhas novas na
   tabela (12 grupos, `--coc-red`, 2 alias) e uma nota abaixo da tabela
   citando o IDR 0045 e explicando os alias de FWC/COC.
3. Nenhum teste novo: a tarefa não cria comportamento; os critérios são
   busca e diff, e os consumidores vêm nas tarefas 0002/0003.
4. Nenhum registro novo: a decisão é o IDR 0045, já vigente; a tarefa só a
   implementa.
- Verificação prevista: 15 tokens com os valores exatos → busca em
  `theme.css`; `--notif-red` inalterado → `git diff`; tabela cita o
  IDR 0045 → leitura do trecho; lint/test/build → comandos.
- Riscos: nenhum valor divergir do IDR 0045; nenhum risco estrutural.
- Desvios: a registrar se houver.

## Decisões tomadas
- Nenhuma decisão nova. Cores, valores OKLCH, `--coc-red` e o caráter de
  alias de FWC/COC já vêm decididos no IDR 0045; a tarefa só os transcreve.
  Sem registro por isso (decisão já tomada, não reaberta).

## Impedimentos
- Ruído de ambiente: `package-lock.json` do worktree vinha com o campo
  `name` reajustado por `npm install` (`iconula-button` → `iconula`),
  fora do escopo; revertido com `git restore --worktree` antes de começar,
  mesmo precedente das Tarefas 0005-0001 e 0013-0001.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 47ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  413 passed (413)
   Duration  52.49s
```

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-ipjmjAeL.css                     16.76 kB │ gzip:   4.00 kB
dist/assets/index-BRDblAz9.js                     411.85 kB │ gzip: 124.26 kB
✓ built in 585ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm--0WZ7iUg.js`,
505.90 kB), sem relação com esta tarefa.

### Busca e diff
```
$ Select-String -Path src/theme.css -Pattern '^\s*--(group-[a-l]|group-fwc|group-coc|coc-red):'
15
$ git diff -- src/theme.css   # nenhuma linha '-' (puramente aditivo)
$ Select-String -Path docs/interface.md -Pattern 'IDR 0045'
580: [IDR 0045](idr/0045-cores-de-super-grupos.md): as 12 cores de grupo, o
```

## Critérios de aceite
- [x] 15 tokens em `theme.css` com os valores exatos do IDR 0045 — busca
      retorna 15 linhas `--group-a`..`--group-l`, `--coc-red`,
      `--group-fwc`, `--group-coc`, com os valores da tabela do IDR 0045
- [x] `--notif-red` inalterado — `git diff` só tem linhas `+`; nenhuma
      linha `-`, logo o token permanece `oklch(0.6 0.18 25)`
- [x] `docs/interface.md` § Identidade visual lista os tokens citando o
      IDR 0045 — 15 linhas novas na tabela e nota em `interface.md:580`
      com link para o IDR 0045

## Arquivos alterados
- `src/theme.css` — bloco `/* Cores de grupo */` no `:root` com os 15
  tokens (aditivo; `--notif-red` intacto)
- `docs/interface.md` — § Identidade visual › Paleta: 15 linhas novas e
  nota citando o IDR 0045
- `docs/plano/0015-identidade-de-cor-por-grupo/0001-tokens-css-das-cores-de-grupo.md`
  — status `Em andamento` → `Concluída`
- `docs/plano/README.md` — fase 15 e tarefa 0001: `Pendente` → status de
  execução
- `docs/plano/0015-identidade-de-cor-por-grupo/logs/0001-log-tokens-css-das-cores-de-grupo.md`
  — este log (criado)
