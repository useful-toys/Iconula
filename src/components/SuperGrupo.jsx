// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useMemo, memo } from 'react';
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
 * o caminho que esta tarefa precisa otimizar). `expandida` (do próprio
 * super-grupo) e `onToggle` vêm controlados de `Catalogo` e reprovam a
 * igualdade quando mudam.
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
 * Super-grupo colapsável da ordenação por página do álbum: título com chevron,
 * nome (Grupo A…L) e progresso agregado das 4 seleções.
 *
 * Memoizado (Tarefa 0010-0002, TDR 0021): ajustar uma figurinha de outro
 * super-grupo não pode re-renderizar este — ver `propsEquivalentes`.
 *
 * O colapso é controlado por `Catalogo` (Tarefa 0012-0001), como em `Secao`,
 * para centralizar a persistência do colapso manual (IDR 0020, IDR 0026). Sem
 * `expandida`, cai em estado interno (uso não controlado em testes).
 *
 * @param {object} props
 * @param {string} props.grupo - letra do grupo (A–L).
 * @param {Array<object>} props.secoes - 4 seleções do grupo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - figurinhas das seções do grupo.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {(sigla: string) => boolean} props.isExpandida - função que retorna se uma seção está expandida.
 * @param {(sigla: string) => (() => void)} props.getToggleHandler - retorna o callback estável de alternar colapso de uma seção.
 * @param {(sigla: string, element: Element|null) => void} props.setSecaoRef - callback para registrar ref de uma seção.
 * @param {boolean} [props.expandida] - se o super-grupo está expandido (controlado); se omitido, usa estado interno.
 * @param {() => void} [props.onToggle] - callback para alternar o colapso (controlado).
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 */
export const SuperGrupo = memo(function SuperGrupo({
  grupo,
  secoes,
  figurinhas,
  contagens,
  onAjustar,
  isExpandida,
  getToggleHandler,
  setSecaoRef,
  expandida: expandidaProp,
  onToggle: onToggleProp,
  disposicao = 'lista',
  filtro = 'todas',
}) {
  const [expandidaInterna, setExpandidaInterna] = useState(true);
  const isControlado = expandidaProp !== undefined;
  const expandida = isControlado ? expandidaProp : expandidaInterna;
  const onToggle = isControlado ? onToggleProp : () => setExpandidaInterna((e) => !e);

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
    expandida ? 'expandido' : 'colapsado',
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
        aria-expanded={expandida}
        aria-label={nomeAcessivel}
        onClick={onToggle}
      >
        <span className="super-grupo__chevron" aria-hidden="true">
          {expandida ? '▾' : '▸'}
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
      {expandida && (
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
}, propsEquivalentes);
