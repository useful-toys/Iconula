// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Calcula o placar sobre um conjunto de códigos.
 *
 * @param {Record<string, number>} contagens - mapa de código da figurinha para
 *   quantas unidades o usuário tem (0 a 99).
 * @param {string[]} [codigos] - subconjunto de códigos sobre os quais calcular;
 *   se omitido, usa todas as chaves de `contagens`.
 * @returns {{ coladas: number; faltantes: number; repetidas: number; percentual: number }}
 */
export function calcularPlacar(contagens = {}, codigos) {
  const chaves = codigos ?? Object.keys(contagens);
  const valores = chaves.map((codigo) => contagens[codigo] ?? 0);
  const total = chaves.length;
  const coladas = valores.filter((n) => n >= 1).length;
  const repetidas = valores.filter((n) => n >= 2).length;
  const faltantes = total - coladas;
  const percentual = total > 0 ? Math.round((coladas / total) * 100) : 0;

  return { coladas, faltantes, repetidas, percentual };
}
