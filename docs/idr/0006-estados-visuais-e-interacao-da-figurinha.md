<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0006: Estados visuais e interação da figurinha

## Status

Aceito. A pendência de reforço não-cromático foi resolvida: faltante =
cartão esvaziado (opacidade reduzida, borda tracejada), colada =
preenchido — registrado em interface.md.

Quatro pontos foram revistos depois:

- O selo `×N` conta as **unidades sobrando** (contagem − 1), não a
  contagem — [IDR 0021](0021-selo-conta-unidades-sobrando.md); a
  consequência abaixo que fala em "N−1 sobrando" lê-se com N = contagem
- A pendência "zerar contagem ainda não tem gesto definido" deixou de
  existir: não há ação de zerar, só incremento e decremento
  (requisitos.md); o desfazer cobre o engano
  ([IDR 0010](0010-desfazer-ajustes-em-vez-de-confirmacoes.md))
- As cores exatas dos três estados são as da paleta do
  [IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md), em
  interface.md
- O "ícone de menos que surge no canto" ganhou condição e lugar
  definidos — só existe com contagem ≥ 1 e fica dentro do cartão, no
  canto inferior esquerdo ([IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md))

## Contexto

O coração do produto é registrar contagens por figurinha. O modelo de
domínio (`requisitos.md`) deriva três estados da contagem: faltante (0),
colada (1) e repetida (≥ 2, com n−1 sobrando). A figurinha em tela
precisa comunicar o estado de imediato — o fluxo essencial de consultar
é olhar a página e ver o que falta — e aceitar registro num toque — o
fluxo essencial de cadastrar.

A POC apresentou a linguagem: cartões com o código em duas linhas (como
impresso no cromo físico), bordas perfuradas (efeito selo), três cores
bem diferenciadas por estado, tocar soma uma unidade e um ícone de
menos surge no canto para remover.

## Decisão

- Cada figurinha é um cartão com o código em duas linhas — sigla +
  número, como impresso na figurinha física
- Estado codificado por cor: **cinza** = faltante; **verde** = uma
  unidade; **laranja com selinho "×N"** = repetidas (N−1 sobrando)
- Tocar/clicar na figurinha soma uma unidade; um ícone de menos surge
  no canto ao tocar para remover uma
- Figurinhas metalizadas/especiais ganham uma estrelinha no canto

## Consequências

- Os três estados do domínio ficam visíveis de longe, sem abrir nada —
  na disposição grade, a comparação com o álbum físico é imediata
- Tocar-suma torna o cadastro mais rápido que checkbox ou campo
  numérico
- Distinguir faltante de colada depende **só de cor** — daltonismo
  verde/laranja é o pior caso; o ×N diferencia as repetidas, mas
  faltante vs. colada precisa de reforço não-cromático (pendência de
  acessibilidade em `interface.md`)
- Zerar contagem ainda não tem gesto definido (pendência em
  `interface.md`)

## Alternativas consideradas

- **Checkbox tem/não-tem**: mais simples, mas perde a contagem de
  repetidas — o núcleo do domínio de trocas
- **Campo numérico editável por figurinha**: preciso, mas lento demais
  para o cadastro em rajada (abrir envelope e lançar 7 números)
- **Botões separados "colar"/"repetir"**: dois estados visuais a mais e
  mais atrito no fluxo essencial
