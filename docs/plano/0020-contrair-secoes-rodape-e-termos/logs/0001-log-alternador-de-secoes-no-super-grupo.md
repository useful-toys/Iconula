<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0020-0001: alternador que contrai e expande as seções do super-grupo

## Data
2026-09-14

## Resumo
Acrescenta ao título de cada super-grupo aberto um alternador `⊟`/`⊞` que
contrai ou expande de uma vez as suas 4 seções, deixando o grupo como 4 linhas
de resumo num toque. Antes: cada seção só fechava pelo próprio título.

`SuperGrupo.jsx` deixa de ter o título como um único botão: a moldura passa a
um contêiner `.super-grupo__titulo` com dois botões irmãos — o título atual
(chevron, nome, resumo; `aria-expanded` mantido) e o alternador na ponta
direita, só renderizado com o grupo expandido. `Catalogo.jsx` ganha a operação
estável por letra que age sobre as 4 siglas do grupo (alguma aberta → fecha
todas; todas fechadas → abre todas), no mesmo conjunto `colapsadas.secoes` já
gravado no `localStorage` (`IDR 0020`, `IDR 0026`).

## Discovery
- Código: li `SuperGrupo.jsx`/`SuperGrupo.css`, `Catalogo.jsx`,
  `Secao.jsx`/`Secao.css`, `colapsoManual.js` e os testes
  `SuperGrupo.test.jsx`/`Catalogo.test.jsx`. O título é hoje um único `<button>`
  com a moldura (borda, barra esquerda de 3px, fundo com 30% da cor do grupo) e
  o colapso das seções é controlado por `Catalogo` via `colapsadas.secoes`
  (`toggleSecao`/`expandirSecao` + mapa `toggleHandlers`). O alternador exige
  converter o título em linha com dois botões irmãos e mover a moldura para um
  contêiner — como manda o `IDR 0020`. Convenções locais: `memo` com
  comparador customizado (`propsEquivalentes`), callbacks estáveis por letra
  (`toggleGrupoHandlers`), foco visível global (`IDR 0042`) e área de toque
  ampliada por `::before` sob `pointer: coarse`.
  - **Divergência**: o critério "teste existente de memoização continua verde"
    não encontra lastro — não há, no repositório, teste de memoização de
    `SuperGrupo`; o TDR 0021 registra que a contagem de invocações veio de um
    "teste temporário" e que a instrumentação não foi mantida. Não muda o
    pedido: acrescento um teste de memoização em `SuperGrupo.test.jsx` para dar
    forma concreta ao critério, sem tocar no TDR.
  - Os testes existentes buscam o título por `{ name: /Grupo [A-L]/ }`; com o
    alternador (nome acessível "contrair/expandir as seções do Grupo X") na
    mesma linha, a busca fica ambígua. Ajusto essas buscas para âncora de
    início (`/^Grupo X/`), que distingue título de alternador.
- Documentação: as referências bastaram. Confirmei em `docs/interface.md`
  § Corpo, § Interações e § Medidas o estado atual do título do super-grupo e
  o `IDR 0042` (área de toque ampliada) para manter as medidas.

## Plano da alteração
1. `Catalogo.jsx`: `toggleSecoesDoGrupo(siglas)` estável — se alguma sigla não
   estiver em `colapsadas.secoes`, acrescenta todas; senão, remove todas; mapa
   `toggleSecoesGrupoHandlers` por letra (useMemo) e `getToggleSecoesGrupoHandler`
   estável; no render, passar `onToggleSecoes` e `todasSecoesFechadas`
   (`item.secoes.every(...)` sobre as 4 seções, inclusive as ocultas pelo filtro).
2. `SuperGrupo.jsx`: contêiner `.super-grupo__titulo` (moldura) com o botão do
   título e o alternador irmão; `todasSecoesFechadas` decide glifo (`⊟`/`⊞`) e
   nome acessível; acrescentar as duas props ao `propsEquivalentes`.
3. `SuperGrupo.css`: mover a moldura para o contêiner; estilos do botão do
   título e do alternador (`--gold`, sem fundo próprio), foco visível herda a
   regra global, área de toque ampliada por `::before` sob `pointer: coarse`.
4. Testes: `SuperGrupo.test.jsx` (alternador só aberto, glifo/nome, callback,
   sem `<button>` dentro de `<button>`, memoização) e `Catalogo.test.jsx`
   (contrai/expande as 4 seções, age sobre oculta pelo filtro, grava no
   `localStorage`).
5. `docs/interface.md` § Corpo, § Interações e § Medidas, citando o `IDR 0020`.
- Verificação prevista: cada critério de aceite → teste correspondente em
  `SuperGrupo.test.jsx`/`Catalogo.test.jsx`; `docs/interface.md` → leitura.
- Riscos: a moldura sair do botão e quebrar seletores de teste (mitigado com o
  ajuste das buscas); a dupla `⊟`/`⊞` colidir com a busca por `/Grupo X/`
  (mitigado pela âncora); quebrar a memoização com props novas (mitigado
  incluindo-as no comparador).
- Desvios: nenhum.

## Decisões tomadas
- Forma de passar "todas fechadas" e o callback ao `SuperGrupo` sem quebrar a
  comparação de props: `todasSecoesFechadas` booleano (primitivo) e
  `onToggleSecoes` vindo de mapa estável por letra — ambos acrescentados ao
  `propsEquivalentes`. Nível 1, conforme "Decisões em aberto nesta tarefa";
  sem registro próprio (decisão interna de código, `docs/plano/CLAUDE.md`
  § Registro de decisões).
- A moldura e a classe de cor do grupo passam do botão para o contêiner
  `.super-grupo__titulo`; o botão do título vira `.super-grupo__titulo-botao`.
  Nível 1 (estrutura interna e nome de classe), sem registro.
- Alternador com desenho de 20×20px e `::before` de `inset: -4px` sob
  `pointer: coarse` (alvo ~28×28), seguindo o padrão do "menos" do cartão
  (18px → alvo 26×26, IDR 0042) para não aumentar a altura da linha do título.
  Nível 1, sem registro.
- Sem registro de decisão novo: o alternador é decisão do `IDR 0020`, já
  vigente, e a tarefa o implementa.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 57ms on 73 files with 105 rules using 4 threads.

$ npm run test
 Test Files  37 passed (37)
      Tests  457 passed (457)
 Duration  56.94s
(+ avisos `act(...)` pré-existentes em App.gravacao/importar/copiar/exportar,
   não tocados por esta tarefa)

$ npm run build
vite v8.2.2 building client environment for production...
✓ 132 modules transformed.
✓ built in 497ms
(aviso de chunk > 500 kB pré-existente do bundle do Firebase)
```

## Critérios de aceite
- [x] Com o grupo aberto e alguma seção aberta, o alternador mostra `⊟` e
      contrai as 4 seções; com todas fechadas, mostra `⊞` e expande as 4 —
      `SuperGrupo.test.jsx` › "mostra ⊟, nome acessível por extenso, e chama o
      callback ao contrair" e "mostra ⊞ e chama o callback ao expandir quando
      todas as seções estão fechadas"; `Catalogo.test.jsx` › "com alguma seção
      aberta, ⊟ contrai as 4 e grava no localStorage" e "com todas fechadas, ⊞
      expande as 4"
- [x] Com o grupo fechado, não há alternador — `SuperGrupo.test.jsx` › "não
      renderiza o alternador com o super-grupo fechado"
- [x] Seção oculta pelo filtro também é contraída e expandida —
      `Catalogo.test.jsx` › "age sobre a seção oculta pelo filtro, na contração
      e na expansão"
- [x] O conjunto gravado no `localStorage` reflete o resultado — os três
      testes de `Catalogo.test.jsx` acima leem `iconula.colapso-manual.v1`
- [x] Nenhum `<button>` dentro de `<button>` no título —
      `SuperGrupo.test.jsx` › "mantém título e alternador como botões irmãos,
      sem aninhamento" (`container.querySelector('button button')` é `null` e
      há 2 botões filhos diretos da moldura)
- [x] Ajustar uma figurinha de outro grupo não re-renderiza o super-grupo —
      `SuperGrupo.test.jsx` › "não re-renderiza quando só as contagens de outro
      grupo mudam" (espia `calcularPlacar`; não há teste de memoização
      pré-existente, ver Discovery)
- [x] `docs/interface.md` nas três seções, citando o IDR 0020 —
      § Corpo (`interface.md:144`), § Interações (`interface.md:275`) e
      § Medidas (`interface.md:682`)

Verificação visual: **pendente** neste ambiente (sem navegador). Roteiro em
`npm run dev` a 375px e 1440px, ordenação por página: contrair e expandir um
grupo; recarregar e conferir o estado; ativar o filtro de faltantes, contrair,
limpar o filtro e conferir as 4 seções fechadas; navegar por teclado até o
alternador.

## Arquivos alterados
- `src/components/Catalogo.jsx` — operação de contrair/expandir as seções de um
  grupo e props novas ao `SuperGrupo`
- `src/components/SuperGrupo.jsx` — título com dois botões irmãos e alternador
- `src/components/SuperGrupo.css` — moldura no contêiner e estilos do alternador
- `src/components/SuperGrupo.test.jsx`, `src/components/Catalogo.test.jsx` —
  testes do alternador e memoização
- `docs/interface.md` — § Corpo, § Interações e § Medidas
