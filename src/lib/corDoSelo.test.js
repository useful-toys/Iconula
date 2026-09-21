// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';

import { corDoSelo } from './corDoSelo.js';

// Gradiente laranja→vermelho do selo `×N` (IDR 0066), compartilhado com o
// histograma da página de estatísticas.
describe('corDoSelo', () => {
  it('usa o laranja de referência com 1 sobrando', () => {
    expect(corDoSelo(1)).toBe('#D86000');
  });

  it('interpola numa cor intermediária com 5 sobrando', () => {
    expect(corDoSelo(5)).toBe('#D83500');
  });

  it('satura no vermelho a partir de 10 sobrando', () => {
    expect(corDoSelo(10)).toBe('#D80000');
    expect(corDoSelo(15)).toBe('#D80000');
  });

  it('trata valores abaixo de 1 como o laranja de referência', () => {
    expect(corDoSelo(0)).toBe('#D86000');
  });
});
