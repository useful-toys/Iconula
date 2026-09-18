// Copyright (c) 2026 Daniel Felix Ferber

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  apagarColecao,
  carregarColecao,
  carregarCatalogoCompartilhado,
  gravarAlteracoes,
  gravarAtestacao,
  gravarImportacao,
  gravarLinkAtivo,
  formatarCarimbo,
  mensagemDeErro,
  MARCA_APAGAR_TEAM_NAME,
} from './colecaoRemota.js';

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
  deleteDoc: vi.fn(),
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
  deleteDoc: firestore.deleteDoc,
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
  firestore.deleteDoc.mockReset();
  firestore.deleteDoc.mockResolvedValue(undefined);
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
      atestadoEm: false,
      linkAtivo: false,
    });
  });

  it('reporta linkAtivo quando o documento tem o link ligado (Tarefa 0027-0004)', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: {},
        updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') },
        linkAtivo: true,
      }),
    });

    const resultado = await carregarColecao('u1');

    expect(resultado.status).toBe('encontrado');
    expect(resultado.linkAtivo).toBe(true);
  });

  it('trata linkAtivo ausente como desligado (Tarefa 0027-0004)', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ contagens: {}, updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') } }),
    });

    const resultado = await carregarColecao('u1');

    expect(resultado.linkAtivo).toBe(false);
  });

  it('reporta atestadoEm quando o documento já tem o carimbo (Tarefa 0008-0003)', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: {},
        updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') },
        atestadoEm: { toDate: () => new Date('2026-09-01T10:00:00') },
      }),
    });

    const resultado = await carregarColecao('u1');

    expect(resultado.atestadoEm).toBe(true);
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

describe('carregarColecao — espera sem rede (Tarefa 0007-0005)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('leitura pendente além de ~5s chama aoEsperar e continua aguardando', async () => {
    let resolverGetDoc;
    firestore.getDoc.mockReturnValue(
      new Promise((resolve) => {
        resolverGetDoc = resolve;
      }),
    );
    const aoEsperar = vi.fn();

    const promessa = carregarColecao('u1', { aoEsperar });
    await vi.advanceTimersByTimeAsync(5000);

    expect(aoEsperar).toHaveBeenCalledTimes(1);

    resolverGetDoc({ exists: () => false });
    const resultado = await promessa;

    expect(resultado).toEqual({ status: 'vazio' });
  });

  it('resolvendo antes de ~5s nunca chama aoEsperar', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });
    const aoEsperar = vi.fn();

    const resultado = await carregarColecao('u1', { aoEsperar });

    expect(aoEsperar).not.toHaveBeenCalled();
    expect(resultado).toEqual({ status: 'vazio' });
  });

  it('sem aoEsperar, a leitura não corre contra tempo-limite nenhum', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    const resultado = await carregarColecao('u1');

    expect(resultado).toEqual({ status: 'vazio' });
  });
});

describe('carregarCatalogoCompartilhado (Tarefa 0027-0003)', () => {
  it('lê o documento compartilhado com contagens e carimbo', async () => {
    const carimbo = new Date('2026-09-10T14:05:00');
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: { BRA01: 3, FWC01: 1 },
        updatedAt: { toDate: () => carimbo },
        linkAtivo: true,
      }),
    });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({
      status: 'compartilhado',
      contagens: { BRA01: 3, FWC01: 1 },
      atualizadoEm: carimbo,
    });
  });

  it('não expõe atestadoEm ao chamador', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: {},
        updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') },
        atestadoEm: { toDate: () => new Date('2026-09-01T10:00:00') },
        linkAtivo: true,
      }),
    });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).not.toHaveProperty('atestadoEm');
  });

  it('trata contagem ausente como mapa vazio', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') }, linkAtivo: true }),
    });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado.status).toBe('compartilhado');
    expect(resultado.contagens).toEqual({});
    expect(resultado.atualizadoEm).toBeInstanceOf(Date);
  });

  it('trata linkAtivo ausente como não compartilhado', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        contagens: { BRA01: 3 },
        updatedAt: { toDate: () => new Date('2026-09-10T14:05:00') },
      }),
    });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({ status: 'nao-compartilhado' });
  });

  it('trata linkAtivo false como não compartilhado', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ contagens: { BRA01: 3 }, linkAtivo: false }),
    });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({ status: 'nao-compartilhado' });
  });

  it('trata documento inexistente como não compartilhado', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({ status: 'nao-compartilhado' });
  });

  it('trata permissão negada como não compartilhado, sem revelar a conta', async () => {
    const negado = Object.assign(new Error('Missing or insufficient permissions'), {
      code: 'permission-denied',
    });
    firestore.getDoc.mockRejectedValue(negado);

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({ status: 'nao-compartilhado' });
  });

  it('devolve erro quando a leitura falha por outro motivo', async () => {
    firestore.getDoc.mockRejectedValue(Object.assign(new Error('unavailable'), { code: 'unavailable' }));

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await carregarCatalogoCompartilhado('u1');

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('lê exatamente um documento por abertura', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false });

    await carregarCatalogoCompartilhado('u1');

    expect(firestore.getDoc).toHaveBeenCalledTimes(1);
  });

  describe('espera sem rede (Tarefa 0007-0005)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('leitura pendente além de ~5s chama aoEsperar e continua aguardando', async () => {
      let resolverGetDoc;
      firestore.getDoc.mockReturnValue(
        new Promise((resolve) => {
          resolverGetDoc = resolve;
        }),
      );
      const aoEsperar = vi.fn();

      const promessa = carregarCatalogoCompartilhado('u1', { aoEsperar });
      await vi.advanceTimersByTimeAsync(5000);

      expect(aoEsperar).toHaveBeenCalledTimes(1);

      resolverGetDoc({ exists: () => false });
      const resultado = await promessa;

      expect(resultado).toEqual({ status: 'nao-compartilhado' });
    });
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

  it('inclui teamName: deleteField() junto das contagens quando a marca está presente', async () => {
    await gravarAlteracoes('u1', { BRA01: 1, [MARCA_APAGAR_TEAM_NAME]: true });

    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { contagens: { BRA01: 1 }, updatedAt: CARIMBO_SERVIDOR, teamName: CAMPO_APAGAR },
      { merge: true },
    );
  });

  it('não inclui teamName quando a marca não está presente', async () => {
    await gravarAlteracoes('u1', { BRA01: 1 });

    const [, dados] = firestore.setDoc.mock.calls[0];
    expect(dados).not.toHaveProperty('teamName');
  });

  it('grava só o teamName quando não há chaves de contagem alteradas', async () => {
    const resultado = await gravarAlteracoes('u1', { [MARCA_APAGAR_TEAM_NAME]: true });

    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { updatedAt: CARIMBO_SERVIDOR, teamName: CAMPO_APAGAR },
      { merge: true },
    );
    const [, dados] = firestore.setDoc.mock.calls[0];
    expect(dados).not.toHaveProperty('contagens');
    expect(resultado.status).toBe('sucesso');
  });
});

describe('gravarAtestacao', () => {
  it('grava atestadoEm como serverTimestamp, com merge:true, sem updatedAt', async () => {
    const resultado = await gravarAtestacao('u1');

    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { atestadoEm: CARIMBO_SERVIDOR },
      { merge: true },
    );
    expect(resultado).toEqual({ status: 'sucesso' });
  });

  it('devolve erro quando a escrita falha', async () => {
    firestore.setDoc.mockRejectedValue(new Error('unavailable'));

    const resultado = await gravarAtestacao('u1');

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await gravarAtestacao('u1');

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});

describe('gravarLinkAtivo (Tarefa 0027-0004)', () => {
  it('grava só linkAtivo com merge:true, sem updatedAt', async () => {
    const resultado = await gravarLinkAtivo('u1', true);

    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith({}, { linkAtivo: true }, { merge: true });
    expect(resultado).toEqual({ status: 'sucesso' });
  });

  it('grava false ao desligar — a chave é o campo, não a ausência dele', async () => {
    await gravarLinkAtivo('u1', false);

    expect(firestore.setDoc).toHaveBeenCalledWith({}, { linkAtivo: false }, { merge: true });
  });

  it('nunca usa deleteField nem serverTimestamp', async () => {
    await gravarLinkAtivo('u1', true);

    expect(firestore.deleteField).not.toHaveBeenCalled();
    expect(firestore.serverTimestamp).not.toHaveBeenCalled();
  });

  it('devolve erro quando a escrita falha', async () => {
    firestore.setDoc.mockRejectedValue(new Error('unavailable'));

    const resultado = await gravarLinkAtivo('u1', true);

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await gravarLinkAtivo('u1', true);

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  describe('espera sem rede (Tarefa 0007-0005)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('escrita pendente além de ~5s chama aoEsperar e continua aguardando', async () => {
      let resolverSetDoc;
      firestore.setDoc.mockReturnValue(
        new Promise((resolve) => {
          resolverSetDoc = resolve;
        }),
      );
      const aoEsperar = vi.fn();

      const promessa = gravarLinkAtivo('u1', true, { aoEsperar });
      await vi.advanceTimersByTimeAsync(5000);

      expect(aoEsperar).toHaveBeenCalledTimes(1);

      resolverSetDoc(undefined);
      const resultado = await promessa;

      expect(resultado.status).toBe('sucesso');
    });
  });
});

describe('gravarImportacao', () => {
  it('substitui contagens inteiro via mergeFields, sem merge por chave', async () => {
    const resultado = await gravarImportacao('u1', { BRA05: 3, FWC01: 1 });

    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { contagens: { BRA05: 3, FWC01: 1 }, updatedAt: CARIMBO_SERVIDOR },
      { mergeFields: ['contagens', 'updatedAt'] },
    );
    expect(resultado.status).toBe('sucesso');
    expect(resultado.atualizadoEm).toBeInstanceOf(Date);
  });

  it('grava o mapa recebido tal como está, mesmo vazio (coleção zerada)', async () => {
    await gravarImportacao('u1', {});

    expect(firestore.setDoc).toHaveBeenCalledWith(
      {},
      { contagens: {}, updatedAt: CARIMBO_SERVIDOR },
      { mergeFields: ['contagens', 'updatedAt'] },
    );
  });

  it('nunca usa deleteField — mergeFields já substitui o mapa inteiro', async () => {
    await gravarImportacao('u1', { BRA05: 3 });
    expect(firestore.deleteField).not.toHaveBeenCalled();
  });

  it('devolve erro quando a escrita falha', async () => {
    firestore.setDoc.mockRejectedValue(new Error('unavailable'));

    const resultado = await gravarImportacao('u1', { BRA05: 3 });

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await gravarImportacao('u1', { BRA05: 3 });

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  describe('espera sem rede (Tarefa 0007-0005)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('escrita pendente além de ~5s chama aoEsperar e continua aguardando', async () => {
      let resolverSetDoc;
      firestore.setDoc.mockReturnValue(
        new Promise((resolve) => {
          resolverSetDoc = resolve;
        }),
      );
      const aoEsperar = vi.fn();

      const promessa = gravarImportacao('u1', { BRA05: 3 }, { aoEsperar });
      await vi.advanceTimersByTimeAsync(5000);

      expect(aoEsperar).toHaveBeenCalledTimes(1);

      resolverSetDoc(undefined);
      const resultado = await promessa;

      expect(resultado.status).toBe('sucesso');
    });

    it('resolvendo antes de ~5s nunca chama aoEsperar', async () => {
      const aoEsperar = vi.fn();

      await gravarImportacao('u1', { BRA05: 3 }, { aoEsperar });

      expect(aoEsperar).not.toHaveBeenCalled();
    });
  });
});

describe('apagarColecao (Tarefa 0031-0002)', () => {
  it('apaga o documento do usuário com deleteDoc', async () => {
    const resultado = await apagarColecao('u1');

    expect(firestore.deleteDoc).toHaveBeenCalledTimes(1);
    expect(firestore.deleteDoc).toHaveBeenCalledWith({});
    expect(resultado).toEqual({ status: 'sucesso' });
  });

  it('não grava nada: a exclusão não toca contagens, carimbo nem campos', async () => {
    await apagarColecao('u1');

    expect(firestore.setDoc).not.toHaveBeenCalled();
    expect(firestore.serverTimestamp).not.toHaveBeenCalled();
    expect(firestore.deleteField).not.toHaveBeenCalled();
  });

  it('devolve erro quando a exclusão falha', async () => {
    firestore.deleteDoc.mockRejectedValue(new Error('permission-denied'));

    const resultado = await apagarColecao('u1');

    expect(resultado.status).toBe('erro');
    expect(resultado.erro).toBeInstanceOf(Error);
  });

  it('devolve indisponível quando não há app configurado', async () => {
    state.app = null;

    const resultado = await apagarColecao('u1');

    expect(resultado).toEqual({ status: 'indisponivel' });
    expect(firestore.deleteDoc).not.toHaveBeenCalled();
  });

  describe('espera sem rede (Tarefa 0007-0005)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('exclusão pendente além de ~5s chama aoEsperar e continua aguardando', async () => {
      let resolverDeleteDoc;
      firestore.deleteDoc.mockReturnValue(
        new Promise((resolve) => {
          resolverDeleteDoc = resolve;
        }),
      );
      const aoEsperar = vi.fn();

      const promessa = apagarColecao('u1', { aoEsperar });
      await vi.advanceTimersByTimeAsync(5000);

      expect(aoEsperar).toHaveBeenCalledTimes(1);

      resolverDeleteDoc(undefined);
      const resultado = await promessa;

      expect(resultado).toEqual({ status: 'sucesso' });
    });

    it('resolvendo antes de ~5s nunca chama aoEsperar', async () => {
      const aoEsperar = vi.fn();

      await apagarColecao('u1', { aoEsperar });

      expect(aoEsperar).not.toHaveBeenCalled();
    });
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
