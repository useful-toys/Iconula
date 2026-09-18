<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0031-0006: inventário e documentação de privacidade

## Data
2026-09-17

## Resumo
Antes: não existia documento de conformidade — o registro das operações de
tratamento (LGPD art. 37) estava espalhado entre `requisitos.md`,
`modelo-firebase.md` e a própria política, e a purga por inatividade
declarada na política (24 meses, IDR 0061) não tinha runbook. Depois: nasce
`docs/privacidade.md`, que reúne o inventário das cinco operações de
tratamento (dado, finalidade, base legal, retenção, operador,
transferência), o runbook da purga por inatividade — listagem no console do
Firebase, apagamento do documento e da conta, periodicidade semestral,
registro do que foi feito, sem prometer aviso por e-mail —, o registro de
execuções (vazio) e o ciclo de revisão do próprio documento. O
`docs/setup-gcloud.md` ganha a seção do aceite do Cloud Data Processing
Addendum (o passo do controlador que sustenta o Google como operador
declarado na política), o `docs/setup-firebase.md` remete a ela, o
`docs/devops.md` aponta o documento novo na seção Segurança, o
`docs/arquitetura.md` indexa os cinco registros da fase e o `AGENTS.md`
ganha a linha do documento. Nenhum comando foi executado no Firebase ou no
Google Cloud: o aceite é documentado, não executado.

## Discovery
- Código: não se aplica — a tarefa não altera código, testes, estilos,
  regras nem workflows; `npm run lint && npm run test && npm run build`
  roda como validação regressiva.
- Documentação: as referências bastaram em parte — li o DDR 0011 inteiro
  (o que é manual, o runbook e por que nada é automatizado), o IDR 0061
  inteiro (prazos, bases legais, operador e transferência), e confirmei em
  `docs/requisitos.md` § Privacidade que o produto pede "inventário,
  runbook da purga por inatividade e plano de resposta a incidente" (o
  plano de incidente é da Tarefa 0032-0005). Também li
  `docs/modelo-firebase.md` §§ Onde os dados vivem, Formato do documento,
  Operações e Regras (a fonte do inventário), o TDR 0027 (a ordem
  documento→conta da exclusão), o IDR 0060 (o painel de exclusão), o
  TDR 0028 (o canal de contato) e o MDR 0007 (o que vive no
  armazenamento local), além de `docs/setup-gcloud.md` (estrutura das
  seções) e `docs/arquitetura.md` § Decisões-chave e onde vivem (as
  linhas a acrescentar).
  - Onde exatamente se aceita o CDPA: confirmado na página oficial de
    ajuda do Google Cloud
    (`https://support.google.com/cloud/answer/6329727`, "How to opt in to
    the Cloud Data Processing Addendum"): console → IAM e administração,
    projeto selecionado, seção "Cloud Data Processing Addendum" →
    "Review and Accept" → "I Accept"; só é necessário se o contrato do
    Google Cloud não incorporar o CDPA por referência.
- Impactos fora de "Arquivos impactados": nenhum. `docs/setup-firebase.md`
  § Cloud Firestore está defasado (ainda fala de `teamName` e de "sem
  `delete`"), mas só recebe o remetente previsto; a defasagem antiga vai
  para `observacoes` (§ Documentação viva, item 4).

## Plano da alteração
1. `docs/privacidade.md` — criar: escopo; inventário das operações de
   tratamento (dado, finalidade, base legal, retenção, operador,
   transferência, a partir de `modelo-firebase.md` e do IDR 0061); runbook
   da purga por inatividade (critério de 24 meses, como listar no console
   do Firebase, como apagar conta e documento, periodicidade semestral, o
   que registrar a cada execução, sem prometer aviso por e-mail); registro
   de execuções (vazio); e ciclo de revisão do documento.
2. `docs/setup-gcloud.md` — seção nova "Proteção de dados (Cloud Data
   Processing Addendum)": o que é, onde se aceita, por que a política
   depende dele e como conferir o estado; passo correspondente no
   "Reproduzindo do zero (resumo)".
3. `docs/setup-firebase.md` § Cloud Firestore — remeter à seção nova de
   `setup-gcloud.md`.
4. `docs/devops.md` § Segurança — subseção "Procedimentos de privacidade"
   apontando `docs/privacidade.md` e citando o DDR 0011.
5. `docs/arquitetura.md` § Decisões-chave e onde vivem — linhas de
   IDR 0060, IDR 0061, TDR 0027, TDR 0028 e DDR 0011.
6. `AGENTS.md` § Onde fica cada coisa — linha de `docs/privacidade.md`.
7. Status da tarefa e do README, log e commit.
- Verificação prevista: critério 1 e 2 → trechos do documento novo
  (tabela com as seis colunas, runbook, periodicidade) e busca negativa
  por promessa de aviso por e-mail; critério 3 → trecho do DPA em
  `setup-gcloud.md`; critério 4 → cinco links novos em `arquitetura.md`,
  cada caminho existente; critério 5 → trecho do `devops.md`; critério 6 →
  histórico de comandos (nenhum em Firebase/Google Cloud); critério 7 →
  `npm run lint && npm run test && npm run build`.
- Riscos: divergir do que a política já publica (mitigado por extrair o
  inventário do IDR 0061 e do `modelo-firebase.md`, não de memória);
  prometer aviso por e-mail no runbook (evitado explicitamente).
- Desvios: nenhum.

## Decisões tomadas
- Periodicidade da purga: **semestral**, em janeiro e julho, o que faz a
  exclusão acontecer entre 24 e 30 meses após o último login — premissa
  conservadora dentro do prazo declarado, nível 1 (detalhe de
  procedimento interno, dentro do que o DDR 0011 já decidiu).
- Não registrar nome, e-mail nem `uid` no registro de execuções, porque o
  repositório é público — nível 1.
- Estrutura do documento (inventário em tabela de seis colunas, runbook,
  registro de execuções, ciclo de revisão) — nível 1, apresentação
  interna, sem nova decisão significativa: o conteúdo e as obrigações já
  estão no DDR 0011 e no IDR 0061.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum — a tarefa documenta o aceite do CDPA; nenhum comando foi executado
no Firebase ou no Google Cloud.

## Validação
`npm run lint` → `Found 0 warnings and 0 errors.` (96 arquivos, 105 regras).

`npm run test` → `Test Files 47 passed (47)` / `Tests 619 passed (619)`.

`npm run build` → `✓ built in 421ms`; o mesmo aviso de chunk acima de 500 kB
(`index.esm-*.js`, 505.99 kB), pré-existente e não relacionado a esta
tarefa.

`npm run test:rules` não se aplica — `firestore.rules` não foi tocado.

Verificações dos critérios (saída real):
- `docs/privacidade.md` → cabeçalho do inventário
  `| Dado | Finalidade | Base legal | Retenção | Operador | Transferência |`
  (seis colunas), cinco linhas de operação, runbook da purga e
  periodicidade "A cada seis meses";
- busca por promessa de aviso no runbook → a seção "Sem aviso por e-mail"
  afirma que **não** avisa; nenhuma promessa de aviso individual;
- `docs/setup-gcloud.md` → seção "Proteção de dados (Cloud Data Processing
  Addendum)", com o passo do controlador, onde se aceita e como conferir o
  estado; passo 3 do "Reproduzindo do zero (resumo)";
- `docs/arquitetura.md` → linhas em 180 (DDR 0011), 193 (TDR 0027), 194
  (TDR 0028), 201 (IDR 0060) e 202 (IDR 0061), todos os caminhos existem;
- `docs/devops.md` → subseção "Procedimentos de privacidade" aponta
  `privacidade.md` e cita o DDR 0011;
- `AGENTS.md` → linha de `docs/privacidade.md` em § Onde fica cada coisa;
- nenhum comando em Firebase ou Google Cloud foi executado (só `npm run *`
  e buscas em documentação).

## Critérios de aceite
- [x] `docs/privacidade.md` existe e traz o inventário com as seis colunas e
      o runbook da purga, com periodicidade definida — cabeçalho da tabela
      e seção "Periodicidade" ("A cada seis meses, em janeiro e julho") no
      documento novo.
- [x] O runbook não promete aviso individual por e-mail — seção "Sem aviso
      por e-mail" afirma o contrário (o projeto não envia e-mail; a
      política declara só o prazo).
- [x] `docs/setup-gcloud.md` descreve o aceite do DPA como passo do
      controlador, com onde conferir o estado atual — seção "Proteção de
      dados (Cloud Data Processing Addendum)", itens 1 a 4.
- [x] `docs/arquitetura.md` § Decisões-chave lista os cinco registros novos,
      com links relativos válidos — linhas de DDR 0011, TDR 0027, TDR 0028,
      IDR 0060 e IDR 0061; cada arquivo existe.
- [x] `docs/devops.md` § Segurança aponta o documento novo citando o
      DDR 0011 — subseção "Procedimentos de privacidade".
- [x] Nenhum comando foi executado em Firebase ou Google Cloud por esta
      tarefa — só `npm run lint/test/build` e buscas em documentação.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas
      acima.

## Arquivos alterados
- `docs/privacidade.md` — criado: inventário das operações de tratamento,
  runbook da purga por inatividade, registro de execuções e ciclo de
  revisão (lastro: DDR 0011, IDR 0061).
- `docs/setup-gcloud.md` — seção "Proteção de dados (Cloud Data Processing
  Addendum)" e o passo 3 do resumo de reprodução.
- `docs/setup-firebase.md` — § Cloud Firestore remete à seção nova do
  `setup-gcloud.md`.
- `docs/devops.md` — § Segurança: subseção "Procedimentos de privacidade"
  (lastro: DDR 0011).
- `docs/arquitetura.md` — § Decisões-chave e onde vivem: linhas de
  IDR 0060, IDR 0061, TDR 0027, TDR 0028 e DDR 0011.
- `AGENTS.md` — § Onde fica cada coisa: linha de `docs/privacidade.md`.
- `docs/plano/0031-.../0006-...md` — status `Em andamento` → `Concluída`.
- `docs/plano/README.md` — linha da tarefa `Em andamento` → `Concluída`.
- `docs/plano/0031-.../logs/0006-...md` — este log (criado).

## Observações para o fechamento da fase
- `docs/tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md` § Status cita
  só as Tarefas 0031-0001 e 0031-0003; as funções de Auth vieram na
  0031-0002 — status defasado (fora dos Arquivos impactados desta tarefa).
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão ainda diz que
  `delete` e `list` são negados; o `delete` mudou na Tarefa 0031-0001 —
  defasado (fora dos Arquivos impactados).
- `docs/setup-firebase.md` § Cloud Firestore está defasado de antes desta
  fase: fala em "preferência de bandeira", "único campo `teamName`" e "sem
  `delete`", e o `hasOnly` listado não inclui `linkAtivo`. A tarefa só
  acrescentou o remetente previsto; a correção é de outra tarefa.
