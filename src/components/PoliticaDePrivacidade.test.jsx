// Copyright (c) 2026 Daniel Felix Ferber

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import PoliticaDePrivacidade from "./PoliticaDePrivacidade";

describe("PoliticaDePrivacidade", () => {
  it("cobre os itens exigidos por requisitos.md § Privacidade", () => {
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Política de privacidade" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dados tratados" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Finalidade" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Onde os dados ficam" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Link do catálogo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retenção" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Direitos do titular" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dados de menores" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contato" })).toBeInTheDocument();
    expect(screen.getByText(/dff4321@gmail\.com/)).toBeInTheDocument();
  });

  it("declara a visibilidade por link, com o texto do IDR 0055", () => {
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} />);

    expect(
      screen.getByText(
        /Nenhum outro terceiro tem acesso a esses dados além do Google, que já processa o login pelo próprio provedor, e, se você ligar o link do catálogo, de quem tiver o link\./,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Se você ligar o link do catálogo, a sua coleção \(contagens e data da última gravação\) fica visível, sem login, a qualquer pessoa que tenha o link, até você desligá-lo\./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/seu nome, e-mail e foto não aparecem/)).toBeInTheDocument();
  });

  it("voltar chama onVoltar", async () => {
    const user = userEvent.setup();
    const onVoltar = vi.fn();
    render(<PoliticaDePrivacidade onVoltar={onVoltar} />);

    await user.click(screen.getByRole("button", { name: /voltar/i }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });
});

// Painel "Apagar meus dados" (IDR 0060, Tarefa 0031-0003): os três estados,
// a ausência sem sessão e o estado final que sobrevive ao fim dela.
describe("PoliticaDePrivacidade — apagar meus dados", () => {
  it("sem sessão não mostra o comando, só o canal de contato", () => {
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar={false} />);

    expect(screen.queryByRole("button", { name: "Apagar meus dados" })).not.toBeInTheDocument();
    expect(screen.getByText(/dff4321@gmail\.com/)).toBeInTheDocument();
  });

  it("com sessão, o repouso abre a confirmação e o cancelar volta", async () => {
    const user = userEvent.setup();
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar onApagar={vi.fn()} onExportar={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));

    expect(screen.getByText(/Serão apagados a sua coleção de figurinhas/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Exportar minha coleção antes" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByRole("button", { name: "Apagar meus dados" })).toBeInTheDocument();
  });

  it("exportar antes chama onExportar", async () => {
    const user = userEvent.setup();
    const onExportar = vi.fn();
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar onApagar={vi.fn()} onExportar={onExportar} />);

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));
    await user.click(screen.getByRole("button", { name: "Exportar minha coleção antes" }));

    expect(onExportar).toHaveBeenCalledTimes(1);
  });

  it("apagar definitivamente chama onApagar e chega ao estado apagado", async () => {
    const user = userEvent.setup();
    const onApagar = vi.fn(() => Promise.resolve({ status: "sucesso" }));
    const onVoltar = vi.fn();
    render(<PoliticaDePrivacidade onVoltar={onVoltar} podeApagar onApagar={onApagar} onExportar={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));
    await user.click(screen.getByRole("button", { name: "Apagar definitivamente" }));

    expect(onApagar).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Seus dados foram apagados")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Voltar à tela de login" }));

    expect(onVoltar).toHaveBeenCalledTimes(1);
  });

  it("os botões ficam desabilitados enquanto a operação está em voo", async () => {
    const user = userEvent.setup();
    let resolver;
    const onApagar = vi.fn(() => new Promise((resolve) => {
      resolver = resolve;
    }));
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar onApagar={onApagar} onExportar={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));
    await user.click(screen.getByRole("button", { name: "Apagar definitivamente" }));

    expect(screen.getByRole("button", { name: "Apagar definitivamente" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Exportar minha coleção antes" })).toBeDisabled();

    await act(async () => {
      resolver({ status: "sucesso" });
    });

    expect(await screen.findByText("Seus dados foram apagados")).toBeInTheDocument();
  });

  it("desistência no popup volta ao repouso, sem apagar", async () => {
    const user = userEvent.setup();
    const onApagar = vi.fn(() => Promise.resolve({ status: "cancelado" }));
    render(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar onApagar={onApagar} onExportar={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));
    await user.click(screen.getByRole("button", { name: "Apagar definitivamente" }));

    expect(await screen.findByRole("button", { name: "Apagar meus dados" })).toBeInTheDocument();
  });

  it("o estado apagado permanece depois de a sessão acabar", async () => {
    const user = userEvent.setup();
    const onApagar = vi.fn(() => Promise.resolve({ status: "sucesso" }));
    const { rerender } = render(
      <PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar onApagar={onApagar} onExportar={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Apagar meus dados" }));
    await user.click(screen.getByRole("button", { name: "Apagar definitivamente" }));
    expect(await screen.findByText("Seus dados foram apagados")).toBeInTheDocument();

    // A sessão acaba: `podeApagar` vira falso, mas o estado final continua.
    rerender(<PoliticaDePrivacidade onVoltar={vi.fn()} podeApagar={false} onApagar={onApagar} onExportar={vi.fn()} />);

    expect(screen.getByText("Seus dados foram apagados")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Voltar à tela de login" })).toBeInTheDocument();
  });
});
