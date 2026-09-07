<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# AGENTS.md

Guia para agentes de IA (e humanos) trabalhando neste repositório.

## O que é este projeto

**Iconula Button**: uma Single Page Application minimalista com um único
botão. O botão mostra o nome e a bandeira de uma das 48 seleções
classificadas para a Copa do Mundo FIFA 2026. A cada clique, avança para
o próximo time em ordem alfabética, voltando ao primeiro depois do
último (wrap-around).

Este é o ponto de partida de uma SPA que deve crescer no futuro — a
estrutura de pastas já é organizada para isso, mas hoje o escopo é
deliberadamente mínimo (sem router, sem gerenciador de estado global).

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19
- Bandeiras: emoji Unicode em `src/data/teams.js`, renderizado como `<img>`
  via [`@twemoji/api`](https://github.com/jdecked/twemoji) em
  `TeamButton.jsx` (necessário porque o Windows não renderiza emoji de
  bandeira nativamente — ver [docs/adr/0002](docs/adr/0002-bandeiras-emoji-unicode.md))
- Testes: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- Deploy: Firebase Hosting via GitHub Actions (repositório na organização
  GitHub `useful-toys`, projeto Firebase `iconula`)

## Onde fica cada coisa

| Caminho | Conteúdo |
|---|---|
| `src/data/teams.js` | Os 48 times (nome + emoji de bandeira), em ordem alfabética. Única fonte de dados dos times. |
| `src/components/TeamButton.jsx` | Componente apresentacional do botão; converte o emoji em imagem via Twemoji. |
| `src/App.jsx` | Estado do time atual (`useState`) e lógica de avanço com wrap-around. Exporta `sortedTeams` para uso em testes. |
| `src/App.css` | Estilo do app (minimalista, responsivo, suporte a dark mode via `prefers-color-scheme`). |
| `src/App.test.jsx` | Testes: estado inicial, avanço ao clicar, wrap-around. |
| `firebase.json`, `.firebaserc` | Configuração do Firebase Hosting (aponta para `dist/`). |
| `.github/workflows/` | Workflows de deploy (produção em merge na `main`, preview em PRs). |
| `docs/adr/` | Decisões de arquitetura (ADRs) — leia antes de propor mudanças estruturais. |
| `docs/tdr/` | Decisões técnicas pontuais (TDRs). |
| `docs/firebase.md` | Tudo o que foi configurado no Firebase (projeto, Hosting, login) — como reproduzir. |
| `docs/gcloud.md` | Tudo o que foi configurado no Google Cloud (service account, IAM) — como reproduzir. |
| `docs/github.md` | Tudo o que foi configurado no GitHub (repo, secrets, workflows, branch protection) — como reproduzir. |

## Convenções

- Todo arquivo novo deve começar com o cabeçalho de copyright:
  `Copyright (c) 2026 Daniel Felix Ferber` (sintaxe de comentário do
  tipo de arquivo: `//` em JS/JSX, `/* */` em CSS, `<!-- -->` em HTML/MD,
  `#` em YAML).
- Registrar um novo ADR/TDR em `docs/adr/` ou `docs/tdr/` **no momento em
  que a decisão é tomada**, não depois — inclusive decisões tomadas
  durante o planejamento (antes de qualquer código existir) e decisões
  tomadas automaticamente por um agente de IA durante a execução (ex.:
  escolher uma biblioteca para contornar um bug, ajustar uma abordagem
  ao encontrar uma limitação). Um agente de IA que tome uma decisão
  técnica ou de arquitetura não documentada deixa o trabalho incompleto,
  mesmo que o código funcione. Usar ADR para decisões de
  arquitetura/tecnologia (stack, forma de deploy, dependências
  estruturais) e TDR para decisões técnicas mais pontuais de
  implementação, seguindo a numeração sequencial e o formato dos
  arquivos existentes (Status / Contexto / Decisão / Consequências /
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
  Firebase, Google Cloud ou GitHub** (novos scripts de build, mudança nos
  workflows, novas roles/permissões na service account, nova regra de
  branch protection, novos secrets, etc.) deve ser refletida no arquivo
  correspondente — [docs/firebase.md](docs/firebase.md),
  [docs/gcloud.md](docs/gcloud.md) ou [docs/github.md](docs/github.md) —
  na mesma alteração/PR que muda a configuração. Esses arquivos devem
  sempre corresponder ao estado real de cada ambiente; se notar alguma
  divergência, corrigir o documento junto com a mudança de código.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento local
npm run test     # roda a suíte de testes (Vitest)
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção localmente
```

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
