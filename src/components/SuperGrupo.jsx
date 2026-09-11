// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useImperativeHandle, forwardRef, useMemo } from 'react';
import { calcularPlacar } from '../lib/progresso.js';
import { filtraFigurinha } from '../lib/colecao.js';
import { Secao } from './Secao.jsx';
import './SuperGrupo.css';

/**
 * Super-grupo colapsável da ordenação por página do álbum: título com chevron,
 * nome (Grupo A…L) e progresso agregado das 4 seleções.
 *
 * @param {object} props
 * @param {string} props.grupo - letra do grupo (A–L).
 * @param {Array<object>} props.secoes - 4 seleções do grupo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - figurinhas das seções do grupo.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {(sigla: string) => boolean} props.isExpandida - função que retorna se uma seção está expandida.
 * @param {(sigla: string) => void} props.onToggleSecao - callback para alternar colapso de uma seção.
 * @param {import('react').RefObject<Map>} props.secaoRefs - mapa de refs das seções.
 * @param {(sigla: string, element: Element|null) => void} props.setSecaoRef - callback para registrar ref de uma seção.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {import('react').Ref<{ expandir: () => void }>} [props.ref] - ref para abrir programaticamente.
 */
export const SuperGrupo = forwardRef(function SuperGrupo(
  { grupo, secoes, figurinhas, contagens, onAjustar, isExpandida, onToggleSecao, setSecaoRef, disposicao = 'lista', filtro = 'todas' },
  ref,
) {
  const [expandido, setExpandido] = useState(true);

  useImperativeHandle(ref, () => ({
    expandir() {
      setExpandido(true);
    },
  }));

  const codigos = figurinhas.map((f) => f.codigo);
  const placar = calcularPlacar(contagens, codigos);
  const total = codigos.length;

  const figurinhasPorSecao = useMemo(() => {
    const map = new Map();
    for (const figurinha of figurinhas) {
      const lista = map.get(figurinha.secao) ?? [];
      lista.push(figurinha);
      map.set(figurinha.secao, lista);
    }
    return map;
  }, [figurinhas]);

  const nomeAcessivel = [
    `Grupo ${grupo}`,
    `${placar.coladas} de ${total}`,
    `${placar.percentual} por cento`,
    `${placar.faltantes} faltantes`,
    `${placar.repetidas} repetidas`,
    expandido ? 'expandido' : 'colapsado',
  ].join(', ');

  // Filtra as seções visíveis: na lista, só as que têm alguma figurinha no estado filtrado
  const secoesVisiveis = disposicao === 'lista' && filtro !== 'todas'
    ? secoes.filter((secao) => {
        const secaoFigurinhas = figurinhasPorSecao.get(secao.sigla) ?? [];
        return secaoFigurinhas.some((f) => filtraFigurinha(contagens, f.codigo, filtro));
      })
    : secoes;

  return (
    <div className="super-grupo">
      <button
        type="button"
        className="super-grupo__titulo"
        aria-expanded={expandido}
        aria-label={nomeAcessivel}
        onClick={() => setExpandido((e) => !e)}
      >
        <span className="super-grupo__chevron" aria-hidden="true">
          {expandido ? '▾' : '▸'}
        </span>
        <span className="super-grupo__nome">Grupo {grupo}</span>
        <span className="super-grupo__sep" aria-hidden="true">
          ·
        </span>
        <span className="super-grupo__resumo">
          {placar.coladas}/{total}
        </span>
        <span className="super-grupo__sep" aria-hidden="true">
          ·
        </span>
        <span className="super-grupo__resumo">{placar.percentual}%</span>
        <span className="super-grupo__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">▢</span>
        <span className="super-grupo__resumo">{placar.faltantes}</span>
        <span className="super-grupo__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">×</span>
        <span className="super-grupo__resumo">{placar.repetidas}</span>
      </button>
      {expandido && (
        <div className="super-grupo__corpo">
          {secoesVisiveis.map((secao) => (
            <div
              key={secao.sigla}
              ref={(el) => setSecaoRef(secao.sigla, el)}
            >
              <Secao
                secao={secao}
                figurinhas={figurinhasPorSecao.get(secao.sigla) ?? []}
                contagens={contagens}
                onAjustar={onAjustar}
                expandida={isExpandida(secao.sigla)}
                onToggle={() => onToggleSecao(secao.sigla)}
                disposicao={disposicao}
                filtro={filtro}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
