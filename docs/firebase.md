<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do Firebase

Este documento descreve tudo o que foi configurado no **Firebase**
(projeto, Hosting) para o projeto **Iconula Button**, para o caso de ser
necessário reproduzir a configuração (novo projeto, migração, etc.). Para
a service account e permissões no Google Cloud usadas pelo deploy via CI,
ver [docs/gcloud.md](gcloud.md). Para o lado GitHub (secrets, workflows,
branch protection), ver [docs/github.md](github.md).

## Conta e CLI

- **Conta Google**: `danielferber@gmail.com` (o usuário tem múltiplas
  contas Google — importante selecionar esta no login)
- **Firebase CLI**: instalado localmente (`firebase --version`)

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

## Reproduzindo do zero (resumo)

1. `firebase login` (interativo, conta Google correta)
2. `firebase projects:create <project-id> --display-name "<nome>"`
3. Criar `.firebaserc` e `firebase.json` apontando para `dist`
4. Configurar a service account de deploy no Google Cloud — ver [docs/gcloud.md](gcloud.md)
5. Referenciar o secret dessa service account e o `projectId` nos
   workflows do GitHub Actions — ver [docs/github.md](github.md)
