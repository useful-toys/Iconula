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

*Referência visual: o protótipo de tela em `docs/prototype/` (artifact
HTML autocontido). Dele vêm a paleta, a tipografia e as medidas
transcritas abaixo, além do desenho da tela de login (ver
[IDR 0022](idr/0022-tema-escuro-unico-paleta-do-prototipo.md)). Onde o
protótipo e este documento divergirem, este documento vence — ele
incorpora decisões posteriores ao protótipo: menu de ações, disposição
álbum da Coca-Cola, ocultar seções vazias, posição dos especiais e a
ordem dos dois botões de comando. O protótipo também separa a
identificação dos números por travessão (`Brasil BRA 24 — 13/20 · 65% ·
▢7 · ×3`); aqui vale o ponto médio da notação uniforme do IDR 0018,
`Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3`. A barra escura no topo do
protótipo (`[demonstração — alterna entre telas]`, com os botões de
demonstrar avisos) é andaime da prévia, não faz parte do produto.*

## Tela principal

### Cabeçalho
- Título único, uma linha: `ICONULA 2026 · 412/994 · 41% · ▢582 ·
  ×37 · 12:34` — nome, coladas/total, percentual, faltantes (▢),
  repetidas (×) e a data/hora da última gravação bem-sucedida; sem
  barra de progresso, sem cartões (ver
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- O relógio do título é o `updatedAt` do documento — a carga o traz, a
  gravação o move; documento sem carimbo (conta nova) exibe `—`, e a
  data acompanha a hora quando o carimbo não é de hoje (ver
  [IDR 0027](idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md))
- Comando desfazer: botão na linha de controles, sempre visível quando
  há histórico — reverte a última alteração; repetido, as últimas 10
  (ver [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Menu de ações: botão na mesma linha de controles, abre popup com os
  comandos raros — listas de troca, export/import e sair da conta (ver
  [IDR 0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md))
- Faixa de bandeiras (salto para seção): última linha do cabeçalho,
  abaixo dos controles — uma linha com as 50 seções, bandeira da
  seleção ou ícone temático do especial (🏆 Extras FIFA, 🥤
  Coca-Cola), rolável para os lados; tocar salta até a seção (ver
  [IDR 0016](idr/0016-salto-pela-faixa-de-bandeiras.md)) — a ordem
  acompanha o catálogo: 🏆 no início, 🥤 no fim (IDR 0028)

### Controles
- Uma única linha, logo abaixo do título (IDR 0018)
- Alternador de ordenação: página do álbum físico × sigla da seção —
  em ambas, os Extras FIFA abrem o catálogo e a Coca-Cola o fecha (ver
  [IDR 0028](idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md))
- Alternador de disposição: lista contínua × layout da página física
- Filtro de status (todas/faltantes/coladas/repetidas): apenas na
  disposição lista — na disposição álbum o alternador de filtro nem
  aparece, inclusive para as seções que ali se exibem em lista (IDR 0023)
- Coladas é contagem ≥ 1 e repetidas é contagem ≥ 2: os dois conjuntos
  se sobrepõem de propósito — toda repetida é colada — e a tela não
  sinaliza a sobreposição (ver
  [IDR 0033](idr/0033-filtro-de-coladas.md))
- Rótulos curtos, como no protótipo: `Página` | `Sigla`, `Lista` |
  `Álbum`, `Todas` | `Falt.` | `Col.` | `Rep.` — abreviados para os três
  grupos caberem numa linha de celular, que com o quarto segmento do
  filtro passa a depender da quebra descrita abaixo; a forma por extenso
  vive só no nome acessível, como manda a notação compacta do IDR 0018
- Os grupos segmentados fluem da esquerda para a direita e quebram para
  a linha seguinte quando não cabem na largura; os dois botões de
  comando ficam sempre colados à direita, separados dos alternadores
  pelo espaço que sobrar — some o filtro (disposição álbum) e eles não
  se movem
- À direita da linha, os dois comandos: desfazer (`↺`) e menu de ações
- Ordenação, disposição e filtro são lembrados entre sessões
  (`localStorage`, por dispositivo — ver
  [IDR 0026](idr/0026-preferencias-de-vista-persistidas-no-navegador.md));
  o colapso das seções, não

### Menu de ações

Popup aberto pelo botão do cabeçalho, com cinco comandos (IDR 0024):

- Copiar lista de **faltantes** para a área de transferência
- Copiar lista de **repetidas** para a área de transferência
- **Exportar** a coleção em JSON
- **Importar** coleção de arquivo JSON — com a confirmação explícita
  exigida por requisitos.md; a importação descarta o histórico de
  desfazer
- **Sair da conta** — grava o que estiver pendente e volta à tela de
  login

Os cinco itens vêm em três blocos separados por filete: as duas
cópias, a dupla exportar/importar e, isolado no fim, sair da conta —
este último em `--notif-red`, o único item vermelho da tela principal,
porque é o único que tira o usuário de onde ele está. O popup é
ancorado ao botão que o abriu: alinhado pela borda direita, logo abaixo
da linha de controles, painel `--panel` sobre borda `--border`, com
sombra projetada que o descola do conteúdo por baixo.

Fecha ao escolher um comando, ao tocar fora ou com `Esc`. Todo comando
dá retorno na área de avisos — "lista copiada", "coleção exportada" —,
efêmero como qualquer sucesso (ver
[IDR 0029](idr/0029-avisos-flutuantes-com-tres-severidades.md)).

### Corpo
- Grupos = seções do catálogo: 48 seleções e os especiais "Extras FIFA"
  e "Coca-Cola" — em qualquer ordenação, o FWC é o primeiro grupo da
  página e a Coca-Cola o último (IDR 0028)
- Na ordenação por ordem do álbum, super-grupos colapsáveis acima dos
  grupos: os 12 grupos da Copa A–L — título com nome e progresso
  agregado em notação compacta (ex.: `Grupo C · 34/80 · 43% · ▢46 ·
  ×12`); expandem por padrão, o salto expande o grupo-alvo (ver
  [IDR 0019](idr/0019-ordem-do-album-agrupada-e-colapsavel.md)). FWC e
  Coca-Cola ficam fora dos super-grupos, nas pontas; na ordenação por
  sigla não há super-grupos
- Seções colapsáveis em qualquer ordenação e disposição: tocar no
  título abre/fecha o corpo da seção; abertas por padrão — o
  cabeçalho com o resumo permanece (ver
  [IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))
- Cabeçalho de grupo numa linha: chevron de colapso, ícone (bandeira
  Twemoji da seleção ou ícone temático do especial), nome, sigla,
  número da página do álbum (fixo, apenas exibido) e progresso da seção
  em notação compacta — `Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3` (ver
  [IDR 0011](idr/0011-faltantes-por-secao-no-cabecalho-do-grupo.md) e
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- No cabeçalho da seção, a identificação (ícone, nome, sigla, página)
  vai em `--cream` peso 600 e os números em `--muted` peso 400 — dois
  pesos na mesma linha, para o olho pegar primeiro de que seleção se
  trata e depois o placar; a linha inteira, chevron incluído, é a área
  de toque do colapso, e quebra em mais de uma linha quando não cabe na
  largura, sem nunca cortar o resumo
- Com o filtro ativo, a seção sem nenhuma figurinha no estado filtrado
  desaparece inteira — cabeçalho e corpo —, e o super-grupo que fica
  sem seções visíveis também (ver
  [IDR 0025](idr/0025-filtro-oculta-secoes-vazias.md))
- Dentro do grupo, grade de figurinhas

### Disposição "Como no álbum"

Segundo modo de visualização dentro de cada grupo — reproduz a
disposição física real da página impressa (ver
[IDR 0009](idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)),
em vez de grade uniforme que se ajusta à largura da tela.

- Aplica-se às 48 seleções (20 espaços: escudo, 18 jogadores e foto do
  time) e à Coca-Cola (14 espaços em duas páginas); os Extras FIFA
  (FWC) exibem-se em lista contínua mesmo nesta disposição — e sem
  filtro (ver
  [IDR 0023](idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md))
- Cada página é um grid interno de trilhas de largura fixa (52px por
  trilha, 6px de espaçamento); as páginas ficam lado a lado quando
  cabem na largura da tela e empilham quando não cabem (IDR 0015)

#### Seleções — 4 trilhas por página

Todas as figurinhas do mesmo tamanho, exceto a 13: paisagem, ocupa duas
trilhas (mais larga, mesma altura); as demais em retrato.

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

#### Coca-Cola — 3 trilhas por página

Páginas 112–113 do álbum (requisitos.md, Anexo):

- **Página 1** (figurinhas 01–06): 2 linhas × 3 colunas, cheias
- **Página 2** (figurinhas 07–14): 3 colunas nas linhas 1 e 2 (07–09 e
  10–12) e 2 figurinhas na linha 3 (13 e 14)
- Todas em retrato, mesmo tamanho — não há espaço paisagem

### Figurinha
- Cartão retangular com bordas perfuradas (efeito selo)
- Código em duas linhas: sigla + número, como impresso na figurinha
  física
- Estados visuais por cor: cinza (faltante), verde (uma unidade),
  laranja com selo `×N` (repetidas)
- O selo `×N` conta as **unidades sobrando** (contagem − 1): `×1` = uma
  colada e uma sobrando, `×2` = uma colada e duas sobrando; aparece a
  partir da contagem 2 (ver
  [IDR 0021](idr/0021-selo-conta-unidades-sobrando.md))
- A caixa do selo tem largura fixa para dois dígitos (`×99`) — não muda
  de tamanho ao passar de `×9` para `×10`; a contagem para em 99, que é
  também o teto validado pelas regras
  ([TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md))
- Reforço não-cromático: faltante = cartão esvaziado (opacidade
  reduzida, borda tracejada); colada = cartão preenchido — além da cor,
  nunca no lugar dela
- Marca no canto superior direito para figurinhas metalizadas/especiais
- Controle de menos no canto inferior esquerdo, dentro do retângulo do
  cartão — não transborda, ao contrário do selo `×N`; só existe a
  partir da contagem 1, então a figurinha faltante não o exibe (ver
  [IDR 0032](idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md));
  oculto por padrão, aparece no hover e no foco, e fica sempre visível
  em tela sem hover (ver [IDR 0030](idr/0030-controle-de-menos-do-cartao.md))

### Interações
- Tocar na figurinha soma uma unidade — sem efeito ao chegar em 99
- Controle de menos remove uma unidade; como ele só existe a partir da
  contagem 1, não há decremento em 0 para absorver (IDR 0032)
- Comando desfazer, no cabeçalho, reverte a última alteração; repetível
  para as últimas 10 (ver
  [IDR 0010](idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md) e
  [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Tocar no título de seção ou de super-grupo colapsa/expande; tocar num
  ícone da faixa salta até a seção

### Avisos

Área flutuante, sempre colada à borda inferior da janela — sobrepõe o
conteúdo, não empurra o layout nem rola com a página (ver
[IDR 0029](idr/0029-avisos-flutuantes-com-tres-severidades.md)).

| Severidade | Duração | Eventos |
|---|---|---|
| Sucesso (verde) | some em 5s | gravado, carregado, lista copiada, exportado, importado |
| Aviso (dourado) | some em 5s | arquivo de importação inválido ou de versão desconhecida, área de transferência indisponível, gravação sem rede que ficou enfileirada |
| Falha (vermelho) | fica até ser dispensada ou até a operação seguinte do mesmo tipo ter sucesso | falha de gravação ou de carga |

Cada aviso é uma faixa de largura total colada ao pé da janela, com
borda superior de 2px na cor da severidade sobre um fundo escuro da
mesma família — vermelho `oklch(0.3 0.15 25)` sob borda `--notif-red`,
verde `oklch(0.32 0.1 150)` sob borda `--green-card`, dourado
`oklch(0.34 0.13 80)` sob borda `--gold`. O texto é claro, em 13px, com
as mesmas margens laterais do conteúdo, e uma sombra projetada para
cima separa a faixa da página. Empilhando, as faixas crescem para cima,
a partir da borda inferior.

A mensagem ocupa a faixa toda e é ela própria a área de toque que abre
o detalhe técnico; o `×` de dispensar fica isolado na ponta direita,
para que nenhum toque de curiosidade feche o aviso por engano. As
mensagens falam na voz do usuário e cabem numa linha — "Alterações
salvas", "Falha ao gravar — toque para detalhes", "Conexão instável —
sincronizando quando possível"; o jargão (código do erro, caminho do
documento, o que o app fará em seguida) fica guardado no detalhe.

- Tocar na falha expande a mensagem técnica original, recolhida por
  padrão (IDR 0017)
- Poucas mensagens empilham no máximo; nunca log com scroll (IDR 0008)
- O relógio do título (`updatedAt`) continua como registro do estado —
  "quando minha coleção foi salva" —, não como o aviso (IDR 0027)

### Camadas

Só três coisas saem do fluxo da página, e nesta ordem de empilhamento:

1. o **cabeçalho sticky**, que corre por cima do corpo enquanto a
   página rola;
2. a **área de avisos**, colada à borda inferior — passa por cima do
   cabeçalho se um dia se encontrarem numa janela baixa;
3. o **menu de ações**, acima de tudo — enquanto está aberto, nada o
   cobre.

O rodapé não flutua: rola com o conteúdo e aparece no fim da página.

## Wireframe da tela principal

Esquemático em texto; cores indicadas são as do
[IDR 0006](idr/0006-estados-visuais-e-interacao-da-figurinha.md).

### Página inteira

```
┌──────────────────────────────────────────────────────────────┐
│  ICONULA 2026 · 412/994 · 41% · ▢582 · ×37 · 12:34           │
│  [álbum|sigla] [lista|álbum] [todas|falt|rep]      [↺] [⋯]   │
│  [🏆][ALG][ARG][AUS]…[USA][UZB][🥤] ── rolável ──▶          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│     … grupos do catálogo, um após o outro, até o fim …       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  projeto independente · sem vínculo com Panini ou FIFA ·     │
│  marcas pertencem aos seus titulares (Lei 9.279/96)          │
└──────────────────────────────────────────────────────────────┘
```

- Uma única rolagem (IDR 0008); o cabeçalho é sticky
- Faixa de bandeiras no cabeçalho (salto — IDR 0016): uma linha
  rolável horizontalmente — exceção pontual ao scroll único
- `[⋯]` abre o menu de ações (IDR 0024): copiar faltantes, copiar
  repetidas, exportar JSON, importar JSON
- Avisos (IDR 0029): caixa flutuante colada à borda inferior — sucesso e
  aviso somem em 5s, a falha fica e revela a mensagem técnica ao toque;
  nunca log com scroll
- Estado vazio (0/994): tela normal, sem dica nem mensagem especial
- Desfazer: botão no cabeçalho, sempre visível quando há histórico
- Notação compacta (IDR 0018) em placar e títulos: `412/994 · 41% ·
  ▢582 · ×37` — as palavras vivem só no nome acessível

### Grupo na disposição lista

```
┌──────────────────────────────────────────────────────────────┐
│  ▾ [bandeira] Brasil BRA 24 · 12/20 · 60% · ▢8 · ×3          │
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
status atua aqui (todas/faltantes/coladas/repetidas) e leva junto as
seções sem resultado (IDR 0025). No cabeçalho do grupo, notação
compacta (IDR 0018): 12/20 = coladas do total, ▢8 = faltantes, ×3 =
repetidas — aqui o × conta **códigos distintos** com contagem ≥ 2,
enquanto no cartão conta **unidades sobrando** (IDR 0021).

### Grupo na disposição álbum — seleção

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

### Grupo na disposição álbum — Coca-Cola

```
     página 1 (fig. 01–06)        página 2 (fig. 07–14)
  ┌──────────────────────┐     ┌──────────────────────┐
  │ ┌────┐ ┌────┐ ┌────┐ │     │ ┌────┐ ┌────┐ ┌────┐ │
  │ │ 01 │ │ 02 │ │ 03 │ │     │ │ 07 │ │ 08 │ │ 09 │ │
  │ └────┘ └────┘ └────┘ │     │ └────┘ └────┘ └────┘ │
  │ ┌────┐ ┌────┐ ┌────┐ │     │ ┌────┐ ┌────┐ ┌────┐ │
  │ │ 04 │ │ 05 │ │ 06 │ │     │ │ 10 │ │ 11 │ │ 12 │ │
  │ └────┘ └────┘ └────┘ │     │ └────┘ └────┘ └────┘ │
  └──────────────────────┘     │ ┌────┐ ┌────┐        │
                               │ │ 13 │ │ 14 │        │
                               │ └────┘ └────┘        │
                               └──────────────────────┘
```

Três trilhas por página, mesmas medidas das seleções; 13 e 14 na
primeira e na segunda posição da linha 3 (IDR 0023).

### Figurinha

```
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ BRA      │     │ BRA      │     │ BRA    ● │
   │ 05       │     │ 05       │     │ 05       │
   │          │     │          │     │      ×2  │
   └──────────┘     └──────────┘     └──────────┘
    faltante         colada           repetida
    (cinza)          (verde)          (laranja, 2 sobrando)
```

- Código em duas linhas (sigla + número), como impresso na figurinha
  física; bordas perfuradas (efeito selo)
- `●` = metalizada/especial (marca dourada no canto); `×N` = unidades
  sobrando, contagem − 1 (IDR 0021)

## Tela de login

Desenho do protótipo, com os elementos que requisitos.md exige antes de
qualquer autenticação:

```
        ┌────────────────────────────────┐
        │         ICONULA 2026           │
        │  Controle suas figurinhas do   │
        │  álbum da Copa do Mundo 2026   │
        │                                │
        │   [ (G)  Entrar com Google ]   │
        │                                │
        │  Ao continuar, você confirma   │
        │  ter 12 anos ou mais, ou estar │
        │  autorizado pelos responsáveis │
        │                                │
        │     Política de privacidade    │
        └────────────────────────────────┘
     projeto independente · sem vínculo com Panini…
```

- Cartão centrado (largura máxima ~360px) em `--panel` sobre o fundo
  gramado, título em dourado
- Botão próprio do Google (fundo branco, disco colorido), login por
  popup (ADR 0006)
- A atestação de menores acompanha o botão; o link da política de
  privacidade fica abaixo, acessível sem autenticar
- O aviso de independência e marcas repete-se no rodapé
- Textos exatos, como no protótipo: subtítulo "Controle suas figurinhas
  do álbum da Copa do Mundo FIFA 2026"; botão "Entrar com Google";
  atestação "Ao continuar, você confirma ter 12 anos ou mais, ou estar
  autorizado pelos responsáveis."; link "Política de privacidade"

Medidas: o cartão fica centrado num bloco de altura mínima ~70vh — não
colado ao topo nem exatamente no meio da janela —, com raio 20px, borda
`--border` e `padding: 36px 28px`; título em Poppins 700 de 26px
dourado com `letter-spacing: .02em`, subtítulo de 14px em `--muted` e
28px de respiro até o botão. O botão do Google é uma barra branca de
raio 10px, `padding: 12px`, texto `#3c4043` em 14px/600, precedido do
disco de 18px com as quatro cores da marca — é o único elemento claro
do produto, e é assim de propósito: fora do tema, reconhecível como
botão do provedor. A atestação vem 20px abaixo do botão e o link da
política mais 16px adiante, ambos em 12px `--muted`. O rodapé desta
tela repete o texto do rodapé do app sem o filete superior — a tela de
login não tem divisória alguma além da borda do cartão.

## Demais telas

*A preencher quando desenhados: os diálogos de exportação e importação (o
menu de ações define a porta de entrada, não o diálogo).*

### Política de privacidade

Vista interna, sem router (TDR 0020): substitui o conteúdo da tela por
inteiro, com um "← Voltar" no topo que devolve para a tela de origem — não
depende do histórico do navegador. Alcançável de dois lugares (IDR 0037):
o link no rodapé da tela de login, antes de autenticar, e o link no rodapé
da tela principal, depois.

Layout simples de leitura, sem o cartão da tela de login: corpo de largura
máxima ~640px centrado, com o mesmo `--page-gutter` das demais telas.
Título "Política de privacidade" em Poppins 700/22px dourado; seções com
título 15px/600 e texto de corpo 14px em `--muted`, `line-height: 1.6`.

Conteúdo: dados tratados (identidade Google e a coleção), finalidade, onde
os dados ficam (Cloud Firestore, `southamerica-east1`), retenção, direitos
do titular e o tratamento de dados de menores (ligado à atestação do
primeiro login) — cada um exercido pelo canal de contato declarado no
próprio texto (`docs/plano/.../0004-politica-de-privacidade-e-rodape.md`
tem a pergunta e a resposta que fixou esse endereço).

## Apresentação por faixa de tela

Decidido até aqui, válido em qualquer faixa:

- Lista (todas as seções): fluxo horizontal com wrap vertical
- Álbum (seleções e Coca-Cola): páginas lado a lado quando cabem na
  largura, empilhadas quando não cabem (IDR 0015)

Padrão da primeira abertura, sem preferência guardada — a partir daí vale
o que ficou guardado (IDR 0026):

- Celular (até 512px de largura) e tablet (513–1024px): ordenação pela
  página do álbum, disposição álbum — aparelhos portáteis, onde comparar
  com a página física é o valor
- Navegador (acima de 1024px): ordenação por sigla, disposição em lista —
  janela larga favorece a visão geral

Os limites reaproveitam o único ponto de quebra que o próprio spread do
álbum já produz de forma fluida (sem media query): a largura em que as
duas páginas (472px de conteúdo) deixam de caber ao lado da margem lateral
mínima do app (IDR 0043).

## Identidade visual

Tema escuro único — verde-gramado com detalhes dourados, inspirado no
estádio. O app não segue `prefers-color-scheme` e não tem tema claro
(IDR 0022).

### Paleta (tokens CSS, OKLCH)

| Token | Valor | Uso |
|---|---|---|
| `--turf` | `oklch(0.22 0.06 150)` | fundo da página |
| `--turf-deep` | `oklch(0.15 0.05 150)` | cabeçalho sticky, fundo do selo `×N` |
| `--panel` | `oklch(0.19 0.05 150)` | cabeçalho de seção, chips, cartão faltante |
| `--border` | `oklch(0.32 0.05 150)` | bordas e divisores |
| `--gold` | `oklch(0.78 0.14 85)` | título, controle ativo, marca de metalizada, links |
| `--cream` | `oklch(0.95 0.01 90)` | texto principal |
| `--muted` | `oklch(0.68 0.02 150)` | texto secundário, borda tracejada do faltante |
| `--green-card` | `oklch(0.62 0.13 145)` | cartão colada |
| `--orange-card` | `oklch(0.68 0.15 55)` | cartão repetida e selo `×N` |
| `--ink-on-light` | `oklch(0.2 0.02 90)` | texto sobre cartão colorido |
| `--notif-red` | `oklch(0.6 0.18 25)` | borda da faixa de falha (fundo `oklch(0.3 0.15 25)`) |

### Tipografia

- Poppins (600/700) no título, nos códigos dos cartões e nos nomes de
  seção; `system-ui` no restante
- `font-variant-numeric: tabular-nums` no título e nos resumos — os
  números não dançam quando a contagem muda

### Medidas

- Foco visível: contorno de 2px em `--gold`, afastado 2px da borda, em
  todo elemento focável — só por teclado (`:focus-visible`), sem acender em
  clique de mouse ou toque (IDR 0042)
- Cabeçalho sticky, `padding: 12px clamp(16px, 4vw, 40px) 10px`, borda
  inferior `--border`; título 15px, com os números em `--cream`, os
  separadores `·` em `--muted` peso 400 e o relógio um ponto menor
  (13px) também em `--muted` — o placar pesa mais que a hora
- Controles: grupos segmentados sobre `--panel`, raio 9px, item
  `5px 12px` em 12px/600 — ativo com fundo `--gold` e texto
  `--turf-deep`, inativo transparente em `--muted`
- Desfazer e menu de ações: botões de 30×30px, raio 8px, borda e texto
  em `--gold`, alinhados à direita da linha; em tela sensível, área de
  toque ampliada até a metade do espaçamento entre os dois, sem crescer
  visualmente (IDR 0042)
- Faixa de bandeiras: ícones de 30×30px, raio 8px, fundo `--panel`
  (`--gold` no destaque), espaçamento 4px, rolagem horizontal; o glifo
  da bandeira em 15px, centralizado no quadrado — o espaçamento é o
  mais apertado que ainda separa duas bandeiras vizinhas, para caber o
  máximo de seções na largura antes de precisar rolar; em tela sensível,
  área de toque ampliada até a metade desse espaçamento (IDR 0042)
- Corpo: `padding: 20px clamp(16px, 4vw, 40px) 60px`, 16px entre
  super-grupos
- Sem largura máxima de conteúdo: a página ocupa toda a largura
  disponível — quem dá o ritmo é a margem lateral
  `clamp(16px, 4vw, 40px)`, a mesma no cabeçalho, no corpo e na faixa
  de avisos, de modo que tudo alinha na mesma vertical
- Espaçamentos internos: 14px entre seções dentro de um super-grupo,
  10px entre o cabeçalho da seção e a sua grade, 8px entre cartões na
  disposição lista e 20px entre as duas páginas na disposição álbum
- Título de super-grupo: 13px/600 em `--gold`, com chevron `▾`/`▸`, sem
  painel
- Cabeçalho de seção: painel com borda, raio 12px, `padding: 10px 14px`;
  ícone 18px, nome 14px/600 em `--cream`, números em `--muted`
- Cartão na lista: 52×66px, raio 5px
- Código do cartão em Poppins 700, sigla acima do número: na lista,
  sigla 10px com `letter-spacing: .03em` sobre número 13px; no álbum, o
  mesmo cartão com tipografia um ponto menor — sigla 9px sobre número
  12px
- Cartão no álbum: grade de trilhas de 52px e linhas de 52px, 6px de
  espaçamento; a figurinha 13 ocupa duas trilhas
- Faltante: fundo `--panel`, borda 2px tracejada `--muted`, texto
  `--muted`, opacidade 0.6 — o "cartão esvaziado" do IDR 0006
- Colada e repetida: fundo e borda sólidos na cor do estado, texto
  `--ink-on-light`, opacidade 1
- Toque no cartão: além da mudança de cor do estado, encolhe e volta
  (`scale(0.92)`, 60ms) no instante do toque/clique (IDR 0042)
- Selo `×N`: canto inferior direito, transbordando ~6px do cartão;
  fundo `--turf-deep`, borda e texto `--orange-card`, 10px/700, raio
  8px, largura fixa para dois dígitos; no álbum acompanha o cartão
  menor — 9px/700, raio 7px, transbordando ~5px
- Marca de metalizada: ponto de 6px em `--gold` no canto superior
  direito (5px no álbum), com 3px de recuo das bordas na lista e 2px no
  álbum — dentro do cartão, nunca transbordando como o selo
- Controle de menos: círculo de 18px no canto inferior esquerdo (16px no
  álbum), com o mesmo recuo da marca de metalizada — 3px na lista, 2px
  no álbum —, fundo `--turf-deep`, borda de 1px e sinal `−` em
  `--gold`, 13px/700 (12px no álbum); nunca transborda o cartão; em tela
  sensível, área de toque ampliada para 26px (22px no álbum), contida no
  cartão (IDR 0042)
- Área de avisos: flutuante (`position: fixed`) colada à borda
  inferior, `padding: 12px clamp(16px, 4vw, 40px)` e sombra
  `0 -6px 20px` para cima; borda superior de 2px na cor da severidade
  sobre fundo escuro da mesma família — falha `oklch(0.3 0.15 25)` sob
  `--notif-red`, sucesso `oklch(0.32 0.1 150)` sob `--green-card`,
  aviso `oklch(0.34 0.13 80)` sob `--gold`; texto claro em 13px,
  detalhe técnico em monospace 11px, `×` de dispensar em 16px na ponta
  direita
- Menu de ações: painel de largura mínima 230px, raio 10px e `6px` de
  respiro interno, aberto logo abaixo da linha de controles e alinhado
  pela direita; itens de `9px 12px` em 13px, raio 7px; filetes de 1px
  em `--border` com margem `4px 6px`; sombra `0 8px 24px`
- Links: `--gold`, sem sublinhado, opacidade 0.8 sob o cursor
- Rodapé: 11px em `--muted`, borda superior `--border`

## Pendências de interface

- Se e onde o link da política de privacidade reaparece depois de
  autenticado — o menu de ações (IDR 0024) é o candidato natural
- O que acontece ao saltar (faixa de bandeiras) para uma seção que o
  filtro ativo ocultou (IDR 0025): a faixa lista as 50 seções sempre
- Se a atestação de menores é o próprio clique de entrar — como no
  protótipo, que a exibe a cada login — ou um passo explícito só na
  primeira vez; requisitos.md pede "um clique atestando… uma única vez
  por conta"
- Diálogos de exportação e importação
