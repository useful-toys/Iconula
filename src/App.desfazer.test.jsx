// Copyright (c) 2026 Daniel Felix Ferber

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração do desfazer (Tarefa 0009-0001): histórico de 10,
// reversão pela mesma gravação agregada e estado do botão. A carga fica
// "vazia" para os testes começarem do zero, sem interferir com o histórico.

const { authState, signOutMock } = vi.hoisted(() => ({
  authState: { user: null, callback: null },
  signOutMock: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, callback) => {
    authState.callback = callback;
    callback(authState.user);
    return () => {
      authState.callback = null;
    };
  },
  signOut: signOutMock,
}));

vi.mock("./lib/firebase", () => ({
  auth: {},
  app: {},
  signInWithGoogle: vi.fn(),
}));

const colecao = vi.hoisted(() => ({
  carregarColecao: vi.fn(),
  gravarAlteracoes: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

// Captura as props do catálogo para disparar ajustes sem renderizar as 994
// figurinhas (mesma técnica de App.persistencia.test.jsx e App.gravacao.test.jsx).
const catalogo = vi.hoisted(() => ({ props: null }));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: (props) => {
    catalogo.props = props;
    return <div data-testid="catalogo-mock" />;
  },
}));

import App from "./App";
import { limparAvisos } from "./lib/avisos.js";

const USUARIO = { uid: "uid1", displayName: "Daniel Ferber", photoURL: "p" };

function botaoDesfazer() {
  return screen.getByRole("button", { name: "desfazer a última alteração" });
}

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  catalogo.props = null;
  colecao.carregarColecao.mockReset();
  colecao.carregarColecao.mockResolvedValue({
    status: "encontrado",
    contagens: {},
    atualizadoEm: null,
    temTeamName: false,
    atestadoEm: true,
  });
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAlteracoes.mockResolvedValue({ status: "sucesso", atualizadoEm: new Date() });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "10:00" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  signOutMock.mockReset();
  signOutMock.mockResolvedValue(undefined);
  limparAvisos();
  localStorage.clear();
});

async function montarLogado() {
  authState.user = USUARIO;
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("App — desfazer", () => {
  it("o botão começa desabilitado, sem histórico", async () => {
    await montarLogado();
    expect(botaoDesfazer()).toBeDisabled();
  });

  it("um ajuste habilita o botão", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    expect(botaoDesfazer()).toBeEnabled();
  });

  it("desfazer reverte o último ajuste e volta a desabilitar o botão", async () => {
    const user = userEvent.setup();
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    expect(catalogo.props.contagens).toEqual({ BRA01: 1 });

    await user.click(botaoDesfazer());

    expect(catalogo.props.contagens).toEqual({});
    expect(botaoDesfazer()).toBeDisabled();
  });

  it("dez ajustes seguidos de dez desfazer voltam ao estado inicial", async () => {
    const user = userEvent.setup();
    await montarLogado();

    for (let i = 0; i < 10; i += 1) {
      await act(async () => {
        catalogo.props.onAjustar("BRA01", 1);
      });
    }
    expect(catalogo.props.contagens).toEqual({ BRA01: 10 });

    for (let i = 0; i < 10; i += 1) {
      await user.click(botaoDesfazer());
    }

    expect(catalogo.props.contagens).toEqual({});
    expect(botaoDesfazer()).toBeDisabled();
  });

  it("o décimo primeiro desfazer não altera nada", async () => {
    const user = userEvent.setup();
    await montarLogado();

    for (let i = 0; i < 10; i += 1) {
      await act(async () => {
        catalogo.props.onAjustar("BRA01", 1);
      });
    }

    for (let i = 0; i < 10; i += 1) {
      await user.click(botaoDesfazer());
    }
    expect(catalogo.props.contagens).toEqual({});

    // Décimo primeiro clique: o botão já está desabilitado — o clique não
    // dispara o handler (jsdom respeita `disabled`), então nada muda.
    await user.click(botaoDesfazer());
    expect(catalogo.props.contagens).toEqual({});
  });

  it("reverte ajustes diferentes na ordem inversa em que foram feitos", async () => {
    const user = userEvent.setup();
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      catalogo.props.onAjustar("FWC01", 1);
    });
    expect(catalogo.props.contagens).toEqual({ BRA01: 1, FWC01: 1 });

    // Primeiro desfazer reverte FWC01 (o mais recente), não BRA01.
    await user.click(botaoDesfazer());
    expect(catalogo.props.contagens).toEqual({ BRA01: 1 });

    await user.click(botaoDesfazer());
    expect(catalogo.props.contagens).toEqual({});
  });

  it("a reversão é gravada pela agregação, sem escrita própria", async () => {
    vi.useFakeTimers();
    try {
      await montarLogado();

      await act(async () => {
        catalogo.props.onAjustar("BRA01", 1);
      });
      await act(async () => {
        catalogo.props.onAjustar("BRA01", 1);
      });

      await act(async () => {
        fireEvent.click(botaoDesfazer());
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      // Uma única escrita, com o valor final (1) já refletindo a reversão —
      // nenhuma escrita própria disparada pelo desfazer.
      expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);
      expect(colecao.gravarAlteracoes).toHaveBeenCalledWith("uid1", { BRA01: 1 });
    } finally {
      vi.useRealTimers();
    }
  });

  it("recarregar a página (remontar o App) limpa o histórico", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    expect(botaoDesfazer()).toBeEnabled();

    // Simula o recarregamento da página: desmonta e remonta o App — todo o
    // estado em memória, historico incluído, nasce do zero de novo.
    cleanup();
    await montarLogado();

    expect(botaoDesfazer()).toBeDisabled();
  });
});
