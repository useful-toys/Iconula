// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import "./TelaDeLogin.css";

// Passo explícito de aceite entre o login e o catálogo, reusando o cartão da
// tela de login. Dois motivos (IDR 0062):
// - `primeiro-acesso` — atestação de menores (LGPD art. 14, IDR 0036), uma
//   única vez por conta, com o botão "Confirmar";
// - `atualizacao` — os textos aceitos pela conta ficaram para trás; mostra os
//   links das duas vistas e o botão "Li e concordo", sem repetir a atestação
//   de idade já registrada.
//
// `onConfirmar` é assíncrono e nunca lança (contrato de `gravarAceite`
// em `colecaoRemota.js`): App.jsx decide sozinho, a partir do resultado, se
// libera o app — nunca reter o usuário aqui, mesmo que a gravação falhe
// (IDR 0036).
export default function Atestacao({
  motivo = "primeiro-acesso",
  onConfirmar,
  onAbrirPolitica = () => {},
  onAbrirTermos = () => {},
}) {
  const [enviando, setEnviando] = useState(false);
  const primeiroAcesso = motivo === "primeiro-acesso";

  async function handleConfirmar() {
    setEnviando(true);
    await onConfirmar();
  }

  return (
    <div className="tela-de-login">
      <div className="tela-de-login__bloco">
        <div className="tela-de-login__cartao">
          <h1 className="tela-de-login__titulo">ICONULA 2026</h1>
          {primeiroAcesso ? (
            <p className="tela-de-login__subtitulo">
              Ao continuar, você confirma ter 12 anos ou mais, ou estar
              autorizado pelos responsáveis.
            </p>
          ) : (
            <p className="tela-de-login__subtitulo">
              Os{" "}
              <button
                type="button"
                className="tela-de-login__link"
                onClick={onAbrirTermos}
              >
                Termos de uso
              </button>{" "}
              e a{" "}
              <button
                type="button"
                className="tela-de-login__link"
                onClick={onAbrirPolitica}
              >
                Política de privacidade
              </button>{" "}
              mudaram.
            </p>
          )}
          <button
            type="button"
            className="tela-de-login__confirmar"
            onClick={handleConfirmar}
            disabled={enviando}
          >
            {primeiroAcesso ? "Confirmar" : "Li e concordo"}
          </button>
        </div>
      </div>
    </div>
  );
}
