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
