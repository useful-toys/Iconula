<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0001: Estrutura inicial do projeto

## Status

Aceito

## Contexto

Definir onde ficam os dados dos times e o componente do botão dentro do
scaffold do Vite+React (ver [ADR 0001](../adr/0001-stack-vite-react.md)).

## Decisão

- `src/data/teams.js`: array `teams` com os 48 times (`{ name, flag }`) e
  `sortedTeams`, derivado por `localeCompare` como salvaguarda contra
  edições futuras fora de ordem. É a única fonte de dados dos times;
  qualquer alteração na lista (nomes, bandeiras) acontece só neste
  arquivo.
- `src/components/TeamButton.jsx`: componente apresentacional puro,
  recebe `{ team, onClick }` e não conhece a lista completa nem a lógica
  de avanço — só renderiza o time atual.
- `src/App.jsx`: dono do estado (`useState` do índice atual) e da lógica
  de avanço com wrap-around (`(index + 1) % sortedTeams.length`), usando
  `sortedTeams` importado de `data/teams.js`.

## Consequências

- Adicionar um novo "cartão"/tela na SPA futura significa criar um novo
  componente em `src/components/` e, se precisar de dados próprios, um
  novo arquivo em `src/data/` — sem tocar na estrutura existente.
- Testes (`src/App.test.jsx`) importam `sortedTeams` de `data/teams.js`
  para não duplicar a lógica de ordenação no teste.
- `sortedTeams` é exportado de `data/teams.js` (não de `App.jsx`) para não
  quebrar o Fast Refresh do Vite, que exige que um arquivo de componente
  só exporte componentes.
