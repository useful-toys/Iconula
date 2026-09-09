<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do Google Cloud (IAM / service account)

Este documento descreve tudo o que foi configurado no **Google Cloud**
(fora do que é gerenciado pelo próprio Firebase) para o projeto
**Iconula Button** — especificamente a service account usada pelo GitHub
Actions para fazer deploy. Para o projeto Firebase e o Hosting em si, ver
[docs/firebase.md](firebase.md). Para o lado GitHub (onde a chave é
armazenada como secret), ver [docs/github.md](github.md).

## Ferramenta

- **gcloud CLI**: instalado localmente (`gcloud --version`)
- Projeto de trabalho: `iconula` (mesmo Project ID do Firebase, já que
  todo projeto Firebase é também um projeto Google Cloud)

```bash
gcloud config set project iconula
```

## APIs habilitadas

Habilitadas explicitamente por este projeto:

| API | Motivo |
|---|---|
| `identitytoolkit.googleapis.com` (Identity Toolkit API) | Usada pelo Firebase Auth (login com Google — ver [ADR 0005](adr/0005-substituido-autenticacao-google-firebase-auth.md) e [docs/firebase.md](firebase.md#firebase-authentication)); também é a API por trás do Identity Platform Admin API, usada para automatizar authorized domains via `curl` + token do `gcloud` (mesmo padrão da Firebase Hosting REST API já usado para o domínio customizado). |
| `firestore.googleapis.com` (Cloud Firestore API) | Persistência do time visível por usuário — ver [ADR 0007](adr/0007-persistencia-do-time-no-firestore.md) e a seção "Cloud Firestore" abaixo. Sem ela, qualquer `gcloud firestore ...` falha com `SERVICE_DISABLED`. |

Habilitadas com:

```bash
gcloud services enable identitytoolkit.googleapis.com --project iconula
gcloud services enable firestore.googleapis.com --project iconula
```

Além dessas, o próprio Firebase habilita um conjunto de APIs por padrão
ao criar o projeto (`firebase.googleapis.com`,
`firebasehosting.googleapis.com`, `firebaserules.googleapis.com`,
`datastore.googleapis.com`, `serviceusage.googleapis.com`, entre outras).
Duas importam aqui: **`firebaserules.googleapis.com`** é a que o deploy
das regras do Firestore usa, e **`datastore.googleapis.com`** acompanha o
Firestore — nenhuma das duas precisou ser habilitada à mão. Conferir o
estado real com:

```bash
gcloud services list --enabled --project iconula
```

## Service account para deploy via GitHub Actions

O workflow de deploy (`.github/workflows/firebase-hosting-*.yml`, ver
[docs/github.md](github.md)) autentica no Firebase usando uma service
account do Google Cloud, cuja chave fica armazenada como secret no
repositório GitHub — **não** no repositório de código.

### Por que foi configurada manualmente

A intenção original era deixar `firebase init hosting:github` criar a
service account, gerar a chave e registrar o secret no GitHub
automaticamente, via um fluxo OAuth interativo. Nesta sessão, os prompts
subsequentes desse comando (nome do repositório, confirmação do build
script, branch de deploy) não funcionaram de forma confiável em modo
não-interativo. A alternativa foi configurar cada peça manualmente com
`gcloud` + `gh`, descrita abaixo.

### Passo a passo (o que foi executado)

1. Selecionar o projeto no `gcloud`:

   ```bash
   gcloud config set project iconula
   ```

2. Criar a service account:

   ```bash
   gcloud iam service-accounts create github-action-iconula \
     --project=iconula \
     --display-name="GitHub Actions - Iconula Hosting Deploy"
   ```

   E-mail resultante: `github-action-iconula@iconula.iam.gserviceaccount.com`

3. Conceder as roles necessárias para fazer deploy no Hosting:

   ```bash
   gcloud projects add-iam-policy-binding iconula \
     --member="serviceAccount:github-action-iconula@iconula.iam.gserviceaccount.com" \
     --role="roles/firebasehosting.admin" \
     --condition=None

   gcloud projects add-iam-policy-binding iconula \
     --member="serviceAccount:github-action-iconula@iconula.iam.gserviceaccount.com" \
     --role="roles/firebase.viewer" \
     --condition=None
   ```

   E, para publicar as regras de segurança do Firestore no workflow de
   merge (ver [TDR 0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md)):

   ```bash
   gcloud projects add-iam-policy-binding iconula \
     --member="serviceAccount:github-action-iconula@iconula.iam.gserviceaccount.com" \
     --role="roles/firebaserules.admin" \
     --condition=None
   ```

   `roles/firebaserules.admin` contém exatamente o que
   `firebase deploy --only firestore:rules` executa
   (`firebaserules.rulesets.create`, `firebaserules.releases.create/update`);
   o lado de leitura (`datastore.databases.get`, `firebase.projects.get`)
   já vem do `roles/firebase.viewer` acima. **`roles/datastore.owner` foi
   deliberadamente descartado**: daria à conta de CI leitura e escrita
   sobre o documento de todos os usuários, para uma tarefa que não toca
   em dado nenhum. Conferir as roles concedidas com:

   ```bash
   gcloud projects get-iam-policy iconula \
     --flatten="bindings[].members" \
     --filter="bindings.members:github-action-iconula@iconula.iam.gserviceaccount.com" \
     --format="table(bindings.role)"
   ```

4. Gerar uma chave JSON para a service account:

   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-action-iconula@iconula.iam.gserviceaccount.com
   ```

5. Registrar o conteúdo do `key.json` como secret no repositório GitHub
   (ver [docs/github.md](github.md) para o comando `gh secret set`) e, em
   seguida, **apagar o arquivo `key.json` local** — a chave só deve existir
   como secret do GitHub, nunca versionada ou deixada em disco.

### Rotacionar/revogar a chave no futuro

Se a chave precisar ser trocada (rotação de segurança, vazamento
suspeito, etc.):

```bash
# Listar chaves existentes da service account
gcloud iam service-accounts keys list \
  --iam-account=github-action-iconula@iconula.iam.gserviceaccount.com

# Revogar uma chave específica
gcloud iam service-accounts keys delete <KEY_ID> \
  --iam-account=github-action-iconula@iconula.iam.gserviceaccount.com

# Gerar uma nova e atualizar o secret no GitHub (ver docs/github.md)
```

## Cloud Firestore

O banco `(default)` foi criado via `gcloud`, e **não** via
`firebase firestore:databases:create`, por um motivo específico: o
comando do Firebase não tem a flag `--type` e cria o modo Native
implicitamente. O `gcloud` deixa a escolha explícita e auditável — o modo
Datastore quebraria o SDK cliente inteiro.

```bash
# Conferir as regiões elegíveis antes
gcloud firestore locations list --project iconula --format="value(locationId)"

# Criar. Não existe --dry-run para este comando (nem no firebase CLI).
gcloud firestore databases create --project=iconula \
  --database='(default)' --location=southamerica-east1 --type=firestore-native

# Conferir
gcloud firestore databases describe --database='(default)' --project=iconula
```

Região **`southamerica-east1`** (São Paulo), edição `STANDARD`, modo
`FIRESTORE_NATIVE`.

**A região está na faixa gratuita**, o que a própria API confirma no
recurso criado:

```bash
$ gcloud firestore databases describe --database='(default)' --project=iconula \
    --format="value(freeTier,locationId)"
True    southamerica-east1
```

Isso encerra a dúvida de que a cota gratuita do Firestore valeria só em
`us-central1`/`us-east1`/`us-west1` — essa restrição é do Cloud Storage.
O raciocínio completo e o gatilho de revisão (caso o projeto vá para o
plano Blaze, onde São Paulo é mais caro por operação) estão no
[ADR 0007](adr/0007-persistencia-do-time-no-firestore.md), seção "Região
e faixa gratuita".

**Trocar de região é possível**: bancos Firestore podem ser apagados
(`gcloud firestore databases delete --database='(default)'`) e recriados
em outra região — ao custo de perder os dados gravados. Não é uma escolha
sem volta, mas passa a ter custo real assim que houver usuários.

As regras de segurança e como elas são publicadas ficam em
[docs/firebase.md](firebase.md#cloud-firestore) e no
[TDR 0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md).

## Reproduzindo do zero (resumo)

1. `gcloud config set project <project-id>` (mesmo ID do projeto Firebase)
2. `gcloud services enable identitytoolkit.googleapis.com --project <project-id>`
   (Firebase Auth) e
   `gcloud services enable firestore.googleapis.com --project <project-id>`
   (Firestore) — ver seção "APIs habilitadas"
3. Criar o banco `(default)` do Firestore — ver seção "Cloud Firestore"
4. Criar a service account e conceder `roles/firebasehosting.admin` +
   `roles/firebase.viewer` + `roles/firebaserules.admin`
5. Gerar a chave JSON, registrar como secret no GitHub, apagar o arquivo local
