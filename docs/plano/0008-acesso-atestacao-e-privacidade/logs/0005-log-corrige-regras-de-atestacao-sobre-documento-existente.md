<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0008-0005: corrige as regras da atestação sobre documento já existente

## Data
2026-09-11

## Resumo
Achado em uso: no preview deploy do PR #24 (Fase 8), o primeiro login com
uma conta que já tinha `contagens`/`updatedAt` (de sessões anteriores)
mostrou "Falha ao gravar a atestação — toque para detalhes / Missing or
insufficient permissions."

**Diagnóstico**: `gravarAtestacao` grava com `setDoc(ref, { atestadoEm:
serverTimestamp() }, { merge: true })`. Num `update` do Firestore,
`request.resource.data` nas regras de segurança é o documento **resultante
inteiro** após o merge — não só os campos escritos nesta operação. A regra
original (`allow create, update` combinada, da Tarefa 0005-0001) checava
`"campo" in request.resource.data` ("está no resultado?"), quando a
intenção sempre foi "esta operação escreveu o campo?". Para uma conta com
`updatedAt` antigo (preservado pelo merge, não reescrito), a cláusula
`request.resource.data.updatedAt == request.time` falhava — o valor
preservado nunca é o `request.time` desta requisição. `PERMISSION_DENIED`
no servidor, "Missing or insufficient permissions" no cliente.

Reproduzido no emulador antes de corrigir (semear documento com
`contagens`+`updatedAt`, gravar só `atestadoEm` via merge → `assertFails`),
confirmando o diagnóstico antes de qualquer mudança.

**Correção**: `firestore.rules` — a regra combinada virou duas:
- `allow create`: validação idêntica à anterior — no `create`,
  `request.resource.data` já é só o que está sendo escrito, sem merge com
  nada preexistente, então a checagem original sempre esteve certa aqui.
- `allow update`: mesma validação, mas cada cláusula pergunta "esta
  operação escreveu este campo?" (`request.resource.data.diff(resource
  .data).affectedKeys()`) em vez de "este campo está no documento
  resultante?". `hasOnly` dos três campos permitidos continua sobre o
  documento inteiro nas duas regras — nenhum campo estranho sobrevive a um
  `update`, escrito nesta operação ou não.

Nenhuma mudança no cliente (`colecaoRemota.js`, `App.jsx`): o bug era só
nas regras — o cliente já gravava exatamente como deveria.

## Decisões tomadas
Nenhuma decisão de nível 1. É correção de um bug de validação nas regras
(a distinção "campo escrito nesta operação" vs. "campo presente no
resultado" é uma correção técnica pontual do TDR 0009, não uma mudança de
arquitetura ou de schema) — não gera ADR/TDR/IDR novo. `docs/tdr/0009-*`
não precisou de atualização porque continua descrevendo corretamente o que
as regras conseguem validar; o defeito estava na aplicação daquela decisão
ao caso de `update` com merge, não na decisão em si.

## Impedimentos
Nenhum nível 3. A correção não contradiz requisito nenhum, não muda
configuração pública nem tem custo de cota, e é reversível.

Perguntei ao usuário se a correção deveria ir para produção como hotfix
manual (fora do fluxo normal de merge, já que regras só sobem no merge —
TDR 0008) ou esperar o merge do PR #24. Resposta: incluir a correção no
próprio PR #24, sem hotfix — fluxo normal.

## Validação
```
npm run lint && npm run test && npm run build && npm run test:rules
```
- `oxlint`: sem erros.
- `vitest run`: 28 arquivos de teste, 245 testes, todos passando (sem
  mudança no cliente, nenhum teste de componente/integração precisou de
  ajuste).
- `vite build`: build de produção concluído com sucesso.
- `npm run test:rules` (emulador, `JAVA_HOME` apontado para o Temurin
  21.0.9 já instalado, já que `java` no `PATH` deste ambiente é um JDK 8):
  **1 arquivo de teste, 28 testes, todos passando** — os 24 já existentes
  (nenhuma regressão: isolamento entre usuários, validação de valores nas
  contagens, campos e timestamps, migração do `teamName`, limite do mapa,
  caminhos não previstos) mais os 4 novos desta tarefa:
  - aceita `atestadoEm` via merge sobre documento com `contagens`/`updatedAt` preexistentes
  - preserva `contagens` e `updatedAt` ao gravar só a atestação
  - aceita gravação normal de `contagens`+`updatedAt` sobre documento já existente
  - nega `updatedAt` forjado num update que também grava `contagens`
  - nega `contagens` sem `updatedAt` também no update, não só no create

Antes da correção, o teste de reprodução (removido depois, substituído
pelos permanentes acima) falhava com exatamente o erro relatado:
`FirebaseError: 7 PERMISSION_DENIED`.

**Não realizado**: deploy manual das regras corrigidas para produção — o
usuário optou por deixar a correção seguir o fluxo normal (merge do PR
#24), não um hotfix. Até lá, uma conta com `contagens`/`updatedAt`
existentes continua vendo a falha ao tentar atestar no preview deploy —
o app permanece usável (a falha libera o app mesmo assim, IDR 0036), só a
atestação não persiste e tenta de novo no login seguinte.

## Arquivos alterados
- `firestore.rules` — regra combinada dividida em `create`/`update`; `update` usa `diff().affectedKeys()`
- `firestore.rules.test.js` — 4 testes novos cobrindo o caso corrigido
- `docs/plano/0008-acesso-atestacao-e-privacidade/0005-corrige-regras-de-atestacao-sobre-documento-existente.md` — tarefa criada e concluída
- `docs/plano/README.md` — linha da tarefa 0008-0005 acrescentada à tabela da Fase 8
- `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0005-log-corrige-regras-de-atestacao-sobre-documento-existente.md` — este log
