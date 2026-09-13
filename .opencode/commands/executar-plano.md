---
description: Executa uma fase do plano (docs/plano/) numa branch e worktree próprias, tarefa a tarefa em subagentes, entrega num PR e acompanha CI e preview
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Execute **uma fase** do plano de implementação (`docs/plano/`) do começo à
entrega. Você é o **orquestrador**: prepara a branch e a worktree da fase,
delega cada tarefa não concluída a um subagente que roda `/executar-tarefa`,
confere o resultado de cada uma, entrega a fase num Pull Request para a `main`
e acompanha os checks até ficarem verdes.

Você **não implementa tarefas** diretamente: todo código, registro de decisão
e log de tarefa nasce dentro do subagente. Seu trabalho é preparar, sequenciar,
verificar, entregar e acompanhar.

Status, formato do log e regras comuns estão em **`docs/plano/CLAUDE.md`** (o
guia). Em conflito, o guia vence.

## Entrada

`$ARGUMENTS` traz o **número da fase** (ex.: `11` ou `0011`).

Se vier vazio, liste as fases do `docs/plano/README.md` que não estão
`Entregue` (número, nome, status, tarefas pendentes, dependências) e pergunte
qual executar. Não escolha sozinho.

## 1. Preparação (somente leitura)

1. Leia `AGENTS.md`, o guia `docs/plano/CLAUDE.md` e `docs/plano/README.md`.
   Guias `CLAUDE.md` de subdiretório **não são carregados automaticamente**:
   todo guia citado neste comando é lido explicitamente, pelo caminho.
2. `git fetch origin` e localize a pasta `docs/plano/[NNNN-nome-da-fase]/`
   **na `origin/main`** (`git ls-tree -r --name-only origin/main docs/plano/`).
   - Se a fase não existir na `origin/main`, pare: o plano dela ainda não foi
     mesclado (o `/planejar` entrega o plano num PR próprio).
   - Se a cópia local da fase divergir da `origin/main`, avise; a execução usa
     a versão da `origin/main`.
3. Leia o `## Status` de **cada** arquivo de tarefa da fase e monte a lista
   em ordem numérica: `NNNN-XXXX · título · status`.
   - O arquivo da tarefa é a fonte da verdade (guia § Status e ciclo de vida);
     divergência com o README é apontada.
   - Fase `Entregue` na `origin/main` → diga isso e pare: fase fechada não é
     executada de novo; mudança nela é fase nova, via `/planejar`.
   - Todas as tarefas `Concluída` mas a fase não `Entregue` → não há tarefa a
     executar; retome pela branch da fase direto no fechamento (seção 4) e na
     entrega (seção 5).
   - Alguma `Bloqueada` → mostre a pergunta registrada e pare até o humano
     responder.
   - Alguma `Em andamento` → uma execução anterior não terminou; na retomada
     (seção 2), confira a worktree antes de relançar.
4. Confira as **dependências da fase** na tabela de fases. Se alguma fase de
   que esta depende não está `Entregue` na `origin/main`, pare e pergunte se
   deve seguir mesmo assim.
5. Apresente em poucas linhas: a fase, as tarefas que serão executadas (em
   ordem), as que serão puladas por já estarem concluídas, e as tarefas com
   passos de setup ou configuração pública (que vão pedir confirmação).

## 2. Branch e worktree da fase

1. `git status --short` na árvore atual: se houver alteração não commitada,
   pare e peça para resolver — não a carregue para a worktree.
2. Sincronize a `main` com o remoto seguindo a skill `git-remote-sync-guard`.
3. **Nome da branch** pela skill `git-branch-name`, com:
   - **task-id** = número da fase com 4 dígitos (ex.: `0011`);
   - **name** = slug que descreve o **objetivo da fase** (coluna "Objetivo"
     da tabela de fases), não o nome da primeira tarefa;
   - **type** pela natureza da fase (em geral `feature` ou `bugfix`; `docs`
     se a fase só mexe em documentação).

   Exemplo: `feature/refina_cabecalho_controles-0011`, worktree
   `.worktrees/feature-refina_cabecalho_controles-0011`.
4. **Retomada**: antes de criar, procure branch local ou remota e worktree
   que já terminem em `-NNNN` desta fase (`git branch -a --list '*-NNNN'`,
   `git worktree list`). Se existir, **reaproveite-a**: confira
   `git status --short` nela (alterações sem commit de uma execução que falhou
   → pare e mostre), sincronize-a com a `main` pela skill
   `git-remote-sync-guard` e verifique se já há PR aberto
   (`gh pr list --head <branch>`).
5. Confirme que `.worktrees/` é ignorado pelo Git
   (`git check-ignore -q .worktrees/x`). Se não for, pare e avise.
6. Crie a worktree a partir da `main` sincronizada, na raiz do repositório
   principal:
   `git worktree add .worktrees/<diretório> -b <branch> origin/main`.
7. Dentro da worktree, rode `npm install`. Se existir `.env.local` na raiz do
   repositório principal, copie-o para a worktree (é ignorado pelo Git; serve à
   verificação visual em `npm run dev`).
8. A partir daqui, **todo** comando de Git, npm e leitura/escrita de arquivo
   acontece dentro da worktree. Guarde o **caminho absoluto** dela.

## 3. Execução das tarefas (uma por vez, cada uma num subagente)

Para cada tarefa não concluída, **na ordem numérica e sequencialmente** —
nunca duas ao mesmo tempo, porque cada tarefa parte do commit da anterior.

### 3.1 Delegar

Inicie um subagente com a ferramenta de subagente da sua ferramenta (no
OpenCode, `task` com o agente `general`; no Claude Code, o subagente de
propósito geral) e **espere-o terminar** antes de seguir. O subagente começa
sem o contexto desta conversa: o prompt precisa ser autocontido. Use este
modelo:

```
Execute a Tarefa NNNN-XXXX do plano do Iconula seguindo integralmente o
comando /executar-tarefa (`.opencode/commands/executar-tarefa.md`, mesmo
conteúdo em `.claude/commands/executar-tarefa.md`), com `$ARGUMENTS` =
`NNNN-XXXX`. Leia explicitamente o guia `docs/plano/CLAUDE.md` e, antes de
registrar decisões, o guia da pasta do tipo (`docs/adr/CLAUDE.md`,
`docs/tdr/CLAUDE.md`, `docs/idr/CLAUDE.md`, `docs/model-dr/CLAUDE.md`,
`docs/devops-dr/CLAUDE.md`) — nenhum deles é carregado automaticamente.

Diretório de trabalho: <caminho absoluto da worktree>. Rode todo comando e
leia/escreva todo arquivo apenas dentro dele.
Branch: <branch da fase>, já criada e sincronizada — não crie, troque,
rebaseie nem apague branch ou worktree.

Modo delegado: você não conversa com o humano. Não faça push, não abra PR e
não execute outras tarefas além desta.

Tarefas desta fase já concluídas nesta branch: <lista NNNN-XXXX · título ·
SHA do commit>, para contexto.
Observações das tarefas anteriores: <observações relevantes>.

<se a tarefa estava Bloqueada e o humano respondeu:
Resposta do humano (AAAA-MM-DD) à pergunta da tarefa: ...>

<se o humano confirmou um comando:
Confirmação do humano (AAAA-MM-DD): autorizo executar exatamente
`<comando>` no ambiente <ambiente>. Qualquer outro comando que exija
confirmação continua bloqueado.>

Ao terminar, responda apenas com o relatório final no formato da seção
"Relatório final" do /executar-tarefa.
```

### 3.2 Conferir

Não confie só no relatório. Depois de cada subagente, na worktree:

1. **Concluída**: `git status --short` limpo e `git log -1` mostrando o
   commit informado, na branch da fase.
2. O `## Status` do arquivo da tarefa e a linha dela no `docs/plano/README.md`
   dizem `Concluída`, e o log existe — tudo no mesmo commit do trabalho.
3. O commit não toca arquivos de outras tarefas nem de tarefas já concluídas.
4. O relatório diz todos os critérios de aceite atendidos (a única pendência
   aceita é a verificação visual declarada), e o log segue o guia
   (§ Formato do log): `## Discovery` e `## Plano da alteração` preenchidos
   (com os desvios explicados), `## Decisões tomadas`, `## Setup realizado` com o
   comando exato de cada passo e sem segredos em claro (ou "Nenhum"),
   `## Validação` com saída real e `## Critérios de aceite` com evidência por
   item.
5. Todo registro de decisão citado no relatório existe no commit, com a linha
   no índice da pasta.
6. **Bloqueada**: existe um commit só com a mudança de status, e a pergunta
   está no arquivo da tarefa. Código parcial não commitado listado no
   relatório não é descartado nem commitado.

### 3.3 Decidir o próximo passo

- **Concluída e conferida** → siga para a próxima tarefa, passando adiante as
  observações relevantes do subagente.
- **Bloqueada por pergunta** → pare a fase. Mostre ao humano a pergunta e as
  alternativas e espere a resposta. Não execute as tarefas seguintes. Com a
  resposta, relance a mesma tarefa incluindo a resposta no prompt.
- **Bloqueada por confirmação pendente** → mostre ao humano o comando exato,
  o ambiente, o efeito e como reverter, e pergunte se autoriza.
  - Autorizou → relance a mesma tarefa com a `Confirmação do humano` cobrindo
    **exatamente** aquele comando.
  - Não autorizou → pergunte se deve ajustar a tarefa (via `/planejar`), pular
    ou interromper a fase.
- **Falhou**, ou a conferência encontrou problema → não tente mascarar nem
  corrigir no lugar do subagente. Pare, mostre o que falhou (comando e saída)
  e pergunte se deve relançar a tarefa com orientação adicional, pular ou
  interromper a fase. Nunca relance o mesmo prompt sem mudar nada.

## 4. Fechamento da fase

Quando todas as tarefas estiverem `Concluída`:

1. Na worktree, rode a validação completa da fase:
   `npm run lint && npm run test && npm run build`. Se algum commit da fase
   tocou `firestore.rules`, rode também `npm run test:rules` (exige JDK 21+;
   falha por JDK antigo é de ambiente — informe, não mascare).
2. Confira o escopo: `git diff --stat origin/main...HEAD` só contém o que as
   tarefas da fase previam em "Arquivos impactados", mais registros de
   decisão e índices, `docs/*.md` atualizados, logs e `docs/plano/`. Arquivo
   inesperado → pare e mostre.
3. Confira as convenções que atravessam tarefas: todo arquivo novo tem o
   cabeçalho de copyright; os `docs/*.md` refletem o estado da fase e cada
   trecho alterado cita o registro que o lastreia;
   `git diff --name-only origin/main...HEAD` não lista `docs/requisitos.md`,
   nem `docs/setup-*.md` se nenhuma tarefa da fase tinha passos de setup;
   links relativos novos não estão quebrados. Violação → pare e mostre.
4. Atualize o status da fase na tabela de fases do `docs/plano/README.md` para
   `Entregue` num commit próprio (mensagem pela skill `git-commit-message`).
   O merge do PR é o que efetiva a entrega na `main` (guia § Status e ciclo de
   vida › Fase); se o PR for fechado sem merge, a fase não foi entregue.

## 5. Entrega

### 5.1 Sincronizar

Sincronize a branch da fase com a `main` pela skill `git-remote-sync-guard`.
Conflitos:
- **só em índices de decisão** (`docs/<tipo>/README.md`) ou em linhas de
  tabela do `docs/plano/README.md` → resolva mantendo as linhas das duas
  lados, na ordem numérica, e siga para a renumeração;
- **qualquer outro arquivo** → pare e peça orientação.

### 5.2 Renumerar registros de decisão

Outra branch pode ter mesclado na `main` um registro com o mesmo número que
esta fase criou. Antes de renumerar, leia o guia de cada pasta envolvida —
`docs/adr/CLAUDE.md`, `docs/tdr/CLAUDE.md`, `docs/idr/CLAUDE.md`,
`docs/model-dr/CLAUDE.md`, `docs/devops-dr/CLAUDE.md` — para o formato do
título, dos links e da linha do índice.

1. Liste os registros **criados** pela fase:
   `git diff --name-status --diff-filter=A origin/main...HEAD -- docs/adr docs/tdr docs/idr docs/model-dr docs/devops-dr`
   (ignore `README.md` e `CLAUDE.md`).
2. Para cada um, confira se a `origin/main` já tem arquivo com o mesmo número
   na mesma pasta (`git ls-tree --name-only origin/main docs/<tipo>/`).
3. Havendo colisão, dê ao registro da fase o próximo número livre depois do
   maior entre `origin/main` e a branch, em ordem de criação:
   - `git mv` do arquivo e troca do número no título (`# IDR NNNN: …`);
   - atualize todas as referências nos arquivos alterados pela fase — links
     com o nome do arquivo e menções como `IDR NNNN` — incluindo logs,
     `docs/*.md`, arquivos de tarefa da fase e o índice da pasta (linha na
     posição numérica certa);
   - confira que nenhuma referência antiga ficou (busca pelo nome antigo e
     por `TIPO NNNN` nos arquivos da fase).
4. Commite a renumeração num commit próprio (mensagem pela skill
   `git-commit-message`) e registre, na descrição do PR, a tabela
   `número antigo → número novo`.
5. Se houve sincronização com mudanças ou renumeração, repita a validação do
   passo 4.1.

### 5.3 PR

1. `git push -u origin <branch>` (use `--force-with-lease` apenas se a branch
   já estava no remoto e foi rebaseada).
2. Título, descrição e labels pela skill `git-pull-request-message`, partindo
   da coluna **PR previsto** da tabela de fases. A descrição traz: objetivo da
   fase; tarefas entregues com link para o arquivo de cada uma e para o log;
   registros de decisão criados ou atualizados (e a renumeração, se houve);
   setups realizados (ambiente, objetivo e link para a seção do log com os
   comandos); verificações visuais pendentes com o roteiro; pendências que
   ficaram abertas; como verificar no preview deploy.
3. Se já existe PR aberto para a branch, atualize-o (`gh pr edit`) em vez de
   abrir outro. Senão, `gh pr create --base main --head <branch>`.
4. Não faça merge nem ative auto-merge.

## 6. Acompanhar CI e preview

1. Espere os checks do PR terminarem (`gh pr checks <PR> --watch`),
   incluindo os required checks e o preview deploy.
2. **Tudo verde** → pegue a URL do preview no comentário do workflow
   (`gh pr view <PR> --comments`) e siga para o resumo.
3. **Algum check falhou** → leia o log da falha
   (`gh run view <run-id> --log-failed`) e classifique:
   - **ambiente ou infraestrutura** (secret ausente, cota, permissão,
     instabilidade do serviço) → não corrija; pare e mostre ao humano a causa
     e o trecho do log. Se parecer instabilidade, pergunte antes de rodar de
     novo (`gh run rerun <run-id> --failed`);
   - **código, teste, lint ou build** → corrija na worktree:
     - a correção segue o guia `docs/plano/CLAUDE.md` como uma tarefa (escopo
       mínimo, decisões registradas pelo guia da pasta do tipo, `docs/*.md`
       lastreados, validação completa verde);
     - registre em `## Correções pós-PR` do log da tarefa cuja mudança causou
       a falha (ou na descrição do PR, se não for atribuível a uma tarefa);
     - commit com mensagem pela skill `git-commit-message`, citando a fase e o
       check; `git push`;
     - volte ao passo 1.
4. **No máximo 3 ciclos de correção.** Se ainda falhar, pare e mostre ao
   humano o histórico das tentativas.
5. Main avançou enquanto o PR estava aberto e o GitHub pede atualização →
   repita as seções 5.1 e 5.2 antes de corrigir qualquer outra coisa.

## 7. Resumo ao humano

Tarefas executadas e commits, registros de decisão (e renumeração),
setups realizados, correções pós-PR, verificações visuais pendentes com a URL
do preview, pendências e a URL do PR com o estado dos checks. Ofereça remover
a worktree **depois** do merge.

## Restrições

- Uma fase por execução; uma branch e um PR por fase.
- Tarefas sempre em sequência, cada uma num subagente próprio, esperando o
  anterior terminar.
- Nunca altere tarefas com status `Concluída`, nem as de outras fases.
- Nenhum comando que exija confirmação (guia § Impedimentos › Confirmação do
  humano) sem a confirmação explícita do humano para aquele comando.
- Não reabra decisões registradas; não invente caminhos, números de decisão
  nem requisitos.
- Nunca faça merge nem ative auto-merge.
- Toda comunicação com o humano em português do Brasil.
