// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from "react";
import { sortedTeams } from "./data/teams";
import TeamButton from "./components/TeamButton";
import "./App.css";

export default function App() {
  const [index, setIndex] = useState(0);

  function handleNext() {
    setIndex((current) => (current + 1) % sortedTeams.length);
  }

  return (
    <main className="app">
      <TeamButton team={sortedTeams[index]} onClick={handleNext} />
    </main>
  );
}
