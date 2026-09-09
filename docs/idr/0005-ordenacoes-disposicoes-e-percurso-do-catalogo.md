<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0005: Ordenações, disposições e percurso do catálogo

## Status

Aceito. O escopo da disposição álbum ("apenas para as 48 seleções") foi
detalhado pelo
[IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md) e
depois ampliado pelo
[IDR 0023](0023-coca-cola-no-modo-album-fwc-sempre-lista.md): a
Coca-Cola também tem disposição álbum; só os Extras FIFA seguem sempre
em lista.

## Contexto

Dois jobs distintos competem pela organização do catálogo: **consultar
por código** (abri um envelope, quero marcar BRA05 rápido) e **conferir
contra o álbum físico** (percorrer como o álbum, página a página, vendo
qual já tenho). Uma única organização serviria mal um dos dois.

A POC mostrou a solução em alternadores: ordem (página do álbum ×
sigla) e disposição (lista contínua × layout da página física, com duas
colunas e a figurinha paisagem da foto da seleção). Na POC, a página de
cada grupo era editável pelo usuário — um contorno para ela não ter os
dados do catálogo; aqui a ordem do álbum é dado embutido em `src/data/`.

Regra de UX previamente decidida pelo usuário: o percurso é por rolagem
da tela inteira, **jamais scroll dentro de scroll**.

## Decisão

- Duas ordenações da sequência de seções: alfabética pela sigla
  (ARG, AUS, AUT, …) e ordem do álbum físico (pela página de cada seção)
- Duas disposições: lista contínua (01 a N) para toda seção, e grade
  que reproduz a página física — apenas para as 48 seleções (duas
  colunas, figurinha paisagem da foto na posição 13; layout exato e
  escopo no [IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md))
- O percurso é sempre rolagem da tela inteira — caso particular da
  regra global do [IDR 0008](0008-uma-unica-pagina-scrollavel.md)
- O número da página do álbum é exibido no cabeçalho do grupo — fixo,
  apenas leitura, dado do catálogo (ao contrário da POC, que o deixava
  editável)

## Consequências

- A disposição grade espelha o álbum real: comparar "qual eu já tenho"
  é direto — apoiado pelos estados visuais do
  [IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md)
- A ordenação por sigla casa com o hábito de busca por código
- Scroll único elimina qualquer painel com scrollbar própria — as
  grades de seção se abrem na página
- O catálogo precisa carregar a página e a ordem do álbum por seção
  (pendente no checklist de `requisitos.md`)

## Alternativas consideradas

- **Uma única ordenação e disposição**: mais simples, mas sacrifica um
  dos dois jobs essenciais
- **Scroll interno por seção na disposição grade**: violaria a regra do
  scroll único
- **Página editável como na POC**: desnecessário — os dados do catálogo
  embutido já trazem a ordem
