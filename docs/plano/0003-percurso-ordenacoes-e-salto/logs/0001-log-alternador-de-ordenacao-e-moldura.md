<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0003-0001: alternador de ordenação e moldura do catálogo

## Data
2026-09-10

## Resumo
Criada a linha de controles logo abaixo do cabeçalho, com o primeiro grupo
segmentado (`Página` | `Sigla`) que alterna entre as duas ordenações do
catálogo. A área à direita da linha foi reservada para os comandos de
desfazer e menu que chegam na Fase 9 — enquanto não existem, o espaço fica
vazio, sem empurrar os alternadores.

O `Catalogo.jsx` passou a receber a ordenação vigente por prop e usa as
derivações da Tarefa 0001-0003 (`ordenarPorSigla`, `ordenarPorPagina`,
`extrairSecoes`) para determinar a sequência de seções. A moldura é a mesma
nas duas ordenações: FWC abre e Coca-Cola fecha (IDR 0028), coberto por
teste em ambas as ordenações.

O estado da ordenação vive no `App.jsx` como `useState('pagina')`, com a
ordem do álbum como valor padrão provisoriamente (TDR 0015). A persistência
da preferência no `localStorage` fica para a Tarefa 0004-0005.

## Decisões tomadas
- **Ordenação padrão provisória**: ordem do álbum (`'pagina'`), registrada
  em [TDR 0015](../../../tdr/0015-ordenacao-padrao-provisoria-ordem-do-album.md).
  A escolha definitiva é a Tarefa 0010-0003, por faixa de tela.
- **Super-grupos fora do escopo**: na ordenação por página, as seções são
  extraídas com `extrairSecoes` e renderizadas sem os cabeçalhos de
  super-grupo — a Tarefa 0003-0002 cuida disso.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 31 arquivos.
- `vitest run`: 12 arquivos de teste, 76 testes, todos passando (incluindo
  os 4 novos do `Controles.test.jsx` e o novo teste de ordenação por página
  no `Catalogo.test.jsx`).
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

## Arquivos alterados
- `src/components/Controles.jsx` — criar
- `src/components/Controles.css` — criar
- `src/components/Controles.test.jsx` — criar
- `src/components/Catalogo.jsx` — modificar (aceita prop `ordenacao`)
- `src/components/Catalogo.test.jsx` — modificar (adiciona teste da ordenação por página)
- `src/App.jsx` — modificar (estado da ordenação, renderiza `Controles`)
- `docs/tdr/0015-ordenacao-padrao-provisoria-ordem-do-album.md` — criar
- `docs/plano/0003-percurso-ordenacoes-e-salto/0001-alternador-de-ordenacao-e-moldura.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0001 da Fase 3 atualizado
- `docs/plano/0003-percurso-ordenacoes-e-salto/logs/0001-log-alternador-de-ordenacao-e-moldura.md` — este log
