// Copyright (c) 2026 Daniel Felix Ferber

import { describe, expect, it } from "vitest";
import { secoes, figurinhas, expandirFigurinhas } from "./catalogo.js";
import { ordenarPorSigla, ordenarPorPagina, extrairSecoes } from "./catalogoOrdenacoes.js";
import { layoutDeSecao } from "./catalogoLayout.js";

describe("invariantes do catálogo", () => {
  it("tem exatamente 994 figurinhas no total", () => {
    expect(figurinhas).toHaveLength(994);
  });

  it("tem exatamente 50 seções", () => {
    expect(secoes).toHaveLength(50);
  });

  it("cada seleção tem 20 figurinhas", () => {
    const selecoes = secoes.filter((s) => s.tipo === "selecao");
    for (const secao of selecoes) {
      const figs = figurinhas.filter((f) => f.secao === secao.sigla);
      expect(figs).toHaveLength(20);
    }
  });

  it("FWC tem 20 figurinhas de FWC00 a FWC19, sem buraco, e COC tem 14", () => {
    const fwc = figurinhas.filter((f) => f.secao === "FWC");
    const coc = figurinhas.filter((f) => f.secao === "COC");
    expect(fwc).toHaveLength(20);
    expect(coc).toHaveLength(14);
    const codigosFwc = fwc.map((f) => f.codigo);
    expect(codigosFwc).toEqual(
      Array.from({ length: 20 }, (_, i) => `FWC${String(i).padStart(2, "0")}`),
    );
  });

  it("nenhum código duplicado", () => {
    const codigos = figurinhas.map((f) => f.codigo);
    const unicos = new Set(codigos);
    expect(unicos.size).toBe(codigos.length);
  });

  it("todo código no formato três letras + dois dígitos", () => {
    const padrao = /^[A-Z]{3}\d{2}$/;
    for (const fig of figurinhas) {
      expect(fig.codigo).toMatch(padrao);
    }
  });

  it("toda seleção tem grupo A–L e FWC/COC não têm grupo", () => {
    const gruposValidos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    for (const secao of secoes) {
      if (secao.tipo === "selecao") {
        expect(gruposValidos).toContain(secao.grupo);
      } else {
        expect(secao.grupo).toBeNull();
      }
    }
  });

  it("páginas das seleções são distintas e nenhuma usa o bloco 56–57", () => {
    const selecoes = secoes.filter((s) => s.tipo === "selecao");
    const paginas = selecoes.map((s) => s.paginas.join("-"));
    const unicas = new Set(paginas);
    expect(unicas.size).toBe(selecoes.length);
    for (const secao of selecoes) {
      expect(secao.paginas).not.toContain(56);
      expect(secao.paginas).not.toContain(57);
    }
  });
});

describe("ordenações", () => {
  it("por sigla: 50 seções, FWC primeira, COC última", () => {
    const ordenada = ordenarPorSigla(secoes);
    expect(ordenada).toHaveLength(50);
    expect(ordenada[0].sigla).toBe("FWC");
    expect(ordenada[49].sigla).toBe("COC");
  });

  it("por página: 50 seções, FWC primeira, COC última", () => {
    const ordenada = ordenarPorPagina(secoes);
    const secoesExtraidas = extrairSecoes(ordenada);
    expect(secoesExtraidas).toHaveLength(50);
    expect(secoesExtraidas[0].sigla).toBe("FWC");
    expect(secoesExtraidas[49].sigla).toBe("COC");
  });

  it("as duas ordenações contêm exatamente as mesmas 50 seções", () => {
    const porSigla = ordenarPorSigla(secoes);
    const porPagina = extrairSecoes(ordenarPorPagina(secoes));
    const siglasSigla = porSigla.map((s) => s.sigla).sort();
    const siglasPagina = porPagina.map((s) => s.sigla).sort();
    expect(siglasSigla).toEqual(siglasPagina);
  });

  it("por sigla: seleções em ordem alfabética entre FWC e COC", () => {
    const ordenada = ordenarPorSigla(secoes);
    const selecoes = ordenada.slice(1, 49);
    const siglas = selecoes.map((s) => s.sigla);
    const ordenadas = [...siglas].sort();
    expect(siglas).toEqual(ordenadas);
  });

  it("por página: 12 super-grupos A–L na ordem das páginas", () => {
    const ordenada = ordenarPorPagina(secoes);
    const superGrupos = ordenada.filter((item) => item.tipo === "super-grupo");
    expect(superGrupos).toHaveLength(12);
    const grupos = superGrupos.map((sg) => sg.grupo);
    expect(grupos).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]);
  });

  it("por página: cada super-grupo tem 4 seleções na ordem das páginas", () => {
    const ordenada = ordenarPorPagina(secoes);
    const superGrupos = ordenada.filter((item) => item.tipo === "super-grupo");
    for (const sg of superGrupos) {
      expect(sg.secoes).toHaveLength(4);
      const paginas = sg.secoes.map((s) => s.paginas[0]);
      const ordenadas = [...paginas].sort((a, b) => a - b);
      expect(paginas).toEqual(ordenadas);
    }
  });
});

describe("layout de álbum", () => {
  it("FWC devolve null (sem layout de álbum)", () => {
    const fwc = secoes.find((s) => s.sigla === "FWC");
    expect(layoutDeSecao(fwc)).toBeNull();
  });

  it("layout de seleção cobre as 20 posições uma única vez", () => {
    const selecao = secoes.find((s) => s.sigla === "BRA");
    const layout = layoutDeSecao(selecao);
    expect(layout).toHaveLength(20);
    const posicoes = layout.map((p) => p.posicao).sort((a, b) => a - b);
    expect(posicoes).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it("layout de seleção: 01–02 nas trilhas 3–4 da linha 1, página 1", () => {
    const selecao = secoes.find((s) => s.sigla === "BRA");
    const layout = layoutDeSecao(selecao);
    const fig01 = layout.find((p) => p.posicao === 1);
    const fig02 = layout.find((p) => p.posicao === 2);
    expect(fig01.pagina).toBe(1);
    expect(fig01.linha).toBe(1);
    expect(fig01.trilha).toBe(3);
    expect(fig02.pagina).toBe(1);
    expect(fig02.linha).toBe(1);
    expect(fig02.trilha).toBe(4);
  });

  it("layout de seleção: 13 em paisagem nas trilhas 3–4 da linha 1, página 2", () => {
    const selecao = secoes.find((s) => s.sigla === "BRA");
    const layout = layoutDeSecao(selecao);
    const fig13 = layout.find((p) => p.posicao === 13);
    expect(fig13.pagina).toBe(2);
    expect(fig13.linha).toBe(1);
    expect(fig13.trilha).toBe(3);
    expect(fig13.trilhas).toBe(2);
  });

  it("layout de seleção: 18–20 nas trilhas 2–4 da linha 3, página 2", () => {
    const selecao = secoes.find((s) => s.sigla === "BRA");
    const layout = layoutDeSecao(selecao);
    const fig18 = layout.find((p) => p.posicao === 18);
    const fig19 = layout.find((p) => p.posicao === 19);
    const fig20 = layout.find((p) => p.posicao === 20);
    expect(fig18.pagina).toBe(2);
    expect(fig18.linha).toBe(3);
    expect(fig18.trilha).toBe(2);
    expect(fig19.pagina).toBe(2);
    expect(fig19.linha).toBe(3);
    expect(fig19.trilha).toBe(3);
    expect(fig20.pagina).toBe(2);
    expect(fig20.linha).toBe(3);
    expect(fig20.trilha).toBe(4);
  });

  it("layout da Coca-Cola: 6 na página 1 e 8 na página 2", () => {
    const coc = secoes.find((s) => s.sigla === "COC");
    const layout = layoutDeSecao(coc);
    expect(layout).toHaveLength(14);
    const pagina1 = layout.filter((p) => p.pagina === 1);
    const pagina2 = layout.filter((p) => p.pagina === 2);
    expect(pagina1).toHaveLength(6);
    expect(pagina2).toHaveLength(8);
  });

  it("layout da Coca-Cola: 13 e 14 nas duas primeiras posições da linha 3, página 2", () => {
    const coc = secoes.find((s) => s.sigla === "COC");
    const layout = layoutDeSecao(coc);
    const fig13 = layout.find((p) => p.posicao === 13);
    const fig14 = layout.find((p) => p.posicao === 14);
    expect(fig13.pagina).toBe(2);
    expect(fig13.linha).toBe(3);
    expect(fig13.trilha).toBe(1);
    expect(fig14.pagina).toBe(2);
    expect(fig14.linha).toBe(3);
    expect(fig14.trilha).toBe(2);
  });

  it("layout da Coca-Cola cobre as 14 posições uma única vez", () => {
    const coc = secoes.find((s) => s.sigla === "COC");
    const layout = layoutDeSecao(coc);
    const posicoes = layout.map((p) => p.posicao).sort((a, b) => a - b);
    expect(posicoes).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
  });

  it("todas as seleções têm o mesmo layout", () => {
    const selecoes = secoes.filter((s) => s.tipo === "selecao");
    const layoutBase = layoutDeSecao(selecoes[0]);
    for (const secao of selecoes) {
      const layout = layoutDeSecao(secao);
      expect(layout).toEqual(layoutBase);
    }
  });
});

describe("expandirFigurinhas", () => {
  it("gera códigos corretos para uma seleção", () => {
    const bra = secoes.find((s) => s.sigla === "BRA");
    const figs = expandirFigurinhas([bra]);
    expect(figs).toHaveLength(20);
    expect(figs[0].codigo).toBe("BRA01");
    expect(figs[19].codigo).toBe("BRA20");
  });

  it("numera a partir de `inicio` quando a seção não começa em 1", () => {
    const fwc = secoes.find((s) => s.sigla === "FWC");
    const figs = expandirFigurinhas([fwc]);
    expect(figs).toHaveLength(20);
    expect(figs[0].codigo).toBe("FWC00");
    expect(figs[0].posicao).toBe(0);
    expect(figs[19].codigo).toBe("FWC19");
    expect(figs[19].posicao).toBe(19);
  });

  it("marca a posição 01 como metalizada e 13 como paisagem", () => {
    const bra = secoes.find((s) => s.sigla === "BRA");
    const figs = expandirFigurinhas([bra]);
    const fig01 = figs.find((f) => f.posicao === 1);
    const fig13 = figs.find((f) => f.posicao === 13);
    expect(fig01.metalizada).toBe(true);
    expect(fig13.paisagem).toBe(true);
  });

  it("especiais não têm metalizada nem paisagem", () => {
    const fwc = secoes.find((s) => s.sigla === "FWC");
    const figs = expandirFigurinhas([fwc]);
    for (const fig of figs) {
      expect(fig.metalizada).toBe(false);
      expect(fig.paisagem).toBe(false);
    }
  });
});
