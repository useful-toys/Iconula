// Copyright (c) 2026 Daniel Felix Ferber

// API modular do Firebase (`firebase/app` + `firebase/auth`), não a
// compat/namespaced v8 — ver ADR 0005. A compat só existia para atender ao
// FirebaseUI, que foi removido; sem ele, a API modular é a suportada e é o
// que permite tree-shaking e o `firebase` 12.x.
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  connectAuthEmulator,
  deleteUser,
  getAuth,
  reauthenticateWithPopup,
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

// Login e persistência são features adicionais: sua ausência não deve
// travar o resto do app. Sem as VITE_FIREBASE_* (ex.: `.env.local` não
// configurado ao rodar `npm run dev` pela primeira vez), exportamos
// `auth = null` e `app = null`: App.jsx simplesmente não renderiza a área
// de autenticação, e nada é gravado — ver ADR 0005 e ADR 0007.
//
// A checagem é explícita, e não um try/catch em volta de `getAuth()`: na
// API modular o erro de credencial inválida só aparece na primeira
// operação de login, tarde demais para decidir se a UI deve existir. Com
// a compat, `firebase.auth()` lançava na inicialização e o try/catch
// funcionava por acidente do design antigo.
const isConfigured = Object.values(config).every(Boolean);

export let auth = null;

// A instância de FirebaseApp é exportada porque `src/lib/userPreferences.js`
// carrega o SDK do Firestore sob demanda (`import()` dinâmico) e precisa
// dela para chamar `getFirestore(app)`. Este módulo deliberadamente **não**
// importa `firebase/firestore`: fazê-lo estaticamente jogaria ~430 KB no
// bundle principal, entregues a todo visitante — inclusive quem nunca faz
// login e portanto nunca grava nada. Ver ADR 0007.
export let app = null;

if (isConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
  // Ligado só pelos testes E2E (ADR 0010): nunca em dev normal, preview ou
  // produção, porque a variável nunca é definida fora desse ambiente.
  if (import.meta.env.VITE_USE_FIREBASE_EMULATOR) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
  }
} else {
  console.error(
    "Firebase não inicializado — configure VITE_FIREBASE_* em .env.local (ver docs/setup-firebase.md). Login e persistência ficarão indisponíveis.",
  );
}

export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

// Reautenticação do usuário corrente por popup, exigida antes de apagar
// qualquer dado (TDR 0027): o `deleteUser` falha com
// `auth/requires-recent-login` quando o login não é recente, e o momento
// em que isso acontece não é previsível pelo cliente. Popup, não redirect,
// pelo mesmo motivo estrutural do login (DDR 0001). Fechar o popup
// (`auth/popup-closed-by-user`, `auth/cancelled-popup-request`) é
// desistência — quem chama trata, como em `LoginButton.jsx`.
export function reauthenticateWithGoogle() {
  return reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider());
}

// Último passo da exclusão (TDR 0027), depois de `users/{uid}` já ter sido
// apagado: apaga a conta do Firebase Auth, onde vivem nome, e-mail e foto
// — o que o art. 18, VI da LGPD alcança além da coleção.
export function deleteUserAccount() {
  return deleteUser(auth.currentUser);
}
