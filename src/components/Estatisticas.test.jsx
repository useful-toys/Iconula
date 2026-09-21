// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { corDoSelo } from '../lib/corDoSelo.js';
import Estatisticas from './Estatisticas.jsx';

// Testes da vista de estatísticas (IDR 0072): vista interna somente leitura,
// com os cinco blocos derivados da coleção em memória e gráficos à mão
// (TDR 0030). A coleção chega por prop, como em `App.jsx`; a vista não tem
// nenhum controle de edição de contagem.

function renderizar(contagens = {}) {
  const onVoltar = vi.fn();
  render(<Estatisticas contagens={contagens} onVoltar={onVoltar} />);
  return { onVoltar };
}

describe('Estatisticas', () => {
  it('mostra o título e o "← Voltar" que devolve à tela de origem', async () => {
    const user = userEvent.setup();
    const { onVoltar } = renderizar();

    expect(screen.getByRole('heading', { name: 'Estatísticas' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });

  it('renderiza os cinco blocos', () => {
    renderizar();

    expect(screen.getByRole('heading', { name: 'Resumo geral' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Progresso por grupo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Progresso por seção' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Repetidas por seção' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Histograma de contagens' })).toBeInTheDocument();
  });

  it('descreve cada gráfico por extenso no nome acessível', () => {
    renderizar({ BRA01: 1 });

    expect(
      screen.getByRole('img', {
        name: 'Brasil: 1 de 20 coladas, 19 faltantes, 5 por cento',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Grupo C: 1 de 80 coladas, 79 faltantes, 1 por cento',
      }),
    ).toBeInTheDocument();
  });

  it('com a coleção vazia mostra zeros e o histograma inteiro na faixa 0', () => {
    renderizar();

    expect(
      screen.getByRole('img', {
        name: 'Progresso do álbum: 0 por cento colado, 0 de 994 figurinhas',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Histograma de contagens: 994 figurinhas com 0/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('0 figurinhas repetidas no total.')).toBeInTheDocument();
  });

  it('lista os códigos repetidos por seção', () => {
    renderizar({ BRA01: 2, BRA05: 3 });

    expect(screen.getByText('BRA01, BRA05')).toBeInTheDocument();
    expect(screen.getByText('2 figurinhas repetidas no total.')).toBeInTheDocument();
  });

  // O jsdom normaliza o hexadecimal do `fill` para `rgb(...)`.
  function emRgb(cor) {
    const el = document.createElement('div');
    el.style.color = cor;
    return el.style.color;
  }

  // Cores da vista: os mesmos tokens da página principal (IDR 0045, 0046, 0066).
  // A cor vem por `--cor` no preenchimento; os nomes acessíveis não mudam.
  function corDoPreenchimento(nome) {
    const barra = screen.getByRole('img', { name: new RegExp(`^${nome}:`) });
    return barra.querySelector('.estatisticas__barra-preenchimento').style.getPropertyValue('--cor');
  }

  it('pinta a barra de cada grupo com a cor de identidade do grupo', () => {
    renderizar();

    expect(corDoPreenchimento('Grupo C')).toBe('var(--group-c)');
    expect(corDoPreenchimento('Grupo L')).toBe('var(--group-l)');
  });

  it('pinta a barra de cada seção com o degradê das cores da bandeira', () => {
    renderizar();

    const degrade = corDoPreenchimento('Brasil');
    expect(degrade).toContain('linear-gradient');
    expect(degrade).toContain('var(--selection-bra-1)');
    expect(degrade).toContain('var(--selection-bra-2,');
    expect(degrade).toContain('var(--selection-bra-3,');
  });

  it('usa a cor do grupo especial em FWC e COC, no grupo e na seção', () => {
    const { container } = render(<Estatisticas contagens={{}} onVoltar={vi.fn()} />);

    const fills = [...container.querySelectorAll('.estatisticas__barra-preenchimento')].map(
      (el) => el.style.getPropertyValue('--cor'),
    );
    expect(fills.filter((cor) => cor === 'var(--group-fwc)')).toHaveLength(2);
    expect(fills.filter((cor) => cor === 'var(--group-coc)')).toHaveLength(2);
  });

  it('colore o histograma pelo estado: faltante, colada e repetida em escala', () => {
    const { container } = render(<Estatisticas contagens={{ BRA01: 1, BRA02: 3 }} onVoltar={vi.fn()} />);

    const colunas = container.querySelectorAll('.estatisticas__histograma-barra');
    expect(colunas[0]).toHaveClass('estatisticas__histograma-barra--faltante');
    expect(colunas[1]).toHaveClass('estatisticas__histograma-barra--colada');
    expect(colunas[2].style.fill).toBe(emRgb(corDoSelo(1)));
    expect(colunas[3].style.fill).toBe(emRgb(corDoSelo(2)));
    expect(colunas[5].style.fill).toBe(emRgb(corDoSelo(4)));
  });

  it('marca cada número do resumo com o estado correspondente', () => {
    const { container } = render(<Estatisticas contagens={{}} onVoltar={vi.fn()} />);

    for (const estado of ['colada', 'faltante', 'repetida', 'progresso']) {
      expect(container.querySelector(`.estatisticas__numero--${estado}`)).toBeInTheDocument();
    }
  });

  it('não tem controle de edição de contagem', () => {
    renderizar();

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });
});
