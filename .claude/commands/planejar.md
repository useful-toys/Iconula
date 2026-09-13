---
description: Planeja novas funcionalidades ou correções em fases e tarefas prontas para o /executar-plano e o /executar-tarefa, entregues numa branch docs com PR
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Atue como **Principal Software Architect** e **AI Workflow Engineer** neste
repositório (Iconula). Sua entrega é um **Plano de Implementação executável por
um agente de código** — não código.

O plano produzido por este comando se soma ao plano existente em
`docs/plano/README.md` e **não o substitui**: fases e tarefas já concluídas ou
pendentes continuam válidas. O que você produz aqui são **fases novas** (ou
tarefas novas em fases ainda não concluídas) que atendem ao pedido do usuário,
entregues numa branch `docs` própria, com commit e PR.

## O contrato com a execução

O formato da tarefa, o comportamento padrão de toda tarefa, os status e as
regras gerais estão em **`docs/plano/CLAUDE.md`** (o guia). Toda tarefa gerada
aqui será executada pelo `/executar-tarefa` e toda fase pelo `/executar-plano`
**como estão**, sem interpretação. Por isso:

- **Siga o guia** § Formato da tarefa e § Conferência da tarefa, com os nomes
  de seção exatos.
- **Não repita** o que o guia define como comportamento padrão.
- **Não contradiga** o guia: nada de tarefa que dispense testes, log ou
  registro; que altere `docs/requisitos.md`; que mexa em `docs/setup-*.md` sem
  passos de setup; que fixe número de registro; que crie registro novo para
  "revisar" outro em vez de atualizá-lo.
- **Declare toda mudança de decisão documentada** como "Muda decisão
  documentada": o `/executar-tarefa` para e pergunta quando uma decisão da
  execução altera, reverte ou substitui um registro vigente sem previsão na
  tarefa.

## Entrada

`$ARGUMENTS` traz a descrição do que planejar. Pode ser:
- uma **nova funcionalidade** (ex.: `/planejar modo colaborativo de trocas`);
- uma **correção ou ajuste** em funcionalidade já implementada (ex.:
  `/planejar corrigir contagem de metalizadas na disposição álbum`);
- um **tema aberto** para análise (ex.: `/planejar avaliar virtualização do catálogo`).

Se `$ARGUMENTS` vier vazio, pare e peça ao usuário que descreva o que deseja
planejar.

## Etapa 0 — Leitura obrigatória (leia do disco; nada está anexado)

### Contrato (leia integralmente)

Guias `CLAUDE.md` de subdiretório **não são carregados automaticamente**:
todo guia citado neste comando é lido explicitamente, pelo caminho.

- `docs/plano/CLAUDE.md` — o guia do plano
- `.opencode/commands/executar-plano.md` (mesmo conteúdo em
  `.claude/commands/`) — como a fase vira branch, commits e PR

### Contexto geral do projeto (leia integralmente)
- `AGENTS.md` — convenções que valem para todo o plano
- `docs/requisitos.md` — fonte da verdade de escopo (MVP, futuros, fora de
  escopo); **não pode ser alterado por nenhuma tarefa**
- `docs/arquitetura.md` — camadas, fluxo, pontos em aberto
- `docs/interface.md` — telas, wireframes, paleta/medidas

### Estado atual do plano e das decisões
- `docs/plano/README.md` — fases e tarefas existentes; descubra o **número da
  última fase** para continuar a sequência
- `docs/arquitetura.md` § Pontos em aberto e `docs/interface.md` § Pendências
  de interface — pendências do produto que o tema pode resolver
- O `## Status` dos arquivos de tarefa das fases que o tema toca (fonte da
  verdade; divergência com o README é apontada)
- Os índices de decisão — `docs/adr/README.md`, `docs/tdr/README.md`,
  `docs/idr/README.md`, `docs/model-dr/README.md`, `docs/devops-dr/README.md` —
  para saber **quais decisões já existem sobre o tema**
- O guia de cada tipo que o tema toca, lido explicitamente — escopo do tipo e
  regra de registro vivo: `docs/adr/CLAUDE.md`, `docs/tdr/CLAUDE.md`,
  `docs/idr/CLAUDE.md`, `docs/model-dr/CLAUDE.md`, `docs/devops-dr/CLAUDE.md`
- Dos registros que o tema toca diretamente, leia **Status, Decisão,
  Consequências e Alternativas consideradas** — as alternativas recusadas
  mostram o que o plano estaria revertendo. Não leia todos os registros

### Referência e ambiente (leia só se o tema do plano tocar)
- `docs/modelo-firebase.md` — se o plano mexe com persistência no Firestore
- `docs/modelo-intercambio.md` — se o plano mexe com export/import JSON
- `docs/modelo-memoria.md` — se o plano mexe com a representação em memória na SPA
- `docs/devops.md` — se o plano mexe com CI/CD, deploy, pipeline ou ferramentas
- `docs/setup-firebase.md`, `docs/setup-gcloud.md`, `docs/setup-github.md`,
  `docs/setup-registrobr.md` — se o plano exige passos de setup de ambiente
- `docs/prototype/Iconula - Álbum de Figurinhas.html` — se o plano tem componente
  visual
- Código atual em `src/` — se o plano propõe componentes, módulos ou regras
  novas; confira os caminhos que as tarefas vão citar

### Verificação de novidade — é novo ou muda o que já foi feito?

Antes de propor qualquer fase, descubra se o pedido já foi tratado. Busque
pelos termos do pedido (nomes de telas, componentes, campos, regras,
comportamentos) em:
- título, objetivo e escopo de **todas** as tarefas de `docs/plano/*/` —
  de fases `Entregue`, `Em andamento` e `Pendente`;
- os logs `docs/plano/*/logs/` das tarefas relacionadas;
- os índices de decisão e os registros encontrados, inclusive
  "Alternativas consideradas" (o pedido pode ser uma alternativa já recusada);
- `docs/requisitos.md` (MVP, requisitos futuros, fora de escopo),
  `docs/interface.md` e `docs/arquitetura.md`;
- o código em `src/` (e `firestore.rules`, se tocar persistência), para
  confirmar o comportamento atual — o plano e os documentos podem estar
  atrás do código.

Classifique o pedido; partes diferentes podem ter classificações diferentes:

| Classificação | Quando | O que o plano faz |
|---|---|---|
| **Novo** | nada no plano, nos registros nem no código trata disso | fases ou tarefas novas |
| **Já entregue** | uma tarefa `Concluída` de fase `Entregue` já faz o que se pede, e o código confirma | não planeja: mostre a tarefa, o log e o trecho de código, e pare |
| **Já planejado** | uma tarefa `Pendente` já cobre o pedido | não duplica: aponte a tarefa; se o pedido difere, proponha ajustá-la |
| **Muda o que já foi feito** | o pedido altera comportamento entregue, decisão documentada ou alternativa recusada | tarefas novas que declaram "Muda decisão documentada" e citam a tarefa entregue como precedente; tarefa concluída nunca é editada |
| **Contraria requisito** | está fora de escopo em `docs/requisitos.md` ou exige mudá-lo | pare e peça a decisão do humano |

Para cada parte, registre a evidência: caminho e trecho da tarefa, do log, do
registro ou do código. "Já entregue" e "Contraria requisito" encerram o
planejamento daquela parte antes da Etapa 1.

### Ao final da Etapa 0
Liste em poucas linhas:
1. a **classificação do pedido** (seção "Verificação de novidade"), com a
   evidência de cada parte, e as **fases `Pendente` ou `Em andamento`** cujo
   objetivo ou área o pedido toca — são as primeiras candidatas a receber as
   tarefas novas;
2. o número da última fase no plano e o próximo disponível;
3. os registros vigentes que impõem restrição concreta ao plano proposto;
4. os registros cuja decisão o plano **altera, reverte ou substitui** (com o
   trecho) e os assuntos que provavelmente **nascem** como registro novo;
5. os `docs/*.md` que o plano provavelmente altera;
6. se o pedido exige mudar `docs/requisitos.md` — nesse caso, **pare** e peça
   a decisão do humano antes de planejar;
7. os registros que você leu e concluiu que não afetam o plano.

Se ficar sem contexto antes de terminar a leitura, diga isso em vez de planejar
com leitura parcial.

## Etapa 1 — Mapa de fases (PARE AQUI para aprovação humana)

Produza **apenas o conteúdo** que será acrescentado ao `docs/plano/README.md`,
impresso aqui no chat para revisão. **Não crie nem altere nenhum arquivo no
disco, nem branch, ainda.** O conteúdo deve ter:

- a classificação do pedido (novo, já planejado, muda o que já foi feito),
  com a evidência — as partes "já entregue" ou "contraria requisito" ficam
  de fora, com o motivo
- **primeiro**, as fases existentes pendentes ou em andamento que recebem
  tarefas novas, com a numeração das tarefas e o motivo; e as fases candidatas
  que foram descartadas, com o motivo
- tabela de fases novas, só para o que não coube em fase existente (número sequencial a partir da última existente, nome,
  objetivo em uma linha, dependências, PR previsto)
- dentro de cada fase, a lista de tarefas com título e uma linha de objetivo
- onde cada pendência ou decisão em aberto foi alocada, com o **tipo** de
  registro que nasce ou o registro existente que é atualizado
- as decisões documentadas que o plano altera, reverte ou substitui, e em qual
  tarefa — para o humano aprovar essas mudanças explicitamente
- as tarefas com passos de setup ou configuração pública
- indicação de quais fases já existentes (pendentes) são afetadas pelo plano
  novo, se for o caso

### Regras de fatiamento

1. **Cada fase = um PR mesclável na `main`** e **cada tarefa = um commit de
   estado válido** (guia § Estrutura). Se duas mudanças não se sustentam
   separadas, são uma tarefa só.
2. **Fatia vertical primeiro.** A primeira fase funcional deve entregar algo
   visível ponta a ponta quando possível; só depois camadas de suporte,
   refinamentos e acabamento.
3. **Tamanho.** No máximo 6 fases e 6 tarefas por fase; correção pequena pode
   ser uma fase de uma tarefa. Uma tarefa é poucos arquivos e um assunto.
4. **Ordem e dependência** (guia § Estrutura › Dependências). Tarefa depende
   **somente** das tarefas anteriores da mesma fase — de todas, na ordem.
   Fase pode depender de outras fases, na coluna "Depende de". Se uma tarefa
   precisa do que outra fase entrega, coloque-a naquela fase ou faça a fase
   dela depender da outra; nunca escreva uma tarefa de outra fase como
   pré-requisito.
5. **Fases em paralelo** (dependendo só de fases já concluídas) são possíveis;
   o `/executar-plano` renumera registros de decisão que colidirem antes do
   PR. Evite, porém, duas fases paralelas alterando os mesmos arquivos de
   código.
6. **Pendências e decisões em aberto.** Toda tarefa que depende de decisão
   ainda aberta nomeia-a em "Decisões em aberto nesta tarefa", com a resolução
   proposta. Se o plano resolve um ponto de `docs/arquitetura.md` § Pontos em
   aberto ou de `docs/interface.md` § Pendências de interface, aloque-o numa
   tarefa, que atualiza o documento ao concluir. Não há tabela de pendências
   no README (guia § Estrutura).
7. **Mudança de decisão documentada é explícita** e aprovada na Etapa 1.
8. **Requisito não funcional que a tarefa pode quebrar vira critério de
   aceite específico** — por exemplo, "a gravação continua agregada, sem
   requisição por figurinha" numa tarefa de persistência. Os que valem para
   toda tarefa estão no guia § Regras que valem em toda tarefa.
9. **Documentação.** Toda mudança prevista em `docs/*.md` precisa de um
   registro que a lastreie. `docs/requisitos.md` nunca muda. `docs/setup-*.md`
   só muda em tarefa com passos de setup explícitos no escopo.

### Interação com fases e tarefas existentes

Aplique o guia § Status e ciclo de vida:
- **Primeiro, fases existentes.** Se a melhoria ou correção se aplica a uma
  fase **pendente ou em andamento** — mesmo objetivo, mesma área de código ou
  de interface, ou algo que aquela fase entrega e ainda não mesclou —
  **considere acrescentar tarefas a ela** antes de criar fase nova. Crie fase
  nova só quando o trabalho não cabe em nenhuma, ou quando entrar numa fase
  existente a tornaria grande demais (mais de 6 tarefas) ou atrasaria uma
  entrega já em PR; diga o motivo.
- **Tarefas concluídas são imutáveis**: rever o que entregaram é tarefa nova.
- **Fase `Pendente` ou `Em andamento` pode receber tarefas novas.** Diga qual
  fase recebe,
  por que pertencem a ela, a numeração (sequencial a partir da última
  existente) e se a fase já tem branch ou PR aberto
  (`git branch -a --list '*-NNNN'`, `gh pr list --head <branch>`) — nesse
  caso, avise que as tarefas novas entram num PR em andamento e peça
  confirmação.
- **Fase `Entregue` (fechada) não recebe tarefas**: crie fase nova que a cite
  como dependência.
- **Tarefas pendentes podem ser ajustadas.** Para cada fase pendente afetada,
  diga qual, se a nova fase vem antes, depois ou em paralelo, e que ajuste
  precisa.

## Etapa 2 — Gravar, commitar e entregar o plano (só após aprovação explícita)

### 2.1 Branch e worktree do plano

1. `git status --short` na árvore atual: alteração não commitada → pare e peça
   para resolver.
2. Sincronize a `main` com o remoto pela skill `git-remote-sync-guard`.
3. **Nome da branch** pela skill `git-branch-name`, com **type** `docs`,
   **name** descrevendo o que o plano entrega e **task-id** = número da
   primeira fase nova (ou da fase existente que recebe tarefas). Exemplo:
   `docs/planeja_modo_colaborativo-0015`.
4. Se já existir branch ou worktree terminando nesse número para o plano,
   pergunte se deve reaproveitá-la.
5. Confirme que `.worktrees/` é ignorado pelo Git
   (`git check-ignore -q .worktrees/x`); se não for, pare e avise.
6. `git worktree add .worktrees/<diretório> -b <branch> origin/main` e
   trabalhe **somente** dentro dela.

### 2.2 Arquivos

Escreva apenas em `docs/plano/`:
- **Fases novas**: pasta `docs/plano/NNNN-nome-da-fase/` e os arquivos de
  tarefa, no guia § Formato da tarefa. **Não crie** a pasta `logs/`.
- **Tarefas novas em fase não concluída**: arquivos na pasta da fase,
  numerados a partir da última tarefa presente.
- **Ajustes em tarefas pendentes**, quando aprovados na Etapa 1.
- **`docs/plano/README.md`**: tabela de fases (status `Pendente`) e seção da
  fase com a tabela de tarefas (status `Pendente`). Não escreva números de
  registro novos; o README não repete regras do guia nem lista pendências.

Passe cada tarefa pelo guia § Conferência da tarefa e corrija antes de
commitar.

### 2.3 Commit e PR

1. Commit único com os arquivos do plano (mensagem pela skill
   `git-commit-message`).
2. Liste ao humano os arquivos criados ou alterados e o resultado da
   conferência, e **pergunte se deve abrir o PR**.
3. Autorizado → `git push -u origin <branch>` e PR para a `main` com título,
   descrição e labels pela skill `git-pull-request-message` (label
   `documentation`). A descrição traz as fases e tarefas, as decisões
   documentadas que o plano muda e as tarefas com setup. Não faça merge nem
   ative auto-merge.
4. Lembre que as fases só podem ser executadas com `/executar-plano NNNN`
   **depois do merge** do PR do plano.

## Após o planejamento

- **`/executar-plano NNNN`** — executa uma fase: branch e worktree próprias,
  cada tarefa num subagente, PR e acompanhamento de CI e preview.
- **`/executar-tarefa NNNN-XXXX`** — executa uma tarefa e termina num commit
  de estado válido.

## Restrições desta entrega

- **Na Etapa 1**: não crie nem altere arquivo nem branch; imprima o plano no
  chat e pare para aprovação.
- **Na Etapa 2**: escreva apenas em `docs/plano/`, na worktree do plano.
- Este comando não executa o plano, não cria registros de decisão e não altera
  `docs/*.md` fora de `docs/plano/` — apenas prevê o que a execução fará.
- Não invente caminhos, números de decisão ou requisitos: se não está na
  documentação, é decisão em aberto e vai para a seção correspondente.
- Não reabra o que já está decidido nos registros vigentes sem declarar a
  mudança na tarefa e obter a aprovação do humano na Etapa 1.
- Nunca faça merge.
- Todo o plano em português do Brasil.
