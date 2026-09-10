// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Calcula o placar geral da coleção.
 *
 * @param {Record<string, number>} contagens - mapa de código da figurinha para
 *   quantas unidades o usuário tem (0 a 99).
 * @param {number} [total=994] - total de figurinhas no catálogo.
 * @returns {{ coladas: number; faltantes: number; repetidas: number; percentual: number }}
 */
export function calcularPlacar(contagens = {}, total = 994) {
  const valores = Object.values(contagens);
  const coladas = valores.filter((n) => n >= 1).length;
  const repetidas = valores.filter((n) => n >= 2).length;
  const faltantes = total - coladas;
  const percentual = total > 0 ? Math.round((coladas / total) * 100) : 0;

  return { coladas, faltantes, repetidas, percentual };
}
