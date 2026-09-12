<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0021: Desempenho do catálogo — memoização + `content-visibility`, sem virtualização

## Status

Aceito — fecha o ponto em aberto "Virtualização das listas" de
`docs/arquitetura.md` § Pontos em aberto, na Tarefa 0010-0002.

## Contexto

`docs/requisitos.md` § Requisitos Não Funcionais pede que o catálogo com
~1000 figurinhas "renderize e filtre sem travar", com a virtualização
citada como recurso condicional ("se necessário"), não obrigação.
`docs/arquitetura.md` deixava em aberto a escolha da técnica para a
implementação, e `docs/idr/0008-uma-unica-pagina-scrollavel.md` proíbe
qualquer solução que crie um contêiner com rolagem própria — descartando de
saída qualquer biblioteca de virtualização que dependa de uma janela
rolável interna (a imensa maioria delas).

Antes de qualquer mudança, a Tarefa 0010-0002 mediu a árvore de componentes
tal como as Fases 2–9 a deixaram: `App.jsx` guarda `contagens` (mapa
esparso, um objeto por coleção inteira) em `useState` e o repassa, sem
memoização, a `Catalogo` → `Secao`/`SuperGrupo` → `Figurinha`. Nenhum desses
componentes usava `React.memo`, e vários callbacks (`onIncrementar`,
`onToggle`, o `ref` de cada `SuperGrupo`) eram recriados a cada
renderização. Resultado: **qualquer ajuste de contagem — tocar em uma única
figurinha — reexecutava as 994 `Figurinha`, as 50 `Secao` e os 12
`SuperGrupo`**, porque a identidade do objeto `contagens` muda a cada
ajuste e se propaga, sem filtro, a toda a árvore.

### Medição da linha de base

Sem acesso a um dispositivo físico "mais fraco" nem a uma sessão Google
autenticada automatizável neste ambiente (o catálogo só existe atrás do
login, `requisitos.md` § Acesso), a medição foi feita com Vitest + React
Testing Library em jsdom — o mesmo ambiente já usado pelos testes do
projeto —, montando `<Catalogo>` com o catálogo real de 994 figurinhas
dentro de um componente de suporte que replica o `useState` de `contagens`
de `App.jsx`. jsdom não faz layout nem pintura reais; os números abaixo
medem o custo de reconciliação/DOM do React (proxy para o trabalho de
thread principal), não o tempo de tela de um aparelho real — limitação
registrada explicitamente (Impedimento nível 2: premissa mais conservadora
documentada). A comparação antes/depois é válida porque usa exatamente a
mesma técnica nos dois lados.

Medianas de várias execuções (ver log da tarefa para as amostras brutas):

| Métrica | Antes | Depois |
|---|---:|---:|
| Primeira renderização (994 figurinhas) | ~560–715 ms | ~560–665 ms (sem mudança esperada) |
| **Ajuste de 1 contagem** | **~68 ms** | **~6 ms** |
| Trocar ordenação (página↔sigla) | ~554–586 ms | ~590–710 ms (sem mudança esperada) |
| Trocar disposição (lista↔álbum) | ~466–478 ms | ~500–590 ms (sem mudança esperada) |
| Trocar filtro | ~174–181 ms | ~95–120 ms |
| Colapsar/expandir 1 seção | ~58–73 ms | ~3–9 ms |

Mais revelador que o tempo de parede (ruidoso em jsdom): a contagem real de
invocações do corpo de cada componente por ajuste, obtida instrumentando
`Figurinha`/`Secao`/`SuperGrupo.type.render` num teste temporário. Antes da
memoização, um único clique reexecuta as 994 `Figurinha` + 50 `Secao` + 12
`SuperGrupo` (arquitetura sem `memo`, nunca chegou a ser instrumentada
porque o próprio código já deixava isso evidente por inspeção). Depois:

```
10 ajustes (cliques em cartões diferentes):
  Figurinha: 10 chamadas  (1 por clique — só o cartão tocado)
  Secao:     10 chamadas  (1 por clique — só a seção do cartão tocado)
  SuperGrupo: 9 chamadas  (1 por clique, exceto quando o cartão é de FWC/COC,
                            que ficam fora de qualquer super-grupo)
```

## Decisão

Resolvida na ordem do mais barato ao mais caro definida pela própria
tarefa, **parando na segunda técnica** — a terceira (biblioteca de
virtualização) não foi necessária:

### 1. Memoização de cartão e seção (suficiente para o critério "ajustar não rerrenderiza o catálogo inteiro")

- `Figurinha` (`src/components/Figurinha.jsx`), `Secao`
  (`src/components/Secao.jsx`) e `SuperGrupo`
  (`src/components/SuperGrupo.jsx`) passam a ser `React.memo`, cada um com
  um **comparador customizado** — a comparação rasa padrão não bastaria,
  porque `contagens` (mapa inteiro) muda de identidade a cada ajuste em
  *qualquer* figurinha do catálogo. O comparador de `Secao`/`SuperGrupo`
  só reprova a igualdade se alguma das figurinhas *daquela* seção/grupo
  (uma fração pequena e conhecida do mapa) mudou de valor — o resto dos
  campos (props primitivas e de referência) usa igualdade estrita.
  `Figurinha` ignora deliberadamente a identidade de `onIncrementar`/
  `onDecrementar` (fechos recriados a cada render do pai): são
  equivalentes entre si enquanto `codigo` (chave invariante do cartão) e
  `onAjustar` (estabilizado, ver abaixo) não mudarem.
- Para os comparadores acima funcionarem, três identidades que antes
  eram recriadas a cada render precisaram virar estáveis:
  - `App.jsx`: `handleAjustar`/`aplicarAjuste` viram `useCallback` com
    dependências que só mudam em login/logout (`uid`, `gravacaoAgregada`);
    a leitura da contagem anterior (para o histórico de desfazer) passa a
    vir de um ref espelhado depois de cada commit (`useEffect`), não do
    fecho de `contagens` — que instabilizaria a função a cada ajuste.
  - `Catalogo.jsx`: `estruturada` (resultado de `ordenarPorPagina`/
    `ordenarPorSigla`) passa a `useMemo`, porque essas funções criam
    arrays/objetos novos a cada chamada mesmo mantendo os mesmos objetos
    de seção — sem isto, `item.secoes` (prop de `SuperGrupo`) teria uma
    referência nova a cada ajuste. O array de figurinhas de cada
    super-grupo (`figurinhasPorGrupo`) também vira memoizado pela mesma
    razão. Os callbacks de toggle por seção (`onToggle`) e o `ref` de cada
    `SuperGrupo` passam a vir de mapas montados uma única vez (o de toggle
    via `useMemo`, o de `ref` via inicializador preguiçoso do `useState`,
    já que os 12 grupos A–L são fixos), em vez de um fecho novo por
    seção a cada render.
  - **Achado durante a implementação**: `React.memo` envolvendo um
    `forwardRef` (caso de `SuperGrupo`, que expõe `expandir()` para o
    salto de seção) só pula a re-renderização se, **além das props**, o
    próprio `ref` for o mesmo objeto entre renders — checagem interna do
    React (`current.ref === workInProgress.ref` em
    `updateMemoComponent`). Um `ref` inline recriado a cada render
    anulava a memoização dos 12 super-grupos mesmo com o comparador de
    props correto; só foi percebido porque a contagem real de invocações
    (instrumentação acima) não batia com o esperado. Documentado aqui por
    não ter arquivo próprio de "achado" (AGENTS.md § Convenções).
- Consequência necessária: `App.jsx` e `SuperGrupo.jsx` entraram na lista
  de arquivos modificados além dos previstos em "Arquivos impactados" da
  tarefa — inevitável, porque a ordenação padrão (`pagina`, ver
  `src/lib/preferenciasDeVista.js`) passa 46 das 50 seções por dentro de
  `SuperGrupo`, e a instabilidade do callback de ajuste em `App.jsx`
  quebraria a memoização de qualquer jeito. Precedente já aberto pela
  Tarefa 0010-0001 (`src/components/*.jsx — modificar`, lista também
  deliberadamente aberta).

### 2. `content-visibility: auto` por seção (resolve o custo de primeira renderização/rolagem num navegador real)

- `.secao` (`src/components/Secao.css`) ganha
  `content-visibility: auto` com `contain-intrinsic-size: auto
  var(--secao-altura-estimada)` (token novo em `src/theme.css`). Não cria
  nenhum contêiner com rolagem própria — é só uma dica de renderização: o
  navegador adia layout/pintura das seções fora da tela, sem tirá-las do
  fluxo normal da página (IDR 0008 preservado).
- A medição em jsdom não mede o ganho real desta técnica — jsdom não faz
  layout nem pintura. A adoção segue diretamente a resolução já registrada
  em `docs/plano/README.md` § "Onde cada pendência foi alocada"
  ("preferir `content-visibility`... biblioteca só se a medição exigir") e
  a própria ordenação de custo desta tarefa: é uma dica de CSS, zero JS,
  suporte nos quatro navegadores evergreen alvo
  (`docs/requisitos.md` § Navegadores) via a especificação de CSS
  Containment.
- Acessibilidade e funcionalidade do conteúdo adiado: pela especificação
  de CSS Containment (Nível 3), conteúdo sob `content-visibility: auto`
  que está "skipped" continua sendo renderizado sob demanda para busca do
  navegador (Ctrl+F/"find in page"), navegação sequencial por foco (Tab) e
  navegação por âncora/`:target` — o navegador é obrigado a materializar o
  conteúdo nesses casos. O salto para seção (Tarefa 0003-0004) já rola a
  página via `scrollIntoView`/`scrollTo` e foco programático, caminho que
  também força a renderização real. Não foi possível confirmar isto numa
  sessão de navegador real autenticada neste ambiente (ver "Impedimentos"
  no log) — apoiado na especificação e no comportamento documentado dos
  navegadores evergreen-alvo, não numa observação direta.

### 3. Biblioteca de virtualização — não adotada

Não foi necessária: a memoização já resolve o critério mais restritivo
(ajuste não pode re-renderizar o catálogo inteiro) e `content-visibility`
cobre o caso de rolagem/renderização inicial sem introduzir nenhuma
dependência nova nem contêiner com rolagem própria. Continuando "parar no
primeiro que resolver", este item não vira ADR — não há dependência nova
a justificar.

## Consequências

- Ajustar uma figurinha agora reexecuta apenas o cartão tocado, a seção
  que o contém e (se aplicável) o super-grupo que a contém — não mais o
  catálogo inteiro.
- Três novos comparadores customizados (`Figurinha`, `Secao`,
  `SuperGrupo`) precisam ser mantidos coerentes se as props desses
  componentes mudarem no futuro: quem acrescentar uma prop nova a um
  desses componentes precisa lembrar de incluí-la no comparador, senão a
  memoização passa a mascarar atualizações reais (bug silencioso). Risco
  aceito, mitigado pelos comentários no código apontando para este TDR.
- `App.jsx`, `Catalogo.jsx` e `SuperGrupo.jsx` ganharam identidades
  estáveis (`useCallback`/`useMemo`/`useState` preguiçoso) que não
  existiam antes — mais hooks para ler, mas nenhuma mudança de
  comportamento visível ao usuário.
- Duas linhas de código (o mapa de `ref` de `SuperGrupo`, montado uma
  única vez) disparam o aviso estático `react(refs)` do `oxlint`
  ("Cannot access refs during render"), mesmo sendo o padrão
  oficialmente documentado do React para gerenciar uma coleção de refs
  (fechos que só *tocam* `ref.current` quando o próprio React os invoca
  como callback de ref, depois do commit — nunca durante esta
  renderização). `npm run lint` continua saindo com código 0
  (é aviso, não erro); aceito e documentado aqui em vez de suprimido
  inline, por não haver precedente de supressão no repositório.
- `content-visibility: auto` não foi validado num navegador real
  autenticado nesta tarefa (ver limitação acima) — gatilho de revisão: se
  o salto para seção, o Ctrl+F ou a navegação por Tab se mostrarem
  quebrados em uso real, revisar esta decisão.

## Alternativas consideradas

- **Não memoizar e confiar só em `content-visibility`**: não resolveria o
  critério de aceite "ajustar uma contagem não rerrenderiza o catálogo
  inteiro" — `content-visibility` adia pintura de conteúdo fora da tela,
  mas uma seção *visível* continua sendo totalmente re-renderizada a cada
  ajuste em qualquer outra parte do catálogo, memoizada ou não.
- **Slice de `contagens` por seção calculado em `Catalogo`** (em vez de
  comparador customizado): computação equivalente (checar por seção quais
  valores mudaram), só que feita uma vez em `Catalogo` para todas as 50
  seções em vez de sob demanda no comparador de cada `Secao`/`SuperGrupo`.
  Descartada por exigir mais código de bookkeeping (cache de slices,
  invalidação) para o mesmo resultado.
- **Biblioteca de virtualização de lista (ex.: `react-window`,
  `react-virtual`)**: descartada nesta tarefa — não foi necessária, e a
  maioria depende de uma janela rolável própria, proibida por
  `docs/idr/0008-uma-unica-pagina-scrollavel.md`. As poucas variantes sem
  scroll próprio (ex.: baseadas só em `content-visibility`) não
  acrescentariam nada ao que a técnica 2 já faz. Fica como gatilho de
  revisão se uma medição futura, em uso real, mostrar que memoização +
  `content-visibility` não bastam.
