// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import Atestacao from "./Atestacao";

describe("Atestacao", () => {
  it("no primeiro acesso mostra o texto exato de interface.md § Tela de login e o botão de confirmar", () => {
    render(<Atestacao motivo="primeiro-acesso" onConfirmar={vi.fn()} />);

    expect(
      screen.getByText(
        "Ao continuar, você confirma ter 12 anos ou mais, ou estar autorizado pelos responsáveis.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });

  it("no reaceite mostra que os textos mudaram, com os dois links e sem a atestação de idade", () => {
    render(<Atestacao motivo="atualizacao" onConfirmar={vi.fn()} />);

    expect(
      screen.getByText(/mudaram/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Termos de uso" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Política de privacidade" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Li e concordo" })).toBeInTheDocument();
    expect(screen.queryByText(/12 anos/)).not.toBeInTheDocument();
  });

  it("no reaceite os links abrem as duas vistas internas", async () => {
    const user = userEvent.setup();
    const onAbrirTermos = vi.fn();
    const onAbrirPolitica = vi.fn();
    render(
      <Atestacao
        motivo="atualizacao"
        onConfirmar={vi.fn()}
        onAbrirTermos={onAbrirTermos}
        onAbrirPolitica={onAbrirPolitica}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Termos de uso" }));
    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(onAbrirTermos).toHaveBeenCalledTimes(1);
    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
  });

  it("confirmar chama onConfirmar", async () => {
    const user = userEvent.setup();
    const onConfirmar = vi.fn().mockResolvedValue(undefined);
    render(<Atestacao motivo="primeiro-acesso" onConfirmar={onConfirmar} />);

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("o reaceite também chama onConfirmar pelo botão de concordar", async () => {
    const user = userEvent.setup();
    const onConfirmar = vi.fn().mockResolvedValue(undefined);
    render(<Atestacao motivo="atualizacao" onConfirmar={onConfirmar} />);

    await user.click(screen.getByRole("button", { name: "Li e concordo" }));

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
    render(<Atestacao motivo="primeiro-acesso" onConfirmar={onConfirmar} />);

    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();

    resolver();
  });
});
