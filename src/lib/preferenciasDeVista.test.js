// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  faixaDaLargura,
  lerPreferenciasDeVista,
  gravarPreferenciasDeVista,
} from './preferenciasDeVista.js';

const CHAVE = 'iconula.preferencias-vista.v1';
const PADRAO_NEUTRO = { ordenacao: 'pagina', disposicao: 'lista', filtro: 'todas' };
const PADRAO_CELULAR_TABLET = { ordenacao: 'pagina', disposicao: 'album', filtro: 'todas' };
const PADRAO_NAVEGADOR = { ordenacao: 'sigla', disposicao: 'lista', filtro: 'todas' };

describe('preferenciasDeVista', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('faixaDaLargura (IDR 0043)', () => {
    it('celular até 512px', () => {
      expect(faixaDaLargura(320)).toBe('celular');
      expect(faixaDaLargura(512)).toBe('celular');
    });

    it('tablet de 513px a 1024px', () => {
      expect(faixaDaLargura(513)).toBe('tablet');
      expect(faixaDaLargura(768)).toBe('tablet');
      expect(faixaDaLargura(1024)).toBe('tablet');
    });

    it('navegador acima de 1024px', () => {
      expect(faixaDaLargura(1025)).toBe('navegador');
      expect(faixaDaLargura(1920)).toBe('navegador');
    });

    it('largura inválida cai em navegador', () => {
      expect(faixaDaLargura(undefined)).toBe('navegador');
      expect(faixaDaLargura(NaN)).toBe('navegador');
      expect(faixaDaLargura('360')).toBe('navegador');
    });
  });

  describe('sem preferência guardada, cada faixa abre no par decidido (IDR 0043)', () => {
    it('celular: página do álbum, disposição álbum', () => {
      expect(lerPreferenciasDeVista(360)).toEqual(PADRAO_CELULAR_TABLET);
    });

    it('tablet: página do álbum, disposição álbum', () => {
      expect(lerPreferenciasDeVista(800)).toEqual(PADRAO_CELULAR_TABLET);
    });

    it('navegador: sigla, disposição lista', () => {
      expect(lerPreferenciasDeVista(1280)).toEqual(PADRAO_NAVEGADOR);
    });
  });

  it('com preferência guardada, a faixa de tela é ignorada', () => {
    gravarPreferenciasDeVista({
      ordenacao: 'sigla',
      disposicao: 'album',
      filtro: 'repetidas',
    });

    // Largura de celular não muda nada: o guardado vence (IDR 0026).
    expect(lerPreferenciasDeVista(360)).toEqual({
      ordenacao: 'sigla',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });

  it('restaura o filtro "coladas" na abertura seguinte', () => {
    gravarPreferenciasDeVista({
      ordenacao: 'pagina',
      disposicao: 'lista',
      filtro: 'coladas',
    });

    expect(lerPreferenciasDeVista(1280).filtro).toBe('coladas');
  });

  it('grava apenas um subconjunto e restaura os padrões no resto', () => {
    gravarPreferenciasDeVista({ ordenacao: 'sigla', disposicao: 'lista', filtro: 'todas' });

    // A gravação de uma preferência não deixa as outras vazias
    expect(lerPreferenciasDeVista(1280)).toEqual({
      ordenacao: 'sigla',
      disposicao: 'lista',
      filtro: 'todas',
    });
  });

  it('valor fora do domínio, com objeto guardado, cai no padrão neutro (não na faixa)', () => {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({ ordenacao: 'lixo', disposicao: 'album', filtro: 'repetidas' }),
    );

    // Largura de celular não muda o campo inválido: existe objeto guardado,
    // então o campo corrompido cai no padrão neutro fixo, não no da faixa.
    expect(lerPreferenciasDeVista(360)).toEqual({
      ordenacao: 'pagina',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });

  it('objeto com valor nulo em todos os campos cai no padrão neutro (não na faixa)', () => {
    localStorage.setItem(CHAVE, JSON.stringify({ ordenacao: null, disposicao: null, filtro: null }));

    expect(lerPreferenciasDeVista(360)).toEqual(PADRAO_NEUTRO);
  });

  it('JSON quebrado é tratado como sem preferência guardada: cai no padrão da faixa', () => {
    localStorage.setItem(CHAVE, 'não é json {');

    expect(lerPreferenciasDeVista(360)).toEqual(PADRAO_CELULAR_TABLET);
    expect(lerPreferenciasDeVista(1280)).toEqual(PADRAO_NAVEGADOR);
  });

  it('valor não-objeto é tratado como sem preferência guardada: cai no padrão da faixa', () => {
    localStorage.setItem(CHAVE, JSON.stringify([1, 2, 3]));

    expect(lerPreferenciasDeVista(800)).toEqual(PADRAO_CELULAR_TABLET);
  });

  it('localStorage que lança em leitura é tratado como sem preferência guardada', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(lerPreferenciasDeVista(1280)).toEqual(PADRAO_NAVEGADOR);
  });

  it('localStorage que lança em escrita não quebra', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage bloqueado');
    });

    expect(() =>
      gravarPreferenciasDeVista({ ordenacao: 'sigla', disposicao: 'album', filtro: 'repetidas' }),
    ).not.toThrow();
  });

  it('gravar substitui valores fora do domínio pelo padrão neutro antes de salvar', () => {
    gravarPreferenciasDeVista({ ordenacao: 'invalida', disposicao: 'album', filtro: 'repetidas' });

    expect(JSON.parse(localStorage.getItem(CHAVE))).toEqual({
      ordenacao: 'pagina',
      disposicao: 'album',
      filtro: 'repetidas',
    });
  });
});
