<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0030: Gráficos de estatísticas à mão em SVG/CSS, sem biblioteca

## Status

Aceito.

## Contexto

- A página de estatísticas ([IDR 0072](../idr/0072-pagina-de-estatisticas-como-vista-interna.md))
  precisa de gráficos: resumo geral, barras por grupo e por seção e
  histograma de contagens.
- Não há biblioteca de gráficos no `package.json`; o app evita
  dependências que pesam no bundle (SDK do Firestore carregado sob
  demanda — ADR 0005; sem biblioteca de virtualização — TDR 0021).
- Os gráficos são barras, donut e histograma — formas simples, sem
  interatividade nem animação exigida.

## Decisão

- Gráficos desenhados **à mão em SVG/CSS**, sem nova dependência.
- Barras horizontais em divs com largura proporcional (ou retângulos
  SVG); donut e histograma em SVG simples.

## Consequências

- Zero peso adicional no bundle; casamento visual com o tema (`theme.css`).
- Sem tooltip/animação prontos — desnecessários para o uso.
- Cada gráfico é um bloco da vista, testável por unidade.
- Implementação: a planejar (/planejar).

## Alternativas consideradas

- **Biblioteca (recharts/chart.js/visx)**: tooltips e animações prontos,
  mas adiciona dezenas a centenas de KB e é desproporcional para barras
  e histograma simples.
- **Canvas à mão**: mais código e menos acessível que SVG/CSS, sem ganho
  para formas retangulares.
