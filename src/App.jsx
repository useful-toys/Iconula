// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  gravarImportacao,
  formatarCarimbo,
  mensagemDeErro,
} from "./lib/colecaoRemota.js";
import { criarGravacaoAgregada } from "./lib/gravacaoAgregada.js";
import { gerarTextoFaltantes, gerarTextoRepetidas } from "./lib/textoDeTroca.js";
import { gerarExportacao, nomeDoArquivoExportado, validarImportacao } from "./lib/portabilidade.js";
import { emitirAviso, SEVERIDADE } from "./lib/avisos.js";

const codigosTodasFigurinhas = figurinhas.map((f) => f.codigo);
// Conjunto dos códigos válidos, para a importação descartar o que não
// pertence ao catálogo atual (Tarefa 0009-0005, IDR 0041).
const codigosValidos = new Set(codigosTodasFigurinhas);
// Ordem fixa do álbum (FWC abre, COC fecha) para os textos de troca —
// sempre a mesma, independente da ordenação vigente na tela, para que a
// lista colada seja comparável entre pessoas (IDR 0039).
const secoesNaOrdemDoAlbum = extrairSecoes(ordenarPorPagina(secoes));

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
  // Input de arquivo oculto que abre o seletor nativo para "Importar"
  // (Tarefa 0009-0005) — sem tela própria (IDR 0041).
  const arquivoImportacaoRef = useRef(null);

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

  // Espelha `contagens` num ref, sincronizado depois de cada commit (nunca
  // durante a renderização): permite que `handleAjustar` leia a contagem
  // anterior sem depender de `contagens` no fecho, o que manteria sua
  // identidade instável a cada ajuste (Tarefa 0010-0002, TDR 0021) — só
  // leitura, nunca dispara render por si.
  const contagensRef = useRef(contagens);
  useEffect(() => {
    contagensRef.current = contagens;
  }, [contagens]);

  // Aplica um delta à contagem e registra a alteração para a gravação
  // agregada — caminho comum ao toque no cartão e ao desfazer (IDR 0010,
  // IDR 0003): a gravação seguinte leva a reversão sem caso especial.
  // `useCallback` com dependências estáveis (`uid`, `gravacaoAgregada` só
  // mudam em login/logout) para que o catálogo memoizado (TDR 0021) veja a
  // mesma função em todo ajuste, em vez de uma nova a cada render de `App`.
  const aplicarAjuste = useCallback((codigo, delta) => {
    ajustesRef.current += 1;
    setContagens((anterior) => {
      const nova = ajustarContagem(anterior, codigo, delta);
      if (uid) {
        gravacaoAgregada.registrarAjuste(uid, codigo, obterContagem(nova, codigo));
      }
      return nova;
    });
  }, [uid, gravacaoAgregada]);

  const handleAjustar = useCallback((codigo, delta) => {
    setHistorico((anterior) =>
      registrarAjuste(anterior, codigo, obterContagem(contagensRef.current, codigo)),
    );
    aplicarAjuste(codigo, delta);
  }, [aplicarAjuste]);

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

  // Copia um texto de troca para a área de transferência (Tarefa 0009-0003).
  // Sucesso avisa "Lista copiada"; indisponível ou negada é aviso dourado,
  // nunca falha (IDR 0029) — e o texto não se perde: aparece num
  // `window.prompt()` pronto para copiar manualmente (IDR 0039).
  async function copiarParaAreaDeTransferencia(texto, tipo) {
    try {
      if (!navigator.clipboard) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(texto);
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Lista copiada', tipo });
    } catch {
      emitirAviso({
        severidade: SEVERIDADE.AVISO,
        mensagem: 'Área de transferência indisponível — copie o texto que apareceu na tela',
        tipo,
      });
      window.prompt('Copie o texto (Ctrl+C ou Cmd+C):', texto);
    }
  }

  function handleCopiarFaltantes() {
    const texto = gerarTextoFaltantes(contagens, secoesNaOrdemDoAlbum, figurinhas);
    copiarParaAreaDeTransferencia(texto, 'copiar-faltantes');
  }

  function handleCopiarRepetidas() {
    const texto = gerarTextoRepetidas(contagens, secoesNaOrdemDoAlbum, figurinhas);
    copiarParaAreaDeTransferencia(texto, 'copiar-repetidas');
  }

  // Exporta a coleção em JSON (Tarefa 0009-0004): baixa direto, sem
  // diálogo — "sem etapas adicionais" (requisitos.md, IDR 0040). Zero
  // requisição: lê `contagens` em memória, nada do Firestore.
  function handleExportar() {
    try {
      const exportacao = gerarExportacao(contagens);
      const blob = new Blob([JSON.stringify(exportacao, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = nomeDoArquivoExportado();
        link.click();
      } finally {
        URL.revokeObjectURL(url);
      }
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção exportada', tipo: 'exportar' });
    } catch (erro) {
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: 'Falha ao exportar — toque para detalhes',
        detalhe: mensagemDeErro(erro),
        tipo: 'exportar',
      });
    }
  }

  // Importar coleção de JSON (Tarefa 0009-0005): abre o seletor nativo de
  // arquivo — sem tela própria (IDR 0041). O processamento de fato
  // acontece em `handleArquivoEscolhido`, ao trocar o input.
  function handleImportar() {
    arquivoImportacaoRef.current?.click();
  }

  // Valida antes de qualquer efeito; só um arquivo válido chega a
  // perguntar (confirmação mínima, `window.confirm`, IDR 0041). Aplica
  // substituindo `contagens` por inteiro, descarta o histórico de
  // desfazer (a coleção anterior deixou de existir) e grava numa única
  // escrita dedicada (`gravarImportacao`) — o pendente da gravação
  // agregada é descartado antes, para uma escrita antiga não reintroduzir
  // o que a importação apagou.
  async function handleArquivoEscolhido(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = ''; // permite escolher o mesmo arquivo de novo depois
    if (!arquivo) return;

    const texto = await arquivo.text();
    const resultado = validarImportacao(texto, codigosValidos);

    if (resultado.status === 'invalido') {
      emitirAviso({
        severidade: SEVERIDADE.AVISO,
        mensagem: `Arquivo inválido — ${resultado.motivo}`,
        tipo: 'importar',
      });
      return;
    }

    const confirmado = window.confirm(
      'Importar este arquivo substitui toda a coleção atual e não pode ser desfeito. Continuar?',
    );
    if (!confirmado) return;

    ajustesRef.current += 1;
    gravacaoAgregada.descartarPendencias();
    setContagens(resultado.contagens);
    setHistorico([]);

    if (resultado.descartadas > 0) {
      emitirAviso({
        severidade: SEVERIDADE.AVISO,
        mensagem: `${resultado.descartadas} figurinha(s) do arquivo não existem no catálogo atual e foram descartadas`,
        tipo: 'importar',
      });
    }

    const escrita = await gravarImportacao(uid, resultado.contagens, {
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'importar',
        });
      },
    });

    if (escrita.status === 'erro') {
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: 'Falha ao gravar a importação — toque para detalhes',
        detalhe: mensagemDeErro(escrita.erro),
        tipo: 'importar',
      });
      return;
    }

    setAtualizadoEm(formatarCarimbo(escrita.atualizadoEm));
    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção importada', tipo: 'importar' });
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
        onCopiarFaltantes={handleCopiarFaltantes}
        onCopiarRepetidas={handleCopiarRepetidas}
        onExportar={handleExportar}
        onImportar={handleImportar}
      />
      <input
        ref={arquivoImportacaoRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleArquivoEscolhido}
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
