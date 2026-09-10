// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Controles } from './Controles.jsx';

describe('Controles', () => {
  it('renderiza o grupo segmentado com Página e Sigla', () => {
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'ordenar pela página do álbum' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ordenar pela sigla da seção' })).toBeInTheDocument();
  });

  it('marca a opção ativa com aria-pressed e a classe visual', () => {
    render(<Controles ordenacao="sigla" onTrocarOrdenacao={vi.fn()} />);

    const pagina = screen.getByRole('button', { name: 'ordenar pela página do álbum' });
    const sigla = screen.getByRole('button', { name: 'ordenar pela sigla da seção' });

    expect(pagina).toHaveAttribute('aria-pressed', 'false');
    expect(pagina).not.toHaveClass('controles__opcao--ativa');

    expect(sigla).toHaveAttribute('aria-pressed', 'true');
    expect(sigla).toHaveClass('controles__opcao--ativa');
  });

  it('chama onTrocarOrdenacao ao clicar na opção inativa', async () => {
    const user = userEvent.setup();
    const onTrocar = vi.fn();
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={onTrocar} />);

    await user.click(screen.getByRole('button', { name: 'ordenar pela sigla da seção' }));
    expect(onTrocar).toHaveBeenCalledWith('sigla');
  });

  it('reserva a área à direita para os comandos futuros', () => {
    const { container } = render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} />);
    expect(container.querySelector('.controles__direita')).toBeInTheDocument();
  });

  it('renderiza o grupo segmentado de disposição quando onTrocarDisposicao é fornecido', () => {
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'disposição em lista contínua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'disposição como no álbum' })).toBeInTheDocument();
  });

  it('não renderiza o grupo de disposição quando onTrocarDisposicao não é fornecido', () => {
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'disposição em lista contínua' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'disposição como no álbum' })).not.toBeInTheDocument();
  });

  it('marca a disposição ativa com aria-pressed', () => {
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="album"
        onTrocarDisposicao={vi.fn()}
      />
    );

    const lista = screen.getByRole('button', { name: 'disposição em lista contínua' });
    const album = screen.getByRole('button', { name: 'disposição como no álbum' });

    expect(lista).toHaveAttribute('aria-pressed', 'false');
    expect(album).toHaveAttribute('aria-pressed', 'true');
  });

  it('chama onTrocarDisposicao ao clicar na opção de disposição inativa', async () => {
    const user = userEvent.setup();
    const onTrocar = vi.fn();
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={onTrocar}
      />
    );

    await user.click(screen.getByRole('button', { name: 'disposição como no álbum' }));
    expect(onTrocar).toHaveBeenCalledWith('album');
  });
});
