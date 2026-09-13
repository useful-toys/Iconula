<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Plano de implementação — guia

Fonte única das regras de `docs/plano/`. Os comandos contêm só o fluxo e
remetem a este guia; em conflito, **o guia vence** e o comando é corrigido.

## Comandos

| Comando | Faz |
|---|---|
| `/planejar <pedido>` | verifica se o pedido é novo, propõe tarefas em fases existentes ou novas, grava numa branch `docs` e abre PR |
| `/executar-plano NNNN` | executa as tarefas pendentes de uma fase, uma por subagente, entrega num PR e acompanha CI e preview |
| `/executar-tarefa NNNN-XXXX` | discovery, plano da alteração, implementação e um commit de estado válido |

Cada comando tem **duas versões sincronizadas**: `.opencode/commands/<nome>.md`
(OpenCode) e `.claude/commands/<nome>.md` (Claude Code). Objetivo, entrada,
leituras, condições de parada, passos, saída e proibições são iguais; só
variam:
- a ferramenta de subagente (OpenCode: `task` com o agente `general`; Claude
  Code: `Agent` com o subagente `general-purpose`);
- o uso de skills de Git (Claude Code usa as skills quando disponíveis;
  OpenCode aplica § Convenções de Git);
- o diretório do próprio comando citado nas leituras e na delegação;
- o frontmatter.

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
| Decisões | registradas na hora; mudança de decisão só se prevista | Registro de decisões |
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
- decisão da execução altera, reverte ou substitui decisão documentada
  vigente (inclusive alternativa recusada) **sem previsão na tarefa**;
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
tarefa nem num registro vigente: resolver "Decisão em aberto"; escolher
estrutura de dado, nome de módulo, API interna ou biblioteca; contornar bug ou
limitação (descoberta no Contexto); interpretar ambiguidade; desviar da tarefa
por causa do código atual.

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
  resolvida pelo `/executar-plano` antes do PR.
- Decisão que altera, reverte ou substitui uma vigente só segue se a tarefa a
  prevê; senão, nível 3.
- Mudança prevista atualiza o **próprio registro** (anterior em
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
   não existe → crie antes; existe e é contrariado → só com previsão na tarefa.
   Correção redacional (digitação, link) dispensa registro.
2. `docs/requisitos.md` não é alterado por tarefa.
3. `docs/setup-*.md` só muda com passos de setup no escopo.
4. Divergência antiga fora do que a tarefa toca vai para `observacoes` do
   relatório, não é corrigida.

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
4. Conflito → regra do comando; sem regra, pare e peça orientação.

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
- `tipo`, primeiro que couber: `ai` (só comandos, guias de agente,
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
- [decisão mantida] — ver `docs/<tipo>/NNNN-slug.md`

## Decisões em aberto nesta tarefa        (opcional)
- [pergunta] — encaminhamento; registro: atualiza `docs/<tipo>/NNNN-slug.md` |
  nasce um [TIPO] sobre [assunto]
- **Muda decisão documentada**: `docs/<tipo>/NNNN-slug.md` § [trecho] —
  [o que dizia] → [o que passa a dizer]

## Impedimentos específicos               (opcional)
- [parada ou premissa própria desta tarefa]

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
- **Escopo**: o que mudar (o como é do plano da execução), incluindo os testes;
  passos de setup um por item, com ambiente, resultado, comando previsto e se
  é configuração pública. "Fora do escopo" obrigatório.
- **Decisões já tomadas**: só registros mantidos; o que muda vai para "Muda
  decisão documentada".
- **Decisões em aberto**: encaminhamento e destino do registro; registro novo
  pelo tipo e assunto, sem número.
- **Arquivos impactados**: código, testes, `docs/*.md` e registros; nunca
  `docs/requisitos.md`; `docs/setup-*.md` só com setup.
- **Critérios**: verificáveis por teste, trecho, busca ou verificação visual
  descrita; nenhum critério implícito; critério sobre registro diz o que ele
  decide.
- **Validação adicional**: só o que vai além de lint, test e build.

### Conferência da tarefa

- [ ] Seções obrigatórias, nomes exatos, ordem do modelo
- [ ] Nada repete o comportamento padrão
- [ ] Pré-requisitos só entre tarefas anteriores da mesma fase
- [ ] Nenhum número de registro novo; registros existentes pelo caminho real
- [ ] Toda mudança de decisão documentada declarada como "Muda decisão
      documentada"
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
