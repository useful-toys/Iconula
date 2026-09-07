// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { firebase, auth } from "../lib/firebase";

const uiConfig = {
  // Redirect, não popup: signInWithPopup do Firebase Auth carrega
  // internamente https://apis.google.com/js/api.js (gapi.iframes, usado
  // pra repassar o resultado do popup pra janela principal) e injeta
  // estilo/handler inline no DOM — incompatível com a CSP estrita deste
  // app sem abrir mão de confiar num script de terceiro não versionado
  // por nós (ver TDR 0005). Redirect também é mais confiável em
  // navegadores mobile, onde popup costuma ser bloqueado ou se comportar
  // como navegação mesmo. Sem estado de app a preservar hoje — se isso
  // mudar no futuro, ver ADR 0005 pro plano de revisão (Google Identity
  // Services em vez de signInWithPopup, não CSP relaxada).
  signInFlow: "redirect",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  // Desliga o "Smart Lock"/credential helper do Google (gapi) — não
  // usamos sugestão de conta salva, e ele também dependeria de
  // apis.google.com independente do signInFlow escolhido acima.
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
