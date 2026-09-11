// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import "./TelaDeLogin.css";

// Passo explícito de atestação de menores (LGPD art. 14, Tarefa 0008-0003),
// uma única vez por conta — IDR 0036. Segue o desenho da tela de login: o
// mesmo cartão, os mesmos tokens (reaproveita `TelaDeLogin.css`), sem
// inventar layout novo.
//
// `onConfirmar` é assíncrono e nunca lança (contrato de `gravarAtestacao`
// em `colecaoRemota.js`): App.jsx decide sozinho, a partir do resultado, se
// libera o app — nunca reter o usuário aqui, mesmo que a gravação falhe
// (IDR 0036).
export default function Atestacao({ onConfirmar }) {
  const [enviando, setEnviando] = useState(false);

  async function handleConfirmar() {
    setEnviando(true);
    await onConfirmar();
  }

  return (
    <div className="tela-de-login">
      <div className="tela-de-login__bloco">
        <div className="tela-de-login__cartao">
          <h1 className="tela-de-login__titulo">ICONULA 2026</h1>
          <p className="tela-de-login__subtitulo">
            Ao continuar, você confirma ter 12 anos ou mais, ou estar
            autorizado pelos responsáveis.
          </p>
          <button
            type="button"
            className="tela-de-login__confirmar"
            onClick={handleConfirmar}
            disabled={enviando}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
