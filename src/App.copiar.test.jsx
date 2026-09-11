// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração dos textos de troca (Tarefa 0009-0003): geração a
// partir da coleção em memória, cópia para a área de transferência e o
// aviso dourado (não falha) com cópia manual de reserva quando a área de
// transferência não está disponível (IDR 0039). A carga fica "vazia" para
// os testes começarem do zero.
//
// Temporizadores falsos (como em `App.gravacao.test.jsx`): sem eles, o
// debounce real de 2s da gravação agregada de um `onAjustar` de um teste
// pode disparar durante um teste seguinte e poluir as asserções sobre
// `gravarAlteracoes`. `fireEvent` em vez de `userEvent` pelo mesmo motivo
// (o `userEvent` depende de temporizadores reais para os delays simulados).

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

// Captura as props do catálogo para disparar ajustes sem renderizar as 994
// figurinhas (mesma técnica das demais suítes de integração de App).
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

async function abrirMenu() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /menu de ações/ }));
  });
}

// `act(async …)` sozinho não garante que a promise de `copiarParaAreaDeTransferencia`
// (dentro do onClick) já tenha avançado até o `emitirAviso` — os dois
// `Promise.resolve()` dão a volta ao microtask queue que falta.
async function clicarItem(nome) {
  await act(async () => {
    fireEvent.click(screen.getByRole("menuitem", { name: nome }));
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

// `navigator.clipboard` não existe por padrão no jsdom — cada teste define a
// sua própria via `Object.defineProperty` (mesma técnica já usada em
// `App.gravacao.test.jsx` para `document.visibilityState`), restaurada no
// `afterEach`.
function definirClipboard(valor) {
  Object.defineProperty(navigator, "clipboard", { value: valor, configurable: true });
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
  delete navigator.clipboard;
  delete window.prompt;
  vi.useRealTimers();
});

describe("App — copiar listas de troca", () => {
  it("copia o texto de faltantes gerado a partir da coleção em memória", async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    // BRA01 colada; o resto do Brasil (05, 08, 12, 19...) fica faltante,
    // mas só precisamos conferir que o texto reflete a coleção em memória.
    act(() => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    await abrirMenu();
    await clicarItem("Copiar lista de faltantes");

    expect(escrever).toHaveBeenCalledTimes(1);
    const texto = escrever.mock.calls[0][0];
    expect(texto).toContain("Brasil BRA:");
    expect(texto).not.toMatch(/\bBRA1\b/); // BRA01 (colada) não entra na lista de faltantes
    expect(screen.getByText("Lista copiada")).toBeInTheDocument();
  });

  it("copia o texto de repetidas com as unidades sobrando (contagem − 1)", async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
    }); // contagem 3 → 2 unidades sobrando

    await abrirMenu();
    await clicarItem("Copiar lista de repetidas");

    expect(escrever).toHaveBeenCalledWith("Brasil BRA: 5×2");
    expect(screen.getByText("Lista copiada")).toBeInTheDocument();
  });

  it("os dois comandos geram textos separados, nunca um só", async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
    });

    await abrirMenu();
    await clicarItem("Copiar lista de repetidas");
    await abrirMenu();
    await clicarItem("Copiar lista de faltantes");

    expect(escrever).toHaveBeenCalledTimes(2);
    expect(escrever.mock.calls[0][0]).not.toBe(escrever.mock.calls[1][0]);
  });

  it("sem a API de área de transferência, emite aviso dourado e mostra o texto para cópia manual", async () => {
    definirClipboard(undefined);
    const promptMock = vi.fn();
    window.prompt = promptMock;
    await montarLogado();

    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
    });

    await abrirMenu();
    await clicarItem("Copiar lista de faltantes");

    // `getByRole("status")` seria ambíguo: a carga também emite um aviso de
    // sucesso ("Coleção carregada") com a mesma role.
    expect(screen.getByText(/Área de transferência indisponível/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(); // aviso, não falha
    expect(promptMock).toHaveBeenCalledTimes(1);
    expect(promptMock.mock.calls[0][1]).toContain("Brasil BRA:");
  });

  it("área de transferência negada (rejeita) também emite aviso, não falha", async () => {
    const escrever = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    definirClipboard({ writeText: escrever });
    const promptMock = vi.fn();
    window.prompt = promptMock;
    await montarLogado();

    await abrirMenu();
    await clicarItem("Copiar lista de repetidas");
    // A rejeição do `writeText` resolve numa microtask — dá a volta ao
    // event loop antes de conferir o aviso.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText(/Área de transferência indisponível/)).toBeInTheDocument();
    expect(promptMock).toHaveBeenCalledTimes(1);
  });

  it("copiar não dispara nenhuma leitura ou escrita no Firestore", async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    await montarLogado();

    colecao.carregarColecao.mockClear();
    colecao.gravarAlteracoes.mockClear();

    await abrirMenu();
    await clicarItem("Copiar lista de faltantes");
    await abrirMenu();
    await clicarItem("Copiar lista de repetidas");

    expect(colecao.carregarColecao).not.toHaveBeenCalled();
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });
});
