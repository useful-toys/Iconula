<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0012: Derivações do catálogo em `src/data/`

## Status

Aceito

## Contexto

A Tarefa 0001-0003 (`docs/plano/0001-fundacao-catalogo-e-assets/0003-derivacoes-e-invariantes-do-catalogo.md`)
deixou em aberto onde as derivações do catálogo moram: `src/data/` (junto
do catálogo) ou `src/lib/` (camada utilitária). A tarefa mesma sugere
`src/data/`, "porque são propriedades do dado e não têm efeito colateral".

As derivações são:

- **Ordenações**: `ordenarPorSigla` e `ordenarPorPagina` — transformam o
  array de seções em estruturas prontas para a tela.
- **Layout de álbum**: `layoutDeSecao` — devolve as posições explícitas
  de linha/coluna para a disposição "como no álbum" (IDR 0009, IDR 0023).

## Decisão

As derivações do catálogo ficam em `src/data/`, não em `src/lib/`.

- `src/data/catalogoOrdenacoes.js` — ordenações e agrupamento em super-grupos.
- `src/data/catalogoLayout.js` — layout de álbum das seções.
- `src/data/catalogo.test.js` — testes de invariantes.

A razão é que essas funções são propriedades do dado: operam sobre
`secoes` e `figurinhas`, não têm efeito colateral, não acessam rede, não
dependem de contexto de execução. `src/lib/` é para utilitários de
infraestrutura (Firebase, preferências, etc.); derivações de dado
pertencem junto do dado que derivam.

## Consequências

- Quem importar `ordenarPorSigla`, `ordenarPorPagina` ou `layoutDeSecao`
  importa de `src/data/`, no mesmo diretório de `catalogo.js` — coesão
  por proximidade.
- `src/lib/` continua reservado para utilitários com dependências
  externas ou efeito colateral (Firebase, localStorage, etc.).
- Se no futuro uma derivação passar a depender de contexto (ex.:
  preferências do usuário), ela migra para `src/lib/` — a regra é clara
  e a mudança é localizada.

## Alternativas consideradas

- **Tudo em `src/lib/`**: separaria dado de derivação, mas quebraria a
  coesão — as derivações são tão "dado" quanto o catálogo que derivam.
- **Tudo em `catalogo.js`** (um arquivo só): possível, mas o arquivo
  cresceria para além de 300 linhas e misturaria responsabilidades
  (dado, ordenação, layout) — preferível separar por preocupação.
