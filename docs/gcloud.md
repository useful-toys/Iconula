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

| API | Motivo |
|---|---|
| `identitytoolkit.googleapis.com` (Identity Toolkit API) | Usada pelo Firebase Auth (login com Google — ver [ADR 0005](adr/0005-autenticacao-google-firebase-auth.md) e [docs/firebase.md](firebase.md#firebase-authentication)); também é a API por trás do Identity Platform Admin API, usada para automatizar authorized domains via `curl` + token do `gcloud` (mesmo padrão da Firebase Hosting REST API já usado para o domínio customizado). |

Habilitada com:

```bash
gcloud services enable identitytoolkit.googleapis.com --project iconula
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

## Reproduzindo do zero (resumo)

1. `gcloud config set project <project-id>` (mesmo ID do projeto Firebase)
2. `gcloud services enable identitytoolkit.googleapis.com --project <project-id>`
   (necessário para o Firebase Auth — ver seção "APIs habilitadas")
3. Criar a service account e conceder `roles/firebasehosting.admin` +
   `roles/firebase.viewer`
4. Gerar a chave JSON, registrar como secret no GitHub, apagar o arquivo local
