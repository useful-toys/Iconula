<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# AGENTS.md

Guia para agentes de IA (e humanos) trabalhando neste repositório.

## O que é este projeto

**Iconula Button**: uma Single Page Application minimalista com um único
botão. O botão mostra o nome e a bandeira de uma das 48 seleções
classificadas para a Copa do Mundo FIFA 2026. A cada clique, avança para
o próximo time em ordem alfabética, voltando ao primeiro depois do
último (wrap-around).

Para quem está autenticado, a bandeira visível é gravada no Cloud
Firestore a cada clique e restaurada no próximo login. Deslogado, o app
começa no primeiro time e não guarda nada.

Este é o ponto de partida de uma SPA que deve crescer no futuro — a
estrutura de pastas já é organizada para isso, mas hoje o escopo é
deliberadamente mínimo (sem router, sem gerenciador de estado global).

**Mudança de rumo decidida**: o produto foi especificado para se tornar
o controle de figurinhas do álbum Panini da Copa 2026, substituindo o
botão — ver [docs/requisitos.md](docs/requisitos.md), a fonte da verdade
de escopo (MVP, futuros, fora de escopo). Enquanto a implementação não
acontece, o código neste repositório ainda é o descrito acima.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19
- Bandeiras: emoji Unicode em `src/data/teams.js`, renderizado como `<img>`
  a partir de SVGs [Twemoji](https://github.com/jdecked/twemoji)
  vendorizados em `src/assets/flags/` (nome do arquivo = code point
  Unicode, calculado via `@twemoji/api`) em `TeamButton.jsx` (necessário
  porque o Windows não renderiza emoji de bandeira nativamente — ver
  [docs/adr/0002](docs/adr/0002-bandeiras-emoji-unicode.md))
- Testes: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- Deploy: Firebase Hosting via GitHub Actions (repositório na organização
  GitHub `useful-toys`, projeto Firebase `iconula`)
- Login: Firebase Auth (SDK modular), único provedor Google, botão
  próprio — sem FirebaseUI (ver
  [docs/adr/0006](docs/adr/0006-login-google-sdk-modular.md))
- Persistência: Cloud Firestore, um documento por usuário
  (`users/{uid}`), com o SDK carregado sob demanda para não pesar no
  bundle de quem não faz login (ver
  [docs/adr/0007](docs/adr/0007-persistencia-do-time-no-firestore.md))

## Onde fica cada coisa

| Caminho | Conteúdo |
|---|---|
| `src/data/teams.js` | Os 48 times (nome + emoji de bandeira), em ordem alfabética. Única fonte de dados dos times. |
| `src/components/TeamButton.jsx` | Componente apresentacional do botão; converte o emoji em imagem via Twemoji. |
| `src/App.jsx` | Estado do time atual (`useState`) e lógica de avanço com wrap-around; estado do usuário autenticado (`useState` + `onAuthStateChanged`), repassado por prop para `AuthStatus` — sem Context (ver [ADR 0006](docs/adr/0006-login-google-sdk-modular.md)). Carrega o time salvo ao entrar e grava a cada clique de usuário logado (ver [ADR 0007](docs/adr/0007-persistencia-do-time-no-firestore.md)). |
| `src/App.css` | Estilo do app (minimalista, responsivo, suporte a dark mode via `prefers-color-scheme`). |
| `src/App.test.jsx` | Testes: estado inicial, avanço ao clicar, wrap-around, login/logout e persistência (mocka `src/lib/firebase.js` e `src/lib/userPreferences.js`). |
| `src/lib/firebase.js` | Inicializa o SDK do Firebase (API modular — ver ADR 0006) a partir das variáveis `VITE_FIREBASE_*`; exporta `auth`, `app` (ambos `null` se a config estiver incompleta — login e persistência ficam indisponíveis, mas o resto do app funciona) e `signInWithGoogle()`. **Não** importa `firebase/firestore`: quem faz isso é `userPreferences.js`, sob demanda. |
| `src/lib/userPreferences.js` | Lê e grava o time do usuário em `users/{uid}` no Firestore, carregando o SDK com `import()` dinâmico. Nunca lança: falha de persistência vira log e não altera a tela (ver [ADR 0007](docs/adr/0007-persistencia-do-time-no-firestore.md)). |
| `firestore.rules` | Regras de segurança do Firestore — a única garantia de que um usuário não acessa os dados de outro. |
| `firestore.rules.test.js` | Testes das regras contra o emulador (`npm run test:rules`, config em `vitest.rules.config.js`); rodam no CI a cada PR (ver [TDR 0008](docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md)). |
| `src/components/AuthStatus.jsx` | Mostra `LoginButton` (deslogado) ou nome/avatar/botão "Sair" (logado); puramente controlado por props. |
| `src/components/LoginButton.jsx` | Botão "Entrar com Google" (`signInWithPopup`), com mensagem de erro para falhas que não sejam o usuário fechar o popup. |
| `firebase.json`, `.firebaserc` | Configuração do Firebase Hosting (aponta para `dist/`), das regras do Firestore e do emulador. |
| `.github/workflows/` | Workflows de deploy (produção em merge na `main`, preview em PRs). |
| `docs/requisitos.md` | Requisitos do produto (o que é, diferenciais, MVP, futuros, fora de escopo) — ler antes de propor funcionalidades. Descreve o produto para o qual o app atual será transformado. |
| `docs/interface.md` | Decisões de interface (o "como" da UI: telas, faixas de tela, identidade visual, interações). Tela principal especificada; demais telas e faixas de tela pendentes; em conflito com requisitos, requisitos vence. |
| `docs/adr/` | Decisões de arquitetura (ADRs) — leia antes de propor mudanças estruturais. |
| `docs/tdr/` | Decisões técnicas pontuais (TDRs). |
| `docs/idr/` | Decisões de interface significantes (IDRs) — apresentação, interação, navegação; mesmo formato dos ADRs/TDRs. |
| `docs/firebase.md` | Tudo o que foi configurado no Firebase (projeto, Hosting, login) — como reproduzir. |
| `docs/gcloud.md` | Tudo o que foi configurado no Google Cloud (APIs habilitadas, service account, IAM) — como reproduzir. |
| `docs/github.md` | Tudo o que foi configurado no GitHub (repo, secrets, workflows, branch protection) — como reproduzir. |
| `docs/registrobr.md` | Configuração de DNS no registro.br para o domínio customizado (`iconula.danielferber.com.br`) — como reproduzir. |

## Convenções

- Todo arquivo novo deve começar com o cabeçalho de copyright:
  `Copyright (c) 2026 Daniel Felix Ferber` (sintaxe de comentário do
  tipo de arquivo: `//` em JS/JSX, `/* */` em CSS, `<!-- -->` em HTML/MD,
  `#` em YAML).
- Registrar um novo ADR/TDR/IDR em `docs/adr/`, `docs/tdr/` ou
  `docs/idr/` **no momento em
  que a decisão é tomada**, não depois — inclusive decisões tomadas
  durante o planejamento (antes de qualquer código existir) e decisões
  tomadas automaticamente por um agente de IA durante a execução (ex.:
  escolher uma biblioteca para contornar um bug, ajustar uma abordagem
  ao encontrar uma limitação). Um agente de IA que tome uma decisão
  técnica ou de arquitetura não documentada deixa o trabalho incompleto,
  mesmo que o código funcione. Usar ADR para decisões de
  arquitetura/tecnologia (stack, forma de deploy, dependências
  estruturais), TDR para decisões técnicas mais pontuais de
  implementação e IDR para decisões de interface significantes
  (apresentação, interação, navegação — detalhes puramente estéticos
  não precisam de registro), seguindo a numeração sequencial e o formato
  dos arquivos existentes (Status / Contexto / Decisão / Consequências /
  Alternativas consideradas).
- Descobertas relevantes feitas durante a implementação (ex.: uma
  limitação de plataforma, um comportamento inesperado de uma
  biblioteca) que motivaram uma decisão devem ser registradas na seção
  de Contexto do ADR/TDR correspondente — não precisam de um documento
  próprio. Só criar uma categoria separada (ex. `docs/notes.md`) se
  esse tipo de achado se acumular a ponto de não caber bem em ADRs/TDRs
  individuais.
- Novos componentes vão em `src/components/`; novos conjuntos de dados
  em `src/data/`. Evitar introduzir router ou state manager global até
  que a SPA realmente precise.
- **Qualquer alteração no processo de build ou deploy, ou no ambiente
  Firebase, Google Cloud, GitHub ou DNS (registro.br)** (novos scripts de
  build, mudança nos workflows, novas roles/permissões na service
  account, nova regra de branch protection, novos secrets, novo
  domínio/registro DNS, etc.) deve ser refletida no arquivo
  correspondente — [docs/firebase.md](docs/firebase.md),
  [docs/gcloud.md](docs/gcloud.md), [docs/github.md](docs/github.md) ou
  [docs/registrobr.md](docs/registrobr.md) — na mesma alteração/PR que
  muda a configuração. Esses arquivos devem sempre corresponder ao
  estado real de cada ambiente; se notar alguma divergência, corrigir o
  documento junto com a mudança de código.

## Ferramentas de automação disponíveis

Para configurar Firebase, Google Cloud ou GitHub (ex.: os itens do
parágrafo acima), preferir automatizar via CLI a pedir para o usuário
fazer manualmente no console — estas ferramentas estão instaladas e
autenticadas como `danielferber`/`danielferber@gmail.com` neste ambiente:

- **`firebase`** — executável instalado localmente (não via `npx`).
  Cobre Hosting, Firestore, criação/config de Web Apps
  (`firebase apps:create`, `firebase apps:sdkconfig`), etc. Não tem
  comando para habilitar provedores de login do Auth nem para authorized
  domains — ver próximo item.
- **`gcloud`** — Google Cloud SDK. Necessário para obter um token de
  acesso (`gcloud auth print-access-token`) e chamar diretamente APIs do
  Google/Firebase que o `firebase` CLI não cobre (ex.: Identity Platform
  Admin API para provedores de login e authorized domains, Firebase
  Hosting REST API para domínio customizado — ver
  [docs/firebase.md](docs/firebase.md), seção "Domínio customizado", para
  um exemplo desse padrão já usado neste repositório).
- **`gh`** — GitHub CLI, para secrets/variables do repositório
  (`gh secret set`, `gh variable set`), branch protection
  (`gh api repos/.../protection`), etc. — ver [docs/github.md](docs/github.md).

Qualquer configuração feita dessa forma continua sujeita à regra acima:
refletir no `docs/*.md` correspondente na mesma alteração. Mudanças que
afetam configuração pública/de conta (habilitar um provedor de login,
alterar authorized domains, etc.) exigem confirmação explícita do usuário
antes de executar, mesmo com a ferramenta disponível.

## Como rodar

```bash
npm install
npm run dev        # desenvolvimento local
npm run test       # roda a suíte de testes (Vitest)
npm run test:rules # regras do Firestore contra o emulador (precisa de JDK 21+)
npm run build      # build de produção em dist/
npm run preview    # serve o build de produção localmente
```

`npm run test:rules` sobe o emulador do Firestore, que roda na JVM: com um
JDK anterior ao 21 no `PATH`, ele falha por ambiente, não por regra.

`npm run dev` funciona sem nenhuma credencial — sem um `.env.local` com as
variáveis `VITE_FIREBASE_*` (ver [docs/firebase.md](docs/firebase.md#firebase-authentication)),
o app roda normalmente, só a área de login não aparece.

## Como funciona o deploy

- Push/merge na branch `main` → workflow `firebase-hosting-merge.yml` →
  deploy em produção no Firebase Hosting.
- Todo pull request → workflow `firebase-hosting-pull-request.yml` →
  preview deploy temporário, comentado automaticamente no PR. Esse
  workflow é um **required status check**: o PR só pode ser mesclado se
  ele passar (ver [docs/adr/0004](docs/adr/0004-branch-protection-preview-required.md)).

## Cuidado

- Os emojis de bandeira de **England** e **Scotland** usam sequências
  Unicode "tag" especiais (sem código ISO de país próprio). Funcionam
  corretamente via Twemoji — não trocar para `🇬🇧` a menos que o Twemoji
  pare de suportá-los (testar visualmente antes de qualquer mudança
  nesses dois itens).
