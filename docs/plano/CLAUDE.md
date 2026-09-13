<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Plano de implementação — guia

Fonte única das regras de `docs/plano/`. As skills contêm só o fluxo e
remetem a este guia; em conflito, **o guia vence** e a skill é corrigida.

## Skills

| Chamada | Faz |
|---|---|
| `/esmiucar <pedido>` | antes do planejamento, compara o pedido com o existente, pergunta com sugestões até eliminar dúvidas, lacunas, contradições e impedimentos, registra as decisões confirmadas, grava numa branch `docs` e abre PR |
| `/planejar <pedido>` | verifica se o pedido é novo, propõe tarefas e decisões significativas, registra as decisões confirmadas, grava numa branch `docs` e abre PR |
| `/executar-plano NNNN` | executa as tarefas pendentes de uma fase, uma por subagente, entrega num PR e acompanha CI e preview |
| `/executar-tarefa NNNN-XXXX` | discovery, plano da alteração, implementação e um commit de estado válido |

Cada skill tem **duas versões sincronizadas**:
`.claude/skills/<nome>/SKILL.md` (Claude Code) e
`.opencode/skills/opencode-<nome>/SKILL.md` (OpenCode). Objetivo, entrada,
leituras, condições de parada, passos, saída e proibições são iguais; só
variam:
- a ferramenta de subagente (OpenCode: `task` com o agente `general`; Claude
  Code: `Agent` com o subagente `general-purpose`);
- a ferramenta de pergunta com opções ao humano (OpenCode: `question`; Claude
  Code: `AskUserQuestion`);
- o uso de skills de Git (Claude Code usa as skills quando disponíveis;
  OpenCode aplica § Convenções de Git);
- o caminho das skills citado nas leituras e na delegação;
- a entrada: no Claude Code, `/<nome>` chama a skill e preenche `$ARGUMENTS`;
  skill do OpenCode não recebe argumento, então `.opencode/commands/<nome>.md`
  é um comando fino que carrega a skill e repassa `$ARGUMENTS`;
- o frontmatter: no Claude Code, `argument-hint` e, em `executar-plano` e
  `executar-tarefa`, `disable-model-invocation: true`; no OpenCode, `name`
  com o prefixo `opencode-`.

O prefixo existe porque o OpenCode também descobre `.claude/skills/` e exige
nomes únicos; o `opencode.json` da raiz nega (`permission.skill`) as versões
do Claude Code, que ficam ocultas ao agente do OpenCode.

Mudou uma versão → aplique a mesma mudança na outra, no mesmo commit.

**Guias `CLAUDE.md` de subdiretório são lidos pelo caminho**, nunca presumidos
carregados: este guia e os guias de decisão (§ Registro de decisões).

## Estrutura

- `docs/plano/README.md` — índice: tabela de fases e seção de cada fase com a
  tabela de tarefas. Não repete regras deste guia nem lista pendências.
- `docs/plano/NNNN-nome-da-fase/XXXX-nome-da-tarefa.md` — tarefa.
- `docs/plano/NNNN-nome-da-fase/logs/XXXX-log-nome-da-tarefa.md` — log; a pasta
  `logs/` nasce com o primeiro log.
- `NNNN` e `XXXX` com 4 dígitos; nomes em kebab-case, sem acentos.
- **Fase = um PR mesclável na `main`**: o preview deploy é required check e o
  merge publica em produção (ADR 0003, DDR 0005); nenhuma fase deixa a `main`
  meio-migrada.
- **Tarefa = um commit de estado válido**: poucos arquivos, um assunto; lint,
  test e build verdes sozinha, na ordem da fase.
- **Pendências** não têm tabela: decisão aberta de tarefa fica em "Decisões em
  aberto nesta tarefa"; pontos em aberto do produto, em
  `docs/arquitetura.md` § Pontos em aberto e `docs/interface.md` § Pendências
  de interface; o resolvido, nos registros e nos logs.

### Dependências

- Tarefa depende **somente** das tarefas anteriores da mesma fase — de todas,
  na ordem numérica.
- Fase pode depender de outras fases (coluna "Depende de") e só é executada
  com elas `Entregue` na `main`.
- Tarefa de outra fase nunca é pré-requisito; pode ser referência ou
  precedente. Precisa do que outra fase entrega → pertence àquela fase, ou a
  fase dela passa a depender da outra.

## Status e ciclo de vida

O `## Status` do arquivo da tarefa é a fonte da verdade; o README acompanha no
mesmo commit. Divergência → siga o arquivo e aponte.

### Tarefa

| Status | Quem grava | Quando |
|---|---|---|
| `Pendente` | `/planejar` | ao criar |
| `Em andamento` | `/executar-tarefa` | ao começar, sem commit próprio |
| `Concluída` | `/executar-tarefa` | no commit da tarefa |
| `Bloqueada` | `/executar-tarefa` | no commit de bloqueio (§ Impedimentos › Bloqueio) |

- Execução que **falha** não gera commit: a tarefa fica `Em andamento` na
  árvore (§ Impedimentos › Arquivos parciais e retomada).
- `Concluída` é **imutável**; rever o que ela entregou é tarefa nova.
- `Pendente` pode ser ajustada pelo `/planejar`.

### Fase

| Status | Quem grava | Quando |
|---|---|---|
| `Pendente` | `/planejar` | ao criar; nenhuma tarefa iniciada |
| `Em andamento` | `/executar-tarefa` | ao começar a primeira tarefa, sem commit próprio |
| `Entregue` | `/executar-plano` | no commit de fechamento do PR, com todas as tarefas `Concluída`; efetivada pelo merge |

- `Entregue` = **fechada**: entregue por PR mesclado. Não existe fase
  concluída sem entrega.
- Na `main`, a fase vai de `Pendente` a `Entregue` no merge; `Em andamento`
  existe na branch da fase. PR fechado sem merge não entrega nada.
- `Pendente` ou `Em andamento` recebe tarefas novas (com PR aberto, só com
  confirmação do humano); `Entregue` não recebe — o trabalho vira fase nova.
- Tarefa `Bloqueada` impede as seguintes da fase; a fase segue `Em andamento`.

## Regras que valem em toda tarefa

- Arquivo novo abre com `Copyright (c) 2026 Daniel Felix Ferber`, na sintaxe
  de comentário do tipo do arquivo (`AGENTS.md` § Convenções).
- Componentes em `src/components/`, dados em `src/data/`; sem router nem
  estado global antes de a árvore exigir (`AGENTS.md` § Convenções).
- Nenhuma requisição por figurinha, uma leitura por login, escrita agregada,
  mapa esparso (`docs/requisitos.md` § Requisitos Não Funcionais).
- Nenhum componente com rolagem própria, salvo a faixa de bandeiras
  (IDR 0008, IDR 0016).
- Texto visível em PT-BR; cor nunca é o único sinal; nome acessível escreve
  por extenso a notação compacta (`docs/requisitos.md` § Requisitos Não
  Funcionais, IDR 0018).
- `npm run lint && npm run test && npm run build` verdes; `npm run test:rules`
  (JDK 21+) quando tocar `firestore.rules`.

## Comportamento padrão da execução

A tarefa descreve **só o que é específico dela**. Vale para toda tarefa, sem
estar escrito nela:

| Assunto | Padrão | Seção |
|---|---|---|
| Regras gerais | lista acima | Regras que valem em toda tarefa |
| Discovery e plano | antes de qualquer edição; sem aprovação, salvo nível 3 | Discovery e plano da alteração |
| Impedimentos | três níveis; só o nível 3 exige aprovação explícita | Impedimentos |
| Decisões | significativas já registradas no planejamento; a execução registra só níveis 1 e 2 e nível 3 respondido | Registro de decisões |
| Documentação | `docs/*.md` no estado atual, com lastro em registro | Documentação viva |
| Setup | só o previsto, cada comando registrado no log, sem segredos | Setup de infraestrutura e ambiente |
| Validação | lint, test, build; `test:rules` se tocou regras | Regras que valem em toda tarefa |
| Log e relatório | formato fixo | Formato do log, Relatório da tarefa |

### Critérios de aceite implícitos

- discovery e plano registrados antes da implementação, desvios explicados;
- validação verde;
- cada decisão tomada com registro e índice (ou justificativa no log);
- nada de "Fora do escopo" feito;
- `docs/*.md` afetados no estado atual, cada trecho alterado citando o
  registro;
- `docs/requisitos.md` intocado; `docs/setup-*.md` só com passos de setup;
- setup registrado no log, sem segredos;
- log completo e status atualizado.

### Como ler a tarefa

- Trecho que repete o padrão não acrescenta nada.
- Trecho que acrescenta (parada própria, validação extra, roteiro visual,
  critério específico) soma ao padrão, nunca o substitui.
- Número de registro citado é indicativo: vale o tipo e o assunto; o número é
  descoberto na hora.
- Tarefa que afrouxa o padrão (dispensa testes, log ou registro) é nível 3.

## Discovery e plano da alteração

Nada é editado antes do plano, exceto a marcação `Em andamento` e o log.

**Discovery da base de código** — obrigatório se há alteração de código,
testes, estilos, regras, configuração ou workflows:
- módulos citados e os que os usam ou são usados por eles;
- testes existentes da área e seu padrão;
- comportamento atual confere com a tarefa? divergência que muda o pedido é
  impedimento;
- convenções locais (nomes, estrutura, tokens CSS, estado);
- pontos de impacto fora de "Arquivos impactados".

**Discovery da documentação** — quando as referências não bastam: busque nos
`docs/*.md` e nos índices de decisão; leia Status, Decisão, Consequências e
Alternativas dos registros encontrados; anote o que leu a mais e por quê.

**Plano da alteração** — no log, antes de editar: passos em ordem; arquivos e
papel de cada mudança; testes e o que provam; registros e `docs/*.md`; setup e
comandos previstos; verificação prevista de cada critério; riscos.

- Confira o plano contra "Fora do escopo", "Decisões já tomadas" e o nível 3;
  se só se sustenta com nível 3, bloqueie antes de implementar.
- **O plano não pede aprovação.** Só impedimento de nível 3 exige aprovação
  explícita do humano.
- Desvio na execução → anote no log com o motivo.

## Impedimentos

A matriz vale sempre; "Impedimentos específicos" da tarefa só acrescenta.

| Nível | Situação | Ação |
|---|---|---|
| 1 | ambiguidade menor, reversível, interna ao código | decida, implemente, registre |
| 2 | ambiguidade que muda comportamento visível | premissa mais conservadora, registre, explicite no log e no relatório |
| 3 | ver lista abaixo | **aprovação explícita do humano** antes de seguir |

Nível 3:
- contradiz `docs/requisitos.md` ou exigiria alterá-lo;
- decisão significativa (§ Registro de decisões) que não foi registrada no
  planejamento;
- decisão da execução altera, reverte ou substitui decisão documentada
  vigente (inclusive alternativa recusada) que o planejamento não atualizou;
- setup não previsto na tarefa;
- comando de configuração pública ou de conta (provedor de login, authorized
  domains, DNS, branch protection, secrets, IAM), com custo em cota/plano ou
  irreversível — **mesmo previsto na tarefa**;
- tarefa que afrouxa o padrão.

Níveis 1 e 2 só valem para decisões que não mexem em decisão documentada; na
dúvida, nível 3.

### Aprovação

- **Modo avulso**: pergunte na conversa antes de seguir, com a pergunta
  objetiva e 2–3 alternativas (prós e contras); para comando, mostre o comando
  exato, o ambiente, o efeito e como reverter. Registre a resposta no log.
- **Modo delegado**: o subagente não conversa com o humano → bloqueie. Só siga
  se o prompt de delegação trouxer `Resposta do humano` que resolva a pergunta
  ou `Confirmação do humano` que cubra **exatamente** o comando.

### Bloqueio

1. No arquivo da tarefa: `## Status` → `Bloqueada`; logo abaixo, a pergunta e
   as alternativas (ou o comando exato, ambiente, efeito e reversão).
2. Linha da tarefa no README → `Bloqueada`.
3. No log: `## Execução interrompida` com motivo, arquivos parciais e próximo
   passo do plano.
4. Commit só com arquivo da tarefa, README e log — estado válido, sem código.
5. Código parcial não é commitado nem descartado.

### Arquivos parciais e retomada

- **Conjunto permitido** de arquivos sujos numa retomada: o arquivo da tarefa,
  `docs/plano/README.md`, o log da tarefa e os arquivos listados em
  `## Execução interrompida` do log. Qualquer outro arquivo sujo → pare.
- **Falha** (validação que não fica verde, critério não atendível): sem
  commit; `## Execução interrompida` no log, não commitado; relatório com
  `arquivos_parciais`.
- **Retomar com resposta ou confirmação**: acrescente abaixo da pergunta
  `Resposta do humano (AAAA-MM-DD): …`; status → `Em andamento`; reveja o plano
  à luz da resposta e continue dos arquivos parciais.
- **Descartar** (decisão do humano): `git restore --staged --worktree` nos
  arquivos rastreados do conjunto e remoção dos não rastreados listados; a
  tarefa volta ao último status commitado.

## Registro de decisões

Decisão = escolha que outra pessoa poderia fazer diferente e que não está na
tarefa nem num registro vigente.

### Quem registra

Decisão confirmada é registrada **no momento da confirmação** — não é
repassada a uma tarefa para ser "decidida" de novo.

| Decisão | Exemplos | Quando é confirmada | Quem registra |
|---|---|---|---|
| **Significativa** | arquitetura ou tecnologia; interface visível relevante (layout, interação, navegação); schema ou formato de dados; CI/CD e deploy; qualquer mudança em decisão documentada | na resposta a uma pergunta do esmiuçamento, ou na aprovação do mapa de fases | `/esmiucar`, no PR do esmiuçamento; `/planejar`, no PR do plano |
| Significativa que depende de evidência da execução | medição de largura, altura ou desempenho que decide entre alternativas | quando o humano responde ao ponto de parada | `/executar-tarefa`, citando a resposta |
| Nível 3 surgida na execução | § Impedimentos | quando o humano responde | `/executar-tarefa`, citando a resposta |
| Nível 1 | estrutura de dado, nome de módulo, API interna, contorno de bug ou limitação | na execução | `/executar-tarefa` |
| Nível 2 | premissa conservadora num detalhe visível não previsto | na execução | `/executar-tarefa`, sinalizada no relatório |

### Decisões no esmiuçamento

- O `/esmiucar` pergunta cada decisão significativa com evidência, opções,
  prós e contras e uma recomendação; o humano confirma na resposta.
- Confirmada → o `/esmiucar` cria ou atualiza o registro e a linha do índice
  na hora, e todos vão num commit do PR do esmiuçamento. Ainda não há fase:
  "Consequências" traz `Implementação: a planejar (/planejar).`; mudança em
  decisão vigente leva a anterior para `## Histórico` com a nota
  "implementação a planejar".
- O `/planejar` trata o registro como decisão já confirmada: não a repropõe e
  troca a linha "a planejar" pela fase e tarefa que a implementam. Mudar a
  decisão de novo é mudança em decisão documentada.
- O esmiuçamento só escreve nas pastas de decisão e seus índices; o pedido
  refinado, as orientações de nível 1 ou 2 e as questões em aberto vão para a
  descrição do PR, que é a entrada do `/planejar`.

### Decisões no planejamento

- O mapa de fases propõe cada decisão significativa: tipo, registro a criar ou
  atualizar (com o trecho que muda), decisão, alternativas com prós e contras
  e tarefa que a implementa. O humano confirma no mesmo passo.
- Confirmada → o `/planejar` cria ou atualiza o registro e a linha do índice,
  no commit do plano. Em "Consequências", cita a fase e a tarefa que a
  implementam. Mudança em decisão vigente atualiza o próprio registro, com a
  anterior em `## Histórico` e a nota "implementação na Fase NNNN".
- Até a entrega da fase, código e `docs/*.md` seguem o estado anterior; a
  tarefa implementa a decisão e atualiza os `docs/*.md`.
- Decisão significativa que só a execução pode resolver (depende de medição)
  entra na tarefa como ponto de parada em "Impedimentos específicos", com a
  pergunta e as alternativas já descritas; nunca como "decisão em aberto"
  para a tarefa resolver sozinha.

### Decisões na execução

A tarefa registra só: decisões de nível 1 e 2 que tomou, e decisões de nível 3
ou pontos de parada respondidos pelo humano. Qualquer decisão significativa
sem registro do planejamento é nível 3. Exemplos de nível 1: escolher
estrutura de dado, nome de módulo, API interna ou biblioteca; contornar bug ou
limitação (descoberta no Contexto); interpretar ambiguidade menor; desviar da
tarefa por causa do código atual sem mudar o resultado.

### Como registrar

| Tipo | Pasta | Guia (ler pelo caminho) | Para decisões de |
|---|---|---|---|
| ADR | `docs/adr/` | `docs/adr/CLAUDE.md` | arquitetura e tecnologia |
| TDR | `docs/tdr/` | `docs/tdr/CLAUDE.md` | implementação técnica pontual |
| IDR | `docs/idr/` | `docs/idr/CLAUDE.md` | interface: apresentação, interação, navegação |
| MDR | `docs/model-dr/` | `docs/model-dr/CLAUDE.md` | modelagem de dados |
| DDR | `docs/devops-dr/` | `docs/devops-dr/CLAUDE.md` | CI/CD, pipeline, build, deploy, validação |

- Leia o guia da pasta antes do primeiro registro daquele tipo.
- Registre no momento da decisão: estrutura e estilo do guia, linha no índice
  `docs/<tipo>/README.md`, mesmo commit.
- Número = último da pasta + 1, descoberto na hora; colisão com outra branch é
  resolvida antes do PR (§ Convenções de Git › Renumeração), tanto no PR do
  plano quanto no PR da fase.
- Decisão que altera, reverte ou substitui uma vigente só segue se o
  planejamento já atualizou o registro; senão, nível 3.
- Mudança em decisão vigente atualiza o **próprio registro** (anterior em
  `## Histórico`), nunca registro novo "substituído por".
- Sem registro só o puramente estético ou já decidido, com o motivo no log.

## Documentação viva

Os `docs/*.md` da raiz descrevem o estado atual e refletem a tarefa no mesmo
commit.

| Documento | Muda quando a tarefa altera | Lastro |
|---|---|---|
| `docs/arquitetura.md` | serviços, camadas, fluxo, pontos em aberto, índice de decisões | ADR / TDR |
| `docs/interface.md` | telas, interações, medidas, paleta, pendências de interface | IDR |
| `docs/modelo-firebase.md` | schema ou regras do Firestore | MDR |
| `docs/modelo-intercambio.md` | formato do export/import JSON | MDR |
| `docs/modelo-memoria.md` | coleção em memória na SPA | MDR |
| `docs/devops.md` | CI/CD, workflows, build, deploy, validação | DDR |
| `docs/setup-*.md` | configuração real de Firebase, Google Cloud, GitHub, DNS | DDR ou ADR |

1. Toda alteração tem registro que a lastreia: existe e está certo → cite;
   não existe → só pode ser criado pela tarefa se for decisão de nível 1 ou 2
   (§ Registro de decisões › Quem registra), senão nível 3; existe e é
   contrariado → só se o planejamento já atualizou o registro.
   Correção redacional (digitação, link) dispensa registro.
2. `docs/requisitos.md` não é alterado por tarefa.
3. `docs/setup-*.md` só muda com passos de setup no escopo.
4. Divergência antiga fora do que a tarefa toca vai para `observacoes` do
   relatório, não é corrigida.

### Especificação no planejamento

O `/planejar` **só produz documentação de planejamento**:
- arquivos de tarefa e `docs/plano/README.md`;
- registros de decisão confirmados e seus índices (§ Registro de decisões ›
  Decisões no planejamento).

Nunca cria, altera ou remove código-fonte, testes, estilos, configuração,
`firestore.rules`, workflows, assets nem `docs/*.md`.

- **Mudança de especificação** num `docs/*.md` (interface, arquitetura,
  modelos, DevOps) é **descrita na tarefa** — documento, seção e o que passa a
  dizer — e aplicada pela tarefa ao implementar, junto com o código.
- Se a mudança de especificação é uma **decisão**, o `/planejar` registra a
  decisão (IDR, TDR, MDR, DDR ou ADR) e a tarefa cita o registro em "Decisões
  já tomadas".
- O comportamento desejado é descrito em texto na tarefa; **no máximo
  pseudocódigo curto**, nunca código pronto para colar.

## Setup de infraestrutura e ambiente

1. Só o setup previsto; não previsto é nível 3.
2. Configuração pública, com custo ou irreversível: aprovação (§ Impedimentos).
3. CLI (`firebase`, `gcloud`, `gh`) antes de console (`AGENTS.md`
   § Ferramentas de automação disponíveis).
4. Cada passo no log na hora, em `## Setup realizado`: ambiente, objetivo,
   aprovação, comando exato, saída relevante, verificação, reversão. Console:
   clique a clique, com o motivo de não ser CLI.
5. Segredos como `<REDACTED>`, com onde o valor real está — em log, documento
   e commit.
6. Estado final no `docs/setup-*.md` correspondente (e `docs/devops.md` com
   DDR, se DevOps), com comandos para reproduzir.

## Convenções de Git

Usadas quando as skills de Git não estão disponíveis (sempre no OpenCode).

### Sincronização

1. `git fetch origin`.
2. Nunca commit direto na `main`; branch e worktree nascem de `origin/main`.
3. Branch atrás da `main` → `git rebase origin/main`; já publicada →
   `git push --force-with-lease`. Nunca force push na `main`.
4. Conflito → regra da skill; sem regra, pare e peça orientação.

### Branch

- `<tipo>/<nome>-<NNNN>`; worktree `.worktrees/<tipo>-<nome>-<NNNN>`
  (`.worktrees/` precisa estar no ignore).
- `tipo`, pela natureza do entregue, primeiro que couber: `docs` (só
  documentação), `security`, `test` (só testes), `feature`, `bugfix`, `poc`,
  `chore`.
- `nome`: 2–5 palavras em snake_case, começando por verbo em pt-BR na 3ª
  pessoa do presente, sem acento (ex.: `refina_cabecalho_controles`).
- `NNNN`: número da fase.

### Commit

- `tipo(escopo): resumo` em pt-BR, minúsculo, verbo na 3ª pessoa do presente.
- `tipo`, primeiro que couber: `ai` (só skills, comandos, guias de agente,
  `AGENTS.md`), `security`, `perf`, `test`, `docs`, `ci`, `build`, `feat`
  (inclui os testes dela), `fix`, `refactor`, `chore`.
- `escopo`: um dos já usados em `git log --oneline -50`; nenhum cabe → omita.
- Corpo: o que mudou e por quê, 72 colunas; cita `Tarefa NNNN-XXXX` quando
  houver.
- Trailer de coautoria da ferramenta que escreveu a mensagem.

### PR

- Base `main`; título em pt-BR, frase que diz o que a fase entrega.
- Corpo: objetivo; tarefas com link para arquivo e log; registros criados ou
  atualizados; setups com link para o log; verificações pendentes; como
  verificar no preview.
- Labels: `enhancement` (funcionalidade), `bug` (correção), `documentation`
  (só documentação).
- Nunca merge nem auto-merge.

### Renumeração

Antes do push de qualquer branch que criou registro de decisão (plano ou
fase), depois de sincronizar com a `main`:

1. Leia o guia de cada pasta envolvida (formato do título, links e índice).
2. Registros criados na branch:
   `git diff --name-status --diff-filter=A origin/main...HEAD -- docs/adr docs/tdr docs/idr docs/model-dr docs/devops-dr`
   (sem `README.md` e `CLAUDE.md`).
3. Colisão = mesmo número na mesma pasta da `origin/main`.
4. Novo número = próximo livre após o maior entre `origin/main` e a branch, em
   ordem de criação: `git mv`; título; links e menções `TIPO NNNN` em todos os
   arquivos alterados pela branch (tarefas, logs, `docs/*.md`, índice); linha do
   índice na posição; busca sem referência antiga.
5. Commit próprio; tabela `antigo → novo` na descrição do PR.
6. Conflito de sincronização só em `docs/<tipo>/README.md` ou em linhas de
   tabela de `docs/plano/README.md` → mantenha as linhas dos dois lados, em
   ordem numérica.

## Formato da tarefa

Seções com estes nomes, **nesta ordem**; as opcionais são omitidas quando não
há conteúdo específico.

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [NNNN-XXXX]: [ação descritiva]

## Status
Pendente

## Objetivo
[2 a 4 linhas: resultado verificável e motivo]

## Documentos de referência
- `caminho/real.md` § [seção exata] — [o que extrair]

## Padrões e convenções aplicáveis
- [regra que ESTA tarefa pode violar] — [fonte]

## Escopo e instruções de implementação
1. [o que mudar: módulos, dados, componentes, regras, erros, testes, setup]

**Fora do escopo**: [o que fica de fora e qual tarefa cobre]

## Decisões já tomadas (não reabrir)
- [decisão vigente mantida] — ver `docs/<tipo>/NNNN-slug.md`
- [decisão registrada no planejamento, que esta tarefa implementa] — ver
  `docs/<tipo>/NNNN-slug.md`

## Decisões em aberto nesta tarefa        (opcional)
- [questão menor, nível 1 ou 2] — encaminhamento; se virar registro: [TIPO]
  sobre [assunto]

## Impedimentos específicos               (opcional)
- [parada ou premissa própria desta tarefa]
- **Ponto de decisão**: [decisão significativa que depende de evidência da
  execução] — medir/verificar [o quê]; alternativas: [A — prós/contras],
  [B — prós/contras]; registro que nasce ou muda: `docs/<tipo>/...`

## Arquivos impactados
- `caminho/arquivo` — criar | modificar | remover
- `docs/<arquivo>.md` — modificar (§ seção)
- `docs/<tipo>/NNNN-slug.md` — modificar | `docs/<tipo>/` — criar ([assunto])

## Critérios de aceite
- [ ] [específico e verificável]

## Validação adicional                     (opcional)
- [`npm run test:rules`; roteiro visual em `npm run dev`; buscas]
```

### Como preencher

- **Documentos de referência**: caminhos que existem, ou gerados por tarefa
  anterior da mesma fase, marcados "(gerado pela Tarefa NNNN-XXXX)"; seção
  exata. Inclua os registros que a tarefa toca ou muda. Decisões de conversa
  entram como fatos, não como "conversa".
- **Padrões**: 3 a 6 regras que esta tarefa pode violar; regra geral do guia
  não entra.
- **Escopo**: o que mudar (o como é do plano da execução), em texto — no
  máximo pseudocódigo curto, nunca código pronto —, incluindo os testes e as
  mudanças de especificação em `docs/*.md` (documento, seção, o que passa a
  dizer);
  passos de setup um por item, com ambiente, resultado, comando previsto e se
  é configuração pública. "Fora do escopo" obrigatório.
- **Decisões já tomadas**: registros vigentes que a tarefa mantém e registros
  criados ou atualizados pelo planejamento que ela implementa, sempre pelo
  caminho real.
- **Decisões em aberto**: só questões menores (nível 1 ou 2), com
  encaminhamento; decisão significativa nunca fica aqui — ou foi registrada no
  planejamento, ou é "Ponto de decisão" em "Impedimentos específicos".
- **Arquivos impactados**: código, testes, `docs/*.md` e registros; nunca
  `docs/requisitos.md`; `docs/setup-*.md` só com setup.
- **Critérios**: verificáveis por teste, trecho, busca ou verificação visual
  descrita; nenhum critério implícito; critério sobre registro diz o que ele
  decide.
- **Validação adicional**: só o que vai além de lint, test e build.

### Conferência da tarefa

- [ ] Seções obrigatórias, nomes exatos, ordem do modelo
- [ ] Nada repete o comportamento padrão
- [ ] Nenhum código pronto: comportamento em texto, no máximo pseudocódigo
      curto
- [ ] Mudanças de especificação em `docs/*.md` descritas (documento, seção, o
      que passa a dizer); as que são decisão têm registro citado
- [ ] Pré-requisitos só entre tarefas anteriores da mesma fase
- [ ] Registros citados pelo caminho real, inclusive os criados no
      planejamento
- [ ] Nenhuma decisão significativa em "Decisões em aberto"; as confirmadas
      estão registradas e em "Decisões já tomadas"; as que dependem de
      evidência estão como "Ponto de decisão"
- [ ] Todo `docs/*.md` impactado com registro de lastro
- [ ] `docs/requisitos.md` fora; `docs/setup-*.md` só com setup
- [ ] A tarefa sozinha termina em lint, test e build verdes
- [ ] Cada critério com forma concreta de verificação
- [ ] Todo caminho citado existe, é "criar" ou "gerado pela Tarefa"
- [ ] Nenhuma "conversa" como fonte

## Formato do log

`docs/plano/NNNN-nome-da-fase/logs/XXXX-log-nome-da-tarefa.md`. Exemplo real:
`docs/plano/0014-numeracao-dos-extras-fifa/logs/0001-log-fwc-renumerado-de-00-a-19.md`.

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa NNNN-XXXX: [título]

## Data
AAAA-MM-DD

## Resumo
O que foi feito e por quê: comportamento antes e depois, arquivos e o papel de
cada mudança, divergências entre tarefa, documentação e código e como foram
resolvidas. Para quem não acompanhou a execução.

## Discovery
- Código: [módulos, dependências, testes, convenções; comportamento atual
  confere? impactos não citados] | não se aplica
- Documentação: [lido além das referências e por quê] | as referências bastaram

## Plano da alteração
1. [passo — arquivos, testes, registros, docs, setup]
- Verificação prevista: [critério → como]
- Riscos: [...]
- Desvios: nenhum | [o que mudou e por quê]

## Decisões tomadas
- [decisão] — `docs/<tipo>/NNNN-*.md` (nível, se houver)
- [decisão sem registro] — motivo

## Impedimentos
Nenhum | [nível, pergunta, resposta do humano, tratamento]

## Setup realizado
Nenhum | por passo, na ordem:

### [n]. [objetivo]
- Ambiente: Firebase | Google Cloud | GitHub | DNS | local
- Aprovação do humano: [data e comando] | não se aplica
- Comando executado:
  ```
  [comando exato, segredos como <REDACTED>]
  ```
- Saída relevante: [trecho real]
- Verificação: [comando e resultado]
- Como reverter: [comando ou passo]
- Documento atualizado: `docs/setup-*.md` § [seção]

## Validação
Saída real de cada comando; linhas repetitivas de sucesso podem ser
encurtadas, totais e todo aviso e erro não.

## Critérios de aceite
- [x] [critério] — evidência
- [ ] [critério] — por que não / verificação visual pendente

## Arquivos alterados
- `caminho` — o que mudou

## Execução interrompida                    (só se bloqueada ou falhou)
- Motivo: [bloqueio | falha: comando e saída]
- Arquivos parciais: [`caminho`, ...]
- Próximo passo do plano: [n]

## Correções pós-PR                          (só se houver)
- [data] — [check], [causa], [correção], commit [SHA]
```

## Relatório da tarefa

Saída do `/executar-tarefa` e entrada do `/executar-plano`: **só** este bloco,
com valores dos enumerados indicados.

```yaml
tarefa: NNNN-XXXX
resultado: concluida        # concluida | bloqueada | falhou
commit: null                # SHA curto ou null
plano: ""                   # resumo do plano em uma linha
desvios: []                 # ["desvio — motivo"]
registros: []               # caminhos criados ou alterados
setup: []                   # [{ambiente: "", objetivo: ""}]
log: null                   # caminho ou null
validacao: {lint: ok, test: ok, build: ok, test_rules: nao_se_aplica}  # ok | falhou | nao_se_aplica
criterios: {atendidos: 0, total: 0, nao_atendidos: []}                 # nao_atendidos: ["critério — motivo"]
verificacao_visual: nao_se_aplica   # feita | pendente | nao_se_aplica
roteiro_visual: null
bloqueio: null              # {tipo: pergunta|confirmacao, pergunta: "", alternativas: [], comando: "", ambiente: "", efeito: "", reversao: ""}
falha: null                 # {comando: "", saida: "", tentativas: ""}
arquivos_parciais: []
observacoes: []             # o que afeta as próximas tarefas; divergências antigas encontradas
```
