<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0002]: tooltip nas opções de controle

## Status
Pendente

## Objetivo
Ao passar o mouse ou levar o foco de teclado a qualquer opção dos três grupos
de controle (ordenação, disposição, filtro), exibir uma explicação curta do
que a opção faz, reaproveitando o texto que já existe como `aria-label`.

## Documentos de referência
- `src/components/Controles.jsx` — os arrays `ORDENACOES`, `DISPOSICOES` e
  `FILTROS` já têm `nomeAcessivel` por extenso para cada opção (ex.: "ordenar
  pela página do álbum")
- `docs/idr/0018-usuario-especialista-e-minimalismo.md` § Decisão — "sem
  rótulos explicativos" na tela; o tooltip é sob demanda (hover/foco), não
  texto sempre visível
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — padrão de
  `:focus-visible`; o tooltip responde também a foco de teclado
- `docs/idr/0008-uma-unica-pagina-scrollavel.md` § Decisão — nenhum componente
  com rolagem própria
- `docs/interface.md` § Controles — onde o tooltip passa a ser descrito

## Padrões e convenções aplicáveis
- Um texto, duas saídas: o mesmo `nomeAcessivel` do `aria-label` alimenta o
  tooltip — nunca duas fontes para a mesma frase — `src/components/Controles.jsx`
- O tooltip não duplica a leitura do leitor de tela: texto em
  `content: attr(...)` não entra na árvore de acessibilidade, e o
  `aria-label` continua sendo a única fonte — IDR 0018
- Aparece em `:hover` **e** em `:focus-visible` — IDR 0042
- Sem biblioteca nem JS de posicionamento — CSS puro sobre os tokens
  existentes (`--panel`, `--cream`, `--border`) — `src/theme.css`
- Sem rolagem própria e sem corte pela borda da viewport em tela estreita —
  IDR 0008

## Escopo e instruções de implementação
1. Registrar a técnica do tooltip num IDR (ver "Decisões em aberto").
2. Em `Controles.jsx`, acrescentar `data-tooltip={opcao.nomeAcessivel}` a cada
   botão dos três grupos, reaproveitando os arrays existentes.
3. Em `Controles.css`, implementar o tooltip: acima do botão, oculto por padrão
   (`opacity: 0`/`visibility: hidden`), revelado em `:hover`/`:focus-visible`,
   com transição curta para não piscar ao passar o mouse de raspão.
4. Ajustar o ponto de ancoragem (`left`/`right`/`transform`) do primeiro e do
   último botão de cada grupo para não estourar a borda da viewport em
   celular.
5. Testes em `Controles.test.jsx`: todo botão dos três grupos tem
   `data-tooltip` igual ao seu `aria-label`.
6. Descrever o tooltip em `docs/interface.md` § Controles, citando o IDR.

**Fora do escopo**: tooltip no botão de desfazer, no menu de ações ou nos
ícones da faixa de bandeiras.

## Decisões já tomadas (não reabrir)
- O texto de cada opção por extenso já existe (`nomeAcessivel`) — ver
  `src/components/Controles.jsx`
- Minimalismo não abre mão de acessibilidade — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`

## Decisões em aberto nesta tarefa
- Técnica do tooltip — encaminhamento: CSS puro (`::after` com
  `content: attr(data-tooltip)`) em vez do `title` nativo, por consistência com
  a paleta escura e leitura por teclado; o `title` nativo entra como
  alternativa descartada. Registro: nasce um IDR sobre o tooltip nas opções de
  controle.
- Comportamento em toque (sem `:hover` persistente) — encaminhamento: tooltip
  só com foco, não com toque solto; registrado como consequência no mesmo IDR.

## Arquivos impactados
- `src/components/Controles.jsx` — modificar (`data-tooltip`)
- `src/components/Controles.css` — modificar (regras do tooltip)
- `src/components/Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Controles)
- `docs/idr/` — criar (tooltip nas opções de controle)

## Critérios de aceite
- [ ] Toda opção dos três grupos revela seu `nomeAcessivel` em tooltip visual
- [ ] Tooltip aparece em `:hover` e em `:focus-visible`
- [ ] Nenhum texto novo foi escrito: teste confirma `data-tooltip` igual ao
      `aria-label` em todos os botões
- [ ] Tooltip não é cortado pela borda da viewport em celular
- [ ] Nenhuma rolagem própria foi introduzida
- [ ] O IDR registra a técnica, a alternativa descartada e o comportamento em
      toque

## Validação adicional
Verificação visual em `npm run dev`: passar o mouse por cada opção; tabular
por teclado por cada opção e conferir que o tooltip aparece igual; em largura
de celular, conferir os botões das pontas de cada grupo.
