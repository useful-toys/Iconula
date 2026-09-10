// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { figurinhas, secoes } from "./data/catalogo.js";
import AuthStatus from "./components/AuthStatus";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { auth } from "./lib/firebase";
import { ajustarContagem } from "./lib/colecao.js";
import { calcularPlacar } from "./lib/progresso.js";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

export default function App() {
  const [user, setUser] = useState(null);
  const [contagens, setContagens] = useState({});

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

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
  );
}
