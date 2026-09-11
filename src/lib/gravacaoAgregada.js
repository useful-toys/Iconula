// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Acúmulo, debounce, teto de espera e flush da gravação agregada (ADR 0008,
 * IDR 0003).
 *
 * Módulo sem React: acumula as chaves alteradas desde a última gravação e
 * agenda uma única escrita por rajada — debounce de ~2s após o último
 * ajuste, com teto de ~10s em atividade contínua (números aceitos como estão
 * no ADR 0008; ver o log desta tarefa). Expõe `flush()` para a gravação
 * imediata, usada em `pagehide`/`visibilitychange` e antes do `signOut`
 * (fiação com o navegador e com o Firebase Auth fica em `App.jsx`). A função
 * de gravação (`gravar`) é injetada para manter este módulo testável com
 * temporizador falso, sem tocar o SDK do Firestore.
 */

const DEBOUNCE_MS = 2000;
const TETO_MS = 10000;

/**
 * @param {object} opcoes
 * @param {(uid: string, alteracoes: Record<string, number>) => Promise<object>} opcoes.gravar
 *   - grava as chaves alteradas; nunca deve lançar (resultado discriminado,
 *   como `gravarAlteracoes` de `colecaoRemota.js`).
 * @param {(resultado: object) => void} [opcoes.aoConcluir] - chamado após
 *   uma gravação bem-sucedida, com o resultado de `gravar`.
 * @param {(resultado: object) => void} [opcoes.aoFalhar] - chamado após uma
 *   gravação malsucedida, com o resultado de `gravar`.
 * @returns {object} instância com `registrarAjuste`, `flush` e `temPendencia`.
 */
export function criarGravacaoAgregada({ gravar, aoConcluir, aoFalhar }) {
  let uidAtual = null;
  let alteracoes = {};
  let idDebounce = null;
  let idTeto = null;

  function cancelarTemporizadores() {
    clearTimeout(idDebounce);
    clearTimeout(idTeto);
    idDebounce = null;
    idTeto = null;
  }

  async function gravarAgora() {
    cancelarTemporizadores();
    if (!uidAtual || Object.keys(alteracoes).length === 0) return;

    const uid = uidAtual;
    const paraGravar = alteracoes;
    alteracoes = {};

    const resultado = await gravar(uid, paraGravar);

    if (resultado.status === 'sucesso') {
      aoConcluir?.(resultado);
    } else {
      // Falha: as chaves voltam para a fila para não se perderem. A política
      // de retentativa/timeout e o aviso visível de falha ficam para a
      // Tarefa 0007-0005; aqui só a garantia de que nada some da memória —
      // a próxima gravação (ajuste seguinte ou novo flush) tenta de novo com
      // o valor completo, o que é seguro (escrita idempotente, ADR 0008).
      alteracoes = { ...paraGravar, ...alteracoes };
      aoFalhar?.(resultado);
    }
  }

  return {
    /**
     * Registra o valor absoluto atual de uma figurinha (0 = apaga a chave) e
     * (re)agenda a escrita: debounce de 2s a partir deste ajuste, com teto de
     * 10s contado do primeiro ajuste da rajada.
     *
     * @param {string} uid
     * @param {string} codigo
     * @param {number} valor
     */
    registrarAjuste(uid, codigo, valor) {
      uidAtual = uid;
      alteracoes[codigo] = valor;

      if (idDebounce) clearTimeout(idDebounce);
      idDebounce = setTimeout(gravarAgora, DEBOUNCE_MS);
      if (!idTeto) {
        idTeto = setTimeout(gravarAgora, TETO_MS);
      }
    },

    /**
     * Grava imediatamente qualquer alteração pendente, cancelando os
     * temporizadores em aberto. Sem pendência, não faz nada. Devolve a
     * promise da gravação para quem precisa esperar o flush terminar antes
     * de continuar (o `signOut`, que não pode acontecer antes).
     *
     * @returns {Promise<void>}
     */
    flush() {
      return gravarAgora();
    },

    /**
     * Há alguma alteração acumulada aguardando gravação? Só para teste.
     *
     * @returns {boolean}
     */
    temPendencia() {
      return Object.keys(alteracoes).length > 0;
    },
  };
}
