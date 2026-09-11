// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState, useRef, useMemo } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { figurinhas, secoes } from "./data/catalogo.js";
import { ordenarPorSigla, ordenarPorPagina, extrairSecoes } from "./data/catalogoOrdenacoes.js";
import TelaDeLogin from "./components/TelaDeLogin.jsx";
import Atestacao from "./components/Atestacao.jsx";
import PoliticaDePrivacidade from "./components/PoliticaDePrivacidade.jsx";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Controles } from "./components/Controles.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { Avisos } from "./components/Avisos.jsx";
import { Rodape } from "./components/Rodape.jsx";
import { auth, app } from "./lib/firebase";
import { ajustarContagem, obterContagem } from "./lib/colecao.js";
import { registrarAjuste, retirarUltimoAjuste } from "./lib/historico.js";
import { calcularPlacar } from "./lib/progresso.js";
import { lerPreferenciasDeVista, gravarPreferenciasDeVista } from "./lib/preferenciasDeVista.js";
import {
  carregarColecao,
  gravarAlteracoes,
  gravarAtestacao,
  formatarCarimbo,
  mensagemDeErro,
} from "./lib/colecaoRemota.js";
import { criarGravacaoAgregada } from "./lib/gravacaoAgregada.js";
import { emitirAviso, SEVERIDADE } from "./lib/avisos.js";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);

export default function App() {
  const [user, setUser] = useState(null);
  // Torna-se `true` na primeira emissão de `onAuthStateChanged` (login
  // restaurado ou não). Enquanto `false`, a tela fica neutra — nem login
  // nem catálogo — para não piscar a tela de login para quem já tem sessão
  // (ver IDR 0035).
  const [authResolvido, setAuthResolvido] = useState(false);
  const [contagens, setContagens] = useState({});
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  // Histórico de desfazer (Tarefa 0009-0001, IDR 0012): pilha das últimas 10
  // alterações, em memória — recarregar a página o descarta, como o resto do
  // estado deste `useState`. Fica em `App.jsx`, não escondido num hook
  // próprio, para que a importação (Tarefa 0009-0005) possa zerá-lo com um
  // simples `setHistorico([])`.
  const [historico, setHistorico] = useState([]);
  // Precisa atestar? (Tarefa 0008-0003, IDR 0036). Começa `false`
  // (otimista, como `contagens`) e a carga da coleção — a mesma leitura da
  // Tarefa 0007-0002, sem leitura extra — decide assim que chega: catálogo
  // e atestação nunca disputam uma tela própria de espera, o mesmo
  // tratamento que a carga já dá às contagens.
  const [precisaAtestar, setPrecisaAtestar] = useState(false);
  // Vista interna da política de privacidade (Tarefa 0008-0004, TDR 0020):
  // sem router — checada antes de qualquer outro ramo de retorno, para
  // voltar sempre cair na tela que o restante do estado já determinaria.
  const [mostrarPolitica, setMostrarPolitica] = useState(false);
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
        emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Alterações salvas', tipo: 'gravacao' });
      },
      // Falha (vermelha): o que deveria ter funcionado e não funcionou —
      // persiste até ser dispensada ou até a gravação seguinte ter sucesso
      // (IDR 0029). A tela segue editável; a gravação seguinte regrava o
      // valor completo (Tarefa 0007-0005, ADR 0008).
      aoFalhar: (resultado) => {
        emitirAviso({
          severidade: SEVERIDADE.FALHA,
          mensagem: 'Falha ao gravar — toque para detalhes',
          detalhe: mensagemDeErro(resultado.erro),
          tipo: 'gravacao',
        });
      },
      // Espera (aviso dourado): sem rede, a escrita não falha nem confirma —
      // fica enfileirada no cache local e o desfecho real ainda chega depois
      // (ADR 0008, IDR 0029). Não é falha.
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'gravacao',
        });
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
    return onAuthStateChanged(auth, (novoUsuario) => {
      setUser(novoUsuario);
      setAuthResolvido(true);
    });
  }, []);

  const uid = user?.uid ?? null;

  // Carga da coleção no login: uma leitura de `users/{uid}`, disparada pelo uid
  // (não pelo objeto `user`, que muda a cada refresh de token — ADR 0007).
  useEffect(() => {
    if (!uid || !app) return;

    const ajustesNoInicio = ajustesRef.current;
    let cancelado = false;

    carregarColecao(uid, {
      // Espera (aviso dourado): a leitura não falhou nem confirmou — sem
      // rede, ela só resolve quando o servidor responder (Tarefa 0007-0005).
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'carga',
        });
      },
    }).then((resultado) => {
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
        setPrecisaAtestar(!resultado.atestadoEm);
        // Documento ainda com `teamName` da era do botão: a próxima gravação
        // agregada o apaga junto das contagens, sem escrita à parte (ADR 0008,
        // Tarefa 0007-0004).
        if (resultado.temTeamName) {
          gravacaoAgregada.marcarTeamNameParaApagar(uid);
        }
      } else {
        // Documento inexistente ("vazio"): primeiro login desta conta, que
        // nunca atestou.
        setContagens({});
        setAtualizadoEm('—');
        setPrecisaAtestar(true);
      }
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção carregada', tipo: 'carga' });
    });

    return () => {
      cancelado = true;
    };
  }, [uid, gravacaoAgregada]);

  // Confirmar a atestação (Tarefa 0008-0003, IDR 0036): grava e libera o
  // app de qualquer jeito, mesmo em falha — o ato já foi praticado pelo
  // usuário, e a falha de rede não deve retê-lo. A falha só avisa; o campo
  // segue ausente no documento e a atestação é tentada de novo se esta
  // conta logar de novo sem `atestadoEm`.
  async function handleConfirmarAtestacao() {
    const resultado = await gravarAtestacao(uid);
    if (resultado.status !== 'sucesso') {
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: 'Falha ao gravar a atestação — toque para detalhes',
        detalhe: mensagemDeErro(resultado.erro),
        tipo: 'atestacao',
      });
    }
    setPrecisaAtestar(false);
  }

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

  // Aplica um delta à contagem e registra a alteração para a gravação
  // agregada — caminho comum ao toque no cartão e ao desfazer (IDR 0010,
  // IDR 0003): a gravação seguinte leva a reversão sem caso especial.
  function aplicarAjuste(codigo, delta) {
    ajustesRef.current += 1;
    setContagens((anterior) => {
      const nova = ajustarContagem(anterior, codigo, delta);
      if (uid) {
        gravacaoAgregada.registrarAjuste(uid, codigo, obterContagem(nova, codigo));
      }
      return nova;
    });
  }

  function handleAjustar(codigo, delta) {
    setHistorico((anterior) => registrarAjuste(anterior, codigo, obterContagem(contagens, codigo)));
    aplicarAjuste(codigo, delta);
  }

  // Desfazer (Tarefa 0009-0001, IDR 0012): retira o topo do histórico e
  // reaplica a contagem anterior como um ajuste comum — a reversão em si
  // não entra no próprio histórico. Sem histórico, não faz nada (o botão já
  // fica desabilitado nesse caso).
  function handleDesfazer() {
    const { entrada, restante } = retirarUltimoAjuste(historico);
    if (!entrada) return;
    setHistorico(restante);
    aplicarAjuste(entrada.codigo, entrada.contagemAnterior - obterContagem(contagens, entrada.codigo));
  }

  // Sair da conta dá flush antes do `signOut`: depois dele o ID token some e
  // as regras negam a escrita — a gravação pendente precisa ir embora
  // primeiro, senão o logout descarta ajustes (ADR 0008). Se o flush falhar
  // (`status: 'erro'`), o `signOut` não acontece: a conta permanece logada
  // com o ajuste intacto na fila, e o `aoFalhar` da gravação agregada já
  // avisou a falha (IDR 0038) — sair não é caso especial.
  async function handleSignOut() {
    const resultado = await gravacaoAgregada.flush();
    if (resultado.status === 'erro') return;
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

  // Vista da política de privacidade (Tarefa 0008-0004, TDR 0020): checada
  // antes de qualquer outro ramo — fechar (`onVoltar`) apenas desliga o
  // estado e devolve para a tela que os ramos abaixo já mostrariam.
  if (mostrarPolitica) {
    return <PoliticaDePrivacidade onVoltar={() => setMostrarPolitica(false)} />;
  }

  // Guarda de login (Tarefa 0008-0001, requisitos.md § Acesso): sem sessão,
  // só a tela de login existe — catálogo e coleção nunca ficam acessíveis
  // por nenhum caminho. Três telas, mutuamente exclusivas:
  if (!auth) {
    // Sem VITE_FIREBASE_*: modo não suportado (requisitos.md § Dados e
    // isolamento) — a tela de login aparece sem botão funcional, nunca como
    // caminho alternativo para o catálogo.
    return (
      <div className="app">
        <div className="app__auth">
          <p className="app__login-indisponivel">
            Login indisponível — configure as variáveis <code>VITE_FIREBASE_*</code>{" "}
            para usar o app (ver <code>docs/firebase.md</code>).
          </p>
        </div>
      </div>
    );
  }

  if (!authResolvido) {
    // Estado neutro breve enquanto o Firebase Auth restaura a sessão
    // (IDR 0035): nem login nem catálogo, para não piscar a tela de login
    // para quem já está autenticado.
    return <div className="app" />;
  }

  if (!user) {
    // Tela desenhada em docs/interface.md § Tela de login (Tarefa
    // 0008-0002) — não mais o AuthStatus genérico.
    return <TelaDeLogin onAbrirPolitica={() => setMostrarPolitica(true)} />;
  }

  if (precisaAtestar) {
    return <Atestacao onConfirmar={handleConfirmarAtestacao} />;
  }

  return (
    <div className="app">
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
        podeDesfazer={historico.length > 0}
        onDesfazer={handleDesfazer}
        onSignOut={handleSignOut}
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
      <Rodape onAbrirPolitica={() => setMostrarPolitica(true)} />
    </div>
  );
}
