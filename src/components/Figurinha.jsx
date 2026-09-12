// Copyright (c) 2026 Daniel Felix Ferber

import { memo, useRef } from 'react';
import './Figurinha.css';

/**
 * Compara props para `memo`, ignorando deliberadamente `onIncrementar` e
 * `onDecrementar`: são fechos recriados a cada render do pai (`() =>
 * onAjustar(codigo, 1)`), mas equivalentes entre si enquanto `codigo` (chave
 * do mapa, nunca muda para um cartão) e `onAjustar` (estabilizado em
 * `App.jsx`) não mudarem — o que os demais campos comparados já cobrem.
 * Sem isto, um cartão re-renderizaria mesmo com `contagem` idêntica, só
 * porque o pai recriou o fecho (Tarefa 0010-0002, TDR 0021).
 *
 * @param {object} anterior
 * @param {object} seguinte
 * @returns {boolean} true se o cartão pode pular a re-renderização.
 */
function propsEquivalentes(anterior, seguinte) {
  return (
    anterior.codigo === seguinte.codigo &&
    anterior.contagem === seguinte.contagem &&
    anterior.metalizada === seguinte.metalizada &&
    anterior.variante === seguinte.variante &&
    anterior.paisagem === seguinte.paisagem
  );
}

/**
 * Cartão de uma figurinha do álbum.
 *
 * Apresentacional e controlado por props: recebe o código, a contagem, se é
 * metalizada, a variante de tamanho e os callbacks de incremento/decremento.
 * Não armazena estado nem conhece a coleção.
 *
 * Memoizado (Tarefa 0010-0002, TDR 0021): com 994 cartões em tela, ajustar
 * um deles não pode re-renderizar os outros 993 — ver `propsEquivalentes`.
 *
 * @param {object} props
 * @param {string} props.codigo - código da figurinha (ex.: "BRA05").
 * @param {number} props.contagem - unidades registradas (0 a 99).
 * @param {boolean} [props.metalizada] - indica figurinha metalizada/especial.
 * @param {'lista' | 'album'} [props.variante='lista'] - tamanho do cartão.
 * @param {boolean} [props.paisagem=false] - figurinha em paisagem (ocupa 2 trilhas).
 * @param {() => void} props.onIncrementar - chamado ao tocar no cartão.
 * @param {() => void} props.onDecrementar - chamado ao tocar no controle de menos.
 */
export const Figurinha = memo(function Figurinha({
  codigo,
  contagem,
  metalizada = false,
  variante = 'lista',
  paisagem = false,
  onIncrementar,
  onDecrementar,
}) {
  const corpoRef = useRef(null);
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
  // A marca de metalizada (ponto dourado, aria-hidden) só é visual — o nome
  // acessível precisa dizer por extenso o mesmo estado (IDR 0042).
  if (metalizada) {
    estadoLabel += ', metalizada';
  }

  const classes = [
    'figurinha',
    `figurinha--${variante}`,
    paisagem ? 'figurinha--paisagem' : '',
    estadoClasse,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <button
        type="button"
        className="figurinha__corpo"
        ref={corpoRef}
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
      {contagem >= 1 && (
        <button
          type="button"
          className="figurinha__menos"
          aria-label={`remover uma unidade de ${sigla} ${numero}`}
          onClick={(event) => {
            event.stopPropagation();
            onDecrementar();
            if (contagem === 1) {
              corpoRef.current?.focus();
            }
          }}
        >
          −
        </button>
      )}
    </div>
  );
}, propsEquivalentes);
