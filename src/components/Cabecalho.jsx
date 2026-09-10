// Copyright (c) 2026 Daniel Felix Ferber

import './Cabecalho.css';

/**
 * Cabeçalho principal do app: uma linha com o nome, o placar geral das 994
 * figurinhas e o relógio da última gravação.
 *
 * A notação compacta é visível (`412/994 · 41% · ▢582 · ×37 · —`). O nome
 * acessível escreve os números por extenso, para que o leitor de tela não
 * dependa dos glifos `▢` e `×`.
 *
 * @param {object} props
 * @param {number} props.coladas - códigos com contagem ≥ 1.
 * @param {number} props.faltantes - 994 − coladas.
 * @param {number} props.repetidas - códigos distintos com contagem ≥ 2.
 * @param {number} props.percentual - percentual arredondado.
 * @param {string|null} [props.atualizadoEm] - `updatedAt` do documento, quando
 *   disponível. Nesta fase o componente ainda exibe `—`; a prop existe para a
 *   Tarefa 0006-0002.
 */
export function Cabecalho({ coladas, faltantes, repetidas, percentual, atualizadoEm }) {
  const relogio = atualizadoEm ?? '—';

  const nomeAcessivel = [
    `${coladas} de 994`,
    `${percentual} por cento`,
    `${faltantes} faltantes`,
    `${repetidas} repetidas`,
    `atualizado às ${relogio}`,
  ].join(', ');

  return (
    <header className="cabecalho">
      <h1 className="cabecalho__titulo" aria-label={nomeAcessivel}>
        <span className="cabecalho__nome">ICONULA 2026</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span className="cabecalho__numero">{coladas}/994</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span className="cabecalho__numero">{percentual}%</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">▢</span>
        <span className="cabecalho__numero">{faltantes}</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span aria-hidden="true">×</span>
        <span className="cabecalho__numero">{repetidas}</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span className="cabecalho__relogio">{relogio}</span>
      </h1>
    </header>
  );
}
