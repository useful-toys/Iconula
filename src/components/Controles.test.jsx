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

  it('renderiza o grupo de filtro quando a disposição é lista', () => {
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={vi.fn()}
        filtro="todas"
        onTrocarFiltro={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'mostrar todas as figurinhas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mostrar apenas as figurinhas faltantes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mostrar apenas as figurinhas coladas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mostrar apenas as figurinhas repetidas' })).toBeInTheDocument();
  });

  it('não renderiza o grupo de filtro quando a disposição é álbum', () => {
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="album"
        onTrocarDisposicao={vi.fn()}
        filtro="todas"
        onTrocarFiltro={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'mostrar todas as figurinhas' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'mostrar apenas as figurinhas faltantes' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'mostrar apenas as figurinhas coladas' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'mostrar apenas as figurinhas repetidas' })).not.toBeInTheDocument();
  });

  it('marca o filtro ativo com aria-pressed', () => {
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={vi.fn()}
        filtro="coladas"
        onTrocarFiltro={vi.fn()}
      />
    );

    const todas = screen.getByRole('button', { name: 'mostrar todas as figurinhas' });
    const faltantes = screen.getByRole('button', { name: 'mostrar apenas as figurinhas faltantes' });
    const coladas = screen.getByRole('button', { name: 'mostrar apenas as figurinhas coladas' });
    const repetidas = screen.getByRole('button', { name: 'mostrar apenas as figurinhas repetidas' });

    expect(todas).toHaveAttribute('aria-pressed', 'false');
    expect(faltantes).toHaveAttribute('aria-pressed', 'false');
    expect(coladas).toHaveAttribute('aria-pressed', 'true');
    expect(repetidas).toHaveAttribute('aria-pressed', 'false');
  });

  it('chama onTrocarFiltro com "coladas" ao clicar em Col.', async () => {
    const user = userEvent.setup();
    const onTrocar = vi.fn();
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={vi.fn()}
        filtro="todas"
        onTrocarFiltro={onTrocar}
      />
    );

    await user.click(screen.getByRole('button', { name: 'mostrar apenas as figurinhas coladas' }));
    expect(onTrocar).toHaveBeenCalledWith('coladas');
  });

  it('chama onTrocarFiltro ao clicar em uma opção de filtro', async () => {
    const user = userEvent.setup();
    const onTrocar = vi.fn();
    render(
      <Controles
        ordenacao="pagina"
        onTrocarOrdenacao={vi.fn()}
        disposicao="lista"
        onTrocarDisposicao={vi.fn()}
        filtro="todas"
        onTrocarFiltro={onTrocar}
      />
    );

    await user.click(screen.getByRole('button', { name: 'mostrar apenas as figurinhas repetidas' }));
    expect(onTrocar).toHaveBeenCalledWith('repetidas');
  });

  it('não renderiza o botão de desfazer sem onDesfazer', () => {
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'desfazer a última alteração' })).not.toBeInTheDocument();
  });

  it('renderiza o botão de desfazer desabilitado quando não há histórico', () => {
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} onDesfazer={vi.fn()} podeDesfazer={false} />);
    expect(screen.getByRole('button', { name: 'desfazer a última alteração' })).toBeDisabled();
  });

  it('renderiza o botão de desfazer habilitado quando há histórico', () => {
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} onDesfazer={vi.fn()} podeDesfazer={true} />);
    expect(screen.getByRole('button', { name: 'desfazer a última alteração' })).toBeEnabled();
  });

  it('chama onDesfazer ao clicar no botão de desfazer', async () => {
    const user = userEvent.setup();
    const onDesfazer = vi.fn();
    render(<Controles ordenacao="pagina" onTrocarOrdenacao={vi.fn()} onDesfazer={onDesfazer} podeDesfazer={true} />);

    await user.click(screen.getByRole('button', { name: 'desfazer a última alteração' }));
    expect(onDesfazer).toHaveBeenCalledTimes(1);
  });
});
