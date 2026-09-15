<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0023: Coca-Cola e Extras FIFA na disposição álbum

## Status

Aceito — refina o
[IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md),
que restringia a disposição álbum às 48 seleções. Revisado no
esmiuçamento de 2026-09-14: os Extras FIFA deixam de ficar em lista.

## Contexto

- O IDR 0009 limitou a disposição álbum às seleções porque o arranjo
  físico dos especiais não era conhecido — reproduzi-lo por analogia
  seria invenção.
- O arranjo da Coca-Cola foi especificado (requisitos.md, Anexo): duas
  páginas, 6 figurinhas na primeira (2 linhas × 3 colunas) e 8 na
  segunda (3 colunas nas duas primeiras linhas, 2 na terceira).
- O arranjo dos Extras FIFA foi descrito pelo humano a partir do álbum
  físico (esmiuçamento de 2026-09-14): 20 figurinhas em oito páginas,
  em duas partes do álbum — 0–3 (`FWC00`–`FWC08`) e 106–109
  (`FWC09`–`FWC19`) —, com espaços vazios de arte e texto entre elas.
  Era o gatilho que a versão anterior deste registro deixou para voltar
  ao IDR 0009.
- A forma de cada figurinha (paisagem ou retrato) já está decidida no
  [MDR 0006](../model-dr/0006-catalogo-estatico-embutido.md) e no
  [IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md) (Fase 0022):
  `FWC00`–`FWC03` e `FWC09`–`FWC19` paisagem; `FWC04`–`FWC08` retrato.
- Com "álbum" selecionado, o filtro de status, que existe "apenas na
  disposição lista"
  ([IDR 0001](0001-filtro-de-status-so-na-disposicao-lista.md)), não
  aparece para nenhuma seção.

## Decisão

- A **Coca-Cola** tem disposição álbum própria: duas páginas — página 1
  com 2 linhas × 3 colunas (figurinhas 01–06), página 2 com 3 colunas
  nas linhas 1 e 2 (07–12) e 2 figurinhas na linha 3 (13–14); mesmas
  trilhas fixas das seleções, mesmo empilhamento em tela estreita
  ([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md))
- Os **Extras FIFA (FWC)** têm disposição álbum própria, com as posições
  reais de cada página e os espaços vazios preservados como casas sem
  cartão (P = paisagem, R = retrato):

  | Página física | Grade (linhas × colunas) | Figurinhas: linha, coluna |
  |---|---|---|
  | 0 | 4 × 3 | 00P: 1, 2 |
  | 1 | 4 × 3 | 01P: 1, 3 · 02P: 2, 3 · 03P: 3, 3 · 04R: 4, 3 |
  | 2 | 4 × 2 | 06R: 2, 1 · 08R: 4, 2 |
  | 3 | 4 × 2 | 05R: 1, 1 · 07R: 3, 2 |
  | 106 | 3 × 3 | 09P: 1, 3 · 10P: 2, 3 |
  | 107 | 3 × 3 | 11P: 1, 1 · 12P: 2, 1 · 13P: 3, 3 |
  | 108 | 3 × 3 | 14P: 2, 1 · 15P: 3, 1 |
  | 109 | 3 × 3 | 16P: 1, 1 · 17P: 1, 3 · 18P: 2, 3 · 19P: 3, 3 |

  - Páginas 2 e 3 vêm de uma grade 4 × 4 que atravessa o spread:
    colunas 1–2 na página 2, colunas 3–4 na página 3
  - Casas vazias são só espaço da página — nenhuma é espaço de figurinha
    de outra seção
  - **Casa de 70×70px**, só no FWC (trilhas e linhas de 70px, 6px de
    espaçamento): cada casa comporta a paisagem de 70×60px ou o retrato
    de 60×70px do [IDR 0047](0047-nomes-de-jogadores-nas-figurinhas.md),
    centralizado; uma figurinha ocupa sempre uma casa
    - página de 3 colunas: 3 × 70 + 2 × 6 = 222px; de 2 colunas:
      2 × 70 + 6 = 146px
  - **Spreads do álbum**: quatro pares na ordem 0|1, 2|3, 106|107,
    108|109 — lado a lado quando cabem, empilhados quando não cabem
    ([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md))
    - spread 0|1 e 106|107: 222 + 20 + 222 = 464px; 108|109 idem;
      2|3: 146 + 20 + 146 = 312px — todos abaixo dos 536px do spread
      das seleções
  - **Linhas vazias preservadas** em qualquer largura (página 0, linhas
    2–4; página 106, linha 3; página 108, linha 1): a grade de cada
    página tem as dimensões da tabela, não as da última figurinha
  - **Sem rótulo** entre as duas partes nem por página: os spreads se
    separam só pelo espaçamento de sempre
    ([IDR 0018](0018-usuario-especialista-e-minimalismo.md))
  - **Moldura só no FWC**: contorno discreto de 1px em `--border` em
    volta de cada página do FWC, para a posição na página se ler nas
    páginas esparsas (0, 106, 108); casas vazias sem desenho — no álbum
    há arte, não espaço de figurinha. Seleções e Coca-Cola seguem sem
    moldura
  - **Cabeçalho da seção com a primeira página**: `Extras FIFA FWC 0 ·
    12/20 · …` — a mesma regra das seleções e da Coca-Cola; a segunda
    parte (106) aparece só no arranjo
- Na disposição álbum, **nenhuma seção é filtrada**: o filtro de status
  pertence à disposição lista; o alternador de filtro permanece oculto

## Consequências

- As três seções especiais passam a ser fiéis ao álbum físico; nenhuma
  seção fica em lista quando a disposição escolhida é álbum
- `layoutDeSecao` deixa de devolver `null` para o FWC
  (`src/data/catalogoLayout.js`), e as posições acima viram dado de
  layout travado por teste (20 códigos, cada um uma vez), na forma do
  [MDR 0006](../model-dr/0006-catalogo-estatico-embutido.md) (páginas
  com dimensão)
- O cabeçalho do FWC deixa de omitir a página
  ([TDR 0010](../tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md))
- A largura do maior spread do FWC (464px) fica abaixo da das seleções
  (536px): o limite de 582px do
  [IDR 0043](0043-padroes-de-primeira-abertura-por-faixa-de-tela.md) não
  muda
- `requisitos.md` § Catálogo, § UX, § Decisões Pendentes e o Anexo foram
  atualizados no esmiuçamento para o FWC na disposição álbum e as
  páginas 0–3 e 106–109
- `interface.md` § Disposição "Como no álbum" e § Apresentação por faixa
  de tela ganham a seção FWC; o wireframe ganha o grupo FWC
- A seção FWC fica mais alta na disposição álbum do que na lista (oito
  páginas, com linhas de espaço vazio)
- Depende da Fase 0022 (paisagens do FWC em 70×60px)
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Manter os dois especiais em lista** (IDR 0009 intacto): coerente,
  mas descarta layouts já conhecidos e verificáveis
- **Manter o FWC em lista mesmo com o arranjo conhecido**: deixa a única
  seção sem espelho físico justamente quando o dado passou a existir —
  recusada no esmiuçamento de 2026-09-14
- **Guardar o FWC no álbum como requisito futuro**: adia sem motivo, com
  o arranjo já descrito — recusada no esmiuçamento de 2026-09-14
- **Moldura em todas as páginas do álbum**: coerência visual total, mas
  muda 49 seções que estão boas e amplia o escopo
- **Casas vazias com contorno tracejado**: mostra a grade, mas sugere
  espaço de figurinha onde no álbum há arte ou texto
- **Nada em volta da página** (como as seleções): a posição fica
  invisível nas páginas esparsas
- **Cabeçalho com as duas partes** (`FWC 0 106`): formato único do FWC,
  um número a mais na linha
- **Cabeçalho sem página** (como antes): mantém o FWC como exceção à
  regra do cabeçalho sem motivo, com as páginas já conhecidas
- **Paisagem do FWC em duas trilhas de 60px** (como a 13 das seleções):
  a página 109 (16 e 17 na mesma linha, 18–19 abaixo da 17) exigiria
  redesenhar a grade com mais colunas — deixa de ser o arranjo descrito
- **Trilha de 70px só nas colunas com paisagem**: colunas de larguras
  diferentes desalinham as páginas do mesmo spread e complicam o dado
- **Páginas do FWC em fluxo com wrap**: mais compacto, mas perde o par
  de páginas abertas e muda de tela para tela
- **Uma página por vez, sempre empilhada**: seção bem mais alta e
  diferente das seleções, que ficam lado a lado quando cabem
- **Cortar linhas vazias só quando empilha**: a mesma página mudaria de
  forma conforme a largura
- **Cortar linhas vazias sempre**: desalinha o spread (página 0 com 1
  linha ao lado da página 1 com 4) e perde a posição vertical real
- **Número discreto da página sobre cada página do FWC**: ajudaria a
  achar a página no álbum, mas acrescenta elemento só nesta seção —
  recusado pelo humano em favor do minimalismo
- **Rótulo por parte** ("pág. 0–3", "pág. 106–109"): não diz qual é
  cada página dentro do bloco — recusado
- **Filtrar a lista do FWC dentro do modo álbum**: o alternador de
  filtro teria de reaparecer no modo álbum, contra o IDR 0001, e o
  catálogo mostraria estados de filtro diferentes por seção
- **Inventar um arranjo para o FWC por analogia**: reprovado pelo mesmo
  argumento do IDR 0009

## Histórico

- 2026-09-14 — Esmiuçamento (implementação a planejar): os Extras FIFA
  ganham disposição álbum com as posições reais, descritas pelo humano a
  partir do álbum físico. Antes: "Os Extras FIFA (FWC) são exibidos em
  lista contínua também na disposição álbum — reproduzir a página física
  é complexo demais e os dados não existem"; na disposição álbum, a
  lista do FWC não era filtrada. Título anterior: "Coca-Cola ganha
  disposição álbum; Extras FIFA seguem em lista".
