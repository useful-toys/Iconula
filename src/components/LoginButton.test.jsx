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

import LoginButton from "./LoginButton";

beforeEach(() => {
  signInWithGoogleMock.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LoginButton", () => {
  it("dispara o login com Google ao clicar", async () => {
    const user = userEvent.setup();
    signInWithGoogleMock.mockResolvedValue({});

    render(<LoginButton />);
    await user.click(screen.getByRole("button", { name: /entrar com google/i }));

    expect(signInWithGoogleMock).toHaveBeenCalledTimes(1);
  });

  it("mostra mensagem quando o login falha", async () => {
    const user = userEvent.setup();
    signInWithGoogleMock.mockRejectedValue({ code: "auth/network-request-failed" });

    render(<LoginButton />);
    await user.click(screen.getByRole("button", { name: /entrar com google/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível entrar",
    );
  });

  it("não mostra erro quando o usuário fecha o popup", async () => {
    const user = userEvent.setup();
    signInWithGoogleMock.mockRejectedValue({ code: "auth/popup-closed-by-user" });

    render(<LoginButton />);
    await user.click(screen.getByRole("button", { name: /entrar com google/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
