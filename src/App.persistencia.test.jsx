// Copyright (c) 2026 Daniel Felix Ferber

import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

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
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

// Captura as props do catálogo para disparar ajustes e inspecionar contagens,
// sem renderizar as 994 figurinhas.
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

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  catalogo.props = null;
  colecao.carregarColecao.mockReset();
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "14:05" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  limparAvisos();
  localStorage.clear();
});

describe("App — carga no login", () => {
  it("entrar dispara uma leitura e a coleção lida aparece no placar e no relógio", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: { BRA01: 3, FWC01: 1 },
      atualizadoEm: new Date("2026-09-10T14:05:00"),
      temTeamName: false,
    });
    authState.user = USUARIO;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/2 de 994/)).toBeInTheDocument();
    });

    expect(colecao.carregarColecao).toHaveBeenCalledTimes(1);
    expect(colecao.carregarColecao).toHaveBeenCalledWith("uid1");
    expect(screen.getByText("14:05")).toBeInTheDocument();
  });

  it("documento vazio exibe travessão no relógio e não gera falha", async () => {
    colecao.carregarColecao.mockResolvedValue({ status: "vazio" });
    authState.user = USUARIO;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("—")).toBeInTheDocument();
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/0 de 994/)).toBeInTheDocument();
  });

  it("falha de leitura mantém a tela utilizável e emite aviso vermelho com detalhe", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "erro",
      erro: new Error("permission-denied"),
    });
    authState.user = USUARIO;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao carregar");
    expect(screen.getByLabelText(/0 de 994/)).toBeInTheDocument();
  });

  it("ajuste feito durante a leitura não é sobrescrito pela resposta do servidor", async () => {
    let resolver;
    colecao.carregarColecao.mockReturnValue(
      new Promise((resolve) => {
        resolver = resolve;
      }),
    );
    authState.user = USUARIO;

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    expect(catalogo.props.contagens).toEqual({ BRA01: 1 });

    await act(async () => {
      resolver({
        status: "encontrado",
        contagens: { BRA01: 9 },
        atualizadoEm: new Date("2026-09-10T14:05:00"),
        temTeamName: false,
      });
    });

    expect(catalogo.props.contagens).toEqual({ BRA01: 1 });
  });
});
