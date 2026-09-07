<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0006: Login com Google via SDK modular, sem FirebaseUI

## Status

Aceito — substitui o [ADR 0005](0005-autenticacao-google-firebase-auth.md).

## Contexto

O [ADR 0005](0005-autenticacao-google-firebase-auth.md) escolheu o widget
pronto do **FirebaseUI**, a pedido explícito do usuário, e aceitou como
dívida conhecida a dependência da API **compat** (estilo v8) do Firebase.
Aquela decisão previa um gatilho de revisão: *"reavaliar migração para a
API modular quando `firebaseui` 7 (modular) sair GA"*.

**O gatilho não vai disparar.** Verificado no registro do npm:

- `firebaseui` tem `latest = 6.1.0`, publicada em **agosto de 2023** —
  nenhuma versão `7.x` foi publicada, nem estável nem beta.
- O `peerDependencies` da 6.1.0 é `firebase: "^9.1.3 || ^10.0.0"`, o que
  trava o SDK em `10.14.1` (outubro de 2024) enquanto a linha atual é a
  `12.x`.
- `react-firebaseui` está pior: trava `react: ">=15 <=17"`, incompatível
  com o React 19 já em uso.

Ou seja: manter o widget significava **congelar o `firebase` na 10.x
indefinidamente**. Isso deixou de ser dívida técnica administrável e
virou bloqueio de correção de segurança — o `npm audit` acusava 10
vulnerabilidades (1 alta) herdadas do `undici` via `@firebase/*`, e a
correção exige `firebase@12`, incompatível com o FirebaseUI.

Decisão de escopo do usuário: **não iniciar/manter o projeto sobre
versões velhas de bibliotecas**, o que torna a manutenção do widget
inaceitável.

## Decisão

- **Remover a dependência `firebaseui`** e subir `firebase` para a `12.x`.
- **Usar a API modular** (`firebase/app` + `firebase/auth`), não mais a
  compat: `initializeApp`, `getAuth`, `signInWithPopup`,
  `GoogleAuthProvider`, `onAuthStateChanged`, `signOut`.
- **Botão de login próprio** em `LoginButton.jsx`, seguindo as diretrizes
  de marca do Google para "Entrar com Google" (logo "G" oficial,
  vendorizado em `src/assets/google-logo.svg` — mesma política dos SVGs
  de bandeira: nenhum asset de terceiro em runtime).
- **Detecção explícita de config ausente.** Continua valendo a regra do
  ADR 0005 de que login é feature adicional e sua ausência não derruba o
  app, mas a implementação muda: em vez de um `try/catch` em volta de
  `firebase.auth()` — que funcionava porque a compat lançava na
  inicialização —, `src/lib/firebase.js` agora verifica se todas as
  `VITE_FIREBASE_*` estão preenchidas. Na API modular o erro de
  credencial só aparece na primeira operação de login, tarde demais para
  decidir se a UI de autenticação deve existir.
- **Tratamento de erro visível ao usuário.** O widget engolia falhas no
  console; o botão próprio mostra mensagem em `role="alert"`, ignorando
  `auth/popup-closed-by-user` e `auth/cancelled-popup-request` (ação
  deliberada do usuário, não erro).

### O que *não* muda

- **`signInFlow` continua sendo popup** (`signInWithPopup`), pelo mesmo
  motivo estrutural do ADR 0005 e do
  [TDR 0005](../tdr/0005-csp-firebase-auth-google-oauth.md): o
  `authDomain` (`iconula.firebaseapp.com`) é origem diferente da do app,
  e o particionamento de storage de terceiros impede o redirect de
  entregar o resultado. Trocar o FirebaseUI **não** afeta isso — o
  problema é do `@firebase/auth`, não do widget.
- **`Cross-Origin-Opener-Policy` continua `same-origin-allow-popups`**,
  custo do fluxo de popup.
- **A exceção de CSP para `apis.google.com` (gapi) permanece**, incluindo
  os dois hashes de `script-src`/`script-src-attr`. O TDR 0005 já havia
  estabelecido, indo ao bundle publicado, que o gapi é exigido pelo
  `@firebase/auth` **modular ou compat, popup ou redirect** — não era
  culpa do FirebaseUI e não sai com ele.
- Estado do usuário continua em `App.jsx` via `useState` +
  `onAuthStateChanged`, sem Context.

## Consequências

- **`npm audit`: 0 vulnerabilidades** (eram 10, sendo 1 alta).
- **Bundle menor**: JS de 633 KB → 363 KB (−43%); CSS de 40 KB → 2,15 KB.
- A contagem de dependências de produção caiu pouco (103 → 97): o pacote
  `firebase` é um guarda-chuva e continua trazendo `@firebase/firestore`,
  `storage` e `functions` para o `node_modules` mesmo sem serem
  importados. O ganho real aparece no bundle (tree-shaking) e no
  `npm audit`, não na contagem. Importar os subpacotes diretamente
  (`@firebase/app` + `@firebase/auth`) reduziria a árvore, mas é caminho
  não recomendado pelo Firebase — não feito.
- **CSP mais fechada**, com quatro concessões removidas — as que existiam
  por causa do widget: `style-src https://fonts.googleapis.com`,
  `font-src https://fonts.gstatic.com`, `img-src https://www.gstatic.com`
  e o `style-src-attr 'unsafe-hashes'`. Detalhes no TDR 0005 atualizado.
- **Fim das requisições a terceiros em runtime.** O CSS do FirebaseUI
  importava Google Fonts, o que fazia *todo* visitante — inclusive quem
  nunca faz login — entregar IP e User-Agent ao Google. Restaura a
  propriedade que o [ADR 0002](0002-bandeiras-emoji-unicode.md) havia
  estabelecido para os SVGs de bandeira.
- **`LoginButton.jsx` ficou substancialmente mais simples**: sem
  `useRef`/`useEffect`, sem o singleton `AuthUI.getInstance()`, sem o
  `reset()` no cleanup e sem a dança com a dupla invocação de efeitos do
  StrictMode.
- **Perde-se o visual e a acessibilidade prontos do widget**, e o caminho
  fácil para adicionar outros provedores. Para um provedor único e um
  botão único, a troca é favorável; se um dia forem vários provedores,
  reavaliar (mas o FirebaseUI provavelmente ainda não será opção).
- O texto do botão é "Entrar com Google". A string oficial do Google em
  pt-BR é "Fazer login com o Google" — se a aderência estrita às
  diretrizes de marca virar requisito, ajustar.

## Alternativas consideradas

- **Google Identity Services (GIS) direto**
  (`accounts.google.com/gsi/client` + `signInWithCredential`): é o
  caminho apontado no "Gatilho de revisão futura" do ADR 0005 para
  fechar a exceção de CSP do gapi, já que não usa o resolver/iframe do
  Firebase. Descartado **por ora** por ser mudança maior e de UX
  diferente (botão renderizado pelo Google, One Tap). Continua sendo a
  próxima parada se a exceção do gapi incomodar — e o motivo original
  daquele gatilho segue de pé.
- **Manter o FirebaseUI e aceitar `firebase@10`**: rejeitado pela decisão
  de escopo acima. Se fosse escolhido, exigiria um TDR registrando a
  aceitação explícita das 10 vulnerabilidades e do congelamento.
- **`firebaseui` v7**: não existe. Era a premissa do gatilho do ADR 0005
  e não se concretizou em mais de três anos.
