// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Secao } from './Secao.jsx';

const secaoBra = {
  sigla: 'BRA',
  nome: 'Brasil',
  icone: '🇧🇷',
  paginas: [24, 25],
  total: 20,
};

const figurinhasBra = [
  { codigo: 'BRA01', secao: 'BRA', metalizada: true },
  { codigo: 'BRA02', secao: 'BRA', metalizada: false },
  { codigo: 'BRA03', secao: 'BRA', metalizada: false },
];

describe('Secao', () => {
  it('renderiza o cabeçalho com nome, sigla, página e resumo compacto', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(screen.getByText(/Brasil/)).toBeInTheDocument();
    expect(document.body.textContent).toContain('BRA');
    expect(document.body.textContent).toContain('24');
    expect(document.body.textContent).toContain('0/3');
    expect(document.body.textContent).toContain('▢3');
    expect(document.body.textContent).toContain('×0');
  });

  it('escreve o nome acessível do cabeçalho por extenso', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{ BRA01: 1, BRA02: 2 }}
        onAjustar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/2 de 3/)).toBeInTheDocument();
    expect(screen.getByLabelText(/67 por cento/)).toBeInTheDocument();
    expect(screen.getByLabelText(/1 faltantes/)).toBeInTheDocument();
    expect(screen.getByLabelText(/1 repetidas/)).toBeInTheDocument();
  });

  it('omite o número da página quando a seção não o tem', () => {
    const fwc = {
      sigla: 'FWC',
      nome: 'Extras FIFA',
      icone: '🏆',
      paginas: null,
      total: 20,
    };
    const figurinhasFwc = [{ codigo: 'FWC01', secao: 'FWC', metalizada: false }];

    render(
      <Secao
        secao={fwc}
        figurinhas={figurinhasFwc}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(screen.getByText(/Extras FIFA/)).toBeInTheDocument();
    expect(document.body.textContent).toContain('Extras FIFA FWC');
  });

  it('renderiza a grade de figurinhas quando expandida', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('BRA 01, faltante')).toBeInTheDocument();
    expect(screen.getByLabelText('BRA 02, faltante')).toBeInTheDocument();
    expect(screen.getByLabelText('BRA 03, faltante')).toBeInTheDocument();
  });

  it('chama onAjustar ao incrementar uma figurinha', async () => {
    const onAjustar = vi.fn();
    const user = userEvent.setup();

    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={onAjustar}
      />,
    );

    await user.click(screen.getByLabelText('BRA 01, faltante'));
    expect(onAjustar).toHaveBeenCalledWith('BRA01', 1);
  });

  it('exibe chevron e estado expandido no cabeçalho', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    const cabecalho = screen.getByRole('button', { name: /Brasil/ });
    expect(cabecalho).toHaveAttribute('aria-expanded', 'true');
    expect(cabecalho.textContent).toContain('▾');
  });

  it('colapsa ao clicar no cabeçalho, escondendo a grade', async () => {
    const user = userEvent.setup();
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    const cabecalho = screen.getByRole('button', { name: /Brasil/ });
    expect(cabecalho).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('BRA 01, faltante')).toBeInTheDocument();

    await user.click(cabecalho);

    expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(cabecalho.textContent).toContain('▸');
    expect(screen.queryByLabelText('BRA 01, faltante')).not.toBeInTheDocument();
  });

  it('mantém o resumo visível quando colapsada', async () => {
    const user = userEvent.setup();
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    const cabecalho = screen.getByRole('button', { name: /Brasil/ });
    await user.click(cabecalho);

    expect(cabecalho.textContent).toContain('Brasil');
    expect(cabecalho.textContent).toContain('BRA');
    expect(cabecalho.textContent).toContain('0/3');
    expect(cabecalho.textContent).toContain('▢3');
  });

  it('inclui o estado de colapso no nome acessível', async () => {
    const user = userEvent.setup();
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    const cabecalhoExpandido = screen.getByRole('button', { name: /expandido/ });
    expect(cabecalhoExpandido).toBeInTheDocument();

    await user.click(cabecalhoExpandido);

    const cabecalhoColapsado = screen.getByRole('button', { name: /colapsado/ });
    expect(cabecalhoColapsado).toBeInTheDocument();
  });

  it('respeita a prop expandida quando controlada', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
        expandida={false}
        onToggle={vi.fn()}
      />,
    );

    const cabecalho = screen.getByRole('button', { name: /Brasil/ });
    expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('BRA 01, faltante')).not.toBeInTheDocument();
  });
});
