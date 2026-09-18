<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Privacidade no Iconula — inventário e procedimentos

Registro das operações de tratamento de dados pessoais do Iconula (LGPD
art. 37), o passo a passo do atendimento ao titular e o plano de resposta
a incidente (LGPD art. 48) — os procedimentos manuais que o controlador
executa ([DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md)).

Este documento é de responsabilidade do controlador — Daniel Felix
Ferber, pessoa física, Brasil, que também responde como encarregado (LGPD
art. 41), pelo canal de contato publicado na política de privacidade. O
que ele descreve é o estado real do app: as fontes do inventário são
[modelo-firebase.md](modelo-firebase.md), o
[IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md),
o [MDR 0009](model-dr/0009-campos-de-aceite-dos-textos.md) e o
[MDR 0007](model-dr/0007-persistencia-no-armazenamento-local.md).

**Cobertura**: o inventário completo do art. 37 (todos os campos de
`users/{uid}`), o runbook da purga por inatividade, o passo a passo do
atendimento ao titular e o plano de resposta a incidente — os três últimos
sem automação, no plano Spark, como decidiu o
[DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md).

## Inventário das operações de tratamento

| Dado | Finalidade | Base legal | Retenção | Operador | Transferência |
|---|---|---|---|---|---|
| Identidade da conta Google: nome, e-mail e foto de perfil | Autenticar o titular e identificar a conta que pede o app | Execução do contrato dos termos de uso (LGPD art. 7º, V) | Enquanto a conta existir; 24 meses sem login levam ao apagamento | Google (Firebase Auth) | **Sim** — a identidade é tratada globalmente pelo Firebase Auth, fora do Brasil, sob as cláusulas-padrão contratuais do Google (LGPD arts. 33 e 39) |
| Coleção de figurinhas: contagem por código e data da última gravação (`contagens`, `updatedAt`) | Guardar a coleção e devolvê-la igual no próximo login, em qualquer aparelho | Execução do contrato dos termos de uso (LGPD art. 7º, V) | Enquanto a conta existir; 24 meses sem login levam ao apagamento; descontinuado o projeto, até 90 dias | Google (Cloud Firestore, `southamerica-east1`) | **Não** — a coleção fica em servidores no Brasil |
| Marca de atestação de idade (`atestadoEm`) | Comprovar a atestação de maioridade ou de autorização pelos responsáveis | LGPD art. 14 — consentimento dos responsáveis pela atestação no primeiro login | Mesma da conta: enquanto ela existir; 24 meses sem login levam ao apagamento | Google (Cloud Firestore, `southamerica-east1`) | **Não** |
| Versões aceitas dos textos e instante do aceite (`termosVersao`, `politicaVersao`, `aceitoEm`) | Provar qual versão dos termos de uso e da política o titular aceitou e quando — o ônus da prova é do controlador | Execução do contrato dos termos de uso (LGPD art. 7º, V) | Mesma da conta: enquanto ela existir; 24 meses sem login levam ao apagamento | Google (Cloud Firestore, `southamerica-east1`) | **Não** |
| Coleção compartilhada por link (`contagens`, `updatedAt`, `linkAtivo`) | A pedido do titular, mostrar a coleção sem login a quem tiver o link | Consentimento específico (LGPD art. 7º, I), revogado ao desligar o link | Enquanto o link estiver ligado; desligado, a coleção volta à regra da conta | Google (Cloud Firestore, `southamerica-east1`) | **Não** pelo operador. A leitura é de terceiros que tenham o link, por escolha do titular ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)) |
| Preferências de vista, colapso manual e cache do SDK (no aparelho) | Funcionar a interface e sustentar a gravação local da coleção | Execução do contrato dos termos de uso (LGPD art. 7º, V) — estritamente funcional, sem rastreio | No aparelho, até o titular limpar os dados do navegador | Nenhum — não sai do aparelho | **Não** |

Observações do inventário:

- A exclusão pedida pelo titular dentro do app apaga a coleção **e** a
  conta de login ([IDR 0060](idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md),
  [TDR 0027](tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md)); a
  conta Google em si permanece, porque é do Google.
- A portabilidade (LGPD art. 18, V) é atendida pela exportação da coleção
  em JSON, no menu de ações.
- O aceite versionado guarda só a data de vigência dos textos e o instante
  do clique, não o texto integral
  ([MDR 0009](model-dr/0009-campos-de-aceite-dos-textos.md)).
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

## Atendimento ao titular

Quando o titular pede acesso, correção, portabilidade, exclusão ou
informação pelo canal de contato, o controlador:

1. **Confere a origem.** O pedido é atendido quando parte do **mesmo
   e-mail da conta Google** usada no app
   ([IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)).
   Se vier de outro endereço, pede a confirmação nessa conta antes de
   qualquer resposta — nunca entrega dado a quem escreve de fora.
2. **Identifica a conta.** Localiza o `uid` em **Authentication → Users**,
   pelo e-mail; o titular não precisa informar o `uid`.
3. **Atende conforme o direito**:
   - **confirmação e acesso** — lê o documento `users/{uid}` no Firestore e
     devolve o que existe;
   - **correção** — orienta o ajuste dentro do app, onde o titular mesmo
     edita a coleção; a identidade (nome, e-mail, foto) é do Google;
   - **portabilidade** (LGPD art. 18, V) — orienta a exportação em JSON, no
     menu de ações;
   - **exclusão** — o titular mesmo faz pelo painel da política; a pedido,
     o controlador apaga o documento e a conta na ordem do
     [TDR 0027](tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md).
4. **Responde em até 15 dias** (LGPD art. 19, §1º, II), pelo mesmo canal,
   como a política declara.
5. **Registra sem dado pessoal.** O atendimento não entra em tabela deste
   repositório público: nada de nome, e-mail nem `uid`, como no registro da
   purga.

## Plano de resposta a incidente

**Incidente de segurança** é o evento que pode acarretar risco ou dano
relevante aos titulares (LGPD art. 48) — distinto do relato de
vulnerabilidade do [`SECURITY.md`](../SECURITY.md), que descreve uma falha
ainda sem dado exposto. Descoberto por relato ou por qualquer outra fonte,
o incidente segue este roteiro manual
([DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md)); o
prazo de comunicação corre a partir do momento em que o controlador **sabe
que dados pessoais foram afetados**.

### Detecção

- relato de titular, pesquisador ou terceiro, pelo canal de contato ou pelo
  [Security Advisories](../SECURITY.md) do GitHub;
- falha do `npm run test:rules` no CI, que barra a mudança de regra antes
  do deploy;
- alertas das ferramentas do repositório (Dependabot, secret scanning,
  CodeQL) e do Google Cloud;
- login ou atividade anômala na conta do controlador;
- revisão periódica de `firestore.rules`, do `linkAtivo` e dos acessos.

### Contenção

- fechar o vetor: republicar as regras corretas
  (`firebase deploy --only firestore:rules`), desligar o link
  (`linkAtivo: false`), revogar sessões e girar a senha e o 2FA da conta do
  controlador, girar a service account do CI se atingida;
- preservar a evidência: não apagar log nem documento antes de registrar o
  estado;
- conter antes de comunicar: o aviso vem depois da avaliação de risco.

### Avaliação de risco

- **dados atingidos**: identidade (nome, e-mail, foto, no Auth), coleção
  (`contagens`, `updatedAt`), atestação (`atestadoEm`), aceite
  (`termosVersao`, `politicaVersao`, `aceitoEm`) e link público;
- **titulares atingidos**: cruzar a lista do Auth com os documentos do
  Firestore;
- **relevância**: só risco ou dano relevante faz nascer o dever de
  comunicar (LGPD art. 48).

### Comunicação

Havendo risco ou dano relevante:

- **à ANPD** — em **três dias úteis** contados do conhecimento de que o
  incidente afetou dados pessoais (Resolução CD/ANPD nº 15/2024, art. 6º),
  pelo formulário eletrônico do SEI!ANPD, com o conteúdo do art. 6º, §2º; as
  informações podem ser complementadas em vinte dias úteis (art. 6º, §3º);
- **aos titulares** — em **três dias úteis** (art. 9º), de forma direta e
  individualizada e em linguagem simples; quando a comunicação direta não
  for possível, publicação no próprio app por pelo menos três meses
  (art. 9º, §§1º a 3º);
- **único canal para avisar o titular** — o **e-mail da conta Google**, no
  Firebase Auth: no plano Spark o projeto não envia e-mail nem tem tarefa
  agendada, então o controlador envia manualmente, um a um, a partir da
  lista do Auth;
- os prazos **dobram** só para agentes de tratamento de pequeno porte
  (arts. 6º, §8º, e 9º, §6º; Resolução CD/ANPD nº 2/2022) — o Iconula,
  projeto sem fins econômicos, não se enquadra.

### Registro e correção

- manter o **registro do incidente** (art. 10): data da ocorrência e do
  conhecimento, causa, dados afetados, medidas de contenção e as
  comunicações feitas — sem dado pessoal de terceiros, porque o repositório
  é público;
- corrigir a causa: ajustar as regras e o teste que as cobre, o código ou a
  configuração, e revisar este documento no ciclo abaixo.

### Cenários concretos deste app

- **Regra do Firestore aberta por engano** — uma publicação de
  `firestore.rules` sem a guarda `request.auth.uid == userId` (ou com
  `get`/`list` liberados) deixaria qualquer requisição ler ou listar os
  documentos. O CI barra a mudança no `npm run test:rules`; se escapasse, a
  contenção é republicar as regras corretas, que valem em segundos, sem
  girar credencial. Risco: coleção e aceite de todos os titulares, e todo
  link ligado — potencial comunicação.
- **Conta do controlador comprometida** — com o console do Firebase, o
  invasor lê todos os documentos e altera regras. A detecção vem de login
  anômalo, alerta do Google ou mudança inesperada em regras ou dados; a
  contenção revoga sessões, troca a senha e reconfere o 2FA, gira a service
  account do CI se atingida e reconfere as regras. Risco: todo o Firestore
  e o Auth — tratar como exposição total, com a comunicação do art. 48.
- **Link de catálogo indexado** — o `/catalogo/<uid>` nasce desligado e sai
  com `X-Robots-Tag: noindex`
  ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md),
  [devops.md](devops.md) § Segurança); ainda assim, um link ligado pode ser
  rastreado ou compartilhado além do combinado. A contenção é desligar o
  link — grava `linkAtivo: false` e revoga a leitura pública — e pedir a
  remoção ao buscador. Risco: contagens e a existência do link, sem nome nem
  e-mail.

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
| 2026-09-18 | Consolidação do art. 37 — campos de aceite no inventário (`termosVersao`, `politicaVersao`, `aceitoEm`); atendimento ao titular; plano de resposta a incidente (Tarefa 0032-0005, [DDR 0011](devops-dr/0011-procedimentos-manuais-de-privacidade.md), [MDR 0009](model-dr/0009-campos-de-aceite-dos-textos.md), [IDR 0061](idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)). |
