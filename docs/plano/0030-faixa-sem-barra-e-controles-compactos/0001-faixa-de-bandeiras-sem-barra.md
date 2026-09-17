<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0030-0001]: faixa de bandeiras sem barra de rolagem

## Status
Concluída

## Objetivo
Eliminar a barra de rolagem visível da faixa de bandeiras em todas as
plataformas e substituí-la por arrasto e um fade condicional nas bordas:
arrastar com o mouse rola a faixa (cursor `grab`/`grabbing`), clique salta
(limiar de movimento ~5px), e `overscroll-behavior-x: contain` trava o
"voltar página" no swipe horizontal.

## Documentos de referência
- `docs/idr/0058-rolagem-da-faixa-de-bandeiras-sem-barra.md` § Decisão — fade,
  arrasto, limiar de clique e overscroll.
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` — o salto continua por
  clique/teclado.
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` — a faixa é a única exceção
  de rolagem própria.

## Padrões e convenções aplicáveis
- Rodinha do mouse **não** é interceptada (a página segue rolando) — IDR 0058.
- O fade usa JS (a faixa já tem JS no tooltip, IDR 0052); a distinção
  clique×arrasto é crítica.
- Acessibilidade: o salto continua por teclado; o arrasto é extra de mouse.

## Escopo e instruções de implementação
1. Em `FaixaDeSecoes.css`: remover a barra visível no desktop (a do toque já
   é `display: none`); `overscroll-behavior-x: contain` na trilha; `cursor:
   grab` no hover e `grabbing` durante o arrasto; dois degradês `--turf →
   transparente` nas bordas (esquerda/direita) com `pointer-events: none`.
2. Em `FaixaDeSecoes.jsx`: escutar `scroll` para ligar/desligar o fade (esquerdo
   só quando rolou, direito só quando ainda há conteúdo); `mousedown`/
   `mousemove`/`mouseup` para arrastar a trilha, com limiar de movimento para
   não disparar o salto num arrasto.
3. Atualizar `interface.md` § Cabeçalho e § Medidas.

**Fora do escopo**: a rodinha→horizontal (recusada); o espaçamento entre
bandeiras (segue 2px).

## Decisões já tomadas (não reabrir)
- Faixa sem barra, fade condicional, arrasto com limiar e rodinha não
  interceptada — ver `docs/idr/0058-rolagem-da-faixa-de-bandeiras-sem-barra.md`.

## Arquivos impactados
- `src/components/FaixaDeSecoes.jsx` — modificar
- `src/components/FaixaDeSecoes.css` — modificar
- `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho, § Medidas)

## Critérios de aceite
- [ ] Nenhuma barra de rolagem visível na faixa, no desktop e no mobile.
- [ ] Arrastar rola a trilha; clicar sem mover salta; mover >5px não salta.
- [ ] Fade esquerdo só com conteúdo à esquerda; direito só com conteúdo à
      direita.
- [ ] `cursor: grab` no hover e `grabbing` ao arrastar.
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- `npm run dev` — arrastar a faixa, clicar numa bandeira (salta) e rolar a
  página com o cursor sobre a faixa (a página rola).
