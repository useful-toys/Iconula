// Copyright (c) 2026 Daniel Felix Ferber

import './Figurinha.css';

/**
 * Cartão de uma figurinha do álbum.
 *
 * Apresentacional e controlado por props: recebe o código, a contagem, se é
 * metalizada, a variante de tamanho e os callbacks de incremento/decremento.
 * Não armazena estado nem conhece a coleção.
 *
 * @param {object} props
 * @param {string} props.codigo - código da figurinha (ex.: "BRA05").
 * @param {number} props.contagem - unidades registradas (0 a 99).
 * @param {boolean} [props.metalizada] - indica figurinha metalizada/especial.
 * @param {'lista' | 'album'} [props.variante='lista'] - tamanho do cartão.
 * @param {() => void} props.onIncrementar - chamado ao tocar no cartão.
 * @param {() => void} props.onDecrementar - chamado ao tocar no controle de menos.
 */
export function Figurinha({
  codigo,
  contagem,
  metalizada = false,
  variante = 'lista',
  onIncrementar,
  onDecrementar,
}) {
  const sigla = codigo.slice(0, 3);
  const numero = codigo.slice(3);
  const sobrando = Math.max(0, contagem - 1);

  let estadoClasse = 'figurinha--faltante';
  let estadoLabel = 'faltante';
  if (contagem === 1) {
    estadoClasse = 'figurinha--colada';
    estadoLabel = 'colada';
  } else if (contagem >= 2) {
    estadoClasse = 'figurinha--repetida';
    estadoLabel = `colada, ${sobrando} sobrando`;
  }

  return (
    <div className={`figurinha figurinha--${variante} ${estadoClasse}`}>
      <button
        type="button"
        className="figurinha__corpo"
        aria-label={`${sigla} ${numero}, ${estadoLabel}`}
        onClick={onIncrementar}
      >
        {metalizada && (
          <span className="figurinha__metalizada" aria-hidden="true" />
        )}
        <span className="figurinha__codigo" aria-hidden="true">
          <span className="figurinha__sigla">{sigla}</span>
          <span className="figurinha__numero">{numero}</span>
        </span>
        {contagem >= 2 && (
          <span className="figurinha__selo" aria-hidden="true">
            ×{sobrando}
          </span>
        )}
      </button>
      <button
        type="button"
        className="figurinha__menos"
        aria-label={`remover uma unidade de ${sigla} ${numero}`}
        onClick={(event) => {
          event.stopPropagation();
          onDecrementar();
        }}
      >
        −
      </button>
    </div>
  );
}
