<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0043: Padrões de primeira abertura por faixa de tela

## Status

Aceito.

## Contexto

`docs/interface.md` § Pendências de interface listava, desde o início do
plano, a última pendência de interface que atravessa as fases: qual
ordenação e qual disposição vêm pré-selecionadas na primeira abertura, em
cada faixa de tela (celular, tablet, navegador). O
[IDR 0026](0026-preferencias-de-vista-persistidas-no-navegador.md) resolveu
o que acontece da segunda abertura em diante (a preferência guardada no
`localStorage` vence), mas deixou este ponto explicitamente em aberto em sua
seção de Consequências.

Sem essa decisão, a Tarefa 0003-0001 precisou de um valor inicial provisório
para não travar a Fase 3 por uma questão que não era dela — o
[TDR 0015](../tdr/0015-ordenacao-padrao-provisoria-ordem-do-album.md) fixou
`'pagina'` (ordem do álbum) como ordenação padrão até esta tarefa decidir. A
disposição, por sua vez, herdou `'lista'` como padrão de fato na Tarefa
0004-0005, sem uma decisão própria.

O encaminhamento desta tarefa (`docs/plano/0010-*/0003-*.md` § Decisões em
aberto) sugere reaproveitar "os mesmos pontos de quebra que a disposição
álbum já usa" para os limites de faixa, para não haver duas noções de
"estreito" no app. Na prática, porém, a disposição álbum
([IDR 0015](0015-paginas-do-album-empilham-em-tela-estreita.md)) não usa
nenhuma media query: `.secao__album` é `display: flex; flex-wrap: wrap`, e
o navegador decide sozinho, pela largura real disponível, se as duas
páginas do spread cabem lado a lado ou empilham. Não existe um breakpoint
em pixels já escrito em algum CSS para copiar — existe, sim, um ponto de
recuo geométrico derivável das medidas já fixadas em `interface.md` §
Medidas:

- Cada página de seleção é um grid de 4 trilhas de 52px
  (`src/components/PaginaDoAlbum.jsx`) com 6px de gap entre trilhas: 4×52 +
  3×6 = 226px de largura.
- As duas páginas do spread somam 226 + `--album-page-gap` (20px) + 226 =
  **472px** de conteúdo.
- Esse conteúdo vive dentro da margem lateral mínima do corpo,
  `--page-gutter: clamp(16px, 4vw, 40px)`, de cada lado.

Resolvendo `largura − 2 × clamp(16px, 4vw, 40px) ≥ 472px` para a faixa em
que o `clamp` está no meio da rampa (`4vw`, válida entre 400px e 1000px de
largura), o ponto de virada fica em `largura ≈ 513px`: abaixo dele, o
spread já não cabe e empilha (mesmo sem media query); a partir dele, cabe
lado a lado. Esse é o único ponto de quebra que a disposição álbum de fato
produz — reaproveitável para o limite celular/tablet.

Não há, no app, um segundo ponto de quebra equivalente para separar tablet
de navegador: o spread não volta a mudar de layout acima de ~513px. Esse
segundo limite é, portanto, uma decisão livre desta tarefa (impedimento
nível 1 — ambiguidade menor, reversível e interna).

## Decisão

- **Limites de faixa** (largura da janela, `window.innerWidth`):
  - **Celular**: até 512px — arredondamento do ponto de recuo geométrico do
    próprio spread do álbum (~513px, calculado acima), para não introduzir
    uma segunda noção de "estreito" no app.
  - **Tablet**: de 513px até 1024px — sem precedente próprio no app (o
    spread só tem um ponto de quebra); adotado por convenção comum de
    mercado para tablet em paisagem (ex.: iPad, 1024px de largura lógica).
  - **Navegador**: acima de 1024px.
- **Par (ordenação, disposição) pré-selecionado por faixa, sem preferência
  guardada**:
  - Celular e tablet: ordenação pela página do álbum (`'pagina'`),
    disposição álbum (`'album'`) — ambos são aparelhos portáteis; o
    celular é o aparelho da feira de troca, onde comparar com a página
    física do álbum é justamente o valor da disposição álbum
    (IDR 0015 § Contexto), e o tablet, mesmo quando o spread já cabe
    lado a lado, continua sendo um aparelho que se leva à mão, não uma
    estação de trabalho.
  - Navegador: ordenação por sigla (`'sigla'`), disposição lista
    (`'lista'`) — a janela larga favorece a visão geral e a busca direta
    pelo código da seção, não a comparação física.
  - O filtro de status permanece `'todas'` em qualquer faixa — a pendência
    era só sobre ordenação e disposição.
- A faixa só decide o **ponto de partida** da primeira abertura: é lida uma
  única vez, na inicialização preguiçosa do `useState` de `App.jsx` (mesmo
  padrão já usado para ler as preferências guardadas), com
  `window.innerWidth`. Redimensionar a janela depois não recalcula nem
  troca a ordenação/disposição da sessão em andamento — não existe listener
  de `resize`.
- Qualquer preferência já guardada no `localStorage` — mesmo uma gravação
  antiga só com filtro alterado — faz a faixa deixar de importar
  inteiramente, conforme o IDR 0026.
- Este registro substitui o padrão provisório do TDR 0015 (ordenação
  `'pagina'` fixa, em qualquer faixa): o TDR 0015 é atualizado para
  apontar para este IDR, resolvendo a nota de provisoriedade do log da
  Tarefa 0003-0001.

## Consequências

- Fecha a última pendência de `docs/interface.md` § Pendências de
  interface.
- Zero custo e zero requisição: cálculo local, sem estado novo persistido
  — só um `window.innerWidth` lido no mesmo `useState` que já lia as
  preferências.
- O limite celular/tablet (512px) está amarrado às medidas atuais do
  spread (trilhas de 52px, gap de 20px, `--page-gutter` mínimo de 16px);
  se essas medidas mudarem no futuro, o limite deveria ser recalculado
  para continuar coerente — o cálculo fica documentado aqui para isso.
- Tablet herda o par do celular, não o do navegador, por uma leitura do
  "aparelho portátil" que não tem apoio textual direto em `requisitos.md`
  ou `interface.md` (que só falam de celular e de "janela larga"); é
  reversível sem migração, porque nenhuma preferência gravada depende
  desta escolha — só afeta quem nunca guardou preferência.

## Alternativas consideradas

- **Tablet parear com o navegador** (`'sigla'`/`'lista'`): a partir de
  ~513px o spread já cabe lado a lado, então visualmente um tablet em
  paisagem já se parece com um navegador largo — mas um tablet continua
  sendo levado à mão como o celular, e nada nos requisitos aponta um uso
  de "visão geral" específico do tablet; mantido junto do celular.
- **Um único padrão para as três faixas**: mais simples, mas devolveria a
  pendência de `interface.md` sem responder ao raciocínio já dado pelo
  objetivo desta tarefa (celular pede o álbum, janela larga pede visão
  geral).
- **Observar a faixa continuamente com `matchMedia`**: violaria o critério
  de aceite "redimensionar não altera a escolha corrente" — exigiria
  lógica extra só para ignorar mudanças depois da primeira leitura; mais
  simples ler `window.innerWidth` uma única vez, no mesmo inicializador
  preguiçoso que já lê o `localStorage`.
- **Expor o limite de 512px como custom property CSS compartilhada com
  JS**: não é possível — `@media (max-width: var(--x))` não é suportado
  nos navegadores-alvo (`docs/requisitos.md` § Requisitos Não Funcionais);
  o número fica só documentado aqui e comentado no código, para
  rastreabilidade caso as medidas do spread mudem.
