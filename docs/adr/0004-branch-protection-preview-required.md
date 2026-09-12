<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0004: Branch protection exigindo o preview deploy antes do merge

## Status

Aceito

## Contexto

Com o preview deploy configurado em todo PR (ver
[ADR 0003](0003-deploy-firebase-hosting-github-actions.md)), é possível
garantir que nenhum PR seja mesclado na `main` sem que o build/deploy de
preview tenha sido validado com sucesso.

## Decisão

Configurar uma regra de proteção da branch `main` no GitHub exigindo o
check de status do workflow `firebase-hosting-pull-request.yml` como
**required status check** — o botão de merge do PR só fica habilitado se
esse workflow passar.

## Consequências

- Erros de build (ex.: falha no `npm run build`) bloqueiam o merge antes
  de chegar em produção.
- É necessário que ao menos um PR tenha rodado o workflow uma vez antes
  de conseguir selecioná-lo como check obrigatório na configuração da
  regra (limitação da interface do GitHub).

## Atualização (2026-09-07): a garantia original era menor do que o texto sugeria

- O texto original superestimava a garantia: barrava **merges de PR**, mas
  não `git push origin main` direto — com `enforce_admins: false` e um
  único admin, isso publicava em produção sem PR, sem check, sem revisão.
  Um controle com contorno trivial não registrado é convenção, não
  controle (item 4 de `.findings/2026-09-07-opus.md`).
- Regra substituída por uma que exige PR **e** vale para o admin, com
  **zero** aprovações necessárias (repositório de um desenvolvedor só) —
  força o fluxo de PR e os checks sem exigir um revisor que não existe.

Estado em vigor, verificado contra a API:

| Campo | Valor |
|---|---|
| `required_status_checks.contexts` | `["build_and_preview", "ci"]` |
| `required_status_checks.strict` | `true` |
| `enforce_admins` | `true` |
| `required_pull_request_reviews.required_approving_review_count` | `0` |
| `required_pull_request_reviews.dismiss_stale_reviews` | `true` |
| `required_linear_history` | `true` (combina com o squash merge em uso) |
| `required_conversation_resolution` | `true` |
| `allow_force_pushes` / `allow_deletions` | `false` |

O comando exato está em [docs/github.md](../github.md). O check `ci` vem do
[TDR 0004](../tdr/0004-ci-roda-lint-e-testes.md).

### O que esta regra garante, literalmente

Todo caminho até `main` — e portanto até o deploy de produção — passa por um
PR com `build_and_preview` e `ci` verdes, sobre uma branch atualizada em
relação à `main`. Isso vale para o dono do repositório também.

### O que ela não garante

- **Um admin pode desativar a proteção, empurrar o commit e reativá-la.**
  Não há como eliminar isso sendo o dono o único owner. A diferença em
  relação ao estado anterior é que agora essa ação é explícita e fica
  registrada no audit log da organização, em vez de ser indistinguível de
  trabalho normal.
- **Commits não são assinados** (`required_signatures: false`). Nada prova
  criptograficamente que um commit em `main` foi criado pelo dono; se um
  token vazar, os commits do atacante são indistinguíveis dos legítimos.
  Habilitar exige o endpoint próprio
  (`/protection/required_signatures`, não aceito no payload de
  `/protection`) e ter GPG/SSH signing configurado localmente antes — sob
  pena de se trancar para fora do próprio repositório.

### Custo aceito

Qualquer alteração em `main` passa a exigir branch e PR, inclusive um typo
no README. É o preço de fechar o contorno, e foi aceito explicitamente.

## Alternativas consideradas

- **Sem required status check**: o workflow roda mas não bloqueia merge;
  descartado a pedido explícito do usuário, que quer a garantia de que
  PRs quebrados não sejam mesclados.
