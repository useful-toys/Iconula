<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# AGENTS.md

Guia para agentes de IA (e humanos) trabalhando neste repositório.

## O que é este projeto

**Iconula 2026**: uma Single Page Application para colecionadores do álbum
de figurinhas oficial Panini da Copa do Mundo FIFA 2026. O app registra
quantas unidades de cada figurinha você tem, acompanha o progresso do
álbum (coladas, faltantes e repetidas) e ajuda a organizar trocas.

O catálogo inteiro — 994 figurinhas em 50 seções — é exibido na tela
principal, com contagens ajustáveis, duas ordenações e duas disposições
(lista e como no álbum físico). O login com Google (Firebase Auth) é
obrigatório para usar o app: guarda o acesso e a atestação de maioridade
(LGPD, uma vez por conta), e a coleção persiste no Cloud Firestore — um
documento por usuário, gravação agregada e avisos de sincronização.
Desfazer (últimas 10 alterações), um menu de ações (copiar listas de
troca, exportar/importar a coleção em JSON, sair da conta) e a política
de privacidade completam o produto.

A SPA cresceu por fases: catálogo em tela, ordenações e agrupamento,
disposição como no álbum físico, persistência, acesso e atestação,
portabilidade, e acabamento (acessibilidade, desempenho e documentação —
ver `docs/plano/README.md` para o status corrente de cada fase). Router e
gerenciador de estado global não entraram: a árvore de componentes ainda
não exigiu (ver [docs/arquitetura.md](docs/arquitetura.md) § Pontos em
aberto e § Camadas no cliente).

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19
- Bandeiras: emoji Unicode das seções do catálogo, renderizado como `<img>`
  a partir de SVGs [Twemoji](https://github.com/jdecked/twemoji)
  vendorizados em `src/assets/flags/` (nome do arquivo = code point
  Unicode, calculado via `@twemoji/api`) — necessário porque o Windows
  não renderiza emoji de bandeira nativamente (ver
  [docs/adr/0002](docs/adr/0002-bandeiras-emoji-unicode.md))
- Tipografia: Poppins (600/700, latin + latin-ext) vendorizada em
  `src/assets/fonts/` e servida pelo próprio Hosting — evita abrir a CSP
  (`style-src`/`font-src`) para uma fonte externa (ver
  [TDR 0013](docs/tdr/0013-tipografia-vendorizada.md))
- Testes: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- Deploy: Firebase Hosting via GitHub Actions (repositório na organização
  GitHub `useful-toys`, projeto Firebase `iconula`)
- Login: Firebase Auth (SDK modular), único provedor Google, botão
  próprio — sem FirebaseUI (ver
  [docs/adr/0006](docs/adr/0006-login-google-sdk-modular.md)); é a
  guarda do app — sem sessão só a tela de login existe (`docs/requisitos.md`
  § Acesso)
- Persistência: Cloud Firestore, um documento por usuário
  (`users/{uid}`), com o SDK carregado sob demanda para não pesar no
  bundle de quem não faz login (ver
  [docs/adr/0007](docs/adr/0007-persistencia-do-time-no-firestore.md) e
  [docs/adr/0008](docs/adr/0008-schema-da-colecao-mapa-esparso.md))

## Onde fica cada coisa

| Caminho | Conteúdo |
|---|---|
| `src/data/catalogo.js` | O catálogo do álbum: 50 seções (`secoes`) e 994 figurinhas (`figurinhas`, expandidas por `expandirFigurinhas`), com código, nome, grupo da Copa, páginas do spread e marca de metalizada. Única fonte desse dado (ver [TDR 0010](docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)). |
| `src/data/catalogoOrdenacoes.js` | Derivações puras de ordenação e agrupamento do catálogo (ordem alfabética por sigla, ordem do álbum com super-grupos A–L) — ver [TDR 0012](docs/tdr/0012-derivacoes-do-catalogo-em-src-data.md). |
| `src/data/catalogoLayout.js` | Layout de álbum por seção: posições de página, linha e trilha de cada figurinha. |
| `src/data/catalogo.test.js` | Testes de invariantes do catálogo (994 códigos, 50 seções, 20 por seleção, grupos e páginas) — faz o papel de validação que a ausência de pipeline deixaria sem cobertura ([TDR 0010](docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md)). |
| `src/App.jsx` | Único componente com estado: sessão (`onAuthStateChanged`), coleção (mapa esparso de contagens), `atualizadoEm`, histórico de desfazer, atestação pendente, vista da política de privacidade e preferências de vista (ordenação/disposição/filtro, lidas uma vez por faixa de tela — [IDR 0043](docs/idr/0043-padroes-de-primeira-abertura-por-faixa-de-tela.md)). Decide qual tela mostrar (guarda de login — `requisitos.md` § Acesso) e concentra toda leitura/escrita da coleção, sem Context (ver [TDR 0014](docs/tdr/0014-estado-da-colecao-sem-context.md)). |
| `src/App.css` | Estilo de layout do app (flex de página, tela de auth indisponível). |
| `src/App.test.jsx`, `src/App.auth-unavailable.test.jsx`, `src/App.atestacao.test.jsx`, `src/App.copiar.test.jsx`, `src/App.desfazer.test.jsx`, `src/App.exportar.test.jsx`, `src/App.gravacao.test.jsx`, `src/App.importar.test.jsx`, `src/App.persistencia.test.jsx`, `src/App.politica.test.jsx` | Testes de integração de `App.jsx`, um arquivo por funcionalidade: login/logout e cabeçalho, Firebase Auth indisponível, atestação de menores, cópia de listas de troca, desfazer, exportar/importar JSON, gravação agregada e carga/proteção de corrida, vista da política de privacidade. |
| `src/theme.css` | Tokens de paleta (OKLCH) do tema escuro único e a regra global de foco visível (`:focus-visible`, [IDR 0042](docs/idr/0042-foco-visivel-e-area-de-toque.md)). |
| `src/index.css` | `@font-face` da Poppins vendorizada (ver [TDR 0013](docs/tdr/0013-tipografia-vendorizada.md)). |
| `src/main.jsx` | Ponto de entrada: monta `App` em `StrictMode`. |
| `src/components/TelaDeLogin.jsx` | Tela de login (`docs/interface.md` § Tela de login): cartão com `LoginButton`, atestação textual e rodapé com o link da política. |
| `src/components/LoginButton.jsx` | Botão "Entrar com Google" (`signInWithPopup`), com mensagem de erro para falhas que não sejam o usuário fechar o popup. |
| `src/components/Atestacao.jsx` | Passo explícito de atestação de menores, uma única vez por conta (LGPD art. 14 — ver [IDR 0036](docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md)). |
| `src/components/PoliticaDePrivacidade.jsx` | Vista interna da política de privacidade, sem router (ver [TDR 0020](docs/tdr/0020-privacidade-como-vista-interna.md)). |
| `src/components/Rodape.jsx` | Rodapé da tela principal: aviso de independência/marcas e o link da política, reaparecendo depois de autenticado (ver [IDR 0037](docs/idr/0037-politica-no-rodape-depois-de-autenticado.md)). |
| `src/components/Cabecalho.jsx` | Cabeçalho sticky: placar geral em notação compacta, `atualizadoEm` e a faixa de bandeiras para salto. |
| `src/components/FaixaDeSecoes.jsx` | Faixa de bandeiras rolável no cabeçalho; toque salta até a seção, limpando o filtro se ele a ocultar (ver [IDR 0031](docs/idr/0031-salto-com-filtro-ativo.md)). |
| `src/components/Controles.jsx` | Linha de controles: grupos segmentados de ordenação, disposição e filtro de status, mais desfazer e o menu de ações. |
| `src/components/MenuDeAcoes.jsx` | Botão de ações no cabeçalho e o popup de comandos raros (copiar listas, exportar/importar, sair da conta — ver [IDR 0024](docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md)); "sair" dá flush da gravação pendente antes do `signOut` (ver [IDR 0038](docs/idr/0038-sair-da-conta-aborta-se-o-flush-falhar.md)). |
| `src/components/Catalogo.jsx` | Corpo da tela principal: super-grupos e seções na ordenação/disposição vigente, com FWC abrindo e Coca-Cola fechando. |
| `src/components/SuperGrupo.jsx` | Super-grupo A–L colapsável, com progresso agregado das seções que contém. |
| `src/components/Secao.jsx` | Cabeçalho de seção com progresso compacto, colapsável, renderizando a grade em lista ou a página do álbum conforme a disposição vigente. |
| `src/components/PaginaDoAlbum.jsx` | Página do álbum na disposição "como no álbum": grid de trilhas fixas reproduzindo a página física (ver [IDR 0009](docs/idr/0009-disposicao-como-no-album-reproduz-a-pagina-fisica.md)). |
| `src/components/Figurinha.jsx` | Cartão da figurinha com três estados, selo `×N`, controle de menos e marca de metalizada. |
| `src/components/Avisos.jsx` | Área de avisos flutuantes com três severidades (sucesso, aviso, falha — ver [IDR 0029](docs/idr/0029-avisos-flutuantes-com-tres-severidades.md)). |
| `src/components/*.test.jsx` | Um arquivo de teste por componente acima, ao lado do respectivo `.jsx`. |
| `src/lib/firebase.js` | Inicializa o SDK do Firebase (API modular — ver ADR 0006) a partir das variáveis `VITE_FIREBASE_*`; exporta `auth`, `app` (ambos `null` se a config estiver incompleta — login fica indisponível, mas o resto do app funciona) e `signInWithGoogle()`. Não importa `firebase/firestore` (ADR 0007). |
| `src/lib/colecao.js` | Funções puras para o mapa esparso de contagens: obter contagem, ajustar com teto de 99 e piso de 0, e filtrar por status. |
| `src/lib/colecaoRemota.js` | Único módulo que toca o SDK do Firestore (carregado sob demanda): carregar a coleção no login, gravar alterações/atestação/importação em `users/{uid}` — nunca lança, sempre devolve um resultado discriminado (ver [ADR 0008](docs/adr/0008-schema-da-colecao-mapa-esparso.md)). |
| `src/lib/gravacaoAgregada.js` | Acúmulo, debounce (~2s), teto de espera (~10s) e `flush()` da gravação agregada de contagens (ver [IDR 0003](docs/idr/0003-gravacao-agrega-ajustes.md)). |
| `src/lib/historico.js` | Pilha do histórico de desfazer: as últimas 10 alterações de contagem, em memória (ver [IDR 0012](docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md)). |
| `src/lib/preferenciasDeVista.js` | Ordenação, disposição e filtro persistidos no `localStorage`, por dispositivo (ver [IDR 0026](docs/idr/0026-preferencias-de-vista-persistidas-no-navegador.md)). |
| `src/lib/portabilidade.js` | Serialização pura do export/import JSON da coleção — o download/leitura do arquivo é responsabilidade de `App.jsx` (`docs/requisitos.md` § Portabilidade). |
| `src/lib/textoDeTroca.js` | Gera os textos de troca (faltantes e repetidas) prontos para colar num grupo de WhatsApp, sempre na ordem do álbum. |
| `src/lib/avisos.js` | Fila e ciclo de vida dos avisos flutuantes: severidade, expiração e limite de empilhamento. |
| `src/lib/progresso.js` | Calcula coladas, faltantes, repetidas e percentual sobre um conjunto de códigos. |
| `src/lib/bandeira.js` | Converte emoji de bandeira/ícone em URL do SVG Twemoji vendorizado. |
| `src/lib/*.test.js` | Um arquivo de teste por módulo acima, ao lado do respectivo `.js`. |
| `firestore.rules` | Regras de segurança do Firestore — a única garantia de que um usuário não acessa os dados de outro. |
| `firestore.rules.test.js` | Testes das regras contra o emulador (`npm run test:rules`, config em `vitest.rules.config.js`); rodam no CI a cada PR (ver [TDR 0008](docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md)). |
| `firebase.json`, `.firebaserc` | Configuração do Firebase Hosting (aponta para `dist/`), das regras do Firestore e do emulador. |
| `.github/workflows/` | Workflows de deploy (produção em merge na `main`, preview em PRs). |
| `docs/requisitos.md` | Requisitos do produto (o que é, diferenciais, MVP, futuros, fora de escopo) — ler antes de propor funcionalidades. Descreve o produto implementado; § Requisitos futuros lista o que ainda não foi comprometido. |
| `docs/interface.md` | Decisões de interface (o "como" da UI: telas, faixas de tela, identidade visual, interações) — todas as telas do produto especificadas e implementadas, sem pendências abertas; em conflito com requisitos, requisitos vence. |
| `docs/persistencia.md` | Como os dados do usuário são gravados e lidos no Firestore — formato dos dados, regras, custos e o que ainda falta (§ Pronto × falta). |
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
