// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração da vista de termos de uso (Tarefa 0020-0003):
// alcançável das duas telas, e voltar devolve para a tela de origem sem
// depender do histórico do navegador (TDR 0020); com a política aberta não há
// como abrir os termos — o estado único de vista interna impede as duas ao
// mesmo tempo.

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

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: vi.fn(() =>
    Promise.resolve({
      status: "encontrado",
      contagens: {},
      atualizadoEm: null,
      temTeamName: false,
      atestadoEm: true,
      termosVersao: "2026-09-17",
      politicaVersao: "2026-09-18",
    }),
  ),
  gravarAlteracoes: vi.fn(() => Promise.resolve({ status: "indisponivel" })),
  gravarAceite: vi.fn(() => Promise.resolve({ status: "sucesso" })),
  formatarCarimbo: vi.fn(() => "—"),
  mensagemDeErro: vi.fn(() => "erro"),
}));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

const USUARIO = { uid: "uid1", displayName: "Daniel Ferber", photoURL: "p" };

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("App — termos de uso", () => {
  it("é alcançável a partir da tela de login, sem sessão, e volta para ela", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const atestacao = container.querySelector(".tela-de-login__atestacao");
    await user.click(within(atestacao).getByRole("button", { name: "Termos de uso" }));

    expect(screen.getByRole("heading", { name: "Termos de uso" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /entrar com google/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByRole("button", { name: /entrar com google/i })).toBeInTheDocument();
  });

  it("é alcançável a partir do rodapé da tela principal, e volta para ela", async () => {
    const user = userEvent.setup();
    authState.user = USUARIO;
    const { container } = render(<App />);

    expect(await screen.findByTestId("catalogo-mock")).toBeInTheDocument();

    const rodape = container.querySelector(".rodape");
    await user.click(within(rodape).getByRole("button", { name: "Termos de uso" }));

    expect(screen.getByRole("heading", { name: "Termos de uso" })).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
  });

  it("com a política aberta não há como abrir os termos", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(screen.getByRole("heading", { name: "Política de privacidade" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Termos de uso" })).not.toBeInTheDocument();
  });
});
