<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0006-0002: filtro de coladas

## Data
2026-09-10

## Resumo
Acrescentado `coladas` (contagem ≥ 1) como quarto valor do filtro de status,
entre `faltantes` e `repetidas`, conforme o
[IDR 0033](../../idr/0033-filtro-de-coladas.md). A lacuna observada em uso era a
consulta "o que eu já colei", que não tinha vista própria.

- `src/lib/colecao.js`: `filtraFigurinha` ganhou o ramo `coladas`
  (`contagem >= 1`); o tipo do parâmetro no JSDoc passou a listar os quatro
  valores. O predicado continua sendo a fonte única do filtro.
- `src/lib/preferenciasDeVista.js`: `coladas` entrou no domínio válido de
  `filtro`; o padrão continua `todas` e valor desconhecido continua caindo para
  o padrão sem erro (IDR 0026).
- `src/components/Controles.jsx`: quarto item `Col.` no grupo segmentado, entre
  `Falt.` e `Rep.`, com nome acessível "mostrar apenas as figurinhas coladas";
  JSDoc de `filtro`/`onTrocarFiltro` atualizado.
- `src/components/Catalogo.jsx`, `Secao.jsx` e `SuperGrupo.jsx`: apenas o tipo do
  filtro no JSDoc; a lógica de ocultar seções e super-grupos vazios, o salto com
  filtro ativo e a persistência já eram genéricas e funcionaram com o valor novo
  sem caso especial — não havia lista de valores duplicada a derivar de uma fonte
  só (todos consomem `filtraFigurinha`).

`docs/interface.md` § Controles já descrevia `Todas | Falt. | Col. | Rep.` e a
sobreposição deliberada entre coladas e repetidas (revisão de planejamento da
Fase 6); não precisou mudar.

## Decisões tomadas
Nenhuma. Quatro valores, ordem dos segmentos e sobreposição deliberada já estavam
registrados no IDR 0033. Não surgiu ambiguidade que exigisse TDR/IDR novo.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.` (39 arquivos, 105 regras).
- `vitest run`: **16 arquivos de teste, 148 testes, todos passando** — com
  cobertura nova em `colecao.test.js` (predicado `coladas`),
  `preferenciasDeVista.test.js` (restauração de `coladas`),
  `Controles.test.jsx` (segmento `Col.`, `aria-pressed`, callback),
  `Catalogo.test.jsx` (mostra 1 e ≥ 2 e esconde 0; `Rep.` como subconjunto;
  seção e super-grupo sem colada somem inteiros; resumo numérico não muda) e
  `App.test.jsx` (o placar do título não muda ao filtrar).
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

### Verificação visual
A verificação visual em `npm run dev` não pôde ser executada neste ambiente
automatizado (sem navegador). O comportamento foi coberto por teste de
renderização:
- `Col.` mostra exatamente as figurinhas com contagem ≥ 1 (verdes e laranjas) e
  esconde as cinzas.
- `Rep.` mostra um subconjunto do que `Col.` mostrou, confirmando a sobreposição
  deliberada.
- A quebra da linha de controles em largura de celular é CSS já previsto
  (`interface.md` § Controles: os grupos fluem e quebram, os dois comandos da
  direita ficam colados à direita); não foi medida em navegador real.

## Arquivos alterados
- `src/lib/colecao.js` — ramo `coladas` no predicado e tipo no JSDoc
- `src/lib/colecao.test.js` — casos de `coladas`
- `src/lib/preferenciasDeVista.js` — `coladas` no domínio do filtro
- `src/lib/preferenciasDeVista.test.js` — restauração de `coladas`
- `src/components/Controles.jsx` — segmento `Col.` e tipos no JSDoc
- `src/components/Controles.test.jsx` — presença, `aria-pressed` e callback de `Col.`
- `src/components/Catalogo.jsx`, `Secao.jsx`, `SuperGrupo.jsx` — tipo do filtro no JSDoc
- `src/components/Catalogo.test.jsx` — casos de `coladas`
- `src/App.test.jsx` — placar do título não muda ao filtrar (arquivo fora da lista
  de "Arquivos impactados", incluído porque é o único que renderiza o placar do
  título exigido no critério de aceite)
- `docs/plano/0006-ajuste-de-rota/0002-filtro-de-coladas.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0002 atualizado
- `docs/plano/0006-ajuste-de-rota/0002-filtro-de-coladas.md` e este log
