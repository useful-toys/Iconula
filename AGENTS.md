<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# AGENTS.md

Guia para agentes de IA (e humanos) trabalhando neste repositório.

## O que é este projeto

**Iconula 2026**: uma Single Page Application para colecionadores do álbum
de figurinhas oficial Panini da Copa do Mundo FIFA 2026. O app permite
registrar quantas unidades de cada figurinha você tem, acompanhar o
progresso do álbum (coladas, faltantes e repetidas) e organizar trocas.

O catálogo inteiro — 994 figurinhas em 50 seções — é exibido na tela
principal, com contagens ajustáveis em memória. A autenticação com Google
(Firebase Auth) está disponível, mas ainda não persiste a coleção; a
persistência no Cloud Firestore chega na Fase 7.

A SPA cresce por fases: catálogo em tela, ordenações e agrupamento,
disposição como no álbum físico, persistência, acesso e atestação,
portabilidade, e acabamento. Router e gerenciador de estado global só
entram quando a árvore realmente exigir.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19
- Bandeiras: emoji Unicode das seções do catálogo, renderizado como `<img>`
  a partir de SVGs [Twemoji](https://github.com/jdecked/twemoji)
  vendorizados em `src/assets/flags/` (nome do arquivo = code point
  Unicode, calculado via `@twemoji/api`) — necessário porque o Windows
  não renderiza emoji de bandeira nativamente (ver
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
| `src/data/catalogo.js` | O catálogo do álbum: 50 seções e 994 códigos, com nome, grupo da Copa e páginas do spread. Única fonte desse dado. |
| `src/data/catalogoOrdenacoes.js` | Derivações puras de ordenação e agrupamento do catálogo (ordem alfabética por sigla, ordem do álbum com super-grupos A–L). |
| `src/data/catalogoLayout.js` | Layout de álbum por seção: posições de página, linha e trilha de cada figurinha. |
| `src/components/Cabecalho.jsx` | Cabeçalho sticky com o placar geral em notação compacta e relógio. |
| `src/components/Catalogo.jsx` | Corpo da tela principal: renderiza as seções na ordenação vigente. |
| `src/components/Secao.jsx` | Cabeçalho de seção com progresso compacto e grade de figurinhas em lista. |
| `src/components/Figurinha.jsx` | Cartão da figurinha com três estados, selo `×N` e marca de metalizada. |
| `src/components/MenuDeAcoes.jsx` | Botão de ações no cabeçalho e o popup de comandos raros (copiar listas, exportar/importar, sair da conta); "sair" dá flush da gravação pendente antes do `signOut`. |
| `src/components/LoginButton.jsx` | Botão "Entrar com Google" (`signInWithPopup`), com mensagem de erro para falhas que não sejam o usuário fechar o popup. |
| `src/App.jsx` | Estado da coleção (`useState`, mapa esparso de contagens) e estado do usuário autenticado (`useState` + `onAuthStateChanged`) — sem Context (ver [ADR 0006](docs/adr/0006-login-google-sdk-modular.md)). Repassa a função de ajuste para o catálogo (ver [TDR 0014](docs/tdr/0014-estado-da-colecao-sem-context.md)) e `handleSignOut` (flush antes do `signOut`) para o menu de ações. |
| `src/App.css` | Estilo do app (tema escuro único, responsivo). |
| `src/App.test.jsx` | Testes de login/logout e renderização do cabeçalho/catálogo (mocka `src/lib/firebase.js` e `src/components/Catalogo.jsx`). |
| `src/App.auth-unavailable.test.jsx` | Teste do comportamento quando o Firebase Auth não está configurado. |
| `src/lib/firebase.js` | Inicializa o SDK do Firebase (API modular — ver ADR 0006) a partir das variáveis `VITE_FIREBASE_*`; exporta `auth`, `app` (ambos `null` se a config estiver incompleta — login fica indisponível, mas o resto do app funciona) e `signInWithGoogle()`. Não importa `firebase/firestore`: a persistência será carregada sob demanda na Fase 7. |
| `src/lib/colecao.js` | Funções puras para o mapa esparso de contagens: obter contagem e ajustar com teto de 99 e piso de 0. |
| `src/lib/progresso.js` | Calcula coladas, faltantes, repetidas e percentual sobre um conjunto de códigos. |
| `src/lib/bandeira.js` | Converte emoji de bandeira/ícone em URL do SVG Twemoji vendorizado. |
| `firestore.rules` | Regras de segurança do Firestore — a única garantia de que um usuário não acessa os dados de outro. |
| `firestore.rules.test.js` | Testes das regras contra o emulador (`npm run test:rules`, config em `vitest.rules.config.js`); rodam no CI a cada PR (ver [TDR 0008](docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md)). |
| `src/components/LoginButton.jsx` | Botão "Entrar com Google" (`signInWithPopup`), com mensagem de erro para falhas que não sejam o usuário fechar o popup. |
| `firebase.json`, `.firebaserc` | Configuração do Firebase Hosting (aponta para `dist/`), das regras do Firestore e do emulador. |
| `.github/workflows/` | Workflows de deploy (produção em merge na `main`, preview em PRs). |
| `docs/requisitos.md` | Requisitos do produto (o que é, diferenciais, MVP, futuros, fora de escopo) — ler antes de propor funcionalidades. Descreve o produto para o qual o app atual será transformado. |
| `docs/interface.md` | Decisões de interface (o "como" da UI: telas, faixas de tela, identidade visual, interações). Telas principal e de login especificadas, com paleta e medidas; diálogos de export/import e faixas de tela pendentes; em conflito com requisitos, requisitos vence. |
| `docs/persistencia.md` | Como os dados do usuário são gravados no Firestore — formato dos dados, regras, custos e o que muda com o controle de figurinhas. |
| `docs/arquitetura.md` | Visão de conjunto da arquitetura — serviços, camadas, fluxo de dados e índice das decisões (ADRs/TDRs/IDRs). |
| `docs/plano/` | Plano de implementação em fases e tarefas rumo ao controle de figurinhas do álbum; `docs/plano/README.md` é o índice e o mapa de status. |
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

`npm run dev` exige um `.env.local` com as variáveis `VITE_FIREBASE_*` (ver
[docs/firebase.md](docs/firebase.md#firebase-authentication)): o login é a
guarda do app (`requisitos.md` § Acesso), e sem essas variáveis a tela de
login aparece sem botão funcional — modo não suportado, sem caminho para o
catálogo (ver Tarefa 0008-0001).

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
