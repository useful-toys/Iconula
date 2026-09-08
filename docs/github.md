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

## Segurança e análise do repositório

Configuração de segurança ativa no repositório público (gratuita), em
2026-09-07:

| Recurso | Estado | Como foi habilitado |
|---|---|---|
| Secret scanning | `enabled` | `PATCH /repos/...` (primeira etapa) |
| Secret scanning push protection | `enabled` | `PATCH /repos/...` (primeira etapa) |
| Dependabot alerts | `enabled` | `PUT /repos/.../vulnerability-alerts` |
| Dependabot security updates | `enabled` | `PUT /repos/.../automated-security-fixes` |
| Secret scanning validity checks | `disabled` | **não habilitável** — requer GitHub Advanced Security (plano Team/Enterprise); PATCH retorna 200 mas o campo não muda |
| Secret scanning non-provider patterns | `disabled` | **não habilitável** — idem, requer GitHub Advanced Security |

O essencial (secret scanning + push protection) cobre o risco do
`key.json` mencionado em [docs/gcloud.md](gcloud.md): push protection
bloqueia o push de um segredo detectado, mesmo num commit acidental.

Conferir o estado atual:

```bash
gh api repos/useful-toys/Iconula --jq .security_and_analysis
```

## Secrets do repositório

| Secret | Origem | Uso |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_ICONULA` | Chave JSON da service account `github-action-iconula@iconula.iam.gserviceaccount.com` (ver [docs/gcloud.md](gcloud.md)) | Autenticar o `FirebaseExtended/action-hosting-deploy@v0` nos workflows de deploy; e, via `GOOGLE_APPLICATION_CREDENTIALS`, o `firebase deploy --only firestore:rules` no merge e o `hosting:channel:delete` no fechamento de PR |

Como foi criado (a partir do arquivo de chave gerado no lado do Google
Cloud — ver `docs/gcloud.md`):

```bash
gh secret set FIREBASE_SERVICE_ACCOUNT_ICONULA --repo useful-toys/Iconula < key.json
```

O `GITHUB_TOKEN` usado pelos workflows para comentar a URL de preview no
PR é automático (gerado pelo GitHub por execução, não precisa ser criado).

## Variáveis do repositório

Diferente da tabela acima, estas **não são secretas** — são o config do
Web App do Firebase (ver [docs/firebase.md](firebase.md#firebase-authentication)),
enviado ao navegador de qualquer forma. Usar Actions **Variables** (não
Secrets) evita alarme de secret-scanning e deixa o `gh variable list`
mostrar o valor, útil para depurar builds.

| Variável | Uso |
|---|---|
| `VITE_FIREBASE_API_KEY` | Config do Firebase Web App, injetado no build via `vars.*` |
| `VITE_FIREBASE_AUTH_DOMAIN` | idem |
| `VITE_FIREBASE_PROJECT_ID` | idem |
| `VITE_FIREBASE_STORAGE_BUCKET` | idem |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | idem |
| `VITE_FIREBASE_APP_ID` | idem |

Como foram criadas:

```bash
gh variable set VITE_FIREBASE_API_KEY --repo useful-toys/Iconula --body "<valor>"
gh variable set VITE_FIREBASE_AUTH_DOMAIN --repo useful-toys/Iconula --body "iconula.firebaseapp.com"
gh variable set VITE_FIREBASE_PROJECT_ID --repo useful-toys/Iconula --body "iconula"
gh variable set VITE_FIREBASE_STORAGE_BUCKET --repo useful-toys/Iconula --body "<valor>"
gh variable set VITE_FIREBASE_MESSAGING_SENDER_ID --repo useful-toys/Iconula --body "<valor>"
gh variable set VITE_FIREBASE_APP_ID --repo useful-toys/Iconula --body "<valor>"
```

Referenciadas nos workflows de deploy (`firebase-hosting-merge.yml` e
`firebase-hosting-pull-request.yml`) como `vars.VITE_FIREBASE_*`, num
bloco `env:` antes do `npm run build`.

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
e deploy em produção via `FirebaseExtended/action-hosting-deploy` (pinned por
SHA, ver abaixo), com `channelId: live`.

Também **publica as regras de segurança do Firestore**, num passo próprio:
a action de Hosting não cobre regras, e regras não têm canal de preview
(são globais do projeto), então o merge é o único ponto onde elas sobem —
ver [docs/tdr/0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md).
O passo roda **antes** do deploy de Hosting (se as regras falharem, o
cliente novo nem sobe) e usa `npx firebase-tools` com a mesma service
account, autenticando por um arquivo temporário em `$RUNNER_TEMP`
apontado por `GOOGLE_APPLICATION_CREDENTIALS` — o mesmo padrão que o job
`cleanup_preview` já usava. A credencial é apagada num passo
`if: always()` ao fim do job.

O workflow tem `permissions: contents: read`, como o `ci.yml`.

### `firebase-hosting-pull-request.yml`

Dispara em todo pull request, mas só quando o PR **não** é de fork
(`if: head.repo.full_name == github.repository`), para não expor os
secrets de deploy a um fork. Faz build e um *preview deploy* (canal
temporário, expira em ~7 dias), comentando a URL de preview automaticamente
no PR. Roda no job chamado **`build_and_preview`** — esse nome é
importante porque é o identificador usado na regra de proteção de branch
abaixo.

Ambos (`firebase-hosting-merge.yml` e `firebase-hosting-pull-request.yml`)
usam `actions/setup-node` (Node 22) antes do build, e a versão `v0` do
`FirebaseExtended/action-hosting-deploy` — as três actions com a tag fixada
por SHA de commit (ver seção "Pinning de actions por SHA" abaixo). A versão
do Node é a mesma nos três workflows (incluindo `ci.yml`) e corresponde ao
`engines.node` do `package.json` — ver
[docs/tdr/0004](tdr/0004-ci-roda-lint-e-testes.md) para o porquê (Node 20
nunca rodou os testes em CI porque não é suportado por `jsdom`/`vitest`, só
ninguém tinha notado).

### `ci.yml`

Lint (`npm run lint`, oxlint), testes (`npm test`, Vitest) e testes das
regras de segurança do Firestore (`npm run test:rules`, Vitest contra o
emulador), rodando em todo PR (**inclusive de fork**, já que não usa
secret nenhum — o emulador roda offline num projeto `demo-`) e em todo
push na `main`. Ver [docs/tdr/0004](tdr/0004-ci-roda-lint-e-testes.md)
para o motivo de ser um workflow separado do deploy, em vez de dois
`run` a mais no `build_and_preview` — em resumo: cobrir PRs de fork e ter
um status check com nome próprio (`ci`), distinto de uma falha de deploy.

Roda no job chamado **`ci`** — assim como `build_and_preview`, esse nome
precisa ser adicionado à lista de required status checks da branch `main`
(ver seção abaixo) depois que o workflow rodar ao menos uma vez.

Usa `actions/checkout`, `actions/setup-node` e `actions/setup-java`
pinados por SHA de commit (comentário `# vX.Y.Z` ao lado indica a tag
correspondente), em vez de `@v4` — reduz a superfície de um ataque de
supply-chain via tag re-apontada. Ver seção "Pinning de actions por SHA"
abaixo. O `setup-java` existe porque o emulador do Firestore roda na JVM
e o `firebase-tools` exige JDK 21+ (ver
[docs/tdr/0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md)).

## Pinning de actions por SHA

Todas as ações de terceiros/GitHub usadas nos workflows são referenciadas
por SHA de commit completo, com a tag correspondente como comentário ao
lado (`# v4.4.0`, `# v0`). Isso impede que uma tag móvel (`@v4`, `@v0`) seja
re-apontada por um mantenedor ou atacante para um commit arbitrário: cada
execução usa exatamente o código revisado. O comentário da tag não é
decorativo — além de documentar a versão, é o que o Dependabot (ecossistema
`github-actions`, se for configurado num item futuro — ver
[docs/tdr/0006](tdr/0006-pinning-actions-por-sha.md)) lê para saber qual
versão está fixada e propor a atualização do SHA.

| Action | SHA fixado | Tag |
|---|---|---|
| `actions/checkout` | `11d5960a326750d5838078e36cf38b85af677262` | `v4.4.0` |
| `actions/setup-node` | `49933ea5288caeca8642d1e84afbd3f7d6820020` | `v4.4.0` |
| `actions/setup-java` | `c5195efecf7bdfc987ee8bae7a71cb8b11521c00` | `v4.7.1` |
| `FirebaseExtended/action-hosting-deploy` | `500ac625ca2dd40cbd15f7659af953801858032a` | `v0` |

Para re-resolver os SHAs atuais das tags no futuro:

```bash
gh api repos/actions/checkout/commits/v4 --jq .sha
gh api repos/actions/setup-node/commits/v4 --jq .sha
gh api repos/actions/setup-java/commits/v4 --jq .sha
gh api repos/FirebaseExtended/action-hosting-deploy/commits/v0 --jq .sha
```

`actions/setup-java` entrou com os testes de regras do Firestore: o
emulador roda na JVM e o `firebase-tools` exige JDK 21+, então a versão é
fixada em vez de depender do default da imagem do runner, que muda entre
versões.

### `firebase-tools` (pacote npm, não action)

O `sha_pinning_required` acima governa referências `uses:` a actions, não
pacotes npm. Ainda assim, os dois lugares onde o `firebase-tools` é
executado por `npx` usam **versão exata** (`firebase-tools@15.29.0`), e
não `@latest`:

| Workflow | Comando |
|---|---|
| `firebase-hosting-merge.yml` | `deploy --only firestore:rules` |
| `firebase-hosting-pull-request.yml` (`cleanup_preview`) | `hosting:channel:delete` |

O motivo é o mesmo do pinning por SHA, agravado: os dois rodam **com a
chave da service account no ambiente**, então uma tag móvel apontando
para uma publicação maliciosa executaria com credencial de deploy. O bump
passa a ser manual e deliberado (ver
[docs/tdr/0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md)).
O `npm run test:rules`, no `ci.yml`, usa a mesma versão fixada — mas ali
não há credencial nenhuma.

## Permissões de GitHub Actions

A política de Actions do repositório (via
`repos/useful-toys/Iconula/actions/permissions`) é:
`enabled: true`, `allowed_actions: all`, `sha_pinning_required: true`. O
`sha_pinning_required` obriga que toda ação referenciada nos workflows do
repositório use um SHA de commit completo — um `@v4` solto volta a falhar
no CI/status check, impedindo a regressão por descuido. Ver
[docs/tdr/0006](tdr/0006-pinning-actions-por-sha.md).

Como foi configurado:

```bash
gh api -X PUT repos/useful-toys/Iconula/actions/permissions \
  -F enabled=true -f allowed_actions=all -F sha_pinning_required=true
```

## Proteção da branch `main`

Configurada para exigir que o workflow de preview deploy (`build_and_preview`)
passe antes de permitir merge de qualquer PR (ver
[docs/adr/0004](adr/0004-branch-protection-preview-required.md)); depois
estendida para exigir também o job de lint/testes (`ci`, ver
[docs/tdr/0004](tdr/0004-ci-roda-lint-e-testes.md)).

Numa terceira etapa (2026-09-07) a regra foi endurecida para **também valer
para administradores** e exigir PR. Até então, `enforce_admins: false` e
`required_pull_request_reviews: null` deixavam um `git push origin main`
publicar em produção sem passar por check nenhum — os checks só barravam o
botão de merge do PR. Ver a
[atualização no ADR 0004](adr/0004-branch-protection-preview-required.md),
que descreve o que a regra garante e o que continua fora do alcance dela.

Como foi configurada (via API do GitHub, já que a UI e os flags do `gh api`
não aceitam bem tipos booleanos/arrays diretamente — foi necessário um
payload JSON):

```bash
cat > branch_protection.json <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build_and_preview", "ci"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_last_push_approval": false
  },
  "required_linear_history": true,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "restrictions": null
}
JSON

gh api repos/useful-toys/Iconula/branches/main/protection \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  --input branch_protection.json
```

Notas sobre esse payload:

- `required_approving_review_count: 0` é o que torna a regra viável num
  repositório de um desenvolvedor só: força o fluxo de PR (e portanto os
  checks) sem exigir um revisor que não existe.
- `required_linear_history: true` combina com o merge por squash já em uso.
- `enforce_admins: true` significa que o dono também precisa de PR para
  qualquer alteração em `main`, inclusive um typo no README.
- `required_signatures` **não é aceito neste endpoint**, apesar de aparecer
  no objeto de leitura. Para exigir commits assinados é preciso o endpoint
  próprio — e ter GPG/SSH signing configurado localmente antes, senão você
  se tranca para fora do próprio repositório:

  ```bash
  gh api -X POST repos/useful-toys/Iconula/branches/main/protection/required_signatures -H "Accept: application/vnd.github+json"
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
7. Habilitar os recursos de segurança gratuitos (ver seção "Segurança e
   análise do repositório" acima)
