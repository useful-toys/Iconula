// Copyright (c) 2026 Daniel Felix Ferber

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { sortedTeams } from "./data/teams";

const {
  authState,
  signOutMock,
  signInWithGoogleMock,
  loadCurrentTeamMock,
  saveCurrentTeamMock,
} = vi.hoisted(() => ({
  authState: { user: null, callback: null },
  signOutMock: vi.fn(),
  signInWithGoogleMock: vi.fn(),
  loadCurrentTeamMock: vi.fn(),
  saveCurrentTeamMock: vi.fn(),
}));

// API modular: `onAuthStateChanged`/`signOut` são funções importadas de
// "firebase/auth" e recebem `auth` como primeiro argumento — não são mais
// métodos da instância (ver ADR 0005).
//
// O callback é guardado em `authState.callback` para que os testes possam
// simular login e logout *depois* da montagem: os requisitos de
// persistência (ADR 0007) são sobre transições, não sobre o estado
// inicial.
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

// Mocka a camada de persistência, não o SDK do Firestore: os testes de
// App cuidam do comportamento da tela, e src/lib/userPreferences.test.js
// cuida da conversa com o Firestore.
vi.mock("./lib/userPreferences", () => ({
  loadCurrentTeam: loadCurrentTeamMock,
  saveCurrentTeam: saveCurrentTeamMock,
}));

// O catálogo completo (994 figurinhas) deixa os testes do botão muito
// lentos no jsdom. Os testes de App focam no botão e na auth; o catálogo
// é coberto pelos testes de Catalogo e Secao.
vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

const UID = "uid-do-usuario";

// Simula o onAuthStateChanged disparando depois da montagem (login,
// logout ou troca de conta).
async function emitirAuth(user) {
  await act(async () => {
    authState.callback(user);
  });
}

async function clicarNoTime(user, team) {
  await user.click(screen.getByRole("button", { name: team.name }));
}

beforeEach(() => {
  loadCurrentTeamMock.mockResolvedValue({ status: "empty" });
  saveCurrentTeamMock.mockResolvedValue(undefined);
});

afterEach(() => {
  authState.user = null;
  authState.callback = null;
  vi.clearAllMocks();
});

describe("App", () => {
  it("mostra o primeiro time em ordem alfabética ao carregar", () => {
    render(<App />);
    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });

  it("avança para o próximo time ao clicar no botão do time", async () => {
    const user = userEvent.setup();
    render(<App />);

    await clicarNoTime(user, sortedTeams[0]);

    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
  });

  it("volta para o primeiro time após clicar no último (wrap-around)", async () => {
    const user = userEvent.setup();
    render(<App />);

    for (let i = 0; i < sortedTeams.length; i++) {
      await clicarNoTime(user, sortedTeams[i % sortedTeams.length]);
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
      uid: UID,
      displayName: "Daniel Ferber",
      photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
    };

    render(<App />);

    expect(screen.getByText("Daniel Ferber")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});

describe("App — persistência do time visível", () => {
  it("não grava nada enquanto o usuário está deslogado", async () => {
    const user = userEvent.setup();
    render(<App />);

    await clicarNoTime(user, sortedTeams[0]);

    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
    expect(saveCurrentTeamMock).not.toHaveBeenCalled();
    expect(loadCurrentTeamMock).not.toHaveBeenCalled();
  });

  it("grava o nome do time exibido a cada clique do usuário logado", async () => {
    const user = userEvent.setup();
    render(<App />);
    await emitirAuth({ uid: UID });

    await clicarNoTime(user, sortedTeams[0]);
    await clicarNoTime(user, sortedTeams[1]);

    expect(saveCurrentTeamMock).toHaveBeenCalledTimes(2);
    expect(saveCurrentTeamMock).toHaveBeenNthCalledWith(
      1,
      UID,
      sortedTeams[1].name,
    );
    expect(saveCurrentTeamMock).toHaveBeenNthCalledWith(
      2,
      UID,
      sortedTeams[2].name,
    );
  });

  it("mostra o time salvo ao fazer login", async () => {
    loadCurrentTeamMock.mockResolvedValue({
      status: "found",
      teamName: sortedTeams[7].name,
    });

    render(<App />);
    await emitirAuth({ uid: UID });

    expect(loadCurrentTeamMock).toHaveBeenCalledWith(UID);
    expect(screen.getByText(sortedTeams[7].name)).toBeInTheDocument();
  });

  it("volta ao primeiro time se o nome salvo não existe mais na lista", async () => {
    const user = userEvent.setup();
    loadCurrentTeamMock.mockResolvedValue({
      status: "found",
      teamName: "Atlântida",
    });

    render(<App />);
    await clicarNoTime(user, sortedTeams[0]);
    await emitirAuth({ uid: UID });

    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });

  it("mantém a bandeira da tela no primeiro login, quando não há nada salvo", async () => {
    const user = userEvent.setup();
    loadCurrentTeamMock.mockResolvedValue({ status: "empty" });

    render(<App />);
    await clicarNoTime(user, sortedTeams[0]);
    await clicarNoTime(user, sortedTeams[1]);
    await emitirAuth({ uid: UID });

    expect(screen.getByText(sortedTeams[2].name)).toBeInTheDocument();
    expect(saveCurrentTeamMock).not.toHaveBeenCalled();
  });

  it("mantém a bandeira da tela quando a leitura falha", async () => {
    const user = userEvent.setup();
    loadCurrentTeamMock.mockResolvedValue({ status: "error" });

    render(<App />);
    await clicarNoTime(user, sortedTeams[0]);
    await emitirAuth({ uid: UID });

    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
  });

  it("ignora a leitura que chega depois de o usuário já ter clicado", async () => {
    const user = userEvent.setup();
    let concluirLeitura;
    loadCurrentTeamMock.mockReturnValue(
      new Promise((resolve) => {
        concluirLeitura = resolve;
      }),
    );

    render(<App />);
    await emitirAuth({ uid: UID });

    // Clica enquanto a leitura ainda está em voo.
    await clicarNoTime(user, sortedTeams[0]);

    await act(async () => {
      concluirLeitura({ status: "found", teamName: sortedTeams[7].name });
    });

    // O clique é mais recente que a resposta do servidor.
    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
  });

  it("mantém a bandeira na tela e para de gravar ao sair", async () => {
    const user = userEvent.setup();
    render(<App />);
    await emitirAuth({ uid: UID });

    await clicarNoTime(user, sortedTeams[0]);
    await emitirAuth(null);
    await clicarNoTime(user, sortedTeams[1]);

    expect(screen.getByText(sortedTeams[2].name)).toBeInTheDocument();
    expect(saveCurrentTeamMock).toHaveBeenCalledTimes(1);
  });
});
