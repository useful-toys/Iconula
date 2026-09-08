<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Configuração do Firebase

Este documento descreve tudo o que foi configurado no **Firebase**
(projeto, Hosting) para o projeto **Iconula Button**, para o caso de ser
necessário reproduzir a configuração (novo projeto, migração, etc.). Para
a service account e permissões no Google Cloud usadas pelo deploy via CI,
ver [docs/gcloud.md](gcloud.md). Para o lado GitHub (secrets, workflows,
branch protection), ver [docs/github.md](github.md).

## Conta e CLI

- **Conta Google**: `danielferber@gmail.com` (o usuário tem múltiplas
  contas Google — importante selecionar esta no login)
- **Firebase CLI**: instalado localmente (`firebase --version`)

### Login do Firebase CLI

```bash
firebase login
```

É um fluxo interativo (abre navegador) — não pode ser automatizado.
Verificar quem está logado com:

```bash
firebase login:list
```

## Projeto Firebase

- **Project ID**: `iconula` (escolhido explicitamente pelo usuário —
  não usar variantes como `iconula-button` sem confirmar antes)
- **Nome de exibição**: "Iconula Button"
- **Console**: https://console.firebase.google.com/project/iconula/overview

Criado com:

```bash
firebase projects:create iconula --display-name "Iconula Button"
```

## Firebase Hosting

Configurado via dois arquivos na raiz do repositório (criados manualmente
em vez de `firebase init hosting` interativo — ver nota abaixo):

`.firebaserc`:
```json
{
  "projects": {
    "default": "iconula"
  }
}
```

`firebase.json` (ver o arquivo na raiz do repositório para o conteúdo
completo e atual — abaixo, um resumo do que cada seção faz):

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [ /* ver abaixo */ ]
  }
}
```

`"public": "dist"` aponta para a pasta gerada pelo `npm run build` (Vite).
O rewrite `**` → `/index.html` é o modo SPA (necessário mesmo que hoje o
app não tenha rotas, para não quebrar se isso mudar no futuro).

### Headers de segurança

Adicionados em resposta a um review de segurança (ver
[docs/tdr/0002](tdr/0002-headers-de-seguranca-hosting.md)): CSP,
`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, aplicados a `**`
(todas as rotas). O bloco também corrige `Cache-Control` — assets com
hash (`/assets/**`) ficam com `max-age` de 1 ano e `immutable`; `/` e
`/index.html` ficam com `no-cache`, para que um deploy fique visível
imediatamente aos visitantes. Precisa dos **dois** sources (`/` e
`/index.html`): o casamento de `headers.source` acontece contra o path
pedido antes do `rewrite` `**` → `/index.html` ser aplicado, então
`GET /` (o que qualquer visitante realmente acessa) não bate com o source
`/index.html` sozinho.

O `connect-src` lista as origens que o SDK do Firebase chama:
`identitytoolkit.googleapis.com` e `securetoken.googleapis.com` (Auth) e
`firestore.googleapis.com` (persistência). O Firestore **não** precisa de
`wss:` — ele fala WebChannel sobre HTTPS, ao contrário do Realtime
Database; a verificação está no
[docs/tdr/0007](tdr/0007-csp-para-o-firestore.md).

A CSP restringe `img-src` a `'self' data:'` (sem CDN externo) desde que
as bandeiras Twemoji passaram a ser vendorizadas em
`src/assets/flags/` em vez de servidas por `cdn.jsdelivr.net` em runtime
(ver [docs/adr/0002](adr/0002-bandeiras-emoji-unicode.md)). Se um
componente futuro precisar de outra origem externa (script, imagem,
fonte), a exceção deve ser aberta explicitamente na CSP — nunca com
`'unsafe-inline'`/`'unsafe-eval'` como atalho.

Não é preciso configurar HSTS: o Firebase Hosting já envia
`Strict-Transport-Security: max-age=31556926; includeSubDomains; preload`
por padrão, mesmo sem essa seção.

Verificação após deploy:

```bash
curl -sI https://iconula.web.app
```

- **URL de produção**: https://iconula.web.app
- **URLs de preview** (por PR): `https://iconula--pr<N>-<slug>-<hash>.web.app`, expiram automaticamente após ~7 dias

### Deploy manual (fora do CI, se necessário)

```bash
npm run build
firebase deploy --only hosting
```

## Firebase Authentication

Configurado para login com **Google** (único provedor — ver
[ADR 0006](adr/0006-login-google-sdk-modular.md), que substitui o
[ADR 0005](adr/0005-autenticacao-google-firebase-auth.md)), usado pelo
componente `LoginButton.jsx` (botão próprio, SDK modular) em conjunto com
`src/lib/firebase.js`.

### Como foi habilitado

**Web App** (concluído, via `firebase` CLI — não precisa do console):

```bash
firebase apps:create WEB "Iconula Button" --project iconula
firebase apps:sdkconfig WEB <appId> --project iconula
```

App ID: `1:192114864110:web:9c4687b6a320f65b44a8ff`.

**Provedor Google (concluído — passo manual no console)**: tentei
automatizar via Identity Platform Admin API
(`identitytoolkit.googleapis.com/admin/v2/.../defaultSupportedIdpConfigs/google.com`),
mas o projeto nunca tinha tido Authentication inicializado (todos os
endpoints de config retornavam `404 CONFIGURATION_NOT_FOUND` antes deste
passo), e criar o provedor Google via API exige um `client_id`/
`client_secret` OAuth já existente — esse client
(`Web client (auto created by Google Service)`) só é provisionado
automaticamente pelo próprio fluxo do console ao clicar em "Habilitar";
não há API pública para criar esse tipo de credencial OAuth. Habilitado
manualmente em
[Authentication → Sign-in method](https://console.firebase.google.com/project/iconula/authentication/providers)
→ provedor **Google** (e-mail de suporte do projeto selecionado).

**Authorized domains (concluído)**: depois do passo acima (que
inicializa o recurso `config` do projeto), `iconula.danielferber.com.br`
foi adicionado via API (`iconula.firebaseapp.com`, `iconula.web.app` e
`localhost` já vêm por padrão):

```bash
TOKEN=$(gcloud auth print-access-token)
curl -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/iconula/config?updateMask=authorizedDomains" \
  -H "Authorization: Bearer $TOKEN" -H "X-Goog-User-Project: iconula" -H "Content-Type: application/json" \
  -d '{"authorizedDomains": ["localhost","iconula.firebaseapp.com","iconula.web.app","iconula.danielferber.com.br"]}'
```

### Variáveis de ambiente

O config do Web App **não é secreto por natureza** (é enviado ao
navegador; a segurança vem dos Authorized domains, não de sigilo), mas
mesmo assim não fica hardcoded no código-fonte — segue o padrão
idiomático de Vite via `import.meta.env.VITE_*`:

| Variável | Origem |
|---|---|
| `VITE_FIREBASE_API_KEY` | Web App config, console do Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `iconula.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `iconula` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Web App config, console do Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Web App config, console do Firebase |
| `VITE_FIREBASE_APP_ID` | Web App config, console do Firebase |

Ver [`.env.example`](../.env.example) — cada dev copia para `.env.local`
(já ignorado pelo git) com os valores reais. Em CI/deploy, essas mesmas
variáveis já foram configuradas como **GitHub Actions Variables** (não
Secrets — ver [docs/github.md](github.md)), via `gh variable set`.

### `authDomain` e o fluxo de login (armadilha conhecida)

O `authDomain` (`iconula.firebaseapp.com`) **não é a mesma origem** de
onde o app é servido (`iconula.web.app`, `iconula.danielferber.com.br`,
ou o canal de preview do PR). Isso torna `signInFlow: "redirect"`
inviável: o resultado do login fica preso no storage particionado de
`firebaseapp.com` e o app nunca o enxerga — login "funciona" no Google e
o app continua deslogado, sem erro nenhum. Por isso o projeto usa
`signInFlow: "popup"`, que é imune a esse mecanismo. Diagnóstico
completo em [docs/tdr/0005](tdr/0005-csp-firebase-auth-google-oauth.md);
o que seria necessário para voltar ao redirect está no
[ADR 0005](adr/0005-autenticacao-google-firebase-auth.md), seção
"Gatilho de revisão futura".

### CSP e COOP

O login com Google exigiu abrir exceções pontuais na CSP e relaxar o
`Cross-Origin-Opener-Policy` (de `same-origin` para
`same-origin-allow-popups`, necessário para o fluxo de popup do
`signInWithPopup` funcionar) — ver
[docs/tdr/0005](tdr/0005-csp-firebase-auth-google-oauth.md) para o
detalhamento de cada diretiva.

### Limitação conhecida: preview deploys por PR

O canal de preview gerado por `firebase-hosting-pull-request.yml` usa um
host temporário (`https://iconula--pr<N>-<slug>-<hash>.web.app`) que
**não é adicionado automaticamente** às Authorized domains do Firebase
Auth. Se o login falhar num preview com o erro
`auth/unauthorized-domain`, adicionar manualmente esse host em
Authentication → Settings → Authorized domains (ele expira junto com o
canal de preview, ~7 dias — não precisa ser removido manualmente depois).

## Cloud Firestore

Guarda a preferência de bandeira de cada usuário autenticado — ver
[ADR 0007](adr/0007-persistencia-do-time-no-firestore.md) para o modelo de
dados e o raciocínio.

- **Banco**: `(default)`, edição `STANDARD`, modo **Native**
- **Região**: `southamerica-east1` (São Paulo), **dentro da faixa
  gratuita** (a API do projeto reporta `freeTier: true` para este banco —
  ver [docs/gcloud.md](gcloud.md#cloud-firestore))
- **Coleção**: `users`, um documento por conta (`users/{uid}`), com um
  único campo `teamName`

**Nenhuma variável de ambiente nova é necessária**: o Firestore reusa a
config do mesmo Web App já usada pelo Auth (as `VITE_FIREBASE_*` acima).

Os comandos de criação do banco (e por que `gcloud` em vez do `firebase`
CLI) estão em [docs/gcloud.md](gcloud.md#cloud-firestore), junto com a
API que precisa estar habilitada.

### Regras de segurança

O arquivo é [`firestore.rules`](../firestore.rules), na raiz do
repositório, referenciado pelo bloco `firestore` do `firebase.json`. Ele
é a **única** garantia de que um usuário não acessa os dados de outro: o
bundle do app é público e qualquer requisição pode ser forjada, então a
autorização é avaliada no servidor, contra o ID token.

Em resumo, o que as regras permitem em `users/{uid}`:

- `get` apenas do próprio documento (`request.auth.uid == uid`);
  deliberadamente **não** `list`, para que ninguém possa varrer a coleção
- `create`/`update` apenas do próprio documento, validando que o payload
  tem só `teamName`, string, entre 1 e 64 caracteres
- **sem `delete`**
- todo o resto é negado por padrão

Isso é verificado por testes automatizados contra o emulador
(`npm run test:rules`), que rodam no CI a cada PR — ver
[TDR 0008](tdr/0008-deploy-e-teste-das-regras-do-firestore.md).

### Deploy das regras

As regras sobem automaticamente no **merge para a `main`**, num passo do
workflow `firebase-hosting-merge.yml` (a action de Hosting não cobre
regras). Manualmente, quando necessário:

```bash
firebase deploy --only firestore:rules --project iconula
```

**Armadilha importante**: regras são **globais do projeto** e não têm
canal de preview. Um preview deploy de PR roda o cliente novo contra as
regras que já estão publicadas — então, ao testar uma mudança que dependa
de regras novas, é preciso publicá-las à mão antes (comando acima,
idempotente), ou toda gravação falhará com `permission-denied`. E, pela
política de erro do ADR 0007, essa falha é **silenciosa**: aparece no
console do navegador, não na tela.

> Atenção: com o bloco `firestore` no `firebase.json`, um
> `firebase deploy` **sem** `--only` passa a publicar as regras junto com
> o Hosting.

### Emulador (desenvolvimento)

`firebase.json` traz um bloco `emulators` com o Firestore na porta 8080,
usado só pelos testes de regras. O emulador roda na JVM e o
`firebase-tools` exige **JDK 21 ou superior** — com um JDK mais antigo no
`PATH`, `npm run test:rules` falha por ambiente, não por regra.

## Domínio customizado

- **Domínio**: `iconula.danielferber.com.br` (subdomínio de `danielferber.com.br`,
  registrado pelo usuário no [registro.br](https://registro.br))
- O DNS do domínio é gerenciado externamente no registro.br — o Firebase
  não hospeda o DNS, só valida os registros que apontam para ele.

### Como foi configurado

O Firebase CLI não tem um comando dedicado para gerenciar domínios
customizados (`firebase hosting:sites`/`hosting:channel` não cobrem
isso); a associação foi feita diretamente via **Firebase Hosting REST
API** (`firebasehosting.googleapis.com`, recurso
`projects.sites.customDomains`), usando o token de acesso do `gcloud`:

```bash
TOKEN=$(gcloud auth print-access-token)

# Validação (dry run, não cria nada)
curl -X POST "https://firebasehosting.googleapis.com/v1beta1/projects/iconula/sites/iconula/customDomains?customDomainId=iconula.danielferber.com.br&validateOnly=true" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: iconula" \
  -H "Content-Type: application/json" -d '{}'

# Criação real
curl -X POST "https://firebasehosting.googleapis.com/v1beta1/projects/iconula/sites/iconula/customDomains?customDomainId=iconula.danielferber.com.br" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: iconula" \
  -H "Content-Type: application/json" -d '{}'
```

Depois de criado, os registros DNS necessários (que mudam por instância
— reconsultar antes de usar os valores abaixo em outro domínio) são
obtidos com:

```bash
curl -X GET "https://firebasehosting.googleapis.com/v1beta1/projects/iconula/sites/iconula/customDomains/iconula.danielferber.com.br" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Goog-User-Project: iconula"
```

Registros solicitados no campo `requiredDnsUpdates`/`cert.verification`,
adicionados manualmente pelo usuário no painel DNS do registro.br:

| Tipo | Nome/Host | Valor |
|---|---|---|
| `CNAME` | `iconula` | `iconula.web.app` |
| `TXT` | `_acme-challenge.iconula` | (gerado pela API na criação; único por domínio, usado só para emitir o certificado TLS — pode ser removido depois que o certificado passar para `ACTIVE`) |

Depois de adicionar os registros, a propagação de DNS e a emissão do
certificado TLS gerenciado pelo Firebase podem levar de minutos a ~24h.
Conferir o progresso reconsultando o `GET` acima e olhando os campos
`hostState` (deve chegar a `HOST_ACTIVE`) e `cert.state` (deve chegar a
`ACTIVE`).

> Nota: a intenção original era rodar `firebase init hosting` de forma
> interativa para gerar esses arquivos. Os prompts interativos do
> Firebase CLI não funcionaram de forma confiável em shell não-interativo
> nesta sessão (heredocs/pipes de resposta ficam fora de sincronia com
> prompts assíncronos), então os arquivos foram escritos manualmente com
> o conteúdo equivalente.

## Reproduzindo do zero (resumo)

1. `firebase login` (interativo, conta Google correta)
2. `firebase projects:create <project-id> --display-name "<nome>"`
3. Criar `.firebaserc` e `firebase.json` apontando para `dist`
4. Configurar a service account de deploy no Google Cloud — ver [docs/gcloud.md](gcloud.md)
5. Referenciar o secret dessa service account e o `projectId` nos
   workflows do GitHub Actions — ver [docs/github.md](github.md)
6. Habilitar o provedor Google em Authentication → Sign-in method,
   registrar um Web App e configurar as variáveis `VITE_FIREBASE_*` (ver
   seção "Firebase Authentication" acima)
7. Criar o banco `(default)` do Firestore e publicar as regras (ver
   seção "Cloud Firestore" acima e [docs/gcloud.md](gcloud.md#cloud-firestore))
