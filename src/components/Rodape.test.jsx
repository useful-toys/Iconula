// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { Rodape } from "./Rodape";

describe("Rodape", () => {
  it("mostra o aviso de independência e marcas", () => {
    render(<Rodape onAbrirPolitica={vi.fn()} />);

    expect(screen.getByText(/projeto independente/i)).toBeInTheDocument();
  });

  it("mostra as quatro linhas na ordem do IDR 0053", () => {
    const { container } = render(<Rodape onAbrirPolitica={vi.fn()} />);

    const rodape = container.querySelector(".rodape");
    const linhas = Array.from(rodape.children).map((el) => el.textContent);

    expect(linhas).toHaveLength(4);
    expect(linhas[0]).toBe("© 2026 Daniel Felix Ferber");
    expect(linhas[1]).toMatch(/projeto independente/i);
    expect(linhas[2]).toBe("Uso por sua conta e risco, sem garantias.");
    expect(linhas[3]).toBe("Política de privacidade · Termos de uso");
  });

  it("o link da política chama onAbrirPolitica", async () => {
    const user = userEvent.setup();
    const onAbrirPolitica = vi.fn();
    render(<Rodape onAbrirPolitica={onAbrirPolitica} />);

    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
  });

  it("o link dos termos chama onAbrirTermos", async () => {
    const user = userEvent.setup();
    const onAbrirTermos = vi.fn();
    render(<Rodape onAbrirPolitica={vi.fn()} onAbrirTermos={onAbrirTermos} />);

    await user.click(screen.getByRole("button", { name: "Termos de uso" }));

    expect(onAbrirTermos).toHaveBeenCalledTimes(1);
  });
});
