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
    expect(screen.getByRole("heading", { name: "Onde os dados ficam" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Link do catálogo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retenção" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Direitos do titular" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dados de menores" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contato" })).toBeInTheDocument();
    expect(screen.getByText(/dff4321@gmail\.com/)).toBeInTheDocument();
  });

  it("declara a visibilidade por link, com o texto do IDR 0055", () => {
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} />);

    expect(
      screen.getByText(
        /Nenhum outro terceiro tem acesso a esses dados além do Google, que já processa o login pelo próprio provedor, e, se você ligar o link do catálogo, de quem tiver o link\./,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Se você ligar o link do catálogo, a sua coleção \(contagens e data da última gravação\) fica visível, sem login, a qualquer pessoa que tenha o link, até você desligá-lo\./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/seu nome, e-mail e foto não aparecem/)).toBeInTheDocument();
  });

  it("voltar chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<PoliticaDePrivacidade onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});
