// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { figurinhas, secoes } from '../data/catalogo.js';
import {
  calcularHistograma,
  calcularProgressoPorGrupo,
  calcularProgressoPorSecao,
  calcularRepetidasPorSecao,
  calcularResumo,
  derivarEstatisticas,
} from './estatisticas.js';

// Catálogo mínimo local (molde de textoDeTroca.test.js): duas seleções no
// grupo A, FWC e COC especiais — suficiente para conferir os recortes sem
// depender dos números do catálogo real.
const SECOES = [
  { sigla: 'FWC', nome: 'Extras FIFA', grupo: null },
  { sigla: 'BRA', nome: 'Brasil', grupo: 'A' },
  { sigla: 'ARG', nome: 'Argentina', grupo: 'A' },
  { sigla: 'COC', nome: 'Coca-Cola', grupo: null },
];

const FIGURINHAS = [
  { codigo: 'FWC00', secao: 'FWC' },
  { codigo: 'FWC01', secao: 'FWC' },
  { codigo: 'BRA01', secao: 'BRA' },
  { codigo: 'BRA05', secao: 'BRA' },
  { codigo: 'ARG01', secao: 'ARG' },
  { codigo: 'COC01', secao: 'COC' },
];

describe('calcularResumo', () => {
  it('devolve zeros sobre os 994 código quando a coleção está vazia', () => {
    expect(calcularResumo({}, figurinhas)).toEqual({
      coladas: 0,
      faltantes: 994,
      repetidas: 0,
      percentual: 0,
    });
  });

  it('conta coladas, faltantes, repetidas e percentual', () => {
    const contagens = { BRA05: 2, ARG01: 1, FWC00: 3, COC01: 1 };
    expect(calcularResumo(contagens, figurinhas)).toEqual({
      coladas: 4,
      faltantes: 990,
      repetidas: 2,
      percentual: 0,
    });
  });

  it('trata o limite 99 como colada e repetida', () => {
    expect(calcularResumo({ BRA05: 99 }, figurinhas)).toEqual({
      coladas: 1,
      faltantes: 993,
      repetidas: 1,
      percentual: 0,
    });
  });
});

describe('calcularProgressoPorSecao', () => {
  it('devolve as 50 seções do catálogo na ordem recebida', () => {
    const progresso = calcularProgressoPorSecao({}, secoes, figurinhas);
    expect(progresso).toHaveLength(50);
    expect(progresso[0]).toMatchObject({ sigla: 'FWC', faltantes: 20 });
    expect(progresso.at(-1)).toMatchObject({ sigla: 'COC', faltantes: 14 });
  });

  it('calcula o placar de cada seção sobre os códigos dela', () => {
    const progresso = calcularProgressoPorSecao({ BRA05: 2, ARG01: 1 }, SECOES, FIGURINHAS);
    expect(progresso).toEqual([
      { sigla: 'FWC', nome: 'Extras FIFA', coladas: 0, faltantes: 2, repetidas: 0, percentual: 0 },
      { sigla: 'BRA', nome: 'Brasil', coladas: 1, faltantes: 1, repetidas: 1, percentual: 50 },
      { sigla: 'ARG', nome: 'Argentina', coladas: 1, faltantes: 0, repetidas: 0, percentual: 100 },
      { sigla: 'COC', nome: 'Coca-Cola', coladas: 0, faltantes: 1, repetidas: 0, percentual: 0 },
    ]);
  });
});

describe('calcularProgressoPorGrupo', () => {
  it('devolve FWC, os 12 grupos A–L e COC, nessa ordem', () => {
    const progresso = calcularProgressoPorGrupo({}, secoes, figurinhas);
    expect(progresso).toHaveLength(14);
    expect(progresso[0]).toMatchObject({ grupo: 'FWC', nome: 'Extras FIFA', faltantes: 20 });
    expect(progresso[1].grupo).toBe('A');
    expect(progresso[13]).toMatchObject({ grupo: 'COC', nome: 'Coca-Cola', faltantes: 14 });
  });

  it('agrega as seleções de cada grupo e separa FWC/COC', () => {
    const progresso = calcularProgressoPorGrupo({ BRA01: 1, ARG01: 1, FWC00: 2 }, SECOES, FIGURINHAS);
    const porGrupo = Object.fromEntries(progresso.map((item) => [item.grupo, item]));
    expect(porGrupo.FWC).toMatchObject({ coladas: 1, repetidas: 1, faltantes: 1 });
    expect(porGrupo.A).toMatchObject({ coladas: 2, repetidas: 0, faltantes: 1, percentual: 67 });
    expect(porGrupo.COC).toMatchObject({ coladas: 0, faltantes: 1 });
    expect(porGrupo.B).toMatchObject({ coladas: 0, faltantes: 0, percentual: 0 });
  });
});

describe('calcularRepetidasPorSecao', () => {
  it('lista só os códigos distintos com contagem ≥ 2, na ordem do álbum', () => {
    const contagens = { BRA05: 2, BRA01: 3, ARG01: 1 };
    const repetidas = calcularRepetidasPorSecao(contagens, SECOES, FIGURINHAS);
    expect(repetidas).toEqual([
      { sigla: 'FWC', nome: 'Extras FIFA', codigos: [] },
      { sigla: 'BRA', nome: 'Brasil', codigos: ['BRA01', 'BRA05'] },
      { sigla: 'ARG', nome: 'Argentina', codigos: [] },
      { sigla: 'COC', nome: 'Coca-Cola', codigos: [] },
    ]);
  });

  it('devolve uma entrada por seção mesmo sem repetidas', () => {
    const repetidas = calcularRepetidasPorSecao({}, secoes, figurinhas);
    expect(repetidas).toHaveLength(50);
    expect(repetidas.every((secao) => secao.codigos.length === 0)).toBe(true);
  });
});

describe('calcularHistograma', () => {
  it('joga todos os códigos na faixa 0 quando a coleção está vazia', () => {
    const histograma = calcularHistograma({}, FIGURINHAS);
    expect(histograma.map((faixa) => faixa.total)).toEqual([6, 0, 0, 0, 0, 0, 0]);
    expect(histograma.at(-1)).toEqual({ contagem: 6, rotulo: '6+', total: 0 });
  });

  it('distribui as contagens por faixa e agrupa a cauda', () => {
    const contagens = { FWC00: 1, FWC01: 2, BRA01: 3, BRA05: 4, ARG01: 5, COC01: 6 };
    const histograma = calcularHistograma(contagens, FIGURINHAS);
    expect(histograma.map((faixa) => faixa.total)).toEqual([0, 1, 1, 1, 1, 1, 1]);
    expect(histograma.map((faixa) => faixa.rotulo)).toEqual(['0', '1', '2', '3', '4', '5', '6+']);
  });

  it('coloca o limite 99 na cauda, junto com 0 na primeira faixa', () => {
    const histograma = calcularHistograma({ BRA05: 99 }, FIGURINHAS);
    expect(histograma[0].total).toBe(5);
    expect(histograma.at(-1)).toEqual({ contagem: 6, rotulo: '6+', total: 1 });
  });

  it('respeita maxIndividual informado', () => {
    const contagens = { FWC00: 1, FWC01: 2, BRA01: 3 };
    const histograma = calcularHistograma(contagens, FIGURINHAS, { maxIndividual: 2 });
    expect(histograma.map((faixa) => faixa.rotulo)).toEqual(['0', '1', '2', '3+']);
    expect(histograma.map((faixa) => faixa.total)).toEqual([3, 1, 1, 1]);
  });
});

describe('derivarEstatisticas sobre o catálogo real', () => {
  const contagens = { BRA05: 2, ARG01: 1, FWC00: 99, COC01: 3 };

  it('reúne os cinco blocos iguais às funções individuais', () => {
    const blocos = derivarEstatisticas(contagens, secoes, figurinhas);
    expect(blocos.resumo).toEqual(calcularResumo(contagens, figurinhas));
    expect(blocos.progressoPorGrupo).toEqual(calcularProgressoPorGrupo(contagens, secoes, figurinhas));
    expect(blocos.progressoPorSecao).toEqual(calcularProgressoPorSecao(contagens, secoes, figurinhas));
    expect(blocos.repetidasPorSecao).toEqual(calcularRepetidasPorSecao(contagens, secoes, figurinhas));
    expect(blocos.histograma).toEqual(calcularHistograma(contagens, figurinhas));
  });

  it('mantém o resumo geral igual à soma das seções', () => {
    const { resumo, progressoPorSecao } = derivarEstatisticas(contagens, secoes, figurinhas);
    const somar = (campo) => progressoPorSecao.reduce((total, secao) => total + secao[campo], 0);
    expect(somar('coladas')).toBe(resumo.coladas);
    expect(somar('faltantes')).toBe(resumo.faltantes);
    expect(somar('repetidas')).toBe(resumo.repetidas);
  });

  it('mantém o resumo geral igual à soma dos grupos', () => {
    const { resumo, progressoPorGrupo } = derivarEstatisticas(contagens, secoes, figurinhas);
    const somar = (campo) => progressoPorGrupo.reduce((total, grupo) => total + grupo[campo], 0);
    expect(somar('coladas')).toBe(resumo.coladas);
    expect(somar('faltantes')).toBe(resumo.faltantes);
    expect(somar('repetidas')).toBe(resumo.repetidas);
  });

  it('fecha o histograma em 994 códigos e as repetidas por seção no total geral', () => {
    const { resumo, histograma, repetidasPorSecao } = derivarEstatisticas(contagens, secoes, figurinhas);
    expect(histograma.reduce((total, faixa) => total + faixa.total, 0)).toBe(994);
    expect(repetidasPorSecao.reduce((total, secao) => total + secao.codigos.length, 0)).toBe(resumo.repetidas);
  });
});
