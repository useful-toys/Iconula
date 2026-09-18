<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0037-0003: Ícone e botão no cabeçalho para abrir as estatísticas

## Status
Pendente

## Objetivo
Vendorizar o ícone Material `bar_chart` e acrescentar ao cabeçalho um botão
30×30px (padrão desfazer/compartilhar) que abre a vista de estatísticas,
ligando a Tarefa 0037-0002 ao `App.jsx` — conclui a fatia vertical.

## Documentos de referência
- `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md` § Decisão —
  o botão, sua posição (1ª linha, à esquerda do compartilhar) e o ícone
- `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md` § Decisão —
  o padrão de vendorizar o ícone como SVG inline
- `docs/interface.md` § Cabeçalho — a ordem dos comandos e o padrão de
  30×30px dos botões desfazer/compartilhar (IDR 0018, IDR 0024, IDR 0042)
- `src/components/Cabecalho.jsx` e `src/App.jsx` — onde o botão e o estado
  de vista interna vivem

## Padrões e convenções aplicáveis
- Sem router; vista interna num estado único em `App.jsx` (TDR 0020)
- Sem estado global; prop-drilling (TDR 0014)
- Ícones Material Symbols vendorizados como SVG inline (TDR 0026)

## Escopo e instruções de implementação
1. Adicionar `src/assets/material-bar-chart.svg` (ícone Material Symbols
   `bar_chart`), no mesmo padrão dos demais `material-*.svg`.
2. No `Cabecalho.jsx`, acrescentar um botão de 30×30px com borda e ícone em
   `--gold`, na primeira linha à esquerda do botão compartilhar, com
   `aria-label` "Estatísticas" e área de toque/foco no padrão do IDR 0042;
   recebe o callback que abre a vista.
3. Em `App.jsx`, acrescentar o valor de `vistaInterna` para "estatisticas" e
   montar `Estatisticas.jsx` quando ativa, com "← Voltar" devolvendo à tela
   principal — sem interação com a gravação nem com o Firestore.
4. Atualizar `docs/interface.md` § Cabeçalho com o novo botão (posição e
   ícone), citando o IDR 0072.
5. Estender `src/components/Cabecalho.test.jsx` (e/ou o teste de integração
   de `App.jsx`) cobrindo: o botão renderiza com `aria-label` "Estatísticas"
   e o clique abre a vista.

**Fora do escopo**: o conteúdo da vista (Tarefa 0037-0002); exibir
estatísticas na vista do catálogo compartilhado por link — o botão acompanha
compartilhar/avatar, que somem nessa vista (IDR 0055).

## Decisões já tomadas (não reabrir)
- Botão na 1ª linha, à esquerda do compartilhar, ícone `bar_chart` — ver
  `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md`
- Ícones vendorizados como SVG inline — ver
  `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md`
- Vista interna sem router — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`

## Arquivos impactados
- `src/assets/material-bar-chart.svg` — criar
- `src/components/Cabecalho.jsx` — modificar
- `src/components/Cabecalho.css` — modificar (se o botão exigir estilo)
- `src/components/Cabecalho.test.jsx` — modificar
- `src/App.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho)

## Critérios de aceite
- [ ] Botão 30×30px com `aria-label` "Estatísticas" aparece na 1ª linha, à
      esquerda do compartilhar, e abre a vista ao toque/clique
- [ ] "← Voltar" da vista devolve à tela principal; nenhuma escrita no
      Firestore ao abrir/fechar
- [ ] O botão não aparece na vista do catálogo compartilhado por link
