<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0015-0002: cor no título do super-grupo

## Data
2026-09-13

## Resumo
Antes: o título de cada super-grupo (`super-grupo__titulo`) era só texto
em `--gold` sobre `--turf`, sem identidade de grupo; os 15 tokens de cor
criados pela Tarefa 0015-0001 não tinham consumidor. Depois: cada letra
A–L ganha uma classe modificadora no botão do título
(`super-grupo__titulo--a` … `--l`) e o CSS aplica borda esquerda de 3px na
cor do grupo e fundo com 15% dessa cor misturada ao transparente; o texto
continua em `--gold`. `docs/interface.md` § Medidas passa a descrever o
título com a borda e o fundo, citando o IDR 0045.

Arquivos e papéis: `src/components/SuperGrupo.jsx` acrescenta a classe
modificadora derivada da prop `grupo`; `src/components/SuperGrupo.css`
define o `--group-color` por letra e o consome na borda e no fundo do
título; `src/components/SuperGrupo.test.jsx` prova a classe por letra;
`docs/interface.md` § Medidas atualiza a linha do título. Nenhuma
divergência entre tarefa, documentação e código: os valores vêm dos
tokens do IDR 0045.

## Discovery
- Código: `SuperGrupo.jsx` é `memo` e seu comparador `propsEquivalentes`
  já compara `grupo` — como a cor deriva de `grupo`, a memoização (TDR
  0021) continua válida sem tocar no comparador. O título é o botão
  `.super-grupo__titulo`; hoje tem `border: none` e `background:
  transparent` (`SuperGrupo.css`). O catálogo real só monta super-grupos
  A–L (FWC e COC ficam fora), então sempre há uma letra válida. Testes de
  `SuperGrupo.test.jsx` usam `render` + `screen` (Testing Library) e o
  grupo C. `src/components/Secao.css` mostra o padrão de painel com borda
  e fundo, mas o título de super-grupo deliberadamente não tem painel.
  Comportamento atual confere com a tarefa: nenhum consumidor de
  `--group-*` ainda.
- Documentação: as referências bastaram. Conferido `docs/idr/0045` §
  Decisão e § Especiais (borda 3px, fundo 15% sobre transparente, texto
  em `--gold`; FWC/COC fora de super-grupos), o IDR 0046 § Hierarquia de
  cores (mesma fórmula do super-grupo) e `docs/interface.md` § Medidas
  (linha 630, "Título de super-grupo").

## Plano da alteração
1. `SuperGrupo.jsx` — no botão `.super-grupo__titulo`, somar a classe
   `super-grupo__titulo--<letra>` (letra da prop `grupo`, em minúscula).
2. `SuperGrupo.css` — no `.super-grupo__titulo`, `border-left: 3px solid
   var(--group-color, transparent)` e `background: color-mix(in oklch,
   var(--group-color, transparent) 15%, transparent)`; 12 regras de
   modificador (`--a` … `--l`) definindo `--group-color: var(--group-<l>)`.
3. `SuperGrupo.test.jsx` — teste parametrizado nas 12 letras conferindo a
   classe da letra no título.
4. `docs/interface.md` § Medidas — a linha do título de super-grupo passa
   a citar borda esquerda de 3px e fundo 15% na cor do grupo (IDR 0045).
5. Nenhum registro novo: a decisão é o IDR 0045, já vigente; a tarefa só
   a implementa.
- Verificação prevista: classe por letra → teste em `SuperGrupo.test.jsx`;
  borda/fundo por letra → leitura/`grep` em `SuperGrupo.css`; texto em
  `--gold` → linha do CSS inalterada; doc → leitura do trecho; validação →
  lint/test/build.
- Riscos: a borda esquerda desloca o conteúdo em 3px (aceito pelo IDR
  0045); `color-mix` exige navegador evergreen (alvo do projeto), mesma
  técnica que a Tarefa 0015-0003 usará.
- Desvios: nenhum.

## Decisões tomadas
- Nenhuma decisão significativa nova. A fórmula da cor (borda 3px, fundo
  15% sobre transparente, texto em `--gold`) vem do IDR 0045. A escolha
  de implementação — classe modificadora por letra (nível 1) e mistura
  com `color-mix(in oklch, … , transparent)` — é interna ao CSS,
  reversível, e não contraria registro vigente; sem registro próprio,
  como permite o guia.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 56ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  414 passed (414)
   Duration  46.00s
```
Novo teste em `src/components/SuperGrupo.test.jsx` ("aplica a classe de cor
de cada letra do grupo no título"), 8 testes no arquivo (antes 7). Os
avisos `act(...)` em testes de `App` são pré-existentes e alheios a esta
tarefa.

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-CM7CeeFG.css                     17.51 kB │ gzip:   4.12 kB
dist/assets/index-BetEjmwn.js                     411.89 kB │ gzip: 124.27 kB
✓ built in 754ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm-C9FfgNga.js`,
505.90 kB), sem relação com esta tarefa.

### Busca e diff
```
$ grep -c 'super-grupo__titulo--' src/components/SuperGrupo.css   # 12 regras (a..l)
$ grep -n 'super-grupo__titulo--' src/components/SuperGrupo.jsx
125:        className={`super-grupo__titulo super-grupo__titulo--${grupo.toLowerCase()}`}
$ grep -n 'border-left\|color-mix' src/components/SuperGrupo.css
20:  border-left: 3px solid var(--group-color, transparent);
21:  background: color-mix(in oklch, var(--group-color, transparent) 15%, transparent);
$ grep -n 'IDR 0045' docs/interface.md   # linha do título em § Medidas
```

### Verificação visual — pendente
Sem navegador/sessão autenticada neste ambiente (o catálogo só existe
atrás do login Google, `requisitos.md` § Acesso), como nos logs das
tarefas anteriores. Roteiro em `npm run dev`, ordenação por página: abrir
os 12 super-grupos e conferir a borda esquerda de 3px e o fundo tingido
de cada um (A–L), com o texto ainda legível em `--gold`, abertos e
fechados.

## Critérios de aceite
- [x] Cada título tem borda esquerda de 3px e fundo 15% da cor do seu grupo
      — `SuperGrupo.css:20-21` (borda e `color-mix` 15%) e as 12 regras
      `.super-grupo__titulo--a` … `--l` (`SuperGrupo.css:36-82`), cada uma
      ligando `--group-color` ao token do grupo; teste parametrizado nas 12
      letras confere a classe no título
- [x] Texto do título continua em `--gold` — `SuperGrupo.css:27`
      (`color: var(--gold)`) inalterado
- [x] `docs/interface.md` § Medidas descreve o título citando o IDR 0045 —
      linha "Título de super-grupo" passa a citar borda esquerda de 3px e
      fundo com 15% da cor do grupo, com `(IDR 0045)`

## Arquivos alterados
- `src/components/SuperGrupo.jsx` — classe modificadora por letra
- `src/components/SuperGrupo.css` — `--group-color`, borda e fundo no
  título
- `src/components/SuperGrupo.test.jsx` — teste da classe por letra
- `docs/interface.md` — § Medidas, linha do título de super-grupo
- `docs/plano/0015-identidade-de-cor-por-grupo/0002-cor-no-titulo-do-super-grupo.md`
  — status `Pendente` → `Concluída`
- `docs/plano/README.md` — fase 15 e tarefa 0002: status de execução
- `docs/plano/0015-identidade-de-cor-por-grupo/logs/0002-log-cor-no-titulo-do-super-grupo.md`
  — este log (criado)
