<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0064: Tooltip do desfazer, com código e operação

## Status

Aceito.

## Contexto

- Pedido do esmiuçamento: o desfazer deve mostrar qual operação será
  desfeita, num tooltip.
- Hoje o botão só tem `aria-label="desfazer a última alteração"` fixo
  ([Controles.jsx:192](../../src/components/Controles.jsx)), sem tooltip
  visual e sem indicar qual figurinha ou operação será revertida.
- O produto já tem o padrão de tooltip CSS puro — sem biblioteca, sem JS
  de posicionamento — usado nos grupos de controles
  ([IDR 0048](0048-contorno-e-tooltip-nos-grupos-de-controles.md)) e nas
  bandeiras da faixa
  ([IDR 0052](0052-tooltip-nas-bandeiras-da-faixa.md)): hover ~400ms,
  foco por teclado na hora, nunca em toque.
- `historico.js` guarda `{codigo, contagemAnterior}` por entrada, não a
  direção do ajuste; a direção (incremento ou decremento) é derivável
  comparando `contagemAnterior` com a contagem atual da figurinha no
  topo do histórico.

## Decisão

- O botão de desfazer ganha o mesmo tooltip visual dos IDR 0048/0052:
  abaixo do botão, hover ~400ms, foco por teclado na hora, nunca em
  toque.
- Conteúdo do tooltip: **código da figurinha e operação**, no formato
  `Desfazer: +1 em BRA05` (incremento) ou `Desfazer: −1 em BRA05`
  (decremento) — sem o nome da seção, mais compacto.
- Sem histórico (botão desabilitado), nenhum tooltip aparece.
- O `aria-label` do botão passa a ser **dinâmico, sincronizado com o
  tooltip** (mesmo texto), em vez do texto fixo atual — paridade entre
  quem usa mouse/teclado e quem usa leitor de tela, como o IDR 0048 já
  faz nos grupos de controles.

## Consequências

- `historico.js` ou quem lê seu topo passa a derivar a direção do
  ajuste (contagem atual − `contagemAnterior`) para compor o texto.
- `Controles.jsx` recebe uma nova prop com o texto do tooltip/aria-label
  do desfazer, computada em `App.jsx` a partir do topo do histórico e da
  coleção atual.
- Acessibilidade ganha paridade: o leitor de tela anuncia o mesmo texto
  do tooltip visual.
- Implementação: Fase 0033, Tarefa 0033-0003.

## Alternativas consideradas

- **Nome da seção + código + operação** (ex. "Desfazer: +1 em Brasil
  BRA05"): mais claro para quem não decora códigos, mas o humano
  preferiu o formato compacto só com código.
- **Só a operação, sem identificar a figurinha** (ex. "Desfazer o último
  incremento"): atenderia ao pedido ao pé da letra, mas não diz qual
  figurinha foi alterada — descartado por ser menos útil.
- **`aria-label` fixo mantido**: menos mudança de código, mas cria
  assimetria entre quem vê o tooltip e quem usa leitor de tela —
  descartado.
