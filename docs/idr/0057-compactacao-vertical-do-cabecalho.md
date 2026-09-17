<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0057: Compactação vertical do cabeçalho

## Status

Aceito.

## Contexto

- O cabeçalho sticky concentra título, controles e a faixa de bandeiras
  ([IDR 0018](0018-usuario-especialista-e-minimalismo.md)). As medidas
  vigentes deixam um vão escuro generoso entre a faixa e a primeira seção
  do catálogo, e respiro grande entre os controles e as bandeiras.
- O humano apontou a região das bandeiras como o maior "desperdício"
  vertical da interface e pediu para apertá-la: vão inferior ~70% menor e
  margem superior à metade, sem confusão visual.

## Decisão

- `.cabecalho` — `padding-top` `12px → 8px`; `padding-bottom` `10px → 2px`
- `.cabecalho` — `gap` entre linhas (row-gap) `8px → 4px`
- Faixa de bandeiras (trilha) — `padding` topo/baixo `8px → 4px`
- Corpo — `padding-top` `20px → 4px` (o vão entre o cabeçalho e a primeira
  seção)

Resultado: controles → bandeiras `16px → 8px`; bandeiras → primeira seção
`39px → 11px` (~70% menos).

## Consequências

- `interface.md` § Medidas (cabeçalho, faixa, corpo) muda;
  `Cabecalho.css`, `FaixaDeSecoes.css` e `--body-padding` em `theme.css`
  mudam.
- O sticky no celular fica mais baixo, devolvendo parte da altura que o
  [IDR 0018](0018-usuario-especialista-e-minimalismo.md) aceitou gastar.
- Implementação: Fase 0029, Tarefa 0029-0002.

## Alternativas consideradas

- **Compactação menor** (ex.: corpo topo 6px, `padding-bottom` 4px): menos
  agressiva; o humano preferiu apertar mais.
- **Manter o vão**: preserva o respiro, mas o humano considerou desperdício
  vertical na região das bandeiras.
