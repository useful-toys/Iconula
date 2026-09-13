<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0001]: dados dos jogadores

## Status
Pendente

## Objetivo
Criar `src/data/jogadores.js` com os nomes das figurinhas — 48 seleções com 18
jogadores cada, 20 Extras FIFA e 14 Coca-Cola — transcrevendo as listas
confirmadas do MDR 0008.

## Documentos de referência
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Listas confirmadas
  e § Decisão — o conteúdo a transcrever: forma das três exportações, corte
  prenomes/sobrenome, mapeamento de posições, grafia já corrigida e
  invariantes
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
1. Transcrever as listas confirmadas do MDR 0008 para `src/data/jogadores.js`,
   nas três exportações: `jogadoresPorSelecao` (48 siglas → 18 jogadores,
   cada um como "Prenomes/Sobrenome"; sem barra, nome único), `jogadoresFWC`
   (20) e `jogadoresCOC` (14) — a grafia já está corrigida no registro.
2. Criar `src/data/jogadores.test.js` com as invariantes do MDR 0008: 48
   seleções com 18 jogadores; todo jogador com corte ("Prenomes/Sobrenome")
   ou nome único, e nenhum corte em FWC/COC — onde a barra, quando existe,
   é literal (FWC00, FWC02, FWC09, FWC19); nenhum nome vazio; nenhuma
   duplicata na mesma seção; as 48 siglas conferem com `secoes` do catálogo;
   20 nomes para FWC e 14 para COC.

**Fora do escopo**: consumir o dado no catálogo (Tarefa 0002); exibir no
cartão (Tarefa 0003).

## Decisões já tomadas (não reabrir)
- Fonte, forma do arquivo, mapeamento de posições, política de grafia, lacuna
  do Paraguai e invariantes — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- FWC00–FWC19 — ver `docs/tdr/0022-renumeracao-do-fwc.md`

## Arquivos impactados
- `src/data/jogadores.js` — criar
- `src/data/jogadores.test.js` — criar

## Critérios de aceite
- [ ] 48 seleções com 18 nomes cada (teste)
- [ ] Corte presente em todo jogador de seleção — barra ou nome único — e
      ausente em FWC/COC (teste)
- [ ] Nenhum nome vazio e nenhuma duplicata na mesma seção (teste)
- [ ] As 48 siglas conferem com as seções do catálogo (teste)
- [ ] 20 nomes para FWC e 14 para COC (teste)
- [ ] Transcrição fiel às listas confirmadas do MDR 0008 (conferência no log)
