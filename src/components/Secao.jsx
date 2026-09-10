// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useId } from 'react';
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
 * @param {boolean} props.expandida - se a seção está expandida.
 * @param {() => void} props.onToggle - callback para alternar colapso.
 * @param {string} props.corpoId - id do corpo da seção para aria-controls.
 */
function CabecalhoSecao({ secao, codigos, contagens, expandida, onToggle, corpoId }) {
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
    expandida ? 'expandido' : 'colapsado',
  ].join(', ');

  return (
    <button
      type="button"
      className="secao__cabecalho"
      aria-expanded={expandida}
      aria-controls={corpoId}
      aria-label={nomeAcessivel}
      onClick={onToggle}
    >
      <span className="secao__chevron" aria-hidden="true">
        {expandida ? '▾' : '▸'}
      </span>
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
    </button>
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
 * @param {boolean} [props.expandida] - se a seção está expandida (controlado); se omitido, usa estado interno.
 * @param {() => void} [props.onToggle] - callback para alternar colapso (controlado).
 */
export function Secao({
  secao,
  figurinhas,
  contagens,
  onAjustar,
  expandida: expandidaProp,
  onToggle: onToggleProp,
}) {
  const corpoId = useId();
  const codigos = figurinhas.map((f) => f.codigo);

  // Estado interno quando não controlado externamente
  const [expandidaInterna, setExpandidaInterna] = useState(true);
  const isControlado = expandidaProp !== undefined;
  const expandida = isControlado ? expandidaProp : expandidaInterna;
  const onToggle = isControlado ? onToggleProp : () => setExpandidaInterna((e) => !e);

  return (
    <section className="secao">
      <CabecalhoSecao
        secao={secao}
        codigos={codigos}
        contagens={contagens}
        expandida={expandida}
        onToggle={onToggle}
        corpoId={corpoId}
      />
      {expandida && (
        <div className="secao__grade" id={corpoId}>
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
      )}
    </section>
  );
}
