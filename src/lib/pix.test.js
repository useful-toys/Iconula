// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { montarPayloadPix } from './pix.js';

const CHAVE = 'cdbe7681-fb1a-44f5-8d26-9121ea3d0074';

// Payload fixo do app, com o CRC16 conferido à parte (valor DD5B).
const PAYLOAD_FIXO =
  '00020126580014br.gov.bcb.pix0136cdbe7681-fb1a-44f5-8d26-9121ea3d00745204' +
  '0000530398654045.005802BR5919Daniel Felix Ferber6013Campinas - SP62070503' +
  '***6304DD5B';

// Leitor de campos EMV: identificador (2) + tamanho (2) + valor.
function leCampos(emv) {
  const campos = {};
  let i = 0;
  while (i < emv.length) {
    const id = emv.slice(i, i + 2);
    const tamanho = Number(emv.slice(i + 2, i + 4));
    campos[id] = emv.slice(i + 4, i + 4 + tamanho);
    i += 4 + tamanho;
  }
  return campos;
}

// Implementação independente do CRC16-CCITT-FALSE, para não repetir a
// fórmula do módulo. Vetor de referência: "123456789" → 29B1.
function crc16Independente(texto) {
  let crc = 0xffff;
  for (const caractere of texto) {
    crc ^= caractere.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      const estourou = (crc & 0x8000) !== 0;
      crc = (crc << 1) & 0xffff;
      if (estourou) crc ^= 0x1021;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

describe('montarPayloadPix', () => {
  it('monta os campos do BR Code com os dados fixos do app', () => {
    const campos = leCampos(montarPayloadPix());
    const conta = leCampos(campos['26']);

    expect(campos['00']).toBe('01');
    expect(conta['00']).toBe('br.gov.bcb.pix');
    expect(conta['01']).toBe(CHAVE);
    expect(campos['52']).toBe('0000');
    expect(campos['53']).toBe('986');
    expect(campos['54']).toBe('5.00');
    expect(campos['58']).toBe('BR');
    expect(campos['59']).toBe('Daniel Felix Ferber');
    expect(campos['60']).toBe('Campinas - SP');
    expect(leCampos(campos['62'])['05']).toBe('***');
  });

  it('formata o valor com duas casas decimais', () => {
    expect(montarPayloadPix()).toContain('54045.00');
  });

  it('trunca nome e cidade nos limites do BR Code', () => {
    const campos = leCampos(montarPayloadPix({ nome: 'N'.repeat(30), cidade: 'C'.repeat(20) }));

    expect(campos['59']).toBe('N'.repeat(25));
    expect(campos['60']).toBe('C'.repeat(15));
  });

  it('calcula o CRC16 sobre a string com "6304" já anexado', () => {
    const payload = montarPayloadPix();
    const base = payload.slice(0, -4);

    expect(base.endsWith('6304')).toBe(true);
    expect(crc16Independente(base)).toBe(payload.slice(-4));
  });

  it('produz o payload fixo do app, byte a byte', () => {
    expect(montarPayloadPix()).toBe(PAYLOAD_FIXO);
  });
});
