<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Privacidade no Iconula — inventário e procedimentos

Registro das operações de tratamento de dados pessoais do Iconula (LGPD
art. 37) e runbook dos procedimentos manuais que o controlador executa
para cumpri-lo ([DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md)).

Este documento é de responsabilidade do controlador — Daniel Felix
Ferber, pessoa física, Brasil, que também responde como encarregado (LGPD
art. 41), pelo canal de contato publicado na política de privacidade. O
que ele descreve é o estado real do app: as fontes do inventário são
[modelo-firebase.md](modelo-firebase.md), o
[IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)
e o [MDR 0007](model-dr/0007-persistencia-no-armazenamento-local.md).

**Cobertura atual**: o inventário e o runbook da purga por inatividade. O
plano de resposta a incidente (LGPD art. 48) e a consolidação completa do
art. 37 entram na Tarefa 0032-0005, como previsto no
[DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md).

## Inventário das operações de tratamento

| Dado | Finalidade | Base legal | Retenção | Operador | Transferência |
|---|---|---|---|---|---|
| Identidade da conta Google: nome, e-mail e foto de perfil | Autenticar o titular e identificar a conta que pede o app | Execução do contrato dos termos de uso (LGPD art. 7º, V) | Enquanto a conta existir; 24 meses sem login levam ao apagamento | Google (Firebase Auth) | **Sim** — a identidade é tratada globalmente pelo Firebase Auth, fora do Brasil, sob as cláusulas-padrão contratuais do Google (LGPD arts. 33 e 39) |
| Coleção de figurinhas: contagem por código e data da última gravação (`contagens`, `updatedAt`) | Guardar a coleção e devolvê-la igual no próximo login, em qualquer aparelho | Execução do contrato dos termos de uso (LGPD art. 7º, V) | Enquanto a conta existir; 24 meses sem login levam ao apagamento; descontinuado o projeto, até 90 dias | Google (Cloud Firestore, `southamerica-east1`) | **Não** — a coleção fica em servidores no Brasil |
| Marca de atestação de idade (`atestadoEm`) | Comprovar a atestação de maioridade ou de autorização pelos responsáveis | LGPD art. 14 — consentimento dos responsáveis pela atestação no primeiro login | Mesma da conta: enquanto ela existir; 24 meses sem login levam ao apagamento | Google (Cloud Firestore, `southamerica-east1`) | **Não** |
| Coleção compartilhada por link (`contagens`, `updatedAt`, `linkAtivo`) | A pedido do titular, mostrar a coleção sem login a quem tiver o link | Consentimento específico (LGPD art. 7º, I), revogado ao desligar o link | Enquanto o link estiver ligado; desligado, a coleção volta à regra da conta | Google (Cloud Firestore, `southamerica-east1`) | **Não** pelo operador. A leitura é de terceiros que tenham o link, por escolha do titular ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)) |
| Preferências de vista, colapso manual e cache do SDK (no aparelho) | Funcionar a interface e sustentar a gravação local da coleção | Execução do contrato dos termos de uso (LGPD art. 7º, V) — estritamente funcional, sem rastreio | No aparelho, até o titular limpar os dados do navegador | Nenhum — não sai do aparelho | **Não** |

Observações do inventário:

- A exclusão pedida pelo titular dentro do app apaga a coleção **e** a
  conta de login ([IDR 0060](idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md),
  [TDR 0027](tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md)); a
  conta Google em si permanece, porque é do Google.
- A portabilidade (LGPD art. 18, V) é atendida pela exportação da coleção
  em JSON, no menu de ações.
- Não há analytics, localização nem dado de pagamento; o app não pede
  consentimento de cookies nem exibe banner, porque o armazenamento local
  é funcional e nunca enviado.

## Runbook — purga de contas inativas

Cumpre a retenção declarada: contas sem login há 24 meses são apagadas,
com a coleção, o que exige dois apagamentos independentes — a conta do
Firebase Auth e o documento `users/{uid}` no Cloud Firestore. **Apagar um
não apaga o outro.**

### Periodicidade

- **A cada seis meses**, em janeiro e em julho, executada pelo
  controlador. O intervalo de 24 meses mais a varredura semestral
  significa que a exclusão acontece entre 24 e 30 meses após o último
  login, como a política declara ([IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)).
- A data da última execução fica em "Registro de execuções", abaixo.

### Como listar as contas sem login há 24 meses

1. Abra o console do Firebase, projeto `iconula`, em
   **Authentication → Users**.
2. Ordene pela coluna **Last sign-in**, da mais antiga para a mais
   recente, e tome como candidatas as contas cuja última entrada é
   anterior ao corte de 24 meses. O console pagina a lista: percorra todas
   as páginas, não só a primeira.
3. Quando a lista for grande demais para conferir na tela, exporte-a e
   ordene fora do console:

   ```bash
   firebase auth:export usuarios.json --format=json --project iconula
   ```

   Cada registro traz `localId` (o `uid`) e `lastLoginAt` (em
   milissegundos desde a época); o corte é comparado com esse campo, não
   com a data de criação da conta.

### Como apagar

Para cada conta selecionada, na ordem do
[TDR 0027](tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md):

1. Apague o documento `users/{uid}` em **Firestore Database →
   `users`**, navegando até o documento pelo `uid`. Documento inexistente
   (conta criada que nunca gravou nada) não deixa dado no Firestore — siga
   direto para a conta.
2. Apague a conta em **Authentication → Users**: marque a conta e use
   **Delete account**; a lista aceita seleção múltipla.
3. Confira, ao fim de cada conta, que ela sumiu das duas listas —
   `users/{uid}` no Firestore e o `uid` no Auth. Se o link do catálogo
   estivesse ligado, ele morre com o documento.

### O que registrar a cada execução

Uma linha na tabela "Registro de execuções", abaixo, com:

- a data da execução e a data de corte (24 meses antes);
- quantas contas e quantos documentos foram apagados;
- quem executou;
- qualquer anormalidade (falha de acesso, conta que não sumiu, tentativa
  de novo login durante a operação).

**Não registrar nome, e-mail nem `uid`** — este repositório é público e o
registro não precisa de dado pessoal para provar que a rotina foi feita.

### Sem aviso por e-mail

A purga **não** avisa o titular por e-mail antes de apagar: o projeto está
no plano gratuito, não envia e-mail e não tem tarefa agendada
([DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md)). A
política declara só o prazo, não uma promessa de aviso que o app não
consegue cumprir.

## Registro de execuções

| Data | Corte | Contas e documentos apagados | Executor | Observações |
|---|---|---|---|---|
| — | — | — | — | Nenhuma execução desde a criação deste documento (2026-09-17). |

## Ciclo de revisão

Este documento é revisto pelo controlador:

- **a cada mudança de schema** do documento `users/{uid}`
  ([modelo-firebase.md](modelo-firebase.md)) ou de dependência que trate
  dado pessoal (Firebase Auth, Cloud Firestore, GitHub);
- **a cada mudança de base legal, prazo de retenção ou direito do
  titular**, feita nos textos da política ou dos termos;
- **ao menos uma vez a cada 12 meses**, mesmo sem mudança;

e cada revisão é anotada aqui, com a data e o que mudou. Mudança que seja
uma decisão nova é registrada no `docs/<tipo>/` correspondente antes de
entrar no documento (`AGENTS.md` § Convenções).

### Revisões

| Data | O que mudou |
|---|---|
| 2026-09-17 | Criação do documento — inventário e runbook da purga (Tarefa 0031-0006, [DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md), [IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)). |
