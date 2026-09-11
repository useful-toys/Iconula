// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { gerarExportacao, nomeDoArquivoExportado } from './portabilidade.js';

const AGORA = new Date('2026-09-11T14:05:30.000Z');

describe('gerarExportacao', () => {
  it('tem exatamente os três campos: versao, geradoEm e contagens', () => {
    const exportacao = gerarExportacao({ BRA05: 3 }, AGORA);
    expect(Object.keys(exportacao).sort()).toEqual(['contagens', 'geradoEm', 'versao']);
  });

  it('versao é 1', () => {
    expect(gerarExportacao({}, AGORA).versao).toBe(1);
  });

  it('geradoEm é o instante recebido, em ISO 8601', () => {
    expect(gerarExportacao({}, AGORA).geradoEm).toBe('2026-09-11T14:05:30.000Z');
  });

  it('contagens reflete o mapa recebido, lossless', () => {
    const contagens = { BRA05: 3, FWC01: 1, COC14: 99 };
    expect(gerarExportacao(contagens, AGORA).contagens).toEqual(contagens);
  });

  it('contagens zeradas ou negativas não aparecem no arquivo', () => {
    const contagens = { BRA05: 3, FWC01: 0, ARG02: -1 };
    expect(gerarExportacao(contagens, AGORA).contagens).toEqual({ BRA05: 3 });
  });

  it('coleção vazia gera contagens vazio, não omitido', () => {
    expect(gerarExportacao({}, AGORA).contagens).toEqual({});
  });

  it('não inclui nenhum dado pessoal (uid, e-mail, nome, foto)', () => {
    const exportacao = gerarExportacao({ BRA05: 3 }, AGORA);
    const chaves = JSON.stringify(exportacao).toLowerCase();
    expect(chaves).not.toMatch(/uid|e-?mail|nome|foto|photo|display/);
  });

  it('não muta o mapa de contagens recebido', () => {
    const contagens = { BRA05: 3 };
    gerarExportacao(contagens, AGORA);
    expect(contagens).toEqual({ BRA05: 3 });
  });

  // O passo de ida e volta completo (reimportar de fato) é fechado pela
  // Tarefa 0009-0005, quando `importarColecao` existir. O que já se garante
  // aqui é que a serialização é sem perdas por `JSON.stringify`/`JSON.parse`
  // — o par que a importação vai usar para ler o arquivo.
  it('sobrevive a JSON.stringify/JSON.parse sem perder nenhuma contagem', () => {
    const contagens = { BRA05: 3, FWC01: 1, COC14: 99, ARG02: 47 };
    const exportacao = gerarExportacao(contagens, AGORA);

    const arquivo = JSON.parse(JSON.stringify(exportacao));

    expect(arquivo).toEqual({
      versao: 1,
      geradoEm: '2026-09-11T14:05:30.000Z',
      contagens,
    });
  });
});

describe('nomeDoArquivoExportado', () => {
  it('segue o formato iconula-AAAA-MM-DD.json', () => {
    expect(nomeDoArquivoExportado(AGORA)).toBe('iconula-2026-09-11.json');
  });

  it('preenche mês e dia com zero à esquerda', () => {
    expect(nomeDoArquivoExportado(new Date('2026-01-05T00:00:00'))).toBe('iconula-2026-01-05.json');
  });
});
