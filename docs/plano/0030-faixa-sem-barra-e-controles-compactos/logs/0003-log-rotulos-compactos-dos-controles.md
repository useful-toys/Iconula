<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0030-0003: rótulos compactos dos controles

## Data
2026-09-17

## Resumo
`Controles.jsx` passou a mostrar ícones Material Symbols (SVG inline) em
ordenação (`numbers` | `sort_by_alpha`) e disposição (`view_list` |
`view_module`), e glifos de texto no filtro (`Todas` | `▯` | `▮` | `×`), no
lugar dos rótulos de texto anteriores (`Página`/`Sigla`, `Lista`/`Álbum`,
`Todas`/`Falt.`/`Col.`/`Rep.`). `aria-label` e `data-tooltip` continuam com
o nome por extenso em cada opção (IDR 0048), sem alteração. Os ícones são
`<svg>` escritos diretamente no JSX (padrão do botão compartilhar,
`MenuDeCompartilhar.jsx`), com o `<path>` copiado dos quatro SVGs
vendorizados na Tarefa 0030-0002. `Controles.test.jsx` ganhou um teste que
confere os ícones/glifos e teve dois títulos de `it()` atualizados (as
asserções, todas por `aria-label`, não mudaram). `docs/interface.md` §
Controles passou a descrever os ícones e os glifos em vez dos rótulos de
texto, citando IDR 0059 e TDR 0026.

## Discovery
- Código: `src/components/Controles.jsx` define `ORDENACOES`, `DISPOSICOES`
  e `FILTROS` com `rotulo` (texto), `nomeAcessivel` (usado em `aria-label` e
  `data-tooltip`) e `valor`; o botão renderiza `{opcao.rotulo}` sem outra
  lógica de apresentação — trocar `rotulo` por um nó React (ícone) ou por um
  glifo funciona sem mexer no restante do componente. Os quatro SVGs
  vendorizados pela Tarefa 0030-0002 (`src/assets/material-numbers.svg`,
  `material-sort-by-alpha.svg`, `material-view-list.svg`,
  `material-view-module.svg`) não são consumidos por nenhum módulo ainda.
  Não há plugin de SVG-como-componente configurado (`vite.config.js` só tem
  `@vitejs/plugin-react`) e o único precedente de ícone inline no projeto é
  `MenuDeCompartilhar.jsx` (`<svg>` escrito diretamente no JSX, com `<path>`/
  `<circle>`/`<line>` literais, `aria-hidden="true"`, sem `.svg` importado) —
  esse é o padrão que o TDR 0026 cita ("no mesmo padrão do botão
  compartilhar"). Sigo o mesmo padrão: componentes de ícone com `<svg>`
  inline no próprio `Controles.jsx`, com o `<path>` copiado dos arquivos
  vendorizados e um comentário citando a origem, em vez de importar os
  `.svg` como arquivo (que viraria `<img>`, não SVG inline, como em
  `LoginButton.jsx`/`google-logo.svg`). `Controles.test.jsx` já testa tudo
  por `aria-label` via `getByRole('button', { name: ... })` — nenhuma
  asserção depende do texto visível do rótulo (`toHaveTextContent` ou
  `getByText` não aparecem no arquivo); só os títulos de dois `it()` citam
  os rótulos antigos ("Página e Sigla", "clicar em Col."). `App.jsx` só
  importa e usa `<Controles>` por props — nenhum acoplamento ao `rotulo`.
- Documentação: `docs/interface.md` § Controles (linha "Rótulos curtos,
  como no protótipo: `Página` | `Sigla`...") é o único trecho a mudar,
  confirmado pela leitura completa da seção — o resto (alternadores,
  tooltip, quebra de linha, persistência) não cita rótulo e não muda.

## Plano da alteração
1. `Controles.jsx`: adicionar quatro componentes de ícone SVG inline
   (`IconNumbers`, `IconSortByAlpha`, `IconViewList`, `IconViewModule`),
   `viewBox="0 -960 960 960"`, `width`/`height="16"`, `fill="currentColor"`,
   `aria-hidden="true"`, com o `<path>` copiado de cada
   `src/assets/material-*.svg` (comentário citando o arquivo de origem e o
   TDR 0026). Trocar `rotulo` de `ORDENACOES` (`pagina`→`IconNumbers`,
   `sigla`→`IconSortByAlpha`) e `DISPOSICOES` (`lista`→`IconViewList`,
   `album`→`IconViewModule`) pelo ícone; em `FILTROS`, manter
   `todas: 'Todas'` e trocar `faltantes`→`'▯'`, `coladas`→`'▮'`,
   `repetidas`→`'×'`. `nomeAcessivel`/`aria-label`/`data-tooltip` não mudam.
   - Verificação prevista: `npm run test` (testes de `aria-label` e
     `aria-pressed` continuam passando sem alteração) + novo teste
     conferindo o conteúdo visível.
2. `Controles.test.jsx`: renomear os dois `it()` que citam rótulos antigos
   ("Página e Sigla" → "ordenação" descritiva; "clicar em Col." → "clicar
   em Coladas"), sem mudar a asserção (já é por `aria-label`); acrescentar
   um teste novo que confere ícone SVG em ordenação/disposição
   (`container.querySelector('svg')` dentro do botão) e os glifos de texto
   do filtro (`Todas`, `▯`, `▮`, `×`) via `textContent` de cada botão do
   grupo de filtro.
   - Verificação prevista: `npm run test -- --run` verde.
3. `docs/interface.md` § Controles: trocar o bullet "Rótulos curtos, como
   no protótipo: `Página` \| `Sigla`..." pela descrição dos ícones Material
   (ordenação/disposição) e dos glifos de texto (filtro), citando IDR 0059
   e mantendo a nota de que a forma por extenso vive só no nome acessível
   (IDR 0018) e no tooltip (IDR 0048).
   - Verificação prevista: leitura do trecho após a edição.
4. Sem registro novo — a decisão (IDR 0059) já foi tomada no planejamento;
   esta tarefa só implementa.
- Riscos: nenhum além do usual (SVG mal formado quebraria o build/lint —
  mitigado copiando o `<path>` literal dos arquivos já validados na
  Tarefa 0030-0002).
- Desvios: nenhum.

## Decisões tomadas
- Ícones SVG inline escritos diretamente em `Controles.jsx` (path copiado
  dos assets da Tarefa 0030-0002), em vez de importar os `.svg` como
  arquivo — nível 1: segue o único precedente do projeto
  (`MenuDeCompartilhar.jsx`), citado pelo próprio TDR 0026 ("no mesmo
  padrão do botão compartilhar"); importar o arquivo resultaria num `<img>`
  (padrão do `google-logo.svg`/`LoginButton.jsx`), não num SVG inline, e
  exigiria um plugin de bundler não configurado no projeto.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída — sem avisos ou erros)

$ npm run test -- --run
 Test Files  43 passed (43)
      Tests  585 passed (585)
   Duration  27.00s

$ npm run build
✓ 138 modules transformed.
✓ built in 359ms
(aviso de chunk >500kB pré-existente, já registrado no log da
Tarefa 0030-0002 — não relacionado a esta mudança)
```

## Critérios de aceite
- [x] Ordenação mostra `numbers`/`sort_by_alpha`; disposição
      `view_list`/`view_module`; filtro `Todas | ▯ | ▮ | ×` — teste "mostra
      ícones SVG na ordenação e na disposição, e glifos de texto no
      filtro" (`src/components/Controles.test.jsx`).
- [x] `aria-label` e tooltip com o nome por extenso em cada opção — testes
      existentes por `getByRole('button', { name: ... })` (inalterados) e o
      teste "dá a cada opção dos três grupos um tooltip igual ao nome
      acessível" (`src/components/Controles.test.jsx:217`).
- [x] `npm run lint && npm run test && npm run build` verdes — saída acima.

## Arquivos alterados
- `src/components/Controles.jsx` — `rotulo` de `ORDENACOES`/`DISPOSICOES`
  vira ícone Material SVG inline (`IconNumbers`, `IconSortByAlpha`,
  `IconViewList`, `IconViewModule`); `rotulo` de `FILTROS` vira glifo de
  texto (`▯`, `▮`, `×`, mantendo `Todas`); JSDoc do componente atualizado
- `src/components/Controles.test.jsx` — dois títulos de `it()` atualizados;
  novo teste dos ícones/glifos
- `docs/interface.md` — § Controles: bullet de rótulos reescrito para
  ícones/glifos, citando IDR 0059 e TDR 0026
- `docs/plano/0030-faixa-sem-barra-e-controles-compactos/0003-rotulos-compactos-dos-controles.md` — status `Concluída`, critérios marcados
- `docs/plano/README.md` — linha da Tarefa 0030-0003 → `Concluída`
- `docs/plano/0030-faixa-sem-barra-e-controles-compactos/logs/0003-log-rotulos-compactos-dos-controles.md` — criado
