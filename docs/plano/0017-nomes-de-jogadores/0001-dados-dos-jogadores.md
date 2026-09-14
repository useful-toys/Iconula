<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0001]: dados dos jogadores

## Status
Concluída

## Objetivo
Criar `src/data/jogadores.js` com os nomes das figurinhas — 48 seleções com 18
jogadores cada, 20 Extras FIFA e 14 Coca-Cola — transcrevendo as listas
confirmadas do MDR 0008, com testes de invariantes.

## Documentos de referência
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão e
  § Listas confirmadas — o conteúdo a transcrever, as três exportações, o
  corte prenomes/sobrenome e as invariantes
- `src/data/catalogo.js` — as 50 seções (siglas) que o dado cobre
- `src/data/catalogo.test.js` — padrão dos testes de invariantes

## Padrões e convenções aplicáveis
- Dado estático em `src/data/`, sem efeito colateral —
  `docs/adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md`
- Testes de invariantes suprem a ausência de pipeline —
  `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`
- Consumido só pelo catálogo; nenhum componente o importa — MDR 0008
- Transcrição fiel: nenhuma grafia alterada além do que o MDR 0008 já traz
  — MDR 0008

## Escopo e instruções de implementação
1. Transcrever as listas do MDR 0008 para `src/data/jogadores.js`, nas três
   exportações do registro: jogadores por seleção (48 siglas → 18 textos
   "Prenomes/Sobrenome" ou nome único), Extras FIFA (20) e Coca-Cola (14).
2. Criar `src/data/jogadores.test.js` com as invariantes do MDR 0008: 48
   seleções com 18 jogadores; as 48 siglas iguais às seleções do catálogo;
   em seleções, no máximo uma barra por jogador e nenhum lado da barra vazio
   ou com espaço nas pontas; nenhum nome vazio; nenhuma duplicata na mesma
   seção; 20 nomes de FWC e 14 de COC.

**Fora do escopo**: campos no catálogo (Tarefa 0017-0002); fonte e exibição
(Tarefas 0017-0003 a 0017-0005).

## Decisões já tomadas (não reabrir)
- Fonte, forma, corte, grafia e invariantes — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- FWC de `FWC00` a `FWC19` — ver
  `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`

## Arquivos impactados
- `src/data/jogadores.js` — criar
- `src/data/jogadores.test.js` — criar

## Critérios de aceite
- [ ] 48 seleções com 18 nomes cada, siglas iguais às do catálogo (teste)
- [ ] No máximo uma barra por jogador de seleção, sem lado vazio nem espaço
      nas pontas (teste)
- [ ] Nenhum nome vazio e nenhuma duplicata na mesma seção (teste)
- [ ] 20 nomes para FWC e 14 para COC (teste)
- [ ] Transcrição conferida contra o MDR 0008 (conferência no log)
