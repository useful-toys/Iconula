<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0021-0001: botão compartilhar com as cópias das listas de troca

## Data
2026-09-14

## Resumo
As duas cópias de listas de troca saíram do menu do avatar e ganharam um
botão compartilhar próprio, logo à esquerda do avatar, na primeira linha do
cabeçalho. Antes: o avatar abria um popup com cinco comandos, dois deles as
cópias. Depois: o avatar abre exportar, importar e sair (três comandos em dois
blocos) e o novo botão compartilhar abre um popup organizado por lista —
"Copiar lista de faltantes", filete, "Copiar lista de repetidas". O
comportamento de cópia não mudou (mesmos handlers, mesmo texto, mesma reserva
`window.prompt` do IDR 0039) e o popup novo repete o fechamento/foco do menu de
ações.

Arquivos e papéis:
- `src/components/MenuDeCompartilhar.jsx` + `.css` + `.test.jsx` (novos): botão
  30×30px com ícone SVG inline de três nós ligados (`aria-hidden`) e o popup
  das duas cópias; o ícone usa `currentColor` (herda `--gold`) e o CSS próprio
  segue o ADR 0008.
- `src/components/MenuDeAcoes.jsx` + `.test.jsx`: removidas as props e os dois
  itens de cópia; ficam exportar, importar, filete e sair.
- `src/components/Cabecalho.jsx` + `.css`: novo slot `compartilhar`, renderizado
  imediatamente antes do `avatar` dentro do wrapper `.cabecalho__acoes`
  (absoluto no alto à direita, em linha); a reserva à direita do título e dos
  controles passa de 38px para 76px (30 + 8 + 30 + 8).
- `src/App.jsx`: monta o `MenuDeCompartilhar` no slot `compartilhar` com os
  handlers existentes; o `MenuDeAcoes` perde as duas props de cópia.
- `src/App.copiar.test.jsx`: as cópias passam a ser abertas pelo botão
  compartilhar.
- `src/components/Cabecalho.test.jsx`: monta o slot `compartilhar` e afirma a
  ordem compartilhar → avatar.
- `docs/interface.md` (§ Cabeçalho, § Controles, § Menu de ações + nova
  subseção § Compartilhar, § Camadas, § Wireframe › Página inteira, § Medidas) e
  `AGENTS.md` (§ Onde fica cada coisa): estado atual, citando IDR 0024 e
  IDR 0018.

Divergência entre tarefa, documentação e código: `Controles.jsx` estava na
lista de "Arquivos impactados" "conforme onde o avatar está montado", mas o
avatar não é montado nele (é um slot do `Cabecalho` desde a Tarefa 0019-0001) —
por isso `Controles.jsx` e `Controles.test.jsx` não mudaram. Nenhum outro
impacto fora dos arquivos previstos.

## Discovery
- Código:
  - `src/components/MenuDeAcoes.jsx` concentrava cinco comandos em três blocos:
    as duas cópias, exportar/importar e sair da conta. Mantém `aberto` em
    estado local, fecha por escolha, `mousedown` fora, `Esc` e `onBlur` para
    fora do container; ao abrir, foca o primeiro `[role="menuitem"]:not(:disabled)`;
    itens de conteúdo sem callback ficam desabilitados. `MenuDeAcoes.css` traz o
    botão 30×30px (raio 8px, borda e texto `--gold`), a área de toque de
    `inset: -4px` em `pointer: coarse` e o painel ancorado
    (`top: calc(100% + 6px); right: 0`, `z-index: 30`, largura mínima 230px,
    raio 10px, item `9px 12px`). Não havia precedente de SVG inline no projeto
    — o ícone de compartilhar é o primeiro.
  - `src/components/Cabecalho.jsx`: o avatar era o slot `avatar`, renderizado
    num wrapper absoluto `.cabecalho__avatar` (`top: 12px`,
    `right: var(--page-gutter)`), entre o título e os `children` (controles).
    `Cabecalho.css` reservava 38px à direita (`max-width: calc(100% - 38px)` no
    título e `margin-right: 38px` nos controles).
  - `src/App.jsx:539-549` montava `<MenuDeAcoes …>` no slot `avatar`, com
    `onCopiarFaltantes`/`onCopiarRepetidas` (`App.jsx:332-340`) e
    `onExportar`/`onImportar`; os handlers de cópia leem `contagens` em memória,
    geram o texto e chamam `copiarParaAreaDeTransferencia` (sucesso ou aviso
    dourado + `window.prompt`, IDR 0039).
  - Testes: `MenuDeAcoes.test.jsx` cobria os cinco itens em três filetes, os
    quatro desabilitados sem callback, foco no primeiro habilitado, fechar
    fora/`Esc`/tabular para fora e foto/inicial. `Cabecalho.test.jsx` montava
    `avatar={<MenuDeAcoes …>}` e afirmava a ordem título → avatar → grupos →
    desfazer → faixa. `App.copiar.test.jsx` abria o menu do avatar por
    `getByRole("button", { name: /menu de ações/ })`. `Controles.jsx` não monta
    o avatar (o próprio JSDoc registra isso).
  - Comportamento atual conferia com a tarefa: as duas cópias ainda moravam no
    menu do avatar. Convenções locais: um CSS por componente (ADR 0008),
    `role="menuitem"` explícito, área de toque por `::before`, foco por
    `:focus-visible` global (IDR 0042).
- Documentação: li `docs/idr/0024`, `docs/idr/0018`, `docs/idr/0049`,
  `docs/idr/0039`, `docs/idr/0042` (Decisão e Consequências) e
  `docs/interface.md` § Cabeçalho, § Controles, § Menu de ações, § Camadas,
  § Wireframe › Página inteira, § Medidas, além de `docs/requisitos.md`
  § Compartilhamento (já no estado novo: comandos no botão compartilhar).
  Último IDR criado: 0053 — nenhum registro novo é necessário; as decisões
  são as do planejamento.

## Plano da alteração
1. Criar `src/components/MenuDeCompartilhar.jsx` + `.css` + `.test.jsx`: botão
   30×30px com SVG inline de três nós ligados, nome acessível
   "compartilhar listas de troca, aberto/fechado", popup por lista ("Copiar
   lista de faltantes", filete, "Copiar lista de repetidas") com o mesmo
   fechamento/foco do `MenuDeAcoes`.
2. `MenuDeAcoes.jsx`: remover `onCopiarFaltantes`/`onCopiarRepetidas` e os dois
   itens; ajustar JSDoc e testes.
3. `Cabecalho.jsx`: slot `compartilhar` antes do `avatar`, wrapper
   `.cabecalho__acoes`; `Cabecalho.css` com reserva de 76px.
4. `App.jsx`: montar o `MenuDeCompartilhar` no slot novo e tirar as props do
   `MenuDeAcoes`.
5. Testes: `MenuDeCompartilhar.test.jsx` novo; `MenuDeAcoes.test.jsx` sem as
   cópias; `App.copiar.test.jsx` abrindo pelo botão compartilhar;
   `Cabecalho.test.jsx` com o slot e a ordem.
6. `docs/interface.md` nas seis seções e `AGENTS.md`.

- Verificação prevista: botão antes do avatar → teste de ordem em
  `Cabecalho.test.jsx` + roteiro visual; popup e cópias →
  `MenuDeCompartilhar.test.jsx` e `App.copiar.test.jsx`; menu do avatar enxuto →
  `MenuDeAcoes.test.jsx`; fecha/foco → `MenuDeCompartilhar.test.jsx`; docs →
  diff.
- Riscos: a reserva de 76px quebrar o título mais cedo no celular (aceito pelo
  IDR 0018); replicar o foco do `MenuDeAcoes` sem regressão (coberto por
  testes).
- Desvios: `Controles.jsx`/`Controles.test.jsx` não mudaram — o avatar não é
  montado ali; a lista de "Arquivos impactados" já condicionava a mudança a
  "conforme onde o avatar está montado".

## Decisões tomadas
- Popup de compartilhar com CSS próprio (`MenuDeCompartilhar.css`), repetindo o
  visual do `MenuDeAcoes` em vez de compartilhar folha de estilo — nível 1;
  segue o ADR 0008 (um CSS por componente) e evita acoplar os dois popups. Sem
  registro (nível 1).
- Ícone de compartilhar como SVG inline de três nós ligados (`circle`/`line`),
  `stroke="currentColor"` e `aria-hidden="true"` — nível 1; atende ao IDR 0024
  ("inline, sem asset externo") sem abrir a CSP. Sem registro (nível 1).
- `Cabecalho` ganha o slot `compartilhar` e o wrapper `.cabecalho__acoes`, com
  a reserva à direita de 38px para 76px — nível 1; a posição é decisão do
  IDR 0018/IDR 0024, aqui é só a estrutura interna. Sem registro (nível 1).

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
`npm run lint`:
```
> oxlint
Found 0 warnings and 0 errors.
Finished in 49ms on 78 files with 105 rules using 4 threads.
```

`npm run test`:
```
 Test Files  40 passed (40)
      Tests  480 passed (480)
```

`npm run build`:
```
✓ 136 modules transformed.
dist/assets/index-BTI0gXlj.css   28.46 kB │ gzip:   5.51 kB
dist/assets/index-8o3zXjEL.js   437.27 kB │ gzip: 134.92 kB
✓ built in 482ms
```
(aviso de chunk > 500 kB é pré-existente, não introduzido por esta tarefa)

`npm run test:rules`: não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] Botão compartilhar imediatamente antes do avatar na primeira linha —
      teste de estrutura em `Cabecalho.test.jsx` ("põe compartilhar e avatar
      logo após o título e a faixa por último": `estaAntes(titulo, compartilhar)`
      e `estaAntes(compartilhar, avatar)`); no DOM, `Cabecalho.jsx:96-99`
      renderiza `{compartilhar}` antes de `{avatar}`. Verificação visual
      pendente (sem navegador).
- [x] Popup com as duas cópias separadas por filete; copiar funciona como
      antes, com a reserva do IDR 0039 — `MenuDeCompartilhar.test.jsx` (dois
      itens, um filete, callbacks) e `App.copiar.test.jsx` (texto de faltantes
      e repetidas, avisos e reserva em `window.prompt`, todos verdes).
- [x] Menu do avatar só com exportar, importar e sair —
      `MenuDeAcoes.test.jsx` ("traz os três comandos em dois blocos separados
      por filete").
- [x] Popup fecha fora, com `Esc` e ao escolher; foco entra no primeiro item e
      volta ao botão — `MenuDeCompartilhar.test.jsx` (fecha fora, `Esc`,
      escolher, foco no primeiro habilitado e retorno ao botão).
- [x] `docs/interface.md` nas seis seções e `AGENTS.md` atualizados — § Cabeçalho,
      § Controles, § Menu de ações + subseção § Compartilhar, § Camadas,
      § Wireframe › Página inteira e § Medidas em `docs/interface.md`; linhas
      de `MenuDeCompartilhar.jsx` e `MenuDeAcoes.jsx` em `AGENTS.md`.

## Arquivos alterados
- `src/components/MenuDeCompartilhar.jsx` — criado (botão e popup das cópias)
- `src/components/MenuDeCompartilhar.css` — criado
- `src/components/MenuDeCompartilhar.test.jsx` — criado
- `src/components/MenuDeAcoes.jsx` — removidas as props e os itens de cópia
- `src/components/MenuDeAcoes.test.jsx` — três comandos em dois blocos
- `src/components/Cabecalho.jsx` — slot `compartilhar` e wrapper dos comandos
- `src/components/Cabecalho.css` — reserva de 76px
- `src/components/Cabecalho.test.jsx` — slot e ordem compartilhar → avatar
- `src/App.jsx` — monta o `MenuDeCompartilhar`; avatar sem as cópias
- `src/App.copiar.test.jsx` — cópias abertas pelo botão compartilhar
- `docs/interface.md` — § Cabeçalho, § Controles, § Menu de ações/§ Compartilhar,
  § Camadas, § Wireframe, § Medidas
- `AGENTS.md` — § Onde fica cada coisa
- `docs/plano/README.md` — status da tarefa e da fase
- `docs/plano/0021-botao-compartilhar/0001-botao-compartilhar-com-as-copias.md` —
  status
