// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { figurinhas, secoes } from "./data/catalogo.js";
import { ordenarPorSigla, ordenarPorPagina, extrairSecoes } from "./data/catalogoOrdenacoes.js";
import TelaDeLogin from "./components/TelaDeLogin.jsx";
import Atestacao from "./components/Atestacao.jsx";
import PoliticaDePrivacidade from "./components/PoliticaDePrivacidade.jsx";
import TermosDeUso from "./components/TermosDeUso.jsx";
import Sobre from "./components/Sobre.jsx";
import ContaApagada from "./components/ContaApagada.jsx";
import { Cabecalho } from "./components/Cabecalho.jsx";
import { Controles } from "./components/Controles.jsx";
import { MenuDeAcoes } from "./components/MenuDeAcoes.jsx";
import { MenuDeCompartilhar } from "./components/MenuDeCompartilhar.jsx";
import { Catalogo } from "./components/Catalogo.jsx";
import { Avisos } from "./components/Avisos.jsx";
import { Rodape } from "./components/Rodape.jsx";
import { CatalogoCompartilhado } from "./components/CatalogoCompartilhado.jsx";
import { auth, app, deleteUserAccount, reauthenticateWithGoogle } from "./lib/firebase";
import { ajustarContagem, obterContagem } from "./lib/colecao.js";
import { registrarAjuste, retirarUltimoAjuste } from "./lib/historico.js";
import { calcularPlacar } from "./lib/progresso.js";
import { lerPreferenciasDeVista, gravarPreferenciasDeVista } from "./lib/preferenciasDeVista.js";
import {
  apagarColecao,
  carregarColecao,
  gravarAlteracoes,
  gravarAceite,
  gravarImportacao,
  gravarLinkAtivo,
  formatarCarimbo,
  mensagemDeErro,
} from "./lib/colecaoRemota.js";
import { VERSAO_TERMOS, VERSAO_POLITICA } from "./lib/versoesDosTextos.js";
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

// Códigos de cada seção, agrupados uma única vez a partir do catálogo estático
// (Tarefa 0019-0002): alimenta o progresso por seção mostrado no tooltip da
// faixa de bandeiras. O catálogo nunca muda em execução, então o agrupamento
// mora fora do componente.
const codigosPorSecao = (() => {
  const mapa = new Map();
  for (const figurinha of figurinhas) {
    const lista = mapa.get(figurinha.secao) ?? [];
    lista.push(figurinha.codigo);
    mapa.set(figurinha.secao, lista);
  }
  return mapa;
})();

// Primeiro endereço próprio do produto (IDR 0055, TDR 0020): `/catalogo/<uid>`
// abre a vista somente leitura sem router. Só um único segmento não vazio
// identifica a coleção; `/catalogo/`, `/catalogo/<uid>/` e demais formatos sob
// `/catalogo/` caem na premissa conservadora — `{ uid: null }`, que a vista
// resolve como "não compartilhado" sem leitura. Caminho fora de `/catalogo/`
// devolve `null` e segue o fluxo normal (guarda de login).
const PREFIXO_CATALOGO = '/catalogo/';

// Aviso de sucesso ao trocar o filtro (Tarefa 0030-0005, IDR 0059).
const MENSAGENS_FILTRO = {
  todas: 'Mostrando todas',
  faltantes: 'Mostrando apenas as faltantes',
  coladas: 'Mostrando apenas as coladas',
  repetidas: 'Mostrando apenas as repetidas',
};
function extrairAlvoDoCatalogo(caminho) {
  if (typeof caminho !== 'string' || !caminho.startsWith(PREFIXO_CATALOGO)) {
    return null;
  }
  const resto = caminho.slice(PREFIXO_CATALOGO.length);
  const uid = resto.length > 0 && !resto.includes('/') ? resto : null;
  return { uid };
}

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
  // Versões dos textos aceitas pela conta (Tarefa 0032-0003, MDR 0009): vêm
  // da mesma carga da coleção e começam iguais às publicadas — otimista, como
  // `contagens` e `precisaAtestar`, para o reaceite não piscar antes de a
  // leitura resolver. A confirmação do aceite as repõe nas publicadas
  // (`handleConfirmarAceite`), o mesmo otimismo do IDR 0036.
  const [termosVersao, setTermosVersao] = useState(VERSAO_TERMOS);
  const [politicaVersao, setPoliticaVersao] = useState(VERSAO_POLITICA);
  // Estado do link do catálogo (Tarefa 0027-0004, IDR 0055): vem da mesma
  // carga da coleção (`linkAtivo`; ausente → desligado) e é o que a chave do
  // popup Compartilhar mostra. Conta nova nunca ligou, então começa
  // `false` — mesma premissa otimista de `contagens`.
  const [linkAtivo, setLinkAtivo] = useState(false);
  // Vista interna (TDR 0020, revisitado na Tarefa 0020-0003): política de
  // privacidade, termos de uso (IDR 0053), Sobre (IDR 0063) e a tela final da
  // exclusão `ContaApagada` (IDR 0060) — sem router. Estado único, checado antes de
  // qualquer outro ramo de retorno, para voltar sempre cair na tela que o
  // restante do estado já determinaria; um único valor impede duas vistas de
  // ficarem ligadas ao mesmo tempo.
  const [vistaInterna, setVistaInterna] = useState(null);
  // Alvo do link do catálogo (IDR 0055), lido uma vez na abertura: um objeto
  // `{ uid }` quando o caminho é `/catalogo/<uid>` (com `uid: null` nos
  // formatos malformados) ou `null` em qualquer outro caminho. A vista do
  // link não usa a sessão nem a coleção do visitante — por isso também
  // suprime a carga e a gravação de preferências abaixo.
  const [alvoDoCatalogo] = useState(() =>
    extrairAlvoDoCatalogo(window.location.pathname),
  );
  // Preferências de vista lidas uma vez na abertura (IDR 0026). Sem
  // preferência guardada, o par (ordenação, disposição) inicial depende da
  // faixa de tela no instante da abertura (IDR 0043) — `window.innerWidth`
  // só é lido aqui, na inicialização preguiçosa; redimensionar depois não
  // recalcula nem troca a escolha da sessão em andamento.
  const [inicial] = useState(() => lerPreferenciasDeVista(window.innerWidth));
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
      // Sair da conta descarta o estado do link (Tarefa 0027-0004): ele é da
      // conta que acabou de sair, e a próxima sessão traz o seu próprio da
      // carga — o popup não pode mostrar o estado de outra conta enquanto a
      // leitura dela não chega.
      if (!novoUsuario) setLinkAtivo(false);
    });
  }, []);

  const uid = user?.uid ?? null;

  // Carga da coleção no login: uma leitura de `users/{uid}`, disparada pelo uid
  // (não pelo objeto `user`, que muda a cada refresh de token — ADR 0007).
  useEffect(() => {
    if (!uid || !app || alvoDoCatalogo) return;

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
        setTermosVersao(resultado.termosVersao ?? null);
        setPoliticaVersao(resultado.politicaVersao ?? null);
        setLinkAtivo(resultado.linkAtivo === true);
        // Documento ainda com `teamName` da era do botão: a próxima gravação
        // agregada o apaga junto das contagens, sem escrita à parte (ADR 0008,
        // Tarefa 0007-0004).
        if (resultado.temTeamName) {
          gravacaoAgregada.marcarTeamNameParaApagar(uid);
        }
      } else {
        // Documento inexistente ("vazio"): primeiro login desta conta, que
        // nunca atestou e nunca ligou o link — sem versão nenhuma aceita.
        setContagens({});
        setAtualizadoEm('—');
        setPrecisaAtestar(true);
        setTermosVersao(null);
        setPoliticaVersao(null);
        setLinkAtivo(false);
      }
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Coleção carregada', tipo: 'carga' });
    });

    return () => {
      cancelado = true;
    };
  }, [uid, gravacaoAgregada, alvoDoCatalogo]);

  // Confirmar o aceite (Tarefa 0008-0003, IDR 0036; reaceite na Tarefa
  // 0032-0003, IDR 0062): grava e libera o app de qualquer jeito, mesmo em
  // falha — o ato já foi praticado pelo usuário, e a falha de rede não deve
  // retê-lo. A falha só avisa; o campo segue ausente no documento e o passo
  // é tentado de novo na próxima carga. `atestar` só é verdadeiro no
  // primeiro acesso, quando a atestação de idade acompanha (Tarefa
  // 0032-0002); no reaceite ela já está registrada e não se repete. As
  // versões locais vão para as publicadas para o reaceite não reabrir já
  // nesta sessão; se a escrita falhou, a próxima leitura as traz de volta
  // atrás e o passo reaparece.
  async function handleConfirmarAceite(atestar) {
    const resultado = await gravarAceite(uid, { atestar });
    if (resultado.status !== 'sucesso') {
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: atestar
          ? 'Falha ao gravar a atestação — toque para detalhes'
          : 'Falha ao gravar o aceite — toque para detalhes',
        detalhe: mensagemDeErro(resultado.erro),
        tipo: 'atestacao',
      });
    }
    setPrecisaAtestar(false);
    setTermosVersao(VERSAO_TERMOS);
    setPoliticaVersao(VERSAO_POLITICA);
  }

  // Ligar/desligar o link do catálogo (Tarefa 0027-0004, IDR 0055): a chave
  // do popup Compartilhar grava na hora, fora da gravação agregada — não é
  // contagem e não move o `updatedAt` (MDR 0002). Otimista: muda o estado já
  // no toque e volta ao anterior se a escrita falhar, com aviso de falha
  // (IDR 0029). Ligar passa pelo passo informativo do popup (Tarefa
  // 0032-0006); desligar é imediato, sem confirmação, porque é reversível
  // (IDR 0010). Sem rede, a espera das escritas (TDR 0019) avisa e o desfecho
  // real ainda chega.
  async function handleAlternarLink() {
    if (!uid) return;
    const anterior = linkAtivo;
    const proximo = !anterior;
    setLinkAtivo(proximo);

    const resultado = await gravarLinkAtivo(uid, proximo, {
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'link',
        });
      },
    });

    if (resultado.status !== 'sucesso') {
      setLinkAtivo(anterior);
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: proximo
          ? 'Falha ao ligar o link — toque para detalhes'
          : 'Falha ao desligar o link — toque para detalhes',
        detalhe: mensagemDeErro(resultado.erro),
        tipo: 'link',
      });
      return;
    }

    emitirAviso({
      severidade: SEVERIDADE.SUCESSO,
      mensagem: proximo ? 'Link ligado' : 'Link desligado',
      tipo: 'link',
    });
  }

  // Grava a preferência ao trocar alternador — a preferência é o próprio
  // último uso (IDR 0026). O colapso de seções não persiste (IDR 0020). Na
  // vista do link o efeito não grava: ela lê as preferências, mas as trocas
  // valem só enquanto a vista está aberta — olhar o catálogo de outro não
  // muda as próprias preferências (IDR 0055).
  const primeiraRender = useRef(true);
  useEffect(() => {
    if (alvoDoCatalogo) return;
    if (primeiraRender.current) {
      primeiraRender.current = false;
      return;
    }
    gravarPreferenciasDeVista({ ordenacao, disposicao, filtro });
  }, [ordenacao, disposicao, filtro, alvoDoCatalogo]);

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

  // Apagar meus dados (Tarefa 0031-0003, IDR 0060, TDR 0027): a ordem é fixa
  // e cada passo depende do anterior. 1) As pendências da gravação agregada
  // morrem primeiro — o debounce ou o `pagehide` recriariam o documento
  // recém-apagado (único ponto do fluxo capaz de desfazer a exclusão
  // sozinho). 2) O documento sai antes da conta — sem ID token as regras
  // negariam a exclusão; apagar `users/{uid}` exige só um token válido, sem
  // popup. 3) A conta do Auth fecha o fluxo, porque nome, e-mail e foto
  // vivem nela, não no Firestore. A reautenticação por popup só acontece se
  // `deleteUser` devolver `auth/requires-recent-login` (login antigo); no
  // caso comum não aparece popup nenhum.
  // Devolve `{ status: 'sucesso' | 'falha' }` para a política decidir o que
  // mostrar; os avisos de falha saem daqui.
  async function handleApagarDados() {
    gravacaoAgregada.descartarPendencias();

    const apagou = await apagarColecao(uid, {
      aoEsperar: () => {
        emitirAviso({
          severidade: SEVERIDADE.AVISO,
          mensagem: 'Conexão instável — sincronizando quando possível',
          tipo: 'apagar',
        });
      },
    });

    // Falha no documento aborta antes de tocar a conta: melhor uma coleção
    // que não foi apagada do que uma conta órfã sem o dado pessoal. Nenhuma
    // reautenticação acontece antes disso.
    if (apagou.status !== 'sucesso') {
      emitirAviso({
        severidade: SEVERIDADE.FALHA,
        mensagem: 'Falha ao apagar — toque para detalhes',
        detalhe: mensagemDeErro(apagou.erro),
        tipo: 'apagar',
      });
      return { status: 'falha' };
    }

    try {
      await apagarConta();
    } catch {
      // Documento já apagado e conta de login ainda de pé — erro direto,
      // popup fechado/cancelado ou falha na reautenticação: aviso dourado
      // (nada quebrou por completo) e `signOut` — a política continua
      // montada e mostra a tela de contato, já sem a conta.
      emitirAviso({
        severidade: SEVERIDADE.AVISO,
        mensagem: 'Coleção apagada, mas a conta de login permanece',
        tipo: 'apagar',
      });
      await signOut(auth);
      return { status: 'falha' };
    }

    // Sucesso: nada da conta apagada pode sobreviver no estado local, que
    // alimenta a tela principal se a sessão for restaurada. A vista troca
    // para a tela dedicada `ContaApagada`, montada antes da guarda de login
    // (TDR 0020), então o estado final sobrevive ao fim da sessão (IDR 0060).
    setContagens({});
    setAtualizadoEm('—');
    setHistorico([]);
    setPrecisaAtestar(false);
    setLinkAtivo(false);
    setVistaInterna('contaApagada');

    return { status: 'sucesso' };
  }

  // Apaga a conta do Auth, reautenticando por popup só quando o `deleteUser`
  // exige login recente (`auth/requires-recent-login`, TDR 0027). Qualquer
  // falha final propaga — o chamador já apagou o documento e decide o aviso
  // de falha parcial.
  async function apagarConta() {
    try {
      await deleteUserAccount();
    } catch (erro) {
      if (erro?.code !== 'auth/requires-recent-login') throw erro;
      await reauthenticateWithGoogle();
      await deleteUserAccount();
    }
  }

  // Copia um texto para a área de transferência (Tarefa 0009-0003; mensagem
  // de sucesso parametrizada na Tarefa 0027-0005). Sucesso avisa a mensagem
  // (por padrão "Lista copiada"; o link do catálogo usa "Link copiado");
  // indisponível ou negada é aviso dourado, nunca falha (IDR 0029) — e o
  // texto não se perde: aparece num `window.prompt()` pronto para copiar
  // manualmente (IDR 0039).
  async function copiarParaAreaDeTransferencia(
    texto,
    tipo,
    mensagemSucesso = 'Lista copiada',
  ) {
    try {
      if (!navigator.clipboard) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(texto);
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: mensagemSucesso, tipo });
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

  // Compartilha um texto de troca pela folha do sistema (Tarefa 0021-0002,
  // IDR 0024): o usuário escolhe o app; só `text` vai na chamada, porque o
  // texto já traz o cabeçalho da lista e um `title` o duplicaria em apps que
  // juntam os dois campos. Fechar a folha sem escolher (`AbortError`) não
  // avisa; outra rejeição cai na cópia, com o mesmo texto e a reserva do
  // IDR 0039 — nunca é falha vermelha (IDR 0029). A chamada acontece no
  // gesto do clique, antes de qualquer espera, como a API exige.
  async function compartilharLista(texto, tipo) {
    try {
      await navigator.share({ text: texto });
      emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: 'Lista compartilhada', tipo });
    } catch (erro) {
      if (erro?.name === 'AbortError') return;
      copiarParaAreaDeTransferencia(texto, tipo);
    }
  }

  function handleCompartilharFaltantes() {
    const texto = gerarTextoFaltantes(contagens, secoesNaOrdemDoAlbum, figurinhas);
    compartilharLista(texto, 'compartilhar-faltantes');
  }

  function handleCompartilharRepetidas() {
    const texto = gerarTextoRepetidas(contagens, secoesNaOrdemDoAlbum, figurinhas);
    compartilharLista(texto, 'compartilhar-repetidas');
  }

  // Link único por conta (Tarefa 0027-0005, IDR 0055): a origem em que o app
  // está — produção, preview ou local — com o caminho que a vista do catálogo
  // lê sem login.
  function urlDoLinkDoCatalogo() {
    return `${window.location.origin}/catalogo/${uid}`;
  }

  // Copia só a URL do catálogo (IDR 0055): sucesso avisa "Link copiado"; sem
  // área de transferência, a reserva do IDR 0039 — como na cópia das listas.
  function handleCopiarLink() {
    copiarParaAreaDeTransferencia(urlDoLinkDoCatalogo(), 'copiar-link', 'Link copiado');
  }

  // Compartilha só a URL pela folha do sistema (IDR 0055): nada de `text` nem
  // `title`, porque apps que juntam os dois campos duplicariam o cabeçalho.
  // Fechar a folha sem escolher (`AbortError`) não avisa; outra rejeição cai na
  // cópia, com a reserva do IDR 0039 (IDR 0024, IDR 0029).
  async function handleCompartilharLink() {
    const url = urlDoLinkDoCatalogo();
    try {
      await navigator.share({ url });
      emitirAviso({
        severidade: SEVERIDADE.SUCESSO,
        mensagem: 'Link compartilhado',
        tipo: 'compartilhar-link',
      });
    } catch (erro) {
      if (erro?.name === 'AbortError') return;
      copiarParaAreaDeTransferencia(url, 'compartilhar-link', 'Link copiado');
    }
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

  // Feedback de confirmação na troca de ordenação/disposição/filtro (Tarefa
  // 0030-0005, IDR 0059): o rótulo virou ícone/glifo compacto, então o aviso
  // de sucesso (5s, fila já existente) devolve a explicação por extenso —
  // sobretudo no toque, onde não há tooltip (IDR 0048).
  function handleTrocarOrdenacao(novaOrdenacao) {
    setOrdenacao(novaOrdenacao);
    emitirAviso({
      severidade: SEVERIDADE.SUCESSO,
      mensagem:
        novaOrdenacao === 'pagina' ? 'Ordenado pela página do álbum' : 'Ordenado pelo código do país',
    });
  }

  function handleTrocarDisposicao(novaDisposicao) {
    setDisposicao(novaDisposicao);
    emitirAviso({
      severidade: SEVERIDADE.SUCESSO,
      mensagem: novaDisposicao === 'lista' ? 'Disposição em lista' : 'Disposição como no álbum',
    });
  }

  function handleTrocarFiltro(novoFiltro) {
    setFiltro(novoFiltro);
    emitirAviso({ severidade: SEVERIDADE.SUCESSO, mensagem: MENSAGENS_FILTRO[novoFiltro] });
  }

  // Calcula as seções na ordem vigente para a faixa de bandeiras
  const secoesOrdenadas = useMemo(() => {
    const estruturada = ordenacao === 'pagina' ? ordenarPorPagina(secoes) : ordenarPorSigla(secoes);
    return extrairSecoes(estruturada);
  }, [ordenacao]);

  const placar = calcularPlacar(contagens, codigosTodasFigurinhas);

  // Reaceite (Tarefa 0032-0003, IDR 0062): a versão aceita pela conta difere
  // da publicada — ou não existe (conta antiga, sem os campos). Comparação
  // com as constantes de `versoesDosTextos.js`, o lugar único das versões.
  const precisaReaceitar =
    termosVersao !== VERSAO_TERMOS || politicaVersao !== VERSAO_POLITICA;

  // Progresso por seção para o tooltip da faixa de bandeiras (Tarefa
  // 0019-0002, IDR 0052): recalculado só quando as contagens mudam. Enquanto
  // o tooltip está visível, ele lê daqui, então o texto acompanha a contagem
  // vigente sem estado próprio.
  const placarPorSecao = useMemo(() => {
    const mapa = new Map();
    for (const secao of secoes) {
      mapa.set(
        secao.sigla,
        calcularPlacar(contagens, codigosPorSecao.get(secao.sigla) ?? []),
      );
    }
    return mapa;
  }, [contagens]);

  // Vistas internas (TDR 0020): checadas antes de qualquer outro ramo —
  // fechar (`onVoltar`) apenas desliga o estado e devolve para a tela que os
  // ramos abaixo já mostrariam.
  if (vistaInterna === 'politica') {
    // A `Avisos` entra aqui porque o fluxo de apagar dados emite as falhas
    // parciais do TDR 0027 ainda nesta vista; sem ela, o aviso se perderia
    // (a tela de login também não a renderiza — IDR 0060). `podeApagar` vem
    // da sessão: sem usuário, a seção mostra só o canal de contato; o
    // sucesso troca a vista para a tela `ContaApagada` (IDR 0060).
    return (
      <>
        <PoliticaDePrivacidade
          onVoltar={() => setVistaInterna(null)}
          podeApagar={Boolean(user)}
          onApagar={handleApagarDados}
          onExportar={handleExportar}
        />
        <Avisos />
      </>
    );
  }

  if (vistaInterna === 'termos') {
    return <TermosDeUso onVoltar={() => setVistaInterna(null)} />;
  }

  if (vistaInterna === 'sobre') {
    return <Sobre onVoltar={() => setVistaInterna(null)} />;
  }

  // Tela final da exclusão (IDR 0060): checada antes da guarda de login,
  // como a política e os termos — a conta já foi apagada e a sessão zera;
  // sem esta ordem, a vista se perderia no fim do fluxo. `onVoltar` devolve
  // à tela de login, com o botão do Google, sem abrir popup automaticamente.
  if (vistaInterna === 'contaApagada') {
    return <ContaApagada onVoltar={() => setVistaInterna(null)} />;
  }

  // Vista do link do catálogo (IDR 0055): checada antes da guarda de login
  // porque abre sem sessão — inclusive para o próprio dono, que vê o mesmo
  // que o visitante. Sem router: o caminho foi lido em `alvoDoCatalogo` na
  // abertura (TDR 0020). A vista carrega o documento do dono por conta
  // própria e não toca a sessão nem a coleção deste componente.
  if (alvoDoCatalogo) {
    return (
      <CatalogoCompartilhado
        uid={alvoDoCatalogo.uid}
        onAbrirPolitica={() => setVistaInterna('politica')}
        onAbrirTermos={() => setVistaInterna('termos')}
        onAbrirSobre={() => setVistaInterna('sobre')}
      />
    );
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
            para usar o app (ver <code>docs/setup-firebase.md</code>).
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
    return (
      <TelaDeLogin
        onAbrirPolitica={() => setVistaInterna('politica')}
        onAbrirTermos={() => setVistaInterna('termos')}
        onAbrirSobre={() => setVistaInterna('sobre')}
      />
    );
  }

  // Primeiro acesso: falta a atestação de idade — o motivo com o texto de
  // hoje. Ordem antes do reaceite porque uma conta nova não tem nem
  // `atestadoEm` nem versão (IDR 0036, IDR 0062).
  if (precisaAtestar) {
    return (
      <Atestacao
        motivo="primeiro-acesso"
        onConfirmar={() => handleConfirmarAceite(true)}
        onAbrirPolitica={() => setVistaInterna('politica')}
        onAbrirTermos={() => setVistaInterna('termos')}
      />
    );
  }

  // Reaceite (IDR 0062): a conta já atestou, mas aceitou uma versão dos
  // textos que não é a publicada — inclusive quando não tem versão nenhuma
  // (conta antiga). Mesmo cartão, texto de atualização, sem a idade.
  if (precisaReaceitar) {
    return (
      <Atestacao
        motivo="atualizacao"
        onConfirmar={() => handleConfirmarAceite(false)}
        onAbrirPolitica={() => setVistaInterna('politica')}
        onAbrirTermos={() => setVistaInterna('termos')}
      />
    );
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
        ordenacao={ordenacao}
        onSaltar={handleSaltar}
        placarPorSecao={placarPorSecao}
        compartilhar={
          <MenuDeCompartilhar
            onCopiarFaltantes={handleCopiarFaltantes}
            onCopiarRepetidas={handleCopiarRepetidas}
            onCompartilharFaltantes={handleCompartilharFaltantes}
            onCompartilharRepetidas={handleCompartilharRepetidas}
            linkAtivo={linkAtivo}
            onAlternarLink={handleAlternarLink}
            onCopiarLink={handleCopiarLink}
            onCompartilharLink={handleCompartilharLink}
          />
        }
        avatar={
          <MenuDeAcoes
            onSignOut={handleSignOut}
            onExportar={handleExportar}
            onImportar={handleImportar}
            photoURL={user.photoURL}
            displayName={user.displayName}
          />
        }
      >
        <Controles
          ordenacao={ordenacao}
          onTrocarOrdenacao={handleTrocarOrdenacao}
          disposicao={disposicao}
          onTrocarDisposicao={handleTrocarDisposicao}
          filtro={filtro}
          onTrocarFiltro={handleTrocarFiltro}
          podeDesfazer={historico.length > 0}
          onDesfazer={handleDesfazer}
        />
      </Cabecalho>
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
      <Rodape
        onAbrirPolitica={() => setVistaInterna('politica')}
        onAbrirTermos={() => setVistaInterna('termos')}
        onAbrirSobre={() => setVistaInterna('sobre')}
      />
    </div>
  );
}
