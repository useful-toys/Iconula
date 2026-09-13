<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0011-0001: grupos de controles como toggle visível

## Data
2026-09-13

## Resumo
Os três grupos segmentados da linha de controles ganharam contorno de 1px em
`--border` (`.controles__segmentado`), para se lerem como grupos de alternância
sobre `--turf`. Antes, sem contorno, o fundo `--panel` quase não se distinguia
do fundo da página, e os três grupos não se liam como grupos. Só o contêiner
muda: fundo e raio permanecem, nenhuma medida do botão muda, e rótulos,
comportamento e `aria-label` ficam intocados. `docs/interface.md` § Medidas
passa a descrever o contorno citando o IDR 0048.

## Discovery
- Código: `src/components/Controles.jsx` renderiza três contêineres com a mesma
  classe `.controles__segmentado` (linhas 95, 113 e 132), cada um `role="group"`
  com `aria-label` próprio; `src/components/Controles.css:11` é o único ponto
  que estiliza o contêiner — fundo `--panel` e `border-radius: 9px`, sem
  contorno. Um único seletor cobre os três grupos. `--border` já existe
  (`src/theme.css:8`) e já é usado em `.controles__desfazer`; `box-sizing:
  border-box` é global (`src/theme.css:39`, `src/index.css:40`), então o
  contorno não cresce o contêiner nem muda as medidas dos botões. Nenhum outro
  ponto usa `controles__segmentado`. `Controles.test.jsx` não afirma nada sobre
  CSS e permanece inalterado. Comportamento atual confere com a tarefa.
- Documentação: as referências bastaram; li `docs/idr/0048` (o `## Status` já
  diz "implementação na Fase 0011 (Tarefas 0011-0001 e 0011-0002)") e confirmei
  a linha do índice `docs/idr/README.md`. Nenhum registro novo é necessário.

## Plano da alteração
1. Em `src/components/Controles.css`, acrescentar ao `.controles__segmentado`
   um contorno de 1px em `--border`, mantendo `background: var(--panel)` e
   `border-radius: 9px`.
2. Em `docs/interface.md` § Medidas, a linha dos controles passa a citar o
   contorno de 1px em `--border` e o IDR 0048, sem mudar as demais medidas.
- Verificação prevista:
  - critério 1 (contorno igual nos três grupos) → leitura do seletor único em
    `Controles.css` e busca por `controles__segmentado`;
  - critério 2 (rótulos/comportamento/`aria-label` intactos) → `Controles.jsx`
    e `Controles.test.jsx` sem alteração; `npm run test` verde;
  - critério 3 (`interface.md` cita o IDR 0048) → leitura da seção.
- Riscos: nenhum relevante; a mudança é de um seletor já compartilhado pelos
  três grupos, sem impacto fora de "Arquivos impactados".
- Desvios: nenhum.

## Decisões tomadas
- Nenhuma decisão nova: a decisão vigente é o IDR 0048, já registrado no
  planejamento. O contorno aplicado ao contêiner compartilhado
  `.controles__segmentado` decorre da tarefa ("o contêiner de cada grupo") e do
  próprio código, sem ambiguidade.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 1 warning and 0 errors.` O aviso é pré-existente e
  alheio à tarefa: `react(refs): Cannot access refs during render` em
  `src/components/Catalogo.jsx:195` (arquivo não tocado).
- `npm run test` → `Test Files 35 passed (35)` e `Tests 374 passed (374)`,
  incluindo `Controles.test.jsx` inalterado.
- `npm run build` → `✓ built in 2.48s`, exit 0. O aviso de chunk > 500 kB é
  pré-existente (bundle do Firebase/SDK), não da mudança.
- `npm run test:rules` → não se aplica: `firestore.rules` não foi tocado.

## Critérios de aceite
- [x] Os três grupos segmentados têm contorno de 1px em `--border`, iguais
      entre si — `.controles__segmentado` é o único seletor do contêiner
      (`src/components/Controles.css:11`), com `border: 1px solid
      var(--border)` (`:14`), aplicado aos três grupos
      (`src/components/Controles.jsx:95`, `:113`, `:132`).
- [x] Nenhum rótulo, comportamento ou `aria-label` mudou — `git diff` de
      `Controles.jsx` e `Controles.test.jsx` vazio; `Controles.test.jsx` verde
      na suíte.
- [x] `docs/interface.md` § Medidas descreve o contorno citando o IDR 0048 —
      linha dos controles passa a dizer "grupos segmentados sobre `--panel` com
      contorno de 1px em `--border` (IDR 0048), raio 9px…".

## Arquivos alterados
- `src/components/Controles.css` — contorno de 1px em `--border` no contêiner
  dos grupos segmentados
- `docs/interface.md` — § Medidas passa a citar o contorno e o IDR 0048
- `docs/plano/0011-refinamento-do-cabecalho/0001-grupos-de-controles-como-toggle-visivel.md` — status
- `docs/plano/0011-refinamento-do-cabecalho/logs/0001-log-grupos-de-controles-como-toggle-visivel.md` — este log
- `docs/plano/README.md` — status da fase e da tarefa
