// Copyright (c) 2026 Daniel Felix Ferber

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const { carregarAnalyticsMock } = vi.hoisted(() => ({
  carregarAnalyticsMock: vi.fn(),
}));

// Espia só o carregador; a leitura e a gravação do consentimento continuam
// reais, para o teste conferir a chave no `localStorage` (MDR 0007).
vi.mock("../lib/analytics.js", async (importOriginal) => {
  const atual = await importOriginal();
  return { ...atual, carregarAnalytics: carregarAnalyticsMock };
});

import BannerDeConsentimento from "./BannerDeConsentimento.jsx";
import { consentimentoAnalytics } from "../lib/analytics.js";

const CHAVE = "iconula.consentimento-analytics.v1";

beforeEach(() => {
  localStorage.clear();
  carregarAnalyticsMock.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BannerDeConsentimento", () => {
  it("aparece com consentimento não decidido", () => {
    render(<BannerDeConsentimento />);

    expect(screen.getByRole("button", { name: "Aceitar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recusar" })).toBeInTheDocument();
    expect(consentimentoAnalytics()).toBe("nao-decidido");
  });

  it("some ao aceitar, grava 'aceito' e chama o carregador", async () => {
    const user = userEvent.setup();
    render(<BannerDeConsentimento />);

    await user.click(screen.getByRole("button", { name: "Aceitar" }));

    expect(screen.queryByRole("button", { name: "Aceitar" })).not.toBeInTheDocument();
    expect(localStorage.getItem(CHAVE)).toBe("aceito");
    expect(carregarAnalyticsMock).toHaveBeenCalledTimes(1);
  });

  it("some ao recusar, grava 'recusado' e não chama o carregador", async () => {
    const user = userEvent.setup();
    render(<BannerDeConsentimento />);

    await user.click(screen.getByRole("button", { name: "Recusar" }));

    expect(screen.queryByRole("button", { name: "Recusar" })).not.toBeInTheDocument();
    expect(localStorage.getItem(CHAVE)).toBe("recusado");
    expect(carregarAnalyticsMock).not.toHaveBeenCalled();
  });

  it("não renderiza com consentimento já decidido", () => {
    localStorage.setItem(CHAVE, "recusado");

    const { container } = render(<BannerDeConsentimento />);

    expect(container).toBeEmptyDOMElement();
    expect(carregarAnalyticsMock).not.toHaveBeenCalled();
  });

  it("aceito lembrado da sessão anterior também não exibe o banner", () => {
    localStorage.setItem(CHAVE, "aceito");

    const { container } = render(<BannerDeConsentimento />);

    expect(container).toBeEmptyDOMElement();
  });

  it("o link da política aciona o callback", async () => {
    const user = userEvent.setup();
    const onAbrirPolitica = vi.fn();
    render(<BannerDeConsentimento onAbrirPolitica={onAbrirPolitica} />);

    await user.click(screen.getByRole("button", { name: "Ver a política" }));

    expect(onAbrirPolitica).toHaveBeenCalledTimes(1);
  });
});
