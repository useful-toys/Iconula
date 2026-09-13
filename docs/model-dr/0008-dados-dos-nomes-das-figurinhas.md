<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0008: Dados dos nomes das figurinhas

## Status

Aceito

## Contexto

A Fase 17 acrescenta o nome do jogador/elemento a cada figurinha do catálogo; a decisão de exibição é do [IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md). A primeira listagem de nomes chegou embutida naquele IDR incompleta e com erros — 44 de 48 seleções (faltavam RSA, SEN, SUI e TUR), buracos em QAT06, SCO04, TUN12 e SWE04/12/14/16, posições 15–20 do Paraguai com jogadores da Colômbia e duplicatas em NZL, PAN, POR e UZB — e foi removida. A fonte original do humano, re-provida em 2026-09-13, foi conferida contra esses pontos: 48/48 seleções, grupos idênticos ao catálogo, buracos preenchidos e duplicatas resolvidas — com o Paraguai trazendo apenas 13 dos 18 jogadores.

## Decisão

- **Arquivo**: o dado mora em `src/data/jogadores.js`, consumido só por `src/data/catalogo.js` (`expandirFigurinhas`, via `obterNomeFigurinha`); nenhum componente o importa direto — o catálogo continua a única fonte para o resto do app ([MDR 0006](0006-catalogo-estatico-embutido.md), [TDR 0010](../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)).
- **Forma**: três exportações — `jogadoresPorSelecao` (48 siglas → 18 nomes), `jogadoresFWC` (20), `jogadoresCOC` (14).
- **Mapeamento de posições**: nas seleções, figurinha 01 = "Escudo do time", 13 = "Foto do time", 02–12 = jogadores 1–11, 14–20 = jogadores 12–18; FWC indexa a partir de zero (`FWC00` → `jogadoresFWC[0]`), COC a partir de um.
- **Fonte**: fornecimento do humano (fonte original do álbum), conferido na Tarefa 0017-0001 contra o checklist de defeitos da primeira listagem. COC01–COC14 foi reenviado e confirmado em 2026-09-13, idêntico à provisão anterior; FWC00–FWC19 ainda aguarda reenvio — até lá vale a lista da provisão anterior (registrada no Histórico do [IDR 0047](../idr/0047-nomes-de-jogadores-nas-figurinhas.md)), com a divergência FWC10–19 (pôsteres × "campeãs históricas do FIFA Museum, 1934–2022" da Fase 14) a resolver no reenvio.
- **Grafia**: na transcrição, correções óbvias e diacritics dos nomes de imprensa conhecida (ex.: Matt Freese, Édouard Mendy, Çağlar Soyuncü, José Sá, Rúben Dias, João Félix, Uğurcan Çakır, Hakan Çalhanoğlu, Sadio Mané); nomes não reconhecidos são confirmados com o humano antes de entrar (pendentes: Orlando Gill, PAR 2; Van Valery, TUN 3).
- **Lacuna declarada**: o Paraguai tem 13 jogadores na fonte; PAR16–PAR20 ficam sem nome (`null`), lacuna explícita, completada quando a fonte trouxer os jogadores 14–18.
- **Invariantes** (testes em `src/data/jogadores.test.js` e `catalogo.test.js`): 48 seleções; 47 com 18 nomes, Paraguai com 13; nenhum nome vazio; nenhuma duplicata na mesma seção; 20 FWC e 14 COC; 47×18 + 13 + 48 + 48 + 20 + 14 = 989 figurinhas com nome, 5 declaradamente sem (PAR16–PAR20), 994 no total.

## Consequências

- 989 de 994 figurinhas exibem nome; as 5 do Paraguai exibem só o código até a lacuna ser completada
- O catálogo ganha um campo (`nome`) e um arquivo de dado consumido só por ele — o resto do app, o Firestore e o formato de intercâmbio não mudam ([MDR 0002](0002-schema-do-documento-da-colecao.md), [MDR 0004](0004-formato-de-intercambio-da-colecao.md))

## Alternativas consideradas

- **Listas embutidas no registro de decisão (IDR 0047)**: Rejeitado - dado de 994 nomes não é decisão de interface; a primeira listagem embutida veio defeituosa, sem validação
- **Nomes como literais em `catalogo.js`**: Rejeitado - 859 nomes de jogadores tornariam o arquivo ilegível; arquivo próprio mantém o espírito da expansão por função pura (TDR 0010)
- **Bloquear a fase até completar o Paraguai**: Rejeitado - 5 figurinhas sem nome não seguram 989; a lacuna é declarada e visível
- **Grafia verbatim da fonte**: Rejeitado - erros de transcrição evidentes entrariam como dado
