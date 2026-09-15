<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0022-0002: paisagens do FWC e `nomeCurto` no catálogo

## Data
2026-09-15

## Resumo
Antes: `paisagem` era verdadeiro só na `13` das seleções; o FWC inteiro era
retrato e a figurinha não tinha `nomeCurto`. Depois: as 15 posições paisagem
do FWC (`FWC00`–`FWC03` e `FWC09`–`FWC19`) também são paisagem, o catálogo
expõe `nomeCurto` — o rótulo de uma linha, com os 15 textos do MDR 0008 — e as
invariantes travam o dado.

- `src/data/jogadores.js`: nova exportação `nomesCurtosFWC`, os 15 rótulos
  chaveados pelos dois dígitos da posição do código; o comentário de cabeçalho
  passa a descrever as quatro exportações.
- `src/data/catalogo.js`: `POSICOES_PAISAGEM_FWC` (conjunto de posições) ao
  lado dos rótulos fixos das seleções; `paisagem` cobre também o FWC;
  `nomeDaFigurinha` emite `nomeCurto` (texto nas paisagens do FWC, `null` nas
  demais); comentários de cabeçalho, de `nomeDaFigurinha` e de
  `expandirFigurinhas` citam o campo e o MDR 0006/MDR 0008.
- `src/data/catalogo.test.js`: o teste "especiais não têm metalizada nem
  paisagem" se divide entre FWC (paisagem exatamente nas 15 posições) e COC
  (sem nenhuma); total de 63 paisagens; `nomeCurto` exatamente nas 15
  paisagens do FWC, `null` em `BRA13`/`FWC04`/`COC01`; `nome` completo
  preservado.
- `src/data/jogadores.test.js`: 15 nomes curtos, nas posições esperadas, não
  vazios e com até 14 caracteres.
- `docs/modelo-memoria.md` § Catálogo estático: `nomeCurto` na lista de campos
  de `figurinhas` e linha nova das paisagens do FWC, citando os MDRs 0006 e
  0008.
- `AGENTS.md` § Onde fica cada coisa: a linha de `src/data/jogadores.js` passa
  a mencionar os nomes curtos das paisagens do FWC.

Divergências: nenhuma — o código, os MDRs 0006/0008 e a tarefa concordam.

## Discovery
- Código: `expandirFigurinhas` (`src/data/catalogo.js:198`) marca
  `paisagem: secao.tipo === "selecao" && posicao === 13`; `nomeDaFigurinha`
  (`catalogo.js:171`) devolve `{nome, nomeLinhas}` das três exportações de
  `jogadores.js`. O FWC usa `inicio: 0`, então `posicao` vai de 0 a 19 e o
  código é `FWC` + `String(posicao).padStart(2, "0")`. `jogadores.js` tem três
  exportações (`jogadoresPorSelecao`, `jogadoresFWC`, `jogadoresCOC`) e é
  importado só por `catalogo.js` e `jogadores.test.js` — nenhum componente
  (`grep` em `src/components/` não encontra `jogadores`). Testes da área:
  `catalogo.test.js` (describes "invariantes do catálogo", "expandirFigurinhas"
  e "nomes das figurinhas") e `jogadores.test.js` ("invariantes dos
  jogadores"). Comportamento atual confere com a tarefa. Impacto não citado:
  nenhum; nenhum outro teste afirma `paisagem` do FWC.
- Documentação: as referências bastaram; confirmei no MDR 0006 § Decisão
  ("Paisagem no FWC" e "Estrutura de cada figurinha") e no MDR 0008 § Decisão
  ("Campos no catálogo" e "Invariantes") os 15 textos curtos exatos e a regra
  de `nomeCurto` `null` nas demais 979 figurinhas.

## Plano da alteração
1. `src/data/jogadores.js` — exportar `nomesCurtosFWC` (objeto com os 15
   rótulos, chave = dois dígitos da posição) e atualizar o comentário de
   cabeçalho para quatro exportações.
2. `src/data/catalogo.js` — importar `nomesCurtosFWC`; criar
   `POSICOES_PAISAGEM_FWC` (Set dos dígitos `00`–`03` e `09`–`19`) perto dos
   rótulos fixos; marcar `paisagem` também no FWC; emitir `nomeCurto` em
   `nomeDaFigurinha`; atualizar comentários.
3. `src/data/catalogo.test.js` — dividir o teste dos especiais; total de 63
   paisagens; testes de `nomeCurto` e do `nome` completo do FWC.
4. `src/data/jogadores.test.js` — invariantes dos 15 nomes curtos.
5. `docs/modelo-memoria.md` § Catálogo estático — `nomeCurto` nos campos de
   `figurinhas` e linha das paisagens do FWC, citando os MDRs 0006/0008.
6. `AGENTS.md` § Onde fica cada coisa — linha de `src/data/jogadores.js`.
7. Status: tarefa e README (`Em andamento` → `Concluída`).
- Verificação prevista: critérios por teste (`npm run test`: 63 paisagens,
  `nomeCurto` nas 15 posições, `nome` preservado, nomes curtos ≤ 14), por
  busca (`grep jogadores src/components`) e por trecho (`catalogo.js`,
  `modelo-memoria.md`, `AGENTS.md`).
- Riscos: a chave dos nomes curtos precisa casar com o `padStart(2, "0")` do
  código; os testes de posição pegam divergência entre `POSICOES_PAISAGEM_FWC`
  e `nomesCurtosFWC`.
- Desvios: nenhum até aqui.

## Decisões tomadas
- Exportação `nomesCurtosFWC` chaveada pelos dois dígitos da posição (`"00"`…
  `"19"`), em vez de pelo código `FWCnn` ou por número — casa com a notação
  `00–03`/`09–19` da tarefa e com a MDR, sem depender da sigla da seção; a
  constante chama-se `POSICOES_PAISAGEM_FWC`. Nível 1, sem registro (previsto
  em "Decisões em aberto nesta tarefa").
- `nomeCurto` é emitido por `nomeDaFigurinha`, junto de `nome`/`nomeLinhas` —
  mantém os três campos de nome derivados no mesmo ponto. Nível 1.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (79 arquivos).
- `npm run test` → `Test Files 41 passed (41)`, `Tests 496 passed (496)`
  (eram 489; +7 desta tarefa: 3 em `catalogo.test.js` — total de paisagens,
  `nomeCurto` nas 15 posições, `nome` completo —, 2 em `jogadores.test.js` e
  os testes divididos dos especiais; nenhum aviso novo).
- `npm run build` → `✓ 136 modules transformed`, `✓ built in 453ms`; único
  aviso, pré-existente e documentado (chunk `index.esm` > 500 kB, TDR 0021).
- `test:rules` não se aplica (não tocou `firestore.rules`).
- `git diff --name-only`/`git status --short` → só os 4 arquivos de `src/data/`,
  `AGENTS.md`, `docs/modelo-memoria.md`, arquivo da tarefa, `docs/plano/README.md`
  e o log (novo); nenhum componente, CSS ou registro de decisão.
- Busca `jogadores` em `src/components/` → 0 ocorrências.

## Critérios de aceite
- [x] `paisagem` verdadeiro exatamente na `13` das 48 seleções e em
  `FWC00`–`FWC03`/`FWC09`–`FWC19`; 63 no total — testes "tem 63 paisagens no
  total" e "o FWC não tem metalizada e marca paisagem em FWC00–FWC03 e
  FWC09–FWC19" (`catalogo.test.js`).
- [x] COC sem paisagem; metalizada só na `01` das seleções — testes "a
  Coca-Cola não tem metalizada nem paisagem" e "marca a posição 01 como
  metalizada e 13 como paisagem" (`catalogo.test.js`).
- [x] `nomeCurto` com os 15 textos do MDR 0008 nas paisagens do FWC e `null`
  nas outras 979 — testes "nomeCurto preenchido exatamente nas 15 paisagens do
  FWC" e "nomeCurto traz o rótulo do MDR 0008 e null fora das paisagens do
  FWC" (`catalogo.test.js`).
- [x] `nome` do FWC inalterado — teste "nome do FWC continua o completo, sem
  trocar pelo curto" (`FWC00` e `FWC10`).
- [x] Nomes curtos não vazios e com até 14 caracteres — teste "nomes curtos
  não vazios e com até 14 caracteres" (`jogadores.test.js`).
- [x] Nenhum arquivo de `src/components/` importa `jogadores.js` — busca
  (0 ocorrências).
- [x] `docs/modelo-memoria.md` § Catálogo estático e `AGENTS.md` atualizados,
  citando os MDRs 0006 e 0008 — `modelo-memoria.md:131,133,134` (campos e
  paisagens do FWC) e `AGENTS.md:66`.

## Arquivos alterados
- `src/data/jogadores.js` — exportação `nomesCurtosFWC` (15 rótulos por
  posição); comentário de cabeçalho com as quatro exportações.
- `src/data/catalogo.js` — `POSICOES_PAISAGEM_FWC`; `paisagem` também no FWC;
  `nomeCurto` em `nomeDaFigurinha`; comentários atualizados.
- `src/data/catalogo.test.js` — testes dos especiais divididos, total de 63
  paisagens e invariantes de `nomeCurto`/`nome` do FWC.
- `src/data/jogadores.test.js` — invariantes dos 15 nomes curtos.
- `docs/modelo-memoria.md` — § Catálogo estático: `nomeCurto` nos campos de
  `figurinhas` e linha das paisagens do FWC.
- `AGENTS.md` — § Onde fica cada coisa: linha de `src/data/jogadores.js`.
- `docs/plano/0022-proporcao-e-nome-das-figurinhas-paisagem/0002-…md` — status
  `Concluída`.
- `docs/plano/README.md` — tarefa 0002 `Concluída`.
- `docs/plano/0022-…/logs/0002-log-paisagens-do-fwc-e-nome-curto.md` — novo.
