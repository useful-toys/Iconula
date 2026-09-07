// Copyright (c) 2026 Daniel Felix Ferber

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const { startMock, resetMock } = vi.hoisted(() => ({
  startMock: vi.fn(),
  resetMock: vi.fn(),
}));

vi.mock("firebaseui", () => {
  class AuthUI {
    constructor() {
      return { start: startMock, reset: resetMock };
    }
    static getInstance() {
      return null;
    }
  }
  return { auth: { AuthUI, CredentialHelper: { NONE: "none" } } };
});

vi.mock("firebaseui/dist/firebaseui.css", () => ({}));

vi.mock("../lib/firebase", () => ({
  firebase: {
    auth: {
      GoogleAuthProvider: { PROVIDER_ID: "google.com" },
    },
  },
  auth: {},
}));

import LoginButton from "./LoginButton";

describe("LoginButton", () => {
  it("monta o widget do FirebaseUI no container", () => {
    const { container } = render(<LoginButton />);

    expect(container.firstChild).toBeInTheDocument();
    expect(startMock).toHaveBeenCalledTimes(1);
    expect(startMock).toHaveBeenCalledWith(
      container.firstChild,
      expect.objectContaining({
        // Popup, não redirect: com `authDomain` numa origem diferente
        // da do app, o particionamento de storage de terceiros do
        // navegador impede o redirect de entregar o resultado do login
        // (ver TDR 0005 e o comentário em LoginButton.jsx).
        signInFlow: "popup",
        credentialHelper: "none",
      }),
    );
  });
});
