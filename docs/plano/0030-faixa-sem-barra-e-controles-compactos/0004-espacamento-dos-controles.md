<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0030-0004]: espaçamento dos controles

## Status
Pendente

## Objetivo
Compactar os controles: `padding` do botão `5px 12px → 4px 10px`, `gap` entre
os grupos `8px → 6px`, e extensão de toque `::before` (`inset: -4px`) nos
botões do segmentado em `pointer: coarse`, no padrão do desfazer (IDR 0042),
para o alvo não encolher junto com o `padding`.

## Documentos de referência
- `docs/idr/0059-rotulos-compactos-dos-controles.md` § Decisão — o
  espaçamento.
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — a extensão `::before` em
  `pointer: coarse`.
- `docs/interface.md` § Medidas — "item 5px 12px em 12px/600".

## Padrões e convenções aplicáveis
- Área de toque ampliada sem crescer visualmente — IDR 0042.
- `interface.md` § Medidas no estado atual.

## Escopo e instruções de implementação
1. Em `Controles.css`: `.controles__opcao` `padding: 5px 12px → 4px 10px`;
   `.controles` `gap: 8px → 6px`.
2. Em `@media (pointer: coarse)`, `::before` com `inset: -4px` nos botões do
   segmentado (como o desfazer).
3. Atualizar `interface.md` § Medidas.

**Fora do escopo**: os ícones/rótulos (Tarefa 0030-0003); o feedback (Tarefa
0030-0005).

## Decisões já tomadas (não reabrir)
- Padding, gap e extensão de toque — ver
  `docs/idr/0059-rotulos-compactos-dos-controles.md`.

## Arquivos impactados
- `src/components/Controles.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.controles__opcao` com `padding: 4px 10px`; `.controles` com `gap: 6px`.
- [ ] Em `pointer: coarse`, `::before { inset: -4px }` nos botões do
      segmentado.
- [ ] `npm run lint && npm run test && npm run build` verdes.
