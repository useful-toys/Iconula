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
- O host do canal (`iconula--pr<N>-<hash>.web.app`) não entra nos
  authorized domains do Firebase Auth: sem ele, o login no preview falha
  com `auth/unauthorized-domain`.
- Authorized domains não expiram com o canal: em 2026-09-13 a lista tinha
  `pr13`, `pr24` e `pr25`, adicionados à mão, sem canal nenhum por trás.

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

### Domínio do canal autorizado no login pelo tempo de vida do canal

- **Adicionar**: depois do deploy, `build_and_preview` adiciona o host do
  canal (saída `details_url` da action) aos authorized domains.
- **Remover ao fechar**: `cleanup_preview` remove todo host
  `iconula--pr<N>-*.web.app`, com `if: always()` — sai mesmo se o delete
  do canal falhar.
- **Varredura diária**: `firebase-preview-domains-sweep.yml` (agendado e
  manual) remove hosts de preview sem canal ativo — acompanha a expiração
  de 3 dias, que o Hosting aplica ao canal e não aos authorized domains.
- **Script único**: `.github/scripts/dominios-autorizados-preview.sh`
  (`adicionar`, `remover-pr`, `varrer`), com `curl`, `jq` e `gcloud` da
  imagem do runner, contra a Identity Toolkit Admin API e a Hosting REST
  API — sem action ou dependência nova.
- **Concorrência**: a API grava a lista inteira
  (`updateMask=authorizedDomains`); cada alteração lê, grava e relê para
  confirmar, com até 5 tentativas. A varredura só toca hosts no padrão
  `iconula--*.web.app` e para se a listagem de canais falhar.
- **Permissão mínima**: role custom
  `projects/iconula/roles/authorizedDomainsEditor`
  (`firebaseauth.configs.get` e `firebaseauth.configs.update`) na service
  account do CI — ver [setup-gcloud.md](../setup-gcloud.md).
- **Falha visível**: não conseguir autorizar falha o `build_and_preview`;
  preview com login quebrado não passa despercebido.

### Restrição a PRs do próprio repositório

- `if: github.event.pull_request.head.repo.full_name == github.repository`
  nos dois jobs (`build_and_preview` e `cleanup_preview`).
- PRs de fork não rodam o preview deploy — exporia o secret
  `FIREBASE_SERVICE_ACCOUNT_ICONULA` a código não revisado.
- Lint e testes continuam rodando para forks via `ci.yml` (que não usa
  secrets — ver [DDR 0002](0002-workflow-de-ci-separado.md)).

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
- Login com Google funciona no preview sem passo manual; o host fica
  autorizado no máximo enquanto o canal existir, com folga de até um dia
  quando só a varredura o remove.
- A chave do CI passa a poder alterar a configuração do Auth
  (`firebaseauth.configs.update`), mas não usuários.
- Uma falha de IAM ou da API do Auth bloqueia o merge de todo PR, porque
  `build_and_preview` é required check ([DDR 0005](0005-protecao-da-branch-main.md)).

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
- **Autorizar o domínio à mão**: rejeitado — era a limitação documentada,
  exigia passo manual a cada PR e deixava os hosts na lista para sempre.
- **`roles/firebaseauth.admin` na service account**: rejeitado — daria à
  chave do CI criar, alterar e apagar usuários do Auth para editar só a
  lista de domínios.
- **Remover só ao fechar o PR**: rejeitado — um cleanup que falhe deixa o
  host autorizado indefinidamente, como aconteceu com `pr13`, `pr24` e
  `pr25`.
- **`concurrency` do GitHub Actions para serializar as alterações**:
  rejeitado — o GitHub cancela a execução pendente quando outra entra no
  mesmo grupo, e o PR cancelado ficaria sem domínio autorizado.

## Histórico

- 2026-09-13 — acrescenta a autorização do host do canal no Firebase Auth
  (adicionar no deploy, remover ao fechar e na varredura diária) e a role
  custom mínima. Antes, o host era adicionado à mão e nunca saía da lista.
