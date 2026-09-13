// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { gravarColapsoManual, lerColapsoManual } from './colapsoManual.js';

const CHAVE = 'iconula.colapso-manual.v1';

describe('colapsoManual', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sem chave guardada, devolve conjuntos vazios (tudo aberto)', () => {
    expect(lerColapsoManual()).toEqual({ secoes: new Set(), grupos: new Set() });
  });

  it('grava e lê de volta os conjuntos de seções e grupos', () => {
    gravarColapsoManual({
      secoes: new Set(['BRA', 'FWC']),
      grupos: new Set(['C']),
    });

    expect(lerColapsoManual()).toEqual({
      secoes: new Set(['BRA', 'FWC']),
      grupos: new Set(['C']),
    });
  });

  it('aceita iteráveis no lugar de Set ao gravar', () => {
    gravarColapsoManual({ secoes: ['BRA'], grupos: ['C'] });

    expect(JSON.parse(localStorage.getItem(CHAVE))).toEqual({
      secoes: ['BRA'],
      grupos: ['C'],
    });
  });

  it('descarta valores não-string dentro das listas', () => {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({ secoes: ['BRA', 1, null, {}], grupos: ['C', false] }),
    );

    expect(lerColapsoManual()).toEqual({ secoes: new Set(['BRA']), grupos: new Set(['C']) });
  });

  it('lista ausente ou não-array vira conjunto vazio', () => {
    localStorage.setItem(CHAVE, JSON.stringify({ secoes: 'BRA' }));

    expect(lerColapsoManual()).toEqual({ secoes: new Set(), grupos: new Set() });
  });

  it('JSON quebrado é tratado como tudo aberto', () => {
    localStorage.setItem(CHAVE, 'não é json {');

    expect(lerColapsoManual()).toEqual({ secoes: new Set(), grupos: new Set() });
  });

  it('valor não-objeto é tratado como tudo aberto', () => {
    localStorage.setItem(CHAVE, JSON.stringify([1, 2, 3]));

    expect(lerColapsoManual()).toEqual({ secoes: new Set(), grupos: new Set() });
  });

  it('localStorage que lança em leitura é tratado como tudo aberto', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(lerColapsoManual()).toEqual({ secoes: new Set(), grupos: new Set() });
  });

  it('localStorage que lança em escrita não quebra', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(() =>
      gravarColapsoManual({ secoes: new Set(['BRA']), grupos: new Set(['C']) }),
    ).not.toThrow();
  });
});
