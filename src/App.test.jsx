// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const {
  authState,
  signOutMock,
  signInWithGoogleMock,
} = vi.hoisted(() => ({
  authState: { user: null, callback: null },
  signOutMock: vi.fn(),
  signInWithGoogleMock: vi.fn(),
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
  signInWithGoogle: signInWithGoogleMock,
}));

// O catálogo completo (994 figurinhas) deixa os testes de auth lentos no
// jsdom. Os testes de App focam em login/logout; o catálogo é coberto pelos
// testes de Catalogo e Secao.
vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

const UID = "uid-do-usuario";

const CHAVE_PREFERENCIAS = "iconula.preferencias-vista.v1";

async function emitirAuth(user) {
  const { act } = await import("@testing-library/react");
  await act(async () => {
    authState.callback(user);
  });
}

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  it("renderiza o cabeçalho com a coleção vazia", () => {
    render(<App />);

    expect(
      screen.getByLabelText(/0 de 994, 0 por cento, 994 faltantes, 0 repetidas/),
    ).toBeInTheDocument();
  });

  it("mostra a área de login quando não há usuário autenticado", () => {
    render(<App />);
    expect(document.querySelector(".app__auth")).toBeInTheDocument();
  });

  it("mostra o nome do usuário e permite sair quando autenticado", async () => {
    const user = userEvent.setup();
    authState.user = {
      uid: UID,
      displayName: "Daniel Ferber",
      photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
    };

    render(<App />);

    expect(screen.getByText("Daniel Ferber")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("atualiza a tela ao fazer login e logout", async () => {
    const user = userEvent.setup();
    render(<App />);

    await emitirAuth({
      uid: UID,
      displayName: "Daniel Ferber",
      photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
    });

    expect(screen.getByText("Daniel Ferber")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("trocar a ordenação grava a preferência no localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "ordenar pela sigla da seção" }));

    expect(JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS))).toEqual({
      ordenacao: "sigla",
      disposicao: "lista",
      filtro: "todas",
    });
  });

  it("abre com as preferências guardadas na sessão anterior", () => {
    localStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ ordenacao: "sigla", disposicao: "lista", filtro: "repetidas" }),
    );

    render(<App />);

    expect(screen.getByRole("button", { name: "ordenar pela sigla da seção" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "disposição em lista contínua" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "mostrar apenas as figurinhas repetidas" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("o placar do título não muda ao filtrar por coladas", async () => {
    const user = userEvent.setup();
    render(<App />);

    const placar = () =>
      screen.getByLabelText(/0 de 994, 0 por cento, 994 faltantes, 0 repetidas/);

    expect(placar()).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "mostrar apenas as figurinhas coladas" }),
    );

    expect(placar()).toBeInTheDocument();
  });
});
