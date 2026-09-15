<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0023-0003]: FWC na disposição álbum

## Status
Concluída

## Objetivo
Exibir os Extras FIFA na disposição álbum com as posições reais das oito
páginas (0–3 e 106–109): casa de 70×70px, quatro pares de páginas, linhas
vazias preservadas e moldura discreta em cada página — para o colecionador
comparar também os extras com o álbum físico.

## Documentos de referência
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão —
  tabela das oito páginas (grade e posições), casa de 70×70px, pares 0|1,
  2|3, 106|107 e 108|109, linhas vazias, sem rótulo, moldura (1px `--border`,
  recuo 6px, raio 8px) e 20px entre pares; § Consequências — larguras
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão › Layout de
  álbum — FWC com oito páginas; § Consequências — invariantes e paisagem em
  uma casa (`trilhas: 1`)
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — paisagem
  de 70×60px e retrato de 60×70px
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão › Paisagem no
  FWC — `FWC00`–`FWC03` e `FWC09`–`FWC19` paisagem
- `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
  § Decisão — limite de 582px, que não muda
- `src/data/catalogoLayout.js` — formato de páginas e posições e pares
  (gerado pela Tarefa 0023-0001)
- `src/components/PaginaDoAlbum.jsx`, `src/components/PaginaDoAlbum.css` —
  grid pela dimensão da página e posição pelo campo `posicao` (gerado pela
  Tarefa 0023-0001); célula paisagem
- `src/components/Secao.jsx` — `CorpoAlbum` com contêiner por par (gerado pela
  Tarefa 0023-0001)
- `src/data/catalogo.js` — `paginas` do FWC (gerado pela Tarefa 0023-0002)
- `src/components/Secao.test.jsx` — "FWC sempre usa lista contínua, mesmo na
  disposição álbum"; `src/data/catalogo.test.js` § `describe("layout de
  álbum")`
- `src/theme.css` — `--border`, `--album-page-gap`
- `docs/interface.md` § Disposição "Como no álbum", § Wireframe da tela
  principal, § Apresentação por faixa de tela, § Medidas

## Padrões e convenções aplicáveis
- Seleções e Coca-Cola sem moldura e com as medidas de sempre; a casa de
  70×70px e a moldura valem só no FWC — IDR 0023
- Casas vazias não recebem elemento focável nem entram na árvore de
  acessibilidade; nenhum rótulo de página — IDR 0023, IDR 0018
- A disposição álbum nunca é filtrada; o FWC em lista continua filtrável na
  disposição lista — IDR 0023, IDR 0001
- Nenhuma rolagem própria: os pares empilham, nunca rolam para os lados —
  IDR 0008, IDR 0015
- A paisagem do cartão vem da figurinha (`paisagem`), não do número de
  trilhas; a 13 das seleções continua ocupando duas trilhas — IDR 0047,
  IDR 0009

## Escopo e instruções de implementação
1. `catalogoLayout.js`: layout do FWC com as oito páginas e as posições da
   tabela do IDR 0023, na ordem de `paginas` (índice 1 = página física 0 …
   índice 8 = página física 109), todas com `trilhas: 1`:
   - índices 1–2: 4 × 3; índices 3–4: 4 × 2; índices 5–8: 3 × 3;
   - páginas físicas 2 e 3 com as colunas 1–2 e 3–4 da grade 4 × 4 descrita,
     já renumeradas como colunas 1–2 de cada página.
   O comentário de cabeçalho deixa de dizer que o FWC não tem layout.
2. `PaginaDoAlbum`: nas páginas do FWC, trilhas e linhas de 70px (6px de
   espaçamento), com o cartão centralizado na casa, e moldura de 1px em
   `--border`, recuo interno de 6px e raio de 8px; o cartão recebe
   `paisagem` da figurinha em qualquer seção (a célula continua cobrindo
   `trilhas` trilhas).
3. `Secao`: com disposição álbum, o FWC usa o layout (quatro pares, 20px entre
   eles), sem filtro, como as demais seções.
4. Testes:
   - `catalogo.test.js`: o teste "FWC devolve null" dá lugar ao layout do FWC
     — oito páginas com as dimensões da tabela; os 20 códigos, cada um uma vez;
     posições conferidas contra a tabela do IDR 0023 (ao menos `FWC00`,
     `FWC04`, `FWC05`, `FWC06`, `FWC13`, `FWC14` e `FWC17`); as invariantes
     gerais da Tarefa 0023-0001 passam a incluir o FWC;
   - `Secao.test.jsx`: o teste "FWC sempre usa lista contínua…" dá lugar a
     "FWC usa disposição álbum": quatro pares, oito páginas, 20 cartões,
     página física 0 com grid de 4 linhas e 3 colunas e `FWC00` na linha 1,
     coluna 2; nenhuma grade de lista; na disposição lista, o FWC continua em
     lista;
   - `PaginaDoAlbum.test.jsx`: página do FWC com a classe de moldura e trilhas
     de 70px; `FWC01` paisagem numa casa de uma trilha; seleção sem moldura.
5. `docs/interface.md`, citando o IDR 0023:
   - § Disposição "Como no álbum": o primeiro bullet passa a incluir os Extras
     FIFA (20 espaços em oito páginas, em quatro pares) e perde "exibem-se em
     lista contínua mesmo nesta disposição"; nova subseção "Extras FIFA — oito
     páginas em quatro pares", com a tabela das páginas, casa de 70×70px,
     linhas vazias preservadas, moldura e ausência de rótulo;
   - § Wireframe da tela principal: nova subseção "Grupo na disposição álbum —
     Extras FIFA", com os quatro pares desenhados (casas vazias em branco,
     moldura em volta de cada página) e o parágrafo das larguras;
   - § Apresentação por faixa de tela: "Álbum (seleções e Coca-Cola)" passa a
     "Álbum (todas as seções)"; o maior par do FWC tem 492px, abaixo dos 536px
     das seleções, e o limite de 582px não muda;
   - § Medidas: bullet do FWC no álbum — casa de 70×70px com 6px de
     espaçamento, moldura de 1px em `--border` com recuo de 6px e raio de 8px,
     20px entre pares; página de 3 colunas com 236px e de 2 colunas com 160px
     de largura total.

**Fora do escopo**: formato do layout, pares e página 1 da Coca-Cola (Tarefa
0023-0001); `paginas` e cabeçalho do FWC (Tarefa 0023-0002); medidas do cartão
(Fase 0022); metalizadas do FWC; texto de troca e export/import.

## Decisões já tomadas (não reabrir)
- Arranjo do FWC, casa de 70×70px, pares, linhas vazias, sem rótulo, moldura e
  20px entre pares — ver
  `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- Paisagem do FWC em uma casa; invariantes do layout — ver
  `docs/model-dr/0006-catalogo-estatico-embutido.md`
- Medidas do cartão retrato e paisagem — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Limite de 582px — ver
  `docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md`
- Filtro só na disposição lista — ver
  `docs/idr/0001-filtro-de-status-so-na-disposicao-lista.md`

## Decisões em aberto nesta tarefa
- Como o FWC recebe as medidas de 70px e a moldura (classe por seção ou dado
  da página) — nível 1, sem registro
- Tokens CSS para a casa e a moldura do FWC ou valores locais — nível 1, sem
  registro

## Arquivos impactados
- `src/data/catalogoLayout.js`, `src/data/catalogo.test.js` — modificar
- `src/components/PaginaDoAlbum.jsx`, `src/components/PaginaDoAlbum.css`,
  `src/components/PaginaDoAlbum.test.jsx` — modificar
- `src/components/Secao.jsx`, `src/components/Secao.test.jsx` — modificar
- `src/theme.css` — modificar, se a casa ou a moldura virarem token
- `docs/interface.md` — modificar (§ Disposição "Como no álbum", § Wireframe
  da tela principal, § Apresentação por faixa de tela, § Medidas)

## Critérios de aceite
- [ ] `layoutDeSecao` do FWC com oito páginas nas dimensões da tabela e os 20
      códigos nas posições do IDR 0023 (teste)
- [ ] Na disposição álbum, o FWC mostra quatro pares e oito páginas, sem grade
      de lista; na disposição lista, continua em lista (teste)
- [ ] Páginas do FWC com casas de 70×70px, 6px de espaçamento e moldura de 1px
      em `--border`, recuo 6px e raio 8px; seleções e Coca-Cola sem moldura
      (trecho de CSS e teste de classe)
- [ ] Cartão paisagem do FWC numa casa de uma trilha; `BRA13` ainda em duas
      trilhas (teste)
- [ ] Casas vazias sem elemento no DOM (teste: 20 células no FWC)
- [ ] `docs/interface.md` sem "lista contínua mesmo nesta disposição", com a
      subseção, o wireframe e as medidas do FWC, citando o IDR 0023 (busca)

## Validação adicional
Verificação visual em `npm run dev`, disposição álbum, seção FWC:
- acima de 583px: pares lado a lado (0|1 e 106|107 com 492px; 2|3 com 340px),
  20px entre pares;
- abaixo de 583px: páginas empilhadas, com as linhas vazias da página 0 e da
  108 preservadas;
- `FWC00` centralizado na linha 1 da página 0; `FWC01`–`FWC03` paisagem e
  `FWC04` retrato na coluna 3 da página 1; `FWC16` e `FWC17` na mesma linha da
  página 109;
- moldura visível nas oito páginas e ausente em BRA e COC; filtro oculto;
- cabeçalho `Extras FIFA FWC 0`.
