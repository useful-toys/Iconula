<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Índice de ADRs

Todo Architecture Decision Record do projeto. Ver [CLAUDE.md](CLAUDE.md)
para o escopo, a estrutura obrigatória e o guia de estilo. Ao criar um ADR
ou mudar seu `## Status`, atualize a linha correspondente **no mesmo
commit**.

| Nº | Título | Status | Tags | Resumo |
|---|---|---|---|---|
| [ADR 0001](0001-aplicacao-spa.md) | Aplicação Single Page Application (SPA) | Aceito | arquitetura | Aplicação construída como SPA, com build gerando arquivos estáticos. |
| [ADR 0002](0002-stack-vite-react.md) | Stack Vite + React | Aceito | stack, build | Vite como build tool e React como UI, template padrão do `create-vite`. |
| [ADR 0003](0003-firebase-hosting.md) | Firebase Hosting | Aceito | deploy, hosting | Hospedagem no Firebase Hosting, com domínio customizado e HTTPS automático. |
| [ADR 0004](0004-login-google-sdk-modular.md) | Login com Google via SDK modular, sem FirebaseUI | Aceito | auth | Login Google via SDK modular, sem FirebaseUI — remove dívida de versão e zera vulnerabilidades do `npm audit`. |
| [ADR 0005](0005-persistencia-no-firestore.md) | Persistência no Cloud Firestore | Aceito | firestore, persistencia | Dados do usuário persistidos em `users/{uid}` no Firestore; SDK carregado sob demanda para não pesar o bundle. Modelo de dados detalhado nos MDRs. |
| [ADR 0006](0006-bandeiras-emoji-unicode.md) | Bandeiras como emoji Unicode via Twemoji | Aceito (revisado 2x) | bandeiras, assets | Dado continua emoji Unicode; renderização via SVG do Twemoji vendorizado, sem CDN em runtime. |
| [ADR 0007](0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md) | Estrutura de pastas e separação de responsabilidades | Aceito | estrutura, arquitetura | `src/data/` (catálogo e derivações puras), `src/lib/` (lógica de negócio sem React), `src/components/` (componentes React com CSS e testes co-localizados). |
| [ADR 0008](0008-css-modular-por-componente.md) | CSS modular por componente | Aceito | css, arquitetura | Cada componente tem seu próprio arquivo CSS co-localizado, importado diretamente. Tokens de design em `theme.css`. |
| [ADR 0009](0009-testes-co-localizados.md) | Testes co-localizados | Aceito | testes, arquitetura | Cada módulo ou componente tem seu arquivo de teste co-localizado (`.test.js` ou `.test.jsx`), no mesmo diretório. |
