<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0014-0001: FWC renumerado de FWC00 a FWC19

## Data
2026-09-12

## Resumo
Corrigido o deslocamento de um na numeração da seção `FWC`. O catálogo
antes espalhava `FWC01`…`FWC20`; agora espalha `FWC00`…`FWC19`, sem buraco.
A quantidade não mudou: o FWC continua com 20 figurinhas e o catálogo
inteiro, com 994.

`expandirFigurinhas` (`src/data/catalogo.js`) ganhou o campo opcional
`inicio` (padrão `1`), que é o número da primeira figurinha da seção;
`total` continua significando **quantidade**, não o último número. O laço
passou a ir de `inicio` a `inicio + total − 1`, e o código continua sendo a
sigla mais o número com dois dígitos (`padStart(2, "0")`). A seção `fwc`
ganhou `inicio: 0` mantendo `total: 20` e `paginas: null`; nenhum outro
campo mudou. `metalizada` e `paisagem` continuam presos a
`tipo === "selecao"`, e o FWC nunca teve nenhum dos dois.

Comentários ajustados: o JSDoc de `expandirFigurinhas` citava
`FWC01`…`FWC20` e agora cita `FWC00`…`FWC19`, com uma nota sobre o campo
`inicio`. A busca final por `FWC20` em `src/` não encontra mais nada; por
`FWC00` encontra a geração e os testes novos. Os demais usos de `FWC01`
como exemplo de código válido nos testes de `App`, `lib/` e `Secao`
permanecem: `FWC01` continua existindo depois da renumeração (é o emblema,
parte de cima), e a suíte confirma.

Invariantes ajustadas em `src/data/catalogo.test.js`: o teste do FWC agora
verifica os 20 códigos de `FWC00` a `FWC19`, em ordem e sem buraco, além de
continuar exigindo 20 no FWC e 14 no COC; um teste novo cobre o campo
`inicio` (primeira posição `0`, última `19`). Em
`src/components/Catalogo.test.jsx`, o rótulo `FWC 01` virou `FWC 00` e o
laço que preenche `contagensFwcCompletas` passou de 1–20 para 0–19. Em
`src/components/Secao.test.jsx`, a fixture `figurinhasFwc` passou a gerar o
código a partir de `i` (não `i + 1`) e o laço de asserção foi de 1–20 para
0–19.

## Decisões tomadas
- **TDR 0022** (`docs/tdr/0022-renumeracao-do-fwc.md`): registra o campo
  `inicio` (por que não escrever os 20 códigos como literais, contra o
  TDR 0010), a renumeração da seção FWC para começar em zero e a decisão
  explícita de **não migrar dado**. Decisão de nível 1 (como o dado
  expressa uma numeração que não começa em 1), tomada e registrada nesta
  tarefa.
- **Sem migração de dado**: confirmado com o humano que não há uso real em
  produção sob os códigos antigos, premissa que a tarefa já trazia e que o
  TDR 0022 repete. Nenhum indício de contagem gravada sob os códigos antigos
  apareceu antes da troca do gerador, então o impedimento nível 3
  (irreversível) não foi acionado.
- Nenhuma outra decisão de nível 1. O `inicio` é detalhe interno de
  implementação já encaminhado pela tarefa; `metalizada`/`paisagem` e
  `paginas` seguiram como estavam.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```

### `npm run lint`
```
> iconula@0.0.0 lint
> oxlint


  ! react(refs): Cannot access refs during render
     ,-[src/components/Catalogo.jsx:195:44]
 194 |       // (inicializador preguiçoso do `useState`, nunca recalculado).
 195 | ,->   const [superGrupoRefHandlers] = useState(() => {
 196 | |       const map = new Map();
 197 | |       for (const letra of 'ABCDEFGHIJKL') {
 198 | |         map.set(letra, (refValue) => setSuperGrupoRef(letra, refValue));
 199 | |       }
 200 | |       return map;
 201 | |->   });
     : `---- Passing a ref to a function may read its value during render
 202 |     
     `----
  help: React refs are values that are not needed for rendering. Refs should only be accessed outside of render, such as in event handlers or effects. Accessing a ref value (the `current` property) during render can cause your component not to update as expected
  note: React Compiler skipped optimizing this component or hook. Additional guidance: https://react.dev/reference/eslint-plugin-react-hooks/lints/refs

Found 1 warning and 0 errors.
Finished in 52ms on 69 files with 105 rules using 4 threads.
```
O único aviso é o `react(refs)` pré-existente e já documentado no TDR 0021
(mapa de handlers de `SuperGrupo`); nada novo introduzido por esta tarefa.

### `npm run test`
```
> iconula@0.0.0 test
> vitest run

 ✓ src/data/catalogo.test.js (27 tests) 84ms
 (demais arquivos)

 Test Files  35 passed (35)
      Tests  371 passed (371)
   Start at  12:21:10
   Duration  55.57s (environment 56%, tests 27%, import 15%, transform 2%, worker 1%)
```
Os avisos `An update to Avisos inside a test was not wrapped in act(...)`
no stderr são pré-existentes (não relacionados a esta tarefa) e a suíte
sai verde. `catalogo.test.js` passou de 26 para 27 testes (o teste novo do
campo `inicio`).

### `npm run build`
```
> iconula@0.0.0 build
> vite build

vite v8.2.2 building client environment for production...
transforming...
✓ 130 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                     1.01 kB │ gzip:   0.51 kB
dist/assets/index-BCVqlIEu.css                     14.56 kB │ gzip:   3.43 kB
dist/assets/index-BCsVFHrK.js                     408.62 kB │ gzip: 123.29 kB
dist/assets/index.esm-Cc_QmWUN.js                 505.90 kB │ gzip: 148.77 kB
✓ built in 1.01s
```
Aviso de chunk > 500 kB pré-existente, não relacionado a esta tarefa.

### Busca final (item 7 do escopo)
- `FWC20` em `src/`: nenhuma ocorrência.
- `FWC00` em `src/`: a geração em `catalogo.js`, o JSDoc novo e os testes
  novos.
- `FWC01` em `src/`: continua nos testes que o usam só como exemplo de
  código válido; não precisou mudar.

## Arquivos alterados
- `src/data/catalogo.js` — campo `inicio` em `expandirFigurinhas`, `inicio: 0` no FWC, comentários
- `src/data/catalogo.test.js` — invariante do FWC00–FWC19 e teste do `inicio`
- `src/components/Catalogo.test.jsx` — rótulo `FWC 00` e laço 0–19
- `src/components/Secao.test.jsx` — fixture e laço 0–19 do FWC
- `docs/tdr/0022-renumeracao-do-fwc.md` — novo
- `docs/plano/0014-numeracao-dos-extras-fifa/0001-fwc-renumerado-de-00-a-19.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0014-0001 atualizado
- `docs/plano/0014-numeracao-dos-extras-fifa/logs/0001-log-fwc-renumerado-de-00-a-19.md` — este log
