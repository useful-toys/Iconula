<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0016-0002: cor no cabeçalho de seção por seleção

## Data
2026-09-13

## Resumo
Antes: o cabeçalho de cada seção (`.secao__cabecalho`) era um painel em
`--panel` com borda `--border`, sem identidade visual da seleção; os 50 tokens
`--selection-*` criados pela Tarefa 0016-0001 não tinham consumidor. Depois:
cada cabeçalho recebe a classe modificadora `secao__cabecalho--<sigla>` e o
`Secao.css` liga `--selection-color` ao token `--selection-<sigla>` por 50
regras (48 seleções + FWC + COC); a base consome a variável na borda completa
de 1px e no fundo misturado a `--panel`. FWC e COC usam os alias das cores de
grupo, então o dourado e o vermelho-marca aparecem corretamente.
`docs/interface.md` § Medidas passa a descrever o cabeçalho citando o IDR
0046.

Arquivos e papéis: `src/components/Secao.jsx` soma a classe modificadora
derivada de `secao.sigla`; `src/components/Secao.css` troca
`--panel`/`--border` por `color-mix(in oklch, var(--selection-color) 45%,
var(--panel))` e `1px solid var(--selection-color)` e define as 50 regras de
cor; `src/components/Secao.test.jsx` prova a classe por sigla nas duas
disposições; `docs/interface.md` § Medidas atualiza a linha do cabeçalho.

Divergência tarefa × registro: a tarefa e a linha do `docs/plano/README.md`
dizem "fundo 15%", mas o IDR 0046 vigente (revisado em 2026-09-13, § Histórico)
passou o fundo do cabeçalho de 15% para **45%**. O planejamento não reconciliou
o texto da tarefa; seguimos o registro (45%), como manda a hierarquia de
decisões — implementar 15% reverteria uma decisão documentada vigente sem
previsão. A divergência não foi corrigida no texto da tarefa (só o status
muda), mas fica registrada aqui e no relatório.

## Discovery
- Código: `src/components/Secao.jsx` tem `CabecalhoSecao` renderizando
  `<button className="secao__cabecalho">`; ele recebe `secao` (com `sigla`) e
  já deriva o nome acessível dela. `Secao` é `memo` com `propsEquivalentes`
  (TDR 0021) comparando `secao` por referência — a classe muda só o
  `className` a partir de `secao.sigla`, sem prop nova, então a memoização
  segue válida. `src/components/Secao.css` define `.secao__cabecalho` com
  `background: var(--panel)`, `border: 1px solid var(--border)`,
  `border-radius: 12px` e `padding: 7px 12px`; texto `--cream` e números
  `--muted`. Padrão a espelhar: `SuperGrupo.css` define `--group-color` por
  classes `super-grupo__titulo--<letra>` e consome na borda e no fundo;
  `SuperGrupo.jsx:125` monta a classe. `src/theme.css` tem os 50 tokens
  `--selection-<sigla>` (48 + alias FWC/COC). Testes de `Secao.test.jsx` usam
  Testing Library (`render`/`screen`) e `toHaveClass`, como
  `SuperGrupo.test.jsx:209-210`. Comportamento atual confere com a tarefa
  (nenhuma identidade de cor no cabeçalho), **exceto pelo percentual do
  fundo** (ver abaixo).
- Documentação: além das referências, conferido `docs/idr/0046` § Decisão,
  § Cores das seleções, § Hierarquia de cores e § Histórico, e o IDR 0050
  (padding do cabeçalho `7px 12px`). O IDR 0046 foi **revisado em 2026-09-13**
  (§ Histórico): o fundo do cabeçalho passou de 15% para **45%** da cor da
  seleção misturada a `--panel`, mantendo a borda completa de 1px — o
  esmiuçamento considerou 15% sutil demais. A tarefa e a linha de
  `docs/plano/README.md` ainda dizem 15% (planejamento anterior à revisão, não
  reconciliado); a decisão vigente é 45%.

### Divergência tarefa × registro (nível 2)
A tarefa pede "fundo 15%" e cita o IDR 0046 como fonte da decisão; o IDR 0046
vigente diz 45%. Implementar 15% reverteria a decisão documentada vigente sem
previsão (nível 3). A premissa conservadora é **seguir o registro**: borda de
1px e fundo de **45%** da cor da seleção sobre `--panel`. A divergência fica
registrada aqui, no relatório e em `observacoes`; o texto desatualizado da
tarefa/README não é alterado nesta execução (só o status muda).

## Plano da alteração
1. `src/components/Secao.jsx` — no botão do cabeçalho, somar a classe
   modificadora `secao__cabecalho--<sigla>` (sigla da seção em minúscula;
   48 seleções, FWC e COC).
2. `src/components/Secao.css` — `.secao__cabecalho` passa a consumir
   `--selection-color` na borda e no fundo; 50 regras de modificador
   (`--alg` … `--uzb`, `--fwc`, `--coc`) definem
   `--selection-color: var(--selection-<sigla>)`.
3. `src/components/Secao.test.jsx` — teste da classe por seleção, FWC e COC,
   nas disposições lista e álbum.
4. `docs/interface.md` § Medidas — a linha "Cabeçalho de seção" passa a
   descrever a borda de 1px e o fundo na cor da seleção, citando o IDR 0046.
5. Nenhum registro novo: a decisão é o IDR 0046, já vigente; a tarefa só a
   implementa.
- Verificação prevista: cada cabeçalho com a classe da sua seleção → teste em
  `Secao.test.jsx`; borda/fundo por seleção → leitura/`grep` em `Secao.css`;
  texto `--cream`, números `--muted`, raio e padding inalterados → diff;
  doc → leitura do trecho; validação → lint/test/build.
- Riscos: `color-mix` exige navegador evergreen (alvo do projeto); a classe
  modificadora precisa cobrir todas as 50 seções do catálogo.
- Desvios: o percentual do fundo é 45% (do IDR 0046 vigente), não os 15% do
  texto da tarefa — ver "Divergência tarefa × registro" acima.

## Decisões tomadas
- Fundo do cabeçalho a **45%** da cor da seleção sobre `--panel` (e não os 15%
  do texto da tarefa), seguindo o IDR 0046 vigente — nível 2 (ambiguidade que
  muda comportamento visível; o registro manda). Sem registro novo: o registro
  é o próprio `docs/idr/0046-cores-de-selecoes.md`.
- Classe modificadora por sigla (`secao__cabecalho--<sigla>`) ligando
  `--selection-color` ao token — nível 1 (implementação interna ao CSS,
  mesmo padrão de `SuperGrupo.css`), sem registro próprio, como permite o
  guia.

## Impedimentos
Nenhum. A divergência de percentual foi tratada como nível 2 (seguir o
registro).

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 111ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  36 passed (36)
      Tests  422 passed (422)
   Duration  53.52s
```
Novo bloco "cor da seleção no cabeçalho" em `src/components/Secao.test.jsx`,
6 casos parametrizados (BRA/FWC/COC × lista/álbum); o arquivo passou de 16
para 22 testes. Os avisos `act(...)` de `Avisos` são pré-existentes, sem
relação com esta tarefa.

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-BzNpE-2Q.css                     24.66 kB │ gzip:   5.15 kB
dist/assets/index-Sa0MVcYp.js                     412.07 kB │ gzip: 124.33 kB
✓ built in 574ms
(EXIT=0)
```
Aviso de chunk > 500 kB é pré-existente (`index.esm-Bfzk5MWO.js`, 505.90 kB),
sem relação com esta tarefa.

### Busca e diff
```
$ grep de `.secao__cabecalho--` em Secao.css              # 50 regras
$ tokens --selection-* em theme.css                      # 50; conjuntos idênticos
$ (siglas de src/data/catalogo.js sem regra)              # nenhuma (50/50)
$ git diff -- src/components/Secao.css                    # só background e border;
                                                          # raio, padding, --cream e --muted intactos
```

## Critérios de aceite
- [x] Cada cabeçalho com borda 1px e fundo da cor da sua seleção; FWC e COC
      com as suas — `Secao.css` (`color-mix(in oklch, var(--selection-color)
      45%, var(--panel))` e `1px solid var(--selection-color)`) e as 50 regras
      `.secao__cabecalho--<sigla>`; teste parametrizado confere a classe. O
      fundo é 45% (IDR 0046 vigente), não os 15% do texto da tarefa — ver
      "Divergência tarefa × registro".
- [x] Vale nas disposições lista e álbum — casos parametrizados cobrem
      BRA/FWC/COC nas duas disposições (`Secao.test.jsx`); a classe vive no
      cabeçalho, comum às duas.
- [x] Texto `--cream`, números `--muted`, raio e padding inalterados — o diff
      de `Secao.css` troca apenas as linhas de `background` e `border`;
      `border-radius: 12px`, `padding: 7px 12px`, `color: var(--cream)` e
      `.secao__resumo { color: var(--muted) }` seguem iguais.
- [x] `docs/interface.md` § Medidas descreve o cabeçalho citando o IDR 0046 —
      linha "Cabeçalho de seção" passa a citar borda de 1px e fundo de 45% da
      cor da seleção, com `(IDR 0046, IDR 0050)`.

## Arquivos alterados
- `src/components/Secao.jsx` — classe modificadora `secao__cabecalho--<sigla>`
- `src/components/Secao.css` — `--selection-color` na borda/fundo e as 50
  regras de cor por seleção
- `src/components/Secao.test.jsx` — bloco de teste da cor por seleção
- `docs/interface.md` — § Medidas, linha "Cabeçalho de seção"
- `docs/plano/0016-identidade-de-cor-por-selecao/0002-cor-no-cabecalho-de-secao-por-selecao.md`
  — status `Em andamento` → `Concluída`
- `docs/plano/README.md` — linha da tarefa 0002: `Em andamento` → `Concluída`
- `docs/plano/0016-identidade-de-cor-por-selecao/logs/0002-log-cor-no-cabecalho-de-secao-por-selecao.md`
  — este log (criado)
