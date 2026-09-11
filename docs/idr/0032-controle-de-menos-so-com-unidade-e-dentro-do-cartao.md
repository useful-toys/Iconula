<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0032: O controle de menos só existe com unidade e fica dentro do cartão

## Status

Aceito — revisa o [IDR 0030](0030-controle-de-menos-do-cartao.md), que
decidiu *quando* o controle aparece sem condicioná-lo à contagem, e
completa o [IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md),
que só dizia "um ícone de menos surge no canto". Nasce da observação do
app com o catálogo inteiro em tela.

## Contexto

A Tarefa 0002-0003 entregou o controle de menos como um botão sempre
presente, transbordando o canto superior esquerdo do cartão. Com as 994
figurinhas em tela, dois problemas ficaram evidentes:

- **Alvo morto na figurinha faltante**: decrementar em 0 não faz nada —
  é no-op declarado em `requisitos.md` e em `interface.md`. Numa coleção
  no começo, quase todos os 994 cartões estão em 0, então a grade
  inteira oferece um botão que promete uma ação inexistente. O
  minimalismo do [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
  não admite esse ruído multiplicado por 994.
- **Canto disputado**: o canto superior direito já é da marca de
  metalizada e o canto inferior direito é do selo `×N`, que transborda
  ~6px. Um terceiro adorno transbordando, no canto superior esquerdo,
  invade os 8px entre cartões e encosta nos vizinhos quando a grade
  quebra de linha — além de cercar o código, que é a informação
  principal do cartão.

## Decisão

- O controle de menos **só existe quando a contagem é ≥ 1** — figurinha
  colada ou repetida. Em contagem 0 ele não é renderizado: não é um
  botão invisível nem desabilitado, é ausência.
- O controle fica **dentro do retângulo do cartão, no canto inferior
  esquerdo**, sem transbordar — ao contrário do selo `×N`, que
  transborda no canto inferior direito.
- Continua valendo o IDR 0030 para o cartão que tem o controle: oculto
  por padrão, revelado no `:hover` e no `:focus-within`, sempre visível
  em `@media (hover: none)`; botão próprio, focável, com nome acessível
  ("remover uma unidade de BRA 05").
- O último decremento (de 1 para 0) faz o controle desaparecer sob o
  cursor ou sob o foco; quando isso acontece, o foco volta para o corpo
  do cartão, que continua somando.

## Consequências

- Some o alvo morto: o decremento em 0 deixa de existir na interface —
  o piso de 0 continua na função pura de `src/lib/colecao.js`, como
  guarda.
- O cartão faltante fica limpo, sem adorno algum, o que reforça o
  "cartão esvaziado" do IDR 0006 como sinal não-cromático.
- Os três adornos passam a ocupar cantos distintos e sem colisão:
  metalizada em cima à direita, selo `×N` embaixo à direita
  (transbordando), menos embaixo à esquerda (dentro).
- Por caber dentro do cartão, o controle encolhe; as medidas ficam em
  `interface.md` § Medidas, e a pendência de área de toque ampliada
  (Fase 10) passa a cobri-lo junto com os alvos de 30×30px.
- Em celular e tablet o controle continua sempre visível — agora só nos
  cartões onde ele faz alguma coisa, que é justamente onde o usuário
  precisa corrigir um lançamento.

## Alternativas consideradas

- **Manter o botão e desabilitá-lo em 0**: comunicaria o piso, mas
  deixa 994 botões inertes na tela e acrescenta um estado desabilitado
  à paleta, que hoje não tem nenhum.
- **Dentro do cartão, mas no canto superior esquerdo**: resolve o
  transbordo e nada mais — o topo do cartão fica com dois adornos, um
  em cada ponta, espremendo a sigla.
- **Deixar transbordando, como o selo**: mantém a colisão entre cartões
  vizinhos na grade em lista, onde a folga é de 8px.
