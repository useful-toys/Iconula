<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0001: regras do Firestore para o link do catálogo

## Data
2026-09-16

## Resumo
As regras do Firestore passam a aceitar o campo `linkAtivo` no documento
`users/{uid}` e a liberar `get` desse documento a qualquer requisição,
mesmo sem autenticação, enquanto `linkAtivo == true`. Antes, `get` só era
permitido ao próprio usuário e o campo `linkAtivo` era recusado pelo
`hasOnly`. `list`, `create` e `update` de terceiros e `delete` seguem
negados. `firestore.rules` ganha a exceção de leitura pública condicionada
e a validação do campo; `firestore.rules.test.js` ganha o `describe` "link
do catálogo"; `docs/modelo-firebase.md` descreve o campo, a regra, as duas
operações e o custo. Nada no cliente lê ou grava `linkAtivo` ainda — as
regras sobem antes do código que o escreve (DDR 0004).

## Discovery
- Código: `firestore.rules` tem uma única `allow get` (dono), `allow create`
  e `allow update` separadas com `hasOnly(["contagens", "updatedAt",
  "atestadoEm"])`, `values().hasOnly([1…99])`, `updatedAt == request.time`
  e `atestadoEm is timestamp`, com guarda de campo ausente; `delete` e
  `list` negados de propósito. `firestore.rules.test.js` usa
  `@firebase/rules-unit-testing` com os helpers `semearDocumentoDoDono`,
  `comoDono`, `comoIntruso`, `comoAnonimo` e `assertSucceeds`/`assertFails`.
  O comportamento atual confere com a tarefa: `linkAtivo` é campo estranho
  hoje (o `hasOnly` o recusa) e a leitura anônima é negada. Impacto fora
  dos arquivos citados: nenhum — nenhum módulo do cliente toca o campo.
- Documentação: além das referências, li `docs/devops-dr/0004` (regras sobem
  antes do Hosting, sem canal de preview) e `docs/adr/0005` (App Check fora,
  risco de cota registrado). As referências bastaram para o schema e os
  textos.

## Plano da alteração
1. `firestore.rules`: `allow get` vira dono **ou** `resource != null &&
   "linkAtivo" in resource.data && resource.data.linkAtivo == true`; o
   `hasOnly` de `create` e `update` inclui `"linkAtivo"`; cada `allow`
   ganha a cláusula de `linkAtivo is bool` — no `create` por presença, no
   `update` por `diff(resource.data).affectedKeys()`, no mesmo estilo de
   `atestadoEm`; comentários citando MDR 0002 e IDR 0055.
2. `firestore.rules.test.js`: `describe` "firestore.rules — link do
   catálogo" com os casos de leitura pública (ligado/desligado/ausente/
   inexistente/terceiro), `list` anônimo, gravação de `linkAtivo` pelo dono
   (documento inexistente e preexistente), valor não booleano e gravação
   por terceiro (autenticado e anônimo).
3. `docs/modelo-firebase.md`: `linkAtivo` no exemplo e na lista do formato;
   § Regras de segurança com a leitura pública e o quarto campo; §
   Operações com "Ligar/desligar o link" e "Abrir o link"; § Custos com as
   duas operações.
- Verificação prevista: cada critério de aceite pelos `it`s do novo
  `describe` e pela inspeção dos trechos de `docs/modelo-firebase.md`;
  critério de regressão por `npm run test:rules` completo.
- Riscos: `get` de documento inexistente pode não avaliar regras no
  emulador — se o caso "inexistente → negado" não se comportar como a
  tarefa pede, é impedimento (condição 12), não ajuste do critério.
- Desvios: nenhum.

## Decisões tomadas
- Guarda `resource != null` na leitura pública para o documento inexistente
  não errar a avaliação de `resource.data` — desdobramento direto da
  "guarda de campo ausente" do TDR 0009 (nível 1).
- Cláusula de `linkAtivo` no `update` sob `diff(resource.data)
  .affectedKeys()`, no mesmo formato de `atestadoEm`/`updatedAt` (nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> oxlint
Found 0 warnings and 0 errors.
Finished in 54ms on 85 files with 105 rules using 4 threads.
```

### `npm run test`
```
Test Files  41 passed (41)
     Tests  514 passed (514)
```

### `npm run build`
```
✓ 136 modules transformed.
dist/assets/index-B4QkMZ9h.css   47.13 kB
dist/assets/index-C0KUlsLc.js   440.39 kB
✓ built in 508ms
```
(aviso pré-existente de chunk > 500 kB, sem relação com a tarefa.)

### `npm run test:rules`
Tocou `firestore.rules`, então roda. Antes do primeiro comando foi
necessário pôr o JDK 21 no `PATH` (o `java` do `PATH` era 1.8, embora o
`JAVA_HOME` já apontasse para o Temurin 21); sem isso o emulador aborta com
"firebase-tools no longer supports Java version before 21" — falha de
ambiente, não de regra.
```
✓ firestore.rules.test.js (39 tests) 5734ms
Test Files  1 passed (1)
     Tests  39 passed (39)
Script exited successfully (code 0)
```
Os 28 testes anteriores seguem verdes; os 11 novos do `describe` "link do
catálogo" passam, incluindo "sem login, nega o documento inexistente" —
confirma que o emulador avalia as regras de `get` para documento inexistente
(`resource == null`), negando pelo guarda `resource != null`.

Nota para as próximas tarefas: `npm run test:rules` falha se o `java` do
`PATH` for anterior ao 21, mesmo com `JAVA_HOME` correto; prefixar o `bin`
do JDK 21 no `PATH` (aqui, `C:\Users\dffwe\.jdks\temurin-21.0.9\bin`).

## Critérios de aceite
- [x] Sem login, `get` de documento com `linkAtivo: true` é permitido e,
      com `false`, sem o campo ou inexistente, negado (testes) — quatro
      `it` do `describe` "link do catálogo" em `firestore.rules.test.js`
- [x] `list` em `users` segue negado sem login (teste) — "sem login, segue
      negado listar a coleção, mesmo com documentos ligados"
- [x] Dono grava só `linkAtivo`, com ou sem documento prévio, e valor não
      booleano é negado (testes) — "o dono liga e desliga o link num
      documento inexistente" e "o dono liga o link sobre documento com
      contagens, updatedAt e atestadoEm" + "nega linkAtivo não booleano"
- [x] Terceiro não grava `linkAtivo` em documento alheio (teste) — "nega
      terceiro gravando linkAtivo no documento de outro" (intruso e anônimo)
- [x] Todos os testes anteriores de `firestore.rules.test.js` verdes —
      39/39 em `npm run test:rules`
- [x] `docs/modelo-firebase.md` descreve o campo, a regra, as duas
      operações e o custo, citando MDR 0002 — § Formato do documento, §
      Regras do formato, § Regras de segurança, § Operações sobre o
      documento e § Custos e cotas

## Arquivos alterados
- `firestore.rules` — `get` público condicionado, `linkAtivo` no `hasOnly`
  e validação `is bool`
- `firestore.rules.test.js` — `describe` do link do catálogo
- `docs/modelo-firebase.md` — campo, regra, operações e custo
- `docs/plano/README.md` — status da tarefa e da fase
- `docs/plano/0027-catalogo-compartilhado-por-link/0001-regras-do-link-do-catalogo.md`
  — status
