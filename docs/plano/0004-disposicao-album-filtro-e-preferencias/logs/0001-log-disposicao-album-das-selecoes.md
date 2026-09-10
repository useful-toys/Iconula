<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0004-0001: disposição álbum das seleções

## Data
2026-09-10

## Resumo
Entregue o segundo modo de visualização do catálogo: a disposição "como no
álbum", que reproduz a página física do álbum impresso com posições
explícitas de linha/coluna num grid de trilhas fixas (IDR 0009).

### O que foi feito

1. **Controles.jsx**: adicionado o segundo grupo segmentado `Lista | Álbum`,
   com nomes acessíveis por extenso ("disposição em lista contínua",
   "disposição como no álbum"). O grupo só aparece quando
   `onTrocarDisposicao` é fornecido, mantendo a retrocompatibilidade.

2. **App.jsx**: adicionado estado `disposicao` (padrão `'lista'`), repassado
   para `Controles` e `Catalogo`.

3. **Catalogo.jsx** e **SuperGrupo.jsx**: recebem `disposicao` e a repassam
   para cada `Secao`.

4. **Secao.jsx**: escolhe entre a lista contínua (comportamento existente)
   e a disposição álbum com base em `disposicao` e no resultado de
   `layoutDeSecao()`. O FWC sempre cai na lista (IDR 0023). Quando em
   álbum, agrupa as figurinhas por página e renderiza cada uma com
   `PaginaDoAlbum`.

5. **PaginaDoAlbum.jsx** (novo): componente que renderiza uma página do
   álbum como grid de trilhas fixas (4 para seleções, 3 para Coca-Cola),
   com posicionamento explícito via `grid-column` / `grid-row` a partir
   dos dados de `catalogoLayout.js`.

6. **Figurinha.jsx**: adicionada prop `paisagem` para a figurinha 13, que
   ocupa duas trilhas (110px de largura, mesma altura de 52px). O mesmo
   componente é reusado — sem segundo componente de cartão.

7. **CSS**: adicionadas classes `.figurinha--paisagem`, `.pagina-album`,
   `.secao__corpo`, `.secao__album`. As trilhas continuam com 52px em
   qualquer largura de tela; o spread usa `flex-wrap` para empilhar as
   páginas quando não cabem (Tarefa 0004-0003).

8. **Testes**: 6 testes novos para `PaginaDoAlbum` (posições de cada
   figurinha, grid de 4 trilhas para seleções, grid de 3 trilhas para
   Coca-Cola, alinhamento da figurinha 01 sobre a terceira posição).
   Controles.test.jsx expandido com 4 testes para o grupo de disposição.

### Decisão encaminhada
O cartão paisagem mantém o mesmo raio (5px) e a mesma espessura de borda
(2px) do retrato — é o mesmo cartão em outra proporção, conforme o
encaminhamento da tarefa. Sem registro novo.

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface foi tomada — todo
o comportamento já estava especificado nos IDRs 0005, 0008, 0009, 0015 e
0023 e em `interface.md`.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 37 arquivos.
- `vitest run`: 15 arquivos de teste, 105 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (384.13 kB JS,
  8.53 kB CSS).

## Arquivos alterados
- `src/components/Controles.jsx` — grupo segmentado de disposição
- `src/components/Controles.css` — sem alteração (reusa estilos existentes)
- `src/components/Controles.test.jsx` — 4 testes novos
- `src/components/PaginaDoAlbum.jsx` — criar
- `src/components/PaginaDoAlbum.css` — criar
- `src/components/PaginaDoAlbum.test.jsx` — criar (6 testes)
- `src/components/Secao.jsx` — escolha lista × álbum, corpo com wrapper
- `src/components/Secao.css` — estilos para `.secao__corpo` e `.secao__album`
- `src/components/Figurinha.jsx` — prop `paisagem`
- `src/components/Figurinha.css` — classe `.figurinha--paisagem`
- `src/components/Catalogo.jsx` — repassa `disposicao`
- `src/components/SuperGrupo.jsx` — repassa `disposicao`
- `src/App.jsx` — estado `disposicao`
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/0001-disposicao-album-das-selecoes.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0001 atualizado
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0001-log-disposicao-album-das-selecoes.md` — este log
