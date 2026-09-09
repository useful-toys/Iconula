<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0023: Coca-Cola ganha disposição álbum; Extras FIFA seguem em lista

## Status

Aceito — refina o
[IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md),
que restringia a disposição álbum às 48 seleções.

## Contexto

O IDR 0009 limitou a disposição álbum às seleções porque o arranjo
físico dos especiais não era conhecido — reproduzi-lo por analogia
seria invenção. Desde então, o arranjo da página da Coca-Cola foi
especificado (requisitos.md, Anexo): duas páginas, 6 figurinhas na
primeira (2 linhas × 3 colunas) e 8 na segunda (3 colunas nas duas
primeiras linhas, 2 na terceira). O dos Extras FIFA continua
desconhecido — e o FWC ainda espalha suas 20 figurinhas por páginas nas
duas pontas do álbum, o que tornaria a reprodução complexa mesmo com os
dados.

Ficava também a lacuna de comportamento: com "álbum" selecionado, a
seção que não tem layout de álbum cai em lista — e o filtro de status,
que existe "apenas na disposição lista"
([IDR 0001](0001-filtro-de-status-so-na-disposicao-lista.md)), voltaria
a aparecer só para ela.

## Decisão

- A **Coca-Cola** passa a ter disposição álbum própria: duas páginas —
  página 1 com 2 linhas × 3 colunas (figurinhas 01–06), página 2 com 3
  colunas nas linhas 1 e 2 (07–12) e 2 figurinhas na linha 3 (13–14);
  mesmas trilhas fixas das seleções, mesmo empilhamento em tela estreita
  ([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md))
- Os **Extras FIFA (FWC)** são exibidos em **lista contínua também na
  disposição álbum** — reproduzir a página física é complexo demais e
  os dados não existem
- Na disposição álbum, a lista do FWC **não é filtrada**: o filtro de
  status pertence à disposição lista, e a disposição escolhida é álbum;
  o alternador de filtro permanece oculto

## Consequências

- Duas das três seções especiais ficam fiéis ao álbum físico; só o FWC
  fica sem espelho
- O alternador de disposição continua global — uma escolha para todo o
  catálogo, com o FWC como exceção declarada
- Nenhuma seção fica filtrável quando a disposição é álbum: a regra do
  IDR 0001 vale por disposição escolhida, não por como cada seção
  aparece
- Se o arranjo físico do FWC for confirmado na fonte do checklist, o
  IDR 0009 volta a ser candidato a extensão

## Alternativas consideradas

- **Manter os dois especiais em lista** (IDR 0009 intacto): coerente,
  mas descarta um layout já conhecido e verificável
- **Filtrar a lista do FWC dentro do modo álbum**: o alternador de
  filtro teria de reaparecer no modo álbum, contra o IDR 0001, e o
  catálogo mostraria estados de filtro diferentes por seção
- **Inventar um arranjo para o FWC por analogia**: reprovado pelo mesmo
  argumento do IDR 0009
