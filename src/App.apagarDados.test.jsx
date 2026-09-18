// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração de "Apagar meus dados" (Tarefa 0031-0003): a ordem
// do TDR 0027, a reautenticação condicional ao login recente, as falhas
// parciais e o descarte das pendências da gravação agregada. Temporizadores
// falsos e `fireEvent`, como as demais suítes de integração da fase.

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

const firebase = vi.hoisted(() => ({
  reauthenticateWithGoogle: vi.fn(),
  deleteUserAccount: vi.fn(),
}));

vi.mock("./lib/firebase", () => ({
  auth: {},
  app: {},
  signInWithGoogle: vi.fn(),
  reauthenticateWithGoogle: firebase.reauthenticateWithGoogle,
  deleteUserAccount: firebase.deleteUserAccount,
}));

const colecao = vi.hoisted(() => ({
  carregarColecao: vi.fn(),
  gravarAlteracoes: vi.fn(),
  apagarColecao: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  apagarColecao: colecao.apagarColecao,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

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

async function montarLogado() {
  authState.user = USUARIO;
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function abrirPainel() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Política de privacidade" }));
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Apagar meus dados" }));
  });
}

async function confirmarApagar() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Apagar definitivamente" }));
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  vi.useFakeTimers();
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
    termosVersao: "2026-09-17",
    politicaVersao: "2026-09-17",
  });
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAlteracoes.mockResolvedValue({ status: "sucesso", atualizadoEm: new Date() });
  colecao.apagarColecao.mockReset();
  colecao.apagarColecao.mockResolvedValue({ status: "sucesso" });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "10:00" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  firebase.reauthenticateWithGoogle.mockReset();
  firebase.reauthenticateWithGoogle.mockResolvedValue({ user: { uid: "uid1" } });
  firebase.deleteUserAccount.mockReset();
  firebase.deleteUserAccount.mockResolvedValue(undefined);
  signOutMock.mockReset();
  signOutMock.mockResolvedValue(undefined);
  limparAvisos();
  localStorage.clear();
});

afterEach(() => {
  // A `Avisos` está montada enquanto a fila é esvaziada; envolver em `act`
  // evita o aviso de atualização fora de `act` ao final de cada caso.
  act(() => {
    limparAvisos();
  });
  vi.useRealTimers();
});

describe("App — apagar meus dados", () => {
  it("apaga na ordem do TDR 0027, sem reautenticação no login recente", async () => {
    await montarLogado();

    await abrirPainel();
    await confirmarApagar();

    expect(firebase.reauthenticateWithGoogle).not.toHaveBeenCalled();
    expect(colecao.apagarColecao).toHaveBeenCalledWith("uid1", expect.anything());
    expect(firebase.deleteUserAccount).toHaveBeenCalledTimes(1);

    const ordem = [
      colecao.apagarColecao.mock.invocationCallOrder[0],
      firebase.deleteUserAccount.mock.invocationCallOrder[0],
    ];
    expect(ordem).toEqual([...ordem].sort((a, b) => a - b));

    expect(screen.getByRole("heading", { name: "Conta apagada" })).toBeInTheDocument();
    expect(
      screen.getByText("Sua conta de login e a sua coleção de figurinhas foram apagadas."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voltar à tela de login" })).toBeInTheDocument();
  });

  it("reautentica por popup só quando o deleteUser exige login recente", async () => {
    firebase.deleteUserAccount
      .mockRejectedValueOnce(Object.assign(new Error("recent"), { code: "auth/requires-recent-login" }))
      .mockResolvedValueOnce(undefined);

    await montarLogado();
    await abrirPainel();
    await confirmarApagar();

    expect(firebase.reauthenticateWithGoogle).toHaveBeenCalledTimes(1);
    expect(firebase.deleteUserAccount).toHaveBeenCalledTimes(2);
    expect(colecao.apagarColecao).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("heading", { name: "Conta apagada" })).toBeInTheDocument();
  });

  it("a tela Conta apagada continua visível depois de a sessão acabar", async () => {
    await montarLogado();

    await abrirPainel();
    await confirmarApagar();

    // Fim da sessão: `onAuthStateChanged` zera o usuário, mas a vista
    // `ContaApagada` continua montada, renderizada antes da guarda de login
    // (TDR 0020, IDR 0060).
    await act(async () => {
      authState.callback(null);
    });

    expect(screen.getByRole("heading", { name: "Conta apagada" })).toBeInTheDocument();
    expect(
      screen.getByText("Sua conta de login e a sua coleção de figurinhas foram apagadas."),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Voltar à tela de login" }));
    });

    expect(screen.getByRole("button", { name: /entrar com google/i })).toBeInTheDocument();
  });

  it("fechar o popup de reautenticação deixa a coleção apagada e a conta de pé", async () => {
    firebase.deleteUserAccount.mockRejectedValueOnce(
      Object.assign(new Error("recent"), { code: "auth/requires-recent-login" }),
    );
    firebase.reauthenticateWithGoogle.mockRejectedValue(
      Object.assign(new Error("popup fechado"), { code: "auth/popup-closed-by-user" }),
    );

    await montarLogado();
    await abrirPainel();
    await confirmarApagar();

    // A coleção já saiu; o popup só existe depois do `requires-recent-login`.
    expect(colecao.apagarColecao).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Coleção apagada, mas a conta de login permanece")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("falha ao apagar o documento aborta antes de tocar a conta", async () => {
    colecao.apagarColecao.mockResolvedValue({
      status: "erro",
      erro: new Error("permission-denied"),
    });

    await montarLogado();
    await abrirPainel();
    await confirmarApagar();

    expect(firebase.reauthenticateWithGoogle).not.toHaveBeenCalled();
    expect(firebase.deleteUserAccount).not.toHaveBeenCalled();
    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao apagar — toque para detalhes");
    fireEvent.click(screen.getByRole("button", { name: /Falha ao apagar/ }));
    expect(alerta).toHaveTextContent("permission-denied");
    // O painel permanece para uma nova tentativa.
    expect(screen.getByRole("button", { name: "Apagar definitivamente" })).toBeInTheDocument();
  });

  it("falha ao apagar a conta avisa em dourado e encerra a sessão", async () => {
    firebase.deleteUserAccount.mockRejectedValue(new Error("auth/network-request-failed"));

    await montarLogado();
    await abrirPainel();
    await confirmarApagar();

    expect(firebase.reauthenticateWithGoogle).not.toHaveBeenCalled();
    expect(colecao.apagarColecao).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Coleção apagada, mas a conta de login permanece")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("descarta as pendências da gravação agregada antes de apagar", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1); // pendência agendada no debounce
    });

    await abrirPainel();
    await confirmarApagar();

    // Sem o descarte, o debounce (4s) ou o teto (20s) gravaria de novo e
    // recriaria o documento recém-apagado.
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });

    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });
});
