<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0005: CSP para Firebase Auth + login com Google

## Status

Aceito

## Contexto

A CSP restrita do `firebase.json` (ver [TDR 0002](0002-headers-de-seguranca-hosting.md))
bloqueia, por padrão, tudo que não seja `'self'`. O login com Google via
Firebase Auth ([ADR 0005](../adr/0005-autenticacao-google-firebase-auth.md))
precisa de algumas origens externas específicas.

**`npm run dev` (Vite) não valida CSP** — os headers do `firebase.json`
só existem no Firebase Hosting de verdade (produção ou preview deploy de
PR); `firebase serve --only hosting` também não os reproduziu nesta
versão do CLI. Toda descoberta abaixo só apareceu testando o preview
deploy real do PR — esse é o único jeito confiável de validar mudança de
CSP neste projeto.

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
  'sha256-O9ChnrQJngUlTYptX2rHTyPwYa4VlQslTnAyr1r9/XE='`. O próprio
  FirebaseUI (não script de terceiro — é o pacote `firebaseui` do
  `package.json`, versão travada) define um `style="..."` inline num
  elemento do seu widget. `'unsafe-hashes'` é bem mais restrito que
  `'unsafe-inline'`: só libera esse atributo exato (por hash), não
  qualquer estilo inline. Como o hash vem de um pacote npm com versão
  fixa (não de um CDN que o Google pode mudar sem aviso), se um bump de
  versão do `firebaseui` mudar esse hash, a suíte de testes/preview deploy
  do PR pega isso antes do merge — não é uma falha silenciosa em produção.
- `connect-src`: adicionado `https://identitytoolkit.googleapis.com` e
  `https://securetoken.googleapis.com` — chamadas REST que o SDK do
  Firebase Auth faz para autenticar e renovar o token de sessão.
- `frame-src` (diretiva nova): `'self' https://iconula.firebaseapp.com`.
  O SDK do Firebase Auth carrega um iframe oculto em
  `<authDomain>/__/auth/iframe` para gerenciar eventos de autenticação.

**`script-src` continua só `'self'`, sem exceção nova.** Essa foi a parte
que exigiu mais uma volta: `signInFlow: "popup"` (a escolha original,
documentada em `LoginButton.jsx`) faz o `signInWithPopup` do Firebase
Auth carregar `https://apis.google.com/js/api.js` (gapi) internamente,
usado pra repassar o resultado do popup de volta pra janela principal via
`gapi.iframes` — isso acontece **mesmo desligando o credential
helper/"Smart Lock"** do FirebaseUI (`credentialHelper:
firebaseui.auth.CredentialHelper.NONE`, que evita um carregamento
_diferente_ e desnecessário do mesmo gapi). Esse script injeta
estilo/event handler inline no DOM (`style-src-attr`/`script-src-attr`),
e causava `auth/internal-error` no login quando bloqueado pela CSP.

Liberar isso exigiria confiar num script de terceiro não versionado por
nós (`apis.google.com`, conteúdo que o Google controla e pode mudar sem
aviso) e usar `'unsafe-hashes'` pros handlers inline dele — hashes
atrelados a um conteúdo instável, ao contrário do caso do FirebaseUI
acima. **Decisão: trocar `signInFlow` de `"popup"` para `"redirect"`**
em vez de abrir essa exceção. `signInWithRedirect` navega a página
inteira pro Google e volta (usando o mesmo iframe de
`iconula.firebaseapp.com` já liberado acima pra reconciliar o resultado),
sem depender de gapi/postMessage entre janelas — testado no preview
deploy real, zero violação de CSP do carregamento até a tela de login do
Google. Também é o fluxo recomendado pelo Firebase para web mobile, onde
popup é historicamente pouco confiável (bloqueio mais agressivo, ou o
"popup" vira navegação mesmo). Custo aceito: sem router nem estado
persistente hoje, a volta do redirect recarrega o app do zero — não há
nada a perder no momento (ver "Alternativas consideradas" no
[ADR 0005](../adr/0005-autenticacao-google-firebase-auth.md) para o plano
de revisão caso isso mude).

Como consequência de não precisar mais de popup, **`Cross-Origin-Opener-Policy`
continua `same-origin`** (o padrão restrito do TDR 0002) — não foi
necessário relaxar para `same-origin-allow-popups`.

## Consequências

- Qualquer novo provedor de login (ex.: Facebook/Apple/GitHub) provavelmente
  vai exigir novas origens em `img-src` (foto de perfil) e possivelmente
  `connect-src`/`frame-src` — ajustar esta CSP quando isso acontecer,
  nunca usar `'unsafe-inline'`/`'unsafe-eval'` como atalho, e preferir
  `'unsafe-hashes'` só quando o conteúdo hasheado vier de uma dependência
  versionada nossa (não de um script de terceiro fora do nosso controle).
- Se o app crescer a ponto de precisar preservar estado através do login
  (rota profunda, formulário em andamento), reavaliar `signInFlow` —
  ver o gatilho de revisão documentado no ADR 0005.
- Verificação após deploy (mesmo padrão do TDR 0002):
  `curl -sI https://iconula.web.app` deve trazer a CSP acima; testar o
  login manualmente e checar o console do navegador por violações não
  previstas aqui. **Testar sempre contra um preview deploy real, nunca
  só `npm run dev`.**
