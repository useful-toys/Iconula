// Copyright (c) 2026 Daniel Felix Ferber

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { carregarColecao, gravarAlteracoes, formatarCarimbo, mensagemDeErro } from './colecaoRemota.js';

const state = vi.hoisted(() => ({ app: {} }));

vi.mock('./firebase.js', () => ({
  get app() {
    return state.app;
  },
}));

const CAMPO_APAGAR = Symbol('deleteField');
const CARIMBO_SERVIDOR = Symbol('serverTimestamp');

const firestore = vi.hoisted(() => ({
  initializeFirestore: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteField: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  initializeFirestore: firestore.initializeFirestore,
  persistentLocalCache: firestore.persistentLocalCache,
  persistentMultipleTabManager: firestore.persistentMultipleTabManager,
  doc: firestore.doc,
  getDoc: firestore.getDoc,
  setDoc: firestore.setDoc,
  deleteField: firestore.deleteField,
  serverTimestamp: firestore.serverTimestamp,
}));

beforeEach(() => {
  state.app = {};
  firestore.doc.mockReset();
  firestore.getDoc.mockReset();
  firestore.doc.mockReturnValue({});
  firestore.setDoc.mockReset();
  firestore.setDoc.mockResolvedValue(undefined);
  firestore.deleteField.mockReset();
  firestore.deleteField.mockReturnValue(CAMPO_APAGAR);
  firestore.serverTimestamp.mockReset();
  firestore.serverTimestamp.mockReturnValue(CARIMBO_SERVIDOR);
});

describe('carregarColecao', () => {
  it('inicializa o Firestore com cache local e gerenciador multi-aba', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    await carregarColecao('u1');

    expect(firestore.persistentMultipleTabManager).toHaveBeenCalled();
    expect(firestore.persistentLocalCache).toHaveBeenCalledWith({
      tabManager: firestore.persistentMultipleTabManager.mock.results[0].value,
    });
    expect(firestore.initializeFirestore).toHaveBeenCalledWith(state.app, {
      localCache: firestore.persistentLocalCache.mock.results[0].value,
    });
  });

  it('carrega o documento existente com contagens, carimbo e marca de teamName', async () => {
    const carimbo = new Date('2026-09-10T14:05:00');
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: { BRA01: 3, FWC01: 1 },
        updatedAt: { toDate: () => carimbo },
        teamName: 'Brazil',
      }),
    });

    const resultado = await carregarColecao('u1');

    expect(resultado).toEqual({
      status: 'encontrado',
      contagens: { BRA01: 3, FWC01: 1 },
      atualizadoEm: carimbo,
      temTeamName: true,
    });
  });

  it('trata documento ausente como vazio, não como erro', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    const resultado = await carregarColecao('u1');

    expect(resultado).toEqual({ status: 'vazio' });
  });

  it('devolve erro quando a leitura falha', async () => {
    firestore.getDoc.mockRejectedValue(new Error('permission-denied'));

    const resultado = await carregarColecao('u1');

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await carregarColecao('u1');

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('lê exatamente um documento por carga', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    await carregarColecao('u1');

    expect(firestore.getDoc).toHaveBeenCalledTimes(1);
  });

  it('trata contagem ausente como mapa vazio', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') } }),
    });

    const resultado = await carregarColecao('u1');

    expect(resultado.status).toBe('encontrado');
    expect(resultado.contagens).toEqual({});
    expect(resultado.temTeamName).toBe(false);
  });
});

describe('gravarAlteracoes', () => {
  it('grava valores absolutos e updatedAt como serverTimestamp, com merge:true', async () => {
    const resultado = await gravarAlteracoes('u1', { BRA01: 3 });

    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { contagens: { BRA01: 3 }, updatedAt: CARIMBO_SERVIDOR },
      { merge: true },
    );
    expect(resultado.status).toBe('sucesso');
    expect(resultado.atualizadoEm).toBeInstanceOf(Date);
  });

  it('usa deleteField para a chave que chegou a zero', async () => {
    await gravarAlteracoes('u1', { BRA01: 3, FWC01: 0 });

    expect(firestore.deleteField).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { contagens: { BRA01: 3, FWC01: CAMPO_APAGAR }, updatedAt: CARIMBO_SERVIDOR },
      { merge: true },
    );
  });

  it('grava só as chaves alteradas, nunca o mapa inteiro', async () => {
    await gravarAlteracoes('u1', { BRA05: 1 });

    const [, dados] = firestore.setDoc.mock.calls[0];
    expect(Object.keys(dados.contagens)).toEqual(['BRA05']);
  });

  it('não escreve nada quando não há alterações', async () => {
    const resultado = await gravarAlteracoes('u1', {});

    expect(firestore.setDoc).not.toHaveBeenCalled();
    expect(resultado.status).toBe('sucesso');
  });

  it('devolve erro quando a escrita falha', async () => {
    firestore.setDoc.mockRejectedValue(new Error('unavailable'));

    const resultado = await gravarAlteracoes('u1', { BRA01: 1 });

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await gravarAlteracoes('u1', { BRA01: 1 });

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});

describe('formatarCarimbo', () => {
  const agora = new Date('2026-09-10T15:00:00');

  it('mostra travessão sem carimbo', () => {
    expect(formatarCarimbo(null, agora)).toBe('—');
  });

  it('mostra apenas a hora no mesmo dia', () => {
    expect(formatarCarimbo(new Date('2026-09-10T09:05:00'), agora)).toBe('09:05');
  });

  it('mostra data e hora quando o carimbo não é de hoje', () => {
    expect(formatarCarimbo(new Date('2026-09-09T09:05:00'), agora)).toBe('09/09/26 09:05');
  });

  it('não move o relógio: uma carga traz o carimbo gravado, não "agora"', () => {
    const gravado = new Date('2026-09-01T12:00:00');
    expect(formatarCarimbo(gravado, agora)).toBe('01/09/26 12:00');
  });
});

describe('mensagemDeErro', () => {
  it('usa a mensagem do erro', () => {
    expect(mensagemDeErro(new Error('falhou'))).toBe('falhou');
  });

  it('usa o código quando não há mensagem', () => {
    expect(mensagemDeErro({ code: 'permission-denied' })).toBe('permission-denied');
  });

  it('trata ausência de erro', () => {
    expect(mensagemDeErro(null)).toBe('erro desconhecido');
  });
});
