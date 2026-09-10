// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Preferências de vista persistidas no navegador (IDR 0026).
 *
 * Ordenação, disposição e filtro vivem no `localStorage`, por dispositivo,
 * e custam zero requisição ao Firestore. O colapso de seções e super-grupos
 * não persiste (IDR 0020).
 *
 * Uma única chave nomeada e versionada guarda um objeto com as três
 * preferências: validação e descarte acontecem de uma vez só. Uma mudança
 * futura de formato troca a versão da chave e o dado antigo é ignorado em
 * vez de mal interpretado.
 *
 * Storage ausente ou bloqueado (navegação privada, storage desabilitado)
 * não pode quebrar o app: falha de leitura ou de escrita cai nos padrões e
 * segue (IDR 0026 § Consequências).
 */

const CHAVE = 'iconula.preferencias-vista.v1';

const DOMINIOS = {
  ordenacao: ['pagina', 'sigla'],
  disposicao: ['lista', 'album'],
  filtro: ['todas', 'faltantes', 'repetidas'],
};

const PADROES = {
  ordenacao: 'pagina',
  disposicao: 'lista',
  filtro: 'todas',
};

/**
 * Retorna os padrões das três preferências, sem mutar o objeto interno.
 *
 * @returns {{ordenacao: string, disposicao: string, filtro: string}}
 */
function padroes() {
  return { ...PADROES };
}

/**
 * Verifica se um valor pertence ao domínio conhecido de uma preferência.
 *
 * @param {'ordenacao'|'disposicao'|'filtro'} chave
 * @param {unknown} valor
 * @returns {boolean}
 */
function ehValido(chave, valor) {
  return DOMINIOS[chave].includes(valor);
}

/**
 * Lê as três preferências do `localStorage`.
 *
 * Qualquer falha — storage ausente, JSON quebrado, valor fora do domínio —
 * vira o padrão da preferência afetada, em silêncio e sem `console.error`.
 *
 * @returns {{ordenacao: string, disposicao: string, filtro: string}}
 */
export function lerPreferenciasDeVista() {
  let bruto;
  try {
    bruto = window.localStorage.getItem(CHAVE);
  } catch {
    return padroes();
  }

  if (bruto === null) return padroes();

  let objeto;
  try {
    objeto = JSON.parse(bruto);
  } catch {
    return padroes();
  }

  if (typeof objeto !== 'object' || objeto === null || Array.isArray(objeto)) {
    return padroes();
  }

  const preferencias = padroes();
  for (const chave of Object.keys(DOMINIOS)) {
    if (ehValido(chave, objeto[chave])) {
      preferencias[chave] = objeto[chave];
    }
  }
  return preferencias;
}

/**
 * Grava as três preferências no `localStorage`.
 *
 * Valores fora do domínio são substituídos pelo padrão antes de gravar.
 * Falha de escrita é ignorada em silêncio (IDR 0026 § Consequências).
 *
 * @param {{ordenacao: string, disposicao: string, filtro: string}} preferencias
 */
export function gravarPreferenciasDeVista(preferencias) {
  const limpas = {};
  for (const chave of Object.keys(DOMINIOS)) {
    limpas[chave] = ehValido(chave, preferencias[chave])
      ? preferencias[chave]
      : PADROES[chave];
  }

  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(limpas));
  } catch {
    // Falha de escrita cai no padrão e segue.
  }
}