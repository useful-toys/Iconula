// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { sortedTeams } from "./data/teams";

const { authState, signOutMock, signInWithGoogleMock } = vi.hoisted(() => ({
  authState: { user: null },
  signOutMock: vi.fn(),
  signInWithGoogleMock: vi.fn(),
}));

// API modular: `onAuthStateChanged`/`signOut` são funções importadas de
// "firebase/auth" e recebem `auth` como primeiro argumento — não são mais
// métodos da instância (ver ADR 0005).
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, callback) => {
    callback(authState.user);
    return () => {};
  },
  signOut: signOutMock,
}));

vi.mock("./lib/firebase", () => ({
  auth: {},
  signInWithGoogle: signInWithGoogleMock,
}));

import App from "./App";

afterEach(() => {
  authState.user = null;
  signOutMock.mockClear();
});

describe("App", () => {
  it("mostra o primeiro time em ordem alfabética ao carregar", () => {
    render(<App />);
    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });

  it("avança para o próximo time ao clicar no botão do time", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: sortedTeams[0].name }));

    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
  });

  it("volta para o primeiro time após clicar no último (wrap-around)", async () => {
    const user = userEvent.setup();
    render(<App />);

    for (let i = 0; i < sortedTeams.length; i++) {
      await user.click(screen.getByRole("button", { name: sortedTeams[i % sortedTeams.length].name }));
    }

    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });

  it("mostra o login quando não há usuário autenticado", () => {
    render(<App />);
    expect(document.querySelector(".app__auth")).toBeInTheDocument();
  });

  it("mostra o nome do usuário e permite sair quando autenticado", async () => {
    const user = userEvent.setup();
    authState.user = {
      displayName: "Daniel Ferber",
      photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
    };

    render(<App />);

    expect(screen.getByText("Daniel Ferber")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});
