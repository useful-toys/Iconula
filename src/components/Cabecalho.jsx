// Copyright (c) 2026 Daniel Felix Ferber

import { FaixaDeSecoes } from './FaixaDeSecoes.jsx';
import './Cabecalho.css';

/**
 * Cabeçalho principal do app: placar geral, relógio, comandos (compartilhar e
 * avatar) e faixa de bandeiras para salto.
 *
 * A notação compacta é visível (`ICONULA 2026 · 412/994 41% ▯582 ×37 · —`).
 * O nome acessível escreve os números por extenso, para que o leitor de tela
 * não dependa dos glifos `▯` e `×`.
 *
 * O `<header>` é o próprio elemento sticky em qualquer largura (sem ponto de
 * quebra): o título, os comandos, os controles e a faixa ficam dentro dele e
 * nada rola com o conteúdo. Cabendo tudo, título, grupos, desfazer, botão
 * compartilhar e avatar dividem uma linha e a faixa vai abaixo; não cabendo,
 * compartilhar e avatar ficam presos à direita do título na primeira linha e
 * os grupos descem (IDR 0018).
 *
 * @param {object} props
 * @param {number} props.coladas - códigos com contagem ≥ 1.
 * @param {number} props.faltantes - 994 − coladas.
 * @param {number} props.repetidas - códigos distintos com contagem ≥ 2.
 * @param {number} props.percentual - percentual arredondado.
 * @param {string|null} [props.atualizadoEm] - `updatedAt` do documento, já
 *   formatado para o relógio (IDR 0027); `null` exibe `—`.
 * @param {boolean} [props.naoSalvo=false] - há alteração ainda não gravada:
 *   o relógio dá lugar a "não salvo" e o nome acessível troca "atualizado às
 *   …" por "não salvo" (Tarefa 0033-0004, IDR 0027 e IDR 0065).
 * @param {Array<object>} props.secoes - seções na ordem vigente para a faixa.
 * @param {string} props.ordenacao - ordenação vigente (`'pagina' | 'sigla'`),
 *   usada pela faixa para separar os grupos A–L na ordenação por página.
 * @param {(sigla: string) => void} props.onSaltar - callback para saltar até uma seção.
 * @param {Map<string, {coladas: number; faltantes: number; repetidas: number; percentual: number}>} [props.placarPorSecao] -
 *   progresso de cada seção (sigla → placar) para o tooltip da faixa
 *   (Tarefa 0019-0002, IDR 0052).
 * @param {import('react').ReactNode} [props.compartilhar] - o botão
 *   compartilhar (listas de troca), logo à esquerda do avatar, na primeira
 *   linha (IDR 0018, IDR 0024).
 * @param {import('react').ReactNode} [props.avatar] - o avatar do usuário
 *   (menu de ações), no extremo direito da primeira linha, ao lado do título
 *   (IDR 0049).
 * @param {boolean} [props.somenteLeitura=false] - acrescenta o rótulo
 *   `somente leitura` no fim da linha do título, em `--muted`, e o mesmo
 *   termo ao nome acessível (IDR 0055).
 * @param {boolean} [props.tituloComoLink=false] - torna `ICONULA 2026` um
 *   link para `/`, que leva ao próprio catálogo (ou à tela de login) — o
 *   caminho manda na vista do link (IDR 0055).
 * @param {import('react').ReactNode} [props.children] - a linha de controles,
 *   renderizada dentro do `<header>`, depois dos comandos e antes da faixa.
 */
export function Cabecalho({
  coladas,
  faltantes,
  repetidas,
  percentual,
  atualizadoEm,
  naoSalvo = false,
  secoes,
  ordenacao,
  onSaltar,
  placarPorSecao,
  compartilhar,
  avatar,
  somenteLeitura = false,
  tituloComoLink = false,
  children,
}) {
  const relogio = naoSalvo ? 'não salvo' : (atualizadoEm ?? '—');

  const nomeAcessivel = [
    `${coladas} de 994`,
    `${percentual} por cento`,
    `${faltantes} faltantes`,
    `${repetidas} repetidas`,
    naoSalvo ? 'não salvo' : `atualizado às ${relogio}`,
    ...(somenteLeitura ? ['somente leitura'] : []),
  ].join(', ');

  return (
    <header className="cabecalho">
      <h1 className="cabecalho__titulo" aria-label={nomeAcessivel}>
        {tituloComoLink ? (
          <a className="cabecalho__nome" href="/">
            ICONULA 2026
          </a>
        ) : (
          <span className="cabecalho__nome">ICONULA 2026</span>
        )}
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span className="cabecalho__numero">{coladas}/994</span>
        <span className="cabecalho__numero">{percentual}%</span>
        <span aria-hidden="true">▯</span>
        <span className="cabecalho__numero">{faltantes}</span>
        <span aria-hidden="true">×</span>
        <span className="cabecalho__numero">{repetidas}</span>
        <span className="cabecalho__sep" aria-hidden="true">
          ·
        </span>
        <span className="cabecalho__relogio">{relogio}</span>
        {somenteLeitura && (
          <>
            <span className="cabecalho__sep" aria-hidden="true">
              ·
            </span>
            <span className="cabecalho__rotulo">somente leitura</span>
          </>
        )}
      </h1>
      {(compartilhar || avatar) && (
        <div className="cabecalho__acoes">
          {compartilhar}
          {avatar && <div className="cabecalho__avatar">{avatar}</div>}
        </div>
      )}
      {children}
      <FaixaDeSecoes
        secoes={secoes}
        ordenacao={ordenacao}
        onSaltar={onSaltar}
        placarPorSecao={placarPorSecao}
      />
    </header>
  );
}
