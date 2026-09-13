<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR — Model Decision Record

Decisões de **modelagem de dados**: schema de persistência, estrutura de
documentos no banco, formato de dados em trânsito (export/import),
transformações e validações de dados, convenções de nomenclatura de
campos e chaves. Se a decisão é sobre *stack, infra ou integração
externa*, é [ADR](../adr/CLAUDE.md); se é sobre *implementação interna
de código* (segurança, build/CI, desempenho, convenções), é
[TDR](../tdr/CLAUDE.md); se é sobre *comportamento visível ao usuário*,
é [IDR](../idr/CLAUDE.md); se é sobre *DevOps* (CI/CD, pipelines, deploy,
branch protection, ferramentas de segurança), é
[DDR](../devops-dr/CLAUDE.md).

## Arquivo

- Caminho: `docs/model-dr/NNNN-slug-em-kebab-case.md`.
- `NNNN`: sequencial próprio do MDR, 4 dígitos com zero à esquerda,
  nunca reaproveitado.
- Slug: resumo da decisão em poucas palavras. Se o status final for
  rejeitado, inclua isso no slug.

## Estrutura obrigatória

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR NNNN: Título

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
  MDRs.
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
  `[MDR 0001](0001-slug.md)`, `[ADR 0005](../adr/0005-persistencia-no-firestore.md)`.

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

`docs/model-dr/README.md` lista todo MDR numa tabela `Nº | Título | Status |
Tags | Resumo` — é a única fonte de tags e resumo (sem front-matter nos
arquivos). Ao criar um MDR ou mudar seu `## Status`, atualize a linha
correspondente **no mesmo commit** (mesmo padrão do
`docs/plano/README.md`). Reaproveite tags já usadas na tabela em vez de
criar sinônimos.
