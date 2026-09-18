<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0033-0005]: Debounce e teto de gravação maiores

## Status
Concluída

## Objetivo
Aumentar o debounce da gravação agregada de ~2s para ~4s e o teto de espera
em rajada contínua de ~10s para ~20s, para capturar mais eventos do usuário
por gravação e reduzir o número de chamadas ao Firestore.

## Documentos de referência
- `docs/model-dr/0003-gravacao-agregada-da-colecao.md` § Decisão › Gravação
  agregada — os novos valores (~4s / ~20s)
- `docs/requisitos.md` § Estado da sincronização — já reflete "~4s" (PR do
  esmiuçamento)
- `src/lib/gravacaoAgregada.js` § `DEBOUNCE_MS`/`TETO_MS` — constantes atuais
  (2000/10000)
- `src/lib/gravacaoAgregada.test.js` — testes que hoje fixam os valores
  atuais com temporizador falso

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `gravacaoAgregada.js`: `DEBOUNCE_MS` de `2000` para `4000`; `TETO_MS`
   de `10000` para `20000`. `TIMEOUT_ESPERA_MS` (~5s, sem rede) não muda —
   fora do pedido e do MDR 0003 atualizado.
2. Em `gravacaoAgregada.test.js`: ajustar os avanços de temporizador falso
   que hoje pressupõem 2000ms/10000ms para os novos valores.

**Fora do escopo**: mudar `TIMEOUT_ESPERA_MS`; qualquer outro parâmetro de
persistência.

## Decisões já tomadas (não reabrir)
- Debounce ~4s, teto ~20s, mesma proporção 1:5 — ver
  `docs/model-dr/0003-gravacao-agregada-da-colecao.md`

## Arquivos impactados
- `src/lib/gravacaoAgregada.js` — modificar (constantes)
- `src/lib/gravacaoAgregada.test.js` — modificar (temporizadores)

## Critérios de aceite
- [ ] Uma gravação dispara ~4s após o último ajuste, não antes — coberto
      por teste com temporizador falso
- [ ] Em rajada contínua, uma gravação dispara no máximo ~20s após o
      primeiro ajuste da rajada — coberto por teste
- [ ] Nenhum teste da suíte assume os valores antigos (2000ms/10000ms)

## Validação adicional
Nenhuma além de lint, test e build.
