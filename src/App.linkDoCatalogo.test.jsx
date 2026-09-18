// Copyright (c) 2026 Daniel Felix Ferber

// Testes de integração da chave do link do catálogo (Tarefa 0027-0004, IDR
// 0055): a carga do login traz `linkAtivo`; a chave do terceiro bloco do popup
// Compartilhar grava na hora, fora da gravação agregada e sem `updatedAt`,
// avisa o sucesso, reverte e avisa a falha, avisa a espera sem rede e é
// descartada ao sair da conta.

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

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
  gravarLinkAtivo: vi.fn(),
  formatarCarimbo: vi.fn(),
  mensagemDeErro: vi.fn(),
}));

vi.mock("./lib/colecaoRemota.js", () => ({
  carregarColecao: colecao.carregarColecao,
  gravarAlteracoes: colecao.gravarAlteracoes,
  gravarAceite: colecao.gravarAceite,
  gravarLinkAtivo: colecao.gravarLinkAtivo,
  formatarCarimbo: colecao.formatarCarimbo,
  mensagemDeErro: colecao.mensagemDeErro,
}));

vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";
import { limparAvisos } from "./lib/avisos.js";

const USUARIO = { uid: "uid1", displayName: "Daniel Ferber", photoURL: "p" };

function cargaComLink(linkAtivo) {
  return {
    status: "encontrado",
    contagens: {},
    atualizadoEm: null,
    temTeamName: false,
    atestadoEm: true,
    termosVersao: "2026-09-17",
    politicaVersao: "2026-09-17",
    linkAtivo,
  };
}

async function montarLogado() {
  authState.user = USUARIO;
  await act(async () => {
    render(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function abrirCompartilhar() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /compartilhar listas de troca/ }));
  });
}

async function tocarNaChave() {
  await act(async () => {
    fireEvent.click(screen.getByRole("switch"));
    await Promise.resolve();
    await Promise.resolve();
  });
}

// O ligar exige o passo informativo (Tarefa 0032-0006): tocar na chave
// desligada só expande o bloco; estes helpers terminam o passo.
async function confirmarLigar() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Ligar o link" }));
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function cancelarExplicacao() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  });
}

// `act(async …)` sozinho não garante que a promise do handler (dentro do
// onClick) já tenha avançado até o `emitirAviso`/a cópia — os dois
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
  colecao.carregarColecao.mockReset();
  colecao.carregarColecao.mockResolvedValue(cargaComLink(false));
  colecao.gravarAlteracoes.mockReset();
  colecao.gravarAlteracoes.mockResolvedValue({ status: "sucesso", atualizadoEm: new Date() });
  colecao.gravarAceite.mockReset();
  colecao.gravarAceite.mockResolvedValue({ status: "sucesso" });
  colecao.gravarLinkAtivo.mockReset();
  colecao.gravarLinkAtivo.mockResolvedValue({ status: "sucesso" });
  colecao.formatarCarimbo.mockImplementation((d) => (d ? "14:05" : "—"));
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

describe("App — chave do link do catálogo", () => {
  it("a carga ligada abre o popup com a chave ligada", async () => {
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    expect(
      screen.getByRole("switch", { name: "Link do catálogo: ligado" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("a carga sem o campo abre a chave desligada", async () => {
    colecao.carregarColecao.mockResolvedValue({
      status: "encontrado",
      contagens: {},
      atualizadoEm: null,
      temTeamName: false,
      atestadoEm: true,
      termosVersao: "2026-09-17",
      politicaVersao: "2026-09-17",
    });
    await montarLogado();
    await abrirCompartilhar();

    expect(
      screen.getByRole("switch", { name: "Link do catálogo: desligado" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("ligar grava só linkAtivo, fora da agregação, e avisa 'Link ligado'", async () => {
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();
    expect(colecao.gravarLinkAtivo).not.toHaveBeenCalled();
    await confirmarLigar();

    expect(colecao.gravarLinkAtivo).toHaveBeenCalledTimes(1);
    expect(colecao.gravarLinkAtivo).toHaveBeenCalledWith("uid1", true, {
      aoEsperar: expect.any(Function),
    });
    expect(colecao.gravarAlteracoes).not.toHaveBeenCalled();
    expect(screen.getByText("Link ligado")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Link do catálogo: ligado" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("tocar na chave desligada abre a explicação sem gravar; cancelar também não grava", async () => {
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();

    expect(screen.getByText(/Desligar revoga o acesso/)).toBeInTheDocument();
    expect(colecao.gravarLinkAtivo).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await cancelarExplicacao();

    expect(colecao.gravarLinkAtivo).not.toHaveBeenCalled();
    expect(screen.queryByText(/Desligar revoga o acesso/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Link do catálogo: desligado" }),
    ).toBeInTheDocument();
  });

  it("desligar grava false num único toque, sem explicação", async () => {
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();

    expect(screen.queryByText(/Desligar revoga o acesso/)).not.toBeInTheDocument();
    expect(colecao.gravarLinkAtivo).toHaveBeenCalledWith("uid1", false, {
      aoEsperar: expect.any(Function),
    });
    expect(screen.getByText("Link desligado")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Link do catálogo: desligado" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("falha ao ligar reverte a chave e avisa com o detalhe técnico", async () => {
    colecao.gravarLinkAtivo.mockResolvedValue({
      status: "erro",
      erro: new Error("unavailable"),
    });
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();
    await confirmarLigar();

    expect(
      screen.getByRole("switch", { name: "Link do catálogo: desligado" }),
    ).toHaveAttribute("aria-checked", "false");

    const alerta = screen.getByRole("alert");
    expect(alerta).toHaveTextContent("Falha ao ligar o link — toque para detalhes");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Falha ao ligar o link/ }));
    });
    expect(screen.getByText("unavailable")).toBeInTheDocument();
  });

  it("falha ao desligar reverte a chave e avisa a falha de desligar", async () => {
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    colecao.gravarLinkAtivo.mockResolvedValue({ status: "erro", erro: new Error("unavailable") });
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();

    expect(
      screen.getByRole("switch", { name: "Link do catálogo: ligado" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao desligar o link");
  });

  it("espera sem rede avisa a conexão instável e mantém o desfecho real", async () => {
    let resolver;
    colecao.gravarLinkAtivo.mockImplementation(
      (_uid, _ativo, { aoEsperar }) =>
        new Promise((resolve) => {
          aoEsperar();
          resolver = resolve;
        }),
    );
    await montarLogado();
    await abrirCompartilhar();

    await tocarNaChave();
    await confirmarLigar();

    expect(
      screen.getByText("Conexão instável — sincronizando quando possível"),
    ).toBeInTheDocument();

    await act(async () => {
      resolver({ status: "sucesso" });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByText("Link ligado")).toBeInTheDocument();
  });

  it("sair da conta descarta o estado do link", async () => {
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();
    expect(
      screen.getByRole("switch", { name: "Link do catálogo: ligado" }),
    ).toBeInTheDocument();

    // Logout e novo login com a leitura ainda em voo: a chave não pode
    // mostrar o estado da conta anterior.
    await act(async () => {
      authState.callback(null);
      await Promise.resolve();
    });
    colecao.carregarColecao.mockReturnValue(new Promise(() => {}));
    await act(async () => {
      authState.callback(USUARIO);
      await Promise.resolve();
    });
    await abrirCompartilhar();

    expect(
      screen.getByRole("switch", { name: "Link do catálogo: desligado" }),
    ).toHaveAttribute("aria-checked", "false");
  });
});

describe("App — copiar e compartilhar o link do catálogo", () => {
  it("copiar entrega a URL com a origem e o uid e avisa 'Link copiado'", async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    await clicarItem("Copiar link do catálogo");

    expect(escrever).toHaveBeenCalledTimes(1);
    expect(escrever).toHaveBeenCalledWith(
      `${window.location.origin}/catalogo/uid1`,
    );
    expect(screen.getByText("Link copiado")).toBeInTheDocument();
  });

  it("compartilhar manda só a url para a folha e avisa 'Link compartilhado'", async () => {
    const compartilhar = vi.fn().mockResolvedValue(undefined);
    definirShare(compartilhar);
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    await clicarItem("Compartilhar link do catálogo…");

    expect(compartilhar).toHaveBeenCalledTimes(1);
    expect(compartilhar).toHaveBeenCalledWith({
      url: `${window.location.origin}/catalogo/uid1`,
    });
    expect(screen.getByText("Link compartilhado")).toBeInTheDocument();
  });

  it("fechar a folha sem escolher (AbortError) não emite aviso nem copia", async () => {
    definirShare(vi.fn().mockRejectedValue(erroDeCancelamento()));
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    await clicarItem("Compartilhar link do catálogo…");
    await avancarMicrotarefas();

    expect(screen.queryByText("Link compartilhado")).not.toBeInTheDocument();
    expect(screen.queryByText("Link copiado")).not.toBeInTheDocument();
    expect(escrever).not.toHaveBeenCalled();
  });

  it("outra rejeição da folha cai na cópia da url", async () => {
    definirShare(vi.fn().mockRejectedValue(new Error("sem app")));
    const escrever = vi.fn().mockResolvedValue(undefined);
    definirClipboard({ writeText: escrever });
    colecao.carregarColecao.mockResolvedValue(cargaComLink(true));
    await montarLogado();
    await abrirCompartilhar();

    await clicarItem("Compartilhar link do catálogo…");
    await avancarMicrotarefas();

    expect(escrever).toHaveBeenCalledWith(
      `${window.location.origin}/catalogo/uid1`,
    );
    expect(screen.getByText("Link copiado")).toBeInTheDocument();
  });
});
