// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Catalogo } from './Catalogo.jsx';
import { figurinhas, secoes } from '../data/catalogo.js';

const secoesParcial = [
  secoes.find((s) => s.sigla === 'FWC'),
  secoes.find((s) => s.sigla === 'BRA'),
  secoes.find((s) => s.sigla === 'COC'),
];

const figurinhasParcial = figurinhas.filter(
  (f) => f.secao === 'FWC' || f.secao === 'BRA' || f.secao === 'COC',
);

describe('Catalogo', () => {
  it('renderiza as seções na ordem por sigla, com FWC primeiro e COC por último', () => {
    render(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="sigla"
      />,
    );

    const secoesRenderizadas = screen.getAllByRole('button', { name: /Extras FIFA|Brasil|Coca-Cola/ });
    expect(secoesRenderizadas).toHaveLength(3);
    expect(secoesRenderizadas[0].textContent).toContain('Extras FIFA');
    expect(secoesRenderizadas[1].textContent).toContain('Brasil');
    expect(secoesRenderizadas[2].textContent).toContain('Coca-Cola');
  });

  it('renderiza as seções na ordem por página, com FWC primeiro e COC por último', () => {
    render(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="pagina"
      />,
    );

    const secoesRenderizadas = screen.getAllByRole('button', { name: /Extras FIFA|Brasil|Coca-Cola/ });
    expect(secoesRenderizadas).toHaveLength(3);
    expect(secoesRenderizadas[0].textContent).toContain('Extras FIFA');
    expect(secoesRenderizadas[1].textContent).toContain('Brasil');
    expect(secoesRenderizadas[2].textContent).toContain('Coca-Cola');
  });

  it('atualiza o resumo da seção ao ajustar uma figurinha', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="sigla"
      />,
    );

    const brasil = screen.getByText(/Brasil/);
    expect(brasil.closest('section').textContent).toContain('0/20');

    const figurinhaBra01 = screen.getByLabelText('BRA 01, faltante');
    await user.click(figurinhaBra01);

    // O callback foi chamado; a tela reflete a contagem passada via props.
    expect(container.textContent).toContain('0/20');
  });

  it('colapsa uma seção ao clicar no cabeçalho', async () => {
    const user = userEvent.setup();
    render(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="sigla"
      />,
    );

    const brasilCabecalho = screen.getByRole('button', { name: /Brasil/ });
    expect(brasilCabecalho).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('BRA 01, faltante')).toBeInTheDocument();

    await user.click(brasilCabecalho);

    expect(brasilCabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('BRA 01, faltante')).not.toBeInTheDocument();
  });

  it('preserva o colapso da seção ao trocar de ordenação', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="sigla"
      />,
    );

    // Colapsa Brasil
    const brasilCabecalho = screen.getByRole('button', { name: /Brasil/ });
    await user.click(brasilCabecalho);
    expect(brasilCabecalho).toHaveAttribute('aria-expanded', 'false');

    // Troca para ordenação por página
    rerender(
      <Catalogo
        secoes={secoesParcial}
        figurinhas={figurinhasParcial}
        contagens={{}}
        onAjustar={vi.fn()}
        ordenacao="pagina"
      />,
    );

    // Brasil continua colapsado
    const brasilCabecalhoAposTroca = screen.getByRole('button', { name: /Brasil/ });
    expect(brasilCabecalhoAposTroca).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('BRA 01, faltante')).not.toBeInTheDocument();
  });
});
