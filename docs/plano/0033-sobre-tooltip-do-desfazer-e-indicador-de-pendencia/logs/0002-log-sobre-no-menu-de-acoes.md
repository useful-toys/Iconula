<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0033-0002: Sobre no menu de ações

## Data
2026-09-18

## Resumo
Acrescentada a segunda porta de entrada da vista "Sobre" (IDR 0063): o
popup do avatar no cabeçalho ganhou um bloco próprio com o item "Sobre",
entre o bloco de exportar/importar e o item isolado "Sair da conta". Antes,
o menu tinha dois blocos (exportar/importar e sair da conta); agora tem três,
separados por dois filetes. `App.jsx` passa ao `MenuDeAcoes` a mesma função
`onAbrirSobre` que o `Rodape` já usa (`setVistaInterna('sobre')`), sem
duplicar estado. `docs/interface.md` § Menu de ações passa a descrever os três
blocos e cita o IDR 0063.

## Discovery
- Código:
  - `MenuDeAcoes.jsx` renderiza o popup com dois itens desabilitáveis
    (exportar/importar, `disabled={!callback}`), um
    `div.menu-de-acoes__filete[role=separator]` e o item "Sair da conta"
    (`--sair`); o `escolher()` já chama a ação e fecha o popup, e o foco
    inicial procura `[role="menuitem"]:not(:disabled)`.
  - `App.jsx:914-922` monta `MenuDeAcoes` sem `onAbrirSobre`; a mesma
    função `() => setVistaInterna('sobre')` já é passada ao `Rodape`
    (`App.jsx:957`), à `TelaDeLogin` e ao `CatalogoCompartilhado`.
  - `MenuDeAcoes.css`: o filete é uma classe reutilizável
    (`.menu-de-acoes__filete`), sem regra atada a um número de blocos —
    nenhuma alteração de CSS é necessária.
  - Testes da área: `MenuDeAcoes.test.jsx` conta `getAllByRole('menuitem')`
    (hoje 3) e `document.querySelectorAll('.menu-de-acoes__filete')` (hoje
    1), e usa `itens[2]`/`itens.slice(0, 2)` para o item vermelho —
    precisam acompanhar o quarto item. `App.sobre.test.jsx` cobre a vista
    pelo cartão da tela de login e pelo rodapé, não pelo menu.
  - Comportamento atual confere com a tarefa; impacto não citado:
    `App.sobre.test.jsx`, onde vive a verificação integrada de que o menu
    abre a mesma vista.
- Documentação:
  - `docs/interface.md` § Menu de ações (linhas 136-161) descreve "três
    comandos" em "dois blocos" — passa a quatro comandos em três blocos.
  - `docs/idr/0063` decide o acesso duplo e o bloco próprio entre
    exportar/importar e sair da conta; `docs/idr/0024` é o IDR do menu.

## Plano da alteração
1. `MenuDeAcoes.jsx` — nova prop `onAbrirSobre`; botão "Sobre"
   (`role="menuitem"`, sempre habilitado) entre o filete de
   exportar/importar e um novo filete antes de "Sair da conta"; atualizar o
   JSDoc.
2. `App.jsx` — passar `onAbrirSobre={() => setVistaInterna('sobre')}` ao
   `MenuDeAcoes`.
3. `MenuDeAcoes.test.jsx` — ajustar o teste de composição (4 itens, 2
   filetes) e o do item vermelho (`itens[3]`); somar testes de Sobre
   (habilitado sem callback, chama `onAbrirSobre` e fecha).
4. `App.sobre.test.jsx` — teste integrado: abrir o menu do avatar, clicar
   "Sobre" e cair na vista, voltando depois (impacto não citado, ver
   "Desvios").
5. `docs/interface.md` § Menu de ações — quatro comandos em três blocos,
   descrevendo o item Sobre e citando o IDR 0063.
6. Status, README e este log no mesmo commit.
- Verificação prevista: critérios 1–3 → `MenuDeAcoes.test.jsx`,
  `App.sobre.test.jsx` e leitura de `docs/interface.md`; lint/test/build.
- Riscos: contagens e índices dos testes existentes quebrarem (ajustados no
  passo 3); nome acessível "Sobre" colidir com o link do rodapé nos testes de
  integração (resolvido escopando a busca ao popup).
- Desvios: um arquivo além de "Arquivos impactados" — `App.sobre.test.jsx`,
  porque o critério 2 exige verificar que "Sobre" abre a mesma vista
  (`vistaInterna === 'sobre'`), o que o teste isolado do`MenuDeAcoes` não
  alcança; é o arquivo de teste de integração da própria vista.

## Decisões tomadas
- O item "Sobre" do menu nunca fica desabilitado (a vista sempre existe),
  ao contrário de exportar/importar, que dependem de callback — previsto na
  tarefa, sem registro próprio.
- Sem alteração de CSS: o filete é a classe existente, reutilizada duas
  vezes; `MenuDeAcoes.css` só mudaria se a classe exigisse ajuste, o que não
  ocorreu.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — sem avisos.
`npm run test` — 50 arquivos, 649 testes, todos passando; os avisos
`act(...)` são pré-existentes (testes de `Avisos`, fora do escopo).
`npm run build` — 146 módulos, build concluído em 594ms; o aviso de tamanho
de chunk é pré-existente.
`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] O popup do avatar mostra três blocos separados por dois filetes:
      exportar/importar, Sobre, sair da conta — `MenuDeAcoes.test.jsx`, "traz
      os quatro comandos em três blocos separados por dois filetes"
      (`getAllByRole('menuitem')` = 4 itens na ordem e
      `.menu-de-acoes__filete` = 2).
- [x] Clicar "Sobre" no menu abre a mesma vista do rodapé
      (`vistaInterna === 'sobre'`) e fecha o popup — `MenuDeAcoes.test.jsx`,
      "escolher 'Sobre' chama onAbrirSobre e fecha o menu", e
      `App.sobre.test.jsx`, "é alcançável pelo menu de ações do cabeçalho, e
      volta para a tela principal" (a vista substitui o `catalogo-mock`).
- [x] `docs/interface.md` § Menu de ações cita o item Sobre e o IDR 0063 —
      "Popup ... com quatro comandos (IDR 0024, IDR 0049, IDR 0063)" e o
      bullet "**Sobre** — abre a vista interna 'Sobre' ... (IDR 0063)",
      com "os quatro itens vêm em três blocos separados por filete".

## Arquivos alterados
- `src/components/MenuDeAcoes.jsx` — prop `onAbrirSobre`, item "Sobre" e
  filete antes de "Sair da conta"; JSDoc.
- `src/components/MenuDeAcoes.test.jsx` — composição (4 itens, 2 filetes),
  índices do item vermelho, foco inicial e tabulação, teste do clique em
  "Sobre".
- `src/App.jsx` — `onAbrirSobre` passado ao `MenuDeAcoes`.
- `src/App.sobre.test.jsx` — teste integrado do menu do cabeçalho.
- `docs/interface.md` — § Menu de ações.
- `docs/plano/0033-.../0002-sobre-no-menu-de-acoes.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0033-.../logs/0002-log-sobre-no-menu-de-acoes.md` — este log.
