// Copyright (c) 2026 Daniel Felix Ferber

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// O módulo carrega "firebase/firestore" com `import()` dinâmico (ver
// ADR 0007); `vi.mock` intercepta import estático e dinâmico igualmente.
const { docMock, getDocMock, setDocMock, getFirestoreMock } = vi.hoisted(() => ({
  docMock: vi.fn(() => ({ path: "users/uid-do-usuario" })),
  getDocMock: vi.fn(),
  setDocMock: vi.fn(),
  getFirestoreMock: vi.fn(() => ({ tipo: "firestore" })),
}));

vi.mock("firebase/firestore", () => ({
  doc: docMock,
  getDoc: getDocMock,
  setDoc: setDocMock,
  getFirestore: getFirestoreMock,
}));

vi.mock("./firebase", () => ({ app: {} }));

import { loadCurrentTeam, saveCurrentTeam } from "./userPreferences";

const UID = "uid-do-usuario";

// O módulo nunca lança, mas registra falhas no console. Silenciado aqui
// para não poluir a saída dos testes que exercitam justamente esse
// caminho.
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

function snapshot(data) {
  return {
    exists: () => data !== undefined,
    data: () => data,
  };
}

describe("loadCurrentTeam", () => {
  it("devolve o time salvo quando o documento existe", async () => {
    getDocMock.mockResolvedValue(snapshot({ teamName: "Brazil" }));

    await expect(loadCurrentTeam(UID)).resolves.toEqual({
      status: "found",
      teamName: "Brazil",
    });
    expect(docMock).toHaveBeenCalledWith({ tipo: "firestore" }, "users", UID);
  });

  it("devolve `empty` quando o documento não existe", async () => {
    getDocMock.mockResolvedValue(snapshot(undefined));

    await expect(loadCurrentTeam(UID)).resolves.toEqual({ status: "empty" });
  });

  it("trata conteúdo inesperado como `empty`, sem propagar valor inválido", async () => {
    getDocMock.mockResolvedValue(snapshot({ teamName: 42 }));
    await expect(loadCurrentTeam(UID)).resolves.toEqual({ status: "empty" });

    getDocMock.mockResolvedValue(snapshot({ teamName: "" }));
    await expect(loadCurrentTeam(UID)).resolves.toEqual({ status: "empty" });

    getDocMock.mockResolvedValue(snapshot({}));
    await expect(loadCurrentTeam(UID)).resolves.toEqual({ status: "empty" });
  });

  it("devolve `error` sem lançar quando a leitura falha", async () => {
    getDocMock.mockRejectedValue(new Error("permission-denied"));

    await expect(loadCurrentTeam(UID)).resolves.toEqual({ status: "error" });
    expect(console.error).toHaveBeenCalled();
  });

  it("devolve `unavailable` e não chama o SDK sem uid", async () => {
    await expect(loadCurrentTeam(null)).resolves.toEqual({
      status: "unavailable",
    });
    expect(getDocMock).not.toHaveBeenCalled();
  });
});

describe("saveCurrentTeam", () => {
  it("grava apenas o nome do time, com merge", async () => {
    setDocMock.mockResolvedValue(undefined);

    await saveCurrentTeam(UID, "Brazil");

    expect(setDocMock).toHaveBeenCalledWith(
      { path: "users/uid-do-usuario" },
      { teamName: "Brazil" },
      { merge: true },
    );
  });

  it("resolve mesmo quando a gravação falha, sem gerar rejeição", async () => {
    setDocMock.mockRejectedValue(new Error("permission-denied"));

    await expect(saveCurrentTeam(UID, "Brazil")).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });

  it("não chama o SDK sem uid", async () => {
    await saveCurrentTeam(null, "Brazil");

    expect(setDocMock).not.toHaveBeenCalled();
  });
});
