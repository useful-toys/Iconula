// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  lerPreferenciasDeVista,
  gravarPreferenciasDeVista,
} from './preferenciasDeVista.js';

const CHAVE = 'iconula.preferencias-vista.v1';
const PADROES = { ordenacao: 'pagina', disposicao: 'lista', filtro: 'todas' };

describe('preferenciasDeVista', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna os padrões quando nada foi gravado', () => {
    expect(lerPreferenciasDeVista()).toEqual(PADROES);
  });

  it('grava e restaura cada preferência', () => {
    gravarPreferenciasDeVista({
      ordenacao: 'sigla',
      disposicao: 'album',
      filtro: 'repetidas',
    });

    expect(lerPreferenciasDeVista()).toEqual({
      ordenacao: 'sigla',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });

  it('grava apenas um subconjunto e restaura os padrões no resto', () => {
    gravarPreferenciasDeVista({ ordenacao: 'sigla', disposicao: 'lista', filtro: 'todas' });

    // A gravação de uma preferência não deixa as outras vazias
    expect(lerPreferenciasDeVista()).toEqual({
      ordenacao: 'sigla',
      disposicao: 'lista',
      filtro: 'todas',
    });
  });

  it('valor fora do domínio cai no padrão daquela preferência', () => {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({ ordenacao: 'lixo', disposicao: 'album', filtro: 'repetidas' }),
    );

    expect(lerPreferenciasDeVista()).toEqual({
      ordenacao: 'pagina',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });

  it('JSON quebrado cai nos padrões', () => {
    localStorage.setItem(CHAVE, 'não é json {');

    expect(lerPreferenciasDeVista()).toEqual(PADROES);
  });

  it('valor não-objeto cai nos padrões', () => {
    localStorage.setItem(CHAVE, JSON.stringify([1, 2, 3]));

    expect(lerPreferenciasDeVista()).toEqual(PADROES);
  });

  it('objeto com valor nulo cai nos padrões', () => {
    localStorage.setItem(CHAVE, JSON.stringify({ ordenacao: null, disposicao: null, filtro: null }));

    expect(lerPreferenciasDeVista()).toEqual(PADROES);
  });

  it('localStorage que lança em leitura não quebra e cai nos padrões', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(lerPreferenciasDeVista()).toEqual(PADROES);
  });

  it('localStorage que lança em escrita não quebra', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(() =>
      gravarPreferenciasDeVista({ ordenacao: 'sigla', disposicao: 'album', filtro: 'repetidas' }),
    ).not.toThrow();
  });

  it('gravar substitui valores fora do domínio pelo padrão antes de salvar', () => {
    gravarPreferenciasDeVista({ ordenacao: 'invalida', disposicao: 'album', filtro: 'repetidas' });

    expect(JSON.parse(localStorage.getItem(CHAVE))).toEqual({
      ordenacao: 'pagina',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });
});