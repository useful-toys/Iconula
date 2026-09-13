// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Cabecalho } from './Cabecalho.jsx';
import { Controles } from './Controles.jsx';
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
        secoes={secoes}
        onSaltar={vi.fn()}
      />,
    );

    expect(screen.getByText('ICONULA 2026')).toBeInTheDocument();
    expect(textoDaTela()).toContain('412/994');
    expect(textoDaTela()).toContain('41%');
    expect(textoDaTela()).toContain('▢');
    expect(textoDaTela()).toContain('582');
    expect(textoDaTela()).toContain('×');
    expect(textoDaTela()).toContain('37');
    expect(textoDaTela()).toContain('—');
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
    expect(textoDaTela()).toContain('▢994');
    expect(textoDaTela()).toContain('×0');
    expect(textoDaTela()).toContain('—');
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
      >
        <Controles
          ordenacao="pagina"
          onTrocarOrdenacao={vi.fn()}
          onDesfazer={vi.fn()}
          onSignOut={vi.fn()}
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

  it('coloca título, controles e faixa dentro do cabeçalho, na ordem', () => {
    const { container } = renderComControles({
      disposicao: 'lista',
      onTrocarDisposicao: vi.fn(),
      filtro: 'todas',
      onTrocarFiltro: vi.fn(),
    });

    const header = container.querySelector('header.cabecalho');
    const titulo = screen.getByText('ICONULA 2026');
    const grupos = container.querySelectorAll('.controles__segmentado');
    const desfazer = screen.getByRole('button', { name: 'desfazer a última alteração' });
    const menu = screen.getByRole('button', { name: /menu de ações/ });

    expect(header).toContainElement(titulo);
    expect(grupos).toHaveLength(3);
    for (const grupo of grupos) {
      expect(header).toContainElement(grupo);
    }
    expect(header).toContainElement(desfazer);
    expect(header).toContainElement(menu);
    expect(screen.getByRole('navigation', { name: 'Saltar para seção' })).toBeInTheDocument();

    expect(estaAntes(titulo, grupos[0])).toBe(true);
    expect(estaAntes(grupos[grupos.length - 1], desfazer)).toBe(true);
    expect(estaAntes(desfazer, menu)).toBe(true);
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
    const desfazer = screen.getByRole('button', { name: 'desfazer a última alteração' });
    const menu = screen.getByRole('button', { name: /menu de ações/ });

    expect(estaAntes(titulo, grupos[0])).toBe(true);
    expect(estaAntes(grupos[grupos.length - 1], desfazer)).toBe(true);
    expect(estaAntes(desfazer, menu)).toBe(true);
  });
});
