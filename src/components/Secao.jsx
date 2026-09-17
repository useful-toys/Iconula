// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useId, memo } from 'react';
import { calcularPlacar } from '../lib/progresso.js';
import { urlDoIcone } from '../lib/bandeira.js';
import { layoutDeSecao, paresDePaginas } from '../data/catalogoLayout.js';
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
  const pagina = `${secao.paginas[0]}`;

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
 * @param {(codigo: string, delta: number) => void} [props.onAjustar] - callback de ajuste; ausente, os cartões ficam inertes (IDR 0055).
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

  // Na disposição álbum, toda seção usa o layout, inclusive o FWC (IDR 0023)
  const layout = disposicao === 'album' ? layoutDeSecao(secao) : null;
  const usaAlbum = layout !== null;

  // Na lista, aplica o filtro de status (IDR 0001, IDR 0025)
  const listaFiltrada = usaAlbum
    ? figurinhas
    : figurinhas.filter((f) => filtraFigurinha(contagens, f.codigo, filtro));

  return (
    <section className={`secao secao--${secao.sigla.toLowerCase()}`}>
      <div className="secao__moldura">
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
                    nome={figurinha.nome}
                    nomeLinhas={figurinha.nomeLinhas}
                    nomeCurto={figurinha.nomeCurto}
                    variante="lista"
                    paisagem={figurinha.paisagem}
                    onIncrementar={
                      onAjustar ? () => onAjustar(figurinha.codigo, 1) : undefined
                    }
                    onDecrementar={
                      onAjustar ? () => onAjustar(figurinha.codigo, -1) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}, propsEquivalentes);

/**
 * Corpo da seção na disposição álbum: um contêiner por par de páginas
 * (spread) do layout, na ordem, cada um com as páginas do par lado a
 * lado quando cabem e empilhadas quando não (IDR 0015); pares seguidos
 * ficam `--album-page-gap` um abaixo do outro (IDR 0023, MDR 0006). No
 * FWC, cada página ganha a casa de 70px e a moldura (IDR 0023).
 */
function CorpoAlbum({ secao, figurinhas, layout, contagens, onAjustar }) {
  // Agrupa posições por página
  const posicoesPorPagina = new Map();
  for (const pos of layout.posicoes) {
    const lista = posicoesPorPagina.get(pos.pagina) ?? [];
    lista.push(pos);
    posicoesPorPagina.set(pos.pagina, lista);
  }

  const pares = paresDePaginas(layout.paginas);
  const comMoldura = secao.sigla === 'FWC';

  return (
    <div className="secao__album">
      {pares.map((par) => (
        <div className="secao__album__par" key={par[0].pagina}>
          {par.map((pagina) => (
            <PaginaDoAlbum
              key={pagina.pagina}
              pagina={pagina}
              figurinhas={figurinhas}
              posicoes={posicoesPorPagina.get(pagina.pagina) ?? []}
              contagens={contagens}
              onAjustar={onAjustar}
              comMoldura={comMoldura}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
