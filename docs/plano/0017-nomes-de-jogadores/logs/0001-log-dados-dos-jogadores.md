<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0017-0001: dados dos jogadores

## Data
2026-09-13

## Resumo
Criados `src/data/jogadores.js` e `src/data/jogadores.test.js`. O primeiro
transcreve as listas confirmadas do MDR 0008 nas três exportações previstas
(`jogadoresPorSelecao`, `jogadoresFWC`, `jogadoresCOC`); o segundo prova as
invariantes do registro. Nada mais do app mudou: nenhum componente importa o
dado ainda — só a Tarefa 0017-0002 passará a consumi-lo em `catalogo.js`.

## Discovery
- Código: `src/data/catalogo.js` tem as 48 siglas em `secoes` (tipo
  `selecao`), FWC com `inicio: 0` e COC com 14; `expandirFigurinhas` ainda não
  emite nome (fica na Tarefa 0017-0002). `src/data/catalogo.test.js` é o padrão
  de teste de invariantes da pasta: `describe` por tema, `it` por invariante,
  imports relativos com extensão `.js`, copyright na primeira linha. O
  comportamento atual confere com a tarefa — ainda não há nome algum. Nenhum
  ponto de impacto fora de `src/data/`.
- Documentação: as referências bastaram. MDR 0008 § Decisão e § Listas
  confirmadas trazem o conteúdo exato a transcrever (48 linhas de seleção,
  FWC00–FWC19 e COC01–COC14), a forma das três exportações e as invariantes.

## Plano da alteração
1. Criar `src/data/jogadores.js` com o cabeçalho de copyright, o comentário de
   forma (MDR 0008) e as três exportações: objeto `jogadoresPorSelecao` com as
   48 siglas na ordem alfabética do catálogo → 18 strings cada; array
   `jogadoresFWC` (20); array `jogadoresCOC` (14). Strings em aspas duplas para
   não escapar apóstrofos (O'Neill, Ngal'ayel). Sem lógica — só dado estático.
2. Criar `src/data/jogadores.test.js` com `describe("invariantes dos jogadores")`
   provando: 48 seleções com 18 jogadores; siglas iguais às seleções de
   `catalogo.js`; em seleções, no máximo uma barra e nenhum lado vazio ou com
   espaço nas pontas; nenhum nome vazio; nenhuma duplicata na mesma seção; 20
   FWC e 14 COC.
3. Rodar `npm run lint && npm run test && npm run build`.
- Verificação prevista: critérios de aceite 1–4 pelos testes; critério 5 pela
  conferência de transcrição linha a linha contra o MDR 0008, registrada neste
  log.
- Riscos: transcrição de 864 nomes de seleção com diacríticos e apóstrofos —
  mitigado conferindo cada linha do MDR e com a checagem de duplicatas/vazios.
- Desvios: nenhum.

## Decisões tomadas
- `jogadoresPorSelecao` como objeto de arrays (48 chaves) e arrays simples para
  FWC/COC — forma fixada pelo MDR 0008 § Decisão ("Forma"), sem decisão nova.
- Strings em aspas duplas para evitar escape de apóstrofos — nível 1, estilo.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

`npm run lint`:

```
Found 0 warnings and 0 errors.
Finished in 74ms on 73 files with 105 rules using 4 threads.
```

`npm run test`:

```
Test Files  37 passed (37)
     Tests  428 passed (428)
```

Inclui `src/data/jogadores.test.js` (6 tests).

`npm run build`:

```
✓ 131 modules transformed.
dist/assets/index-Sa0MVcYp.js  412.07 kB │ gzip: 124.33 kB
dist/assets/index.esm-Bfzk5MWO.js  505.90 kB │ gzip: 148.77 kB
(!) Some chunks are larger than 500 kB after minification. [...]
✓ built in 680ms
```

O aviso de chunk > 500 kB é pré-existente (SDK do Firebase, inalterado
por esta tarefa); `jogadores.js` ainda não é importado por ninguém, então
nem entra no bundle.

Conferência de transcrição (critério 5): script local comparou, nome a
nome e na ordem, o conteúdo de `src/data/jogadores.js` com as listas do
MDR 0008 — saída:

```
seleções MDR: 48 | FWC: 20 | COC: 14 | erros: 0
```

## Critérios de aceite
- [x] 48 seleções com 18 nomes cada, siglas iguais às do catálogo (teste)
  — `jogadores.test.js` "tem 48 seleções com 18 jogadores cada" e "as 48
  siglas são iguais às seleções do catálogo"
- [x] No máximo uma barra por jogador de seleção, sem lado vazio nem
  espaço nas pontas (teste) — "em seleções, no máximo uma barra, sem lado
  vazio nem espaço nas pontas"
- [x] Nenhum nome vazio e nenhuma duplicata na mesma seção (teste) —
  "nenhum nome vazio" e "nenhuma duplicata na mesma seção"
- [x] 20 nomes para FWC e 14 para COC (teste) — "tem 20 nomes de FWC e 14
  de COC"
- [x] Transcrição conferida contra o MDR 0008 (conferência no log) —
  script local, 0 erros nas 48 seleções, 20 FWC e 14 COC

## Arquivos alterados
- `src/data/jogadores.js` — criado: as três exportações transcritas do MDR 0008
- `src/data/jogadores.test.js` — criado: invariantes do MDR 0008
