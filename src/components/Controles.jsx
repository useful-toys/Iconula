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

const DISPOSICOES = [
  {
    valor: 'lista',
    rotulo: 'Lista',
    nomeAcessivel: 'disposi\u00e7\u00e3o em lista cont\u00ednua',
  },
  {
    valor: 'album',
    rotulo: '\u00c1lbum',
    nomeAcessivel: 'disposi\u00e7\u00e3o como no \u00e1lbum',
  },
];

const FILTROS = [
  {
    valor: 'todas',
    rotulo: 'Todas',
    nomeAcessivel: 'mostrar todas as figurinhas',
  },
  {
    valor: 'faltantes',
    rotulo: 'Falt.',
    nomeAcessivel: 'mostrar apenas as figurinhas faltantes',
  },
  {
    valor: 'repetidas',
    rotulo: 'Rep.',
    nomeAcessivel: 'mostrar apenas as figurinhas repetidas',
  },
];

/**
 * Linha de controles logo abaixo do t\u00edtulo: grupos segmentados de ordena\u00e7\u00e3o
 * (P\u00e1gina | Sigla), disposi\u00e7\u00e3o (Lista | \u00c1lbum) e filtro (Todas | Falt. |
 * Rep.), mais \u00e1rea reservada \u00e0 direita para os comandos que chegam na Fase 8
 * (desfazer e menu).
 *
 * O grupo de filtro s\u00f3 aparece quando a disposi\u00e7\u00e3o \u00e9 lista (IDR 0001, IDR 0023).
 *
 * @param {object} props
 * @param {'pagina'|'sigla'} props.ordenacao - ordena\u00e7\u00e3o vigente.
 * @param {(ordenacao: 'pagina'|'sigla') => void} props.onTrocarOrdenacao - callback de troca.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposi\u00e7\u00e3o vigente.
 * @param {(disposicao: 'lista'|'album') => void} [props.onTrocarDisposicao] - callback de troca.
 * @param {'todas'|'faltantes'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {(filtro: 'todas'|'faltantes'|'repetidas') => void} [props.onTrocarFiltro] - callback de troca de filtro.
 */
export function Controles({ ordenacao, onTrocarOrdenacao, disposicao = 'lista', onTrocarDisposicao, filtro = 'todas', onTrocarFiltro }) {
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
      {onTrocarDisposicao && (
        <div className="controles__segmentado" role="group" aria-label="Disposi\u00e7\u00e3o do cat\u00e1logo">
          {DISPOSICOES.map((opcao) => {
            const ativa = opcao.valor === disposicao;
            return (
              <button
                key={opcao.valor}
                type="button"
                className={`controles__opcao${ativa ? ' controles__opcao--ativa' : ''}`}
                aria-pressed={ativa}
                aria-label={opcao.nomeAcessivel}
                onClick={() => onTrocarDisposicao(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      )}
      {disposicao === 'lista' && onTrocarFiltro && (
        <div className="controles__segmentado" role="group" aria-label="Filtro de status">
          {FILTROS.map((opcao) => {
            const ativa = opcao.valor === filtro;
            return (
              <button
                key={opcao.valor}
                type="button"
                className={`controles__opcao${ativa ? ' controles__opcao--ativa' : ''}`}
                aria-pressed={ativa}
                aria-label={opcao.nomeAcessivel}
                onClick={() => onTrocarFiltro(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      )}
      <div className="controles__direita" aria-hidden="true" />
    </div>
  );
}
