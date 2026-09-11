// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração de importar a coleção de JSON (Tarefa 0009-0005):
// validação antes de qualquer efeito, confirmação explícita, substituição
// integral, descarte do histórico de desfazer, uma única escrita e a
// política de erro (aviso dourado para arquivo inválido, falha vermelha
// só para a gravação). Temporizadores falsos e `fireEvent` pelo mesmo
// motivo das demais suítes de integração desta fase.

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
  gravarImportacao: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  gravarImportacao: colecao.gravarImportacao,
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

function botaoDesfazer() {
  return screen.getByRole("button", { name: "desfazer a última alteração" });
}

async function abrirMenu() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /menu de ações/ }));
  });
}

function arquivoJson(conteudoObjeto) {
  const texto = typeof conteudoObjeto === "string" ? conteudoObjeto : JSON.stringify(conteudoObjeto);
  return new File([texto], "colecao.json", { type: "application/json" });
}

// Clica em "Importar", abre o seletor nativo (o `<input type="file">`
// oculto de `App.jsx`) e simula a escolha do arquivo.
async function importarArquivo(conteudoObjeto) {
  await abrirMenu();
  await act(async () => {
    fireEvent.click(screen.getByRole("menuitem", { name: "Importar coleção (JSON)" }));
  });

  const input = document.querySelector('input[type="file"]');
  const arquivo = arquivoJson(conteudoObjeto);
  Object.defineProperty(input, "files", { value: [arquivo], configurable: true });

  await act(async () => {
    fireEvent.change(input);
    // `arquivo.text()` e a validação são assíncronos — dá a volta ao
    // microtask queue antes de qualquer asserção.
    await Promise.resolve();
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
  colecao.gravarImportacao.mockReset();
  colecao.gravarImportacao.mockResolvedValue({ status: "sucesso", atualizadoEm: new Date("2026-09-11T14:00:00") });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "10:00" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  signOutMock.mockReset();
  limparAvisos();
  localStorage.clear();
  window.confirm = vi.fn(() => true);
});

afterEach(() => {
  limparAvisos();
  delete window.confirm;
  vi.useRealTimers();
});

describe("App — importar coleção de JSON", () => {
  it("arquivo válido, confirmado, substitui a coleção inteira", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1); // estado anterior, que será substituído
    });

    await importarArquivo({ versao: 1, geradoEm: "2026-09-11T10:00:00.000Z", contagens: { BRA05: 3, FWC01: 1 } });

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(catalogo.props.contagens).toEqual({ BRA05: 3, FWC01: 1 }); // ARG01 sumiu — substituição, não merge
    expect(screen.getByText("Coleção importada")).toBeInTheDocument();
  });

  it("descarta o histórico de desfazer", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1);
    });
    expect(botaoDesfazer()).toBeEnabled();

    await importarArquivo({ versao: 1, geradoEm: "2026-09-11T10:00:00.000Z", contagens: { BRA05: 3 } });

    expect(botaoDesfazer()).toBeDisabled();
  });

  it("a gravação é uma única escrita, via gravarImportacao", async () => {
    await montarLogado();

    await importarArquivo({ versao: 1, geradoEm: "2026-09-11T10:00:00.000Z", contagens: { BRA05: 3 } });

    expect(colecao.gravarImportacao).toHaveBeenCalledTimes(1);
    expect(colecao.gravarImportacao).toHaveBeenCalledWith("uid1", { BRA05: 3 }, expect.anything());
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });

  it("não confirmar não altera nada nem grava nada", async () => {
    window.confirm = vi.fn(() => false);
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1);
    });

    await importarArquivo({ versao: 1, geradoEm: "2026-09-11T10:00:00.000Z", contagens: { BRA05: 3 } });

    expect(catalogo.props.contagens).toEqual({ ARG01: 1 });
    expect(colecao.gravarImportacao).not.toHaveBeenCalled();
  });

  it("versão desconhecida é rejeitada com aviso, sem confirmar nem alterar nada", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1);
    });

    await importarArquivo({ versao: 2, contagens: { BRA05: 3 } });

    expect(window.confirm).not.toHaveBeenCalled();
    expect(catalogo.props.contagens).toEqual({ ARG01: 1 });
    expect(colecao.gravarImportacao).not.toHaveBeenCalled();
    expect(screen.getByText(/Arquivo inválido/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument(); // aviso, não falha
  });

  it("JSON malformado é rejeitado com aviso, sem alterar nada", async () => {
    await montarLogado();

    await importarArquivo("{ isto não é json");

    expect(catalogo.props.contagens).toEqual({});
    expect(colecao.gravarImportacao).not.toHaveBeenCalled();
    expect(screen.getByText(/Arquivo inválido/)).toBeInTheDocument();
  });

  it("valor 100 é rejeitado — o arquivo inteiro, sem alterar nada", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("ARG01", 1);
    });

    await importarArquivo({ versao: 1, contagens: { BRA05: 100 } });

    expect(catalogo.props.contagens).toEqual({ ARG01: 1 });
    expect(colecao.gravarImportacao).not.toHaveBeenCalled();
  });

  it("valor negativo é rejeitado — o arquivo inteiro, sem alterar nada", async () => {
    await montarLogado();

    await importarArquivo({ versao: 1, contagens: { BRA05: -1 } });

    expect(catalogo.props.contagens).toEqual({});
    expect(colecao.gravarImportacao).not.toHaveBeenCalled();
  });

  it("chave fora do catálogo é descartada e avisada, sem impedir o resto", async () => {
    await montarLogado();

    await importarArquivo({ versao: 1, contagens: { BRA05: 3, XXX99: 5 } });

    expect(catalogo.props.contagens).toEqual({ BRA05: 3 });
    expect(screen.getByText(/não existem no catálogo atual e foram descartadas/)).toBeInTheDocument();
    expect(screen.getByText("Coleção importada")).toBeInTheDocument();
  });

  it("falha ao gravar emite faixa vermelha, mas a coleção em memória já é a importada", async () => {
    colecao.gravarImportacao.mockResolvedValue({ status: "erro", erro: new Error("permission-denied") });
    await montarLogado();

    await importarArquivo({ versao: 1, contagens: { BRA05: 3 } });

    expect(catalogo.props.contagens).toEqual({ BRA05: 3 });
    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao gravar a importação — toque para detalhes");
    fireEvent.click(screen.getByRole("button", { name: /Falha ao gravar a importação/ }));
    expect(alerta).toHaveTextContent("permission-denied");
  });

  it("exportar e reimportar (com uma alteração no meio) restaura a coleção original", async () => {
    await montarLogado();
    act(() => {
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
      catalogo.props.onAjustar("BRA05", 1);
    }); // BRA05: 3 — o estado que será "exportado"

    const arquivoExportado = { versao: 1, geradoEm: "2026-09-11T10:00:00.000Z", contagens: { BRA05: 3 } };

    // Muda o estado antes de reimportar, para o teste provar que a
    // importação de fato restaura, e não é um no-op.
    act(() => {
      catalogo.props.onAjustar("ARG01", 1);
    });
    expect(catalogo.props.contagens).toEqual({ BRA05: 3, ARG01: 1 });

    await importarArquivo(arquivoExportado);

    expect(catalogo.props.contagens).toEqual({ BRA05: 3 });
  });
});
