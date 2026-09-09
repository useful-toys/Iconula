<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0025: O filtro oculta as seções que ficam vazias

## Status

Aceito — completa o
[IDR 0001](0001-filtro-de-status-so-na-disposicao-lista.md), que criou
o filtro de status sem dizer o que fazer com a seção sem nenhuma
figurinha correspondente.

## Contexto

Com o filtro em "faltantes", uma seção completa (20/20) não tem
figurinha alguma a mostrar; com o filtro em "repetidas", a maioria das
50 seções fica vazia no começo da coleção. As saídas eram três: manter
o cabeçalho com o corpo vazio, manter o cabeçalho colapsado, ou remover
a seção da vista.

Manter ~45 cabeçalhos vazios entre os poucos resultados anula o ganho
do filtro — a consulta "o que falta do Brasil" vira rolagem de novo.

## Decisão

- Ao filtrar, a seção sem nenhuma figurinha no estado filtrado é
  **ocultada por inteiro** — cabeçalho e corpo
- Na ordenação por ordem do álbum, o super-grupo que fica sem nenhuma
  seção visível também é ocultado
- Voltar o filtro para "todas" traz tudo de volta; ocultar por filtro
  não é colapsar — não altera o estado aberto/fechado das seções
  ([IDR 0020](0020-secoes-colapsaveis-em-qualquer-visualizacao.md))

## Consequências

- A vista filtrada mostra só o que interessa: percorrer os faltantes do
  álbum inteiro fica curto
- O placar do título continua sobre as 994 — o filtro muda a vista, não
  os números
- Salto pela faixa de bandeiras ([IDR 0016](0016-salto-pela-faixa-de-bandeiras.md))
  para uma seção oculta pelo filtro precisa de resposta: a faixa lista
  as 50 seções sempre — pendência de desenho em interface.md
- Coleção completa com filtro em "faltantes" resulta em tela vazia — é a
  leitura correta (não falta nada), e o estado vazio segue sem mensagem
  especial (requisitos.md)

## Alternativas consideradas

- **Cabeçalho sempre visível, corpo vazio**: mantém a estrutura do
  catálogo, mas enche a tela de cabeçalhos sem conteúdo
- **Cabeçalho visível e colapsado**: mesma poluição, com um toque a mais
  para descobrir que não há nada
