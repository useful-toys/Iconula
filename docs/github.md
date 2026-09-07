<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do GitHub

Este documento descreve tudo o que foi configurado no GitHub para o
projeto **Iconula Button**, para o caso de ser necessário reproduzir a
configuração (novo repositório, migração, etc.). Para o projeto/Hosting
do Firebase, ver [docs/firebase.md](firebase.md); para a service account
e permissões no Google Cloud, ver [docs/gcloud.md](gcloud.md).

## Repositório

- **Organização**: [`useful-toys`](https://github.com/useful-toys)
- **Repositório**: [`useful-toys/Iconula`](https://github.com/useful-toys/Iconula)
- **Visibilidade**: público
- **Branch padrão**: `main`

Criado via GitHub CLI, a partir do diretório local do projeto já
inicializado com git e com o primeiro commit feito:

```bash
gh repo create useful-toys/Iconula --public --source=. --remote=origin --push
```

Pré-requisito: `gh auth status` autenticado com uma conta que seja membro
(idealmente admin) da organização `useful-toys`. Verificar acesso com:

```bash
gh api user/memberships/orgs/useful-toys
```

## Secrets do repositório

| Secret | Origem | Uso |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_ICONULA` | Chave JSON da service account `github-action-iconula@iconula.iam.gserviceaccount.com` (ver [docs/gcloud.md](gcloud.md)) | Autenticar o `FirebaseExtended/action-hosting-deploy@v0` nos workflows de deploy |

Como foi criado (a partir do arquivo de chave gerado no lado do Google
Cloud — ver `docs/gcloud.md`):

```bash
gh secret set FIREBASE_SERVICE_ACCOUNT_ICONULA --repo useful-toys/Iconula < key.json
```

O `GITHUB_TOKEN` usado pelos workflows para comentar a URL de preview no
PR é automático (gerado pelo GitHub por execução, não precisa ser criado).

> Nota: originalmente a intenção era deixar o comando
> `firebase init hosting:github` criar esse secret automaticamente (ele
> faz um fluxo OAuth com o GitHub e registra o secret sozinho). Na prática,
> os prompts interativos desse comando não funcionaram de forma confiável
> em shell não-interativo nesta sessão, então o secret foi criado
> manualmente pelo caminho acima.

## Workflows (GitHub Actions)

Dois arquivos em `.github/workflows/`, no formato que o
`firebase init hosting:github` normalmente geraria (escritos manualmente
aqui pelo motivo explicado acima):

### `firebase-hosting-merge.yml`

Dispara em todo push na branch `main`. Faz build (`npm ci && npm run build`)
e deploy em produção via `FirebaseExtended/action-hosting-deploy@v0`, com
`channelId: live`.

### `firebase-hosting-pull-request.yml`

Dispara em todo pull request. Faz build e um *preview deploy* (canal
temporário, expira em ~7 dias), comentando a URL de preview automaticamente
no PR. Roda no job chamado **`build_and_preview`** — esse nome é
importante porque é o identificador usado na regra de proteção de branch
abaixo.

Ambos usam `actions/setup-node@v4` (Node 20) antes do build, e a versão
`@v0` do `FirebaseExtended/action-hosting-deploy`.

## Proteção da branch `main`

Configurada para exigir que o workflow de preview deploy passe antes de
permitir merge de qualquer PR (ver
[docs/adr/0004](adr/0004-branch-protection-preview-required.md)).

Como foi configurada (via API do GitHub, já que a UI e os flags do `gh api`
não aceitam bem tipos booleanos/arrays diretamente — foi necessário um
payload JSON):

```bash
cat > branch_protection.json <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build_and_preview"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
JSON

gh api repos/useful-toys/Iconula/branches/main/protection \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  --input branch_protection.json
```

**Importante**: o nome do check (`build_and_preview`) só existe para o
GitHub associar depois que o workflow rodou ao menos uma vez. Por isso a
sequência correta é:

1. Fazer o push dos workflows para o repositório.
2. Abrir um PR de teste qualquer, deixar o workflow de preview rodar e
   confirmar visualmente o nome do job na aba Actions (ou via
   `gh run view <run-id>`).
3. Só então aplicar a regra de proteção de branch referenciando esse nome.

Isso foi validado abrindo o PR [#1](https://github.com/useful-toys/Iconula/pull/1)
("Test: validate preview deploy workflow"), confirmando que o preview
deploy funcionou e que o PR ficou `mergeable`/`CLEAN` somente após o check
passar; o PR foi então mesclado (squash) e a branch de teste removida.

## Reproduzindo do zero (resumo)

1. `gh repo create <org>/<repo> --public --source=. --remote=origin --push`
2. Criar/obter o projeto Firebase (ver [docs/firebase.md](firebase.md)) e
   a service account/chave JSON no Google Cloud (ver [docs/gcloud.md](gcloud.md))
3. `gh secret set FIREBASE_SERVICE_ACCOUNT_<NOME> --repo <org>/<repo> < key.json`
4. Commitar os dois workflows em `.github/workflows/` apontando para esse
   secret e para o `projectId` correto
5. Push para `main` (dispara o deploy de produção) e abrir um PR de teste
   (dispara o preview deploy)
6. Aplicar a regra de proteção de branch referenciando o nome do job do
   workflow de PR, usando `gh api .../protection` com um payload JSON
