<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0016-0001]: tokens CSS das cores de seleção

## Status
Pendente

## Objetivo
Criar em `theme.css` os tokens das cores individuais das 48 seleções e dos
dois especiais — base da Tarefa 0002 —, convertendo o hex do IDR 0046 para
OKLCH com contraste ajustado ao tema escuro.

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § Decisão — a tabela hex das 48
  seleções e a hierarquia com o IDR 0045 (FWC `--gold`, COC `--notif-red`)
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — contraste mínimo
  de 3:1 para elementos não textuais
- `src/theme.css` — tokens existentes em OKLCH, incluindo os de grupo da
  Tarefa 0015-0001
- `docs/interface.md` § Identidade visual — onde os tokens passam a ser
  descritos

## Padrões e convenções aplicáveis
- Tokens em OKLCH, como os existentes — `src/theme.css`
- FWC e COC são alias, não cores novas: `--selection-fwc: var(--gold)` e
  `--selection-coc: var(--notif-red)` — IDR 0045 § Especiais
- Contraste ≥ 3:1 (não textual) da cor aplicada contra o fundo do cabeçalho
  de seção — IDR 0042; medir e registrar a medição
- Seleções vizinhas na mesma ordenação continuam distinguíveis entre si

## Escopo e instruções de implementação
1. Converter os 48 hex do IDR 0046 para OKLCH com conversor de verdade — os
   valores são recalculados na execução, não copiados de cabeça — ajustando a
   luminosidade quando o contraste sobre o tema escuro pedir.
2. Acrescentar em `src/theme.css`, sob comentário "Cores de seleção": os 48
   tokens `--selection-alg`…`--selection-uzb` e os alias `--selection-fwc` e
   `--selection-coc`.
3. Medir o contraste de cada cor contra o fundo do cabeçalho de seção
   (`--panel`) e registrar a medição no log.
4. Descrever os tokens em `docs/interface.md` § Identidade visual, citando o
   IDR 0046.

**Fora do escopo**: aplicar as cores no cabeçalho (Tarefa 0002); cores de
grupo (Tarefa 0015-0001).

## Decisões já tomadas (não reabrir)
- A cor de cada seleção e a hierarquia (grupo no título/faixa, seleção no
  cabeçalho de seção) — ver `docs/idr/0046-cores-de-selecoes.md` e
  `docs/idr/0045-cores-de-super-grupos.md`
- Tema escuro único — ver
  `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Identidade visual)

## Critérios de aceite
- [ ] 50 tokens em `theme.css`: 48 cores de seleção + `--selection-fwc` e
      `--selection-coc` como alias de `--gold` e `--notif-red`
- [ ] Conversões OKLCH recalculadas dos hex do IDR 0046
- [ ] Contraste ≥ 3:1 medido e registrado no log
- [ ] `docs/interface.md` § Identidade visual descreve os tokens citando o
      IDR 0046
