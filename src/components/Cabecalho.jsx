// Copyright (c) 2026 Daniel Felix Ferber

import { FaixaDeSecoes } from './FaixaDeSecoes.jsx';
import './Cabecalho.css';

/**
 * Cabeçalho principal do app: placar geral, relógio, avatar e faixa de
 * bandeiras para salto.
 *
 * A notação compacta é visível (`412/994 · 41% · ▢582 · ×37 · —`). O nome
 * acessível escreve os números por extenso, para que o leitor de tela não
 * dependa dos glifos `▢` e `×`.
 *
 * O `<header>` é o próprio elemento sticky em qualquer largura (sem ponto de
 * quebra): o título, o avatar, os controles e a faixa ficam dentro dele e
 * nada rola com o conteúdo. Cabendo tudo, os quatro dividem uma linha e a
 * faixa vai abaixo; não cabendo, o avatar fica preso à direita do título na
 * primeira linha e os grupos descem (IDR 0018).
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
 * @param {import('react').ReactNode} [props.avatar] - o avatar do usuário
 *   (menu de ações), preso à direita da primeira linha, ao lado do título
 *   (IDR 0049).
 * @param {import('react').ReactNode} [props.children] - a linha de controles,
 *   renderizada dentro do `<header>`, depois do avatar e antes da faixa.
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
  avatar,
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
      {avatar && <div className="cabecalho__avatar">{avatar}</div>}
      {children}
      <FaixaDeSecoes secoes={secoes} ordenacao={ordenacao} onSaltar={onSaltar} />
    </header>
  );
}
