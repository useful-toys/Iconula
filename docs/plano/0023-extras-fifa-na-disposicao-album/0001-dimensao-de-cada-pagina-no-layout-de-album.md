<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0023-0001]: dimensão de cada página no layout de álbum

## Status
Concluída

## Objetivo
Levar o layout de álbum ao formato único do MDR 0006 — páginas com `linhas` e
`colunas`, posições e pares de páginas derivados — para seleções e Coca-Cola,
com a grade de cada página montada a partir do dado. Prepara o FWC (Tarefa
0023-0003) sem mudar as seleções; a página 1 da Coca-Cola passa às 2 linhas do
Anexo.

## Documentos de referência
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão › Layout de
  álbum — páginas (`pagina`, `linhas`, `colunas`), posições e spreads
  derivados; § Consequências — invariantes do layout
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão —
  Coca-Cola com página 1 de 2 × 3 e página 2 de 3 × 3; espaço de 20px entre
  pares de páginas
- `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md` § Decisão —
  páginas do par lado a lado quando cabem, empilhadas quando não
- `docs/requisitos.md` § Anexo — Coca-Cola: "6 figurinhas na página 112 (2
  linhas × 3 colunas)"
- `src/data/catalogoLayout.js` — `layoutSelecao`, `layoutCocaCola`,
  `layoutDeSecao`
- `src/components/Secao.jsx` — `CorpoAlbum`
- `src/components/PaginaDoAlbum.jsx`, `src/components/PaginaDoAlbum.css` —
  `numTrilhas` pela sigla, `grid-template-rows` fixo e mapa de posição por
  índice
- `src/components/Secao.css` — `.secao__album`
- `src/theme.css` — `--album-page-gap`
- `src/data/catalogo.test.js` § `describe("layout de álbum")`;
  `src/components/PaginaDoAlbum.test.jsx`; `src/components/Secao.test.jsx`
  § `describe('disposição álbum')`; `src/components/Figurinha.test.jsx` —
  "PaginaDoAlbum repassa nome e nomeLinhas ao cartão"
- `docs/modelo-memoria.md` § Catálogo estático — linha das derivações
- `docs/interface.md` § Disposição "Como no álbum", § Medidas

## Padrões e convenções aplicáveis
- O arranjo das seleções não muda: mesmas posições, trilhas e página
  paisagem da 13 — IDR 0009
- Derivações de layout ficam em `src/data/`, funções puras — MDR 0006,
  TDR 0012
- `Secao` continua memoizada com o comparador atual; nada novo entra nas
  props — TDR 0021
- A disposição álbum nunca é filtrada nem cai para a lista — IDR 0023,
  IDR 0015
- Trilhas, linhas e espaçamentos das seleções e da Coca-Cola ficam como a
  Fase 0022 os deixou — IDR 0047, IDR 0050

## Escopo e instruções de implementação
1. `catalogoLayout.js`: `layoutDeSecao` passa a devolver as páginas e as
   posições, e continua devolvendo `null` para o FWC (a Tarefa 0023-0003 o
   preenche):

   ```
   layoutDeSecao(secao) → null | { paginas: [{ pagina, linhas, colunas }],
                                   posicoes: [{ posicao, pagina, linha, trilha, trilhas }] }
   ```

   - seleções: página 1 e página 2 com 3 linhas × 4 colunas; posições atuais;
   - Coca-Cola: página 1 com 2 linhas × 3 colunas, página 2 com 3 × 3;
     posições atuais;
   - função pura que agrupa as páginas em pares consecutivos (1|2, 3|4, …),
     exportada do mesmo módulo.
   O comentário de cabeçalho descreve o formato e cita o MDR 0006.
2. `PaginaDoAlbum`: recebe a dimensão da página e monta o grid com
   `colunas` trilhas e `linhas` linhas, com as medidas de trilha e linha
   atuais; deixa de escolher o número de trilhas pela sigla e de fixar três
   linhas no CSS. A figurinha de cada posição é achada pelo campo `posicao`
   da figurinha, não pelo índice no array (o FWC começa em `00`).
3. `CorpoAlbum` (`Secao.jsx`): um contêiner por par de páginas, na ordem; as
   páginas do par lado a lado quando cabem e empilhadas quando não (como
   hoje); pares empilhados um abaixo do outro com `--album-page-gap` (20px)
   entre eles. Seleções e Coca-Cola têm um par só: nada muda na tela além da
   página 1 da Coca-Cola.
4. Testes:
   - `catalogo.test.js`: formato novo em todas as seções com layout; para
     cada uma, cada figurinha tem exatamente uma posição, toda posição cabe
     na dimensão da sua página (`linha` ≤ `linhas`, `trilha + trilhas − 1` ≤
     `colunas`), sem duas figurinhas na mesma casa; o número de páginas do
     layout é o de `paginas` da seção; Coca-Cola com página 1 de 2 × 3;
     agrupamento em pares (2 páginas → 1 par; 8 → 4); os testes de posição
     existentes adaptados ao formato;
   - `PaginaDoAlbum.test.jsx`: grid com `colunas` e `linhas` da página
     (seleção 4 × 3; Coca-Cola página 1 com 2 linhas); posição encontrada
     pelo campo `posicao` (fixture com posições que não começam em 1);
   - `Secao.test.jsx`: seleção e Coca-Cola com um contêiner de par e duas
     páginas dentro; o FWC continua em lista (o teste existente segue);
   - `Figurinha.test.jsx`: o teste de repasse por `PaginaDoAlbum` adaptado
     ao formato.
5. `docs/modelo-memoria.md` § Catálogo estático, linha das derivações,
   citando o MDR 0006: `catalogoLayout.js` devolve páginas com linhas e
   colunas e posições de página/linha/trilha; pares de páginas derivados.
6. `docs/interface.md`, citando o MDR 0006 e o IDR 0023:
   - § Disposição "Como no álbum", bullet das trilhas: cada página tem as
     linhas e colunas do seu layout (seleções 3 × 4; Coca-Cola 2 × 3 e
     3 × 3); as páginas vêm em pares, lado a lado quando cabem, e pares
     seguidos ficam 20px um abaixo do outro;
   - § Coca-Cola — 3 trilhas por página: a página 1 tem 2 linhas.
7. `AGENTS.md` § Onde fica cada coisa: a linha de `src/data/catalogoLayout.js`
   passa a dizer "layout de álbum por seção: páginas com linhas e colunas,
   posições de página, linha e trilha de cada figurinha e pares de páginas".

**Fora do escopo**: `paginas` do FWC e página no cabeçalho (Tarefa
0023-0002); layout, casa de 70×70px e moldura do FWC (Tarefa 0023-0003);
medidas do cartão e das trilhas (Fase 0022); filtro e lista.

## Decisões já tomadas (não reabrir)
- Formato do layout: páginas com dimensão, posições e pares derivados — ver
  `docs/model-dr/0006-catalogo-estatico-embutido.md`
- Coca-Cola com página 1 de 2 × 3; 20px entre pares de páginas — ver
  `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- Posições das seleções e trilhas fixas — ver
  `docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md`
- Páginas empilham quando não cabem — ver
  `docs/idr/0015-paginas-do-album-empilham-em-tela-estreita.md`
- Seção memoizada — ver `docs/tdr/0021-desempenho-do-catalogo.md`

## Decisões em aberto nesta tarefa
- Nome da função de pares, das props de dimensão e do contêiner do par —
  nível 1, sem registro

## Arquivos impactados
- `src/data/catalogoLayout.js`, `src/data/catalogo.test.js` — modificar
- `src/components/PaginaDoAlbum.jsx`, `src/components/PaginaDoAlbum.css`,
  `src/components/PaginaDoAlbum.test.jsx` — modificar
- `src/components/Secao.jsx`, `src/components/Secao.css`,
  `src/components/Secao.test.jsx` — modificar
- `src/components/Figurinha.test.jsx` — modificar
- `docs/modelo-memoria.md` — modificar (§ Catálogo estático)
- `docs/interface.md` — modificar (§ Disposição "Como no álbum", § Coca-Cola
  — 3 trilhas por página)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] `layoutDeSecao` devolve páginas com `linhas` e `colunas` e posições
      para seleções e Coca-Cola, e `null` para o FWC (teste)
- [ ] Invariantes por seção: uma posição por figurinha, dentro da dimensão da
      página, sem casa repetida, número de páginas igual ao de `paginas`
      (teste)
- [ ] Coca-Cola: página 1 com 2 linhas × 3 colunas (teste de dado e de grid)
- [ ] `PaginaDoAlbum` sem escolha de trilhas pela sigla e sem linhas fixas no
      CSS; posição achada pelo campo `posicao` (busca e teste)
- [ ] Contêiner por par de páginas, com 20px (`--album-page-gap`) entre pares
      (trecho de `Secao.css` e teste de estrutura)
- [ ] Seleções com as mesmas posições e duas páginas por seção (testes
      existentes adaptados verdes)
- [ ] `docs/modelo-memoria.md`, `docs/interface.md` e `AGENTS.md` com o
      formato novo, citando o MDR 0006 (busca)

## Validação adicional
Verificação visual em `npm run dev`, disposição álbum:
- BRA: as duas páginas iguais às de antes, lado a lado acima de 583px e
  empilhadas abaixo;
- Coca-Cola: página 1 com 2 linhas; lado a lado, alinhada ao topo da página 2;
  empilhada, sem linha vazia embaixo;
- FWC segue em lista.
