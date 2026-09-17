<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0007: Ciclo de vida dos canais de preview

## Status

Aceito

## Contexto

- O workflow `firebase-hosting-pull-request.yml` faz preview deploy de
  cada PR no Firebase Hosting, usando canais temporários.
- Sem decisões explícitas sobre naming, cleanup e expiração, os canais
  poderiam: (a) acumular indefinidamente, (b) ter nomes imprevisíveis
  (dificultando o cleanup), (c) rodar em PRs de fork (expondo secrets).
- A action `FirebaseExtended/action-hosting-deploy` deriva um nome
  default do branch, mas esse nome não é estável nem fácil de referenciar
  programaticamente no job de cleanup.

## Decisão

### Naming explícito do canal

- `channelId: "pr${{ github.event.number }}"` — nome determinístico
  baseado no número do PR, não no branch.
- Vantagem: o job `cleanup_preview` sabe exatamente qual canal apagar
  quando o PR fecha, sem depender de derivar o nome do branch.

### Expiração automática

- `expires: 3d` — canal expira automaticamente após 3 dias.
- Rede de segurança contra PRs cujo cleanup falhe ou nunca rode (merge
  sem fechar o evento, workflow desabilitado etc.).
- 3 dias é tempo suficiente para review e testes, sem acumular canais
  órfãos indefinidamente.

### Cleanup automático ao fechar

- Job `cleanup_preview` roda quando `github.event.action == 'closed'`.
- Usa `firebase hosting:channel:delete "pr${{ github.event.number }}"`
  com a mesma service account do deploy.
- **Checkout obrigatório**: `firebase hosting:channel:delete` exige rodar
  dentro de um diretório com `firebase.json` (senão falha com "Not in a
  Firebase app directory"). Sem o passo `actions/checkout`, o job falhava
  em todo PR fechado e os canais nunca eram apagados.

### Restrição a PRs do próprio repositório

- `if: github.event.pull_request.head.repo.full_name == github.repository`
  nos dois jobs (`build_and_preview` e `cleanup_preview`).
- PRs de fork não rodam o preview deploy — exporia o secret
  `FIREBASE_SERVICE_ACCOUNT_ICONULA` a código não revisado.
- Lint e testes continuam rodando para forks via `ci.yml` (que não usa
  secrets — ver [DDR 0002](0002-workflow-de-ci-separado.md)).

### Permissões explícitas (least privilege)

- Achado pelo CodeQL (análise da linguagem **Actions**, DDR 0006): o
  workflow não declarava `permissions:`, ao contrário dos outros três
  do repositório (`ci.yml` — DDR 0002, `firebase-hosting-merge.yml` —
  DDR 0004, `firebase-preview-domains-sweep.yml`), que já usam
  `contents: read`.
- `permissions: contents: read` no topo do workflow — mesmo padrão dos
  demais.
- Job `build_and_preview`: override de job com `pull-requests: write` e
  `checks: write` (além do `contents: read` herdado) —
  `FirebaseExtended/action-hosting-deploy` usa `repoToken:
  secrets.GITHUB_TOKEN` para comentar o PR com o link do preview
  (comportamento default; existe o input `disableComment` para
  desligar, não usado aqui) **e** para criar/atualizar um check run
  "Deploy Preview" — confirmado em produção (PR #73): sem `checks:
  write` a action falha com 403 "Resource not accessible by
  integration" ao criar o check run.
- Job `cleanup_preview`: sem override — usa só `actions/checkout`
  (`contents: read`, herdado) e a service account do Firebase para
  apagar o canal; não chama a API do GitHub com o `GITHUB_TOKEN`.

## Consequências

- Cada PR tem um canal de preview com nome previsível (`pr<N>`), fácil de
  referenciar e limpar.
- Canais expiram sozinhos em 3 dias — rede de segurança contra cleanup
  falho.
- Cleanup automático ao fechar o PR evita acúmulo de canais órfãos.
- PRs de fork não têm preview deploy (protege secrets), mas continuam
  tendo lint/testes (cobertura de qualidade).
- O checkout no `cleanup_preview` é obrigatório — sem ele, o job falha
  silenciosamente e os canais nunca são apagados.
- O host do canal é autorizado no login do Firebase Auth pelo mesmo tempo
  de vida do canal — ver
  [DDR 0008](0008-autorizacao-do-dominio-de-preview-no-firebase-auth.md).

## Alternativas consideradas

- **Nome default derivado do branch**: rejeitado — não é estável (branch
  pode ser renomeado) e dificulta o cleanup programático.
- **Sem expiração automática**: rejeitado — cleanup poderia falhar
  silenciosamente e canais órfãos acumulariam indefinidamente.
- **Cleanup sem checkout**: rejeitado — `firebase hosting:channel:delete`
  exige `firebase.json` no diretório; sem checkout, o job falha em todo
  PR fechado.
- **Preview deploy para PRs de fork**: rejeitado — exporia o secret de
  deploy a código não revisado; forks continuam com lint/testes via
  `ci.yml`.

## Histórico

- **2026-09-17**: acrescentada a subseção "Permissões explícitas (least
  privilege)" — o workflow não declarava `permissions:`, achado pelo
  CodeQL; corrigido com `contents: read` no topo e, no job
  `build_and_preview`, `pull-requests: write` e `checks: write` (o
  segundo só depois de uma tentativa inicial sem ele falhar em produção
  — ver acima).
