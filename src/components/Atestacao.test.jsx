// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import Atestacao from "./Atestacao";

describe("Atestacao", () => {
  it("mostra o texto exato de interface.md § Tela de login e o botão de confirmar", () => {
    render(<Atestacao onConfirmar={vi.fn()} />);

    expect(
      screen.getByText(
        "Ao continuar, você confirma ter 12 anos ou mais, ou estar autorizado pelos responsáveis.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });

  it("confirmar chama onConfirmar", async () => {
    const user = userEvent.setup();
    const onConfirmar = vi.fn().mockResolvedValue(undefined);
    render(<Atestacao onConfirmar={onConfirmar} />);

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("desabilita o botão enquanto aguarda a gravação", async () => {
    const user = userEvent.setup();
    let resolver;
    const onConfirmar = vi.fn(
      () =>
        new Promise((resolve) => {
          resolver = resolve;
        }),
    );
    render(<Atestacao onConfirmar={onConfirmar} />);

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();

    resolver();
  });
});
