// Copyright (c) 2026 Daniel Felix Ferber

// API modular do Firebase (`firebase/app` + `firebase/auth`), não a
// compat/namespaced v8 — ver ADR 0005. A compat só existia para atender ao
// FirebaseUI, que foi removido; sem ele, a API modular é a suportada e é o
// que permite tree-shaking e o `firebase` 12.x.
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Login é uma feature adicional: sua ausência não deve travar o resto do
// app. Sem as VITE_FIREBASE_* (ex.: `.env.local` não configurado ao rodar
// `npm run dev` pela primeira vez), exportamos `auth = null` e App.jsx
// simplesmente não renderiza a área de autenticação — ver ADR 0005.
//
// A checagem é explícita, e não um try/catch em volta de `getAuth()`: na
// API modular o erro de credencial inválida só aparece na primeira
// operação de login, tarde demais para decidir se a UI deve existir. Com
// a compat, `firebase.auth()` lançava na inicialização e o try/catch
// funcionava por acidente do design antigo.
const isConfigured = Object.values(config).every(Boolean);

export let auth = null;

if (isConfigured) {
  auth = getAuth(initializeApp(config));
} else {
  console.error(
    "Firebase Auth não inicializado — configure VITE_FIREBASE_* em .env.local (ver docs/firebase.md). Login ficará indisponível.",
  );
}

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}
