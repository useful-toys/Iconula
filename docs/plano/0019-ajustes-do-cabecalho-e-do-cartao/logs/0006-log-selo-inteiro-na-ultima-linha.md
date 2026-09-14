<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0006: selo `×N` inteiro na última linha

## Data
2026-09-14

## Resumo
Antes: o selo `×N` transborda o canto inferior direito do cartão (nominal
~6px, IDR 0021 — na prática ~4px, porque `right`/`bottom` negativos medem
contra a caixa de padding de `.figurinha__visual`, que tem borda de 2px
desde a Tarefa 0019-0005), mas `.secao` tem `content-visibility: auto`, que
implica contenção de pintura — a seção recorta qualquer pintura de
descendente que passe da sua caixa de padding. Na última linha da seção o
transbordo inferior cai além da caixa (o selo aparece cortado junto ao
título da seção seguinte) e, no cartão encostado à borda direita, o
transbordo lateral também. Depois: a caixa da seção ganha uma folga de 6px
à direita e embaixo, compensada por margem negativa equivalente; a
contenção passa a recortar 6px além do conteúdo, cobrindo o transbordo na
lista e no álbum sem mudar nenhuma distância visível (a margem devolve o
espaço ao fluxo). Confirmado no Chromium (Edge headless, repro local com os
CSS reais): os pixels do selo abaixo da borda inferior e à direita da borda
direita do cartão, que saíam brancos (recortados), passam a pintar o selo;
as posições de cartão/cabeçalho e as distâncias entre seções ficam
idênticas antes/depois. A descoberta entra no `## Contexto` do TDR 0021, a
folga na `## Decisão` e a entrada no `## Histórico`.

## Discovery
- Código: `src/components/Secao.css` é a única regra de `.secao` (o
  `content-visibility`/`contain-intrinsic-size` em `Secao.css:3-17`). O
  transbordo vem de `src/components/Figurinha.css:170-185` —
  `.figurinha__selo` com `right: -6px; bottom: -6px`, posicionado relativo a
  `.figurinha__visual` (`position: absolute; inset: 0`, `Figurinha.css:53-63`),
  que ocupa o cartão inteiro; a metalizada (`Figurinha.css:160-168`) não
  transborda. O selo só existe a partir da contagem 2 (`Figurinha.jsx:158`,
  `227-231`). Layout: `Catalogo.css:3-8` põe `.catalogo` com `gap:
  var(--section-gap)` = 10px e `padding: var(--body-padding)`; a grade da
  lista (`.secao__grade`, `Secao.css:136-140`) empacota cartões de 60px com
  8px de gap, e o álbum (`.secao__album`, `Secao.css:148-152`) empacota
  páginas de trilhas fixas (`.pagina-album`, `PaginaDoAlbum.css:3-8`, linhas
  de 68px); a página tem 4 trilhas de 60px (`PaginaDoAlbum.jsx:26-31`).
  `src/theme.css:116-124` fixa `box-sizing: border-box` global, então a
  folga+padding não muda a medida externa da seção: o padding é absorvido
  pela margem negativa equivalente no fluxo e só estende a caixa de pintura.
  Nenhum outro componente estiliza `.secao`. Comportamento atual confere com
  a tarefa (é a contenção de pintura que corta o selo, não empilhamento).
- Testes: `Secao.test.jsx` cobre estrutura, colapso, filtro e rótulos no
  DOM; nenhum teste lê CSS nem mede layout (jsdom não faz pintura) — a
  mudança é só CSS e não altera o JSX, então nenhum teste precisa mudar. A
  busca por `contain`/`content-visibility` só encontra as regras de
  `Secao.css` (e `overflow` pontual em `FaixaDeSecoes.css`, fora do assunto).
- Convenções locais: tokens de espaçamento em `src/theme.css`; valores
  pontuais de componente ficam no próprio CSS com comentário citando o
  IDR/TDR entre parênteses; o selo é a única coisa que transborda o cartão
  junto com a área de toque do menos (que cresce só para dentro).
- Impactos fora de "Arquivos impactados": nenhum. `docs/interface.md`
  § Medidas (`interface.md:697-699`, "transbordando ~6px do cartão") continua
  correto — o selo segue transbordando, só deixa de ser recortado. As
  distâncias entre seções (10px), super-grupos (12px) e cabeçalho/grade (8px)
  são de `theme.css`/`Catalogo.css`/`SuperGrupo.css` e não são tocadas.
- Documentação: reli o TDR 0021 (§ Decisão — em especial o item 2, que hoje
  descreve só o `content-visibility` e o `contain-intrinsic-size` — e
  § Consequências), o IDR 0050 (§ Decisão, espaçamentos), o IDR 0021
  (o selo transborda) e `docs/interface.md` § Medidas. As referências
  bastaram; o TDR 0021 não tem `## Histórico` (o guia da pasta o prevê) e a
  § Decisão precisa citar a folga para não contradizer o código.

## Plano da alteração
1. `src/components/Secao.css` — em `.secao`, guardar a medida do transbordo
   numa custom property local (ex.: `--secao-folga-selo: 6px`), aplicar
   `padding` de 0 nesse valor à direita e embaixo e `margin` negativo de
   mesmo valor à direita e embaixo. O padding estende a caixa de pintura da
   seção (a contenção deixa de recortar o selo), e a margem negativa devolve
   o espaço no fluxo, mantendo intactas as distâncias visíveis e a largura do
   cabeçalho colorido (o `width: 100%` do botão passa a medir o conteúdo
   original). Comentário apontando o porquê (TDR 0021, IDR 0021).
2. `src/theme.css` — decidir sobre `--secao-altura-estimada`: o token estima
   a altura **interna** (conteúdo) que o `contain-intrinsic-size` usa como
   placeholder (CSS Sizing 4 § 5.2, "explicit intrinsic inner size"); o
   padding é somado por fora, pelo modelo de caixa, tanto no placeholder
   quanto na caixa real. Como a geometria do conteúdo não muda (só ganha
   padding em volta), o valor permanece o mesmo, salvo se a medição no
   navegador mostrar o contrário.
3. `docs/tdr/0021-desempenho-do-catalogo.md` — § Contexto: registrar a
   descoberta (contenção de pintura recorta o transbordo dos adornos do
   cartão; ~6px, ~5px no álbum); § Decisão item 2: citar a folga compensada;
   § Histórico: criar a seção com a entrada datada. Sem mudança de Status.
4. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (selo inteiro na última linha, lista e álbum) → verificação
    visual em navegador (motor Chromium disponível via Edge headless;
    WebKit pode ficar pendente), por captura de tela e medição de geometria
    num repro local que usa os CSS reais;
  - critério 2 (`content-visibility: auto` em cada seção) → busca por
    `content-visibility` em `src/components/Secao.css`;
  - critério 3 (distâncias 10/12/8px iguais) → medição da geometria
    (retângulos) no repro, e leitura de `theme.css`/`Catalogo.css`/
    `SuperGrupo.css` (não tocados);
  - critério 4 (TDR 0021 com a descoberta e o histórico) → leitura das
    seções.
- Riscos: a margem negativa faz a caixa da seção transbordar 6px para a
  direita do wrapper e 6px para baixo, dentro do `padding` do corpo
  (`--page-gutter` ≥ 16px) e do vão de 10/12px entre blocos — não deve gerar
  barra de rolagem horizontal nem sobrepor a seção seguinte; a medição com o
  navegador confirma. `contain-intrinsic-size` diz respeito ao conteúdo
  interno; se a prática divergir da especificação, recalibro o token
  (+6px) e registro.
- Desvios: nenhum.

## Decisões tomadas
- **Folga de 6px à direita e embaixo na `.secao`, compensada por margem
  negativa equivalente**, guardada na custom property local
  `--secao-folga-selo` (nível 1, TDR 0021): estende a caixa de pintura da
  contenção sem tirar o `content-visibility` nem mexer no fluxo — as
  distâncias visíveis (IDR 0050) e a largura do cabeçalho colorido ficam
  iguais.
- **`--secao-altura-estimada` mantido em 370px** (nível 1, TDR 0021): o
  token estima a altura interna (conteúdo) que o `contain-intrinsic-size`
  usa como placeholder (CSS Sizing 4 § 5.2, "explicit intrinsic inner
  size"); o padding é somado por fora pelo modelo de caixa, no placeholder e
  na caixa real. Medido no navegador: a seção saltada foi de 370px (sem
  folga) para 376px (com folga) = conteúdo + padding. Recalibrar somaria o
  padding duas vezes.
- **Overflow real ~4px, não ~6px/5px** como no texto da tarefa/IDR:
  `right`/`bottom` negativos do selo medem contra a caixa de padding de
  `.figurinha__visual` (borda de 2px, Tarefa 0019-0005), então o transbordo
  além do cartão é 6 − 2 = 4px, igual na lista e no álbum. A folga de 6px
  cobre com sobra; a divergência com o texto nominal fica registrada como
  observação, sem mudar o resultado.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 40ms on 73
  files with 105 rules using 4 threads.`
- `npm run test` → `Test Files 37 passed (37)`, `Tests 449 passed (449)`.
- `npm run build` → `✓ built in 464ms`. O aviso de chunk >500 kB
  (`index.esm-BFfFMrY1.js`, 505,90 kB) é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.
- Verificação visual — Chromium (Edge headless), repro local com os CSS
  reais (`theme.css`, `Catalogo.css`, `Secao.css`, `Figurinha.css`,
  `PaginaDoAlbum.css`), sem login. Reproduzi a seção com o último cartão
  repetida encostado na última linha e na borda direita, na lista e no
  álbum, e amostrei pixels:
  - sem a folga: pixel 2,6px abaixo da borda inferior do cartão e pixel 2px
    à direita da borda direita → brancos (selo recortado);
  - com a folga: os mesmos pixels → cor do selo (`--turf-deep`/borda
    `--orange-card`); o pixel dentro do selo acima da borda inferior pinta o
    selo nos dois casos.
  Geometria idêntica antes/depois fora da folga: cartão 476–536 × 122,4–190,4,
  selo 512–540 × 180,4–194,4, seção de 536→542 de largura (só a caixa de
  pintura cresce). Com a contenção desligada no repro (só para medir o
  fluxo), a caixa da seção com folga tem os mesmos 536 de largura de
  conteúdo e o mesmo *wrapper* de 114,39px de altura do caso sem folga (a
  seção em si vai a 120,39 só pelo padding), o vão cabeçalho/grade continua
  8px, a distância da grade ao início da seção seguinte continua 10px e a
  largura do cabeçalho é idêntica (536). O vão de 12px entre super-grupos é
  de `SuperGrupo.css`, intocado. WebKit não está disponível neste ambiente
  (só motores Chromium instalados) e instalar um motor novo seria setup não
  previsto — verificação WebKit pendente, roteiro abaixo.

## Critérios de aceite
- [x] Selo `×N` inteiro na última linha da seção, na lista e no álbum —
      Chromium (Edge headless), amostragem de pixels: sem a folga os pixels
      do transbordo inferior/direito saem brancos; com a folga, pintam o
      selo. Verificação WebKit pendente (motor indisponível), roteiro
      abaixo.
- [x] `content-visibility: auto` presente em cada seção — busca: segue como
      a única declaração, em `Secao.css:29`; a folga foi somada sem tirar a
      contenção.
- [x] Distâncias entre seções (10px), super-grupos (12px) e cabeçalho/grade
      (8px) iguais às de antes — medição no repro: vão cabeçalho/grade = 8px
      e grade→início da seção seguinte = 10px, idênticos com e sem folga; o
      *wrapper* mantém a mesma altura (114,39px) e a mesma largura de
      conteúdo (536px); o vão de 12px entre super-grupos está em
      `SuperGrupo.css`, não tocado.
- [x] TDR 0021 com a descoberta no contexto e entrada no histórico —
      § Contexto ganha "A contenção de pintura recorta o transbordo dos
      adornos do cartão"; § Decisão item 2 cita a folga; § Histórico criado
      com a entrada de 2026-09-14.

Verificação visual WebKit pendente (sem motor WebKit neste ambiente),
roteiro: em `npm run dev`, na lista e no álbum, nas duas ordenações,
marcar uma figurinha da última linha da seção como repetida e conferir o
selo `×N` inteiro junto ao título da seção seguinte; conferir o mesmo no
cartão encostado à borda direita; saltar por bandeira até uma seção
distante e conferir que não há salto de layout.

## Arquivos alterados
- `src/components/Secao.css` — `.secao` ganha `--secao-folga-selo: 6px`,
  `padding` e `margin` negativa equivalentes à direita/embaixo, com o
  comentário do porquê (TDR 0021, IDR 0021/0047, IDR 0050).
- `docs/tdr/0021-desempenho-do-catalogo.md` — § Contexto (descoberta do
  recorte do selo pela contenção de pintura), § Decisão item 2 (folga
  compensada) e § Histórico (criado, entrada de 2026-09-14).
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0006-selo-inteiro-na-ultima-linha.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/logs/0006-log-selo-inteiro-na-ultima-linha.md`
  — este log.
