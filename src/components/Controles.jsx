// Copyright (c) 2026 Daniel Felix Ferber

import './Controles.css';

// \u00cdcones Material Symbols em SVG inline, no mesmo padr\u00e3o do bot\u00e3o
// compartilhar (`MenuDeCompartilhar.jsx`): `<path>` copiado dos arquivos
// vendorizados na Tarefa 0030-0002 (`src/assets/material-*.svg`), n\u00e3o
// importado como arquivo \u2014 ver `docs/tdr/0026-icones-material-symbols-vendorizados-como-svg.md`
// e `docs/idr/0059-rotulos-compactos-dos-controles.md`.
function IconNumbers() {
  return (
    <svg viewBox="0 -960 960 960" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="m240-160 40-160H120l20-80h160l40-160H180l20-80h160l40-160h80l-40 160h160l40-160h80l-40 160h160l-20 80H660l-40 160h160l-20 80H600l-40 160h-80l40-160H360l-40 160h-80Zm140-240h160l40-160H420l-40 160Z" />
    </svg>
  );
}

function IconSortByAlpha() {
  return (
    <svg viewBox="0 -960 960 960" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="m80-280 150-400h86l150 400h-82l-34-96H196l-32 96H80Zm140-164h104l-48-150h-6l-50 150Zm328 164v-76l202-252H556v-72h282v76L638-352h202v72H548ZM360-760l120-120 120 120H360ZM480-80 360-200h240L480-80Z" />
    </svg>
  );
}

function IconViewList() {
  return (
    <svg viewBox="0 -960 960 960" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" />
    </svg>
  );
}

function IconViewModule() {
  return (
    <svg viewBox="0 -960 960 960" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M627-520h133v-160H627v160Zm-214 0h133v-160H413v160Zm-213 0h133v-160H200v160Zm0 240h133v-160H200v160Zm213 0h133v-160H413v160Zm214 0h133v-160H627v160Zm-507 0v-400q0-33 23.5-56.5T200-760h560q33 0 56.5 23.5T840-680v400q0 33-23.5 56.5T760-200H200q-33 0-56.5-23.5T120-280Z" />
    </svg>
  );
}

const ORDENACOES = [
  {
    valor: 'pagina',
    rotulo: <IconNumbers />,
    nomeAcessivel: 'ordenar pela p\u00e1gina do \u00e1lbum',
  },
  {
    valor: 'sigla',
    rotulo: <IconSortByAlpha />,
    nomeAcessivel: 'ordenar pela sigla da se\u00e7\u00e3o',
  },
];

const DISPOSICOES = [
  {
    valor: 'lista',
    rotulo: <IconViewList />,
    nomeAcessivel: 'disposi\u00e7\u00e3o em lista cont\u00ednua',
  },
  {
    valor: 'album',
    rotulo: <IconViewModule />,
    nomeAcessivel: 'disposi\u00e7\u00e3o como no \u00e1lbum',
  },
];

// Filtro em glifos de texto \u2014 ecoando o cart\u00e3o vazio/preenchido e o selo
// `\u00d7N` (IDR 0059); `Todas` continua por extenso.
const FILTROS = [
  {
    valor: 'todas',
    rotulo: 'Todas',
    nomeAcessivel: 'mostrar todas as figurinhas',
  },
  {
    valor: 'faltantes',
    rotulo: '\u25af',
    nomeAcessivel: 'mostrar apenas as figurinhas faltantes',
  },
  {
    valor: 'coladas',
    rotulo: '\u25ae',
    nomeAcessivel: 'mostrar apenas as figurinhas coladas',
  },
  {
    valor: 'repetidas',
    rotulo: '\u00d7',
    nomeAcessivel: 'mostrar apenas as figurinhas repetidas',
  },
];

/**
 * Linha de controles do cabeçalho: grupos segmentados de ordenação
 * (ícone `numbers` | `sort_by_alpha`), disposição (ícone `view_list` |
 * `view_module`) e filtro (Todas | ▯ | ▮ | ×), mais o desfazer (`↺`) colado
 * à direita (Tarefa 0009-0001, rótulos compactos na Tarefa 0030-0003).
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
