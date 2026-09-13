<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0047: Nomes de jogadores nas figurinhas

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 tem 994 figurinhas. Atualmente, o app exibe apenas o código (ex.: "BRA 05") sem indicar qual jogador ou elemento a figurinha representa. Identificar cada figurinha exige conhecimento prévio do álbum ou consulta externa.

## Decisão

Adicionar o nome do jogador/elemento abaixo do código em cada cartão, com as seguintes regras:

- **Posição**: Nome abaixo do código (sigla + número)
- **Truncamento**: Ellipsis (...) para nomes longos
- **Disposições**: Visível em lista e álbum
- **Acessibilidade**: Nome incluído no aria-label
- **Fonte tipográfica**: `system-ui`, como o restante do texto que não é título, código de cartão ou nome de seção (`docs/interface.md` § Tipografia), em corpo menor que o código

### Dados e mapeamento

- A fonte do dado é o fornecimento do humano (fonte original), conferido na execução da Fase 17; o dado mora em `src/data/jogadores.js`, não neste registro
- **Seleções**: 48 × 18 jogadores + "Escudo do time" (01) + "Foto do time" (13)
- **Extras FIFA**: 20 nomes (FWC00-FWC19)
- **Coca-Cola**: 14 nomes (COC01-COC14)
- Mapeamento de posições, nas seleções: 01 escudo; 02-12 jogadores 1-11; 13 foto; 14-20 jogadores 12-18

## Consequências

- Identificação visual imediata de cada figurinha
- Melhora a experiência de usuários iniciantes
- Aumenta a largura mínima do cartão (nome pode ser mais largo que o código)
- Nomes longos são truncados, perdendo informação visual (mas acessível via aria-label)

## Alternativas consideradas

- **Tooltip no hover**: Rejeitado - não funciona em mobile, exige interação
- **Nome no lugar do código**: Rejeitado - perde a identificação numérica oficial
- **Nome apenas na disposição álbum**: Rejeitado - inconsistência entre disposições
- **Nome completo sem truncamento**: Rejeitado - quebraria o layout em nomes longos

## Histórico

- 2026-09-13 — Revisão do planejamento da Fase 17: as listas de nomes
  embutidas na primeira versão deste registro foram removidas — estavam
  incompletas (44 de 48 seleções: faltavam RSA, SEN, SUI e TUR) e com erros
  (ausências QAT06, SCO04, TUN12, SWE04/12/14/16; posições 15-20 do Paraguai
  com jogadores da Colômbia; duplicatas em NZL, PAN, POR e UZB). A fonte do
  dado volta a ser o fornecimento do humano (fonte original), a ser conferido
  na Tarefa 0017-0001; o registro fica só com a decisão de exibição.
