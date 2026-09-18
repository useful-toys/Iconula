// Copyright (c) 2026 Daniel Felix Ferber

/**
 * Analytics de uso com Google Analytics 4, carregado sob consentimento
 * (ADR 0011, IDR 0071).
 *
 * Único módulo que toca o Google Analytics. Não importa nenhum SDK do
 * Firebase: o `gtag.js` é um script externo injetado em runtime, só depois do
 * consentimento, para não pesar o bundle de quem recusa. Nenhum componente
 * chama o gtag diretamente — a Tarefa 0036-0003 monta o banner e usa
 * `consentimentoAnalytics`/`gravarConsentimentoAnalytics`/`carregarAnalytics`.
 *
 * O consentimento vive no `localStorage`, por dispositivo, na chave versionada
 * `iconula.consentimento-analytics.v1` (MDR 0007). Leitura/escrita degradam em
 * silêncio para o padrão conservador: valor desconhecido ou falha de leitura
 * vale como "nunca decidido" — o gtag nunca carrega sem um `'aceito'` explícito.
 *
 * Gate rígido (IDR 0071): nada é enviado ao Google antes do aceite, e os
 * canais de preview do Firebase Hosting (`iconula--pr<N>-*.web.app`) ficam de
 * fora para não poluir a medição.
 */

const CHAVE_CONSENTIMENTO = 'iconula.consentimento-analytics.v1';
const VALORES_CONSENTIMENTO = ['aceito', 'recusado'];
const ID_SCRIPT_GTAG = 'iconula-gtag';
const URL_GTAG = 'https://www.googletagmanager.com/gtag/js';

/**
 * Lê o consentimento de analytics guardado no `localStorage`.
 *
 * Ausência, valor fora de `'aceito' | 'recusado'` ou falha de leitura
 * (storage bloqueado) valem como `'nao-decidido'` — nunca como `'aceito'`
 * (MDR 0007).
 *
 * @returns {'aceito'|'recusado'|'nao-decidido'}
 */
export function consentimentoAnalytics() {
  let bruto;
  try {
    bruto = window.localStorage.getItem(CHAVE_CONSENTIMENTO);
  } catch {
    return 'nao-decidido';
  }
  return VALORES_CONSENTIMENTO.includes(bruto) ? bruto : 'nao-decidido';
}

/**
 * Grava o consentimento de analytics no `localStorage`.
 *
 * Só aceita `'aceito' | 'recusado'`; outro valor é ignorado, para não
 * corromper a chave. Falha de escrita é ignorada em silêncio (MDR 0007).
 *
 * @param {'aceito'|'recusado'} valor
 */
export function gravarConsentimentoAnalytics(valor) {
  if (!VALORES_CONSENTIMENTO.includes(valor)) return;
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, valor);
  } catch {
    // Falha de escrita cai no padrão e segue; nada a comunicar.
  }
}

/**
 * Measurement ID do GA4 substituído no build (ADR 0011), vazio se ausente.
 *
 * @returns {string}
 */
function idDeMedicao() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || '';
}

/**
 * Host de canal de preview do Firebase Hosting — `iconula--pr<N>-<hash>.web.app`
 * (DDR 0008).
 *
 * @param {string} hostname
 * @returns {boolean}
 */
function ehHostDeCanal(hostname) {
  return /^iconula--pr\d+-[a-z0-9]+\.web\.app$/i.test(hostname);
}

/**
 * Host local de desenvolvimento.
 *
 * @param {string} hostname
 * @returns {boolean}
 */
function ehLocal(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

/**
 * Ambiente em que o analytics não deve carregar: canal de preview, ou
 * `localhost` sem a variável de medição (dev sem `.env.local` configurado).
 *
 * @returns {boolean}
 */
function ehAmbienteDePreview() {
  const hostname = window.location.hostname;
  return ehHostDeCanal(hostname) || (ehLocal(hostname) && !idDeMedicao());
}

/**
 * Injeta o `gtag.js` e configura o Measurement ID, se houver consentimento
 * para chegar até aqui.
 *
 * Sem efeito quando `VITE_GA_MEASUREMENT_ID` não existe, em ambiente de
 * preview ou se o script já foi injetado — idempotente.
 */
export function carregarAnalytics() {
  if (document.getElementById(ID_SCRIPT_GTAG)) return;

  const id = idDeMedicao();
  if (!id) return;
  if (ehAmbienteDePreview()) return;

  const script = document.createElement('script');
  script.id = ID_SCRIPT_GTAG;
  script.async = true;
  script.src = `${URL_GTAG}?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

/**
 * Ponto de entrada da abertura do app: carrega o gtag só se a escolha
 * guardada for `'aceito'` e o ambiente não for de preview.
 */
export function iniciarAnalyticsSeConsentido() {
  if (consentimentoAnalytics() !== 'aceito') return;
  if (ehAmbienteDePreview()) return;
  carregarAnalytics();
}
