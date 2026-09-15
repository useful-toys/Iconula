<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0023-0001: dimensão de cada página no layout de álbum

## Data
2026-09-15

## Resumo
`layoutDeSecao` passa do formato "array de posições" para
`{ paginas, posicoes }`, conforme o MDR 0006: `paginas` traz a dimensão
(`linhas`, `colunas`) de cada página da seção e `posicoes` continua com
`posicao`, `pagina`, `linha`, `trilha` e `trilhas`. Uma nova função pura,
`paresDePaginas`, agrupa as páginas em pares consecutivos (os spreads),
sem virar campo do layout — prepara o FWC (Tarefa 0023-0003), que terá
mais de um par.

`PaginaDoAlbum` deixa de escolher o número de trilhas pela sigla da seção
(`secao.sigla === 'COC' ? 3 : 4`) e de fixar três linhas no CSS: agora
recebe a dimensão da página (`pagina: { linhas, colunas }`) e monta o
grid com `gridTemplateColumns`/`gridTemplateRows` a partir dela. A busca
da figurinha de cada posição passa a ser pelo campo `posicao` da
figurinha (um `Map` por esse campo), não pelo índice no array — o índice
deixa de ser garantia de bater com a numeração a partir da Tarefa
0023-0003, quando o FWC (que começa em `00`) ganhar layout.

`CorpoAlbum` (`Secao.jsx`) passa a montar um contêiner (`.secao__album__par`)
por par de páginas — hoje sempre um só, com as duas páginas da seção —,
e o contêiner externo (`.secao__album`) empilha os pares com
`--album-page-gap` (o mesmo espaço já usado entre as páginas de um par,
por decisão do IDR 0023). Como cada seção com layout ainda tem só duas
páginas (um par), a tela não muda: as seleções continuam iguais e a
Coca-Cola ganha a página 1 com 2 linhas (antes o CSS fixava 3 linhas,
desenhando uma linha vazia que o Anexo não tem — a `docs/interface.md`
já descrevia "2 linhas × 3 colunas" para essa página, só o código estava
atrás).

O FWC continua sem layout de álbum (`layoutDeSecao` retorna `null` para
ele) — fica para a Tarefa 0023-0003.

## Discovery
- Código: `catalogoLayout.js` tinha `layoutSelecao`/`layoutCocaCola`
  retornando arrays de posições soltos, com dimensão de página implícita
  no CSS (`PaginaDoAlbum.css`, `grid-template-rows: repeat(3, 70px)`
  fixo) e no JS (`numTrilhas` por `secao.sigla`). `PaginaDoAlbum` buscava
  a figurinha da posição pelo índice no array (`figurinhas[i]`,
  `i + 1 === posicao`), premissa que só vale porque as seleções e a COC
  numeram a partir de 1 sem buracos. `CorpoAlbum` já agrupava por
  `pos.pagina` e renderizava um `.secao__album` só, com `flex-wrap` —
  funcionava porque só havia um par por seção. Testes existentes
  (`catalogo.test.js`, `PaginaDoAlbum.test.jsx`, `Secao.test.jsx`,
  `Figurinha.test.jsx`) tratavam `layoutDeSecao` como array e passavam
  `secao` para `PaginaDoAlbum`. Comportamento atual confere com a
  tarefa — a divergência da página 1 da Coca-Cola (CSS com 3 linhas
  fixas vs. Anexo/`interface.md` com 2) é exatamente o que a tarefa pede
  para corrigir.
- Documentação: MDR 0006 § Decisão › Layout de álbum já descrevia o
  formato alvo (páginas com `linhas`/`colunas`, posições, spreads
  derivados) — bastou como referência, sem leitura adicional.

## Plano da alteração
1. `catalogoLayout.js`: `layoutSelecao`/`layoutCocaCola` passam a devolver
   `{ paginas, posicoes }`; `layoutDeSecao` mantém a mesma árvore de
   decisão (FWC → `null`, COC → Coca-Cola, resto → seleção);
   `paresDePaginas(paginas)` exportada, agrupando de 2 em 2. Comentário
   de cabeçalho reescrito citando o MDR 0006.
2. `PaginaDoAlbum.jsx`: troca a prop `secao` por `pagina` (`{linhas,
   colunas}`); grid monta `gridTemplateColumns`/`gridTemplateRows` a
   partir dela; mapa de posição por `figurinha.posicao`.
   `PaginaDoAlbum.css`: remove `grid-template-rows` fixo.
3. `Secao.jsx`: `CorpoAlbum` agrupa `layout.posicoes` por página (como
   antes) e usa `paresDePaginas(layout.paginas)` para desenhar um
   `.secao__album__par` por par, cada um com as `PaginaDoAlbum` do par.
   `Secao.css`: `.secao__album` vira coluna com `--album-page-gap` entre
   pares; `.secao__album__par` fica com o `flex-wrap`/gap que
   `.secao__album` tinha.
4. Testes: `catalogo.test.js` (`layout.paginas`/`layout.posicoes`, novo
   teste de invariantes por seção — uma posição por figurinha, dentro da
   dimensão da página, sem casa repetida, número de páginas igual a
   `secao.paginas.length` — e testes de `paresDePaginas`);
   `PaginaDoAlbum.test.jsx` (prop `pagina`, `gridTemplateRows`, teste de
   busca por `posicao` com fixture deslocada); `Secao.test.jsx`
   (contêiner de par, página 1 da COC com `gridTemplateRows: repeat(2,
   70px)`); `Figurinha.test.jsx` (prop `pagina` no lugar de `secao`).
5. `docs/modelo-memoria.md` § Catálogo estático e `AGENTS.md` § Onde fica
   cada coisa: linha de `catalogoLayout.js` atualizada, citando o MDR
   0006. `docs/interface.md` § Disposição "Como no álbum": bullet das
   trilhas menciona a dimensão por página e os pares/20px; § Coca-Cola —
   3 trilhas por página já dizia "2 linhas" (nenhuma mudança necessária
   ali).
- Verificação prevista: `npm run lint && npm run test && npm run build`;
  critérios de aceite por teste (ver abaixo); busca por `secao.sigla` em
  `PaginaDoAlbum.jsx` e por `grid-template-rows` em `PaginaDoAlbum.css`
  para confirmar a remoção.
- Riscos: quebrar os testes que já tratavam `layoutDeSecao` como array —
  mitigado adaptando todos os arquivos de teste listados em "Arquivos
  impactados" no mesmo commit.
- Desvios: nenhum.

## Decisões tomadas
- Nome da prop de dimensão em `PaginaDoAlbum` (`pagina: {linhas,
  colunas}`), do contêiner do par (`.secao__album__par`) e da função de
  pares (`paresDePaginas`) — nível 1, sem registro (já listado como
  "Decisões em aberto nesta tarefa").
- Chave do contêiner de par usa a `pagina` da primeira página do par
  (`par[0].pagina`), e a `PaginaDoAlbum` usa a própria `pagina.pagina` —
  nível 1, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> iconula@0.0.0 lint
> oxlint
(sem avisos, saída vazia, exit 0)

$ npm run test -- --run
 Test Files  41 passed (41)
      Tests  505 passed (505)

$ npm run build
✓ 136 modules transformed.
✓ built in 548ms
(!) Some chunks are larger than 500 kB after minification — aviso
pré-existente do chunk do SDK do Firestore (`index.esm-*.js`,
carregado sob demanda, ADR 0005); esta tarefa não mexeu em
dependências, bundling nem código que o SDK do Firestore usa.
```

Verificação visual em `npm run dev` (Validação adicional da tarefa):
pendente — o ambiente de execução não tem `.env.local` com as credenciais
`VITE_FIREBASE_*` (login é a guarda do app, `requisitos.md` § Acesso;
`AGENTS.md` § Como rodar), então a tela do catálogo não é alcançável sem
autenticação real. Roteiro para quando houver ambiente com login: abrir a
disposição álbum, seção BRA — confirmar as duas páginas iguais às de
antes, lado a lado acima de 583px e empilhadas abaixo; seção Coca-Cola —
confirmar a página 1 com 2 linhas, lado a lado alinhada ao topo da página
2, empilhada sem linha vazia embaixo; seção Extras FIFA — confirmar que
segue em lista.

## Critérios de aceite
- [x] `layoutDeSecao` devolve páginas com `linhas` e `colunas` e posições
      para seleções e Coca-Cola, e `null` para o FWC — `src/data/catalogo.test.js`,
      describe "layout de álbum", testes "layout de seleção: 2 páginas..."
      e "layout da Coca-Cola: página 1 com 2 linhas × 3 colunas..."
- [x] Invariantes por seção: uma posição por figurinha, dentro da
      dimensão da página, sem casa repetida, número de páginas igual ao
      de `paginas` — `src/data/catalogo.test.js`, teste "cada seção com
      layout: uma posição por figurinha..."
- [x] Coca-Cola: página 1 com 2 linhas × 3 colunas (teste de dado e de
      grid) — `src/data/catalogo.test.js` (dado) e
      `src/components/Secao.test.jsx`, teste "página 1 da Coca-Cola tem 2
      linhas, sem a terceira linha vazia" (grid)
- [x] `PaginaDoAlbum` sem escolha de trilhas pela sigla e sem linhas
      fixas no CSS; posição achada pelo campo `posicao` — busca:
      `grep -n "secao.sigla" src/components/PaginaDoAlbum.jsx` (vazio),
      `grep -n "grid-template-rows" src/components/PaginaDoAlbum.css`
      (vazio); teste: `src/components/PaginaDoAlbum.test.jsx`, "acha a
      figurinha pelo campo `posicao`, não pelo índice no array..."
- [x] Contêiner por par de páginas, com 20px (`--album-page-gap`) entre
      pares — `src/components/Secao.css` (`.secao__album` em coluna com
      `gap: var(--album-page-gap)`) e
      `src/components/Secao.test.jsx`, teste "as duas páginas do spread
      ficam dentro de um único contêiner de par"
- [x] Seleções com as mesmas posições e duas páginas por seção — testes
      existentes de `PaginaDoAlbum.test.jsx` e `Secao.test.jsx` (grid 4 ×
      3, posições 01–20) continuam verdes
- [x] `docs/modelo-memoria.md`, `docs/interface.md` e `AGENTS.md` com o
      formato novo — `docs/modelo-memoria.md` e `docs/interface.md`
      citam o MDR 0006 (`grep -n "MDR 0006" docs/modelo-memoria.md
      docs/interface.md`, duas citações); `AGENTS.md` § Onde fica cada
      coisa traz o texto exato pedido no escopo da tarefa (tabela de
      convenções, sem citar registros)

## Arquivos alterados
- `src/data/catalogoLayout.js` — formato `{paginas, posicoes}`,
  `paresDePaginas` nova
- `src/data/catalogo.test.js` — testes adaptados ao formato novo, mais
  invariantes por seção e testes de `paresDePaginas`
- `src/components/PaginaDoAlbum.jsx` — prop `pagina` no lugar de `secao`,
  grid dinâmico (colunas e linhas), busca por `figurinha.posicao`
- `src/components/PaginaDoAlbum.css` — remove `grid-template-rows` fixo
- `src/components/PaginaDoAlbum.test.jsx` — testes adaptados; fixtures
  com `posicao`; novo teste de busca por posição deslocada
- `src/components/Secao.jsx` — `CorpoAlbum` monta um par por vez com
  `paresDePaginas`, passa `pagina` (não `secao`) para `PaginaDoAlbum`
- `src/components/Secao.css` — `.secao__album` em coluna,
  `.secao__album__par` com o `flex-wrap` que `.secao__album` tinha
- `src/components/Secao.test.jsx` — fixtures com `posicao`; novos testes
  de contêiner de par e da página 1 da Coca-Cola com 2 linhas
- `src/components/Figurinha.test.jsx` — teste de repasse por
  `PaginaDoAlbum` adaptado à prop `pagina`
- `docs/modelo-memoria.md` — § Catálogo estático, linha das derivações
- `docs/interface.md` — § Disposição "Como no álbum", bullet das trilhas
- `AGENTS.md` — § Onde fica cada coisa, linha de `catalogoLayout.js`
- `docs/plano/0023-extras-fifa-na-disposicao-album/0001-dimensao-de-cada-pagina-no-layout-de-album.md`
  — status `Concluída`
- `docs/plano/README.md` — linha da tarefa 0001 e da fase 23

## Correções pós-PR
Nenhuma.
