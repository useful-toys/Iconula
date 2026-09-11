// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { criarGravacaoAgregada } from './gravacaoAgregada.js';

describe('criarGravacaoAgregada', () => {
  let gravar;
  let aoConcluir;
  let aoFalhar;
  let aoEsperar;
  let instancia;

  beforeEach(() => {
    vi.useFakeTimers();
    gravar = vi.fn().mockResolvedValue({ status: 'sucesso', atualizadoEm: new Date() });
    aoConcluir = vi.fn();
    aoFalhar = vi.fn();
    aoEsperar = vi.fn();
    instancia = criarGravacaoAgregada({ gravar, aoConcluir, aoFalhar, aoEsperar });
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

  describe('retorno do flush (Tarefa 0009-0002, IDR 0038)', () => {
    it('sem pendência, devolve status "nada"', async () => {
      await expect(instancia.flush()).resolves.toEqual({ status: 'nada' });
    });

    it('gravação bem-sucedida, devolve o resultado de sucesso', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);
      await expect(instancia.flush()).resolves.toMatchObject({ status: 'sucesso' });
    });

    it('gravação com falha, devolve o resultado de erro', async () => {
      gravar.mockResolvedValueOnce({ status: 'erro', erro: new Error('falhou') });
      instancia.registrarAjuste('u1', 'BRA01', 1);
      await expect(instancia.flush()).resolves.toMatchObject({ status: 'erro' });
    });
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

  describe('migração do teamName (Tarefa 0007-0004)', () => {
    it('documento com teamName produz uma gravação com a marca de apagar junto das contagens', async () => {
      instancia.marcarTeamNameParaApagar('u1');
      instancia.registrarAjuste('u1', 'BRA01', 1);

      await instancia.flush();

      expect(gravar).toHaveBeenCalledTimes(1);
      expect(gravar).toHaveBeenCalledWith('u1', { BRA01: 1, __apagarTeamName: true });
    });

    it('documento sem teamName não inclui a marca na escrita', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);

      await instancia.flush();

      expect(gravar).toHaveBeenCalledWith('u1', { BRA01: 1 });
    });

    it('sozinha, marcarTeamNameParaApagar não agenda nem força nenhuma escrita', async () => {
      instancia.marcarTeamNameParaApagar('u1');

      await vi.advanceTimersByTimeAsync(15000);
      await instancia.flush();

      expect(gravar).not.toHaveBeenCalled();
    });

    it('depois de gravado com sucesso, a gravação seguinte não repete a marca', async () => {
      instancia.marcarTeamNameParaApagar('u1');
      instancia.registrarAjuste('u1', 'BRA01', 1);
      await instancia.flush();

      expect(gravar).toHaveBeenLastCalledWith('u1', { BRA01: 1, __apagarTeamName: true });

      instancia.registrarAjuste('u1', 'FWC01', 1);
      await instancia.flush();

      expect(gravar).toHaveBeenLastCalledWith('u1', { FWC01: 1 });
    });

    it('falha na gravação mantém a marca para a tentativa seguinte', async () => {
      gravar.mockResolvedValueOnce({ status: 'erro', erro: new Error('falhou') });
      instancia.marcarTeamNameParaApagar('u1');
      instancia.registrarAjuste('u1', 'BRA01', 1);

      await instancia.flush();
      expect(instancia.temPendencia()).toBe(true);

      instancia.registrarAjuste('u1', 'FWC01', 2);
      await instancia.flush();

      expect(gravar).toHaveBeenLastCalledWith('u1', {
        BRA01: 1,
        FWC01: 2,
        __apagarTeamName: true,
      });
    });
  });

  describe('espera sem rede (Tarefa 0007-0005)', () => {
    it('promessa pendente além de ~5s chama aoEsperar, não aoFalhar', async () => {
      let resolver;
      gravar.mockReturnValueOnce(
        new Promise((resolve) => {
          resolver = resolve;
        }),
      );
      instancia.registrarAjuste('u1', 'BRA01', 1);

      const flush = instancia.flush();
      await vi.advanceTimersByTimeAsync(5000);

      expect(aoEsperar).toHaveBeenCalledTimes(1);
      expect(aoFalhar).not.toHaveBeenCalled();
      expect(aoConcluir).not.toHaveBeenCalled();

      resolver({ status: 'sucesso', atualizadoEm: new Date() });
      await flush;

      expect(aoConcluir).toHaveBeenCalledTimes(1);
    });

    it('resolvendo antes de ~5s nunca chama aoEsperar', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);

      await instancia.flush();

      expect(aoEsperar).not.toHaveBeenCalled();
      expect(aoConcluir).toHaveBeenCalledTimes(1);
    });

    it('depois de esperar, uma falha real ainda chama aoFalhar', async () => {
      let resolver;
      gravar.mockReturnValueOnce(
        new Promise((resolve) => {
          resolver = resolve;
        }),
      );
      instancia.registrarAjuste('u1', 'BRA01', 1);

      const flush = instancia.flush();
      await vi.advanceTimersByTimeAsync(5000);
      expect(aoEsperar).toHaveBeenCalledTimes(1);

      resolver({ status: 'erro', erro: new Error('permission-denied') });
      await flush;

      expect(aoFalhar).toHaveBeenCalledTimes(1);
      expect(aoConcluir).not.toHaveBeenCalled();
      expect(instancia.temPendencia()).toBe(true);
    });

    it('sem aoEsperar injetado, a espera não quebra a gravação', async () => {
      const semEspera = criarGravacaoAgregada({ gravar, aoConcluir, aoFalhar });
      semEspera.registrarAjuste('u1', 'BRA01', 1);

      await semEspera.flush();

      expect(aoConcluir).toHaveBeenCalledTimes(1);
    });
  });

  describe('descartarPendencias (Tarefa 0009-0005)', () => {
    it('esvazia a fila: um flush seguinte não grava nada', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);

      instancia.descartarPendencias();
      await instancia.flush();

      expect(gravar).not.toHaveBeenCalled();
      expect(instancia.temPendencia()).toBe(false);
    });

    it('cancela o debounce e o teto agendados', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);
      instancia.descartarPendencias();

      await vi.advanceTimersByTimeAsync(15000);

      expect(gravar).not.toHaveBeenCalled();
    });

    it('descarta também a marca de apagar teamName', async () => {
      instancia.marcarTeamNameParaApagar('u1');
      instancia.registrarAjuste('u1', 'BRA01', 1);

      instancia.descartarPendencias();
      await instancia.flush();

      expect(gravar).not.toHaveBeenCalled();
    });

    it('sem nenhuma pendência, não faz nada de mais', () => {
      expect(() => instancia.descartarPendencias()).not.toThrow();
      expect(instancia.temPendencia()).toBe(false);
    });

    it('uma rajada de ajustes depois do descarte agenda debounce e teto de novo', async () => {
      instancia.registrarAjuste('u1', 'BRA01', 1);
      instancia.descartarPendencias();

      instancia.registrarAjuste('u1', 'FWC01', 1);
      await vi.advanceTimersByTimeAsync(2000);

      expect(gravar).toHaveBeenCalledTimes(1);
      expect(gravar).toHaveBeenCalledWith('u1', { FWC01: 1 });
    });
  });
});
