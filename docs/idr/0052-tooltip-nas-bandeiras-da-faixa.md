<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0052: Tooltip nas bandeiras da faixa, com sigla, nome e progresso

## Status

Aceito.

## Contexto

- Pedido: ao passar o mouse sobre uma bandeira da faixa de salto
  ([IDR 0016](0016-salto-pela-faixa-de-bandeiras.md)), mostrar a sigla e o
  nome da seção, no mesmo padrão de tooltip dos grupos de controles
  ([IDR 0048](0048-contorno-e-tooltip-nos-grupos-de-controles.md)).
- A bandeira sozinha nem sempre identifica a seção (bandeiras parecidas,
  especiais com ícone temático); hoje só o nome acessível
  (`Saltar para Brasil`) diz qual é.
- O tooltip dos controles é um `::after` abaixo do botão, só CSS. Na faixa
  isso não funciona: ela tem `overflow-x: auto` e `overflow-y: hidden`
  (`src/components/FaixaDeSecoes.css`) e recorta qualquer coisa que saia
  de sua caixa.
- No esmiuçamento, o humano incorporou a ideia de mostrar também o
  progresso da seção, na mesma notação dos títulos.

## Decisão

- **Conteúdo**: sigla, nome e progresso da seção na notação compacta dos
  títulos ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)) —
  `BRA · Brasil · 12/20 · 60% · ▢8 · ×3`; especiais
  `FWC · Extras FIFA · …` e `COC · Coca-Cola · …`
- **Visual**: o mesmo do tooltip dos controles (IDR 0048) — `--panel`,
  borda `--border`, texto `--cream`, 11px/600, raio 6px, sombra; abaixo da
  bandeira
- **Gatilho**: igual ao dos controles — hover depois de ~400ms, na hora no
  foco por teclado (`:focus-visible`); nunca em toque, onde tocar já salta
- **Mecanismo**: um único elemento de tooltip, fora da faixa rolável,
  posicionado por JS logo abaixo da bandeira sob o cursor ou o foco e
  contido na viewport (não estoura as bordas laterais)
  - exceção ao "sem JS de posicionamento" do IDR 0048, restrita à faixa
  - sem rolagem própria ([IDR 0008](0008-uma-unica-pagina-scrollavel.md))
- O progresso reflete a contagem vigente enquanto o tooltip está visível

## Consequências

- A faixa identifica a seção e o seu placar sem saltar até ela
- Primeiro componente com JS de posicionamento no app; o tooltip dos
  controles continua só CSS
- Não muda a altura da faixa nem do cabeçalho sticky
- O tooltip some ao rolar a faixa ou a página, e ao sair o cursor ou o foco
- Em celular não há tooltip — o mesmo aceite do IDR 0048
- Implementação: Fase 0019, Tarefa 0019-0002.

## Alternativas consideradas

- **Folga abaixo da faixa para o `::after` caber**: CSS puro, mas soma
  ~24px permanentes ao cabeçalho sticky, que já cresce com o
  [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
- **`title` nativo**: visual do sistema, atraso fixo e sem foco por
  teclado — já recusado no IDR 0048
- **Só sigla e nome (`BRA · Brasil`)**: o humano preferiu somar o
  progresso, como nos títulos
- **`Brasil BRA`, na ordem do cabeçalho de seção**: o pedido pôs a sigla
  antes do nome
- **Só no hover, sem foco por teclado**: diverge do padrão dos controles e
  deixa quem navega por teclado sem a informação

## Histórico

- 2026-09-13 — Criado no esmiuçamento de ajustes de interface;
  implementação a planejar.
