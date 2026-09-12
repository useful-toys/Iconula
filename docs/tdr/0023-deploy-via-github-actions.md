<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0023: Deploy via GitHub Actions

## Status

Aceito.

## Contexto

- A aplicação é hospedada no Firebase Hosting (ver [ADR 0003](../adr/0003-firebase-hosting.md)).
- O repositório está no GitHub, na organização `useful-toys`.
- Precisamos de deploy automatizado a partir do repositório, incluindo preview deploys em pull requests.

## Decisão

- Repositório GitHub público, na organização **`useful-toys`**.
- Deploy automatizado via **GitHub Actions**, usando os workflows gerados por `firebase init hosting:github`:
  - `firebase-hosting-merge.yml`: deploy em produção a cada push/merge na branch `main`.
  - `firebase-hosting-pull-request.yml`: preview deploy temporário em cada pull request, usando `FirebaseExtended/action-hosting-deploy@v0`.
- Ambos os workflows rodam `npm ci && npm run build` antes do deploy, já que `dist/` não é versionado (está no `.gitignore`).

## Consequências

- Todo PR gera automaticamente uma URL de preview, facilitando revisão visual antes do merge.
- O preview deploy é usado como required status check da branch `main` (ver [TDR 0024](0024-branch-protection-preview-required.md)).
- Credencial de deploy fica armazenada como secret do repositório (`FIREBASE_SERVICE_ACCOUNT_...`), gerada e registrada automaticamente pelo `firebase init hosting:github`.

## Alternativas consideradas

- **Deploy manual via `firebase deploy`**: mais simples, mas propenso a erros e sem preview deploys automáticos. Descartado.
- **Outro CI/CD (GitLab CI, CircleCI, etc.)**: viáveis, mas o GitHub Actions já está integrado ao repositório e tem suporte nativo ao Firebase Hosting via action oficial.
