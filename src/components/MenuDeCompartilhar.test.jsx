// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { MenuDeCompartilhar } from './MenuDeCompartilhar.jsx';

// Os itens do popup têm `role="menuitem"` explícito (não "button") — as
// queries abaixo usam a role certa em cada caso.

function renderizar(props = {}) {
  render(<MenuDeCompartilhar {...props} />);
}

function botaoDoCompartilhar() {
  return screen.getByRole('button', { name: /compartilhar listas de troca/ });
}

// A folha do sistema não existe por padrão no jsdom; cada teste define a sua
// via `Object.defineProperty`, restaurada no `afterEach` (como
// `navigator.clipboard` em `App.copiar.test.jsx`).
function definirShare(valor) {
  Object.defineProperty(navigator, 'share', { value: valor, configurable: true });
}

afterEach(() => {
  delete navigator.share;
});

describe('MenuDeCompartilhar', () => {
  it('começa fechado, sem o popup no documento', () => {
    renderizar();
    expect(botaoDoCompartilhar()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('abre ao clicar no botão, expondo o estado em aria-expanded', async () => {
    const user = userEvent.setup();
    renderizar();

    await user.click(botaoDoCompartilhar());

    expect(botaoDoCompartilhar()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('traz as duas cópias separadas por filete', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoCompartilhar());

    const itens = screen.getAllByRole('menuitem');
    expect(itens).toHaveLength(2);
    expect(itens.map((item) => item.textContent)).toEqual([
      'Copiar lista de faltantes',
      'Copiar lista de repetidas',
    ]);
    // Dois filetes: entre as listas e antes do bloco do link (IDR 0024,
    // IDR 0055).
    expect(document.querySelectorAll('.menu-de-compartilhar__filete')).toHaveLength(2);
  });

  it('esconde os itens de compartilhar quando não há folha do sistema', async () => {
    const user = userEvent.setup();
    renderizar({ onCopiarFaltantes: vi.fn() });
    await user.click(botaoDoCompartilhar());

    expect(screen.queryByRole('menuitem', { name: /^Compartilhar/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('traz os quatro itens, cada compartilhar logo abaixo da cópia da mesma lista', async () => {
    definirShare(vi.fn());
    const user = userEvent.setup();
    renderizar({
      onCopiarFaltantes: vi.fn(),
      onCopiarRepetidas: vi.fn(),
      onCompartilharFaltantes: vi.fn(),
      onCompartilharRepetidas: vi.fn(),
    });
    await user.click(botaoDoCompartilhar());

    const itens = screen.getAllByRole('menuitem');
    expect(itens.map((item) => item.textContent)).toEqual([
      'Copiar lista de faltantes',
      'Compartilhar faltantes…',
      'Copiar lista de repetidas',
      'Compartilhar repetidas…',
    ]);
    expect(document.querySelectorAll('.menu-de-compartilhar__filete')).toHaveLength(2);
  });

  it('os itens de compartilhar ficam desabilitados sem callback', async () => {
    definirShare(vi.fn());
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoCompartilhar());

    expect(screen.getByRole('menuitem', { name: 'Compartilhar faltantes…' })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: 'Compartilhar repetidas…' })).toBeDisabled();
  });

  it('um item de compartilhar com callback fica habilitado e chama o callback', async () => {
    definirShare(vi.fn());
    const user = userEvent.setup();
    const onCompartilharFaltantes = vi.fn();
    renderizar({ onCompartilharFaltantes });
    await user.click(botaoDoCompartilhar());

    const item = screen.getByRole('menuitem', { name: 'Compartilhar faltantes…' });
    expect(item).toBeEnabled();

    await user.click(item);
    expect(onCompartilharFaltantes).toHaveBeenCalledTimes(1);
  });

  it('as duas cópias ficam desabilitadas sem callback', async () => {
    const user = userEvent.setup();
    renderizar();
    await user.click(botaoDoCompartilhar());

    expect(screen.getByRole('menuitem', { name: 'Copiar lista de faltantes' })).toBeDisabled();
    expect(screen.getByRole('menuitem', { name: 'Copiar lista de repetidas' })).toBeDisabled();
  });

  it('uma cópia com callback fica habilitada e chama o callback', async () => {
    const user = userEvent.setup();
    const onCopiarFaltantes = vi.fn();
    renderizar({ onCopiarFaltantes });
    await user.click(botaoDoCompartilhar());

    const item = screen.getByRole('menuitem', { name: 'Copiar lista de faltantes' });
    expect(item).toBeEnabled();

    await user.click(item);
    expect(onCopiarFaltantes).toHaveBeenCalledTimes(1);
  });

  it('fecha com Esc e devolve o foco ao botão', async () => {
    const user = userEvent.setup();
    renderizar({ onCopiarFaltantes: vi.fn() });
    await user.click(botaoDoCompartilhar());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(botaoDoCompartilhar()).toHaveFocus();
  });

  it('fecha ao tocar fora do popup', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">fora</button>
        <MenuDeCompartilhar onCopiarFaltantes={vi.fn()} />
      </div>,
    );
    await user.click(botaoDoCompartilhar());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'fora' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ao abrir, o foco entra no primeiro item habilitado do popup', async () => {
    const user = userEvent.setup();
    // Só a segunda cópia tem callback: o foco pula a primeira, desabilitada,
    // e entra na repetidas, e não no primeiro item do DOM.
    renderizar({ onCopiarRepetidas: vi.fn() });
    await user.click(botaoDoCompartilhar());

    expect(screen.getByRole('menuitem', { name: 'Copiar lista de repetidas' })).toHaveFocus();
  });

  it('escolher um item devolve o foco ao botão', async () => {
    const user = userEvent.setup();
    renderizar({ onCopiarFaltantes: vi.fn() });
    await user.click(botaoDoCompartilhar());

    await user.click(screen.getByRole('menuitem', { name: 'Copiar lista de faltantes' }));

    expect(botaoDoCompartilhar()).toHaveFocus();
  });

  it('fecha ao tabular para fora do popup, sem roubar o foco de volta', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MenuDeCompartilhar onCopiarFaltantes={vi.fn()} />
        <button type="button">depois</button>
      </div>,
    );
    await user.click(botaoDoCompartilhar());
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // O primeiro item habilitado já tem o foco ao abrir; a segunda cópia está
    // desabilitada, então Tab sai do popup direto, sem escolher nada.
    await user.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'depois' })).toHaveFocus();
  });

  it('mostra um ícone SVG decorativo (sem asset externo)', () => {
    renderizar();

    const icone = botaoDoCompartilhar().querySelector('svg');
    expect(icone).toBeInTheDocument();
    expect(icone).toHaveAttribute('aria-hidden', 'true');
  });

  it('o nome acessível do botão expõe o estado aberto/fechado', async () => {
    const user = userEvent.setup();
    renderizar();

    expect(
      screen.getByRole('button', { name: 'compartilhar listas de troca, fechado' }),
    ).toBeInTheDocument();

    await user.click(botaoDoCompartilhar());

    expect(
      screen.getByRole('button', { name: 'compartilhar listas de troca, aberto' }),
    ).toBeInTheDocument();
  });

  it('o painel não declara rolagem própria', async () => {
    const user = userEvent.setup();
    renderizar({ onCopiarFaltantes: vi.fn() });
    await user.click(botaoDoCompartilhar());

    const painel = screen.getByRole('menu');
    expect(painel).not.toHaveStyle({ overflow: 'auto' });
    expect(painel.getAttribute('style') ?? '').not.toMatch(/overflow/);
  });

  describe('chave do link do catálogo (Tarefa 0027-0004)', () => {
    it('mostra a chave ligada, com nome e estado por extenso', async () => {
      const user = userEvent.setup();
      renderizar({ linkAtivo: true, onAlternarLink: vi.fn() });
      await user.click(botaoDoCompartilhar());

      const chave = screen.getByRole('switch', { name: 'Link do catálogo: ligado' });
      expect(chave).toHaveAttribute('aria-checked', 'true');
      expect(
        screen.queryByRole('switch', { name: 'Link do catálogo: desligado' }),
      ).not.toBeInTheDocument();
    });

    it('mostra a chave desligada quando o estado é false', async () => {
      const user = userEvent.setup();
      renderizar({ linkAtivo: false, onAlternarLink: vi.fn() });
      await user.click(botaoDoCompartilhar());

      expect(
        screen.getByRole('switch', { name: 'Link do catálogo: desligado' }),
      ).toHaveAttribute('aria-checked', 'false');
    });

    it('estado ausente é desligado', async () => {
      const user = userEvent.setup();
      renderizar({ onAlternarLink: vi.fn() });
      await user.click(botaoDoCompartilhar());

      expect(
        screen.getByRole('switch', { name: 'Link do catálogo: desligado' }),
      ).toHaveAttribute('aria-checked', 'false');
    });

    it('tocar na chave não fecha o popup e mantém o foco nela', async () => {
      const user = userEvent.setup();
      const onAlternarLink = vi.fn().mockResolvedValue(undefined);
      renderizar({ linkAtivo: false, onAlternarLink });
      await user.click(botaoDoCompartilhar());

      const chave = screen.getByRole('switch');
      await user.click(chave);

      expect(onAlternarLink).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(chave).toHaveFocus();
    });

    it('um segundo toque enquanto grava não dispara outra gravação', async () => {
      const user = userEvent.setup();
      let resolver;
      const onAlternarLink = vi.fn(
        () =>
          new Promise((resolve) => {
            resolver = resolve;
          }),
      );
      renderizar({ linkAtivo: false, onAlternarLink });
      await user.click(botaoDoCompartilhar());

      const chave = screen.getByRole('switch');
      await user.click(chave);
      await user.click(chave);

      expect(onAlternarLink).toHaveBeenCalledTimes(1);

      resolver();
    });

    it('Esc continua fechando o popup depois de tocar na chave', async () => {
      const user = userEvent.setup();
      renderizar({ linkAtivo: true, onAlternarLink: vi.fn().mockResolvedValue(undefined) });
      await user.click(botaoDoCompartilhar());

      await user.click(screen.getByRole('switch'));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(botaoDoCompartilhar()).toHaveFocus();
    });

    it('sem callback, a chave fica desabilitada', async () => {
      const user = userEvent.setup();
      renderizar({ linkAtivo: true });
      await user.click(botaoDoCompartilhar());

      expect(screen.getByRole('switch')).toBeDisabled();
    });
  });
});
