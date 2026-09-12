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
 *
 * Sem preferência guardada — nada gravado, JSON quebrado, valor não-objeto
 * ou storage indisponível —, o par (ordenação, disposição) da primeira
 * abertura depende da faixa de tela (celular, tablet ou navegador), pela
 * largura da janela (IDR 0043). Havendo qualquer preferência guardada,
 * mesmo que parcialmente fora do domínio conhecido, a faixa deixa de
 * importar: cada campo inválido cai no padrão neutro fixo, não no padrão
 * da faixa — a faixa só decide o ponto de partida de quem nunca guardou
 * nada.
 */

const CHAVE = 'iconula.preferencias-vista.v1';

const DOMINIOS = {
  ordenacao: ['pagina', 'sigla'],
  disposicao: ['lista', 'album'],
  filtro: ['todas', 'faltantes', 'coladas', 'repetidas'],
};

// Padrão neutro fixo: usado quando existe um objeto de preferências
// gravado (isto é, não é a primeira abertura) mas um campo específico está
// fora do domínio conhecido — corrupção parcial, não ausência de
// preferência, então não passa pela faixa de tela.
const PADRAO_NEUTRO = {
  ordenacao: 'pagina',
  disposicao: 'lista',
  filtro: 'todas',
};

// Limite de largura (px) entre celular e tablet: arredondamento do ponto em
// que o spread da disposição álbum (duas páginas de 226px + 20px de gap =
// 472px de conteúdo) deixa de caber ao lado da margem lateral mínima do
// app e passa a empilhar (IDR 0015) — reaproveitado para não criar uma
// segunda noção de "estreito" no app (IDR 0043, com o cálculo completo).
const LIMITE_CELULAR = 512;

// Limite de largura (px) entre tablet e navegador. Sem precedente próprio
// no app — o spread só tem um ponto de quebra —, adotado por convenção
// comum de mercado para tablet em paisagem (ex.: iPad, 1024px) — IDR 0043.
const LIMITE_TABLET = 1024;

// Par (ordenação, disposição) pré-selecionado na primeira abertura, por
// faixa de tela (IDR 0043): celular e tablet, ambos aparelhos portáteis,
// abrem no modo que compara com a página física do álbum; a janela larga
// do navegador abre na visão geral, por sigla e em lista.
const PADRAO_POR_FAIXA = {
  celular: { ordenacao: 'pagina', disposicao: 'album' },
  tablet: { ordenacao: 'pagina', disposicao: 'album' },
  navegador: { ordenacao: 'sigla', disposicao: 'lista' },
};

/**
 * Classifica uma largura de janela numa faixa de tela (IDR 0043). Uma
 * largura inválida (não numérica) cai em "navegador" — a faixa só é usada
 * na primeira abertura, e este caso não deveria ocorrer em produção.
 *
 * @param {number} largura - largura da janela em pixels (ex.: `window.innerWidth`).
 * @returns {'celular'|'tablet'|'navegador'}
 */
export function faixaDaLargura(largura) {
  if (typeof largura !== 'number' || Number.isNaN(largura)) return 'navegador';
  if (largura <= LIMITE_CELULAR) return 'celular';
  if (largura <= LIMITE_TABLET) return 'tablet';
  return 'navegador';
}

/**
 * Padrões da primeira abertura para uma largura de janela: ordenação e
 * disposição pré-selecionadas pela faixa de tela (IDR 0043); o filtro é
 * sempre "todas", independente da faixa.
 *
 * @param {number} largura - largura da janela em pixels.
 * @returns {{ordenacao: string, disposicao: string, filtro: string}}
 */
function padroesPorFaixa(largura) {
  return { ...PADRAO_POR_FAIXA[faixaDaLargura(largura)], filtro: PADRAO_NEUTRO.filtro };
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
 * Sem preferência guardada (nada gravado, JSON quebrado, valor não-objeto
 * ou storage indisponível), cai nos padrões da faixa de tela indicada por
 * `larguraJanela` (IDR 0043). Havendo um objeto gravado, mesmo com algum
 * campo fora do domínio, a faixa é ignorada e o campo inválido cai no
 * padrão neutro fixo — falha vira o padrão e segue, em silêncio e sem
 * `console.error`.
 *
 * @param {number} [larguraJanela] - largura da janela em pixels (ex.: `window.innerWidth`), só usada sem preferência guardada.
 * @returns {{ordenacao: string, disposicao: string, filtro: string}}
 */
export function lerPreferenciasDeVista(larguraJanela) {
  let bruto;
  try {
    bruto = window.localStorage.getItem(CHAVE);
  } catch {
    return padroesPorFaixa(larguraJanela);
  }

  if (bruto === null) return padroesPorFaixa(larguraJanela);

  let objeto;
  try {
    objeto = JSON.parse(bruto);
  } catch {
    return padroesPorFaixa(larguraJanela);
  }

  if (typeof objeto !== 'object' || objeto === null || Array.isArray(objeto)) {
    return padroesPorFaixa(larguraJanela);
  }

  const preferencias = { ...PADRAO_NEUTRO };
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
 * Valores fora do domínio são substituídos pelo padrão neutro antes de
 * gravar. Falha de escrita é ignorada em silêncio (IDR 0026 § Consequências).
 *
 * @param {{ordenacao: string, disposicao: string, filtro: string}} preferencias
 */
export function gravarPreferenciasDeVista(preferencias) {
  const limpas = {};
  for (const chave of Object.keys(DOMINIOS)) {
    limpas[chave] = ehValido(chave, preferencias[chave])
      ? preferencias[chave]
      : PADRAO_NEUTRO[chave];
  }

  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(limpas));
  } catch {
    // Falha de escrita cai no padrão e segue.
  }
}
