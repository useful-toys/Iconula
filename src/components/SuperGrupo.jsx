// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useImperativeHandle, forwardRef, useMemo } from 'react';
import { calcularPlacar } from '../lib/progresso.js';
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
 * @param {import('react').Ref<{ expandir: () => void }>} [props.ref] - ref para abrir programaticamente.
 */
export const SuperGrupo = forwardRef(function SuperGrupo(
  { grupo, secoes, figurinhas, contagens, onAjustar },
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
          {secoes.map((secao) => (
            <Secao
              key={secao.sigla}
              secao={secao}
              figurinhas={figurinhasPorSecao.get(secao.sigla) ?? []}
              contagens={contagens}
              onAjustar={onAjustar}
            />
          ))}
        </div>
      )}
    </div>
  );
});
