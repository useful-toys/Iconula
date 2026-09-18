// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import ContaApagada from "./ContaApagada";

describe("ContaApagada", () => {
  it("mostra o título, a linha curta e o botão", () => {
    render(<ContaApagada onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Conta apagada" })).toBeInTheDocument();
    expect(
      screen.getByText("Sua conta de login e a sua coleção de figurinhas foram apagadas."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voltar à tela de login" })).toBeInTheDocument();
  });

  it("clicar no botão chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<ContaApagada onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: "Voltar à tela de login" }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});
