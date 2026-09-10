// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { ajustarContagem, obterContagem } from './colecao.js';

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
