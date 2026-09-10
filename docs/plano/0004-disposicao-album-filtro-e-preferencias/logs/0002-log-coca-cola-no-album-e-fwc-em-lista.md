<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0004-0002: Coca-Cola no álbum e Extras FIFA sempre em lista

## Data
2026-09-10

## Resumo
Completada a disposição álbum nas duas seções especiais: a Coca-Cola ganhou o
próprio spread de 3 trilhas, e os Extras FIFA seguem em lista contínua mesmo
com "Álbum" escolhido.

### O que foi feito

O comportamento já estava implementado corretamente na tarefa 0004-0001:

1. **Coca-Cola**: o `layoutDeSecao()` em `catalogoLayout.js` já retornava
   `layoutCocaCola()` para a sigla "COC", com 3 trilhas por página e as
   posições corretas (página 1: 01-06 em 2 linhas de 3; página 2: 07-12 nas
   linhas 1-2 e 13-14 nas duas primeiras posições da linha 3). O componente
   `PaginaDoAlbum.jsx` já determinava o número de trilhas com base na sigla
   da seção.

2. **FWC**: o `layoutDeSecao()` já retornava `null` para a sigla "FWC"
   (IDR 0023), fazendo com que a seção caia na lista contínua mesmo quando
   a disposição é álbum.

3. **Filtro**: o filtro de status ainda não foi implementado (Tarefa 0004-0004),
   mas a regra já está clara: o filtro pertence à disposição lista (IDR 0001),
   e quando a disposição é álbum, nenhuma seção é filtrada — nem a lista do FWC.

### Testes adicionados

Adicionados 3 testes em `Secao.test.jsx` para verificar o comportamento:

1. **Coca-Cola usa disposição álbum com 3 trilhas por página**: verifica que
   a COC tem 2 páginas, ambas com `grid-template-columns: repeat(3, 52px)`,
   6 células na página 1 e 8 na página 2, com 13 e 14 nas posições corretas
   da linha 3.

2. **FWC sempre usa lista contínua, mesmo na disposição álbum**: verifica que
   o FWC não tem páginas do álbum, tem a grade de lista e exibe todas as 20
   figurinhas.

3. **Seleções usam disposição álbum com 4 trilhas por página**: verifica que
   as seleções têm 2 páginas, ambas com `grid-template-columns: repeat(4, 52px)`.

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface foi tomada — todo o
comportamento já estava especificado nos IDRs 0001, 0009, 0023 e 0028.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 37 arquivos.
- `vitest run`: 15 arquivos de teste, 108 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (384.13 kB JS,
  8.53 kB CSS).

## Arquivos alterados
- `src/components/Secao.test.jsx` — 3 testes novos para disposição álbum
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/0002-coca-cola-no-album-e-fwc-em-lista.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002 atualizado
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0002-log-coca-cola-no-album-e-fwc-em-lista.md` — este log
