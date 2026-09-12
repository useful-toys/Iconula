<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0005: Proteção da branch main

## Status

Aceito

## Contexto

- A branch `main` é a única fonte de deploy em produção — qualquer
  commit nela dispara o workflow de deploy.
- Decisão estratégica de usar PRs como único caminho de entrega
  (ADR 0003).

## Decisão

Branch protection da `main` (verificado via `gh api`):

### Required status checks

- `build_and_preview` (preview deploy — ADR 0004)
- `ci` (lint, testes, build — DDR 0002)
- `strict: true` — branch precisa estar atualizada com a `main` antes
  do merge

### Pull request reviews

- `required_approving_review_count: 0` — nenhuma aprovação exigida
  (repositório pessoal)
- `dismiss_stale_reviews: true` — reviews antigas descartadas quando
  novos commits chegam
- `require_code_owner_reviews: false`
- `require_last_push_approval: false`

### Restrições estruturais

- `enforce_admins: true` — admin também passa pelas regras
- `required_linear_history: true` — sem merge commits; histórico linear
- `allow_force_pushes: false` — sem force push na `main`
- `allow_deletions: false` — sem deletar a `main`
- `block_creations: false` — commits diretos não são bloqueados pela
  protection (mas o `enforce_admins` + required checks impedem na
  prática, porque qualquer commit precisa passar pelos checks)
- `required_conversation_resolution: true` — conversas de review
  precisam ser resolvidas antes do merge
- `restrictions: null` — sem restrição de quem pode fazer push (além
  das regras acima)

### Merge

- `allow_squash_merge: true`
- `allow_merge_commit: true`
- `allow_rebase_merge: true`
- `allow_auto_merge: false`
- `delete_branch_on_merge: false`

## Consequências

- Entrega só por PR — push direto na `main` é bloqueado pelos required
  checks (inclusive para o admin)
- Histórico linear — sem merge commits
- Preview deploy é obrigatório — PR só mescla se o preview passar
- Conversas de review resolvidas — nada fica pendente
