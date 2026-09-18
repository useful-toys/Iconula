<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0001]: schema do aceite nas regras

## Status
Pendente

## Objetivo

Publicar os três campos de aceite nas regras do Firestore antes do
código que os escreve. Sem isso, o `hasOnly` rejeita a gravação inteira
com `permission-denied`.

## Documentos de referência

- `docs/model-dr/0009-campos-de-aceite-dos-textos.md` § Decisão — nome,
  tipo e limite de cada campo.
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` — por que cada cláusula
  pergunta "esta operação escreveu este campo?" via `affectedKeys()`.
- `docs/modelo-firebase.md` § Formato do documento — a lista de campos
  que passa a ter sete entradas.

## Padrões e convenções aplicáveis

- `create` e `update` são regras separadas: no `update` com `merge`,
  `request.resource.data` é o documento resultante inteiro.
- Toda cláusula sobre um campo fica sob guarda de campo ausente, senão a
  regra erra em vez de negar.
- Regras sobem antes do código que as usa.

## Escopo e instruções de implementação

1. Em `firestore.rules`, incluir `termosVersao`, `politicaVersao` e
   `aceitoEm` nos dois `hasOnly` e acrescentar, para cada um, a cláusula
   de tipo sob a guarda de `affectedKeys()`, no mesmo formato já usado
   para `atestadoEm` e `linkAtivo`: string com limite de tamanho para as
   versões, timestamp para `aceitoEm`.
2. Em `firestore.rules.test.js`, acrescentar casos: grava o aceite
   sozinho sobre documento existente; grava o aceite junto da atestação
   no primeiro acesso; rejeita versão que não seja string; rejeita versão
   maior que o limite; rejeita campo estranho junto do aceite.
3. Atualizar `docs/modelo-firebase.md` § Formato do documento e suas
   regras de formato, descrevendo os três campos e citando o MDR 0009.

**Fora do escopo**: qualquer código de cliente (Tarefa 0032-0002); a
tela de reaceite (Tarefa 0032-0003).

## Decisões já tomadas (não reabrir)

- Os campos, seus tipos e a data ISO como versão — ver
  `docs/model-dr/0009-campos-de-aceite-dos-textos.md`.
- O aceite grava sem `updatedAt` — ver o mesmo registro e
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`.

## Arquivos impactados

- `firestore.rules` — modificar
- `firestore.rules.test.js` — modificar
- `docs/modelo-firebase.md` — modificar (§ Formato do documento)

## Critérios de aceite

- [ ] Os dois `hasOnly` listam os sete campos
- [ ] Cada campo novo tem cláusula de tipo sob guarda de
      `affectedKeys()`
- [ ] Existem casos cobrindo aceite sozinho, aceite com atestação,
      versão não-string, versão longa demais e campo estranho
- [ ] `docs/modelo-firebase.md` descreve os sete campos, citando o
      MDR 0009
- [ ] `npm run test:rules` verde

## Validação adicional

- `npm run test:rules` (exige JDK 21+) — obrigatório, a tarefa toca
  `firestore.rules`.
