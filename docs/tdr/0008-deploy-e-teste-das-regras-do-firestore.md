<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0008: Deploy e teste das regras de segurança do Firestore

## Status

**Substituído pelo [DDR 0004](../devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md)**: as decisões de deploy e teste das regras foram para DevOps DRs. O desenho da validação do mapa esparso está no [TDR 0009](0009-validacao-do-mapa-nas-regras.md), que complementa este registro.

## Contexto

Com a persistência do time visível
([ADR 0005](../adr/0005-persistencia-no-firestore.md)), o projeto
passa a guardar dados por usuário. Duas perguntas ficam em aberto, e
nenhuma tem resposta no código cliente:

1. **Como garantir que um usuário não leia nem escreva os dados de
   outro?** O bundle é público e qualquer requisição pode ser forjada com
   um ID token válido — a autorização precisa ser avaliada no servidor.
2. **Como publicar as regras?** A action
   `FirebaseExtended/action-hosting-deploy`, usada nos dois workflows de
   deploy, só cobre Hosting. Sem um caminho de deploy, o `firestore.rules`
   do repositório seria decorativo.

- Problema pré-existente que este TDR aproveita para corrigir: o job
  `cleanup_preview` do `firebase-hosting-pull-request.yml` roda
  `npx --yes firebase-tools@latest` **com a chave da service account no
  ambiente**. Uma tag móvel executando com credencial de deploy é
  exatamente o risco de cadeia de suprimentos que o
  [TDR 0006](0006-pinning-actions-por-sha.md) fechou para as actions.

## Decisão

### Regras: `allow get` restrito, sem `list`, sem `delete`

```
match /users/{userId} {
  allow get: if request.auth != null && request.auth.uid == userId;

  allow create: if request.auth != null
    && request.auth.uid == userId
    && request.resource.data.keys().hasOnly(["contagens", "updatedAt", "atestadoEm"])
    && (!("contagens" in request.resource.data) || (
      request.resource.data.contagens is map
      && request.resource.data.contagens.size() <= 994
      && request.resource.data.contagens.values().hasOnly([1, 2, …, 99])
      && "updatedAt" in request.resource.data
    ))
    && (!("updatedAt" in request.resource.data) || request.resource.data.updatedAt == request.time)
    && (!("atestadoEm" in request.resource.data) || request.resource.data.atestadoEm is timestamp);

  // `update`: mesmas cláusulas, cada uma perguntando se *esta* operação
  // escreveu o campo — `"X" in request.resource.data.diff(resource.data).affectedKeys()`.
  allow update: if … ;
}
```

- **`get` em vez de `read`.** `read` abrange `get` **e** `list`; com
  `list` autorizado, uma query na coleção `users` passaria a ser
  avaliada. Como aqui só existe acesso a documento por id — e o id é o
  próprio uid —, restringir a `get` nega a listagem da coleção de saída,
  sem depender de a condição por acaso não ser satisfazível numa query.
- **`create, update`, nunca `delete`.** Apagar o documento não é uma
  operação que o app faça; não autorizá-la é de graça.
- **Schema esparso validado.** O documento é do usuário, mas o
  armazenamento e a cota são do projeto: `hasOnly(["contagens",
  "updatedAt", "atestadoEm"])` sobre o documento resultante, `contagens`
  é `map` com `size() <= 994` e `values().hasOnly([1…99])` (o teto de 99
  é o que torna os valores validáveis — [TDR 0009](0009-validacao-do-mapa-nas-regras.md)),
  `updatedAt == request.time` e `atestadoEm` timestamp. No `update` com
  `merge: true`, cada cláusula pergunta se **esta** operação escreveu o
  campo (`diff(resource.data).affectedKeys()`), porque
  `request.resource.data` é o documento resultante inteiro.
- **Guarda de campo ausente.** A atestação cria o documento só com
  `atestadoEm`: toda cláusula sobre `contagens`/`updatedAt` fica sob
  `!("…" in request.resource.data)`, senão a regra erra em vez de negar
  ([TDR 0009](0009-validacao-do-mapa-nas-regras.md)).
- **Deny-by-default.** Qualquer caminho fora de `users/{userId}` já é
  negado pelo Firestore. Não se acrescenta uma regra `if false`
  catch-all: ela só daria a falsa impressão de que sua ausência abriria o
  banco.

### A garantia é executável: testes de regras no emulador

- Regras corretas hoje não são regras corretas amanhã: `firestore.rules.test.js`
  usa `@firebase/rules-unit-testing` contra o emulador do Firestore e
  cobre o isolamento e a validação explicitamente — dono lê o próprio
  documento; **outro uid é negado**; anônimo é negado; `list` na coleção
  e `delete` são negados; valores fora de 1–99 (`0`, negativo, `100`,
  não-inteiro, string), campo extra, `updatedAt` forjado, `contagens` sem
  `updatedAt` e mais de 994 chaves são negados; documento só com
  `atestadoEm` é aceito.

Detalhes de implementação que importam:

- Projeto `demo-iconula`. O prefixo `demo-` faz o emulador rodar
  totalmente offline, **sem credencial nenhuma** — por isso os testes
  rodam no `ci.yml`, que vale inclusive para PR de fork, e não nos
  workflows que carregam secrets.
- Config separada (`vitest.rules.config.js`, `environment: "node"`), e
  `**/*.rules.test.js` excluído do `vite.config.js`: o `npm test` normal
  roda em jsdom e não pode tentar executar esses testes sem emulador no
  ar.
- Um único script `npm run test:rules`, idêntico local e no CI, para que
  não exista um caminho que só funciona numa das duas situações.

### Deploy das regras: step próprio no merge, antes do Hosting

- Padrão já existente no repositório, reusado literalmente para não
  haver dois idiomas para a mesma coisa — é o mesmo que o
  `cleanup_preview` usa: chave em `$RUNNER_TEMP`,
  `GOOGLE_APPLICATION_CREDENTIALS`, `npx firebase-tools`.

- **Antes do deploy de Hosting.** Se as regras falharem, o cliente novo
  nem chega a subir. Na direção contrária, estas regras são puramente
  aditivas e não quebram o cliente que já está no ar.
- **Só no merge**, não em PR: regras são **globais do projeto**, não têm
  canal de preview (ver Consequências).
- **Versão do `firebase-tools` fixada** (`@15.29.0`) nos **dois** jobs,
  corrigindo o `@latest` pré-existente do `cleanup_preview`. O
  `sha_pinning_required` do repositório governa `uses:` de actions, não
  pacotes npm — mas o espírito do TDR 0006 é o mesmo, e aqui é agravado
  pela credencial no ambiente. O bump passa a ser manual e deliberado.
- **A chave é apagada** num step `if: always()`, em vez de confiar apenas
  no descarte do runner.
- **`permissions: contents: read`** passa a existir no workflow de merge,
  que não tinha bloco `permissions` e herdava o default do repositório.
  Alinha com o `ci.yml`.

### IAM: `roles/firebaserules.admin`, e só

- Verificado com `gcloud iam roles describe`: essa role contém
  exatamente o que `firebase deploy --only firestore:rules` executa —
  `firebaserules.rulesets.create`, `firebaserules.releases.create/update`,
  mais `get/list/test` e `resourcemanager.projects.get`.
- O `roles/firebase.viewer` que a service account já tinha cobre o lado
  de leitura (`datastore.databases.get`, `firebase.projects.get`).

**`roles/datastore.owner` foi descartado**: daria à conta de CI leitura e
escrita sobre o documento de **todos os usuários**, para uma tarefa que
não toca em dado nenhum. Publicar regras e acessar dados são permissões
diferentes e devem continuar assim.

## Consequências

- **O isolamento entre usuários deixa de ser uma afirmação e passa a ser
  um teste.** Uma regressão em `firestore.rules` quebra o CI.
- **Regras não têm canal de preview.** Elas são globais do projeto e o
  deploy só ocorre no merge, então um preview de PR roda o **cliente novo
  contra as regras antigas** — e, pela política de erro do ADR 0005, cada
  escrita negada some em silêncio. Para validar um preview de ponta a
  ponta é preciso publicar as regras uma vez à mão antes
  (`firebase deploy --only firestore:rules --project iconula`,
  idempotente e idêntico ao que o CI fará). Quem revisar um PR deste tipo
  precisa saber disso, ou vai concluir que a feature está quebrada.
- **`hasOnly([...])` sobre os três campos acopla schema a deploy de
  regras**: um campo novo exige que as regras subam **antes ou junto**
  com o código que o escreve, nunca depois. Se esse acoplamento
  incomodar, o caminho é abandonar o `hasOnly` e manter só as checagens
  de tipo e tamanho.
- **`npm run test:rules` precisa de Java** (o emulador do Firestore roda
  na JVM). Está disponível no runner `ubuntu-latest` e em máquinas de
  desenvolvimento com JDK; quem não tiver Java verá esse teste falhar por
  ambiente, não por regra.
- **O CI ficou um pouco mais lento** — subir o emulador custa alguns
  segundos por execução do `ci.yml`.
- **Um `firebase deploy` sem `--only`** feito de uma máquina de
  desenvolvimento passa a publicar regras junto com o Hosting.
- Verificação após o merge: conferir que o step passou, que o ruleset
  publicado corresponde ao arquivo do repositório, e que repetir o deploy
  é idempotente.

## Alternativas consideradas

- **Deploy manual das regras, documentado**: menos infraestrutura agora,
  mas nada impediria o `firestore.rules` do repositório de divergir do
  que está publicado — e divergência silenciosa em regra de segurança é
  precisamente o que não se quer.
- **`firebase-tools` como `devDependency`**: daria integridade via
  `package-lock.json` em vez de confiar na versão fixada no comando.
  Rejeitado pelo custo: é um pacote muito grande, e entraria no `npm ci`
  dos três workflows (inclusive o `ci.yml`, que é required status check e
  roda em todo PR) para poupar um download em dois jobs.
- **OIDC (`google-github-actions/auth`) em vez da chave JSON**: postura
  de segurança melhor — sem chave de longa duração no repositório. É a
  evolução natural, já anotada nas alternativas do TDR 0006, mas é uma
  mudança separada que também mexeria nos steps de Hosting dos dois
  workflows. Se adotada, a action nova precisa ser pinada por SHA.
- **Verificar as regras só no Rules Playground do console**: manual, não
  reexecutável e invisível em revisão de PR. Serve como conferência
  complementar, não como garantia.
- **`roles/datastore.owner`** para a service account: ver Decisão.
- **Um step de `--dry-run` das regras no workflow de PR**, para pegar
  erro de sintaxe antes do merge: ideia boa e barata, mas não foi
  incluída porque não ficou verificado se `--dry-run` exige permissão de
  escrita. Fica registrada como próximo passo natural.

## Histórico

- **2026-09-13**: sincronizado com a base de código. O bloco de regras
  ainda exibia o schema da era do botão (`hasOnly(["teamName"])`);
  alinhado ao schema esparso em produção — `contagens`/`updatedAt`/
  `atestadoEm`, com `create` e `update` separados por
  `diff(resource.data).affectedKeys()`. O Status deixou de afirmar que o
  desenho da validação "permanece neste TDR": ele está no TDR 0009.
