<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0046: Cores de seleções

## Status

Aceito — implementação na Fase 0016.

## Contexto

- As 48 seleções não têm identidade visual própria além das bandeiras;
  identificar cada uma só pelo nome ou pela bandeira é mais lento em tela
  pequena.
- A cor de grupo já ocupa o título do super-grupo e a faixa de bandeiras
  ([IDR 0045](0045-cores-de-super-grupos.md)); o cabeçalho de seção fica
  livre para a cor da seleção.

## Decisão

- **Cabeçalho de seção**: borda completa de 1px na cor da seleção, no lugar
  da borda `--border`, e fundo com 15% dela misturada a `--panel`; raio,
  padding, texto em `--cream` e números em `--muted` não mudam
- Vale **nas duas ordenações e nas duas disposições**
- **Especiais**: `--selection-fwc` e `--selection-coc` são alias de
  `--group-fwc` e `--group-coc` (IDR 0045)
- **Cores repetidas entre seleções são aceitas**, inclusive entre seleções
  vizinhas do mesmo grupo (ALG/JOR, JPN/TUN, FRA/NOR, ENG/PAN): bandeira,
  nome e sigla distinguem as seções; a cor é reforço

### Cores das seleções

Hex de origem convertido para OKLCH; HAI e KOR tiveram a luminosidade
elevada até ≥ 3:1 contra `--turf`, mantendo croma e matiz.

| Seleção | Cor | Hex de origem | Token | Valor | Contraste sobre `--turf` |
|---|---|---|---|---|---|
| ALG (Argélia) | Verde | #3FA65A | `--selection-alg` | `oklch(0.65 0.147 149)` | 5,60:1 |
| ARG (Argentina) | Azul médio | #4A6FA5 | `--selection-arg` | `oklch(0.54 0.095 258)` | 3,36:1 |
| AUS (Austrália) | Azul médio | #3D6FB0 | `--selection-aus` | `oklch(0.54 0.116 256)` | 3,35:1 |
| AUT (Áustria) | Laranja avermelhado | #D2603A | `--selection-aut` | `oklch(0.62 0.154 39)` | 4,39:1 |
| BEL (Bélgica) | Vermelho/coral | #D2402E | `--selection-bel` | `oklch(0.58 0.186 30)` | 3,64:1 |
| BIH (Bósnia) | Azul médio | #3B6EA5 | `--selection-bih` | `oklch(0.53 0.103 252)` | 3,23:1 |
| BRA (Brasil) | Verde | #3FA65A | `--selection-bra` | `oklch(0.65 0.147 149)` | 5,60:1 |
| CAN (Canadá) | Salmão/coral | #E8836B | `--selection-can` | `oklch(0.71 0.13 34)` | 6,29:1 |
| CIV (Costa do Marfim) | Verde | #3A9A5C | `--selection-civ` | `oklch(0.61 0.13 152)` | 4,77:1 |
| COD (Congo DR) | Azul médio | #4A6FA5 | `--selection-cod` | `oklch(0.54 0.095 258)` | 3,36:1 |
| COL (Colômbia) | Laranja/dourado | #D89A3E | `--selection-col` | `oklch(0.73 0.129 74)` | 6,99:1 |
| CPV (Cabo Verde) | Azul-acinzentado | #6B7FB5 | `--selection-cpv` | `oklch(0.6 0.086 268)` | 4,28:1 |
| CRO (Croácia) | Laranja avermelhado | #D2603A | `--selection-cro` | `oklch(0.62 0.154 39)` | 4,39:1 |
| CUW (Curaçao) | Azul médio | #3A6EA8 | `--selection-cuw` | `oklch(0.53 0.108 253)` | 3,23:1 |
| CZE (Chéquia) | Azul-acinzentado | #5B7FA6 | `--selection-cze` | `oklch(0.59 0.073 251)` | 4,16:1 |
| ECU (Equador) | Laranja/dourado | #C8862E | `--selection-ecu` | `oklch(0.67 0.128 69)` | 5,55:1 |
| EGY (Egito) | Laranja/dourado | #D89A3E | `--selection-egy` | `oklch(0.73 0.129 74)` | 6,99:1 |
| ENG (Inglaterra) | Vermelho/coral | #D2402E | `--selection-eng` | `oklch(0.58 0.186 30)` | 3,64:1 |
| ESP (Espanha) | Laranja avermelhado | #D2603A | `--selection-esp` | `oklch(0.62 0.154 39)` | 4,39:1 |
| FRA (França) | Azul-acinzentado | #6B7FB5 | `--selection-fra` | `oklch(0.6 0.086 268)` | 4,28:1 |
| GER (Alemanha) | Vermelho/coral | #D2402E | `--selection-ger` | `oklch(0.58 0.186 30)` | 3,64:1 |
| GHA (Gana) | Laranja/dourado | #D89A3E | `--selection-gha` | `oklch(0.73 0.129 74)` | 6,99:1 |
| HAI (Haiti) | Azul médio | #3D5FA0 | `--selection-hai` | `oklch(0.52 0.112 262)` (de L 0.49) | 3,06:1 |
| IRN (Irã) | Verde | #3FA65A | `--selection-irn` | `oklch(0.65 0.147 149)` | 5,60:1 |
| IRQ (Iraque) | Laranja avermelhado | #D2603A | `--selection-irq` | `oklch(0.62 0.154 39)` | 4,39:1 |
| JOR (Jordânia) | Verde | #3FA65A | `--selection-jor` | `oklch(0.65 0.147 149)` | 5,60:1 |
| JPN (Japão) | Laranja avermelhado | #D2603A | `--selection-jpn` | `oklch(0.62 0.154 39)` | 4,39:1 |
| KOR (Coreia do Sul) | Azul médio | #2E5FA3 | `--selection-kor` | `oklch(0.52 0.122 257)` (de L 0.49) | 3,07:1 |
| KSA (Arábia Saudita) | Verde | #4A9A3A | `--selection-ksa` | `oklch(0.61 0.154 140)` | 4,76:1 |
| MAR (Marrocos) | Laranja avermelhado | #C05A3A | `--selection-mar` | `oklch(0.59 0.139 38)` | 3,90:1 |
| MEX (México) | Verde | #3FA65A | `--selection-mex` | `oklch(0.65 0.147 149)` | 5,60:1 |
| NED (Países Baixos) | Azul-acinzentado | #6B7FB5 | `--selection-ned` | `oklch(0.6 0.086 268)` | 4,28:1 |
| NOR (Noruega) | Azul-acinzentado | #6B7FB5 | `--selection-nor` | `oklch(0.6 0.086 268)` | 4,28:1 |
| NZL (Nova Zelândia) | Azul médio | #3D6FB0 | `--selection-nzl` | `oklch(0.54 0.116 256)` | 3,35:1 |
| PAN (Panamá) | Vermelho/coral | #D2402E | `--selection-pan` | `oklch(0.58 0.186 30)` | 3,64:1 |
| PAR (Paraguai) | Laranja avermelhado | #D2603A | `--selection-par` | `oklch(0.62 0.154 39)` | 4,39:1 |
| POR (Portugal) | Verde | #3FA65A | `--selection-por` | `oklch(0.65 0.147 149)` | 5,60:1 |
| QAT (Catar) | Rosa/salmão | #C97A85 | `--selection-qat` | `oklch(0.67 0.099 11)` | 5,43:1 |
| RSA (África do Sul) | Laranja | #F4941F | `--selection-rsa` | `oklch(0.75 0.162 64)` | 7,38:1 |
| SCO (Escócia) | Azul-petróleo | #2E8FA5 | `--selection-sco` | `oklch(0.6 0.093 216)` | 4,46:1 |
| SEN (Senegal) | Laranja | #E8942A | `--selection-sen` | `oklch(0.74 0.15 66)` | 7,15:1 |
| SUI (Suíça) | Laranja/dourado | #C8792A | `--selection-sui` | `oklch(0.65 0.133 61)` | 5,08:1 |
| SWE (Suécia) | Azul médio | #4A6FA5 | `--selection-swe` | `oklch(0.54 0.095 258)` | 3,36:1 |
| TUN (Tunísia) | Laranja avermelhado | #D2603A | `--selection-tun` | `oklch(0.62 0.154 39)` | 4,39:1 |
| TUR (Turquia) | Vermelho/coral | #E05A4E | `--selection-tur` | `oklch(0.64 0.17 28)` | 4,68:1 |
| URU (Uruguai) | Azul médio | #4A6FA5 | `--selection-uru` | `oklch(0.54 0.095 258)` | 3,36:1 |
| USA (Estados Unidos) | Azul médio | #4A6FA5 | `--selection-usa` | `oklch(0.54 0.095 258)` | 3,36:1 |
| UZB (Uzbequistão) | Azul-petróleo | #3D8FA5 | `--selection-uzb` | `oklch(0.61 0.085 218)` | 4,63:1 |

### Hierarquia de cores

- **Super-grupo**: borda esquerda 3px + fundo 15% (título do super-grupo)
- **Seleção**: borda completa 1px + fundo 15% (cabeçalho de seção)
- **Faixa de bandeiras**: cor do super-grupo com 55–60% (só na ordenação por
  página)

## Consequências

- Identificação visual imediata de cada seleção
- 50 tokens novos em `theme.css`: 48 seleções e 2 alias
- Seleções com a mesma cor podem aparecer lado a lado; a distinção fica com
  bandeira, nome e sigla

## Alternativas consideradas

- **Cores apenas na faixa de bandeiras**: perderia contexto nas seções
- **Cores mais saturadas**: competiriam com o tema escuro
- **Cor só na disposição lista**: a mesma seção mudaria de aparência ao
  trocar de disposição
- **Paleta refeita com 4 cores distintas por grupo**: descartada no
  planejamento — as cores de origem remetem às bandeiras, e a repetição não
  impede identificar a seção
- **Hex de origem sem ajuste**: HAI e KOR ficariam abaixo de 3:1

## Histórico

- 2026-09-13 — Ajuste da Fase 15 (Tarefa 0015-0004): a linha da faixa passa a
  refletir a mistura de 55–60% decidida no
  [IDR 0045](0045-cores-de-super-grupos.md). Antes: 20%.
- 2026-09-13 — Revisão do planejamento das Fases 11–17: valores OKLCH finais
  decididos aqui (HAI e KOR com luminosidade elevada); aplicação nas duas
  disposições, sem a antiga alternativa "cores em todas as disposições:
  rejeitado" que contradizia a Fase 16; FWC e COC como alias das cores de
  grupo; cores repetidas aceitas como consequência; retirada a menção
  "substitui a cor do super-grupo", que já não valia desde a primeira
  revisão do IDR 0045. Antes: só hex, sem Histórico.
