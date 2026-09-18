<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0037-0001: Derivação pura das estatísticas da coleção

## Status
Concluída

## Objetivo
Criar `src/lib/estatisticas.js` com funções puras que, a partir da coleção
em memória (mapa esparso) e do catálogo, calculam os cinco blocos da página
de estatísticas, sem React e sem tocar o Firestore. Base testável para a
vista da Tarefa 0037-0002.

## Documentos de referência
- `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md` § Decisão —
  o conteúdo dos cinco blocos e a origem (coleção em memória)
- `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md` § Decisão —
  os gráficos são só apresentação; aqui nasce o dado que os alimenta
- `docs/requisitos.md` § Estatísticas — o que a página exibe
- `src/lib/progresso.js` § `calcularPlacar` — reutilizar para o resumo geral
- `src/data/catalogo.js` e `src/data/catalogoOrdenacoes.js` — seções, grupos
  da Copa e a moldura FWC/COC para agrupar

## Padrões e convenções aplicáveis
- Nenhuma leitura ou escrita no Firestore — derivar da coleção já carregada
  (`docs/requisitos.md` § Requisitos Não Funcionais, economia de requisições)
- Funções puras sem React, na camada `src/lib/` (ADR 0007)
- Testes co-localizados (`.test.js`), ADR 0009

## Escopo e instruções de implementação
1. Criar `src/lib/estatisticas.js` com funções puras (assinaturas de nível 1,
   definidas na execução) que recebem a coleção (`Record<código, número>`) e
   as seções/grupos do catálogo e devolvem:
   - resumo geral: coladas, faltantes, repetidas (códigos distintos com
     contagem ≥ 2) e percentual — reaproveitando `calcularPlacar`;
   - progresso por grupo da Copa (A–L) mais FWC e COC: os mesmos números
     sobre os códigos de cada grupo;
   - progresso por seção (50): os mesmos números por seção;
   - repetidas por seção: códigos distintos com contagem ≥ 2 por seção;
   - histograma de contagens: quantos códigos têm 0, 1, 2, 3 e assim por
     diante, agrupando a cauda.
2. Criar `src/lib/estatisticas.test.js` cobrindo: coleção vazia (0/994),
   contagens em cada faixa, limites 0 e 99, e a consistência entre o resumo
   geral e a soma das seções.
3. Uma única passada sobre a coleção quando possível; nenhuma dependência
   nova.

**Fora do escopo**: a vista (`Estatisticas.jsx`) e o botão no cabeçalho —
Tarefas 0037-0002 e 0037-0003; qualquer escrita no Firestore.

## Decisões já tomadas (não reabrir)
- Conteúdo dos cinco blocos — ver
  `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md`
- Gráficos à mão, sem biblioteca — ver
  `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md`
- Repetidas = códigos distintos com contagem ≥ 2 nos títulos; unidades
  sobrando por figurinha — ver
  `docs/idr/0021-selo-conta-unidades-sobrando.md`

## Arquivos impactados
- `src/lib/estatisticas.js` — criar
- `src/lib/estatisticas.test.js` — criar

## Critérios de aceite
- [ ] `estatisticas.js` exporta funções puras para os cinco blocos, sem
      importar React nem o SDK do Firestore
- [ ] `estatisticas.test.js` cobre coleção vazia, limites 0/99 e a
      consistência resumo geral = soma das seções
