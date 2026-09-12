<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR — DevOps Decision Record

Decisões de **DevOps**: CI/CD, pipelines, deploy, branch protection,
ferramentas de segurança do repositório, gestão de secrets, ambientes de
homologação e produção. Se a decisão é sobre *arquitetura de software*
(stack, integrações externas), é [ADR](../adr/CLAUDE.md); se é sobre
*implementação interna de código* (CSP, lint, testes), é
[TDR](../tdr/CLAUDE.md); se é sobre *modelagem de dados*, é
[MDR](../mdr/CLAUDE.md).

## Arquivo

- Caminho: `docs/devops-dr/NNNN-slug-em-kebab-case.md`.
- `NNNN`: sequencial próprio do DDR, 4 dígitos com zero à esquerda,
  nunca reaproveitado.
- Slug: resumo da decisão em poucas palavras. Se o status final for
  rejeitado, inclua isso no slug.

## Estrutura obrigatória

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR NNNN: Título

## Status

Aceito | Rejeitado.

## Contexto

## Decisão

## Consequências

## Alternativas consideradas

## Histórico
```

- `Alternativas consideradas` é opcional só quando não houve alternativa
  real a registrar; na prática está presente na quase totalidade dos
  DDRs.
- Um documento de decisão é **vivo**: quando a decisão muda, atualize o
  mesmo documento (Contexto, Decisão, Consequências) em vez de criar um
  novo. Não use "substituído por".
- A decisão anterior vai para `## Histórico`, com a data (ou referência
  de commit) e um resumo do que mudou e por quê — da entrada mais
  recente para a mais antiga.
- Antes de criar um novo documento, **consulte os existentes** no mesmo
  diretório. Se o tópico já foi decidido, atualize o documento
  existente. Só crie documento novo para decisão genuinamente nova.
- Referencie outras decisões com link relativo:
  `[DDR 0001](0001-slug.md)`, `[ADR 0003](../adr/0003-slug.md)`.

## Estilo de prosa

Objetivo e sucinto, não narrativo:

- **Bullets em vez de parágrafos** sempre que a ideia for uma lista de
  fatos, passos ou opções.
- **Conclusão primeiro**, justificativa depois (ou na mesma linha) —
  evite obrigar quem lê a acompanhar todo o raciocínio antes de saber a
  decisão.
- Corte conectivos narrativos ("na prática, porém,", "por sua vez",
  "sem uma decisão própria") — se a frase for redividida em bullets,
  eles somam sozinhos.
- Contas/derivações viram passos curtos, não prosa.
- Em `Alternativas consideradas`, cada bullet traz a alternativa **e** o
  motivo da desistência — nunca só o nome da opção. Omita a seção
  inteira quando a decisão não comparou alternativas de verdade; não
  invente uma para preencher.
- Mantenha os fatos e a rastreabilidade (números de tarefa, links) — o
  corte é de forma, não de conteúdo.

## Índice (README.md)

`docs/devops-dr/README.md` lista todo DDR numa tabela `Nº | Título |
Status | Tags | Resumo` — é a única fonte de tags e resumo (sem
front-matter nos arquivos). Ao criar um DDR ou mudar seu
`## Status`, atualize a linha correspondente **no mesmo commit** (mesmo
padrão do `docs/plano/README.md`). Reaproveite tags já usadas na tabela
em vez de criar sinônimos.
