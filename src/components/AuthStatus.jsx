// Copyright (c) 2026 Daniel Felix Ferber

// Componente puramente controlado por props, sem import direto do
// Firebase. Desde a Tarefa 0008-0002, só é usado na tela principal — a tela
// de login é `TelaDeLogin.jsx`, que usa `LoginButton.jsx` diretamente (o
// único ponto que toca o SDK do Firebase) — por isso `AuthStatus` sempre
// recebe um usuário autenticado, sem ramo para o caso deslogado.
export default function AuthStatus({ user, onSignOut }) {
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
