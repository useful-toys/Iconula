// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração da atestação de menores (Tarefa 0008-0003): quando o
// passo aparece, o que confirmar faz e a política de falha (IDR 0036). A
// carga em si (Tarefa 0007-0002) é coberta em App.persistencia.test.jsx.

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
  gravarAtestacao: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  gravarAtestacao: colecao.gravarAtestacao,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

const USUARIO = { uid: "uid1", displayName: "Daniel Ferber", photoURL: "p" };

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  colecao.carregarColecao.mockReset();
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAtestacao.mockReset();
  colecao.gravarAtestacao.mockResolvedValue({ status: "sucesso" });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "14:05" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

function montarLogado() {
  authState.user = USUARIO;
  return render(<App />);
}

describe("App — atestação de menores", () => {
  it("conta sem atestadoEm vê o passo antes do catálogo", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: {},
      atualizadoEm: null,
      temTeamName: false,
      atestadoEm: false,
    });

    montarLogado();

    expect(await screen.findByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
  });

  it("conta com atestadoEm vai direto ao catálogo, sem o passo", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: {},
      atualizadoEm: null,
      temTeamName: false,
      atestadoEm: true,
    });

    montarLogado();

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Confirmar" })).not.toBeInTheDocument();
  });

  it("confirmar grava a atestação uma vez e libera o catálogo", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue({ status: "vazio" });

    montarLogado();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    expect(colecao.gravarAtestacao).toHaveBeenCalledTimes(1);
    expect(colecao.gravarAtestacao).toHaveBeenCalledWith("uid1");
    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
  });

  it("falha ao gravar libera o app assim mesmo, com aviso, sem mover o relógio", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue({ status: "vazio" });
    colecao.gravarAtestacao.mockResolvedValue({ status: "erro", erro: new Error("unavailable") });

    montarLogado();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao gravar a atestação");
    // O relógio do título continua "—": a atestação não grava updatedAt e
    // não o move (ADR 0008, IDR 0027) — nem em sucesso, nem em falha.
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
