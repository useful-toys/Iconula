<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0002-0004: seção em lista e contagem em memória

## Data
2026-09-10

## Resumo
Fechada a fatia vertical: o catálogo inteiro entra em tela na disposição
lista, com as 50 seções ordenadas por sigla (FWC primeiro, Coca-Cola por
último) e a contagem ajustável em memória.

Criados:
- `src/lib/colecao.js` — funções puras para o mapa esparso de contagens,
  incluindo `ajustarContagem` que limita em 0/99 e remove a chave ao
  chegar em 0.
- `src/lib/colecao.test.js` — testes da lógica de ajuste.
- `src/lib/bandeira.js` — utilitário para renderizar emoji de bandeira/ícone
  como `<img>` do SVG Twemoji vendorizado, reaproveitando a lógica do
  componente de botão (que será removido na Tarefa 0002-0005).
- `src/components/Secao.jsx` e `Secao.css` — cabeçalho de seção com ícone,
  nome, sigla, número da página (omitido quando não existe) e resumo em
  notação compacta; grade de figurinhas em lista.
- `src/components/Secao.test.jsx` — testes do cabeçalho e da grade.
- `src/components/Catalogo.jsx` e `Catalogo.css` — corpo que percorre o
  catálogo na ordenação por sigla e renderiza as seções.
- `src/components/Catalogo.test.jsx` — testes com subconjunto do catálogo
  para não onerar o jsdom.

Modificados:
- `src/lib/progresso.js` — agora calcula o placar sobre um conjunto de
  códigos informado, permitindo reuso no placar geral e no resumo de cada
  seção.
- `src/lib/progresso.test.js` — atualizado para passar o universo de
  códigos explicitamente.
- `src/App.jsx` — passa a manter o estado da coleção (mapa esparso) e a
  renderizar `Cabecalho` + `Catalogo`, além do botão provisório (que sai
  na Tarefa 0002-0005).
- `src/App.test.jsx` — mocka `Catalogo` para manter os testes do botão
  rápidos; o catálogo é coberto pelos testes próprios.
- `src/App.css` — adiciona `.app__conteudo` para acomodar cabeçalho e
  catálogo enquanto o botão provisório ainda está na tela.

Registrado TDR 0014 sobre prop-drilling versus Context para o estado da
coleção: mantido por prop-drilling nesta fase, com reavaliação na
Tarefa 0006-0003 se a profundidade passar de três níveis.

## Decisões tomadas
- TDR 0014: estado da coleção sem Context por enquanto (prop-drilling).

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 13 arquivos de teste, 90 testes passando.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`: rolar do topo ao fim passa pelas 50
seções sem barra de rolagem interna; ajustar figurinhas do Brasil atualiza
o resumo da seção e o placar do cabeçalho; recarregar a página zera a
coleção — comportamento esperado até a Fase 6.

## Arquivos alterados
- `src/lib/colecao.js` — criado
- `src/lib/colecao.test.js` — criado
- `src/lib/bandeira.js` — criado
- `src/lib/progresso.js` — modificado
- `src/lib/progresso.test.js` — modificado
- `src/components/Secao.jsx` — criado
- `src/components/Secao.css` — criado
- `src/components/Secao.test.jsx` — criado
- `src/components/Catalogo.jsx` — criado
- `src/components/Catalogo.css` — criado
- `src/components/Catalogo.test.jsx` — criado
- `src/App.jsx` — modificado
- `src/App.test.jsx` — modificado
- `src/App.css` — modificado
- `docs/tdr/0014-estado-da-colecao-sem-context.md` — criado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/0004-secao-em-lista-e-contagem-em-memoria.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002-0004 atualizado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0004-log-secao-em-lista-e-contagem-em-memoria.md` — este log
