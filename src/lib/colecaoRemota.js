// Copyright (c) 2026 Daniel Felix Ferber

import { app } from './firebase.js';
import { VERSAO_TERMOS, VERSAO_POLITICA } from './versoesDosTextos.js';

/**
 * Persistência da coleção no Cloud Firestore (ADR 0008).
 *
 * Este módulo é o **único** que toca o SDK do Firestore, carregado sob demanda
 * por `import()` dinâmico — `firebase.js` não o importa (ADR 0007). A coleção
 * vive em `users/{uid}` como mapa esparso; cada operação devolve um resultado
 * discriminado e **nunca lança**.
 */

const CAMINHO_DOCUMENTO = (uid) => ['users', uid].join('/');

// Chave reservada dentro do mapa `alteracoes` de `gravarAlteracoes` — nunca
// colide com um código de catálogo real (três letras + dois dígitos) — que
// sinaliza que esta mesma escrita deve apagar o `teamName` residual da era
// do botão (Tarefa 0007-0004, ADR 0008). O mesmo literal existe em
// `gravacaoAgregada.js`, que a define de novo em vez de importar daqui: as
// duas pontas do contrato ficam desacopladas, e `gravacaoAgregada.test.js`
// continua sem tocar em `firebase.js` (ver o comentário lá). Exportada só
// para os testes deste arquivo referenciarem o mesmo literal.
export const MARCA_APAGAR_TEAM_NAME = '__apagarTeamName';

// Política de erro (Tarefa 0007-0005, ADR 0008, IDR 0029): sem rede, a
// promessa do SDK nunca rejeita — fica pendente até o servidor responder.
// `comAvisoDeEspera` corre a operação contra um tempo-limite de ~5s: se ele
// vencer primeiro, chama `aoEsperar()` (não é falha, é espera) e devolve a
// mesma promessa, que resolve mais tarde com o desfecho real — sucesso ou
// erro, sempre que ele chegar.
const TIMEOUT_ESPERA_MS = 5000;
const ESPERA = Symbol('espera');

async function comAvisoDeEspera(promessa, aoEsperar) {
  if (!aoEsperar) return promessa;

  let idEspera;
  const timeout = new Promise((resolve) => {
    idEspera = setTimeout(() => resolve(ESPERA), TIMEOUT_ESPERA_MS);
  });

  const corrida = await Promise.race([promessa, timeout]);
  clearTimeout(idEspera);

  if (corrida === ESPERA) {
    aoEsperar();
    return promessa;
  }
  return corrida;
}

let dbPromise = null;

/**
 * Resolve a instância do Firestore com o cache local IndexedDB e o gerenciador
 * multi-aba obrigatório (ADR 0008). Memoizada: `initializeFirestore` só pode
 * ser chamado uma vez por app.
 */
function obterFirestore() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const {
        initializeFirestore,
        persistentLocalCache,
        persistentMultipleTabManager,
      } = await import('firebase/firestore');
      const db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
      // Ligado só pelos testes E2E (ADR 0010): nunca em dev normal, preview
      // ou produção, porque a variável nunca é definida fora desse ambiente.
      // `connectFirestoreEmulator` só é importado quando a variável está
      // definida, para não exigir o export do mock de `firebase/firestore`
      // nos testes unitários que não a definem.
      if (import.meta.env.VITE_USE_FIREBASE_EMULATOR) {
        const { connectFirestoreEmulator } = await import('firebase/firestore');
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      }
      return db;
    })();
  }
  return dbPromise;
}

/**
 * Reduz um erro qualquer a uma mensagem legível para o detalhe técnico do
 * aviso de falha. Nunca inclui uid nem conteúdo da coleção (ADR 0007).
 *
 * @param {unknown} erro
 * @returns {string}
 */
export function mensagemDeErro(erro) {
  if (!erro) return 'erro desconhecido';
  if (typeof erro === 'string') return erro;
  return erro.message ?? erro.code ?? String(erro);
}

/**
 * Formata o carimbo do documento para o relógio do título (IDR 0027).
 *
 * Hora sozinha no mesmo dia; data curta junto quando não for de hoje — forma
 * `dd/mm/aa HH:mm`, sem segundos (TDR 0016). Sem carimbo, travessão.
 *
 * @param {Date|null} data
 * @param {Date} [agora] - instante de referência para "mesmo dia" (testável).
 * @returns {string}
 */
export function formatarCarimbo(data, agora = new Date()) {
  if (!data) return '—';

  const hh = String(data.getHours()).padStart(2, '0');
  const mm = String(data.getMinutes()).padStart(2, '0');

  const mesmoDia =
    data.getFullYear() === agora.getFullYear() &&
    data.getMonth() === agora.getMonth() &&
    data.getDate() === agora.getDate();

  if (mesmoDia) return `${hh}:${mm}`;

  const dd = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const aa = String(data.getFullYear()).slice(-2);
  return `${dd}/${mes}/${aa} ${hh}:${mm}`;
}

/**
 * Carrega a coleção do usuário — uma única leitura de `users/{uid}`.
 *
 * Devolve um resultado discriminado e nunca lança:
 * - `encontrado` — documento existe; traz `contagens`, `atualizadoEm` (Date),
 *   `temTeamName` (marca da era do botão, usada pela Tarefa 0007-0004),
 *   `atestadoEm` (booleano: se a conta já atestou — Tarefa 0008-0003),
 *   `linkAtivo` (booleano: campo ausente → `false` — Tarefa 0027-0004),
 *   `termosVersao` e `politicaVersao` (string com a data de vigência aceita,
 *   ou `null` quando o campo está ausente — Tarefa 0032-0002); tudo da mesma
 *   leitura, sem gastar requisição extra, já que este é o mesmo documento.
 * - `vazio` — documento não existe; fluxo normal do primeiro login, não é erro.
 * - `erro` — leitura falhou; traz `erro` para o detalhe técnico.
 * - `indisponivel` — Firebase não configurado (`app === null`).
 *
 * Sem rede, a leitura não falha nem confirma: fica pendente. Se `aoEsperar`
 * for passado e ~5s se passarem sem resposta, ele é chamado (espera, não
 * falha) e a função continua aguardando o desfecho real, que ainda chega
 * mais tarde no mesmo resultado devolvido (Tarefa 0007-0005, ADR 0008).
 *
 * @param {string} uid
 * @param {object} [opcoes]
 * @param {() => void} [opcoes.aoEsperar] - chamado se a leitura ultrapassar
 *   ~5s sem resolver.
 * @returns {Promise<object>}
 */
export async function carregarColecao(uid, { aoEsperar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const promessa = (async () => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const db = await obterFirestore();
      const ref = doc(db, CAMINHO_DOCUMENTO(uid));
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        return { status: 'vazio' };
      }

      const dados = snapshot.data();
      return {
        status: 'encontrado',
        contagens: dados.contagens ?? {},
        atualizadoEm: dados.updatedAt?.toDate?.() ?? null,
        temTeamName: Object.prototype.hasOwnProperty.call(dados, 'teamName'),
        atestadoEm: Boolean(dados.atestadoEm),
        linkAtivo: dados.linkAtivo === true,
        termosVersao: dados.termosVersao ?? null,
        politicaVersao: dados.politicaVersao ?? null,
      };
    } catch (erro) {
      return { status: 'erro', erro };
    }
  })();

  return comAvisoDeEspera(promessa, aoEsperar);
}

/**
 * Lê a coleção do dono para a vista do catálogo compartilhado por link
 * (IDR 0055) — a primeira leitura sem sessão do produto.
 *
 * Uma única leitura de `users/{uid}`, sem exigir `request.auth` (as regras
 * liberam o `get` enquanto `linkAtivo == true` — MDR 0002). Mesmo contrato
 * discriminado e mesmo aviso de espera de `carregarColecao`; nunca lança:
 * - `compartilhado` — documento existe e `linkAtivo == true`; traz
 *   `contagens` e `atualizadoEm` (Date). O `linkAtivo` é conferido mesmo
 *   quando quem lê é o próprio dono, para que ele veja exatamente o que o
 *   visitante veria (IDR 0055); `atestadoEm` **não** é exposto ao chamador.
 * - `nao-compartilhado` — link desligado (campo ausente ou `false`) ou
 *   documento inexistente. As regras negam os dois do mesmo jeito
 *   (`permission-denied`), e a vista não revela se a conta existe — por isso
 *   a negação cai aqui, junto do documento ausente.
 * - `erro` — leitura falhou por outro motivo; traz `erro` para o detalhe
 *   técnico.
 * - `indisponivel` — Firebase não configurado (`app === null`).
 *
 * @param {string} uid
 * @param {object} [opcoes]
 * @param {() => void} [opcoes.aoEsperar] - chamado se a leitura ultrapassar
 *   ~5s sem resolver.
 * @returns {Promise<object>}
 */
export async function carregarCatalogoCompartilhado(uid, { aoEsperar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const promessa = (async () => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const db = await obterFirestore();
      const ref = doc(db, CAMINHO_DOCUMENTO(uid));
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        return { status: 'nao-compartilhado' };
      }

      const dados = snapshot.data();
      if (dados.linkAtivo !== true) {
        return { status: 'nao-compartilhado' };
      }

      return {
        status: 'compartilhado',
        contagens: dados.contagens ?? {},
        atualizadoEm: dados.updatedAt?.toDate?.() ?? null,
      };
    } catch (erro) {
      if (erro?.code === 'permission-denied') {
        return { status: 'nao-compartilhado' };
      }
      return { status: 'erro', erro };
    }
  })();

  return comAvisoDeEspera(promessa, aoEsperar);
}

/**
 * Grava as chaves alteradas da coleção numa única escrita (ADR 0008, IDR 0003).
 *
 * `alteracoes` é um mapa código → valor absoluto (contagem ≥ 1) ou `0` para
 * indicar que a chave chegou a zero e deve ser apagada do mapa (`deleteField`).
 * A chave reservada `MARCA_APAGAR_TEAM_NAME`, se presente e verdadeira, soma
 * `teamName: deleteField()` à mesma escrita — a migração da Tarefa 0007-0004,
 * que não pode virar uma escrita à parte (ADR 0008).
 *
 * Usa `setDoc(..., { merge: true })`, não `updateDoc`: a mesma chamada cria o
 * documento na primeira gravação da conta — as regras permitem `create` e
 * `update` igualmente — sem leitura extra só para descobrir se ele já existe
 * (TDR 0017). `deleteField()` funciona dentro do mapa aninhado tanto com
 * `update()` quanto com `set(..., { merge: true })`.
 *
 * Nunca lança: devolve um resultado discriminado.
 * - `sucesso` — escrita confirmada pelo servidor; `atualizadoEm` é o instante
 *   local do cliente no momento da confirmação, aproximação do carimbo do
 *   servidor sem gastar uma leitura extra (TDR 0017).
 * - `erro` — a escrita falhou; traz `erro` para o detalhe técnico.
 * - `indisponivel` — Firebase não configurado (`app === null`).
 *
 * @param {string} uid
 * @param {Record<string, number|boolean>} alteracoes
 * @returns {Promise<object>}
 */
export async function gravarAlteracoes(uid, alteracoes) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const apagarTeamName = Boolean(alteracoes[MARCA_APAGAR_TEAM_NAME]);
  const chaves = Object.entries(alteracoes).filter(
    ([codigo]) => codigo !== MARCA_APAGAR_TEAM_NAME,
  );

  if (chaves.length === 0 && !apagarTeamName) {
    return { status: 'sucesso', atualizadoEm: new Date() };
  }

  try {
    const { doc, setDoc, deleteField, serverTimestamp } = await import('firebase/firestore');
    const db = await obterFirestore();
    const ref = doc(db, CAMINHO_DOCUMENTO(uid));

    const dados = { updatedAt: serverTimestamp() };
    if (chaves.length > 0) {
      const contagens = {};
      for (const [codigo, valor] of chaves) {
        contagens[codigo] = valor > 0 ? valor : deleteField();
      }
      dados.contagens = contagens;
    }
    if (apagarTeamName) {
      dados.teamName = deleteField();
    }

    await setDoc(ref, dados, { merge: true });

    return { status: 'sucesso', atualizadoEm: new Date() };
  } catch (erro) {
    return { status: 'erro', erro };
  }
}

/**
 * Substitui a coleção inteira pela importação (Tarefa 0009-0005): a única
 * função deste módulo que **não** faz merge por chave — `mergeFields:
 * ['contagens', 'updatedAt']` troca o mapa `contagens` inteiro pelo
 * recebido (ao contrário de `gravarAlteracoes`, que só toca as chaves
 * presentes em `alteracoes` e preserva as demais); `atestadoEm` fica de
 * fora da lista e continua intocado. É por isso que a importação precisa
 * desta função à parte, em vez de reaproveitar `gravarAlteracoes`: expressar
 * "substituir tudo" como uma lista de chaves alteradas exigiria comparar
 * com o estado anterior e gerar `deleteField()` para cada uma que não
 * está mais no arquivo — mais uma fonte de bug para o mesmo resultado.
 *
 * `contagens` já deve chegar normalizado (`portabilidade.js`
 * `validarImportacao`): sem zeros, sem chave fora do catálogo, valores
 * 1–99. Esta função não valida nada — só grava o que recebe.
 *
 * Sem rede, a escrita não falha nem confirma — mesma política de espera de
 * `carregarColecao` (Tarefa 0007-0005, ADR 0008), via `comAvisoDeEspera`.
 *
 * Nunca lança: devolve um resultado discriminado, como as demais funções
 * deste módulo (`sucesso`, `erro` ou `indisponivel`).
 *
 * @param {string} uid
 * @param {Record<string, number>} contagens - mapa completo e já normalizado.
 * @param {object} [opcoes]
 * @param {() => void} [opcoes.aoEsperar] - chamado se a escrita ultrapassar
 *   ~5s sem resolver.
 * @returns {Promise<object>}
 */
export async function gravarImportacao(uid, contagens, { aoEsperar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const promessa = (async () => {
    try {
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const db = await obterFirestore();
      const ref = doc(db, CAMINHO_DOCUMENTO(uid));

      await setDoc(
        ref,
        { contagens, updatedAt: serverTimestamp() },
        { mergeFields: ['contagens', 'updatedAt'] },
      );

      return { status: 'sucesso', atualizadoEm: new Date() };
    } catch (erro) {
      return { status: 'erro', erro };
    }
  })();

  return comAvisoDeEspera(promessa, aoEsperar);
}

/**
 * Grava o aceite dos textos de conformidade — a atestação de menores (LGPD
 * art. 14, Tarefa 0008-0003) e/ou o registro de qual versão a conta aceitou,
 * com o instante (MDR 0009, Tarefa 0032-0002).
 *
 * Numa escrita só, com `setDoc(..., { merge: true })`:
 * - `termosVersao` e `politicaVersao` recebem as datas de vigência publicadas
 *   (`versoesDosTextos.js`) — o que prova **qual texto** a conta aceitou;
 * - `aceitoEm` recebe `serverTimestamp()`;
 * - `atestadoEm` só acompanha quando `atestar` for verdadeiro (o primeiro
 *   acesso, com a atestação de idade). No reaceite, a atestação já está
 *   registrada e não se repete (IDR 0062).
 *
 * Deliberadamente **não** inclui `updatedAt`: o carimbo da coleção continua
 * significando só "alteração de contagens" (ADR 0008), e o relógio do título
 * não se move com o aceite (IDR 0027) — por isso esta função não reaproveita
 * `gravarAlteracoes`, que sempre grava `updatedAt`.
 *
 * `merge: true`, como `gravarAlteracoes`: a mesma chamada cria o documento se
 * ele ainda não existir (regras aceitam `create` e `update` igualmente —
 * TDR 0009, guarda de campo ausente) sem leitura extra para descobrir se ele
 * já existe (TDR 0017).
 *
 * Nunca lança: devolve um resultado discriminado (`sucesso`, `erro` ou
 * `indisponivel`, como as demais funções deste módulo). Em falha, quem chama
 * decide a política (Tarefa 0008-0003: libera o app assim mesmo — o campo
 * simplesmente segue ausente no documento, e a próxima vez que esta conta
 * logar sem o aceite tenta gravar de novo).
 *
 * @param {string} uid
 * @param {object} [opcoes]
 * @param {boolean} [opcoes.atestar] - inclui `atestadoEm` na escrita (primeiro
 *   acesso); ausente/falso grava só o aceite das versões.
 * @returns {Promise<object>}
 */
export async function gravarAceite(uid, { atestar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const db = await obterFirestore();
    const ref = doc(db, CAMINHO_DOCUMENTO(uid));

    const dados = {
      termosVersao: VERSAO_TERMOS,
      politicaVersao: VERSAO_POLITICA,
      aceitoEm: serverTimestamp(),
    };
    if (atestar) {
      dados.atestadoEm = serverTimestamp();
    }

    await setDoc(ref, dados, { merge: true });

    return { status: 'sucesso' };
  } catch (erro) {
    return { status: 'erro', erro };
  }
}

/**
 * Liga ou desliga o catálogo compartilhado por link (IDR 0055, Tarefa
 * 0027-0004) — uma escrita pontual, na hora em que o dono toca a chave, fora
 * da gravação agregada (IDR 0024).
 *
 * Grava só `linkAtivo`, com `setDoc(..., { merge: true })`, sem `updatedAt`
 * junto: o carimbo da coleção continua significando só alteração de
 * contagens (MDR 0002), e o relógio do título não se move ao ligar ou
 * desligar o link (IDR 0027). Como `gravarAceite`, cria o documento se ele
 * ainda não existir, sem leitura extra (TDR 0017); as regras aceitam
 * `linkAtivo` booleano nos dois sentidos (Tarefa 0027-0001), e desligar
 * gravando `false` revoga a leitura pública — a chave é o campo, não a
 * ausência dele.
 *
 * Sem rede, a escrita não falha nem confirma — mesma política de espera das
 * demais escritas (TDR 0019), via `comAvisoDeEspera`.
 *
 * Nunca lança: devolve um resultado discriminado (`sucesso`, `erro` ou
 * `indisponivel`, como as demais funções deste módulo).
 *
 * @param {string} uid
 * @param {boolean} ativo - novo estado do link.
 * @param {object} [opcoes]
 * @param {() => void} [opcoes.aoEsperar] - chamado se a escrita ultrapassar
 *   ~5s sem resolver.
 * @returns {Promise<object>}
 */
export async function gravarLinkAtivo(uid, ativo, { aoEsperar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const promessa = (async () => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const db = await obterFirestore();
      const ref = doc(db, CAMINHO_DOCUMENTO(uid));

      await setDoc(ref, { linkAtivo: Boolean(ativo) }, { merge: true });

      return { status: 'sucesso' };
    } catch (erro) {
      return { status: 'erro', erro };
    }
  })();

  return comAvisoDeEspera(promessa, aoEsperar);
}

/**
 * Apaga o documento `users/{uid}` — o direito de eliminação (LGPD art. 18,
 * VI), na ordem do TDR 0027, em que o documento sai antes da conta do Auth
 * e depois da reautenticação. Não grava `updatedAt` nem nada: apaga o
 * documento inteiro, `linkAtivo` e `contagens` incluídos.
 *
 * As regras autorizam o `delete` só ao dono autenticado e o link ativo
 * libera `get`, nunca `delete` (Tarefa 0031-0001), então a chamada exige a
 * sessão viva — quem chama garante isso antes (Tarefa 0031-0003).
 *
 * Sem rede, a exclusão não falha nem confirma — mesma política de espera
 * das demais operações (TDR 0019), via `comAvisoDeEspera`.
 *
 * Nunca lança: devolve um resultado discriminado (`sucesso`, `erro` ou
 * `indisponivel`, como as demais funções deste módulo).
 *
 * @param {string} uid
 * @param {object} [opcoes]
 * @param {() => void} [opcoes.aoEsperar] - chamado se a exclusão ultrapassar
 *   ~5s sem resolver.
 * @returns {Promise<object>}
 */
export async function apagarColecao(uid, { aoEsperar } = {}) {
  if (!app) {
    return { status: 'indisponivel' };
  }

  const promessa = (async () => {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const db = await obterFirestore();
      const ref = doc(db, CAMINHO_DOCUMENTO(uid));

      await deleteDoc(ref);

      return { status: 'sucesso' };
    } catch (erro) {
      return { status: 'erro', erro };
    }
  })();

  return comAvisoDeEspera(promessa, aoEsperar);
}
