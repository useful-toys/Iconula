<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0001]: dados dos jogadores

## Status
Pendente

## Objetivo
Criar `src/data/jogadores.js` com o nome de cada uma das 994 figurinhas — 48
seleções × 18 jogadores mais "Escudo do time" (01) e "Foto do time" (13), 20
Extras FIFA (FWC00–FWC19) e 14 Coca-Cola (COC01–COC14) — a partir do
fornecimento do humano (fonte original).

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Dados e mapeamento —
  48×18 + escudo + foto, 20 FWC, 14 COC; posições 01/13 fixas
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
  importa direto — TDR 0010

## Escopo e instruções de implementação
1. Receber do humano a lista completa da fonte original e conferi-la contra
   os defeitos conhecidos da primeira tentativa (ver "Impedimentos
   específicos").
2. Criar `src/data/jogadores.js` exportando `jogadoresPorSelecao` (48 siglas →
   18 nomes), `jogadoresFWC` (20 nomes) e `jogadoresCOC` (14 nomes).
3. Criar `src/data/jogadores.test.js` com as invariantes: 48 seleções com 18
   nomes cada; nenhum nome vazio; nenhuma duplicata dentro da mesma seção; as
   48 siglas conferem com `secoes` do catálogo; 20 nomes para FWC e 14 para
   COC; 48×18 + 48 + 48 + 20 + 14 = 994 nomes no total.

**Fora do escopo**: consumir o dado no catálogo (Tarefa 0002); exibir no
cartão (Tarefa 0003).

## Decisões já tomadas (não reabrir)
- Mapeamento de posições (01 escudo, 13 foto, 02–12 jogadores 1–11, 14–20
  jogadores 12–18) — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- FWC00–FWC19 — ver `docs/tdr/0022-renumeracao-do-fwc.md`

## Impedimentos específicos
- Sem o fornecimento do humano, a tarefa bloqueia — a primeira listagem
  estava incompleta e com erros (removida do IDR 0047; ver o Histórico dele).
  Ao receber a fonte, conferir contra esses pontos, um a um:
  - as 4 seleções ausentes: **RSA, SEN, SUI, TUR**;
  - os buracos: **QAT06, SCO04, TUN12, SWE04, SWE12, SWE14, SWE16**;
  - **Paraguai**: as posições 15–20 vieram com jogadores da Colômbia;
  - duplicatas dentro da mesma seção: **NZL02/NZL20, PAN10/PAN12,
    POR03/POR17, UZB09/UZB17, UZB12/UZB20**;
  - **FWC09–FWC19**: conferir contra a numeração oficial — a Fase 14 descreve
    "onze campeãs históricas do FIFA Museum (9–19), de Itália 1934 a
    Argentina 2022" (`docs/plano/README.md` § Fase 14), e a primeira listagem
    dizia outra coisa.

## Arquivos impactados
- `src/data/jogadores.js` — criar
- `src/data/jogadores.test.js` — criar

## Critérios de aceite
- [ ] 48 seleções com 18 nomes + 20 FWC + 14 COC = 994 nomes (teste)
- [ ] Nenhum nome vazio e nenhuma duplicata na mesma seção (teste)
- [ ] As 48 siglas conferem com as seções do catálogo (teste)
- [ ] A conferência contra os defeitos conhecidos, item a item, está no log
