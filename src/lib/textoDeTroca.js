// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Textos de troca prontos para colar num grupo de WhatsApp (`requisitos.md`
 * § Compartilhamento): um com as figurinhas faltantes, outro com as
 * repetidas — sempre separados, nunca um texto só.
 *
 * Uma linha por seção, `Nome SIG: nn nn nn`, com os números em ordem
 * crescente; seção sem nada a listar não entra no texto. O número sai
 * sempre com dois dígitos, como no cartão e no código (`FWC 00`,
 * `BRA 05`), para que um `00` não leia como erro num grupo de WhatsApp
 * (IDR 0044). No texto de repetidas, `nn×k` são as **unidades sobrando**
 * do número `n` (contagem − 1), a mesma leitura do selo do cartão
 * (IDR 0021).
 *
 * Funções puras: leem `contagens` em memória, sem requisição nenhuma
 * (`docs/persistencia.md` § Custos e cotas). Sempre na ordem do álbum
 * (FWC abre, COC fecha), **independente** da ordenação vigente na tela —
 * para que o texto colado seja comparável entre pessoas (IDR 0039).
 *
 * @param {Record<string, number>} contagens - mapa de código para contagem.
 * @param {Array<{sigla: string, nome: string}>} secoesNaOrdemDoAlbum - seções
 *   já na ordem do álbum (ver `extrairSecoes(ordenarPorPagina(secoes))`).
 * @param {Array<{codigo: string, secao: string, posicao: number}>} figurinhas
 *   - o catálogo expandido (`src/data/catalogo.js`).
 * @param {object} opcoes
 * @param {(contagem: number) => boolean} opcoes.incluir - filtra quais figurinhas entram na linha.
 * @param {(posicao: number, contagem: number) => string} opcoes.formatarNumero - formata um número da linha.
 * @returns {string} o texto pronto, linhas separadas por `\n`; vazio se não houver nada a listar.
 */
function gerarTexto(contagens, secoesNaOrdemDoAlbum, figurinhas, { incluir, formatarNumero }) {
  const porSecao = new Map();
  for (const figurinha of figurinhas) {
    if (!porSecao.has(figurinha.secao)) porSecao.set(figurinha.secao, []);
    porSecao.get(figurinha.secao).push(figurinha);
  }

  const linhas = [];
  for (const secao of secoesNaOrdemDoAlbum) {
    const numeros = (porSecao.get(secao.sigla) ?? [])
      .filter((figurinha) => incluir(contagens[figurinha.codigo] ?? 0))
      .sort((a, b) => a.posicao - b.posicao)
      .map((figurinha) => formatarNumero(figurinha.posicao, contagens[figurinha.codigo] ?? 0));

    if (numeros.length > 0) {
      linhas.push(`${secao.nome} ${secao.sigla}: ${numeros.join(' ')}`);
    }
  }
  return linhas.join('\n');
}

/**
 * Texto de troca das figurinhas faltantes: `Nome SIG: n n n` para cada
 * seção com pelo menos uma figurinha de contagem 0.
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoesNaOrdemDoAlbum
 * @param {Array<{codigo: string, secao: string, posicao: number}>} figurinhas
 * @returns {string}
 */
export function gerarTextoFaltantes(contagens, secoesNaOrdemDoAlbum, figurinhas) {
  return gerarTexto(contagens, secoesNaOrdemDoAlbum, figurinhas, {
    incluir: (contagem) => contagem === 0,
    formatarNumero: (posicao) => String(posicao).padStart(2, '0'),
  });
}

/**
 * Texto de troca das figurinhas repetidas: `Nome SIG: n×k n×k` para cada
 * seção com pelo menos uma figurinha de contagem ≥ 2, `k` sendo as
 * unidades sobrando (contagem − 1).
 *
 * @param {Record<string, number>} contagens
 * @param {Array<{sigla: string, nome: string}>} secoesNaOrdemDoAlbum
 * @param {Array<{codigo: string, secao: string, posicao: number}>} figurinhas
 * @returns {string}
 */
export function gerarTextoRepetidas(contagens, secoesNaOrdemDoAlbum, figurinhas) {
  return gerarTexto(contagens, secoesNaOrdemDoAlbum, figurinhas, {
    incluir: (contagem) => contagem >= 2,
    formatarNumero: (posicao, contagem) => `${String(posicao).padStart(2, '0')}×${contagem - 1}`,
  });
}
