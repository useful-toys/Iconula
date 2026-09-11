// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { gerarTextoFaltantes, gerarTextoRepetidas } from './textoDeTroca.js';

// Catálogo mínimo para os testes: duas seções, sempre passadas já na ordem
// do álbum — a ordenação em si é responsabilidade de quem chama
// (`extrairSecoes(ordenarPorPagina(secoes))`, IDR 0039), não desta função.
const SECOES = [
  { sigla: 'FWC', nome: 'Extras FIFA' },
  { sigla: 'BRA', nome: 'Brasil' },
  { sigla: 'ARG', nome: 'Argentina' },
];

const FIGURINHAS = [
  { codigo: 'FWC01', secao: 'FWC', posicao: 1 },
  { codigo: 'FWC02', secao: 'FWC', posicao: 2 },
  { codigo: 'BRA01', secao: 'BRA', posicao: 1 },
  { codigo: 'BRA05', secao: 'BRA', posicao: 5 },
  { codigo: 'BRA08', secao: 'BRA', posicao: 8 },
  { codigo: 'BRA12', secao: 'BRA', posicao: 12 },
  { codigo: 'BRA19', secao: 'BRA', posicao: 19 },
  { codigo: 'ARG01', secao: 'ARG', posicao: 1 },
  { codigo: 'ARG02', secao: 'ARG', posicao: 2 },
];

describe('gerarTextoFaltantes', () => {
  it('gera uma linha "Nome SIG: n n n" com os números crescentes', () => {
    // Só a seção do Brasil tem faltante; as demais ficam completas.
    const contagens = { BRA01: 1, FWC01: 1, FWC02: 1, ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 5 8 12 19');
  });

  it('usa o exemplo exato de requisitos.md § Compartilhamento', () => {
    const contagens = { BRA01: 3, ARG01: 1, ARG02: 1, FWC01: 1, FWC02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 5 8 12 19');
  });

  it('seção sem faltantes não aparece no texto', () => {
    const contagens = { ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).not.toContain('Argentina');
  });

  it('junta várias seções na ordem recebida, uma linha por seção', () => {
    const contagens = {}; // tudo faltante
    const texto = gerarTextoFaltantes(contagens, SECOES, FIGURINHAS);
    expect(texto.split('\n')).toEqual([
      'Extras FIFA FWC: 1 2',
      'Brasil BRA: 1 5 8 12 19',
      'Argentina ARG: 1 2',
    ]);
  });

  it('sem nenhum faltante, o texto é vazio', () => {
    const contagens = { FWC01: 1, FWC02: 1, BRA01: 1, BRA05: 1, BRA08: 1, BRA12: 1, BRA19: 1, ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('');
  });
});

describe('gerarTextoRepetidas', () => {
  it('gera "n×k" com k = contagem − 1', () => {
    const contagens = { BRA05: 3 }; // 2 unidades sobrando
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 5×2');
  });

  it('contagem 1 (colada, não repetida) não entra no texto', () => {
    const contagens = { BRA01: 1 };
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('');
  });

  it('contagem 0 (faltante) não entra no texto', () => {
    const contagens = {};
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('');
  });

  it('várias repetidas na mesma seção, em ordem crescente de número', () => {
    const contagens = { BRA19: 2, BRA05: 4, BRA08: 3 };
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 5×3 8×2 19×1');
  });

  it('seção sem repetidas não aparece no texto', () => {
    const contagens = { BRA05: 3 };
    const texto = gerarTextoRepetidas(contagens, SECOES, FIGURINHAS);
    expect(texto).not.toContain('Argentina');
    expect(texto).not.toContain('Extras FIFA');
  });

  it('sem nenhuma repetida, o texto é vazio', () => {
    const contagens = { BRA01: 1, ARG01: 1 };
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('');
  });
});
