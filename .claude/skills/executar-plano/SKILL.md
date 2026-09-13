---
name: executar-plano
description: Executa uma fase do plano (docs/plano/) — tarefa a tarefa em subagentes, numa branch e worktree próprias — entrega num PR e acompanha CI e preview
argument-hint: NNNN
disable-model-invocation: true
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# /executar-plano

## Objetivo

Executar as tarefas não concluídas de **uma** fase `NNNN` numa branch e
worktree próprias — cada tarefa num subagente com `/executar-tarefa` —,
entregar a fase num PR para a `main` e acompanhar os checks até ficarem
verdes. Você é o orquestrador: prepara, delega, confere, entrega e acompanha;
não implementa tarefa. As regras estão em `docs/plano/CLAUDE.md` (o guia); em
conflito, o guia vence.

## Entrada

- `$ARGUMENTS` = número da fase (`11` ou `0011`).
- Vazio → liste as fases não `Entregue` (número, nome, status, tarefas
  pendentes, dependências) e pergunte qual executar.

## Leituras obrigatórias

Leia cada guia pelo caminho indicado, sem contar com o carregamento automático de `CLAUDE.md`.

1. `AGENTS.md`, `docs/plano/CLAUDE.md` e `docs/plano/README.md`.
2. O `## Status` de cada tarefa da fase.
3. Na renumeração (passo 5.2): o guia de cada pasta de decisão envolvida.

## Condições de parada

| # | Condição | Ação |
|---|---|---|
| 1 | fase ausente em `origin/main` | PARE: o plano dela não foi mesclado |
| 2 | cópia local da fase difere da `origin/main` | avise; use a `origin/main` |
| 3 | fase `Entregue` | PARE: mudança vira fase nova, via `/planejar` |
| 4 | tarefa `Bloqueada` sem resposta do humano | PARE: mostre pergunta e alternativas |
| 5 | fase de "Depende de" não `Entregue` na `origin/main` | pergunte se segue |
| 6 | árvore atual suja | PARE: peça para resolver |
| 7 | `.worktrees/` não está no ignore | PARE: avise |
| 8 | worktree da fase com arquivo sujo fora do conjunto permitido (guia § Impedimentos › Arquivos parciais e retomada) | PARE: mostre |
| 9 | conflito de sincronização fora de `docs/<tipo>/README.md` e de linhas de tabela de `docs/plano/README.md` | PARE: peça orientação |
| 10 | relatório `falhou`, ou conferência encontrou problema | PARE: pergunte — continuar do parcial, descartar, relançar com orientação, pular ou interromper |
| 11 | check com falha de ambiente (secret, cota, permissão, instabilidade) | PARE: mostre causa e log; rodar de novo só com autorização |
| 12 | 3 ciclos de correção pós-PR sem verde | PARE: mostre o histórico |

## Passos

### 1. Preparar

1. `git fetch origin`; localize `docs/plano/NNNN-*/` na `origin/main`
   (`git ls-tree -r --name-only origin/main docs/plano/`).
2. Monte `NNNN-XXXX · título · status`, em ordem. Todas `Concluída` e fase não
   `Entregue` → vá ao passo 4.
3. Mostre: fase, tarefas a executar, tarefas puladas e tarefas com setup ou
   configuração pública (vão pedir aprovação).

### 2. Branch e worktree

1. Sincronize a `main` — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização).
2. Nome da branch — skill `git-branch-name` (sem a skill: guia § Convenções de Git › Branch): tipo pela natureza da fase; nome pelo
   objetivo da fase (coluna "Objetivo"); sufixo `-NNNN`. Worktree
   `.worktrees/<tipo>-<nome>-NNNN`.
3. Retomada: branch ou worktree terminando em `-NNNN` existe → reaproveite,
   sincronize com a `main` e veja PR aberto (`gh pr list --head <branch>`).
4. Senão: `git worktree add .worktrees/<diretório> -b <branch> origin/main`.
5. Na worktree: `npm install`; copie `.env.local` da raiz do repositório
   principal, se existir.
6. Daqui em diante, todo comando e arquivo dentro da worktree (caminho
   absoluto).

### 3. Executar as tarefas — em sequência, uma por subagente

Para cada tarefa não `Concluída`, em ordem numérica:

1. **Delegar** com a ferramenta `Agent`, subagente `general-purpose` e esperar terminar. Prompt:

   ```
   Execute a Tarefa NNNN-XXXX seguindo .claude/skills/executar-tarefa/SKILL.md,
   com $ARGUMENTS = NNNN-XXXX. Modo delegado.
   Worktree: <caminho absoluto>. Branch: <branch>.
   Não crie, troque, rebaseie nem apague branch ou worktree. Sem push nem PR.
   Tarefas já concluídas nesta branch: <NNNN-XXXX · título · SHA>.
   Observações das tarefas anteriores: <observacoes>.
   [Resposta do humano (AAAA-MM-DD): <resposta>]
   [Confirmação do humano (AAAA-MM-DD): autorizo exatamente `<comando>` em <ambiente>.]
   [Arquivos parciais a retomar: <lista>]
   Responda só com o bloco YAML de docs/plano/CLAUDE.md § Relatório da tarefa.
   ```

2. **Conferir** — não confie só no relatório:
   - `concluida`: árvore limpa; `git log -1` = `commit`; tarefa e linha do
     README `Concluída`; log no mesmo commit, com as seções do guia § Formato
     do log; commit sem arquivo de outra tarefa;
     `criterios.atendidos == criterios.total` (pendência aceita: só a
     verificação visual); cada caminho de `registros` existe e tem linha no
     índice.
   - `bloqueada`: commit só com arquivo da tarefa, README e log; pergunta e
     `## Execução interrompida` registrados.

3. **Decidir**:

   | Relatório | Ação |
   |---|---|
   | `concluida` e conferida | próxima tarefa, repassando `observacoes` |
   | `bloqueada`, `bloqueio.tipo: pergunta` | mostre ao humano; com a resposta, relance com `Resposta do humano` |
   | `bloqueada`, `bloqueio.tipo: confirmacao` | mostre comando, ambiente, efeito e reversão; autorizou → relance com `Confirmação do humano`; negou → pergunte: ajustar via `/planejar`, pular ou interromper |
   | `falhou`, ou conferência com problema | condição 10 |

   Nunca relance o mesmo prompt sem mudança. Descartar parciais segue o guia
   § Impedimentos › Arquivos parciais e retomada.

### 4. Fechar a fase

1. `npm run lint && npm run test && npm run build`; `npm run test:rules` se
   algum commit da fase tocou `firestore.rules`.
2. `git diff --name-only origin/main...HEAD` ⊆ "Arquivos impactados" das
   tarefas + registros, índices, `docs/*.md`, logs e `docs/plano/`. Sem
   `docs/requisitos.md`; `docs/setup-*.md` só com setup. Arquivo novo com
   copyright; `docs/*.md` alterado cita registro; links relativos válidos.
   Violação → PARE e mostre.
3. Fase → `Entregue` no `docs/plano/README.md`, em commit próprio —
   mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit).

### 5. Entregar

1. Sincronize com a `main` — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização). Conflito só em
   `docs/<tipo>/README.md` ou em linhas de tabela de `docs/plano/README.md` →
   mantenha as linhas dos dois lados, em ordem numérica. Outro conflito →
   condição 9.
2. Renumere registros que colidem com a `main` — guia § Convenções de Git ›
   Renumeração; commit — mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit). Houve mudança na sincronização ou
   renumeração → repita o passo 4.1.
3. `git push -u origin <branch>`; `--force-with-lease` só se a branch já estava
   no remoto e foi rebaseada.
4. PR — skill `git-pull-request-message` (sem a skill: guia § Convenções de Git › PR) —, a partir de "PR previsto": objetivo; tarefas com link
   para arquivo e log; registros (e a tabela de renumeração); setups com link
   para o log; verificações visuais pendentes com roteiro; como verificar no
   preview. PR aberto → `gh pr edit`; senão
   `gh pr create --base main --head <branch>`.

### 6. Acompanhar CI e preview

1. `gh pr checks <PR> --watch`.
2. Tudo verde → URL do preview (`gh pr view <PR> --comments`) → Saída.
3. Falhou → `gh run view <run-id> --log-failed`:
   - ambiente ou infraestrutura → condição 11;
   - código, teste, lint ou build → corrija na worktree seguindo o guia como
     uma tarefa; registre em `## Correções pós-PR` do log da tarefa causadora
     (ou na descrição do PR); commit — mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit) —; `git push`; volte ao
     item 1. Limite: condição 12.
4. `main` avançou e o PR pede atualização → repita 5.1 e 5.2 antes de
   corrigir.

## Saída

Resumo ao humano: tarefas e commits; registros (e renumeração); setups;
correções pós-PR; verificações visuais pendentes; URL do preview; URL do PR e
estado dos checks. Ofereça remover a worktree depois do merge.

## Proibições

- Implementar tarefa fora do subagente ou executar tarefas em paralelo.
- Alterar tarefa `Concluída` ou de outra fase.
- Executar comando que exige aprovação sem `Confirmação do humano` para aquele
  comando.
- Reabrir decisão registrada; inventar caminho, número de decisão ou requisito.
- Merge ou auto-merge.
- Texto fora do português do Brasil.
