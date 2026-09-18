// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import Sobre from "./Sobre";

const REPOSITORIO = "https://github.com/useful-toys/Iconula";

describe("Sobre", () => {
  it("mostra o título e a descrição do app (IDR 0063)", () => {
    render(<Sobre onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
    expect(
      screen.getByText(/Controle suas figurinhas do álbum da Copa do Mundo FIFA 2026/),
    ).toBeInTheDocument();
  });

  it("traz os dois links externos, para o repositório e as issues (IDR 0063)", () => {
    render(<Sobre onVoltar={vi.fn()} />);

    const codigo = screen.getByRole("link", { name: "Código-fonte no GitHub" });
    expect(codigo).toHaveAttribute("href", REPOSITORIO);
    expect(codigo).toHaveAttribute("target", "_blank");
    expect(codigo).toHaveAttribute("rel", "noopener noreferrer");

    const issues = screen.getByRole("link", {
      name: "Reportar um problema ou sugerir algo",
    });
    expect(issues).toHaveAttribute("href", `${REPOSITORIO}/issues`);
    expect(issues).toHaveAttribute("target", "_blank");
    expect(issues).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("voltar chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<Sobre onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});
