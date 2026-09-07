// Copyright (c) 2026 Daniel Felix Ferber

// API compat/namespaced (não a modular `firebase/auth`) porque o
// FirebaseUI 6.x espera receber uma instância `firebase.auth.Auth` no
// estilo v8 — ver ADR 0005. Todo o app deve reusar esta mesma instância
// `auth`, nunca misturar com o SDK modular.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export { firebase };

// Sem VITE_FIREBASE_* configuradas (ex.: `.env.local` ausente ao rodar
// `npm run dev` localmente), `firebase.auth()` lança síncronamente
// (auth/invalid-api-key). Login é uma feature adicional — sua ausência
// não deve travar o resto do app (App.jsx trata `auth === null` como
// "login indisponível" e não renderiza a área de autenticação).
export let auth = null;
try {
  auth = firebase.auth();
} catch (error) {
  console.error(
    "Firebase Auth não inicializado — configure VITE_FIREBASE_* em .env.local (ver docs/firebase.md). Login ficará indisponível.",
    error,
  );
}
