// Copyright (c) 2026 Daniel Felix Ferber

import './Controles.css';

const ORDENACOES = [
  {
    valor: 'pagina',
    rotulo: 'P\u00e1gina',
    nomeAcessivel: 'ordenar pela p\u00e1gina do \u00e1lbum',
  },
  {
    valor: 'sigla',
    rotulo: 'Sigla',
    nomeAcessivel: 'ordenar pela sigla da se\u00e7\u00e3o',
  },
];

/**
 * Linha de controles logo abaixo do t\u00edtulo: grupo segmentado de ordena\u00e7\u00e3o
 * (P\u00e1gina | Sigla) e \u00e1rea reservada \u00e0 direita para os comandos que chegam
 * na Fase 8 (desfazer e menu).
 *
 * @param {object} props
 * @param {'pagina'|'sigla'} props.ordenacao - ordena\u00e7\u00e3o vigente.
 * @param {(ordenacao: 'pagina'|'sigla') => void} props.onTrocarOrdenacao - callback de troca.
 */
export function Controles({ ordenacao, onTrocarOrdenacao }) {
  return (
    <div className="controles">
      <div className="controles__segmentado" role="group" aria-label="Ordena\u00e7\u00e3o do cat\u00e1logo">
        {ORDENACOES.map((opcao) => {
          const ativa = opcao.valor === ordenacao;
          return (
            <button
              key={opcao.valor}
              type="button"
              className={`controles__opcao${ativa ? ' controles__opcao--ativa' : ''}`}
              aria-pressed={ativa}
              aria-label={opcao.nomeAcessivel}
              onClick={() => onTrocarOrdenacao(opcao.valor)}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
      <div className="controles__direita" aria-hidden="true" />
    </div>
  );
}
