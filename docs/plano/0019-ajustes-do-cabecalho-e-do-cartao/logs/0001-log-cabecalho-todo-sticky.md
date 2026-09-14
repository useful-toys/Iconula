<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0001: cabeçalho todo sticky, com o avatar na primeira linha

## Data
2026-09-14

## Resumo
O cabeçalho deixa de ter o ponto de quebra de 768px: o `<header>` é o próprio
elemento sticky em qualquer largura e contém o título, o avatar, os grupos
segmentados (com o desfazer) e a faixa de bandeiras. Abaixo de 768px, a linha
de controles e a faixa rolavam com o conteúdo; agora nada do cabeçalho rola.

O avatar (menu de ações) sai de dentro de `Controles` e passa a ser um `slot`
do `Cabecalho`, renderizado logo após o título e posicionado de forma absoluta
no alto à direita — assim ele fica sempre na primeira linha, à direita do
título, mesmo quando os grupos descem. O desfazer permanece nos `Controles`,
colado à direita da linha dos grupos, e não se move quando o filtro some. O
popup do menu continua ancorado ao avatar (abre abaixo dele, alinhado pela
direita).

## Discovery
- Código: `Cabecalho.jsx` embrulha título+faixa em `.cabecalho__fixo` e recebe
  `Controles` em `children`; `Cabecalho.css` usa `display: contents` abaixo de
  768px e vira flex sticky a partir de 768px; `Controles.jsx` traz os grupos, o
  desfazer e o `MenuDeAcoes` em `.controles__direita`; `MenuDeAcoes` é
  `position: relative` com o painel absoluto abaixo. `App.jsx` passa o
  `MenuDeAcoes` via props de `Controles`. O comportamento atual confere com a
  tarefa (o ponto de quebra existe mesmo). Impacto fora de "Arquivos
  impactados": nenhum componente além de `App.jsx` usa `Cabecalho`/`Controles`;
  `FaixaDeSecoes` não é tocada. Testes: `Cabecalho.test.jsx`,
  `Controles.test.jsx` e `MenuDeAcoes.test.jsx` cobrem a estrutura e o menu;
  `App.*.test.jsx` consultam o menu por `role`/nome (seguem valendo).
- Documentação: lidos `docs/idr/0018`, `docs/idr/0049`, `docs/idr/0024`,
  `docs/idr/0042`, `docs/idr/0048` e `docs/interface.md` § Cabeçalho,
  § Controles, § Menu de ações, § Camadas, § Wireframe, § Medidas. O IDR 0018
  (Histórico, 2026-09-13) é a decisão vigente; a § Camadas não muda.

## Plano da alteração
1. `Cabecalho.jsx`: remover `.cabecalho__fixo`; o `<header>` vira o contêiner
   único; novo prop `avatar` (ReactNode) renderizado em `.cabecalho__avatar`
   logo após o título; `children` (os controles) e a faixa depois.
2. `Cabecalho.css`: regra única sticky (sem media query) — flex, wrap,
   `align-items: center`, gap e padding; título com
   `max-width: calc(100% - 38px)` para reservar a coluna do avatar;
   `.cabecalho .controles { flex: 1 1 auto; margin-right: 38px }`; faixa
   `flex-basis: 100%`; `.cabecalho__avatar` absoluto no topo à direita
   (`top: 12px; right: var(--page-gutter)`).
3. `Controles.jsx`: remover `MenuDeAcoes` e os props do menu; `.controles__direita`
   fica só com o desfazer.
4. `Controles.css`: remover a media query de 768px e o padding próprio
   (o padding passa a ser o do cabeçalho).
5. `App.jsx`: renderizar o `MenuDeAcoes` no prop `avatar` do `Cabecalho`.
6. Testes: `Cabecalho.test.jsx` com o novo `avatar` e a ordem/estrutura dentro
   do `header`; `Controles.test.jsx` sem os casos do menu (cobertos por
   `MenuDeAcoes.test.jsx` e por `App.*.test.jsx`).
7. `docs/interface.md` § Cabeçalho, § Controles, § Menu de ações, § Wireframe da
   tela principal e § Medidas, citando o IDR 0018.
- Verificação prevista: busca por `768px` em `Cabecalho.css`/`Controles.css`;
  teste de estrutura (título, grupos, desfazer, avatar e faixa dentro do
  `header`, na ordem do DOM); testes do menu abrindo/fechando; verificação
  visual pendente (sem navegador).
- Riscos: sem navegador, a conferência do pin do avatar e do desfazer é
  visual pendente; a técnica do avatar absoluto é a decisão registrada abaixo.
- Desvios: nenhum.

## Decisões tomadas
- `Cabecalho` recebe o avatar como `slot` (`avatar`) e embrulha em
  `.cabecalho__avatar`; `Controles` perde o menu — nível 1, sem registro.
- Avatar posicionado de forma absoluta no alto à direita do cabeçalho
  (`top: 12px; right: var(--page-gutter)`), com a coluna reservada por
  `max-width` no título e `margin-right` nos controles — nível 1 (técnica).
- Ordem de foco (nível 2): o avatar vem logo após o título no DOM, antes dos
  grupos e do desfazer, seguindo a ordem visual canônica de leitura de cima
  para baixo (avatar na primeira linha, grupos/desfazer na seguinte). Sem
  registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 64ms on 73 files`.
- `npm run test` → `Test Files 37 passed (37)` / `Tests 440 passed (440)`.
- `npm run build` → `✓ built in 744ms` (aviso pré-existente de chunk > 500 kB
  no chunk `index.esm`, sem relação com esta tarefa).
- Busca `768` em `Cabecalho.css` e `Controles.css` → nenhum resultado; busca
  `768` em `docs/interface.md` → nenhum resultado.
- Busca `cabecalho__fixo` no código → só nas asserções de teste (ausência
  esperada).
- `npm run test:rules` não se aplica (`firestore.rules` intocado).

## Critérios de aceite
- [x] Nenhuma media query de 768px em `Cabecalho.css` e `Controles.css` —
  busca sem resultado.
- [x] Título, grupos, desfazer, avatar e faixa dentro do elemento sticky —
  `src/components/Cabecalho.test.jsx` ("mantém título, avatar, grupos,
  desfazer e faixa dentro do header sticky", sem `.cabecalho__fixo`) e
  `src/App.test.jsx` ("mantém título, avatar, controles e faixa dentro do
  cabeçalho sticky").
- [ ] Ao quebrar, avatar na primeira linha à direita do título e desfazer à
  direita da linha dos grupos — verificação visual pendente (sem navegador);
  roteiro abaixo.
- [x] Menu abre abaixo do avatar e fecha fora e com `Esc` — testes de
  `src/components/MenuDeAcoes.test.jsx` (agora ancorado ao avatar pelo
  `.cabecalho__avatar`); `docs/interface.md` § Menu de ações e § Medidas.
- [x] `docs/interface.md` nas cinco seções, citando o IDR 0018 — § Cabeçalho,
  § Controles, § Menu de ações, § Wireframe da tela principal e § Medidas.

Roteiro visual (pendente): em `npm run dev`, a 375×667, 667×375, 768, 1024 e
1440px de largura, rolar o catálogo e conferir que nada do cabeçalho rola
(título → grupos → faixa); a 375/667px, confirmar o título quebrando com o
avatar no alto à direita e o desfazer colado à direita da linha dos grupos;
trocar para disposição álbum e conferir o desfazer parado quando o filtro
some; abrir o menu abaixo do avatar; anotar a altura do cabeçalho sticky a
375×667 e a 667×375.

## Arquivos alterados
- `src/components/Cabecalho.jsx` — `avatar` como slot; `<header>` único (sem
  `.cabecalho__fixo`).
- `src/components/Cabecalho.css` — regra única sticky (sem media query),
  avatar absoluto no topo à direita, reserva de 38px no título/controles.
- `src/components/Controles.jsx` — removido o `MenuDeAcoes` e os props do
  menu; `.controles__direita` só com o desfazer.
- `src/components/Controles.css` — removida a media query de 768px e o
  padding próprio.
- `src/components/MenuDeAcoes.css` — comentário da ancoragem (abaixo do
  avatar).
- `src/App.jsx` — `MenuDeAcoes` no prop `avatar` do `Cabecalho`.
- `src/components/Cabecalho.test.jsx` — avatar e estrutura/ordem dentro do
  `<header>`.
- `src/components/Controles.test.jsx` — removidos os casos do menu de ações.
- `src/App.test.jsx` — teste da estrutura do cabeçalho sticky.
- `docs/interface.md` — § Cabeçalho, § Controles, § Menu de ações, § Wireframe
  da tela principal, § Medidas.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0001-cabecalho-todo-sticky.md`
  — status.
- `docs/plano/README.md` — status da tarefa e da fase.

