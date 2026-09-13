---
description: Sincroniza os DDRs (docs/devops-dr/) com o deploy, CI e infra atuais
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Sincronize os **DDRs** (`docs/devops-dr/`) com o estado atual da base de
código, das configurações e do GitHub: descubra as decisões de DevOps
realmente vigentes, compare com o que está documentado e proponha as correções.

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `hosting` ou `actions`),
limite a sincronização a esse assunto; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe sobre o assunto:
   - `AGENTS.md`;
   - o guia `docs/devops-dr/CLAUDE.md` — regras de redação, estrutura
     obrigatória e atualização do índice `docs/devops-dr/README.md`;
   - o documento vivo `docs/devops.md` e os docs de ambiente
     `docs/firebase.md`, `docs/gcloud.md`, `docs/github.md`,
     `docs/registrobr.md`;
   - **todos** os DDRs de `docs/devops-dr/` e o índice
     `docs/devops-dr/README.md`.
   Se algum desses arquivos não existir, pare e diga o que faltou — não invente
   formato nem índice.
2. Registre a **branch original**: `git branch --show-current`. Se for
   `main`/`master`, detached HEAD ou vazia, pare e pergunte qual é a branch
   original antes de continuar.
3. `git status --short`: se houver alterações não commitadas, pare e peça para
   resolver — não as carregue para a worktree.
4. Sincronize a branch original seguindo a skill `git-remote-sync-guard`.
5. Crie a worktree de trabalho a partir da branch original, com nome sugerido
   pelas skills `git-branch-name` (tipo/assunto `docs-sincronizar-ddr`):
   `git worktree add .worktrees/<nome> -b <nome> <branch-original>`.
   Trabalhe **somente** dentro dela.

## 2. Varredura (somente leitura)
Levante as decisões de DevOps efetivamente vigentes — CI/CD, pipelines, deploy,
branch protection, ferramentas de segurança, secrets e ambientes. A verdade
primária é a configuração real, não a documentação.

Arquivos e workflows:
- `.github/workflows/ci.yml`, `firebase-hosting-merge.yml`,
  `firebase-hosting-pull-request.yml` (jobs, gatilhos, permissões, actions
  pinadas por SHA, versões);
- `firebase.json`, `.firebaserc`, `firestore.rules`, `package.json`
  (scripts de build/test/lint/deploy), `vite.config.js`;
- `docs/devops.md` (documento vivo) e `docs/firebase.md`, `docs/gcloud.md`,
  `docs/github.md`, `docs/registrobr.md` (devem refletir o estado real —
  exigência do `AGENTS.md`).

Configuração do GitHub via `gh` CLI (somente leitura):
- repositório e segurança:
  `gh api repos/useful-toys/Iconula` e
  `gh api repos/useful-toys/Iconula --jq .security_and_analysis`;
- permissões de Actions:
  `gh api repos/useful-toys/Iconula/actions/permissions`;
- proteção da branch `main`:
  `gh api repos/useful-toys/Iconula/branches/main/protection`;
- secrets, variables e environments:
  `gh secret list`, `gh variable list`,
  `gh api repos/useful-toys/Iconula/environments`;
- workflows e execuções: `gh workflow list`, `gh run list --limit 10`.

Para cada decisão, compare com os DDRs existentes e classifique:
- **sem ação** — já documentada e correta;
- **atualizar `DDR NNNN`** — documentada, mas não reflete o estado atual;
- **novo `DDR NNNN`** — decisão real ainda não documentada (próximo número
  sequencial da pasta);
- **decisão mudou** — reescrever o mesmo registro (Contexto, Decisão,
  Consequências) e mover a decisão anterior para `## Histórico`, com data e
  motivo; nunca criar um registro "substituído por" (ver
  `docs/devops-dr/CLAUDE.md`).

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever qualquer arquivo**:
- decisões encontradas, com evidência (arquivo:linha ou comando `gh` + saída);
- por item: `sem ação` / `atualizar DDR NNNN` (resumo do diff) /
  `criar DDR NNNN: título` / `reescrever DDR NNNN` (nova decisão; a anterior
  vira histórico);
- divergências entre a configuração real e `docs/devops.md`,
  `docs/firebase.md`, `docs/gcloud.md`, `docs/github.md`, `docs/registrobr.md`,
  com a correção proposta;
- mudanças propostas no índice `docs/devops-dr/README.md`.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Para redigir os registros e atualizar o índice, siga o
  `docs/devops-dr/CLAUDE.md`: estrutura obrigatória (Status / Contexto /
  Decisão / Consequências / Alternativas consideradas / Histórico), estilo de
  prosa e a tabela `Nº | Título | Status | Tags | Resumo` do
  `docs/devops-dr/README.md` — atualizada no mesmo commit.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- Atualize `docs/devops.md` (documento vivo) e os docs de ambiente
  (`docs/firebase.md`, `docs/gcloud.md`, `docs/github.md`,
  `docs/registrobr.md`) para refletirem a situação atual.
- **Escopo restrito a documentação**: não altere código, workflows nem
  configuração pública (Firebase/GCloud/GitHub/DNS) — nunca rode `gh` com
  escrita (`-X POST/PUT/PATCH/DELETE`).
- Valide: links relativos não quebrados e `npm run lint`.

## 5. Entregar
- Commit com a mensagem proposta pela skill `git-commit-message` (somente se a
  proposta foi aprovada).
- Rebase da branch de trabalho sobre a original
  (`git rebase <branch-original>`); em conflito, pare e peça orientação.
- Com a árvore principal limpa, avance a branch original para o resultado
  (`git merge --ff-only <branch-de-trabalho>` ou
  `git branch -f <original> <branch>`).
- Não faça push nem abra PR sem o usuário pedir.
- Ofereça remover a worktree e a branch de trabalho ao final.
