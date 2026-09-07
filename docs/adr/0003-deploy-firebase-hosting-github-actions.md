<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0003: Deploy via Firebase Hosting + GitHub Actions

## Status

Aceito

## Contexto

O app é um site estático (build do Vite) e precisa de hospedagem simples,
com deploy automatizado a partir do repositório GitHub, incluindo preview
deploys em pull requests.

## Decisão

- Repositório GitHub novo, público, na organização **`useful-toys`**.
- Hospedagem no **Firebase Hosting**, projeto Firebase `iconula` (conta
  Google `danielferber`).
- Deploy automatizado via **GitHub Actions**, usando os workflows gerados
  por `firebase init hosting:github`:
  - `firebase-hosting-merge.yml`: deploy em produção a cada push/merge na
    branch `main`.
  - `firebase-hosting-pull-request.yml`: preview deploy temporário em
    cada pull request, usando `FirebaseExtended/action-hosting-deploy@v0`.
- Ambos os workflows rodam `npm ci && npm run build` antes do deploy,
  já que `dist/` não é versionado (está no `.gitignore`).

## Consequências

- Todo PR gera automaticamente uma URL de preview, facilitando revisão
  visual antes do merge.
- O preview deploy também é usado como *required status check* da branch
  `main` (ver [ADR 0004](0004-branch-protection-preview-required.md)).
- Credencial de deploy fica armazenada como secret do repositório
  (`FIREBASE_SERVICE_ACCOUNT_...`), gerada e registrada automaticamente
  pelo `firebase init hosting:github`.

## Alternativas consideradas

- **GitHub Pages**: mais simples, mas sem suporte nativo a preview
  deploys por PR; descartado em favor do fluxo de preview do Firebase.
- **Vercel/Netlify**: já resolvem esse fluxo nativamente, mas o usuário
  optou explicitamente por Firebase Hosting.
