<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0007: CSP para o Cloud Firestore

## Status

Aceito.

## Contexto

- A CSP do `firebase.json` (ver
  [TDR 0002](0002-headers-de-seguranca-hosting.md) e
  [TDR 0005](0005-csp-firebase-auth-google-oauth.md)) bloqueia tudo que
  não seja `'self'` por padrão. A persistência do time visível no
  Firestore ([ADR 0007](../adr/0007-persistencia-do-time-no-firestore.md))
  introduz tráfego para uma origem nova.
- Dúvida concreta: o SDK web do Firestore exige `wss:` no `connect-src`,
  além do endpoint HTTPS? A literatura na internet mistura os dois SDKs
  do Firebase nesse ponto, e adicionar `wss:` "por garantia" abriria a
  política sem necessidade — o oposto do que os TDRs 0002 e 0005 vinham
  fazendo.

## Decisão

**Uma única diretiva muda.** `connect-src` ganha
`https://firestore.googleapis.com`:

```
connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com;
```

**`wss:` não é necessário.** Verificado do mesmo jeito que o TDR 0005
verificou a dependência do gapi — indo ao bundle publicado do pacote
`firebase` (12.x), não à documentação:

```bash
grep -c "WebSocket\|wss://" node_modules/firebase/firebase-firestore.js
# → 0
```

Zero ocorrências: o SDK do Firestore não tem caminho de código com
WebSocket. O transporte é **WebChannel sobre HTTPS** (a implementação
Closure: `WebChannelTransport` / `WebChannelConnection`), que é
XHR/`fetch` com streaming e long-polling — governado por `connect-src`
com o endpoint HTTPS, não por `connect-src wss:`. O host default aparece
uma única vez no bundle, como `firestore.googleapis.com`.

A confusão com `wss:` vem do **Realtime Database** (`firebase/database`,
`wss://*.firebaseio.com`), que este projeto não usa e que foi descartado
no ADR 0007 justamente entre outros motivos por isso.

**Nada mais na política se mexe**: sem `script-src`, `frame-src`,
`img-src` ou `worker-src` novos. O `getFirestore()` é usado sem
persistência local (`IndexedDB`), sem `initializeFirestore()` com cache
customizado e sem web worker, então não há superfície adicional.

## Consequências

- A CSP continua sem `'unsafe-inline'`/`'unsafe-eval'` e sem curinga —
  uma origem nomeada a mais, e só.
- **Esta mudança não pode ser validada com `npm run dev`.** Vale
  integralmente a restrição do [TDR 0005](0005-csp-firebase-auth-google-oauth.md):
  os headers do `firebase.json` só existem no Firebase Hosting de verdade
  (produção ou canal de preview de PR); `firebase serve --only hosting`
  também não os reproduz. O único jeito confiável é um preview deploy
  real — `firebase hosting:channel:deploy pr<N>` itera mais rápido que
  esperar o CI.
- **E só se manifesta depois do login.** Uma sessão deslogada nunca toca
  em `firestore.googleapis.com`, então testar o preview sem completar o
  fluxo de autenticação não prova nada — mesmo erro de método que o
  TDR 0005 documenta na "Tentativa 1". Verificação correta: completar o
  login no host de preview, clicar, e conferir **o console (violação de
  CSP) e a aba Network** (a requisição de escrita deve existir e
  completar).
- **O sintoma de uma falha aqui é silencioso**: pela política de erro do
  ADR 0007, uma requisição bloqueada pela CSP vira `console.error` e a
  preferência é perdida sem nada aparecer na tela. Não dá para descobrir
  isso "usando o app" — tem que olhar o DevTools.
- Verificação após deploy, no mesmo padrão dos TDRs 0002 e 0005:
  `curl -sI https://iconula.web.app` deve trazer
  `firestore.googleapis.com` dentro do `connect-src`.

## Alternativas consideradas

- **Adicionar `wss:` preventivamente**: rejeitado. Abriria a política com
  base em folclore, e a checagem no bundle levou menos tempo que a
  discussão. Se algum dia o SDK mudar de transporte, o sintoma aparecerá
  como violação de CSP no preview deploy — e aí sim se abre a exceção,
  com evidência.
- **`connect-src https://*.googleapis.com`**: cobriria Firestore, Auth e
  qualquer API futura do Google de uma vez. Rejeitado por ser um curinga
  que também autorizaria dezenas de APIs que o app não usa —
  contraria a linha dos TDRs 0002/0005 de listar origens uma a uma.
- **Realtime Database em vez de Firestore**: exigiria `wss:` e um
  endpoint `*.firebaseio.com`. Descartado no ADR 0007 por motivos de
  modelo de dados; a CSP mais fechada é um bônus.
