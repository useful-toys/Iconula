<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0037-0002: Vista de estatísticas com gráficos à mão

## Data
2026-09-18

## Resumo
A derivação pura dos cinco blocos (`src/lib/estatisticas.js`, Tarefa 0037-0001)
já existia, mas nenhuma vista a apresentava. Antes, não havia `Estatisticas`;
agora `src/components/Estatisticas.jsx` é uma vista interna (TDR 0020) no
molde de `Sobre`/`Apoie`: corpo de leitura de 640px, título "Estatísticas" e
"← Voltar", com os cinco blocos — resumo geral (donut + números), progresso
por grupo (14 barras), progresso por seção (50 barras finas), repetidas por
seção e histograma de contagens — desenhados à mão em SVG/CSS (TDR 0030), sem
biblioteca nova e sem controles de edição.

## Discovery
- Código: `src/lib/estatisticas.js` já exporta `derivarEstatisticas(contagens,
  secoes, figurinhas)` devolvendo `{ resumo, progressoPorGrupo,
  progressoPorSecao, repetidasPorSecao, histograma }`; `resumo` e cada
  recorte trazem `{ coladas, faltantes, repetidas, percentual }`; o histograma
  traz faixas `{ contagem, rotulo, total }` com a cauda `"6+"`. O componente
  importa `secoes` e `figurinhas` de `src/data/catalogo.js` (como `Catalogo`)
  e recebe `contagens` por prop. `Sobre.jsx`/`ApoieOProjeto.jsx` e seus `.css`
  são o molde da vista interna (`onVoltar`, corpo de 640px, título 22px
  dourado). `Figurinha.jsx:292` mostra o padrão de `role="img"` + `aria-label`
  para conteúdo somente leitura. Testes co-localizados com React Testing
  Library (`render`/`screen`) e `@testing-library/jest-dom/vitest`. Nenhum
  ponto de impacto fora dos arquivos previstos: `App.jsx` só montará a vista
  na Tarefa 0037-0003.
- Documentação: as referências bastaram; conferi `docs/requisitos.md`
  § Estatísticas (conteúdo e somente leitura) e os precedentes de layout em
  `docs/interface.md` § Demais telas (Sobre/Apoie, corpo de 640px).

## Plano da alteração
1. Criar `src/components/Estatisticas.jsx` como vista interna: importa
   `secoes`/`figurinhas` do catálogo e chama `derivarEstatisticas(contagens, …)`;
   título "Estatísticas" + "← Voltar"; cinco blocos com `h2`; barras de grupo
   e seção em divs com largura proporcional; donut de percentual e histograma
   em SVG; `role="img"` + `aria-label` por extenso em cada gráfico e valores
   visíveis (cor não é o único sinal); nenhum controle de edição.
2. Criar `src/components/Estatisticas.css` — mesmas medidas de leitura de
   `Sobre.css`, tokens de `theme.css`, `flex-wrap` sem rolagem própria.
3. Criar `src/components/Estatisticas.test.jsx` — título, "← Voltar", os cinco
   blocos, coleção vazia (0/994) e ausência de botões de edição.
4. Atualizar `docs/interface.md` § Demais telas com "### Estatísticas"
   (layout, conteúdo, somente leitura), citando IDR 0072 e TDR 0030.
- Verificação prevista: critérios por teste (`Estatisticas.test.jsx`) e busca;
  lint/test/build; sem `test:rules` (nada de Firestore).
- Riscos: nome acessível pelo React Testing Library em elementos `role="img"`
  — resolvido com `aria-label` determinístico e testado.
- Desvios: nenhum.

## Decisões tomadas
- API da vista: recebe `{ contagens, onVoltar }` (prop-drilling, TDR 0014) —
  nível 1, define a ligação da Tarefa 0037-0003.
- Donut no resumo geral para o percentual; histograma com barras verticais em
  SVG e rótulo/count visíveis (TDR 0030) — nível 1.
- Barras de grupo/seção em divs com largura proporcional e valor visível
  `coladas/total` — nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` (oxlint): sem saída, sem avisos.
- `npm run test` (Vitest): `Test Files 57 passed (57)`, `Tests 734 passed (734)`
  — inclui os 6 testes novos de `Estatisticas.test.jsx`.
- `npm run build` (vite): `✓ built in 888ms`; únicos avisos são o
  pré-existente de chunk acima de 500 kB.
- `npm run test:rules`: não se aplica (nenhuma alteração em `firestore.rules`).

## Critérios de aceite
- [x] A vista tem título "Estatísticas", "← Voltar" e os cinco blocos —
      `Estatisticas.jsx:50` (título), `:46` (botão) e os `h2` das cinco
      `section` (`Estatisticas.jsx:53,68,75,82,103`); testes "mostra o título
      e o '← Voltar'…" e "renderiza os cinco blocos" em
      `Estatisticas.test.jsx`.
- [x] Nenhum componente com rolagem própria; a página rola por inteiro — a
      única ocorrência de `overflow` em `Estatisticas.css` é `hidden:141`,
      que recorta o preenchimento da barra (não há `auto`/`scroll`); o corpo
      é uma coluna única sem altura limitada.
- [x] Sem dependência de gráfico nova no `package.json` — busca por
      `recharts|chart.js|d3|visx` em `package.json` não retorna nada;
      `git status` não lista `package.json`.
- [x] Nome acessível por extenso nos gráficos; cor não é o único sinal —
      donut, barras de grupo/seção e histograma têm `role="img"` +
      `aria-label` por extenso (`Estatisticas.jsx:136,175,217`) e valor
      visível (`:149` no donut; `:181` na barra; `:235` no histograma);
      testes "descreve cada gráfico por extenso…".
- [x] `docs/interface.md` § Demais telas descreve a vista, citando o IDR 0072
      — `docs/interface.md:926` abre "### Estatísticas" e cita
      [IDR 0072](idr/0072-pagina-de-estatisticas-como-vista-interna.md) e
      [TDR 0030](tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md).

## Arquivos alterados
- `src/components/Estatisticas.jsx` — criar: vista interna com os cinco
  blocos e os gráficos à mão.
- `src/components/Estatisticas.css` — criar: layout de leitura e estilos dos
  gráficos, com tokens de `theme.css`.
- `src/components/Estatisticas.test.jsx` — criar: 6 testes (título/voltar,
  cinco blocos, nomes acessíveis, coleção vazia, repetidas e ausência de
  controles de edição).
- `docs/interface.md` — § Demais telas ganha "### Estatísticas".
- `docs/plano/0037-pagina-de-estatisticas/0002-vista-de-estatisticas.md` —
  status `Pendente` → `Em andamento` → `Concluída`.
- `docs/plano/README.md` — status da tarefa 0002.
- `docs/plano/0037-pagina-de-estatisticas/logs/0002-log-vista-de-estatisticas.md`
  — este log.
