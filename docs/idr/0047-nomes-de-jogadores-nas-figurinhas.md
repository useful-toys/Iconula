<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0047: Nomes de jogadores nas figurinhas

## Status

Aceito — implementação na Fase 0017.

## Contexto

- O cartão exibe só o código (`BRA 05`); saber quem é a figurinha exige
  lembrar o álbum ou consultar fora do app.
- Na feira de troca, o especialista
  ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)) confere a
  figurinha na mão contra a tela: o nome impresso é o que ele lê no cromo.
- No álbum físico, o código fica em duas linhas (sigla sobre número) na
  parte de cima e o nome em duas linhas embaixo, em letra levemente
  condensada.
- O cartão atual (52×66px na lista, 52×52px no álbum) não comporta duas
  linhas de nome legíveis: em 52px cabem ~8 maiúsculas, e no álbum não
  sobra altura com o controle de menos
  ([IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md))
  e o selo `×N` na borda inferior.

## Decisão

- **Cartão de 60×70px, igual nas disposições lista e álbum**; raio 5px
- **Paisagem (13 das seleções; `FWC00`–`FWC03` e `FWC09`–`FWC19`): 70×60px**
  — as medidas do retrato com largura e altura trocadas, preservando a
  proporção; igual nas duas disposições (o FWC só aparece em lista —
  [IDR 0023](0023-coca-cola-no-modo-album-fwc-sempre-lista.md))
  - álbum: continua reservando as trilhas 3–4 (126×70px); o cartão fica
    centralizado nesse espaço nos dois eixos (28px de cada lado, 5px em
    cima e embaixo)
  - lista: centralizado na altura da linha de cartões de 70px (5px em cima
    e embaixo), não colado no topo
- **Composição em duas metades de mesma altura** (70 − 2 × 2 de borda =
  66px úteis → 33px cada; código ~25px e nome ~22px cabem em cada uma):
  - metade de cima: código em Poppins 700, sigla (10px) na linha 1 e número
    (13px) na linha 2, centralizado na horizontal e na vertical
  - metade de baixo: nome em duas linhas, centralizado na horizontal e na
    vertical
  - controle de menos (canto inferior esquerdo) e selo `×N` (canto inferior
    direito) ficam sobre a metade de baixo e podem se sobrepor ao nome —
    aceito para manter a divisão em metades
- **Escudo (01) e foto do time (13) das seleções**: nome do catálogo em
  caixa normal na metade de baixo, com as mesmas duas metades dos jogadores
  - escudo (retrato): "Escudo do time" em até duas linhas, quebra natural
    ("Escudo" / "do time") — numa linha truncaria nos ~50px úteis
  - foto do time (paisagem de 70×60px, 28px úteis por metade): "Foto do
    time" numa linha só, com ellipsis se não couber
- **Tipografia única** nas duas disposições (antes o álbum usava um ponto
  a menos): sigla 10px, número 13px; menos 18px; selo 10px; marca de
  metalizada 6px
- **Nome**: Roboto Condensed (vendorizada — [TDR 0013](../tdr/0013-tipografia-vendorizada.md)),
  10px, em `--cream` sobre o fundo do estado
  - **Jogadores**: primeira linha com os prenomes em caixa normal; segunda
    com o sobrenome em caixa alta (só visual — o dado mantém a grafia);
    nome único numa linha só, em caixa alta
  - **Extras FIFA e Coca-Cola**: nome sem corte, em caixa normal, quebrando
    naturalmente em até duas linhas
  - **Extras FIFA em paisagem**: `nomeCurto` do catálogo
    ([MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md)) numa
    linha só, em caixa normal, com ellipsis se não couber — o nome completo
    fica no nome acessível
  - **Truncamento**: ellipsis por linha
- **Acessibilidade**: o nome completo, em caixa normal, entra no nome
  acessível do corpo e do controle de menos, entre o código e o estado
  (`BRA 05, Gabriel Magalhães, faltante`) — inclusive no escudo e na foto
  do time (`BRA 01, Escudo do time, faltante`)
- O dado que alimenta o nome (fonte, forma, corte, mapeamento, campos do
  catálogo) é do [MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md)

## Consequências

- Cada figurinha se identifica pelo nome, como no cromo físico
- O cartão cresce ~3% na altura da lista e ~31% no álbum: mais rolagem,
  compensada em parte pela [Fase 12](0050-compactacao-vertical-do-catalogo.md)
- Trilhas do álbum passam de 52px para 60px e linhas de 52px para 70px:
  o spread vai a 536px e o limite celular/tablet do
  [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md) é
  recalculado; as páginas empilham um pouco antes
  ([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md))
- Área de toque do menos passa a ser uma só, a da lista
  ([IDR 0042](0042-foco-visivel-e-area-de-toque.md))
- Nomes longos truncam por linha (~11 maiúsculas condensadas); o nome
  completo fica no nome acessível
- Com unidade, o menos (e, com repetidas, o selo) cobre parte do início
  (e do fim) da metade de baixo — em nomes largos, esconde letras da
  segunda linha
- Escudo e foto do time mostram o texto genérico do catálogo (escudo em
  duas linhas, foto numa): todas as figurinhas passam a ter código e nome
  visíveis, com a mesma divisão em metades
- Paisagens do FWC mostram o `nomeCurto` (até 14 caracteres, ex.: "Uruguai
  1950"): os dez pôsteres e os dois emblemas ficam distinguíveis no cartão;
  a exibição escolhe `nomeCurto` quando existe
  - "Foto do time" e os nomes curtos mais longos ("Argentina 1986") em
    Roboto Condensed 10px: ~54–60px estimados para 60px úteis no paisagem
    (70 − 2 × 2 de borda − 2 × 3 de padding) — medir na execução; se não
    couber, vale o ellipsis
  - o menos, quando visível, cobre o início da linha ("Fo"); o selo não a
    alcança (começa ~2px abaixo dela)
  - exibição muda em `Figurinha.jsx` (`exibeNome`); o dado não muda
    ([MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md))
- Um arquivo de fonte a mais no bundle
- Cartão de 60×70px: linhas do álbum de 68px para 70px (+6px por página,
  +12px com as páginas empilhadas) e ~3% a mais de altura nas grades —
  devolve parte da redução de rolagem da Fase 17, em troca de metades de
  33px e de 60px úteis de nome na paisagem
  - largura inalterada: trilhas de 60px, página de 258px, spread de 536px
    e limite de 582px do
    [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)
  - `PaginaDoAlbum.css` (linhas de 70px), `Figurinha.css` e a estimativa
    `--secao-altura-estimada` de `theme.css` (placeholder do
    `content-visibility`, [TDR 0021](../tdr/0021-desempenho-do-catalogo.md):
    370 × 70/68 ≈ 381px) acompanham; o alvo do menos segue contido no
    cartão ([IDR 0042](0042-foco-visivel-e-area-de-toque.md),
    [IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md))
- Paisagem de 70×60px: a foto do time tem a mesma proporção do retrato,
  deitada; a 13 fica menor que o espaço de duas trilhas, com sobra visível
  dos lados
  - layout do álbum inalterado: `trilhas: 2` em `catalogoLayout.js`, página
    de 258px, spread de 536px, limite celular/tablet de 582px do
    [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)
  - cabe na 13: 56px úteis de altura em duas metades de 28px — código
    (~25px) em cima, uma linha de nome (~11px) embaixo; não é metalizada;
    o menos (18px) e o selo seguem nos cantos
  - `docs/interface.md` § Seleções — 4 trilhas por página, § Grupo na
    disposição lista e § Medidas deixam de dizer "ocupa duas trilhas (mais
    larga, mesma altura)" e "126×68px"
  - Implementação: Fase 0022 — medidas na Tarefa 0022-0001, paisagens do
    FWC e `nomeCurto` na Tarefa 0022-0002, nome no escudo, na foto do time
    e nas paisagens do FWC na Tarefa 0022-0003.

## Alternativas consideradas

- **Manter 52px e duas linhas de nome em 8–9px**: ilegível e sem altura no
  álbum
- **Código numa linha só no topo**: libera altura, mas contraria a
  convenção do álbum físico, que o usuário reconhece
- **Cartão de 60×84px ou 60×76px**: altura original do planejamento e sua
  primeira redução; com código e nome em metades, sobra altura — 68px reduz
  a rolagem e ainda comporta código e nome em cada metade
- **Cartão de 56×80px**: menor impacto no álbum, nome no limite do legível
- **Cartão de 64×88px**: mais letras por linha, mas o álbum empilha páginas
  cedo demais em tablet
- **Faixa inferior de ~22px reservada ao menos e ao selo, com código e nome
  empilhados acima dela**: evita a sobreposição, mas desloca código e nome
  para o alto e quebra a divisão em metades pedida pelo humano
- **Escudo e foto do time só com o código, centralizado no cartão
  inteiro**: vigente até o esmiuçamento de 2026-09-14; evitava repetir o
  que a posição já diz, mas deixava as duas posições fixas sem a linha de
  nome que todas as outras têm
- **Nome da seleção ("Brasil") no escudo e na foto do time**: mais
  informativo, mas repete o cabeçalho da seção e exigiria mudar o dado
  (MDR 0008) ou criar regra de exibição própria
- **Nome na foto do time e escudo só com o código**: restrito ao pedido
  inicial, mas deixaria regras diferentes para as duas posições fixas
- **Escudo numa linha só**: "Escudo do time" (14 caracteres) truncaria em
  "Escudo do t…" nos ~50px úteis do retrato
- **Nome curto "Escudo" nas 48 seleções**: uma linha sem truncar, mas cria
  dado novo onde a quebra natural em duas linhas já resolve
- **Menos pendurado fora do cartão**: contraria o
  [IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md)
  e invade o vão entre cartões
- **Nome em `system-ui` ou com `font-stretch`**: largura condensada não é
  garantida nas fontes do sistema; trunca mais onde não houver
- **Condensar com `scaleX`**: distorce as letras e complica o truncamento
- **Oswald ou Barlow Semi Condensed**: Oswald pesa em 10px; Barlow cabe uma
  letra a menos por linha
- **Tooltip no hover**: não funciona em toque e exige interação
- **Nome no lugar do código**: perde a identificação numérica oficial
- **Nome só numa disposição**: a mesma figurinha mudaria de conteúdo ao
  trocar de disposição
- **Nome numa linha só, com o sobrenome em caixa alta**: não cabe legível
  na largura do cartão
- **Paisagem de 126×68px, largura de duas trilhas e altura do retrato**:
  vigente até o esmiuçamento de 2026-09-14; distorce a proporção da foto
  do time, que aparece como dois cartões lado a lado
- **Manter o cartão de 60×68px e a paisagem de 68×60px**: ~3% menos
  rolagem, mas metades de 32px e nomes curtos da paisagem no limite dos
  58px úteis; o humano preferiu 60×70px e 70×60px
- **Paisagem na altura da linha, mesma proporção (82×70px, antes 77×68px)**:
  alinha com os vizinhos sem sobra vertical, mas não são as medidas do
  retrato trocadas, que era o pedido
- **Paisagem encostada à direita, na trilha 4**: seguiria o alinhamento das
  linhas incompletas ([IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)),
  mas deixaria 56px de buraco à esquerda; o humano pediu centralizada nas
  duas trilhas
- **Na lista, colada no topo ou na base da linha**: topo é o padrão da flex
  e parece um cartão mais curto; base alinha menos e selo com os vizinhos,
  mas difere do álbum — centralizada iguala as duas disposições
- **Paisagem ocupando uma trilha só**: 70px não cabem na trilha de 60px;
  exigiria alargar a trilha ou deslocar a 12, contrariando o IDR 0009 e o
  limite do IDR 0043
- **Paisagens do FWC numa linha com o nome completo**: os dez pôsteres
  truncariam iguais ("Pôster Histór…") e FWC01/FWC02 também ("Emblema
  Ofic…") — o nome deixaria de identificar a figurinha
- **Paisagens do FWC em duas linhas com o nome completo**: cabe na altura
  e distingue os pôsteres, mas FWC01 e FWC02 continuariam iguais
- **Paisagens do FWC decididas junto com o FWC no álbum**: o esmiuçamento
  da apresentação do FWC no álbum parte desta decisão, em vez de adiar a
  lista

## Histórico

- 2026-09-14 — Esmiuçamento: o cartão passa de 60×68px a 60×70px (linhas
  do álbum de 70px) e a figurinha paisagem (13) a 70×60px, as
  medidas do retrato com largura e altura trocadas, nas duas disposições —
  centralizada no espaço das trilhas 3–4 no álbum e na altura da linha na
  lista —, para preservar a proporção da foto do time; escudo (01) e foto
  do time (13) voltam a mostrar o nome do catálogo na metade de baixo — o
  escudo em até duas linhas, a foto numa; `FWC00`–`FWC03` e `FWC09`–`FWC19` passam a paisagem, com
  o `nomeCurto` numa linha. Implementação na Fase 0022.

  Antes: cartão de 60×68px com linhas do álbum de 68px; paisagem de
  126×68px (2 × 60 + 6) nas duas disposições, ocupando
  toda a largura das duas trilhas com a altura do retrato; escudo e foto
  do time só com o código, centralizado no cartão inteiro.
- 2026-09-14 — Revisão do PR da Fase 17: optamos por estes ajustes de
  layout do cartão, pedidos pelo humano ao ver a entrega:
  - duas metades de mesma altura — código (sigla, número) centralizado na
    de cima e nome centralizado na de baixo —, aceitando que o menos e o
    selo se sobreponham ao nome
  - escudo (01) e foto do time (13) das seleções só com o código,
    centralizado no cartão inteiro; o nome fica só no nome acessível
  - altura reduzida duas vezes em 10%: 84 × 0,9 = 75,6 → 76px;
    76 × 0,9 = 68,4 → 68px; linhas do álbum acompanham (68px); largura,
    tipografia e limite celular/tablet do IDR 0043 inalterados
  - na lista, a figurinha paisagem (13) mantém a proporção paisagem do
    álbum (126×68px)

  Antes: na lista, a 13 em retrato como as demais (60px); cartão de 60×84px, código e nome empilhados e centralizados acima
  de uma faixa inferior de ~22px reservada ao menos e ao selo, com o nome
  sem corte também no escudo e na foto do time.
- 2026-09-13 — Segunda revisão do planejamento das Fases 11–17: cartão de
  60×84px igual nas duas disposições, com o nome em Roboto Condensed 10px
  entre o código e a faixa do menos e do selo; tipografia do álbum igualada
  à da lista; justificativa reescrita para o especialista, sem a menção a
  "usuários iniciantes", que contrariava o IDR 0018. Antes: cartões de
  52×66px e 52×52px, nome em `system-ui` menor que o código.
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
