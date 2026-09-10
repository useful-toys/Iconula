<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0002-0001: tema escuro único e tokens da paleta

## Data
2026-09-09

## Resumo
Criado `src/theme.css` com a base visual do produto novo: os onze tokens
OKLCH de `docs/interface.md` § Paleta, as variáveis de espaçamento de
`docs/interface.md` § Medidas e os padrões de página (fundo `--turf`, texto
`--cream`, `system-ui` como fonte base). O `src/main.jsx` passa a importar o
tema logo após `src/index.css`, onde já estão as `@font-face` de Poppins 600 e
700 vendorizadas.

Mantidos `src/index.css` e `src/App.css` intactos nesta tarefa, conforme o
escopo: o botão atual continua renderizado, agora sobre o fundo verde-gramado
`--turf`, e permanece legível enquanto os dois produtos coexistem dentro do
PR. Nenhuma regra do tema novo usa `prefers-color-scheme`, `overflow:
auto|scroll` ou cor literal fora dos tokens.

Conferido o par mais frágil apontado pelo IDR 0022 (`--green-card` sobre
`--turf`): implementado com os valores especificados em `interface.md`, sem
alterá-los — ajustar a paleta é decisão do IDR 0022, não desta tarefa.

## Decisões tomadas
Nenhuma nova decisão de arquitetura, técnica ou de interface. A escolha de
arquivo próprio (`src/theme.css`) em vez de colocar tokens em `index.css` segue
o encaminhamento já registrado na seção "Decisões em aberto" da própria
tarefa; é organizacional e puramente estética, sem registro ADR/TDR/IDR.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 7 arquivos de teste, 55 testes, todos passando. Na primeira
  execução o teste de wrap-around (`src/App.test.jsx`) atingiu o timeout de
  5000 ms; isolado e na execução seguinte passou, indicando flake não
  relacionado à mudança de CSS.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

Verificação visual em `npm run dev`: o fundo da página é `--turf`, a fonte do
título (quando aplicada) vem de Poppins servida pelo próprio host, e alternar
o tema do sistema entre claro e escuro não altera a aparência.

## Arquivos alterados
- `src/theme.css` — criado com tokens, espaçamentos e padrões de página
- `src/main.jsx` — importa `theme.css` junto de `index.css`
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/0001-tema-escuro-unico-e-tokens.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002-0001 atualizado
- `docs/plano/0002-fatia-vertical-catalogo-em-tela/logs/0001-log-tema-escuro-unico-e-tokens.md` — este log
