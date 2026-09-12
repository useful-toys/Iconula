<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0016: Salto pela faixa de bandeiras no cabeçalho

## Status

Aceito — resolve a pendência de mecanismo do
[IDR 0014](0014-salto-direto-para-secao.md). Os ícones dos especiais
ficaram definidos: 🏆 (Extras FIFA) e 🥤 (Coca-Cola) — ver
interface.md. Com o
[IDR 0025](0025-filtro-oculta-secoes-vazias.md), o salto para uma seção
oculta pelo filtro virou pendência de desenho (a faixa lista sempre as
50 seções).

## Contexto

- O IDR 0014 trouxe de volta o salto direto para seção, com o
  mecanismo aberto (combobox era uma opção, não a escolha). Candidatos
  discutidos: grade de siglas em painel, trilha alfabética fixa, campo
  de busca e combobox.
- O usuário decidiu: uma linha com as bandeiras de todas as seções, no
  cabeçalho, rolável para os lados. Tocar na bandeira salta até a
  seção.
- A faixa não cabe inteira em tela alguma (50 ícones) e rola
  horizontalmente — exceção pontual à regra "nenhum componente tem
  rolagem própria" do
  [IDR 0008](0008-uma-unica-pagina-scrollavel.md): a exceção é
  horizontal, rasa (uma linha de ícones) e não compete com a rolagem
  vertical da página — o mal evitado pelo 0008 era o scroll vertical
  aninhado.

## Decisão

- O mecanismo do salto é uma faixa no cabeçalho com as 50 seções:
  bandeira Twemoji da seleção ou ícone temático do especial
- A faixa rola horizontalmente quando não cabe; tocar em um ícone
  salta até a seção correspondente
- A ordem dos ícones acompanha a ordenação vigente (página do álbum ×
  sigla, com especiais conforme IDRs 0013/0019 — hoje o
  [IDR 0028](0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md): 🏆 no
  início, 🥤 no fim)
- Cada ícone é um botão com nome acessível (o nome da seção)

## Consequências

- O salto fica a um toque em qualquer largura de tela, sem teclado e
  sem abrir painel
- A bandeira identifica a seção mais rápido que texto para quem
  conhece o álbum; o nome acessível cobre leitores de tela
- Exceção à regra do scroll único do IDR 0008, registrada lá
- Parte das seções fica fora da vista até rolar a faixa — o preço de
  uma linha única

## Alternativas consideradas

- **Grade de siglas em painel**: precisão sem bandeiras, mas exige
  abrir/fechar um painel
- **Trilha alfabética fixa (A–Z)**: um toque por letra, granularidade
  grossa
- **Campo de busca por código**: preciso, mas abre teclado no celular
- **Combobox**: o formato que o IDR 0004 discutiu — dropdown sobre a
  página
