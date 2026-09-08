<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0011: Faltantes por seção no cabeçalho do grupo

## Status

Aceito.

## Contexto

requisitos.md exige "os mesmos números" no progresso por seção — total,
coladas, faltantes e repetidas —, mas o cabeçalho de grupo desenhado em
interface.md exibia apenas "12/20 · 3 repetidas". O
[IDR 0007](0007-placar-unico-e-progresso-por-secao.md) havia decidido
"total, coladas e repetidas", com faltantes apenas derivado (total −
coladas) — embora suas consequências já falassem em exibi-lo junto. O
conflito req × interface precisava de uma das partes ceder.

## Decisão

- O cabeçalho de cada grupo exibe também os faltantes da seção:
  "12/20 · 8 faltantes · 3 repetidas"
- requisitos.md permanece como está ("os mesmos números" por seção);
  interface.md se ajusta a ele

## Consequências

- Requisito e interface ficam alinhados, sem flexão da fonte de verdade
- Faltantes por seção é o número que guia a troca ("o que te falta do
  Brasil?") — visível sem derivação de cabeça
- O cabeçalho de grupo fica mais denso; aceito

## Alternativas consideradas

- **Requisito ceder** (por seção exibir só total, coladas e repetidas):
  faltantes ficaria derivável (20 − 12), porém invisível
- **Trocar repetidas por faltantes**: perderia as repetidas por seção,
  também úteis na troca
