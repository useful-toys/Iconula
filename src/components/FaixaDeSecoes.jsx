// Copyright (c) 2026 Daniel Felix Ferber

import { urlDoIcone } from '../lib/bandeira.js';
import './FaixaDeSecoes.css';

/**
 * Faixa de bandeiras no cabeçalho: linha horizontal com as 50 seções do catálogo,
 * rolável quando não cabe. Tocar em um ícone salta até a seção correspondente.
 *
 * A ordem acompanha a ordenação vigente, sempre com FWC no início e COC no fim
 * (IDR 0028).
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções na ordem vigente (50 seções).
 * @param {(sigla: string) => void} props.onSaltar - callback para saltar até uma seção.
 */
export function FaixaDeSecoes({ secoes, onSaltar }) {
  return (
    <nav className="faixa-de-secoes" aria-label="Saltar para seção">
      {secoes.map((secao) => (
        <button
          key={secao.sigla}
          type="button"
          className="faixa-de-secoes__botao"
          aria-label={`Saltar para ${secao.nome}`}
          onClick={() => onSaltar(secao.sigla)}
        >
          <img
            className="faixa-de-secoes__icone"
            src={urlDoIcone(secao.icone)}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </button>
      ))}
    </nav>
  );
}
