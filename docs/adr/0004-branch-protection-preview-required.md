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

## Alternativas consideradas

- **Sem required status check**: o workflow roda mas não bloqueia merge;
  descartado a pedido explícito do usuário, que quer a garantia de que
  PRs quebrados não sejam mesclados.
