// Copyright (c) 2026 Daniel Felix Ferber

import { useState, useSyncExternalStore } from 'react';
import {
  SEVERIDADE,
  assinarAvisos,
  dispensarAviso,
  obterAvisos,
} from '../lib/avisos.js';
import './Avisos.css';

/**
 * Área flutuante de avisos, colada à borda inferior da janela (IDR 0029).
 *
 * Exibe as faixas empilhadas da fila de `lib/avisos.js`: sucesso e aviso
 * expiram em 5s, a falha persiste até ser dispensada ou até um sucesso do
 * mesmo tipo a dispensar. A falha é anunciada com `role="alert"`; sucesso e
 * aviso, de forma não intrusiva, com `role="status"`.
 */
export function Avisos() {
  const avisos = useSyncExternalStore(assinarAvisos, obterAvisos);

  if (avisos.length === 0) {
    return null;
  }

  return (
    <div className="avisos">
      {avisos.map((aviso) => (
        <Faixa key={aviso.id} aviso={aviso} />
      ))}
    </div>
  );
}

function Faixa({ aviso }) {
  const [detalheAberto, setDetalheAberto] = useState(false);
  const ehFalha = aviso.severidade === SEVERIDADE.FALHA;
  const temDetalhe = ehFalha && Boolean(aviso.detalhe);

  return (
    <div
      className={`avisos__faixa avisos__faixa--${aviso.severidade}`}
      role={ehFalha ? 'alert' : 'status'}
    >
      {temDetalhe ? (
        <button
          type="button"
          className="avisos__mensagem avisos__mensagem--botao"
          aria-expanded={detalheAberto}
          onClick={() => setDetalheAberto((atual) => !atual)}
        >
          <span className="avisos__texto">{aviso.mensagem}</span>
          {detalheAberto && <span className="avisos__detalhe">{aviso.detalhe}</span>}
        </button>
      ) : (
        <span className="avisos__mensagem">
          <span className="avisos__texto">{aviso.mensagem}</span>
        </span>
      )}
      <button
        type="button"
        className="avisos__dispensar"
        aria-label="Dispensar aviso"
        onClick={() => dispensarAviso(aviso.id)}
      >
        ×
      </button>
    </div>
  );
}
