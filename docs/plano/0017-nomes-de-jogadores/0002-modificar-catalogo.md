<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0002]: campo nome no catálogo

## Status
Pendente

## Objetivo
Acrescentar o campo `nome` a cada figurinha expandida por
`expandirFigurinhas`, derivado de `jogadores.js` conforme o MDR 0008, e
refletir a nova forma do dado na documentação de modelo no mesmo commit.

## Documentos de referência
- `src/data/jogadores.js` (gerado pela Tarefa 0017-0001)
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão —
  mapeamento de posições, lacuna do Paraguai e invariantes
- `src/data/catalogo.js` — `expandirFigurinhas` e a forma atual da figurinha
  (`codigo`, `secao`, `posicao`, `metalizada`, `paisagem`)
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão — "estrutura
  de cada figurinha" a atualizar
- `docs/modelo-memoria.md` § Catálogo — a mesma forma, em visão de memória
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md` —
  o catálogo como única fonte do dado; a fonte dos nomes chegou por
  fornecimento do humano
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — exibição
  do nome no cartão (Tarefa 0003)

## Padrões e convenções aplicáveis
- `jogadores.js` é consumido só por `catalogo.js`; o resto do app continua
  obtendo tudo do catálogo — MDR 0008 e TDR 0010
- Mudança na forma da figurinha é modelagem de dados: MDR 0006 e
  `modelo-memoria.md` atualizados no mesmo commit
- `AGENTS.md` § Onde fica cada coisa ganha a linha de `src/data/jogadores.js`
- O schema do Firestore não muda: `nome` é dado de catálogo, não de usuário;
  a chave continua o código, nunca o nome —
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`

## Escopo e instruções de implementação
1. Derivar em `catalogo.js` o nome de cada figurinha a partir de
   `jogadores.js`, conforme o mapeamento de posições do MDR 0008 (posições
   fixas 01 e 13; jogadores 1–11 e 12–18; FWC a partir de zero, COC a partir
   de um).
2. `expandirFigurinhas` passa a emitir `nome` para cada figurinha.
3. Testes em `catalogo.test.js`: as 994 figurinhas com `nome` não vazio;
   `BRA01` "Escudo do time" e `BRA13` "Foto do time"; `FWC00` e `COC01` com
   os nomes da fonte; um jogador de cada faixa (ex.: `BRA02` e `BRA14`) com
   o nome certo.
4. Atualizar MDR 0006 (figurinha ganha `nome`; `jogadores.js` como dado de
   nomes), `docs/modelo-memoria.md` § Catálogo, TDR 0010 (a fonte dos nomes
   chegou por fornecimento do humano) e a linha de `src/data/jogadores.js` no
   `AGENTS.md`.

**Fora do escopo**: exibir o nome no cartão (Tarefa 0003); estilo do nome
(Tarefa 0004); qualquer mudança no Firestore ou no formato de intercâmbio.

## Decisões já tomadas (não reabrir)
- Mapeamento de posições, lacuna do Paraguai e invariantes — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- Chave do Firestore é o código, nunca o nome — ver
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`
- FWC com `inicio: 0` — ver `docs/tdr/0022-renumeracao-do-fwc.md`

## Arquivos impactados
- `src/data/catalogo.js` — modificar
- `src/data/catalogo.test.js` — modificar
- `docs/model-dr/0006-catalogo-estatico-embutido.md` — modificar
- `docs/modelo-memoria.md` — modificar (§ Catálogo)
- `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md` —
  modificar
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] As 994 figurinhas com `nome` não vazio (teste)
- [ ] FWC indexa a partir de zero e COC a partir de um (teste com `FWC00` e
      `COC01`)
- [ ] Posições fixas 01/13 e as duas faixas de jogadores mapeadas corretamente
      (teste)
- [ ] MDR 0006, `modelo-memoria.md`, TDR 0010 e `AGENTS.md` atualizados no
      mesmo commit
