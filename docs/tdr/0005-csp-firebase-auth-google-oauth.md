<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0005: CSP e COOP para Firebase Auth + login com Google

## Status

Aceito

## Contexto

A CSP restrita do `firebase.json` (ver [TDR 0002](0002-headers-de-seguranca-hosting.md))
bloqueia, por padrão, tudo que não seja `'self'`. O login com Google via
Firebase Auth ([ADR 0005](../adr/0005-autenticacao-google-firebase-auth.md))
precisa de algumas origens externas específicas, e de um ajuste no
isolamento de origem (`Cross-Origin-Opener-Policy`) para o fluxo de popup
funcionar.

## Decisão

Alterações em `hosting.headers` no `firebase.json`:

- `img-src`: adicionado `https://lh3.googleusercontent.com` — é de onde
  vem a foto de perfil (`photoURL`) do usuário autenticado via Google.
- `connect-src`: adicionado `https://identitytoolkit.googleapis.com` e
  `https://securetoken.googleapis.com` — chamadas REST que o SDK do
  Firebase Auth faz para autenticar e renovar o token de sessão.
- `frame-src` (diretiva nova — antes caía no fallback de `default-src
  'self'`, que já bloquearia o que seria necessário aqui): `'self'
  https://iconula.firebaseapp.com`. O SDK do Firebase Auth carrega um
  iframe oculto em `<authDomain>/__/auth/iframe` para gerenciar eventos
  de autenticação, mesmo em fluxo de popup (`signInFlow: "popup"`, ver
  `LoginButton.jsx`).
- **`Cross-Origin-Opener-Policy`: `same-origin` → `same-origin-allow-popups`.**
  Esta é a mudança menos óbvia: com `same-origin` estrito, a janela
  principal fica isolada dos popups que ela mesma abre — o
  `postMessage`/`window.closed` que `signInWithPopup` usa para repassar o
  resultado do login de volta para a página original fica bloqueado. O
  popup do Google abre normalmente, o usuário completa o login, mas o app
  nunca recebe o resultado (falha silenciosa). `same-origin-allow-popups`
  resolve isso mantendo o isolamento para o resto (ainda impede que uma
  aba que este site abre controle esta página via `window.opener`, exceto
  para popups que este site mesmo abriu).
- `script-src`, `style-src`, `object-src`, `base-uri`, `form-action`,
  `frame-ancestors` não precisaram mudar: `firebase` e `firebaseui` são
  pacotes npm empacotados pelo Vite (código servido como `'self'`, não
  CDN externo); o popup de login do Google roda em contexto de navegação
  separado, não sujeito à CSP desta página.

## Consequências

- Qualquer novo provedor de login (ex.: se um dia se adicionar
  Facebook/Apple/GitHub) provavelmente vai exigir novas origens em
  `img-src` (foto de perfil) e possivelmente `connect-src`/`frame-src` —
  ajustar esta CSP quando isso acontecer, nunca usar
  `'unsafe-inline'`/`'unsafe-eval'` como atalho.
- A relaxação de COOP para `same-origin-allow-popups` é específica do
  fluxo de popup do Firebase Auth; se o app abandonar `signInFlow:
  "popup"` em favor de `"redirect"`, reavaliar se `same-origin` estrito
  volta a ser possível.
- Verificação após deploy (mesmo padrão do TDR 0002):
  `curl -sI https://iconula.web.app` deve trazer a CSP e o COOP
  atualizados acima; testar o login manualmente e checar o console do
  navegador por violações de CSP não previstas aqui.
