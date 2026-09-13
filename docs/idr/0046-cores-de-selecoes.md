<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0046: Cores de seleções

## Status

Aceito

## Contexto

As 48 seleções do álbum não têm identidade visual própria além das bandeiras. Com 48 seleções, identificar cada uma apenas pelo nome ou bandeira pode ser difícil, especialmente em telas pequenas.

## Decisão

Atribuir uma cor distinta a cada seleção, aplicada em:
- **Cabeçalho de seção**: borda completa 1px + fundo com 15% de opacidade (substitui a cor do super-grupo)

### Cores das seleções

| Seleção | Cor | Hex |
|---|---|---|
| ALG (Argélia) | Verde | #3FA65A |
| ARG (Argentina) | Azul médio | #4A6FA5 |
| AUS (Austrália) | Azul médio | #3D6FB0 |
| AUT (Áustria) | Laranja avermelhado | #D2603A |
| BEL (Bélgica) | Vermelho/coral | #D2402E |
| BIH (Bósnia) | Azul médio | #3B6EA5 |
| BRA (Brasil) | Verde | #3FA65A |
| CAN (Canadá) | Salmão/coral | #E8836B |
| CIV (Costa do Marfim) | Verde | #3A9A5C |
| COD (Congo DR) | Azul médio | #4A6FA5 |
| COL (Colômbia) | Laranja/dourado | #D89A3E |
| CPV (Cabo Verde) | Azul-acinzentado | #6B7FB5 |
| CRO (Croácia) | Laranja avermelhado | #D2603A |
| CUW (Curaçao) | Azul médio | #3A6EA8 |
| CZE (Chéquia) | Azul-acinzentado | #5B7FA6 |
| ECU (Equador) | Laranja/dourado | #C8862E |
| EGY (Egito) | Laranja/dourado | #D89A3E |
| ENG (Inglaterra) | Vermelho/coral | #D2402E |
| ESP (Espanha) | Laranja avermelhado | #D2603A |
| FRA (França) | Azul-acinzentado | #6B7FB5 |
| GER (Alemanha) | Vermelho/coral | #D2402E |
| GHA (Gana) | Laranja/dourado | #D89A3E |
| HAI (Haiti) | Azul médio | #3D5FA0 |
| IRN (Irã) | Verde | #3FA65A |
| IRQ (Iraque) | Laranja avermelhado | #D2603A |
| JOR (Jordânia) | Verde | #3FA65A |
| JPN (Japão) | Laranja avermelhado | #D2603A |
| KOR (Coreia do Sul) | Azul médio | #2E5FA3 |
| KSA (Arábia Saudita) | Verde | #4A9A3A |
| MAR (Marrocos) | Laranja avermelhado | #C05A3A |
| MEX (México) | Verde | #3FA65A |
| NED (Países Baixos) | Azul-acinzentado | #6B7FB5 |
| NOR (Noruega) | Azul-acinzentado | #6B7FB5 |
| NZL (Nova Zelândia) | Azul médio | #3D6FB0 |
| PAN (Panamá) | Vermelho/coral | #D2402E |
| PAR (Paraguai) | Laranja avermelhado | #D2603A |
| POR (Portugal) | Verde | #3FA65A |
| QAT (Catar) | Rosa/salmão | #C97A85 |
| RSA (África do Sul) | Laranja | #F4941F |
| SCO (Escócia) | Azul-petróleo | #2E8FA5 |
| SEN (Senegal) | Laranja | #E8942A |
| SUI (Suíça) | Laranja/dourado | #C8792A |
| SWE (Suécia) | Azul médio | #4A6FA5 |
| TUN (Tunísia) | Laranja avermelhado | #D2603A |
| TUR (Turquia) | Vermelho/coral | #E05A4E |
| URU (Uruguai) | Azul médio | #4A6FA5 |
| USA (Estados Unidos) | Azul médio | #4A6FA5 |
| UZB (Uzbequistão) | Azul-petróleo | #3D8FA5 |

### Hierarquia de cores

- **Super-grupo**: borda esquerda 3px + fundo 15% (título do super-grupo)
- **Seleção**: borda completa 1px + fundo 15% (cabeçalho de seção, substitui super-grupo)
- **Faixa de bandeiras**: cor do super-grupo com 20% de opacidade (apenas ordenação por página)

## Consequências

- Identificação visual imediata de cada seleção
- 48 tokens CSS adicionais em `theme.css`
- Hierarquia visual clara: super-grupo → seleção

## Alternativas consideradas

- **Cores apenas na faixa de bandeiras**: Rejeitado - perderia contexto nas seções
- **Cores mais saturadas**: Rejeitado - competiria com o tema escuro
- **Cores em todas as disposições**: Rejeitado - poluição visual na disposição álbum
