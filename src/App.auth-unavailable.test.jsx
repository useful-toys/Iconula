// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { sortedTeams } from "./data/teams";

// Cobre o caso de VITE_FIREBASE_* ausentes/inválidas (ex.: .env.local não
// configurado): src/lib/firebase.js captura o erro síncrono de
// `firebase.auth()` e exporta `auth: null` — App.jsx deve renderizar
// normalmente sem a área de login, em vez de travar (ver ADR 0005).
vi.mock("./lib/firebase", () => ({
  firebase: {
    auth: {
      GoogleAuthProvider: { PROVIDER_ID: "google.com" },
    },
  },
  auth: null,
}));

import App from "./App";

describe("App com Firebase Auth indisponível", () => {
  it("renderiza o time normalmente, sem a área de login", () => {
    render(<App />);

    expect(screen.getByText(sortedTeams[0].name)).toBeInTheDocument();
    expect(document.querySelector(".app__auth")).not.toBeInTheDocument();
  });
});
