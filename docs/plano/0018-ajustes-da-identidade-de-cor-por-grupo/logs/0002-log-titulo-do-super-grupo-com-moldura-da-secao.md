<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0018-0002: título do super-grupo com moldura da seção

## Data
2026-09-13

## Resumo
Antes: o título do super-grupo era só texto (`padding: 0`, `border: none`) com
uma barra esquerda de 3px na cor do grupo e o fundo tingido de 15% sobre
transparente. Depois: o título ganha a moldura arredondada do cabeçalho de
seção — `background` de 30% da cor do grupo sobre `--panel`, `border: 1px
solid var(--border)`, `border-radius: 12px`, `padding: 7px 12px` —, mantém a
barra esquerda de 3px na cor do grupo e o texto em `--gold`; o
`align-items` passa de `baseline` para `center` para alinhar os itens à
moldura.

Arquivos e papéis: `src/components/SuperGrupo.css` troca o fundo para 30%
sobre `--panel`, acrescenta borda/raio/padding e o `align-items: center`, e
atualiza o comentário das classes `--titulo--<letra>`; `docs/interface.md`
§ Medidas atualiza a linha "Título de super-grupo" citando o IDR 0045. Nenhum
arquivo JS nem teste mudou: as classes de cor por letra (Tarefa 0015-0002)
continuam sendo o gatilho, e valores de CSS são verificados por leitura e
busca, como nas tarefas de estilo anteriores.

Nenhuma divergência entre tarefa, documentação e código. Divergência antiga
fora do escopo: `docs/idr/0046-cores-de-selecoes.md` § Hierarquia de cores
ainda cita "fundo 15%" no título e "20%" na faixa; não é tocada aqui (vai
para `observacoes`).

## Discovery
- Código: `SuperGrupo.jsx` aplica sempre
  `super-grupo__titulo--<letra.toLowerCase()>` (A–L) e o texto
  "Grupo A"…"Grupo L"; FWC e COC não têm super-grupo (ficam fora), então
  `--group-color` está sempre definido nesse título. `.super-grupo__titulo`
  concentra o que a tarefa muda (`SuperGrupo.css:12-30`); as classes
  `--titulo--a`…`--titulo--l` (`SuperGrupo.css:36-82`) definem `--group-color`
  e permanecem inalteradas. `Secao.css:19-33` (`.secao__cabecalho`) é a
  moldura a reproduzir: `padding: 7px 12px`, `background: var(--panel)`,
  `border: 1px solid var(--border)`, `border-radius: 12px`. O título não tem
  pseudo-elementos nem área de toque própria, então nada conflita.
  `SuperGrupo.test.jsx` cobre nome/progresso/colapso e a classe de cor por
  letra (nenhum teste lê valores de CSS); o comportamento atual confere com a
  tarefa (15% sobre transparente, sem moldura). Impacto fora de "Arquivos
  impactados": nenhum.
- Documentação: as referências bastaram. Confirmei o IDR 0045 § Decisão
  (moldura da seção + barra esquerda de 3px + fundo 30% sobre `--panel` +
  texto `--gold`) e § Histórico (revisão de 2026-09-13 que motivou a Fase
  0018). Conferi que o IDR 0050 não fixa `padding` do título (só o vão de 8px
  do título ao corpo), então o `7px 12px` do IDR 0045 não o contraria.
  Confirmei os tokens `--panel`, `--border` e `--gold` em `theme.css:7-9` e a
  linha atual "Título de super-grupo" em `docs/interface.md:632-634`.

## Plano da alteração
1. `src/components/SuperGrupo.css` — em `.super-grupo__titulo`: `padding:
   7px 12px` (era `0`), `border: 1px solid var(--border)` (era `none`),
   `border-left: 3px solid var(--group-color, transparent)` mantida,
   `border-radius: 12px`, `background: color-mix(in oklch, var(--group-color,
   transparent) 30%, var(--panel))` (era 15% sobre transparente),
   `align-items: center` (era `baseline`).
2. `src/components/SuperGrupo.css` — comentário das classes de cor: 30% sobre
   `--panel` e moldura, mantendo o texto em `--gold`.
3. `docs/interface.md` § Medidas — a linha "Título de super-grupo" passa a
   descrever a moldura (`--panel`, raio 12px, `padding: 7px 12px`), a barra
   esquerda de 3px e o fundo a 30% sobre `--panel`, citando o IDR 0045.
4. Nenhum registro novo: a decisão é o IDR 0045, já revisado no planejamento;
   a tarefa só a implementa. Nenhum teste novo: não há código JS alterado.
- Verificação prevista: moldura (`padding`, `border`, `border-radius`,
  `align-items`) e fundo 30% → leitura/`grep` em `SuperGrupo.css`; texto
  `--gold` → `grep` de `color: var(--gold)`; doc → leitura do trecho;
  validação → lint/test/build.
- Riscos: a borda esquerda de 3px precisa continuar na cor do grupo com a
  borda completa de 1px `--border` — `border-left` declarado depois de
  `border` vence a lateral esquerda; `color-mix` com `--group-color` sempre
  definido no componente (fallback `transparent` preservado por segurança);
  a moldura aumenta a altura do título em `2 × 7px` + borda, aceito como o
  respiro do cabeçalho de seção.
- Desvios: nenhum.

## Decisões tomadas
- Nenhuma decisão significativa nova. A fórmula (moldura `--panel` + raio
  12px + `padding: 7px 12px`, barra esquerda de 3px, fundo 30% sobre
  `--panel`, texto `--gold`) vem do IDR 0045. Manter o fallback
  `var(--group-color, transparent)` (em vez de `var(--group-color)` sem
  fallback, como no pseudocódigo da tarefa) é escolha nível 1, interna ao
  CSS e reversível, para não invalidar a declaração caso a classe de cor
  falte; sem registro próprio, como permite o guia.

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
Finished in 44ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  416 passed (416)
   Duration  55.91s
```
Nenhum teste novo (não houve mudança de JS); os 416 incluem o teste "aplica a
classe de cor de cada letra do grupo no título" de `SuperGrupo.test.jsx`, que
garante o gatilho `--group-color`. Os avisos `act(...)` de `Avisos` são
pré-existentes e alheios a esta tarefa.

### `npm run build`
```
dist/assets/index-DFGIMujJ.css                     19.70 kB │ gzip:   4.34 kB
dist/assets/index-C1UTwo7w.js                     412.02 kB │ gzip: 124.32 kB
dist/assets/index.esm-CwAdU65h.js                 505.90 kB │ gzip: 148.77 kB
✓ built in 610ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm`, 505.90 kB), sem relação
com esta tarefa.

### Busca
```
$ Select-String src\components\SuperGrupo.css -Pattern "align-items|padding:|border|background:|30%|--gold"
15:  align-items: center;
17:  padding: 7px 12px;
19:  border: 1px solid var(--border);
20:  border-left: 3px solid var(--group-color, transparent);
21:  border-radius: 12px;
22:  background: color-mix(in oklch, var(--group-color, transparent) 30%, var(--panel));
28:  color: var(--gold);
36: * permanece em `--gold`. ...
$ Select-String docs\interface.md -Pattern "Título de super-grupo"
632: linha passa a citar moldura, barra esquerda de 3px e fundo a 30% (IDR 0045)
```

### Verificação visual — pendente
Sem navegador/sessão autenticada neste ambiente (o catálogo só existe atrás do
login Google, `requisitos.md` § Acesso), como nos logs das tarefas anteriores.
Roteiro em `npm run dev`: com a ordenação por página, conferir cada título de
super-grupo com a moldura arredondada (`--panel`, raio 12px, respiro de
`7px 12px`), a barra esquerda de 3px na cor do grupo (A verde … L
vermelho-vinho) e o fundo tingido a 30%; comparar com o cabeçalho de seção
logo abaixo (mesma moldura, sem cor de grupo) para confirmar a hierarquia; o
texto "Grupo A"…"Grupo L" permanece dourado.

## Critérios de aceite
- [x] `.super-grupo__titulo` com moldura (`--panel` + raio 12px + padding
      7px 12px), barra esquerda de 3px e fundo a 30% sobre `--panel` —
      `SuperGrupo.css:17` (`padding: 7px 12px`), `:19` (`border: 1px solid
      var(--border)`), `:20` (`border-left: 3px solid var(--group-color,
      transparent)`), `:21` (`border-radius: 12px`), `:22`
      (`color-mix(... 30%, var(--panel))`)
- [x] Texto do título permanece `--gold` — `SuperGrupo.css:28`
      (`color: var(--gold)`), inalterado
- [x] `docs/interface.md` § Medidas descreve o título citando o IDR 0045 —
      linha "Título de super-grupo" (`interface.md:632-635`) passa a citar
      moldura (`--panel`, raio 12px, `padding: 7px 12px`), barra esquerda de
      3px e fundo a 30% sobre `--panel`, com `(IDR 0045)`

## Arquivos alterados
- `src/components/SuperGrupo.css` — `.super-grupo__titulo` com moldura
  (`padding: 7px 12px`, `border: 1px solid var(--border)`, `border-radius:
  12px`, `align-items: center`) e fundo a 30% sobre `--panel`; comentário das
  classes de cor atualizado
- `docs/interface.md` — § Medidas, linha "Título de super-grupo"
- `docs/plano/0018-ajustes-da-identidade-de-cor-por-grupo/0002-titulo-do-super-grupo-com-moldura-da-secao.md`
  — status `Pendente` → `Concluída`
- `docs/plano/README.md` — tarefa 0002 `Pendente` → `Concluída`
- `docs/plano/0018-ajustes-da-identidade-de-cor-por-grupo/logs/0002-log-titulo-do-super-grupo-com-moldura-da-secao.md`
  — este log (criado)
