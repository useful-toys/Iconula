<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DevOps do Iconula

Estado atual da infraestrutura de CI/CD, deploy e segurança do
repositório. As decisões individuais estão nos
[DDRs](devops-dr/README.md); este documento monta o panorama.

## Repositório

- **GitHub**: organização `useful-toys`, repositório `iconula`
- **Visibilidade**: público
- **Branch default**: `main`
- **Branch protection**: required checks, enforce admins, linear history
  (ver [DDR 0005](devops-dr/0005-protecao-da-branch-main.md))

## Workflows

Quatro workflows no `.github/workflows/`:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | PR + push na `main` | Lint, testes (Vitest + emulador Firestore), build |
| `firebase-hosting-merge.yml` | Push na `main` | Deploy em produção (Hosting + regras do Firestore) |
| `firebase-hosting-pull-request.yml` | PR (open/sync/reopen/close) | Preview deploy + domínio autorizado no Auth; cleanup de ambos ao fechar |
| `firebase-preview-domains-sweep.yml` | Diário + manual | Remove dos authorized domains os hosts de preview sem canal ativo |

- **Actions pinadas por SHA** em todos os workflows
  ([DDR 0003](devops-dr/0003-pinning-de-actions-por-sha.md))
- **`firebase-tools@15.29.0`** fixado nos jobs que usam credencial
- **Scripts de shell** em `.github/scripts/`, sempre com LF
  (`.gitattributes`, [DDR 0010](devops-dr/0010-scripts-de-shell-com-lf.md))
- **Node 22** em todos os workflows; JDK 21 para o emulador do Firestore
- **Secrets**: `FIREBASE_SERVICE_ACCOUNT_ICONULA` (chave JSON da service
  account), usada em `$RUNNER_TEMP` e apagada em step `if: always()`

## Validação local

Os mesmos scripts rodam local e no CI — qualquer falha de CI é
reproduzível localmente sem depender de push
([DDR 0002](devops-dr/0002-workflow-de-ci-separado.md)):

| Script | Ferramenta | O que valida |
|---|---|---|
| `npm run lint` | **oxlint** | Regras estáticas: `react/no-danger` (XSS), `react/rules-of-hooks`, etc. |
| `npm test` | **Vitest** + **jsdom** + **React Testing Library** | Testes de unidade e integração dos componentes React |
| `npm run test:rules` | **Vitest** + **@firebase/rules-unit-testing** + **emulador Firestore** | Regras de segurança do Firestore (exige JDK 21+) |
| `npm run build` | **Vite** | Build de produção em `dist/` |

- **Configs separadas**: `vite.config.js` (testes de componentes,
  `environment: "jsdom"`) e `vitest.rules.config.js` (testes de regras,
  `environment: "node"`, timeouts maiores para o emulador)
- **Node 22** obrigatório (`engines.node` no `package.json`): `jsdom` v30
  exige `"node": "^22.22.2 || ^24.15.0 || >=26.0.0"`

## Deploy

- **Produção**: merge na `main` → `firebase-hosting-merge.yml` →
  Firebase Hosting (canal `live`) + regras do Firestore
- **Preview**: PR → `firebase-hosting-pull-request.yml` → canal
  `pr<número>` com expiração de 3 dias; cleanup automático ao fechar o PR
  ([DDR 0007](devops-dr/0007-ciclo-de-vida-dos-canais-de-preview.md))
- **Login no preview**: o host do canal entra nos authorized domains do
  Firebase Auth no deploy e sai ao fechar o PR ou na varredura diária de
  canais expirados (`.github/scripts/dominios-autorizados-preview.sh`,
  [DDR 0008](devops-dr/0008-autorizacao-do-dominio-de-preview-no-firebase-auth.md))
- **Regras do Firestore**: deploy só no merge (são globais do projeto,
  sem canal de preview) — ver
  [DDR 0004](devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md)
- **PRs de fork**: não têm preview deploy (protege secrets), mas
  continuam tendo lint/testes via `ci.yml`

## Segurança

### Ferramentas do GitHub

- **Secret scanning**: habilitado
- **Secret scanning — push protection**: habilitado (bloqueia push com
  secrets conhecidos)
- **Dependabot alerts**: habilitado
- **Dependabot security updates**: habilitado
- **CodeQL code scanning**: default setup (Actions + JavaScript/TypeScript;
  roda em PR, push na `main` e varredura semanal)
- **SHA pinning obrigatório**: `sha_pinning_required: true`

(ver [DDR 0006](devops-dr/0006-ferramentas-de-seguranca-do-repositorio.md))

### CSP e headers

- CSP restritiva no `firebase.json`: `default-src 'self'`, com
  concessões pontuais para Firebase Auth e Firestore
- Headers de segurança: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`
- Cache: assets com hash (`immutable`), `index.html` e `/` com `no-cache`

(ver [DDR 0001](devops-dr/0001-csp-headers-e-configuracao-de-hosting.md))

### Regras do Firestore

- Isolamento por uid: `request.auth.uid == userId`
- Schema validado com `hasOnly`, tipos e tamanhos
- Testes no emulador (`npm run test:rules`) rodando no CI a cada PR
- IAM mínimo: `roles/firebaserules.admin` + `roles/firebase.viewer`

(ver [DDR 0004](devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md)
e [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md))

## Secrets e variáveis

### Secrets do repositório

- `FIREBASE_SERVICE_ACCOUNT_ICONULA`: chave JSON da service account com
  permissão de deploy (Hosting + regras do Firestore) e de editar os
  authorized domains do Auth (role custom `authorizedDomainsEditor`,
  [DDR 0009](devops-dr/0009-role-custom-minima-para-authorized-domains.md))

### Variáveis do repositório

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Ambientes

- **Produção**: `iconula.web.app` / `iconula.danielferber.com.br`
- **Preview**: `iconula--pr<número>-<hash>.web.app` (efêmero, 3 dias;
  autorizado no login do Auth enquanto o canal existir)
- **Emulador**: projeto `demo-iconula` (offline, sem credencial) para
  testes das regras do Firestore

## Configuração dos ambientes

- [docs/setup-firebase.md](setup-firebase.md): projeto Firebase, Hosting, Auth
- [docs/setup-gcloud.md](setup-gcloud.md): APIs, service account, IAM
- [docs/setup-github.md](setup-github.md): secrets, workflows, branch protection
- [docs/setup-registrobr.md](setup-registrobr.md): DNS do domínio customizado
