<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0008-0005]: corrige as regras da atestação sobre documento já existente

## Status
Concluída

## Origem
Achado em uso: ao testar o preview deploy do PR da Fase 8 (PR #24) com uma
conta que já tinha `contagens`/`updatedAt` gravados de sessões anteriores, o
primeiro login mostrou "Falha ao gravar a atestação — toque para detalhes /
Missing or insufficient permissions." Não é tarefa planejada em
`docs/plano/README.md` — é correção de um bug introduzido pela Tarefa
0008-0003, encontrado depois dela ter sido dada como concluída.

## Documentos de referência (ler antes de implementar)
- `firestore.rules` — a regra `allow create, update` combinada da Tarefa 0005-0001
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` — o que as regras conseguem validar no mapa
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — `atestadoEm` gravado sem `updatedAt` junto
- `src/lib/colecaoRemota.js` — `gravarAtestacao`, que grava via `setDoc(..., { merge: true })`

## Objetivo
Corrigir a regra de segurança do Firestore para aceitar a gravação da
atestação (`gravarAtestacao`) sobre um documento que já tem `contagens` e
`updatedAt` — o caso comum de qualquer conta que já ajustou alguma
figurinha antes de atestar, não só o caso de conta totalmente nova que os
testes do emulador cobriam.

## Diagnóstico
`gravarAtestacao` grava com `setDoc(ref, { atestadoEm: serverTimestamp() },
{ merge: true })` — um `update` quando o documento já existe. Nas regras do
Firestore, `request.resource.data` num `update` é o **documento resultante
inteiro** depois do merge, não só os campos escritos nesta operação
específica: campos antigos preservados pelo merge aparecem junto dos novos.

A regra original (Tarefa 0005-0001) checava `"campo" in
request.resource.data` — "o campo está no resultado?" — quando a intenção
sempre foi "esta operação escreveu o campo?". Para uma conta com
`updatedAt` antigo (preservado pelo merge, não reescrito nesta operação), a
cláusula `request.resource.data.updatedAt == request.time` falhava: o valor
preservado nunca é `request.time` desta requisição. Resultado:
`PERMISSION_DENIED`, exposto ao cliente como "Missing or insufficient
permissions" (ver `mensagemDeErro`).

Reproduzido no emulador antes da correção (removido depois, substituído
pelos testes permanentes abaixo): semear um documento com `contagens` e
`updatedAt`, então `setDoc(..., { atestadoEm: serverTimestamp() }, { merge:
true })` — `assertFails`, confirmando o diagnóstico.

## Escopo e instruções de implementação
1. Separar a regra combinada `allow create, update` em duas: `allow
   create` (mantém a validação atual, correta — no `create`,
   `request.resource.data` já é só o que está sendo escrito, sem merge com
   nada) e `allow update` (nova validação, baseada em
   `request.resource.data.diff(resource.data).affectedKeys()` em vez de
   `"campo" in request.resource.data`).
2. `hasOnly` dos três campos permitidos continua sobre o documento
   **inteiro** nas duas regras — nenhum campo estranho (ex.: `teamName`
   remanescente) pode sobreviver a um `update`, escrito nesta operação ou
   não.
3. Testes no emulador cobrindo o caso que faltava: atestação via merge
   sobre documento com `contagens`/`updatedAt` preexistentes (sucesso,
   preservando os valores antigos); gravação normal de `contagens` +
   `updatedAt` sobre documento existente (sucesso, sem regressão);
   `updatedAt` forjado e `contagens` sem `updatedAt` também no `update`,
   não só no `create` (falha, sem regressão).

**Fora do escopo**: qualquer mudança em `gravarAtestacao` ou no fluxo de
`App.jsx` — o bug é só nas regras; o cliente já grava corretamente. A
migração do `teamName` continua exigindo uma gravação de `contagens` para
acontecer (não é afetada, nem alarga o escopo desta correção).

## Decisões já tomadas (não reabrir)
- `atestadoEm` gravado sem `updatedAt` junto — ver `docs/adr/0008-*` § Decisão. A correção não muda o que o cliente grava, só o que as regras aceitam.
- `hasOnly` dos três campos — ver `docs/tdr/0009-*`. Mantido, agora sobre o documento inteiro nas duas regras.

## Impedimentos
Nenhum nível 3: a correção não contradiz nenhum requisito, não muda
configuração pública, não tem custo de cota/plano e é reversível (é regra
de validação, não dado gravado).

## Arquivos impactados
- `firestore.rules` — modificado (regra combinada dividida em `create`/`update`, `update` usa `diff().affectedKeys()`)
- `firestore.rules.test.js` — modificado (4 testes novos cobrindo o caso que faltava)

## Critérios de aceite
- [x] Gravar `atestadoEm` via merge sobre um documento com `contagens`/`updatedAt` preexistentes é aceito pelas regras
- [x] Os valores antigos de `contagens`/`updatedAt` são preservados, não revalidados nem exigidos de novo
- [x] Nenhuma regressão nos testes de regras já existentes (isolamento, validação de valores, migração do `teamName`, limite do mapa)
- [x] `npm run test:rules` verde (JDK 21+)

## Validação
`npm run lint && npm run test && npm run build && npm run test:rules`
(JDK 21+ necessário para o emulador — ver `AGENTS.md` § Como rodar).
