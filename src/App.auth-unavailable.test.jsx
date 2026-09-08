// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { sortedTeams } from "./data/teams";

// Cobre o caso de VITE_FIREBASE_* ausentes (ex.: .env.local não
// configurado): src/lib/firebase.js detecta a config incompleta e exporta
// `auth: null` e `app: null` — App.jsx deve renderizar normalmente sem a
// área de login e sem persistência, em vez de travar (ver ADR 0005 e
// ADR 0007).
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("./lib/firebase", () => ({
  auth: null,
  app: null,
  signInWithGoogle: vi.fn(),
}));

import App from "./App";

describe("App com Firebase Auth indisponível", () => {
  it("renderiza o time normalmente, sem a área de login", () => {
    render(<App />);

    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
    expect(document.querySelector(".app__auth")).not.toBeInTheDocument();
  });
});
