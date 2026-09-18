<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0034-0001]: Reordena o título da seção de seleção

## Status
Concluída

## Objetivo
No cabeçalho de cada seção, as seções de seleção passam a mostrar a sigla
antes do nome (`BRA Brasil` em vez de `Brasil BRA`); a Coca-Cola deixa de
mostrar a sigla; os Extras FIFA (FWC) continuam exatamente como estão.

## Documentos de referência
- `docs/idr/0068-ordem-bandeira-sigla-nome-no-titulo-de-secao-de-selecao.md`
  — decisão completa, com os três casos (seleção, FWC, COC)
- `src/components/Secao.jsx` função `CabecalhoSecao` (spans
  `secao__nome`, `secao__sigla`, `secao__pagina`, introduzidos pelo
  IDR 0056)
- `src/data/catalogo.js` — todo item de `secoes` tem `tipo: "selecao"` ou
  `tipo: "especial"`

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `CabecalhoSecao` (`Secao.jsx`), decidir a ordem/presença dos spans de
   identificação por `secao.tipo` e `secao.sigla`:
   - `secao.tipo === "selecao"`: sigla, depois nome, depois página (nessa
     ordem) — `<span secao__sigla>`, `<span secao__nome>`, `<span
     secao__pagina>`.
   - `secao.sigla === "COC"`: nome, depois página, sem span de sigla.
   - Demais casos (hoje só FWC): nome, sigla, página — ordem atual,
     inalterada.
   - Pesos, cores e `gap` dos spans (IDR 0056) não mudam; só ordem/presença.
2. `nomeAcessivel` não muda — já começa pelo nome por extenso,
   independente da ordem visual.
3. `docs/interface.md` § Corpo (linha "Cabeçalho de grupo numa linha"):
   descreve a ordem condicional por tipo de seção e a ausência da sigla na
   Coca-Cola, citando o IDR 0068.

**Fora do escopo**: mudar a ordem no FWC; mover a página para outra
posição; qualquer mudança de peso, cor ou fonte dos spans (IDR 0056 segue
valendo).

## Decisões já tomadas (não reabrir)
- Ordem por tipo de seção e ausência da sigla na Coca-Cola — ver
  `docs/idr/0068-ordem-bandeira-sigla-nome-no-titulo-de-secao-de-selecao.md`
- Spans separados (`secao__nome`/`secao__sigla`/`secao__pagina`) e fonte
  condensada até 582px — ver
  `docs/idr/0056-titulo-de-secao-em-linha-unica-no-celular.md` (inalterado)

## Arquivos impactados
- `src/components/Secao.jsx` — modificar (`CabecalhoSecao`)
- `src/components/Secao.test.jsx` — modificar: o teste que afirma
  `['Brasil', 'BRA', '24']` (linha ~41-44) passa a esperar
  `['BRA', 'Brasil', '24']` — a fixture `secaoBra` precisa ganhar
  `tipo: 'selecao'` para cair no novo caminho; acrescentar um teste para
  a Coca-Cola (`tipo: 'especial'`, sigla `'COC'`) afirmando que
  `.secao__sigla` não existe e a ordem é `['Coca-Cola', '112']`; o teste
  do FWC (linha ~90, `['Extras FIFA', 'FWC', '0']`) só precisa da fixture
  ganhar `tipo: 'especial'` para continuar batendo com o caminho "demais
  casos" — sem mudar o resultado esperado
- `docs/interface.md` — modificar (§ Corpo)

## Critérios de aceite
- [ ] Seção de seleção mostra sigla antes do nome no cabeçalho — coberto
      por teste
- [ ] Coca-Cola não mostra `.secao__sigla` no cabeçalho — coberto por
      teste
- [ ] FWC mantém a ordem atual (nome, sigla, página) — coberto por teste
- [ ] `docs/interface.md` § Corpo descreve a ordem condicional e cita o
      IDR 0068
