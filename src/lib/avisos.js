// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Fila e ciclo de vida dos avisos flutuantes (IDR 0029, IDR 0017).
 *
 * Módulo sem React: guarda a fila de avisos em memória, aplica o limite de
 * empilhamento (IDR 0034), expira sucesso e aviso em 5s e mantém a falha até
 * ser dispensada ou até um sucesso do mesmo tipo a dispensar. Quem exibe é o
 * componente `Avisos` (via `useSyncExternalStore`); quem emite é a camada de
 * persistência e, na Fase 9, o menu de ações.
 */

export const SEVERIDADE = {
  SUCESSO: 'sucesso',
  AVISO: 'aviso',
  FALHA: 'falha',
};

const DURACAO_EFEMERO_MS = 5000;
const MAX_EMPILHADOS = 3;

let fila = [];
let proximoId = 1;
const ouvintes = new Set();

function notificar() {
  for (const ouvir of ouvintes) {
    ouvir();
  }
}

/**
 * Assina mudanças na fila. Devolve a função de cancelar a assinatura.
 *
 * @param {() => void} ouvir
 * @returns {() => void}
 */
export function assinarAvisos(ouvir) {
  ouvintes.add(ouvir);
  return () => {
    ouvintes.delete(ouvir);
  };
}

/**
 * Snapshot estável para `useSyncExternalStore`: a fila atual.
 *
 * @returns {Array<object>}
 */
export function obterAvisos() {
  return fila;
}

/**
 * Emite um aviso na fila.
 *
 * Sucesso e aviso expiram em 5s; a falha persiste. Emitir um sucesso dispensa
 * a falha do mesmo tipo que estiver na tela (IDR 0029). O empilhamento tem
 * limite: ao chegar à quarta faixa, a mais antiga sai (IDR 0034).
 *
 * @param {object} aviso
 * @param {'sucesso'|'aviso'|'falha'} aviso.severidade
 * @param {string} aviso.mensagem - texto de uma linha, na voz do usuário.
 * @param {string|null} [aviso.detalhe] - detalhe técnico, só na falha.
 * @param {string|null} [aviso.tipo] - tipo de operação ('carga' | 'gravacao'),
 *   usado para dispensar a falha no sucesso seguinte do mesmo tipo.
 */
export function emitirAviso({ severidade, mensagem, detalhe = null, tipo = null }) {
  const aviso = { id: proximoId, severidade, mensagem, detalhe, tipo };
  proximoId += 1;

  let nova = [...fila];
  if (severidade === SEVERIDADE.SUCESSO && tipo) {
    nova = nova.filter((a) => !(a.severidade === SEVERIDADE.FALHA && a.tipo === tipo));
  }
  nova.push(aviso);
  if (nova.length > MAX_EMPILHADOS) {
    nova = nova.slice(nova.length - MAX_EMPILHADOS);
  }
  fila = nova;
  notificar();

  if (severidade !== SEVERIDADE.FALHA) {
    setTimeout(() => {
      fila = fila.filter((a) => a.id !== aviso.id);
      notificar();
    }, DURACAO_EFEMERO_MS);
  }
}

/**
 * Dispensa um aviso específico — o `×` da ponta direita.
 *
 * @param {number} id
 */
export function dispensarAviso(id) {
  fila = fila.filter((aviso) => aviso.id !== id);
  notificar();
}

/**
 * Esvazia a fila — usado pelos testes para isolar cada caso.
 */
export function limparAvisos() {
  fila = [];
  notificar();
}
