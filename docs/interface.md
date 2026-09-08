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
- Título único, uma linha: `ICONULA 2026 · 412/994 · 41% · ▢582 ·
  ×37 · 12:34` — nome, coladas/total, percentual, faltantes (▢),
  repetidas (×) e data/hora da última transação bem-sucedida (leitura
  ou escrita); sem barra de progresso, sem cartões (ver
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- Comando desfazer: botão na linha de controles, sempre visível quando
  há histórico — reverte a última alteração; repetido, as últimas 10
  (ver [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Faixa de bandeiras (salto para seção): última linha do cabeçalho,
  abaixo dos controles — uma linha com as 50 seções, bandeira da
  seleção ou ícone temático do especial, rolável para os lados; tocar
  salta até a seção (ver
  [IDR 0016](idr/0016-salto-pela-faixa-de-bandeiras.md))

### Controles
- Uma única linha, logo abaixo do título (IDR 0018)
- Alternador de ordenação: página do álbum físico × sigla da seção —
  na ordem por sigla, os especiais (COC, FWC) vêm antes das seleções
  (ver [IDR 0013](idr/0013-especiais-no-comeco-da-ordenacao-por-sigla.md))
- Alternador de disposição: lista contínua × layout da página física
  (duas colunas, com a figurinha paisagem da foto da seleção)
- Filtro de status (todas/faltantes/repetidas): apenas na disposição
  lista

### Corpo
- Grupos = seções do catálogo: 48 seleções e os especiais "Extras FIFA"
  e "Coca-Cola"
- Na ordenação por ordem do álbum, super-grupos colapsáveis acima dos
  grupos: "Especiais" e os 12 grupos da Copa A–L — título com nome e
  progresso agregado em notação compacta (ex.: `Grupo C · 34/80 ·
  43% · ▢46 · ×12`); expandem por padrão, o salto expande o grupo-alvo (ver
  [IDR 0019](idr/0019-ordem-do-album-agrupada-e-colapsavel.md)); na
  ordenação por sigla, sem super-grupos
- Seções colapsáveis em qualquer ordenação e disposição: tocar no
  título abre/fecha o corpo da seção; abertas por padrão — o
  cabeçalho com o resumo permanece (ver
  [IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))
- Cabeçalho de grupo numa linha: ícone (bandeira Twemoji da seleção ou
  ícone temático do especial), nome, sigla, número da página do álbum
  (fixo, apenas exibido) e progresso da seção em notação compacta —
  `Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3` (ver
  [IDR 0011](idr/0011-faltantes-por-secao-no-cabecalho-do-grupo.md) e
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
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
- Reforço não-cromático: faltante = cartão esvaziado (opacidade
  reduzida, borda tracejada); colada = cartão preenchido — além da cor,
  nunca no lugar dela
- Estrelinha no canto para figurinhas metalizadas/especiais

### Interações
- Tocar na figurinha soma uma unidade
- Ícone de menos que surge ao tocar remove uma unidade
- Comando desfazer, no cabeçalho, reverte a última alteração; repetível
  para as últimas 10 (ver
  [IDR 0010](idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md) e
  [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))

### Avisos de persistência

- Sucessos (gravado, carregado) não geram aviso: a data/hora no
  título atualiza — esse é o feedback
- Só a falha avisa: caixa vermelha junto à borda inferior, fica até
  dispensada ou até a gravação seguinte ter sucesso; tocar revela a
  mensagem técnica (ver
  [IDR 0017](idr/0017-aviso-so-na-falha-com-detalhe-tecnico.md))
- Nunca log com scroll (IDR 0008)

## Wireframe da tela principal

Esquemático em texto; cores indicadas são as do
[IDR 0006](idr/0006-estados-visuais-e-interacao-da-figurinha.md).

### Página inteira

```
┌──────────────────────────────────────────────────────────────┐
│  ICONULA 2026 · 412/994 · 41% · ▢582 · ×37 · 12:34           │
│  [álbum|sigla] [lista|álbum] [todas|falt|rep] [↺]            │
│  [ALG][ARG][AUS]… ── faixa de bandeiras, rolável ──▶        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│     … grupos do catálogo, um após o outro, até o fim …       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  projeto independente · sem vínculo com Panini ou FIFA ·     │
│  marcas pertencem aos seus titulares (Lei 9.279/96)          │
└──────────────────────────────────────────────────────────────┘
```

- Uma única rolagem (IDR 0008); o cabeçalho pode ser sticky
- Faixa de bandeiras no cabeçalho (salto — IDR 0016): uma linha
  rolável horizontalmente — exceção pontual ao scroll único
- Avisos de persistência (IDR 0017): sucesso não avisa — a data/hora
  do título atualiza; só a falha avisa, junto à borda inferior, com a
  mensagem técnica ao toque (vermelho, IDR 0002); nunca log com
  scroll
- Estado vazio (0/994): tela normal, sem dica nem mensagem especial
- Desfazer: botão no cabeçalho (ver acima), sempre visível quando há
  histórico
- Notação compacta (IDR 0018) em placar e títulos: `412/994 · 41% ·
  ▢582 · ×37` — as palavras vivem só no nome acessível

### Grupo na disposição lista

```
┌──────────────────────────────────────────────────────────────┐
│  [bandeira] Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3            │
├──────────────────────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  │BRA │ │BRA │ │BRA │ │BRA │ │BRA │ │BRA │                  │
│  │ 01 │ │ 02 │ │ 03 │ │ 04 │ │ 05 │ │ 06 │   …              │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                   │
│   cinza   cinza   verde   laranja  cinza   verde             │
│                           ×2                                 │
└──────────────────────────────────────────────────────────────┘
```

Cards fluem e quebram de linha conforme a largura da tela; o filtro de
status atua aqui (todas/faltantes/repetidas). No cabeçalho do grupo,
notação compacta (IDR 0018): 12/20 = coladas do total, ▢8 = faltantes,
×3 = repetidas ([IDR
0011](idr/0011-faltantes-por-secao-no-cabecalho-do-grupo.md)).

### Grupo na disposição álbum

```
   coluna 1 (fig. 01–10)           coluna 2 (fig. 11–20)
  ┌─────────────────────────────┐  ┌─────────────────────────────┐
  │              ┌────┐ ┌────┐ │  │ ┌────┐ ┌────┐ ┌───────────┐ │
  │              │ 01 │ │ 02 │ │  │ │ 11 │ │ 12 │ │    13     │ │
  │              └────┘ └────┘ │  │ └────┘ └────┘ └───────────┘ │
  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
  │ │ 03 │ │ 04 │ │ 05 │ │ 06 │ │  │ │ 14 │ │ 15 │ │ 16 │ │ 17 │ │
  │ └────┘ └────┘ └────┘ └────┘ │  │ └────┘ └────┘ └────┘ └────┘ │
  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │  │      ┌────┐ ┌────┐ ┌────┐ │
  │ │ 07 │ │ 08 │ │ 09 │ │ 10 │ │  │      │ 18 │ │ 19 │ │ 20 │ │
  │ └────┘ └────┘ └────┘ └────┘ │  │      └────┘ └────┘ └────┘ │
  └─────────────────────────────┘  └─────────────────────────────┘
    01–02 nas trilhas 3–4            13 paisagem nas trilhas 3–4
                                        18–20 nas trilhas 2–4
```

Trilhas de largura fixa, posições explícitas de linha/coluna — o
recorte da página impressa (IDR 0009). As duas páginas do spread ficam
lado a lado quando cabem na largura da tela; quando não cabem,
empilham — página 1 (fig. 01–10) acima da página 2 (fig. 11–20),
trilhas de 52px preservadas. A disposição álbum nunca cai para a lista
(ver [IDR 0015](idr/0015-paginas-do-album-empilham-em-tela-estreita.md)).

### Figurinha

```
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ BRA      │     │ BRA      │     │ BRA      │
   │ 05       │     │ 05       │     │ 05     * │
   │          │     │          │     │      ×2  │
   └──────────┘     └──────────┘     └──────────┘
    faltante         colada           repetida
    (cinza)          (verde)          (laranja, n−1 sobrando)
```

- Código em duas linhas (sigla + número), como impresso na figurinha
  física; bordas perfuradas (efeito selo)
- `*` = metalizada/especial (estrelinha no canto); `×N` = unidades
  sobrando

## Demais telas

*A preencher quando desenhadas: login (incluindo a atestação de menores
do primeiro login), exportação e importação, política de privacidade.*

## Apresentação por faixa de tela

Decidido até aqui, válido em qualquer faixa:

- Lista (todas as seções): fluxo horizontal com wrap vertical
- Álbum (só seleções): páginas do spread lado a lado quando cabem na
  largura, empilhadas quando não cabem (IDR 0015)

Pendente: qual ordenação e disposição são pré-selecionadas ou oferecidas
em cada faixa (celular, tablet, navegador).

## Identidade visual

- Tema escuro verde-gramado com detalhes dourados (inspiração: estádio
  de futebol)
- Base atual: `App.css` responsivo com dark mode via
  `prefers-color-scheme`

## Pendências de interface

- Qual ordenação e disposição são pré-selecionadas ou oferecidas em
  cada faixa de tela (celular, tablet, navegador)
