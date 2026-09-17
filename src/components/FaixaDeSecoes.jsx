// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { urlDoIcone } from '../lib/bandeira.js';
import './FaixaDeSecoes.css';

// Atraso do tooltip no hover, igual ao dos controles (IDR 0048, IDR 0052).
const ATRASO_HOVER_MS = 400;
// Respiro entre a bandeira e o tooltip e margem mínima até a borda da janela.
const ESPACO_ABAIXO_PX = 6;
const MARGEM_JANELA_PX = 8;
// Movimento mínimo do mouse para virar arrasto em vez de clique (IDR 0058).
const ARRASTO_LIMIAR_PX = 5;

/**
 * Texto do tooltip de uma seção: sigla, nome e progresso na notação compacta
 * dos títulos (IDR 0018, IDR 0052). Sem placar (props de teste), cai no
 * estado vazio sobre o total da seção.
 *
 * @param {object} secao - objeto da seção (catálogo.js).
 * @param {{coladas: number; faltantes: number; repetidas: number; percentual: number}} [placar]
 * @returns {string}
 */
function textoDoTooltip(secao, placar) {
  const total = secao.total;
  const coladas = placar?.coladas ?? 0;
  const faltantes = placar?.faltantes ?? total;
  const repetidas = placar?.repetidas ?? 0;
  const percentual = placar?.percentual ?? 0;
  return `${secao.sigla} · ${secao.nome} · ${coladas}/${total} ${percentual}% ▯${faltantes} ×${repetidas}`;
}

/**
 * Faixa de bandeiras no cabeçalho: linha horizontal com as 50 seções do
 * catálogo, rolável quando não cabe. Tocar em um ícone salta até a seção
 * correspondente.
 *
 * A ordem acompanha a ordenação vigente, sempre com FWC no início e COC no fim
 * (IDR 0028).
 *
 * Na ordenação por página, a bandeira que inicia cada grupo A–L — e a COC, no
 * fim — recebe a marca de separação, que soma 4px à bandeira anterior
 * (IDR 0042); na ordenação por sigla, o espaçamento é uniforme.
 *
 * Um único tooltip, fora do contêiner rolável, identifica a bandeira sob o
 * cursor ou o foco (IDR 0052): sigla, nome e progresso, no visual do tooltip
 * dos controles (IDR 0048). Aparece depois de ~400ms no hover de mouse e na
 * hora no foco por teclado; nunca em toque, onde tocar já salta. Como o
 * `overflow` da faixa recortaria um `::after`, o posicionamento é por JS —
 * exceção restrita à faixa (IDR 0052).
 *
 * Sem barra de rolagem visível (IDR 0058): um fade em degradê nas bordas
 * indica que há mais conteúdo, ligado/desligado conforme a posição de
 * rolagem; no mouse, arrastar a trilha rola (cursor `grab`/`grabbing`),
 * distinguido do clique por um limiar de movimento (~5px) — mover mais que
 * isso rola e não salta, mover menos salta e não rola. A rodinha do mouse
 * não é interceptada: a página continua rolando por cima da faixa.
 *
 * @param {object} props
 * @param {Array<object>} props.secoes - seções na ordem vigente (50 seções).
 * @param {string} props.ordenacao - ordenação vigente (`'pagina' | 'sigla'`).
 * @param {(sigla: string) => void} props.onSaltar - callback para saltar até uma seção.
 * @param {Map<string, {coladas: number; faltantes: number; repetidas: number; percentual: number}>} [props.placarPorSecao] -
 *   progresso de cada seção (sigla → placar) para o tooltip (IDR 0052).
 */
export function FaixaDeSecoes({ secoes, ordenacao, onSaltar, placarPorSecao }) {
  // Tooltip visível: `{ secao, esquerda, topo }`. `esquerda` é o centro da
  // bandeira (o CSS desloca -50%); `topo`, logo abaixo dela.
  const [tooltip, setTooltip] = useState(null);
  const tooltipRef = useRef(null);
  const atrasoRef = useRef(null);
  // O foco atual veio de um ponteiro (mouse ou toque)? Nesse caso o tooltip
  // não abre na hora; só o foco por teclado abre — equivalente ao
  // `:focus-visible` dos controles (IDR 0048), sem depender do suporte do
  // ambiente ao seletor.
  const focoPorPonteiroRef = useRef(false);

  // Fade nas bordas em vez da barra de rolagem (IDR 0058): visível de cada
  // lado só quando há conteúdo rolado para lá.
  const trilhaRef = useRef(null);
  const [fade, setFade] = useState({ esquerda: false, direita: false });

  // Arrasto do mouse (IDR 0058): `arrastoRef` guarda o gesto em andamento;
  // `ultimoArrastoMoveuRef` sobrevive ao `mouseup` até o `click` seguinte,
  // para o clique saber se deve saltar ou foi consumido pelo arrasto.
  const arrastoRef = useRef(null);
  const ultimoArrastoMoveuRef = useRef(false);
  const [arrastando, setArrastando] = useState(false);

  function cancelarAtraso() {
    if (atrasoRef.current !== null) {
      clearTimeout(atrasoRef.current);
      atrasoRef.current = null;
    }
  }

  function esconder() {
    cancelarAtraso();
    setTooltip(null);
  }

  function posicionar(botao, secao) {
    const retangulo = botao.getBoundingClientRect();
    setTooltip({
      secao,
      esquerda: retangulo.left + retangulo.width / 2,
      topo: retangulo.bottom + ESPACO_ABAIXO_PX,
    });
  }

  // Timer pendente não pode sobreviver ao desmonte.
  useEffect(() => () => cancelarAtraso(), []);

  // Some ao rolar a faixa ou a página: um só listener em fase de captura
  // cobre a rolagem de qualquer contêiner, inclusive a da própria faixa.
  useEffect(() => {
    if (!tooltip) return undefined;
    const aoRolar = () => setTooltip(null);
    window.addEventListener('scroll', aoRolar, true);
    return () => window.removeEventListener('scroll', aoRolar, true);
  }, [tooltip]);

  // Prende o tooltip à janela: mede a largura já renderizada e corrige o
  // centro quando a bandeira está perto de uma das pontas (IDR 0052). Em
  // ambiente sem layout (largura 0) o cálculo vira um no-op.
  useLayoutEffect(() => {
    if (!tooltip || !tooltipRef.current) return;
    const metade = tooltipRef.current.offsetWidth / 2;
    const esquerda = Math.min(
      Math.max(tooltip.esquerda, metade + MARGEM_JANELA_PX),
      window.innerWidth - metade - MARGEM_JANELA_PX,
    );
    if (esquerda !== tooltip.esquerda) {
      setTooltip((atual) => (atual ? { ...atual, esquerda } : atual));
    }
  }, [tooltip]);

  // Mede a rolagem da trilha e liga/desliga cada lado do fade.
  function atualizarFade() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const { scrollLeft, scrollWidth, clientWidth } = trilha;
    setFade({
      esquerda: scrollLeft > 0,
      direita: scrollLeft + clientWidth < scrollWidth - 1,
    });
  }

  // Recalcula ao montar e sempre que a ordem das seções muda (largura do
  // conteúdo pode mudar com o agrupamento por página).
  useLayoutEffect(() => {
    atualizarFade();
  }, [secoes, ordenacao]);

  // Recalcula ao redimensionar a janela — pode revelar ou esconder conteúdo.
  useEffect(() => {
    window.addEventListener('resize', atualizarFade);
    return () => window.removeEventListener('resize', atualizarFade);
  }, []);

  function aoPressionarMouse(evento) {
    // Só o botão primário arrasta; ignora atalho de clique direito/meio.
    if (evento.button !== 0) return;
    ultimoArrastoMoveuRef.current = false;
    arrastoRef.current = { inicioX: evento.clientX, inicioScrollLeft: trilhaRef.current.scrollLeft };
  }

  // Listeners na `window` (não no botão) para o arrasto continuar mesmo que
  // o cursor saia da trilha antes do `mouseup`.
  useEffect(() => {
    function aoMoverMouse(evento) {
      const arrasto = arrastoRef.current;
      if (!arrasto) return;
      const delta = evento.clientX - arrasto.inicioX;
      if (!arrasto.moveu) {
        if (Math.abs(delta) <= ARRASTO_LIMIAR_PX) return;
        arrasto.moveu = true;
        ultimoArrastoMoveuRef.current = true;
        setArrastando(true);
      }
      trilhaRef.current.scrollLeft = arrasto.inicioScrollLeft - delta;
      atualizarFade();
    }
    function aoSoltarMouse() {
      arrastoRef.current = null;
      setArrastando(false);
    }
    window.addEventListener('mousemove', aoMoverMouse);
    window.addEventListener('mouseup', aoSoltarMouse);
    return () => {
      window.removeEventListener('mousemove', aoMoverMouse);
      window.removeEventListener('mouseup', aoSoltarMouse);
    };
  }, []);

  function aoEntrarComPonteiro(evento, secao) {
    if (evento.pointerType !== 'mouse') return;
    cancelarAtraso();
    const botao = evento.currentTarget;
    atrasoRef.current = setTimeout(() => {
      atrasoRef.current = null;
      posicionar(botao, secao);
    }, ATRASO_HOVER_MS);
  }

  function aoFocar(evento, secao) {
    const visivelPorTeclado =
      typeof evento.currentTarget.matches === 'function' &&
      evento.currentTarget.matches(':focus-visible');
    if (visivelPorTeclado || !focoPorPonteiroRef.current) {
      cancelarAtraso();
      posicionar(evento.currentTarget, secao);
    }
    focoPorPonteiroRef.current = false;
  }

  function aoPressionarPonteiro() {
    focoPorPonteiroRef.current = true;
  }

  function aoClicar(secao) {
    // Clique que encerra um arrasto (moveu >5px) não salta — o gesto já foi
    // consumido pela rolagem (IDR 0058).
    if (ultimoArrastoMoveuRef.current) {
      ultimoArrastoMoveuRef.current = false;
      return;
    }
    esconder();
    onSaltar(secao.sigla);
  }

  const classesTrilha = ['faixa-de-secoes__trilha'];
  if (arrastando) {
    classesTrilha.push('faixa-de-secoes__trilha--arrastando');
  }

  return (
    <div className="faixa-de-secoes">
      <div
        className={`faixa-de-secoes__fade faixa-de-secoes__fade--esquerda${
          fade.esquerda ? ' faixa-de-secoes__fade--visivel' : ''
        }`}
        aria-hidden="true"
      />
      <div
        className={`faixa-de-secoes__fade faixa-de-secoes__fade--direita${
          fade.direita ? ' faixa-de-secoes__fade--visivel' : ''
        }`}
        aria-hidden="true"
      />
      <nav
        ref={trilhaRef}
        className={classesTrilha.join(' ')}
        aria-label="Saltar para seção"
        onScroll={atualizarFade}
        onMouseDown={aoPressionarMouse}
      >
        {secoes.map((secao, indice) => {
          const anterior = secoes[indice - 1];
          const inicioDeGrupo =
            ordenacao === 'pagina' && indice > 0 && secao.grupo !== anterior.grupo;
          const classes = ['faixa-de-secoes__botao'];
          if (inicioDeGrupo) {
            classes.push('faixa-de-secoes__botao--inicio-de-grupo');
          }
          if (ordenacao === 'pagina') {
            const chave =
              secao.tipo === 'especial' ? secao.sigla.toLowerCase() : secao.grupo.toLowerCase();
            classes.push(`faixa-de-secoes__botao--grupo-${chave}`);
          }
          return (
            <button
              key={secao.sigla}
              type="button"
              className={classes.join(' ')}
              aria-label={`Saltar para ${secao.nome}`}
              onClick={() => aoClicar(secao)}
              onPointerEnter={(evento) => aoEntrarComPonteiro(evento, secao)}
              onPointerLeave={esconder}
              onPointerDown={aoPressionarPonteiro}
              onFocus={(evento) => aoFocar(evento, secao)}
              onBlur={esconder}
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
      {tooltip && (
        <div
          ref={tooltipRef}
          className="faixa-de-secoes__tooltip"
          aria-hidden="true"
          style={{ left: `${tooltip.esquerda}px`, top: `${tooltip.topo}px` }}
        >
          {textoDoTooltip(tooltip.secao, placarPorSecao?.get(tooltip.secao.sigla))}
        </div>
      )}
    </div>
  );
}
