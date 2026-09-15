// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { Figurinha } from './Figurinha.jsx';
import { Secao } from './Secao.jsx';
import { PaginaDoAlbum } from './PaginaDoAlbum.jsx';
import { layoutDeSecao } from '../data/catalogoLayout.js';

function FigurinhaControlada({ inicial = 0 }) {
  const [contagem, setContagem] = useState(inicial);
  return (
    <Figurinha
      codigo="BRA05"
      contagem={contagem}
      onIncrementar={() => setContagem((atual) => Math.min(99, atual + 1))}
      onDecrementar={() => setContagem((atual) => Math.max(0, atual - 1))}
    />
  );
}

describe('Figurinha', () => {
  it('renderiza código em duas linhas', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(screen.getByText('BRA')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('exibe selo com unidades sobrando a partir da contagem 2', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).not.toContain('×');

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).toContain('×1');

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={3}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(document.body.textContent).toContain('×2');
  });

  it('mantém a caixa do selo na mesma largura para ×9 e ×10', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={10}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    const selo10 = document.querySelector('.figurinha__selo');
    const largura10 = getComputedStyle(selo10).minWidth;

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={9}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    const selo9 = document.querySelector('.figurinha__selo');
    expect(selo9).toBeTruthy();
    expect(getComputedStyle(selo9).minWidth).toBe(largura10);
  });

  it('aplica a classe de estado faltante', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha--faltante')).toBeInTheDocument();
  });

  it('incrementa ao clicar no cartão', async () => {
    const onIncrementar = vi.fn();
    const user = userEvent.setup();

    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={onIncrementar}
        onDecrementar={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText(/BRA 05, faltante/));
    expect(onIncrementar).toHaveBeenCalledTimes(1);
  });

  it('teclado soma, sem acionar o gesto de pressão longa', async () => {
    const onIncrementar = vi.fn();
    const onDecrementar = vi.fn();
    const user = userEvent.setup();

    render(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={onIncrementar}
        onDecrementar={onDecrementar}
      />,
    );

    const corpo = screen.getByLabelText(/BRA 05, colada/);
    corpo.focus();
    await user.keyboard('{Enter}');

    expect(onIncrementar).toHaveBeenCalledTimes(1);
    expect(onDecrementar).not.toHaveBeenCalled();
  });

  it('decrementa ao clicar no controle de menos', async () => {
    const onDecrementar = vi.fn();
    const user = userEvent.setup();

    render(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={vi.fn()}
        onDecrementar={onDecrementar}
      />,
    );

    await user.click(screen.getByRole('button', { name: /remover uma unidade de BRA 05/ }));
    expect(onDecrementar).toHaveBeenCalledTimes(1);
  });

  it('não muda a tela ao incrementar em 99 (controle do componente pai)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={99}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    const textoAntes = container.textContent;
    await user.click(screen.getByLabelText('BRA 05, colada, 98 sobrando'));
    expect(container.textContent).toBe(textoAntes);
  });

  it('não renderiza o controle de menos com contagem 0', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /remover uma unidade de BRA 05/ }),
    ).not.toBeInTheDocument();
  });

  it('renderiza o controle de menos a partir da contagem 1', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /remover uma unidade de BRA 05/ }),
    ).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={2}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /remover uma unidade de BRA 05/ }),
    ).toBeInTheDocument();
  });

  it('remove o controle ao decrementar de 1 para 0 e devolve o foco ao cartão', async () => {
    const user = userEvent.setup();
    render(<FigurinhaControlada inicial={1} />);

    await user.click(
      screen.getByRole('button', { name: /remover uma unidade de BRA 05/ }),
    );

    expect(
      screen.queryByRole('button', { name: /remover uma unidade de BRA 05/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('BRA 05, faltante')).toHaveFocus();
  });

  it('descreve o estado por extenso no nome acessível', () => {
    const { rerender } = render(
      <Figurinha
        codigo="BRA05"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, faltante')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, colada')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA05"
        contagem={3}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('BRA 05, colada, 2 sobrando')).toBeInTheDocument();
  });

  it('mostra a marca dourada quando metalizada', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        metalizada
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__metalizada')).toBeInTheDocument();
  });

  it('descreve metalizada por extenso no nome acessível, sem depender só da marca visual', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        metalizada
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('BRA 05, colada, metalizada')).toBeInTheDocument();
  });

  it('lê o número zero com dois dígitos no nome acessível (FWC 00)', () => {
    const { rerender } = render(
      <Figurinha
        codigo="FWC00"
        contagem={0}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('FWC 00, faltante')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="FWC00"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'remover uma unidade de FWC 00' }),
    ).toBeInTheDocument();
  });
});

describe('Figurinha — nome no cartão (IDR 0047)', () => {
  it('renderiza prenomes e sobrenome em linhas distintas com classes próprias', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA14"
        contagem={1}
        nome="Vinícius Júnior"
        nomeLinhas={['Vinícius', 'Júnior']}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-prenomes')).toHaveTextContent(
      'Vinícius',
    );
    expect(container.querySelector('.figurinha__nome-sobrenome')).toHaveTextContent(
      'Júnior',
    );
    expect(container.querySelector('.figurinha__nome-unico')).not.toBeInTheDocument();
  });

  it('põe nome único só na linha do sobrenome, sem a linha dos prenomes', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA02"
        contagem={0}
        nome="Alisson"
        nomeLinhas={[null, 'Alisson']}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-prenomes')).not.toBeInTheDocument();
    expect(container.querySelector('.figurinha__nome-sobrenome')).toHaveTextContent(
      'Alisson',
    );
  });

  it('mostra nome sem corte de FWC e COC numa caixa única, sem as linhas de jogador', () => {
    const { container, rerender } = render(
      <Figurinha
        codigo="FWC01"
        contagem={0}
        nome="Emblema oficial"
        nomeLinhas={null}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-unico')).toHaveTextContent(
      'Emblema oficial',
    );
    expect(container.querySelector('.figurinha__nome-prenomes')).not.toBeInTheDocument();
    expect(container.querySelector('.figurinha__nome-sobrenome')).not.toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="COC13"
        contagem={0}
        nome="Jogador Coca-Cola"
        nomeLinhas={null}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(container.querySelector('.figurinha__nome-unico')).toHaveTextContent(
      'Jogador Coca-Cola',
    );
  });

  it('escudo e foto do time da seleção mostram o nome genérico, com o nome no rótulo', () => {
    const { container, rerender } = render(
      <Figurinha
        codigo="BRA01"
        contagem={0}
        nome="Escudo do time"
        nomeLinhas={null}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-unico')).toHaveTextContent(
      'Escudo do time',
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).not.toBeInTheDocument();
    expect(screen.getByLabelText('BRA 01, Escudo do time, faltante')).toBeInTheDocument();

    rerender(
      <Figurinha
        codigo="BRA13"
        contagem={0}
        nome="Foto do time"
        nomeLinhas={null}
        paisagem
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Foto do time',
    );
    expect(container.querySelector('.figurinha__nome-unico')).not.toBeInTheDocument();
    expect(screen.getByLabelText('BRA 13, Foto do time, faltante')).toBeInTheDocument();
  });

  it('paisagem do FWC mostra o nomeCurto numa linha e o nome completo no rótulo', () => {
    const { container } = render(
      <Figurinha
        codigo="FWC10"
        contagem={1}
        nome="Pôster Histórico – Uruguai 1950"
        nomeLinhas={null}
        nomeCurto="Uruguai 1950"
        paisagem
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Uruguai 1950',
    );
    expect(
      screen.getByLabelText('FWC 10, Pôster Histórico – Uruguai 1950, colada'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'remover uma unidade de FWC 10, Pôster Histórico – Uruguai 1950',
      }),
    ).toBeInTheDocument();
  });

  it('FWC04 em retrato, sem nomeCurto, mostra o nome completo em até duas linhas', () => {
    const { container } = render(
      <Figurinha
        codigo="FWC04"
        contagem={0}
        nome="Slogan Oficial (We Are 26)"
        nomeLinhas={null}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-unico')).toHaveTextContent(
      'Slogan Oficial (We Are 26)',
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).not.toBeInTheDocument();
  });

  it('re-renderiza a paisagem quando o nomeCurto muda (comparador do memo)', () => {
    const props = {
      codigo: 'FWC10',
      contagem: 0,
      nome: 'Pôster Histórico – Uruguai 1950',
      nomeLinhas: null,
      paisagem: true,
      onIncrementar: vi.fn(),
      onDecrementar: vi.fn(),
    };
    const { container, rerender } = render(
      <Figurinha {...props} nomeCurto="Uruguai 1950" />,
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Uruguai 1950',
    );

    rerender(<Figurinha {...props} nomeCurto="Uruguai 1930" />);
    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Uruguai 1930',
    );
  });

  it('sem nome, não renderiza o bloco de nome e mantém os rótulos do código', () => {
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome')).not.toBeInTheDocument();
    expect(screen.getByLabelText('BRA 05, colada')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'remover uma unidade de BRA 05' }),
    ).toBeInTheDocument();
  });

  it('inclui o nome no nome acessível do corpo e do menos', () => {
    render(
      <Figurinha
        codigo="BRA05"
        contagem={1}
        nome="Gabriel Magalhães"
        nomeLinhas={['Gabriel', 'Magalhães']}
        onIncrementar={vi.fn()}
        onDecrementar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('BRA 05, Gabriel Magalhães, colada')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'remover uma unidade de BRA 05, Gabriel Magalhães',
      }),
    ).toBeInTheDocument();
  });

  it('Secao repassa nome, nomeLinhas e nomeCurto ao cartão', () => {
    const secao = {
      sigla: 'BRA',
      nome: 'Brasil',
      icone: '🇧🇷',
      paginas: [24, 25],
      total: 2,
    };
    const figurinhas = [
      {
        codigo: 'BRA02',
        secao: 'BRA',
        metalizada: false,
        nome: 'Alisson',
        nomeLinhas: [null, 'Alisson'],
      },
      {
        codigo: 'FWC10',
        secao: 'FWC',
        metalizada: false,
        nome: 'Pôster Histórico – Uruguai 1950',
        nomeLinhas: null,
        nomeCurto: 'Uruguai 1950',
        paisagem: true,
      },
    ];

    const { container } = render(
      <Secao
        secao={secao}
        figurinhas={figurinhas}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-sobrenome')).toHaveTextContent(
      'Alisson',
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Uruguai 1950',
    );
  });

  it('PaginaDoAlbum repassa nome, nomeLinhas e nomeCurto ao cartão', () => {
    const secao = { sigla: 'BRA', nome: 'Brasil', icone: '🇧🇷', paginas: [4, 5] };
    const figurinhas = Array.from({ length: 20 }, (_, i) => ({
      codigo: `BRA${String(i + 1).padStart(2, '0')}`,
      posicao: i + 1,
      metalizada: i === 0,
      nome: i === 1 ? 'Alisson' : i === 12 ? 'Foto do time' : undefined,
      nomeLinhas: i === 1 ? [null, 'Alisson'] : undefined,
      nomeCurto: i === 12 ? 'Foto' : null,
      paisagem: i === 12,
    }));
    const layout = layoutDeSecao(secao);
    const paginaLayout1 = layout.paginas.find((p) => p.pagina === 1);
    const paginaLayout2 = layout.paginas.find((p) => p.pagina === 2);
    const posicoesPagina1 = layout.posicoes.filter((p) => p.pagina === 1);
    const posicoesPagina2 = layout.posicoes.filter((p) => p.pagina === 2);

    const { container, rerender } = render(
      <PaginaDoAlbum
        pagina={paginaLayout1}
        figurinhas={figurinhas}
        posicoes={posicoesPagina1}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );

    expect(container.querySelector('.figurinha__nome-sobrenome')).toHaveTextContent(
      'Alisson',
    );

    rerender(
      <PaginaDoAlbum
        pagina={paginaLayout2}
        figurinhas={figurinhas}
        posicoes={posicoesPagina2}
        contagens={{}}
        onAjustar={vi.fn()}
      />,
    );
    expect(container.querySelector('.figurinha__nome-paisagem')).toHaveTextContent(
      'Foto',
    );
  });
});

describe('Figurinha — pressão longa (IDR 0051)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderizar(contagem = 2) {
    const onIncrementar = vi.fn();
    const onDecrementar = vi.fn();
    const { container } = render(
      <Figurinha
        codigo="BRA05"
        contagem={contagem}
        onIncrementar={onIncrementar}
        onDecrementar={onDecrementar}
      />,
    );
    return {
      onIncrementar,
      onDecrementar,
      corpo: container.querySelector('.figurinha__corpo'),
    };
  }

  function encostar(corpo, opcoes = {}) {
    fireEvent.pointerDown(corpo, {
      pointerType: 'touch',
      pointerId: 1,
      clientX: 0,
      clientY: 0,
      ...opcoes,
    });
  }

  function soltar(corpo, opcoes = {}) {
    fireEvent.pointerUp(corpo, { pointerType: 'touch', pointerId: 1, ...opcoes });
  }

  function avancar(ms) {
    act(() => {
      vi.advanceTimersByTime(ms);
    });
  }

  it('toque de 500ms decrementa uma vez e não soma ao soltar', () => {
    const { onIncrementar, onDecrementar, corpo } = renderizar(2);

    encostar(corpo);
    avancar(500);
    expect(onDecrementar).toHaveBeenCalledTimes(1);

    soltar(corpo);
    fireEvent.click(corpo);

    expect(onDecrementar).toHaveBeenCalledTimes(1);
    expect(onIncrementar).not.toHaveBeenCalled();
  });

  it('soltar antes de 500ms soma', () => {
    const { onIncrementar, onDecrementar, corpo } = renderizar(2);

    encostar(corpo);
    avancar(300);
    soltar(corpo);
    fireEvent.click(corpo);

    expect(onDecrementar).not.toHaveBeenCalled();
    expect(onIncrementar).toHaveBeenCalledTimes(1);
  });

  it('mover mais de 10px cancela sem decrementar', () => {
    const { onDecrementar, corpo } = renderizar(2);

    encostar(corpo);
    fireEvent.pointerMove(corpo, {
      pointerType: 'touch',
      pointerId: 1,
      clientX: 11,
      clientY: 0,
    });
    avancar(500);

    expect(onDecrementar).not.toHaveBeenCalled();
  });

  it('mouse não aciona o gesto', () => {
    const { onDecrementar, corpo } = renderizar(2);

    fireEvent.pointerDown(corpo, { pointerType: 'mouse', pointerId: 1, clientX: 0, clientY: 0 });
    avancar(500);

    expect(onDecrementar).not.toHaveBeenCalled();
  });

  it('contagem 0 não decrementa nem mostra a espera', () => {
    const { onDecrementar, corpo } = renderizar(0);

    encostar(corpo);
    expect(document.querySelector('.figurinha--pressionando')).not.toBeInTheDocument();

    avancar(500);
    expect(onDecrementar).not.toHaveBeenCalled();
  });

  it('liga o escurecimento na espera e desliga ao soltar', () => {
    const { corpo } = renderizar(2);

    encostar(corpo);
    expect(document.querySelector('.figurinha--pressionando')).toBeInTheDocument();

    soltar(corpo);
    expect(document.querySelector('.figurinha--pressionando')).not.toBeInTheDocument();
  });

  it('não gera mais de uma chamada de ajuste numa pressão longa', () => {
    const { onIncrementar, onDecrementar, corpo } = renderizar(2);

    encostar(corpo);
    avancar(500);
    soltar(corpo);
    fireEvent.click(corpo);

    // Toque rápido seguinte volta a somar: a marca de supressão não fica presa.
    fireEvent.pointerDown(corpo, {
      pointerType: 'touch',
      pointerId: 2,
      clientX: 0,
      clientY: 0,
    });
    avancar(100);
    soltar(corpo, { pointerId: 2 });
    fireEvent.click(corpo);

    expect(onDecrementar).toHaveBeenCalledTimes(1);
    expect(onIncrementar).toHaveBeenCalledTimes(1);
  });

  it('suprime o menu de contexto no toque e mantém no mouse', () => {
    const { corpo } = renderizar(2);

    encostar(corpo);
    const noToque = createEvent.contextMenu(corpo);
    fireEvent(corpo, noToque);
    expect(noToque.defaultPrevented).toBe(true);
    soltar(corpo);

    fireEvent.pointerDown(corpo, { pointerType: 'mouse', pointerId: 3 });
    const noMouse = createEvent.contextMenu(corpo);
    fireEvent(corpo, noMouse);
    expect(noMouse.defaultPrevented).toBe(false);
  });
});
