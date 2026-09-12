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
  // Largura de navegador (IDR 0043): mantém o comportamento que os testes
  // abaixo já assumiam (disposição em lista, ordenação por sigla) sem
  // preferência guardada. Os testes da faixa de tela ficam no describe
  // dedicado mais abaixo, que define a própria largura em cada caso.
  window.innerWidth = 1280;
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

    // Largura de navegador (`beforeEach`): sem preferência guardada, abre
    // por sigla/lista (IDR 0043) — troca para página do álbum para
    // exercitar a gravação de uma mudança real.
    await user.click(screen.getByRole("button", { name: "ordenar pela página do álbum" }));

    expect(JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS))).toEqual({
      ordenacao: "pagina",
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

// Tarefa 0010-0003, IDR 0043: padrões de primeira abertura por faixa de
// tela. `window.innerWidth` é lido uma única vez, na inicialização
// preguiçosa do `useState` de `App.jsx` — cada teste define a largura
// antes de `render`.
describe("App — padrões de primeira abertura por faixa de tela (IDR 0043)", () => {
  function botaoDeOrdenacao(nome) {
    return screen.getByRole("button", { name: nome });
  }

  it("sem preferência guardada, celular abre com página do álbum e disposição álbum", async () => {
    window.innerWidth = 360;
    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    expect(botaoDeOrdenacao("ordenar pela página do álbum")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(botaoDeOrdenacao("disposição como no álbum")).toHaveAttribute("aria-pressed", "true");
  });

  it("sem preferência guardada, tablet abre com página do álbum e disposição álbum", async () => {
    window.innerWidth = 800;
    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    expect(botaoDeOrdenacao("ordenar pela página do álbum")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(botaoDeOrdenacao("disposição como no álbum")).toHaveAttribute("aria-pressed", "true");
  });

  it("sem preferência guardada, navegador abre com sigla e disposição em lista", async () => {
    window.innerWidth = 1280;
    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    expect(botaoDeOrdenacao("ordenar pela sigla da seção")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(botaoDeOrdenacao("disposição em lista contínua")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("com preferência guardada, a faixa de tela (celular) é ignorada", async () => {
    window.innerWidth = 360;
    localStorage.setItem(
      CHAVE_PREFERENCIAS,
      JSON.stringify({ ordenacao: "sigla", disposicao: "lista", filtro: "todas" }),
    );

    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    expect(botaoDeOrdenacao("ordenar pela sigla da seção")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(botaoDeOrdenacao("disposição em lista contínua")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("redimensionar a janela não altera a ordenação nem a disposição da sessão corrente", async () => {
    window.innerWidth = 360;
    render(<App />);
    await emitirAuth(USUARIO_LOGADO);

    expect(botaoDeOrdenacao("disposição como no álbum")).toHaveAttribute("aria-pressed", "true");

    // Alarga a janela para o tamanho de navegador e dispara um `resize` —
    // a faixa só é lida na abertura, então nada muda na sessão corrente.
    window.innerWidth = 1280;
    window.dispatchEvent(new Event("resize"));

    expect(botaoDeOrdenacao("ordenar pela página do álbum")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(botaoDeOrdenacao("disposição como no álbum")).toHaveAttribute("aria-pressed", "true");
  });
});
