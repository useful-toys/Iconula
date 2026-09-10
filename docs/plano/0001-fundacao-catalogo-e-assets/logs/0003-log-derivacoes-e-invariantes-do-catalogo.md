<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0001-0003: derivações e invariantes do catálogo

## Data
2026-09-09

## Resumo
Criados os módulos de derivação do catálogo e os testes de invariantes que
validam o dado contra as especificações de `requisitos.md`, IDR 0005, IDR 0009,
IDR 0019, IDR 0023 e IDR 0028.

**Arquivos criados:**

- `src/data/catalogoOrdenacoes.js` — duas funções puras de ordenação:
  `ordenarPorSigla` (FWC, 48 seleções alfabéticas, COC) e `ordenarPorPagina`
  (FWC, 12 super-grupos A–L com 4 seleções cada na ordem das páginas, COC),
  mais `extrairSecoes` para extrair as 50 seções de qualquer estrutura.
- `src/data/catalogoLayout.js` — `layoutDeSecao(secao)` devolve as posições
  explícitas de linha/coluna/trilha para a disposição álbum: 20 posições para
  seleções (4 trilhas por página, 13 em paisagem), 14 para Coca-Cola (3 trilhas
  por página), `null` para FWC.
- `src/data/catalogo.test.js` — 26 testes cobrindo os oito invariantes do
  passo 6 da tarefa (994 códigos, 50 seções, 20 por seleção, 20 FWC/14 COC,
  sem duplicatas, formato do código, grupos A–L, páginas distintas sem 56–57),
  mais as propriedades das ordenações (FWC primeira, COC última, mesmas 50
  seções nas duas, 12 super-grupos A–L) e do layout (posições específicas de
  01–02, 13, 18–20; 6+8 na Coca-Cola; 13–14 na linha 3; cobertura completa).
- `docs/tdr/0012-derivacoes-do-catalogo-em-src-data.md` — registra a decisão
  de colocar as derivações em `src/data/` (propriedades do dado) e não em
  `src/lib/` (utilitários de infraestrutura).

Nenhum arquivo existente foi modificado. O catálogo (`catalogo.js`) continua
sendo a única fonte do dado; as derivações o consomem sem alterá-lo.

## Decisões tomadas
- **Derivações em `src/data/`** (TDR 0012): as funções de ordenação e layout
  são propriedades do dado, não têm efeito colateral, não acessam rede —
  coesão por proximidade com o catálogo que derivam. `src/lib/` fica reservado
  para utilitários com dependências externas.
- **Estrutura de retorno de `ordenarPorPagina`**: array de itens com
  `{ tipo: "secao", secao }` para FWC/COC e `{ tipo: "super-grupo", grupo, secoes }`
  para os 12 grupos. A função `extrairSecoes` normaliza qualquer estrutura para
  um array flat de 50 seções, facilitando os testes de invariante.
- **Layout como array de posições explícitas**: cada figurinha tem
  `{ posicao, pagina, linha, trilha, trilhas }` — a UI consome diretamente,
  sem calcular alinhamento. A posição 13 de seleção tem `trilhas: 2` (paisagem);
  todas as outras têm `trilhas: 1`.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 21 arquivos.
- `vitest run`: 7 arquivos de teste, 55 testes (26 novos em `catalogo.test.js`),
  todos passando.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

## Arquivos alterados
- `src/data/catalogoOrdenacoes.js` — criar
- `src/data/catalogoLayout.js` — criar
- `src/data/catalogo.test.js` — criar
- `docs/tdr/0012-derivacoes-do-catalogo-em-src-data.md` — criar
- `docs/plano/0001-fundacao-catalogo-e-assets/0003-derivacoes-e-invariantes-do-catalogo.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0003 atualizado
- `docs/plano/0001-fundacao-catalogo-e-assets/logs/0003-log-derivacoes-e-invariantes-do-catalogo.md` — este log
