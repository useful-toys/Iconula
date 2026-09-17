// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PaginaDoAlbum } from './PaginaDoAlbum.jsx';
import { layoutDeSecao } from '../data/catalogoLayout.js';

const secaoBrasil = { sigla: 'BRA', nome: 'Brasil', icone: '🇧🇷', paginas: [4, 5] };

const figurinhasBrasil = Array.from({ length: 20 }, (_, i) => ({
  codigo: `BRA${String(i + 1).padStart(2, '0')}`,
  posicao: i + 1,
  metalizada: i === 0,
  paisagem: i + 1 === 13,
}));

describe('PaginaDoAlbum', () => {
  it('renderiza as figurinhas da página 1 nas posições corretas', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const celulas = container.querySelectorAll('.pagina-album__celula');
    expect(celulas).toHaveLength(10);

    // 01 e 02 nas trilhas 3 e 4, linha 1
    const celula01 = celulas[0];
    expect(celula01.style.gridColumn).toBe('3 / span 1');
    expect(celula01.style.gridRow).toBe('1');

    const celula02 = celulas[1];
    expect(celula02.style.gridColumn).toBe('4 / span 1');
    expect(celula02.style.gridRow).toBe('1');

    // 03-06 nas trilhas 1-4, linha 2
    const celula03 = celulas[2];
    expect(celula03.style.gridColumn).toBe('1 / span 1');
    expect(celula03.style.gridRow).toBe('2');

    const celula06 = celulas[5];
    expect(celula06.style.gridColumn).toBe('4 / span 1');
    expect(celula06.style.gridRow).toBe('2');

    // 07-10 nas trilhas 1-4, linha 3
    const celula07 = celulas[6];
    expect(celula07.style.gridColumn).toBe('1 / span 1');
    expect(celula07.style.gridRow).toBe('3');

    const celula10 = celulas[9];
    expect(celula10.style.gridColumn).toBe('4 / span 1');
    expect(celula10.style.gridRow).toBe('3');
  });

  it('renderiza as figurinhas da página 2 nas posições corretas', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 2);
    const posicoesPagina2 = layout.posicoes.filter((p) => p.pagina === 2);

    const { container } = render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina2}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const celulas = container.querySelectorAll('.pagina-album__celula');
    expect(celulas).toHaveLength(10);

    // 11 e 12 nas trilhas 1 e 2, linha 1
    const celula11 = celulas[0];
    expect(celula11.style.gridColumn).toBe('1 / span 1');
    expect(celula11.style.gridRow).toBe('1');

    const celula12 = celulas[1];
    expect(celula12.style.gridColumn).toBe('2 / span 1');
    expect(celula12.style.gridRow).toBe('1');

    // 13 paisagem nas trilhas 3-4, linha 1
    const celula13 = celulas[2];
    expect(celula13.style.gridColumn).toBe('3 / span 2');
    expect(celula13.style.gridRow).toBe('1');
    expect(celula13).toHaveClass('pagina-album__celula--paisagem');

    // 14-17 nas trilhas 1-4, linha 2
    const celula14 = celulas[3];
    expect(celula14.style.gridColumn).toBe('1 / span 1');
    expect(celula14.style.gridRow).toBe('2');

    // 18-20 nas trilhas 2-4, linha 3
    const celula18 = celulas[7];
    expect(celula18.style.gridColumn).toBe('2 / span 1');
    expect(celula18.style.gridRow).toBe('3');

    const celula19 = celulas[8];
    expect(celula19.style.gridColumn).toBe('3 / span 1');
    expect(celula19.style.gridRow).toBe('3');

    const celula20 = celulas[9];
    expect(celula20.style.gridColumn).toBe('4 / span 1');
    expect(celula20.style.gridRow).toBe('3');
  });

  it('renderiza o grid com as colunas e as linhas da página (seleção: 4 × 3)', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const grid = container.querySelector('.pagina-album');
    expect(grid.style.gridTemplateColumns).toBe('repeat(4, 60px)');
    expect(grid.style.gridTemplateRows).toBe('repeat(3, 70px)');
  });

  it('renderiza o grid com as colunas e as linhas da página (Coca-Cola, página 1: 3 × 2)', () => {
    const secaoCoc = { sigla: 'COC', nome: 'Coca-Cola', icone: '🥤', paginas: [112, 113] };
    const figurinhasCoc = Array.from({ length: 14 }, (_, i) => ({
      codigo: `COC${String(i + 1).padStart(2, '0')}`,
      posicao: i + 1,
      metalizada: false,
    }));
    const layout = layoutDeSecao(secaoCoc);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasCoc}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const grid = container.querySelector('.pagina-album');
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 60px)');
    expect(grid.style.gridTemplateRows).toBe('repeat(2, 70px)');
  });

  it('a figurinha 01 fica sobre a terceira posição das linhas cheias', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const celulas = container.querySelectorAll('.pagina-album__celula');
    const celula01 = celulas[0];
    const celula03 = celulas[2];

    // 01 está na trilha 3, 03 também está na trilha 3
    expect(celula01.style.gridColumn).toBe('3 / span 1');
    expect(celula03.style.gridColumn).toBe('1 / span 1');

    // 01 está na linha 1, 03 está na linha 2
    expect(celula01.style.gridRow).toBe('1');
    expect(celula03.style.gridRow).toBe('2');
  });

  it('exibe os códigos das figurinhas', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /BRA 01, faltante/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /BRA 10, faltante/ })).toBeInTheDocument();
  });

  it('acha a figurinha pelo campo `posicao`, não pelo índice no array (posições que não começam em 1)', () => {
    // Fixture no estilo do FWC: a primeira figurinha do array tem posição 5.
    const figurinhasComPosicaoDeslocada = [
      { codigo: 'XXX05', posicao: 5, metalizada: false },
      { codigo: 'XXX06', posicao: 6, metalizada: false },
    ];
    const posicoes = [
      { posicao: 6, pagina: 1, linha: 1, trilha: 1, trilhas: 1 },
      { posicao: 5, pagina: 1, linha: 1, trilha: 2, trilhas: 1 },
    ];

    render(
      <PaginaDoAlbum
        pagina={{ linhas: 1, colunas: 2 }}
        figurinhas={figurinhasComPosicaoDeslocada}
        posicoes={posicoes}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    // XXX06 (índice 1 no array) vai para a trilha 1; XXX05 (índice 0) vai
    // para a trilha 2 — o índice no array não bate com a trilha.
    const celulas = screen.getAllByRole('button');
    expect(celulas[0]).toHaveAccessibleName(/XXX 06/);
    expect(celulas[1]).toHaveAccessibleName(/XXX 05/);
  });

  it('sem onAjustar os cartões ficam inertes (IDR 0055)', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

    render(
      <PaginaDoAlbum
        pagina={paginaLayout}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
      />,
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(screen.getAllByRole('img')).toHaveLength(10);
  });

  describe('FWC (comMoldura): casa de 70px e moldura', () => {
    const secaoFwc = {
      sigla: 'FWC',
      nome: 'Extras FIFA',
      icone: '🏆',
      paginas: [0, 1, 2, 3, 106, 107, 108, 109],
    };
    const PAISAGENS_FWC = new Set([0, 1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    const figurinhasFwc = Array.from({ length: 20 }, (_, i) => ({
      codigo: `FWC${String(i).padStart(2, '0')}`,
      posicao: i,
      metalizada: false,
      paisagem: PAISAGENS_FWC.has(i),
    }));

    it('página do FWC com a classe de moldura e trilhas de 70px', () => {
      const layout = layoutDeSecao(secaoFwc);
      // Página física 1 (índice 2 do layout): FWC01–03 paisagem, FWC04 retrato
      const paginaLayout = layout.paginas.find((p) => p.pagina === 2);
      const posicoesPagina = layout.posicoes.filter((p) => p.pagina === 2);

      const { container } = render(
        <PaginaDoAlbum
          pagina={paginaLayout}
          figurinhas={figurinhasFwc}
          posicoes={posicoesPagina}
          contagens={{}}
          onAjustar={vi.fn()}
          comMoldura
        />
      );

      const grid = container.querySelector('.pagina-album');
      expect(grid).toHaveClass('pagina-album--fwc');
      expect(grid.style.gridTemplateColumns).toBe('repeat(3, 70px)');
      expect(grid.style.gridTemplateRows).toBe('repeat(4, 70px)');
    });

    it('FWC01 paisagem numa casa de uma trilha', () => {
      const layout = layoutDeSecao(secaoFwc);
      const paginaLayout = layout.paginas.find((p) => p.pagina === 2);
      const posicoesPagina = layout.posicoes.filter((p) => p.pagina === 2);

      render(
        <PaginaDoAlbum
          pagina={paginaLayout}
          figurinhas={figurinhasFwc}
          posicoes={posicoesPagina}
          contagens={{}}
          onAjustar={vi.fn()}
          comMoldura
        />
      );

      const celulaFwc01 = screen.getByRole('button', { name: /FWC 01/ }).closest('.pagina-album__celula');
      expect(celulaFwc01).toHaveClass('pagina-album__celula--paisagem');
      expect(celulaFwc01.style.gridColumn).toBe('3 / span 1');
    });

    it('seleção sem moldura', () => {
      const layout = layoutDeSecao(secaoBrasil);
      const paginaLayout = layout.paginas.find((p) => p.pagina === 1);
      const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);

      const { container } = render(
        <PaginaDoAlbum
          pagina={paginaLayout}
          figurinhas={figurinhasBrasil}
          posicoes={posicoesPagina1}
          contagens={{}}
          onAjustar={vi.fn()}
        />
      );

      const grid = container.querySelector('.pagina-album');
      expect(grid).not.toHaveClass('pagina-album--fwc');
      expect(grid.style.gridTemplateColumns).toBe('repeat(4, 60px)');
    });
  });
});
