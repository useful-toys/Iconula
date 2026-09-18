// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

import { LinkDeContato } from "./LinkDeContato";

describe("LinkDeContato", () => {
  it("monta o href e o texto visível com o endereço do canal de contato", () => {
    render(<LinkDeContato />);

    const link = screen.getByRole("link", { name: "dff4321@gmail.com" });

    expect(link).toHaveAttribute("href", "mailto:dff4321@gmail.com");
    expect(link).toHaveTextContent("dff4321@gmail.com");
  });

  it("marca o link como não seguível", () => {
    render(<LinkDeContato />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "rel",
      "nofollow noreferrer",
    );
  });
});
