// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Colapso manual de seções e super-grupos persistido no navegador
 * (IDR 0020, IDR 0026, implementação na Tarefa 0012-0001).
 *
 * Guarda apenas o que o usuário fechou à mão: o conjunto de siglas de seções
 * e o de letras de super-grupos colapsados. Ausente = aberto; é o próprio
 * último uso dos títulos que define a preferência, por dispositivo, sem
 * Firestore e sem requisição.
 *
 * Uma chave nomeada e versionada guarda os dois conjuntos. Storage ausente ou
 * bloqueado e JSON quebrado não podem quebrar o app: a leitura cai no
 * conjunto vazio (tudo aberto) e a escrita falha em silêncio (IDR 0026
 * § Consequências).
 */

const CHAVE = 'iconula.colapso-manual.v1';

/**
 * Conjunto vazio de colapso, no formato consumido pela interface.
 *
 * @returns {{secoes: Set<string>, grupos: Set<string>}}
 */
function vazio() {
  return { secoes: new Set(), grupos: new Set() };
}

/**
 * Lê o colapso manual do `localStorage`.
 *
 * Ausência de chave, JSON quebrado, valor não-objeto ou storage indisponível
 * resultam no conjunto vazio — tudo aberto, sem erro. Valores não-string
 * dentro das listas são descartados; a validação contra o catálogo (siglas e
 * letras existentes) é responsabilidade de quem consome.
 *
 * @returns {{secoes: Set<string>, grupos: Set<string>}}
 */
export function lerColapsoManual() {
  let bruto;
  try {
    bruto = window.localStorage.getItem(CHAVE);
  } catch {
    return vazio();
  }

  if (bruto === null) return vazio();

  let objeto;
  try {
    objeto = JSON.parse(bruto);
  } catch {
    return vazio();
  }

  if (typeof objeto !== 'object' || objeto === null || Array.isArray(objeto)) {
    return vazio();
  }

  const secoes = Array.isArray(objeto.secoes)
    ? objeto.secoes.filter((item) => typeof item === 'string')
    : [];
  const grupos = Array.isArray(objeto.grupos)
    ? objeto.grupos.filter((item) => typeof item === 'string')
    : [];

  return { secoes: new Set(secoes), grupos: new Set(grupos) };
}

/**
 * Grava o colapso manual no `localStorage`.
 *
 * Falha de escrita é ignorada em silêncio (IDR 0026 § Consequências).
 *
 * @param {{secoes: Iterable<string>, grupos: Iterable<string>}} colapso
 */
export function gravarColapsoManual({ secoes, grupos }) {
  const dados = {
    secoes: [...(secoes ?? [])].filter((item) => typeof item === 'string'),
    grupos: [...(grupos ?? [])].filter((item) => typeof item === 'string'),
  };

  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    // Storage ausente ou bloqueado: segue sem persistir.
  }
}
