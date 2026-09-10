// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PaginaDoAlbum } from './PaginaDoAlbum.jsx';
import { layoutDeSecao } from '../data/catalogoLayout.js';

const secaoBrasil = { sigla: 'BRA', nome: 'Brasil', icone: '🇧🇷', paginas: [4, 5] };

const figurinhasBrasil = Array.from({ length: 20 }, (_, i) => ({
  codigo: `BRA${String(i + 1).padStart(2, '0')}`,
  metalizada: i === 0,
}));

describe('PaginaDoAlbum', () => {
  it('renderiza as figurinhas da página 1 nas posições corretas', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const posicoesPagina1 = layout.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        secao={secaoBrasil}
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
    const posicoesPagina2 = layout.filter((p) => p.pagina === 2);

    const { container } = render(
      <PaginaDoAlbum
        secao={secaoBrasil}
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

  it('renderiza o grid com 4 trilhas para seleções', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const posicoesPagina1 = layout.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        secao={secaoBrasil}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const grid = container.querySelector('.pagina-album');
    expect(grid.style.gridTemplateColumns).toBe('repeat(4, 52px)');
  });

  it('renderiza o grid com 3 trilhas para Coca-Cola', () => {
    const secaoCoc = { sigla: 'COC', nome: 'Coca-Cola', icone: '🥤', paginas: [112, 113] };
    const figurinhasCoc = Array.from({ length: 14 }, (_, i) => ({
      codigo: `COC${String(i + 1).padStart(2, '0')}`,
      metalizada: false,
    }));
    const layout = layoutDeSecao(secaoCoc);
    const posicoesPagina1 = layout.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        secao={secaoCoc}
        figurinhas={figurinhasCoc}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    const grid = container.querySelector('.pagina-album');
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 52px)');
  });

  it('a figurinha 01 fica sobre a terceira posição das linhas cheias', () => {
    const layout = layoutDeSecao(secaoBrasil);
    const posicoesPagina1 = layout.filter((p) => p.pagina === 1);

    const { container } = render(
      <PaginaDoAlbum
        secao={secaoBrasil}
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
    const posicoesPagina1 = layout.filter((p) => p.pagina === 1);

    render(
      <PaginaDoAlbum
        secao={secaoBrasil}
        figurinhas={figurinhasBrasil}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /BRA 01, faltante/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /BRA 10, faltante/ })).toBeInTheDocument();
  });
});
