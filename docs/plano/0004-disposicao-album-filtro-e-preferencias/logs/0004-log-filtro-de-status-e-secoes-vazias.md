<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0004-0004: filtro de status e ocultação de seções vazias

## Data
2026-09-10

## Resumo
Entregue o filtro de status — todas, faltantes, repetidas — na disposição lista,
com as seções e super-grupos sem resultado desaparecendo da vista. Realiza em
tela as listas de faltantes e de repetidas exigidas por `requisitos.md`.

### O que foi feito

1. **`src/lib/colecao.js`**: adicionada a função pura `filtraFigurinha(colecao,
   codigo, filtro)` que retorna `true` para a figurinha conforme o filtro
   vigente: `todas` mostra tudo; `faltantes` mostra contagem 0; `repetidas`
   mostra contagem ≥ 2.

2. **`src/components/Controles.jsx`**: adicionado o terceiro grupo segmentado
   `Todas | Falt. | Rep.` com nomes acessíveis por extenso. O grupo só aparece
   quando a disposição é `lista` (IDR 0001, IDR 0023). Quando some, os
   comandos da direita não se movem.

3. **`src/App.jsx`**: adicionado estado `filtro` (padrão `'todas'`), repassado
   para `Controles` e `Catalogo`. Adicionado `onLimparFiltro` ao Catalogo.

4. **`src/components/Catalogo.jsx`**: filtra as seções e super-grupos conforme
   o filtro:
   - Seção sem nenhuma figurinha visível some inteira (IDR 0025)
   - Super-grupo sem nenhuma seção visível também some (IDR 0025)
   - Na disposição álbum, o filtro é ignorado (IDR 0001)
   - `saltarPara`: se a seção alvo está oculta pelo filtro, chama
     `onLimparFiltro()` para voltar o filtro para "todas" antes de rolar
     (IDR 0031). Como o rolar acontece num `setTimeout`, o tempo de 50ms é
     suficiente para o React re-renderizar após limpar o filtro e registrar o
     ref da seção.

5. **`src/components/Secao.jsx`**: na disposição lista, filtra as figurinhas
   da grade com `filtraFigurinha`. Na disposição álbum, não aplica filtro.

6. **`src/components/SuperGrupo.jsx`**: filtra as seções visíveis do grupo e
   repassa o filtro para cada `Secao`.

7. **Testes**:
   - `colecao.test.js`: 3 testes novos para `filtraFigurinha`
   - `Controles.test.jsx`: 4 testes novos para o grupo de filtro
   - `Catalogo.test.jsx`: 7 testes novos cobrindo cada valor do filtro,
     ocultação de seção completa, restauração com colapso preservado, salto
     para seção oculta limpando o filtro, e ocultação de super-grupo inteiro

### Comportamento verificado
- Com `Falt.`, seções completas somem inteiras; super-grupo sem nenhuma seção
  visível também some
- Voltar para `Todas` restaura tudo, com o colapso anterior preservado (o
  colapso é ortogonal ao filtro)
- O placar do título não muda ao filtrar: o filtro muda a vista, não os números
  (o placar é calculado sobre as 994 no `App.jsx`, independente do filtro)
- Coleção completa com `Falt.` resulta em tela vazia, sem mensagem especial

## Decisões tomadas
Nenhuma decisão de arquitetura, técnica ou de interface foi tomada — todo o
comportamento já estava especificado nos IDRs 0001, 0018, 0023, 0025 e 0031.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 37 arquivos.
- `vitest run`: 15 arquivos de teste, 125 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (385.48 kB JS,
  8.55 kB CSS).

## Arquivos alterados
- `src/lib/colecao.js` — função `filtraFigurinha`
- `src/lib/colecao.test.js` — 3 testes novos
- `src/components/Controles.jsx` — grupo de filtro
- `src/components/Controles.test.jsx` — 4 testes novos
- `src/components/Catalogo.jsx` — filtro de seções e super-grupos, salto com filtro
- `src/components/Catalogo.test.jsx` — 7 testes novos
- `src/components/Secao.jsx` — filtro na grade da lista
- `src/components/SuperGrupo.jsx` — filtro das seções do grupo
- `src/App.jsx` — estado `filtro` e `onLimparFiltro`
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/0004-filtro-de-status-e-secoes-vazias.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0004 atualizado
- `docs/plano/0004-disposicao-album-filtro-e-preferencias/logs/0004-log-filtro-de-status-e-secoes-vazias.md` — este log