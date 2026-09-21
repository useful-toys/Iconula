<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0072: Página de estatísticas como vista interna

## Status

Aceito.

## Contexto

- Pedido: uma página scrollável com estatísticas e gráficos sobre o
  estado da coleção, tal como a página principal.
- O [IDR 0007](0007-placar-unico-e-progresso-por-secao.md) rejeitou
  "tela separada de estatísticas" ("mais navegação, contra o
  minimalismo e a tela única"), mantendo a visão geral no cabeçalho e a
  por seção no grupo.
- O app já tem vistas internas sem router
  ([TDR 0020](../tdr/0020-privacidade-como-vista-interna.md)):
  Política, Termos, Sobre e Apoie — cada uma substitui o conteúdo da
  tela, com "← Voltar" no topo.
- `docs/requisitos.md` não prevê § Estatísticas: o pedido é
  funcionalidade nova, o que muda requisito.
- O humano comparou "página principal de dois modos
  (figurinhas/estatísticas)" e "página separada" e escolheu a página
  separada.

## Decisão

- A página de estatísticas é uma **vista interna separada** (padrão do
  TDR 0020), não um modo da página principal e não uma rota nova.
- Substitui o conteúdo da tela por inteiro, com "← Voltar" no topo
  devolvendo para a tela de origem.
- Acesso por um **botão no cabeçalho**, na primeira linha, à esquerda do
  botão compartilhar, no mesmo padrão dos botões desfazer e
  compartilhar (30×30px, borda e ícone em `--gold`, ícone `bar_chart`).
- Uma única página scrollável, como a principal (IDR 0008); somente
  leitura — não ajusta contagens.
- Conteúdo: resumo geral (coladas/faltantes/repetidas/percentual),
  progresso por grupo da Copa (12 grupos + FWC + COC), progresso por
  seção (50 barras), repetidas por seção e histograma de contagens —
  gráficos à mão ([TDR 0030](../tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md)).
- **Cor com o mesmo significado da página principal**, só com tokens que já
  existem (nenhuma cor nova); a cor nunca é o único sinal (IDR 0018):
  - estado — colada `--green-card`, faltante `--muted` (tracejado no
    histograma), repetida `--orange-card`: donut, números do resumo, colunas
    do histograma e códigos repetidos;
  - grupo ([IDR 0045](0045-cores-de-super-grupos.md)) — barra de cada grupo
    na cor de identidade `--group-<x>` (FWC e COC pelos alias);
  - seleção ([IDR 0046](0046-cores-de-selecoes.md)) — barra de cada seção em
    degradê horizontal com as cores da bandeira `--selection-<sigla>-1/2/3`
    (FWC e COC em cor única de grupo) e filete no nome em "Repetidas por
    seção";
  - repetidas no histograma — de 2 em diante, na escala laranja→vermelho do
    selo `×N` ([IDR 0066](0066-gradiente-de-cor-do-selo-conforme-sobrando.md)),
    com contagem − 1 sobrando.

## Consequências

- Reverte a parte "sem tela separada de estatísticas" do IDR 0007; o
  placar do cabeçalho e o progresso por seção permanecem.
- Não introduz "modos" (`requisitos.md` § UX "sem modos") nem router
  (TDR 0020).
- Estatísticas derivadas em memória da coleção já carregada — zero
  leituras novas no Firestore (`requisitos.md` § Requisitos Não
  Funcionais).
- Novo botão no cabeçalho com ícone Material Symbols (`bar_chart`)
  vendorizado como SVG inline (TDR 0026), como desfazer e compartilhar.
- `docs/requisitos.md` ganha § Estatísticas (mudança de requisito
  confirmada pelo humano).
- Implementação: Fase 0037, Tarefas 0037-0002 e 0037-0003.

## Alternativas consideradas

- **Página principal com dois modos (figurinhas/estatísticas)**:
  co-igual, mas obriga a dois cabeçalhos — ordenação, disposição,
  filtro, desfazer, compartilhar e faixa de bandeiras são só do
  catálogo — e esbarra em "sem modos".
- **Bloco no topo da página principal**: sem navegação, mas empurra o
  catálogo para baixo, contra "espaço otimizado para o catálogo"
  (IDR 0018).
- **Rota nova com router**: o app evita router até a árvore exigir
  (TDR 0020).

## Histórico

- 2026-09-21 — Pedido: a página estava monótona, só em `--gold`. Passa a
  colorir donut, números, barras, repetidas e histograma com os tokens de
  estado, grupo e seleção da página principal (ver Decisão). Cor por
  custom property inline (`--cor`), como o selo `×N`; `corDoSelo` extraída
  de `Figurinha.jsx` para `src/lib/corDoSelo.js` para o histograma reusar.
