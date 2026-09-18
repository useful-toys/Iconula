<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0001: regra de exclusão do próprio documento

## Data
2026-09-17

## Resumo
Publica a autorização de `delete` em `users/{uid}` para o dono
autenticado, antes de existir código de cliente que a use. Antes, o
`delete` era negado por padrão e o comentário das regras afirmava que
não era operação do app; agora há uma regra explícita, restrita a
`request.auth.uid == userId`, sem inspecionar `resource.data`. Os testes
do emulador invertem o caso que provava a negação e ganham os casos de
intruso, anônimo e anônimo com link ativo. `docs/modelo-firebase.md`
passa a descrever a regra nova e a linha de apagamento na tabela de
operações, citando o TDR 0027.

## Discovery
- Código: `firestore.rules` tem `allow get`, `allow create` e
  `allow update` dentro de `match /users/{userId}`; não há `delete` (negado
  por padrão). `firestore.rules.test.js` cobre o isolamento, a validação
  do mapa e o link do catálogo; já importa `deleteDoc` e tem os helpers
  `semearDocumentoDoDono`, `comoDono`, `comoIntruso` e `comoAnonimo`. O
  comportamento atual confere com a tarefa: existe um caso "nega apagar o
  próprio documento" a inverter. Nada fora de "Arquivos impactados"
  depende desta mudança — o cliente só passará a apagar nas Tarefas
  0031-0002 e 0031-0003.
- Documentação: lidos o TDR 0027 (decisão e ordem da exclusão), o
  TDR 0009 (limites da linguagem de regras — apagar não escreve conteúdo,
  logo não há o que validar) e `docs/modelo-firebase.md` § Regras de
  segurança e § Operações sobre o documento. As referências bastaram.

## Plano da alteração
1. `firestore.rules` — acrescentar `allow delete: if request.auth != null
   && request.auth.uid == userId;` ao final do bloco de `users/{userId}`,
   com a justificativa (LGPD art. 18, VI; TDR 0027) e a nota de que o link
   ativo libera `get`, nunca `delete`; substituir o comentário que afirma
   que `delete` não é operação do app.
2. `firestore.rules.test.js` — inverter "nega apagar o próprio documento"
   para "o dono apaga o próprio documento" (`assertSucceeds`) e
   acrescentar três casos negados: intruso, anônimo e anônimo com
   `linkAtivo == true`.
3. `docs/modelo-firebase.md` — trocar a linha "`delete` segue negado" pela
   descrição da regra nova, citando o TDR 0027; acrescentar a linha do
   apagamento à tabela § Operações sobre o documento.
- Verificação prevista:
  - regra de `delete` restrita ao dono, sem `resource.data` → leitura do
    arquivo (`firestore.rules`);
  - caso invertido e casos novos → `firestore.rules.test.js`;
  - `modelo-firebase.md` sem afirmar negação e citando o TDR 0027 → busca
    no arquivo;
  - `npm run test:rules` verde → execução com JDK 21+.
- Riscos: nenhum de comportamento corrente (a regra só autoriza uma
  operação que hoje é negada); o risco maior é ambiental — o `java` do
  `PATH` é o 8 e o emulador exige 21+, então a execução aponta para o
  Temurin 21 instalado.
- Desvios: nenhum

## Decisões tomadas
- Posição e redação do comentário da regra de `delete` (substituído o
  comentário de `create`/`update` e justificado junto da própria regra) —
  decisão de nível 1, sem registro.

## Impedimentos
Nenhum

## Setup realizado
Nenhum na execução da tarefa. Publicação posterior das regras em produção,
pedida pelo humano com o PR da fase ainda aberto:

### 1. Publicar as regras da fase no projeto `iconula`
- Ambiente: Firebase (produção)
- Aprovação do humano: 2026-09-18 — autorizou exatamente
  `firebase deploy --only firestore:rules` no projeto `iconula`.
- Comando executado:
  ```
  firebase deploy --only firestore:rules
  ```
- Saída relevante: `rules file firestore.rules compiled successfully`;
  `released rules firestore.rules to cloud.firestore`; `Deploy complete!`
- Verificação: ruleset liberado no console do projeto
  (https://console.firebase.google.com/project/iconula/overview).
- Como reverter: `firebase deploy --only firestore:rules` a partir da
  `main` (`d2b283a`, sem o `allow delete`) republica o ruleset anterior.
- Documento atualizado: nenhum — a regra é o estado que a fase entrega no
  merge; `docs/setup-firebase.md` § Cloud Firestore já está defasado de
  antes desta fase (observação da Tarefa 0031-0006) e não foi tocado.
- Nota: fora do fluxo padrão do guia (as regras sobem no merge, DDR 0004);
  o humano autorizou antecipar para produção com o PR #84 aberto.

## Validação
- `npm run lint` — `Found 0 warnings and 0 errors.` (89 arquivos)
- `npm run test` — `Test Files 43 passed (43)`, `Tests 586 passed (586)`
- `npm run build` — `✓ built in 712ms` (aviso pré-existente de chunk > 500 kB, sem relação com a tarefa)
- `npm run test:rules` (JDK 21 — Temurin 21.0.11, apontado por `JAVA_HOME`/`PATH`) —
  `Test Files 1 passed (1)`, `Tests 42 passed (42)`; os `PERMISSION_DENIED`
  no stderr são as negações esperadas pelos testes.

## Critérios de aceite
- [x] `firestore.rules` tem uma regra de `delete` restrita ao dono
      autenticado, sem cláusula sobre `resource.data` —
      `firestore.rules:184`: `allow delete: if request.auth != null &&
      request.auth.uid == userId;`
- [x] O caso "nega apagar o próprio documento" não existe mais; existe um
      que afirma o sucesso do dono —
      `firestore.rules.test.js:151` (`o dono apaga o próprio documento`,
      `assertSucceeds`)
- [x] Existem casos cobrindo intruso, anônimo e anônimo com
      `linkAtivo == true`, todos negados — `firestore.rules.test.js:157`,
      `:163` e `:169`
- [x] `docs/modelo-firebase.md` não afirma mais que `delete` é negado, e
      cita o TDR 0027 — `docs/modelo-firebase.md:107` (busca por "segue
      negado"/"saiu do MVP" não retorna nada para `delete`) e a linha nova
      da tabela em `:85`
- [x] `npm run test:rules` verde — 42 testes passando

## Arquivos alterados
- `firestore.rules` — `allow delete` para o dono autenticado e comentário
  novo no lugar do que dizia que `delete` não era operação do app
- `firestore.rules.test.js` — caso do dono invertido para `assertSucceeds`
  e três casos negados (intruso, anônimo, anônimo com link ativo)
- `docs/modelo-firebase.md` — § Regras de segurança descreve a regra nova
  citando o TDR 0027; § Operações sobre o documento ganha a linha do
  apagamento
- `docs/plano/0031-exclusao-de-dados-e-conformidade-da-politica/0001-regra-de-exclusao-do-proprio-documento.md`
  — status para `Concluída`
- `docs/plano/README.md` — status da tarefa acompanha
- `docs/plano/0031-exclusao-de-dados-e-conformidade-da-politica/logs/0001-log-regra-de-exclusao-do-proprio-documento.md`
  — este log

