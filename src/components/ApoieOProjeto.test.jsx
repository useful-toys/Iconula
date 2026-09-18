// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import ApoieOProjeto from './ApoieOProjeto.jsx';
import { Avisos } from './Avisos.jsx';
import { chavePix } from '../lib/pix.js';
import { limparAvisos } from '../lib/avisos.js';

// Testes da vista "Apoie o projeto" (IDR 0070): QR gerado em runtime, chave
// em texto sempre visível, cópia para a área de transferência com aviso de
// sucesso e compartilhamento pela folha do sistema só onde ela existe. A
// `Avisos` acompanha a vista para as asserções dos avisos (IDR 0029).

function renderizar(props = {}) {
  return render(
    <>
      <ApoieOProjeto onVoltar={vi.fn()} {...props} />
      <Avisos />
    </>,
  );
}

// `navigator.clipboard` e `navigator.share` não existem por padrão no jsdom;
// cada teste define o que precisa e o `afterEach` limpa (mesmo padrão de
// `MenuDeCompartilhar.test.jsx`).
function definirClipboard(valor) {
  Object.defineProperty(navigator, 'clipboard', { value: valor, configurable: true });
}

function definirShare(valor) {
  Object.defineProperty(navigator, 'share', { value: valor, configurable: true });
}

beforeEach(() => {
  limparAvisos();
});

afterEach(() => {
  delete navigator.clipboard;
  delete navigator.share;
  vi.restoreAllMocks();
});

describe('ApoieOProjeto', () => {
  it('renderiza o QR, a chave em texto e a frase de contexto (IDR 0070)', async () => {
    renderizar();

    const qr = await screen.findByRole('img', { name: /QR code Pix/i });
    expect(qr.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);

    expect(screen.getByText(chavePix)).toBeInTheDocument();
    expect(screen.getByText(/pacotinho de figurinhas/i)).toBeInTheDocument();
  });

  it('voltar chama onVoltar', async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    renderizar({ onVoltar });

    await user.click(screen.getByRole('button', { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });

  it('o botão Copiar chave Pix copia a chave e avisa "chave copiada"', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText });
    renderizar();

    await user.click(screen.getByRole('button', { name: 'Copiar chave Pix' }));

    expect(writeText).toHaveBeenCalledWith(chavePix);
    expect(await screen.findByText('chave copiada')).toBeInTheDocument();
  });

  it('sem área de transferência avisa sem falha', async () => {
    // `userEvent.setup()` instala um stub de clipboard; removê-lo devolve o
    // cenário sem a API, que é o do caso de reserva.
    const user = userEvent.setup();
    delete navigator.clipboard;
    renderizar();

    await user.click(screen.getByRole('button', { name: 'Copiar chave Pix' }));

    expect(await screen.findByText(/área de transferência indisponível/i)).toBeInTheDocument();
  });

  it('esconde o compartilhar quando não há folha do sistema', () => {
    renderizar();

    expect(
      screen.queryByRole('button', { name: /Compartilhar chave Pix/ }),
    ).not.toBeInTheDocument();
  });

  it('mostra o compartilhar onde há folha do sistema e entrega só a chave', async () => {
    const user = userEvent.setup();
    const share = vi.fn().mockResolvedValue(undefined);
    definirShare(share);
    renderizar();

    await user.click(screen.getByRole('button', { name: /Compartilhar chave Pix/ }));

    expect(share).toHaveBeenCalledWith({ text: chavePix });
    expect(await screen.findByText('chave compartilhada')).toBeInTheDocument();
  });
});
