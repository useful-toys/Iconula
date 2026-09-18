// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração da vista Sobre (Tarefa 0033-0001): alcançável da tela
// de login (sem sessão) e do rodapé da tela principal (com sessão); voltar
// devolve à tela de origem sem depender do histórico do navegador (TDR 0020),
// e `vistaInterna === 'sobre'` substitui a tela por inteiro.

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

describe("App — Sobre", () => {
  it("é alcançável a partir da tela de login, sem sessão, e volta para ela", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const links = container.querySelector(".tela-de-login__links");
    await user.click(within(links).getByRole("button", { name: "Sobre" }));

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
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
    await user.click(within(rodape).getByRole("button", { name: "Sobre" }));

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
  });

  it("é alcançável pelo menu de ações do cabeçalho, e volta para a tela principal", async () => {
    const user = userEvent.setup();
    authState.user = USUARIO;
    render(<App />);

    expect(await screen.findByTestId("catalogo-mock")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /menu de ações/ }));
    const menu = screen.getByRole("menu");
    await user.click(within(menu).getByRole("menuitem", { name: "Sobre" }));

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
  });

  it("com a vista Sobre aberta não há como abrir os termos", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Sobre" }));

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Termos de uso" })).not.toBeInTheDocument();
  });
});
