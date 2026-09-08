// Copyright (c) 2026 Daniel Felix Ferber

// Arquivo separado porque um mock de módulo não pode variar dentro do
// mesmo arquivo — mesma convenção de App.auth-unavailable.test.jsx.
//
// Cobre o caso de VITE_FIREBASE_* ausentes: src/lib/firebase.js exporta
// `app: null` e a persistência precisa virar no-op silencioso — sem sequer
// baixar o chunk do Firestore, e sem lançar (ver ADR 0007).

import { describe, expect, it, vi } from "vitest";

const { docMock, getDocMock, setDocMock, getFirestoreMock } = vi.hoisted(() => ({
  docMock: vi.fn(),
  getDocMock: vi.fn(),
  setDocMock: vi.fn(),
  getFirestoreMock: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: docMock,
  getDoc: getDocMock,
  setDoc: setDocMock,
  getFirestore: getFirestoreMock,
}));

vi.mock("./firebase", () => ({ app: null }));

import { loadCurrentTeam, saveCurrentTeam } from "./userPreferences";

describe("userPreferences com Firestore indisponível", () => {
  it("loadCurrentTeam devolve `unavailable` sem chamar o SDK", async () => {
    await expect(loadCurrentTeam("uid-do-usuario")).resolves.toEqual({
      status: "unavailable",
    });

    expect(getFirestoreMock).not.toHaveBeenCalled();
    expect(getDocMock).not.toHaveBeenCalled();
  });

  it("saveCurrentTeam resolve sem chamar o SDK", async () => {
    await expect(
      saveCurrentTeam("uid-do-usuario", "Brazil"),
    ).resolves.toBeUndefined();

    expect(getFirestoreMock).not.toHaveBeenCalled();
    expect(setDocMock).not.toHaveBeenCalled();
  });
});
