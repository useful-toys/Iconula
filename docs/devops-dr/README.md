<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Índice de DDRs

Todo DevOps Decision Record do projeto. Ver [CLAUDE.md](CLAUDE.md)
para o escopo, a estrutura obrigatória e o guia de estilo. Ao criar um
DDR ou mudar seu `## Status`, atualize a linha correspondente
**no mesmo commit**.

| Nº | Título | Status | Tags | Resumo |
|---|---|---|---|---|
| [DDR 0001](0001-csp-headers-e-configuracao-de-hosting.md) | CSP, headers de segurança e cache no Firebase Hosting | Aceito (consolida TDR 0002, 0005, 0007) | seguranca, csp, deploy, analytics | CSP restritiva, headers de segurança e cache no firebase.json; consolida a evolução para Auth, Firestore e Analytics (GA4). |
| [DDR 0002](0002-workflow-de-ci-separado.md) | Workflow de CI separado para lint e testes | Aceito (migra TDR 0004) | ci, seguranca | Workflow `ci.yml` independente, roda em PRs de fork, required status check. |
| [DDR 0003](0003-pinning-de-actions-por-sha.md) | Pinning de actions do GitHub por SHA | Aceito (migra TDR 0006) | ci, seguranca | Actions fixadas por SHA, `sha_pinning_required: true`, versão do firebase-tools fixada. |
| [DDR 0004](0004-deploy-e-teste-das-regras-do-firestore.md) | Deploy e teste das regras do Firestore | Aceito (migra TDR 0008) | firestore, seguranca, ci | Regras com isolamento por uid, testes no emulador, deploy no merge antes do Hosting. |
| [DDR 0005](0005-protecao-da-branch-main.md) | Proteção da branch main | Aceito | deploy, seguranca | Required checks (ci + preview), enforce admins, linear history, sem force push. |
| [DDR 0006](0006-ferramentas-de-seguranca-do-repositorio.md) | Ferramentas de segurança do repositório | Aceito | seguranca | Secret scanning + push protection, Dependabot alerts/security updates e CodeQL code scanning (default setup) habilitados. |
| [DDR 0007](0007-ciclo-de-vida-dos-canais-de-preview.md) | Ciclo de vida dos canais de preview | Aceito | deploy, ci | Naming explícito (`pr<N>`), expiração de 3 dias, cleanup automático ao fechar, restrição a PRs do próprio repositório. |
| [DDR 0008](0008-autorizacao-do-dominio-de-preview-no-firebase-auth.md) | Autorização do domínio de preview no Firebase Auth | Aceito | deploy, ci | Host do canal entra nos authorized domains no deploy e sai ao fechar o PR ou na varredura diária; script com `curl`/`jq`/`gcloud` que lê, grava e relê a lista. |
| [DDR 0009](0009-role-custom-minima-para-authorized-domains.md) | Role custom mínima para editar authorized domains | Aceito | seguranca, deploy | Service account do CI com `authorizedDomainsEditor` (`firebaseauth.configs.get/update`), sem acesso a usuários; `roles/firebaseauth.admin` descartada. |
| [DDR 0010](0010-scripts-de-shell-com-lf.md) | Scripts de shell com LF | Aceito | ci | `.gitattributes` com `*.sh text eol=lf`: scripts executados no runner Linux têm LF independente do `core.autocrlf`. |
| [DDR 0011](0011-procedimentos-manuais-de-privacidade.md) | Procedimentos manuais de privacidade — purga e incidente | Aceito | seguranca, privacidade | Purga por inatividade e resposta a incidente executadas à mão pelo controlador, com runbook em `docs/privacidade.md`; automação depende do plano Blaze. |
