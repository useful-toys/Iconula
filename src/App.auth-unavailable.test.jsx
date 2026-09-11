// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Cobre o caso de VITE_FIREBASE_* ausentes (ex.: .env.local não
// configurado): src/lib/firebase.js detecta a config incompleta e exporta
// `auth: null` e `app: null`. É modo não suportado (requisitos.md § Dados e
// isolamento): a tela de login aparece sem botão funcional, e o catálogo
// nunca fica acessível (Tarefa 0008-0001).
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("./lib/firebase", () => ({
  auth: null,
  app: null,
  signInWithGoogle: vi.fn(),
}));

// Evita renderizar as 994 figurinhas neste teste focado em auth.
vi.mock("./components/Catalogo.jsx", () => ({
  Catalogo: () => <div data-testid="catalogo-mock" />,
}));

import App from "./App";

describe("App com Firebase Auth indisponível", () => {
  it("mostra a tela de login indisponível, sem botão funcional e sem catálogo", () => {
    render(<App />);

    expect(screen.queryByTestId("catalogo-mock")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /entrar com google/i })).not.toBeInTheDocument();
    expect(screen.getByText(/login indisponível/i)).toBeInTheDocument();
  });
});
