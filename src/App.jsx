// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState } from "react";
import { sortedTeams } from "./data/teams";
import TeamButton from "./components/TeamButton";
import AuthStatus from "./components/AuthStatus";
import { auth } from "./lib/firebase";
import "./App.css";

export default function App() {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged(setUser);
  }, []);

  function handleNext() {
    setIndex((current) => (current + 1) % sortedTeams.length);
  }

  return (
    <main className="app">
      {auth && (
        <div className="app__auth">
          <AuthStatus user={user} onSignOut={() => auth.signOut()} />
        </div>
      )}
      <TeamButton team={sortedTeams[index]} onClick={handleNext} />
    </main>
  );
}
