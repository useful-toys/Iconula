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
  { codigo: 'FWC00', secao: 'FWC', posicao: 0 },
  { codigo: 'FWC01', secao: 'FWC', posicao: 1 },
  { codigo: 'BRA01', secao: 'BRA', posicao: 1 },
  { codigo: 'BRA05', secao: 'BRA', posicao: 5 },
  { codigo: 'BRA08', secao: 'BRA', posicao: 8 },
  { codigo: 'BRA12', secao: 'BRA', posicao: 12 },
  { codigo: 'BRA19', secao: 'BRA', posicao: 19 },
  { codigo: 'ARG01', secao: 'ARG', posicao: 1 },
  { codigo: 'ARG02', secao: 'ARG', posicao: 2 },
];

describe('gerarTextoFaltantes', () => {
  it('gera uma linha "Nome SIG: nn nn nn" com os números crescentes', () => {
    // Só a seção do Brasil tem faltante; as demais ficam completas.
    const contagens = { BRA01: 1, FWC00: 1, FWC01: 1, ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 05 08 12 19');
  });

  it('usa o exemplo exato de requisitos.md § Compartilhamento', () => {
    const contagens = { BRA01: 3, ARG01: 1, ARG02: 1, FWC00: 1, FWC01: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 05 08 12 19');
  });

  it('inclui o 00 na linha dos Extras FIFA (faltantes)', () => {
    // Só o FWC tem faltante: o 00 precisa sair com dois dígitos.
    const contagens = { BRA01: 1, BRA05: 1, BRA08: 1, BRA12: 1, BRA19: 1, ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('Extras FIFA FWC: 00 01');
  });

  it('seção sem faltantes não aparece no texto', () => {
    const contagens = { ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).not.toContain('Argentina');
  });

  it('junta várias seções na ordem recebida, uma linha por seção', () => {
    const contagens = {}; // tudo faltante
    const texto = gerarTextoFaltantes(contagens, SECOES, FIGURINHAS);
    expect(texto.split('\n')).toEqual([
      'Extras FIFA FWC: 00 01',
      'Brasil BRA: 01 05 08 12 19',
      'Argentina ARG: 01 02',
    ]);
  });

  it('sem nenhum faltante, o texto é vazio', () => {
    const contagens = { FWC00: 1, FWC01: 1, BRA01: 1, BRA05: 1, BRA08: 1, BRA12: 1, BRA19: 1, ARG01: 1, ARG02: 1 };
    expect(gerarTextoFaltantes(contagens, SECOES, FIGURINHAS)).toBe('');
  });
});

describe('gerarTextoRepetidas', () => {
  it('gera "nn×k" com dois dígitos e k = contagem − 1', () => {
    const contagens = { BRA05: 3 }; // 2 unidades sobrando
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 05×2');
  });

  it('inclui o 00 na linha dos Extras FIFA (repetidas)', () => {
    const contagens = { FWC00: 2 }; // 1 unidade sobrando
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('Extras FIFA FWC: 00×1');
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
    expect(gerarTextoRepetidas(contagens, SECOES, FIGURINHAS)).toBe('Brasil BRA: 05×3 08×2 19×1');
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
