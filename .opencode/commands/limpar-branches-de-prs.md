---
description: Apaga branches remotas e locais e remove os respectivos worktrees de PRs já entregues (mesclados), preservando o trabalho ainda aberto
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Faça a faxina das branches de PRs **entregues** (mesclados na `main`): apague a
branch remota, a branch local e remova a worktree correspondente.

Escopo opcional: se `$ARGUMENTS` não vier vazio, trate-o como filtro (um número
de PR ou um trecho do nome da branch) e/ou `--sim` para não parar na
confirmação do passo 3 (ex.: `--sim`, `38`, `0011`).

Regra de ouro: só apague o que vem de um PR **entregue**. Nunca apague `main`,
branch de PR aberto, branch sem PR entregue, nem a branch de integração
`docs/documentacao_continua` — apenas relate o que ficou de fora. Na dúvida,
pare e peça orientação.

## 1. Preparação
1. Invoque a skill `git-remote-sync-guard` para sincronizar produção, integração
   e branch de trabalho, e deixar a `main` em dia.
2. `git status --short`: se houver alterações não commitadas, pare e peça para
   resolver antes de remover worktrees — não descarte trabalho por engano.
3. `git fetch --all --prune` para descartar refs remotas já apagadas.

## 2. Inventário (somente leitura)
1. Liste os PRs entregues:
   `gh pr list --state merged --limit 300 --json number,title,headRefName,mergedAt`
   — se `$ARGUMENTS` trouxer um número/trecho, filtre por ele.
2. Monte o conjunto dos `headRefName` únicos desses PRs e cruze com o estado
   atual:
   - branches remotas: `git ls-remote --heads origin`;
   - branches locais: `git for-each-ref --format='%(refname:short)' refs/heads`;
   - worktrees: `git worktree list --porcelain` (note as `locked`).
3. Confirme que nenhum desses `headRefName` pertence a um PR aberto:
   `gh pr list --state open --limit 300 --json headRefName`.
4. Classifique cada `headRefName` como **remover** (existe em algum lugar) ou
   **já limpo**. Exclua do conjunto de remoção `main`, PRs não entregues e
   `docs/documentacao_continua`.

## 3. Proposta — PARE AQUI
Apresente antes de apagar qualquer coisa:
- branches remotas a apagar;
- worktrees a remover (destaque as `locked`);
- branches locais a apagar;
- o que ficou de fora e o motivo (PR aberto, sem PR entregue, integração,
  alteração não commitada).

Pergunte se pode aplicar. Não apague nada sem confirmação explícita, salvo se
`$ARGUMENTS` contiver `--sim`.

## 4. Executar (só após a confirmação)
1. **Remotas**: `git push origin --delete <branch>`. Se o remoto já não tiver a
   ref, siga em frente — não é erro.
2. **Worktrees**: para cada worktree da branch, `git worktree remove --force
   <caminho>`; se estiver travada, `git worktree unlock <caminho>` antes. Se o
   gitdir já não existir, `git worktree prune` e remova o diretório que sobrar.
3. **Locais**: `git branch -D <branch>`. Nunca apague a branch atual nem uma que
   esteja em checkout noutra worktree.
4. Feche com `git worktree prune` e `git fetch --all --prune`.

## 5. Relatório
Resuma o que foi apagado/removido e o que foi preservado, com o motivo de cada
preservação.
