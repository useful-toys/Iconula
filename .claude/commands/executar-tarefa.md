---
description: Executa uma tarefa do plano (docs/plano/) — discovery, plano da alteração, implementação e um commit de estado válido
argument-hint: NNNN-XXXX
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# /executar-tarefa

## Objetivo

Executar **uma** tarefa `NNNN-XXXX` e terminar num **commit de estado válido**
— código, testes, registros de decisão, `docs/*.md`, log e status juntos — ou
num bloqueio registrado. As regras estão em `docs/plano/CLAUDE.md` (o guia);
em conflito, o guia vence.

## Entrada

- `$ARGUMENTS` = `NNNN-XXXX` (fase e tarefa). Arquivo: `docs/plano/NNNN-*/XXXX-*.md`.
- **Modo delegado**: o prompt do `/executar-plano` traz worktree, branch e,
  se houver, `Resposta do humano`, `Confirmação do humano` e arquivos parciais.
- **Modo avulso**: o humano chama na branch atual.

## Leituras obrigatórias

Leia cada guia pelo caminho indicado, sem contar com o carregamento automático de `CLAUDE.md`.

1. `AGENTS.md`.
2. `docs/plano/CLAUDE.md`, inteiro.
3. O arquivo da tarefa, inteiro.
4. "Documentos de referência" da tarefa — só as seções indicadas.
5. Antes do primeiro registro de um tipo: o guia da pasta (guia § Registro de
   decisões).

## Condições de parada

Confira as linhas 1–10 antes de editar qualquer arquivo; as demais valem
durante toda a execução.

| # | Condição | Ação |
|---|---|---|
| 1 | `$ARGUMENTS` vazio ou fora de `NNNN-XXXX` | PARE: peça o identificador |
| 2 | nenhum ou mais de um arquivo para o padrão | PARE: mostre o que encontrou |
| 3 | branch `main`, `master`, detached ou vazia | PARE: sugira `/executar-plano NNNN` |
| 4 | branch não termina em `-NNNN` | pergunte se segue |
| 5 | arquivo sujo fora do conjunto permitido (guia § Impedimentos › Arquivos parciais e retomada) | PARE: mostre `git status --short` |
| 6 | tarefa `Concluída` | PARE: imutável |
| 7 | fase `Entregue` | PARE: fase fechada |
| 8 | tarefa `Bloqueada` sem resposta ou confirmação na conversa ou no prompt | PARE: mostre a pergunta |
| 9 | tarefa anterior da fase não `Concluída`, ou fase de "Depende de" não `Entregue` | PARE: diga qual |
| 10 | pré-requisito numa tarefa de outra fase | PARE: erro de planejamento, corrigir com `/planejar` |
| 11 | nível 3 (guia § Impedimentos) | modo avulso: peça aprovação; modo delegado: bloqueie (guia § Impedimentos › Bloqueio) e vá à Saída |
| 12 | validação não fica verde ou critério não atendível | encerre como `falhou`, sem commit |

## Passos

### 1. Preparar

1. Modo avulso: sincronize a branch — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização). Modo delegado: não
   sincronize, não rebaseie, não crie nem troque branch ou worktree.
2. Descubra a última numeração de cada tipo em `docs/adr`, `docs/tdr`,
   `docs/idr`, `docs/model-dr` e `docs/devops-dr` (índice e arquivos).
3. Status `Em andamento` na tarefa e na linha dela no `docs/plano/README.md`;
   fase `Pendente` → `Em andamento`. Sem commit.
4. Crie o log (guia § Formato do log). Retomada: aplique a resposta ou a
   confirmação (guia § Impedimentos › Arquivos parciais e retomada) e continue
   do próximo passo do plano.

### 2. Discovery e plano — nenhuma edição de código, teste, documento ou registro antes

1. Discovery da base de código, se há alteração de código → `## Discovery`.
2. Discovery da documentação, se as referências não bastam → `## Discovery`.
3. Plano da alteração → `## Plano da alteração`.
4. Confira o plano contra "Fora do escopo", "Decisões já tomadas" e o nível 3.
   Exige nível 3 → condição 11 agora.
5. Siga sem pedir aprovação. Modo avulso: mostre o plano em até 5 linhas e
   continue.

### 3. Implementar

1. Siga o plano; desvio → `## Plano da alteração › Desvios`, com o motivo.
2. Escopo = "Escopo e instruções de implementação". Nada de "Fora do escopo".
   Não reabra "Decisões já tomadas". Conflito com a fonte de "Padrões" → a
   fonte vence; anote no log.
3. Crie ou ajuste os testes que cobrem o comportamento.
4. Decisões: lista mantida durante a execução, cada uma registrada na hora
   (guia § Registro de decisões).
5. `docs/*.md` no estado atual, com lastro (guia § Documentação viva).
6. Setup: só o previsto, cada passo no log na hora (guia § Setup).
7. Comando que exige aprovação → condição 11; modo delegado só executa com
   `Confirmação do humano` que cubra exatamente o comando.

### 4. Verificar

1. `npm run lint && npm run test && npm run build`; `npm run test:rules` se
   tocou `firestore.rules`; "Validação adicional" da tarefa. Guarde a saída
   real. Aviso novo → corrija. "Pré-existente" só se confirmado na `main` ou
   num registro. Falha de ambiente é informada, nunca aprovada.
2. Critérios específicos e implícitos (guia § Comportamento padrão), cada um
   com evidência obtida agora: teste (nome e arquivo), trecho
   (`arquivo:linha`), busca, verificação de setup ou visual. Sem navegador →
   visual `pendente` com roteiro. Critério não atendido → corrija, condição 11
   ou condição 12.
3. `git diff --name-only` ⊆ plano + "Arquivos impactados" + registros, índices,
   `docs/*.md`, log e status. Nunca `docs/requisitos.md`; `docs/setup-*.md` só
   com setup. Extra sem justificativa → desfaça. Sem órfãos.
4. Código mudou depois do item 1 → repita o item 1.

### 5. Fechar

1. Complete o log (guia § Formato do log).
2. Status `Concluída` na tarefa e na linha dela no README. Nenhuma outra seção
   da tarefa muda; a fase não vira `Entregue` aqui.
3. Confira: discovery e plano no log; validação verde sobre o conteúdo exato;
   decisões registradas; nenhuma decisão documentada mudada sem previsão;
   critérios com evidência; `docs/*.md` com lastro; setup sem segredos; status.
4. Um único commit — mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit) —, com `Tarefa NNNN-XXXX` no corpo. Hook
   falhou → corrija a causa e crie o commit de novo.
5. `git status --short` limpo; `git log -1`.

## Saída

Responda **só** com o bloco YAML do guia § Relatório da tarefa.

## Proibições

- Editar código, teste, documento ou registro antes do plano da alteração.
- Executar outra tarefa ou refatoração oportunista.
- Alterar tarefa `Concluída` ou arquivo de outra tarefa.
- Alterar `docs/requisitos.md`; `docs/setup-*.md` ou setup sem passos
  previstos; `docs/*.md` sem registro; decisão documentada sem previsão.
- Segredo em claro em log, documento ou commit.
- Commit com lint, test ou build falhando; `--no-verify`.
- Push, PR, merge ou rebase — exceto a sincronização do passo 1.1 no modo
  avulso.
- Texto fora do português do Brasil.
