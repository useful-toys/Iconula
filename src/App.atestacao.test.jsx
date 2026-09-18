// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Testes de integração da atestação de menores e do reaceite (Tarefas
// 0008-0003 e 0032-0003): quando o passo aparece, qual motivo, o que
// confirmar faz e a política de falha (IDR 0036, IDR 0062). A carga em si
// (Tarefa 0007-0002) é coberta em App.persistencia.test.jsx.

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
  gravarAceite: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  gravarAceite: colecao.gravarAceite,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";
import { VERSAO_TERMOS, VERSAO_POLITICA } from "./lib/versoesDosTextos.js";

const USUARIO = { uid: "uid1", displayName: "Daniel Ferber", photoURL: "p" };

// Documento de uma conta em dia com os textos: aceitou as versões publicadas.
function cargaAceita(extras = {}) {
  return {
    status: "encontrado",
    contagens: {},
    atualizadoEm: null,
    temTeamName: false,
    atestadoEm: true,
    termosVersao: VERSAO_TERMOS,
    politicaVersao: VERSAO_POLITICA,
    ...extras,
  };
}

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  colecao.carregarColecao.mockReset();
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAceite.mockReset();
  colecao.gravarAceite.mockResolvedValue({ status: "sucesso" });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "14:05" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  localStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});

function montarLogado() {
  authState.user = USUARIO;
  return render(<App />);
}

describe("App — atestação de menores", () => {
  it("conta sem atestadoEm vê o passo de primeiro acesso antes do catálogo", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: {},
      atualizadoEm: null,
      temTeamName: false,
      atestadoEm: false,
    });

    montarLogado();

    expect(await screen.findByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
  });

  it("confirmar grava a atestação uma vez e libera o catálogo", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue({ status: "vazio" });

    montarLogado();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    expect(colecao.gravarAceite).toHaveBeenCalledTimes(1);
    expect(colecao.gravarAceite).toHaveBeenCalledWith("uid1", { atestar: true });
    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
  });

  it("falha ao gravar libera o app assim mesmo, com aviso, sem mover o relógio", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue({ status: "vazio" });
    colecao.gravarAceite.mockResolvedValue({ status: "erro", erro: new Error("unavailable") });

    montarLogado();

    await user.click(await screen.findByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao gravar a atestação");
    // O relógio do título continua "—": a atestação não grava updatedAt e
    // não o move (ADR 0008, IDR 0027) — nem em sucesso, nem em falha.
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("App — reaceite dos textos", () => {
  it("versão igual à publicada não reabre o passo", async () => {
    colecao.carregarColecao.mockResolvedValue(cargaAceita());

    montarLogado();

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Li e concordo" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirmar" })).not.toBeInTheDocument();
  });

  it("versão divergente reabre com o texto de atualização", async () => {
    colecao.carregarColecao.mockResolvedValue(
      cargaAceita({ termosVersao: "2020-01-01" }),
    );

    montarLogado();

    expect(
      await screen.findByRole("button", { name: "Li e concordo" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
  });

  it("conta sem campo de versão reabre uma vez e, depois de gravado, não reabre", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue(
      cargaAceita({ termosVersao: null, politicaVersao: null }),
    );

    const { unmount } = montarLogado();

    await user.click(await screen.findByRole("button", { name: "Li e concordo" }));

    // O reaceite grava só o aceite — a atestação de idade não se repete.
    expect(colecao.gravarAceite).toHaveBeenCalledWith("uid1", { atestar: false });
    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });

    // A carga seguinte já encontra as versões publicadas: o passo não volta.
    unmount();
    colecao.carregarColecao.mockResolvedValue(cargaAceita());
    montarLogado();

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Li e concordo" })).not.toBeInTheDocument();
  });

  it("falha ao gravar o reaceite libera o catálogo com aviso", async () => {
    const user = userEvent.setup();
    colecao.carregarColecao.mockResolvedValue(
      cargaAceita({ termosVersao: null, politicaVersao: null }),
    );
    colecao.gravarAceite.mockResolvedValue({ status: "erro", erro: new Error("unavailable") });

    montarLogado();

    await user.click(await screen.findByRole("button", { name: "Li e concordo" }));

    await waitFor(() => {
      expect(screen.getByTestId("catalogo-mock")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao gravar o aceite");
  });
});
