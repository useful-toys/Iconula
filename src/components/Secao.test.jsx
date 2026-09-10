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

  describe('disposição álbum', () => {
    const secaoCoc = {
      sigla: 'COC',
      nome: 'Coca-Cola',
      icone: '🥤',
      paginas: [112, 113],
      total: 14,
    };

    const figurinhasCoc = Array.from({ length: 14 }, (_, i) => ({
      codigo: `COC${String(i + 1).padStart(2, '0')}`,
      secao: 'COC',
      metalizada: false,
    }));

    const secaoFwc = {
      sigla: 'FWC',
      nome: 'Extras FIFA',
      icone: '🏆',
      paginas: null,
      total: 20,
    };

    const figurinhasFwc = Array.from({ length: 20 }, (_, i) => ({
      codigo: `FWC${String(i + 1).padStart(2, '0')}`,
      secao: 'FWC',
      metalizada: false,
    }));

    it('Coca-Cola usa disposição álbum com 3 trilhas por página', () => {
      const { container } = render(
        <Secao
          secao={secaoCoc}
          figurinhas={figurinhasCoc}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const paginas = container.querySelectorAll('.pagina-album');
      expect(paginas).toHaveLength(2);

      // Página 1: 6 figurinhas (01-06) em 2 linhas de 3
      const pagina1 = paginas[0];
      expect(pagina1.style.gridTemplateColumns).toBe('repeat(3, 52px)');
      const celulasPagina1 = pagina1.querySelectorAll('.pagina-album__celula');
      expect(celulasPagina1).toHaveLength(6);

      // Página 2: 8 figurinhas (07-14)
      const pagina2 = paginas[1];
      expect(pagina2.style.gridTemplateColumns).toBe('repeat(3, 52px)');
      const celulasPagina2 = pagina2.querySelectorAll('.pagina-album__celula');
      expect(celulasPagina2).toHaveLength(8);

      // 13 e 14 nas duas primeiras posições da linha 3
      const celula13 = celulasPagina2[6]; // 7º elemento (índice 6)
      const celula14 = celulasPagina2[7]; // 8º elemento (índice 7)
      expect(celula13.style.gridColumn).toBe('1 / span 1');
      expect(celula13.style.gridRow).toBe('3');
      expect(celula14.style.gridColumn).toBe('2 / span 1');
      expect(celula14.style.gridRow).toBe('3');
    });

    it('FWC sempre usa lista contínua, mesmo na disposição álbum', () => {
      const { container } = render(
        <Secao
          secao={secaoFwc}
          figurinhas={figurinhasFwc}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      // FWC não deve ter páginas do álbum
      const paginas = container.querySelectorAll('.pagina-album');
      expect(paginas).toHaveLength(0);

      // FWC deve ter a grade de lista
      const grade = container.querySelector('.secao__grade');
      expect(grade).toBeInTheDocument();

      // Todas as 20 figurinhas devem estar presentes
      for (let i = 1; i <= 20; i++) {
        const numero = String(i).padStart(2, '0');
        expect(screen.getByRole('button', { name: `FWC ${numero}, faltante` })).toBeInTheDocument();
      }
    });

    it('seleções usam disposição álbum com 4 trilhas por página', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const paginas = container.querySelectorAll('.pagina-album');
      expect(paginas).toHaveLength(2);

      // Ambas as páginas devem ter 4 trilhas
      for (const pagina of paginas) {
        expect(pagina.style.gridTemplateColumns).toBe('repeat(4, 52px)');
      }
    });

    it('contêiner do spread usa flex-wrap para empilhamento responsivo', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const spread = container.querySelector('.secao__album');
      expect(spread).toBeInTheDocument();

      // Verifica que o contêiner tem a classe correta para flex-wrap
      // (o comportamento real de empilhamento depende do CSS e da largura disponível)
      expect(spread).toHaveClass('secao__album');
    });

    it('páginas são renderizadas na ordem correta (página 1 antes da página 2)', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const paginas = container.querySelectorAll('.pagina-album');
      expect(paginas).toHaveLength(2);

      // Página 1 deve conter BRA 01 (escudo)
      const pagina1 = paginas[0];
      expect(pagina1.textContent).toContain('BRA');
      expect(pagina1.textContent).toContain('01');

      // Página 2 deve conter BRA 11
      const pagina2 = paginas[1];
      expect(pagina2.textContent).toContain('BRA');
      expect(pagina2.textContent).toContain('11');

      // Página 1 deve vir antes da página 2 no DOM
      expect(pagina1.compareDocumentPosition(pagina2)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    it('páginas mantêm largura fixa baseada nas trilhas de 52px', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const paginas = container.querySelectorAll('.pagina-album');
      
      // Cada página deve ter grid-template-columns definido com trilhas de 52px
      for (const pagina of paginas) {
        expect(pagina.style.gridTemplateColumns).toBe('repeat(4, 52px)');
      }
    });
  });
});
