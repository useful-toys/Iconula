<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0001]: tokens CSS das cores de grupo

## Status
Pendente

## Objetivo
Criar em `theme.css` os tokens das cores de identidade dos 12 grupos da Copa
(A–L) e dos dois especiais — base das Tarefas 0002 e 0003 —, convertendo o hex
do IDR 0045 para OKLCH com contraste ajustado ao tema escuro.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — a tabela hex dos 12
  grupos e os especiais: FWC dourado (`--gold`), COC vermelho (`--notif-red`)
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — contraste mínimo
  de 3:1 para elementos não textuais
- `src/theme.css` — tokens existentes em OKLCH, incluindo `--gold` e
  `--notif-red`
- `docs/interface.md` § Identidade visual — onde os tokens passam a ser
  descritos

## Padrões e convenções aplicáveis
- Tokens em OKLCH, como os existentes (`--turf`, `--gold`) — `src/theme.css`
- FWC e COC são alias, não cores novas: `--group-fwc: var(--gold)` e
  `--group-coc: var(--notif-red)` — IDR 0045 § Especiais
- Contraste ≥ 3:1 (não textual) da cor aplicada contra a superfície onde
  assenta — IDR 0042; medir e registrar a medição
- Cabeçalho de copyright mantido no arquivo — `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. Converter os 12 hex do IDR 0045 para OKLCH com conversor de verdade — os
   valores são recalculados na execução, não copiados de cabeça — ajustando a
   luminosidade quando o contraste sobre o tema escuro pedir.
2. Acrescentar em `src/theme.css`, sob comentário "Cores de grupo": os 12
   tokens `--group-a`…`--group-l` e os alias `--group-fwc` e `--group-coc`.
3. Medir o contraste de cada cor contra a superfície de aplicação (título do
   super-grupo e fundo da faixa de bandeiras) e registrar a medição no log.
4. Descrever os tokens em `docs/interface.md` § Identidade visual, citando o
   IDR 0045.

**Fora do escopo**: aplicar as cores em componentes (Tarefas 0002 e 0003);
cores por seleção (Fase 16).

## Decisões já tomadas (não reabrir)
- As cores de cada grupo e os especiais (FWC `--gold`, COC `--notif-red`) —
  ver `docs/idr/0045-cores-de-super-grupos.md`
- Tema escuro único, sem tema claro — ver
  `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Identidade visual)

## Critérios de aceite
- [ ] 14 tokens em `theme.css`: 12 cores próprias + `--group-fwc` e
      `--group-coc` como alias de `--gold` e `--notif-red`
- [ ] Conversões OKLCH recalculadas dos hex do IDR 0045, mantendo os 12
      grupos distinguíveis entre si
- [ ] Contraste ≥ 3:1 medido e registrado no log
- [ ] `docs/interface.md` § Identidade visual descreve os tokens citando o
      IDR 0045
