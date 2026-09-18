// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const { signInWithGoogleMock } = vi.hoisted(() => ({
  signInWithGoogleMock: vi.fn(),
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
  signInWithGoogle: signInWithGoogleMock,
}));

import TelaDeLogin from "./TelaDeLogin";

beforeEach(() => {
  signInWithGoogleMock.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TelaDeLogin", () => {
  it("mostra os textos exatos de interface.md § Tela de login", () => {
    const { container } = render(<TelaDeLogin />);

    expect(
      screen.getByText("Controle suas figurinhas do álbum da Copa do Mundo FIFA 2026"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar com Google" })).toBeInTheDocument();

    const atestacao = container.querySelector(".tela-de-login__atestacao");
    expect(atestacao.textContent).toBe(
      "Ao continuar, você confirma ter 12 anos ou mais, ou estar autorizado pelos responsáveis, e concorda com os Termos de uso.",
    );
    expect(within(atestacao).getByRole("button", { name: "Termos de uso" })).toBeInTheDocument();

    expect(container.querySelector(".tela-de-login__links").textContent).toBe(
      "Política de privacidade · Sobre",
    );
  });

  it("mostra o rodapé de independência e marcas", () => {
    render(<TelaDeLogin />);

    expect(screen.getByText(/projeto independente/i)).toBeInTheDocument();
  });

  it("mostra as três linhas do rodapé na ordem do IDR 0053, sem link", () => {
    const { container } = render(<TelaDeLogin />);

    const rodape = container.querySelector(".tela-de-login__rodape");
    const linhas = Array.from(rodape.children).map((el) => el.textContent);

    expect(linhas).toHaveLength(3);
    expect(linhas[0]).toBe("© 2026 Daniel Felix Ferber");
    expect(linhas[1]).toMatch(/projeto independente/i);
    expect(linhas[2]).toBe("Uso por sua conta e risco, sem garantias.");
    expect(rodape.querySelector("button")).toBeNull();
    expect(rodape.querySelector("a")).toBeNull();
  });

  it("o link da política é acionável sem sessão", async () => {
    const user = userEvent.setup();
    const onAbrirPolitica = vi.fn();
    render(<TelaDeLogin onAbrirPolitica={onAbrirPolitica} />);

    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
  });

  it("o link dos termos na frase de aceite é acionável sem sessão", async () => {
    const user = userEvent.setup();
    const onAbrirTermos = vi.fn();
    const { container } = render(<TelaDeLogin onAbrirTermos={onAbrirTermos} />);

    const atestacao = container.querySelector(".tela-de-login__atestacao");
    await user.click(within(atestacao).getByRole("button", { name: "Termos de uso" }));
    expect(onAbrirTermos).toHaveBeenCalledTimes(1);
  });

  it("o link Sobre é acionável sem sessão", async () => {
    const user = userEvent.setup();
    const onAbrirSobre = vi.fn();
    render(<TelaDeLogin onAbrirSobre={onAbrirSobre} />);

    await user.click(screen.getByRole("button", { name: "Sobre" }));

    expect(onAbrirSobre).toHaveBeenCalledTimes(1);
  });

  it("falha de login mostra mensagem em role=alert", async () => {
    const user = userEvent.setup();
    signInWithGoogleMock.mockRejectedValue({ code: "auth/network-request-failed" });

    render(<TelaDeLogin />);
    await user.click(screen.getByRole("button", { name: "Entrar com Google" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível entrar");
  });

  it("popup fechado pelo usuário não mostra nada", async () => {
    const user = userEvent.setup();
    signInWithGoogleMock.mockRejectedValue({ code: "auth/popup-closed-by-user" });

    render(<TelaDeLogin />);
    await user.click(screen.getByRole("button", { name: "Entrar com Google" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
