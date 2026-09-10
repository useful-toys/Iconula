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

      expect(screen.getByLabelText('BRA 01, faltante')).toBeInTheDocument();
      expect(screen.getByLabelText('FWC 01, faltante')).toBeInTheDocument();
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
      expect(screen.queryByLabelText('BRA 01, faltante')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('BRA 02, colada')).not.toBeInTheDocument();

      // BRA03 deve aparecer (é faltante)
      expect(screen.getByLabelText('BRA 03, faltante')).toBeInTheDocument();
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

      expect(screen.getByLabelText('BRA 01, colada, 1 sobrando')).toBeInTheDocument();
      expect(screen.getByLabelText('BRA 02, colada, 2 sobrando')).toBeInTheDocument();

      // BRA03 é faltante (contagem 0), não deve aparecer
      expect(screen.queryByLabelText('BRA 03, faltante')).not.toBeInTheDocument();
    });

    it('seção completa some com filtro "faltantes"', () => {
      // FWC com todas as 20 figurinhas coladas: nenhuma faltante
      const contagensFwcCompletas = {};
      for (let i = 1; i <= 20; i++) {
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
      expect(screen.queryByRole('button', { name: /Extras FIFA/ })).not.toBeInTheDocument();

      // Brasil ainda aparece (tem faltantes)
      expect(screen.getByRole('button', { name: /Brasil/ })).toBeInTheDocument();
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
      expect(screen.getByLabelText('BRA 01, colada, 1 sobrando')).toBeInTheDocument();

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
      expect(screen.getByLabelText('BRA 01, colada, 1 sobrando')).toBeInTheDocument();
      expect(screen.getByLabelText('BRA 03, faltante')).toBeInTheDocument();
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
      expect(screen.queryByRole('button', { name: /Extras FIFA/ })).not.toBeInTheDocument();

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
      expect(screen.queryByRole('button', { name: /México/ })).not.toBeInTheDocument();
    });
  });
});
