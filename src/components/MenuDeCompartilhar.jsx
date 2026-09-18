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
 * Desde a Tarefa 0021-0002, logo abaixo de cada cópia, um item de
 * compartilhar pela folha do sistema (`navigator.share`): o usuário escolhe o
 * app, o Iconula não assume nenhum (IDR 0024). Os itens de compartilhar só
 * existem onde o navegador oferece a folha; sem ela, o popup fica só com as
 * duas cópias.
 *
 * Desde a Tarefa 0027-0004, um terceiro bloco, também separado por filete,
 * traz a chave do link do catálogo (IDR 0055): o rótulo já diz o estado por
 * extenso (`Link do catálogo: ligado`/`desligado`) e o `role="switch"` com
 * `aria-checked` o anuncia ao leitor de tela (IDR 0018). Tocar na chave não
 * fecha o popup — dá para ligar e copiar em seguida — e, enquanto a gravação
 * está em voo, um segundo toque não dispara outra.
 *
 * Desde a Tarefa 0032-0006, ligar exige um passo informativo (IDR 0055, IDR
 * 0061): com o link desligado, tocar na chave expande o bloco que explica o
 * que fica visível sem login para quem tiver o link, avisa que nome e e-mail
 * não aparecem e que desligar revoga o acesso mas não desfaz cópias já feitas
 * — com "Ligar o link" e "Cancelar". Só "Ligar o link" grava; "Cancelar"
 * recolhe sem gravar. Desligar continua num único toque, sem confirmação
 * (IDR 0010); o foco permanece na chave ao expandir e o popup não fecha em
 * nenhum passo.
 *
 * Desde a Tarefa 0027-0005, com o link ligado aparece logo abaixo da chave
 * `Copiar link do catálogo` e, onde há folha do sistema, `Compartilhar link
 * do catálogo…` — entregam só a URL, sem texto junto (IDR 0055). Desligado, os
 * dois não existem.
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
 * @param {() => void} [props.onCompartilharFaltantes] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onCompartilharRepetidas] - sem ele, o item fica desabilitado.
 * @param {boolean} [props.linkAtivo] - estado do link do catálogo; ausente, `false`.
 * @param {() => Promise<void>} [props.onAlternarLink] - alterna o link; sem
 *   ele, a chave fica desabilitada.
 * @param {() => void} [props.onCopiarLink] - sem ele, o item fica desabilitado.
 * @param {() => void} [props.onCompartilharLink] - sem ele, o item fica desabilitado.
 */
export function MenuDeCompartilhar({
  onCopiarFaltantes,
  onCopiarRepetidas,
  onCompartilharFaltantes,
  onCompartilharRepetidas,
  linkAtivo = false,
  onAlternarLink,
  onCopiarLink,
  onCompartilharLink,
}) {
  const [aberto, setAberto] = useState(false);
  // Passo informativo do ligar (Tarefa 0032-0006): o bloco só existe enquanto
  // o usuário não confirma nem cancela; desligar não o abre (IDR 0055).
  const [mostrandoExplicacao, setMostrandoExplicacao] = useState(false);
  const containerRef = useRef(null);
  const botaoRef = useRef(null);
  // A chave recebe o foco de volta ao recolher o passo informativo, para o
  // foco não se perder quando o botão que o tinha sai do DOM (Tarefa
  // 0032-0006, IDR 0042).
  const chaveRef = useRef(null);
  // Trava o segundo toque enquanto a primeira gravação não resolve (Tarefa
  // 0027-0004): um `useRef`, não estado, para não re-renderizar o popup — e
  // mantém a chave focável, ao contrário de desabilitá-la.
  const gravandoLinkRef = useRef(false);

  // A folha de compartilhamento é do navegador; a disponibilidade não muda
  // durante a sessão, então basta ler no render (IDR 0024).
  const podeCompartilhar = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

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

  // Alterna a chave sem fechar o popup (IDR 0024, IDR 0055). A trava evita
  // uma segunda gravação se o toque repetir antes de a primeira resolver.
  async function alternarLink() {
    if (gravandoLinkRef.current) return;
    gravandoLinkRef.current = true;
    try {
      await onAlternarLink?.();
    } finally {
      gravandoLinkRef.current = false;
    }
  }

  // Ligar pede o passo informativo (Tarefa 0032-0006): tocar na chave
  // desligada só expande o bloco; desligar grava na hora, como antes.
  function aoTocarNaChave() {
    if (linkAtivo) {
      setMostrandoExplicacao(false);
      alternarLink();
      return;
    }
    setMostrandoExplicacao(true);
  }

  // Confirmar recolhe e liga; cancelar recolhe sem gravar. Nenhum dos dois
  // fecha o popup (IDR 0055); os dois devolvem o foco à chave.
  function confirmarLigar() {
    setMostrandoExplicacao(false);
    chaveRef.current?.focus();
    alternarLink();
  }

  function cancelarLigar() {
    setMostrandoExplicacao(false);
    chaveRef.current?.focus();
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
          {podeCompartilhar && (
            <button
              type="button"
              role="menuitem"
              className="menu-de-compartilhar__item"
              disabled={!onCompartilharFaltantes}
              onClick={escolher(onCompartilharFaltantes)}
            >
              Compartilhar faltantes…
            </button>
          )}
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
          {podeCompartilhar && (
            <button
              type="button"
              role="menuitem"
              className="menu-de-compartilhar__item"
              disabled={!onCompartilharRepetidas}
              onClick={escolher(onCompartilharRepetidas)}
            >
              Compartilhar repetidas…
            </button>
          )}
          <div className="menu-de-compartilhar__filete" role="separator" />
          <button
            ref={chaveRef}
            type="button"
            role="switch"
            aria-checked={linkAtivo}
            className="menu-de-compartilhar__chave"
            disabled={!onAlternarLink}
            onClick={aoTocarNaChave}
          >
            <span className="menu-de-compartilhar__trilho" aria-hidden="true">
              <span className="menu-de-compartilhar__bolinha" />
            </span>
            Link do catálogo: {linkAtivo ? 'ligado' : 'desligado'}
          </button>
          {mostrandoExplicacao && !linkAtivo && (
            <div className="menu-de-compartilhar__explicacao">
              <p className="menu-de-compartilhar__explicacao-texto">
                Ao ligar, sua coleção fica visível sem login para quem tiver o link. Seu nome e
                e-mail não aparecem. Desligar revoga o acesso, mas quem já abriu pode ter copiado o
                que viu.
              </p>
              <div className="menu-de-compartilhar__explicacao-acoes">
                <button
                  type="button"
                  className="menu-de-compartilhar__confirmar"
                  onClick={confirmarLigar}
                >
                  Ligar o link
                </button>
                <button
                  type="button"
                  className="menu-de-compartilhar__cancelar"
                  onClick={cancelarLigar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          {linkAtivo && (
            <>
              <button
                type="button"
                role="menuitem"
                className="menu-de-compartilhar__item"
                disabled={!onCopiarLink}
                onClick={escolher(onCopiarLink)}
              >
                Copiar link do catálogo
              </button>
              {podeCompartilhar && (
                <button
                  type="button"
                  role="menuitem"
                  className="menu-de-compartilhar__item"
                  disabled={!onCompartilharLink}
                  onClick={escolher(onCompartilharLink)}
                >
                  Compartilhar link do catálogo…
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
