// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState, useRef, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { figurinhas, secoes } from "./data/catalogo.js";
import { ordenarPorSigla, ordenarPorPagina, extrairSecoes } from "./data/catalogoOrdenacoes.js";
import AuthStatus from "./components/AuthStatus";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Controles } from "./components/Controles.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { Avisos } from "./components/Avisos.jsx";
import { auth, app } from "./lib/firebase";
import { ajustarContagem, obterContagem } from "./lib/colecao.js";
import { calcularPlacar } from "./lib/progresso.js";
import { lerPreferenciasDeVista, gravarPreferenciasDeVista } from "./lib/preferenciasDeVista.js";
import { carregarColecao, gravarAlteracoes, formatarCarimbo, mensagemDeErro } from "./lib/colecaoRemota.js";
import { criarGravacaoAgregada } from "./lib/gravacaoAgregada.js";
import { emitirAviso, SEVERIDADE } from "./lib/avisos.js";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

export default function App() {
  const [user, setUser] = useState(null);
  const [contagens, setContagens] = useState({});
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  // Preferências de vista lidas uma vez na abertura (IDR 0026)
  const [inicial] = useState(() => lerPreferenciasDeVista());
  const [ordenacao, setOrdenacao] = useState(inicial.ordenacao);
  const [disposicao, setDisposicao] = useState(inicial.disposicao);
  const [filtro, setFiltro] = useState(inicial.filtro);
  const catalogoRef = useRef(null);
  // Contador de ajustes para a proteção de corrida da carga (ADR 0007, TDR 0016):
  // se o usuário ajustar contagens enquanto a leitura está em voo, a resposta do
  // servidor é descartada.
  const ajustesRef = useRef(0);
  // Marca da era do botão: documento ainda tem `teamName`? Consumida pela
  // primeira gravação do schema novo (Tarefa 0007-0004).
  const temTeamNameRef = useRef(false);

  // Gravação agregada (ADR 0008, IDR 0003): uma instância por sessão de App,
  // criada uma única vez (inicializador preguiçoso do useState, como
  // `inicial` acima — nunca chamamos o setter). Fica em `App.jsx`, não em
  // Context: continua sendo o único ponto que lê e escreve a coleção
  // (TDR 0014, revisitado nesta tarefa).
  const [gravacaoAgregada] = useState(() =>
    criarGravacaoAgregada({
      gravar: gravarAlteracoes,
      aoConcluir: (resultado) => {
        setAtualizadoEm(formatarCarimbo(resultado.atualizadoEm));
        emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção gravada', tipo: 'gravacao' });
      },
    }),
  );

  // Flush garantido ao ocultar/fechar a página (ADR 0008): a escrita fica
  // enfileirada no cache local do SDK e sobrevive ao fechamento da aba.
  useEffect(() => {
    function flush() {
      gravacaoAgregada.flush();
    }
    function flushSeOculta() {
      if (document.visibilityState === 'hidden') flush();
    }
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flushSeOculta);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flushSeOculta);
    };
  }, [gravacaoAgregada]);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const uid = user?.uid ?? null;

  // Carga da coleção no login: uma leitura de `users/{uid}`, disparada pelo uid
  // (não pelo objeto `user`, que muda a cada refresh de token — ADR 0007).
  useEffect(() => {
    if (!uid || !app) return;

    const ajustesNoInicio = ajustesRef.current;
    let cancelado = false;

    carregarColecao(uid).then((resultado) => {
      if (cancelado) return;

      if (resultado.status === 'erro') {
        emitirAviso({
          severidade: SEVERIDADE.FALHA,
          mensagem: 'Falha ao carregar — toque para detalhes',
          detalhe: mensagemDeErro(resultado.erro),
          tipo: 'carga',
        });
        return;
      }
      if (resultado.status === 'indisponivel') return;

      // Proteção de corrida: descarta a resposta se houve ajuste em voo.
      if (ajustesRef.current !== ajustesNoInicio) return;

      if (resultado.status === 'encontrado') {
        setContagens(resultado.contagens);
        setAtualizadoEm(formatarCarimbo(resultado.atualizadoEm));
        temTeamNameRef.current = resultado.temTeamName;
      } else {
        setContagens({});
        setAtualizadoEm('—');
        temTeamNameRef.current = false;
      }
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção carregada', tipo: 'carga' });
    });

    return () => {
      cancelado = true;
    };
  }, [uid]);

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
    ajustesRef.current += 1;
    setContagens((anterior) => {
      const nova = ajustarContagem(anterior, codigo, delta);
      if (uid) {
        gravacaoAgregada.registrarAjuste(uid, codigo, obterContagem(nova, codigo));
      }
      return nova;
    });
  }

  // Sair da conta dá flush antes do `signOut`: depois dele o ID token some e
  // as regras negam a escrita — a gravação pendente precisa ir embora
  // primeiro, senão o logout descarta ajustes (ADR 0008).
  async function handleSignOut() {
    await gravacaoAgregada.flush();
    await signOut(auth);
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
          <AuthStatus user={user} onSignOut={handleSignOut} />
        </div>
      )}
      <Cabecalho
        coladas={placar.coladas}
        faltantes={placar.faltantes}
        repetidas={placar.repetidas}
        percentual={placar.percentual}
        atualizadoEm={atualizadoEm}
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
      <Avisos />
    </div>
  );
}
