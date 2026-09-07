// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// AuthStatus é testado isolado do Firebase/FirebaseUI: LoginButton (o
// único componente que toca o SDK) é substituído por um stub.
vi.mock("./LoginButton", () => ({
  default: () => <div data-testid="login-button" />,
}));

import AuthStatus from "./AuthStatus";

describe("AuthStatus", () => {
  it("mostra o botão de login quando não há usuário", () => {
    render(<AuthStatus user={null} onSignOut={vi.fn()} />);

    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("mostra nome, avatar e botão de sair quando há usuário", async () => {
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
