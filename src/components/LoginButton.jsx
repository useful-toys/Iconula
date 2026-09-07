// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { firebase, auth } from "../lib/firebase";

const uiConfig = {
  // Sem router na SPA — evita navegação de página inteira.
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  // Desliga o "Smart Lock"/credential helper do Google (gapi): sem isso,
  // o FirebaseUI carrega https://apis.google.com/js/api.js e injeta
  // estilos/handlers inline no DOM da página, incompatível com a CSP
  // estrita deste app (ver TDR 0005) — e não usamos sugestão de conta
  // salva mesmo. Não afeta o botão "Sign in with Google" nem o popup.
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  callbacks: {
    // App.jsx já reage à mudança via onAuthStateChanged; sem redirect
    // próprio do FirebaseUI.
    signInSuccessWithAuthResult: () => false,
  },
};

export default function LoginButton() {
  const containerRef = useRef(null);

  useEffect(() => {
    // AuthUI é um singleton: o StrictMode do React invoca efeitos duas
    // vezes em dev, e `new firebaseui.auth.AuthUI(auth)` lança erro se já
    // existe uma instância — por isso reusar via getInstance(). No
    // cleanup, `reset()` (não `delete()`) para não destruir o singleton
    // entre montagens do StrictMode.
    const ui = firebaseui.auth.AuthUI.getInstance() ?? new firebaseui.auth.AuthUI(auth);
    ui.start(containerRef.current, uiConfig);
    return () => ui.reset();
  }, []);

  return <div ref={containerRef} />;
}
