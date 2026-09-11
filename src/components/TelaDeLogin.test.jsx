// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
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
  it("mostra os quatro textos exatos de interface.md § Tela de login", () => {
    render(<TelaDeLogin />);

    expect(
      screen.getByText("Controle suas figurinhas do álbum da Copa do Mundo FIFA 2026"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar com Google" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ao continuar, você confirma ter 12 anos ou mais, ou estar autorizado pelos responsáveis.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Política de privacidade" })).toBeInTheDocument();
  });

  it("mostra o rodapé de independência e marcas", () => {
    render(<TelaDeLogin />);

    expect(screen.getByText(/projeto independente/i)).toBeInTheDocument();
  });

  it("o link da política é acionável sem sessão", async () => {
    const user = userEvent.setup();
    const onAbrirPolitica = vi.fn();
    render(<TelaDeLogin onAbrirPolitica={onAbrirPolitica} />);

    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
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
