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

- **Cartão de 60×84px, igual nas disposições lista e álbum**; na paisagem
  (figurinha 13), 126px de largura (2 × 60 + 6); raio 5px
- **Composição, de cima para baixo** (84 − 2 × 2 de borda = 80px úteis):
  - código em Poppins 700, sigla (10px) sobre número (13px), centralizado —
    ~25px
  - nome em duas linhas, centralizado logo abaixo — ~22px
  - faixa inferior de ~22px livre para o controle de menos (esquerda) e o
    selo `×N` (direita)
  - código e nome centralizados verticalmente no espaço acima da faixa
- **Tipografia única** nas duas disposições (antes o álbum usava um ponto
  a menos): sigla 10px, número 13px; menos 18px; selo 10px; marca de
  metalizada 6px
- **Nome**: Roboto Condensed (vendorizada — [TDR 0013](../tdr/0013-tipografia-vendorizada.md)),
  10px, em `--cream` sobre o fundo do estado
  - **Jogadores**: primeira linha com os prenomes em caixa normal; segunda
    com o sobrenome em caixa alta (só visual — o dado mantém a grafia);
    nome único só na segunda linha, em caixa alta
  - **Nomes de figurinha** (escudo, foto do time, Extras FIFA, Coca-Cola):
    sem corte, em caixa normal, quebrando naturalmente em até duas linhas
  - **Truncamento**: ellipsis por linha
- **Acessibilidade**: o nome completo, em caixa normal, entra no nome
  acessível do corpo e do controle de menos, entre o código e o estado
  (`BRA 05, Gabriel Magalhães, faltante`)
- O dado que alimenta o nome (fonte, forma, corte, mapeamento, campos do
  catálogo) é do [MDR 0008](../model-dr/0008-dados-dos-nomes-das-figurinhas.md)

## Consequências

- Cada figurinha se identifica pelo nome, como no cromo físico
- O cartão cresce ~27% na altura da lista e ~62% no álbum: mais rolagem,
  compensada em parte pela [Fase 12](0050-compactacao-vertical-do-catalogo.md)
- Trilhas do álbum passam de 52px para 60px e linhas de 52px para 84px:
  o spread vai a 536px e o limite celular/tablet do
  [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md) é
  recalculado; as páginas empilham um pouco antes
  ([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md))
- Área de toque do menos passa a ser uma só, a da lista
  ([IDR 0042](0042-foco-visivel-e-area-de-toque.md))
- Nomes longos truncam por linha (~11 maiúsculas condensadas); o nome
  completo fica no nome acessível
- Um arquivo de fonte a mais no bundle

## Alternativas consideradas

- **Manter 52px e duas linhas de nome em 8–9px**: ilegível e sem altura no
  álbum
- **Código numa linha só no topo**: libera altura, mas contraria a
  convenção do álbum físico, que o usuário reconhece
- **Cartão de 56×80px**: menor impacto no álbum, nome no limite do legível
- **Cartão de 64×88px**: mais letras por linha, mas o álbum empilha páginas
  cedo demais em tablet
- **Menos sobreposto ao nome**: cobre o início da segunda linha quando há
  unidade
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

## Histórico

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
