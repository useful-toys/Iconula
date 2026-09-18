// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Cabecalho } from './Cabecalho.jsx';
import { Controles } from './Controles.jsx';
import { MenuDeAcoes } from './MenuDeAcoes.jsx';
import { MenuDeCompartilhar } from './MenuDeCompartilhar.jsx';
import { secoes } from '../data/catalogo.js';
import {
  ordenarPorPagina,
  ordenarPorSigla,
  extrairSecoes,
} from '../data/catalogoOrdenacoes.js';

function textoDaTela() {
  return document.body.textContent;
}

describe('Cabecalho', () => {
  it('renderiza o título com a notação compacta', () => {
    render(
      <Cabecalho
        coladas={412}
        faltantes={582}
        repetidas={37}
        percentual={41}
        atualizadoEm="12:34"
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(screen.getByText('ICONULA 2026')).toBeInTheDocument();
    expect(textoDaTela()).toContain('ICONULA 2026·412/99441%▯582×37·12:34');
  });

  it('escreve o nome acessível por extenso', () => {
    render(
      <Cabecalho
        coladas={412}
        faltantes={582}
        repetidas={37}
        percentual={41}
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/412 de 994/)).toBeInTheDocument();
    expect(screen.getByLabelText(/41 por cento/)).toBeInTheDocument();
    expect(screen.getByLabelText(/582 faltantes/)).toBeInTheDocument();
    expect(screen.getByLabelText(/37 repetidas/)).toBeInTheDocument();
    expect(screen.getByLabelText(/atualizado às —/)).toBeInTheDocument();
  });

  it('exibe o travessão quando não há carimbo de atualização', () => {
    render(
      <Cabecalho
        coladas={0}
        faltantes={994}
        repetidas={0}
        percentual={0}
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(textoDaTela()).toContain('0/994');
    expect(textoDaTela()).toContain('0%');
    expect(textoDaTela()).toContain('▯994');
    expect(textoDaTela()).toContain('×0');
    expect(textoDaTela()).toContain('—');
  });

  describe('indicador "não salvo" (IDR 0027)', () => {
    it('troca o relógio por "não salvo" com a prop', () => {
      render(
        <Cabecalho
          coladas={412}
          faltantes={582}
          repetidas={37}
          percentual={41}
          atualizadoEm="12:34"
          naoSalvo
          secoes={secoes}
          onSaltar={vi.fn()}
        />,
      );

      expect(screen.getByText('não salvo')).toBeInTheDocument();
      expect(screen.queryByText('12:34')).not.toBeInTheDocument();
      expect(screen.getByLabelText(/não salvo/)).toBeInTheDocument();
      expect(screen.queryByLabelText(/atualizado às/)).not.toBeInTheDocument();
    });

    it('sem a prop, mantém o relógio e o nome acessível de atualização', () => {
      render(
        <Cabecalho
          coladas={412}
          faltantes={582}
          repetidas={37}
          percentual={41}
          atualizadoEm="12:34"
          secoes={secoes}
          onSaltar={vi.fn()}
        />,
      );

      expect(screen.getByText('12:34')).toBeInTheDocument();
      expect(screen.queryByText('não salvo')).not.toBeInTheDocument();
      expect(screen.getByLabelText(/atualizado às 12:34/)).toBeInTheDocument();
    });
  });

  it('não renderiza barra de progresso nem cartões de estatística', () => {
    render(
      <Cabecalho
        coladas={10}
        faltantes={984}
        repetidas={0}
        percentual={1}
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(document.querySelector('progress')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.cartao-estatistica')).toHaveLength(0);
  });

  it('renderiza a faixa de bandeiras com as 50 seções', () => {
    render(
      <Cabecalho
        coladas={0}
        faltantes={994}
        repetidas={0}
        percentual={0}
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Saltar para seção' })).toBeInTheDocument();
    const botoes = screen.getAllByRole('button');
    expect(botoes.length).toBeGreaterThanOrEqual(50);
  });

  it('repassa a ordenação por página para a faixa de bandeiras', () => {
    const ordenadas = extrairSecoes(ordenarPorPagina(secoes));
    render(
      <Cabecalho
        coladas={0}
        faltantes={994}
        repetidas={0}
        percentual={0}
        secoes={ordenadas}
        ordenacao="pagina"
        onSaltar={vi.fn()}
      />,
    );

    expect(
      document.querySelectorAll('.faixa-de-secoes__botao--inicio-de-grupo'),
    ).toHaveLength(13);
  });

  it('repassa a ordenação por sigla para a faixa de bandeiras', () => {
    const ordenadas = extrairSecoes(ordenarPorSigla(secoes));
    render(
      <Cabecalho
        coladas={0}
        faltantes={994}
        repetidas={0}
        percentual={0}
        secoes={ordenadas}
        ordenacao="sigla"
        onSaltar={vi.fn()}
      />,
    );

    expect(
      document.querySelectorAll('.faixa-de-secoes__botao--inicio-de-grupo'),
    ).toHaveLength(0);
  });

  function renderComControles(propsDeControles = {}) {
    return render(
      <Cabecalho
        coladas={0}
        faltantes={994}
        repetidas={0}
        percentual={0}
        secoes={secoes}
        ordenacao="pagina"
        onSaltar={vi.fn()}
        compartilhar={
          <MenuDeCompartilhar onCopiarFaltantes={vi.fn()} onCopiarRepetidas={vi.fn()} />
        }
        avatar={<MenuDeAcoes onSignOut={vi.fn()} />}
      >
        <Controles
          ordenacao="pagina"
          onTrocarOrdenacao={vi.fn()}
          onDesfazer={vi.fn()}
          {...propsDeControles}
        />
      </Cabecalho>,
    );
  }

  function estaAntes(elemento, seguinte) {
    return Boolean(
      elemento.compareDocumentPosition(seguinte) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  }

  it('mantém título, avatar, grupos, desfazer e faixa dentro do header sticky', () => {
    const { container } = renderComControles({
      disposicao: 'lista',
      onTrocarDisposicao: vi.fn(),
      filtro: 'todas',
      onTrocarFiltro: vi.fn(),
    });

    const header = container.querySelector('header.cabecalho');
    const titulo = screen.getByText('ICONULA 2026');
    const compartilhar = screen.getByRole('button', { name: /compartilhar listas de troca/ });
    const avatar = screen.getByRole('button', { name: /menu de ações/ });
    const grupos = container.querySelectorAll('.controles__segmentado');
    const desfazer = screen.getByRole('button', { name: 'desfazer a última alteração' });
    const faixa = screen.getByRole('navigation', { name: 'Saltar para seção' });

    expect(header).toContainElement(titulo);
    expect(header).toContainElement(compartilhar);
    expect(header).toContainElement(avatar);
    expect(grupos).toHaveLength(3);
    for (const grupo of grupos) {
      expect(header).toContainElement(grupo);
    }
    expect(header).toContainElement(desfazer);
    expect(header).toContainElement(faixa);

    // O cabeçalho é o próprio elemento sticky — não há mais o bloco fixo.
    expect(container.querySelector('.cabecalho__fixo')).not.toBeInTheDocument();
  });

  it('põe compartilhar e avatar logo após o título e a faixa por último', () => {
    const { container } = renderComControles({
      disposicao: 'lista',
      onTrocarDisposicao: vi.fn(),
      filtro: 'todas',
      onTrocarFiltro: vi.fn(),
    });

    const titulo = screen.getByText('ICONULA 2026');
    const compartilhar = screen.getByRole('button', { name: /compartilhar listas de troca/ });
    const avatar = screen.getByRole('button', { name: /menu de ações/ });
    const grupos = container.querySelectorAll('.controles__segmentado');
    const desfazer = screen.getByRole('button', { name: 'desfazer a última alteração' });
    const faixa = screen.getByRole('navigation', { name: 'Saltar para seção' });

    expect(estaAntes(titulo, compartilhar)).toBe(true);
    expect(estaAntes(compartilhar, avatar)).toBe(true);
    expect(estaAntes(avatar, grupos[0])).toBe(true);
    expect(estaAntes(grupos[grupos.length - 1], desfazer)).toBe(true);
    expect(estaAntes(desfazer, faixa)).toBe(true);
  });

  it('mantém a ordem dos comandos sem o grupo de filtro', () => {
    const { container } = renderComControles({
      disposicao: 'album',
      onTrocarDisposicao: vi.fn(),
      filtro: 'todas',
      onTrocarFiltro: vi.fn(),
    });

    const grupos = container.querySelectorAll('.controles__segmentado');
    expect(grupos).toHaveLength(2);

    const titulo = screen.getByText('ICONULA 2026');
    const avatar = screen.getByRole('button', { name: /menu de ações/ });
    const desfazer = screen.getByRole('button', { name: 'desfazer a última alteração' });

    expect(estaAntes(titulo, avatar)).toBe(true);
    expect(estaAntes(avatar, grupos[0])).toBe(true);
    expect(estaAntes(grupos[grupos.length - 1], desfazer)).toBe(true);
  });

  describe('somente leitura (IDR 0055)', () => {
    it('com as props mostra o rótulo e o título como link para /', () => {
      render(
        <Cabecalho
          coladas={412}
          faltantes={582}
          repetidas={37}
          percentual={41}
          secoes={secoes}
          onSaltar={vi.fn()}
          somenteLeitura
          tituloComoLink
        />,
      );

      expect(textoDaTela()).toContain('somente leitura');
      expect(screen.getByLabelText(/somente leitura/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'ICONULA 2026' })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('sem as props a marcação é a atual', () => {
      render(
        <Cabecalho
          coladas={412}
          faltantes={582}
          repetidas={37}
          percentual={41}
          secoes={secoes}
          onSaltar={vi.fn()}
        />,
      );

      expect(textoDaTela()).not.toContain('somente leitura');
      expect(
        screen.queryByRole('link', { name: 'ICONULA 2026' }),
      ).not.toBeInTheDocument();
      expect(screen.getByText('ICONULA 2026')).toBeInTheDocument();
    });
  });

  it('repassa o progresso por seção ao tooltip da faixa', () => {
    const placarPorSecao = new Map([
      ['BRA', { coladas: 12, faltantes: 8, repetidas: 3, percentual: 60 }],
    ]);
    render(
      <Cabecalho
        coladas={412}
        faltantes={582}
        repetidas={37}
        percentual={41}
        secoes={secoes}
        onSaltar={vi.fn()}
        placarPorSecao={placarPorSecao}
      />,
    );

    act(() => {
      screen.getByLabelText('Saltar para Brasil').focus();
    });

    expect(screen.getByText('BRA · Brasil · 12/20 60% ▯8 ×3')).toBeInTheDocument();
  });

  describe('botão de estatísticas (IDR 0072)', () => {
    it('renderiza o botão com aria-label e abre a vista no clique', async () => {
      const user = userEvent.setup();
      const onAbrirEstatisticas = vi.fn();
      render(
        <Cabecalho
          coladas={0}
          faltantes={994}
          repetidas={0}
          percentual={0}
          secoes={secoes}
          onSaltar={vi.fn()}
          onAbrirEstatisticas={onAbrirEstatisticas}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Estatísticas' }));

      expect(onAbrirEstatisticas).toHaveBeenCalledTimes(1);
    });

    it('fica à esquerda do compartilhar na primeira linha', () => {
      render(
        <Cabecalho
          coladas={0}
          faltantes={994}
          repetidas={0}
          percentual={0}
          secoes={secoes}
          onSaltar={vi.fn()}
          onAbrirEstatisticas={vi.fn()}
          compartilhar={
            <MenuDeCompartilhar onCopiarFaltantes={vi.fn()} onCopiarRepetidas={vi.fn()} />
          }
          avatar={<MenuDeAcoes onSignOut={vi.fn()} />}
        />,
      );

      const estatisticas = screen.getByRole('button', { name: 'Estatísticas' });
      const compartilhar = screen.getByRole('button', {
        name: /compartilhar listas de troca/,
      });

      expect(estaAntes(estatisticas, compartilhar)).toBe(true);
    });

    it('sem o callback o botão não aparece', () => {
      render(
        <Cabecalho
          coladas={0}
          faltantes={994}
          repetidas={0}
          percentual={0}
          secoes={secoes}
          onSaltar={vi.fn()}
        />,
      );

      expect(
        screen.queryByRole('button', { name: 'Estatísticas' }),
      ).not.toBeInTheDocument();
    });
  });
});
