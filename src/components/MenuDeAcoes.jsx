// Copyright (c) 2026 Daniel Felix Ferber

import { useEffect, useRef, useState } from 'react';
import './MenuDeAcoes.css';

/**
 * Botão de ações no cabeçalho e o popup de comandos raros (IDR 0024): duas
 * cópias para a área de transferência, exportar/importar e sair da conta,
 * em três blocos separados por filete.
 *
 * Todos os cinco comandos têm ação real desde a Tarefa 0009-0005: copiar
 * faltantes/repetidas (0009-0003), exportar (0009-0004), importar
 * (0009-0005) e "sair da conta" (0009-0002). Sem o callback
 * correspondente, um item de conteúdo fica presente e desabilitado, nunca
 * aparentando funcionar — só "sair da conta" nunca fica sem ação.
 *
 * Fecha ao escolher um item, ao tocar fora do popup, com `Esc` ou ao sair do
 * popup pelo teclado (`Tab` saindo do último item — Tarefa 0010-0001,
 * varrimento de teclado: sem isso, o popup ficava visualmente aberto com o
 * foco já em outro lugar da tela). Ao abrir, o foco entra no primeiro item
 * *habilitado* (um item sem callback nunca recebe foco); ao fechar por
 * `Esc` ou por escolher um item, o foco volta ao botão — tocar fora ou
 * tabular para fora deixa o foco seguir, sem roubá-lo de volta.
 *
 * @param {object} props
 * @param {() => void} props.onSignOut - grava o pendente e sai da conta (Tarefa 0007-0003, IDR 0038).
 * @param {() => void} [props.onCopiarFaltantes] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onCopiarRepetidas] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onExportar] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onImportar] - sem ele, o item fica desabilitado.
 */
export function MenuDeAcoes({ onSignOut, onCopiarFaltantes, onCopiarRepetidas, onExportar, onImportar }) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef(null);
  const botaoRef = useRef(null);

  function fechar() {
    setAberto(false);
    botaoRef.current?.focus();
  }

  useEffect(() => {
    if (!aberto) return;

    // O primeiro item pode estar desabilitado (comando ainda sem callback,
    // Tarefas 0009-0003 a 0009-0005) — um item desabilitado nunca recebe
    // foco, então o foco entra no primeiro item habilitado, seja ele qual
    // for ("sair da conta" sempre está habilitado, então sempre há um).
    containerRef.current?.querySelector('[role="menuitem"]:not(:disabled)')?.focus();

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

  // Tabular para fora do popup (ex.: `Tab` no último item) move o foco para
  // fora do container sem escolher nada e sem apertar `Esc` — sem este
  // fechamento, o popup ficaria visível com o foco já em outro elemento da
  // tela. `relatedTarget` é quem vai receber o foco; dentro do container,
  // não fecha (é só a troca de foco entre botão e itens ao abrir).
  function aoSairDoFoco(evento) {
    if (containerRef.current && !containerRef.current.contains(evento.relatedTarget)) {
      setAberto(false);
    }
  }

  return (
    <div className="menu-de-acoes" ref={containerRef} onBlur={aoSairDoFoco}>
      <button
        ref={botaoRef}
        type="button"
        className="menu-de-acoes__botao"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-label={`menu de ações, ${aberto ? 'aberto' : 'fechado'}`}
        onClick={() => setAberto((atual) => !atual)}
      >
        ⋯
      </button>
      {aberto && (
        <div className="menu-de-acoes__painel" role="menu">
          <button
            type="button"
            role="menuitem"
            className="menu-de-acoes__item"
            disabled={!onCopiarFaltantes}
            onClick={escolher(onCopiarFaltantes)}
          >
            Copiar lista de faltantes
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu-de-acoes__item"
            disabled={!onCopiarRepetidas}
            onClick={escolher(onCopiarRepetidas)}
          >
            Copiar lista de repetidas
          </button>
          <div className="menu-de-acoes__filete" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="menu-de-acoes__item"
            disabled={!onExportar}
            onClick={escolher(onExportar)}
          >
            Exportar coleção (JSON)
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu-de-acoes__item"
            disabled={!onImportar}
            onClick={escolher(onImportar)}
          >
            Importar coleção (JSON)
          </button>
          <div className="menu-de-acoes__filete" role="separator" />
          <button
            type="button"
            role="menuitem"
            className="menu-de-acoes__item menu-de-acoes__item--sair"
            onClick={escolher(onSignOut)}
          >
            Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}
