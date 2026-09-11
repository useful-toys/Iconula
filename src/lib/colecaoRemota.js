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
