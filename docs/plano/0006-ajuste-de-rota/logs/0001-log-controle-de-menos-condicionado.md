<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0006-0001: controle de menos condicionado e no canto inferior esquerdo

## Data
2026-09-10

## Resumo
Corrigido o controle de menos do cartão da figurinha, conforme o
[IDR 0032](../../idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md):

- Em `Figurinha.jsx`, o botão de menos passou a ser renderizado **apenas com
  contagem ≥ 1** — a figurinha faltante não tem mais o botão no DOM, nem
  invisível nem desabilitado. O `onDecrementar` continua chegando por prop e o
  piso de 0 continua na função pura de `src/lib/colecao.js`.
- Ao decrementar de 1 para 0, o botão desaparece. Para não perder o foco (que
  cairia para a raiz do documento quando o elemento some), o `onClick` do
  controle devolve o foco ao corpo do cartão via `useRef` antes de a
  re-renderização remover o botão.
- Em `Figurinha.css`, o controle saiu do canto superior esquerdo transbordante
  (`top: -8px; left: -8px`) para **dentro** do cartão, no canto inferior
  esquerdo: círculo de 18px com 3px de recuo na lista e 16px com 2px de recuo no
  álbum, sinal `−` em 13px/700 (12px no álbum), conforme `interface.md` §
  Medidas. O selo `×N` continua transbordando no canto inferior direito.

Os três adornos passam a ocupar cantos distintos sem colisão: metalizada em cima
à direita, selo `×N` embaixo à direita (transbordando) e menos embaixo à
esquerda (dentro). A figurinha em paisagem (trilha dupla, 110px de largura) não
sofre colisão — o controle fica ancorado à esquerda e o código permanece
centralizado.

## Decisões tomadas
Nenhuma. A decisão de condicionar o controle à contagem e movê-lo para dentro do
cartão já estava registrada no IDR 0032 (criado no planejamento da Fase 6); as
medidas já constavam em `interface.md` § Medidas. Não houve ambiguidade residual
que exigisse TDR/IDR novo.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.` (39 arquivos, 105 regras).
- `vitest run`: **16 arquivos de teste, 139 testes, todos passando** — incluindo
  os 12 de `Figurinha.test.jsx`, que agora cobrem a ausência do botão com
  contagem 0, a presença a partir da contagem 1, o decremento de 2 e a remoção do
  controle ao cair para 0 com devolução do foco ao cartão.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

### Verificação visual
A verificação visual em `npm run dev` não pôde ser executada neste ambiente
automatizado (sem navegador). A checagem de não-colisão foi feita por geometria e
coberta por teste de renderização:
- Cartão em lista (52×66px): o controle de 18px ocupa, a partir das bordas,
  x ∈ [3, 21] e y ∈ [3, 21] na base esquerda; o código fica centralizado e o selo
  `×N` no canto inferior direito (transbordando) — sem sobreposição.
- Cartão em álbum (52×52px): controle de 16px com recuo de 2px; mesma conclusão.
- Figurinha 13 em paisagem (110px de largura): o controle mantém o recuo de 3px
  à esquerda e o código centralizado — sem sobreposição.
- Oculto por padrão, revelado em `:hover`/`:focus-within`, sempre visível em
  `@media (hover: none)` — as regras CSS existentes foram preservadas e apenas
  reposicionadas/redimensionadas.

## Arquivos alterados
- `src/components/Figurinha.jsx` — botão de menos condicionado a `contagem >= 1`
  e devolução de foco ao corpo do cartão
- `src/components/Figurinha.css` — controle no canto inferior esquerdo dentro do
  cartão, 18px/3px na lista e 16px/2px no álbum
- `src/components/Figurinha.test.jsx` — testes de ausência com 0, presença a
  partir de 1 e remoção com retorno de foco
- `docs/plano/0006-ajuste-de-rota/0001-controle-de-menos-condicionado.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0001 atualizado
- `docs/plano/0006-ajuste-de-rota/logs/0001-log-controle-de-menos-condicionado.md` — este log

`docs/interface.md` não precisou mudar: a revisão de interface feita no
planejamento da Fase 6 já descrevia o comportamento alvo nas § Figurinha,
§ Interações e § Medidas (controle dentro do cartão, no canto inferior esquerdo,
a partir da contagem 1, com 18px/16px e recuo de 3px/2px).
