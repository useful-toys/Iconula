<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0003: Pinning de actions do GitHub por SHA

## Status

Aceito (migra TDR 0006)

## Contexto

- Os workflows de deploy referenciavam actions por tag móvel
  (`@v4`, `@v0`) — quem conseguir mover a tag executa código arbitrário
  no job que tem o secret de deploy.
- `FirebaseExtended/action-hosting-deploy@v0` é action de terceiro (não
  é da GitHub) com acesso ao `FIREBASE_SERVICE_ACCOUNT_ICONULA`.
- Política do repositório: `sha_pinning_required: false`.

## Decisão

- Fixar todas as actions por SHA de commit completo, com tag como
  comentário (lido pelo Dependabot para propor atualizações):

  ```yaml
  - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262   # v4.4.0
  - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
  - uses: FirebaseExtended/action-hosting-deploy@500ac625ca2dd40cbd15f7659af953801858032a # v0
  ```

- Tornar pinning obrigatório no repositório:

  ```bash
  gh api -X PUT repos/useful-toys/Iconula/actions/permissions \
    -F enabled=true -f allowed_actions=all -F sha_pinning_required=true
  ```

- Versão do `firebase-tools` fixada (`@15.29.0`) nos jobs que usam
  `npx firebase-tools` com credencial no ambiente — mesmo espírito do
  pinning de actions (DDR 0004)
- `npm ci --ignore-scripts` também em `firebase-hosting-merge.yml` e
  `firebase-hosting-pull-request.yml`: esses dois jobs carregam a
  credencial da service account de deploy mais adiante nos mesmos
  passos, e só `ci.yml` (sem secret nenhum) tinha a flag — um postinstall
  malicioso de dependência rodava sem restrição justo nos jobs
  privilegiados. `ci.yml` já provou que nenhuma dependência precisa de
  `postinstall` para o build passar.

## Consequências

- Deploy em produção e preview usam exatamente o código revisado
- Atualização de action exige re-resolver o SHA e commitar
- Workflow com action por tag falha na execução — comportamento desejado
- Manter SHAs vivos (evitar congelamento com CVEs) depende de
  `dependabot.yml` com ecossistema `github-actions` — implementado
  (ver [DDR 0006](0006-ferramentas-de-seguranca-do-repositorio.md))

## Alternativas consideradas

- **Manter tag móvel**: rejeitado — é o vetor exato que o review
  apontou; tag re-apontada nem aparece como mudança de código no PR
- **Migrar para OIDC** (`google-github-actions/auth`): reduziria risco
  do secret, mas não elimina o vetor da tag móvel; evolução natural
  registrada, mudança separada

## Histórico

- **2026-09-17**: `npm ci --ignore-scripts` estendido aos dois workflows
  de deploy (antes só em `ci.yml`) — achado de revisão de segurança.
