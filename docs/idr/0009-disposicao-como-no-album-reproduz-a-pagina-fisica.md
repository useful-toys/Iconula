<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0009: Disposição "como no álbum" reproduz a página física — só para seleções

## Status

Aceito. Refina o [IDR 0005](0005-ordenacoes-disposicoes-e-percurso-do-catalogo.md)
(disposições). O escopo "apenas as 48 seleções" foi ampliado pelo
[IDR 0023](0023-coca-cola-no-modo-album-fwc-sempre-lista.md): a
Coca-Cola, cujo arranjo físico ficou conhecido, também ganha disposição
álbum; só os Extras FIFA seguem sempre em lista.

## Contexto

A disposição álbum existia como ideia — "grade que reproduz a página
física" — mas sem layout exato nem escopo definido. A descrição da
página impressa trouxe os dois:

- **Layout exato**: duas colunas lado a lado, cada uma um grid de 4
  trilhas de largura fixa, com posições explícitas de linha/coluna por
  figurinha — incluindo o alinhamento à direita das linhas incompletas,
  que é posição no grid, não um "empurrar para a direita" solto
- **Escopo**: só as 48 seleções têm o layout físico de 20 espaços
  (escudo, 18 jogadores, foto do time) em spread de duas páginas; os
  especiais (FWC, 20 cromos) e a Coca-Cola (14, página especial) têm
  arranjos físicos diferentes — e enquanto seus layouts não forem
  conhecidos, reproduzi-los por analogia seria invenção

A alternativa implícita — uma grade uniforme que se ajusta à largura da
tela — trairia a forma da página impressa, e a fidelidade ao recorte
físico é justamente o propósito da disposição.

## Decisão

- A disposição álbum reproduz a página física com **posições explícitas
  de linha/coluna** num grid de 4 trilhas fixas por coluna — nunca uma
  grade uniforme responsiva
- Aplica-se **apenas às 48 seleções**; FWC e Coca-Cola sempre usam a
  lista contínua
- O layout exato (posições e tamanhos) fica em `interface.md`, seção
  "Disposição Como no álbum"

## Consequências

- A comparabilidade com o álbum real é fiel — a figurinha 1 fica
  exatamente sobre a terceira posição das linhas cheias abaixo dela
- Trilhas de largura fixa não se ajustam à tela: as duas colunas lado a
  lado podem não caber em celular estreito — a pendência de faixas de
  tela (`interface.md`) decide como acomodar (empilhar colunas, cair
  para lista)
- Se o layout físico de FWC/Coca-Cola for confirmado na fonte do
  checklist, a disposição pode se estender a eles

## Alternativas consideradas

- **Grade uniforme responsiva**: adaptável, mas abandona a forma da
  página impressa — o ponto da disposição é o recorte fiel
- **Estender o layout às especiais por analogia**: sem conhecer o
  arranjo físico delas, seria invenção — não reprodução
