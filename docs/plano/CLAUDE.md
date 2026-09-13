<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Plano de implementação — guia

Fonte única das regras do plano (`docs/plano/`): estrutura, status, regras
gerais, comportamento padrão de toda tarefa, formato da tarefa e formato do
log. Os comandos descrevem só o próprio fluxo e remetem a este guia; em
conflito entre um comando e este guia, **o guia vence** — corrija o comando.

| Comando | Fluxo | Seções deste guia que usa |
|---|---|---|
| `/planejar` | propõe fases e tarefas, grava numa branch `docs` e abre PR | Estrutura, Status, Formato da tarefa, Conferência da tarefa |
| `/executar-plano NNNN` | executa uma fase numa branch própria, tarefa a tarefa em subagentes, e entrega num PR | Status, Formato do log |
| `/executar-tarefa NNNN-XXXX` | executa uma tarefa e termina num commit de estado válido | todas |

Os comandos existem com o mesmo conteúdo em `.opencode/commands/` e
`.claude/commands/`.

## Estrutura

- `docs/plano/README.md` — índice: tabela de fases e seção de cada fase com a
  tabela de tarefas. Não repete regras deste guia nem mantém lista de
  pendências.
- **Pendências** não têm tabela própria: a decisão ainda aberta de uma tarefa
  vive em "Decisões em aberto nesta tarefa"; os pontos em aberto do produto
  vivem em `docs/arquitetura.md` § Pontos em aberto e
  `docs/interface.md` § Pendências de interface; o que foi resolvido fica nos
  registros de decisão e nos logs.
- `docs/plano/NNNN-nome-da-fase/XXXX-nome-da-tarefa.md` — arquivo da tarefa.
- `docs/plano/NNNN-nome-da-fase/logs/XXXX-log-nome-da-tarefa.md` — log da
  execução; a pasta `logs/` nasce com o primeiro log (o Git não guarda pasta
  vazia).
- `NNNN` e `XXXX` com 4 dígitos; nomes em kebab-case, sem acentos.
- **Cada fase é um PR mesclável na `main`**: o preview deploy por PR é
  required check e o merge publica em produção (ADR 0003, DDR 0005). Ao fim
  de toda fase o app continua utilizável; nenhuma fase deixa a `main`
  meio-migrada.
- **Cada tarefa é um commit de estado válido**: poucos arquivos, um assunto, e
  lint, test e build verdes sozinha, na ordem da fase.

### Dependências

- **Tarefa depende somente das tarefas anteriores da mesma fase** — de todas
  elas, na ordem numérica. As tarefas de uma fase são executadas em sequência
  e cada uma parte do commit da anterior.
- **Fase pode depender de outras fases**, declaradas na coluna "Depende de" da
  tabela de fases. A fase só é executada com as fases de que depende
  `Entregue` na `main`.
- Uma tarefa **nunca** tem como pré-requisito uma tarefa de outra fase. Se
  precisa do que outra fase entrega, ou ela pertence àquela fase, ou a fase
  dela passa a depender da outra. Tarefa de outra fase pode ser citada como
  referência ou precedente, não como pré-requisito.

## Status e ciclo de vida

O `## Status` do arquivo da tarefa é a **fonte da verdade**. As tabelas do
README o acompanham no mesmo commit; se divergirem, siga o arquivo e aponte a
divergência.

### Tarefa

| Status | Quem grava | Quando |
|---|---|---|
| `Pendente` | `/planejar` | ao criar a tarefa |
| `Em andamento` | `/executar-tarefa` | ao começar, no arquivo e no README, sem commit próprio — segue no commit de conclusão ou de bloqueio |
| `Concluída` | `/executar-tarefa` | no commit da tarefa, com validação verde, critérios de aceite verificados e log |
| `Bloqueada` | `/executar-tarefa` | num commit só de status, com a pergunta e as alternativas no arquivo da tarefa |

- Execução que termina em **Falhou** não gera commit: a tarefa fica
  `Em andamento` na árvore, com as alterações não commitadas, para o humano
  decidir.
- Tarefa `Concluída` é **imutável**: nenhuma seção muda depois. Revisar o que
  ela entregou é sempre uma tarefa nova.
- Tarefa `Pendente` pode ser ajustada pelo `/planejar`.

### Fase

| Status | Quem grava | Quando |
|---|---|---|
| `Pendente` | `/planejar` | ao criar a fase; nenhuma tarefa iniciada |
| `Em andamento` | `/executar-tarefa` | ao começar a primeira tarefa da fase, na linha da fase no README, sem commit próprio — segue no commit dessa tarefa |
| `Entregue` | `/executar-plano` | no commit de fechamento do PR, com todas as tarefas `Concluída`; efetivada pelo merge do PR na `main` |

- **`Entregue` é fase fechada**: foi entregue por PR mesclado na `main`. Não
  existe fase "concluída" sem entrega — tarefas concluídas numa branch ainda
  não mesclada deixam a fase `Em andamento`.
- Na `main`, uma fase passa de `Pendente` direto a `Entregue` no merge; o
  `Em andamento` aparece na branch da fase enquanto ela é executada. O status
  `Entregue` é gravado na branch antes do PR para entrar no próprio merge.
- PR fechado sem merge não entrega nada: a `main` continua com o status
  anterior e a fase é executada de novo.
- Fase `Pendente` ou `Em andamento` pode receber tarefas novas (se já tem PR
  aberto, com confirmação do humano); fase `Entregue` **não recebe** — o
  trabalho vira fase nova que a cita como dependência.
- Uma tarefa `Bloqueada` impede as seguintes da mesma fase; a fase continua
  `Em andamento`.

## Regras que valem em toda tarefa

- Arquivo novo abre com `Copyright (c) 2026 Daniel Felix Ferber`, na sintaxe
  de comentário do tipo do arquivo (`AGENTS.md` § Convenções).
- Componentes novos em `src/components/`, dados em `src/data/`; sem router e
  sem estado global antes de a árvore exigir (`AGENTS.md` § Convenções).
- Nenhuma requisição por figurinha, uma leitura por login, escrita agregada e
  mapa esparso (`docs/requisitos.md` § Requisitos Não Funcionais).
- Nenhum componente com rolagem própria, salvo a faixa de bandeiras
  (IDR 0008 / IDR 0016).
- Todo texto visível em PT-BR; cor nunca é o único sinal de estado; o nome
  acessível escreve por extenso a notação compacta (`docs/requisitos.md`
  § Requisitos Não Funcionais, IDR 0018).
- `npm run lint && npm run test && npm run build` verdes ao fim de toda
  tarefa; `npm run test:rules` (JDK 21+) quando a tarefa tocar
  `firestore.rules`.

## Comportamento padrão da execução

O arquivo da tarefa descreve **só o que é específico dela**. Tudo abaixo vale
para qualquer tarefa, mesmo sem estar escrito nela:

| Assunto | Padrão | Seção |
|---|---|---|
| Regras gerais | lista acima | Regras que valem em toda tarefa |
| Discovery | da base de código, se há alteração de código prevista; da documentação, se as referências não bastam | Discovery e plano da alteração |
| Plano da alteração | escrito antes de executar ou codar, registrado no log, desvios explicados | Discovery e plano da alteração |
| Impedimentos | matriz de três níveis, bloqueio e confirmação do humano | Impedimentos |
| Decisões | ADR/TDR/IDR/MDR/DDR na hora, numeração descoberta nas pastas, mudança de decisão só se prevista | Registro de decisões |
| Documentação | `docs/*.md` no estado atual, cada mudança lastreada num registro; `requisitos.md` intocável; `setup-*.md` só com passos de setup | Documentação viva |
| Setup | só o previsto, configuração pública confirmada antes, cada passo com o comando exato no log, sem segredos | Setup de infraestrutura e ambiente |
| Validação | lint, test e build; `test:rules` se tocou `firestore.rules` | Regras que valem em toda tarefa |
| Log | formato fixo, saída real da validação, evidência dos critérios | Formato do log |
| Commit | um único commit com código, testes, registros, documentação, log e status | `/executar-tarefa` |

### Critérios de aceite implícitos

Verificados em toda tarefa, além dos específicos:
- discovery e plano da alteração registrados no log, feitos antes da
  implementação, com os desvios do plano explicados;
- validação verde;
- cada decisão tomada com registro e índice atualizados (ou justificativa no
  log);
- nenhum item de "Fora do escopo" feito;
- os `docs/*.md` afetados refletem o estado depois da tarefa, cada trecho
  alterado citando o registro que o lastreia;
- `docs/requisitos.md` intocado; `docs/setup-*.md` intocados salvo com passos
  de setup;
- todo setup executado registrado no log, sem segredos;
- log gerado e status atualizado.

### Como ler a tarefa diante do padrão

- Seção da tarefa que repete o padrão não acrescenta nada.
- Seção que **acrescenta** (caso de parada próprio, validação extra, roteiro
  visual, critério específico) soma ao padrão, nunca o substitui.
- Número de registro citado na tarefa é indicativo e envelhece: vale o tipo e
  o assunto; o número é descoberto na hora.
- A tarefa não pode afrouxar o padrão (dispensar testes, log ou registro). Se
  pedir, é impedimento de nível 3.
- Tarefas antigas usam "Documentos de referência (ler antes de implementar)",
  "Impedimentos" e "Validação", e podem ter as seções em outra ordem; valem
  como "Documentos de referência", "Impedimentos específicos" e "Validação
  adicional".

## Discovery e plano da alteração

Toda tarefa começa entendendo o terreno e planejando a mudança. **Nada é
editado antes do plano**, exceto a marcação `Em andamento` e o rascunho do log.

### Discovery da base de código

Obrigatório quando a tarefa prevê alteração de código (inclusive testes,
estilos, regras do Firestore, configuração e workflows):
- localizar os módulos citados e os que eles usam ou que os usam (imports,
  chamadas, props, eventos);
- ler os testes existentes que cobrem esse comportamento e o padrão de teste
  da área;
- confirmar que o comportamento atual é o que a tarefa descreve; divergência
  é registrada e, se muda o que a tarefa pede, é impedimento;
- identificar convenções locais (nomes, estrutura de arquivos, tokens CSS,
  padrões de estado) que a alteração deve seguir;
- listar os pontos de impacto não citados em "Arquivos impactados".

### Discovery da documentação

Obrigatório quando os "Documentos de referência" não bastam para decidir —
por exemplo, uma regra citada remete a outro documento, a tarefa toca um
assunto sem referência ou há dúvida se uma decisão já existe:
- buscar nos `docs/*.md` e nos índices de decisão (`docs/adr/README.md`,
  `docs/tdr/README.md`, `docs/idr/README.md`, `docs/model-dr/README.md`,
  `docs/devops-dr/README.md`) os registros sobre o assunto;
- ler Status, Decisão, Consequências e Alternativas dos registros encontrados;
- registrar o que foi lido a mais e por quê.

### Plano da alteração

Escrito **antes** de executar ou codar, no rascunho do log (§ Formato do log ›
Plano da alteração):
- passos na ordem em que serão executados;
- arquivos a criar, modificar ou remover, com o papel de cada mudança;
- testes a criar ou ajustar e o que cada um prova;
- registros de decisão a criar ou atualizar e `docs/*.md` a atualizar;
- passos de setup e os comandos previstos;
- como cada critério de aceite será verificado;
- riscos e o que fica fora.

O plano é conferido contra "Fora do escopo", "Decisões já tomadas" e a matriz
de impedimentos. Se o plano só se sustenta com algo de nível 3, a tarefa
bloqueia **antes** de implementar. Na execução, todo desvio do plano é
anotado no log com o motivo.

## Impedimentos

A matriz vale sempre; "Impedimentos específicos" da tarefa só acrescenta casos.

1. **Ambiguidade menor, reversível, interna ao código** → decida, implemente e
   registre a decisão.
2. **Ambiguidade que muda o comportamento visível ao usuário** → implemente
   sob a premissa mais conservadora, registre-a, deixe-a explícita no log e
   sinalize no relatório.
3. **PARE e pergunte** quando:
   - contradiz `docs/requisitos.md` ou exigiria alterá-lo;
   - uma decisão da execução **alteraria, reverteria ou substituiria uma
     decisão já documentada** (ADR/TDR/IDR/MDR/DDR vigente, inclusive uma
     alternativa que o registro recusou) e essa mudança **não está prevista
     na tarefa**, nomeando o registro;
   - exige setup ou mudança de configuração pública (provedor de login,
     authorized domains, DNS, branch protection, secrets, IAM) que a tarefa
     não prevê;
   - tem custo em cota/plano;
   - é irreversível.

Os níveis 1 e 2 só valem para decisões que **não** mexem em decisão
documentada; na dúvida, trate como nível 3.

### Confirmação do humano

Mesmo prevista na tarefa, precisa de confirmação explícita **antes** do
comando toda mudança de configuração pública ou de conta, todo passo com
custo e todo passo irreversível. A confirmação cobre **exatamente** o comando
mostrado; outro comando precisa de outra confirmação. Ela é registrada no log.

### Bloqueio

Ao parar no nível 3, ou ao precisar de confirmação que não pode ser obtida na
hora:
1. Não commite código parcial nem o descarte.
2. No arquivo da tarefa, `## Status` → `Bloqueada`, com logo abaixo a pergunta
   objetiva e 2–3 alternativas com prós e contras. Para confirmação pendente,
   a pergunta traz o **comando exato**, o ambiente, o efeito e como reverter.
   Atualize a linha da tarefa no README.
3. Commite só essas duas alterações — é estado válido, porque não muda código.
4. Na retomada, a resposta do humano é acrescentada abaixo da pergunta
   (`Resposta do humano (AAAA-MM-DD): …`), o status volta a `Em andamento` e a
   resposta entra no log.

## Registro de decisões

Conta como decisão qualquer escolha que outra pessoa poderia ter feito
diferente e que não está escrita na tarefa nem num registro vigente:
resolver uma "Decisão em aberto"; escolher estrutura de dado, nome de módulo,
API interna ou biblioteca; contornar um bug ou limitação (a descoberta vai
para o Contexto); interpretar uma ambiguidade; desviar da tarefa porque o
código atual não permitia.

| Tipo | Pasta | Guia (ler explicitamente) | Para decisões de |
|---|---|---|---|
| ADR | `docs/adr/` | `docs/adr/CLAUDE.md` | arquitetura e tecnologia (stack, dependências estruturais, forma de deploy) |
| TDR | `docs/tdr/` | `docs/tdr/CLAUDE.md` | implementação técnica pontual |
| IDR | `docs/idr/` | `docs/idr/CLAUDE.md` | interface significante (apresentação, interação, navegação) |
| MDR | `docs/model-dr/` | `docs/model-dr/CLAUDE.md` | modelagem de dados (schema, formato, transformação, validação) |
| DDR | `docs/devops-dr/` | `docs/devops-dr/CLAUDE.md` | DevOps (CI/CD, pipeline, build, deploy, ferramentas de validação) |

- Guias `CLAUDE.md` de subdiretório não são carregados automaticamente por
  todas as ferramentas (o OpenCode não os carrega): **leia o guia da pasta
  pelo caminho** antes de criar ou atualizar um registro daquele tipo.
- Registre **no momento em que decide**, seguindo o guia da pasta: estrutura,
  estilo e linha no índice `docs/<tipo>/README.md`, no mesmo commit.
- Numeração: a última da pasta mais um, descoberta na hora nos índices e nos
  arquivos. Nunca confie em número citado no plano ou na tarefa. Colisão com
  outra branch é resolvida pelo `/executar-plano` antes do PR.
- Antes de registrar, confira se a decisão **altera, reverte ou substitui**
  uma vigente. Se sim, só segue se a tarefa prevê a mudança nomeando o
  registro; senão, é impedimento de nível 3.
- Mudança prevista numa decisão existente atualiza o **próprio registro** (a
  anterior vai para `## Histórico`), nunca um registro novo "substituído por".
- Só fica sem registro o que é puramente estético ou já está decidido; o log
  diz por quê.

## Documentação viva

Os documentos da raiz de `docs/` descrevem o **estado atual**. Ao fim da
tarefa, refletem o que ela mudou — no mesmo commit.

| Documento | Atualize quando a tarefa mudar | Registro que lastreia |
|---|---|---|
| `docs/arquitetura.md` | serviços, camadas, fluxo de dados, pontos em aberto, índice de decisões | ADR / TDR |
| `docs/interface.md` | telas, interações, medidas, paleta, pendências de interface | IDR |
| `docs/modelo-firebase.md` | schema ou regras da persistência no Firestore | MDR |
| `docs/modelo-intercambio.md` | formato do export/import JSON | MDR |
| `docs/modelo-memoria.md` | representação da coleção em memória na SPA | MDR |
| `docs/devops.md` | CI/CD, workflows, build, deploy, ferramentas de validação | DDR |
| `docs/setup-*.md` | configuração real de Firebase, Google Cloud, GitHub ou DNS | DDR ou ADR, conforme o assunto |

1. **Toda alteração num `docs/*.md` é lastreada por um registro.** Procure o
   registro que já decide aquilo: se existe e está correto, cite-o; se não
   existe, crie-o antes; se existe e a mudança o contradiz, só segue se a
   tarefa prevê a mudança de decisão. Correção puramente redacional (erro de
   digitação, link quebrado) dispensa registro.
2. **`docs/requisitos.md` não é alterado por tarefa.** Se a tarefa só se
   sustenta mudando um requisito, ou o documento diverge do implementado, é
   impedimento de nível 3.
3. **`docs/setup-*.md` só mudam em tarefa com passos de setup** previstos no
   escopo.
4. Divergência antiga entre documento e código, fora do que a tarefa toca, não
   é corrigida na tarefa: vai para as observações do relatório.

## Setup de infraestrutura e ambiente

Vale quando a tarefa inclui **passos de setup** (Firebase, Google Cloud,
GitHub, DNS, secrets, workflows, emuladores, ferramentas locais):

1. Só execute o setup que a tarefa prevê; setup não previsto é impedimento de
   nível 3.
2. Configuração pública ou de conta exige confirmação do humano antes do
   comando (seção Impedimentos › Confirmação do humano).
3. Prefira CLI (`firebase`, `gcloud`, `gh`) a passos manuais no console
   (`AGENTS.md` § Ferramentas de automação disponíveis), para que o setup seja
   reproduzível.
4. **Registre cada passo no log na hora em que o executa**, na seção
   `## Setup realizado`: ambiente, objetivo, confirmação recebida, **comando
   exato**, saída relevante, verificação e como reverter. Passo manual no
   console é descrito clique a clique, com o motivo de não ter sido por CLI.
5. **Nunca escreva segredos** no log, em documento ou em commit: valores de
   secrets, tokens, chaves e senhas aparecem como `<REDACTED>`, com a
   indicação de onde o valor real está guardado.
6. Reflita o estado final no `docs/setup-*.md` correspondente (e no
   `docs/devops.md`, com DDR, se for decisão de DevOps), com os comandos para
   reproduzir.

## Formato da tarefa

Nomes de seção exatos e **nesta ordem** — `Status` primeiro, `Objetivo` logo
depois, em seguida as demais. As marcadas como opcionais são omitidas quando
não há conteúdo específico.

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [NNNN-XXXX]: [ação descritiva]

## Status
Pendente

## Objetivo
[2 a 4 linhas]

## Documentos de referência
- `caminho/real/do/arquivo.md` § [seção exata] — [o que extrair daqui]

## Padrões e convenções aplicáveis
- [regra que ESTA tarefa pode violar] — [fonte citada]

## Escopo e instruções de implementação
1. [passo: módulos, formatos de dados, componentes, regras de negócio,
   tratamento de erro, testes automáticos que cobrem o comportamento]

**Fora do escopo**: [o que fica de fora e, se houver, qual tarefa cobre]

## Decisões já tomadas (não reabrir)
- [decisão] — ver `docs/<tipo>/NNNN-slug.md`

## Decisões em aberto nesta tarefa        (opcional)
- [pergunta] — encaminhamento proposto; registro: atualiza
  `docs/<tipo>/NNNN-slug.md` | nasce um [ADR/TDR/IDR/MDR/DDR] sobre [assunto]
- **Muda decisão documentada**: `docs/<tipo>/NNNN-slug.md` § [trecho] —
  [o que dizia] → [o que passa a dizer]

## Impedimentos específicos               (opcional)
- [caso de parada ou premissa conservadora próprio desta tarefa]

## Arquivos impactados
- `caminho/arquivo` — criar | modificar | remover
- `docs/<arquivo>.md` — modificar (§ seção)
- `docs/<tipo>/NNNN-slug.md` — modificar | `docs/<tipo>/` — criar ([assunto])

## Critérios de aceite
- [ ] [objetivo, verificável e específico desta tarefa]

## Validação adicional                     (opcional)
- [`npm run test:rules` se tocar `firestore.rules`; roteiro de verificação
  visual em `npm run dev` dizendo o que olhar; buscas de conferência]
```

### Como preencher

- **Status**: `Pendente` ao criar.
- **Objetivo**: 2 a 4 linhas com o resultado visível ou verificável e o
  motivo; é a primeira coisa lida depois do status.
- **Documentos de referência**: só caminhos que existem — ou que uma tarefa
  anterior **da mesma fase** cria, marcados "(gerado pela Tarefa NNNN-XXXX)";
  cite a seção, não o arquivo inteiro. Inclua todo registro cuja decisão a tarefa toca, atualiza
  ou que lastreia a mudança em `docs/*.md`. O que foi decidido em conversa
  entra como fato nas seções, não como "conversa que originou a tarefa".
- **Padrões e convenções aplicáveis**: 3 a 6 regras que **esta** tarefa pode
  violar, cada uma com a fonte. Regra geral deste guia não entra.
- **Escopo**: passos concretos, incluindo os testes automáticos que cobrem o
  comportamento novo. Não repita o discovery nem o plano da alteração — são
  padrão da execução; o escopo diz **o que** mudar, o plano da execução diz
  **como**. Passos de setup ficam aqui, um por item, com ambiente, resultado
  esperado, comando previsto quando conhecido e se é configuração pública.
  "Fora do escopo" é obrigatório.
- **Decisões já tomadas**: registros vigentes que a tarefa **mantém**, com o
  caminho real. Registro que a tarefa muda não entra aqui.
- **Decisões em aberto**: toda decisão prevista traz o encaminhamento e o
  destino do registro. Decisão que altera, reverte ou substitui um registro
  vigente entra como "Muda decisão documentada", com o trecho e a nova
  direção. Registro novo só para decisão genuinamente nova, pelo tipo e
  assunto, **sem número**.
- **Impedimentos específicos**: só o que a matriz não cobre.
- **Arquivos impactados**: código, testes, os `docs/*.md` que a tarefa
  previsivelmente muda e os registros. Nunca `docs/requisitos.md`;
  `docs/setup-*.md` só com passos de setup no escopo.
- **Critérios de aceite**: específicos e verificáveis com evidência — teste,
  trecho de código ou documento, busca, ou verificação visual descrita. Nada
  dos critérios implícitos. Critério sobre registro só quando diz **o que** o
  registro precisa decidir.
- **Validação adicional**: só o que vai além de lint, test e build.

### Conferência da tarefa

- [ ] Seções obrigatórias presentes, com os nomes exatos, na ordem do modelo
      (`Status`, `Objetivo`, depois as demais)
- [ ] Nenhum pré-requisito fora das tarefas anteriores da mesma fase;
      dependência de outra fase está na coluna "Depende de" da fase
- [ ] Nenhuma referência a "conversa" como fonte: o que foi decidido está
      escrito como fato ou registro
- [ ] Nada repete o comportamento padrão
- [ ] Nenhum número de registro novo fixado; registros existentes pelo caminho
      real
- [ ] Toda decisão documentada que a tarefa altera, reverte ou substitui está
      declarada como "Muda decisão documentada"
- [ ] Todo `docs/*.md` em "Arquivos impactados" tem registro que o lastreia
- [ ] `docs/requisitos.md` fora; `docs/setup-*.md` só com passos de setup
- [ ] A tarefa sozinha, na ordem da fase, termina em lint, test e build verdes
- [ ] Cada critério de aceite tem forma concreta de verificação
- [ ] Todo caminho citado existe ou está marcado como "criar"

## Formato do log

`docs/plano/NNNN-nome-da-fase/logs/XXXX-log-nome-da-tarefa.md`. Exemplo real:
`docs/plano/0014-numeracao-dos-extras-fifa/logs/0001-log-fwc-renumerado-de-00-a-19.md`.

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa NNNN-XXXX: [título]

## Data
AAAA-MM-DD

## Resumo
O que foi feito e por quê: o comportamento antes e depois, os módulos e
arquivos alterados e o papel de cada mudança, as divergências encontradas
entre tarefa, documentação e código e como foram resolvidas. Escrito para
quem não acompanhou a execução.

## Discovery
- Código: [módulos, dependências, testes e convenções encontrados; o
  comportamento atual confere com a tarefa? pontos de impacto não citados] |
  não se aplica (sem alteração de código)
- Documentação: [documentos e registros lidos além das referências, e por
  quê] | as referências bastaram

## Plano da alteração
1. [passo — arquivos, testes, registros, docs, setup]
- Verificação prevista dos critérios: [critério → como será verificado]
- Riscos: [...]
- Desvios na execução: nenhum | [o que mudou em relação ao plano e por quê]

## Decisões tomadas
- [decisão] — `docs/<tipo>/NNNN-*.md` (nível do impedimento, se houver)
- decisões sem registro, com o motivo

## Impedimentos
Nenhum | o que ocorreu, o nível, a pergunta, a resposta do humano e como foi
tratado

## Setup realizado
Nenhum | para cada passo, na ordem em que foi executado:

### [n]. [objetivo do passo]
- Ambiente: Firebase | Google Cloud | GitHub | DNS | local
- Confirmação do humano: [data e comando confirmado] | não se aplica
- Comando executado:
  ```
  [comando exato, com segredos como <REDACTED>]
  ```
- Saída relevante: [trecho real]
- Verificação: [comando ou conferência feita e resultado]
- Como reverter: [comando ou passo]
- Documento atualizado: `docs/setup-*.md` § [seção]

## Validação
Saída real de cada comando. Pode encurtar linhas repetitivas de sucesso, mas
mantém os totais e todo aviso e erro.

## Critérios de aceite
- [x] [critério] — evidência
- [ ] [critério] — por que não foi atendido / verificação visual pendente

## Arquivos alterados
- `caminho` — o que mudou

## Correções pós-PR                        (só se houver)
- [data] — [check que falhou], [causa], [correção], commit [SHA]
```
