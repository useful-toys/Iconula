<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0015: Páginas do álbum empilham em tela estreita

## Status

Aceito.

## Contexto

- O [IDR 0009](0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)
  definiu o spread da seleção: duas páginas lado a lado, cada uma um
  grid de 4 trilhas de 52px — ~460px de largura total.
- Em celular (~360px), as duas páginas não cabem lado a lado; a
  pendência registrada em interface.md oferecia empilhar as colunas ou
  cair para a lista.
- O usuário decidiu: empilhar — a disposição álbum nunca deixa de ser
  álbum. No celular, aparelho mais usado na feira de troca, a
  comparação com a página física é justamente o valor da disposição.

## Decisão

- Na disposição álbum, as duas páginas do spread ficam lado a lado
  quando cabem na largura da tela
- Quando não cabem, empilham: página 1 (fig. 01–10) acima da página 2
  (fig. 11–20), trilhas de 52px preservadas
- Em nenhuma largura a disposição álbum cai para a lista; a lista é
  disposição à parte, escolhida pelo alternador

## Consequências

- O recorte da página física se preserva em qualquer tela — só muda de
  lado a lado para empilhado
- Em tela estreita o percurso vertical dentro da seção dobra (duas
  páginas empilhadas); aceito
- A lista contínua segue fluindo com wrap em qualquer largura — sem
  mudança
- Resolve a pendência de faixa de tela da disposição álbum em
  interface.md

## Alternativas consideradas

- **Cair para a lista em tela estreita**: ganharia compacidade, mas
  perderia a comparação física — o motivo de existir da disposição
- **Escalar as trilhas até caber** (~38px por trilha em 360px): cartões
  pequenos demais para o código em duas linhas
