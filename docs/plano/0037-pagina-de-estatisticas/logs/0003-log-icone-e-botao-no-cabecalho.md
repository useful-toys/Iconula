<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0037-0003: Ícone e botão no cabeçalho para abrir as estatísticas

## Data
2026-09-18

## Resumo
O ícone Material Symbols `bar_chart` foi vendorizado em
`src/assets/material-bar-chart.svg` e um botão de 30×30px com o ícone em
`--gold` foi acrescentado ao cabeçalho, na primeira linha, à esquerda do
compartilhar. Em `App.jsx`, o estado `vistaInterna` ganhou o valor
`estatisticas` e a vista `Estatisticas.jsx` (Tarefa 0037-0002) passou a ser
montada com a coleção em memória e o "← Voltar" devolvendo à tela principal —
nenhuma leitura nem escrita no Firestore. A fatia vertical está fechada: o
botão aparece só na tela principal autenticada; a vista do catálogo
compartilhado (que não recebe o callback) segue sem ele. `docs/interface.md`
§ Cabeçalho e § Medidas descrevem o novo botão, citando o IDR 0072.

## Discovery
- Código: `Cabecalho.jsx` recebe os slots `compartilhar` e `avatar`, já
  renderizados em `.cabecalho__acoes` (primeira linha, à direita); o CSS
  reserva 76px no título e nos controles para as duas colunas de 30px
  (`30 + 8 + 30 + 8 = 76`), então a terceira coluna exige reservar 114px
  (`30 + 8 + 30 + 8 + 30 + 8 = 114`). O padrão de botão 30×30 com borda e
  ícone `--gold`, foco visível e área de toque ampliada em `(pointer: coarse)`
  está em `MenuDeCompartilhar.css` (e no desfazer); os ícones de
  `Controles.jsx` copiam o `<path>` do SVG vendorizado para inline. Os testes
  de `Cabecalho.test.jsx` não passam callback novo — o botão é opcional e
  ausente sem a prop, preservando os casos atuais. `CatalogoCompartilhado.jsx`
  monta `Cabecalho` sem `compartilhar`/`avatar`; como o botão de estatísticas
  é o mesmo tipo de comando, não recebe o callback e não aparece. A
  `Estatisticas.jsx` expõe `{ contagens, onVoltar }` (observação das tarefas
  anteriores). Comportamento atual confere com a tarefa.
- Documentação: li o `IDR 0072` (posição, ícone e 30×30px), o `TDR 0026`
  (SVG inline em `src/assets/`) e o `TDR 0020` (vista interna sem router); as
  referências bastaram. O `AGENTS.md` (linha de `App.jsx`) só lista as vistas
  internas anteriores — fica para a Tarefa 0037-0004, fora desta.

## Plano da alteração
1. Criar `src/assets/material-bar-chart.svg` com o `<path>` oficial do
   Material Symbols (`bar_chart`, viewBox `0 -960 960 960`), no cabeçalho de
   comentário dos demais `material-*.svg` (TDR 0026).
2. Em `Cabecalho.jsx`, acrescentar a prop opcional `onAbrirEstatisticas` e,
   dentro de `.cabecalho__acoes`, um botão antes do slot `compartilhar`, com
   `aria-label` "Estatísticas", o SVG inline do ícone (padrão de
   `Controles.jsx`) e o mesmo padrão de foco/toque dos demais botões.
3. Em `Cabecalho.css`, estilizar `.cabecalho__botao-estatisticas` (30×30,
   borda e ícone `--gold`, foco visível e área de toque ampliada) e atualizar
   as reservas de 76px para 114px no título e nos controles.
4. Em `App.jsx`, importar `Estatisticas`, passar `onAbrirEstatisticas` ao
   `Cabecalho` e montar a vista quando `vistaInterna === 'estatisticas'` com
   `contagens` e `onVoltar` — sem `Avisos` (somente leitura).
5. Estender `Cabecalho.test.jsx` (botão com `aria-label`, clique chama o
   callback, ausente sem a prop) e `App.test.jsx` (o clique abre a vista e o
   "← Voltar" devolve à tela principal, sem chamar `gravarAlteracoes`).
6. Atualizar `docs/interface.md` § Cabeçalho (bullet do novo comando) e
   § Medidas, citando o IDR 0072.
- Verificação prevista: critério 1 → testes de `Cabecalho.test.jsx` e
  `App.test.jsx`; critério 2 → teste de `App.test.jsx` com
  `gravarAlteracoes` não chamado; critério 3 → ausência do botão nos testes
  do cabeçalho sem a prop e na vista compartilhada; docs → leitura do trecho.
- Riscos: a terceira coluna estourar a reserva do título/controles — coberto
  pelos 114px; o `App.test.jsx` mocks parciais não cobrirem a carga —
  irrelevante para abrir a vista.
- Desvios: estendi também `src/App.catalogoCompartilhado.test.jsx` (não
  listado em "Arquivos impactados") para provar o critério 3 — a ausência do
  botão na vista do link; o plano já previa verificar "na vista
  compartilhada".

## Decisões tomadas
- O botão de estatísticas é um comando interno e opcional do `Cabecalho`
  (prop `onAbrirEstatisticas`), não um slot à la `compartilhar`: mantém a
  marcação e o estilo junto do componente e some por ausência da prop na
  vista compartilhada — nível 1, sem mudar comportamento documentado.
- Ícone vendorizado como SVG inline copiado para dentro do `<path>` em
  `Cabecalho.jsx`, como os ícones de `Controles.jsx`, com o arquivo em
  `src/assets/` guardando a origem/licença — nível 1, decide só a forma de
  consumo do asset já previsto no TDR 0026.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída — sem avisos ou erros)

$ npm run test
 Test Files  57 passed (57)
      Tests  738 passed (738)

$ npm run build
✓ built in 775ms
(!) Some chunks are larger than 500 kB after minification — aviso
pré-existente (registrado em logs de fases anteriores), sem relação com
esta tarefa.
```
Testes desta tarefa: `Cabecalho.test.jsx` (3 casos novos) e `App.test.jsx`
(1 caso novo); `App.catalogoCompartilhado.test.jsx` ganhou uma asserção.

## Critérios de aceite
- [x] Botão 30×30px com `aria-label` "Estatísticas" aparece na 1ª linha, à
      esquerda do compartilhar, e abre a vista ao toque/clique —
      `Cabecalho.jsx:119-124` (botão, `aria-label` e callback),
      `Cabecalho.css:52` (largura/altura 30px, borda e `--gold`),
      `Cabecalho.jsx:120` renderiza antes de `{compartilhar}` (`:130`);
      testes "renderiza o botão com aria-label e abre a vista no clique" e
      "fica à esquerda do compartilhar na primeira linha" em
      `Cabecalho.test.jsx`; `App.jsx:858` monta a vista e
      `App.jsx:965` passa o callback; teste "o botão do cabeçalho abre a
      vista…" em `App.test.jsx`.
- [x] "← Voltar" da vista devolve à tela principal; nenhuma escrita no
      Firestore ao abrir/fechar — `Estatisticas.jsx:46` dispara `onVoltar`,
      ligado a `setVistaInterna(null)` em `App.jsx:860`; teste de
      `App.test.jsx` verifica o retorno (`possuiTelaPrincipal()`) e
      `gravarAlteracoes` não chamado; a vista não importa `colecaoRemota`.
- [x] O botão não aparece na vista do catálogo compartilhado por link —
      `CatalogoCompartilhado.jsx:179-190` não passa `onAbrirEstatisticas`;
      asserção no primeiro teste de `App.catalogoCompartilhado.test.jsx` e
      caso "sem o callback o botão não aparece" em `Cabecalho.test.jsx`.
- [x] Implícito — `docs/interface.md` § Cabeçalho (bullet do botão) e
      § Medidas (medida do botão) descrevem o novo comando, citando o
      IDR 0072.

## Arquivos alterados
- `src/assets/material-bar-chart.svg` — criado; ícone `bar_chart` vendorizado
  (TDR 0026).
- `src/components/Cabecalho.jsx` — prop `onAbrirEstatisticas` e o botão de
  estatísticas antes do slot `compartilhar`.
- `src/components/Cabecalho.css` — estilo do botão (30×30, `--gold`, foco e
  toque) e reserva de comandos de 76px para 114px.
- `src/components/Cabecalho.test.jsx` — três casos do botão de estatísticas.
- `src/App.jsx` — importa `Estatisticas`, passa o callback ao `Cabecalho` e
  monta a vista quando `vistaInterna === 'estatisticas'`.
- `src/App.test.jsx` — teste de abrir/voltar a vista sem gravar.
- `src/App.catalogoCompartilhado.test.jsx` — asserção de ausência do botão.
- `docs/interface.md` — § Cabeçalho e § Medidas com o novo botão (IDR 0072).
- `docs/plano/0037-pagina-de-estatisticas/0003-icone-e-botao-no-cabecalho.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
