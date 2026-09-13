---
description: Sincroniza os ADRs (docs/adr/) com o estado atual da base de código
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Sincronize os **ADRs** (`docs/adr/`) com o estado atual da base de código e
das configurações: descubra as decisões de arquitetura realmente vigentes,
compare com o que está documentado e proponha as correções.

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `0007` ou `firestore`),
limite a sincronização a esse registro/assunto; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe sobre o assunto:
   - `AGENTS.md`;
   - o guia `docs/adr/CLAUDE.md` — regras de redação, estrutura obrigatória e
     atualização do índice `docs/adr/README.md`;
   - o documento vivo `docs/arquitetura.md`;
   - **todos** os ADRs de `docs/adr/` e o índice `docs/adr/README.md`.
   Se algum desses arquivos não existir, pare e diga o que faltou — não invente
   formato nem índice.
2. Registre a **branch original**: `git branch --show-current`. Se for
   `main`/`master`, detached HEAD ou vazia, pare e pergunte qual é a branch
   original antes de continuar.
3. `git status --short`: se houver alterações não commitadas, pare e peça para
   resolver — não as carregue para a worktree.
4. Sincronize a branch original seguindo a skill `git-remote-sync-guard`.
5. Crie a worktree de trabalho a partir da branch original, com nome sugerido
   pelas skills `git-branch-name` (tipo/assunto `docs-sincronizar-adr`):
   `git worktree add .worktrees/<nome> -b <nome> <branch-original>`.
   Trabalhe **somente** dentro dela.

## 2. Varredura (somente leitura)
Levante as decisões de arquitetura efetivamente realizadas — a verdade primária
é o código/config, não a documentação. Fontes típicas: `package.json`,
`vite.config.js`, `firebase.json`, `.firebaserc`, `firestore.rules`,
`index.html`, `.env.example`, workflows, e a estrutura de `src/` e `docs/`.

Para cada decisão, compare com os ADRs existentes e classifique:
- **sem ação** — já documentada e correta;
- **atualizar `ADR NNNN`** — documentada, mas o texto não reflete o estado atual;
- **novo `ADR NNNN`** — decisão real ainda não documentada (próximo número
  sequencial da pasta);
- **decisão mudou** — reescrever o mesmo registro (Contexto, Decisão,
  Consequências) e mover a decisão anterior para `## Histórico`, com data e
  motivo; nunca criar um registro "substituído por" (ver `docs/adr/CLAUDE.md`).

Verifique também se `docs/arquitetura.md` descreve a situação atual.

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever qualquer arquivo**:
- decisões encontradas, com evidência (`arquivo:linha`);
- por item: `sem ação` / `atualizar ADR NNNN` (resumo do diff) /
  `criar ADR NNNN: título` / `reescrever ADR NNNN` (nova decisão; a anterior
  vira histórico);
- mudanças propostas em `docs/arquitetura.md` e no índice `docs/adr/README.md`.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Para redigir os registros e atualizar o índice, siga o `docs/adr/CLAUDE.md`:
  estrutura obrigatória (Status / Contexto / Decisão / Consequências /
  Alternativas consideradas / Histórico), estilo de prosa e a tabela
  `Nº | Título | Status | Tags | Resumo` do `docs/adr/README.md` — atualizada
  no mesmo commit.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- Atualize `docs/arquitetura.md` para refletir a situação atual.
- **Escopo restrito a documentação**: não altere código, configuração,
  workflows nem configuração pública (Firebase/GCloud/GitHub/DNS).
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
