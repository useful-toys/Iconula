<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0015-0003: cor na faixa de bandeiras

## Data
2026-09-13

## Resumo
Antes: cada bandeira da faixa do cabeçalho era um quadrado `--panel` sem
identidade de grupo, tanto na ordenação por página quanto na por sigla; os
tokens `--group-*` criados pela Tarefa 0015-0001 só tinham consumidor no
título do super-grupo (Tarefa 0015-0002). Depois: na ordenação por página,
cada bandeira recebe uma classe modificadora com a chave do seu grupo
(`--grupo-a` … `--grupo-l`) ou de FWC/COC (`--grupo-fwc`, `--grupo-coc`) e o
CSS pinta o fundo com 20% dessa cor misturada a `--panel`; na ordenação por
sigla, nenhuma classe é somada e o fundo segue `--panel`. Hover, foco, área
de toque e espaçamentos não mudam. `docs/interface.md` § Medidas passa a
descrever o fundo colorido por página, citando o IDR 0045.

Arquivos e papéis: `src/components/FaixaDeSecoes.jsx` soma a classe de cor
quando a ordenação é por página; `src/components/FaixaDeSecoes.css` define
`--group-color` por classe e consome no `background` do botão;
`src/components/FaixaDeSecoes.test.jsx` prova a classe certa nas 50 bandeiras
por página e a ausência por sigla; `docs/interface.md` § Medidas atualiza a
linha "Faixa de bandeiras". Nenhuma divergência entre tarefa, documentação e
código: as cores vêm dos tokens do IDR 0045.

## Discovery
- Código: `FaixaDeSecoes.jsx` é função sem estado; monta 50 botões a partir
  da prop `secoes` já na ordem vigente. Cada seção de seleção tem
  `tipo: "selecao"` e `grupo` A–L; FWC e COC têm `tipo: "especial"` e
  `grupo: null` (`src/data/catalogo.js:83, 92-111`). O botão já compõe classes
  condicionalmente para `--inicio-de-grupo` (ordenar por página); o CSS usa
  `background: var(--panel)` e `:hover` em `--border`
  (`FaixaDeSecoes.css:26-64`). A técnica `color-mix(in oklch, …, …)`
  já é usada em `SuperGrupo.css:21` (Tarefa 0015-0002), sem novidade de
  suporte. `Cabecalho.test.jsx` consulta `--inicio-de-grupo` por seletor, que
  continua existindo. Testes de `FaixaDeSecoes.test.jsx` usam Testing Library
  (`render`/`screen`) e `extrairSecoes(ordenarPorPagina(secoes))`. O
  comportamento atual confere com a tarefa: nenhuma cor de grupo na faixa.
- Documentação: as referências bastaram. Conferido `docs/idr/0045` § Decisão
  (faixa: 20% sobre `--panel`, só por página, neutra por sigla inclusive FWC
  e COC) e § Especiais (alias `--group-fwc`/`--group-coc`), o `IDR 0046`
  § Hierarquia (reforça que a faixa usa a cor do grupo até a Fase 16) e a
  linha "Faixa de bandeiras" de `docs/interface.md` § Medidas
  (`interface.md:613-619`).

## Plano da alteração
1. `FaixaDeSecoes.jsx` — quando `ordenacao === 'pagina'`, somar ao botão a
   classe `faixa-de-secoes__botao--grupo-<chave>`, onde a chave é a sigla em
   minúscula para `tipo === 'especial'` (FWC/COC) e a letra do `grupo` em
   minúscula para as seleções; na ordenação por sigla, nenhuma classe.
2. `FaixaDeSecoes.css` — no `.faixa-de-secoes__botao`, trocar o fundo fixo
   por `color-mix(in oklch, var(--group-color, var(--panel)) 20%, var(--panel))`
   (sem classe, `--group-color` é `--panel` e o fundo continua `--panel`);
   14 regras modificadoras definindo `--group-color` (`--a`…`--l` para
   `--group-a`…`--group-l`, mais `--fwc` e `--coc`). Hover e foco intactos.
3. `FaixaDeSecoes.test.jsx` — teste por página conferindo a classe de cada
   uma das 50 bandeiras pela chave da seção (inclusive FWC e COC); teste por
   sigla conferindo ausência de qualquer classe de cor.
4. `docs/interface.md` § Medidas — a linha "Faixa de bandeiras" passa a
   citar o fundo com 20% da cor do grupo na ordenação por página (IDR 0045),
   mantendo o neutro na por sigla.
5. Nenhum registro novo: a decisão é o IDR 0045, já vigente; a tarefa só a
   implementa.
- Verificação prevista: classe por página/sigla → testes em
  `FaixaDeSecoes.test.jsx`; fundo 20% por classe → `grep`/leitura em
  `FaixaDeSecoes.css`; área de toque, espaçamento e foco inalterados →
  `git diff` do CSS; doc → leitura do trecho; validação → lint/test/build.
- Riscos: `color-mix` exige navegador evergreen (alvo do projeto; mesma
  técnica da Tarefa 0015-0002); nenhum risco estrutural.
- Desvios: nenhum.

## Decisões tomadas
- Nenhuma decisão significativa nova. A fórmula (20% sobre `--panel`, só por
  página) vem do IDR 0045. A escolha de implementação — nome da classe
  modificadora por chave de grupo (nível 1) e o default `--group-color:
  var(--panel)` para a faixa neutra — é interna ao componente/CSS,
  reversível, e não contraria registro vigente; sem registro próprio, como
  permite o guia.

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
Finished in 47ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  416 passed (416)
   Duration  44.05s
```
Dois testes novos em `src/components/FaixaDeSecoes.test.jsx` (9 no arquivo,
antes 7): a classe de cor de cada bandeira por página e a ausência por sigla.
Os avisos `act(...)` em testes de `App` são pré-existentes e alheios a esta
tarefa.

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-DoWEstQw.css                     18.44 kB │ gzip:   4.22 kB
dist/assets/index-DoHcAK9H.js                     412.02 kB │ gzip: 124.32 kB
✓ built in 504ms
```
Aviso de chunk > 500 kB é pré-existente (`index.esm-magD1lwR.js`,
505.90 kB), sem relação com esta tarefa.

### Busca e diff
```
$ grep -c 'faixa-de-secoes__botao--grupo-' src/components/FaixaDeSecoes.css   # 14 regras
$ grep -c 'faixa-de-secoes__botao--grupo-' src/components/FaixaDeSecoes.jsx   # 1 (na chave)
$ git diff -- src/components/FaixaDeSecoes.css  # só a linha do `background` e as 14 regras novas
$ grep -n 'IDR 0045' docs/interface.md          # linha da faixa em § Medidas
```

### Verificação visual — pendente
Sem navegador/sessão autenticada neste ambiente (o catálogo só existe atrás
do login Google, `requisitos.md` § Acesso), como nos logs das tarefas
anteriores. Roteiro em `npm run dev`: com a ordenação por página, conferir as
50 bandeiras tingidas com 20% da cor do seu grupo (FWC em dourado, COC em
vermelho no fim); alternar para a ordenação por sigla e conferir a faixa
neutra; tocar numa bandeira e conferir o salto.

## Critérios de aceite
- [x] Por página, cada bandeira com fundo 20% da cor do grupo; FWC e COC com
      as suas — `background: color-mix(in oklch, var(--group-color,
      var(--panel)) 20%, var(--panel))` (`FaixaDeSecoes.css:34`) e as 14
      classes `--grupo-a` … `--grupo-l`, `--grupo-fwc`, `--grupo-coc`
      (`FaixaDeSecoes.css:42-107`); teste "na ordenação por página, cada
      bandeira recebe a classe de cor do seu grupo" cobre as 50, conferindo
      FWC (`botoes[0]`) e COC (`botoes[49]`)
- [x] Por sigla, nenhuma bandeira com classe de cor — teste "na ordenação por
      sigla, nenhuma bandeira recebe classe de cor de grupo" (`coloridas` com
      comprimento 0)
- [x] Área de toque, espaçamentos e foco inalterados — `git diff` só troca a
      linha do `background` e acrescenta as 14 regras; `:hover`
      (`FaixaDeSecoes.css:125`), `:focus-visible`, `margin-left` de início de
      grupo e o `::before` de área de toque seguem intactos
- [x] `docs/interface.md` § Medidas descreve a cor da faixa citando o
      IDR 0045 — linha "Faixa de bandeiras" (`interface.md:613`) passa a citar
      20% da cor do grupo misturada a `--panel` por página, neutro por sigla,
      com `(IDR 0045)`

## Arquivos alterados
- `src/components/FaixaDeSecoes.jsx` — classe de cor por grupo quando a
  ordenação é por página
- `src/components/FaixaDeSecoes.css` — `background` com `color-mix` 20% e 14
  classes `--grupo-*`
- `src/components/FaixaDeSecoes.test.jsx` — testes da classe por página e da
  ausência por sigla
- `docs/interface.md` — § Medidas, linha "Faixa de bandeiras"
- `docs/plano/0015-identidade-de-cor-por-grupo/0003-cor-na-faixa-de-bandeiras.md`
  — status `Pendente` → `Concluída`
- `docs/plano/README.md` — fase 15 e tarefa 0003: status de execução
- `docs/plano/0015-identidade-de-cor-por-grupo/logs/0003-log-cor-na-faixa-de-bandeiras.md`
  — este log (criado)
