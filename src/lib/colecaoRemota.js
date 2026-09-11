// Copyright (c) 2026 Daniel Felix Ferber

import { app } from './firebase.js';

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
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
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
 * - `encontrado` — documento existe; traz `contagens`, `atualizadoEm` (Date) e
 *   `temTeamName` (marca da era do botão, usada pela Tarefa 0007-0004).
 * - `vazio` — documento não existe; fluxo normal do primeiro login, não é erro.
 * - `erro` — leitura falhou; traz `erro` para o detalhe técnico.
 * - `indisponivel` — Firebase não configurado (`app === null`).
 *
 * @param {string} uid
 * @returns {Promise<object>}
 */
export async function carregarColecao(uid) {
  if (!app) {
    return { status: 'indisponivel' };
  }

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
    };
  } catch (erro) {
    return { status: 'erro', erro };
  }
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
