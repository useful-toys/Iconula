<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0031: Salto para seção ocultada pelo filtro

## Status

Aceito.

## Contexto

- O IDR 0025 decidiu que o filtro de status (todas/faltantes/repetidas)
  oculta seções e super-grupos sem resultado. A faixa de bandeiras do
  IDR 0016 lista sempre as 50 seções, independente do filtro vigente.
- Pendência: o que acontece quando o usuário toca em um ícone da faixa
  cuja seção está oculta pelo filtro? Um toque que não move nada seria
  pior que perder o filtro — a faixa lista as 50 sempre, e o usuário
  espera que o salto funcione.

## Decisão

- Se o filtro vigente oculta a seção alvo, o salto **volta o filtro
  para "todas"** e então rola até a seção
- A faixa lista sempre as 50 seções, independente do filtro
- O comportamento é consistente: tocar em qualquer ícone da faixa
  sempre leva à seção, mesmo que esteja oculta pelo filtro
- O filtro volta para "todas" porque a seção alvo precisa estar visível
  para o salto fazer sentido; manter o filtro e não mover nada quebraria
  a expectativa

## Consequências

- O salto nunca falha: tocar em qualquer ícone da faixa sempre leva à
  seção
- O usuário perde o filtro ativo ao saltar para uma seção oculta, mas
  ganha a navegação consistente
- A implementação é simples: antes de rolar, verificar se a seção está
  visível; se não, limpar o filtro
- Como o filtro só chega na Tarefa 0004-0004, o ponto de extensão fica
  pronto nesta tarefa, mas o comportamento só é ativado quando o filtro
  existe

## Alternativas consideradas

- **Não saltar se a seção estiver oculta**: quebraria a expectativa do
  usuário; a faixa lista as 50, então o usuário espera que todas
  funcionem
- **Mostrar um aviso "seção oculta pelo filtro"**: adiciona
  complexidade sem benefício; o usuário já sabe que filtrou, e perder o
  filtro é menos atrito que não mover nada
- **Manter o filtro e rolar mesmo assim**: a seção continuaria oculta, o
  salto não faria sentido visual
