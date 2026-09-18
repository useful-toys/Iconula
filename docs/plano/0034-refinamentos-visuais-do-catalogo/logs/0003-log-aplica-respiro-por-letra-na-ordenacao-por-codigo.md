<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0034-0003: Aplica respiro por letra na ordenação por código

## Data
2026-09-18

## Resumo
Na ordenação por sigla, a seção cuja letra inicial da sigla difere da
anterior ganha +2px de respiro sobre o `gap` de 8px (`--section-gap`),
inclusive nas fronteiras FWC→primeira seleção e última seleção→Coca-Cola;
letras repetidas mantêm 8px. A ordenação por página não muda.
`catalogoOrdenacoes.js` ganha a função pura `letraMudou(secoes, indice)`;
`Catalogo.jsx` marca o contêiner de cada seção com
`catalogo__secao--respiro-letra` quando `letraMudou` é verdadeiro (só fora
da ordenação por página), preservando a memoização de `Secao`/`SuperGrupo`
(TDR 0021) porque as props não mudam; `Catalogo.css` define a margem que
soma ao `gap`; `Catalogo.test.jsx` cobre as transições de mesma letra,
mudança de letra e as pontas com FWC/COC; `docs/interface.md` § Corpo e
§ Medidas descrevem a regra.

## Discovery
- Código: `Catalogo.jsx` memoiza `estruturada` com `ordenarPorSigla(secoes)`
  quando `ordenacao !== 'pagina'` (`Catalogo.jsx:42-45`) e mapeia cada item
  envolto num `<div key={secao.sigla} ref=...>` sem classe
  (`Catalogo.jsx:296-312`); `.catalogo` é flex column com
  `gap: var(--section-gap)` de 8px (`Catalogo.css:3-8`, `theme.css:238`).
  `ordenarPorSigla` devolve FWC primeiro, seleções A→Z e COC por último
  (`catalogoOrdenacoes.js:20-26`); `letraMudou` ainda não existe. Na
  ordenação por página as seções de ponta também passam pelo mesmo `<div>`,
  mas via `ordenarPorPagina`, com super-grupos no meio
  (`Catalogo.jsx:314-342`). Testes existentes em `Catalogo.test.jsx` usam
  `secoesParcial = [FWC, BRA, COC]` e consultam botões por nome acessível;
  não há teste de espaçamento entre seções. `Secao`/`SuperGrupo` são
  memoizados (TDR 0021): a mudança de classe fica no contêiner, sem tocar
  nas props de `Secao`, preservando a memoização. Comportamento atual
  confere com a tarefa: 8px uniformes na ordenação por sigla.
- Documentação: lido o IDR 0067 inteiro (decisão +2px por mudança de letra,
  com FWC/COC incluídos nas pontas, só na ordenação por sigla) e os trechos
  de `interface.md` § Corpo (228-270) e § Medidas (1070-1081) já
  atualizados pelas Tarefas 0034-0001/0002. As referências bastaram.

## Plano da alteração
1. `src/data/catalogoOrdenacoes.js`: função pura `letraMudou(secoes, indice)`
   que compara a primeira letra de `secoes[indice].sigla` com a de
   `secoes[indice - 1]`, devolvendo `false` no índice 0 e fora da faixa.
2. `src/components/Catalogo.jsx`: no `map` de `estruturada`, quando
   `ordenacao !== 'pagina'`, marcar o `<div>` da seção com
   `catalogo__secao` e a modificadora `catalogo__secao--respiro-letra`
   conforme `letraMudou(estruturada, indice)`.
3. `src/components/Catalogo.css`: `.catalogo__secao` base e
   `.catalogo__secao--respiro-letra { margin-top: 2px }`, somando ao `gap`.
4. `src/components/Catalogo.test.jsx`: fixture `[FWC, ARG, AUS, AUT, BEL, COC]`
   cobrindo FWC→ARG (muda), ARG→AUS (não muda), AUT→BEL (muda) e
   BEL→COC (muda); asserta a classe no contêiner de cada seção; teste de que
   a ordenação por página não gera a classe.
5. `docs/interface.md` § Corpo e § Medidas: descrever o respiro condicional
   por letra na ordenação por sigla, citando o IDR 0067.
- Verificação prevista: critérios por teste em `Catalogo.test.jsx` (classe
  no contêiner) e por trecho/busca do IDR 0067 em `docs/interface.md`.
- Riscos: baixo — a mudança é local ao contêiner da seção; a margem soma ao
  `gap` do flex, sem tocar no cartão nem na memoização de `Secao`.
- Desvios: nenhum.

## Decisões tomadas
- Aplicar o respiro no contêiner da seção (o `<div>` que já envolve cada
  `Secao`), via modificadora `catalogo__secao--respiro-letra` com
  `margin-top: 2px` somada ao `gap` do flex — decisão de nível 1
  (estrutura interna/ CSS), sem registro; mantém as props de `Secao`
  inalteradas e a memoização intacta.
- Comparar as letras sobre a sequência de `ordenarPorSigla`, não sobre os
  cartões visíveis do filtro — segue o texto da tarefa e do IDR 0067
  ("seção imediatamente anterior na sequência"), diferente da regra de
  IDR 0069 para os cartões; sem registro por ser o comportamento já
  decidido.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — sem avisos (`oxlint`, saída vazia).
- `npm run test` — `Test Files 50 passed (50)`, `Tests 668 passed (668)`.
- `npm run build` — `vite build`, `✓ built in 740ms`. Único aviso,
  pré-existente (registrado nas Tarefas 0017-0001, 0023-0001, 0029-0001,
  0034-0001 e 0034-0002):
  `(!) Some chunks are larger than 500 kB after minification.`
- Verificação visual: pendente — sem navegador nesta execução. Roteiro em
  `npm run dev`: na ordenação por sigla, conferir o respiro maior antes de
  Argentina (depois do FWC) e da Bélgica (depois da Áustria), os 8px
  uniformes entre Argentina/Austrália/Áustria e o respiro antes da
  Coca-Cola; alternar para a ordenação por página e conferir que os
  espaçamentos não mudam.

## Critérios de aceite
- [x] Entre duas seções com a mesma letra inicial de sigla, o respiro
      continua 8px — teste "não aplica respiro entre seções com a mesma
      letra inicial" (`Catalogo.test.jsx`), Austrália e Áustria sem
      `catalogo__secao--respiro-letra`.
- [x] Entre duas seções com letras diferentes, o respiro é 10px — teste
      "aplica respiro quando a letra inicial muda" (`Catalogo.test.jsx`),
      Argentina e Bélgica com a classe; CSS define `margin-top: 2px` sobre
      os 8px do `gap` (`Catalogo.css:10-13`).
- [x] As fronteiras FWC→primeira seleção e última seleção→COC têm o respiro
      maior — teste "aplica respiro nas fronteiras com FWC e COC, sem
      exceção nas pontas" (`Catalogo.test.jsx`), Argentina e Coca-Cola com
      a classe.
- [x] Ordenação por página (super-grupos) não muda — teste "não aplica
      respiro na ordenação por página" (`Catalogo.test.jsx`); testes
      existentes de ordenação por página seguem passando.
- [x] `docs/interface.md` § Corpo e § Medidas descrevem a regra e citam o
      IDR 0067 — bullets do § Corpo e o item "Espaçamentos internos" do
      § Medidas.

## Arquivos alterados
- `src/data/catalogoOrdenacoes.js` — função pura `letraMudou`
- `src/components/Catalogo.jsx` — classe de respiro no contêiner da seção
- `src/components/Catalogo.css` — `.catalogo__secao--respiro-letra`
- `src/components/Catalogo.test.jsx` — testes do respiro por letra
- `docs/interface.md` — § Corpo e § Medidas descrevem a regra
- `docs/plano/0034-refinamentos-visuais-do-catalogo/0003-aplica-respiro-por-letra-na-ordenacao-por-codigo.md` — status
- `docs/plano/README.md` — status da tarefa
