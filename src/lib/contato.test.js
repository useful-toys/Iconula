// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from "vitest";

import contatoFonte from "./contato.js?raw";
import { enderecoDeContato } from "./contato";

describe("enderecoDeContato", () => {
  it("junta as partes no endereço do canal de contato", () => {
    expect(enderecoDeContato()).toBe("dff4321@gmail.com");
  });

  it("não deixa o endereço completo contíguo no módulo (TDR 0028)", () => {
    expect(contatoFonte).not.toContain("dff4321@gmail.com");
  });
});
