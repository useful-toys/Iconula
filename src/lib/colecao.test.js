// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { ajustarContagem, obterContagem, filtraFigurinha } from './colecao.js';

describe('obterContagem', () => {
  it('retorna 0 para chave ausente', () => {
    expect(obterContagem({}, 'BRA01')).toBe(0);
  });

  it('retorna a contagem existente', () => {
    expect(obterContagem({ BRA01: 3 }, 'BRA01')).toBe(3);
  });
});

describe('ajustarContagem', () => {
  it('incrementa a contagem', () => {
    expect(ajustarContagem({}, 'BRA01', 1)).toEqual({ BRA01: 1 });
  });

  it('decrementa a contagem', () => {
    expect(ajustarContagem({ BRA01: 2 }, 'BRA01', -1)).toEqual({ BRA01: 1 });
  });

  it('remove a chave ao chegar a 0', () => {
    expect(ajustarContagem({ BRA01: 1 }, 'BRA01', -1)).toEqual({});
  });

  it('não decrementa abaixo de 0', () => {
    expect(ajustarContagem({}, 'BRA01', -1)).toEqual({});
  });

  it('não incrementa acima de 99', () => {
    expect(ajustarContagem({ BRA01: 99 }, 'BRA01', 1)).toEqual({ BRA01: 99 });
  });

  it('não muta a coleção original', () => {
    const original = { BRA01: 1 };
    const nova = ajustarContagem(original, 'BRA01', 1);
    expect(original).toEqual({ BRA01: 1 });
    expect(nova).toEqual({ BRA01: 2 });
  });
});

describe('filtraFigurinha', () => {
  it('com "todas" retorna true para qualquer contagem', () => {
    expect(filtraFigurinha({}, 'BRA01', 'todas')).toBe(true);
    expect(filtraFigurinha({ BRA01: 1 }, 'BRA01', 'todas')).toBe(true);
    expect(filtraFigurinha({ BRA01: 3 }, 'BRA01', 'todas')).toBe(true);
  });

  it('com "faltantes" retorna true apenas para contagem 0', () => {
    expect(filtraFigurinha({}, 'BRA01', 'faltantes')).toBe(true);
    expect(filtraFigurinha({ BRA01: 1 }, 'BRA01', 'faltantes')).toBe(false);
    expect(filtraFigurinha({ BRA01: 3 }, 'BRA01', 'faltantes')).toBe(false);
  });

  it('com "repetidas" retorna true apenas para contagem >= 2', () => {
    expect(filtraFigurinha({}, 'BRA01', 'repetidas')).toBe(false);
    expect(filtraFigurinha({ BRA01: 1 }, 'BRA01', 'repetidas')).toBe(false);
    expect(filtraFigurinha({ BRA01: 2 }, 'BRA01', 'repetidas')).toBe(true);
    expect(filtraFigurinha({ BRA01: 3 }, 'BRA01', 'repetidas')).toBe(true);
  });
});
