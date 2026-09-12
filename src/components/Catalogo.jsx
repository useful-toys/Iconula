// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { ordenarPorSigla, ordenarPorPagina } from '../data/catalogoOrdenacoes.js';
import { filtraFigurinha } from '../lib/colecao.js';
import { Secao } from './Secao.jsx';
import { SuperGrupo } from './SuperGrupo.jsx';
import './Catalogo.css';

/**
 * Corpo da tela principal: lista as 50 seções do catálogo na ordenação
 * vigente, com FWC abrindo e Coca-Cola fechando (IDR 0028).
 *
 * Na ordenação por página, as 48 seleções são agrupadas em 12 super-grupos
 * A–L (IDR 0019). Na ordenação por sigla, as seções ficam no mesmo nível.
 *
 * Gerencia o estado de colapso de cada seção por sigla (IDR 0020).
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções do catálogo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - todas as figurinhas.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 * @param {'pagina'|'sigla'} props.ordenacao - ordenação vigente.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {() => void} [props.onLimparFiltro] - callback para voltar o filtro para "todas".
 * @param {import('react').Ref<{ saltarPara: (sigla: string) => void }>} [props.ref] - ref para saltar para uma seção.
 */
export const Catalogo = forwardRef(function Catalogo(
  { secoes, figurinhas, contagens, onAjustar, ordenacao, disposicao = 'lista', filtro = 'todas', onLimparFiltro },
  ref,
) {
  // Memoizado: sem isto, `estruturada` (e os arrays/objetos que ela cria,
  // como `item.secoes` de cada super-grupo) ganharia uma identidade nova a
  // cada render de `Catalogo` — inclusive a cada ajuste de contagem —, o
  // que impediria `SuperGrupo` de comparar props por referência e o
  // obrigaria a re-renderizar sempre (Tarefa 0010-0002, TDR 0021).
  const estruturada = useMemo(
    () => (ordenacao === 'pagina' ? ordenarPorPagina(secoes) : ordenarPorSigla(secoes)),
    [ordenacao, secoes],
  );
  const figurinhasPorSecao = useMemo(() => {
    const map = new Map();
    for (const figurinha of figurinhas) {
      const lista = map.get(figurinha.secao) ?? [];
      lista.push(figurinha);
      map.set(figurinha.secao, lista);
    }
    return map;
  }, [figurinhas]);

  // Mesma razão: o array de figurinhas de cada super-grupo (`flatMap` das
  // suas seções) precisa manter a referência entre ajustes para que
  // `SuperGrupo` memoizado (TDR 0021) possa pular a re-renderização.
  const figurinhasPorGrupo = useMemo(() => {
    const map = new Map();
    for (const item of estruturada) {
      if (item.tipo === 'super-grupo') {
        map.set(item.grupo, item.secoes.flatMap((s) => figurinhasPorSecao.get(s.sigla) ?? []));
      }
    }
    return map;
  }, [estruturada, figurinhasPorSecao]);

  // Estado de colapso por sigla: Set de siglas colapsadas
  // Padrão: todas expandidas (ausentes do Set)
  const [colapsadas, setColapsadas] = useState(new Set());

  // Refs para seções e super-grupos
  const secaoRefs = useRef(new Map());
  const superGrupoRefs = useRef(new Map());

  const toggleSecao = useCallback((sigla) => {
    setColapsadas((prev) => {
      const next = new Set(prev);
      if (next.has(sigla)) {
        next.delete(sigla);
      } else {
        next.add(sigla);
      }
      return next;
    });
  }, []);

  // Mapa de callbacks de toggle por sigla — `() => toggleSecao(sigla)`
  // calculado uma vez para as 50 seções e reaproveitado entre renders, em
  // vez de um fecho novo a cada ajuste de contagem. Necessário para que
  // `Secao` e `SuperGrupo` memoizados (TDR 0021) vejam `onToggle` estável e
  // possam pular a re-renderização das seções não afetadas pelo ajuste.
  const toggleHandlers = useMemo(() => {
    const map = new Map();
    for (const sec of secoes) {
      map.set(sec.sigla, () => toggleSecao(sec.sigla));
    }
    return map;
  }, [secoes, toggleSecao]);
  const getToggleHandler = useCallback(
    (sigla) => toggleHandlers.get(sigla),
    [toggleHandlers],
  );

  const expandirSecao = useCallback((sigla) => {
    setColapsadas((prev) => {
      if (!prev.has(sigla)) return prev;
      const next = new Set(prev);
      next.delete(sigla);
      return next;
    });
  }, []);

  const isExpandida = useCallback(
    (sigla) => !colapsadas.has(sigla),
    [colapsadas],
  );

  // Determina se uma seção tem alguma figurinha visível com o filtro vigente.
  // Na disposição álbum, o filtro é ignorado (IDR 0001).
  const secaoTemVisivel = useCallback(
    (sec) => {
      if (disposicao !== 'lista' || filtro === 'todas') return true;
      const secaoFigurinhas = figurinhasPorSecao.get(sec.sigla) ?? [];
      return secaoFigurinhas.some((f) => filtraFigurinha(contagens, f.codigo, filtro));
    },
    [disposicao, filtro, contagens, figurinhasPorSecao],
  );

  // Exposição do método saltarPara: se a seção alvo está oculta pelo filtro,
  // limpa o filtro para "todas" antes de rolar (IDR 0031).
  useImperativeHandle(ref, () => ({
    saltarPara(sigla) {
      // Encontra qual super-grupo contém a seção (se houver)
      const superGrupoComSecao = estruturada.find(
        (item) => item.tipo === 'super-grupo' && item.secoes.some((s) => s.sigla === sigla),
      );

      // Se a seção está oculta pelo filtro, precisa limpar o filtro antes.
      const secaoFigurinhas = figurinhasPorSecao.get(sigla) ?? [];
      const ocultaPeloFiltro = disposicao === 'lista' && filtro !== 'todas'
        && !secaoFigurinhas.some((f) => filtraFigurinha(contagens, f.codigo, filtro));
      if (ocultaPeloFiltro && onLimparFiltro) {
        onLimparFiltro();
      }

      // Expande o super-grupo se estiver colapsado
      if (superGrupoComSecao) {
        const superGrupoRef = superGrupoRefs.current.get(superGrupoComSecao.grupo);
        if (superGrupoRef) {
          superGrupoRef.expandir();
        }
      }

      // Expande a seção se estiver colapsada
      expandirSecao(sigla);

      // Rola até a seção após um pequeno delay para permitir a expansão
      // (e a re-renderização após limpar o filtro)
      setTimeout(() => {
        const secaoRef = secaoRefs.current.get(sigla);
        if (secaoRef) {
          const header = document.querySelector('.cabecalho');
          const headerHeight = header ? header.offsetHeight : 0;
          const elementTop = secaoRef.getBoundingClientRect().top + window.scrollY;
          const offsetTop = elementTop - headerHeight - 10;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }, 50);
    },
  }), [estruturada, expandirSecao, disposicao, filtro, contagens, onLimparFiltro, figurinhasPorSecao]);

  const setSecaoRef = useCallback((sigla, element) => {
    if (element) {
      secaoRefs.current.set(sigla, element);
    } else {
      secaoRefs.current.delete(sigla);
    }
  }, []);

  const setSuperGrupoRef = useCallback((grupo, refValue) => {
    if (refValue) {
      superGrupoRefs.current.set(grupo, refValue);
    } else {
      superGrupoRefs.current.delete(grupo);
    }
  }, []);

  // Mesmo cuidado do `toggleHandlers`, mas para o `ref` de cada
  // `SuperGrupo`: `memo(forwardRef(...))` só pula a re-renderização se,
  // além das props, o próprio `ref` também for o mesmo objeto entre
  // renders (checagem interna do React) — um `ref` inline recriado a cada
  // render de `Catalogo` anularia a memoização de todos os 12 super-grupos
  // a cada ajuste de contagem, mesmo com `propsEquivalentes` (TDR 0021).
  // Os 12 grupos (A–L) são fixos, então o mapa é montado uma única vez
  // (inicializador preguiçoso do `useState`, nunca recalculado).
  const [superGrupoRefHandlers] = useState(() => {
    const map = new Map();
    for (const letra of 'ABCDEFGHIJKL') {
      map.set(letra, (refValue) => setSuperGrupoRef(letra, refValue));
    }
    return map;
  });

  return (
    <main className="catalogo">
      {estruturada.map((item) => {
        // ordenarPorPagina retorna { tipo: 'secao', secao } ou { tipo: 'super-grupo', grupo, secoes }
        // ordenarPorSigla retorna objetos de seção diretamente
        const isSecao = item.tipo === 'secao' || item.sigla;
        const secao = item.tipo === 'secao' ? item.secao : item;

        if (isSecao) {
          // Oculta a seção inteira se o filtro não deixa nenhuma figurinha (IDR 0025)
          if (!secaoTemVisivel(secao)) return null;
          return (
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
          );
        }
        if (item.tipo === 'super-grupo') {
          const figurinhasDoGrupo = figurinhasPorGrupo.get(item.grupo);
          // Oculta o super-grupo se nenhuma seção dele sobra com o filtro (IDR 0025)
          const secoesVisiveis = item.secoes.filter((s) => secaoTemVisivel(s));
          if (secoesVisiveis.length === 0) return null;
          return (
            <SuperGrupo
              key={item.grupo}
              ref={superGrupoRefHandlers.get(item.grupo)}
              grupo={item.grupo}
              secoes={item.secoes}
              figurinhas={figurinhasDoGrupo}
              contagens={contagens}
              onAjustar={onAjustar}
              isExpandida={isExpandida}
              getToggleHandler={getToggleHandler}
              secaoRefs={secaoRefs}
              setSecaoRef={setSecaoRef}
              disposicao={disposicao}
              filtro={filtro}
            />
          );
        }
        return null;
      })}
    </main>
  );
});
