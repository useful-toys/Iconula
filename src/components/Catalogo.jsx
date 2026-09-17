// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useMemo, useEffect } from 'react';
import { ordenarPorSigla, ordenarPorPagina } from '../data/catalogoOrdenacoes.js';
import { filtraFigurinha } from '../lib/colecao.js';
import { lerColapsoManual, gravarColapsoManual } from '../lib/colapsoManual.js';
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
 * Gerencia o colapso de seções e super-grupos, persistido no `localStorage`
 * (IDR 0020, IDR 0026).
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções do catálogo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - todas as figurinhas.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} [props.onAjustar] - callback de ajuste; ausente, os cartões ficam inertes (IDR 0055).
 * @param {'pagina'|'sigla'} props.ordenacao - ordenação vigente.
 * @param {'lista'|'album'} [props.disposicao='lista'] - disposição vigente.
 * @param {'todas'|'faltantes'|'coladas'|'repetidas'} [props.filtro='todas'] - filtro vigente.
 * @param {() => void} [props.onLimparFiltro] - callback para voltar o filtro para "todas".
 * @param {boolean} [props.gravarColapso=true] - grava o colapso manual no `localStorage` (IDR 0026); `false` na vista do link, que lê mas não grava (IDR 0055).
 * @param {import('react').Ref<{ saltarPara: (sigla: string) => void }>} [props.ref] - ref para saltar para uma seção.
 */
export const Catalogo = forwardRef(function Catalogo(
  { secoes, figurinhas, contagens, onAjustar, ordenacao, disposicao = 'lista', filtro = 'todas', onLimparFiltro, gravarColapso = true },
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

  // Estado do colapso manual: o que o usuário fechou à mão, por sigla de
  // seção e por letra de super-grupo (IDR 0020). Ausente do conjunto = aberto,
  // o padrão. Lido do `localStorage` na abertura e gravado a cada mudança
  // (IDR 0026, Tarefa 0012-0001); siglas e letras fora do catálogo são
  // ignoradas.
  const [colapsadas, setColapsadas] = useState(() => {
    const salvo = lerColapsoManual();
    const siglasValidas = new Set(secoes.map((sec) => sec.sigla));
    const gruposValidos = new Set(secoes.map((sec) => sec.grupo).filter(Boolean));
    return {
      secoes: new Set([...salvo.secoes].filter((sigla) => siglasValidas.has(sigla))),
      grupos: new Set([...salvo.grupos].filter((grupo) => gruposValidos.has(grupo))),
    };
  });

  // Grava o conjunto a cada mudança — só o que foi fechado/aberto, nunca o
  // catálogo inteiro (IDR 0020). Storage ausente ou bloqueado falha em
  // silêncio dentro do módulo (IDR 0026). Na vista do link (`gravarColapso`
  // falso), o colapso é lido na abertura e alterado em memória, mas não é
  // gravado (IDR 0055).
  useEffect(() => {
    if (!gravarColapso) return;
    gravarColapsoManual({
      secoes: [...colapsadas.secoes],
      grupos: [...colapsadas.grupos],
    });
  }, [colapsadas, gravarColapso]);

  // Refs das seções, para o salto rolar até o alvo
  const secaoRefs = useRef(new Map());

  const toggleSecao = useCallback((sigla) => {
    setColapsadas((prev) => {
      const secoesColapsadas = new Set(prev.secoes);
      if (secoesColapsadas.has(sigla)) {
        secoesColapsadas.delete(sigla);
      } else {
        secoesColapsadas.add(sigla);
      }
      return { ...prev, secoes: secoesColapsadas };
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
      if (!prev.secoes.has(sigla)) return prev;
      const secoesColapsadas = new Set(prev.secoes);
      secoesColapsadas.delete(sigla);
      return { ...prev, secoes: secoesColapsadas };
    });
  }, []);

  const toggleGrupo = useCallback((grupo) => {
    setColapsadas((prev) => {
      const gruposColapsados = new Set(prev.grupos);
      if (gruposColapsados.has(grupo)) {
        gruposColapsados.delete(grupo);
      } else {
        gruposColapsados.add(grupo);
      }
      return { ...prev, grupos: gruposColapsados };
    });
  }, []);

  const expandirGrupo = useCallback((grupo) => {
    setColapsadas((prev) => {
      if (!prev.grupos.has(grupo)) return prev;
      const gruposColapsados = new Set(prev.grupos);
      gruposColapsados.delete(grupo);
      return { ...prev, grupos: gruposColapsados };
    });
  }, []);

  // Alternador do super-grupo (IDR 0020): recebe as 4 siglas das seções do
  // grupo e, se alguma estiver aberta, fecha todas; se todas estiverem
  // fechadas, abre todas. É colapso manual como o toque em cada seção — cai no
  // mesmo conjunto `colapsadas.secoes` e é gravado no `localStorage` (IDR 0026).
  // Age sobre as 4 seções do grupo, inclusive as ocultas pelo filtro (IDR 0025).
  const toggleSecoesDoGrupo = useCallback((siglas) => {
    setColapsadas((prev) => {
      const secoesColapsadas = new Set(prev.secoes);
      const algumaAberta = siglas.some((sigla) => !secoesColapsadas.has(sigla));
      for (const sigla of siglas) {
        if (algumaAberta) {
          secoesColapsadas.add(sigla);
        } else {
          secoesColapsadas.delete(sigla);
        }
      }
      return { ...prev, secoes: secoesColapsadas };
    });
  }, []);

  // Mesmo cuidado do `toggleHandlers`, mas para os super-grupos: um mapa de
  // fechos estável por letra, para `SuperGrupo` memoizado (TDR 0021) ver
  // `onToggle` estável entre renders.
  const toggleGrupoHandlers = useMemo(() => {
    const map = new Map();
    for (const sec of secoes) {
      if (sec.grupo && !map.has(sec.grupo)) {
        map.set(sec.grupo, () => toggleGrupo(sec.grupo));
      }
    }
    return map;
  }, [secoes, toggleGrupo]);
  const getToggleGrupoHandler = useCallback(
    (grupo) => toggleGrupoHandlers.get(grupo),
    [toggleGrupoHandlers],
  );

  // Mesmo cuidado dos mapas anteriores, agora para o alternador do grupo
  // (IDR 0020): um fecho estável por letra, montado uma vez, com as 4 siglas
  // do grupo capturadas — para `SuperGrupo` memoizado (TDR 0021) ver
  // `onToggleSecoes` estável entre renders.
  const toggleSecoesGrupoHandlers = useMemo(() => {
    const map = new Map();
    for (const sec of secoes) {
      if (sec.grupo && !map.has(sec.grupo)) {
        const siglas = secoes
          .filter((s) => s.grupo === sec.grupo)
          .map((s) => s.sigla);
        map.set(sec.grupo, () => toggleSecoesDoGrupo(siglas));
      }
    }
    return map;
  }, [secoes, toggleSecoesDoGrupo]);
  const getToggleSecoesGrupoHandler = useCallback(
    (grupo) => toggleSecoesGrupoHandlers.get(grupo),
    [toggleSecoesGrupoHandlers],
  );

  const isExpandida = useCallback(
    (sigla) => !colapsadas.secoes.has(sigla),
    [colapsadas],
  );

  const estaExpandidoGrupo = useCallback(
    (grupo) => !colapsadas.grupos.has(grupo),
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

      // Expande o super-grupo e a seção se estiverem colapsados; a abertura
      // também é gravada no `localStorage` (IDR 0020).
      if (superGrupoComSecao) {
        expandirGrupo(superGrupoComSecao.grupo);
      }
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
  }), [estruturada, expandirSecao, expandirGrupo, disposicao, filtro, contagens, onLimparFiltro, figurinhasPorSecao]);

  const setSecaoRef = useCallback((sigla, element) => {
    if (element) {
      secaoRefs.current.set(sigla, element);
    } else {
      secaoRefs.current.delete(sigla);
    }
  }, []);

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
          // "Todas fechadas" considera as 4 seções do grupo, inclusive as
          // ocultas pelo filtro: o alternador decide e age pelo grupo, não pela
          // vista filtrada (IDR 0020, IDR 0025).
          const todasSecoesFechadas = item.secoes.every((s) => colapsadas.secoes.has(s.sigla));
          return (
            <SuperGrupo
              key={item.grupo}
              grupo={item.grupo}
              secoes={item.secoes}
              figurinhas={figurinhasDoGrupo}
              contagens={contagens}
              onAjustar={onAjustar}
              isExpandida={isExpandida}
              getToggleHandler={getToggleHandler}
              expandida={estaExpandidoGrupo(item.grupo)}
              onToggle={getToggleGrupoHandler(item.grupo)}
              onToggleSecoes={getToggleSecoesGrupoHandler(item.grupo)}
              todasSecoesFechadas={todasSecoesFechadas}
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
