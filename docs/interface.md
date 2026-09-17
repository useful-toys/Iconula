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
- Comando desfazer: botão à direita da linha dos grupos, sempre visível e
  desabilitado quando não há histórico — reverte a última alteração;
  repetido, as últimas 10
  (ver [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Botão compartilhar: ícone de três nós ligados de 30×30px na primeira linha,
  logo à esquerda do avatar, abre o popup com as duas cópias das listas de
  troca (§ Compartilhar — ver
  [IDR 0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md) e
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- Avatar do usuário: foto da conta Google (ou a inicial do nome; sem nome, o
  glifo) de 30×30px na primeira linha, no extremo direito, à direita do
  título, abre o popup com os comandos raros — export/import e sair da conta
  (ver [IDR 0049](idr/0049-avatar-como-gatilho-do-menu-de-acoes.md) e
  [IDR 0024](idr/0024-acoes-raras-em-menu-do-cabecalho.md))
- Tudo no cabeçalho sticky, em qualquer largura, nesta ordem: título →
  grupos segmentados → faixa de bandeiras; nada do cabeçalho rola com o
  conteúdo. Cabendo, título, grupos, desfazer, compartilhar e avatar dividem
  uma linha; quebrando (título em duas linhas ou grupos sem espaço), o
  compartilhar e o avatar ficam na primeira linha, à direita do título, e os
  grupos descem para as linhas seguintes, acima da faixa; o desfazer
  acompanha os grupos (ver
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- Faixa de bandeiras (salto para seção): última linha do cabeçalho,
  abaixo dos grupos — uma linha com as 50 seções, bandeira da seleção ou
  ícone temático do especial (🏆 Extras FIFA, 🥤 Coca-Cola), rolável para os
  lados; tocar salta até a seção (ver
  [IDR 0016](idr/0016-salto-pela-faixa-de-bandeiras.md)) — a ordem acompanha
  o catálogo: 🏆 no início, 🥤 no fim (IDR 0028)
- Cada bandeira da faixa mostra, abaixo dela, um tooltip com sigla, nome e
  progresso da seção na notação compacta — `BRA · Brasil · 12/20 · 60% ·
  ▢8 · ×3`; aparece no hover depois de ~400ms e na hora no foco por
  teclado, nunca em toque (tocar já salta). É um único elemento, fora da
  faixa rolável, preso à largura da janela (ver
  [IDR 0052](idr/0052-tooltip-nas-bandeiras-da-faixa.md))

### Controles
- Dentro do cabeçalho sticky, em qualquer largura: na mesma linha do
  título quando cabe; sem espaço, desce para as linhas seguintes, acima da
  faixa de bandeiras (IDR 0018)
- Alternador de ordenação: página do álbum físico × sigla da seção —
  em ambas, os Extras FIFA abrem o catálogo e a Coca-Cola o fecha (ver
  [IDR 0028](idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md))
- Alternador de disposição: lista contínua × layout da página física
- Filtro de status (todas/faltantes/coladas/repetidas): apenas na
  disposição lista — na disposição álbum o alternador de filtro nem
  aparece, para nenhuma seção (IDR 0023)
- Coladas é contagem ≥ 1 e repetidas é contagem ≥ 2: os dois conjuntos
  se sobrepõem de propósito — toda repetida é colada — e a tela não
  sinaliza a sobreposição (ver
  [IDR 0033](idr/0033-filtro-de-coladas.md))
- Rótulos curtos, como no protótipo: `Página` | `Sigla`, `Lista` |
  `Álbum`, `Todas` | `Falt.` | `Col.` | `Rep.` — abreviados para os três
  grupos caberem numa linha de celular, que com o quarto segmento do
  filtro passa a depender da quebra descrita abaixo; a forma por extenso
  vive só no nome acessível, como manda a notação compacta do IDR 0018
- Cada opção mostra, abaixo dela, o próprio nome por extenso como tooltip
  visual — no hover depois de ~400ms e na hora no foco por teclado
  (`:focus-visible`); em toque, não; nas pontas de cada grupo, alinhado à
  borda do grupo para não estourar a viewport (ver
  [IDR 0048](idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md))
- Os grupos segmentados fluem da esquerda para a direita e quebram para
  a linha seguinte quando não cabem na largura; o desfazer fica sempre
  colado à direita da linha dos grupos, separado dos alternadores pelo
  espaço que sobrar — some o filtro (disposição álbum) e ele não se move
- À direita da linha dos grupos, o desfazer (`↺`); o botão compartilhar e o
  avatar do usuário, que abrem os popups de listas de troca e de comandos
  raros, ficam na primeira linha, à direita do título, com o compartilhar
  logo à esquerda do avatar (ver
  [IDR 0049](idr/0049-avatar-como-gatilho-do-menu-de-acoes.md) e
  [IDR 0018](idr/0018-usuario-especialista-e-minimalismo.md))
- Ordenação, disposição, filtro e o colapso manual de seções e
  super-grupos são lembrados entre sessões (`localStorage`, por
  dispositivo — ver
  [IDR 0026](idr/0026-preferencias-de-vista-persistidas-no-navegador.md));
  o padrão de quem nunca fechou nada é tudo aberto, e o salto que abre o
  alvo também grava a abertura (ver
  [IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md))

### Menu de ações

Popup aberto pelo avatar do usuário no cabeçalho, com três comandos (IDR 0024,
IDR 0049):

- **Exportar** a coleção em JSON
- **Importar** coleção de arquivo JSON — com a confirmação explícita
  exigida por requisitos.md; a importação descarta o histórico de
  desfazer
- **Sair da conta** — grava o que estiver pendente e volta à tela de
  login

Os três itens vêm em dois blocos separados por filete: a dupla
exportar/importar e, isolado no fim, sair da conta —
este último em `--notif-red`, o único item vermelho da tela principal,
porque é o único que tira o usuário de onde ele está. O popup é
ancorado ao avatar que o abriu: alinhado pela borda direita, logo abaixo
dele, painel `--panel` sobre borda `--border`, com
sombra projetada que o descola do conteúdo por baixo. As duas cópias das
listas de troca saíram daqui na Tarefa 0021-0001, para o popup de
§ Compartilhar.

Fecha ao escolher um comando, ao tocar fora ou com `Esc`. Todo comando
dá retorno na área de avisos — "coleção exportada" —,
efêmero como qualquer sucesso (ver
[IDR 0029](idr/0029-avisos-flutuantes-com-tres-severidades.md)).

#### Compartilhar

Popup aberto pelo botão compartilhar, logo à esquerda do avatar (IDR 0024,
IDR 0018), organizado por lista em dois blocos separados por filete:

- Copiar lista de **faltantes** para a área de transferência
- Compartilhar **faltantes**… — abre a folha de compartilhamento do sistema
- Copiar lista de **repetidas** para a área de transferência
- Compartilhar **repetidas**… — abre a folha de compartilhamento do sistema

Os dois itens de **Compartilhar** existem só onde o navegador oferece a folha
de compartilhamento do sistema (`navigator.share`); sem ela, o popup fica só
com as duas cópias (IDR 0024). Compartilhar não assume nenhum app: o usuário
escolhe (Signal, WhatsApp, Telegram, e-mail…). O texto é o de `requisitos.md`
§ Compartilhamento, sempre na ordem do álbum (IDR 0039), o mesmo da cópia.

Um terceiro bloco, também separado por filete, fecha o popup com a **chave do
link do catálogo** (IDR 0024, IDR 0055). O rótulo diz o estado por extenso —
`Link do catálogo: ligado` / `Link do catálogo: desligado` — e a chave é um
`switch` com `aria-checked`, então o leitor de tela anuncia nome e estado
(IDR 0018). Tocar na chave **não fecha** o popup: liga ou desliga na hora e o
foco fica na chave, para copiar ou compartilhar o link em seguida (Tarefa
0027-0005); `Esc`, toque fora e saída pelo teclado seguem fechando, como nos
demais itens. A escrita é imediata e fora da gravação agregada — não move o
relógio do título —, com "link ligado" ou "link desligado" na área de avisos;
a falha reverte a chave ao estado anterior e avisa "falha ao ligar o link" ou
"falha ao desligar o link" (IDR 0029), sem confirmação, porque é reversível
(IDR 0010).

Ligado, logo abaixo da chave, o bloco traz **Copiar link do catálogo** e, só
onde o navegador oferece a folha do sistema, **Compartilhar link do catálogo…**
(IDR 0055): os dois entregam apenas a URL `<origem>/catalogo/<uid>` — sem texto
junto, que apps que juntam `text` e `url` duplicariam. Desligado, nenhum dos
dois existe. A cópia dá retorno ("link copiado") e o compartilhamento, "link
compartilhado"; fechar a folha sem escolher não gera aviso e, se a folha falhar
por outro motivo, a URL cai na cópia, com o aviso e a reserva do
[IDR 0039](idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md).

O popup é ancorado ao botão que o abriu, alinhado pela borda direita, logo
abaixo dele, com o mesmo painel e a mesma sombra do menu de ações. Segue o
mesmo comportamento de fechamento e foco: fecha ao escolher um item, ao tocar
fora ou com `Esc`; ao abrir, o foco entra no primeiro item habilitado e volta
ao botão ao fechar. A cópia dá retorno ("lista copiada") e o compartilhamento,
"lista compartilhada", na área de avisos (IDR 0029); fechar a folha sem
escolher não gera aviso e, se a folha falhar por outro motivo, o texto cai na
cópia, com o aviso e a reserva do
[IDR 0039](idr/0039-texto-de-troca-ordem-fixa-e-copia-manual-de-reserva.md).

### Corpo
- Grupos = seções do catálogo: 48 seleções e os especiais "Extras FIFA"
  e "Coca-Cola" — em qualquer ordenação, o FWC é o primeiro grupo da
  página e a Coca-Cola o último (IDR 0028)
- Na ordenação por ordem do álbum, super-grupos colapsáveis acima dos
  grupos: os 12 grupos da Copa A–L — título com nome e progresso
  agregado em notação compacta (ex.: `Grupo C · 34/80 · 43% · ▢46 ·
  ×12`); expandem por padrão, o salto expande o grupo-alvo (ver
  [IDR 0019](idr/0019-ordem-do-album-agrupada-e-colapsavel.md)). O
  título tem, à direita, o alternador `⊟`/`⊞`, só com o grupo aberto,
  que contrai ou expande as suas seções (ver
  [IDR 0020](idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md));
  FWC e Coca-Cola ficam fora dos super-grupos, nas pontas; na ordenação
  por sigla não há super-grupos
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
- Dentro do grupo, grade de figurinhas; na lista, a figurinha paisagem (13
  das seleções) tem 70×60px, centralizada na altura da linha de cartões de
  70px (IDR 0047)

### Disposição "Como no álbum"

Segundo modo de visualização dentro de cada grupo — reproduz a
disposição física real da página impressa (ver
[IDR 0009](idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)),
em vez de grade uniforme que se ajusta à largura da tela.

- Aplica-se às 48 seleções (20 espaços: escudo, 18 jogadores e foto do
  time), à Coca-Cola (14 espaços em duas páginas) e aos Extras FIFA (FWC
  — 20 espaços em oito páginas, em quatro pares) — ver
  [IDR 0023](idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md)
- Cada página é um grid interno de trilhas de largura fixa (60px por
  trilha, 70px por linha, 6px de espaçamento), com as linhas e as
  colunas do seu layout (seleções 3 × 4; Coca-Cola 2 × 3 na página 1 e
  3 × 3 na página 2 — [MDR 0006](model-dr/0006-catalogo-estatico-embutido.md))
- As páginas vêm em pares (spreads); dentro do par, lado a lado quando
  cabem na largura da tela e empilhadas quando não cabem (IDR 0015,
  IDR 0047); pares seguidos ficam 20px um abaixo do outro
  ([IDR 0023](idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md))

#### Seleções — 4 trilhas por página

Todas as figurinhas em retrato, exceto a 13: paisagem de 70×60px,
centralizada no espaço das trilhas 3 e 4 (IDR 0047).

**Coluna 1 — figurinhas 1 a 10, em três linhas:**
- Linha 1: figurinhas 1 e 2 alinhadas à direita do bloco (posições 3 e
  4 das 4 trilhas)
- Linha 2: figurinhas 3 a 6 — preenchem as 4 trilhas
- Linha 3: figurinhas 7 a 10 — preenchem as 4 trilhas

**Coluna 2 — figurinhas 11 a 20, em três linhas:**
- Linha 1: figurinhas 11 e 12 em retrato (trilhas 1 e 2) e a figurinha
  13 em paisagem de 70×60px nas trilhas 3 e 4
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

#### Extras FIFA — oito páginas em quatro pares

Páginas 0–3 e 106–109 do álbum físico, em quatro pares (0|1, 2|3,
106|107, 108|109); casa de 70×70px, 6px de espaçamento — maior que a
trilha de 60px das demais seções, para a paisagem de 70×60px caber numa
única trilha, em vez de duas:

| Página | Grade (linhas × colunas) | Figurinhas: linha, coluna |
|---|---|---|
| 0 | 4 × 3 | 00: 1, 2 |
| 1 | 4 × 3 | 01: 1, 3 · 02: 2, 3 · 03: 3, 3 · 04: 4, 3 |
| 2 | 4 × 2 | 06: 2, 1 · 08: 4, 2 |
| 3 | 4 × 2 | 05: 1, 1 · 07: 3, 2 |
| 106 | 3 × 3 | 09: 1, 3 · 10: 2, 3 |
| 107 | 3 × 3 | 11: 1, 1 · 12: 2, 1 · 13: 3, 3 |
| 108 | 3 × 3 | 14: 2, 1 · 15: 3, 1 |
| 109 | 3 × 3 | 16: 1, 1 · 17: 1, 3 · 18: 2, 3 · 19: 3, 3 |

- Linhas e colunas vazias preservadas em qualquer largura: a grade de
  cada página tem a dimensão da tabela, não a da última figurinha
  (páginas 0, 106 e 108 ficam com linhas vazias)
- Moldura discreta em volta de cada página, só no FWC: 1px em
  `--border`, recuo interno de 6px (o mesmo espaço entre casas) e raio
  de 8px — ajuda a ler a posição nas páginas esparsas; casas vazias não
  têm desenho próprio; seleções e Coca-Cola seguem sem moldura
- Sem rótulo entre as duas partes (0–3 e 106–109) nem por página: os
  spreads se separam só pelo espaçamento de sempre
- (ver [IDR 0023](idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md))

### Figurinha
- Cartão retangular com bordas perfuradas (efeito selo)
- Código em duas linhas: sigla + número, como impresso na figurinha
  física
- Cartão em duas metades de mesma altura: código centralizado (horizontal
  e vertical) na de cima, nome centralizado na de baixo — o menos e o selo
  podem se sobrepor ao nome
- Nome em Roboto Condensed 500 de 10px, com ellipsis por linha: nos
  jogadores, duas linhas — prenomes em caixa normal e sobrenome em caixa
  alta (caixa alta só visual); nos Extras FIFA e na Coca-Cola, nome sem
  corte quebrado em até duas linhas
- Escudo (01) e foto do time (13) das seleções: mostram o nome genérico do
  catálogo na metade de baixo — o escudo em até duas linhas, a foto numa
  linha só, com ellipsis; o nome completo segue no nome acessível (ver
  [IDR 0047](idr/0047-nomes-de-jogadores-nas-figurinhas.md))
- Toda paisagem mostra o nome numa linha só; as paisagens do FWC usam o
  nome curto (ex.: "Uruguai 1950"), com o nome completo no nome acessível
  (ver [IDR 0047](idr/0047-nomes-de-jogadores-nas-figurinhas.md))
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
- Controle de menos encostado no canto inferior esquerdo, sobre a borda
  do cartão — recuo 0, sem transbordar, ao contrário do selo `×N`; só
  existe a partir da contagem 1, então a figurinha faltante não o exibe
  (ver
  [IDR 0032](idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md));
  oculto por padrão, aparece no hover e no foco por teclado, e fica
  sempre visível em tela sem hover (IDR 0032)
- Em tela sensível, segurar o cartão por 500ms tira uma unidade — atalho
  para não mirar no controle de menos; o cartão escurece durante a espera e
  mover o dedo mais de 10px cancela — rolagem nunca decrementa (ver
  [IDR 0051](idr/0051-pressao-longa-decrementa-no-toque.md))

### Interações
- Tocar na figurinha soma uma unidade — sem efeito ao chegar em 99
- Controle de menos remove uma unidade; como ele só existe a partir da
  contagem 1, não há decremento em 0 para absorver (IDR 0032)
- Comando desfazer, no cabeçalho, reverte a última alteração; repetível
  para as últimas 10 (ver
  [IDR 0010](idr/0010-desfazer-ajustes-em-vez-de-confirmacoes.md) e
  [IDR 0012](idr/0012-desfazer-no-cabecalho-historico-de-10.md))
- Tocar no título de seção ou de super-grupo colapsa/expande; tocar no
  alternador `⊟`/`⊞` do super-grupo contrai ou expande as suas seções —
  inclusive as ocultas pelo filtro (IDR 0020); tocar num ícone da faixa
  salta até a seção

### Avisos

Área flutuante, sempre colada à borda inferior da janela — sobrepõe o
conteúdo, não empurra o layout nem rola com a página (ver
[IDR 0029](idr/0029-avisos-flutuantes-com-tres-severidades.md)).

| Severidade | Duração | Eventos |
|---|---|---|
| Sucesso (verde) | some em 5s | gravado, carregado, lista copiada, lista compartilhada, exportado, importado, link ligado, link desligado, link copiado, link compartilhado |
| Aviso (dourado) | some em 5s | arquivo de importação inválido ou de versão desconhecida, área de transferência indisponível, gravação sem rede que ficou enfileirada |
| Falha (vermelho) | fica até ser dispensada ou até a operação seguinte do mesmo tipo ter sucesso | falha de gravação, de carga, de carga do catálogo compartilhado por link ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)) ou ao ligar ou desligar o link |

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
2. o **tooltip da faixa de bandeiras** — logo abaixo da bandeira sob o
   cursor ou o foco, acima do cabeçalho e abaixo dos popups (ver
   [IDR 0052](idr/0052-tooltip-nas-bandeiras-da-faixa.md));
3. a **área de avisos**, colada à borda inferior — passa por cima do
   cabeçalho se um dia se encontrarem numa janela baixa;
4. os **popups do cabeçalho** (menu de ações e compartilhar), acima de
   tudo — enquanto um está aberto, nada o cobre.

O rodapé não flutua: rola com o conteúdo e aparece no fim da página.

## Wireframe da tela principal

Esquemático em texto; cores indicadas são as do
[IDR 0006](idr/0006-estados-visuais-e-interacao-da-figurinha.md).

### Página inteira

```
┌──────────────────────────────────────────────────────────────┐
│  ICONULA 2026 · 412/994 · 41% · ▢582 · ×37 · 12:34 [↗] [ (D) ] │
│  [álbum|sigla] [lista|álbum] [todas|falt|col|rep]       [↺]  │
│  [🏆][ALG][ARG][AUS]…[USA][UZB][🥤] ── rolável ──▶          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│     … grupos do catálogo, um após o outro, até o fim …       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  © 2026 Daniel Felix Ferber                                  │
│  projeto independente · sem vínculo com Panini ou FIFA ·     │
│  marcas pertencem aos seus titulares (Lei 9.279/96)          │
│  uso por sua conta e risco, sem garantias                    │
│  Política de privacidade · Termos de uso                     │
└──────────────────────────────────────────────────────────────┘
```

- Uma única rolagem (IDR 0008); o cabeçalho sticky fixa título, avatar,
  controles e faixa de bandeiras em qualquer largura — nada dele rola com o
  conteúdo (IDR 0018)
- Faixa de bandeiras no cabeçalho (salto — IDR 0016): uma linha
  rolável horizontalmente — exceção pontual ao scroll único
- `↗︎` (compartilhar) abre o popup das listas de troca (IDR 0024, IDR 0018):
  copiar faltantes, copiar repetidas — logo à esquerda do avatar
- `(D)` (avatar) abre o menu de ações (IDR 0024, IDR 0049): exportar JSON,
  importar JSON e sair da conta
- Avisos (IDR 0029): caixa flutuante colada à borda inferior — sucesso e
  aviso somem em 5s, a falha fica e revela a mensagem técnica ao toque;
  nunca log com scroll
- Estado vazio (0/994): tela normal, sem dica nem mensagem especial
- Desfazer: botão à direita da linha dos grupos, sempre visível e
  desabilitado sem histórico
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
trilhas de 60px preservadas. A disposição álbum nunca cai para a lista
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

### Grupo na disposição álbum — Extras FIFA

```
   página 0 (4×3)          página 1 (4×3)
  ┌──────────────┐        ┌──────────────┐
  │ [  ][00][  ] │        │ [  ][  ][01] │
  │ [  ][  ][  ] │        │ [  ][  ][02] │
  │ [  ][  ][  ] │        │ [  ][  ][03] │
  │ [  ][  ][  ] │        │ [  ][  ][04] │
  └──────────────┘        └──────────────┘

   página 2 (4×2)     página 3 (4×2)
  ┌─────────┐        ┌─────────┐
  │ [  ][  ]│        │ [05][  ]│
  │ [06][  ]│        │ [  ][  ]│
  │ [  ][  ]│        │ [  ][07]│
  │ [  ][08]│        │ [  ][  ]│
  └─────────┘        └─────────┘

   página 106 (3×3)        página 107 (3×3)
  ┌──────────────┐        ┌──────────────┐
  │ [  ][  ][09] │        │ [11][  ][  ] │
  │ [  ][  ][10] │        │ [12][  ][  ] │
  │ [  ][  ][  ] │        │ [  ][  ][13] │
  └──────────────┘        └──────────────┘

   página 108 (3×3)        página 109 (3×3)
  ┌──────────────┐        ┌──────────────┐
  │ [  ][  ][  ] │        │ [16][  ][17] │
  │ [14][  ][  ] │        │ [  ][  ][18] │
  │ [15][  ][  ] │        │ [  ][  ][19] │
  └──────────────┘        └──────────────┘
```

Casas vazias em branco — a grade preserva as linhas e colunas mesmo sem
figurinha; a moldura (1px `--border`, recuo 6px, raio 8px) contorna cada
página, sozinha entre as três seções (IDR 0023). Quatro pares na ordem
0|1, 2|3, 106|107, 108|109 — lado a lado quando cabem, empilhados quando
não (IDR 0015), 20px entre pares. Com a moldura, página de 3 colunas =
236px, de 2 colunas = 160px; par 0|1, 106|107 e 108|109 = 492px, par
2|3 = 340px — todos abaixo dos 536px do spread das seleções.

### Figurinha

```
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │   BRA    │     │   BRA    │     │   BRA  ● │     │   BRA    │
   │    05    │     │    05    │     │    05    │     │    01    │
   │ Gabriel  │     │ Gabriel  │     │ Gabriel  │     │  Escudo  │
   │MAGALHÃES │     │ −ALHÃES  │     │ −ALHÃ×2  │     │  do time │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
    faltante         colada           repetida         escudo (01) e
    (cinza)          (verde)          (laranja,        foto do time (13)
                                      2 sobrando)      com o nome
```

- Duas metades de mesma altura: código em duas linhas (sigla + número),
  como impresso na figurinha física, centralizado na de cima; nome
  centralizado na de baixo, em Roboto Condensed 500 de 10px — o menos e o
  selo podem cobrir parte dele (IDR 0047)
- Escudo e foto do time das seleções: mostram o nome do catálogo na metade
  de baixo — o escudo em até duas linhas, a foto numa linha (IDR 0047)
- Bordas perfuradas (efeito selo)
- `●` = metalizada/especial (marca dourada no canto); `×N` = unidades
  sobrando, contagem − 1 (IDR 0021)

## Tela de login

Desenho do protótipo, com os elementos que requisitos.md exige antes de
qualquer autenticação:

```
        ┌───────────────────────────────────────┐
        │              ICONULA 2026              │
        │   Controle suas figurinhas do álbum   │
        │      da Copa do Mundo FIFA 2026       │
        │                                       │
        │      [ (G)  Entrar com Google ]       │
        │                                       │
        │   Ao continuar, você confirma ter 12  │
        │   anos ou mais, ou estar autorizado   │
        │  pelos responsáveis, e concorda com   │
        │           os Termos de uso.           │
        │                                       │
        │        Política de privacidade        │
        └───────────────────────────────────────┘
     © 2026 Daniel Felix Ferber
     projeto independente · sem vínculo com Panini…
     uso por sua conta e risco, sem garantias.
```

- Cartão centrado (largura máxima ~360px) em `--panel` sobre o fundo
  neutro, título em dourado
- Botão próprio do Google (fundo branco, disco colorido), login por
  popup (ADR 0005)
- A atestação de menores acompanha o botão e a frase de aceite declara a
  concordância com os termos, com "Termos de uso" como link; abaixo dela fica
  o link "Política de privacidade", acessível sem autenticar
  ([IDR 0053](idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md))
- O rodapé traz copyright, o aviso de independência e marcas e a isenção de
  responsabilidade, sem filete, na ordem do
  [IDR 0053](idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md)
- Textos exatos, como no protótipo: subtítulo "Controle suas figurinhas
  do álbum da Copa do Mundo FIFA 2026"; botão "Entrar com Google";
  atestação "Ao continuar, você confirma ter 12 anos ou mais, ou estar
  autorizado pelos responsáveis, e concorda com os Termos de uso.";
  o link "Termos de uso" dentro da frase de aceite e o link
  "Política de privacidade" abaixo dela

Medidas: o cartão fica centrado num bloco de altura mínima ~70vh — não
colado ao topo nem exatamente no meio da janela —, com raio 20px, borda
`--border` e `padding: 36px 28px`; título em Poppins 700 de 26px
dourado com `letter-spacing: .02em`, subtítulo de 14px em `--muted` e
28px de respiro até o botão. O botão do Google é uma barra branca de
raio 10px, `padding: 12px`, texto `#3c4043` em 14px/600, precedido do
disco de 18px com as quatro cores da marca — é o único elemento claro
do produto, e é assim de propósito: fora do tema, reconhecível como
botão do provedor. A atestação vem 20px abaixo do botão, com o link
"Termos de uso" dentro da própria frase, e o link "Política de
privacidade" mais 16px adiante, em 12px `--muted`. O
rodapé desta tela repete as três primeiras linhas do rodapé do app —
copyright, aviso de marcas e isenção — sem o filete superior — a tela de
login não tem divisória alguma além da borda do cartão.

## Demais telas

### Exportação

Sem diálogo: escolher "Exportar" no menu de ações baixa o arquivo direto e
emite o aviso de sucesso "Coleção exportada" — uma segunda etapa de
confirmação contrariaria "sem etapas adicionais" de `requisitos.md` §
Portabilidade, e não há nada destrutivo a confirmar. Nome do arquivo
`iconula-AAAA-MM-DD.json`, com a data local de quem exporta (ver
[IDR 0040](idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md)).

### Importação

Sem tela própria: "Importar" no menu de ações abre o seletor nativo de
arquivo do sistema operacional. Um arquivo inválido é rejeitado direto, com
aviso — só um arquivo válido chega a perguntar. A confirmação usa
`window.confirm()` nativo (não um componente do app), com a mensagem direta
de que a coleção atual será substituída por inteiro e a operação não pode
ser desfeita — a substituição é irreversível e descarta também o histórico
de desfazer. Uma chave de código que não existe mais no catálogo é
descartada sem recusar o resto do arquivo, com um segundo aviso informando
quantas foram descartadas (ver
[IDR 0041](idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md)).

### Política de privacidade

Vista interna, sem router (TDR 0020): substitui o conteúdo da tela por
inteiro, com um "← Voltar" no topo que devolve para a tela de origem — não
depende do histórico do navegador. Alcançável de dois lugares (IDR 0037):
o link no rodapé da tela de login, antes de autenticar, e o link no rodapé
da tela principal, depois.

Convivendo com a vista de termos, uma por vez: o estado único de vista
interna (TDR 0020) impede as duas ligadas ao mesmo tempo, e não há caminho
de uma para a outra dentro da própria vista.

Layout simples de leitura, sem o cartão da tela de login: corpo de largura
máxima ~640px centrado, com o mesmo `--page-gutter` das demais telas.
Título "Política de privacidade" em Poppins 700/22px dourado; seções com
título 15px/600 e texto de corpo 14px em `--muted`, `line-height: 1.6`.

Conteúdo: dados tratados (identidade Google e a coleção), finalidade, onde
os dados ficam (Cloud Firestore, `southamerica-east1`), link do catálogo,
retenção, direitos do titular e o tratamento de dados de menores (ligado à
atestação do primeiro login) — cada um exercido pelo canal de contato
declarado no próprio texto (`docs/plano/.../0004-politica-de-privacidade-e-rodape.md`
tem a pergunta e a resposta que fixou esse endereço).

A seção "Link do catálogo" declara a visibilidade por link
([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)):
ligado, a coleção (contagens e data da última gravação) fica visível, sem
login, a quem tiver o link, até desligá-lo; o link traz um identificador
interno da conta, e nome, e-mail e foto não aparecem. A frase dos terceiros
em "Onde os dados ficam" acompanha: além do Google, só quem tiver o link,
quando ele estiver ligado.

### Termos de uso

Vista interna, sem router (TDR 0020), a quarta tela do app: substitui o
conteúdo da tela por inteiro, com um "← Voltar" no topo que devolve para a
tela de origem. Duas portas de entrada
([IDR 0053](idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md)):
a frase de aceite e a linha de links da tela de login, antes de autenticar,
e a linha de links do rodapé da tela principal, depois.

Mesmo layout de leitura da política: corpo de largura máxima ~640px
centrado, com o `--page-gutter`, título "Termos de uso" em Poppins 700/22px
dourado e seções com título 15px/600 e corpo 14px em `--muted`,
`line-height: 1.6`.

Conteúdo, na ordem do roteiro do IDR 0053: aceite; o que é o serviço
(gratuito e independente, sem vínculo com Panini ou FIFA); uso no estado em
que se encontra, sem garantia de disponibilidade nem contra perda de dados,
com o exportar como proteção; responsabilidade pela própria conta Google;
limitação de responsabilidade; marcas; alterações dos termos; lei
brasileira; e contato pelo mesmo endereço declarado na política.

### Catálogo compartilhado

Vista somente leitura do catálogo do dono, aberta por `/catalogo/<uid>` sem
login, inclusive para o próprio dono — "o caminho manda" (IDR 0055; caminho
lido por `App.jsx` sem router — TDR 0020). É a tela principal sem edição:

- mantém o cabeçalho com placar e relógio (`updatedAt` do dono), os grupos
  de ordenação, disposição e filtro, a faixa de bandeiras com tooltip, o
  colapso de seções e super-grupos e o rodapé com política e termos;
- some com o desfazer, o botão compartilhar e o avatar; os cartões não
  reagem a toque — sem papel de botão e fora da ordem de tabulação, com o
  nome acessível preservado;
- acrescenta o rótulo `somente leitura` no fim da linha do título e torna
  `ICONULA 2026` um link para `/`, que leva ao próprio catálogo (ou à tela
  de login);
- lê a ordenação, a disposição, o filtro e o colapso guardados no dispositivo
  (ou o padrão por faixa de tela), mas as trocas valem só enquanto a vista
  está aberta: olhar o catálogo de outro não muda as próprias preferências
  (IDR 0026).

Estados, em tela cheia e sem cabeçalho:

- carregando: tela neutra, como o intervalo da sessão (IDR 0035);
- link desligado e `uid` inexistente têm a mesma resposta — `Este catálogo
  não está compartilhado.` e o link `Conhecer o Iconula` para `/` —, porque
  as regras negam os dois do mesmo jeito e a vista não revela se a conta
  existe; `uid` vazio ou barra final caem aqui, sem leitura;
- falha de leitura: a mesma tela, com o aviso de falha (ver § Avisos);
  recarregar a página tenta de novo.

Uma única leitura do documento ao abrir: a vista não se atualiza sozinha
enquanto aberta e não carrega a coleção de quem está vendo. Nenhum nome,
foto ou dado da conta do dono aparece.

## Apresentação por faixa de tela

Decidido até aqui, válido em qualquer faixa:

- Lista (todas as seções): fluxo horizontal com wrap vertical
- Álbum (todas as seções): páginas lado a lado quando cabem na largura,
  empilhadas quando não cabem (IDR 0015); o maior par do FWC tem 492px,
  abaixo dos 536px das seleções — o limite de 582px do IDR 0043 não muda

Padrão da primeira abertura, sem preferência guardada — a partir daí vale
o que ficou guardado (IDR 0026):

- Celular (até 582px de largura) e tablet (583–1024px): ordenação pela
  página do álbum, disposição álbum — aparelhos portáteis, onde comparar
  com a página física é o valor
- Navegador (acima de 1024px): ordenação por sigla, disposição em lista —
  janela larga favorece a visão geral

Os limites reaproveitam o único ponto de quebra que o próprio spread do
álbum já produz de forma fluida (sem media query): a largura em que as
duas páginas (536px de conteúdo) deixam de caber ao lado da margem lateral
mínima do app (IDR 0043, recalculado com as trilhas de 60px na
Tarefa 0017-0004).

## Identidade visual

Tema escuro único. A identidade verde-gramado com dourado, inspirada no
estádio, fica restrita ao `.cabecalho` (a barra fixa do topo); o resto da
aplicação usa fundo neutro, sem matiz, para não competir com as cores de
grupo e de seção. O app não segue `prefers-color-scheme` e não tem tema
claro (IDR 0022).

### Paleta (tokens CSS, OKLCH)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `oklch(0.22 0 0)` | fundo da página (corpo e telas internas) |
| `--bg-deep` | `oklch(0.15 0 0)` | fundo do selo `×N` e do controle de menos; texto sobre o controle ativo |
| `--turf` | `oklch(0.22 0.06 150)` | fundo do `.cabecalho` — único uso da identidade verde-gramado |
| `--panel` | `oklch(0.19 0 0)` | cabeçalho de seção, chips, cartão faltante |
| `--border` | `oklch(0.32 0 0)` | bordas e divisores |
| `--gold` | `oklch(0.78 0.14 85)` | título, controle ativo, marca de metalizada, links |
| `--cream` | `oklch(0.95 0.01 90)` | texto principal |
| `--muted` | `oklch(0.68 0.02 150)` | texto secundário, borda tracejada do faltante |
| `--green-card` | `oklch(0.62 0.13 145)` | cartão colada |
| `--orange-card` | `oklch(0.68 0.15 55)` | cartão repetida e selo `×N` |
| `--ink-on-light` | `oklch(0.2 0.02 90)` | texto sobre cartão colorido |
| `--notif-red` | `oklch(0.6 0.18 25)` | borda da faixa de falha (fundo `oklch(0.3 0.15 25)`) |
| `--group-a` | `oklch(0.710 0.124 142.3)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-b` | `oklch(0.577 0.234 28.3)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-c` | `oklch(0.892 0.163 111.2)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-d` | `oklch(0.513 0.129 254.8)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-d-raw` | `oklch(0.413 0.129 254.8)` | identidade do grupo D — variante original (barra do título e da faixa) |
| `--group-e` | `oklch(0.647 0.177 46.4)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-f` | `oklch(0.502 0.093 170.5)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-f-raw` | `oklch(0.473 0.093 170.5)` | identidade do grupo F — variante original (barra do título e da faixa) |
| `--group-g` | `oklch(0.815 0.050 277.6)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-h` | `oklch(0.696 0.089 166.7)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-i` | `oklch(0.525 0.127 293.2)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-i-raw` | `oklch(0.399 0.127 293.2)` | identidade do grupo I — variante original (barra do título e da faixa) |
| `--group-j` | `oklch(0.818 0.095 26.5)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-k` | `oklch(0.589 0.200 7.6)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-l` | `oklch(0.530 0.140 21.8)` | identidade do grupo — variante ajustada (fundo tingido do título e da faixa) |
| `--group-l-raw` | `oklch(0.392 0.140 21.8)` | identidade do grupo L — variante original (barra do título e da faixa) |
| `--coc-red` | `oklch(0.55 0.2 29)` | identidade da Coca-Cola (título do super-grupo, faixa de bandeiras) |
| `--group-fwc` | `var(--gold)` | alias de `--gold` para os Extras FIFA |
| `--group-coc` | `var(--coc-red)` | alias de `--coc-red` para a Coca-Cola |
| `--selection-<sigla>-1/-2/-3` | tabela do IDR 0046 | cores da bandeira da seleção, por posição no degradê do anel: 1 topo, 2 canto inferior esquerdo, 3 canto inferior direito — variante ajustada (clareada); nas cores sem ajuste, serve também ao anel |
| `--selection-<sigla>-N-raw` | tabela do IDR 0046 | cor original da bandeira (anel), só nas posições marcadas "→ aj." |
| `--selection-fwc` | `var(--group-fwc)` | alias de `--group-fwc` para os Extras FIFA |
| `--selection-coc` | `var(--group-coc)` | alias de `--group-coc` para a Coca-Cola |

Os 12 super-grupos da Copa (A–L) e os especiais (FWC, COC) têm cor de
identidade com os valores do
[IDR 0045](idr/0045-cores-de-super-grupos.md): as 12 cores de grupo, o
`--coc-red` e os alias `--group-fwc` (de `--gold`) e `--group-coc` (de
`--coc-red`). Cada cor de grupo tem duas variantes: a **ajustada**
(`--group-<x>`, luminosidade corrigida para ≥ 3:1 sobre `--turf`) tinge o
fundo a 30% no título do super-grupo e a 60% (80% no hover) na faixa de
bandeiras; a **original** (`--group-<x>-raw`, RGB oficial sem ajuste) desenha
a barra esquerda de 3px do título e a barra inferior de 2px da faixa. Nos
grupos em que a original já atinge o contraste mínimo a ajustada é a própria
original e um único token cobre as duas finalidades — só D, F, I e L têm
`-raw`. As cores são aplicadas no título do super-grupo e na faixa de
bandeiras.

As 48 seleções têm as cores da própria bandeira na seção, com os valores da
tabela do [IDR 0046](idr/0046-cores-de-selecoes.md): até 3 tokens por
seleção, um por posição no degradê do anel — `-1` no topo, `-2` no canto
inferior esquerdo e `-3` no direito. Onde a 2ª e a 3ª cor da bandeira
coincidem, o token `-2` cobre as duas posições; onde as três coincidem, só
`-1` existe. Cada posição segue a convenção de duas variantes das cores de
grupo (IDR 0045): o sufixo `-raw` é a **original** sem ajuste (a cor do
anel) e o token sem sufixo é a **ajustada** (clareada para ≥ 3:1 contra
`--bg`) — só as posições marcadas "→ aj." na tabela têm `-raw`; nas demais
a original já atinge o contraste mínimo e um único token serve ao anel. O
interior da seção fica em `--bg` neutro, sem fundo tingido. Os especiais
FWC e COC usam os alias `--selection-fwc` (de `--group-fwc`) e
`--selection-coc` (de `--group-coc`), de cor única, sem degradê.

### Tipografia

- Poppins (600/700) no título, nos códigos dos cartões e nos nomes de
  seção; `system-ui` no restante
- Roboto Condensed 500 no nome das figurinhas, em 10px (IDR 0047) —
  vendorizada (TDR 0013)
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
- Controles: grupos segmentados sobre `--panel` com contorno de 1px em
  `--border` (IDR 0048), raio 9px, item `5px 12px` em 12px/600 — ativo
  com fundo `--gold` e texto `--bg-deep`, inativo transparente em
  `--muted`
- Desfazer: botão de 30×30px, raio 8px, borda e texto em `--gold`,
  colado à direita da linha dos grupos; em tela sensível, área de toque
  ampliada, sem crescer visualmente (IDR 0042)
- Botão compartilhar: 30×30px, raio 8px, borda e ícone (três nós ligados,
  SVG inline) em `--gold`, logo à esquerda do avatar; mesma área de toque
  ampliada do avatar (metade do espaçamento de 8px) e mesmo foco visível,
  sem sobrepor a área dele (IDR 0024, IDR 0042)
- Avatar do usuário: foto circular de 30×30px, sem borda; sem foto, a
  inicial maiúscula do nome em `--gold` sobre `--panel` com borda `--gold`;
  sem nome, o glifo do menu; mesma área de toque ampliada e mesmo foco
  visível do antigo botão (IDR 0049, IDR 0024, IDR 0042)
- Faixa de bandeiras: ícones de 30×30px, raio 8px, espaçamento de 2px e 4px
  entre os grupos na ordenação por página, rolagem horizontal; na ordenação
  por página o fundo mistura 60% da cor do grupo a `--panel` (FWC e COC
  incluídos), com barra inferior de 2px a 80% e hover que intensifica o fundo
  a 80%; na ordenação por sigla fica neutro em `--panel`, sem barra —
  `--border` sob o cursor (IDR 0045); o glifo da bandeira em 15px, centralizado
  no quadrado — o espaçamento é o mais apertado que ainda separa duas bandeiras
  vizinhas, para caber o máximo de seções na largura antes de precisar rolar;
  em tela sensível, área de toque ampliada de 1px em volta do ícone (IDR 0042)
- Tooltip da faixa: abaixo da bandeira, no visual do tooltip dos grupos
  (IDR 0048) — painel `--panel`, borda `--border`, texto `--cream`,
  11px/600, raio 6px e sombra; posicionado por JS fora da faixa rolável,
  centralizado na bandeira e preso à largura da janela (IDR 0052)
- Corpo: `padding: 20px clamp(16px, 4vw, 40px) 64px`, 12px entre
  super-grupos (IDR 0050)
- Sem largura máxima de conteúdo: a página ocupa toda a largura
  disponível — quem dá o ritmo é a margem lateral
  `clamp(16px, 4vw, 40px)`, a mesma no cabeçalho, no corpo e na faixa
  de avisos, de modo que tudo alinha na mesma vertical
- Espaçamentos internos: 10px entre seções dentro de um super-grupo,
  4px entre o cabeçalho da seção e a sua grade, 8px entre cartões na
  disposição lista e 20px entre as duas páginas na disposição álbum
  (IDR 0050)
- Título de super-grupo: 13px/600 em `--gold`, com chevron `▾`/`▸`, moldura
  arredondada (`--panel` com borda, raio 12px, `padding: 7px 12px`), barra
  esquerda de 3px e fundo com 30% da cor do grupo sobre `--panel`
  (IDR 0045); o alternador `⊟`/`⊞` fica na ponta direita, em `--gold`, sem
  fundo próprio (IDR 0020)
- Seção: anel em degradê contínuo de 2px abraçando o título e a grade, cor 1
  no topo, cor 2 no canto inferior esquerdo e cor 3 no direito, com o
  interior em `--bg` neutro (sem fundo tingido) e respiro interno de 8px
  para as figurinhas não encostarem no anel; raio externo 14px (interno
  12px); FWC e COC com cor única. O cabeçalho, dentro dela, não tem borda nem
  fundo próprios, só `padding: 4px 8px` (o mínimo para não colar no anel);
  ícone 18px, nome 14px/600 em `--cream`, números em `--muted` (IDR 0046,
  IDR 0050, IDR 0018)
- Cartão: 60×70px na lista e no álbum, paisagem 70×60px também nas duas
  disposições, raio 5px — duas metades de 33px úteis no retrato e 28px na
  paisagem: código centrado na de cima, nome na de baixo (na paisagem, uma
  linha de nome na metade de baixo, 28px úteis), com menos e selo por cima
  do nome (IDR 0047)
- Código do cartão em Poppins 700, sigla 10px com `letter-spacing: .03em`
  sobre número 13px, tipografia única nas duas disposições (IDR 0047)
- Cartão no álbum: grade de trilhas de 60px e linhas de 70px, 6px de
  espaçamento; a figurinha 13 é paisagem de 70×60px, centralizada no espaço
  das trilhas 3 e 4 (IDR 0015, IDR 0047)
- Cartão no álbum do FWC: casa de 70×70px com 6px de espaçamento — maior
  que a trilha de 60px das demais seções —, moldura de 1px em `--border`
  em volta de cada página, com recuo interno de 6px e raio de 8px, 20px
  entre pares de páginas; página de 3 colunas com 236px de largura total
  (com a moldura) e de 2 colunas com 160px (IDR 0023)
- Faltante: fundo `--panel`, borda 2px tracejada `--muted`, texto
  `--muted`, opacidade 0.6 — o "cartão esvaziado" do IDR 0006
- Colada e repetida: fundo e borda sólidos na cor do estado, texto
  `--ink-on-light`, opacidade 1
- Toque no cartão: além da mudança de cor do estado, encolhe e volta
  (`scale(0.92)`, 60ms) no instante do toque/clique (IDR 0042)
- Selo `×N`: canto inferior direito, transbordando ~6px do cartão;
  fundo `--bg-deep`, borda e texto `--orange-card`, 10px/700, raio
  8px, largura fixa para dois dígitos (IDR 0047)
- Marca de metalizada: ponto de 6px em `--gold` no canto superior
  direito, com 3px de recuo das bordas — dentro do cartão, nunca
  transbordando como o selo (IDR 0047)
- Controle de menos: círculo de 18px no canto inferior esquerdo, com
  recuo 0 (sobre a borda), fundo `--bg-deep`, borda de 1px e sinal `−`
  em `--gold`, 13px/700; nunca transborda o cartão; em tela sensível, área
  de toque ampliada só para dentro do cartão (para cima e para a direita),
  contida nele (IDR 0032, IDR 0042)
- Área de avisos: flutuante (`position: fixed`) colada à borda
  inferior, `padding: 6px clamp(16px, 4vw, 40px)` e sombra
  `0 -6px 20px` para cima; borda superior de 2px na cor da severidade
  sobre fundo escuro da mesma família — falha `oklch(0.3 0.15 25)` sob
  `--notif-red`, sucesso `oklch(0.32 0.1 150)` sob `--green-card`,
  aviso `oklch(0.34 0.13 80)` sob `--gold`; texto claro em 13px,
  detalhe técnico em monospace 11px, `×` de dispensar em 16px na ponta
  direita
- Menu de ações e compartilhar: painel de largura mínima 230px, raio 10px e
  `6px` de respiro interno, aberto logo abaixo do botão que o abriu e
  alinhado pela direita; itens de `9px 12px` em 13px, raio 7px; filetes de
  1px em `--border` com margem `4px 6px`; sombra `0 8px 24px` (IDR 0024)
- Links: `--gold`, sem sublinhado, opacidade 0.8 sob o cursor
- Rodapé: 11px em `--muted`, borda superior `--border`, linhas empilhadas na
  ordem do copyright, aviso de marcas, isenção e a linha com os dois links —
  "Política de privacidade · Termos de uso" —
  [IDR 0053](idr/0053-termos-de-uso-e-rodape-com-copyright-e-isencao.md)

## Pendências de interface

Nenhuma — as quatro pendências registradas ao longo do plano foram todas
resolvidas, com registro próprio:

- Se e onde o link da política de privacidade reaparece depois de
  autenticado: no rodapé da tela principal, ao lado do link já existente
  na tela de login — [IDR 0037](idr/0037-politica-no-rodape-depois-de-autenticado.md)
- O que acontece ao saltar (faixa de bandeiras) para uma seção que o
  filtro ativo ocultou: o salto volta o filtro para "todas" e então rola
  até a seção — [IDR 0031](idr/0031-salto-com-filtro-ativo.md)
- Se a atestação de menores é o próprio clique de entrar ou um passo
  explícito: passo explícito, uma única vez por conta, como
  `requisitos.md` exige — [IDR 0036](idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md)
- Diálogos de exportação e importação: exportação sem diálogo (baixa
  direto) — [IDR 0040](idr/0040-exportar-sem-dialogo-e-nome-de-arquivo-datado.md);
  importação com confirmação mínima via `window.confirm()` —
  [IDR 0041](idr/0041-importar-confirmacao-minima-e-descarte-de-chave-desconhecida.md)
