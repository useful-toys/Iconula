<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0014: Salto direto para seção

## Status

Aceito — retoma a ideia que o
[IDR 0004](0004-rejeitado-ir-para-secao-e-salto-de-navegacao.md) rejeitou.
Mecanismo decidido: faixa de bandeiras no cabeçalho
([IDR 0016](0016-salto-pela-faixa-de-bandeiras.md)).

## Contexto

O IDR 0004 registrou o diagnóstico — "ir para" é salto de navegação,
não filtro — mas rejeitou o seletor: com uma UX de percurso
suficientemente boa, rolar até a seção desejada seria o caminho natural.
Na prática, com 50 seções e ~994 figurinhas, rolar até uma seção
distante no celular (BRA, pág. 24, no meio do catálogo) é percurso
longo demais.

O usuário decidiu: o recurso de pular rápido para uma seção específica
volta — sem prender o formato a um combobox.

## Decisão

- Existe um recurso de salto direto para uma seção específica, nas duas
  ordenações e nas duas disposições
- O salto move o percurso até a seção — o catálogo permanece inteiro,
  antes e depois dele; nunca filtra a vista (o diagnóstico do IDR 0004
  segue válido)
- O mecanismo é aberto (pendência de desenho em interface.md): combobox
  é uma opção, não a escolha feita

## Consequências

- O diagnóstico filtro × salto do IDR 0004 volta a valer na íntegra
- A rolagem continua sendo o percurso; o salto é atalho, não paradigma
  alternativo
- A regra "sem seletor ir para" da seção UX de requisitos.md é revogada
- O mecanismo exato fica pendente — ver Pendências de interface

## Alternativas consideradas

- **Só rolagem** (status quo pós-0004): percurso puro, lento para
  seções distantes — rejeitado na prática
- **Combo que filtra a vista a uma seção** (padrão concorrentes):
  esconde o resto do catálogo e quebra o percurso único — segue
  descartado pelo diagnóstico do 0004
