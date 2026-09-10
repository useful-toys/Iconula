// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { calcularPlacar } from './progresso.js';

const CODIGOS_994 = Array.from({ length: 994 }, (_, i) => `COD${String(i).padStart(3, '0')}`);

describe('calcularPlacar', () => {
  it('retorna zeros para coleção vazia quando o universo é informado', () => {
    expect(calcularPlacar({}, CODIGOS_994)).toEqual({
      coladas: 0,
      faltantes: 994,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('conta coladas, faltantes e percentual sobre o universo informado', () => {
    const contagens = { COD000: 1, COD001: 1, COD002: 1 };
    expect(calcularPlacar(contagens, CODIGOS_994)).toEqual({
      coladas: 3,
      faltantes: 991,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('conta códigos distintos com contagem ≥ 2 como repetidas', () => {
    const contagens = { COD000: 2, COD001: 3, COD002: 1 };
    const resultado = calcularPlacar(contagens, CODIGOS_994);
    expect(resultado.coladas).toBe(3);
    expect(resultado.repetidas).toBe(2);
  });

  it('arredonda percentual para inteiro sobre o universo informado', () => {
    const contagens = {};
    for (let i = 0; i < 412; i++) {
      contagens[`COD${String(i).padStart(3, '0')}`] = 1;
    }
    expect(calcularPlacar(contagens, CODIGOS_994).percentual).toBe(41);
  });

  it('ignora contagens zeradas e chaves fora do universo', () => {
    expect(calcularPlacar({ COD000: 0, COD001: 1, OUTRO: 5 }, CODIGOS_994)).toEqual({
      coladas: 1,
      faltantes: 993,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('calcula placar por subconjunto de códigos', () => {
    const contagens = { BRA01: 2, BRA02: 1, ARG01: 0 };
    const resultado = calcularPlacar(contagens, ['BRA01', 'BRA02', 'ARG01']);
    expect(resultado).toEqual({
      coladas: 2,
      faltantes: 1,
      repetidas: 1,
      percentual: 67,
    });
  });
});
