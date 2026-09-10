// Copyright (c) 2026 Daniel Felix Ferber

import twemoji from '@twemoji/api';

/**
 * Mapeia emoji de bandeira/ícone para o SVG Twemoji vendorizado.
 *
 * O Windows não renderiza emoji de bandeira nativamente; servimos o SVG
 * local como <img> — sem CDN em runtime e sem dangerouslySetInnerHTML,
 * conforme ADR 0002 e TDR 0003.
 */
const flagsByCodePoint = import.meta.glob('../assets/flags/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

/**
 * Retorna a URL do SVG correspondente ao emoji.
 *
 * @param {string} emoji - emoji Unicode (bandeira ou ícone temático).
 * @returns {string} URL do SVG vendorizado.
 */
export function urlDoIcone(emoji) {
  const codePoint = twemoji.convert.toCodePoint(emoji);
  const url = flagsByCodePoint[`../assets/flags/${codePoint}.svg`];
  if (!url) {
    throw new Error(`Nenhum SVG vendorizado para o icone "${codePoint}"`);
  }
  return url;
}
