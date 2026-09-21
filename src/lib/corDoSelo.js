// Copyright (c) 2026 Daniel Felix Ferber

// Gradiente de cor do selo `×N` (IDR 0066): laranja de referência com 1
// sobrando e vermelho de referência saturado a partir de 10 sobrando
// (cores do IDR 0054). Só o canal verde varia entre as duas pontas.
const COR_SELO_INICIO = [0xd8, 0x60, 0x00];
const COR_SELO_FIM = [0xd8, 0x00, 0x00];
const SOBRANDO_MAX_COR = 10;

/**
 * Cor do selo para um valor sobrando (IDR 0066): interpola o laranja e o
 * vermelho de referência numa escala de 1 a 10, saturando no vermelho para
 * valores maiores. Compartilhada pelo selo do cartão e pelo histograma da
 * página de estatísticas.
 *
 * @param {number} sobrando - unidades sobrando (contagem − 1, ≥ 1).
 * @returns {string} cor hexadecimal (ex.: "#D86000").
 */
export function corDoSelo(sobrando) {
  const posicao = Math.min(Math.max(sobrando, 1), SOBRANDO_MAX_COR) - 1;
  const passo = posicao / (SOBRANDO_MAX_COR - 1);
  const hex = COR_SELO_INICIO.map((inicio, canal) =>
    Math.round(inicio + (COR_SELO_FIM[canal] - inicio) * passo)
      .toString(16)
      .padStart(2, '0'),
  ).join('');
  return `#${hex.toUpperCase()}`;
}
