<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0003: Firebase Hosting

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) construída com Vite + React (ver [ADR 0002](0002-stack-vite-react.md)).
- O build gera arquivos estáticos em `dist/` que precisam ser hospedados em algum lugar.
- Precisamos de hospedagem simples, com suporte a domínio customizado e HTTPS automático.
- O projeto já usa serviços Google — Auth ([ADR 0004](0004-login-google-sdk-modular.md)) e Firestore ([ADR 0005](0005-persistencia-no-firestore.md)) —, então faz sentido usar o ecossistema Firebase.

## Decisão

Hospedar a aplicação no **Firebase Hosting**, projeto Firebase `iconula`.

- Domínio padrão: `iconula.web.app` (fornecido pelo Firebase)
- Domínio customizado: `iconula.danielferber.com.br` (configurado via DNS)
- HTTPS automático para ambos os domínios
- Configuração em `firebase.json` e `.firebaserc`

## Consequências

- Deploy manual via `firebase deploy --only hosting` ou automatizado via CI/CD.
- Preview deploys automáticos em pull requests (configurado via GitHub Actions — [DDR 0002](../devops-dr/0002-workflow-de-ci-separado.md)).
- CSP e headers de segurança configurados em `firebase.json` ([DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md)).
- Faixa gratuita do Firebase Hosting comporta o tráfego esperado.

## Alternativas consideradas

- **GitHub Pages**: mais simples, mas sem suporte nativo a preview deploys por PR e sem integração com o ecossistema Firebase. Descartado.
- **Vercel/Netlify**: já resolvem esse fluxo nativamente, mas o usuário optou explicitamente por Firebase Hosting para manter tudo no ecossistema Google/Firebase.
- **Outro hosting estático (S3, CloudFront, etc.)**: mais complexo de configurar, sem benefício claro sobre Firebase Hosting para este caso.

## Histórico

- 2026-09-12 — Sincronização com a base de código: substituídas as referências
  vagas ("ver TDR correspondente", "a ser decidido") pelos registros já
  decididos — [ADR 0004](0004-login-google-sdk-modular.md),
  [ADR 0005](0005-persistencia-no-firestore.md),
  [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md) e
  [DDR 0002](../devops-dr/0002-workflow-de-ci-separado.md).
