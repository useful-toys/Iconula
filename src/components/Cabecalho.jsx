// Copyright (c) 2026 Daniel Felix Ferber

import { FaixaDeSecoes } from './FaixaDeSecoes.jsx';
import './Cabecalho.css';

/**
 * Cabeçalho principal do app: placar geral, relógio e faixa de bandeiras para salto.
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
 * @param {string|null} [props.atualizadoEm] - `updatedAt` do documento, já
 *   formatado para o relógio (IDR 0027); `null` exibe `—`.
 * @param {Array<object>} props.secoes - seções na ordem vigente para a faixa.
 * @param {string} props.ordenacao - ordenação vigente (`'pagina' | 'sigla'`),
 *   usada pela faixa para separar os grupos A–L na ordenação por página.
 * @param {(sigla: string) => void} props.onSaltar - callback para saltar até uma seção.
 * @param {import('react').ReactNode} [props.children] - a linha de controles,
 *   renderizada dentro do `<header>` para dividir a linha com o título a partir
 *   de 768px (IDR 0018).
 */
export function Cabecalho({
  coladas,
  faltantes,
  repetidas,
  percentual,
  atualizadoEm,
  secoes,
  ordenacao,
  onSaltar,
  children,
}) {
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
      <div className="cabecalho__fixo">
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
        <FaixaDeSecoes secoes={secoes} ordenacao={ordenacao} onSaltar={onSaltar} />
      </div>
      {children}
    </header>
  );
}
