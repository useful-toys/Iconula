// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { calcularPlacar } from './progresso.js';

describe('calcularPlacar', () => {
  it('retorna zeros para coleção vazia', () => {
    expect(calcularPlacar({})).toEqual({
      coladas: 0,
      faltantes: 994,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('conta coladas, faltantes e percentual', () => {
    const contagens = { BRA01: 1, BRA02: 1, ARG01: 1 };
    expect(calcularPlacar(contagens)).toEqual({
      coladas: 3,
      faltantes: 991,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('conta códigos distintos com contagem ≥ 2 como repetidas', () => {
    const contagens = { BRA01: 2, BRA02: 3, ARG01: 1 };
    const resultado = calcularPlacar(contagens);
    expect(resultado.coladas).toBe(3);
    expect(resultado.repetidas).toBe(2);
  });

  it('arredonda percentual para inteiro', () => {
    const contagens = {};
    for (let i = 0; i < 412; i++) {
      contagens[`COD${String(i).padStart(3, '0')}`] = 1;
    }
    expect(calcularPlacar(contagens).percentual).toBe(41);
  });

  it('ignora contagens zeradas', () => {
    expect(calcularPlacar({ BRA01: 0, BRA02: 1 })).toEqual({
      coladas: 1,
      faltantes: 993,
      repetidas: 0,
      percentual: 0,
    });
  });
});
