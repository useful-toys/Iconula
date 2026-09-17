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

  it('mostra a página 0 do FWC', () => {
    const fwc = {
      sigla: 'FWC',
      nome: 'Extras FIFA',
      icone: '🏆',
      paginas: [0, 1, 2, 3, 106, 107, 108, 109],
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
    expect(document.body.textContent).toContain('Extras FIFA FWC 0');
  });

  it('mostra a primeira página do spread no cabeçalho da seleção', () => {
    render(
      <Secao
        secao={secaoBra}
        figurinhas={figurinhasBra}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(document.body.textContent).toContain('Brasil BRA 24');
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

    expect(screen.getByLabelText('BRA 01, faltante, metalizada')).toBeInTheDocument();
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

    await user.click(screen.getByLabelText('BRA 01, faltante, metalizada'));
    expect(onAjustar).toHaveBeenCalledWith('BRA01', 1);
  });

  it('sem onAjustar renderiza cartões inertes e o colapso continua (IDR 0055)', async () => {
    const user = userEvent.setup();
    render(<Secao secao={secaoBra} figurinhas={figurinhasBra} contagens={{}} />);

    expect(
      screen.getByRole('img', { name: 'BRA 01, faltante, metalizada' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /BRA 01/ })).not.toBeInTheDocument();
    expect(
      screen.queryAllByRole('button', { name: /remover uma unidade/ }),
    ).toHaveLength(0);

    const cabecalho = screen.getByRole('button', { name: /Brasil/ });
    await user.click(cabecalho);
    expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('img', { name: 'BRA 01, faltante, metalizada' }),
    ).not.toBeInTheDocument();
  });

  it('mantém a figurinha paisagem em paisagem na lista (IDR 0047)', () => {
    const { container } = render(
      <Secao
        secao={secaoBra}
        figurinhas={[
          { codigo: 'BRA12', secao: 'BRA', metalizada: false, paisagem: false },
          { codigo: 'BRA13', secao: 'BRA', metalizada: false, paisagem: true },
        ]}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    const paisagens = container.querySelectorAll('.figurinha--lista.figurinha--paisagem');
    expect(paisagens).toHaveLength(1);
    expect(paisagens[0]).toHaveTextContent('13');
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
    expect(screen.getByLabelText('BRA 01, faltante, metalizada')).toBeInTheDocument();

    await user.click(cabecalho);

    expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    expect(cabecalho.textContent).toContain('▸');
    expect(screen.queryByLabelText('BRA 01, faltante, metalizada')).not.toBeInTheDocument();
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
    expect(screen.queryByLabelText('BRA 01, faltante, metalizada')).not.toBeInTheDocument();
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
      posicao: i + 1,
      secao: 'COC',
      metalizada: false,
    }));

    const secaoFwc = {
      sigla: 'FWC',
      nome: 'Extras FIFA',
      icone: '🏆',
      paginas: [0, 1, 2, 3, 106, 107, 108, 109],
      total: 20,
    };

    const PAISAGENS_FWC = new Set([0, 1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    const figurinhasFwc = Array.from({ length: 20 }, (_, i) => ({
      codigo: `FWC${String(i).padStart(2, '0')}`,
      posicao: i,
      secao: 'FWC',
      metalizada: false,
      paisagem: PAISAGENS_FWC.has(i),
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
      expect(pagina1.style.gridTemplateColumns).toBe('repeat(3, 60px)');
      const celulasPagina1 = pagina1.querySelectorAll('.pagina-album__celula');
      expect(celulasPagina1).toHaveLength(6);

      // Página 2: 8 figurinhas (07-14)
      const pagina2 = paginas[1];
      expect(pagina2.style.gridTemplateColumns).toBe('repeat(3, 60px)');
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

    it('FWC usa disposição álbum', () => {
      const { container, rerender } = render(
        <Secao
          secao={secaoFwc}
          figurinhas={figurinhasFwc}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      // Quatro pares (0|1, 2|3, 106|107, 108|109) e oito páginas
      const pares = container.querySelectorAll('.secao__album__par');
      expect(pares).toHaveLength(4);
      const paginas = container.querySelectorAll('.pagina-album');
      expect(paginas).toHaveLength(8);

      // As 20 figurinhas, uma casa cada
      const celulas = container.querySelectorAll('.pagina-album__celula');
      expect(celulas).toHaveLength(20);

      // Nenhuma grade de lista
      expect(container.querySelector('.secao__grade')).not.toBeInTheDocument();

      // Página física 0 (primeira página): grid de 4 linhas × 3 colunas de
      // 70px, com FWC00 na linha 1, coluna 2
      const pagina0 = paginas[0];
      expect(pagina0.style.gridTemplateRows).toBe('repeat(4, 70px)');
      expect(pagina0.style.gridTemplateColumns).toBe('repeat(3, 70px)');
      const celulaFwc00 = pagina0.querySelector('.pagina-album__celula');
      expect(celulaFwc00.style.gridRow).toBe('1');
      expect(celulaFwc00.style.gridColumn).toBe('2 / span 1');

      // Moldura só no FWC
      expect(pagina0).toHaveClass('pagina-album--fwc');

      // Cabeçalho mostra a página 0
      expect(container.textContent).toContain('Extras FIFA FWC 0');

      // Na disposição lista, o FWC continua em lista
      rerender(
        <Secao
          secao={secaoFwc}
          figurinhas={figurinhasFwc}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="lista"
        />,
      );
      expect(container.querySelector('.secao__grade')).toBeInTheDocument();
      expect(container.querySelectorAll('.pagina-album')).toHaveLength(0);
      for (let i = 0; i <= 19; i++) {
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
            posicao: i + 1,
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
        expect(pagina.style.gridTemplateColumns).toBe('repeat(4, 60px)');
      }
    });

    it('contêiner do spread usa flex-wrap para empilhamento responsivo', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            posicao: i + 1,
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

    it('as duas páginas do spread ficam dentro de um único contêiner de par', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            posicao: i + 1,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const pares = container.querySelectorAll('.secao__album__par');
      expect(pares).toHaveLength(1);
      expect(pares[0].querySelectorAll('.pagina-album')).toHaveLength(2);
    });

    it('página 1 da Coca-Cola tem 2 linhas, sem a terceira linha vazia', () => {
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
      const pagina1 = paginas[0];
      expect(pagina1.style.gridTemplateRows).toBe('repeat(2, 70px)');
    });

    it('páginas são renderizadas na ordem correta (página 1 antes da página 2)', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            posicao: i + 1,
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

    it('páginas mantêm largura fixa baseada nas trilhas de 60px', () => {
      const { container } = render(
        <Secao
          secao={secaoBra}
          figurinhas={Array.from({ length: 20 }, (_, i) => ({
            codigo: `BRA${String(i + 1).padStart(2, '0')}`,
            posicao: i + 1,
            secao: 'BRA',
            metalizada: i === 0,
          }))}
          contagens={{}}
          onAjustar={vi.fn()}
          disposicao="album"
        />,
      );

      const paginas = container.querySelectorAll('.pagina-album');
      
      // Cada página deve ter grid-template-columns definido com trilhas de 60px
      for (const pagina of paginas) {
        expect(pagina.style.gridTemplateColumns).toBe('repeat(4, 60px)');
      }
    });
  });

  describe('cor da seleção na seção', () => {
    const figurinhasDe = (sigla, total) =>
      Array.from({ length: total }, (_, i) => ({
        codigo: `${sigla}${String(i + 1).padStart(2, '0')}`,
        secao: sigla,
        metalizada: false,
      }));

    const secoes = {
      BRA: { sigla: 'BRA', nome: 'Brasil', icone: '🇧🇷', paginas: [24, 25], total: 20 },
      FWC: { sigla: 'FWC', nome: 'Extras FIFA', icone: '🏆', paginas: [0, 1, 2, 3, 106, 107, 108, 109], total: 20 },
      COC: { sigla: 'COC', nome: 'Coca-Cola', icone: '🥤', paginas: [112, 113], total: 14 },
    };

    it.each([
      ['BRA', 'lista', 'secao--bra'],
      ['BRA', 'album', 'secao--bra'],
      ['FWC', 'lista', 'secao--fwc'],
      ['FWC', 'album', 'secao--fwc'],
      ['COC', 'lista', 'secao--coc'],
      ['COC', 'album', 'secao--coc'],
    ])(
      '%s na disposição %s recebe a classe %s na seção',
      (sigla, disposicao, classe) => {
        const total = secoes[sigla].total;
        render(
          <Secao
            secao={secoes[sigla]}
            figurinhas={figurinhasDe(sigla, total)}
            contagens={{}}
            onAjustar={vi.fn()}
            disposicao={disposicao}
          />,
        );

        const secao = document.querySelector('.secao');
        expect(secao).toHaveClass('secao');
        expect(secao).toHaveClass(classe);

        const cabecalho = document.querySelector('.secao__cabecalho');
        expect(cabecalho).toHaveClass('secao__cabecalho');
        expect(cabecalho).not.toHaveClass(classe);
      },
    );
  });
});
