<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0011-0002: tooltip nas opções de controle

## Data
2026-09-13

## Resumo
As oito opções dos três grupos segmentados da linha de controles (ordenação,
disposição e filtro) passaram a mostrar, abaixo do botão, o próprio nome
acessível por extenso como tooltip visual: aparece no hover depois de ~400ms
e na hora no foco por teclado (`:focus-visible`), e nunca em toque. Antes, a
forma por extenso existia só no `aria-label`; quem tinha dúvida sobre os
rótulos curtos (`Pág.`-equivalentes `Página` | `Sigla`, `Falt.` | `Col.` |
`Rep.`) não tinha pista visual.

A fonte do texto continua única: `Controles.jsx` põe o `nomeAcessivel` também
num `data-tooltip`, e o CSS do tooltip lê `attr(data-tooltip)` num
pseudo-elemento `::after` — nenhum texto novo e nenhum JS de posicionamento.
O pseudo-elemento fica fora da árvore de acessibilidade e é `pointer-events:
none`, então não duplica a leitura do leitor de tela nem intercepta cliques.
Nas opções das pontas de cada grupo, o tooltip alinha à borda do grupo
(`:first-child` à esquerda, `:last-child` à direita) em vez de centralizar,
para não estourar a viewport em celular. O gatilho de hover fica sob
`@media (hover: hover)`, de modo que tela sensível (que alterna a opção pelo
toque) não mostra tooltip.

`docs/interface.md` § Controles ganha o bullet que descreve o tooltip e cita
o IDR 0048.

## Discovery
- Código: as opções são os únicos elementos com `.controles__opcao`
  (`src/components/Controles.jsx`), renderizadas em três laços sobre
  `ORDENACOES`, `DISPOSICOES` e `FILTROS` (linhas 95, 113 e 132), cada botão
  já com `aria-label={opcao.nomeAcessivel}`. `Controles.css` não tinha
  `position` no botão nem `::after` algum — o tooltip é o primeiro
  pseudo-elemento ali; o `::before` existente é só do `.controles__desfazer`
  (área de toque) e não colide. `.controles` e `.controles__segmentado` não
  têm `overflow`, então o balão absoluto não é cortado. Comportamento atual
  confere com a tarefa. `Controles.test.jsx` usa `@testing-library/react` e
  `jest-dom`; o teste novo segue o padrão de `container.querySelector`.
- Documentação: além das referências, li o `## Decisão` do IDR 0048 (tooltip
  abaixo do botão, hover ~400ms, foco imediato, sem toque, pontas alinhadas,
  CSS sobre os tokens, fora da árvore de acessibilidade) e confirmei a linha
  do índice `docs/idr/README.md`. Nenhum registro novo é necessário.

## Plano da alteração
1. Em `Controles.jsx`, acrescentar `data-tooltip={opcao.nomeAcessivel}` aos
   três botões, ao lado do `aria-label` — mesma fonte para as duas saídas.
2. Em `Controles.css`, `position: relative` no `.controles__opcao` e o
   tooltip em `::after` com `content: attr(data-tooltip)`, abaixo do botão,
   oculto por padrão, revelado por `@media (hover: hover)` com
   `transition-delay: 0.4s` e por `:focus-visible` sem atraso; nas pontas,
   alinhado à borda do grupo.
3. Em `Controles.test.jsx`, teste que percorre os 8 botões `.controles__opcao`
   e exige `data-tooltip` igual ao `aria-label`.
4. Em `docs/interface.md` § Controles, bullet do tooltip citando o IDR 0048.
- Verificação prevista:
  - critério 1 (atributo igual ao nome acessível) → teste novo;
  - critérios 2 e 3 (posição/atrasos e ausência em `hover: none`) → leitura do
    CSS e roteiro visual;
  - critério 4 (pontas sem corte) → roteiro visual;
  - critério 5 (`interface.md` cita o IDR 0048) → leitura da seção.
- Riscos: o balão podia ser cortado por `overflow` de ancestral (verificado:
  não há) ou roubar cliques (mitigado com `pointer-events: none`).
- Desvios: nenhum.

## Decisões tomadas
- Atributo `data-tooltip` e leitura via `attr()` no pseudo-elemento `::after`
  — solução CSS pura sem biblioteca nem JS, como o IDR 0048 pede (nível 1,
  sem registro: a técnica já está decidida no IDR 0048, o atributo é o
  detalhe interno de implementação).
- Centralizar o tooltip nas opções internas e alinhar à borda nas pontas
  (`:first-child`/`:last-child`) — decorre direto do IDR 0048 (nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 1 warning and 0 errors.` O aviso é pré-existente e
  alheio à tarefa: `react(refs): Cannot access refs during render` em
  `src/components/Catalogo.jsx:195` (arquivo não tocado).
- `npm run test` → `Test Files 35 passed (35)` e `Tests 375 passed (375)`,
  incluindo os 24 testes de `Controles.test.jsx` (o novo incluso).
- `npm run build` → `✓ built in 764ms`, exit 0. O aviso de chunk > 500 kB é
  pré-existente (bundle do Firebase/SDK), não da mudança.
- `npm run test:rules` → não se aplica: `firestore.rules` não foi tocado.
- Verificação visual em `npm run dev` → **pendente**: sem navegador no
  ambiente de execução; roteiro deixado na Tarefa (passar o mouse por cada
  opção; tabular por cada opção; em emulação de toque, conferir que o toque
  alterna sem tooltip e que as pontas não cortam com mouse).

## Critérios de aceite
- [x] Toda opção dos três grupos tem o atributo do tooltip igual ao
      `aria-label` — teste "dá a cada opção dos três grupos um tooltip igual
      ao nome acessível" (`src/components/Controles.test.jsx:290`), verde.
- [x] Tooltip abaixo do botão, no hover após ~400ms e no `:focus-visible` sem
      atraso — `top: calc(100% + 6px)` e `transition-delay: 0.4s` no hover,
      `transition-delay: 0s` no `:focus-visible`
      (`src/components/Controles.css:45`, `:70`, `:77`).
- [x] Nenhum tooltip em `hover: none` — o gatilho de hover está dentro de
      `@media (hover: hover)` (`src/components/Controles.css:66`).
- [ ] Em largura de celular, os tooltips das pontas não são cortados pela
      viewport — verificação visual pendente; o CSS alinha as pontas à borda
      do grupo (`src/components/Controles.css:82`, `:87`).
- [x] `docs/interface.md` § Controles descreve o tooltip citando o IDR 0048 —
      bullet novo após "Rótulos curtos" (`docs/interface.md:77`).

## Arquivos alterados
- `src/components/Controles.jsx` — `data-tooltip` igual ao `nomeAcessivel` nos
  três grupos de opções
- `src/components/Controles.css` — `position: relative` na opção e o tooltip
  em `::after` (hover ~400ms, foco imediato, sem toque, pontas alinhadas)
- `src/components/Controles.test.jsx` — teste do atributo contra o `aria-label`
- `docs/interface.md` — § Controles passa a descrever o tooltip e cita o
  IDR 0048
- `docs/plano/0011-refinamento-do-cabecalho/0002-tooltip-nas-opcoes-de-controle.md` — status
- `docs/plano/0011-refinamento-do-cabecalho/logs/0002-log-tooltip-nas-opcoes-de-controle.md` — este log
- `docs/plano/README.md` — status da tarefa
