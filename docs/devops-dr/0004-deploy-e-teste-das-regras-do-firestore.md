<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0004: Deploy e teste das regras do Firestore

## Status

Aceito (migra TDR 0008)

## Contexto

- Com a persistência por usuário, duas perguntas: como garantir
  isolamento entre usuários (a autorização precisa ser avaliada no
  servidor) e como publicar as regras (a action de Hosting só cobre
  Hosting).
- `cleanup_preview` rodava `npx --yes firebase-tools@latest` com a
  chave da service account no ambiente — risco de cadeia de suprimentos.

## Decisão

### Regras: isolamento e validação de schema

- `allow get` restrito ao dono do documento (`request.auth.uid == userId`)
- Sem `list`, sem `delete`
- `create` e `update` validam schema com `hasOnly`, tipos e tamanhos
- `updatedAt == request.time` (carimbo do servidor, nunca do cliente)
- Regras separadas para `create` e `update` porque `merge: true` faz
  `request.resource.data` ser o documento resultante inteiro, não só os
  campos escritos nesta operação — a distinção usa
  `diff(resource.data).affectedKeys()`
- Detalhes da validação do mapa esparso no
  [TDR 0009](../tdr/0009-validacao-do-mapa-nas-regras.md) (permanece como TDR — é lógica de validação, não pipeline)

### Testes no emulador

- `firestore.rules.test.js` com `@firebase/rules-unit-testing`
- Projeto `demo-iconula` (prefixo `demo-` = offline, sem credencial) —
  roda no `ci.yml`, inclusive para PR de fork
- Config separada (`vitest.rules.config.js`, `environment: "node"`)
- Script único `npm run test:rules`, idêntico local e no CI
- `firebase.json` tem bloco `emulators.firestore` na porta 8080, com
  `emulators.ui.enabled: false` — a UI do emulador não é necessária para
  testes automatizados; desabilitá-la reduz o footprint do emulador e
  evita abrir porta extra (4000) sem uso.

### Deploy das regras: step próprio no merge

- **Antes do deploy de Hosting**: se as regras falharem, o cliente novo
  nem chega a subir
- **Só no merge**, não em PR: regras são globais do projeto, sem canal
  de preview
- Versão do `firebase-tools` fixada (`@15.29.0`), corrigindo o `@latest`
  pré-existente
- Chave em `$RUNNER_TEMP`, apagada em step `if: always()`
- `permissions: contents: read` no workflow de merge

### IAM: mínimo necessário

- `roles/firebaserules.admin`: exatamente o que `firebase deploy
  --only firestore:rules` executa
- `roles/firebase.viewer` (já existente): leitura
- `roles/datastore.owner` descartado: daria acesso ao documento de
  todos os usuários para uma tarefa que não toca em dado nenhum

## Consequências

- Isolamento entre usuários é testado — regressão em `firestore.rules`
  quebra o CI
- Regras não têm canal de preview: preview de PR roda cliente novo
  contra regras antigas; para validar ponta a ponta, publicar regras à
  mão antes
- `hasOnly` acopla schema a deploy de regras: campo novo exige regras
  antes ou junto com o código
- `npm run test:rules` precisa de JDK 21+ (emulador na JVM)
- `firebase deploy` sem `--only` em máquina de desenvolvimento passa a
  publicar regras junto com Hosting

## Alternativas consideradas

- **Deploy manual das regras**: rejeitado — nada impediria divergência
  silenciosa entre repositório e publicado
- **`firebase-tools` como `devDependency`**: rejeitado pelo custo no
  `npm ci` dos três workflows
- **OIDC em vez de chave JSON**: evolução natural, mudança separada
- **`roles/datastore.owner`**: descartado — princípio do menor privilégio
- **Step `--dry-run` no workflow de PR**: não incluído por incerteza
  sobre exigência de permissão de escrita
