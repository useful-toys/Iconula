---
description: Planeja funcionalidades e correções em tarefas executáveis pelo /executar-plano e /executar-tarefa, verificando antes se o pedido é novo, e entrega o plano numa branch docs com PR
argument-hint: <descrição do pedido>
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# /planejar

## Objetivo

Transformar `$ARGUMENTS` num plano que o `/executar-plano` e o
`/executar-tarefa` executam **sem interpretação**: tarefas em fases existentes
ou novas, no formato do guia, entregues numa branch `docs` com PR. Não escreve
código, registros de decisão nem `docs/*.md` fora de `docs/plano/`. As regras
estão em `docs/plano/CLAUDE.md` (o guia); em conflito, o guia vence.

## Entrada

`$ARGUMENTS` = descrição do que planejar: funcionalidade nova (ex.:
`/planejar modo colaborativo de trocas`), correção ou ajuste (ex.:
`/planejar corrigir contagem de metalizadas na disposição álbum`) ou tema
para análise (ex.: `/planejar avaliar virtualização do catálogo`).

## Leituras obrigatórias

Leia cada guia pelo caminho indicado, sem contar com o carregamento automático de `CLAUDE.md`.

**Inteiras:**

1. `docs/plano/CLAUDE.md`.
2. `AGENTS.md`.
3. `.claude/commands/executar-tarefa.md` e `.claude/commands/executar-plano.md`.

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
| 5 | fim do passo 2 (mapa de fases) | PARE: aprovação explícita do humano |
| 6 | fase que receberia tarefas tem branch ou PR aberto | pergunte antes de incluir |
| 7 | árvore atual suja (passo 3) | PARE: peça para resolver |
| 8 | `.worktrees/` não está no ignore | PARE: avise |

## Passos

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
   | muda o que já foi feito | altera comportamento entregue, decisão documentada ou alternativa recusada | tarefas novas com "Muda decisão documentada", citando a tarefa entregue como precedente |
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
   - decisão aberta vai para "Decisões em aberto nesta tarefa"; ponto de
     `docs/arquitetura.md` § Pontos em aberto ou `docs/interface.md`
     § Pendências de interface resolvido pelo plano é alocado numa tarefa;
   - mudança de decisão documentada é explícita e aprovada neste passo;
   - requisito não funcional que a tarefa pode quebrar vira critério específico;
   - `docs/*.md` impactado tem registro de lastro; `docs/requisitos.md` nunca;
     `docs/setup-*.md` só com passos de setup.
3. Imprima no chat:
   - classificação do pedido, com evidência;
   - tarefas acrescentadas a fases existentes (fase, numeração, motivo) e
     fases candidatas descartadas (motivo);
   - tabela de fases novas: número, nome, objetivo em uma linha, "Depende de",
     PR previsto;
   - tarefas de cada fase: título e objetivo em uma linha;
   - decisões documentadas que o plano muda e em qual tarefa;
   - tarefas com setup ou configuração pública;
   - ajustes em tarefas pendentes existentes.
4. Condição 5.

### 3. Gravar e entregar — após aprovação

1. Sincronize a `main` — skill `git-remote-sync-guard` (sem a skill: guia § Convenções de Git › Sincronização).
2. Branch — skill `git-branch-name` (sem a skill: guia § Convenções de Git › Branch): tipo `docs`; nome pelo que o plano entrega; sufixo
   = número da primeira fase nova (ou da fase existente que recebe tarefas).
   Branch ou worktree com esse sufixo já existe → pergunte se reaproveita.
3. `git worktree add .worktrees/<diretório> -b <branch> origin/main`; trabalhe
   só nela.
4. Escreva em `docs/plano/`:
   - fases novas: pasta `docs/plano/NNNN-nome-da-fase/` e tarefas no guia
     § Formato da tarefa; sem pasta `logs/`;
   - tarefas novas em fase existente: numeradas a partir da última;
   - ajustes aprovados em tarefas `Pendente`;
   - `docs/plano/README.md`: linha da fase nova (`Pendente`) e tabela de
     tarefas (`Pendente`); sem números de registro novos, sem regras do guia,
     sem pendências.
5. Passe cada tarefa pelo guia § Conferência da tarefa e corrija.
6. Um commit — mensagem pela skill `git-commit-message` (sem a skill: guia § Convenções de Git › Commit).
7. Mostre arquivos e resultado da conferência; pergunte se abre o PR.
8. Autorizado → `git push -u origin <branch>`; PR — skill `git-pull-request-message` (sem a skill: guia § Convenções de Git › PR) —, label
   `documentation`, descrição com classificação, fases e tarefas, decisões
   documentadas que mudam e tarefas com setup.

## Saída

- Passo 2: o mapa de fases e a pergunta de aprovação.
- Passo 3: arquivos gravados, conferência, commit, URL do PR (se aberto) e o
  lembrete: `/executar-plano NNNN` só depois do merge do PR do plano.

## Proibições

- Gravar arquivo ou criar branch antes da aprovação do mapa.
- Escrever fora de `docs/plano/`; criar registro de decisão; alterar
  `docs/*.md` fora de `docs/plano/`.
- Editar tarefa `Concluída`; acrescentar tarefa a fase `Entregue`.
- Prever alteração em `docs/requisitos.md`.
- Repetir ou contradizer o comportamento padrão do guia; fixar número de
  registro novo; registro novo para "revisar" outro.
- Inventar caminho, número de decisão ou requisito; reabrir decisão sem
  declarar a mudança e obter aprovação.
- Merge ou auto-merge.
- Texto fora do português do Brasil.
