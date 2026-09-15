<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0032: O controle de menos só existe com unidade e fica dentro do cartão

## Status

Aceito — absorve o
[IDR 0030](0030-controle-de-menos-do-cartao.md) (quando o controle
aparece) e completa o
[IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md), que só
dizia "um ícone de menos surge no canto". Nasce da observação do app
com o catálogo inteiro em tela.

## Contexto

- A Tarefa 0002-0003 entregou o controle de menos como um botão sempre
  presente, transbordando o canto superior esquerdo do cartão. Com as
  994 figurinhas em tela, dois problemas ficaram evidentes:
  - **Alvo morto na figurinha faltante**: decrementar em 0 não faz nada
    — é no-op declarado em `requisitos.md` e em `interface.md`. Numa
    coleção no começo, quase todos os 994 cartões estão em 0, então a
    grade inteira oferece um botão que promete uma ação inexistente. O
    minimalismo do [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
    não admite esse ruído multiplicado por 994.
  - **Canto disputado**: o canto superior direito já é da marca de
    metalizada e o canto inferior direito é do selo `×N`, que
    transborda ~6px. Um terceiro adorno transbordando, no canto
    superior esquerdo, invade os 8px entre cartões e encosta nos
    vizinhos quando a grade quebra de linha — além de cercar o código,
    que é a informação principal do cartão.

## Decisão

- O controle de menos **só existe quando a contagem é ≥ 1** — figurinha
  colada ou repetida. Em contagem 0 ele não é renderizado: não é um
  botão invisível nem desabilitado, é ausência
- O controle fica **dentro do retângulo do cartão, encostado no canto
  inferior esquerdo** — recuo 0, cobrindo a borda de 2px do cartão, sem
  transbordar; ao contrário do selo `×N`, que transborda no canto
  inferior direito. Vale para o cartão de 60×70px (retrato) e 70×60px (paisagem) em metades
  ([IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md)), onde o controle
  fica sobre a metade de baixo e pode cobrir parte do nome
- O controle fica **visualmente oculto por padrão** no cartão, para não
  competir com o gesto principal (tocar para somar) nem poluir
  visualmente a grade densa de figurinhas. Ele se torna visível quando:
  - o cursor está sobre o cartão (`:hover`) — só nesse cartão; ao sair o
    cursor, some, mesmo que o cartão tenha sido clicado;
  - o cartão ou o próprio controle recebe foco **por teclado**
    (`:focus-visible`) — o foco deixado por clique de mouse não o revela;
  - o dispositivo não oferece hover (`@media (hover: none)`), caso comum
    de celulares e tablets — aí o controle fica sempre visível, já que
    não há outro gatilho confiável para revelá-lo sem interferir no
    toque de soma
- O controle de menos é um botão separado, focável e com nome acessível
  próprio ("remover uma unidade de BRA 05"), nunca
  `dangerouslySetInnerHTML`
- O último decremento (de 1 para 0) faz o controle desaparecer sob o
  cursor ou sob o foco; quando isso acontece, o foco volta para o corpo
  do cartão, que continua somando

## Consequências

- Some o alvo morto: o decremento em 0 deixa de existir na interface —
  o piso de 0 continua na função pura de `src/lib/colecao.js`, como
  guarda
- O cartão faltante fica limpo, sem adorno algum, o que reforça o
  "cartão esvaziado" do IDR 0006 como sinal não-cromático
- Os três adornos passam a ocupar cantos distintos e sem colisão entre
  si: metalizada em cima à direita, selo `×N` embaixo à direita
  (transbordando), menos embaixo à esquerda (dentro)
- Menos e selo ficam sobre a metade de baixo do cartão e podem cobrir o
  início e o fim da segunda linha do nome — aceito para manter o cartão
  dividido em metades ([IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md))
- Por caber dentro do cartão, o controle encolhe; as medidas ficam em
  `interface.md` § Medidas, e a pendência de área de toque ampliada
  (Fase 10) passa a cobri-lo junto com os alvos de 30×30px
- Em celular e tablet o controle continua sempre visível — agora só nos
  cartões onde ele faz alguma coisa, que é justamente onde o usuário
  precisa corrigir um lançamento
- Encostado no canto, o controle se afasta ~3px do centro do cartão: menos
  cliques acidentais no menos ao somar com o mouse
- Com mouse, clicar num cartão e passar para outro não deixa o menos aceso
  no primeiro; quem navega por teclado continua vendo o controle no cartão
  focado
- A área de toque ampliada ([IDR 0042](0042-foco-visivel-e-area-de-toque.md))
  segue contida no cartão, agora ancorada no canto
- `interface.md` § Figurinha e § Medidas mudam o recuo (3px/2px → 0) e o
  gatilho de foco
- Implementação: Fase 0019, Tarefa 0019-0004; no cartão de 60×84px, Tarefa
  0017-0004.

## Alternativas consideradas

- **Manter o botão e desabilitá-lo em 0**: comunicaria o piso, mas
  deixa 994 botões inertes na tela e acrescenta um estado desabilitado
  à paleta, que hoje não tem nenhum
- **Dentro do cartão, mas no canto superior esquerdo**: resolve o
  transbordo e nada mais — o topo do cartão fica com dois adornos, um
  em cada ponta, espremendo a sigla
- **Deixar transbordando, como o selo**: mantém a colisão entre cartões
  vizinhos na grade em lista, onde a folga é de 8px
- **Transbordar só 3–4px do canto**: afastaria mais o alvo, mas o selo do
  vizinho da esquerda (−6px) e o menos (−3px) somam 9px num vão de 8px
- **No canto e menor (14px)**: alvo pequeno demais para quem quer
  decrementar com o mouse
- **Revelar só no hover, sem foco algum**: quem navega por teclado não
  veria o controle no cartão focado

## Histórico

- 2026-09-14 — Esmiuçamento: cartão de 60×70px e paisagem de 70×60px
  ([IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md)); o canto do menos
  não muda. Implementação a planejar. Antes: cartão de 60×68px.
- 2026-09-14 — Revisão do PR da Fase 17: optamos por ajustar o layout do
  cartão ([IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md)) — duas
  metades (código em cima, nome embaixo), altura de 84px para 68px e escudo
  e foto do time só com o código. O canto do menos não muda, mas ele deixa
  de ter faixa inferior própria e pode cobrir parte do nome. Antes: cartão
  de 60×84px com faixa inferior de ~22px livre para o menos e o selo.
- 2026-09-13 — Esmiuçamento de ajustes de interface: controle encostado no
  canto inferior esquerdo (recuo 0, sobre a borda, sem transbordar) e foco
  que o revela passa a ser só o de teclado (`:focus-visible`);
  implementação a planejar. Antes: recuo de 3px (2px no álbum) e revelado
  por `:focus-within`, o que o deixava aceso depois do clique de mouse e
  gerava cliques acidentais no menos ao somar.
