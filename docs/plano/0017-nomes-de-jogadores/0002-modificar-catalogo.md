<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0002]: campos de nome no catálogo

## Status
Pendente

## Objetivo
Cada figurinha expandida do catálogo passa a trazer `nome` (texto completo) e
`nomeLinhas` (prenomes e sobrenome, ou nada quando o nome não tem corte),
derivados de `jogadores.js` conforme o MDR 0008 — o resto do app segue lendo
tudo do catálogo.

## Documentos de referência
- `src/data/jogadores.js` (gerado pela Tarefa 0017-0001)
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão —
  mapeamento de posições e os campos `nome` e `nomeLinhas`
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão — estrutura
  de cada figurinha, já com os dois campos
- `src/data/catalogo.js` — `expandirFigurinhas` e a forma atual da figurinha
- `docs/modelo-memoria.md` § Catálogo — forma da figurinha em memória
- `AGENTS.md` § Onde fica cada coisa — tabela de arquivos de `src/data/`

## Padrões e convenções aplicáveis
- `jogadores.js` só é lido por `catalogo.js` — MDR 0008
- A chave da coleção continua o código, nunca o nome; Firestore e
  intercâmbio não mudam — `docs/model-dr/0002-schema-do-documento-da-colecao.md`,
  `docs/model-dr/0004-formato-de-intercambio-da-colecao.md`
- Sem literais de figurinha escritos à mão: tudo por expansão — TDR 0010

## Escopo e instruções de implementação
1. Em `catalogo.js`, derivar para cada figurinha os dois campos do MDR 0008:
   seleções — posição 01 "Escudo do time", 13 "Foto do time", 02–12 e 14–20
   dos jogadores 1–11 e 12–18; FWC a partir de zero; COC a partir de um.
2. `expandirFigurinhas` emite `nome` e `nomeLinhas` em toda figurinha.
3. Testes em `catalogo.test.js`: as 994 com `nome` não vazio; `BRA01`
   "Escudo do time" e `BRA13` "Foto do time" sem linhas; `BRA02` Alisson
   (nome único: só sobrenome); `BRA14` Vinícius/Júnior (prenomes e
   sobrenome); `FWC00` e `COC01` com os nomes da fonte e sem linhas; `nome`
   nunca contém a barra de corte de jogador.
4. Em `docs/modelo-memoria.md` § Catálogo, a figurinha ganha `nome` e
   `nomeLinhas`, citando o MDR 0008; em `AGENTS.md` § Onde fica cada coisa,
   linha de `src/data/jogadores.js` ("nomes das 994 figurinhas, transcritos
   do MDR 0008; lido só pelo catálogo").

**Fora do escopo**: exibição (Tarefas 0017-0004 e 0017-0005); Firestore e
formato de intercâmbio.

## Decisões já tomadas (não reabrir)
- Campos, mapeamento e corte — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` e
  `docs/model-dr/0006-catalogo-estatico-embutido.md`
- Chave da coleção é o código — ver
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`

## Arquivos impactados
- `src/data/catalogo.js` — modificar
- `src/data/catalogo.test.js` — modificar
- `docs/modelo-memoria.md` — modificar (§ Catálogo)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] As 994 figurinhas com `nome`, e `nomeLinhas` segundo o MDR 0008 (teste)
- [ ] Posições fixas 01/13, as duas faixas de jogadores, FWC a partir de zero
      e COC a partir de um mapeados (teste)
- [ ] `docs/modelo-memoria.md` e `AGENTS.md` atualizados no mesmo commit
