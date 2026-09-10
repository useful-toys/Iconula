// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { FaixaDeSecoes } from './FaixaDeSecoes.jsx';
import { secoes } from '../data/catalogo.js';

describe('FaixaDeSecoes', () => {
  it('renderiza as 50 seções com FWC no início e COC no fim', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    expect(botoes).toHaveLength(50);

    expect(botoes[0]).toHaveAttribute('aria-label', 'Saltar para Extras FIFA');
    expect(botoes[49]).toHaveAttribute('aria-label', 'Saltar para Coca-Cola');
  });

  it('cada botão tem nome acessível com o nome da seção', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    expect(screen.getByLabelText('Saltar para Brasil')).toBeInTheDocument();
    expect(screen.getByLabelText('Saltar para Argentina')).toBeInTheDocument();
  });

  it('a imagem da bandeira é decorativa (aria-hidden)', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    botoes.forEach((botao) => {
      const img = botao.querySelector('img');
      expect(img).toHaveAttribute('aria-hidden', 'true');
      expect(img).toHaveAttribute('alt', '');
    });
  });

  it('chama onSaltar com a sigla ao clicar em um botão', async () => {
    const user = userEvent.setup();
    const onSaltar = vi.fn();
    render(<FaixaDeSecoes secoes={secoes} onSaltar={onSaltar} />);

    await user.click(screen.getByLabelText('Saltar para Brasil'));
    expect(onSaltar).toHaveBeenCalledWith('BRA');
  });

  it('a faixa tem role navigation com label acessível', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Saltar para seção' })).toBeInTheDocument();
  });
});
