// Copyright (c) 2026 Daniel Felix Ferber

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { carregarColecao, formatarCarimbo, mensagemDeErro } from './colecaoRemota.js';

const state = vi.hoisted(() => ({ app: {} }));

vi.mock('./firebase.js', () => ({
  get app() {
    return state.app;
  },
}));

const firestore = vi.hoisted(() => ({
  initializeFirestore: vi.fn(),
  persistentLocalCache: vi.fn(),
  persistentMultipleTabManager: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  initializeFirestore: firestore.initializeFirestore,
  persistentLocalCache: firestore.persistentLocalCache,
  persistentMultipleTabManager: firestore.persistentMultipleTabManager,
  doc: firestore.doc,
  getDoc: firestore.getDoc,
}));

beforeEach(() => {
  state.app = {};
  firestore.doc.mockReset();
  firestore.getDoc.mockReset();
  firestore.doc.mockReturnValue({});
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
