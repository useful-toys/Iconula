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
  authState: { callback: null },
  signOutMock: vi.fn(),
  signInWithGoogleMock: vi.fn(),
}));

// A emissão não é automática (ao contrário de versões anteriores deste
// mock): a guarda de login (Tarefa 0008-0001) depende do intervalo entre o
// primeiro render e a primeira emissão de `onAuthStateChanged` — os testes
// desse intervalo precisam controlar quando ele chega (ver IDR 0035).
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, callback) => {
    authState.callback = callback;
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

// A persistência é exercitada em App.persistencia.test.jsx; aqui a carga fica
// indisponível para os testes de auth ficarem focados e não tocarem o Firestore.
vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: vi.fn(() => Promise.resolve({ status: "indisponivel" })),
  gravarAlteracoes: vi.fn(() => Promise.resolve({ status: "indisponivel" })),
  formatarCarimbo: vi.fn(() => "—"),
  mensagemDeErro: vi.fn(() => "erro"),
}));

// O catálogo completo (994 figurinhas) deixa os testes de auth lentos no
// jsdom. Os testes de App focam em login/logout; o catálogo é coberto pelos
// testes de Catalogo e Secao.
vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

const UID = "uid-do-usuario";
const USUARIO_LOGADO = {
  uid: UID,
  displayName: "Daniel Ferber",
  photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
};

const CHAVE_PREFERENCIAS = "iconula.preferencias-vista.v1";

async function emitirAuth(user) {
  const { act } = await import("@testing-library/react");
  await act(async () => {
    authState.callback(user);
  });
}

// O menu de ações (Tarefa 0009-0002) é um fixo da tela principal — melhor
// marcador de "tela principal" do que `.app__auth`, que era só a casa
// provisória do `AuthStatus`, agora aposentado.
function possuiTelaPrincipal() {
  return (
    screen.queryByRole("button", { name: /menu de ações/ }) !== null &&
    screen.queryByTestId("catalogo-mock") !== null
  );
}

function possuiBotaoDeLogin() {
  return screen.queryByRole("button", { name: /entrar com google/i }) !== null;
}

// "Sair da conta" mora no menu de ações do cabeçalho (Tarefa 0009-0002) —
// não mais um botão "Sair" direto na tela, como na área de login provisória.
// O item tem `role="menuitem"` explícito, não "button".
async function sairDaConta(user) {
  await user.click(screen.getByRole("button", { name: /menu de ações/ }));
  await user.click(screen.getByRole("menuitem", { name: "Sair da conta" }));
}

beforeEach(() => {
  authState.callback = null;
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("App — guarda de login", () => {
  it("não mostra login nem catálogo enquanto a sessão ainda não resolveu", () => {
    render(<App />);

    expect(possuiBotaoDeLogin()).toBe(false);
    expect(possuiTelaPrincipal()).toBe(false);
    expect(document.querySelector(".app__auth")).not.toBeInTheDocument();
  });

  it("mostra só a tela de login quando a sessão resolve sem usuário", async () => {
    render(<App />);

    await emitirAuth(null);

    expect(possuiBotaoDeLogin()).toBe(true);
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
  });

  it("mostra a tela principal quando a sessão resolve com usuário", async () => {
    render(<App />);

    await emitirAuth(USUARIO_LOGADO);

    expect(possuiTelaPrincipal()).toBe(true);
    expect(possuiBotaoDeLogin()).toBe(false);
    expect(
      screen.getByLabelText(/0 de 994, 0 por cento, 994 faltantes, 0 repetidas/),
    ).toBeInTheDocument();
  });

  it("permite sair da conta pelo menu de ações quando autenticado", async () => {
    const user = userEvent.setup();
    render(<App />);

    await emitirAuth(USUARIO_LOGADO);

    await sairDaConta(user);

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("troca da tela principal para a de login ao sair", async () => {
    const user = userEvent.setup();
    render(<App />);

    await emitirAuth(USUARIO_LOGADO);
    expect(possuiTelaPrincipal()).toBe(true);

    await sairDaConta(user);
    await emitirAuth(null);

    expect(possuiTelaPrincipal()).toBe(false);
    expect(possuiBotaoDeLogin()).toBe(true);
  });
});

describe("App — tela principal", () => {
  it("trocar a ordenação grava a preferência no localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    await user.click(screen.getByRole("button", { name: "ordenar pela sigla da seção" }));

    expect(JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS))).toEqual({
      ordenacao: "sigla",
      disposicao: "lista",
      filtro: "todas",
    });
  });

  it("abre com as preferências guardadas na sessão anterior", async () => {
    localStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ ordenacao: "sigla", disposicao: "lista", filtro: "repetidas" }),
    );

    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

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
    await emitirAuth(USUARIO_LOGADO);

    const placar = () =>
      screen.getByLabelText(/0 de 994, 0 por cento, 994 faltantes, 0 repetidas/);

    expect(placar()).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "mostrar apenas as figurinhas coladas" }),
    );

    expect(placar()).toBeInTheDocument();
  });
});
