<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0001: CSP, headers de segurança e cache no Firebase Hosting

## Status

Aceito (consolida TDR 0002, TDR 0005 e TDR 0007)

## Contexto

- `firebase.json` não tinha seção `headers` — a resposta do Hosting
  trazia só o HSTS automático do Firebase, sem CSP nem headers de
  segurança.
- Com a introdução de Firebase Auth (login Google) e Cloud Firestore,
  cada integração exigiu concessões pontuais na CSP — documentadas
  originalmente em três TDRs separados (0002, 0005, 0007).
- `npm run dev` (Vite) não valida CSP — os headers só existem no
  Firebase Hosting de verdade (produção ou preview deploy de PR). Toda
  validação de CSP exige preview deploy real.

## Decisão

### Headers de segurança (TDR 0002)

`hosting.headers` no `firebase.json`:

- `Content-Security-Policy` (ver política consolidada abaixo)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY` (redundante com `frame-ancestors 'none'`,
  mantido para navegadores sem CSP nível 2)
- `Permissions-Policy`: geolocalização, câmera, microfone, pagamento,
  USB e `interest-cohort` desativados
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` (relaxado de
  `same-origin` para permitir o popup do OAuth — TDR 0005)

### Indexação do catálogo compartilhado

- `/catalogo/**`: `X-Robots-Tag: noindex` — a vista do link
  ([IDR 0055](../idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)) não entra em buscadores, nem se o link
  vazar para página pública
- Implementação: a planejar (/planejar)

### Cache (TDR 0002)

- `/assets/**` (com hash): `public, max-age=31536000, immutable`
- `/index.html` e `/`: `no-cache` — deploy visível imediatamente
- `source: "/"` separado de `source: "/index.html"` porque o Hosting
  casa o path pedido antes do rewrite

### CSP para Firebase Auth (TDR 0005)

Concessões adicionadas para o login Google:

- `img-src`: `https://lh3.googleusercontent.com` (foto de perfil)
- `connect-src`: `https://identitytoolkit.googleapis.com` e
  `https://securetoken.googleapis.com` (chamadas REST do Auth)
- `frame-src`: `https://iconula.firebaseapp.com` (iframe oculto de
  autenticação)
- `script-src`: `https://apis.google.com` + hash do script inline do
  gapi — custo estrutural do `@firebase/auth`, independente de
  popup/redirect
- `script-src-attr`: hash do event handler inline do gapi

### CSP para Cloud Firestore (TDR 0007)

- `connect-src`: `https://firestore.googleapis.com`
- `wss:` não é necessário — verificado no bundle: zero ocorrências de
  WebSocket no SDK do Firestore; o transporte é WebChannel sobre HTTPS

### Política consolidada em vigor

```
default-src 'self';
script-src 'self' https://apis.google.com 'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU=';
script-src-attr 'unsafe-hashes' 'sha256-2rvfFrggTCtyF5WOiTri1gDS8Boibj4Njn0e+VCBmDI=';
style-src 'self'; style-src-attr 'none';
img-src 'self' data: https://lh3.googleusercontent.com;
font-src 'self';
connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com;
frame-src 'self' https://iconula.firebaseapp.com https://apis.google.com;
object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';
upgrade-insecure-requests
```

### Descobertas importantes (TDR 0005)

- **gapi é inevitável**: o `@firebase/auth` — modular ou compat, popup
  ou redirect — mantém `gapiScript` fixo e iframe oculto para
  reconciliar eventos de autenticação. Nenhuma escolha de `signInFlow`
  evita essa exceção de CSP.
- **`signInWithRedirect` não funciona com domínio externo**: o
  `authDomain` precisa ser a mesma origem do app. Com
  `iconula.firebaseapp.com` como authDomain e o app em
  `iconula.web.app`, o particionamento de storage de terceiros (Chrome
  ≥115, Safari/ITP, Firefox) quebra o fluxo. Popup é imune porque a
  janela é top-level em `firebaseapp.com`.
- **Hashes do gapi são instáveis**: vêm de CDN do Google, não de
  dependência versionada. Se o Google mudar o conteúdo, o login quebra
  em produção até atualizarmos os hashes.

## Consequências

- CSP completamente fechada para assets próprios — sem `'unsafe-inline'`
  / `'unsafe-eval'` e sem curinga
- Bandeiras Twemoji vendorizadas em `src/assets/flags/`, então
  `img-src` não precisa de CDN externo
- Qualquer novo provedor de login ou API do Google exige ajustar a CSP
  explicitamente — nunca usar `'unsafe-inline'`/`'unsafe-eval'` como
  atalho
- A exceção para `apis.google.com` é dependência de terceiro fora do
  controle de versão — se o Google mudar o conteúdo do `api.js`, os
  hashes param de bater e o login quebra
- Verificação após deploy: `curl -sI https://iconula.web.app` deve
  trazer os headers; testar login completando o fluxo até o fim
- **Testar sempre contra preview deploy real, nunca só `npm run dev`**

## Alternativas consideradas

- **Catálogo por link sem `noindex`**: rejeitado — catálogos ligados
  poderiam ser indexados se o link vazar para página pública
- **`connect-src https://*.googleapis.com`**: rejeitado — curinga que
  autorizaria dezenas de APIs não usadas
- **`wss:` preventivamente**: rejeitado — abriria a política com base em
  folclore; o bundle confirma zero WebSocket no SDK do Firestore
- **Realtime Database**: exigiria `wss:` e endpoint `*.firebaseio.com`;
  descartado por motivos de modelo de dados
- **Manter `signInFlow: "redirect"`**: rejeitado — particionamento de
  storage quebra o fluxo com domínio externo
- **Apontar `VITE_FIREBASE_AUTH_DOMAIN` para o host do app**: funciona,
  mas exige registrar cada host (inclusive canais de preview efêmeros)
  nos Authorized redirect URIs do OAuth client

## Histórico

- 2026-09-16 — Esmiuçamento do catálogo compartilhado por link
  ([IDR 0055](../idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)): `X-Robots-Tag: noindex` em `/catalogo/**`;
  implementação a planejar. Antes: os mesmos headers para todo caminho.
