// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useCallback } from 'react';
import { ordenarPorSigla, ordenarPorPagina } from '../data/catalogoOrdenacoes.js';
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
 */
export function Catalogo({ secoes, figurinhas, contagens, onAjustar, ordenacao }) {
  const estruturada = ordenacao === 'pagina' ? ordenarPorPagina(secoes) : ordenarPorSigla(secoes);
  const figurinhasPorSecao = new Map();

  for (const figurinha of figurinhas) {
    const lista = figurinhasPorSecao.get(figurinha.secao) ?? [];
    lista.push(figurinha);
    figurinhasPorSecao.set(figurinha.secao, lista);
  }

  // Estado de colapso por sigla: Set de siglas colapsadas
  // Padrão: todas expandidas (ausentes do Set)
  const [colapsadas, setColapsadas] = useState(new Set());

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

  const isExpandida = useCallback(
    (sigla) => !colapsadas.has(sigla),
    [colapsadas],
  );

  return (
    <main className="catalogo">
      {estruturada.map((item) => {
        // ordenarPorPagina retorna { tipo: 'secao', secao } ou { tipo: 'super-grupo', grupo, secoes }
        // ordenarPorSigla retorna objetos de seção diretamente
        const isSecao = item.tipo === 'secao' || item.sigla;
        const secao = item.tipo === 'secao' ? item.secao : item;

        if (isSecao) {
          return (
            <Secao
              key={secao.sigla}
              secao={secao}
              figurinhas={figurinhasPorSecao.get(secao.sigla) ?? []}
              contagens={contagens}
              onAjustar={onAjustar}
              expandida={isExpandida(secao.sigla)}
              onToggle={() => toggleSecao(secao.sigla)}
            />
          );
        }
        if (item.tipo === 'super-grupo') {
          const figurinhasDoGrupo = item.secoes.flatMap(
            (s) => figurinhasPorSecao.get(s.sigla) ?? [],
          );
          return (
            <SuperGrupo
              key={item.grupo}
              grupo={item.grupo}
              secoes={item.secoes}
              figurinhas={figurinhasDoGrupo}
              contagens={contagens}
              onAjustar={onAjustar}
              isExpandida={isExpandida}
              onToggleSecao={toggleSecao}
            />
          );
        }
        return null;
      })}
    </main>
  );
}
