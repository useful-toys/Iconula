// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import App from "./App";
import { sortedTeams } from "./data/teams";

describe("App", () => {
  it("mostra o primeiro time em ordem alfabética ao carregar", () => {
    render(<App />);
    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });

  it("avança para o próximo time ao clicar no botão", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(sortedTeams[1].name)).toBeInTheDocument();
  });

  it("volta para o primeiro time após clicar no último (wrap-around)", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole("button");
    for (let i = 0; i < sortedTeams.length; i++) {
      await user.click(button);
    }

    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
  });
});
