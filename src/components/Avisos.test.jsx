// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Avisos } from './Avisos.jsx';
import { SEVERIDADE, emitirAviso, limparAvisos } from '../lib/avisos.js';

function emitir(aviso) {
  act(() => {
    emitirAviso(aviso);
  });
}

describe('Avisos', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    limparAvisos();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('não renderiza nada quando não há avisos', () => {
    const { container } = render(<Avisos />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza as três severidades', () => {
    render(<Avisos />);

    emitir({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo' });
    emitir({ severidade: SEVERIDADE.AVISO, mensagem: 'Atenção' });
    emitir({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'código 123' });

    expect(screen.getByText('Salvo')).toBeInTheDocument();
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Falhou')).toBeInTheDocument();
  });

  it('a falha usa role=alert e sucesso/aviso usam role=status', () => {
    render(<Avisos />);

    emitir({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Salvo' });
    emitir({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'x', tipo: 'gravacao' });

    expect(screen.getByRole('status')).toHaveTextContent('Salvo');
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
  });

  it('dispensa o aviso pelo × da ponta direita', () => {
    render(<Avisos />);

    emitir({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'x', tipo: 'gravacao' });

    fireEvent.click(screen.getByRole('button', { name: 'Dispensar aviso' }));

    expect(screen.queryByText('Falhou')).not.toBeInTheDocument();
  });

  it('tocar na falha expande o detalhe técnico, recolhido por padrão', () => {
    render(<Avisos />);

    emitir({
      severidade: SEVERIDADE.FALHA,
      mensagem: 'Falhou',
      detalhe: 'código 123',
      tipo: 'gravacao',
    });

    expect(screen.queryByText('código 123')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Falhou' }));

    expect(screen.getByText('código 123')).toBeInTheDocument();
  });

  it('aplica a classe de severidade na faixa', () => {
    const { container } = render(<Avisos />);

    emitir({ severidade: SEVERIDADE.FALHA, mensagem: 'Falhou', detalhe: 'x', tipo: 'gravacao' });

    expect(container.querySelector('.avisos__faixa--falha')).toBeInTheDocument();
  });
});
