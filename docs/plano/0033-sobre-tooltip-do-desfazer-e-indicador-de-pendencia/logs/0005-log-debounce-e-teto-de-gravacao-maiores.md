<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0033-0005: Debounce e teto de gravação maiores

## Data
2026-09-18

## Resumo
A gravação agregada da coleção passou a agrupar mais tempo antes de escrever:
`DEBOUNCE_MS` de 2000 para 4000 e `TETO_MS` de 10000 para 20000. Antes, uma
rajada gravava ~2s após o último ajuste e, em atividade contínua, no máximo a
cada ~10s; agora são ~4s e ~20s, mantendo a proporção 1:5, para capturar mais
eventos por gravação e reduzir chamadas ao Firestore
([MDR 0003](../../../model-dr/0003-gravacao-agregada-da-colecao.md), já
ajustado no esmiuçamento). `TIMEOUT_ESPERA_MS` (~5s, sem rede) ficou intocado,
fora do escopo.

Além das constantes e do JSDoc de `src/lib/gravacaoAgregada.js`, ajustei os
temporizadores falsos de todos os testes que disparavam a gravação agregada
(unitários de `gravacaoAgregada` e de integração em `App.gravacao`,
`App.desfazer`, `App.apagarDados`; comentário em `App.copiar`) e os
`docs/*.md` de estado atual que citavam os valores
(`docs/modelo-memoria.md`, `docs/modelo-firebase.md`, `docs/arquitetura.md`).
Nenhuma divergência entre tarefa e código: o comportamento atual confere com
o pedido.

## Discovery
- Código:
  - `src/lib/gravacaoAgregada.js` define `DEBOUNCE_MS = 2000` e
    `TETO_MS = 10000` (linhas 24-25); `TIMEOUT_ESPERA_MS = 5000` fica
    intocado (fora do escopo). O JSDoc do módulo (linhas 8-9) e o de
    `registrarAjuste` (linhas 119-120) citavam ~2s/~10s e acompanharam.
  - `src/lib/gravacaoAgregada.test.js` fixava os valores com temporizador
    falso: avanços de 2000 para o debounce (linhas 35, 57, 100, 304), a
    rajada do teto em 9×1000 ms (linhas 43-51) e avanços de 15000 para
    "além do teto" (linhas 163, 279).
  - Testes de integração que avançam o temporizador falso para disparar a
    gravação agregada: `src/App.gravacao.test.jsx` (muitos
    `advanceTimersByTimeAsync(2000)`, a rajada do teto em 9×1000, o aviso de
    espera em `debounce(2s)+timeout(5s)=7000`), `src/App.desfazer.test.jsx`
    (linha 251) e `src/App.apagarDados.test.jsx` (linha 267, avanço de
    20000 com comentário "debounce (2s) ou o teto (10s)"). `App.copiar.test.jsx`
    só citava "debounce real de 2s" num comentário.
  - Comportamento atual confere com a tarefa. Impacto não listado em
    "Arquivos impactados": os testes de integração acima e os `docs/*.md` de
    estado atual — o critério "nenhum teste assume os valores antigos" e o
    § Documentação viva os alcançam.
- Documentação:
  - Li o [MDR 0003](../../../model-dr/0003-gravacao-agregada-da-colecao.md):
    "os valores numéricos (debounce, teto de espera) são pontos de partida,
    ajustáveis sem novo MDR", e a Decisão já diz ~4s/~20s; o Histórico
    registra a mudança e cita esta tarefa. É o lastro dos novos valores.
  - `docs/modelo-memoria.md` e `docs/modelo-firebase.md` ainda descreviam
    ~2s/~10s; `docs/arquitetura.md` § Pontos em aberto citava os valores
    aceitos na Tarefa 0007-0003 — os três passaram a refletir ~4s/~20s.
  - `docs/idr/0029` e `docs/model-dr/0005` também citam ~2s/~10s, mas são
    registros de decisão cujo dono do número é o MDR 0003; não foram
    alterados na execução (ver Observações).

## Plano da alteração
1. `src/lib/gravacaoAgregada.js` — `DEBOUNCE_MS` 2000→4000, `TETO_MS`
   10000→20000; JSDoc do módulo e de `registrarAjuste` para ~4s/~20s
   (citando o MDR 0003). `TIMEOUT_ESPERA_MS` não muda.
2. `src/lib/gravacaoAgregada.test.js` — avanços de debounce 2000→4000; a
   rajada do teto passa a 19×1000 ms e mais 1000; os avanços de 15000→25000
   para continuarem além do novo teto; o teste do debounce ganha a fronteira
   (3999 sem gravar, +1 grava).
3. `src/App.gravacao.test.jsx` — avanços de debounce 2000→4000; a rajada do
   teto a 19×1000 + 1000; o aviso de espera de 7000→9000
   (4000 de debounce + 5000 de timeout); comentários.
4. `src/App.desfazer.test.jsx` — avanço de 2000→4000 e comentário.
5. `src/App.apagarDados.test.jsx` — avanço de 20000→30000 (além do novo
   teto) e comentário ~4s/~20s.
6. `src/App.copiar.test.jsx` — comentário "debounce real de 2s" → "~4s".
7. `docs/modelo-memoria.md`, `docs/modelo-firebase.md` e `docs/arquitetura.md`
   § Pontos em aberto — valores para ~4s/~20s, com o lastro do
   [MDR 0003](../../../model-dr/0003-gravacao-agregada-da-colecao.md).
8. Status da tarefa e da linha no README, e este log no mesmo commit.
- Verificação prevista:
  - critério 1 → `gravacaoAgregada.test.js` "uma rajada de ajustes gera uma
    única escrita, depois do debounce" com a fronteira de 3999/+1;
  - critério 2 → `gravacaoAgregada.test.js` "atividade contínua grava ao
    atingir o teto" com 19×1000 + 1000 e "nada gravado" aos 19s;
  - critério 3 → busca por 2000/10000/2s/10s nos testes da área;
  - lint/test/build.
- Riscos: um avanço exatamente igual ao novo teto (20000) fica na borda e
  pode não disparar o timer; por isso o teste de descarte avança 30000.
- Desvios: nenhum.

## Decisões tomadas
- Atualizar os `docs/*.md` de estado atual (`modelo-memoria.md`,
  `modelo-firebase.md`, `arquitetura.md`) que citavam os valores — não estão
  em "Arquivos impactados", mas o guia (§ Documentação viva) os alcança e o
  lastro já existe (MDR 0003, atualizado no esmiuçamento). Nível 1.
- Deixar intocadas as menções a ~2s/~10s em `docs/model-dr/0005` e
  `docs/idr/0029`: são registros de decisão, e o dono do valor é o MDR 0003;
  alterá-los na execução seria mexer em decisão documentada sem previsão do
  planejamento. Registrado nas observações do relatório. Nível 1.
- Denominador do avanço além do teto (`App.apagarDados.test.jsx`): 30000 em
  vez de 20000, que fica na borda do novo teto. Nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — exit 0, sem avisos nem erros.

`npm run test` — 50 arquivos, 659 testes, todos passando (mesma contagem de
antes; nenhum teste novo, só temporizadores ajustados). Trecho final:

```
 Test Files  50 passed (50)
      Tests  659 passed (659)
```

Recorte focado nos três arquivos mais atingidos
(`npx vitest run src/lib/gravacaoAgregada.test.js src/App.gravacao.test.jsx
src/App.desfazer.test.jsx`): 54 testes, todos passando.

`npm run build` — 146 módulos, "✓ built in 730ms"; o aviso de chunk acima de
500 kB é pré-existente.

`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

Busca pelos valores antigos nos testes da área
(`grep "2000\|10000\|debounce de 2s\|debounce (2s)\|teto (10s)\|~2s\|~10s\|i < 9"`
em `src/lib/gravacaoAgregada.test.js` e nos `App.*.test.jsx` afetados) — sem
resultados.

## Critérios de aceite
- [x] Uma gravação dispara ~4s após o último ajuste, não antes — coberto por
      teste com temporizador falso —
      `src/lib/gravacaoAgregada.test.js`, "uma rajada de ajustes gera uma
      única escrita, depois do debounce": aos 3999 ms após o último ajuste
      `gravar` ainda não foi chamado; no +1 ms, exatamente 4000, é chamado
      uma vez.
- [x] Em rajada contínua, uma gravação dispara no máximo ~20s após o primeiro
      ajuste da rajada — coberto por teste —
      `src/lib/gravacaoAgregada.test.js`, "atividade contínua grava ao
      atingir o teto, sem esperar a rajada acabar": 19 ajustes a cada 1000 ms
      renovam o debounce de 4s e nada é gravado; o +1000 ms completa os 20s e
      dispara uma gravação.
- [x] Nenhum teste da suíte assume os valores antigos (2000ms/10000ms) —
      busca sem resultados nos testes da área (recorte acima); o recorte dos
      54 testes da área e a suíte inteira (659) passam com 4000/20000.

## Arquivos alterados
- `src/lib/gravacaoAgregada.js` — `DEBOUNCE_MS` 4000, `TETO_MS` 20000 e
  JSDoc (~4s/~20s, MDR 0003).
- `src/lib/gravacaoAgregada.test.js` — temporizadores para 4000/20000,
  fronteira do debounce, rajada do teto com 19 iterações e avanços de 25000.
- `src/App.gravacao.test.jsx` — temporizadores para 4000/20000, rajada com 19
  iterações e aviso de espera em 9000.
- `src/App.desfazer.test.jsx` — avanço 4000 e comentário.
- `src/App.apagarDados.test.jsx` — avanço 30000 e comentário.
- `src/App.copiar.test.jsx` — comentário do debounce.
- `docs/modelo-memoria.md` — valores do debounce/teto (~4s/~20s).
- `docs/modelo-firebase.md` — valores na gravação agregada e na tabela de
  custos.
- `docs/arquitetura.md` — § Pontos em aberto, valores e nota do esmiuçamento.
- `docs/plano/0033-.../0005-debounce-e-teto-de-gravacao-maiores.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0033-.../logs/0005-log-debounce-e-teto-de-gravacao-maiores.md` —
  este log.
