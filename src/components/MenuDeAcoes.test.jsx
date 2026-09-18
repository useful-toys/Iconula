// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { MenuDeAcoes } from './MenuDeAcoes.jsx';

// Os itens do popup têm `role="menuitem"` explícito (não "button") — as
// queries abaixo usam a role certa em cada caso.

function renderizar(props = {}) {
  const onSignOut = props.onSignOut ?? vi.fn();
  render(<MenuDeAcoes onSignOut={onSignOut} {...props} />);
  return { onSignOut };
}

function botaoDoMenu() {
  return screen.getByRole('button', { name: /menu de ações/ });
}

describe('MenuDeAcoes', () => {
  it('começa fechado, sem o popup no documento', () => {
    renderizar();
    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('abre ao clicar no botão, expondo o estado em aria-expanded', async () => {
    const user = userEvent.setup();
    renderizar();

    await user.click(botaoDoMenu());

    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('traz os cinco comandos em quatro blocos separados por três filetes', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());

    const itens = screen.getAllByRole('menuitem');
    expect(itens).toHaveLength(5);
    expect(itens.map((item) => item.textContent)).toEqual([
      'Exportar coleção (JSON)',
      'Importar coleção (JSON)',
      'Sobre',
      'Apoiar o projeto',
      'Sair da conta',
    ]);
    expect(document.querySelectorAll('.menu-de-acoes__filete')).toHaveLength(3);
  });

  it('os dois comandos de conteúdo ficam desabilitados sem callback', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());

    expect(screen.getByRole('menuitem', { name: 'Exportar coleção (JSON)' })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: 'Importar coleção (JSON)' })).toBeDisabled();
    // "Sobre", "Apoiar o projeto" e "Sair da conta" sempre têm ação real,
    // nunca ficam desabilitados.
    expect(screen.getByRole('menuitem', { name: 'Sobre' })).toBeEnabled();
    expect(screen.getByRole('menuitem', { name: 'Apoiar o projeto' })).toBeEnabled();
    expect(screen.getByRole('menuitem', { name: 'Sair da conta' })).toBeEnabled();
  });

  it('um comando de conteúdo com callback fica habilitado e chama o callback', async () => {
    const user = userEvent.setup();
    const onExportar = vi.fn();
    renderizar({ onExportar });
    await user.click(botaoDoMenu());

    const item = screen.getByRole('menuitem', { name: 'Exportar coleção (JSON)' });
    expect(item).toBeEnabled();

    await user.click(item);
    expect(onExportar).toHaveBeenCalledTimes(1);
  });

  it('"Sair da conta" é o único item marcado como vermelho, isolado no fim', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());

    const itens = screen.getAllByRole('menuitem');
    expect(itens[4]).toHaveClass('menu-de-acoes__item--sair');
    itens.slice(0, 4).forEach((item) => {
      expect(item).not.toHaveClass('menu-de-acoes__item--sair');
    });
  });

  it('escolher "Sair da conta" chama onSignOut e fecha o menu', async () => {
    const user = userEvent.setup();
    const { onSignOut } = renderizar();
    await user.click(botaoDoMenu());

    await user.click(screen.getByRole('menuitem', { name: 'Sair da conta' }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('escolher "Sobre" chama onAbrirSobre e fecha o menu', async () => {
    const user = userEvent.setup();
    const onAbrirSobre = vi.fn();
    renderizar({ onAbrirSobre });
    await user.click(botaoDoMenu());

    await user.click(screen.getByRole('menuitem', { name: 'Sobre' }));

    expect(onAbrirSobre).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('escolher "Apoiar o projeto" chama onAbrirApoie e fecha o menu', async () => {
    const user = userEvent.setup();
    const onAbrirApoie = vi.fn();
    renderizar({ onAbrirApoie });
    await user.click(botaoDoMenu());

    await user.click(screen.getByRole('menuitem', { name: 'Apoiar o projeto' }));

    expect(onAbrirApoie).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('fecha com Esc e devolve o foco ao botão', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(botaoDoMenu()).toHaveFocus();
  });

  it('fecha ao tocar fora do popup', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">fora</button>
        <MenuDeAcoes onSignOut={vi.fn()} />
      </div>,
    );
    await user.click(botaoDoMenu());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'fora' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ao abrir, o foco entra no primeiro item habilitado do menu', async () => {
    const user = userEvent.setup();
    // Sem nenhum callback de conteúdo, exportar/importar ficam desabilitados;
    // o foco entra no primeiro habilitado ("Sobre"), não no primeiro do DOM.
    renderizar();
    await user.click(botaoDoMenu());

    expect(screen.getByRole('menuitem', { name: 'Sobre' })).toHaveFocus();
  });

  it('com o primeiro item habilitado, o foco entra nele ao abrir', async () => {
    const user = userEvent.setup();
    renderizar({ onExportar: vi.fn() });
    await user.click(botaoDoMenu());

    expect(screen.getByRole('menuitem', { name: 'Exportar coleção (JSON)' })).toHaveFocus();
  });

  it('escolher um item devolve o foco ao botão', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());

    await user.click(screen.getByRole('menuitem', { name: 'Sair da conta' }));

    expect(botaoDoMenu()).toHaveFocus();
  });

  it('fecha ao tabular para fora do popup, sem roubar o foco de volta', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MenuDeAcoes onSignOut={vi.fn()} />
        <button type="button">depois</button>
      </div>,
    );
    await user.click(botaoDoMenu());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // O foco entra em "Sobre" ao abrir; os Tab seguinte passam por
    // "Apoiar o projeto" e "Sair da conta", ainda dentro do popup, e o
    // último sai dele sem escolher nada.
    await user.tab();
    await user.tab();
    await user.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'depois' })).toHaveFocus();
  });

  it('com photoURL, o botão mostra a foto da conta e abre o popup', async () => {
    const user = userEvent.setup();
    const photoURL = 'https://lh3.googleusercontent.com/foto.jpg';
    renderizar({ photoURL, displayName: 'Daniel Ferber' });

    const botao = botaoDoMenu();
    const foto = botao.querySelector('img.menu-de-acoes__foto');
    expect(foto).toBeInTheDocument();
    expect(foto).toHaveAttribute('src', photoURL);
    expect(foto).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(botao).not.toHaveTextContent('⋯');

    await user.click(botao);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('sem photoURL, o botão mostra a inicial maiúscula do displayName', () => {
    renderizar({ displayName: 'daniel ferber' });

    const botao = botaoDoMenu();
    expect(botao).toHaveTextContent('D');
    expect(botao).toHaveClass('menu-de-acoes__botao--inicial');
    expect(botao.querySelector('img')).toBeNull();
  });

  it('sem displayName, o botão mantém o glifo do menu', () => {
    renderizar();

    expect(botaoDoMenu()).toHaveTextContent('⋯');
    expect(botaoDoMenu().querySelector('img')).toBeNull();
  });

  it('se a foto falhar ao carregar, o botão cai na inicial', () => {
    renderizar({ photoURL: 'https://lh3.googleusercontent.com/quebrada.jpg', displayName: 'Daniel Ferber' });

    const foto = botaoDoMenu().querySelector('img.menu-de-acoes__foto');
    fireEvent.error(foto);

    expect(botaoDoMenu()).toHaveTextContent('D');
    expect(botaoDoMenu().querySelector('img')).toBeNull();
  });

  it('o nome acessível do avatar inclui o nome da conta', () => {
    renderizar({ photoURL: 'https://lh3.googleusercontent.com/foto.jpg', displayName: 'Daniel Ferber' });

    expect(
      screen.getByRole('button', { name: /menu de ações de Daniel Ferber/ }),
    ).toBeInTheDocument();
  });

  it('o painel não declara rolagem própria', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoMenu());

    const painel = screen.getByRole('menu');
    expect(painel).not.toHaveStyle({ overflow: 'auto' });
    expect(painel.getAttribute('style') ?? '').not.toMatch(/overflow/);
  });
});
