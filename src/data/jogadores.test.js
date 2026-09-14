// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from "vitest";
import { secoes } from "./catalogo.js";
import { jogadoresPorSelecao, jogadoresFWC, jogadoresCOC } from "./jogadores.js";

const selecoes = secoes.filter((s) => s.tipo === "selecao");

describe("invariantes dos jogadores", () => {
  it("tem 48 seleções com 18 jogadores cada", () => {
    expect(Object.keys(jogadoresPorSelecao)).toHaveLength(48);
    for (const jogadores of Object.values(jogadoresPorSelecao)) {
      expect(jogadores).toHaveLength(18);
    }
  });

  it("as 48 siglas são iguais às seleções do catálogo", () => {
    const siglasCatalogo = selecoes.map((s) => s.sigla).sort();
    const siglasDados = Object.keys(jogadoresPorSelecao).sort();
    expect(siglasDados).toEqual(siglasCatalogo);
  });

  it("em seleções, no máximo uma barra, sem lado vazio nem espaço nas pontas", () => {
    for (const jogadores of Object.values(jogadoresPorSelecao)) {
      for (const nome of jogadores) {
        expect(nome).toBe(nome.trim());
        const partes = nome.split("/");
        expect(partes.length).toBeLessThanOrEqual(2);
        for (const parte of partes) {
          expect(parte).not.toBe("");
          expect(parte).toBe(parte.trim());
        }
      }
    }
  });

  it("nenhum nome vazio", () => {
    const todos = [
      ...Object.values(jogadoresPorSelecao).flat(),
      ...jogadoresFWC,
      ...jogadoresCOC,
    ];
    for (const nome of todos) {
      expect(nome.trim()).not.toBe("");
    }
  });

  it("nenhuma duplicata na mesma seção", () => {
    for (const jogadores of Object.values(jogadoresPorSelecao)) {
      expect(new Set(jogadores).size).toBe(jogadores.length);
    }
    expect(new Set(jogadoresFWC).size).toBe(jogadoresFWC.length);
    expect(new Set(jogadoresCOC).size).toBe(jogadoresCOC.length);
  });

  it("tem 20 nomes de FWC e 14 de COC", () => {
    expect(jogadoresFWC).toHaveLength(20);
    expect(jogadoresCOC).toHaveLength(14);
  });
});
