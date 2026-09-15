// Copyright (c) 2026 Daniel Felix Ferber
//
// Catálogo do álbum Panini da Copa 2026: as 50 seções (48 seleções + os
// especiais "Extras FIFA" e "Coca-Cola") e as 994 figurinhas que elas
// contêm. É a única fonte desse dado (AGENTS.md § Convenções) — nenhum
// componente ou serviço externo o recalcula ou o carrega de outro lugar
// (docs/requisitos.md § Conteúdo).
//
// As seleções vêm, sem reordenar, da tabela do Anexo de
// docs/requisitos.md § Anexo: seções do catálogo (código, nome PT-BR,
// grupo da Copa e páginas do spread no álbum físico). O grupo de cada
// seleção foi conferido linha a linha contra a tabela "A composição dos
// grupos" do [IDR 0019](../../docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md)
// — as duas concordam, seleção por seleção, sem exceção.
//
// FWC abre e COC fecha o catálogo, nas duas ordenações, por decisão do
// [IDR 0028](../../docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md);
// por isso aparecem aqui na primeira e na última posição do array. Note
// que agrupar, ordenar ou dispor em página (ordem do álbum, alfabética,
// grade 4 trilhas) é derivação de tela e fica fora deste arquivo — ver
// Tarefa 0001-0003.
//
// Forma do dado, degradação da fonte do checklist ausente e ausência de
// pipeline de geração: ver
// [TDR 0010](../../docs/tdr/0010-forma-do-catalogo-degradacao-do-checklist-e-sem-pipeline.md).
//
// Os nomes de cada figurinha (`nome`, `nomeLinhas` e `nomeCurto`) são
// derivados de `jogadores.js` conforme o
// [MDR 0008](../../docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md), com
// o mapeamento de posições das seleções e o corte prenomes/sobrenome.

import {
  jogadoresPorSelecao,
  jogadoresFWC,
  jogadoresCOC,
  nomesCurtosFWC,
} from "./jogadores.js";

/**
 * As 48 seleções classificadas, na ordem do Anexo de `requisitos.md`
 * (alfabética pelo código de três letras — a mesma usada nas figurinhas).
 * `icone` é o emoji Unicode da bandeira (ver ADR 0002 sobre como ele é
 * renderizado); Inglaterra e Escócia usam as sequências "tag" de bandeira
 * de subdivisão, como em `src/data/teams.js`.
 */
const selecoes = [
  { sigla: "ALG", nome: "Argélia", grupo: "J", paginas: [84, 85], icone: "🇩🇿" },
  { sigla: "ARG", nome: "Argentina", grupo: "J", paginas: [82, 83], icone: "🇦🇷" },
  { sigla: "AUS", nome: "Austrália", grupo: "D", paginas: [36, 37], icone: "🇦🇺" },
  { sigla: "AUT", nome: "Áustria", grupo: "J", paginas: [86, 87], icone: "🇦🇹" },
  { sigla: "BEL", nome: "Bélgica", grupo: "G", paginas: [58, 59], icone: "🇧🇪" },
  { sigla: "BIH", nome: "Bósnia-Herzegovina", grupo: "B", paginas: [18, 19], icone: "🇧🇦" },
  { sigla: "BRA", nome: "Brasil", grupo: "C", paginas: [24, 25], icone: "🇧🇷" },
  { sigla: "CAN", nome: "Canadá", grupo: "B", paginas: [16, 17], icone: "🇨🇦" },
  { sigla: "CIV", nome: "Costa do Marfim", grupo: "E", paginas: [44, 45], icone: "🇨🇮" },
  { sigla: "COD", nome: "Congo DR", grupo: "K", paginas: [92, 93], icone: "🇨🇩" },
  { sigla: "COL", nome: "Colômbia", grupo: "K", paginas: [96, 97], icone: "🇨🇴" },
  { sigla: "CPV", nome: "Cabo Verde", grupo: "H", paginas: [68, 69], icone: "🇨🇻" },
  { sigla: "CRO", nome: "Croácia", grupo: "L", paginas: [100, 101], icone: "🇭🇷" },
  { sigla: "CUW", nome: "Curaçao", grupo: "E", paginas: [42, 43], icone: "🇨🇼" },
  { sigla: "CZE", nome: "Chéquia", grupo: "A", paginas: [14, 15], icone: "🇨🇿" },
  { sigla: "ECU", nome: "Equador", grupo: "E", paginas: [46, 47], icone: "🇪🇨" },
  { sigla: "EGY", nome: "Egito", grupo: "G", paginas: [60, 61], icone: "🇪🇬" },
  { sigla: "ENG", nome: "Inglaterra", grupo: "L", paginas: [98, 99], icone: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { sigla: "ESP", nome: "Espanha", grupo: "H", paginas: [66, 67], icone: "🇪🇸" },
  { sigla: "FRA", nome: "França", grupo: "I", paginas: [74, 75], icone: "🇫🇷" },
  { sigla: "GER", nome: "Alemanha", grupo: "E", paginas: [40, 41], icone: "🇩🇪" },
  { sigla: "GHA", nome: "Gana", grupo: "L", paginas: [102, 103], icone: "🇬🇭" },
  { sigla: "HAI", nome: "Haiti", grupo: "C", paginas: [28, 29], icone: "🇭🇹" },
  { sigla: "IRN", nome: "Irã", grupo: "G", paginas: [62, 63], icone: "🇮🇷" },
  { sigla: "IRQ", nome: "Iraque", grupo: "I", paginas: [78, 79], icone: "🇮🇶" },
  { sigla: "JOR", nome: "Jordânia", grupo: "J", paginas: [88, 89], icone: "🇯🇴" },
  { sigla: "JPN", nome: "Japão", grupo: "F", paginas: [50, 51], icone: "🇯🇵" },
  { sigla: "KOR", nome: "Coreia do Sul", grupo: "A", paginas: [12, 13], icone: "🇰🇷" },
  { sigla: "KSA", nome: "Arábia Saudita", grupo: "H", paginas: [70, 71], icone: "🇸🇦" },
  { sigla: "MAR", nome: "Marrocos", grupo: "C", paginas: [26, 27], icone: "🇲🇦" },
  { sigla: "MEX", nome: "México", grupo: "A", paginas: [8, 9], icone: "🇲🇽" },
  { sigla: "NED", nome: "Países Baixos", grupo: "F", paginas: [48, 49], icone: "🇳🇱" },
  { sigla: "NOR", nome: "Noruega", grupo: "I", paginas: [80, 81], icone: "🇳🇴" },
  { sigla: "NZL", nome: "Nova Zelândia", grupo: "G", paginas: [64, 65], icone: "🇳🇿" },
  { sigla: "PAN", nome: "Panamá", grupo: "L", paginas: [104, 105], icone: "🇵🇦" },
  { sigla: "PAR", nome: "Paraguai", grupo: "D", paginas: [34, 35], icone: "🇵🇾" },
  { sigla: "POR", nome: "Portugal", grupo: "K", paginas: [90, 91], icone: "🇵🇹" },
  { sigla: "QAT", nome: "Catar", grupo: "B", paginas: [20, 21], icone: "🇶🇦" },
  { sigla: "RSA", nome: "África do Sul", grupo: "A", paginas: [10, 11], icone: "🇿🇦" },
  { sigla: "SCO", nome: "Escócia", grupo: "C", paginas: [30, 31], icone: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { sigla: "SEN", nome: "Senegal", grupo: "I", paginas: [76, 77], icone: "🇸🇳" },
  { sigla: "SUI", nome: "Suíça", grupo: "B", paginas: [22, 23], icone: "🇨🇭" },
  { sigla: "SWE", nome: "Suécia", grupo: "F", paginas: [52, 53], icone: "🇸🇪" },
  { sigla: "TUN", nome: "Tunísia", grupo: "F", paginas: [54, 55], icone: "🇹🇳" },
  { sigla: "TUR", nome: "Turquia", grupo: "D", paginas: [38, 39], icone: "🇹🇷" },
  { sigla: "URU", nome: "Uruguai", grupo: "H", paginas: [72, 73], icone: "🇺🇾" },
  { sigla: "USA", nome: "Estados Unidos", grupo: "D", paginas: [32, 33], icone: "🇺🇸" },
  { sigla: "UZB", nome: "Uzbequistão", grupo: "K", paginas: [94, 95], icone: "🇺🇿" },
].map((selecao) => ({ ...selecao, tipo: "selecao", total: 20 }));

/**
 * Extras FIFA (`FWC`): troféu, mascotes e campeãs do passado — parte da
 * numeração oficial, mas sem seleção própria. As páginas físicas foram
 * confirmadas pelo humano a partir do álbum físico (0–3 e 106–109); o
 * cabeçalho da seção mostra a primeira, `0`, como nas demais seções (ver
 * TDR 0010).
 */
const fwc = {
  sigla: "FWC",
  nome: "Extras FIFA",
  tipo: "especial",
  icone: "🏆",
  grupo: null,
  paginas: [0, 1, 2, 3, 106, 107, 108, 109],
  inicio: 0,
  total: 20,
};

/**
 * Coca-Cola (`COC`): página especial que fecha o álbum físico, nas
 * páginas 112–113 (`requisitos.md` § Anexo).
 */
const coc = {
  sigla: "COC",
  nome: "Coca-Cola",
  tipo: "especial",
  icone: "🥤",
  grupo: null,
  paginas: [112, 113],
  total: 14,
};

/**
 * As 50 seções do catálogo. FWC abre e Coca-Cola fecha o array
 * (IDR 0028); as 48 seleções vão entre os dois, na ordem do Anexo —
 * agrupar ou ordenar para exibição é derivação de tela (Tarefa 0001-0003),
 * não desta lista.
 */
export const secoes = [fwc, ...selecoes, coc];

/** Rótulo fixo da posição 01 de cada seleção (escudo). */
const NOME_ESCUDO = "Escudo do time";

/** Rótulo fixo da posição 13 de cada seleção (foto do time). */
const NOME_FOTO = "Foto do time";

/**
 * Posições paisagem do FWC (cromo horizontal, como no álbum físico):
 * `FWC00`–`FWC03` e `FWC09`–`FWC19`; `FWC04`–`FWC08` são retrato — MDR 0006.
 * Chaveadas pelos dois dígitos da posição, como em `nomesCurtosFWC`.
 */
const POSICOES_PAISAGEM_FWC = new Set([
  "00",
  "01",
  "02",
  "03",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
]);

/**
 * Deriva `nome` e `nomeLinhas` de um jogador escrito como
 * "Prenomes/Sobrenome" (MDR 0008): com corte, `nome` é o texto completo sem a
 * barra e `nomeLinhas` é o par [prenomes, sobrenome]; sem barra, nome único,
 * `nomeLinhas` é [null, nome].
 */
function nomeDoJogador(escrito) {
  const corte = escrito.indexOf("/");
  if (corte === -1) {
    return { nome: escrito, nomeLinhas: [null, escrito] };
  }
  const prenomes = escrito.slice(0, corte);
  const sobrenome = escrito.slice(corte + 1);
  return { nome: `${prenomes} ${sobrenome}`, nomeLinhas: [prenomes, sobrenome] };
}

/**
 * Deriva `nome` e `nomeLinhas` de uma figurinha de seleção: posição 01 é o
 * escudo e 13 é a foto do time (sem corte); 02–12 e 14–20 são os jogadores
 * 1–11 e 12–18 da fonte (MDR 0008).
 */
function nomeDaSelecao(sigla, posicao) {
  if (posicao === 1) return { nome: NOME_ESCUDO, nomeLinhas: null };
  if (posicao === 13) return { nome: NOME_FOTO, nomeLinhas: null };
  const indice = posicao < 13 ? posicao - 2 : posicao - 3;
  return nomeDoJogador(jogadoresPorSelecao[sigla][indice]);
}

/**
 * Deriva `nome`, `nomeLinhas` e `nomeCurto` de uma figurinha conforme o
 * MDR 0008: seleções pelo mapeamento de posição; FWC a partir de zero; COC a
 * partir de um. Extras FIFA e Coca-Cola não têm corte (`nomeLinhas: null`),
 * mesmo quando o nome traz barra literal. `nomeCurto` só é preenchido nas
 * paisagens do FWC (MDR 0006); nas demais figurinhas é `null`.
 */
function nomeDaFigurinha(secao, posicao) {
  if (secao.tipo === "selecao") {
    return { ...nomeDaSelecao(secao.sigla, posicao), nomeCurto: null };
  }
  if (secao.sigla === "FWC") {
    return {
      nome: jogadoresFWC[posicao],
      nomeLinhas: null,
      nomeCurto: nomesCurtosFWC[String(posicao).padStart(2, "0")] ?? null,
    };
  }
  return { nome: jogadoresCOC[posicao - 1], nomeLinhas: null, nomeCurto: null };
}

/**
 * Expande as seções em figurinhas individuais: `SIG01`…`SIG20` para cada
 * seleção, `FWC00`…`FWC19`, `COC01`…`COC14`. Função pura — preferida a
 * escrever os 994 códigos como literais (o dado que varia por seção é
 * pouco, e a expansão é conferível pelo teste de invariantes da Tarefa
 * 0001-0003).
 *
 * Marca as posições fixas das seleções (`requisitos.md` § Glossário):
 * `01` é o escudo (metalizada) e `13` é a foto da seleção (paisagem,
 * cromo horizontal). Os especiais não têm posição fixa definida — a
 * fonte do checklist não trouxe outras metalizadas além da 01 de cada
 * seleção, e o campo `metalizada` já nasce pronto para recebê-las
 * (ver TDR 0010).
 *
 * A paisagem não é só a 13 das seleções: `FWC00`–`FWC03` e `FWC09`–`FWC19`
 * também são paisagem, como no cromo físico, e são as únicas figurinhas com
 * `nomeCurto` preenchido (MDR 0006, MDR 0008).
 *
  * Cada seção usa `inicio` (opcional, padrão `1`) como número da primeira
  * figurinha; `total` é sempre a quantidade, nunca o último número. O FWC
  * usa `inicio: 0` porque a numeração oficial vai de `FWC00` a `FWC19`
  * (ver TDR 0010).
 *
 * @param {typeof secoes} secoesDoCatalogo
 */
export function expandirFigurinhas(secoesDoCatalogo) {
  const figurinhas = [];
  for (const secao of secoesDoCatalogo) {
    const inicio = secao.inicio ?? 1;
    for (let posicao = inicio; posicao < inicio + secao.total; posicao += 1) {
      const numero = String(posicao).padStart(2, "0");
      figurinhas.push({
        codigo: `${secao.sigla}${numero}`,
        secao: secao.sigla,
        posicao,
        metalizada: secao.tipo === "selecao" && posicao === 1,
        paisagem:
          (secao.tipo === "selecao" && posicao === 13) ||
          (secao.sigla === "FWC" && POSICOES_PAISAGEM_FWC.has(numero)),
        ...nomeDaFigurinha(secao, posicao),
      });
    }
  }
  return figurinhas;
}

/** As 994 figurinhas do catálogo, expandidas de `secoes`. */
export const figurinhas = expandirFigurinhas(secoes);
