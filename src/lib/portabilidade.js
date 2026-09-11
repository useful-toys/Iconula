// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Portabilidade da coleção (`requisitos.md` § Portabilidade — sem
 * lock-in): serialização pura, sem tocar o DOM nem o Firestore — o
 * download em si (Blob, link, clique) é responsabilidade de quem chama
 * (`App.jsx`), efeito colateral que este módulo não precisa saber fazer
 * para ser testável.
 */

const VERSAO_ATUAL = 1;

/**
 * Gera o objeto de exportação: exatamente `versao`, `geradoEm` (ISO 8601)
 * e `contagens` — lossless, sem dados pessoais (nada de uid, e-mail, nome
 * ou foto).
 *
 * Contagens ≤ 0 nunca aparecem — mantém o mapa esparso mesmo que
 * `contagens` chegue com alguma chave zerada por engano; o mapa em
 * memória (`colecao.js`) já nunca guarda zeros, isto é defesa extra.
 *
 * @param {Record<string, number>} contagens
 * @param {Date} [agora] - instante do carimbo `geradoEm` (testável).
 * @returns {{versao: number, geradoEm: string, contagens: Record<string, number>}}
 */
export function gerarExportacao(contagens, agora = new Date()) {
  const contagensSemZero = Object.fromEntries(
    Object.entries(contagens).filter(([, valor]) => valor > 0),
  );

  return {
    versao: VERSAO_ATUAL,
    geradoEm: agora.toISOString(),
    contagens: contagensSemZero,
  };
}

/**
 * Nome de arquivo previsível e ordenável para o download:
 * `iconula-AAAA-MM-DD.json`, na data local de quem exporta (Tarefa
 * 0009-0004).
 *
 * @param {Date} [agora] - instante de referência (testável).
 * @returns {string}
 */
export function nomeDoArquivoExportado(agora = new Date()) {
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `iconula-${ano}-${mes}-${dia}.json`;
}
