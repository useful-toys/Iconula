// Copyright (c) 2026 Daniel Felix Ferber
//
// Layout de álbum das seções: dimensão de cada página e posições
// explícitas de linha/coluna num grid de trilhas fixas, reproduzindo a
// página física do álbum (IDR 0009, IDR 0023, MDR 0006, interface.md §
// Disposição "Como no álbum").
//
// `layoutDeSecao(secao)` devolve `null` (seção sem layout de álbum) ou um
// objeto com:
// - `paginas`: uma entrada por página da seção, na ordem, com `pagina`
//   (índice de 1 a N dentro da seção — não a página física do álbum),
//   `linhas` e `colunas` — a dimensão da grade, que preserva linhas e
//   colunas vazias
// - `posicoes`: uma entrada por figurinha, com `posicao` (número da
//   figurinha na seção), `pagina`, `linha`, `trilha` (trilha inicial) e
//   `trilhas` (quantas trilhas ocupa: 1 retrato, 2 paisagem), reproduzindo
//   a página física
//
// `paresDePaginas` agrupa `paginas` em pares consecutivos (1|2, 3|4, …) —
// os spreads do álbum — sem virar campo do layout (MDR 0006).
//
// O FWC ainda não tem layout de álbum (Tarefa 0023-0003 o preenche):
// `layoutDeSecao` retorna `null` para ele, e quem consome cai na lista
// contínua (IDR 0023).

/**
 * Layout das 48 seleções: 2 páginas de 3 linhas × 4 colunas (spread),
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
 * @returns {{paginas: Array, posicoes: Array}} 2 páginas e 20 posições.
 */
function layoutSelecao() {
  return {
    paginas: [
      { pagina: 1, linhas: 3, colunas: 4 },
      { pagina: 2, linhas: 3, colunas: 4 },
    ],
    posicoes: [
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
    ],
  };
}

/**
 * Layout da Coca-Cola: página 1 com 2 linhas × 3 colunas, página 2 com
 * 3 × 3, todas em retrato (interface.md § Coca-Cola — 3 trilhas por
 * página; IDR 0023).
 *
 * Página 1 (figurinhas 01–06): 2 linhas × 3 colunas, cheias.
 * Página 2 (figurinhas 07–14): 3 colunas nas linhas 1 e 2, 2 na linha 3.
 *
 * @returns {{paginas: Array, posicoes: Array}} 2 páginas e 14 posições.
 */
function layoutCocaCola() {
  return {
    paginas: [
      { pagina: 1, linhas: 2, colunas: 3 },
      { pagina: 2, linhas: 3, colunas: 3 },
    ],
    posicoes: [
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
    ],
  };
}

/**
 * Devolve o layout de álbum da seção, ou `null` se a seção não tem
 * layout (o caso do FWC, ainda sem página conhecida — Tarefa 0023-0003).
 *
 * @param {object} secao Uma seção do catálogo.
 * @returns {{paginas: Array, posicoes: Array}|null} O layout ou `null` para FWC.
 */
export function layoutDeSecao(secao) {
  if (secao.sigla === "FWC") return null;
  if (secao.sigla === "COC") return layoutCocaCola();
  return layoutSelecao();
}

/**
 * Agrupa as páginas de um layout em pares consecutivos — os spreads do
 * álbum (1|2, 3|4, …) — sem alterar a ordem nem os objetos de página.
 * Função pura, exportada para o contêiner de par usar diretamente o
 * layout (MDR 0006 § Decisão › Layout de álbum).
 *
 * @param {Array<{pagina: number}>} paginas
 * @returns {Array<Array<{pagina: number}>>} Pares (ou, sobrando uma
 *   página, um par com um item só).
 */
export function paresDePaginas(paginas) {
  const pares = [];
  for (let i = 0; i < paginas.length; i += 2) {
    pares.push(paginas.slice(i, i + 2));
  }
  return pares;
}
