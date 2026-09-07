// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
    return onAuthStateChanged(auth, setUser);
  }, []);

  function handleNext() {
    setIndex((current) => (current + 1) % sortedTeams.length);
  }

  return (
    <main className="app">
      {auth && (
        <div className="app__auth">
          <AuthStatus user={user} onSignOut={() => signOut(auth)} />
        </div>
      )}
      <TeamButton team={sortedTeams[index]} onClick={handleNext} />
    </main>
  );
}
