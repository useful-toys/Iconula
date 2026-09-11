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

  it("o link da política chama onAbrirPolitica", async () => {
    const user = userEvent.setup();
    const onAbrirPolitica = vi.fn();
    render(<Rodape onAbrirPolitica={onAbrirPolitica} />);

    await user.click(screen.getByRole("button", { name: "Política de privacidade" }));

    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
  });
});
