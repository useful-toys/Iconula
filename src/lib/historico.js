// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Histórico de desfazer: pilha das últimas 10 alterações de contagem, em
 * memória (IDR 0010, IDR 0012). Cada entrada guarda o código da figurinha e
 * a contagem *anterior* ao ajuste — não a contagem nova, nem o delta
 * aplicado —, o bastante para reverter sem precisar saber se o ajuste foi
 * incremento ou decremento.
 *
 * Funções puras sobre um array imutável, no mesmo estilo de `colecao.js`:
 * quem chama guarda o array (App.jsx, em `useState`) e decide quando
 * descartá-lo — inclusive ao zerar pela importação futura (Tarefa
 * 0009-0005).
 */

const LIMITE = 10;

/**
 * Empilha uma alteração no topo do histórico. Ao exceder o limite de 10,
 * descarta a entrada mais antiga (a base da pilha) — o histórico nunca
 * cresce além disso.
 *
 * @param {Array<{codigo: string, contagemAnterior: number}>} historico
 * @param {string} codigo
 * @param {number} contagemAnterior - contagem da figurinha antes do ajuste.
 * @returns {Array<{codigo: string, contagemAnterior: number}>} novo histórico.
 */
export function registrarAjuste(historico, codigo, contagemAnterior) {
  const novo = [...historico, { codigo, contagemAnterior }];
  return novo.length > LIMITE ? novo.slice(novo.length - LIMITE) : novo;
}

/**
 * Retira do topo a entrada mais recente do histórico, para reverter — ordem
 * inversa às alterações (IDR 0012). Histórico vazio devolve `entrada: null`
 * e o próprio histórico de volta, sem erro: quem chama decide não fazer
 * nada (o botão de desfazer já fica desabilitado nesse caso).
 *
 * @param {Array<{codigo: string, contagemAnterior: number}>} historico
 * @returns {{entrada: {codigo: string, contagemAnterior: number}|null, restante: Array<{codigo: string, contagemAnterior: number}>}}
 */
export function retirarUltimoAjuste(historico) {
  if (historico.length === 0) return { entrada: null, restante: historico };
  return {
    entrada: historico[historico.length - 1],
    restante: historico.slice(0, -1),
  };
}
