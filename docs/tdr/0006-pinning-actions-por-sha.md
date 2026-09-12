<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0006: Actions de GitHub referenciadas por SHA de commit

## Status

Aceito

## Contexto

- Review de segurança: os workflows de deploy (`firebase-hosting-merge.yml`
  e `firebase-hosting-pull-request.yml`) referenciavam as actions por tag
  móvel — `actions/checkout@v4`, `actions/setup-node@v4` e
  `FirebaseExtended/action-hosting-deploy@v0` — enquanto `ci.yml` já
  usava SHAs fixos (ver [TDR 0004](0004-ci-roda-lint-e-testes.md)).
- Elo crítico: `FirebaseExtended/action-hosting-deploy@v0` é uma action
  **de terceiro** (não é da GitHub) referenciada por tag móvel, e roda no
  mesmo job que recebe o secret `FIREBASE_SERVICE_ACCOUNT_ICONULA` (a
  chave da service account com permissão de deploy) — quem conseguir
  mover a tag `v0` passa a executar código arbitrário com acesso a esse
  secret. As tags `@v4` de checkout/setup-node também são móveis, mas o
  risco é menor por serem mantidas pela própria GitHub.
- A política do repositório estava com `allowed_actions: "all"` e
  `sha_pinning_required: false` — nada impedia que um `@v4` solto
  voltasse a ser introduzido por descuido.

## Decisão

- Fixar **nos dois workflows de deploy** as três actions por SHA de commit
  completo, mantendo a tag como comentário ao lado (é o que o Dependabot
  lê para propor a atualização do SHA):

  ```yaml
  - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262   # v4.4.0
  - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
  - uses: FirebaseExtended/action-hosting-deploy@500ac625ca2dd40cbd15f7659af953801858032a # v0
  ```

- Tornar o pinning **obrigatório no repositório**, para que a regressão
  não volte por descuido:

  ```bash
  gh api -X PUT repos/useful-toys/Iconula/actions/permissions \
    -F enabled=true -f allowed_actions=all -F sha_pinning_required=true
  ```

  Com `sha_pinning_required: true`, qualquer workflow que referencie uma
  action por tag em vez de SHA falha na hora da execução, sinalizando o
  problema em CI.

Os SHAs acima foram resolvidos durante a revisão via
`gh api repos/<owner>/<repo>/commits/<tag> --jq .sha` e correspondem às
tags indicadas.

## Consequências

- Deploy em produção e preview deploy usam exatamente o código das ações
  que foi revisado — mover uma tag móvel não altera mais o que roda com
  acesso ao secret de deploy.
- A manutenção passa a ser por SHA: atualizar uma action exige re-resolver
  o SHA da tag nova e commitar. Manter os SHAs vivos (evitando
  congelamento com CVEs dentro) é responsabilidade de um futuro
  `dependabot.yml` com o ecossistema `github-actions` (item 11 do review
  que originou este TDR, ainda não implementado) — o comentário com a tag
  ao lado de cada SHA é o que o Dependabot lê para saber qual versão
  propor. Até lá, atualizações de action são manuais.
- Workflows do repositório que usem uma action por tag passam a falhar —
  comportamento desejado, para forçar o pinning.

## Alternativas consideradas

- **Manter tag móvel** (`@v0`/`@v4`) e confiar na revisão manual de PR:
  rejeitado — é exatamente o vetor que o review apontou; a action de
  terceiro roda no job com o secret e uma tag re-apontada nem aparece
  como mudança de código no PR.
- **Migrar para OIDC** (remover a service account dos workflows, usar
  `google-github-actions/auth`): reduziria o risco do secret, mas é uma
  mudança maior e não elimina o vetor da tag móvel — a action da Firebase
  ainda rodaria código no job. Se for aplicado num item futuro, a action
  que sobrar (`google-github-actions/auth`) segue o mesmo procedimento de
  pinning por SHA.
