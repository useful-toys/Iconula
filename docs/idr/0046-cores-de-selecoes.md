<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0046: Cores de seleções

## Status

Aceito (revisado) — implementação na Fase 0016; cor única por seleção
abandonada e substituída por moldura em degradê com as cores da bandeira,
na Fase 0026.

## Contexto

- As 48 seleções não têm identidade visual própria além das bandeiras;
  identificar cada uma só pelo nome ou pela bandeira é mais lento em tela
  pequena.
- A cor de grupo já ocupa o título do super-grupo e a faixa de bandeiras
  ([IDR 0045](0045-cores-de-super-grupos.md)); o cabeçalho de seção fica
  livre para a cor da seleção.
- **Revisão (Fase 0025/0026)**: a cor única por seleção (versão original
  desta decisão) gerou ruído visual em uso — muitas seleções compartilham
  cor (ver "Cores repetidas" abaixo), e com o fundo geral também colorido
  (antes da neutralização do [IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md))
  a tela ficava carregada demais. Em vez de cor única, a cor da bandeira
  real do país — com suas 2 ou 3 cores de identidade, não uma escolhida
  arbitrariamente — dá mais significado e permite uma moldura em degradê
  que "abraça" a seção inteira, não só o título.

## Decisão

- **Cor pela bandeira, não mais cor única por seleção**: cada seleção usa
  2 ou 3 cores da própria bandeira (repete a 2ª cor quando a bandeira só
  tem duas cores de identidade — cores quase-neutras como branco não
  contam para esse total)
- **Moldura em degradê "abraçando" a seção inteira** (título + grade de
  figurinhas, não só o cabeçalho): cor 1 no topo (onde fica o título), cor
  2 no canto inferior esquerdo, cor 3 no canto inferior direito
- **Interior sem fundo tingido**: a identidade fica só no anel em degradê; o
  interior (título + grade de figurinhas) assenta no `--bg` neutro da página,
  mantendo o texto legível — o fundo lavado foi removido porque deixava o
  título branco sobre branco nas cores claras da bandeira
- **Cor muito escura (preto etc.) é clareada, nunca evitada ou trocada**:
  mesmo método do [IDR 0045](0045-cores-de-super-grupos.md) — sobe a
  luminosidade em OKLCH (croma e matiz mantidos) até contraste ≥ 3:1 contra
  `--bg`/`--panel` (a seção mora no conteúdo neutro da Fase 0025, não
  dentro do `.cabecalho` verde-gramado)
- Vale **nas duas ordenações e nas duas disposições**
- **Especiais**: FWC e COC não têm bandeira própria — `--selection-fwc` e
  `--selection-coc` continuam alias de `--group-fwc` e `--group-coc`
  ([IDR 0045](0045-cores-de-super-grupos.md)), cor única (sem degradê)
- **Cores repetidas entre seleções continuam aceitas**: bandeira, nome e
  sigla distinguem a seção — a cor é reforço, nunca o único sinal

### Cores das seleções

RGB das cores de identidade de cada bandeira (conhecimento geral,
aproximado — sem sampling oficial como a tabela de sorteio dos grupos)
convertido para OKLCH. Cor original é usada sem ajuste no anel; a variante
ajustada (clareada para ≥ 3:1 contra `--bg`) deixou de ser usada quando o
fundo tingido foi removido.

| Seleção | Cor 1 (topo) | Cor 2 (esq. inf.) | Cor 3 (dir. inf.) |
|---|---|---|---|
| ALG (Argélia) | #006233 `oklch(0.44 0.11 154)` 2.3:1 → aj. `oklch(0.50 0.11 154)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #D21034 `oklch(0.55 0.22 21)` 3.2:1 |
| ARG (Argentina) | #75AADB `oklch(0.72 0.09 247)` 7.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #75AADB `oklch(0.72 0.09 247)` 7.0:1 |
| AUS (Austrália) | #00008B `oklch(0.29 0.20 264)` 1.1:1 → aj. `oklch(0.52 0.20 264)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #CC142B `oklch(0.54 0.21 24)` 3.0:1 |
| AUT (Áustria) | #ED2939 `oklch(0.61 0.23 24)` 4.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #ED2939 `oklch(0.61 0.23 24)` 4.1:1 |
| BEL (Bélgica) | #000000 `oklch(0.00 0.00 0)` 1.2:1 → aj. `oklch(0.51 0.00 0)` 3.0:1 | #FDDA24 `oklch(0.89 0.18 97)` 12.5:1 | #ED2939 `oklch(0.61 0.23 24)` 4.1:1 |
| BIH (Bósnia) | #002395 `oklch(0.34 0.19 264)` 1.4:1 → aj. `oklch(0.52 0.19 264)` 3.0:1 | #FECB00 `oklch(0.86 0.18 90)` 11.3:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 |
| BRA (Brasil) | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 | #009739 `oklch(0.59 0.17 148)` 4.5:1 | #002776 `oklch(0.31 0.14 262)` 1.3:1 → aj. `oklch(0.51 0.14 262)` 3.0:1 |
| CAN (Canadá) | #FF0000 `oklch(0.63 0.26 29)` 4.3:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #FF0000 `oklch(0.63 0.26 29)` 4.3:1 |
| CIV (Costa do Marfim) | #FF8200 `oklch(0.73 0.18 54)` 6.9:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #009A44 `oklch(0.60 0.17 150)` 4.7:1 |
| COD (Congo DR) | #007FFF `oklch(0.61 0.21 256)` 4.5:1 | #F7D618 `oklch(0.88 0.18 98)` 12.0:1 | #CE1021 `oklch(0.54 0.21 26)` 3.1:1 |
| COL (Colômbia) | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 | #003893 `oklch(0.37 0.16 261)` 1.6:1 → aj. `oklch(0.51 0.16 261)` 3.0:1 | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 |
| CPV (Cabo Verde) | #003893 `oklch(0.37 0.16 261)` 1.6:1 → aj. `oklch(0.51 0.16 261)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #F7D116 `oklch(0.87 0.18 95)` 11.6:1 |
| CRO (Croácia) | #FF0000 `oklch(0.63 0.26 29)` 4.3:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #171796 `oklch(0.33 0.19 269)` 1.3:1 → aj. `oklch(0.52 0.19 269)` 3.0:1 |
| CUW (Curaçao) | #002B7F `oklch(0.33 0.15 262)` 1.4:1 → aj. `oklch(0.52 0.15 262)` 3.0:1 | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 |
| CZE (Chéquia) | #11457E `oklch(0.39 0.11 254)` 1.8:1 → aj. `oklch(0.51 0.11 254)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #D7141A `oklch(0.56 0.22 28)` 3.3:1 |
| ECU (Equador) | #FFDD00 `oklch(0.90 0.19 98)` 12.8:1 | #034EA2 `oklch(0.44 0.15 257)` 2.1:1 → aj. `oklch(0.51 0.15 257)` 3.0:1 | #ED1C24 `oklch(0.60 0.23 27)` 3.9:1 |
| EGY (Egito) | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #000000 `oklch(0.00 0.00 0)` 1.2:1 → aj. `oklch(0.51 0.00 0)` 3.0:1 |
| ENG (Inglaterra) | #CE1124 `oklch(0.54 0.21 25)` 3.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #CE1124 `oklch(0.54 0.21 25)` 3.1:1 |
| ESP (Espanha) | #AA151B `oklch(0.47 0.18 26)` 2.3:1 → aj. `oklch(0.53 0.18 26)` 3.0:1 | #F1BF00 `oklch(0.83 0.17 90)` 10.0:1 | #AA151B `oklch(0.47 0.18 26)` 2.3:1 → aj. `oklch(0.53 0.18 26)` 3.0:1 |
| FRA (França) | #0055A4 `oklch(0.45 0.15 254)` 2.3:1 → aj. `oklch(0.51 0.15 254)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #EF4135 `oklch(0.63 0.21 29)` 4.5:1 |
| GER (Alemanha) | #000000 `oklch(0.00 0.00 0)` 1.2:1 → aj. `oklch(0.51 0.00 0)` 3.0:1 | #DD0000 `oklch(0.56 0.23 29)` 3.3:1 | #FFCE00 `oklch(0.87 0.18 91)` 11.5:1 |
| GHA (Gana) | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 | #006B3F `oklch(0.46 0.11 157)` 2.6:1 → aj. `oklch(0.50 0.11 157)` 3.0:1 |
| HAI (Haiti) | #00209F `oklch(0.35 0.20 264)` 1.4:1 → aj. `oklch(0.52 0.20 264)` 3.0:1 | #D21034 `oklch(0.55 0.22 21)` 3.2:1 | #00209F `oklch(0.35 0.20 264)` 1.4:1 → aj. `oklch(0.52 0.20 264)` 3.0:1 |
| IRN (Irã) | #239F40 `oklch(0.62 0.17 147)` 5.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #DA0000 `oklch(0.56 0.23 29)` 3.3:1 |
| IRQ (Iraque) | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #000000 `oklch(0.00 0.00 0)` 1.2:1 → aj. `oklch(0.51 0.00 0)` 3.0:1 |
| JOR (Jordânia) | #000000 `oklch(0.00 0.00 0)` 1.2:1 → aj. `oklch(0.51 0.00 0)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 |
| JPN (Japão) | #BC002D `oklch(0.50 0.20 21)` 2.6:1 → aj. `oklch(0.54 0.20 21)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #BC002D `oklch(0.50 0.20 21)` 2.6:1 → aj. `oklch(0.54 0.20 21)` 3.0:1 |
| KOR (Coreia do Sul) | #CD2E3A `oklch(0.56 0.19 23)` 3.3:1 | #0047A0 `oklch(0.42 0.16 258)` 2.0:1 → aj. `oklch(0.51 0.16 258)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 |
| KSA (Arábia Saudita) | #006C35 `oklch(0.47 0.12 152)` 2.6:1 → aj. `oklch(0.50 0.12 152)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #006C35 `oklch(0.47 0.12 152)` 2.6:1 → aj. `oklch(0.50 0.12 152)` 3.0:1 |
| MAR (Marrocos) | #C1272D `oklch(0.53 0.19 25)` 2.9:1 → aj. `oklch(0.53 0.19 25)` 3.0:1 | #006233 `oklch(0.44 0.11 154)` 2.3:1 → aj. `oklch(0.50 0.11 154)` 3.0:1 | #C1272D `oklch(0.53 0.19 25)` 2.9:1 → aj. `oklch(0.53 0.19 25)` 3.0:1 |
| MEX (México) | #006341 `oklch(0.44 0.10 161)` 2.3:1 → aj. `oklch(0.50 0.10 161)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #CE1126 `oklch(0.54 0.21 25)` 3.1:1 |
| NED (Países Baixos) | #AE1C28 `oklch(0.49 0.18 24)` 2.5:1 → aj. `oklch(0.53 0.18 24)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #21468B `oklch(0.41 0.12 261)` 1.9:1 → aj. `oklch(0.51 0.12 261)` 3.0:1 |
| NOR (Noruega) | #EF2B2D `oklch(0.61 0.23 27)` 4.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #00205B `oklch(0.27 0.11 261)` 1.1:1 → aj. `oklch(0.51 0.11 261)` 3.0:1 |
| NZL (Nova Zelândia) | #00247D `oklch(0.31 0.15 263)` 1.3:1 → aj. `oklch(0.52 0.15 263)` 3.0:1 | #CC142B `oklch(0.54 0.21 24)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 |
| PAN (Panamá) | #005293 `oklch(0.43 0.13 251)` 2.2:1 → aj. `oklch(0.51 0.13 251)` 3.0:1 | #DA121A `oklch(0.56 0.22 28)` 3.3:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 |
| PAR (Paraguai) | #D52B1E `oklch(0.57 0.21 30)` 3.4:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #0038A8 `oklch(0.40 0.19 262)` 1.7:1 → aj. `oklch(0.52 0.19 262)` 3.0:1 |
| POR (Portugal) | #046A38 `oklch(0.46 0.12 154)` 2.6:1 → aj. `oklch(0.50 0.12 154)` 3.0:1 | #DA020E `oklch(0.56 0.23 28)` 3.3:1 | #FFCC00 `oklch(0.87 0.18 90)` 11.4:1 |
| QAT (Catar) | #8A1538 `oklch(0.42 0.15 10)` 1.8:1 → aj. `oklch(0.53 0.15 10)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #8A1538 `oklch(0.42 0.15 10)` 1.8:1 → aj. `oklch(0.53 0.15 10)` 3.0:1 |
| RSA (África do Sul) | #007A4D `oklch(0.51 0.12 159)` 3.2:1 | #FFB612 `oklch(0.82 0.17 79)` 9.8:1 | #DE3831 `oklch(0.59 0.20 28)` 3.9:1 |
| SCO (Escócia) | #0065BD `oklch(0.51 0.16 253)` 2.9:1 → aj. `oklch(0.51 0.16 253)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #0065BD `oklch(0.51 0.16 253)` 2.9:1 → aj. `oklch(0.51 0.16 253)` 3.0:1 |
| SEN (Senegal) | #00853F `oklch(0.54 0.15 151)` 3.6:1 | #FDEF42 `oklch(0.94 0.18 105)` 14.4:1 | #E31B23 `oklch(0.58 0.23 27)` 3.6:1 |
| SUI (Suíça) | #FF0000 `oklch(0.63 0.26 29)` 4.3:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #FF0000 `oklch(0.63 0.26 29)` 4.3:1 |
| SWE (Suécia) | #006AA7 `oklch(0.51 0.13 244)` 3.0:1 | #FECC02 `oklch(0.86 0.18 91)` 11.4:1 | #006AA7 `oklch(0.51 0.13 244)` 3.0:1 |
| TUN (Tunísia) | #E70013 `oklch(0.58 0.24 28)` 3.6:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #E70013 `oklch(0.58 0.24 28)` 3.6:1 |
| TUR (Turquia) | #E30A17 `oklch(0.58 0.23 28)` 3.5:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #E30A17 `oklch(0.58 0.23 28)` 3.5:1 |
| URU (Uruguai) | #0038A8 `oklch(0.40 0.19 262)` 1.7:1 → aj. `oklch(0.52 0.19 262)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #FCD116 `oklch(0.87 0.18 93)` 11.7:1 |
| USA (Estados Unidos) | #3C3B6E `oklch(0.38 0.09 282)` 1.7:1 → aj. `oklch(0.52 0.09 282)` 3.0:1 | #B22234 `oklch(0.50 0.18 21)` 2.6:1 → aj. `oklch(0.53 0.18 21)` 3.0:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 |
| UZB (Uzbequistão) | #0099B5 `oklch(0.63 0.11 217)` 5.1:1 | #FFFFFF `oklch(1.00 0.00 90)` 17.2:1 | #1EB53A `oklch(0.68 0.20 145)` 6.3:1 |

Contraste calculado contra `--bg` `oklch(0.22 0 0)` (fundo neutro da
Fase 0025). Branco não precisa de ajuste (contraste já alto); a cor original
é a que aparece no anel — a variante ajustada deixou de ser usada quando o
fundo tingido foi removido. Valores de RGB são aproximação de conhecimento
geral de bandeiras, não
sampling oficial — a tarefa de implementação pode corrigir tom a tom sem
reabrir esta decisão (nível 1/2, ver `docs/plano/CLAUDE.md` § Impedimentos).

### Hierarquia de cores

- **Super-grupo**: moldura da seção + barra esquerda 3px + fundo 30% (título
  do super-grupo)
- **Seleção**: anel em degradê contínuo de 2-3 cores (cor original)
  abraçando título e grade de figurinhas, com o interior em `--bg` neutro —
  sem fundo tingido, sem borda sólida de cor única
- **Faixa de bandeiras**: fundo 60% + barra inferior 2px a 80% (só na
  ordenação por página)

## Consequências

- Identificação visual pela bandeira real do país, não por uma cor
  escolhida sem critério — menos ruído, mais significado
- Até 144 tokens novos em `theme.css` (até 3 cores × 48 seleções, menos as
  repetições de cor 2/3 quando a bandeira só tem duas cores de identidade)
- Seleções com cores de bandeira parecidas continuam podendo se parecer
  entre si — bandeira, nome e sigla seguem sendo a distinção primária
- Perde-se a simplicidade de "um token por seleção" da versão anterior:
  mais tokens, mas cada um rastreável a uma cor real da bandeira

## Alternativas consideradas

- **Cores apenas na faixa de bandeiras**: perderia contexto nas seções
- **Cores mais saturadas**: competiriam com o tema escuro
- **Cor só na disposição lista**: a mesma seção mudaria de aparência ao
  trocar de disposição
- **Paleta refeita com 4 cores distintas por grupo**: descartada no
  planejamento original — as cores de origem remetem às bandeiras, e a
  repetição não impede identificar a seção
- **Hex de origem sem ajuste**: HAI e KOR ficariam abaixo de 3:1
- **Manter cor única por seleção** (Fase 0025/0026): descartada — o humano
  achou que gerava ruído visual e deixou de ajudar a distinguir as seções
- **Cabeçalho de seção herda a cor do super-grupo** (Fase 0026): descartada
  — perderia a identidade própria de cada time, e a cor de grupo já aparece
  no título do super-grupo e na faixa de bandeiras
- **Evitar cores muito escuras da bandeira** (Fase 0026): descartada — o
  humano preferiu clarear (preservando a cor real da bandeira) a substituir
  por outra cor da mesma bandeira ou omitir

## Histórico

- 2026-09-16 — Correção da Fase 0026 (PR #64, 2ª rodada): o fundo tingido
  deixava o título branco sobre branco nas cores claras da bandeira (ex.: o
  amarelo do Brasil e do Equador, lavado sobre `--panel`). O fundo foi
  removido — a identidade fica só no anel em degradê, e o interior (título
  + grade) assenta no `--bg` neutro da página.

- 2026-09-16 — Correção da Fase 0026 (PR #64): o degradê em duas metades
  tinha emenda visível (a cor 2 não transicionava suavemente para a cor 3) e
  o fundo a 25% ficou sutil demais. A moldura e o fundo passam a degradê
  contínuo — cor 1 cobrindo o topo inteiro e esvaindo sobre o degradê
  horizontal cor 2 → cor 3 (esquerda → direita) —, o fundo sobe de 25% para
  45% de mistura com `--panel`, e a moldura ganha respiro interno de 10px
  para as figurinhas não encostarem nela.

- 2026-09-16 — Planejamento da Fase 0025/0026: cor única por seleção
  abandonada; substituída por moldura+fundo em degradê com 2-3 cores reais
  da bandeira do país (não mais um "hex de origem" sem procedência),
  abraçando a seção inteira (título + grade), com o mesmo fundo em degradê
  a 25%. Cor muito escura passa a ser clareada, nunca evitada. Contraste
  recalculado contra `--bg` (fundo neutro da Fase 0025), não mais
  `--turf`. Implementação nas Tarefas 0026-0001 e 0026-0002.

- 2026-09-13 — Esmiuçamento: o fundo de 15% ficou sutil demais (mesmo problema
  dos 20% antigos da faixa); passa a 45% da cor da seleção misturada a
  `--panel`, mantendo a borda completa de 1px. Implementação a planejar
  (/planejar).
- 2026-09-13 — Revisão do planejamento das Fases 11–17: valores OKLCH finais
  decididos aqui (HAI e KOR com luminosidade elevada); aplicação nas duas
  disposições, sem a antiga alternativa "cores em todas as disposições:
  rejeitado" que contradizia a Fase 16; FWC e COC como alias das cores de
  grupo; cores repetidas aceitas como consequência; retirada a menção
  "substitui a cor do super-grupo", que já não valia desde a primeira
  revisão do IDR 0045. Antes: só hex, sem Histórico.
