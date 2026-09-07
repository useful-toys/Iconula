// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import { signInWithGoogle } from "../lib/firebase";
import googleLogo from "../assets/google-logo.svg";

// Botão próprio, com o SDK modular — o widget do FirebaseUI foi removido
// (ver ADR 0005). Para um único provedor e um único botão, o widget
// custava mais do que entregava: prendia o projeto no `firebase` 10.x,
// exigia handlers/estilos inline na CSP e importava Google Fonts.
//
// O fluxo continua sendo popup (`signInWithPopup`), não redirect, pelo
// mesmo motivo estrutural de antes: o `authDomain`
// (`iconula.firebaseapp.com`) é origem diferente da do app, e o
// particionamento de storage de terceiros impede o redirect de entregar
// o resultado — ver TDR 0005.
export default function LoginButton() {
  const [error, setError] = useState(null);

  async function handleSignIn() {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (cause) {
      // Fechar o popup é uma ação deliberada do usuário, não um erro a
      // reportar. O resto (rede fora, domínio não autorizado, popup
      // bloqueado) merece feedback visível — antes isso ficava só no
      // console, escondido dentro do widget.
      if (
        cause.code === "auth/popup-closed-by-user" ||
        cause.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.error("Falha no login com Google", cause);
      setError("Não foi possível entrar. Tente novamente.");
    }
  }

  return (
    <div className="login">
      <button className="login__button" onClick={handleSignIn}>
        <img className="login__logo" src={googleLogo} alt="" aria-hidden="true" />
        Entrar com Google
      </button>
      {error && (
        <p className="login__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
