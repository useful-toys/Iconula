// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Estado da coleção em memória: mapa esparso de código → contagem.
 *
 * Chave ausente significa contagem 0. O formato espelha o schema que será
 * persistido no Firestore (ADR 0008), mas sem escrita de zeros.
 */

const MIN = 0;
const MAX = 99;

/**
 * Retorna a contagem de uma figurinha, tratando chave ausente como 0.
 *
 * @param {Record<string, number>} colecao
 * @param {string} codigo
 * @returns {number}
 */
export function obterContagem(colecao, codigo) {
  return colecao[codigo] ?? 0;
}

/**
 * Aplica um delta à contagem de uma figurinha, respeitando o piso de 0 e
 * o teto de 99. Remove a chave ao chegar em 0, mantendo o mapa esparso.
 *
 * @param {Record<string, number>} colecao
 * @param {string} codigo
 * @param {number} delta - +1 para incrementar, -1 para decrementar.
 * @returns {Record<string, number>} nova coleção (sem mutar a original).
 */
export function ajustarContagem(colecao, codigo, delta) {
  const atual = obterContagem(colecao, codigo);
  const nova = Math.min(MAX, Math.max(MIN, atual + delta));

  if (nova === 0) {
    const { [codigo]: _, ...restante } = colecao;
    return restante;
  }

  return { ...colecao, [codigo]: nova };
}
