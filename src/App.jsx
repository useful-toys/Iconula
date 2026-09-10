// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState, useRef, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { figurinhas, secoes } from "./data/catalogo.js";
import { ordenarPorSigla, ordenarPorPagina, extrairSecoes } from "./data/catalogoOrdenacoes.js";
import AuthStatus from "./components/AuthStatus";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Controles } from "./components/Controles.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { auth } from "./lib/firebase";
import { ajustarContagem } from "./lib/colecao.js";
import { calcularPlacar } from "./lib/progresso.js";
import { lerPreferenciasDeVista, gravarPreferenciasDeVista } from "./lib/preferenciasDeVista.js";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

export default function App() {
  const [user, setUser] = useState(null);
  const [contagens, setContagens] = useState({});
  // Preferências de vista lidas uma vez na abertura (IDR 0026)
  const [inicial] = useState(() => lerPreferenciasDeVista());
  const [ordenacao, setOrdenacao] = useState(inicial.ordenacao);
  const [disposicao, setDisposicao] = useState(inicial.disposicao);
  const [filtro, setFiltro] = useState(inicial.filtro);
  const catalogoRef = useRef(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Grava a preferência ao trocar alternador — a preferência é o próprio
  // último uso (IDR 0026). O colapso de seções não persiste (IDR 0020).
  const primeiraRender = useRef(true);
  useEffect(() => {
    if (primeiraRender.current) {
      primeiraRender.current = false;
      return;
    }
    gravarPreferenciasDeVista({ ordenacao, disposicao, filtro });
  }, [ordenacao, disposicao, filtro]);

  function handleAjustar(codigo, delta) {
    setContagens((anterior) => ajustarContagem(anterior, codigo, delta));
  }

  function handleSaltar(sigla) {
    if (catalogoRef.current) {
      catalogoRef.current.saltarPara(sigla);
    }
  }

  function handleTrocarFiltro(novoFiltro) {
    setFiltro(novoFiltro);
  }

  // Calcula as seções na ordem vigente para a faixa de bandeiras
  const secoesOrdenadas = useMemo(() => {
    const estruturada = ordenacao === 'pagina' ? ordenarPorPagina(secoes) : ordenarPorSigla(secoes);
    return extrairSecoes(estruturada);
  }, [ordenacao]);

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
        secoes={secoesOrdenadas}
        onSaltar={handleSaltar}
      />
      <Controles
        ordenacao={ordenacao}
        onTrocarOrdenacao={setOrdenacao}
        disposicao={disposicao}
        onTrocarDisposicao={setDisposicao}
        filtro={filtro}
        onTrocarFiltro={handleTrocarFiltro}
      />
      <Catalogo
        ref={catalogoRef}
        secoes={secoes}
        figurinhas={figurinhas}
        contagens={contagens}
        onAjustar={handleAjustar}
        ordenacao={ordenacao}
        disposicao={disposicao}
        filtro={filtro}
        onLimparFiltro={() => setFiltro('todas')}
      />
    </div>
  );
}
