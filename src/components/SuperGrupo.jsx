// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useImperativeHandle, forwardRef, useMemo, memo } from 'react';
import { calcularPlacar } from '../lib/progresso.js';
import { filtraFigurinha } from '../lib/colecao.js';
import { Secao } from './Secao.jsx';
import './SuperGrupo.css';

/**
 * Compara props para `memo`, no mesmo espírito do comparador de `Secao.jsx`
 * (Tarefa 0010-0002, TDR 0021): `contagens` troca de identidade a cada
 * ajuste em qualquer figurinha do catálogo, então só reprova a igualdade se
 * alguma das ~80 figurinhas deste super-grupo mudou de valor. `isExpandida`
 * entra na comparação por referência — muda ao colapsar/expandir qualquer
 * seção, o que aceita re-renderizar todos os super-grupos nesse caso (não é
 * o caminho que esta tarefa precisa otimizar).
 *
 * @param {object} anterior
 * @param {object} seguinte
 * @returns {boolean} true se o super-grupo pode pular a re-renderização.
 */
function propsEquivalentes(anterior, seguinte) {
  if (
    anterior.grupo !== seguinte.grupo ||
    anterior.secoes !== seguinte.secoes ||
    anterior.figurinhas !== seguinte.figurinhas ||
    anterior.onAjustar !== seguinte.onAjustar ||
    anterior.isExpandida !== seguinte.isExpandida ||
    anterior.getToggleHandler !== seguinte.getToggleHandler ||
    anterior.setSecaoRef !== seguinte.setSecaoRef ||
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
 * Super-grupo colapsável da ordenação por página do álbum: título com chevron,
 * nome (Grupo A…L) e progresso agregado das 4 seleções.
 *
 * Memoizado (Tarefa 0010-0002, TDR 0021): ajustar uma figurinha de outro
 * super-grupo não pode re-renderizar este — ver `propsEquivalentes`.
 *
 * @param {object} props
 * @param {string} props.grupo - letra do grupo (A–L).
 * @param {Array<object>} props.secoes - 4 seleções do grupo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - figurinhas das seções do grupo.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {(sigla: string) => boolean} props.isExpandida - função que retorna se uma seção está expandida.
 * @param {(sigla: string) => (() => void)} props.getToggleHandler - retorna o callback estável de alternar colapso de uma seção.
 * @param {import('react').RefObject<Map>} props.secaoRefs - mapa de refs das seções.
 * @param {(sigla: string, element: Element|null) => void} props.setSecaoRef - callback para registrar ref de uma seção.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {import('react').Ref<{ expandir: () => void }>} [props.ref] - ref para abrir programaticamente.
 */
export const SuperGrupo = memo(forwardRef(function SuperGrupo(
  { grupo, secoes, figurinhas, contagens, onAjustar, isExpandida, getToggleHandler, setSecaoRef, disposicao = 'lista', filtro = 'todas' },
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
                onToggle={getToggleHandler(secao.sigla)}
                disposicao={disposicao}
                filtro={filtro}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}), propsEquivalentes);
