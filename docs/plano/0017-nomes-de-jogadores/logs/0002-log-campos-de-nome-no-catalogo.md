<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0017-0002: campos de nome no catálogo

## Data
2026-09-13

## Resumo
`expandirFigurinhas` passa a emitir `nome` e `nomeLinhas` em cada uma das 994
figurinhas, derivados de `src/data/jogadores.js` conforme o MDR 0008. Antes, a
figurinha só tinha `codigo`, `secao`, `posicao`, `metalizada` e `paisagem`; o
nome agora é dado do catálogo, sem componente lendo `jogadores.js` direto.
`catalogo.test.js` ganha o bloco "nomes das figurinhas" provando o mapeamento
(escudo/foto, duas faixas de jogadores, FWC a partir de zero, COC a partir de
um) e o corte `nome`/`nomeLinhas`. `docs/modelo-memoria.md` § Catálogo e
`AGENTS.md` § Onde fica cada coisa documentam os campos e o novo arquivo.

## Discovery
- Código: `src/data/catalogo.js` expande as seções em `expandirFigurinhas`,
  que recebe `secoesDoCatalogo` e numera de `secao.inicio ?? 1` até
  `inicio + total`; FWC usa `inicio: 0` e COC `inicio: 1`. `secoes` traz cada
  seleção com `tipo: "selecao"` e os especiais com `tipo: "especial"`.
  `src/data/jogadores.js` (Tarefa 0017-0001) exporta `jogadoresPorSelecao`
  (48 siglas → 18 strings "Prenomes/Sobrenome" ou nome único), `jogadoresFWC`
  (20) e `jogadoresCOC` (14). `catalogo.test.js` é o padrão da pasta: um
  `describe` por tema, imports relativos com extensão; `expandirFigurinhas` é
  chamado nos testes com arrays recortados (`[bra]`, `[fwc]`), então a
  derivação do nome não pode depender de `secoes` global. O comportamento
  atual confere com a tarefa — ainda não há nome. Nenhum ponto de impacto
  fora de `src/data/`; nenhum componente importa `jogadores.js` (o catálogo é
  a única fonte — TDR 0010).
- Documentação: além das referências, li o IDR 0047 § Decisão para conferir a
  semântica de `nomeLinhas` na exibição (duas linhas; nome único sozinho na
  segunda). As referências bastaram: o MDR 0008 § Decisão fixa campos,
  mapeamento e corte exatos.

## Plano da alteração
1. `src/data/catalogo.js` — importar as três exportações de `./jogadores.js`;
   acrescentar helpers puros que derivam `nome`/`nomeLinhas` de uma figurinha
   (seleções: posição 01 = "Escudo do time", 13 = "Foto do time", 02–12 e
   14–20 = jogadores 1–11 e 12–18; FWC = `jogadoresFWC[posicao]`; COC =
   `jogadoresCOC[posicao - 1]`); `expandirFigurinhas` emite os dois campos. O
   corte: jogador com barra vira `{ nome: "Prenomes Sobrenome", nomeLinhas:
   ["Prenomes", "Sobrenome"] }`; nome único vira `{ nome, nomeLinhas: [null,
   nome] }`; posições fixas, FWC e COC ficam `nomeLinhas: null`, com a barra
   literal preservada em `nome`.
2. `src/data/catalogo.test.js` — novo `describe("nomes das figurinhas")` com
   os casos do escopo (994 nomes não vazios; `BRA01`/`BRA13` sem linhas;
   `BRA02` Alisson com `[null, "Alisson"]`; `BRA14` Vinícius/Júnior com
   `["Vinícius", "Júnior"]`; `FWC00` e `COC01` com o nome da fonte e sem
   linhas; nenhuma seleção com barra em `nome`).
3. `docs/modelo-memoria.md` § Catálogo — a figurinha ganha `nome` e
   `nomeLinhas`, citando o [MDR 0008](../../model-dr/0008-dados-dos-nomes-das-figurinhas.md).
4. `AGENTS.md` § Onde fica cada coisa — linha de `src/data/jogadores.js`.
5. Rodar `npm run lint && npm run test && npm run build`.
- Verificação prevista: critério 1 pelos testes de nome não vazio e de
  mapeamento; critério 2 pelos casos `BRA01`/`BRA13`/`BRA02`/`BRA14`/`FWC00`/
  `COC01`; critério 3 pela conferência dos dois documentos alterados.
- Riscos: índice do jogador errado por causa da posição 13 no meio da faixa —
  mitigado pelos testes de `BRA14` (primeiro da segunda faixa) e `BRA13`.
- Desvios: nenhum.

## Decisões tomadas
- Helpers de derivação dentro de `catalogo.js` (não em `jogadores.js`) —
  o escopo diz que o mapeamento de posições é desta tarefa, ao consumir o
  dado; nível 1.
- `nome` de jogador com corte une prenomes e sobrenome com um espaço (sem a
  barra), fiel ao MDR 0008; nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

`npm run lint`:

```
Found 0 warnings and 0 errors.
Finished in 52ms on 73 files with 105 rules using 4 threads.
```

`npm run test`:

```
Test Files  37 passed (37)
     Tests  435 passed (435)
```

`src/data/catalogo.test.js` passou de 27 para 34 testes (7 novos no bloco
"nomes das figurinhas"); `src/data/jogadores.test.js` segue com 6.

`npm run build`:

```
✓ 132 modules transformed.
dist/assets/index-DAdWY1Hj.js  428.57 kB │ gzip: 132.60 kB
dist/assets/index.esm-BJmEYVxW.js  505.90 kB │ gzip: 148.77 kB
(!) Some chunks are larger than 500 kB after minification. [...]
✓ built in 931ms
```

O aviso de chunk > 500 kB é pré-existente (SDK do Firebase). O chunk
principal cresceu de ~412 kB para ~428 kB porque `catalogo.js` agora
importa `jogadores.js`; era esperado — o dado entra no bundle do catálogo.

## Critérios de aceite
- [x] As 994 figurinhas com `nome`, e `nomeLinhas` segundo o MDR 0008 (teste)
  — `catalogo.test.js` "toda figurinha tem nome não vazio", "as posições
  fixas 01 e 13 não têm linhas", "nome único fica só no sobrenome da segunda
  linha", "jogador com corte separa prenomes e sobrenome", "FWC a partir de
  zero e COC a partir de um, sem linhas" e "nome de seleção nunca contém a
  barra de corte"
- [x] Posições fixas 01/13, as duas faixas de jogadores, FWC a partir de zero
  e COC a partir de um mapeados (teste) — `catalogo.test.js` "mapeia as duas
  faixas de jogadores das seleções" (`BRA12` fecha a primeira, `BRA20` fecha
  a segunda) e "FWC a partir de zero e COC a partir de um, sem linhas"
- [x] `docs/modelo-memoria.md` e `AGENTS.md` atualizados no mesmo commit —
  `docs/modelo-memoria.md` § Catálogo descreve `nome`/`nomeLinhas` citando o
  MDR 0008; `AGENTS.md` § Onde fica cada coisa traz a linha de
  `src/data/jogadores.js`

## Arquivos alterados
- `src/data/catalogo.js` — derivação e emissão de `nome`/`nomeLinhas`
- `src/data/catalogo.test.js` — invariantes dos nomes
- `docs/modelo-memoria.md` — campos da figurinha (§ Catálogo)
- `AGENTS.md` — linha de `src/data/jogadores.js`
- `docs/plano/0017-nomes-de-jogadores/0002-modificar-catalogo.md` — status
- `docs/plano/README.md` — status da tarefa
