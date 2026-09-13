<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0045: Cores de super-grupos

## Status

Aceito — implementação na Fase 0015.

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

- **Título do super-grupo**: borda esquerda de 3px na cor do grupo e fundo
  com 15% dela misturada ao transparente — o título não tem painel e fica
  sobre `--turf`; o texto continua em `--gold`
- **Faixa de bandeiras**: fundo de cada bandeira com 55–60% da cor do grupo
  misturada a `--panel`, **só na ordenação por página**; na ordenação por
  sigla, fundo neutro `--panel`, inclusive FWC e COC. Os 20% originais se
  mostraram sutis demais no primeiro uso real; o valor exato dentro da faixa
  é confirmado na execução (Tarefa 0015-0004) e registrado aqui
- O cabeçalho de seção não recebe cor de grupo: recebe a cor da sua seleção
  ([IDR 0046](0046-cores-de-selecoes.md))

### Cores dos super-grupos

Hex de origem convertido para OKLCH; os grupos D, F, I e L tiveram a
luminosidade elevada até ≥ 3:1 contra `--turf` (a superfície mais clara das
duas), mantendo croma e matiz.

| Grupo | Cor | Hex de origem | Token | Valor | Contraste sobre `--turf` |
|---|---|---|---|---|---|
| A | Verde | #4CAF50 | `--group-a` | `oklch(0.67 0.162 144)` | 6,06:1 |
| B | Vermelho | #E53935 | `--group-b` | `oklch(0.61 0.209 27)` | 4,06:1 |
| C | Verde-limão | #C0CA33 | `--group-c` | `oklch(0.81 0.165 113)` | 9,67:1 |
| D | Azul-índigo | #3F51B5 | `--group-d` | `oklch(0.53 0.159 271)` (de L 0.48) | 3,11:1 |
| E | Laranja | #F4511E | `--group-e` | `oklch(0.65 0.208 36)` | 4,81:1 |
| F | Verde-azulado | #00695C | `--group-f` | `oklch(0.51 0.084 180)` (de L 0.47) | 3,10:1 |
| G | Lilás | #B39DDB | `--group-g` | `oklch(0.74 0.091 300)` | 7,18:1 |
| H | Azul-petróleo | #26A69A | `--group-h` | `oklch(0.66 0.107 185)` | 5,76:1 |
| I | Roxo | #6A1B9A | `--group-i` | `oklch(0.54 0.19 308)` (de L 0.42) | 3,06:1 |
| J | Salmão | #E8B4A8 | `--group-j` | `oklch(0.81 0.063 33)` | 9,23:1 |
| K | Rosa | #EC407A | `--group-k` | `oklch(0.64 0.21 5)` | 4,54:1 |
| L | Vermelho-vinho | #8D2E2E | `--group-l` | `oklch(0.53 0.129 24)` (de L 0.44) | 3,02:1 |

### Especiais

- **Extras FIFA (FWC)**: `--group-fwc` é alias de `--gold`
  (`oklch(0.78 0.14 85)`, 8,44:1)
- **Coca-Cola (COC)**: `--group-coc` é alias de um token novo, `--coc-red`,
  `oklch(0.55 0.2 29)` (3,18:1) — vermelho da marca, mais escuro que
  `--notif-red` (`oklch(0.6 0.18 25)`) e separado da semântica de falha

## Consequências

- Identificação visual imediata do super-grupo
- Hierarquia: grupo (título do super-grupo, faixa de bandeiras) → seleção
  (cabeçalho de seção, [IDR 0046](0046-cores-de-selecoes.md)) → figurinha
- 15 tokens novos em `theme.css`: 12 cores de grupo, `--coc-red` e 2 alias
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
- **Fundo tingido sempre sobre `--panel`**: o título do super-grupo ganharia
  um painel que hoje não tem, mais pesado que o resto

## Histórico

- 2026-09-13 — Ajuste da Fase 15 (Tarefa 0015-0004): a mistura da faixa sobe
  de 20% para 55–60% — no primeiro uso real os 20% não se liam como
  identidade de grupo. Antes: 20% sobre `--panel`, só na ordenação por
  página.
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
