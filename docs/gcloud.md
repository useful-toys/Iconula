<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do Google Cloud / Firebase

Este documento descreve tudo o que foi configurado no Google Cloud e no
Firebase para o projeto **Iconula Button**, para o caso de ser necessário
reproduzir a configuração (novo projeto, migração, etc.).

## Conta e ferramentas

- **Conta Google**: `danielferber@gmail.com` (o usuário tem múltiplas
  contas Google — importante selecionar esta no login)
- **Firebase CLI**: instalado localmente (`firebase --version`)
- **gcloud CLI**: instalado localmente (`gcloud --version`), usado para
  criar a service account de deploy (ver abaixo)

### Login do Firebase CLI

```bash
firebase login
```

É um fluxo interativo (abre navegador) — não pode ser automatizado.
Verificar quem está logado com:

```bash
firebase login:list
```

## Projeto Firebase

- **Project ID**: `iconula` (escolhido explicitamente pelo usuário —
  não usar variantes como `iconula-button` sem confirmar antes)
- **Nome de exibição**: "Iconula Button"
- **Console**: https://console.firebase.google.com/project/iconula/overview

Criado com:

```bash
firebase projects:create iconula --display-name "Iconula Button"
```

## Firebase Hosting

Configurado via dois arquivos na raiz do repositório (criados manualmente
em vez de `firebase init hosting` interativo — ver nota abaixo):

`.firebaserc`:
```json
{
  "projects": {
    "default": "iconula"
  }
}
```

`firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

`"public": "dist"` aponta para a pasta gerada pelo `npm run build` (Vite).
O rewrite `**` → `/index.html` é o modo SPA (necessário mesmo que hoje o
app não tenha rotas, para não quebrar se isso mudar no futuro).

- **URL de produção**: https://iconula.web.app
- **URLs de preview** (por PR): `https://iconula--pr<N>-<slug>-<hash>.web.app`, expiram automaticamente após ~7 dias

### Deploy manual (fora do CI, se necessário)

```bash
npm run build
firebase deploy --only hosting
```

> Nota: a intenção original era rodar `firebase init hosting` de forma
> interativa para gerar esses arquivos. Os prompts interativos do
> Firebase CLI não funcionaram de forma confiável em shell não-interativo
> nesta sessão (heredocs/pipes de resposta ficam fora de sincronia com
> prompts assíncronos), então os arquivos foram escritos manualmente com
> o conteúdo equivalente.

## Service account para deploy via GitHub Actions

O workflow de deploy (`.github/workflows/firebase-hosting-*.yml`, ver
[docs/github.md](github.md)) autentica no Firebase usando uma service
account do Google Cloud, cuja chave fica armazenada como secret no
repositório GitHub — **não** no repositório de código.

### Por que não foi usado `firebase init hosting:github`

Esse comando normalmente cria a service account, gera a chave e registra
o secret no GitHub automaticamente, via um fluxo OAuth interativo com o
GitHub. Nesta sessão, os prompts subsequentes do comando (nome do
repositório, confirmação do build script, branch de deploy) não
funcionaram de forma confiável em modo não-interativo. A alternativa foi
configurar cada peça manualmente com `gcloud` + `gh`, descrita abaixo.

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

1. `firebase login` (interativo, conta Google correta)
2. `firebase projects:create <project-id> --display-name "<nome>"`
3. Criar `.firebaserc` e `firebase.json` apontando para `dist`
4. `gcloud config set project <project-id>`
5. Criar a service account e conceder `roles/firebasehosting.admin` +
   `roles/firebase.viewer`
6. Gerar a chave JSON, registrar como secret no GitHub, apagar o arquivo local
7. Referenciar esse secret e o `projectId` nos workflows do GitHub Actions
