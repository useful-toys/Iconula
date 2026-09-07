<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0005: Autenticação com Google via Firebase Auth + FirebaseUI

## Status

Aceito

## Contexto

O app não tinha, até aqui, nenhum conceito de usuário — o Firebase era
usado só para Hosting. A intenção é preparar a base para personalizar a
experiência no futuro (ex.: salvar a seleção favorita por usuário), sem
implementar essa persistência agora. Para isso, é preciso um mecanismo de
login.

Decisões de escopo já fechadas com o usuário:
- Único provedor: **Google** (OAuth) — sem email/senha, telefone, ou
  login anônimo.
- UI de login: o widget pronto do **FirebaseUI**, não um formulário
  customizado.
- Esta entrega cobre só login/logout e exibir o usuário autenticado — sem
  Firestore, sem persistir nenhum dado de usuário ainda.

**Descoberta durante a implementação**: sem as variáveis `VITE_FIREBASE_*`
configuradas (ex.: `.env.local` ausente ao rodar `npm run dev` localmente
pela primeira vez), `firebase.auth()` lança uma exceção síncrona
(`auth/invalid-api-key`) — como `App.jsx` importa `src/lib/firebase.js`
estaticamente, isso derrubava a aplicação inteira (tela branca), inclusive
para quem só quer ver o botão de times sem mexer em login. `src/lib/firebase.js`
agora captura esse erro e exporta `auth: null` nesse caso; `App.jsx` trata
`auth === null` como "login indisponível" e simplesmente não renderiza a
área de autenticação, mantendo o resto do app funcional.

## Decisão

- **`firebase`** (SDK oficial) + **`firebaseui`** (widget de login) como
  novas dependências de produção.
- **API compat/namespaced do Firebase** (`firebase/compat/app` +
  `firebase/compat/auth`), não a API modular moderna (`firebase/auth`).
  Motivo: `firebaseui` 6.1.0 (a versão estável atual — a v7, modular,
  ainda está em beta, sem GA) espera receber uma instância
  `firebase.auth.Auth` no estilo v8/compat (`new
  firebaseui.auth.AuthUI(auth)`); seu `package.json` declara
  `peerDependencies.firebase: "^9.1.3 || ^10.0.0"`, o que também travou a
  versão do `firebase` instalada em `10.14.1` em vez da última major
  (12.x) — confirmado ao rodar `npm install`, que resolveu essa faixa
  automaticamente. Todo o app usa essa mesma instância `auth` (exportada
  de `src/lib/firebase.js`) — não misturar com o SDK modular.
- Estado do usuário autenticado fica em `App.jsx`, via `useState` +
  `auth.onAuthStateChanged`, repassado por prop para `AuthStatus`/
  `LoginButton` — **sem Context**. Hoje só existe um consumidor desse
  estado; introduzir Context agora contrariaria a convenção do
  `AGENTS.md` de evitar router/state manager global antes de ser
  realmente necessário. Se uma feature futura mais profunda na árvore de
  componentes precisar ler o usuário sem prop-drilling, introduzir
  `AuthContext` nesse momento — não antes.
- A CSP do `firebase.json` precisa de exceções para o Firebase Auth/OAuth
  do Google funcionarem — ver [TDR 0005](../tdr/0005-csp-firebase-auth-google-oauth.md).
- **`signInFlow: "redirect"`, não `"popup"`** — testando o preview deploy
  real (não `npm run dev`, que não aplica CSP), `signInWithPopup` do
  Firebase Auth se mostrou incompatível com a CSP estrita sem confiar num
  script de terceiro não versionado por nós (`apis.google.com`/gapi, ver
  TDR 0005). Redirect evita isso por completo e é o fluxo recomendado
  pelo Firebase pra web mobile, onde popup é historicamente pouco
  confiável. Trade-off aceito: sem router/estado persistente hoje, a
  volta do redirect recarrega o app do zero — não há nada a perder no
  momento (ver "Gatilho de revisão futura" abaixo).

## Consequências

- Dependência da API **compat**, que o próprio Firebase sinaliza como
  legada em favor da API modular — dívida técnica conhecida e aceita
  aqui porque é o que `firebaseui` 6.x exige. Reavaliar migração para a
  API modular quando `firebaseui` 7 (modular) sair GA e/ou quando o
  projeto crescer o suficiente para justificar abandonar o widget pronto
  por uma UI de login customizada.
- `npm audit` acusa vulnerabilidades moderadas/altas herdadas
  transitivamente do pacote `undici` (via `@firebase/auth-compat`,
  `@firebase/firestore-compat`, `@firebase/functions-compat`,
  `@firebase/storage-compat` — todos puxados pelo pacote `firebase`
  "guarda-chuva", mesmo só usando `auth`). `undici` é um cliente HTTP de
  Node, não código que roda no navegador; como o Vite faz tree-shaking do
  que não é importado (aqui só `firebase/compat/app` e
  `firebase/compat/auth`), esse código não entra no bundle publicado.
  Não tratado como bloqueante, mas registrado aqui para não ser
  esquecido — reavaliar se o Firebase lançar uma correção upstream, ou se
  o escopo crescer para incluir Firestore/Functions/Storage (aí sim
  passaria a valer a pena investigar mais a fundo).
- `Cross-Origin-Opener-Policy` continua estrita (`same-origin`, sem
  relaxar) — consequência de ter escolhido redirect em vez de popup (ver
  TDR 0005).

## Gatilho de revisão futura

Esta decisão (FirebaseUI + `signInFlow: "redirect"`) é adequada pro
escopo atual (app sem router, sem estado a preservar através do login),
mas **não é definitiva**. Se o app crescer a ponto de ter estado que
valha a pena preservar durante o login (rota profunda, formulário em
andamento, carrinho) — reavaliar então, nesta ordem de preferência:

1. **Redirect + persistência explícita de estado**: salvar o que importa
   em `sessionStorage` antes de `signInWithRedirect`, restaurar depois de
   processar o resultado. Mantém a CSP como está, mais barato de
   implementar que a opção 2.
2. **Google Identity Services (GIS)** direto (`accounts.google.com/gsi/client`),
   não `signInWithPopup` do Firebase: a UI roda isolada num iframe do
   próprio Google (não injeta estilo/script na nossa página), então dá
   popup de verdade sem reabrir a CSP pro gapi. Mais implementação
   (abandona o widget pronto do FirebaseUI para o provedor Google
   especificamente, troca a credencial resultante via
   `signInWithCredential`), mas é o caminho certo se popup virar
   requisito de produto.
3. **Popup nativo do Firebase + CSP relaxada** (`apis.google.com` em
   `script-src`/`frame-src`, `'unsafe-hashes'` pro conteúdo inline dele):
   avaliado e descartado nesta rodada (ver TDR 0005) — evitar a menos que
   as opções 1 e 2 se mostrem inviáveis, já que depende de um script de
   terceiro não versionado por nós.

## Alternativas consideradas

- **`react-firebaseui`** (wrapper React oficial do Google, publicado como
  `react-firebaseui`): rejeitado — seu `package.json` trava
  `peerDependencies.react` em `>=15 <=17`, incompatível com o React 19 já
  em uso neste projeto; não há release testado contra React 18/19.
- **Formulário de login customizado com `signInWithPopup` direto** (sem
  FirebaseUI): daria mais controle visual e evitaria a dependência da API
  compat, mas o usuário pediu explicitamente o widget pronto do
  FirebaseUI.
- **`firebaseui` v7 (modular, beta)**: usaria a API modular moderna do
  Firebase, evitando a dívida técnica do compat — descartado por ainda
  não ter release GA.
