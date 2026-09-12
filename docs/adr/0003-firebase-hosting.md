<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0003: Firebase Hosting

## Status

Aceito.

## Contexto

- A aplicação é uma SPA (ver [ADR 0001](0001-aplicacao-spa.md)) construída com Vite + React (ver [ADR 0002](0002-stack-vite-react.md)).
- O build gera arquivos estáticos em `dist/` que precisam ser hospedados em algum lugar.
- Precisamos de hospedagem simples, com suporte a domínio customizado e HTTPS automático.
- O projeto já usa serviços Google (a ser decidido: Auth, Firestore), então faz sentido usar o ecossistema Firebase.

## Decisão

Hospedar a aplicação no **Firebase Hosting**, projeto Firebase `iconula`.

- Domínio padrão: `iconula.web.app` (fornecido pelo Firebase)
- Domínio customizado: `iconula.danielferber.com.br` (configurado via DNS)
- HTTPS automático para ambos os domínios
- Configuração em `firebase.json` e `.firebaserc`

## Consequências

- Deploy manual via `firebase deploy --only hosting` ou automatizado via CI/CD.
- Preview deploys automáticos em pull requests (configurado via GitHub Actions, ver TDR correspondente).
- CSP e headers de segurança configurados em `firebase.json`.
- Faixa gratuita do Firebase Hosting comporta o tráfego esperado.

## Alternativas consideradas

- **GitHub Pages**: mais simples, mas sem suporte nativo a preview deploys por PR e sem integração com o ecossistema Firebase. Descartado.
- **Vercel/Netlify**: já resolvem esse fluxo nativamente, mas o usuário optou explicitamente por Firebase Hosting para manter tudo no ecossistema Google/Firebase.
- **Outro hosting estático (S3, CloudFront, etc.)**: mais complexo de configurar, sem benefício claro sobre Firebase Hosting para este caso.
