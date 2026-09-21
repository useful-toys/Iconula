// Copyright (c) 2026 Daniel Felix Ferber

import { memo, useEffect, useRef, useState } from 'react';
import { corDoSelo } from '../lib/corDoSelo.js';
import './Figurinha.css';

// Pressão longa no corpo do cartão (IDR 0051): limiar para reconhecer o
// gesto e folga de movimento que o cancela (vira rolagem).
const LIMIAR_PRESSAO_MS = 500;
const TOLERANCIA_MOVIMENTO_PX = 10;

/**
 * Compara props para `memo`, ignorando deliberadamente a identidade de
 * `onIncrementar` e `onDecrementar`: são fechos recriados a cada render do pai
 * (`() => onAjustar(codigo, 1)`), mas equivalentes entre si enquanto `codigo`
 * (chave do mapa, nunca muda para um cartão) e `onAjustar` (estabilizado em
 * `App.jsx`) não mudarem — o que os demais campos comparados já cobrem.
 * Sem isto, um cartão re-renderizaria mesmo com `contagem` idêntica, só
 * porque o pai recriou o fecho (Tarefa 0010-0002, TDR 0021).
 *
 * A **presença** dos callbacks, porém, entra na comparação: é ela que decide
 * entre o cartão editável e o inerte da vista do link (IDR 0055). Sem esta
 * linha, um cartão memoizado que perdesse os callbacks continuaria botão.
 *
 * @param {object} anterior
 * @param {object} seguinte
 * @returns {boolean} true se o cartão pode pular a re-renderização.
 */
function propsEquivalentes(anterior, seguinte) {
  return (
    Boolean(anterior.onIncrementar) === Boolean(seguinte.onIncrementar) &&
    Boolean(anterior.onDecrementar) === Boolean(seguinte.onDecrementar) &&
    anterior.codigo === seguinte.codigo &&
    anterior.contagem === seguinte.contagem &&
    anterior.metalizada === seguinte.metalizada &&
    anterior.variante === seguinte.variante &&
    anterior.paisagem === seguinte.paisagem &&
    anterior.nome === seguinte.nome &&
    anterior.nomeLinhas === seguinte.nomeLinhas &&
    anterior.nomeCurto === seguinte.nomeCurto
  );
}

/**
 * Cartão de uma figurinha do álbum.
 *
 * Apresentacional e controlado por props: recebe o código, a contagem, se é
 * metalizada, a variante de tamanho e os callbacks de incremento/decremento.
 * Não armazena estado nem conhece a coleção.
 *
 * Memoizado (Tarefa 0010-0002, TDR 0021): com 994 cartões em tela, ajustar
 * um deles não pode re-renderizar os outros 993 — ver `propsEquivalentes`.
 *
 * @param {object} props
 * @param {string} props.codigo - código da figurinha (ex.: "BRA05").
 * @param {number} props.contagem - unidades registradas (0 a 99).
 * @param {boolean} [props.metalizada] - indica figurinha metalizada/especial.
 * @param {'lista' | 'album'} [props.variante='lista'] - tamanho do cartão.
 * @param {boolean} [props.paisagem=false] - cartão deitado (70×60px); o nome ocupa uma linha só.
 * @param {string} [props.nome] - nome completo (ex.: "Gabriel Magalhães"), no nome acessível.
 * @param {[string | null, string] | null} [props.nomeLinhas] - par [prenomes, sobrenome] para jogador com corte; [null, nome] para nome único; ausente/`null` sem corte — exibido só em FWC e COC (IDR 0047, MDR 0008).
 * @param {string} [props.nomeCurto] - rótulo de uma linha da paisagem (ex.: "Uruguai 1950"); exibido no lugar de `nome` quando existe — só as paisagens do FWC têm valor (MDR 0008).
 * @param {() => void} [props.onIncrementar] - chamado ao tocar no cartão; sem ele (e sem `onDecrementar`) o cartão é inerte: sem papel de botão, fora da tabulação, sem controle de menos e sem gesto (IDR 0055).
 * @param {() => void} [props.onDecrementar] - chamado ao tocar no controle de menos ou ao segurar o cartão.
 */
export const Figurinha = memo(function Figurinha({
  codigo,
  contagem,
  metalizada = false,
  variante = 'lista',
  paisagem = false,
  nome,
  nomeLinhas,
  nomeCurto,
  onIncrementar,
  onDecrementar,
}) {
  const corpoRef = useRef(null);
  // Retorno visual da espera (escurecimento progressivo, IDR 0051).
  const [pressionando, setPressionando] = useState(false);
  // Marcadores do gesto em curso: timer da espera, coordenadas de origem,
  // ponteiro ativo e se a pressão longa já foi reconhecida (para suprimir o
  // `click` que o navegador gera ao soltar).
  const esperaRef = useRef(null);
  const inicioRef = useRef(null);
  const ponteiroRef = useRef(null);
  const reconhecidoRef = useRef(false);
  // Tipo do último `pointerdown` visto, para decidir se o `contextmenu`
  // (toque longo no Android) deve ser suprimido.
  const ultimoToqueRef = useRef(false);

  // Descartar um timer pendente ao desmontar evita decremento tardio.
  useEffect(
    () => () => {
      if (esperaRef.current !== null) clearTimeout(esperaRef.current);
    },
    [],
  );

  function cancelarEspera() {
    if (esperaRef.current !== null) {
      clearTimeout(esperaRef.current);
      esperaRef.current = null;
    }
    ponteiroRef.current = null;
    inicioRef.current = null;
    setPressionando(false);
  }

  // Só o toque dispara o gesto (IDR 0051); a contagem 0 não inicia a espera
  // — o piso de 0 vale também aqui.
  function aoPointerDown(evento) {
    ultimoToqueRef.current = evento.pointerType === 'touch';
    if (evento.pointerType !== 'touch') return;
    reconhecidoRef.current = false;
    if (contagem < 1 || esperaRef.current !== null) return;
    ponteiroRef.current = evento.pointerId;
    inicioRef.current = { x: evento.clientX, y: evento.clientY };
    setPressionando(true);
    esperaRef.current = setTimeout(() => {
      esperaRef.current = null;
      ponteiroRef.current = null;
      inicioRef.current = null;
      reconhecidoRef.current = true;
      setPressionando(false);
      onDecrementar();
    }, LIMIAR_PRESSAO_MS);
  }

  // Mover além da folga cancela: é rolagem, nada muda (IDR 0051).
  function aoPointerMove(evento) {
    if (esperaRef.current === null) return;
    if (evento.pointerId !== ponteiroRef.current) return;
    const dx = evento.clientX - inicioRef.current.x;
    const dy = evento.clientY - inicioRef.current.y;
    if (dx * dx + dy * dy > TOLERANCIA_MOVIMENTO_PX * TOLERANCIA_MOVIMENTO_PX) {
      cancelarEspera();
    }
  }

  function aoPointerUp(evento) {
    if (evento.pointerType !== 'touch') return;
    cancelarEspera();
  }

  function aoPointerCancel() {
    cancelarEspera();
  }

  // Se a pressão longa já decrementou, o clique gerado ao soltar não soma.
  function aoClique(evento) {
    if (reconhecidoRef.current) {
      reconhecidoRef.current = false;
      evento.preventDefault();
      return;
    }
    onIncrementar();
  }

  // Suprime o menu de contexto do navegador só quando o ponteiro ativo é de
  // toque (Android); no mouse o menu continua disponível.
  function aoContextMenu(evento) {
    if (ultimoToqueRef.current) evento.preventDefault();
  }

  const sigla = codigo.slice(0, 3);
  const numero = codigo.slice(3);
  const sobrando = Math.max(0, contagem - 1);
  // O nome entra no nome acessível entre o código e o estado (IDR 0047).
  const nomeNoRotulo = nome ? `, ${nome}` : '';
  // Exibição do nome (IDR 0047): sem nome, nada; paisagem numa linha só —
  // `nomeCurto` quando existe, senão o `nome` (foto do time); jogador com
  // corte em prenomes/sobrenome; os demais (escudo, Extras FIFA e Coca-Cola)
  // na caixa de até duas linhas.
  const exibeNome = Boolean(nome);

  let estadoClasse = 'figurinha--faltante';
  let estadoLabel = 'faltante';
  if (contagem === 1) {
    estadoClasse = 'figurinha--colada';
    estadoLabel = 'colada';
  } else if (contagem >= 2) {
    estadoClasse = 'figurinha--repetida';
    estadoLabel = `colada, ${sobrando} sobrando`;
  }
  // A marca de metalizada (ponto dourado, aria-hidden) só é visual — o nome
  // acessível precisa dizer por extenso o mesmo estado (IDR 0042).
  if (metalizada) {
    estadoLabel += ', metalizada';
  }

  // Sem os dois callbacks, o cartão é inerte (IDR 0055): a vista do link
  // mostra a coleção de outra pessoa e não pode somar nem remover.
  const interativo = Boolean(onIncrementar) && Boolean(onDecrementar);
  const nomeAcessivel = `${sigla} ${numero}${nomeNoRotulo}, ${estadoLabel}`;

  const classes = [
    'figurinha',
    `figurinha--${variante}`,
    paisagem ? 'figurinha--paisagem' : '',
    estadoClasse,
    pressionando ? 'figurinha--pressionando' : '',
    interativo ? '' : 'figurinha--leitura',
  ].filter(Boolean).join(' ');

  // Conteúdo visual do cartão, igual nos dois modos (IDR 0055): a aparência
  // de estado (cor, selo, metalizada e nome) não muda no somente leitura.
  const visual = (
    <span className="figurinha__visual" aria-hidden="true">
      {metalizada && (
        <span className="figurinha__metalizada" aria-hidden="true" />
      )}
      <span className="figurinha__codigo" aria-hidden="true">
        <span className="figurinha__sigla">{sigla}</span>
        <span className="figurinha__numero">{numero}</span>
      </span>
      {exibeNome && (
        <span className="figurinha__nome" aria-hidden="true">
          {paisagem ? (
            <span className="figurinha__nome-paisagem">
              {nomeCurto ?? nome}
            </span>
          ) : nomeLinhas ? (
            <>
              {nomeLinhas[0] && (
                <span className="figurinha__nome-prenomes">{nomeLinhas[0]}</span>
              )}
              <span className="figurinha__nome-sobrenome">{nomeLinhas[1]}</span>
            </>
          ) : (
            <span className="figurinha__nome-unico">{nome}</span>
          )}
        </span>
      )}
      {contagem >= 2 && (
        <span
          className="figurinha__selo"
          aria-hidden="true"
          style={{ '--selo-cor': corDoSelo(sobrando) }}
        >
          ×{sobrando}
        </span>
      )}
    </span>
  );

  return (
    <div className={classes}>
      {interativo ? (
        <button
          type="button"
          className="figurinha__corpo"
          ref={corpoRef}
          aria-label={nomeAcessivel}
          onClick={aoClique}
          onPointerDown={aoPointerDown}
          onPointerMove={aoPointerMove}
          onPointerUp={aoPointerUp}
          onPointerCancel={aoPointerCancel}
          onContextMenu={aoContextMenu}
        >
          {visual}
        </button>
      ) : (
        // Inerte: `role="img"` preserva o nome acessível (código, nome e
        // contagem) sem papel de botão e sem entrar na tabulação (IDR 0055).
        <div
          className="figurinha__corpo figurinha__corpo--leitura"
          role="img"
          aria-label={nomeAcessivel}
        >
          {visual}
        </div>
      )}
      {interativo && contagem >= 1 && (
        <button
          type="button"
          className="figurinha__menos"
          aria-label={`remover uma unidade de ${sigla} ${numero}${nomeNoRotulo}`}
          onClick={(event) => {
            event.stopPropagation();
            onDecrementar();
            if (contagem === 1) {
              corpoRef.current?.focus();
            }
          }}
        >
          −
        </button>
      )}
    </div>
  );
}, propsEquivalentes);
