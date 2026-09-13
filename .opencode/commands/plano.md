---
description: Planeja novas funcionalidades ou correções com fases, tarefas e integração trunk-based
---

<!-- Copyright (c) 2026 Daniel Felix Ferber -->

Atue como **Principal Software Architect** e **AI Workflow Engineer** neste
repositório (Iconula). Sua entrega é um **Plano de Implementação executável por
um agente de código** — não código.

O plano produzido por este comando se soma ao plano existente em
`docs/plano/README.md` e **não o substitui**: fases e tarefas já concluídas ou
pendentes continuam válidas. O que você produz aqui são **fases novas** que
atendem ao pedido do usuário, numeradas sequencialmente a partir da última fase
existente.

## Entrada

`$ARGUMENTS` traz a descrição do que planejar. Pode ser:
- uma **nova funcionalidade** (ex.: `/plano modo colaborativo de trocas`);
- uma **correção ou ajuste** em funcionalidade já implementada (ex.:
  `/plano corrigir contagem de metalizadas na disposição álbum`);
- um **tema aberto** para análise (ex.: `/plano avaliar virtualização do catálogo`).

Se `$ARGUMENTS` vier vazio, pare e peça ao usuário que descreva o que deseja
planejar.

## Etapa 0 — Leitura obrigatória (leia do disco; nada está anexado)

### Contexto geral do projeto (leia integralmente)
- `AGENTS.md` — convenções que valem para todo o plano
- `docs/requisitos.md` — fonte da verdade de escopo (MVP, futuros, fora de
  escopo)
- `docs/arquitetura.md` — camadas, fluxo, pontos em aberto
- `docs/interface.md` — telas, wireframes, paleta/medidas

### Estado atual do plano e das decisões
- `docs/plano/README.md` — fases existentes, status, pendências alocadas e
  regras que valem em toda tarefa; descubra o **número da última fase** para
  continuar a sequência
- Os índices de decisão — leia apenas os `README.md` de cada pasta para
  descobrir a **última numeração vigente** e os títulos:
  - `docs/adr/README.md`
  - `docs/tdr/README.md`
  - `docs/idr/README.md`
  - `docs/devops-dr/README.md` (se existir)
  - `docs/model-dr/README.md` (se existir)
- Dos registros acima, leia **Status, Decisão e Consequências** (pule Contexto
  e Alternativas, que são justificativa) apenas daqueles que o tema do plano
  toca diretamente — não leia todos

### Referência e ambiente (leia só se o tema do plano tocar)
- `docs/persistencia.md` — se o plano mexe com dados
- `docs/firebase.md`, `docs/gcloud.md`, `docs/github.md`, `docs/registrobr.md`
  — se o plano mexe com deploy, infra ou configuração
- `docs/prototype/Iconula - Álbum de Figurinhas.html` — se o plano tem componente
  visual
- Código atual em `src/` — se o plano propõe componentes, módulos ou regras novas

### Ao final da Etapa 0
Liste em uma linha:
1. o número da última fase no plano e as próximas disponíveis;
2. a última numeração de cada tipo de decisão (ADR, TDR, IDR, DDR, MDR);
3. os registros vigentes que impõem restrição concreta ao plano proposto;
4. os registros que você leu e concluiu que não afetam o plano.

Se ficar sem contexto antes de terminar a leitura, diga isso em vez de planejar
com leitura parcial.

## Etapa 1 — Mapa de fases (PARE AQUI para aprovação humana)

Produza **apenas o conteúdo** que será acrescentado ao `docs/plano/README.md`,
impresso aqui no chat para revisão. **Não crie nem altere nenhum arquivo no
disco ainda.** O conteúdo deve ter:

- tabela de fases novas (número sequencial a partir da última existente, nome,
  objetivo em uma linha, dependências, PR previsto)
- dentro de cada fase, a lista de tarefas com título e uma linha de objetivo
- onde cada pendência ou decisão em aberto foi alocada
- indicação de quais fases já existentes (pendentes) são afetadas pelo plano
  novo, se for o caso

### Regras de fatiamento

1. **Cada fase = um PR mesclável na `main`.** O preview deploy por PR é required
   check e merge na `main` publica em produção: ao fim de toda fase,
   `npm run lint`, `npm run test` e `npm run build` passam e o app continua
   utilizável. Nenhuma fase pode deixar a `main` num estado meio-migrado
   quebrado.
2. **Fatia vertical primeiro.** A primeira fase funcional deve entregar algo
   visível ponta a ponta quando possível; só depois camadas de suporte,
   refinamentos e acabamento.
3. **Alvo: 2 a 6 fases, 2 a 6 tarefas por fase.** Uma tarefa é um commit
   coerente (poucos arquivos, um assunto).
4. **Pendências e decisões em aberto.** Toda tarefa que depende de decisão
   ainda aberta deve nomeá-la e trazer a resolução proposta. Se o plano toca
   pendências listadas no README do plano vigente, aloque-as. Se cria
   pendências novas, registre-as na tabela de pendências.
5. **Requisitos não funcionais entram como critério de aceite, não como nota
   de rodapé**: economia de requisições (nenhuma requisição por figurinha;
   leitura única no login; escrita agregada; mapa esparso), teto de contagem 99
   validado nas regras, tema escuro único, zero scroll dentro de scroll, PT-BR
   e `<html lang="pt-BR">`, acessibilidade (cor nunca é o único sinal; nome
   acessível escreve por extenso a notação compacta).
6. **Convenções do AGENTS.md valem em toda tarefa**: cabeçalho
   `Copyright (c) 2026 Daniel Felix Ferber` em arquivo novo; registrar
   ADR/TDR/IDR/DDR/MDR no momento da decisão, com numeração sequencial a partir
   da última existente; refletir qualquer mudança de build/deploy/Firebase/
   GCloud/GitHub/DNS no `docs/*.md` correspondente no mesmo PR; não introduzir
   router ou estado global antes de a árvore exigir.

### Interação com fases pendentes existentes

Se o plano novo depende de, conflita com, ou estende uma fase pendente
existente (como as Fases 11, 12 ou 13 no momento da escrita deste comando),
diga explicitamente:
- qual fase pendente é afetada;
- se a nova fase deve vir antes, depois ou em paralelo;
- se a fase pendente precisa de ajuste (e qual).

## Etapa 2 — Arquivos de fase e tarefa (só após aprovação explícita)

Nesta etapa, sim, escreva no disco. Para cada fase nova:

1. Crie a pasta `docs/plano/[00NN-nome-da-fase]/` com kebab-case sem acentos.
2. Crie os arquivos de tarefa `docs/plano/[00NN-nome-da-fase]/[000X-nome-da-tarefa].md`.
3. Crie a subpasta `docs/plano/[00NN-nome-da-fase]/logs/` (vazia, o agente
   executor a preenche).
4. Atualize `docs/plano/README.md` acrescentando as novas fases e a tabela de
   pendências.

### Modelo obrigatório de cada tarefa

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [NNNN-XXXX]: [ação descritiva]

## Status
Pendente | Em andamento | Concluída | Bloqueada

## Documentos de referência (ler antes de implementar)
- `caminho/real/do/arquivo.md` § [seção exata] — [o que extrair daqui]
(só caminhos que existem no repositório; cite a seção, não o arquivo inteiro)

## Objetivo
[2 a 4 linhas]

## Padrões e convenções aplicáveis
(lembrete no ponto de uso; em conflito, a fonte citada vence — registre a
divergência no log. Liste 3 a 6 regras que essa tarefa específica pode violar,
cada uma com a fonte citada. Uma tarefa de regras do Firestore e uma tarefa de
componente visual têm blocos diferentes. É proibido encher com regra genérica
que não se aplica àquela tarefa.)

## Escopo e instruções de implementação
[Passo a passo: módulos, formatos de dados, componentes, regras de negócio,
tratamento de erro. Explicite o que está FORA do escopo desta tarefa.]

## Decisões já tomadas (não reabrir)
- [decisão] — ver `docs/{adr,tdr,idr,devops-dr,model-dr}/XXXX-*.md`

## Decisões em aberto nesta tarefa
- [pergunta] — encaminhamento proposto e qual registro (ADR/TDR/IDR/DDR/MDR)
  deve nascer

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR, IDR ou outro DR aplicável** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.

## Arquivos impactados
- `caminho/arquivo` — criar | modificar | remover (se for remover, garanta que
  os imports, testes, estilos e assets órfãos também sejam limpos, e que
  `npm run lint` e `npm run test` continuem passando sem referência residual)

## Critérios de aceite
- [ ] [objetivo e verificável]
- [ ] Registros ADR/TDR/IDR/DDR/MDR criados para as decisões tomadas
- [ ] `docs/plano/[fase]/logs/[XXXX-log-nome].md` gerado

## Validação
Comandos exatos: `npm run lint && npm run test && npm run build`.
Acrescente `npm run test:rules` (exige JDK 21+) quando a tarefa tocar
`firestore.rules`. Quando o critério for visual, descreva a verificação em
`npm run dev` dizendo o que olhar.
```

## Após o planejamento

Este comando entrega o plano pronto para execução. A execução de cada fase
segue o fluxo trunk-based do repositório e fica a cargo de outro agente ou
comando. Resumo do contrato de execução para referência:

- **Uma branch de trabalho por fase**, criada a partir da `main` sincronizada
  (skill `git-remote-sync-guard` + skill `git-branch-name`).
- **Cada tarefa termina num commit válido** (skill `git-commit-message`), com
  `npm run lint && npm run test && npm run build` verdes.
- **Cada fase termina num PR** (skill `git-pull-request-message`), com o
  preview deploy como required check.
- O agente executor escreve o log em `docs/plano/[fase]/logs/` e atualiza o
  status da tarefa e do README **no mesmo commit** do trabalho.

## Restrições desta entrega

- **Na Etapa 1** (mapa de fases): não crie nem altere nenhum arquivo; imprima
  o plano no chat e pare para aprovação.
- **Na Etapa 2** (arquivos): escreva apenas em `docs/plano/` e atualize o
  `docs/plano/README.md`.
- Este comando não executa o plano — apenas o produz.
- Não invente caminhos, números de decisão ou requisitos: se não está na
  documentação, é decisão em aberto e vai para a seção correspondente.
- Não reabra o que já está decidido nos registros vigentes.
- Todo o plano em português do Brasil.
