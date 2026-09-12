// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useId, memo } from 'react';
import { calcularPlacar } from '../lib/progresso.js';
import { urlDoIcone } from '../lib/bandeira.js';
import { layoutDeSecao } from '../data/catalogoLayout.js';
import { filtraFigurinha } from '../lib/colecao.js';
import { Figurinha } from './Figurinha.jsx';
import { PaginaDoAlbum } from './PaginaDoAlbum.jsx';
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
 * Compara props para `memo`: os campos primitivos e de referência bastam
 * por igualdade estrita, exceto `contagens` — o mapa inteiro tem uma
 * identidade nova a cada ajuste em qualquer figurinha do catálogo (Tarefa
 * 0010-0002). Em vez de tratar isso como "mudou", confere só as contagens
 * das figurinhas desta seção (~20 códigos): se nenhuma delas mudou de
 * valor, a seção pode pular a re-renderização mesmo com um mapa novo.
 *
 * `figurinhas` já chega com a mesma referência entre ajustes (mapa
 * memoizado em `Catalogo`/`SuperGrupo`, por seção), então este confronto
 * não recalcula nada além do necessário.
 *
 * @param {object} anterior
 * @param {object} seguinte
 * @returns {boolean} true se a seção pode pular a re-renderização.
 */
function propsEquivalentes(anterior, seguinte) {
  if (
    anterior.secao !== seguinte.secao ||
    anterior.figurinhas !== seguinte.figurinhas ||
    anterior.onAjustar !== seguinte.onAjustar ||
    anterior.expandida !== seguinte.expandida ||
    anterior.onToggle !== seguinte.onToggle ||
    anterior.disposicao !== seguinte.disposicao ||
    anterior.filtro !== seguinte.filtro
  ) {
    return false;
  }
  if (anterior.contagens === seguinte.contagens) return true;
  return seguinte.figurinhas.every(
    (f) => (anterior.contagens[f.codigo] ?? 0) === (seguinte.contagens[f.codigo] ?? 0),
  );
}

/**
 * Seção do catálogo: cabeçalho com resumo e grade de figurinhas em lista
 * ou disposição álbum, conforme a disposição vigente.
 *
 * Memoizada (Tarefa 0010-0002, TDR 0021): ajustar uma figurinha não pode
 * re-renderizar as outras 49 seções do catálogo — ver `propsEquivalentes`.
 *
 * @param {object} props
 * @param {object} props.secao - objeto da seção (catálogo.js).
 * @param {Array<{codigo: string; metalizada: boolean}>} props.figurinhas - figurinhas da seção.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {boolean} [props.expandida] - se a seção está expandida (controlado); se omitido, usa estado interno.
 * @param {() => void} [props.onToggle] - callback para alternar colapso (controlado).
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente (só aplica na lista).
 */
export const Secao = memo(function Secao({
  secao,
  figurinhas,
  contagens,
  onAjustar,
  expandida: expandidaProp,
  onToggle: onToggleProp,
  disposicao = 'lista',
  filtro = 'todas',
}) {
  const corpoId = useId();
  const codigos = figurinhas.map((f) => f.codigo);

  // Estado interno quando não controlado externamente
  const [expandidaInterna, setExpandidaInterna] = useState(true);
  const isControlado = expandidaProp !== undefined;
  const expandida = isControlado ? expandidaProp : expandidaInterna;
  const onToggle = isControlado ? onToggleProp : () => setExpandidaInterna((e) => !e);

  // FWC sempre em lista (IDR 0023)
  const layout = disposicao === 'album' ? layoutDeSecao(secao) : null;
  const usaAlbum = layout !== null;

  // Na lista, aplica o filtro de status (IDR 0001, IDR 0025)
  const listaFiltrada = usaAlbum
    ? figurinhas
    : figurinhas.filter((f) => filtraFigurinha(contagens, f.codigo, filtro));

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
        <div className="secao__corpo" id={corpoId}>
          {usaAlbum ? (
            <CorpoAlbum
              secao={secao}
              figurinhas={figurinhas}
              layout={layout}
              contagens={contagens}
              onAjustar={onAjustar}
            />
          ) : (
            <div className="secao__grade">
              {listaFiltrada.map((figurinha) => (
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
        </div>
      )}
    </section>
  );
}, propsEquivalentes);

/**
 * Corpo da seção na disposição álbum: agrupa as figurinhas em páginas
 * conforme o layout e renderiza cada página com o componente PaginaDoAlbum.
 */
function CorpoAlbum({ secao, figurinhas, layout, contagens, onAjustar }) {
  // Agrupa posições por página
  const posicoesPorPagina = new Map();
  for (const pos of layout) {
    const lista = posicoesPorPagina.get(pos.pagina) ?? [];
    lista.push(pos);
    posicoesPorPagina.set(pos.pagina, lista);
  }

  const paginas = Array.from(posicoesPorPagina.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="secao__album">
      {paginas.map(([numPagina, posicoes]) => (
        <PaginaDoAlbum
          key={numPagina}
          secao={secao}
          figurinhas={figurinhas}
          posicoes={posicoes}
          contagens={contagens}
          onAjustar={onAjustar}
        />
      ))}
    </div>
  );
}
