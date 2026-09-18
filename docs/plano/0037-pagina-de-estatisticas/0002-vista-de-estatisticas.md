<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0037-0002: Vista de estatísticas com gráficos à mão

## Status
Concluída

## Objetivo
Criar `Estatisticas.jsx` como vista interna (TDR 0020): substitui o conteúdo
da tela, com "← Voltar", e renderiza os cinco blocos da página de
estatísticas com gráficos à mão em SVG/CSS (TDR 0030), somente leitura e
numa única página scrollável.

## Documentos de referência
- `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md` § Decisão —
  a vista, o "← Voltar", a rolagem única e o conteúdo
- `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md` § Decisão —
  barras, donut e histograma em SVG/CSS
- `docs/tdr/0020-privacidade-como-vista-interna.md` § Decisão — padrão de
  vista interna sem router (mesmo molde de Sobre/Apoie)
- `docs/interface.md` § Demais telas › Sobre — o layout de leitura das
  vistas internas (largura máxima ~640px, título 22px dourado, "← Voltar")
- `src/components/ApoieOProjeto.jsx` — exemplo de vista interna a seguir
- `src/lib/estatisticas.js` (gerado pela Tarefa 0037-0001) — os cinco blocos

## Padrões e convenções aplicáveis
- Nenhum componente com rolagem própria; uma única página scrollável
  (IDR 0008)
- Gráficos à mão, sem biblioteca nova (TDR 0030)
- Nome acessível por extenso; cor nunca é o único sinal
  (`docs/requisitos.md` § Requisitos Não Funcionais, IDR 0018)

## Escopo e instruções de implementação
1. Criar `src/components/Estatisticas.jsx` e `Estatisticas.css`: corpo de
   leitura centrado (molde de Sobre/Apoie), título "Estatísticas" e
   "← Voltar" no topo; abaixo, os cinco blocos:
   - resumo geral (números);
   - progresso por grupo da Copa (12 + FWC + COC) em barras horizontais;
   - progresso por seção (50) em barras horizontais finas;
   - repetidas por seção;
   - histograma de contagens.
2. Gráficos à mão: barras em divs com largura proporcional (ou retângulos
   SVG), donut e histograma em SVG simples, com os tokens de `theme.css`.
3. Somente leitura: nenhum controle de ajuste de contagem; sem desfazer nem
   compartilhar dentro da vista.
4. Acessibilidade: cada gráfico acompanhado de números por extenso no nome
   acessível (ex.: "Brasil: 12 de 20 coladas, 8 faltantes"); cor nunca é o
   único sinal.
5. Estado vazio (0/994): zeros e barras vazias, sem mensagem especial
   (`docs/requisitos.md` § Contagem).
6. Criar `src/components/Estatisticas.test.jsx` cobrindo: título e
   "← Voltar", os cinco blocos presentes, coleção vazia e a ausência de
   controles de edição.
7. Atualizar `docs/interface.md` § Demais telas com a subseção
   "Estatísticas" (layout, conteúdo, somente leitura), citando o IDR 0072.

**Fora do escopo**: o botão que abre a vista (Tarefa 0037-0003); a derivação
dos dados (Tarefa 0037-0001); qualquer escrita no Firestore.

## Decisões já tomadas (não reabrir)
- Vista interna, conteúdo e "← Voltar" — ver
  `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md`
- Gráficos à mão — ver
  `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md`
- Vista interna sem router — ver
  `docs/tdr/0020-privacidade-como-vista-interna.md`

## Arquivos impactados
- `src/components/Estatisticas.jsx` — criar
- `src/components/Estatisticas.css` — criar
- `src/components/Estatisticas.test.jsx` — criar
- `docs/interface.md` — modificar (§ Demais telas)

## Critérios de aceite
- [ ] A vista tem título "Estatísticas", "← Voltar" e os cinco blocos
- [ ] Nenhum componente com rolagem própria; a página rola por inteiro
- [ ] Sem dependência de gráfico nova no `package.json`
- [ ] Nome acessível por extenso nos gráficos; cor não é o único sinal
- [ ] `docs/interface.md` § Demais telas descreve a vista, citando o IDR 0072
