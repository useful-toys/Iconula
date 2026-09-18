// Copyright (c) 2026 Daniel Felix Ferber

// Testes de integração da vista do catálogo compartilhado por link (Tarefa
// 0027-0003, IDR 0055, TDR 0020): `/catalogo/<uid>` abre sem login, antes da
// guarda, com uma única leitura do documento do dono, os estados de
// carregando/não compartilhado/falha e preferências lidas sem gravação.

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const { authState } = vi.hoisted(() => ({
  authState: { user: null, callback: null },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth, callback) => {
    authState.callback = callback;
    callback(authState.user);
    return () => {
      authState.callback = null;
    };
  },
  signOut: vi.fn(),
}));

vi.mock("./lib/firebase", () => ({
  auth: {},
  app: {},
  signInWithGoogle: vi.fn(),
}));

const colecao = vi.hoisted(() => ({
  carregarColecao: vi.fn(),
  carregarCatalogoCompartilhado: vi.fn(),
  gravarAlteracoes: vi.fn(),
  gravarAceite: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  carregarCatalogoCompartilhado: colecao.carregarCatalogoCompartilhado,
  gravarAlteracoes: colecao.gravarAlteracoes,
  gravarAceite: colecao.gravarAceite,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

// O catálogo completo (994 figurinhas) deixaria os testes lentos no jsdom: o
// mock captura as props para que a vista somente leitura seja inspecionada
// (contagens, ausência de `onAjustar` e colapso sem gravação).
const catalogo = vi.hoisted(() => ({ props: null }));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: (props) => {
    catalogo.props = props;
    return <div data-testid="catalogo-mock" />;
  },
}));

import App from "./App";
import { limparAvisos } from "./lib/avisos.js";

const UID_DONO = "uid-do-dono";
const DONO = {
  uid: UID_DONO,
  displayName: "Daniel Ferber",
  photoURL: "https://exemplo.test/foto.jpg",
  email: "dono@exemplo.test",
};

const CHAVE_PREFERENCIAS = "iconula.preferencias-vista.v1";

function irPara(caminho) {
  window.history.pushState({}, "", caminho);
}

function irParaOLink(uid = UID_DONO) {
  irPara(`/catalogo/${uid}`);
}

beforeEach(() => {
  authState.user = null;
  authState.callback = null;
  catalogo.props = null;
  colecao.carregarColecao.mockReset();
  colecao.carregarCatalogoCompartilhado.mockReset();
  colecao.carregarCatalogoCompartilhado.mockResolvedValue({ status: "nao-compartilhado" });
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAlteracoes.mockResolvedValue({ status: "indisponivel" });
  colecao.gravarAceite.mockReset();
  colecao.gravarAceite.mockResolvedValue({ status: "sucesso" });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "14:05" : "—"));
  colecao.mensagemDeErro.mockImplementation((e) => e?.message ?? "erro");
  limparAvisos();
  localStorage.clear();
  window.innerWidth = 1280;
  irPara("/");
});

afterEach(() => {
  irPara("/");
});

describe("App — vista do link do catálogo (IDR 0055)", () => {
  it("sem sessão, /catalogo/<uid> mostra o catálogo do dono em somente leitura", async () => {
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({
      status: "compartilhado",
      contagens: { BRA01: 3, FWC01: 1 },
      atualizadoEm: new Date("2026-09-10T14:05:00"),
    });
    irParaOLink();

    render(<App />);

    expect(await screen.findByTestId("catalogo-mock")).toBeInTheDocument();

    expect(colecao.carregarCatalogoCompartilhado).toHaveBeenCalledTimes(1);
    expect(colecao.carregarCatalogoCompartilhado).toHaveBeenCalledWith(UID_DONO, {
      aoEsperar: expect.any(Function),
    });
    expect(catalogo.props.contagens).toEqual({ BRA01: 3, FWC01: 1 });
    expect(catalogo.props.onAjustar).toBeUndefined();
    expect(catalogo.props.gravarColapso).toBe(false);

    // Sem tela de login nem atestação: o caminho vence a guarda de login.
    expect(screen.queryByRole("button", { name: /entrar com google/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirmar" })).not.toBeInTheDocument();

    expect(screen.getByText("somente leitura")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ICONULA 2026" })).toHaveAttribute("href", "/");
  });

  it("o dono logado abrindo o próprio link vê a mesma vista, sem carga da coleção própria", async () => {
    authState.user = DONO;
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({
      status: "compartilhado",
      contagens: { BRA01: 1 },
      atualizadoEm: null,
    });
    irParaOLink();

    render(<App />);

    expect(await screen.findByTestId("catalogo-mock")).toBeInTheDocument();

    expect(colecao.carregarColecao).not.toHaveBeenCalled();
    expect(colecao.carregarCatalogoCompartilhado).toHaveBeenCalledTimes(1);
    expect(screen.getByText("somente leitura")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /menu de ações/ })).not.toBeInTheDocument();
  });

  it("link desligado mostra a mesma tela de não compartilhado, com o link para /", async () => {
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({ status: "nao-compartilhado" });
    irParaOLink();

    render(<App />);

    expect(
      await screen.findByText("Este catálogo não está compartilhado."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conhecer o Iconula" })).toHaveAttribute("href", "/");
    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
  });

  it("uid inexistente mostra a mesma tela de não compartilhado das regras", async () => {
    // As regras negam link desligado e conta inexistente do mesmo jeito
    // (`permission-denied`): a vista recebe o mesmo resultado e a mesma tela.
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({ status: "nao-compartilhado" });
    irParaOLink("uid-que-nao-existe");

    render(<App />);

    expect(
      await screen.findByText("Este catálogo não está compartilhado."),
    ).toBeInTheDocument();
  });

  it("falha de leitura soma o aviso de falha à mesma tela, com o detalhe técnico", async () => {
    const user = userEvent.setup();
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({
      status: "erro",
      erro: new Error("unavailable"),
    });
    irParaOLink();

    render(<App />);

    expect(
      await screen.findByText("Este catálogo não está compartilhado."),
    ).toBeInTheDocument();

    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao carregar o catálogo — toque para detalhes");

    await user.click(screen.getByRole("button", { name: /Falha ao carregar o catálogo/ }));
    expect(screen.getByText("unavailable")).toBeInTheDocument();
  });

  it("trocar ordenação, disposição, filtro ou colapso não grava preferência", async () => {
    const user = userEvent.setup();
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({
      status: "compartilhado",
      contagens: {},
      atualizadoEm: null,
    });
    irParaOLink();

    render(<App />);
    await screen.findByTestId("catalogo-mock");

    await user.click(
      screen.getByRole("button", { name: "mostrar apenas as figurinhas coladas" }),
    );
    await user.click(
      screen.getByRole("button", { name: "ordenar pela página do álbum" }),
    );
    await user.click(screen.getByRole("button", { name: "disposição como no álbum" }));

    expect(localStorage.getItem(CHAVE_PREFERENCIAS)).toBeNull();
    // O colapso é lido, mas a vista desliga a gravação (`gravarColapso=false`).
    expect(catalogo.props.gravarColapso).toBe(false);
  });

  it("não mostra nome, foto nem e-mail do dono", async () => {
    authState.user = DONO;
    colecao.carregarCatalogoCompartilhado.mockResolvedValue({
      status: "compartilhado",
      contagens: {},
      atualizadoEm: null,
    });
    irParaOLink();

    render(<App />);
    await screen.findByTestId("catalogo-mock");

    expect(screen.queryByText(DONO.displayName)).not.toBeInTheDocument();
    expect(screen.queryByText(DONO.email)).not.toBeInTheDocument();
    expect(document.querySelector(`img[src="${DONO.photoURL}"]`)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /menu de ações/ })).not.toBeInTheDocument();
  });

  it("formato malformado (/catalogo/) não lê e cai na tela de não compartilhado", async () => {
    irPara("/catalogo/");

    render(<App />);

    expect(
      await screen.findByText("Este catálogo não está compartilhado."),
    ).toBeInTheDocument();
    expect(colecao.carregarCatalogoCompartilhado).not.toHaveBeenCalled();
  });

  it("barra final em /catalogo/<uid>/ também não lê", async () => {
    irPara(`/catalogo/${UID_DONO}/`);

    render(<App />);

    expect(
      await screen.findByText("Este catálogo não está compartilhado."),
    ).toBeInTheDocument();
    expect(colecao.carregarCatalogoCompartilhado).not.toHaveBeenCalled();
  });

  it("caminho / segue a guarda de login como antes", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /entrar com google/i })).toBeInTheDocument();
    });
    expect(colecao.carregarCatalogoCompartilhado).not.toHaveBeenCalled();
  });
});
