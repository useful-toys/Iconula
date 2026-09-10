// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { sortedTeams } from "./data/teams";
import { figurinhas, secoes } from "./data/catalogo.js";
import TeamButton from "./components/TeamButton";
import AuthStatus from "./components/AuthStatus";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { auth } from "./lib/firebase";
import { loadCurrentTeam, saveCurrentTeam } from "./lib/userPreferences";
import { ajustarContagem } from "./lib/colecao.js";
import { calcularPlacar } from "./lib/progresso.js";
import "./App.css";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

export default function App() {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [contagens, setContagens] = useState({});

  // Desempata a corrida entre a leitura assíncrona do Firestore e o
  // usuário clicando enquanto ela ainda está em voo.
  const clickCountRef = useRef(0);

  const uid = user?.uid ?? null;

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;
    const clicksBefore = clickCountRef.current;

    loadCurrentTeam(uid).then((result) => {
      if (cancelled) return;
      if (clickCountRef.current !== clicksBefore) return;
      if (result.status !== "found") return;

      const stored = sortedTeams.findIndex(
        (team) => team.name === result.teamName,
      );
      setIndex(stored === -1 ? 0 : stored);
    });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  function handleNext() {
    const next = (index + 1) % sortedTeams.length;
    clickCountRef.current += 1;
    setIndex(next);

    if (uid) saveCurrentTeam(uid, sortedTeams[next].name);
  }

  function handleAjustar(codigo, delta) {
    setContagens((anterior) => ajustarContagem(anterior, codigo, delta));
  }

  const placar = calcularPlacar(contagens, codigosTodasFigurinhas);

  return (
    <div className="app">
      {auth && (
        <div className="app__auth">
          <AuthStatus user={user} onSignOut={() => signOut(auth)} />
        </div>
      )}
      <TeamButton team={sortedTeams[index]} onClick={handleNext} />
      <div className="app__conteudo">
        <Cabecalho
          coladas={placar.coladas}
          faltantes={placar.faltantes}
          repetidas={placar.repetidas}
          percentual={placar.percentual}
        />
        <Catalogo
          secoes={secoes}
          figurinhas={figurinhas}
          contagens={contagens}
          onAjustar={handleAjustar}
        />
      </div>
    </div>
  );
}
