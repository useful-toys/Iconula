---
name: planejar
description: Planeja funcionalidades e correções em fases e tarefas do plano (docs/plano/) executáveis pelo /executar-plano e /executar-tarefa — verifica antes se o pedido é novo, propõe o mapa de fases e as decisões significativas para aprovação e entrega o plano numa branch docs com PR. Use quando o humano pedir para planejar, fatiar em tarefas ou incluir trabalho no plano; não use para executar tarefa ou fase já planejada.
argument-hint: <descrição do pedido>
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# /planejar

## Objetivo

Transformar `$ARGUMENTS` num plano que o `/executar-plano` e o
`/executar-tarefa` executam **sem interpretação**: tarefas em fases existentes
ou novas, no formato do guia, e as **decisões significativas confirmadas**
pelo humano já registradas, tudo numa branch `docs` com PR. **Nunca cria nem
altera código-fonte nem `docs/*.md`**: escreve só em `docs/plano/` e nas pastas
de decisão (guia § Documentação viva › Especificação no planejamento). As regras estão
em `docs/plano/CLAUDE.md` (o guia); em conflito, o guia vence.

## Entrada

`$ARGUMENTS` = descrição do que planejar: funcionalidade nova (ex.:
`/planejar modo colaborativo de trocas`), correção ou ajuste (ex.:
`/planejar corrigir contagem de metalizadas na disposição álbum`) ou tema
para análise (ex.: `/planejar avaliar virtualização do catálogo`).

## Leituras obrigatórias

Leia cada guia pelo caminho indicado, sem contar com o carregamento automático de `CLAUDE.md`.
Toda leitura e busca é feita na worktree do planejamento (passo 0), nunca no
checkout de onde a skill foi chamada.

**Inteiras:**

1. `docs/plano/CLAUDE.md`.
2. `AGENTS.md`.
3. `.claude/skills/executar-tarefa/SKILL.md` e `.claude/skills/executar-plano/SKILL.md`.

**Dirigidas** — leia os títulos, busque os termos do pedido e leia só as
seções encontradas:

4. `docs/plano/README.md` — fases, status e tarefas.
5. `docs/requisitos.md` — sempre as seções de escopo (MVP, requisitos futuros,
   fora de escopo) e as que a busca apontar.
6. `docs/arquitetura.md` § Pontos em aberto e `docs/interface.md` § Pendências
   de interface; outras seções só se a busca apontar.
7. Índices `docs/adr/README.md`, `docs/tdr/README.md`, `docs/idr/README.md`,
   `docs/model-dr/README.md`, `docs/devops-dr/README.md`; dos registros
   encontrados, Status, Decisão, Consequências e Alternativas consideradas; o
   guia da pasta de cada tipo tocado.
8. Só se o tema tocar: `docs/modelo-firebase.md`, `docs/modelo-intercambio.md`,
   `docs/modelo-memoria.md`, `docs/devops.md`, `docs/setup-*.md`,
   `docs/prototype/Iconula - Álbum de Figurinhas.html`, código em `src/`.

## Condições de parada

| # | Condição | Ação |
|---|---|---|
| 1 | `$ARGUMENTS` vazio | PARE: peça a descrição |
| 2 | contexto acabou antes das leituras | PARE: diga o que faltou, não planeje com leitura parcial |
| 3 | parte classificada **já entregue** | não planeje essa parte: mostre tarefa, log e código |
| 4 | parte classificada **contraria requisito** | PARE: peça a decisão do humano |
| 5 | fim do passo 2 (mapa de fases) | PARE: aprovação explícita do mapa e de cada decisão significativa |
| 6 | fase que receberia tarefas tem branch ou PR aberto | pergunte antes de incluir |
| 7 | branch ou worktree com o nome do planejamento já existe (passo 0 ou 3) | pergunte se reaproveita |
| 8 | `.worktrees/` não está no ignore | PARE: avise |
| 9 | vontade de criar código, teste, estilo, configuração ou `docs/*.md` para explicar ou adiantar o plano | não crie: descreva na tarefa, em texto ou pseudocódigo curto |
| 10 | `git diff --name-only` com arquivo fora de `docs/plano/` e das pastas de decisão | desfaça esse arquivo antes do commit |
| 11 | mapa recusado ou planejamento abandonado | ofereça remover a worktree e a branch provisórias (nada foi gravado) |

## Passos

### 0. Worktree do planejamento — antes das leituras

1. Sincronize a `main` — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização).
2. Branch provisória — skill `git-branch-name` (sem a skill: guia § Convenções de Git › Branch): tipo `docs`; nome pelo pedido; sem
   sufixo, porque o número da fase só existe depois do mapa.
3. `git worktree add .worktrees/<diretório> -b <branch> origin/main`, a partir
   da `origin/main` e nunca da branch atual; daqui em diante, todo comando,
   leitura, busca e arquivo dentro da worktree (caminho absoluto).

### 1. Verificar novidade

1. Busque os termos do pedido (telas, componentes, campos, regras,
   comportamentos) em: tarefas de todas as fases de `docs/plano/`; logs das
   tarefas encontradas; índices e registros de decisão, incluindo Alternativas
   consideradas; `docs/requisitos.md`, `docs/interface.md`,
   `docs/arquitetura.md`; código em `src/` e `firestore.rules`.
2. Classifique cada parte do pedido, com evidência (caminho e trecho):

   | Classificação | Quando | O plano |
   |---|---|---|
   | novo | nada no plano, nos registros nem no código trata disso | tarefas novas |
   | já entregue | tarefa `Concluída` de fase `Entregue` já faz, e o código confirma | condição 3 |
   | já planejado | tarefa `Pendente` já cobre | aponta a tarefa; se o pedido difere, propõe ajustá-la |
   | muda o que já foi feito | altera comportamento entregue, decisão documentada ou alternativa recusada | decisão significativa proposta (registro atualizado ao confirmar) e tarefas novas que a implementam, citando a tarefa entregue como precedente |
   | já decidido, a planejar | registro com `Implementação: a planejar` (guia § Registro de decisões › Decisões no esmiuçamento) cobre | decisão não é reproposta; tarefas novas a implementam |
   | contraria requisito | fora de escopo em `docs/requisitos.md`, ou exige mudá-lo | condição 4 |

3. Resuma: classificação com evidência; fases `Pendente` ou `Em andamento`
   candidatas; última fase e a próxima livre; registros que restringem;
   registros que mudam (com o trecho) e assuntos que nascem como registro;
   `docs/*.md` afetados; registros lidos sem efeito.

### 2. Mapa de fases — sem gravar nada

1. Aloque as tarefas:
   1. **Fases existentes primeiro**: melhoria ou correção que se aplica a uma
      fase `Pendente` ou `Em andamento` (mesmo objetivo, mesma área, ou algo
      que ela entrega) entra nela. Fase nova só se não couber, se passaria de
      6 tarefas, ou se atrasaria um PR aberto — com o motivo.
   2. Fase `Entregue` não recebe tarefas: fase nova que a cita em "Depende de".
   3. Tarefa `Concluída` é imutável; tarefa `Pendente` afetada pode ser
      ajustada.
2. Aplique as regras de fatiamento:
   - fase = PR mesclável; tarefa = commit de estado válido sozinha, na ordem;
     o que não se sustenta separado é uma tarefa só;
   - fatia vertical primeiro: a primeira fase funcional entrega algo visível
     ponta a ponta;
   - no máximo 6 fases e 6 tarefas por fase; correção pequena pode ser uma
     fase de uma tarefa;
   - dependência só entre tarefas anteriores da mesma fase; entre fases, em
     "Depende de" (guia § Estrutura › Dependências);
   - fases em paralelo não alteram os mesmos arquivos de código;
   - **decisões significativas são tomadas aqui** (guia § Registro de
     decisões › Quem registra): propostas no mapa, confirmadas pelo humano e
     registradas no passo 3 — nunca repassadas à tarefa; a que depende de
     evidência da execução vira "Ponto de decisão" em "Impedimentos
     específicos"; "Decisões em aberto" da tarefa só leva questões de nível 1
     ou 2;
   - ponto de `docs/arquitetura.md` § Pontos em aberto ou `docs/interface.md`
     § Pendências de interface resolvido pelo plano é alocado numa tarefa;
   - requisito não funcional que a tarefa pode quebrar vira critério específico;
   - `docs/*.md` impactado tem registro de lastro; `docs/requisitos.md` nunca;
     `docs/setup-*.md` só com passos de setup;
   - mudança de especificação em `docs/*.md` é descrita na tarefa (documento,
     seção, o que passa a dizer) e feita pela tarefa; se é decisão, o registro
     nasce no passo 3 e a tarefa o cita;
   - comportamento desejado em texto; no máximo pseudocódigo curto.
3. Imprima no chat:
   - classificação do pedido, com evidência;
   - tarefas acrescentadas a fases existentes (fase, numeração, motivo) e
     fases candidatas descartadas (motivo);
   - tabela de fases novas: número, nome, objetivo em uma linha, "Depende de",
     PR previsto;
   - tarefas de cada fase: título e objetivo em uma linha;
   - decisões significativas propostas, uma a uma: tipo; registro a criar ou
     atualizar (com o trecho que muda); decisão; alternativas com prós e
     contras; tarefa que a implementa;
   - pontos de decisão que dependem de evidência da execução, com a tarefa;
   - tarefas com setup ou configuração pública;
   - ajustes em tarefas pendentes existentes.
4. Condição 5.

### 3. Gravar e entregar — após aprovação

1. Sincronize a branch do planejamento com a `main` — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização).
2. Nome definitivo — skill `git-branch-name` (sem a skill: guia § Convenções de Git › Branch): tipo `docs`; nome pelo que o plano entrega; sufixo
   = número da primeira fase nova (ou da fase existente que recebe tarefas).
   Outra branch ou worktree com esse sufixo já existe → condição 7.
3. Renomeie a provisória, ainda sem push: `git branch -m <provisória>
   <definitiva>` e `git worktree move .worktrees/<provisório>
   .worktrees/<definitivo>`; continue só na worktree renomeada.
4. Registre as decisões confirmadas (guia § Registro de decisões › Decisões no
   planejamento): leia antes o guia da pasta de cada tipo; crie ou atualize o
   registro e a linha do índice; em "Consequências", a fase e a tarefa que o
   implementam — também nos registros "a planejar" do esmiuçamento, trocando
   essa linha.
5. Escreva em `docs/plano/`:
   - fases novas: pasta `docs/plano/NNNN-nome-da-fase/` e tarefas no guia
     § Formato da tarefa, citando em "Decisões já tomadas" os registros do
     item 4 pelo caminho real; sem pasta `logs/`;
   - tarefas novas em fase existente: numeradas a partir da última;
   - ajustes aprovados em tarefas `Pendente`;
   - `docs/plano/README.md`: linha da fase nova (`Pendente`) e tabela de
     tarefas (`Pendente`); sem regras do guia, sem pendências.
6. Passe cada tarefa pelo guia § Conferência da tarefa e corrija. Confira
   `git status --short`: só `docs/plano/` e `docs/adr`, `docs/tdr`,
   `docs/idr`, `docs/model-dr`, `docs/devops-dr` — condição 10.
7. Um commit — mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit).
8. Mostre arquivos, registros e resultado da conferência; pergunte se abre o
   PR.
9. Autorizado → sincronize com a `main` e renumere registros que colidem (guia
   § Convenções de Git › Renumeração); `git push -u origin <branch>`; PR —
   skill `git-pull-request-message` (sem a skill: guia § Convenções de Git › PR) —, label `documentation`, descrição com classificação, fases e
   tarefas, decisões registradas (e renumeração) e tarefas com setup.

## Saída

- Passo 2: o mapa de fases e a pergunta de aprovação.
- Passo 3: arquivos gravados, conferência, commit, URL do PR (se aberto) e o
  lembrete: `/executar-plano NNNN` só depois do merge do PR do plano.

## Proibições

- Ler, buscar ou gravar fora da worktree do planejamento; criá-la a partir de
  outra base que não a `origin/main`.
- Gravar arquivo antes da aprovação do mapa.
- Criar, alterar ou remover código-fonte, testes, estilos, configuração,
  `firestore.rules`, workflows, assets ou qualquer `docs/*.md` — só
  `docs/plano/` e as pastas de decisão.
- Código pronto nas tarefas; no máximo pseudocódigo curto.
- Registrar decisão não confirmada pelo humano, ou deixar decisão
  significativa em aberto para a tarefa.
- Editar tarefa `Concluída`; acrescentar tarefa a fase `Entregue`.
- Prever alteração em `docs/requisitos.md`.
- Repetir ou contradizer o comportamento padrão do guia; fixar número de
  registro novo; registro novo para "revisar" outro.
- Inventar caminho, número de decisão ou requisito; reabrir decisão sem
  declarar a mudança e obter aprovação.
- Merge ou auto-merge.
- Texto fora do português do Brasil.
