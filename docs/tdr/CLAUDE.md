<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR — Technical Decision Record

Decisões **técnicas de implementação interna**: segurança (CSP, headers,
regras do Firestore), build/CI, estrutura de dados e de estado em runtime,
desempenho, convenções de código. Se a decisão é sobre *stack, infra ou
integração externa*, é [ADR](../adr/CLAUDE.md); se é sobre *comportamento
visível ao usuário*, é [IDR](../idr/CLAUDE.md).

## Arquivo

- Caminho: `docs/tdr/NNNN-slug-em-kebab-case.md`.
- `NNNN`: sequencial próprio do TDR, 4 dígitos com zero à esquerda, nunca
  reaproveitado.
- Slug: resumo da decisão em poucas palavras. Se o status final for
  rejeitado ou substituído, inclua isso no slug (ex.:
  `0015-ordenacao-padrao-provisoria-ordem-do-album.md`, substituído).

## Estrutura obrigatória

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR NNNN: Título

## Status

Aceito | Rejeitado | **Substituído pelo [ADR/TDR/IDR NNNN](caminho)**: motivo.

## Contexto

## Decisão

## Consequências

## Alternativas consideradas
```

- `Alternativas consideradas` é opcional só quando não houve alternativa
  real a registrar; na prática está presente na quase totalidade dos TDRs.
- Um TDR substituído **nunca é apagado ou reescrito** — o Status aponta
  para quem o substitui, e o conteúdo original fica intacto como registro
  histórico (ver `0015-*.md`, substituído pelo IDR 0043, mantido na
  íntegra).
- Referencie outras decisões com link relativo:
  `[TDR 0007](0007-slug.md)`, `[IDR 0026](../idr/0026-slug.md)`.

## Estilo de prosa

Objetivo e sucinto, não narrativo:

- **Bullets em vez de parágrafos** sempre que a ideia for uma lista de
  fatos, passos ou opções.
- **Conclusão primeiro**, justificativa depois (ou na mesma linha) — evite
  obrigar quem lê a acompanhar todo o raciocínio antes de saber a decisão.
- Corte conectivos narrativos ("na prática, porém,", "por sua vez", "sem
  uma decisão própria") — se a frase for redividida em bullets, eles somem
  sozinhos.
- Contas/derivações viram passos curtos, não prosa.
- Em `Alternativas consideradas`, cada bullet traz a alternativa **e** o
  motivo da desistência — nunca só o nome da opção. Omita a seção inteira
  quando a decisão não comparou alternativas de verdade; não invente uma
  para preencher.
- Mantenha os fatos e a rastreabilidade (números de tarefa, links) — o
  corte é de forma, não de conteúdo.

## Índice (README.md)

`docs/tdr/README.md` lista todo TDR numa tabela `Nº | Título | Status |
Tags | Resumo` — é a única fonte de tags e resumo (sem front-matter nos
arquivos). Ao criar um TDR ou mudar seu `## Status`, atualize a linha
correspondente **no mesmo commit** (mesmo padrão do
`docs/plano/README.md`). Reaproveite tags já usadas na tabela em vez de
criar sinônimos (ex.: não crie `seguranças` se `seguranca` já existe).
