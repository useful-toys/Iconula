// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { FaixaDeSecoes } from './FaixaDeSecoes.jsx';
import { secoes } from '../data/catalogo.js';
import { ordenarPorPagina, extrairSecoes } from '../data/catalogoOrdenacoes.js';

function placarDeExemplo() {
  return new Map([
    ['BRA', { coladas: 12, faltantes: 8, repetidas: 3, percentual: 60 }],
    ['FWC', { coladas: 5, faltantes: 15, repetidas: 0, percentual: 25 }],
    ['COC', { coladas: 14, faltantes: 0, repetidas: 2, percentual: 100 }],
  ]);
}

describe('FaixaDeSecoes', () => {
  it('renderiza as 50 seções com FWC no início e COC no fim', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    expect(botoes).toHaveLength(50);

    expect(botoes[0]).toHaveAttribute('aria-label', 'Saltar para Extras FIFA');
    expect(botoes[49]).toHaveAttribute('aria-label', 'Saltar para Coca-Cola');
  });

  it('cada botão tem nome acessível com o nome da seção', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    expect(screen.getByLabelText('Saltar para Brasil')).toBeInTheDocument();
    expect(screen.getByLabelText('Saltar para Argentina')).toBeInTheDocument();
  });

  it('a imagem da bandeira é decorativa (aria-hidden)', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    botoes.forEach((botao) => {
      const img = botao.querySelector('img');
      expect(img).toHaveAttribute('aria-hidden', 'true');
      expect(img).toHaveAttribute('alt', '');
    });
  });

  it('chama onSaltar com a sigla ao clicar em um botão', async () => {
    const user = userEvent.setup();
    const onSaltar = vi.fn();
    render(<FaixaDeSecoes secoes={secoes} onSaltar={onSaltar} />);

    await user.click(screen.getByLabelText('Saltar para Brasil'));
    expect(onSaltar).toHaveBeenCalledWith('BRA');
  });

  it('a faixa tem role navigation com label acessível', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Saltar para seção' })).toBeInTheDocument();
  });

  it('na ordenação por página, marca o início de cada grupo e a COC', () => {
    const ordenadas = extrairSecoes(ordenarPorPagina(secoes));
    render(<FaixaDeSecoes secoes={ordenadas} ordenacao="pagina" onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    const marcados = botoes.filter((botao) =>
      botao.classList.contains('faixa-de-secoes__botao--inicio-de-grupo'),
    );

    expect(marcados).toHaveLength(13);
    expect(botoes[0]).not.toHaveClass('faixa-de-secoes__botao--inicio-de-grupo');
    expect(botoes[1]).toHaveClass('faixa-de-secoes__botao--inicio-de-grupo');
    expect(botoes[2]).not.toHaveClass('faixa-de-secoes__botao--inicio-de-grupo');
    expect(botoes[botoes.length - 1]).toHaveClass('faixa-de-secoes__botao--inicio-de-grupo');
  });

  it('na ordenação por sigla, não marca nenhuma bandeira', () => {
    render(<FaixaDeSecoes secoes={secoes} ordenacao="sigla" onSaltar={vi.fn()} />);

    const marcados = screen
      .getAllByRole('button')
      .filter((botao) => botao.classList.contains('faixa-de-secoes__botao--inicio-de-grupo'));

    expect(marcados).toHaveLength(0);
  });

  it('na ordenação por página, cada bandeira recebe a classe de cor do seu grupo', () => {
    const ordenadas = extrairSecoes(ordenarPorPagina(secoes));
    render(<FaixaDeSecoes secoes={ordenadas} ordenacao="pagina" onSaltar={vi.fn()} />);

    const botoes = screen.getAllByRole('button');
    expect(botoes).toHaveLength(50);

    ordenadas.forEach((secao, indice) => {
      const chave =
        secao.tipo === 'especial' ? secao.sigla.toLowerCase() : secao.grupo.toLowerCase();
      expect(botoes[indice]).toHaveClass(`faixa-de-secoes__botao--grupo-${chave}`);
    });

    expect(botoes[0]).toHaveClass('faixa-de-secoes__botao--grupo-fwc');
    expect(botoes[49]).toHaveClass('faixa-de-secoes__botao--grupo-coc');
  });

  it('na ordenação por sigla, nenhuma bandeira recebe classe de cor de grupo', () => {
    render(<FaixaDeSecoes secoes={secoes} ordenacao="sigla" onSaltar={vi.fn()} />);

    const coloridas = screen
      .getAllByRole('button')
      .filter((botao) => /faixa-de-secoes__botao--grupo-/.test(botao.className));

    expect(coloridas).toHaveLength(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function mostrarComFoco(botao) {
    act(() => {
      botao.focus();
    });
  }

  it('mostra no foco por teclado a sigla, o nome e o progresso da seção', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />);

    mostrarComFoco(screen.getByLabelText('Saltar para Brasil'));

    expect(screen.getByText('BRA · Brasil · 12/20 60% ▯8 ×3')).toBeInTheDocument();
  });

  it('identifica os especiais com a própria sigla e nome', () => {
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />);

    mostrarComFoco(screen.getByLabelText('Saltar para Extras FIFA'));
    expect(screen.getByText('FWC · Extras FIFA · 5/20 25% ▯15 ×0')).toBeInTheDocument();

    act(() => {
      screen.getByLabelText('Saltar para Coca-Cola').focus();
    });
    expect(screen.getByText('COC · Coca-Cola · 14/14 100% ▯0 ×2')).toBeInTheDocument();
  });

  it('no hover de mouse aparece só depois do atraso', () => {
    vi.useFakeTimers();
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />);

    fireEvent.pointerOver(screen.getByLabelText('Saltar para Brasil'), { pointerType: 'mouse' });

    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(screen.queryByText(/^BRA · Brasil/)).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText(/^BRA · Brasil/)).toBeInTheDocument();
  });

  it('não mostra o tooltip enquanto o ponteiro é de toque', () => {
    vi.useFakeTimers();
    render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />);

    fireEvent.pointerOver(screen.getByLabelText('Saltar para Brasil'), { pointerType: 'touch' });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(/^BRA · Brasil/)).not.toBeInTheDocument();
  });

  it('some ao sair o ponteiro e ao perder o foco', () => {
    const { container } = render(
      <FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />,
    );
    const bra = screen.getByLabelText('Saltar para Brasil');

    mostrarComFoco(bra);
    expect(container.querySelector('.faixa-de-secoes__tooltip')).toBeInTheDocument();

    fireEvent.pointerOut(bra, { pointerType: 'mouse' });
    expect(container.querySelector('.faixa-de-secoes__tooltip')).not.toBeInTheDocument();

    mostrarComFoco(bra);
    act(() => {
      bra.blur();
    });
    expect(container.querySelector('.faixa-de-secoes__tooltip')).not.toBeInTheDocument();
  });

  it('some ao rolar a página', () => {
    const { container } = render(
      <FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />,
    );

    mostrarComFoco(screen.getByLabelText('Saltar para Brasil'));
    expect(container.querySelector('.faixa-de-secoes__tooltip')).toBeInTheDocument();

    fireEvent.scroll(window);
    expect(container.querySelector('.faixa-de-secoes__tooltip')).not.toBeInTheDocument();
  });

  it('renderiza um único tooltip, fora do contêiner rolável da faixa', () => {
    const { container } = render(
      <FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} placarPorSecao={placarDeExemplo()} />,
    );

    mostrarComFoco(screen.getByLabelText('Saltar para Brasil'));

    const tooltips = container.querySelectorAll('.faixa-de-secoes__tooltip');
    expect(tooltips).toHaveLength(1);
    expect(container.querySelector('.faixa-de-secoes__trilha')).not.toContainElement(tooltips[0]);
  });

  it('mantém o clique saltando e esconde o tooltip', () => {
    const onSaltar = vi.fn();
    const { container } = render(
      <FaixaDeSecoes secoes={secoes} onSaltar={onSaltar} placarPorSecao={placarDeExemplo()} />,
    );
    const bra = screen.getByLabelText('Saltar para Brasil');

    mostrarComFoco(bra);
    expect(container.querySelector('.faixa-de-secoes__tooltip')).toBeInTheDocument();

    fireEvent.click(bra);
    expect(onSaltar).toHaveBeenCalledWith('BRA');
    expect(container.querySelector('.faixa-de-secoes__tooltip')).not.toBeInTheDocument();
  });

  // Sem barra de rolagem visível: fade nas bordas e arrasto pelo mouse
  // substituem a dica de continuidade (IDR 0058, Tarefa 0030-0001).
  describe('sem barra — fade e arrasto (IDR 0058)', () => {
    function configurarDimensoes(trilha, { scrollWidth, clientWidth, scrollLeft = 0 }) {
      Object.defineProperty(trilha, 'scrollWidth', { value: scrollWidth, configurable: true });
      Object.defineProperty(trilha, 'clientWidth', { value: clientWidth, configurable: true });
      trilha.scrollLeft = scrollLeft;
    }

    it('mostra o fade esquerdo só depois de rolar e o direito enquanto há conteúdo', () => {
      const { container } = render(<FaixaDeSecoes secoes={secoes} onSaltar={vi.fn()} />);
      const trilha = container.querySelector('.faixa-de-secoes__trilha');

      configurarDimensoes(trilha, { scrollWidth: 2000, clientWidth: 400, scrollLeft: 0 });
      fireEvent.scroll(trilha);
      expect(container.querySelector('.faixa-de-secoes__fade--esquerda')).not.toHaveClass(
        'faixa-de-secoes__fade--visivel',
      );
      expect(container.querySelector('.faixa-de-secoes__fade--direita')).toHaveClass(
        'faixa-de-secoes__fade--visivel',
      );

      configurarDimensoes(trilha, { scrollWidth: 2000, clientWidth: 400, scrollLeft: 1600 });
      fireEvent.scroll(trilha);
      expect(container.querySelector('.faixa-de-secoes__fade--esquerda')).toHaveClass(
        'faixa-de-secoes__fade--visivel',
      );
      expect(container.querySelector('.faixa-de-secoes__fade--direita')).not.toHaveClass(
        'faixa-de-secoes__fade--visivel',
      );
    });

    it('arrastar o mouse além do limiar rola a trilha, marca "grabbing" e não salta ao clicar', () => {
      const onSaltar = vi.fn();
      const { container } = render(<FaixaDeSecoes secoes={secoes} onSaltar={onSaltar} />);
      const trilha = container.querySelector('.faixa-de-secoes__trilha');
      const bra = screen.getByLabelText('Saltar para Brasil');
      configurarDimensoes(trilha, { scrollWidth: 2000, clientWidth: 400, scrollLeft: 100 });

      fireEvent.mouseDown(bra, { button: 0, clientX: 200 });
      expect(trilha).not.toHaveClass('faixa-de-secoes__trilha--arrastando');

      fireEvent.mouseMove(window, { clientX: 150 });
      expect(trilha).toHaveClass('faixa-de-secoes__trilha--arrastando');
      expect(trilha.scrollLeft).toBe(150);

      fireEvent.mouseUp(window);
      expect(trilha).not.toHaveClass('faixa-de-secoes__trilha--arrastando');

      fireEvent.click(bra);
      expect(onSaltar).not.toHaveBeenCalled();
    });

    it('mover até o limiar (≤5px) ainda salta ao clicar', () => {
      const onSaltar = vi.fn();
      const { container } = render(<FaixaDeSecoes secoes={secoes} onSaltar={onSaltar} />);
      const trilha = container.querySelector('.faixa-de-secoes__trilha');
      const bra = screen.getByLabelText('Saltar para Brasil');
      configurarDimensoes(trilha, { scrollWidth: 2000, clientWidth: 400, scrollLeft: 100 });

      fireEvent.mouseDown(bra, { button: 0, clientX: 200 });
      fireEvent.mouseMove(window, { clientX: 197 });
      expect(trilha).not.toHaveClass('faixa-de-secoes__trilha--arrastando');
      fireEvent.mouseUp(window);

      fireEvent.click(bra);
      expect(onSaltar).toHaveBeenCalledWith('BRA');
    });
  });
});
