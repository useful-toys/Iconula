// Copyright (c) 2026 Daniel Felix Ferber

import LoginButton from "./LoginButton";

// Componente puramente controlado por props, sem import direto do
// Firebase — mantém os testes simples (ver AuthStatus.test.jsx) e deixa
// LoginButton.jsx isolado como o único ponto que toca o SDK/FirebaseUI.
export default function AuthStatus({ user, onSignOut }) {
  if (!user) {
    return <LoginButton />;
  }

  return (
    <div className="auth-status">
      <img
        className="auth-status__avatar"
        src={user.photoURL}
        alt=""
        referrerPolicy="no-referrer"
      />
      <span className="auth-status__name">{user.displayName}</span>
      <button className="auth-status__signout" onClick={onSignOut}>
        Sair
      </button>
    </div>
  );
}
