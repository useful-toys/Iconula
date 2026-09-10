// Copyright (c) 2026 Daniel Felix Ferber
//
// Layout de álbum das seções: posições explícitas de linha/coluna num
// grid de trilhas fixas, reproduzindo a página física do álbum
// (IDR 0009, IDR 0023, interface.md § Disposição "Como no álbum").
//
// Cada posição é um objeto com:
// - `posicao`: número da figurinha na seção (1–20 para seleções, 1–14 para COC)
// - `pagina`: página do spread (1 ou 2)
// - `linha`: linha dentro da página (1, 2 ou 3)
// - `trilha`: trilha inicial (1–4 para seleções, 1–3 para COC)
// - `trilhas`: quantas trilhas a figurinha ocupa (1 para retrato, 2 para paisagem)
//
// O FWC não tem layout de álbum (IDR 0023): `layoutDeSecao` retorna
// `null` para ele, e quem consome cai na lista contínua.

/**
 * Layout das 48 seleções: 4 trilhas por página, 2 páginas (spread),
 * com a figurinha 13 em paisagem ocupando 2 trilhas.
 *
 * Página 1 (figurinhas 01–10):
 * - Linha 1: 01 e 02 nas trilhas 3 e 4
 * - Linha 2: 03–06 nas trilhas 1–4
 * - Linha 3: 07–10 nas trilhas 1–4
 *
 * Página 2 (figurinhas 11–20):
 * - Linha 1: 11 e 12 nas trilhas 1 e 2, 13 em paisagem nas trilhas 3–4
 * - Linha 2: 14–17 nas trilhas 1–4
 * - Linha 3: 18, 19 e 20 nas trilhas 2, 3 e 4
 *
 * @returns {Array} 20 posições explícitas.
 */
function layoutSelecao() {
  return [
    { posicao: 1, pagina: 1, linha: 1, trilha: 3, trilhas: 1 },
    { posicao: 2, pagina: 1, linha: 1, trilha: 4, trilhas: 1 },
    { posicao: 3, pagina: 1, linha: 2, trilha: 1, trilhas: 1 },
    { posicao: 4, pagina: 1, linha: 2, trilha: 2, trilhas: 1 },
    { posicao: 5, pagina: 1, linha: 2, trilha: 3, trilhas: 1 },
    { posicao: 6, pagina: 1, linha: 2, trilha: 4, trilhas: 1 },
    { posicao: 7, pagina: 1, linha: 3, trilha: 1, trilhas: 1 },
    { posicao: 8, pagina: 1, linha: 3, trilha: 2, trilhas: 1 },
    { posicao: 9, pagina: 1, linha: 3, trilha: 3, trilhas: 1 },
    { posicao: 10, pagina: 1, linha: 3, trilha: 4, trilhas: 1 },
    { posicao: 11, pagina: 2, linha: 1, trilha: 1, trilhas: 1 },
    { posicao: 12, pagina: 2, linha: 1, trilha: 2, trilhas: 1 },
    { posicao: 13, pagina: 2, linha: 1, trilha: 3, trilhas: 2 },
    { posicao: 14, pagina: 2, linha: 2, trilha: 1, trilhas: 1 },
    { posicao: 15, pagina: 2, linha: 2, trilha: 2, trilhas: 1 },
    { posicao: 16, pagina: 2, linha: 2, trilha: 3, trilhas: 1 },
    { posicao: 17, pagina: 2, linha: 2, trilha: 4, trilhas: 1 },
    { posicao: 18, pagina: 2, linha: 3, trilha: 2, trilhas: 1 },
    { posicao: 19, pagina: 2, linha: 3, trilha: 3, trilhas: 1 },
    { posicao: 20, pagina: 2, linha: 3, trilha: 4, trilhas: 1 },
  ];
}

/**
 * Layout da Coca-Cola: 3 trilhas por página, 2 páginas, todas em
 * retrato (interface.md § Coca-Cola — 3 trilhas por página).
 *
 * Página 1 (figurinhas 01–06): 2 linhas × 3 colunas, cheias.
 * Página 2 (figurinhas 07–14): 3 colunas nas linhas 1 e 2, 2 na linha 3.
 *
 * @returns {Array} 14 posições explícitas.
 */
function layoutCocaCola() {
  return [
    { posicao: 1, pagina: 1, linha: 1, trilha: 1, trilhas: 1 },
    { posicao: 2, pagina: 1, linha: 1, trilha: 2, trilhas: 1 },
    { posicao: 3, pagina: 1, linha: 1, trilha: 3, trilhas: 1 },
    { posicao: 4, pagina: 1, linha: 2, trilha: 1, trilhas: 1 },
    { posicao: 5, pagina: 1, linha: 2, trilha: 2, trilhas: 1 },
    { posicao: 6, pagina: 1, linha: 2, trilha: 3, trilhas: 1 },
    { posicao: 7, pagina: 2, linha: 1, trilha: 1, trilhas: 1 },
    { posicao: 8, pagina: 2, linha: 1, trilha: 2, trilhas: 1 },
    { posicao: 9, pagina: 2, linha: 1, trilha: 3, trilhas: 1 },
    { posicao: 10, pagina: 2, linha: 2, trilha: 1, trilhas: 1 },
    { posicao: 11, pagina: 2, linha: 2, trilha: 2, trilhas: 1 },
    { posicao: 12, pagina: 2, linha: 2, trilha: 3, trilhas: 1 },
    { posicao: 13, pagina: 2, linha: 3, trilha: 1, trilhas: 1 },
    { posicao: 14, pagina: 2, linha: 3, trilha: 2, trilhas: 1 },
  ];
}

/**
 * Devolve o layout de álbum da seção, ou `null` se a seção não tem
 * layout (o caso do FWC — IDR 0023).
 *
 * @param {object} secao Uma seção do catálogo.
 * @returns {Array|null} Array de posições ou `null` para FWC.
 */
export function layoutDeSecao(secao) {
  if (secao.sigla === "FWC") return null;
  if (secao.sigla === "COC") return layoutCocaCola();
  return layoutSelecao();
}
