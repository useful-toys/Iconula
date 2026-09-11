// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import AuthStatus from "./AuthStatus";

// Desde a Tarefa 0008-0002, AuthStatus só é usado na tela principal, sempre
// com um usuário autenticado — o caso deslogado é TelaDeLogin.jsx.
describe("AuthStatus", () => {
  it("mostra nome, avatar e botão de sair", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    const authenticatedUser = {
      displayName: "Daniel Ferber",
      photoURL: "https://lh3.googleusercontent.com/avatar.jpg",
    };

    const { container } = render(
      <AuthStatus user={authenticatedUser} onSignOut={onSignOut} />,
    );

    expect(screen.getByText("Daniel Ferber")).toBeInTheDocument();
    // alt="" (decorativo, o nome já está em texto) tira o role "img" da
    // árvore de acessibilidade — busca pela classe em vez de getByRole.
    expect(container.querySelector(".auth-status__avatar")).toHaveAttribute(
      "src",
      authenticatedUser.photoURL,
    );

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
