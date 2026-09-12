<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Índice de ADRs

Todo Architecture Decision Record do projeto. Ver [CLAUDE.md](CLAUDE.md)
para o escopo, a estrutura obrigatória e o guia de estilo. Ao criar um ADR
ou mudar seu `## Status`, atualize a linha correspondente **no mesmo
commit**.

| Nº | Título | Status | Tags | Resumo |
|---|---|---|---|---|
| [ADR 0001](0001-stack-vite-react.md) | Stack Vite + React | Aceito | stack, build | Vite como build tool e React como UI, template padrão do `create-vite`. |
| [ADR 0002](0002-bandeiras-emoji-unicode.md) | Bandeiras como emoji Unicode via Twemoji | Aceito (revisado 2x) | bandeiras, assets | Dado continua emoji Unicode; renderização via SVG do Twemoji vendorizado, sem CDN em runtime. |
| [ADR 0003](0003-deploy-firebase-hosting-github-actions.md) | Deploy via Firebase Hosting + GitHub Actions | Aceito | deploy, ci | Firebase Hosting com deploy e preview automatizados por GitHub Actions a cada PR. |
| [ADR 0004](0004-branch-protection-preview-required.md) | Branch protection exigindo o preview deploy antes do merge | Aceito | deploy, seguranca | `main` exige PR com `build_and_preview` e `ci` verdes, inclusive para o admin (zero aprovações exigidas). |
| [ADR 0005](0005-substituido-autenticacao-google-firebase-auth.md) | Autenticação com Google via Firebase Auth + FirebaseUI | Substituído pelo [ADR 0006](0006-login-google-sdk-modular.md) | auth | FirebaseUI + API compat do Firebase para login Google — substituído pelo SDK modular. |
| [ADR 0006](0006-login-google-sdk-modular.md) | Login com Google via SDK modular, sem FirebaseUI | Aceito — substitui o [ADR 0005](0005-substituido-autenticacao-google-firebase-auth.md) | auth | Login Google via SDK modular, sem FirebaseUI — remove dívida de versão e zera vulnerabilidades do `npm audit`. |
| [ADR 0007](0007-persistencia-do-time-no-firestore.md) | Persistência do time visível no Cloud Firestore | Aceito | firestore, persistencia | Time visível persistido em `users/{uid}` no Firestore; SDK carregado sob demanda para não pesar o bundle. |
| [ADR 0008](0008-schema-da-colecao-mapa-esparso.md) | Schema da coleção — mapa esparso em `users/{uid}` | Aceito | firestore, persistencia, schema | Mapa esparso de contagens (teto 99), gravação agregada com debounce, flush garantido por persistência local. |
