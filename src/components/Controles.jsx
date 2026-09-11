// Copyright (c) 2026 Daniel Felix Ferber

import { MenuDeAcoes } from './MenuDeAcoes.jsx';
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
 * Linha de controles logo abaixo do t\u00edtulo: grupos segmentados de ordena\u00e7\u00e3o
 * (P\u00e1gina | Sigla), disposi\u00e7\u00e3o (Lista | \u00c1lbum) e filtro (Todas | Falt. | Col. |
 * Rep.), mais os comandos \u00e0 direita: desfazer (Tarefa 0009-0001) e o menu de
 * a\u00e7\u00f5es (Tarefa 0009-0002).
 *
 * O grupo de filtro s\u00f3 aparece quando a disposi\u00e7\u00e3o \u00e9 lista (IDR 0001, IDR 0023).
 *
 * @param {object} props
 * @param {'pagina'|'sigla'} props.ordenacao - ordena\u00e7\u00e3o vigente.
 * @param {(ordenacao: 'pagina'|'sigla') => void} props.onTrocarOrdenacao - callback de troca.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposi\u00e7\u00e3o vigente.
 * @param {(disposicao: 'lista'|'album') => void} [props.onTrocarDisposicao] - callback de troca.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {(filtro: 'todas'|'faltantes'|'coladas'|'repetidas') => void} [props.onTrocarFiltro] - callback de troca de filtro.
 * @param {boolean} [props.podeDesfazer=false] - h\u00e1 hist\u00f3rico para desfazer? (IDR 0012)
 * @param {() => void} [props.onDesfazer] - callback do bot\u00e3o de desfazer; sem ele, o bot\u00e3o n\u00e3o aparece.
 * @param {() => void} [props.onSignOut] - grava o pendente e sai da conta (Tarefa 0009-0002); sem ele, o menu de a\u00e7\u00f5es n\u00e3o aparece.
 * @param {() => void} [props.onCopiarFaltantes] - copia o texto de troca das faltantes (Tarefa 0009-0003); sem ele, o item do menu fica desabilitado.
 * @param {() => void} [props.onCopiarRepetidas] - copia o texto de troca das repetidas (Tarefa 0009-0003); sem ele, o item do menu fica desabilitado.
 * @param {() => void} [props.onExportar] - exporta a coleção em JSON (Tarefa 0009-0004); sem ele, o item do menu fica desabilitado.
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
  onSignOut,
  onCopiarFaltantes,
  onCopiarRepetidas,
  onExportar,
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
      <div className="controles__direita" aria-hidden={onDesfazer || onSignOut ? undefined : true}>
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
        {onSignOut && (
          <MenuDeAcoes
            onSignOut={onSignOut}
            onCopiarFaltantes={onCopiarFaltantes}
            onCopiarRepetidas={onCopiarRepetidas}
            onExportar={onExportar}
          />
        )}
      </div>
    </div>
  );
}
