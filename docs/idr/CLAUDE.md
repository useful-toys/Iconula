<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR — Interface Decision Record

Decisões de **interface e experiência do usuário**: comportamento visível,
interação, layout responsivo, feedback visual, textos e estados da UI. Se a
decisão é sobre *stack, infra ou integração externa*, é
[ADR](../adr/CLAUDE.md); se é sobre *implementação interna* (segurança,
build/CI, estrutura de dados/estado, desempenho), é
[TDR](../tdr/CLAUDE.md).

## Arquivo

- Caminho: `docs/idr/NNNN-slug-em-kebab-case.md`.
- `NNNN`: sequencial próprio do IDR, 4 dígitos com zero à esquerda, nunca
  reaproveitado.
- Slug: resumo da decisão em poucas palavras. Se o status final for
  rejeitado ou substituído, inclua isso no slug (ex.:
  `0004-rejeitado-ir-para-secao-e-salto-de-navegacao.md`).

## Estrutura obrigatória

```markdown
<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR NNNN: Título

## Status

Aceito | Rejeitado | **Substituído pelo [ADR/TDR/IDR NNNN](caminho)**: motivo.

## Contexto

## Decisão

## Consequências

## Alternativas consideradas
```

- `Alternativas consideradas` é opcional só quando não houve alternativa
  real a registrar; na prática está presente na quase totalidade dos IDRs.
- Um IDR substituído **nunca é apagado ou reescrito** — o Status aponta
  para quem o substitui, e o conteúdo original fica intacto como registro
  histórico.
- Referencie outras decisões com link relativo:
  `[IDR 0026](0026-slug.md)`, `[TDR 0015](../tdr/0015-slug.md)`.

## Estilo de prosa

Objetivo e sucinto, não narrativo:

- **Bullets em vez de parágrafos** sempre que a ideia for uma lista de
  fatos, passos ou opções.
- **Conclusão primeiro**, justificativa depois (ou na mesma linha) — evite
  obrigar quem lê a acompanhar todo o raciocínio antes de saber a decisão.
- Corte conectivos narrativos ("na prática, porém,", "por sua vez", "sem
  uma decisão própria") — se a frase for redividida em bullets, eles somem
  sozinhos.
- Contas/derivações (ex.: breakpoints, medidas) viram passos curtos, não
  prosa (ex.: `226 + 20 + 226 = 472px`, não uma frase explicando a soma).
- Em `Alternativas consideradas`, cada bullet traz a alternativa **e** o
  motivo da desistência — nunca só o nome da opção. Omita a seção inteira
  quando a decisão não comparou alternativas de verdade; não invente uma
  para preencher.
- Mantenha os fatos e a rastreabilidade (números de tarefa, links) — o
  corte é de forma, não de conteúdo.

## Índice (README.md)

`docs/idr/README.md` lista todo IDR numa tabela `Nº | Título | Status |
Tags | Resumo` — é a única fonte de tags e resumo (sem front-matter nos
arquivos). Ao criar um IDR ou mudar seu `## Status`, atualize a linha
correspondente **no mesmo commit** (mesmo padrão do
`docs/plano/README.md`). Reaproveite tags já usadas na tabela em vez de
criar sinônimos (ex.: não crie `disposicoes` se `disposicao` já existe).
