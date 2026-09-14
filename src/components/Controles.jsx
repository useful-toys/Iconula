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
    valor: 'coladas',
    rotulo: 'Col.',
    nomeAcessivel: 'mostrar apenas as figurinhas coladas',
  },
  {
    valor: 'repetidas',
    rotulo: 'Rep.',
    nomeAcessivel: 'mostrar apenas as figurinhas repetidas',
  },
];

/**
 * Linha de controles do cabeçalho: grupos segmentados de ordenação
 * (Página | Sigla), disposição (Lista | Álbum) e filtro (Todas | Falt. | Col. |
 * Rep.), mais o desfazer (`↺`) colado à direita (Tarefa 0009-0001).
 *
 * O avatar do usuário (menu de ações) não mora mais aqui: é um `slot` do
 * `Cabecalho`, preso à direita da primeira linha, ao lado do título
 * (Tarefa 0019-0001, IDR 0018/IDR 0049).
 *
 * O grupo de filtro só aparece quando a disposição é lista (IDR 0001, IDR 0023).
 *
 * @param {object} props
 * @param {'pagina'|'sigla'} props.ordenacao - ordenação vigente.
 * @param {(ordenacao: 'pagina'|'sigla') => void} props.onTrocarOrdenacao - callback de troca.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {(disposicao: 'lista'|'album') => void} [props.onTrocarDisposicao] - callback de troca.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {(filtro: 'todas'|'faltantes'|'coladas'|'repetidas') => void} [props.onTrocarFiltro] - callback de troca de filtro.
 * @param {boolean} [props.podeDesfazer=false] - há histórico para desfazer? (IDR 0012)
 * @param {() => void} [props.onDesfazer] - callback do botão de desfazer; sem ele, o botão não aparece.
 */
export function Controles({
  ordenacao,
  onTrocarOrdenacao,
  disposicao = 'lista',
  onTrocarDisposicao,
  filtro = 'todas',
  onTrocarFiltro,
  podeDesfazer = false,
  onDesfazer,
}) {
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
              data-tooltip={opcao.nomeAcessivel}
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
                data-tooltip={opcao.nomeAcessivel}
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
                data-tooltip={opcao.nomeAcessivel}
                onClick={() => onTrocarFiltro(opcao.valor)}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      )}
      <div className="controles__direita" aria-hidden={onDesfazer ? undefined : true}>
        {onDesfazer && (
          <button
            type="button"
            className="controles__desfazer"
            onClick={onDesfazer}
            disabled={!podeDesfazer}
            aria-label="desfazer a última alteração"
          >
            ↺
          </button>
        )}
      </div>
    </div>
  );
}
