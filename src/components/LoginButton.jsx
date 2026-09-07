// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { firebase, auth } from "../lib/firebase";

const uiConfig = {
  // Popup, não redirect. `signInFlow: "redirect"` foi tentado e **não
  // funciona neste projeto**: o app roda em `iconula.web.app` /
  // `iconula.danielferber.com.br` / canais de preview, mas o
  // `authDomain` é `iconula.firebaseapp.com` — origem diferente. No
  // redirect, o handler grava o resultado do OAuth no storage de
  // `firebaseapp.com` como página de topo e, na volta, o SDK tenta lê-lo
  // pelo iframe oculto da mesma origem — que agora é third-party e
  // recebe um bucket de storage particionado pelo navegador. O evento
  // nunca chega, `onAuthStateChanged` nunca dispara, e o widget só
  // re-renderiza. Sem erro, sem violação de CSP. Ver TDR 0005.
  //
  // Popup é imune a isso (a janela do popup é top-level em
  // `firebaseapp.com`, fala direto com o opener) — ao custo de
  // `Cross-Origin-Opener-Policy: same-origin-allow-popups` no
  // `firebase.json`.
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  // Desliga o "Smart Lock"/credential helper do Google — não usamos
  // sugestão de conta salva. Não elimina o gapi: o próprio
  // @firebase/auth (popup ou redirect, independente do FirebaseUI) usa
  // um iframe oculto + gapi.iframes pra reconciliar o resultado do login
  // com <authDomain>/__/auth/iframe — confirmado direto no bundle da
  // lib. CSP em firebase.json abre exceção pontual pra isso (ver
  // TDR 0005); sem essa exceção o login falha com auth/internal-error.
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
