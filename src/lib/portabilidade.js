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

/**
 * Valida e normaliza o conteúdo bruto de um arquivo de importação (Tarefa
 * 0009-0005). Nunca lança — o texto malformado é só mais um motivo de
 * `invalido`.
 *
 * Recusa o arquivo inteiro (sem aplicar nada) quando: não é JSON válido;
 * não é um objeto; `versao` não é a conhecida; `contagens` está ausente
 * ou não é um objeto; ou algum valor de `contagens` não é um inteiro
 * entre 1 e 99 — "recusar é mais seguro que corrigir em silêncio"
 * (a tarefa), porque o usuário perderia dado sem saber.
 *
 * Duas normalizações não recusam o arquivo, só descartam a chave em
 * questão: valor exatamente `0` (mapa esparso — o mesmo formato que o
 * app já grava) some silenciosamente; código fora do catálogo atual
 * (`codigosValidos`) some e entra na contagem de `descartadas`, avisada
 * por quem chama (IDR 0041) — o catálogo pode ter mudado entre a
 * exportação e a importação, e isso não é motivo para recusar o resto de
 * um arquivo que é, por tudo o mais, válido.
 *
 * @param {string} texto - conteúdo bruto do arquivo.
 * @param {Set<string>} codigosValidos - códigos do catálogo atual.
 * @returns {{status: 'valido', contagens: Record<string, number>, descartadas: number}
 *   | {status: 'invalido', motivo: string}}
 */
export function validarImportacao(texto, codigosValidos) {
  let json;
  try {
    json = JSON.parse(texto);
  } catch {
    return { status: 'invalido', motivo: 'o arquivo não é um JSON válido' };
  }

  if (json === null || typeof json !== 'object' || Array.isArray(json)) {
    return { status: 'invalido', motivo: 'o arquivo não tem o formato esperado' };
  }

  if (json.versao !== VERSAO_ATUAL) {
    return { status: 'invalido', motivo: `versão desconhecida (${json.versao ?? 'ausente'})` };
  }

  const contagensBrutas = json.contagens;
  if (contagensBrutas === null || typeof contagensBrutas !== 'object' || Array.isArray(contagensBrutas)) {
    return { status: 'invalido', motivo: '"contagens" ausente ou inválido' };
  }

  const contagens = {};
  let descartadas = 0;

  for (const [codigo, valor] of Object.entries(contagensBrutas)) {
    if (valor === 0) continue; // mapa esparso — descarte silencioso, não é dado perdido

    if (!Number.isInteger(valor) || valor < 0 || valor > 99) {
      return { status: 'invalido', motivo: `valor inválido em "${codigo}": ${valor}` };
    }

    if (!codigosValidos.has(codigo)) {
      descartadas += 1;
      continue;
    }

    contagens[codigo] = valor;
  }

  return { status: 'valido', contagens, descartadas };
}
