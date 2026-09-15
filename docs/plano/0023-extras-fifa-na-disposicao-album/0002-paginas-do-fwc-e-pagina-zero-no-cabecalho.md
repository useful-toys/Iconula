<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0023-0002]: páginas do FWC e página 0 no cabeçalho

## Status
Pendente

## Objetivo
Dar à seção FWC as oito páginas físicas confirmadas (0–3 e 106–109) e mostrar
a primeira no cabeçalho — `Extras FIFA FWC 0 · …` —, como nas demais seções,
com a invariante de que nenhuma seção fica sem páginas.

## Documentos de referência
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`
  § Decisão › Página do FWC — `paginas: [0, 1, 2, 3, 106, 107, 108, 109]` e
  cabeçalho com a primeira
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão › Estrutura de
  cada seção — `paginas` como lista das páginas físicas; § Consequências —
  `paginas` sem `null`
- `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md` § Decisão ›
  Cabeçalho da seção com a primeira página
- `docs/requisitos.md` § Anexo — Extras FIFA nas páginas 0–3 e 106–109
- `src/data/catalogo.js` — seção `fwc` e o comentário acima dela
- `src/components/Secao.jsx` — `CabecalhoSecao` (`pagina` e `identificacao`)
- `src/data/catalogo.test.js`; `src/components/Secao.test.jsx` — "omite o
  número da página quando a seção não o tem" e as fixtures de FWC com
  `paginas: null`
- `src/data/catalogoOrdenacoes.js` — ordenação por página só das seleções
- `docs/modelo-memoria.md` § Catálogo estático

## Padrões e convenções aplicáveis
- FWC continua a primeira seção e a Coca-Cola a última, nas duas ordenações;
  a ordenação por página continua só entre as seleções — IDR 0028
- O número `0` é página válida: nenhum teste de verdade descarta o zero no
  cabeçalho — IDR 0023
- Catálogo escrito à mão, travado por testes — TDR 0010
- Nome acessível do cabeçalho sem mudança — IDR 0018

## Escopo e instruções de implementação
1. `catalogo.js`: a seção `fwc` passa a `paginas: [0, 1, 2, 3, 106, 107,
   108, 109]`; o comentário deixa de falar em pendência do checklist e cita a
   confirmação das páginas (TDR 0010, IDR 0023).
2. `CabecalhoSecao`: mostra a primeira página de `paginas` como nas outras
   seções, garantindo que `0` aparece (a composição da identificação não pode
   descartar o zero); o ramo de "seção sem página" deixa de existir.
3. Testes:
   - `catalogo.test.js`: toda seção tem `paginas` como lista não vazia de
     inteiros em ordem crescente; FWC com as oito páginas exatas; seleções e
     Coca-Cola inalteradas;
   - `Secao.test.jsx`: o teste "omite o número da página…" dá lugar a "mostra
     a página 0 do FWC" (`Extras FIFA FWC 0` no cabeçalho); teste novo de que
     a seleção mostra a primeira página do spread (`Brasil BRA 24`); as
     fixtures de FWC com `paginas: null` passam às oito páginas.
4. `docs/modelo-memoria.md` § Catálogo estático, citando o MDR 0006:
   `paginas` deixa de ser "spread ou `null`" e passa a "lista das páginas
   físicas da seção (seleções e COC: o spread; FWC: 0–3 e 106–109)".

**Fora do escopo**: layout de álbum do FWC, que segue em lista (Tarefa
0023-0003); formato do layout (Tarefa 0023-0001); ordenação e faixa de
bandeiras.

## Decisões já tomadas (não reabrir)
- Páginas do FWC e cabeçalho com a primeira — ver
  `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`
- `paginas` como lista das páginas físicas, sem `null` — ver
  `docs/model-dr/0006-catalogo-estatico-embutido.md`
- Cabeçalho `Extras FIFA FWC 0` — ver
  `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- FWC abre e Coca-Cola fecha o catálogo — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Arquivos impactados
- `src/data/catalogo.js`, `src/data/catalogo.test.js` — modificar
- `src/components/Secao.jsx`, `src/components/Secao.test.jsx` — modificar
- `docs/modelo-memoria.md` — modificar (§ Catálogo estático)

## Critérios de aceite
- [ ] Seção FWC com `paginas` exatamente `[0, 1, 2, 3, 106, 107, 108, 109]`
      (teste)
- [ ] Nenhuma seção com `paginas` nulo ou vazio (teste)
- [ ] Cabeçalho do FWC com `Extras FIFA FWC 0` nas duas disposições (teste)
- [ ] Cabeçalho de seleção com a primeira página do spread (`Brasil BRA 24`
      — teste novo)
- [ ] Ordem das seções nas duas ordenações inalterada (testes existentes de
      ordenação verdes)
- [ ] `docs/modelo-memoria.md` sem "spread ou `null`", citando o MDR 0006
      (busca)
