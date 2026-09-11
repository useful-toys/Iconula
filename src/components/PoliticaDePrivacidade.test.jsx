// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import PoliticaDePrivacidade from "./PoliticaDePrivacidade";

describe("PoliticaDePrivacidade", () => {
  it("cobre os itens exigidos por requisitos.md § Privacidade", () => {
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Política de privacidade" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dados tratados" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Finalidade" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retenção" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Direitos do titular" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dados de menores" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contato" })).toBeInTheDocument();
    expect(screen.getByText(/dff4321@gmail\.com/)).toBeInTheDocument();
  });

  it("voltar chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<PoliticaDePrivacidade onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});
