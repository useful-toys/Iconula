// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { gerarExportacao, nomeDoArquivoExportado, validarImportacao } from './portabilidade.js';

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

describe('validarImportacao', () => {
  const CODIGOS = new Set(['BRA05', 'FWC01', 'COC14', 'ARG02']);

  function arquivo(contagens, extra = {}) {
    return JSON.stringify({ versao: 1, geradoEm: AGORA.toISOString(), contagens, ...extra });
  }

  it('arquivo válido devolve as contagens normalizadas', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 3, FWC01: 1 }), CODIGOS);
    expect(resultado).toEqual({ status: 'valido', contagens: { BRA05: 3, FWC01: 1 }, descartadas: 0 });
  });

  it('coleção vazia (contagens: {}) é válida', () => {
    const resultado = validarImportacao(arquivo({}), CODIGOS);
    expect(resultado).toEqual({ status: 'valido', contagens: {}, descartadas: 0 });
  });

  it('JSON malformado é recusado', () => {
    const resultado = validarImportacao('{ isto não é json', CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('arquivo que não é um objeto (ex.: um array) é recusado', () => {
    const resultado = validarImportacao('[1, 2, 3]', CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('versão desconhecida é recusada', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 1 }, { versao: 2 }), CODIGOS);
    expect(resultado.status).toBe('invalido');
    expect(resultado.motivo).toContain('versão');
  });

  it('versão ausente é recusada', () => {
    const resultado = validarImportacao(JSON.stringify({ contagens: { BRA05: 1 } }), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('"contagens" ausente é recusado', () => {
    const resultado = validarImportacao(JSON.stringify({ versao: 1 }), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('"contagens" de tipo errado (não objeto) é recusado', () => {
    const resultado = validarImportacao(arquivo('não é um mapa'), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('valor 100 é recusado — todo o arquivo, não só a chave', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 100 }), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('valor negativo é recusado — todo o arquivo, não só a chave', () => {
    const resultado = validarImportacao(arquivo({ BRA05: -1 }), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('valor não inteiro é recusado', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 2.5 }), CODIGOS);
    expect(resultado.status).toBe('invalido');
  });

  it('valor 0 é descartado silenciosamente, sem recusar o arquivo', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 3, FWC01: 0 }), CODIGOS);
    expect(resultado).toEqual({ status: 'valido', contagens: { BRA05: 3 }, descartadas: 0 });
  });

  it('código fora do catálogo é descartado, contado, mas não recusa o arquivo', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 3, XXX99: 5 }), CODIGOS);
    expect(resultado).toEqual({ status: 'valido', contagens: { BRA05: 3 }, descartadas: 1 });
  });

  it('conta corretamente várias chaves descartadas por não pertencerem ao catálogo', () => {
    const resultado = validarImportacao(arquivo({ BRA05: 3, XXX99: 5, YYY01: 2 }), CODIGOS);
    expect(resultado.descartadas).toBe(2);
    expect(resultado.contagens).toEqual({ BRA05: 3 });
  });

  // Ida e volta (Tarefa 0009-0004, item 6 do Escopo, fechado aqui): o
  // arquivo gerado por `gerarExportacao` reimportado por `validarImportacao`
  // reproduz a mesma coleção, código por código.
  it('exportar e reimportar reproduz a coleção idêntica', () => {
    const colecaoOriginal = { BRA05: 3, FWC01: 1, COC14: 14, ARG02: 47 };
    const exportacao = gerarExportacao(colecaoOriginal, AGORA);
    const arquivoExportado = JSON.stringify(exportacao);

    const resultado = validarImportacao(arquivoExportado, CODIGOS);

    expect(resultado).toEqual({ status: 'valido', contagens: colecaoOriginal, descartadas: 0 });
  });
});
