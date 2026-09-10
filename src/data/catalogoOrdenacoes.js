// Copyright (c) 2026 Daniel Felix Ferber
//
// Derivações de ordenação e agrupamento do catálogo. Funções puras que
// transformam o array de seções (src/data/catalogo.js) em estruturas
// prontas para a tela: a sequência de seções em cada ordenação e o
// agrupamento em super-grupos A–L.
//
// A decisão de colocar estas derivações em src/data/ (e não em src/lib/)
// está registrada em
// [TDR 0012](../../docs/tdr/0012-derivacoes-do-catalogo-em-src-data.md).

/**
 * Ordenação alfabética pela sigla: FWC abre, COC fecha, 48 seleções no
 * meio em ordem alfabética de sigla (ARG, AUS, AUT, …). Sem super-grupos
 * (IDR 0028).
 *
 * @param {import("./catalogo.js").secoes} secoesDoCatalogo
 * @returns {Array} Array de 50 seções na ordem por sigla.
 */
export function ordenarPorSigla(secoesDoCatalogo) {
  const fwc = secoesDoCatalogo.find((s) => s.sigla === "FWC");
  const coc = secoesDoCatalogo.find((s) => s.sigla === "COC");
  const selecoes = secoesDoCatalogo.filter((s) => s.tipo === "selecao");
  const ordenadas = [...selecoes].sort((a, b) => a.sigla.localeCompare(b.sigla));
  return [fwc, ...ordenadas, coc];
}

/**
 * Ordenação por página do álbum: FWC abre, COC fecha, 12 super-grupos
 * A–L no meio, cada um com suas 4 seleções na ordem das páginas
 * (IDR 0028, IDR 0019).
 *
 * Retorna um array de itens, onde cada item é:
 * - `{ tipo: "secao", secao }` para FWC e COC
 * - `{ tipo: "super-grupo", grupo, secoes }` para os 12 grupos da Copa
 *
 * A ordem dos super-grupos é A–L (do grupo A, páginas 8–15, ao grupo L,
 * páginas 98–105). Dentro de cada super-grupo, as seleções estão na
 * ordem das páginas (a que começa na página menor vem primeiro).
 *
 * @param {import("./catalogo.js").secoes} secoesDoCatalogo
 * @returns {Array} Array estruturado com FWC, 12 super-grupos e COC.
 */
export function ordenarPorPagina(secoesDoCatalogo) {
  const fwc = secoesDoCatalogo.find((s) => s.sigla === "FWC");
  const coc = secoesDoCatalogo.find((s) => s.sigla === "COC");
  const selecoes = secoesDoCatalogo.filter((s) => s.tipo === "selecao");

  const grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const superGrupos = grupos.map((grupo) => {
    const selecoesDoGrupo = selecoes
      .filter((s) => s.grupo === grupo)
      .sort((a, b) => a.paginas[0] - b.paginas[0]);
    return { tipo: "super-grupo", grupo, secoes: selecoesDoGrupo };
  });

  return [
    { tipo: "secao", secao: fwc },
    ...superGrupos,
    { tipo: "secao", secao: coc },
  ];
}

/**
 * Extrai todas as seções de uma ordenação, independente da estrutura.
 * Útil para testes de invariantes que precisam comparar as duas
 * ordenações.
 *
 * @param {Array} ordenacao Resultado de `ordenarPorSigla` ou `ordenarPorPagina`.
 * @returns {Array} Array de 50 seções.
 */
export function extrairSecoes(ordenacao) {
  const secoes = [];
  for (const item of ordenacao) {
    if (item.tipo === "secao") {
      secoes.push(item.secao);
    } else if (item.tipo === "super-grupo") {
      secoes.push(...item.secoes);
    } else {
      secoes.push(item);
    }
  }
  return secoes;
}
