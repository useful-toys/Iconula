<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0002: catálogo e cabeçalho em somente leitura

## Data
2026-09-16

## Resumo
Os componentes da tela principal passam a suportar a vista do catálogo
compartilhado por link (IDR 0055) sem que a tela principal atual mude nada.
`Figurinha` deixa de exigir `onIncrementar`: sem callback, o corpo do cartão
vira um `div` com `role="img"` (fora da tabulação, sem gesto de pressão longa,
sem controle de menos, sem retorno de toque), com a mesma aparência de estado
e o mesmo nome acessível do cartão editável. `Secao`, `SuperGrupo`,
`PaginaDoAlbum` e `Catalogo` tratam `onAjustar` como opcional e não o repassam
aos cartões quando ausente. `Catalogo` ganha `gravarColapso` (padrão `true`):
com `false`, lê o colapso manual na abertura e o altera em memória, mas não
grava no `localStorage`. `Cabecalho` ganha `somenteLeitura` (rótulo
`somente leitura` em `--muted` no fim da linha do título, também no nome
acessível) e `tituloComoLink` (`ICONULA 2026` vira link para `/`). Sem as
props, a marcação de todos eles é idêntica à atual.

## Discovery
- Código: `Figurinha` renderiza o corpo como `<button>` e o menos como
  segundo `<button>`, com handlers de clique/ponteiro e o estado
  `pressionando`; o comparador de `memo` (`propsEquivalentes`) ignora de
  propósito `onIncrementar`/`onDecrementar`. `Secao` monta os callbacks
  `() => onAjustar(codigo, ±1)` na lista e via `CorpoAlbum` →
  `PaginaDoAlbum`; os comparadores de `Secao`/`SuperGrupo` comparam
  `onAjustar` por referência e `Catalogo` não é memoizado. `Catalogo` lê o
  colapso no inicializador do `useState` e grava num `useEffect` sobre
  `colapsadas`. `Cabecalho` tem o título num `<h1 aria-label>` com um
  `<span className="cabecalho__nome">ICONULA 2026</span>`. O comportamento
  atual confere com a tarefa; os testes cobrem pressão longa, colapso,
  persistência e o cabeçalho. Impacto fora dos arquivos citados: nenhum —
  nenhum outro módulo consome essas props.
- Documentação: além das referências, li `docs/idr/0020` (colapso manual
  persistido), `docs/idr/0047`/`idr/0042` (nome acessível por extenso) e
  `docs/interface.md` § Cabeçalho, § Figurinha e § Interações — as
  referências bastaram; `docs/interface.md` não muda (textos da vista são da
  Tarefa 0027-0003).

## Plano da alteração
1. `src/components/Figurinha.jsx` + `.css`: `onIncrementar` opcional; sem ele,
   corpo `div` com `role="img"` e `aria-label` já existente, sem handlers, sem
   menos, classe de wrapper `figurinha--leitura` para `cursor` e `:active`
   neutros; comparador de `memo` passa a comparar a presença dos callbacks.
2. `src/components/Secao.jsx`, `SuperGrupo.jsx`, `PaginaDoAlbum.jsx`: repassam
   os callbacks de ajuste aos cartões só quando `onAjustar` existe.
3. `src/components/Catalogo.jsx`: `onAjustar` opcional e prop `gravarColapso`
   (padrão `true`) que, com `false`, pula a gravação do `useEffect`.
4. `src/components/Cabecalho.jsx` + `.css`: props `somenteLeitura` (rótulo e
   nome acessível) e `tituloComoLink` (âncora para `/`), com a classe
   `.cabecalho__rotulo` em `--muted`.
5. Testes ao lado de cada componente: cartão inerte (não botão, fora da
   tabulação via `user.tab()`, sem menos, sem `--pressionando`, nome acessível
   e adornos iguais); seção/álbum/super-grupo sem `onAjustar`; colapso lido,
   alternado e não gravado com `gravarColapso={false}`; cabeçalho com e sem
   as props.
- Verificação prevista: cada critério pelos novos `it`; regressão por
  `npm run lint && npm run test && npm run build` (sem tocar regras, então
  `test:rules` não se aplica).
- Riscos: o comparador de `Figurinha` ignorar os callbacks poderia mascarar a
  troca editável↔leitura na mesma instância; mitigado comparando a presença.
- Desvios: nenhum.

## Decisões tomadas
- Cartão inerte como `div` com `role="img"` e o `aria-label` já existente, em
  vez de botão desabilitado — decisão de nível 1 prevista na própria tarefa;
  a mesma `figurinha--leitura` isola `cursor`/`:active` no CSS.
- Detecção do modo pelo callback: existência de `onIncrementar` decide o papel
  do cartão (nível 1, forma da prop).
- Nomes das props `gravarColapso`, `somenteLeitura` e `tituloComoLink`
  (nível 1).
- Comparador de `Figurinha` compara a presença de `onIncrementar`/
  `onDecrementar`, não a identidade (nível 1, TDR 0021).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> oxlint

Found 0 warnings and 0 errors.
Finished in 59ms on 85 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  41 passed (41)
      Tests  527 passed (527)
```
Os 514 testes anteriores seguem verdes; os 13 novos passam.

### `npm run build`
```
✓ 136 modules transformed.
dist/assets/index-D01qve2V.css   47.33 kB │ gzip:   7.89 kB
dist/assets/index-DrglaPGN.js   441.04 kB │ gzip: 135.81 kB
✓ built in 509ms
```
(aviso pré-existente de chunk > 500 kB, sem relação com a tarefa.)

## Critérios de aceite
- [x] Cartão sem callback não é botão, não entra na ordem de tabulação, não
      mostra o menos e não reage a clique nem a pressão longa, com nome
      acessível igual ao do cartão editável — `describe` "Figurinha — somente
      leitura (IDR 0055)" em `src/components/Figurinha.test.jsx`
- [x] Catálogo sem `onAjustar` renderiza nas disposições lista e álbum, com
      colapso e salto funcionando — "Catalogo — sem onAjustar (IDR 0055)" em
      `src/components/Catalogo.test.jsx`
- [x] No modo sem gravação, alternar o colapso não chama
      `gravarColapsoManual` — "com gravarColapso=false, alternar o colapso
      não chama gravarColapsoManual" em `src/components/Catalogo.test.jsx`
- [x] Cabeçalho com as props mostra `somente leitura` e o título como link
      para `/`; sem as props, a marcação é a atual — `describe` "Cabeçalho —
      somente leitura (IDR 0055)" em `src/components/Cabecalho.test.jsx`
- [x] Testes existentes de `App` e dos componentes verdes, sem alteração de
      comportamento da tela principal — 41 arquivos, 527 testes, incluindo os
      testes de `App`

## Arquivos alterados
- `src/components/Figurinha.jsx` — callback opcional, corpo inerte e
  comparador
- `src/components/Figurinha.css` — isola cursor e `:active` do cartão inerte
- `src/components/Secao.jsx` — `onAjustar` opcional
- `src/components/SuperGrupo.jsx` — `onAjustar` opcional
- `src/components/PaginaDoAlbum.jsx` — `onAjustar` opcional
- `src/components/Catalogo.jsx` — `onAjustar` opcional e `gravarColapso`
- `src/components/Cabecalho.jsx` — `somenteLeitura` e `tituloComoLink`
- `src/components/Cabecalho.css` — `.cabecalho__rotulo`
- `src/components/Figurinha.test.jsx`, `Secao.test.jsx`, `SuperGrupo.test.jsx`,
  `PaginaDoAlbum.test.jsx`, `Catalogo.test.jsx`, `Cabecalho.test.jsx` — testes
- `docs/plano/README.md` — status
- `docs/plano/0027-catalogo-compartilhado-por-link/0002-catalogo-e-cabecalho-somente-leitura.md`
  — status
