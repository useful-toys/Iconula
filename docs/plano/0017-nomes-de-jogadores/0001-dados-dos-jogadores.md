<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0001]: dados dos jogadores

## Status
Pendente

## Objetivo
Criar `src/data/jogadores.js` com os nomes das figurinhas — 48 seleções (47 com
18 jogadores e o Paraguai com 13, lacuna declarada), 20 Extras FIFA e 14
Coca-Cola — a partir do fornecimento do humano (fonte original), conforme o
MDR 0008.

## Documentos de referência
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão — forma das
  três exportações, mapeamento de posições, política de grafia, lacuna do
  Paraguai e invariantes
- `docs/tdr/0022-renumeracao-do-fwc.md` — FWC numerado de `FWC00` a `FWC19`
- `src/data/catalogo.js` — as 50 seções (siglas) que o dado deve cobrir
- `src/data/catalogo.test.js` — o padrão de testes de invariantes que esta
  tarefa segue

## Padrões e convenções aplicáveis
- Dado estático em `src/data/`, sem efeito colateral —
  `docs/adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md`
- Testes de invariantes fazem o papel de validação que a ausência de pipeline
  deixa sem cobertura — `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`
- O arquivo é consumido só pelo catálogo (Tarefa 0002); nenhum componente o
  importa direto — MDR 0008

## Escopo e instruções de implementação
1. Transcrever a provisão do humano (fonte original) aplicando a política de
   grafia do MDR 0008: correções óbvias e diacritics dos nomes de imprensa
   conhecida; confirmar com o humano os nomes não reconhecidos antes de
   entrar (pendentes: Orlando Gill, PAR 2; Van Valery, TUN 3).
2. Criar `src/data/jogadores.js` exportando `jogadoresPorSelecao` (48 siglas →
   18 nomes; Paraguai com 13), `jogadoresFWC` (20) e `jogadoresCOC` (14).
3. Criar `src/data/jogadores.test.js` com as invariantes do MDR 0008: 48
   seleções; 47 com 18 nomes e o Paraguai com 13; nenhum nome vazio; nenhuma
   duplicata na mesma seção; as 48 siglas conferem com `secoes` do catálogo;
   20 nomes para FWC e 14 para COC.

**Fora do escopo**: consumir o dado no catálogo (Tarefa 0002); exibir no
cartão (Tarefa 0003); completar a lacuna PAR16–PAR20 (a fonte ainda não
trouxe os jogadores 14–18 — ver MDR 0008).

## Decisões já tomadas (não reabrir)
- Fonte, forma do arquivo, mapeamento de posições, política de grafia, lacuna
  do Paraguai e invariantes — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- FWC00–FWC19 — ver `docs/tdr/0022-renumeracao-do-fwc.md`

## Impedimentos específicos
- Bloqueia até o reenvio humano de FWC00–FWC19 e COC01–COC14; até lá valem as
  listas da provisão anterior (MDR 0008 § Fonte), e a divergência FWC10–19
  com a descrição da Fase 14 se resolve no reenvio.
- A provisão das 48 seleções (2026-09-13) já foi conferida contra os defeitos
  da primeira listagem: 48/48 seleções, grupos idênticos ao catálogo,
  QAT06/SCO04/TUN12 e SWE04/12/14/16 preenchidos, duplicatas resolvidas;
  Paraguai com 13 jogadores — lacuna declarada (MDR 0008), não bloqueia.

## Arquivos impactados
- `src/data/jogadores.js` — criar
- `src/data/jogadores.test.js` — criar

## Critérios de aceite
- [ ] 48 seleções: 47 com 18 nomes e o Paraguai com 13 (teste)
- [ ] Nenhum nome vazio e nenhuma duplicata na mesma seção (teste)
- [ ] As 48 siglas conferem com as seções do catálogo (teste)
- [ ] 20 nomes para FWC e 14 para COC (teste)
- [ ] Grafia conforme o MDR 0008, com os nomes incertos confirmados (log)
