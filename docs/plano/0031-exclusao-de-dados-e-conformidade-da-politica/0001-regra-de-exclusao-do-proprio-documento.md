<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0001]: regra de exclusão do próprio documento

## Status
Pendente

## Objetivo

Publicar a autorização de `delete` em `users/{uid}` para o dono, com
testes no emulador, antes de qualquer código que a use. Sem ela, o
comando de apagar dados da Tarefa 0031-0003 falharia com
`permission-denied`.

## Documentos de referência

- `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md` § Decisão —
  a cláusula da regra e por que ela não valida `resource.data`.
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` — o que a linguagem de
  regras consegue e não consegue expressar.
- `docs/modelo-firebase.md` § Regras de segurança — o texto que descreve
  `delete` como negado e precisa passar a descrever a regra nova.

## Padrões e convenções aplicáveis

- As regras sobem antes ou junto do código que as usa — `hasOnly` acopla
  schema a deploy (`firestore.rules`, comentário do bloco de validação,
  e `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md`).
- `allow get` — nunca `read` — continua valendo: `list` segue negado.
- Nenhuma regra catch-all: o resto é negado por padrão, de propósito.

## Escopo e instruções de implementação

1. Em `firestore.rules`, dentro do `match /users/{userId}` já existente,
   acrescentar uma regra de `delete` autorizando apenas o dono
   autenticado, conforme o TDR 0027. A regra não inspeciona
   `resource.data`.
2. Substituir o comentário que hoje afirma que `delete` não é operação
   do app pela justificativa nova, citando o direito de eliminação
   (LGPD art. 18, VI) e o TDR 0027.
3. Em `firestore.rules.test.js`, inverter o caso existente que afirma
   que apagar o próprio documento é negado — passa a afirmar que o dono
   apaga —, ajustando também a frase do `it`.
4. Acrescentar casos: intruso autenticado não apaga documento alheio;
   requisição anônima não apaga; requisição anônima não apaga documento
   com `linkAtivo == true` (o link libera leitura, nunca exclusão).
   Reusar os helpers `semearDocumentoDoDono`, `comoDono`, `comoIntruso`
   e `comoAnonimo`.
5. Atualizar `docs/modelo-firebase.md` § Regras de segurança: a linha
   que diz que `delete` segue negado e que "apagar meus dados" saiu do
   MVP passa a descrever a regra nova e a citar o TDR 0027; a tabela
   § Operações sobre o documento ganha a linha do apagamento.

**Fora do escopo**: qualquer código de cliente (Tarefas 0031-0002 e
0031-0003); os campos de aceite e seu `hasOnly` (Fase 0032); o texto da
política (Tarefa 0031-0005).

## Decisões já tomadas (não reabrir)

- `allow delete` só para o dono, sem validar conteúdo, e o link ativo
  não autoriza exclusão — ver
  `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md`.
- A exclusão dentro do app é requisito vigente — ver
  `docs/requisitos.md` § Acesso e
  `docs/idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md`.

## Arquivos impactados

- `firestore.rules` — modificar
- `firestore.rules.test.js` — modificar
- `docs/modelo-firebase.md` — modificar (§ Regras de segurança,
  § Operações sobre o documento)

## Critérios de aceite

- [ ] `firestore.rules` tem uma regra de `delete` restrita ao dono
      autenticado, sem cláusula sobre `resource.data`
- [ ] O caso "nega apagar o próprio documento" não existe mais; existe
      um que afirma o sucesso do dono
- [ ] Existem casos cobrindo intruso, anônimo e anônimo com
      `linkAtivo == true`, todos negados
- [ ] `docs/modelo-firebase.md` não afirma mais que `delete` é negado, e
      cita o TDR 0027
- [ ] `npm run test:rules` verde

## Validação adicional

- `npm run test:rules` (exige JDK 21+) — obrigatório, a tarefa toca
  `firestore.rules`.
