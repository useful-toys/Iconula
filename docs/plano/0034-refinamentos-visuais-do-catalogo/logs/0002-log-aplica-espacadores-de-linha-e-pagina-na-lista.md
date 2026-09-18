<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0034-0002: Aplica espaçadores de linha e página na lista

## Data
2026-09-18

## Resumo
Na disposição lista, os cartões de uma seção de seleção ou da Coca-Cola
ganham respiro extra nas fronteiras que o layout do álbum já descreve:
+2px nas quebras de linha dentro da mesma página e +4px nas quebras de
página, sobre os 8px de `--card-gap-list`. O FWC continua uniforme. A
grade (`secao__grade`) passa a envolver cada cartão num item
(`secao__item`) que recebe a classe de respiro conforme a fronteira com o
próximo cartão **visível** (pós-filtro), derivada de
`layoutDeSecao(secao).posicoes` (IDR 0069). `docs/interface.md` § Corpo e
§ Medidas descrevem a regra.

## Discovery
- Código: `Secao.jsx` renderiza `listaFiltrada` direto em
  `.secao__grade` (`Secao.jsx:192-212`); `listaFiltrada` já aplica o
  filtro de status (`Secao.jsx:166-168`). `layoutDeSecao(secao)`
  (`catalogoLayout.js:177-181`) devolve `posicoes` com `posicao`,
  `pagina`, `linha`; as figurinhas do catálogo já trazem `posicao`
  (`catalogo.js:244-254`). As fixtures de teste de seleção/COC já
  incluem `posicao` (`Secao.test.jsx:312-317`, `329-335`).
  `Secao` é memoizada por `propsEquivalentes` (`Secao.jsx:107-123`);
  `Figurinha` também (`Figurinha.jsx:28-41`). Comportamento atual
  confere com a tarefa: 8px uniformes, sem relação com linha/página.
  `Secao.css:343-351` é o único ponto do `gap`.
- Documentação: lido o IDR 0069 inteiro (decisão dos dois respiros,
  exclusão do FWC pelo salto de páginas 5-8, e interação com o filtro) e
  as linhas de `interface.md` § Corpo (268-270) e § Medidas (1070-1073)
  que hoje só fixam os 8px. As referências bastaram para o restante,
  porque `layoutDeSecao` e o filtro já estavam em uso no componente.

## Plano da alteração
1. `src/components/Secao.jsx`: calcular, só na lista e só quando
   `secao.tipo === 'selecao' || secao.sigla === 'COC'`, um mapa
   `posicao -> { pagina, linha }` a partir de `layoutDeSecao(secao)`;
   para cada cartão de `listaFiltrada`, comparar com o próximo visível
   (`prox.pagina !== atual.pagina` → médio; `prox.linha !== atual.linha`
   → pequeno; senão nada). Envolver cada `Figurinha` num
   `div.secao__item` com a classe de respiro — as props do `Figurinha`
   não mudam, preservando a memoização (Padrões da tarefa).
2. `src/components/Secao.css`: regras de `.secao__item` (item flex,
   `flex-shrink: 0`) e dos modificadores `--respiro-linha` (2px) e
   `--respiro-pagina` (4px) via `margin-inline-end`, mantendo o `gap`.
3. `src/components/Secao.test.jsx`: fixture de seleção com 20
   figurinhas e `posicao`; testes das fronteiras da seleção (2, 6, 10,
   13, 17), da Coca-Cola (3, 6, 9, 12), da ausência de respiro no FWC e
   da recalculação com filtro ocultando um cartão de fronteira.
4. `docs/interface.md` § Corpo e § Medidas: descrever os dois respiros,
   a condição (seleção/COC, FWC de fora) e a interação com o filtro,
   citando o IDR 0069.
- Verificação prevista: critérios por teste em `Secao.test.jsx`
  (classes `.secao__item--respiro-*` no item do código), e critério de
  documentação por trecho/busca do IDR 0069.
- Riscos: baixo — a mudança é local à lista; a memoização é preservada
  porque as props de `Figurinha` e de `Secao` não mudam de forma; o
  wrapper não altera as medidas do cartão (60×70 ou 70×60) nem o
  `align-items: center` da grade.
- Desvios: aplicado como wrapper `.secao__item` em vez de classe no
  próprio cartão (`Figurinha` não aceita `className` e não está nos
  "Arquivos impactados"); a tarefa admite "ou equivalente".

## Decisões tomadas
- Envolver o cartão num `div.secao__item` em vez de alterar
  `Figurinha.jsx` para receber a classe de respiro — estrutura interna,
  nível 1, sem registro; mantém o conjunto de arquivos previsto na
  tarefa e a memoização do cartão intacta.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` — sem avisos (`oxlint`, saída vazia).
- `npm run test` — `Test Files 50 passed (50)`, `Tests 664 passed (664)`.
- `npm run build` — `vite build`, `✓ built`. Único aviso, pré-existente
  (registrado nas Tarefas 0017-0001, 0023-0001, 0029-0001 e 0034-0001):
  `(!) Some chunks are larger than 500 kB after minification.`
- Verificação visual: pendente — sem navegador nesta execução. Roteiro em
  `npm run dev`: abrir uma seleção e a Coca-Cola na disposição lista e
  conferir os respiros nas fronteiras 2-3, 6-7, 10-11, 13-14 e 17-18
  (seleção) e 3-4, 6-7, 9-10 e 12-13 (Coca-Cola); alternar para o FWC e
  conferir o espaçamento uniforme.

## Critérios de aceite
- [x] Seção de seleção tem respiro pequeno em 2-3, 6-7, 13-14, 17-18 e
      médio em 10-11 na lista — teste "aplica os respiros do layout do
      álbum na lista da seleção" (`Secao.test.jsx`).
- [x] Coca-Cola tem respiro pequeno em 3-4, 9-10, 12-13 e médio em 6-7 —
      teste "aplica os respiros do layout do álbum na lista da
      Coca-Cola" (`Secao.test.jsx`).
- [x] FWC não ganha respiro extra na lista — teste "não aplica respiro
      extra no FWC" (`Secao.test.jsx`).
- [x] Com filtro ativo ocultando um cartão de fronteira, nenhum respiro
      extra sobra colado à borda — teste "recalcula as fronteiras sobre
      os cartões visíveis do filtro" (`Secao.test.jsx`).
- [x] `docs/interface.md` § Corpo e § Medidas descrevem a regra e citam
      o IDR 0069.

## Arquivos alterados
- `src/components/Secao.jsx` — item de respiro por fronteira na lista
- `src/components/Secao.css` — `.secao__item` e modificadores de respiro
- `src/components/Secao.test.jsx` — testes das fronteiras e do filtro
- `docs/interface.md` — § Corpo e § Medidas descrevem os respiros
- `docs/plano/0034-refinamentos-visuais-do-catalogo/0002-aplica-espacadores-de-linha-e-pagina-na-lista.md` — status
- `docs/plano/README.md` — status da tarefa
