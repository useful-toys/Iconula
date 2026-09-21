<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0045: Cores de super-grupos

## Status

Aceito (revisado) — implementação na Fase 0015; ajustes na Fase 0018; nova
fonte das cores e modelo de duas variantes na Fase 0025; reajuste do `--turf`
e das cores de grupo que assentam nele em 2026-09-21.

## Contexto

- O álbum Panini da Copa 2026 organiza as 48 seleções em 12 super-grupos
  (A–L), cada um com 4 seleções; hoje os super-grupos são só texto, sem
  identidade visual.
- O tema é escuro único ([IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md));
  cores aplicadas precisam de ≥ 3:1 contra `--turf` e `--panel`
  ([IDR 0042](0042-foco-visivel-e-area-de-toque.md)).
- `--notif-red` é a cor da falha na área de avisos
  ([IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md)); usá-la como
  identidade da Coca-Cola, que fecha o catálogo logo acima dos avisos, a
  faria ser lida como erro.

## Decisão

- **Título do super-grupo**: moldura arredondada como a do cabeçalho de seção
  (`--panel`, `border-radius: 12px`, `padding: 7px 12px`), com a **barra
  esquerda de 3px na cor original do grupo** no lugar da borda esquerda de
  1px e fundo com 30% da **cor ajustada** misturada a `--panel`; o texto
  continua em `--gold`
- **Faixa de bandeiras**: fundo de cada bandeira com 60% da **cor ajustada**
  misturada a `--panel` e **barra inferior de 2px com 80% da cor original**,
  **só na ordenação por página**; no hover, o fundo intensifica para 80% da
  cor ajustada e a barra permanece; na ordenação por sigla, fundo neutro
  `--panel` e hover cinza `--border`, inclusive FWC e COC
- O cabeçalho de seção não recebe cor de grupo: recebe a cor da sua seleção
  ([IDR 0046](0046-cores-de-selecoes.md))
- **Duas variantes por cor** (Fase 0025): a cor **original** é o RGB oficial
  sem nenhum ajuste, usada só em traços finos (barra, borda) onde não precisa
  segurar contraste de texto; a cor **ajustada** tem a luminosidade corrigida
  ao mínimo necessário para ≥ 3:1 quando ela vira fundo tingido — mesmo
  croma e matiz da original. Nos grupos em que a original já atinge ≥ 3:1
  sozinha, ajustada = original, e um único token cobre as duas finalidades.

### Cores dos super-grupos

RGB da **tabela oficial de sorteio dos grupos da Copa 2026** (fonte mais
fiel que o hex de origem usado antes, sem procedência registrada) convertido
para OKLCH. Contraste calculado contra `--turf` `oklch(0.30 0.08 150)` — a
superfície onde essas cores realmente aparecem (título do super-grupo e
faixa de bandeiras vivem dentro do `.cabecalho`, que mantém o verde-gramado
mesmo depois da Fase 0025 neutralizar o resto do fundo, ver
[IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md)). B, D, F, I, K e
L precisam de cor ajustada (e a COC, em `--coc-red`) — mais que os quatro da
versão anterior da tabela, porque o `--turf` mais claro reduziu o contraste
de todas as cores que assentam nele (ver Histórico).

| Grupo | RGB oficial | Token | Cor original (OKLCH) | Contraste original | Cor ajustada (OKLCH) | Contraste ajustada |
|---|---|---|---|---|---|---|
| A | 114 181 108 | `--group-a` | `oklch(0.710 0.124 142.3)` | 5,38:1 | = original | — |
| B | 227 6 16 | `--group-b` / `--group-b-raw` | `oklch(0.577 0.234 28.3)` | 2,71:1 | `oklch(0.602 0.234 28.3)` | 3,01:1 |
| C | 224 229 86 | `--group-c` | `oklch(0.892 0.163 111.2)` | 9,77:1 | = original | — |
| D | 7 74 143 | `--group-d` / `--group-d-raw` | `oklch(0.413 0.129 254.8)` | 1,50:1 | `oklch(0.574 0.129 254.8)` | 3,00:1 |
| E | 225 99 12 | `--group-e` | `oklch(0.647 0.177 46.4)` | 3,78:1 | = original | — |
| F | 0 108 84 | `--group-f` / `--group-f-raw` | `oklch(0.473 0.093 170.5)` | 2,06:1 | `oklch(0.562 0.093 170.5)` | 3,01:1 |
| G | 186 192 227 | `--group-g` | `oklch(0.815 0.050 277.6)` | 7,40:1 | = original | — |
| H | 98 175 145 | `--group-h` | `oklch(0.696 0.089 166.7)` | 5,08:1 | = original | — |
| I | 76 53 132 | `--group-i` / `--group-i-raw` | `oklch(0.399 0.127 293.2)` | 1,36:1 | `oklch(0.584 0.127 293.2)` | 3,00:1 |
| J | 251 172 163 | `--group-j` | `oklch(0.818 0.095 26.5)` | 7,26:1 | = original | — |
| K | 215 52 103 | `--group-k` / `--group-k-raw` | `oklch(0.589 0.200 7.6)` | 2,88:1 | `oklch(0.599 0.200 7.6)` | 3,00:1 |
| L | 128 22 33 | `--group-l` / `--group-l-raw` | `oklch(0.392 0.140 21.8)` | 1,29:1 | `oklch(0.590 0.140 21.8)` | 3,00:1 |

`--group-x` continua sendo a cor ajustada (mesmo papel de hoje, usada no
fundo tingido); `--group-x-raw` (B, D, F, I, K e L; a COC em
`--coc-red-raw`) é a cor original, usada na barra/borda.

### Especiais

- **Extras FIFA (FWC)**: `--group-fwc` é alias de `--gold`
  (`oklch(0.78 0.14 85)`, 6,55:1)
- **Coca-Cola (COC)**: `--group-coc` é alias de um token novo, `--coc-red`,
  `oklch(0.597 0.2 29)` (3,00:1), com a variante original em `--coc-red-raw`
  (`oklch(0.55 0.2 29)`, 2,46:1) — vermelho da marca, mais escuro que
  `--notif-red` (`oklch(0.6 0.18 25)`) e separado da semântica de falha

## Consequências

- Identificação visual imediata do super-grupo, agora com a cor oficial do
  sorteio em vez de um hex de origem sem procedência
- Hierarquia: grupo (título do super-grupo, faixa de bandeiras) → seleção
  (cabeçalho de seção, [IDR 0046](0046-cores-de-selecoes.md)) → figurinha;
  super-grupo e seção compartilham a moldura arredondada — a hierarquia
  permanece pela barra esquerda, pela cor (grupo × seleção) e pelo texto
  (`--gold` × `--cream`)
- 15 tokens em `theme.css` continuam (12 cores de grupo, `--coc-red` e 2
  alias) mais 7 tokens `-raw` (B, D, F, I, K, L e `--coc-red-raw`) para a cor
  original
- A cor reforça; o nome "Grupo A" continua no título — cor nunca é o único
  sinal

## Alternativas consideradas

- **Cores mais saturadas**: competiriam com o tema escuro
- **Cores apenas no título**: perderia o contexto na faixa de bandeiras
- **Cores na faixa em todas as ordenações**: na ordenação por sigla não há
  super-grupos visíveis, e a cor viraria ruído sem referência
- **Cor de grupo no cabeçalho de seção**: a Fase 16 aplica a cor da seleção
  no cabeçalho; aplicar as duas em sequência seria trabalho descartável
- **Hex de origem sem ajuste**: D, F, I e L ficariam entre 1,8:1 e 2,6:1
  sobre o fundo
- **COC em `--notif-red`**: a identidade da Coca-Cola se leria como falha
- **Manter o hex de origem sem procedência oficial** (Fase 0025): descartado
  — o humano preferiu a tabela oficial de sorteio, mais fiel à identidade
  real dos grupos
- **Extrair as cores da capa do álbum físico** (Fase 0025): descartado — a
  primeira tentativa de leitura visual da imagem saiu imprecisa; a tabela
  oficial de sorteio é fonte mais confiável para os grupos (a capa do álbum
  vira só referência, [IDR 0054](0054-paleta-da-capa-do-album-fifa-2026.md))

## Histórico

- 2026-09-21 — Esmiuçamento: com o `--turf` clareado para tornar o
  verde-gramado visível ([IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md)),
  a superfície mais clara derruba ~22% do contraste de todas as cores de
  grupo que assentam nela. B, D, F, I, K e L passam a precisar de cor
  ajustada e a COC de `--coc-red` (esta e B e K ganham `-raw` para a cor
  original); a tabela e os contrastes são recalculados contra
  `oklch(0.30 0.08 150)`. Os valores anteriores (contra
  `oklch(0.22 0.06 150)`) ficam no histórico abaixo.

- 2026-09-16 — Planejamento da Fase 0025: fonte das cores trocada do hex de
  origem sem procedência para a tabela oficial de sorteio 2026 (RGB exato);
  cada cor ganha variante original (barra/borda, sem ajuste) e ajustada
  (fundo tingido, luminosidade mínima para ≥ 3:1) — só D, F, I e L
  precisam de ajustada. O humano decidiu isso ao revisar o tema junto com o
  fundo neutro ([IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md)) e
  a cor de seção por bandeira ([IDR 0046](0046-cores-de-selecoes.md)).
  Implementação na Tarefa 0025-0001.

- 2026-09-13 — Esmiuçamento pós-entrega da Fase 0015: a cor ficou sutil demais
  na faixa e o título não tinha moldura. A faixa passa de 20% para 60% de
  mistura, ganha barra inferior de 2px a 80% e o hover intensifica para 80%;
  o título ganha a moldura arredondada da seção, mantém a barra esquerda de
  3px, o tingimento de fundo sobe de 15% (sobre transparente) para 30% (sobre
  `--panel`) e o texto segue `--gold`. Implementação na Fase 0018.

- 2026-09-13 — Segunda revisão do planejamento das Fases 11–17: os valores
  OKLCH finais passam a ser decididos aqui (D, F, I e L com luminosidade
  elevada até 3:1); a COC deixa de ser alias de `--notif-red` e ganha
  `--coc-red`; a mistura do fundo tingido é explicitada por superfície
  (transparente no título, `--panel` na faixa). Antes: só hex, conversão e
  ajuste deixados para a execução; COC em `--notif-red`.
- 2026-09-13 — Revisão do planejamento das Fases 15-17: o cabeçalho de seção,
  que nesta decisão herdaria a cor do grupo (borda esquerda 3px), passa a
  receber a cor da seleção pela decisão do IDR 0046, entregue na Fase 16 —
  aplicar cor de grupo e trocá-la logo em seguida seria trabalho descartável.
  A cor de grupo permanece no título do super-grupo e na faixa de bandeiras.
  Explicitado também que FWC e COC entram como alias de `--gold` e
  `--notif-red`, e que a faixa é neutra na ordenação por sigla, inclusive
  FWC e COC.
