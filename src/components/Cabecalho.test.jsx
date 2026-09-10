// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Cabecalho } from './Cabecalho.jsx';

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
      />,
    );

    expect(document.querySelector('progress')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.cartao-estatistica')).toHaveLength(0);
  });
});
