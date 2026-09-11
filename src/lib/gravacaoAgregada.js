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
 *
 * Política de erro (Tarefa 0007-0005, ADR 0008, IDR 0029): a promessa de
 * `gravar` nunca rejeita sem rede — fica pendente para sempre enquanto o
 * servidor não responde. Por isso a gravação corre contra um tempo-limite de
 * ~5s: se ele vencer primeiro, `aoEsperar` dispara o aviso "sincronizando" e
 * a gravação continua em segundo plano, chamando `aoConcluir`/`aoFalhar`
 * sempre que o desfecho real chegar — sucesso ou falha, cedo ou tarde.
 */

const DEBOUNCE_MS = 2000;
const TETO_MS = 10000;
const TIMEOUT_ESPERA_MS = 5000;
const ESPERA = Symbol('espera');

// Mesmo literal de `MARCA_APAGAR_TEAM_NAME` em `colecaoRemota.js` (Tarefa
// 0007-0004) — definido de novo aqui, e não importado de lá, para que este
// módulo continue testável sem tocar `firebase.js` (comentário espelhado no
// outro arquivo).
const MARCA_APAGAR_TEAM_NAME = '__apagarTeamName';

/**
 * @param {object} opcoes
 * @param {(uid: string, alteracoes: Record<string, number|boolean>) => Promise<object>} opcoes.gravar
 *   - grava as chaves alteradas (mais a marca reservada de apagar o
 *   `teamName`, quando pendente); nunca deve lançar (resultado discriminado,
 *   como `gravarAlteracoes` de `colecaoRemota.js`).
 * @param {(resultado: object) => void} [opcoes.aoConcluir] - chamado após
 *   uma gravação bem-sucedida, com o resultado de `gravar`.
 * @param {(resultado: object) => void} [opcoes.aoFalhar] - chamado após uma
 *   gravação malsucedida, com o resultado de `gravar`.
 * @param {() => void} [opcoes.aoEsperar] - chamado quando a gravação em voo
 *   ultrapassa ~5s sem resolver (sem rede) — não é falha, é espera; o
 *   desfecho real (sucesso ou falha) ainda chega depois, em segundo plano.
 * @returns {object} instância com `registrarAjuste`, `flush` e `temPendencia`.
 */
export function criarGravacaoAgregada({ gravar, aoConcluir, aoFalhar, aoEsperar }) {
  let uidAtual = null;
  let alteracoes = {};
  let idDebounce = null;
  let idTeto = null;
  // Marca da era do botão pendente de apagar (Tarefa 0007-0004). Fica fora do
  // mapa `alteracoes` de propósito: sozinha, nunca deve bastar para disparar
  // uma escrita (a migração não pode virar escrita extra — ADR 0008) — só
  // entra na próxima gravação que já ia acontecer por causa de um ajuste real.
  let apagarTeamNamePendente = false;

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
    const apagarTeamNameNestaGravacao = apagarTeamNamePendente;
    alteracoes = {};

    const envio = apagarTeamNameNestaGravacao
      ? { ...paraGravar, [MARCA_APAGAR_TEAM_NAME]: true }
      : paraGravar;

    const promessa = gravar(uid, envio);

    let idEspera;
    const timeout = new Promise((resolve) => {
      idEspera = setTimeout(() => resolve(ESPERA), TIMEOUT_ESPERA_MS);
    });
    const corrida = await Promise.race([promessa, timeout]);
    clearTimeout(idEspera);

    if (corrida === ESPERA) {
      aoEsperar?.();
    }

    // Sem rede, `promessa` continua pendente até o servidor responder — o
    // `await` aqui é o mesmo objeto de antes da corrida, só aguarda mais.
    const resultado = corrida === ESPERA ? await promessa : corrida;

    if (resultado.status === 'sucesso') {
      // Migrado: as gravações seguintes não repetem o deleteField.
      if (apagarTeamNameNestaGravacao) apagarTeamNamePendente = false;
      aoConcluir?.(resultado);
    } else {
      // Falha: as chaves voltam para a fila para não se perderem, e a marca
      // de migração (se houver) permanece para a tentativa seguinte — a
      // próxima gravação (ajuste seguinte ou novo flush) regrava o valor
      // completo, o que é seguro (escrita idempotente, ADR 0008). O aviso
      // visível de falha é responsabilidade de quem injeta `aoFalhar`
      // (Tarefa 0007-0005, `App.jsx`).
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
     * Marca que o documento carregado ainda tem `teamName` (era do botão):
     * a próxima gravação agregada apaga o campo junto com as chaves
     * alteradas, na mesma escrita (Tarefa 0007-0004, ADR 0008). Sozinha, não
     * agenda nem força nenhuma escrita — sem um ajuste real, o campo fica
     * onde está, inofensivo, até a primeira gravação de fato acontecer.
     *
     * @param {string} uid
     */
    marcarTeamNameParaApagar(uid) {
      uidAtual = uid;
      apagarTeamNamePendente = true;
    },

    /**
     * Há alguma alteração acumulada, ou uma migração de `teamName` pendente,
     * aguardando a próxima gravação? Só para teste.
     *
     * @returns {boolean}
     */
    temPendencia() {
      return Object.keys(alteracoes).length > 0 || apagarTeamNamePendente;
    },
  };
}
