// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef, useState } from 'react';
import './MenuDeCompartilhar.css';

/**
 * Botão compartilhar do cabeçalho e o popup das listas de troca (IDR 0024,
 * IDR 0018): fica logo à esquerda do avatar, na primeira linha, e abre um
 * popup organizado por lista — "Copiar lista de faltantes", filete, "Copiar
 * lista de repetidas". As cópias estavam no menu do avatar até a Tarefa
 * 0021-0001; saíram de lá porque misturavam troca com portabilidade e conta.
 *
 * O mesmo popup recebe, na Tarefa 0021-0002, os itens de compartilhar pela
 * folha do sistema, logo abaixo de cada cópia.
 *
 * Comportamento do popup igual ao do `MenuDeAcoes.jsx`: fecha ao escolher um
 * item, ao tocar fora, com `Esc` ou ao sair do popup pelo teclado; ao abrir,
 * o foco entra no primeiro item habilitado (um item sem callback nunca
 * recebe foco); ao fechar por `Esc` ou por escolher um item, o foco volta ao
 * botão — tocar fora ou tabular para fora deixa o foco seguir, sem roubá-lo
 * de volta (Tarefa 0010-0001, IDR 0042).
 *
 * @param {object} props
 * @param {() => void} [props.onCopiarFaltantes] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onCopiarRepetidas] - sem ele, o item fica desabilitado.
 */
export function MenuDeCompartilhar({ onCopiarFaltantes, onCopiarRepetidas }) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);
  const botaoRef = useRef(null);

  const nomeAcessivel = `compartilhar listas de troca, ${aberto ? 'aberto' : 'fechado'}`;

  function fechar() {
    setAberto(false);
    botaoRef.current?.focus();
  }

  useEffect(() => {
    if (!aberto) return;

    containerRef.current
      ?.querySelector('[role="menuitem"]:not(:disabled)')
      ?.focus();

    function aoClicarFora(evento) {
      if (containerRef.current && !containerRef.current.contains(evento.target)) {
        // Toque fora: só fecha — o foco segue o toque, não é roubado de volta.
        setAberto(false);
      }
    }
    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        // Esc fecha e devolve o foco ao botão, como a escolha de um item.
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  function escolher(acao) {
    return () => {
      acao?.();
      fechar();
    };
  }

  // Tabular para fora do popup move o foco para fora do container sem escolher
  // nada e sem apertar `Esc` — fecha sem roubar o foco de volta.
  function aoSairDoFoco(evento) {
    if (containerRef.current && !containerRef.current.contains(evento.relatedTarget)) {
      setAberto(false);
    }
  }

  return (
    <div className="menu-de-compartilhar" ref={containerRef} onBlur={aoSairDoFoco}>
      <button
        ref={botaoRef}
        type="button"
        className="menu-de-compartilhar__botao"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={nomeAcessivel}
        onClick={() => setAberto((atual) => !atual)}
      >
        <svg
          className="menu-de-compartilhar__icone"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        </svg>
      </button>
      {aberto && (
        <div className="menu-de-compartilhar__painel" role="menu">
          <button
            type="button"
            role="menuitem"
            className="menu-de-compartilhar__item"
            disabled={!onCopiarFaltantes}
            onClick={escolher(onCopiarFaltantes)}
          >
            Copiar lista de faltantes
          </button>
          <div className="menu-de-compartilhar__filete" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="menu-de-compartilhar__item"
            disabled={!onCopiarRepetidas}
            onClick={escolher(onCopiarRepetidas)}
          >
            Copiar lista de repetidas
          </button>
        </div>
      )}
    </div>
  );
}
