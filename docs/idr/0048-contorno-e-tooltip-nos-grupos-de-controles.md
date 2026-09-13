<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0048: Contorno e tooltip nos grupos de controles

## Status

Aceito — implementação na Fase 0011 (Tarefas 0011-0001 e 0011-0002).

## Contexto

- No primeiro uso real, os três grupos segmentados da linha de controles
  (ordenação, disposição, filtro) não se liam como grupos de alternância:
  fundo `--panel` sobre `--turf`, sem contorno, quase indistinguível.
- Os rótulos curtos (`Página`, `Falt.`, `Col.`…) são decisão do
  [IDR 0018](0018-usuario-especialista-e-minimalismo.md); a forma por
  extenso existe só no nome acessível de cada opção.
- Um contorno em `--border` sobre `--turf` mede ~1,4:1 — abaixo dos 3:1 do
  WCAG 1.4.11, que valem para componentes e **estados**; o contorno só
  agrupa, e o estado ativo segue marcado por fundo `--gold`.

## Decisão

- **Contorno**: cada grupo segmentado ganha contorno de 1px em `--border`,
  mantendo fundo `--panel` e raio 9px; nenhuma medida dos botões muda
- **Sem exigência de 3:1 no contorno**: é reforço de agrupamento, não
  indicador de estado nem limite de componente interativo
- **Tooltip**: toda opção dos três grupos mostra o próprio nome acessível
  por extenso, como tooltip visual
  - mesma fonte do `aria-label` — nenhum texto novo
  - fora da árvore de acessibilidade: não duplica a leitura do leitor de
    tela
  - **abaixo** do botão (a linha de controles fica no topo, sticky, em tela
    larga — [IDR 0018](0018-usuario-especialista-e-minimalismo.md))
  - aparece no hover depois de ~400ms e na hora no foco por teclado
    (`:focus-visible`)
  - não aparece em toque: o rótulo curto basta, e toque não tem hover
  - nas pontas de cada grupo, alinhado à borda do grupo, sem estourar a
    viewport em celular
  - CSS sobre os tokens existentes (`--panel`, `--cream`, `--border`), sem
    biblioteca nem JS de posicionamento; sem rolagem própria
    ([IDR 0008](0008-uma-unica-pagina-scrollavel.md))

## Consequências

- Os três grupos se leem como grupos sem token novo na paleta
- O especialista mantém os rótulos curtos; quem tem dúvida descobre o
  sentido pelo mouse ou teclado
- Em celular não há tooltip — aceito: é o aparelho do especialista na feira

## Alternativas consideradas

- **Contorno em `--muted`**: passa de 3:1, mas pesa e compete com o ativo
  em `--gold`
- **Token novo de contorno calibrado a 3:1**: cor nova na paleta do
  [IDR 0022](0022-tema-escuro-unico-paleta-do-prototipo.md) para um reforço
  que não é estado
- **Separar grupos só por espaçamento**: não resolve a leitura de "grupo"
  quando os grupos quebram de linha
- **`title` nativo**: zero CSS, mas visual claro do sistema, sem foco por
  teclado e com atraso fixo do navegador
- **Tooltip acima do botão**: sai da tela com a linha de controles no topo
- **Tooltip em toque (toque longo)**: conflita com o toque que alterna a
  opção

## Histórico

- 2026-09-13 — Criado no planejamento revisado das Fases 11–17.
