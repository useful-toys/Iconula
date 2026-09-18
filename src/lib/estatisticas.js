// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Derivação pura dos cinco blocos da página de estatísticas
 * (`docs/requisitos.md` § Estatísticas,
 * [IDR 0072](../../docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md)):
 * resumo geral, progresso por grupo da Copa, progresso por seção, repetidas
 * por seção e histograma de contagens.
 *
 * Tudo é calculado em memória a partir da coleção já carregada
 * (`docs/modelo-firebase.md` § Custos e cotas): nenhuma leitura no Firestore e
 * nenhuma dependência de React — só o placar de `src/lib/progresso.js`.
 *
 * Segue o molde de `src/lib/textoDeTroca.js`: funções puras que recebem o
 * catálogo por parâmetro (`secoes` e `figurinhas` de `src/data/catalogo.js`),
 * sem importá-lo, para continuarem testáveis com um catálogo mínimo.
 */

import { calcularPlacar } from "./progresso.js";

/** Grupos da Copa A–L, na ordem dos super-grupos (IDR 0019, IDR 0028). */
const GRUPOS_DA_COPA = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

/** Última faixa individual do histograma; o resto é agrupado na cauda. */
const MAX_INDIVIDUAL_PADRAO = 5;

/**
 * Agrupa os códigos por seção numa única passada pelas figurinhas.
 *
 * @param {Array<{codigo: string, secao: string}>} figurinhas
 * @returns {Map<string, string[]>} sigla da seção → códigos, na ordem do álbum.
 */
function agruparCodigosPorSecao(figurinhas) {
  const porSecao = new Map();
  for (const figurinha of figurinhas) {
    const lista = porSecao.get(figurinha.secao) ?? [];
    lista.push(figurinha.codigo);
    porSecao.set(figurinha.secao, lista);
  }
  return porSecao;
}

/**
 * Placar de cada seção, na ordem recebida.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoes
 * @param {Map<string, string[]>} porSecao
 * @returns {Array<{sigla: string, nome: string, coladas: number, faltantes: number, repetidas: number, percentual: number}>}
 */
function progressoDeSecoes(contagens, secoes, porSecao) {
  return secoes.map((secao) => ({
    sigla: secao.sigla,
    nome: secao.nome,
    ...calcularPlacar(contagens, porSecao.get(secao.sigla) ?? []),
  }));
}

/**
 * Placar de cada recorte de grupo, na ordem do álbum: FWC abre, 12 grupos
 * A–L no meio e COC fecha (IDR 0028).
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string, grupo: string|null}>} secoes
 * @param {Map<string, string[]>} porSecao
 * @returns {Array<{grupo: string, nome: string, coladas: number, faltantes: number, repetidas: number, percentual: number}>}
 */
function progressoDeGrupos(contagens, secoes, porSecao) {
  const recortes = [];
  const fwc = secoes.find((secao) => secao.sigla === "FWC");
  if (fwc) {
    recortes.push({ grupo: "FWC", nome: fwc.nome, codigos: porSecao.get("FWC") ?? [] });
  }
  for (const grupo of GRUPOS_DA_COPA) {
    const codigos = secoes
      .filter((secao) => secao.grupo === grupo)
      .flatMap((secao) => porSecao.get(secao.sigla) ?? []);
    recortes.push({ grupo, nome: `Grupo ${grupo}`, codigos });
  }
  const coc = secoes.find((secao) => secao.sigla === "COC");
  if (coc) {
    recortes.push({ grupo: "COC", nome: coc.nome, codigos: porSecao.get("COC") ?? [] });
  }
  return recortes.map(({ grupo, nome, codigos }) => ({
    grupo,
    nome,
    ...calcularPlacar(contagens, codigos),
  }));
}

/**
 * Repetidas de cada seção: os códigos distintos com contagem ≥ 2, na ordem do
 * álbum. Seção sem repetida devolve lista vazia (IDR 0021).
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoes
 * @param {Map<string, string[]>} porSecao
 * @returns {Array<{sigla: string, nome: string, codigos: string[]}>}
 */
function repetidasDeSecoes(contagens, secoes, porSecao) {
  return secoes.map((secao) => ({
    sigla: secao.sigla,
    nome: secao.nome,
    codigos: (porSecao.get(secao.sigla) ?? []).filter(
      (codigo) => (contagens[codigo] ?? 0) >= 2,
    ),
  }));
}

/**
 * Resumo geral: placar sobre todas as figurinhas do catálogo.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{codigo: string}>} figurinhas
 * @returns {{coladas: number, faltantes: number, repetidas: number, percentual: number}}
 */
export function calcularResumo(contagens, figurinhas) {
  return calcularPlacar(contagens, figurinhas.map((figurinha) => figurinha.codigo));
}

/**
 * Progresso por seção (50), na ordem do catálogo.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoes
 * @param {Array<{codigo: string, secao: string}>} figurinhas
 * @returns {ReturnType<typeof progressoDeSecoes>}
 */
export function calcularProgressoPorSecao(contagens, secoes, figurinhas) {
  return progressoDeSecoes(contagens, secoes, agruparCodigosPorSecao(figurinhas));
}

/**
 * Progresso por grupo da Copa (12 grupos A–L + FWC + COC).
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string, grupo: string|null}>} secoes
 * @param {Array<{codigo: string, secao: string}>} figurinhas
 * @returns {ReturnType<typeof progressoDeGrupos>}
 */
export function calcularProgressoPorGrupo(contagens, secoes, figurinhas) {
  return progressoDeGrupos(contagens, secoes, agruparCodigosPorSecao(figurinhas));
}

/**
 * Repetidas por seção: códigos distintos com contagem ≥ 2.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoes
 * @param {Array<{codigo: string, secao: string}>} figurinhas
 * @returns {ReturnType<typeof repetidasDeSecoes>}
 */
export function calcularRepetidasPorSecao(contagens, secoes, figurinhas) {
  return repetidasDeSecoes(contagens, secoes, agruparCodigosPorSecao(figurinhas));
}

/**
 * Histograma de contagens: quantos códigos têm 0, 1, …, `maxIndividual` e
 * quantos caem na cauda agrupada (`"6+"` com o padrão). Cada faixa traz o
 * valor numérico (`contagem`), o rótulo pronto (`rotulo`) e o total de códigos
 * (`total`); a cauda usa a contagem `maxIndividual + 1` como piso.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{codigo: string}>} figurinhas
 * @param {{maxIndividual?: number}} [opcoes]
 * @returns {Array<{contagem: number, rotulo: string, total: number}>}
 */
export function calcularHistograma(contagens, figurinhas, { maxIndividual = MAX_INDIVIDUAL_PADRAO } = {}) {
  const faixas = Array.from({ length: maxIndividual + 1 }, (_, contagem) => ({
    contagem,
    rotulo: String(contagem),
    total: 0,
  }));
  let cauda = 0;
  for (const figurinha of figurinhas) {
    const contagem = contagens[figurinha.codigo] ?? 0;
    if (contagem <= maxIndividual) {
      faixas[contagem].total += 1;
    } else {
      cauda += 1;
    }
  }
  return [...faixas, { contagem: maxIndividual + 1, rotulo: `${maxIndividual + 1}+`, total: cauda }];
}

/**
 * Os cinco blocos da página de estatísticas de uma vez, agrupando os códigos
 * por seção numa única passada pelas figurinhas.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string, grupo: string|null}>} secoes
 * @param {Array<{codigo: string, secao: string}>} figurinhas
 * @returns {{resumo: object, progressoPorGrupo: Array, progressoPorSecao: Array, repetidasPorSecao: Array, histograma: Array}}
 */
export function derivarEstatisticas(contagens, secoes, figurinhas) {
  const porSecao = agruparCodigosPorSecao(figurinhas);
  return {
    resumo: calcularResumo(contagens, figurinhas),
    progressoPorGrupo: progressoDeGrupos(contagens, secoes, porSecao),
    progressoPorSecao: progressoDeSecoes(contagens, secoes, porSecao),
    repetidasPorSecao: repetidasDeSecoes(contagens, secoes, porSecao),
    histograma: calcularHistograma(contagens, figurinhas),
  };
}
