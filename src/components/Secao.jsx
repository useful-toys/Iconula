// Copyright (c) 2026 Daniel Felix Ferber

import { calcularPlacar } from '../lib/progresso.js';
import { urlDoIcone } from '../lib/bandeira.js';
import { Figurinha } from './Figurinha.jsx';
import './Secao.css';

/**
 * Cabeçalho de uma seção do catálogo, com o resumo em notação compacta.
 *
 * @param {object} props
 * @param {object} props.secao - objeto da seção (catálogo.js).
 * @param {string[]} props.codigos - códigos das figurinhas da seção.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 */
function CabecalhoSecao({ secao, codigos, contagens }) {
  const { coladas, faltantes, repetidas, percentual } = calcularPlacar(
    contagens,
    codigos,
  );
  const total = codigos.length;
  const pagina = secao.paginas ? `${secao.paginas[0]}` : null;

  const identificacao = [secao.nome, secao.sigla, pagina]
    .filter(Boolean)
    .join(' ');

  const nomeAcessivel = [
    `${secao.nome}: ${coladas} de ${total}`,
    `${percentual} por cento`,
    `${faltantes} faltantes`,
    `${repetidas} repetidas`,
  ].join(', ');

  return (
    <header className="secao__cabecalho" aria-label={nomeAcessivel}>
      <img
        className="secao__icone"
        src={urlDoIcone(secao.icone)}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <h2 className="secao__titulo">
        <span className="secao__identificacao">{identificacao}</span>
        <span className="secao__sep" aria-hidden="true">
          ·
        </span>
        <span className="secao__resumo">
          {coladas}/{total}
        </span>
        <span className="secao__sep" aria-hidden="true">
          ·
        </span>
        <span className="secao__resumo">{percentual}%</span>
        <span className="secao__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">▢</span>
        <span className="secao__resumo">{faltantes}</span>
        <span className="secao__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">×</span>
        <span className="secao__resumo">{repetidas}</span>
      </h2>
    </header>
  );
}

/**
 * Seção do catálogo: cabeçalho com resumo e grade de figurinhas em lista.
 *
 * @param {object} props
 * @param {object} props.secao - objeto da seção (catálogo.js).
 * @param {Array<{codigo: string; metalizada: boolean}>} props.figurinhas - figurinhas da seção.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 */
export function Secao({ secao, figurinhas, contagens, onAjustar }) {
  const codigos = figurinhas.map((f) => f.codigo);

  return (
    <section className="secao">
      <CabecalhoSecao secao={secao} codigos={codigos} contagens={contagens} />
      <div className="secao__grade">
        {figurinhas.map((figurinha) => (
          <Figurinha
            key={figurinha.codigo}
            codigo={figurinha.codigo}
            contagem={contagens[figurinha.codigo] ?? 0}
            metalizada={figurinha.metalizada}
            variante="lista"
            onIncrementar={() => onAjustar(figurinha.codigo, 1)}
            onDecrementar={() => onAjustar(figurinha.codigo, -1)}
          />
        ))}
      </div>
    </section>
  );
}
