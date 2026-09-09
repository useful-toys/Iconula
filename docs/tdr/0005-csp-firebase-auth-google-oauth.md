<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0005: CSP para Firebase Auth + login com Google

## Status

Aceito — **atualizado** pela remoção do FirebaseUI
([ADR 0006](../adr/0006-login-google-sdk-modular.md)).

As concessões que existiam **por causa do widget** foram removidas da CSP:
`style-src https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`,
`img-src https://www.gstatic.com` e o `style-src-attr 'unsafe-hashes'`
(`'sha256-O9Chn…'`). O `style-src-attr` passou a `'none'`.

**As concessões do gapi permanecem**, e este documento é a razão pela qual
elas não foram removidas junto por engano: a análise da "Tentativa 1"
abaixo já havia estabelecido, indo ao bundle publicado, que
`https://apis.google.com` e os dois hashes de `script-src` /
`script-src-attr` são exigidos pelo `@firebase/auth` — **modular ou
compat, popup ou redirect** —, não pelo FirebaseUI. Trocar o widget não
os elimina; só o Google Identity Services eliminaria.

A política em vigor após essa limpeza:

```
default-src 'self';
script-src 'self' https://apis.google.com 'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU=';
script-src-attr 'unsafe-hashes' 'sha256-2rvfFrggTCtyF5WOiTri1gDS8Boibj4Njn0e+VCBmDI=';
style-src 'self'; style-src-attr 'none';
img-src 'self' data: https://lh3.googleusercontent.com;
font-src 'self';
connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com;
frame-src 'self' https://iconula.firebaseapp.com https://apis.google.com;
object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';
upgrade-insecure-requests
```

O texto abaixo é o registro original do diagnóstico, mantido porque as
descobertas continuam válidas. Onde ele descreve entradas de CSP
específicas do FirebaseUI, leia como histórico.

## Contexto

A CSP restrita do `firebase.json` (ver [TDR 0002](0002-headers-de-seguranca-hosting.md))
bloqueia, por padrão, tudo que não seja `'self'`. O login com Google via
Firebase Auth ([ADR 0005](../adr/0005-substituido-autenticacao-google-firebase-auth.md))
precisa de algumas origens externas específicas.

**`npm run dev` (Vite) não valida CSP** — os headers do `firebase.json`
só existem no Firebase Hosting de verdade (produção ou preview deploy de
PR); `firebase serve --only hosting` também não os reproduziu nesta
versão do CLI. Toda descoberta abaixo só apareceu testando o preview
deploy real do PR (a maior parte via deploy manual no mesmo canal do PR,
`firebase hosting:channel:deploy pr<N>`, pra iterar mais rápido que
esperar o CI a cada tentativa) — esse é o único jeito confiável de
validar mudança de CSP neste projeto.

## Decisão

Alterações em `hosting.headers` no `firebase.json`:

- `img-src`: adicionado `https://lh3.googleusercontent.com` (foto de
  perfil do usuário autenticado) e `https://www.gstatic.com` (ícone
  `firebasejs/ui/2.0.0/images/auth/google.svg`, bundlado com o próprio
  FirebaseUI e servido do CDN da Google, não do Vite).
- `style-src`: adicionado `https://fonts.googleapis.com` — o CSS do
  FirebaseUI referencia a fonte Roboto do Google Fonts.
- `font-src`: adicionado `https://fonts.gstatic.com` — os arquivos de
  fonte servidos a partir desse CSS.
- `style-src-attr` (diretiva nova): `'unsafe-hashes'
  'sha256-O9ChnrQJngUlTYptX2rHTyPwYa4VlQslTnAyr1r9/XE='` — o próprio
  FirebaseUI (pacote versionado no `package.json`, não CDN de terceiro)
  define um `style="..."` inline num elemento do seu widget.
- `connect-src`: adicionado `https://identitytoolkit.googleapis.com` e
  `https://securetoken.googleapis.com` — chamadas REST que o SDK do
  Firebase Auth faz para autenticar e renovar o token de sessão.
- `frame-src`: adicionado `'self' https://iconula.firebaseapp.com` — o
  iframe oculto que o SDK usa pra gerenciar eventos de autenticação.

### `script-src`: exceção para `apis.google.com` (gapi) — inevitável, não específica de popup/redirect

**Tentativa 1 (rejeitada) — achar que trocar `signInFlow: "popup"` por
`"redirect"` evitaria abrir o `script-src`.** `signInWithPopup` carrega
`https://apis.google.com/js/api.js` (gapi) pra repassar o resultado
popup↔janela principal via `gapi.iframes`, então a hipótese era trocar
pra `signInFlow: "redirect"` e evitar esse script inteiro. Testado no
preview deploy real (só até a tela de login do Google, sem completar —
ver nota abaixo) e pareceu funcionar: zero violação de CSP na ida.

**Essa hipótese estava errada.** Ao completar o login de verdade (voltando
do redirect), a mesma violação de `apis.google.com` reapareceu. Fui
direto no bundle publicado do pacote `firebase` (`node_modules/firebase/firebase-auth.js`,
não é FirebaseUI) pra confirmar em vez de adivinhar de novo: o
`@firebase/auth` — modular ou compat, popup ou redirect, tanto faz —
mantém um `gapiScript: "https://apis.google.com/js/api.js"` fixo e um
iframe oculto (`style:{position:"absolute",top:"-100px",width:"1px",height:"1px"}`)
usado por um "AuthEventManager" interno pra reconciliar qualquer evento
de autenticação com `<authDomain>/__/auth/iframe`, via `gapi.iframes`.
Esse mecanismo roda **sempre que se usa `signInWithPopup`/`signInWithRedirect`
do Firebase Auth**, independente da escolha de fluxo — não é algo que o
FirebaseUI decide, nem algo configurável.

**Decisão final**: **aceitar a exceção de CSP para o gapi** como custo
estrutural do Firebase Auth, não como atalho evitável — ela é cobrada
nos dois fluxos, então não há escolha de `signInFlow` que a evite:

- `script-src`: adicionado `https://apis.google.com` e o hash
  `'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='` (script inline
  que o gapi injeta — hash estável, confirmado idêntico em duas sessões
  de teste distintas, apesar do nome de callback aleatório em cada uma —
  não está embutido no conteúdo hasheado).
- `script-src-attr` (diretiva nova): `'unsafe-hashes'
  'sha256-2rvfFrggTCtyF5WOiTri1gDS8Boibj4Njn0e+VCBmDI='` — event handler
  inline que o gapi injeta, mesma estabilidade observada.
- `frame-src`: adicionado `https://apis.google.com` — o iframe de
  comunicação do gapi.

Diferença importante do caso do FirebaseUI acima: estes hashes vêm de um
script servido por CDN do Google (`apis.google.com`, não uma dependência
com versão travada no `package.json`) — o Google pode mudar esse
conteúdo sem aviso, quebrando o hash silenciosamente em produção (ao
contrário do FirebaseUI, onde um bump de versão nosso seria pego no
preview deploy do próprio PR antes do merge). Risco aceito conscientemente
por não haver alternativa dentro do Firebase Auth nativo — ver
"Gatilho de revisão futura" no [ADR 0005](../adr/0005-substituido-autenticacao-google-firebase-auth.md)
pra quando reavaliar migrar para Google Identity Services (que não
depende do gapi/resolver do Firebase).

### Tentativa 2 (rejeitada) — manter `signInFlow: "redirect"`

Com a exceção do gapi já paga, o redirect ainda parecia valer pelos
outros motivos (mobile, e não precisar relaxar
`Cross-Origin-Opener-Policy`). **Também estava errado**: com essa CSP no
ar e todas as origens autorizadas, o login ia até o fim no Google, o app
voltava — e nada acontecia. Sem erro no console, sem violação de CSP,
`onAuthStateChanged` nunca disparava, o widget do FirebaseUI só
re-renderizava.

**Causa**: `signInWithRedirect` exige que o `authDomain` seja **a mesma
origem do app**. Aqui não é: o app roda em `iconula.web.app` /
`iconula.danielferber.com.br` / `iconula--pr<N>-<hash>.web.app`, e o
`authDomain` é `iconula.firebaseapp.com`. A sequência quebra assim:

1. o app navega pro handler em `iconula.firebaseapp.com/__/auth/handler`;
2. o handler faz o OAuth e grava o resultado no storage de
   `firebaseapp.com` — nesse momento ele é **first-party** (página de
   topo);
3. o handler redireciona de volta pro app;
4. o SDK carrega o iframe oculto `firebaseapp.com/__/auth/iframe`
   **dentro** do app — agora **third-party**;
5. o iframe vai ler o evento gravado no passo 2 e não acha nada.

O passo 5 falha porque o particionamento de storage de terceiros
(Chrome ≥115, Safari/ITP, Firefox) dá ao iframe um bucket indexado pelo
site de topo — diferente do bucket que o handler escreveu no passo 2. É
uma quebra conhecida e documentada pelo próprio Firebase ("Best
practices for `signInWithRedirect`").

**Como confirmar em 30 segundos**, se o sintoma reaparecer: DevTools →
Network, completar o login e olhar a volta do redirect. A cadeia
`api.js` → `iframe?apiKey=...` (subdocument) → `iframe.js` →
`getProjectConfig` **200** aparece normalmente, e **para aí**. Se o
evento tivesse chegado, o passo seguinte obrigatório seria um POST a
`identitytoolkit.googleapis.com/.../accounts:signInWithIdp` trocando a
credencial OAuth pelo ID token. Ausência desse POST = evento nunca
entregue. Teste definitivo: `chrome://flags/#third-party-storage-partitioning`
→ **Disabled**, reiniciar o Chrome; se o login passar a funcionar, é
isso.

**Decisão final**: voltar a `signInFlow: "popup"`. O popup é imune ao
particionamento — a janela é top-level em `firebaseapp.com` (storage
first-party) e devolve o resultado direto ao opener. Custo:
`Cross-Origin-Opener-Policy` volta de `same-origin` para
`same-origin-allow-popups`, sem o qual o opener perde a referência à
janela do popup e o handshake não fecha. Relaxamento pontual — o
isolamento continua valendo contra qualquer origem que não seja um popup
aberto pela própria página.

Alternativa não escolhida (registrada no ADR 0005): manter redirect e
apontar `VITE_FIREBASE_AUTH_DOMAIN` pro próprio host do app. Funciona —
o Firebase Hosting serve `/__/auth/handler` e `/__/auth/iframe` em todos
os hosts do projeto (verificado com `curl` nos três) — mas exige
registrar `https://<host>/__/auth/handler` nos *Authorized redirect
URIs* do OAuth client no Google Cloud Console, host a host, incluindo
cada canal de preview efêmero.

## Consequências

- Qualquer novo provedor de login (ex.: Facebook/Apple/GitHub) provavelmente
  vai exigir novas origens em `img-src` (foto de perfil) e possivelmente
  `connect-src`/`frame-src` — ajustar esta CSP quando isso acontecer,
  nunca usar `'unsafe-inline'`/`'unsafe-eval'` como atalho.
- **A exceção para `apis.google.com` é uma dependência de terceiro fora
  do nosso controle de versão** — se o Google mudar o conteúdo do
  `api.js` e os hashes de `script-src`/`script-src-attr` pararem de
  bater, o login quebra em produção com `auth/internal-error` até
  atualizarmos os hashes. Não há como testar isso preventivamente (não é
  uma mudança que fazemos nós); se acontecer, checar o console do
  navegador pelos novos hashes sugeridos e atualizar `firebase.json`.
- Se o app crescer a ponto de precisar preservar estado através do login
  (rota profunda, formulário em andamento) — ou se o time quiser reduzir
  essa dependência de terceiro — reavaliar migrar para Google Identity
  Services, ver o gatilho de revisão documentado no ADR 0005.
- Verificação após deploy (mesmo padrão do TDR 0002):
  `curl -sI https://iconula.web.app` deve trazer a CSP acima; testar o
  login manualmente **completando o fluxo até o fim e conferindo que o
  app reconhece o usuário**, não só até a tela do Google — as duas
  descobertas acima (gapi e particionamento de storage) só aparecem
  depois que o Google devolve o controle. Checar o console **e a aba
  Network** por violações e por requisições que deveriam existir e não
  existem.
  **Testar sempre contra um preview deploy real, nunca só `npm run dev`.**
