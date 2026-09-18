<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0035-0003: Apoiar o projeto no menu de ações

## Data
2026-09-18

## Resumo
Acrescentada a segunda porta de entrada da vista "Apoie o projeto" (IDR 0070):
o popup do avatar no cabeçalho ganhou um bloco próprio com o item "Apoiar o
projeto", entre o bloco "Sobre" (Fase 33) e o item isolado "Sair da conta".
Antes, o menu tinha quatro comandos em três blocos (exportar/importar, Sobre,
sair); agora tem cinco comandos em quatro blocos, separados por três filetes.
`App.jsx` passa ao `MenuDeAcoes` a mesma função `onAbrirApoie` que o `Rodape`,
a `TelaDeLogin` e o `CatalogoCompartilhado` já usam
(`setVistaInterna('apoie')`), sem duplicar estado. `docs/interface.md` § Menu
de ações passa a descrever os quatro blocos e cita o IDR 0070.

## Discovery
- Código:
  - `MenuDeAcoes.jsx` renderiza o popup com exportar/importar
    (`disabled={!callback}`), filete, "Sobre" (`onAbrirSobre`), filete,
    "Sair da conta" (`--sair`); o `escolher()` já chama a ação e fecha o
    popup, e o foco inicial procura `[role="menuitem"]:not(:disabled)`.
  - `App.jsx:951-960` monta `MenuDeAcoes` sem `onAbrirApoie`; a mesma função
    `() => setVistaInterna('apoie')` já é passada ao `Rodape`
    (`App.jsx:997`), à `TelaDeLogin` (`:893`) e ao `CatalogoCompartilhado`
    (`:854`). O ramo `vistaInterna === 'apoie'` já existe (`:825`).
  - `MenuDeAcoes.css`: `.menu-de-acoes__filete` é classe reutilizável, sem
    regra atada a um número de blocos — nenhuma alteração de CSS é
    necessária.
  - Testes da área: `MenuDeAcoes.test.jsx` conta
    `getAllByRole('menuitem')` (hoje 4) e
    `document.querySelectorAll('.menu-de-acoes__filete')` (hoje 2), usa
    `itens[3]`/`itens.slice(0, 3)` para o item vermelho e conta dois `Tab`
    para sair do popup — precisam acompanhar o quinto item.
    `App.apoie.test.jsx` cobre a vista pelo cartão da tela de login e pelo
    rodapé, não pelo menu.
  - Comportamento atual confere com a tarefa; impacto não citado:
    `App.apoie.test.jsx`, onde cabe a verificação integrada de que o menu
    abre a mesma vista (mesmo tratamento da Tarefa 0033-0002, que somou
    `App.sobre.test.jsx`).
- Documentação:
  - `docs/interface.md` § Menu de ações (linhas 143-165) descreve "quatro
    comandos" em "três blocos" — passa a cinco comandos em quatro blocos.
  - `docs/idr/0070` decide o item no menu em bloco próprio, depois de
    "Sobre" e antes de "Sair"; `docs/idr/0024` é o IDR do menu. As
    referências bastaram.

## Plano da alteração
1. `MenuDeAcoes.jsx` — nova prop `onAbrirApoie`; botão "Apoiar o projeto"
   (`role="menuitem"`, sempre habilitado) entre o filete que fecha o bloco
   "Sobre" e o filete que isola "Sair da conta"; atualizar o JSDoc.
2. `App.jsx` — passar `onAbrirApoie={() => setVistaInterna('apoie')}` ao
   `MenuDeAcoes`.
3. `MenuDeAcoes.test.jsx` — ajustar a composição (5 itens em 4 blocos, 3
   filetes), os índices do item vermelho, a contagem de `Tab` e o teste do
   foco inicial; somar o teste do clique em "Apoiar o projeto".
4. `App.apoie.test.jsx` — teste integrado: abrir o menu do avatar, clicar
   "Apoiar o projeto" e cair na vista com o popup fechado (impacto não
   citado, ver "Desvios").
5. `docs/interface.md` § Menu de ações — cinco comandos em quatro blocos,
   descrevendo o item "Apoiar o projeto" e citando o IDR 0070.
6. Status, README e este log no mesmo commit.
- Verificação prevista: critérios 1–2 → `MenuDeAcoes.test.jsx` e
  `App.apoie.test.jsx`; critério 3 → leitura de `docs/interface.md`;
  lint/test/build.
- Riscos: contagens e índices dos testes existentes quebrarem (ajustados no
  passo 3); colisão de nome acessível entre o item do menu ("Apoiar o
  projeto") e o link do rodapé — resolvida pela role distinta (`menuitem` ×
  `button`).
- Desvios: um arquivo além de "Arquivos impactados" — `App.apoie.test.jsx`,
  porque o critério 2 exige verificar que "Apoiar o projeto" abre a mesma
  vista (`vistaInterna === 'apoie'`), o que o teste isolado do `MenuDeAcoes`
  não alcança; é o arquivo de teste de integração da própria vista.

## Decisões tomadas
- O item "Apoiar o projeto" do menu nunca fica desabilitado (a vista sempre
  existe), como "Sobre", e não como exportar/importar — previsto na tarefa,
  sem registro próprio.
- Rótulo do item "Apoiar o projeto" (verbo) distinto do título/link da vista
  "Apoie o projeto", conforme o texto da tarefa; sem registro próprio.
- Sem alteração de CSS: o filete é a classe existente, reutilizada três
  vezes; `MenuDeAcoes.css` só mudaria se a classe exigisse ajuste, o que não
  ocorreu.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — sem avisos.
`npm run test` — 53 arquivos, 689 testes, todos passando (eram 687; mais os
dois testes novos do item "Apoiar o projeto").
`npm run build` — 177 módulos, build concluído em 609ms; o aviso
`(!) Some chunks are larger than 500 kB` é pré-existente (bundle do
Firebase; já anotado em tarefas anteriores).
`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] O popup do avatar mostra quatro blocos separados por três filetes:
      exportar/importar, Sobre, Apoiar o projeto, sair da conta — coberto por
      `MenuDeAcoes.test.jsx`, "traz os cinco comandos em quatro blocos
      separados por três filetes" (`getAllByRole('menuitem')` = 5 itens na
      ordem e `.menu-de-acoes__filete` = 3) e "os dois comandos de conteúdo
      ficam desabilitados sem callback" (Sobre e Apoiar o projeto
      habilitados).
- [x] Clicar "Apoiar o projeto" no menu abre a mesma vista do rodapé
      (`vistaInterna === 'apoie'`) e fecha o popup — `MenuDeAcoes.test.jsx`,
      "escolher 'Apoiar o projeto' chama onAbrirApoie e fecha o menu", e
      `App.apoie.test.jsx`, "é alcançável pelo menu de ações do cabeçalho,
      que fecha ao escolher" (a vista substitui o `catalogo-mock`).
- [x] `docs/interface.md` § Menu de ações cita o item Apoiar o projeto e o
      IDR 0070 — "Popup ... com cinco comandos (IDR 0024, IDR 0049, IDR 0063,
      IDR 0070)" e o bullet "**Apoiar o projeto** — abre a vista interna
      'Apoie o projeto' ... (IDR 0070)", com "os cinco itens vêm em quatro
      blocos separados por filete".
- Validação visual (roteiro em `npm run dev`) — pendente: sem navegador
  autenticável no ambiente; roteiro mantido na tarefa.

## Arquivos alterados
- `src/components/MenuDeAcoes.jsx` — prop `onAbrirApoie`, item "Apoiar o
  projeto" e filete; JSDoc.
- `src/components/MenuDeAcoes.test.jsx` — composição (5 itens, 3 filetes),
  índices do item vermelho, foco inicial e tabulação, teste do clique em
  "Apoiar o projeto".
- `src/App.jsx` — `onAbrirApoie` passado ao `MenuDeAcoes`.
- `src/App.apoie.test.jsx` — teste integrado do menu do cabeçalho.
- `docs/interface.md` — § Menu de ações.
- `docs/plano/0035-.../0003-apoiar-o-projeto-no-menu-de-acoes.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0035-.../logs/0003-log-apoiar-o-projeto-no-menu-de-acoes.md` —
  este log.
