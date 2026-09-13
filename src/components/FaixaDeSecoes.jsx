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
 * Na ordenação por página, a bandeira que inicia cada grupo A–L — e a COC, no
 * fim — recebe a marca de separação, que soma 4px à bandeira anterior
 * (IDR 0042); na ordenação por sigla, o espaçamento é uniforme.
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções na ordem vigente (50 seções).
 * @param {string} props.ordenacao - ordenação vigente (`'pagina' | 'sigla'`).
 * @param {(sigla: string) => void} props.onSaltar - callback para saltar até uma seção.
 */
export function FaixaDeSecoes({ secoes, ordenacao, onSaltar }) {
  return (
    <nav className="faixa-de-secoes" aria-label="Saltar para seção">
      {secoes.map((secao, indice) => {
        const anterior = secoes[indice - 1];
        const inicioDeGrupo =
          ordenacao === 'pagina' && indice > 0 && secao.grupo !== anterior.grupo;
        const classe = inicioDeGrupo
          ? 'faixa-de-secoes__botao faixa-de-secoes__botao--inicio-de-grupo'
          : 'faixa-de-secoes__botao';
        return (
          <button
            key={secao.sigla}
            type="button"
            className={classe}
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
        );
      })}
    </nav>
  );
}
