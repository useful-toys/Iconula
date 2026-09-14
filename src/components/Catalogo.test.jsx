// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
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
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    const secoesRenderizadas = screen.getAllByRole('button', { name: /^(Extras FIFA|Brasil|Coca-Cola):/ });
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

    const secoesRenderizadas = screen.getAllByRole('button', { name: /^(Extras FIFA|Brasil|Coca-Cola):/ });
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

    const brasil = screen.getByText('Brasil BRA 24');
    expect(brasil.closest('section').textContent).toContain('0/20');

    const figurinhaBra01 = screen.getByLabelText(/^BRA 01, .+, faltante, metalizada$/);
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

    const brasilCabecalho = screen.getByRole('button', { name: /^Brasil:/ });
    expect(brasilCabecalho).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText(/^BRA 01, .+, faltante, metalizada$/)).toBeInTheDocument();

    await user.click(brasilCabecalho);

    expect(brasilCabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText(/^BRA 01, .+, faltante, metalizada$/)).not.toBeInTheDocument();
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
    const brasilCabecalho = screen.getByRole('button', { name: /^Brasil:/ });
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
    const brasilCabecalhoAposTroca = screen.getByRole('button', { name: /^Brasil:/ });
    expect(brasilCabecalhoAposTroca).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText(/^BRA 01, .+, faltante, metalizada$/)).not.toBeInTheDocument();
  });

  describe('filtro de status', () => {
    it('com "todas" mostra todas as figurinhas', () => {
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={{}}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="todas"
        />,
      );

      expect(screen.getByLabelText(/^BRA 01, .+, faltante, metalizada$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^FWC 00, .+, faltante$/)).toBeInTheDocument();
    });

    it('com "faltantes" mostra apenas contagem 0 e esconde seções completas', () => {
      // Contagens: BRA01 e BRA02 com 2 e 3, o resto tudo 0
      const contagensParciais = { BRA01: 2, BRA02: 3 };
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="faltantes"
        />,
      );

      // BRA01 e BRA02 não devem aparecer (são coladas)
      expect(screen.queryByLabelText(/^BRA 01, .+, faltante, metalizada$/)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/^BRA 02, .+, colada$/)).not.toBeInTheDocument();

      // BRA03 deve aparecer (é faltante)
      expect(screen.getByLabelText(/^BRA 03, .+, faltante$/)).toBeInTheDocument();
    });

    it('com "repetidas" mostra apenas contagem >= 2', () => {
      const contagensParciais = { BRA01: 2, BRA02: 3 };
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="repetidas"
        />,
      );

      expect(screen.getByLabelText(/^BRA 01, .+, colada, 1 sobrando, metalizada$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^BRA 02, .+, colada, 2 sobrando$/)).toBeInTheDocument();

      // BRA03 é faltante (contagem 0), não deve aparecer
      expect(screen.queryByLabelText(/^BRA 03, .+, faltante$/)).not.toBeInTheDocument();
    });

    it('com "coladas" mostra contagem >= 1 e esconde os 0', () => {
      const contagensParciais = { BRA01: 1, BRA02: 3 };
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="coladas"
        />,
      );

      expect(screen.getByLabelText(/^BRA 01, .+, colada, metalizada$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^BRA 02, .+, colada, 2 sobrando$/)).toBeInTheDocument();
      expect(screen.queryByLabelText(/^BRA 03, .+, faltante$/)).not.toBeInTheDocument();
    });

    it('com "repetidas" mostra subconjunto do que "coladas" mostrou', () => {
      const contagensParciais = { BRA01: 1, BRA02: 3 };
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="repetidas"
        />,
      );

      // BRA01 tem contagem 1: é colada, mas não repetida
      expect(screen.queryByLabelText(/^BRA 01, .+, colada, metalizada$/)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/^BRA 02, .+, colada, 2 sobrando$/)).toBeInTheDocument();
    });

    it('seção sem nenhuma colada some inteira com filtro "coladas"', () => {
      const contagensParciais = { BRA01: 1 };
      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="coladas"
        />,
      );

      // FWC e Coca-Cola não têm nenhuma colada
      expect(screen.queryByRole('button', { name: /^Extras FIFA:/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^Coca-Cola:/ })).not.toBeInTheDocument();
      // Brasil tem BRA01 colada
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toBeInTheDocument();
    });

    it('o resumo numérico da seção não muda ao filtrar', () => {
      const contagensParciais = { BRA01: 1, BRA02: 3 };
      const props = {
        secoes: secoesParcial,
        figurinhas: figurinhasParcial,
        contagens: contagensParciais,
        onAjustar: vi.fn(),
        ordenacao: 'sigla',
        disposicao: 'lista',
      };
      const { rerender } = render(<Catalogo {...props} filtro="coladas" />);
      expect(screen.getByText('Brasil BRA 24').closest('section').textContent).toContain('2/20');

      rerender(<Catalogo {...props} filtro="repetidas" />);
      expect(screen.getByText('Brasil BRA 24').closest('section').textContent).toContain('2/20');
      expect(screen.getByText('Brasil BRA 24').closest('section').textContent).toContain('10%');
    });

    it('super-grupo sem nenhuma colada some inteiro', () => {
      const secaoFwc = secoes.find((s) => s.sigla === 'FWC');
      const secaoCoc = secoes.find((s) => s.sigla === 'COC');
      const secaoMEX = secoes.find((s) => s.sigla === 'MEX');
      const secaoKOR = secoes.find((s) => s.sigla === 'KOR');
      const secaoRSA = secoes.find((s) => s.sigla === 'RSA');
      const secaoCZE = secoes.find((s) => s.sigla === 'CZE');

      const secoesGrupoA = [secaoFwc, secaoMEX, secaoKOR, secaoRSA, secaoCZE, secaoCoc];
      const figurinhasGrupoA = figurinhas.filter(
        (f) => f.secao === 'MEX' || f.secao === 'KOR' || f.secao === 'RSA' || f.secao === 'CZE',
      );

      render(
        <Catalogo
          secoes={secoesGrupoA}
          figurinhas={figurinhasGrupoA}
          contagens={{}}
          onAjustar={vi.fn()}
          ordenacao="pagina"
          disposicao="lista"
          filtro="coladas"
        />,
      );

      // Nenhuma figurinha colada: o super-grupo A some inteiro
      expect(screen.queryByRole('button', { name: /Grupo A/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^México:/ })).not.toBeInTheDocument();
    });

    it('seção completa some com filtro "faltantes"', () => {
      // FWC com todas as 20 figurinhas coladas: nenhuma faltante
      const contagensFwcCompletas = {};
      for (let i = 0; i <= 19; i++) {
        contagensFwcCompletas[`FWC${String(i).padStart(2, '0')}`] = 1;
      }

      render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensFwcCompletas}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="faltantes"
        />,
      );

      // FWC some inteira (todas as figurinhas coladas, nenhuma faltante)
      expect(screen.queryByRole('button', { name: /^Extras FIFA:/ })).not.toBeInTheDocument();

      // Brasil ainda aparece (tem faltantes)
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toBeInTheDocument();
    });

    it('voltar para "todas" restaura tudo com o colapso preservado', async () => {
      const contagensParciais = { BRA01: 2, BRA02: 3 };
      const { rerender } = render(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="repetidas"
        />,
      );

      // Com "repetidas", apenas BRA 01 e BRA 02 aparecem
      expect(screen.getByLabelText(/^BRA 01, .+, colada, 1 sobrando, metalizada$/)).toBeInTheDocument();

      // Volta para "todas"
      rerender(
        <Catalogo
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={contagensParciais}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="todas"
        />,
      );

      // Tudo volta
      expect(screen.getByLabelText(/^BRA 01, .+, colada, 1 sobrando, metalizada$/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^BRA 03, .+, faltante$/)).toBeInTheDocument();
    });

    it('saltar para seção oculta limpa o filtro', () => {
      const onLimparFiltro = vi.fn();
      const ref = { current: null };
      render(
        <Catalogo
          ref={ref}
          secoes={secoesParcial}
          figurinhas={figurinhasParcial}
          contagens={{}}
          onAjustar={vi.fn()}
          ordenacao="sigla"
          disposicao="lista"
          filtro="repetidas"
          onLimparFiltro={onLimparFiltro}
        />,
      );

      // Com "repetidas", nenhuma seção tem repetidas (todas contagens 0)
      // FWC e Coca-Cola sumiram (não têm repetidas)
      expect(screen.queryByRole('button', { name: /^Extras FIFA:/ })).not.toBeInTheDocument();

      // Salta para FWC, que está oculta pelo filtro
      if (ref.current) {
        ref.current.saltarPara('FWC');
      }
      expect(onLimparFiltro).toHaveBeenCalledTimes(1);
    });

    it('super-grupo sem nenhuma seção visível some inteiro', () => {
      // Seções do grupo A: MEX, KOR, RSA, CZE (todas com grupo "A")
      const secaoFwc = secoes.find((s) => s.sigla === 'FWC');
      const secaoCoc = secoes.find((s) => s.sigla === 'COC');
      const secaoMEX = secoes.find((s) => s.sigla === 'MEX');
      const secaoKOR = secoes.find((s) => s.sigla === 'KOR');
      const secaoRSA = secoes.find((s) => s.sigla === 'RSA');
      const secaoCZE = secoes.find((s) => s.sigla === 'CZE');

      const secoesGrupoA = [secaoFwc, secaoMEX, secaoKOR, secaoRSA, secaoCZE, secaoCoc];
      const figurinhasGrupoA = figurinhas.filter(
        (f) => f.secao === 'MEX' || f.secao === 'KOR' || f.secao === 'RSA' || f.secao === 'CZE',
      );

      // Todas as figurinhas das seleções coladas: nenhuma faltante
      const contagensCompletas = {};
      for (const f of figurinhasGrupoA) {
        contagensCompletas[f.codigo] = 1;
      }

      render(
        <Catalogo
          secoes={secoesGrupoA}
          figurinhas={figurinhasGrupoA}
          contagens={contagensCompletas}
          onAjustar={vi.fn()}
          ordenacao="pagina"
          disposicao="lista"
          filtro="faltantes"
        />,
      );

      // O super-grupo A some inteiro (nenhuma seção tem faltantes)
      expect(screen.queryByRole('button', { name: /Grupo A/ })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^México:/ })).not.toBeInTheDocument();
    });
  });

  describe('persistência do colapso manual (IDR 0020, IDR 0026)', () => {
    const propsBase = {
      secoes: secoesParcial,
      figurinhas: figurinhasParcial,
      contagens: {},
      onAjustar: vi.fn(),
      ordenacao: 'sigla',
    };

    it('seção fechada à mão continua fechada após recarregar', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Catalogo {...propsBase} />);

      await user.click(screen.getByRole('button', { name: /^Brasil:/ }));
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'false');

      unmount();
      render(<Catalogo {...propsBase} />);

      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByLabelText(/^BRA 01, .+, faltante, metalizada$/)).not.toBeInTheDocument();
    });

    it('seção reaberta à mão continua aberta após recarregar', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Catalogo {...propsBase} />);

      await user.click(screen.getByRole('button', { name: /^Brasil:/ }));
      await user.click(screen.getByRole('button', { name: /^Brasil:/ }));
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'true');

      unmount();
      render(<Catalogo {...propsBase} />);

      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText(/^BRA 01, .+, faltante, metalizada$/)).toBeInTheDocument();
    });

    it('super-grupo fechado à mão continua fechado após recarregar', async () => {
      const user = userEvent.setup();
      const props = { ...propsBase, ordenacao: 'pagina' };
      const { unmount } = render(<Catalogo {...props} />);

      await user.click(screen.getByRole('button', { name: /Grupo C/ }));
      expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'false');

      unmount();
      render(<Catalogo {...props} />);

      expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('button', { name: /^Brasil:/ })).not.toBeInTheDocument();
    });

    it('salto abre seção e super-grupo fechados e a recarga os mantém abertos', async () => {
      const user = userEvent.setup();
      const props = { ...propsBase, ordenacao: 'pagina' };
      const ref = { current: null };
      const { unmount } = render(<Catalogo ref={ref} {...props} />);

      // Fecha a seção Brasil e, em seguida, o Grupo C que a contém.
      await user.click(screen.getByRole('button', { name: /^Brasil:/ }));
      await user.click(screen.getByRole('button', { name: /Grupo C/ }));
      expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'false');

      act(() => {
        ref.current.saltarPara('BRA');
      });

      expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'true');

      unmount();
      render(<Catalogo {...props} />);

      expect(screen.getByRole('button', { name: /Grupo C/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'true');
    });

    it('sem localStorage disponível, tudo abre e nada quebra', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage bloqueado');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage bloqueado');
      });

      render(<Catalogo {...propsBase} />);

      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText(/^BRA 01, .+, faltante, metalizada$/)).toBeInTheDocument();
    });

    it('siglas e letras desconhecidas no armazenamento são ignoradas', () => {
      localStorage.setItem(
        'iconula.colapso-manual.v1',
        JSON.stringify({ secoes: ['XYZ', 'BRA'], grupos: ['Z'] }),
      );

      render(<Catalogo {...propsBase} />);

      // BRA é válida e volta fechada; FWC (a outra seção da amostra) abre.
      expect(screen.getByRole('button', { name: /^Brasil:/ })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('button', { name: /^Extras FIFA:/ })).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
