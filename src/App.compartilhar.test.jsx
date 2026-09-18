// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração do compartilhar pela folha do sistema (Tarefa
// 0021-0002, IDR 0024): "Compartilhar faltantes…" e "Compartilhar repetidas…"
// mandam o mesmo texto da cópia (IDR 0039) para `navigator.share`; o sucesso
// avisa, o cancelamento (`AbortError`) não avisa e outra rejeição cai na
// cópia, com o mesmo texto e a reserva do IDR 0039. Os itens só existem onde
// `navigator.share` existe. A carga fica "vazia" para os testes começarem do
// zero, e os temporizadores falsos/mocks seguem `App.copiar.test.jsx`.

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
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
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

async function abrirCompartilhar() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /compartilhar listas de troca/ }));
  });
}

// `act(async …)` sozinho não garante que a promise de `compartilharLista`
// (dentro do onClick) já tenha avançado até o `emitirAviso`/a cópia — os dois
// `Promise.resolve()` dão a volta ao microtask queue que falta.
async function clicarItem(nome) {
  await act(async () => {
    fireEvent.click(screen.getByRole("menuitem", { name: nome }));
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function avancarMicrotarefas() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function montarLogado() {
  authState.user = USUARIO;
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}

// `navigator.share` e `navigator.clipboard` não existem por padrão no jsdom —
// cada teste define o que precisa via `Object.defineProperty`, restaurado no
// `afterEach`.
function definirShare(valor) {
  Object.defineProperty(navigator, "share", { value: valor, configurable: true });
}

function definirClipboard(valor) {
  Object.defineProperty(navigator, "clipboard", { value: valor, configurable: true });
}

function erroDeCancelamento() {
  return Object.assign(new Error("cancelado"), { name: "AbortError" });
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
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "10:00" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  signOutMock.mockReset();
  limparAvisos();
  localStorage.clear();
});

afterEach(() => {
  limparAvisos();
  delete navigator.share;
  delete navigator.clipboard;
  delete window.prompt;
  vi.useRealTimers();
});

describe("App — compartilhar listas de troca", () => {
  it("manda para a folha o mesmo texto que a cópia geraria", async () => {
    const compartilhar = vi.fn().mockResolvedValue(undefined);
    definirShare(compartilhar);
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
    }); // contagem 2 → repetidas "Brasil BRA: 05×1"

    await abrirCompartilhar();
    await clicarItem("Compartilhar repetidas…");
    const textoCompartilhado = compartilhar.mock.calls[0][0].text;

    await abrirCompartilhar();
    await clicarItem("Copiar lista de repetidas");
    const textoCopiado = escrever.mock.calls[0][0];

    expect(textoCompartilhado).toBe(textoCopiado);
    expect(textoCompartilhado).toBe("Brasil BRA: 05×1");
  });

  it("sucesso emite 'Lista compartilhada', sem falha", async () => {
    definirShare(vi.fn().mockResolvedValue(undefined));
    await montarLogado();

    await abrirCompartilhar();
    await clicarItem("Compartilhar faltantes…");

    expect(screen.getByText("Lista compartilhada")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("fechar a folha sem escolher (AbortError) não emite aviso nem copia", async () => {
    definirShare(vi.fn().mockRejectedValue(erroDeCancelamento()));
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    await abrirCompartilhar();
    await clicarItem("Compartilhar faltantes…");
    await avancarMicrotarefas();

    expect(screen.queryByText("Lista compartilhada")).not.toBeInTheDocument();
    expect(screen.queryByText("Lista copiada")).not.toBeInTheDocument();
    expect(escrever).not.toHaveBeenCalled();
  });

  it("outra rejeição cai na cópia, com o mesmo texto", async () => {
    definirShare(vi.fn().mockRejectedValue(new Error("sem app")));
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
    });

    await abrirCompartilhar();
    await clicarItem("Compartilhar faltantes…");
    await avancarMicrotarefas();

    expect(escrever).toHaveBeenCalledTimes(1);
    expect(escrever.mock.calls[0][0]).toContain("Brasil BRA:");
    expect(screen.getByText("Lista copiada")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("compartilhar não dispara nenhuma leitura ou escrita no Firestore", async () => {
    definirShare(vi.fn().mockResolvedValue(undefined));
    await montarLogado();

    colecao.carregarColecao.mockClear();
    colecao.gravarAlteracoes.mockClear();

    await abrirCompartilhar();
    await clicarItem("Compartilhar faltantes…");
    await abrirCompartilhar();
    await clicarItem("Compartilhar repetidas…");

    expect(colecao.carregarColecao).not.toHaveBeenCalled();
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });
});
