<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Interface do Iconula

## O que é este documento

Registra as decisões de interface — o "como" da UI: telas, apresentação
por faixa de tela, identidade visual e interações. O "o que" (requisitos
testáveis de interface) vive em [requisitos.md](requisitos.md); este
documento detalha como a interface realiza aqueles requisitos. Decisão
aqui registrada não abre exceção a requisito de requisitos.md — em
conflito, requisitos.md vence.

Decisões significantes — com contexto, alternativas e consequências —
ganham registro próprio em [idr/](idr/); este documento mantém apenas o
estado atual da interface.

*Inspiração: uma POC de painel de acompanhamento (artifact HTML
autocontido). Diferenças já decididas: a persistência local da POC não
se aplica (aqui é Firestore por usuário); o número da página do álbum
por grupo não é editável — é fixo, apenas exibido, dado do catálogo.*

## Tela principal

### Cabeçalho
- Título "Iconula 2026"
- Placar, estilo placar de estádio: figurinhas coladas do total do
  catálogo, com barra de progresso
- Cartões de estatísticas: percentual completo, faltantes, repetidas
- Data/hora da última alteração gravada
- Área de avisos: eventos de persistência (gravado com sucesso, dados
  carregados, falhas) — mensagens coloridas, com timestamp

### Controles
- Alternador de ordenação: página do álbum físico × sigla da seção
- Alternador de disposição: lista contínua × layout da página física
  (duas colunas, com a figurinha paisagem da foto da seleção)
- Filtro de status (todas/faltantes/repetidas): apenas na disposição
  lista
- Seletor "ir para" seção: navegação por salto, não filtro

### Corpo
- Grupos = seções do catálogo: 48 seleções e os especiais "Extras FIFA"
  e "Coca-Cola"
- Cabeçalho de grupo numa linha: ícone (bandeira Twemoji da seleção ou
  ícone temático do especial), nome, sigla, número da página do álbum
  (fixo, apenas exibido) e progresso da seção — total, coladas,
  repetidas
- Dentro do grupo, grade de figurinhas

### Disposição "Como no álbum"

Segundo modo de visualização dentro de cada grupo — reproduz a
disposição física real da página impressa (ver
[IDR 0009](idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)),
em vez de grade uniforme que se ajusta à largura da tela.

- Aplica-se apenas às 48 seleções (20 espaços: escudo, 18 jogadores e
  foto do time); os especiais (FWC e Coca-Cola) sempre usam a lista
  contínua
- A página de cada seleção divide-se em duas colunas lado a lado, cada
  uma um grid interno de 4 trilhas de largura fixa (52px por trilha,
  6px de espaçamento)
- Todas as figurinhas do mesmo tamanho, exceto a 13: paisagem, ocupa
  duas trilhas (mais larga, mesma altura); as demais em retrato

**Coluna 1 — figurinhas 1 a 10, em três linhas:**
- Linha 1: figurinhas 1 e 2 alinhadas à direita do bloco (posições 3 e
  4 das 4 trilhas)
- Linha 2: figurinhas 3 a 6 — preenchem as 4 trilhas
- Linha 3: figurinhas 7 a 10 — preenchem as 4 trilhas

**Coluna 2 — figurinhas 11 a 20, em três linhas:**
- Linha 1: figurinhas 11 e 12 em retrato (trilhas 1 e 2) e a figurinha
  13 em paisagem ocupando as trilhas 3 e 4
- Linha 2: figurinhas 14 a 17 — preenchem as 4 trilhas
- Linha 3: figurinhas 18, 19 e 20 alinhadas à direita do bloco
  (posições 2, 3 e 4 — a posição 1 fica vazia)

O alinhamento à direita das linhas incompletas é posição explícita de
linha/coluna no grid de 4 trilhas — não um "empurrar para a direita"
solto: a figurinha 1 fica exatamente sobre a terceira posição das linhas
cheias abaixo dela, como no recorte de uma página impressa.

### Figurinha
- Cartão retangular com bordas perfuradas (efeito selo)
- Código em duas linhas: sigla + número, como impresso na figurinha
  física
- Estados visuais por cor: cinza (faltante), verde (uma unidade),
  laranja com selinho "×N" (repetidas)
- Estrelinha no canto para figurinhas metalizadas/especiais

### Interações
- Tocar na figurinha soma uma unidade
- Ícone de menos que surge ao tocar remove uma unidade

## Demais telas

*A preencher quando desenhadas: login, exportação e importação,
política de privacidade.*

## Apresentação por faixa de tela

*A preencher: celular, tablet, navegador.*

## Identidade visual

- Tema escuro verde-gramado com detalhes dourados (inspiração: estádio
  de futebol)
- Base atual: `App.css` responsivo com dark mode via
  `prefers-color-scheme`

## Pendências de interface

- Qual ordenação e disposição são usadas ou oferecidas em cada faixa de
  tela
- Desenho da área de avisos: notificar eventos de persistência sem
  virar ruído (as gravações agregam ajustes — frequência exata no ADR
  do schema)
- Interação de zerar contagem (o toque soma e o menos remove; zerar
  ainda não tem gesto definido)
- Reforço não-cromático do estado da figurinha: faltente vs. colada
  hoje difere só por cor (ver [IDR 0006](idr/0006-estados-visuais-e-interacao-da-figurinha.md))
