<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0022-0002]: paisagens do FWC e `nomeCurto` no catálogo

## Status
Pendente

## Objetivo
Marcar como paisagem `FWC00`–`FWC03` e `FWC09`–`FWC19`, como no cromo físico,
e dar a cada figurinha o campo `nomeCurto` — o rótulo de uma linha das 15
paisagens do FWC, `null` nas demais —, com as invariantes que travam o dado.

## Documentos de referência
- `docs/model-dr/0006-catalogo-estatico-embutido.md` § Decisão — "Paisagem no
  FWC" e "Estrutura de cada figurinha"; § Consequências — invariantes de
  paisagem
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão — "Forma",
  "Campos no catálogo" e "Invariantes"; § Listas confirmadas — "Nomes curtos
  das paisagens do FWC" (os 15 textos exatos)
- `src/data/jogadores.js` — `jogadoresFWC` e o comentário de cabeçalho
- `src/data/catalogo.js` — `nomeDaFigurinha` e `expandirFigurinhas` (campo
  `paisagem` e o comentário das posições fixas)
- `src/data/catalogo.test.js` — "especiais não têm metalizada nem paisagem" e
  `describe("nomes das figurinhas")`
- `src/data/jogadores.test.js` — `describe("invariantes dos jogadores")`
- `docs/modelo-memoria.md` § Catálogo estático
- `AGENTS.md` § Onde fica cada coisa — linha de `src/data/jogadores.js`

## Padrões e convenções aplicáveis
- `jogadores.js` é dado estático, sem lógica, lido só por `catalogo.js`;
  nenhum componente o importa — MDR 0008, TDR 0010
- A expansão continua função pura e o catálogo, a única fonte do dado —
  MDR 0006
- `nome` não muda: o nome completo continua sendo o do nome acessível; o curto
  vive só em `nomeCurto` — MDR 0008
- Os 15 textos são transcritos exatamente da lista confirmada, sem reescrever —
  MDR 0008
- COC continua sem paisagem; metalizada continua só na `01` das seleções —
  MDR 0006, TDR 0010

## Escopo e instruções de implementação
1. `jogadores.js`: nova exportação com os 15 nomes curtos das paisagens do
   FWC, chaveados pela posição (00–03 e 09–19), transcritos da lista do
   MDR 0008; o comentário de cabeçalho passa a descrever as quatro
   exportações.
2. `catalogo.js`:
   - as posições paisagem do FWC viram dado (conjunto de posições), ao lado
     dos rótulos fixos das seleções;
   - `paisagem` = (seleção e posição 13) ou (FWC e posição no conjunto);
   - toda figurinha ganha `nomeCurto`: o texto da nova exportação nas
     paisagens do FWC, `null` nas demais;
   - o comentário de `expandirFigurinhas` cita as paisagens do FWC e o
     `nomeCurto` (MDR 0006, MDR 0008).
3. `catalogo.test.js`:
   - o teste "especiais não têm metalizada nem paisagem" se divide: FWC sem
     metalizada e com paisagem exatamente em `FWC00`–`FWC03` e
     `FWC09`–`FWC19`; COC sem metalizada nem paisagem;
   - total de paisagens no catálogo: 48 + 15 = 63;
   - `nomeCurto` preenchido exatamente nas 15 paisagens do FWC (ex.: `FWC10`
     → "Uruguai 1950", `FWC19` → "Argentina 2022"), `null` em `BRA13`,
     `FWC04` e `COC01`; `nome` de `FWC10` continua o completo.
4. `jogadores.test.js`: 15 nomes curtos, nas posições esperadas, não vazios e
   com até 14 caracteres.
5. `docs/modelo-memoria.md` § Catálogo estático, citando os MDRs 0006 e 0008:
   - `figurinhas` lista também `nomeCurto` (texto ou `null` — só nas
     paisagens do FWC);
   - depois de "Posições fixas", a linha das paisagens do FWC (`FWC00`–`FWC03`
     e `FWC09`–`FWC19`; `FWC04`–`FWC08` retrato).
6. `AGENTS.md` § Onde fica cada coisa: a linha de `src/data/jogadores.js`
   passa a dizer "nomes das 994 figurinhas e os nomes curtos das paisagens do
   FWC, transcritos do MDR 0008".

**Fora do escopo**: exibição do `nomeCurto`, props e repasse ao cartão (Tarefa
0022-0003); medidas do cartão (Tarefa 0022-0001); layout de álbum do FWC, que
segue em lista (IDR 0023); texto de troca e export/import, que seguem só com o
código.

## Decisões já tomadas (não reabrir)
- Paisagens do FWC e campo `nomeCurto` na estrutura da figurinha — ver
  `docs/model-dr/0006-catalogo-estatico-embutido.md`
- Forma, textos e invariantes do `nomeCurto` — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- FWC sempre em lista, também na disposição álbum — ver
  `docs/idr/0023-coca-cola-no-modo-album-fwc-sempre-lista.md`
- Catálogo sem pipeline, dado escrito à mão e travado por testes — ver
  `docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md`

## Decisões em aberto nesta tarefa
- Nome da exportação e da constante de posições — nível 1, sem registro

## Arquivos impactados
- `src/data/jogadores.js`, `src/data/jogadores.test.js` — modificar
- `src/data/catalogo.js`, `src/data/catalogo.test.js` — modificar
- `docs/modelo-memoria.md` — modificar (§ Catálogo estático)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] `paisagem` verdadeiro exatamente na `13` das 48 seleções e em
      `FWC00`–`FWC03` e `FWC09`–`FWC19`; 63 no total (teste)
- [ ] COC sem paisagem; metalizada só na `01` das seleções (teste)
- [ ] `nomeCurto` com os 15 textos do MDR 0008 nas paisagens do FWC e `null`
      nas outras 979 figurinhas (teste)
- [ ] `nome` do FWC inalterado (teste de `FWC00` e `FWC10`)
- [ ] Nomes curtos não vazios e com até 14 caracteres (teste)
- [ ] Nenhum arquivo de `src/components/` importa `jogadores.js` (busca)
- [ ] `docs/modelo-memoria.md` § Catálogo estático e `AGENTS.md` atualizados,
      citando os MDRs 0006 e 0008
