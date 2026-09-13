---
description: Sincroniza os IDRs (docs/idr/) com o estado atual da interface
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Sincronize os **IDRs** (`docs/idr/`) com o estado atual da interface:
descubra as decisões de interface realmente vigentes, compare com o que está
documentado e proponha as correções.

Foco opcional: se `$ARGUMENTS` não vier vazio (ex.: `0042` ou `foco`), limite a
sincronização a esse registro/assunto; caso contrário, varra tudo.

## 1. Preparação (não altere nada)
1. Leia, no início, tudo o que já existe sobre o assunto:
   - `AGENTS.md`;
   - o guia `docs/idr/CLAUDE.md` — regras de redação, estrutura obrigatória e
     atualização do índice `docs/idr/README.md`;
   - o documento vivo `docs/interface.md` e `docs/requisitos.md`;
   - **todos** os IDRs de `docs/idr/` e o índice `docs/idr/README.md`.
   Se algum desses arquivos não existir, pare e diga o que faltou — não invente
   formato nem índice.
2. Registre a **branch original**: `git branch --show-current`. Se for
   `main`/`master`, detached HEAD ou vazia, pare e pergunte qual é a branch
   original antes de continuar.
3. `git status --short`: se houver alterações não commitadas, pare e peça para
   resolver — não as carregue para a worktree.
4. Sincronize a branch original seguindo a skill `git-remote-sync-guard`.
5. Crie a worktree de trabalho a partir da branch original, com nome sugerido
   pelas skills `git-branch-name` (tipo/assunto `docs-sincronizar-idr`):
   `git worktree add .worktrees/<nome> -b <nome> <branch-original>`.
   Trabalhe **somente** dentro dela.

## 2. Varredura (somente leitura)
Levante as decisões de interface efetivamente realizadas — comportamento
visível, interação, layout responsivo, feedback visual, textos, navegação e
estados da UI. A verdade primária é o código, não a documentação. Fontes
típicas: `src/components/`, `src/App.jsx`, `src/App.css`, `src/theme.css`,
`src/index.css`, `docs/interface.md` e o protótipo em `docs/prototype/`.

Para cada decisão, compare com os IDRs existentes e classifique:
- **sem ação** — já documentada e correta;
- **atualizar `IDR NNNN`** — documentada, mas o texto não reflete o estado atual;
- **novo `IDR NNNN`** — decisão real ainda não documentada (próximo número
  sequencial da pasta);
- **decisão mudou** — reescrever o mesmo registro (Contexto, Decisão,
  Consequências) e mover a decisão anterior para `## Histórico`, com data e
  motivo; nunca criar um registro "substituído por" (ver `docs/idr/CLAUDE.md`).

Verifique também se `docs/interface.md` descreve a situação atual; em conflito
com `docs/requisitos.md`, requisitos vencem.

## 3. Proposta — PARE AQUI
Apresente a proposta **antes de escrever qualquer arquivo**:
- decisões encontradas, com evidência (`arquivo:linha`);
- por item: `sem ação` / `atualizar IDR NNNN` (resumo do diff) /
  `criar IDR NNNN: título` / `reescrever IDR NNNN` (nova decisão; a anterior
  vira histórico);
- mudanças propostas em `docs/interface.md` e no índice `docs/idr/README.md`.

Pergunte se pode aplicar. **Não altere nenhum arquivo até a confirmação
explícita.**

## 4. Aplicar (só após confirmação)
- Para redigir os registros e atualizar o índice, siga o `docs/idr/CLAUDE.md`:
  estrutura obrigatória (Status / Contexto / Decisão / Consequências /
  Alternativas consideradas / Histórico), estilo de prosa e a tabela
  `Nº | Título | Status | Tags | Resumo` do `docs/idr/README.md` — atualizada
  no mesmo commit.
- Todo arquivo novo começa com
  `<!-- Copyright (c) 2026 Daniel Felix Ferber -->`.
- Atualize `docs/interface.md` para refletir a situação atual.
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
