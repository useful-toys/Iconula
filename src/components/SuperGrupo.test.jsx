// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { SuperGrupo } from './SuperGrupo.jsx';
import { secoes, figurinhas } from '../data/catalogo.js';

const grupoC = secoes.filter((s) => s.grupo === 'C');
const figurinhasGrupoC = figurinhas.filter((f) =>
  grupoC.some((s) => s.sigla === f.secao),
);

// Mocks padrão para as props de colapso de seção
const isExpandidaMock = vi.fn(() => true);
const onToggleSecaoMock = vi.fn();
const getToggleHandlerMock = vi.fn((sigla) => () => onToggleSecaoMock(sigla));
const setSecaoRefMock = vi.fn();

describe('SuperGrupo', () => {
  it('renderiza o título com nome, progresso agregado e chevron', () => {
    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={{}}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    const titulo = screen.getByRole('button', { name: /Grupo C/ });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveAttribute('aria-expanded', 'true');
    expect(titulo.textContent).toContain('Grupo C');
    expect(titulo.textContent).toContain('0/80');
  });

  it('renderiza as 4 seções do grupo quando expandido', () => {
    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={{}}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    const secoesRenderizadas = screen.getAllByRole('button', { name: /Brasil/ });
    expect(secoesRenderizadas.length).toBeGreaterThan(0);
  });

  it('colapsa ao clicar no título, escondendo as seções', async () => {
    const user = userEvent.setup();
    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={{}}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    const titulo = screen.getByRole('button', { name: /Grupo C/ });
    expect(titulo).toHaveAttribute('aria-expanded', 'true');

    await user.click(titulo);

    expect(titulo).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /Brasil.*expandido/ })).not.toBeInTheDocument();
  });

  it('expande novamente ao clicar no título colapsado', async () => {
    const user = userEvent.setup();
    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={{}}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    const titulo = screen.getByRole('button', { name: /Grupo C/ });

    await user.click(titulo);
    expect(titulo).toHaveAttribute('aria-expanded', 'false');

    await user.click(titulo);
    expect(titulo).toHaveAttribute('aria-expanded', 'true');
  });

  it('calcula o progresso agregado sobre os 80 códigos do grupo', () => {
    const contagens = {
      BRA01: 1,
      BRA02: 2,
      MAR01: 3,
    };

    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={contagens}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    const titulo = screen.getByRole('button', { name: /Grupo C/ });
    expect(titulo.textContent).toContain('3/80');
    expect(titulo.textContent).toContain('4%');
    expect(titulo.textContent).toContain('▢77');
    expect(titulo.textContent).toContain('×2');
  });

  it('inclui o estado de colapso no nome acessível', async () => {
    const user = userEvent.setup();
    render(
      <SuperGrupo
        grupo="C"
        secoes={grupoC}
        figurinhas={figurinhasGrupoC}
        contagens={{}}
        onAjustar={vi.fn()}
        isExpandida={isExpandidaMock}
        getToggleHandler={getToggleHandlerMock}
        setSecaoRef={setSecaoRefMock}
      />,
    );

    // Busca especificamente o botão do SuperGrupo (contém "Grupo C")
    const tituloExpandido = screen.getByRole('button', { name: /Grupo C.*expandido/ });
    expect(tituloExpandido).toBeInTheDocument();

    await user.click(tituloExpandido);

    const tituloColapsado = screen.getByRole('button', { name: /Grupo C.*colapsado/ });
    expect(tituloColapsado).toBeInTheDocument();
  });

  it('respeita o colapso controlado por props', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const propsBase = {
      grupo: 'C',
      secoes: grupoC,
      figurinhas: figurinhasGrupoC,
      contagens: {},
      onAjustar: vi.fn(),
      isExpandida: isExpandidaMock,
      getToggleHandler: getToggleHandlerMock,
      setSecaoRef: setSecaoRefMock,
      onToggle,
    };
    const { rerender } = render(<SuperGrupo {...propsBase} expandida={false} />);

    const titulo = screen.getByRole('button', { name: /Grupo C/ });
    expect(titulo).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /Brasil/ })).not.toBeInTheDocument();

    await user.click(titulo);
    expect(onToggle).toHaveBeenCalledTimes(1);
    // Controlado: sem a prop mudar, o título continua fechado.
    expect(titulo).toHaveAttribute('aria-expanded', 'false');

    rerender(<SuperGrupo {...propsBase} expandida />);
    expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Brasil/ })).toBeInTheDocument();
  });

  it('aplica a classe de cor de cada letra do grupo no título', () => {
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    for (const letra of letras) {
      const { unmount } = render(
        <SuperGrupo
          grupo={letra}
          secoes={[]}
          figurinhas={[]}
          contagens={{}}
          onAjustar={vi.fn()}
          isExpandida={isExpandidaMock}
          getToggleHandler={getToggleHandlerMock}
          setSecaoRef={setSecaoRefMock}
        />,
      );

      const titulo = screen.getByRole('button', { name: new RegExp(`Grupo ${letra}`) });
      expect(titulo).toHaveClass('super-grupo__titulo');
      expect(titulo).toHaveClass(`super-grupo__titulo--${letra.toLowerCase()}`);
      unmount();
    }
  });
});
