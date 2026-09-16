<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0022: Tema escuro único, com a paleta do protótipo

## Status

Aceito (revisado) — resolve a contradição entre a identidade visual
declarada em interface.md ("tema escuro verde-gramado com detalhes
dourados") e a base herdada do botão (`App.css` com dark mode via
`prefers-color-scheme`, preservada pela RNF de responsividade); fundo
neutralizado fora do cabeçalho na Fase 0025.

## Contexto

- interface.md declarava a identidade — escuro verde-gramado com
  dourado — e, na linha seguinte, mandava preservar o `App.css` do
  botão, que alterna claro/escuro conforme a preferência do sistema.
  As duas coisas não convivem: ou existe um tema claro, ou a
  identidade é sempre escura.
- A pergunta não era estética apenas: os estados do cartão
  ([IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md)) são
  cinza, verde e laranja, e o verde do cartão sobre um fundo
  verde-gramado é o par mais frágil de contraste — precisaria de duas
  afinações se houvesse dois temas.
- O protótipo de tela (`docs/prototype/`) materializou a identidade com
  uma paleta fechada em OKLCH e virou a referência: o usuário decidiu
  adotar o esquema de cores, o layout e a aparência dele.

## Decisão

- **Tema único escuro**: o app não segue `prefers-color-scheme` e não
  oferece tema claro
- A paleta, a tipografia e as medidas são as do protótipo, transcritas
  em interface.md ("Identidade visual") como fonte para o CSS
- O `App.css` da era do botão deixa de ser base a preservar: a RNF de
  responsividade continua valendo para o comportamento (funcionar bem
  em celular, tablet e navegador), não para aquele arquivo
- **Identidade verde-gramado restrita ao `.cabecalho`** (Fase 0025): só a
  barra fixa do topo (título, controles, faixa de bandeiras —
  `Cabecalho.css`) mantém `--turf` verde-gramado com `--gold`; o resto da
  aplicação (corpo, tela de login, termos de uso, política de privacidade,
  menus flutuantes, estados da figurinha) usa fundo **neutro** — `--bg` e
  `--bg-deep` (sem matiz, croma zero), `--panel` e `--border` também sem
  matiz. `--turf` não muda de valor, só passa a ser consumido num único
  lugar

## Consequências

- Um só conjunto de cores para afinar contraste — o par verde-cartão
  sobre fundo gramado é ajustado uma vez
- Perde-se o tema claro; para leitura sob sol forte (feira de troca ao
  ar livre) o recurso é o brilho do aparelho — aceito
- As cores viram tokens CSS (`--turf`, `--gold`, `--green-card`…), não
  literais espalhados pelos componentes
- A regra de acessibilidade permanece: cor nunca é o único sinal — o
  reforço vazio/preenchido do cartão (IDR 0006) segue obrigatório
- **Fundo deixa de competir com as cores de grupo e de seção** (Fase 0025):
  o verde-gramado geral brigava com seleções/grupos também verdes, e o
  dourado com os laranja/dourado — restringir a identidade ao cabeçalho
  isola o "colorido do produto" (grupos, seções) do "colorido da marca"
  (cabeçalho)
- `--turf-deep` renomeado para `--bg-deep`, acompanhando a mudança de papel

## Alternativas consideradas

- **Manter os dois temas** (`prefers-color-scheme`): respeita a
  preferência do sistema, mas dobra o trabalho de contraste e dilui a
  identidade — o verde-gramado é o produto
- **Tema claro como opção configurável**: contraria "sem configurações"
  do [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
- **Reabrir tema claro** (Fase 0025, considerado e descartado no
  planejamento): resolveria o choque de cor, mas reabre o mesmo custo de
  afinar contraste em dois temas e contraria "sem configurações" — o fundo
  neutro restrito resolve o choque sem esse custo
- **Fundo verde-gramado geral mantido, só as cores de time suavizadas**
  (Fase 0025): descartado — o fundo continuaria competindo com qualquer
  cor de grupo/seção próxima do verde ou do dourado

## Histórico

- 2026-09-16 — Planejamento da Fase 0025: o humano achou que o
  verde-gramado geral brigava com as cores de grupo/seção (também verdes
  e douradas); a identidade passa a viver só no `.cabecalho`, o resto do
  app fica neutro. Antes: verde-gramado com dourado em toda a aplicação,
  sem distinção entre cabeçalho e conteúdo. Implementação na
  Tarefa 0025-0002.
