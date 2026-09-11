// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { criarGravacaoAgregada } from './gravacaoAgregada.js';

describe('criarGravacaoAgregada', () => {
  let gravar;
  let aoConcluir;
  let aoFalhar;
  let instancia;

  beforeEach(() => {
    vi.useFakeTimers();
    gravar = vi.fn().mockResolvedValue({ status: 'sucesso', atualizadoEm: new Date() });
    aoConcluir = vi.fn();
    aoFalhar = vi.fn();
    instancia = criarGravacaoAgregada({ gravar, aoConcluir, aoFalhar });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uma rajada de ajustes gera uma única escrita, depois do debounce', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);
    await vi.advanceTimersByTimeAsync(500);
    instancia.registrarAjuste('u1', 'BRA01', 2);
    await vi.advanceTimersByTimeAsync(500);
    instancia.registrarAjuste('u1', 'BRA01', 3);

    expect(gravar).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);

    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar).toHaveBeenCalledWith('u1', { BRA01: 3 });
  });

  it('atividade contínua grava ao atingir o teto, sem esperar a rajada acabar', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);
    for (let i = 0; i < 9; i += 1) {
      await vi.advanceTimersByTimeAsync(1000); // sempre < 2s de silêncio: nunca dispara o debounce
      instancia.registrarAjuste('u1', 'BRA01', i + 2);
    }
    expect(gravar).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000); // completa os 10s do teto desde o primeiro ajuste
    expect(gravar).toHaveBeenCalledTimes(1);
  });

  it('a escrita contém só as chaves alteradas', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);
    instancia.registrarAjuste('u1', 'FWC01', 2);

    await vi.advanceTimersByTimeAsync(2000);

    expect(gravar).toHaveBeenCalledWith('u1', { BRA01: 1, FWC01: 2 });
  });

  it('flush grava imediatamente, sem esperar o debounce nem o teto', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);

    await instancia.flush();

    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar).toHaveBeenCalledWith('u1', { BRA01: 1 });
  });

  it('flush sem nenhuma alteração pendente não grava nada', async () => {
    await instancia.flush();
    expect(gravar).not.toHaveBeenCalled();
  });

  it('depois do flush, uma nova rajada agenda debounce e teto de novo', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);
    await instancia.flush();
    expect(gravar).toHaveBeenCalledTimes(1);

    instancia.registrarAjuste('u1', 'FWC01', 1);
    expect(gravar).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2000);
    expect(gravar).toHaveBeenCalledTimes(2);
    expect(gravar).toHaveBeenLastCalledWith('u1', { FWC01: 1 });
  });

  it('gravação bem-sucedida chama aoConcluir com o resultado', async () => {
    instancia.registrarAjuste('u1', 'BRA01', 1);
    await instancia.flush();

    expect(aoConcluir).toHaveBeenCalledWith({ status: 'sucesso', atualizadoEm: expect.any(Date) });
    expect(aoFalhar).not.toHaveBeenCalled();
  });

  it('falha devolve as chaves para a fila, sem perder o ajuste', async () => {
    gravar.mockResolvedValueOnce({ status: 'erro', erro: new Error('falhou') });
    instancia.registrarAjuste('u1', 'BRA01', 1);

    await instancia.flush();

    expect(aoFalhar).toHaveBeenCalledTimes(1);
    expect(aoConcluir).not.toHaveBeenCalled();
    expect(instancia.temPendencia()).toBe(true);

    await instancia.flush();

    expect(gravar).toHaveBeenLastCalledWith('u1', { BRA01: 1 });
    expect(aoConcluir).toHaveBeenCalledTimes(1);
    expect(instancia.temPendencia()).toBe(false);
  });

  it('um ajuste feito depois de uma falha se soma ao que ficou pendente', async () => {
    gravar.mockResolvedValueOnce({ status: 'erro', erro: new Error('falhou') });
    instancia.registrarAjuste('u1', 'BRA01', 1);
    await instancia.flush();

    instancia.registrarAjuste('u1', 'FWC01', 5);
    await instancia.flush();

    expect(gravar).toHaveBeenLastCalledWith('u1', { BRA01: 1, FWC01: 5 });
  });
});
