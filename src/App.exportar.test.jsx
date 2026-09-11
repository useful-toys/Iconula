// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração de exportar a coleção em JSON (Tarefa 0009-0004):
// formato do arquivo, download sem diálogo (IDR 0040), aviso de sucesso e
// de falha, e nenhuma requisição ao Firestore. Temporizadores falsos e
// `fireEvent` pelo mesmo motivo de `App.copiar.test.jsx` (evitar que o
// debounce real da gravação agregada vaze entre testes).

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

async function abrirMenu() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /menu de ações/ }));
  });
}

async function clicarExportar() {
  await act(async () => {
    fireEvent.click(screen.getByRole("menuitem", { name: "Exportar coleção (JSON)" }));
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
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("App — exportar coleção em JSON", () => {
  it("baixa um arquivo com versao, geradoEm e as contagens em memória, sem diálogo", async () => {
    let blobCapturado;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      blobCapturado = blob;
      return "blob:mock";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const cliqueSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
    });

    await abrirMenu();
    await clicarExportar();

    expect(cliqueSpy).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");

    const texto = await blobCapturado.text();
    const arquivo = JSON.parse(texto);
    expect(Object.keys(arquivo).sort()).toEqual(["contagens", "geradoEm", "versao"]);
    expect(arquivo.versao).toBe(1);
    expect(arquivo.contagens).toEqual({ BRA05: 2 });
    expect(() => new Date(arquivo.geradoEm).toISOString()).not.toThrow();

    expect(screen.getByText("Coleção exportada")).toBeInTheDocument();
  });

  it("o arquivo não tem nenhum dado pessoal (uid, e-mail, nome, foto)", async () => {
    let blobCapturado;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      blobCapturado = blob;
      return "blob:mock";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await montarLogado();
    await abrirMenu();
    await clicarExportar();

    const texto = (await blobCapturado.text()).toLowerCase();
    expect(texto).not.toMatch(/uid1|daniel|e-?mail|foto|photo|display/);
  });

  it("o nome do arquivo segue iconula-AAAA-MM-DD.json", async () => {
    vi.setSystemTime(new Date("2026-09-11T12:00:00"));
    let nomeCapturado;
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const criarElemento = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      const elemento = criarElemento(tag);
      if (tag === "a") {
        const original = elemento.click.bind(elemento);
        elemento.click = () => {
          nomeCapturado = elemento.download;
          original();
        };
      }
      return elemento;
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await montarLogado();
    await abrirMenu();
    await clicarExportar();

    expect(nomeCapturado).toBe("iconula-2026-09-11.json");
  });

  it("falha ao exportar emite faixa vermelha com detalhe", async () => {
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => {
      throw new Error("falha ao gerar o blob");
    });

    await montarLogado();
    await abrirMenu();
    await clicarExportar();

    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao exportar — toque para detalhes");
    fireEvent.click(screen.getByRole("button", { name: /Falha ao exportar/ }));
    expect(alerta).toHaveTextContent("falha ao gerar o blob");
  });

  it("exportar não dispara nenhuma leitura ou escrita no Firestore", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await montarLogado();
    colecao.carregarColecao.mockClear();
    colecao.gravarAlteracoes.mockClear();

    await abrirMenu();
    await clicarExportar();

    expect(colecao.carregarColecao).not.toHaveBeenCalled();
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });
});
