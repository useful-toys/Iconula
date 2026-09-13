---
description: Executa uma única tarefa do plano (docs/plano/) — discovery, plano da alteração, implementação e um commit válido, com log, registros de decisão e critérios de aceite verificados
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Execute **uma única tarefa** do plano de implementação (`docs/plano/`).

As regras comuns a toda tarefa — dependências, status, regras gerais,
comportamento padrão, discovery e plano da alteração, impedimentos, registro
de decisões, documentação viva, setup e formato do log — estão em
**`docs/plano/CLAUDE.md`** (o guia). Este comando descreve o fluxo e remete
às seções do guia. Em conflito, o guia vence.

## O que é inegociável

A tarefa só está terminada quando **todos** os itens abaixo estão cumpridos.
Código que funciona sem algum deles é trabalho incompleto.

1. **Discovery antes de tudo**: da base de código, quando há alteração de
   código prevista; da documentação, quando as referências não bastam.
2. **Plano da alteração escrito antes de executar ou codar**, com os desvios
   explicados depois.
3. **Log** que explica o que foi feito e por quê, legível por quem não
   acompanhou a execução.
4. **Toda decisão tomada na execução registrada** — ADR, TDR, IDR, MDR ou DDR —
   no momento em que é tomada.
5. **Testes automáticos executados** e verdes, com a saída real no log.
6. **Critérios de aceite verificados de fato**, um a um, com evidência.
7. **Todo setup executado registrado no log**, com os comandos exatos e sem
   segredos.
8. **Termina num commit de estado válido**: o que está no commit passa em
   lint, test e build, e contém código, testes, registros, documentação, log e
   status juntos.

## Entrada

`$ARGUMENTS` traz o identificador da tarefa no formato `NNNN-XXXX` (fase e
tarefa, ex.: `0011-0002`). Se vier vazio ou fora desse formato, pare e peça o
identificador.

Localize o arquivo com o padrão `docs/plano/NNNN-*/XXXX-*.md`. Se não houver
exatamente um arquivo, pare e diga o que encontrou.

Este comando é usado de dois jeitos:
- **delegado** pelo `/executar-plano`, num subagente — o prompt informa a
  worktree e a branch da fase, já criadas e sincronizadas, e pode trazer a
  resposta ou a confirmação do humano;
- **avulso**, pelo humano, numa branch de trabalho que ele já preparou.

## 1. Antes de começar

1. **Branch.** `git branch --show-current`:
   - `main`, `master`, detached HEAD ou vazio → pare. Nada de commit direto na
     `main`; sugira `/executar-plano NNNN`, que cria a branch da fase.
   - Branch que não termina em `-NNNN` (o número desta fase) → avise e
     pergunte se deve seguir.
   - `git status --short` precisa estar limpo; se não estiver, pare e mostre o
     que há (pode ser uma execução anterior que falhou).
   - **Modo avulso**: sincronize a branch pela skill `git-remote-sync-guard`.
     **Modo delegado**: não sincronize, não rebaseie, não crie nem troque
     branch ou worktree.
2. **Status da tarefa** (`## Status` do arquivo):
   - `Concluída` → pare: tarefa concluída é imutável.
   - `Bloqueada` → mostre a pergunta registrada. Só siga se a resposta ou a
     confirmação do humano estiver nesta conversa ou no prompt de delegação;
     então aplique a retomada do guia (§ Impedimentos › Bloqueio, item 4).
   - `Pendente` ou `Em andamento` → siga.
3. Leia `AGENTS.md`, o guia `docs/plano/CLAUDE.md` **inteiro** e o arquivo da
   tarefa **inteiro**. Guias `CLAUDE.md` de subdiretório **não são carregados
   automaticamente**: todo guia citado neste comando é lido explicitamente,
   pelo caminho.
4. **Dependências** (guia § Estrutura › Dependências): todas as tarefas
   anteriores **da mesma fase** `Concluída`, e as fases da coluna "Depende de"
   `Entregue`. Se faltar, pare e diga qual. Se a própria fase está `Entregue`,
   pare: fase fechada não recebe execução. Se a tarefa
   exigir algo de uma tarefa de **outra** fase que não está concluído, pare:
   é erro de planejamento a corrigir com `/planejar`.
5. Leia cada item de "Documentos de referência" — a seção indicada, não o
   arquivo todo. Caminho citado que não existe (e não é gerado por tarefa
   anterior da fase) é divergência: vai para o log.
6. **Numeração dos registros**: descubra a última de cada tipo nos índices e
   arquivos de `docs/adr/`, `docs/tdr/`, `docs/idr/`, `docs/model-dr/` e
   `docs/devops-dr/`.
7. **Marque `Em andamento`**: `## Status` do arquivo da tarefa e a linha dela
   no `docs/plano/README.md`; se a linha da **fase** na tabela de fases estiver
   `Pendente`, marque-a `Em andamento` também. Sem commit próprio — segue no
   commit da tarefa (guia § Status e ciclo de vida). Crie o rascunho do log
   (guia § Formato do log).

## 2. Discovery e plano da alteração

Siga o guia § Discovery e plano da alteração. **Não edite código, testes,
documentos nem registros antes de terminar esta seção.**

1. **Discovery da base de código** — obrigatório se a tarefa prevê alteração
   de código. Registre o resultado em `## Discovery` do log.
2. **Discovery da documentação** — quando os documentos de referência não
   bastam. Registre o que foi lido a mais e por quê.
3. **Plano da alteração** — escreva em `## Plano da alteração` do log: passos,
   arquivos, testes, registros e `docs/*.md`, setup, verificação prevista de
   cada critério e riscos.
4. Confira o plano contra "Fora do escopo", "Decisões já tomadas" e a matriz
   de impedimentos (guia § Impedimentos). Se o plano só se sustenta com algo
   de nível 3, **bloqueie agora**, antes de implementar.
5. **Modo avulso**: mostre o plano ao humano em poucas linhas antes de
   implementar. **Modo delegado**: siga o plano; ele fica no log para a
   conferência do orquestrador.

## 3. Execução

- Siga o plano. Todo desvio é anotado em `## Plano da alteração › Desvios na
  execução`, com o motivo.
- **Escopo** é o de "Escopo e instruções de implementação" e nada além. O que
  está em "Fora do escopo" fica de fora, mesmo que pequeno e tentador.
- Respeite "Padrões e convenções aplicáveis"; em conflito com a fonte citada,
  a fonte vence e a divergência vai para o log.
- Não reabra "Decisões já tomadas".
- Crie ou ajuste os testes automáticos que cobrem o comportamento da tarefa —
  é o que permite verificar os critérios de aceite.
- Aplique o comportamento padrão do guia:
  - § Registro de decisões — mantenha, durante toda a execução, a **lista das
    decisões tomadas**, e registre cada uma na hora. **Antes de criar ou
    atualizar o primeiro registro de um tipo, leia o guia da pasta** —
    estrutura, estilo, registro vivo e linha no índice:

    | Tipo | Guia (ler explicitamente) | Índice |
    |---|---|---|
    | ADR | `docs/adr/CLAUDE.md` | `docs/adr/README.md` |
    | TDR | `docs/tdr/CLAUDE.md` | `docs/tdr/README.md` |
    | IDR | `docs/idr/CLAUDE.md` | `docs/idr/README.md` |
    | MDR | `docs/model-dr/CLAUDE.md` | `docs/model-dr/README.md` |
    | DDR | `docs/devops-dr/CLAUDE.md` | `docs/devops-dr/README.md` |

  - § Documentação viva — `docs/*.md` no estado atual, lastreados em registro;
  - § Setup de infraestrutura e ambiente — registre cada passo no log na hora;
  - § Impedimentos — matriz de três níveis.

### Confirmação do humano

Quando um passo previsto exige confirmação (guia § Impedimentos ›
Confirmação do humano):
- **Modo avulso**: pergunte na conversa **antes** do comando, mostrando o
  comando exato, o ambiente, o efeito e como reverter. Registre a confirmação
  no log.
- **Modo delegado**: você não conversa com o humano. Pare **antes** do
  comando e aplique o bloqueio (guia § Impedimentos › Bloqueio), com a
  pergunta trazendo o comando exato. Só execute se o prompt de delegação
  trouxer uma `Confirmação do humano` que cubra **exatamente** esse comando.

### Bloqueio

Ao parar no nível 3 ou por confirmação pendente, siga o guia
(§ Impedimentos › Bloqueio) e vá direto ao relatório final.

## 4. Verificação

### 4.1 Testes automáticos

Rode sempre:

```
npm run lint && npm run test && npm run build
```

mais `npm run test:rules` (exige JDK 21+) se a tarefa tocou
`firestore.rules`, mais o que a "Validação adicional" da tarefa acrescentar.

- Tudo precisa passar. Falhou → corrija e rode de novo.
- Guarde a **saída real** para o log (guia § Formato do log › Validação).
- Aviso só é "pré-existente" se você confirmou (existe na `main` ou está
  documentado num registro). Aviso novo introduzido pela tarefa é corrigido.
- Falha por ambiente (ex.: JDK antigo) é informada como tal, nunca tratada
  como aprovada.

### 4.2 Critérios de aceite

Verifique os **específicos** da tarefa e os **implícitos** do guia
(§ Comportamento padrão da execução › Critérios de aceite implícitos), pela
verificação prevista no plano. Comprove cada um com evidência obtida agora:

- comportamento → o teste que o cobre (nome e arquivo) passando no 4.1; se
  nenhum teste cobre, escreva um ou justifique por que a verificação é manual;
- conteúdo de código ou documento → o trecho conferido (`arquivo:linha`) ou a
  busca executada e o resultado;
- registros → os caminhos, conferidos contra a lista de decisões;
- setup → a verificação registrada em `## Setup realizado`;
- critério visual → verificação em `npm run dev` com ferramenta de navegador,
  descrevendo o que foi visto. Sem ferramenta disponível, declare a
  verificação visual **pendente para o humano**, com o roteiro do que olhar.

Critério não atendido → diga qual e por quê. A tarefa então **não** é
`Concluída`: corrija, bloqueie ou encerre como `Falhou`. A única pendência
aceita numa tarefa `Concluída` é a verificação visual declarada.

### 4.3 Escopo

`git status --short` e `git diff --stat`: os arquivos alterados batem com o
plano e com "Arquivos impactados", mais registros de decisão, índices,
`docs/*.md` atualizados, log e status. `git diff --name-only` não pode listar
`docs/requisitos.md`, nem `docs/setup-*.md` se a tarefa não tem passos de
setup. Arquivo a mais sem justificativa é desfeito. Remoção de arquivo não
deixa órfãos (imports, testes, estilos, assets).

Se qualquer código mudou depois do 4.1, **rode os testes de novo**: o que vai
para o commit é o que foi validado.

## 5. Log, status e commit

### 5.1 Log

Complete `docs/plano/NNNN-nome-da-fase/logs/XXXX-log-nome-da-tarefa.md` no
formato do guia (§ Formato do log), criando a pasta `logs/` se não existir.

### 5.2 Status

`## Status` do arquivo da tarefa e a linha dela no `docs/plano/README.md` →
`Concluída`. Não altere nenhuma outra seção do arquivo da tarefa. Na linha da
**fase**, só o `Em andamento` do passo 1.7: marcar `Entregue` é do
`/executar-plano`, no fechamento.

### 5.3 Commit de estado válido

1. Confira antes de commitar:
   - [ ] `## Discovery` e `## Plano da alteração` no log, com os desvios
         explicados;
   - [ ] lint, test e build verdes sobre o conteúdo exato que vai ser
         commitado;
   - [ ] cada decisão da lista com registro e índice atualizados, ou
         justificativa no log;
   - [ ] nenhuma decisão documentada alterada sem previsão na tarefa;
   - [ ] cada critério de aceite com evidência no log;
   - [ ] `docs/*.md` no estado atual, cada alteração com registro que a
         lastreia; `requisitos.md` intocado; `setup-*.md` só com passos de
         setup;
   - [ ] todo setup em `## Setup realizado`, com comando exato, confirmação,
         verificação e reversão, sem segredo em claro (ou "Nenhum");
   - [ ] log explica o que foi feito;
   - [ ] status `Concluída` no arquivo e no README.
2. **Um único commit** com tudo. Mensagem pela skill `git-commit-message`,
   citando `Tarefa NNNN-XXXX` no corpo.
3. Não pule hooks. Se um hook falhar, corrija a causa e crie o commit de novo
   — nunca `--no-verify`.
4. Confirme com `git status --short` (limpo) e `git log -1`.

Nunca commite um estado com lint, test ou build falhando. Se não conseguir
chegar a um estado válido, não commite: encerre como `Falhou`; a tarefa fica
`Em andamento` na árvore e a branch permanece no último commit válido.

## Relatório final

Responda exatamente neste formato (é o que o `/executar-plano` confere):

```
- Resultado: Concluída | Bloqueada | Falhou
- Commit: <SHA curto e primeira linha da mensagem> (ou "nenhum")
- Plano da alteração: <resumo em uma linha; desvios na execução ou "sem desvios">
- Registros de decisão criados ou alterados: <caminhos> (ou "nenhum")
- Setup realizado: <ambiente e objetivo de cada passo> (ou "nenhum")
- Log: <caminho> (ou "nenhum")
- Validação: lint <ok/falhou>, test <ok/falhou>, build <ok/falhou>, test:rules <ok/falhou/não se aplica>
- Critérios de aceite: <N de M atendidos; os não atendidos e por quê>
- Verificação visual: <feita: o que foi visto | pendente: roteiro | não se aplica>
- Pergunta ao humano: <pergunta e alternativas> (se Bloqueada; senão "nenhuma")
- Confirmação pendente: <comando exato, ambiente, efeito, reversão> (se bloqueada por confirmação; senão "nenhuma")
- Observações para as próximas tarefas: <o que mudou e afeta o que vem depois> (ou "nenhuma")
```

Em `Falhou`, acrescente o comando que falhou, a saída relevante, o que foi
tentado e os arquivos alterados que ficaram sem commit.

## Não faça

- Não edite nada antes do discovery e do plano da alteração.
- Nada de outra tarefa, nenhuma refatoração oportunista.
- Não altere tarefas `Concluída` nem arquivos de outras tarefas.
- Nada que o guia proíbe: alterar `docs/requisitos.md`, mexer em
  `docs/setup-*.md` ou fazer setup sem passos previstos, alterar `docs/*.md`
  sem registro, mudar decisão documentada sem previsão, registrar segredos.
- Nenhum comando que exija confirmação sem a confirmação do humano.
- Nenhum push, PR, rebase ou merge.
- Toda comunicação e documentação em português do Brasil.
