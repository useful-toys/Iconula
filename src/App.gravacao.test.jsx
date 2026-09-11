// Copyright (c) 2026 Daniel Felix Ferber

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração da gravação agregada (Tarefa 0007-0003): debounce,
// teto de espera, flush em `pagehide` e a ordem entre o flush e o `signOut`.
// A carga (Tarefa 0007-0002) é coberta em `App.persistencia.test.jsx`; aqui
// ela só devolve "vazio" para não interferir nos temporizadores falsos.

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
// figurinhas (mesma técnica de App.persistencia.test.jsx).
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

beforeEach(() => {
  vi.useFakeTimers();
  authState.user = null;
  authState.callback = null;
  catalogo.props = null;
  colecao.carregarColecao.mockReset();
  // "encontrado" com atestadoEm já gravado: estes testes cobrem a gravação
  // agregada, não a atestação (Tarefa 0008-0003) — conta já atestada, sem
  // o passo extra, para não interferir nos temporizadores falsos.
  colecao.carregarColecao.mockResolvedValue({
    status: "encontrado",
    contagens: {},
    atualizadoEm: null,
    temTeamName: false,
    atestadoEm: true,
  });
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAlteracoes.mockResolvedValue({
    status: "sucesso",
    atualizadoEm: new Date("2026-09-11T10:00:00"),
  });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "10:00" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  signOutMock.mockReset();
  signOutMock.mockResolvedValue(undefined);
  limparAvisos();
  localStorage.clear();
});

afterEach(() => {
  limparAvisos();
  vi.useRealTimers();
});

// Monta o App já autenticado e deixa a carga ("vazio") assentar.
async function montarLogado() {
  authState.user = USUARIO;
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("App — gravação agregada", () => {
  it("uma rajada de ajustes gera uma única escrita, após o debounce", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);
    expect(colecao.gravarAlteracoes).toHaveBeenCalledWith("uid1", { BRA01: 2 });
  });

  it("atividade contínua grava ao atingir o teto, sem esperar a rajada acabar", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    for (let i = 0; i < 9; i += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      await act(async () => {
        catalogo.props.onAjustar("BRA01", 1);
      });
    }
    // 9s de atividade contínua, sempre renovando o debounce de 2s: nada gravado ainda.
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);
  });

  it("a escrita contém só as chaves alteradas, com deleteField para as zeradas", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
      catalogo.props.onAjustar("FWC01", 1);
    });
    await act(async () => {
      catalogo.props.onAjustar("FWC01", -1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    // FWC01 voltou a 0 (chave apagada); só o valor absoluto atual vai na escrita —
    // a conversão para deleteField() é feita por `colecaoRemota.gravarAlteracoes`.
    expect(colecao.gravarAlteracoes).toHaveBeenCalledWith("uid1", { BRA01: 1, FWC01: 0 });
  });

  it("gravação bem-sucedida move o relógio e emite o aviso de sucesso", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("Alterações salvas")).toBeInTheDocument();
  });

  it("pagehide força a gravação pendente, sem esperar o debounce", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    await act(async () => {
      window.dispatchEvent(new Event("pagehide"));
      await Promise.resolve();
    });

    expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);
    expect(colecao.gravarAlteracoes).toHaveBeenCalledWith("uid1", { BRA01: 1 });
  });

  it("visibilitychange força a gravação pendente ao ocultar a aba", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    await act(async () => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);
  });

  it("visibilitychange ao voltar a ficar visível não força gravação", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    await act(async () => {
      Object.defineProperty(document, "visibilityState", {
        value: "visible",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
  });

  it("documento com teamName: a primeira gravação depois do login o apaga junto das contagens", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: {},
      atualizadoEm: new Date("2026-09-10T14:05:00"),
      temTeamName: true,
      atestadoEm: true,
    });

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(colecao.gravarAlteracoes).toHaveBeenCalledWith("uid1", {
      BRA01: 1,
      __apagarTeamName: true,
    });
  });

  it("o flush acontece antes do signOut, nunca depois", async () => {
    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    const ordem = [];
    let resolverGravacao;
    colecao.gravarAlteracoes.mockImplementation(
      () =>
        new Promise((resolve) => {
          ordem.push("grava");
          resolverGravacao = resolve;
        }),
    );
    signOutMock.mockImplementation(() => {
      ordem.push("signOut");
      return Promise.resolve();
    });

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    });

    // A gravação pendente ainda não terminou: signOut não pode ter acontecido.
    expect(ordem).toEqual(["grava"]);
    expect(signOutMock).not.toHaveBeenCalled();

    await act(async () => {
      resolverGravacao({ status: "sucesso", atualizadoEm: new Date() });
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(ordem).toEqual(["grava", "signOut"]);
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});

describe("App — política de erro visível (Tarefa 0007-0005)", () => {
  it("erro do servidor gera aviso vermelho persistente com detalhe técnico", async () => {
    colecao.gravarAlteracoes.mockResolvedValue({
      status: "erro",
      erro: new Error("permission-denied"),
    });

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao gravar — toque para detalhes");

    fireEvent.click(within(alerta).getByRole("button", { name: /Falha ao gravar/ }));
    expect(alerta).toHaveTextContent("permission-denied");
  });

  it("promessa pendente além de ~5s gera aviso dourado, não vermelho", async () => {
    let resolverGravacao;
    colecao.gravarAlteracoes.mockReturnValue(
      new Promise((resolve) => {
        resolverGravacao = resolve;
      }),
    );

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    // Debounce (2s) + tempo-limite de espera (5s).
    await act(async () => {
      await vi.advanceTimersByTimeAsync(7000);
    });

    expect(screen.getByText("Conexão instável — sincronizando quando possível")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await act(async () => {
      resolverGravacao({ status: "sucesso", atualizadoEm: new Date() });
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("Alterações salvas")).toBeInTheDocument();
  });

  it("depois de uma falha, a gravação seguinte inclui as chaves da tentativa anterior", async () => {
    colecao.gravarAlteracoes.mockResolvedValueOnce({
      status: "erro",
      erro: new Error("unavailable"),
    });

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(colecao.gravarAlteracoes).toHaveBeenCalledTimes(1);

    await act(async () => {
      catalogo.props.onAjustar("FWC01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(colecao.gravarAlteracoes).toHaveBeenLastCalledWith("uid1", { BRA01: 1, FWC01: 1 });
  });

  it("sucesso dispensa a falha de gravação que estiver na tela", async () => {
    colecao.gravarAlteracoes.mockResolvedValueOnce({
      status: "erro",
      erro: new Error("unavailable"),
    });

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await act(async () => {
      catalogo.props.onAjustar("FWC01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Alterações salvas")).toBeInTheDocument();
  });

  it("ajustar continua funcionando durante e depois de uma falha", async () => {
    colecao.gravarAlteracoes.mockResolvedValue({
      status: "erro",
      erro: new Error("unavailable"),
    });

    await montarLogado();

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(catalogo.props.contagens).toEqual({ BRA01: 1 });

    await act(async () => {
      catalogo.props.onAjustar("BRA01", 1);
    });

    expect(catalogo.props.contagens).toEqual({ BRA01: 2 });
  });
});
