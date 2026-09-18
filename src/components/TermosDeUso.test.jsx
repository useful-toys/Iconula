// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import TermosDeUso from "./TermosDeUso";

// Seções na ordem do roteiro do IDR 0053.
const SECOES = [
  "Aceite",
  "O que é o serviço",
  "Controlador e encarregado",
  "Uso no estado em que se encontra",
  "Sua conta Google",
  "Limitação de responsabilidade",
  "Marcas",
  "Alterações dos termos",
  "Lei brasileira",
  "Contato",
];

describe("TermosDeUso", () => {
  it("traz as seções do roteiro do IDR 0053, na ordem", () => {
    const { container } = render(<TermosDeUso onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Termos de uso" })).toBeInTheDocument();

    const titulos = Array.from(
      container.querySelectorAll(".termos__corpo h2"),
    ).map((el) => el.textContent);
    expect(titulos).toEqual(SECOES);
  });

  it("repete o controlador e a data de vigência da política (IDR 0061)", () => {
    const { container } = render(<TermosDeUso onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Controlador e encarregado" })).toBeInTheDocument();
    expect(screen.getByText(/Daniel Felix Ferber, pessoa física/)).toBeInTheDocument();

    const vigencia = container.querySelector("time");
    expect(vigencia).toHaveAttribute("dateTime", "2026-09-17");
    expect(vigencia).toHaveTextContent("17 de setembro de 2026");
  });

  it("usa o mesmo canal de contato da política", () => {
    render(<TermosDeUso onVoltar={vi.fn()} />);

    expect(screen.getByRole("link", { name: "dff4321@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:dff4321@gmail.com",
    );
  });

  it("voltar chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<TermosDeUso onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});
