// Copyright (c) 2026 Daniel Felix Ferber

import { useState } from 'react';
import {
  carregarAnalytics,
  consentimentoAnalytics,
  gravarConsentimentoAnalytics,
} from '../lib/analytics.js';
import './BannerDeConsentimento.css';

/**
 * Faixa de consentimento do analytics (IDR 0071).
 *
 * Só existe enquanto o consentimento guardado é `'nao-decidido'` — nunca
 * decidido, valor desconhecido ou falha de leitura (MDR 0007). "Aceitar" grava
 * `'aceito'` e carrega o gtag; "Recusar" grava `'recusado'` e mantém o app
 * 100% funcional, sem analytics. As duas ações somem com o banner e a escolha
 * é lembrada por dispositivo, no `localStorage`.
 *
 * `App.jsx` monta o banner na tela de login e na principal, antes do conteúdo,
 * de forma independente da sessão. O link da política aciona `onAbrirPolitica`
 * (callbacks no-op por padrão, como em `TelaDeLogin`).
 */
export default function BannerDeConsentimento({ onAbrirPolitica = () => {} }) {
  const [decidido, setDecidido] = useState(
    () => consentimentoAnalytics() !== 'nao-decidido',
  );

  if (decidido) return null;

  function aceitar() {
    gravarConsentimentoAnalytics('aceito');
    carregarAnalytics();
    setDecidido(true);
  }

  function recusar() {
    gravarConsentimentoAnalytics('recusado');
    setDecidido(true);
  }

  return (
    <section className="banner-consentimento" aria-label="Consentimento de analytics">
      <p className="banner-consentimento__texto">
        Usamos cookies e identificadores para medir o uso do app, só com o seu
        aceite.{' '}
        <button
          type="button"
          className="banner-consentimento__link"
          onClick={onAbrirPolitica}
        >
          Ver a política
        </button>
      </p>
      <div className="banner-consentimento__acoes">
        <button
          type="button"
          className="banner-consentimento__recusar"
          onClick={recusar}
        >
          Recusar
        </button>
        <button
          type="button"
          className="banner-consentimento__aceitar"
          onClick={aceitar}
        >
          Aceitar
        </button>
      </div>
    </section>
  );
}
