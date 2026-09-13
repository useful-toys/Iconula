<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0004: Login com Google via SDK modular, sem FirebaseUI

## Status

Aceito.

## Contexto

- A aplicação já é SPA hospedada no Firebase Hosting (ver [ADR 0001](0001-aplicacao-spa.md) e [ADR 0003](0003-firebase-hosting.md)). O Firebase oferece serviço gratuito de autenticação com integração nativa ao Firestore — usar o que já está disponível é mais simples que construir mecanismo próprio.
- Arquitetura minimalista: não queremos manter mecanismo próprio de usuários (senhas, tokens, recuperação de conta). O Firebase Auth resolve isso como serviço gerenciado, sem código adicional no app.
- Firestore exige um `uid` para isolar dados por usuário — o login Google via Firebase Auth entrega isso de graça, com regras de segurança baseadas em `request.auth.uid`.
- Escopo fechado com o usuário:
  - Único provedor: **Google** (OAuth) — sem email/senha, telefone, login anônimo.
  - Esta entrega cobre só login/logout e exibir o usuário autenticado — sem Firestore, sem persistir nenhum dado ainda.
- **Descoberta na implementação**: sem `VITE_FIREBASE_*` configuradas (ex.: `.env.local` ausente no primeiro `npm run dev` local), `firebase.auth()` lança exceção síncrona (`auth/invalid-api-key`) — como `App.jsx` importa `src/lib/firebase.js` estaticamente, isso derrubava o app inteiro (tela branca). Correção: `src/lib/firebase.js` captura o erro e exporta `auth: null`; `App.jsx` trata `auth === null` como "login indisponível" e não renderiza a área de autenticação — o resto do app continua funcional.

## Decisão

- **`firebase`** (SDK oficial) na versão `12.x`, com **API modular** (`firebase/app` + `firebase/auth`): `initializeApp`, `getAuth`, `signInWithPopup`, `GoogleAuthProvider`, `onAuthStateChanged`, `signOut`.
- **Botão de login próprio** em `LoginButton.jsx`, seguindo as diretrizes de marca do Google para "Entrar com Google" (logo "G" oficial, vendorizado em `src/assets/google-logo.svg` — mesma política dos SVGs de bandeira: nenhum asset de terceiro em runtime).
- **Detecção explícita de config ausente.** Login é feature adicional e sua ausência não derruba o app: `src/lib/firebase.js` verifica se todas as `VITE_FIREBASE_*` estão preenchidas. Na API modular o erro de credencial só aparece na primeira operação de login, tarde demais para decidir se a UI de autenticação deve existir.
- **Tratamento de erro visível ao usuário.** O botão próprio mostra mensagem em `role="alert"`, ignorando `auth/popup-closed-by-user` e `auth/cancelled-popup-request` (ação deliberada do usuário, não erro).
- Estado do usuário autenticado fica em `App.jsx`, via `useState` + `onAuthStateChanged`, repassado por prop para `TelaDeLogin`/`LoginButton` — **sem Context**. Hoje só existe um consumidor desse estado; introduzir Context agora contrariaria a convenção do `AGENTS.md` de evitar router/state manager global antes de ser realmente necessário. Se uma feature futura mais profunda na árvore de componentes precisar ler o usuário sem prop-drilling, introduzir `AuthContext` nesse momento — não antes.
- **`signInFlow: "popup"`, não `"redirect"`** — `"redirect"` **não funciona neste projeto**, por um motivo estrutural, não de implementação: o app roda em `iconula.web.app` / `iconula.danielferber.com.br` / canais de preview, enquanto o `authDomain` é `iconula.firebaseapp.com` — origem diferente. O `signInWithRedirect` depende de o SDK reler, por um iframe de terceiro, o resultado que o handler gravou como página de topo; o particionamento de storage de terceiros dos navegadores (Chrome ≥115, Safari/ITP, Firefox) dá a esse iframe um bucket diferente, e o resultado nunca chega. Sintoma: o login no Google completa, o app volta e nada acontece — sem erro e sem violação de CSP. Popup é imune (a janela é top-level em `firebaseapp.com` e fala direto com o opener). Ver [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md) pro diagnóstico completo.
- Custo aceito do popup: `Cross-Origin-Opener-Policy` relaxada de `same-origin` para `same-origin-allow-popups`. A exceção de CSP pro gapi (`apis.google.com`) **não** é custo do popup — o `@firebase/auth` a exige nos dois fluxos, ver DDR 0001.
- A CSP do `firebase.json` precisa de exceções para o Firebase Auth/OAuth do Google funcionarem — ver [DDR 0001](../devops-dr/0001-csp-headers-e-configuracao-de-hosting.md).

## Consequências

- **`npm audit`: 0 vulnerabilidades.**
- **Bundle menor**: JS de 633 KB → 363 KB (−43%); CSS de 40 KB → 2,15 KB.
- A contagem de dependências de produção caiu pouco (103 → 97): o pacote `firebase` é um guarda-chuva e continua trazendo `@firebase/firestore`, `storage` e `functions` para o `node_modules` mesmo sem serem importados. O ganho real aparece no bundle (tree-shaking) e no `npm audit`, não na contagem. Importar os subpacotes diretamente (`@firebase/app` + `@firebase/auth`) reduziria a árvore, mas é caminho não recomendado pelo Firebase — não feito.
- **CSP mais fechada**, sem as concessões que existiam por causa do widget FirebaseUI: `style-src https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`, `img-src https://www.gstatic.com` e o `style-src-attr 'unsafe-hashes'`. Detalhes no DDR 0001.
- **Fim das requisições a terceiros em runtime.** O CSS do FirebaseUI importava Google Fonts, o que fazia *todo* visitante — inclusive quem nunca faz login — entregar IP e User-Agent ao Google. Restaura a propriedade que o [ADR 0006](0006-bandeiras-emoji-unicode.md) havia estabelecido para os SVGs de bandeira.
- **`LoginButton.jsx` ficou substancialmente mais simples**: sem `useRef`/`useEffect`, sem o singleton `AuthUI.getInstance()`, sem o `reset()` no cleanup e sem a dança com a dupla invocação de efeitos do StrictMode.
- **Perde-se o visual e a acessibilidade prontos do widget**, e o caminho fácil para adicionar outros provedores. Para um provedor único, a troca é favorável; se um dia forem vários provedores, reavaliar.
- O texto do botão é "Entrar com Google". A string oficial do Google em pt-BR é "Fazer login com o Google" — se a aderência estrita às diretrizes de marca virar requisito, ajustar.
- `Cross-Origin-Opener-Policy` fica em `same-origin-allow-popups` em vez de `same-origin` estrito — consequência direta do fluxo de popup (ver DDR 0001). É um relaxamento pontual: o isolamento continua valendo contra qualquer origem que não seja um popup aberto pela própria página.
- Sem estado preservado através do login (o popup não recarrega o app, então na prática isso é um não-problema — ao contrário do que aconteceria com redirect).

### Gatilhos de revisão futura

**Se popup virar problema de UX** (navegador mobile bloqueando, ou aparecer estado a preservar durante o login — rota profunda, formulário em andamento): a única forma de fazer redirect funcionar é **`authDomain` na mesma origem do app**. O Firebase Hosting já serve `/__/auth/handler` e `/__/auth/iframe` em todos os hosts do projeto (`iconula.web.app`, `iconula.danielferber.com.br` e canais de preview — verificado), então basta apontar `VITE_FIREBASE_AUTH_DOMAIN` pro host do app. **Custo**: o `redirect_uri` passa a ser `https://<host>/__/auth/handler`, e cada host precisa ser registrado à mão nos *Authorized redirect URIs* do OAuth client no Google Cloud Console — senão o Google devolve `redirect_uri_mismatch`. Para um domínio de produção fixo é um passo único; para os canais de preview efêmeros vira uma chatice por PR (somada à de Authorized domains que já existe).

**Se o objetivo for fechar a exceção de CSP pro gapi** (`apis.google.com` em `script-src`/`frame-src` + `'unsafe-hashes'`, o único ponto onde dependemos de um script de terceiro não versionado por nós — ver DDR 0001): migrar para **Google Identity Services (GIS) direto** (`accounts.google.com/gsi/client`), trocando a credencial resultante por `signInWithCredential`. A UI roda isolada num iframe do próprio Google, sem gapi, sem handler e sem iframe de reconciliação — imune tanto ao particionamento de storage quanto à questão do COOP. Custo: abandona o botão próprio para o provedor Google especificamente.

## Alternativas consideradas

- **FirebaseUI** (widget pronto do Google): pedido inicial do usuário, mas `firebaseui` tem `latest = 6.1.0` (agosto de 2023) — nenhuma versão `7.x` foi publicada, nem estável nem beta. O `peerDependencies` da 6.1.0 é `firebase: "^9.1.3 || ^10.0.0"`, o que trava o SDK em `10.14.1` (outubro de 2024) enquanto a linha atual é a `12.x`. `react-firebaseui` está pior: trava `react: ">=15 <=17"`, incompatível com o React 19 já em uso. Manter o widget significava **congelar o `firebase` na 10.x indefinidamente** — deixou de ser dívida administrável e virou bloqueio de correção de segurança: `npm audit` acusava 10 vulnerabilidades (1 alta) herdadas do `undici` via `@firebase/*`, e a correção exige `firebase@12`, incompatível com o FirebaseUI. Rejeitado.
- **Google Identity Services (GIS) direto** (`accounts.google.com/gsi/client` + `signInWithCredential`): é o caminho apontado nos gatilhos de revisão para fechar a exceção de CSP do gapi, já que não usa o resolver/iframe do Firebase. Descartado **por ora** por ser mudança maior e de UX diferente (botão renderizado pelo Google, One Tap). Continua sendo a próxima parada se a exceção do gapi incomodar.
- **`firebaseui` v7 (modular, beta)**: usaria a API modular moderna do Firebase, evitando a dívida técnica do compat — descartado por ainda não ter release GA (e nunca se concretizou em mais de três anos).

## Histórico

- 2026-09-12 — Sincronização com a base de código: o estado de autenticação
  passou a ser consumido por `TelaDeLogin`, não mais pelo `AuthStatus` genérico
  (removido); texto ajustado.
