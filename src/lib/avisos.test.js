// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SEVERIDADE,
  assinarAvisos,
  dispensarAviso,
  emitirAviso,
  limparAvisos,
  obterAvisos,
} from './avisos.js';

describe('avisos', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    limparAvisos();
  });

  afterEach(() => {
    limparAvisos();
    vi.useRealTimers();
  });

  it('sucesso e aviso somem sozinhos em 5s', () => {
    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo' });
    emitirAviso({ severidade: SEVERIDADE.AVISO, mensagem: 'Atenção' });

    expect(obterAvisos()).toHaveLength(2);

    vi.advanceTimersByTime(4999);
    expect(obterAvisos()).toHaveLength(2);

    vi.advanceTimersByTime(1);
    expect(obterAvisos()).toHaveLength(0);
  });

  it('a falha permanece depois de 5s', () => {
    emitirAviso({
      severidade: SEVERIDADE.FALHA,
      mensagem: 'Falhou',
      detalhe: 'código 123',
      tipo: 'gravacao',
    });

    vi.advanceTimersByTime(5000);
    expect(obterAvisos()).toHaveLength(1);
    expect(obterAvisos()[0].severidade).toBe(SEVERIDADE.FALHA);
  });

  it('dispensar remove o aviso', () => {
    emitirAviso({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', tipo: 'gravacao' });
    const [aviso] = obterAvisos();

    dispensarAviso(aviso.id);

    expect(obterAvisos()).toHaveLength(0);
  });

  it('o sucesso do mesmo tipo dispensa a falha', () => {
    emitirAviso({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'x', tipo: 'gravacao' });
    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo', tipo: 'gravacao' });

    const avisos = obterAvisos();
    expect(avisos).toHaveLength(1);
    expect(avisos[0].severidade).toBe(SEVERIDADE.SUCESSO);
  });

  it('o sucesso de outro tipo não dispensa a falha', () => {
    emitirAviso({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'x', tipo: 'carga' });
    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo', tipo: 'gravacao' });

    expect(obterAvisos()).toHaveLength(2);
  });

  it('empilha no máximo três, removendo a mais antiga', () => {
    for (let i = 0; i < 5; i += 1) {
      emitirAviso({ severidade: SEVERIDADE.FALHA, mensagem: `Falha ${i}`, tipo: 'gravacao' });
    }

    const avisos = obterAvisos();
    expect(avisos).toHaveLength(3);
    expect(avisos.map((a) => a.mensagem)).toEqual(['Falha 2', 'Falha 3', 'Falha 4']);
  });

  it('notifica os assinantes a cada mudança', () => {
    const ouvir = vi.fn();
    assinarAvisos(ouvir);

    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo' });
    expect(ouvir).toHaveBeenCalledTimes(1);

    dispensarAviso(obterAvisos()[0].id);
    expect(ouvir).toHaveBeenCalledTimes(2);
  });
});
