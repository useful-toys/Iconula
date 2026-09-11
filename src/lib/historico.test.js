// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { registrarAjuste, retirarUltimoAjuste } from './historico.js';

describe('registrarAjuste', () => {
  it('empilha a entrada no topo de um histórico vazio', () => {
    expect(registrarAjuste([], 'BRA01', 0)).toEqual([{ codigo: 'BRA01', contagemAnterior: 0 }]);
  });

  it('empilha por cima, mantendo as entradas anteriores', () => {
    const historico = [{ codigo: 'BRA01', contagemAnterior: 0 }];
    expect(registrarAjuste(historico, 'FWC01', 2)).toEqual([
      { codigo: 'BRA01', contagemAnterior: 0 },
      { codigo: 'FWC01', contagemAnterior: 2 },
    ]);
  });

  it('não muta o histórico recebido', () => {
    const historico = [{ codigo: 'BRA01', contagemAnterior: 0 }];
    registrarAjuste(historico, 'FWC01', 2);
    expect(historico).toEqual([{ codigo: 'BRA01', contagemAnterior: 0 }]);
  });

  it('descarta a entrada mais antiga ao exceder o limite de 10', () => {
    let historico = [];
    for (let i = 0; i < 10; i += 1) {
      historico = registrarAjuste(historico, `COD${i}`, i);
    }
    expect(historico).toHaveLength(10);

    historico = registrarAjuste(historico, 'COD10', 10);

    expect(historico).toHaveLength(10);
    // A primeira entrada (COD0) saiu; as demais avançaram uma posição.
    expect(historico[0]).toEqual({ codigo: 'COD1', contagemAnterior: 1 });
    expect(historico[9]).toEqual({ codigo: 'COD10', contagemAnterior: 10 });
  });
});

describe('retirarUltimoAjuste', () => {
  it('devolve null e o próprio histórico quando vazio', () => {
    const historico = [];
    expect(retirarUltimoAjuste(historico)).toEqual({ entrada: null, restante: historico });
  });

  it('retira a entrada do topo (a mais recente), em ordem inversa às alterações', () => {
    const historico = [
      { codigo: 'BRA01', contagemAnterior: 0 },
      { codigo: 'FWC01', contagemAnterior: 2 },
    ];

    const primeira = retirarUltimoAjuste(historico);
    expect(primeira.entrada).toEqual({ codigo: 'FWC01', contagemAnterior: 2 });
    expect(primeira.restante).toEqual([{ codigo: 'BRA01', contagemAnterior: 0 }]);

    const segunda = retirarUltimoAjuste(primeira.restante);
    expect(segunda.entrada).toEqual({ codigo: 'BRA01', contagemAnterior: 0 });
    expect(segunda.restante).toEqual([]);
  });

  it('não muta o histórico recebido', () => {
    const historico = [{ codigo: 'BRA01', contagemAnterior: 0 }];
    retirarUltimoAjuste(historico);
    expect(historico).toEqual([{ codigo: 'BRA01', contagemAnterior: 0 }]);
  });

  it('dez alterações seguidas de dez retiradas esvaziam o histórico, na ordem inversa', () => {
    let historico = [];
    for (let i = 0; i < 10; i += 1) {
      historico = registrarAjuste(historico, `COD${i}`, i);
    }

    const ordemRetirada = [];
    for (let i = 0; i < 10; i += 1) {
      const { entrada, restante } = retirarUltimoAjuste(historico);
      ordemRetirada.push(entrada.codigo);
      historico = restante;
    }

    expect(ordemRetirada).toEqual(['COD9', 'COD8', 'COD7', 'COD6', 'COD5', 'COD4', 'COD3', 'COD2', 'COD1', 'COD0']);
    expect(historico).toEqual([]);
    expect(retirarUltimoAjuste(historico).entrada).toBeNull();
  });
});
