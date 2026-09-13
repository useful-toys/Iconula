---
name: opencode-esmiucar
description: Esmiúça um pedido de funcionalidade ou correção antes do planejamento — lê requisitos, interface, arquitetura, plano e registros de decisão, compara com o que já está implementado, propõe e explora com o humano ideias de como a funcionalidade poderia ficar melhor (parceiro de criatividade) e conduz rodadas de perguntas com sugestões para tornar a solução mais eficaz, tirar dúvidas, fechar lacunas, resolver contradições e remover impedimentos; registra cada decisão confirmada (ADR, TDR, IDR, MDR, DDR) numa worktree e branch docs com PR. Carregada pelo comando /esmiucar; use também quando o humano pedir para esmiuçar, detalhar, refinar ou discutir os requisitos de um pedido antes de planejar. Não use para fatiar em tarefas (/planejar) nem para executar.
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# /esmiucar

## Objetivo

Levar `$ARGUMENTS` a um pedido **sem dúvidas, lacunas, contradições nem
impedimentos**, pronto para o `/planejar`: compara o pedido com o que já está
implementado e documentado, **propõe ideias de como a funcionalidade ou o
ajuste poderia ficar melhor** e as explora com o humano, pergunta apresentando
sugestões e **registra cada decisão significativa no momento em que o humano
a confirma**,
tudo numa worktree e branch `docs` com PR. `docs/` é a base de conhecimento e a
base das decisões. **Nunca cria nem altera código-fonte, `docs/*.md` nem
`docs/plano/`**: escreve só nas pastas de decisão (guia § Registro de decisões ›
Decisões no esmiuçamento). As regras estão em `docs/plano/CLAUDE.md` (o guia);
em conflito, o guia vence.

## Entrada

`$ARGUMENTS` = descrição do que esmiuçar: funcionalidade nova (ex.:
`/esmiucar modo colaborativo de trocas`), correção ou ajuste (ex.:
`/esmiucar contagem de metalizadas na disposição álbum`) ou ideia ainda vaga
(ex.: `/esmiucar lembrar o colecionador de trocar repetidas`).

`$ARGUMENTS` vazio → o pedido vem do contexto da conversa (descrição, issue,
trecho colado, discussão anterior); resuma-o numa frase e confirme com o humano
antes do passo 0.

Skill do OpenCode não recebe argumento: `$ARGUMENTS` é o texto que o comando
`.opencode/commands/esmiucar.md` repassa ao carregar esta skill; carregada sem
o comando, é o pedido feito na conversa.

## Leituras obrigatórias

O OpenCode não carrega `CLAUDE.md` de subdiretório: leia cada guia pelo
caminho indicado. Toda leitura e busca é feita na worktree do esmiuçamento
(passo 0), nunca no checkout de onde a skill foi chamada.

**Inteiras:**

1. `docs/plano/CLAUDE.md`.
2. `AGENTS.md`.
3. `docs/requisitos.md` — é a régua do que o produto é e não é.

**Dirigidas** — leia os títulos, busque os termos do pedido e leia só as
seções encontradas:

4. `docs/interface.md` — sempre § Pendências de interface e § Apresentação por
   faixa de tela; outras seções se a busca apontar.
5. `docs/arquitetura.md` — sempre § Pontos em aberto e § Decisões-chave e onde
   vivem; outras seções se a busca apontar.
6. Índices `docs/adr/README.md`, `docs/tdr/README.md`, `docs/idr/README.md`,
   `docs/model-dr/README.md`, `docs/devops-dr/README.md`; dos registros
   encontrados, Status, Decisão, Consequências e Alternativas consideradas; o
   guia `CLAUDE.md` da pasta de cada tipo tocado, inteiro, antes do primeiro
   registro daquele tipo.
7. `docs/plano/README.md` e, das fases e tarefas encontradas, o arquivo da
   tarefa e o log.
8. Só se o tema tocar: `docs/modelo-firebase.md`, `docs/modelo-intercambio.md`,
   `docs/modelo-memoria.md`, `docs/devops.md`, `docs/setup-*.md`,
   `docs/prototype/Iconula - Álbum de Figurinhas.html`, código em `src/`,
   `firestore.rules`.

## Condições de parada

| # | Condição | Ação |
|---|---|---|
| 1 | `$ARGUMENTS` vazio e nada no contexto que seja pedido | PARE: peça a descrição |
| 2 | contexto acabou antes das leituras | PARE: diga o que faltou, não pergunte com leitura parcial |
| 3 | pedido inteiro **já entregue** | PARE: mostre tarefa, log e código; pergunte se há algo a mudar no que existe |
| 4 | pedido **contraria requisito** e o humano mantém o pedido | PARE essa parte: `docs/requisitos.md` só é alterado pelo humano, fora da skill |
| 5 | resposta ambígua, ou "Outro" que não decide | pergunte de novo, mais estreito; nunca registre interpretação própria |
| 6 | branch ou worktree com o nome do esmiuçamento já existe | pergunte se reaproveita |
| 7 | `.worktrees/` não está no ignore | PARE: avise |
| 8 | vontade de escrever tarefa, fase, código, teste, estilo, configuração ou `docs/*.md` | não escreva: vai para o resumo, e o `/planejar` e a tarefa fazem |
| 9 | `git status --short` com arquivo fora das pastas de decisão | desfaça esse arquivo antes do commit |
| 10 | nenhuma decisão registrada no fim | ofereça remover a worktree e a branch (nada foi gravado) |

## Passos

### 0. Worktree do esmiuçamento — antes das leituras

1. Sincronize a `main` — guia § Convenções de Git › Sincronização.
2. Branch — guia § Convenções de Git › Branch: tipo `docs`; nome pelo pedido; **sem sufixo**, porque o
   esmiuçamento não cria fase.
3. `git worktree add .worktrees/<diretório> -b <branch> origin/main`, a partir
   da `origin/main` e nunca da branch atual; daqui em diante, todo comando,
   leitura, busca e arquivo dentro da worktree (caminho absoluto).

### 1. Entender e comparar com o existente

1. Busque os termos do pedido (telas, componentes, campos, regras,
   comportamentos, sinônimos do glossário de `docs/requisitos.md`) em:
   `docs/requisitos.md`, `docs/interface.md`, `docs/arquitetura.md`, modelos;
   índices e registros de decisão, incluindo Alternativas consideradas e
   Histórico; tarefas e logs de `docs/plano/`; código em `src/` e
   `firestore.rules`.
2. Classifique cada parte do pedido, com evidência (caminho e trecho) — mesma
   tabela do `/planejar` § Verificar novidade: novo, já entregue, já planejado,
   muda o que já foi feito, contraria requisito.
3. Para cada parte, anote o que já existe e pode ser **reaproveitado ou
   estendido**: componente, módulo de `src/lib/`, derivação de `src/data/`,
   padrão de interação vigente (IDR), token de `src/theme.css`, fluxo de
   gravação agregada, aviso, desfazer, preferência de vista.
4. Imprima no chat, curto: o pedido em uma frase; classificação com evidência;
   o que já existe e se aproveita; registros e requisitos que restringem.

### 2. Explorar ideias — parceiro criativo

Antes de fechar o pedido, imagine como ele poderia ficar **melhor** para o
colecionador — não só como fazer o que foi pedido. A skill é parceira de
criatividade: propõe, desenvolve e critica ideias junto com o humano.

1. Gere de 3 a 6 ideias, variando a ousadia:

   | Tipo | O que propõe |
   |---|---|
   | Refinamento | o mesmo pedido mais bem acabado: menos toques, feedback mais claro, atalho, estado vazio útil, texto melhor |
   | Variação | outra forma de atingir o mesmo objetivo, às vezes mais simples ou mais barata |
   | Extensão | passo vizinho que o pedido torna fácil ou natural: o que o colecionador faz logo antes ou logo depois |
   | Reenquadramento | o problema por trás do pedido e uma solução diferente para ele |
   | Ousada | vai além do escopo atual; marcada como tal |

2. Cada ideia, em poucas linhas:
   - nome curto e como seria na tela ou no fluxo (esboço textual quando
     ajudar);
   - que necessidade do colecionador atende;
   - o que já existe e ela aproveita;
   - custo relativo: baixo, médio ou alto;
   - o que ela contraria ou onde esbarra — requisito, registro vigente,
     alternativa recusada, requisito não funcional —, com evidência.
3. Fundamente as ideias no produto, não em gosto genérico:
   `docs/requisitos.md` § O que é, § Diferenciais, § Conceitos fundamentais e
   § Requisitos futuros; o perfil de usuário especialista e o minimalismo
   (`docs/idr/0018-usuario-especialista-e-minimalismo.md`); os padrões de
   interação vigentes; o protótipo. Ideia contra § Fora de Escopo pode
   aparecer, marcada "fora de escopo": só o humano muda requisitos.
4. Imprima as ideias no chat e pergunte, em múltipla escolha, quais explorar;
   nenhuma escolhida → siga com o pedido original.
5. Cada ideia escolhida é desenvolvida em conversa — variações, combinações
   entre ideias, riscos, detalhes — até o humano dizer se ela **entra no
   pedido**, fica **guardada para depois** ou é **descartada**. A que entra
   passa pelos passos seguintes como parte do pedido; as guardadas vão ao
   resumo.
6. O humano pode trazer ideias próprias a qualquer momento: desenvolva-as do
   mesmo jeito, com entusiasmo e crítica honesta (custo, riscos, conflito com
   o existente), sem descartar por fugirem do pedido inicial.
7. Nas rodadas de perguntas (passo 4), quando uma resposta abrir espaço para
   algo melhor, proponha a ideia na hora, marcada como ideia.

### 3. Pauta de questões — sem perguntar ainda

Levante as questões por categoria, cada uma com evidência:

| Categoria | O que procurar |
|---|---|
| Impedimento | depende de algo inexistente; exige setup ou configuração pública, custo em cota ou ação irreversível; fase `Pendente` ou `Em andamento` com PR aberto na mesma área; esbarra em requisito não funcional (leituras por login, escrita agregada, mapa esparso, sem rolagem própria) |
| Contradição | pedido × `docs/requisitos.md` (inclusive § Fora de Escopo); pedido × registro vigente ou alternativa já recusada; documento × documento; documento × código |
| Dúvida | termo ou comportamento do pedido com mais de uma leitura; escopo impreciso (onde, quando, para quem) |
| Lacuna | o que o pedido não diz e a implementação terá de decidir: estados (vazio, carregando, falha, sem sessão), faixas de tela, toque × ponteiro, acessibilidade e nome acessível, texto visível, persistência e sincronização, desfazer, export/import, filtro e ordenações vigentes, disposição álbum, desempenho com 994 figurinhas, testes |
| Sugestão | forma mais eficaz: reaproveitar o que existe (passo 1.3), alinhar a padrão vigente, simplificar, cortar escopo que não paga o custo, menor custo em cota, alternativa que evita decisão nova |

- **Decisão de interface visível (layout, interação, navegação) e de dados é
  fechada aqui ou no `/planejar`**, nunca deixada para a tarefa.
- Detalhe de nível 1 ou 2 (guia § Registro de decisões › Quem registra) não
  vira pergunta: vai ao resumo como orientação para a tarefa.
- Ordem da pauta: impedimentos e contradições com requisitos primeiro (podem
  derrubar ou mudar o pedido); depois dúvidas de escopo; lacunas; sugestões.
- Imprima a pauta no chat: categoria e questão em uma linha cada.

### 4. Rodadas de perguntas

1. Pergunte com a ferramenta `question`: uma rodada = um assunto, até 4
   questões relacionadas.
2. Cada questão:
   - pergunta objetiva que cita a evidência (caminho § seção, registro ou
     arquivo de código);
   - 2 a 4 opções; a recomendada primeiro, com "(Recomendado)" no rótulo;
   - na descrição de cada opção: o que muda, prós e contras, e o que já existe
     e ela aproveita ou contraria;
   - quando comparar layouts, textos visíveis ou formatos de dados, um esboço
     curto de cada opção na mensagem, antes da pergunta.
3. Depois de cada rodada, classifique cada resposta:

   | Resposta | Tratamento |
   |---|---|
   | decisão significativa | passo 5, antes da próxima rodada |
   | ideia nova, do humano ou aberta pela resposta | desenvolva como no passo 2.5 antes de seguir |
   | orientação de nível 1 ou 2, ou esclarecimento sem decisão | anote para o resumo |
   | "decida você" ou equivalente | aplique a recomendada, diga isso na hora e trate como confirmada |
   | adiada pelo humano | anote como questão em aberto no resumo |
   | mantém contradição com requisito | condição 4 |
   | ambígua | condição 5 |

4. Cada resposta pode abrir questões novas (lacuna revelada, efeito em outra
   área): acrescente à pauta, na ordem da categoria.
5. Siga até a pauta esvaziar ou o humano encerrar. A cada 3 rodadas, mostre
   a pauta restante em uma linha por questão.

### 5. Registrar a decisão — na confirmação

1. Tipo pelo guia § Registro de decisões › Como registrar; leia o guia da
   pasta antes do primeiro registro daquele tipo.
2. Assunto já tem registro (índice e busca do passo 1) → **atualize o próprio
   registro**, com a decisão anterior em `## Histórico`; senão, registro novo
   com número = último da pasta + 1.
3. Conteúdo, no estilo do guia da pasta:
   - Contexto: o pedido, a evidência que levou à questão, o que já existia;
   - Decisão: a opção confirmada, com os detalhes dados na resposta;
   - Consequências: efeitos em código, `docs/*.md` e requisitos não
     funcionais, e a linha `Implementação: a planejar (/planejar).`;
   - Alternativas consideradas: as opções não escolhidas, cada uma com o
     motivo da desistência dado ou aceito pelo humano;
   - Histórico (se atualização): data, "esmiuçamento", o que mudou e por quê,
     "implementação a planejar".
4. Sugestão significativa recusada pelo humano → registro com Status
   `Rejeitado` só se o humano confirmar que vale registrar.
5. Linha do índice `docs/<tipo>/README.md`, reaproveitando tags existentes.
6. Mostre no chat o caminho e a Decisão em até 3 linhas; correção pedida pelo
   humano é aplicada no mesmo registro. Sem commit por decisão.

### 6. Fechar e entregar

1. Imprima o **resumo esmiuçado** — é a entrada do `/planejar`:
   - pedido refinado: o que entra e o que fica fora;
   - classificação e comparação com o existente (o que se reaproveita);
   - ideias incorporadas ao pedido; ideias guardadas para depois (as fora
     do escopo como candidatas a § Requisitos futuros, que cabem ao
     humano); ideias descartadas, com o motivo;
   - decisões registradas: caminho e decisão em uma linha;
   - orientações de nível 1 ou 2 e esclarecimentos;
   - pontos que dependem de evidência da execução (medição), com alternativas;
   - setup ou configuração pública prevista;
   - questões em aberto e mudanças de `docs/requisitos.md` que cabem ao humano.
2. Nada registrado → condição 10.
3. Sincronize a branch com a `main` — guia § Convenções de Git ›
   Sincronização.
4. Confira `git status --short`: só `docs/adr`, `docs/tdr`, `docs/idr`,
   `docs/model-dr`, `docs/devops-dr` — condição 9.
5. Um commit — mensagem pelo guia § Convenções de Git › Commit.
6. Mostre os arquivos e pergunte se abre o PR.
7. Autorizado → renumere registros que colidem (guia § Convenções de Git ›
   Renumeração); `git push -u origin <branch>`; PR — guia
   § Convenções de Git › PR —,
   label `documentation`, descrição com o resumo esmiuçado inteiro (e a
   renumeração).

## Saída

- Passo 1: comparação com o existente; passo 2: as ideias e a exploração
  com o humano; passo 3: a pauta.
- Passo 4: as rodadas de perguntas; passo 5: cada registro gravado.
- Passo 6: resumo esmiuçado, commit, URL do PR (se aberto) e o lembrete:
  `/planejar` depois do merge do PR, citando o PR como descrição do pedido.

## Proibições

- Ler, buscar ou gravar fora da worktree do esmiuçamento; criá-la a partir de
  outra base que não a `origin/main`.
- Criar, alterar ou remover código-fonte, testes, estilos, configuração,
  `firestore.rules`, workflows, assets, `docs/plano/` ou qualquer `docs/*.md` —
  só as pastas de decisão e seus índices.
- Alterar `docs/requisitos.md`, mesmo com a concordância do humano.
- Registrar decisão não confirmada pelo humano, interpretação de resposta
  ambígua ou recomendação sem o "decida você".
- Registro novo "substituído por" ou para "revisar" outro; reabrir decisão
  vigente sem mostrar o registro e o trecho que muda.
- Apresentar ideia como decisão, ou registrá-la sem o humano a incorporar e
  confirmar; esconder ideia só porque foge do pedido — mostre e marque.
- Perguntar sem evidência, sem opções ou sem recomendação; perguntar o que o
  `docs/` ou o código já respondem.
- Inventar caminho, número de decisão ou requisito.
- Fatiar em fases e tarefas — isso é o `/planejar`.
- Merge ou auto-merge.
- Texto fora do português do Brasil.
