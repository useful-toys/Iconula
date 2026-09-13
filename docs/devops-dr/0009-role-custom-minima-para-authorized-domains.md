<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0009: Role custom mínima para editar authorized domains

## Status

Aceito

## Contexto

- O CI passa a ler e gravar a lista de authorized domains do Firebase Auth
  ([DDR 0008](0008-autorizacao-do-dominio-de-preview-no-firebase-auth.md)).
- A service account `github-action-iconula` tinha
  `roles/firebasehosting.admin`, `roles/firebase.viewer` e
  `roles/firebaserules.admin` — nenhuma com `firebaseauth.*`.
- Roles predefinidas do Auth:
  - `roles/firebaseauth.admin`: `firebaseauth.configs.*` e também
    `firebaseauth.users.create/update/delete/get/sendEmail/createSession`;
  - `roles/firebaseauth.viewer`: só `firebaseauth.configs.get`.
- `firebaseauth.configs.get` e `firebaseauth.configs.update` são
  suportadas em role custom (`gcloud iam list-testable-permissions`).
- Precedente: [DDR 0004](0004-deploy-e-teste-das-regras-do-firestore.md)
  recusou `roles/datastore.owner` para não dar à chave do CI acesso a dado
  de usuário.

## Decisão

- Role custom `projects/iconula/roles/authorizedDomainsEditor`, estágio
  `GA`, só com `firebaseauth.configs.get` e `firebaseauth.configs.update`.
- Concedida à `github-action-iconula@iconula.iam.gserviceaccount.com`, sem
  condição.
- Executado em 2026-09-13; comandos, conferência e reversão em
  [setup-gcloud.md](../setup-gcloud.md).

## Consequências

- A chave do CI não lê nem altera usuários do Auth.
- `firebaseauth.configs.update` não se limita aos authorized domains: a
  chave pode alterar qualquer campo da configuração do Auth, inclusive
  provedores de login.
- Uma chave vazada poderia autorizar um domínio arbitrário no login — mais
  um motivo para a chave ficar só no secret e em `$RUNNER_TEMP`.
- A role custom é do projeto e precisa ser recriada num projeto novo
  (passo no resumo de reprodução do `setup-gcloud.md`).

## Alternativas consideradas

- **`roles/firebaseauth.admin`**: rejeitado — daria à chave do CI criar,
  alterar e apagar usuários para uma tarefa que só edita a lista de
  domínios.
- **`roles/firebaseauth.viewer`**: insuficiente — só lê a configuração.

## Histórico

- 2026-09-13 — criação.
