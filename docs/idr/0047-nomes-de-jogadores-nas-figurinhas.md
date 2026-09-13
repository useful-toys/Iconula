<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0047: Nomes de jogadores nas figurinhas

## Status

Aceito

## Contexto

O álbum Panini da Copa 2026 tem 994 figurinhas. Atualmente, o app exibe apenas o código (ex.: "BRA 05") sem indicar qual jogador ou elemento a figurinha representa. Identificar cada figurinha exige conhecimento prévio do álbum ou consulta externa.

## Decisão

Adicionar o nome do jogador/elemento abaixo do código em cada cartão, com as seguintes regras:

- **Posição**: abaixo do código (sigla + número), em duas linhas, em letra pequena — o código continua como está hoje
- **Jogadores**: primeira linha com os prenomes, em caixa normal; segunda linha com o sobrenome, em caixa alta — transformação apenas visual, o dado mantém a grafia; jogador de nome único exibe só a segunda linha, em caixa alta
- **Nomes de figurinha** (posições fixas, Extras FIFA, Coca-Cola): sem corte — quebram naturalmente em até duas linhas, em caixa normal
- **Truncamento**: ellipsis por linha — nomes longos não quebram o layout
- **Disposições**: visível em lista e álbum
- **Acessibilidade**: o `aria-label` traz o nome completo, por extenso, em caixa normal
- **Fonte tipográfica**: `system-ui`, como o restante do texto que não é título, código de cartão ou nome de seção (`docs/interface.md` § Tipografia), em corpo menor que o código

O dado que alimenta o nome (fonte, forma do arquivo, corte prenomes/sobrenome, mapeamento de posições, grafia e invariantes) é decisão de modelagem — ver [MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md).

## Consequências

- Identificação visual imediata de cada figurinha
- Melhora a experiência de usuários iniciantes
- Aumenta a altura mínima do cartão (duas linhas de letra pequena abaixo do código)
- Nomes longos são truncados por linha, perdendo informação visual (mas acessível via aria-label)

## Alternativas consideradas

- **Tooltip no hover**: Rejeitado - não funciona em mobile, exige interação
- **Nome no lugar do código**: Rejeitado - perde a identificação numérica oficial
- **Nome apenas na disposição álbum**: Rejeitado - inconsistência entre disposições
- **Nome completo sem truncamento**: Rejeitado - quebraria o layout em nomes longos
- **Nome numa linha só, com o sobrenome em caixa alta na mesma linha**: Rejeitado - não cabe em letra pequena legível na largura do cartão

## Histórico

- 2026-09-13 — Esclarecimento do humano: o nome passa a ocupar duas linhas abaixo
  do código — prenomes na primeira (caixa normal), sobrenome na segunda (caixa
  alta); nome único sozinho na segunda linha, em caixa alta; nomes de figurinha
  quebram naturalmente, em caixa normal. Antes: nome numa linha só, truncado com
  ellipsis. O corte prenomes/sobrenome exigido pela exibição virou dado, no MDR
  0008.
- 2026-09-13 — Segunda revisão do planejamento da Fase 17: as decisões de dado
  (fonte, forma de `jogadores.js`, mapeamento de posições, política de grafia,
  lacuna declarada do Paraguai e invariantes) migram para o MDR 0008 —
  modelagem, não interface; este registro fica só com a decisão de exibição.
- 2026-09-13 — Revisão do planejamento da Fase 17: as listas de nomes
  embutidas na primeira versão foram removidas — estavam incompletas (44 de 48
  seleções: faltavam RSA, SEN, SUI e TUR) e com erros (ausências QAT06, SCO04,
  TUN12, SWE04/12/14/16; posições 15-20 do Paraguai com jogadores da Colômbia;
  duplicatas em NZL, PAN, POR e UZB). A fonte do dado volta a ser o
  fornecimento do humano (fonte original), conferido na Tarefa 0017-0001; o
  dado mora em `src/data/jogadores.js`, não aqui.
