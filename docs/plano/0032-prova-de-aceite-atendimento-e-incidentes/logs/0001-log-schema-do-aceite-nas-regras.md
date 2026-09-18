<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0001: schema do aceite nas regras

## Data
2026-09-18

## Resumo

Publica os três campos de aceite (`termosVersao`, `politicaVersao` e
`aceitoEm`) nas regras do Firestore antes do código que os escreve. Antes,
os dois `hasOnly` listavam quatro campos e qualquer `setDoc` do aceite era
recusado inteiro com `permission-denied`; agora listam sete e cada campo
novo tem cláusula de tipo sob a guarda de `affectedKeys()`. Os testes das
regras ganham cinco casos e `docs/modelo-firebase.md` passa a descrever o
schema de sete campos.

## Discovery

- Código: `firestore.rules` tem `allow create` (linhas 77–134) e
  `allow update` (143–177) separadas, cada uma com `hasOnly` de quatro
  campos (`contagens`, `updatedAt`, `atestadoEm`, `linkAtivo`). O
  `update` usa `diff(resource.data).affectedKeys()` por cláusula
  (Tarefa 0008-0005); o `create` pergunta direto
  `"X" in request.resource.data`, porque ali `request.resource.data` já é
  só o que está sendo escrito. `firestore.rules.test.js` segue o padrão
  de `describe` por assunto, com `semearDocumentoDoDono`, `comoDono`,
  `assertSucceeds`/`assertFails`. Comportamento atual confere com a
  tarefa: os quatro campos estão listados e nada de aceite existe.
  Nenhum impacto fora de "Arquivos impactados" — nenhum código de cliente
  escreve os campos ainda.
- Documentação: reli o MDR 0009 (§ Decisão e § Consequências — os três
  campos, tipos e limite de 10 caracteres) e o TDR 0009 (§ Decisão — por
  que cada cláusula pergunta se a operação escreveu o campo e por que toda
  cláusula fica sob guarda). Li também `docs/modelo-firebase.md` inteiro
  para achar todas as enumerações do schema: § Formato do documento e
  § Regras do formato (as pedidas) e § Regras de segurança (o `hasOnly` e
  a validação de tipo publicados, que ficariam desatualizados).

## Plano da alteração

1. `firestore.rules`: acrescentar `termosVersao`, `politicaVersao` e
   `aceitoEm` aos dois `hasOnly` e, para cada um, a cláusula de tipo sob
   guarda — as duas versões como `string` com `size() <= 10` (MDR 0009),
   `aceitoEm` como `timestamp`, no formato de `atestadoEm`/`linkAtivo`.
   Atualizar os comentários que dizem "quatro campos".
2. `firestore.rules.test.js`: novo `describe` do aceite com cinco casos —
   aceite sozinho sobre documento existente (update), aceite junto da
   atestação no primeiro acesso (create), versão não-string, versão acima
   de 10 caracteres e campo estranho junto do aceite; mais um caso de
   aceite junto das contagens num update.
3. `docs/modelo-firebase.md`: incluir os três campos no bloco do schema e
   nas regras do formato, trocar "os únicos campos são quatro" por sete,
   citando o MDR 0009; alinhar § Regras de segurança (o `hasOnly` e a
   linha de validação de tipo) para o documento não contradizer as regras
   publicadas.

- Verificação prevista: cada critério de aceite tem caso de teste do
  emulador ou leitura direta do arquivo/documento; `npm run test:rules`
  verde cobre os cinco casos e as regressões.
- Riscos: o `.size()` de string é válido na linguagem de regras; a guarda
  de campo ausente impede que a cláusula erre em vez de negar quando o
  aceite não é escrito.
- Desvios: nenhum.

## Decisões tomadas

- Limite das versões em 10 caracteres, como manda o MDR 0009 — sem
  decisão nova.
- Incluir § Regras de segurança do `modelo-firebase.md` no ajuste, além
  do § Formato do documento pedido: a seção enumera o `hasOnly` publicado
  e ficaria falsa. Nível 1 (documentação viva, sem mudar a decisão).

## Impedimentos

Nenhum.

## Setup realizado

### 1. Publicar as regras do aceite no projeto de produção

- Ambiente: Firebase (projeto `iconula`)
- Aprovação do humano: 2026-09-18 — "Publicar agora", confirmando a
  exceção ao fluxo do DDR 0004 para liberar o preview do PR #91.
- Comando executado:
  ```
  firebase deploy --only firestore:rules --project iconula
  ```
- Saída relevante:
  ```
  cloud.firestore: rules file firestore.rules compiled successfully
  firestore: released rules firestore.rules to cloud.firestore
  Deploy complete!
  ```
- Verificação: `--dry-run` anterior compilou sem erros; o deploy publicou
  o mesmo ruleset desta branch.
- Como reverter: republicar o ruleset da `main`
  (`firebase deploy --only firestore:rules --project iconula` a partir da
  raiz) ou rollback no Console › Firestore › Rules › histórico.
- Documento atualizado: não se aplica — o deploy de rotina e a reversão
  estão no DDR 0004; nenhuma configuração durável mudou (o merge publica
  o mesmo conteúdo).

## Validação

- `npm run lint`:
  ```
  > oxlint
  Found 0 warnings and 0 errors.
  Finished in 86ms on 98 files with 105 rules using 4 threads.
  ```
- `npm run test`: `Test Files 48 passed (48)` / `Tests 624 passed (624)`.
  Os avisos `An update to Avisos inside a test was not wrapped in act(...)`
  são pré-existentes e aparecem também na `main`.
- `npm run build`: `✓ built in 579ms`. O aviso de chunk > 500 kB é
  pré-existente.
- `npm run test:rules` (com o JDK 21 em `PATH`, ver nota abaixo):
  ```
  Test Files  1 passed (1)
       Tests  48 passed (48)
  ```
  São 42 da suíte anterior mais os 6 casos novos do aceite versionado.

Nota de ambiente: o `java` do `PATH` desta máquina é o 1.8 e o emulador
recusou com "firebase-tools no longer supports Java version before 21". O
JDK 21 do `JAVA_HOME` (`C:\Users\dffwe\.jdks\temurin-21.0.9`) foi
prependido ao `PATH` só para o comando — falha de ambiente, não de regra.
Nenhum setup de repositório ou de infraestrutura foi feito.

## Critérios de aceite

- [x] Os dois `hasOnly` listam os sete campos — `firestore.rules:81-89`
      (`create`) e `firestore.rules:164-172` (`update`).
- [x] Cada campo novo tem cláusula de tipo sob guarda de `affectedKeys()`
      — `firestore.rules:144-153` (`create`) e `:205-212` (`update`);
      versões `is string` com `size() <= 10` (MDR 0009) e `aceitoEm is
      timestamp`.
- [x] Existem casos cobrindo aceite sozinho, aceite com atestação, versão
      não-string, versão longa demais e campo estranho —
      `firestore.rules.test.js:402-500`, describe "aceite versionado":
      seis casos, além do aceite junto das contagens.
- [x] `docs/modelo-firebase.md` descreve os sete campos, citando o
      MDR 0009 — bloco do schema (`modelo-firebase.md:27-30`), regras do
      formato (`:42-44` e `:46`) e § Regras de segurança (`:107` e `:109`).
- [x] `npm run test:rules` verde — 48 testes, 1 arquivo, acima.

## Arquivos alterados

- `firestore.rules` — os dois `hasOnly` passam a listar sete campos;
  cláusulas de tipo de `termosVersao`, `politicaVersao` e `aceitoEm` sob
  guarda; comentário do schema atualizado.
- `firestore.rules.test.js` — novo `describe` "aceite versionado" com
  seis casos.
- `docs/modelo-firebase.md` — sete campos no bloco do schema, nas regras
  do formato e em § Regras de segurança, citando o MDR 0009.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0001-schema-do-aceite-nas-regras.md`
  — status para `Concluída`.
- `docs/plano/README.md` — linha da tarefa e fase 32 para `Concluída` /
  `Em andamento`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0001-log-schema-do-aceite-nas-regras.md`
  — este log (novo).
