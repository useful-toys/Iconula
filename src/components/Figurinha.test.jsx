// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Figurinha } from './Figurinha.jsx';

describe('Figurinha', () => {
  it('renderiza código em duas linhas', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(screen.getByText('BRA')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('exibe selo com unidades sobrando a partir da contagem 2', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).not.toContain('×');

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).toContain('×1');

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={3}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).toContain('×2');
  });

  it('mantém a caixa do selo na mesma largura para ×9 e ×10', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={10}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    const selo10 = document.querySelector('.figurinha__selo');
    const largura10 = getComputedStyle(selo10).minWidth;

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={9}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    const selo9 = document.querySelector('.figurinha__selo');
    expect(selo9).toBeTruthy();
    expect(getComputedStyle(selo9).minWidth).toBe(largura10);
  });

  it('aplica a classe de estado faltante', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha--faltante')).toBeInTheDocument();
  });

  it('incrementa ao clicar no cartão', async () => {
    const onIncrementar = vi.fn();
    const user = userEvent.setup();

    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={onIncrementar}
        onDecrementar={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText(/BRA 05, faltante/));
    expect(onIncrementar).toHaveBeenCalledTimes(1);
  });

  it('decrementa ao clicar no controle de menos', async () => {
    const onDecrementar = vi.fn();
    const user = userEvent.setup();

    render(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={vi.fn()}
        onDecrementar={onDecrementar}
      />,
    );

    await user.click(screen.getByRole('button', { name: /remover uma unidade de BRA 05/ }));
    expect(onDecrementar).toHaveBeenCalledTimes(1);
  });

  it('não muda a tela ao incrementar em 99 (controle do componente pai)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={99}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    const textoAntes = container.textContent;
    await user.click(screen.getByLabelText('BRA 05, colada, 98 sobrando'));
    expect(container.textContent).toBe(textoAntes);
  });

  it('não muda a tela ao decrementar em 0 (controle do componente pai)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    const textoAntes = container.textContent;
    const botaoMenos = screen.getByRole('button', { name: /remover uma unidade de BRA 05/ });
    await user.click(botaoMenos);
    expect(container.textContent).toBe(textoAntes);
  });

  it('descreve o estado por extenso no nome acessível', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, faltante')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, colada')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={3}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, colada, 2 sobrando')).toBeInTheDocument();
  });

  it('mostra a marca dourada quando metalizada', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        metalizada
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__metalizada')).toBeInTheDocument();
  });
});
