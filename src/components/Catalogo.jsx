// Copyright (c) 2026 Daniel Felix Ferber

import { ordenarPorSigla } from '../data/catalogoOrdenacoes.js';
import { Secao } from './Secao.jsx';
import './Catalogo.css';

/**
 * Corpo da tela principal: lista as 50 seções do catálogo na ordenação por
 * sigla, com FWC abrindo e Coca-Cola fechando.
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções do catálogo.
 * @param {Array<{codigo: string; secao: string; metalizada: boolean}>} props.figurinhas - todas as figurinhas.
 * @param {Record<string, number>} props.contagens - mapa esparso de contagens.
 * @param {(codigo: string, delta: number) => void} props.onAjustar - callback de ajuste.
 */
export function Catalogo({ secoes, figurinhas, contagens, onAjustar }) {
  const ordenadas = ordenarPorSigla(secoes);
  const figurinhasPorSecao = new Map();

  for (const figurinha of figurinhas) {
    const lista = figurinhasPorSecao.get(figurinha.secao) ?? [];
    lista.push(figurinha);
    figurinhasPorSecao.set(figurinha.secao, lista);
  }

  return (
    <main className="catalogo">
      {ordenadas.map((secao) => (
        <Secao
          key={secao.sigla}
          secao={secao}
          figurinhas={figurinhasPorSecao.get(secao.sigla) ?? []}
          contagens={contagens}
          onAjustar={onAjustar}
        />
      ))}
    </main>
  );
}
