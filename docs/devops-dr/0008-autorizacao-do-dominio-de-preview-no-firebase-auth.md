<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0008: Autorização do domínio de preview no Firebase Auth

## Status

Aceito

## Contexto

- Cada PR tem um canal de preview `pr<N>`, com host
  `iconula--pr<N>-<hash>.web.app`, que expira em 3 dias e é apagado quando
  o PR fecha ([DDR 0007](0007-ciclo-de-vida-dos-canais-de-preview.md)).
- O login com Google só funciona em origens listadas nos authorized
  domains do Firebase Auth. O host do canal não entra sozinho: o login no
  preview falha com `auth/unauthorized-domain`.
- O contorno documentado era adicionar o host à mão, com a nota de que ele
  expirava junto com o canal. A nota era falsa: em 2026-09-13 a lista tinha
  `pr13`, `pr24` e `pr25`, sem canal nenhum por trás.
- A Identity Toolkit Admin API grava a lista inteira
  (`PATCH .../config?updateMask=authorizedDomains`): não há operação para
  adicionar ou remover um item, nem controle de versão para detectar
  escrita concorrente.

## Decisão

### O domínio acompanha o ciclo de vida do canal

- **Adicionar no deploy**: `build_and_preview` adiciona o host do canal
  (saída `details_url` da action de deploy) logo depois do deploy.
- **Remover ao fechar**: `cleanup_preview` remove todo host
  `iconula--pr<N>-*.web.app`, com `if: always()` — sai mesmo se o delete do
  canal falhar.
- **Varredura diária**: `firebase-preview-domains-sweep.yml`
  (`cron: "17 6 * * *"` UTC e `workflow_dispatch`) remove os hosts
  `iconula--*.web.app` sem canal ativo, listados pela Hosting REST API com
  paginação — acompanha a expiração de 3 dias, que o Hosting aplica ao
  canal e não aos authorized domains.

### Implementação

- **Script único**: `.github/scripts/dominios-autorizados-preview.sh`
  (`adicionar`, `remover-pr`, `varrer`), com `curl`, `jq` e `gcloud` da
  imagem do runner — nenhuma action ou pacote npm novo para fixar
  ([DDR 0003](0003-pinning-de-actions-por-sha.md)).
- **Credencial**: a mesma service account do deploy, com a chave em
  `$RUNNER_TEMP` apagada num passo `if: always()` e o `gcloud` revogado ao
  fim do script. Permissão em [DDR 0009](0009-role-custom-minima-para-authorized-domains.md).
- **Concorrência**: cada alteração lê a lista, grava e relê para confirmar,
  com até 5 tentativas e espera aleatória de 3 a 7 s entre elas.
- **Escopo**: só hosts no padrão de preview são removidos; a varredura para
  antes de remover qualquer domínio se a listagem de canais falhar.
- **Falha visível**: não conseguir autorizar falha o `build_and_preview`.
- **Fim de linha**: o script depende de LF no runner Linux —
  [DDR 0010](0010-scripts-de-shell-com-lf.md).

## Consequências

- Login com Google funciona no preview sem passo manual.
- O host fica autorizado no máximo enquanto o canal existir, com folga de
  até um dia quando só a varredura o remove.
- Os hosts órfãos (`pr13`, `pr24`, `pr25`) saem na primeira varredura.
- Uma falha de IAM ou da API do Auth bloqueia o merge de todo PR, porque
  `build_and_preview` é required check
  ([DDR 0005](0005-protecao-da-branch-main.md)).
- Escritas simultâneas ainda podem se sobrescrever; a releitura detecta a
  perda no `adicionar` e no `remover-pr` e grava de novo.
- A varredura só roda a partir da `main` (workflows agendados usam a
  branch default).

## Alternativas consideradas

- **Autorizar à mão**: rejeitado — passo manual a cada PR, e os hosts
  ficavam na lista para sempre.
- **Remover só ao fechar o PR**: rejeitado — um cleanup que falhe deixa o
  host autorizado indefinidamente, como aconteceu com `pr13`, `pr24` e
  `pr25`.
- **`concurrency` do GitHub Actions para serializar as alterações**:
  rejeitado — o GitHub cancela a execução pendente quando outra entra no
  mesmo grupo, e o PR cancelado ficaria sem domínio autorizado.
- **`google-github-actions/auth` ou `setup-gcloud` para o token**:
  rejeitado — mais uma action para fixar por SHA e manter, e o `gcloud` já
  vem na imagem do runner.
- **`firebase-tools` para listar os canais na varredura**: rejeitado —
  pacote npm executado com a credencial no ambiente, para uma leitura que a
  Hosting REST API faz com o mesmo token.
- **Só avisar (`continue-on-error`) quando a autorização falhar**:
  rejeitado — um preview com login quebrado passaria despercebido.

## Histórico

- 2026-09-13 — criação.
