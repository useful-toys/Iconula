// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { sortedTeams } from "./data/teams";
import TeamButton from "./components/TeamButton";
import AuthStatus from "./components/AuthStatus";
import { auth } from "./lib/firebase";
import { loadCurrentTeam, saveCurrentTeam } from "./lib/userPreferences";
import "./App.css";

export default function App() {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState(null);

  // Desempata a corrida entre a leitura assíncrona do Firestore e o
  // usuário clicando enquanto ela ainda está em voo. Precisa ser um
  // contador com snapshot, e não um booleano "já interagiu": senão um
  // clique dado *antes* do login impediria a carga para sempre.
  const clickCountRef = useRef(0);

  const uid = user?.uid ?? null;

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Ao entrar, mostra a última bandeira gravada. Sair não carrega nada e
  // não mexe na tela — só para de gravar (ver ADR 0007).
  useEffect(() => {
    // Cobre três situações, todas sem alterar a bandeira exibida: a
    // primeira chamada de onAuthStateChanged (que sempre vem com null
    // antes de o usuário resolver), o app sem credenciais, e o logout.
    if (!uid) return;

    let cancelled = false;
    const clicksBefore = clickCountRef.current;

    loadCurrentTeam(uid).then((result) => {
      // uid mudou (logout ou troca de conta) ou o componente desmontou.
      // É também o que neutraliza a primeira das duas execuções do efeito
      // sob StrictMode em desenvolvimento: vale a segunda leitura.
      if (cancelled) return;

      // O usuário clicou enquanto a leitura estava em voo: o que ele
      // acabou de fazer é mais recente que a resposta do servidor.
      if (clickCountRef.current !== clicksBefore) return;

      // "empty" (primeiro login, sem documento) e "error" (offline, regra
      // negada, cota) mantêm a bandeira que está na tela.
      if (result.status !== "found") return;

      const stored = sortedTeams.findIndex(
        (team) => team.name === result.teamName,
      );
      // Nome desconhecido (time removido ou renomeado em teams.js desde a
      // última gravação): volta ao primeiro, em vez de manter um índice
      // inválido.
      setIndex(stored === -1 ? 0 : stored);
    });

    return () => {
      cancelled = true;
    };
    // Depende do uid, não do objeto `user`: onAuthStateChanged entrega uma
    // instância nova a cada refresh de token, e o objeto como dependência
    // relançaria a leitura sem que nada relevante tivesse mudado.
  }, [uid]);

  function handleNext() {
    const next = (index + 1) % sortedTeams.length;
    clickCountRef.current += 1;
    setIndex(next);

    // A gravação fica aqui, e não num useEffect sobre `index`: um efeito
    // também dispararia no setIndex da carga acima, devolvendo ao
    // Firestore o valor que acabou de vir dele. Só clique grava.
    //
    // E fica fora do updater de setIndex porque o StrictMode invoca
    // updaters duas vezes em desenvolvimento — dentro, seriam duas
    // gravações por clique.
    if (uid) saveCurrentTeam(uid, sortedTeams[next].name);
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
