// Copyright (c) 2026 Daniel Felix Ferber

import twemoji from "@twemoji/api";

// O Windows não possui glifos coloridos de bandeira na fonte de emoji do
// sistema: navegadores caem no fallback de mostrar as letras do código ISO
// (ex.: "AR") em vez da bandeira. Para garantir a bandeira em qualquer SO,
// convertemos o emoji Unicode no <img> SVG correspondente do Twemoji.
//
// Os SVGs são vendorizados em src/assets/flags/ (baixados uma vez do
// Twemoji, um por time) em vez de servidos por CDN em runtime, e
// renderizados como <img> comum — sem dangerouslySetInnerHTML — ver
// ADR 0002.
const flagsByCodePoint = import.meta.glob("../assets/flags/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

function flagUrl(flag) {
  const codePoint = twemoji.convert.toCodePoint(flag);
  const url = flagsByCodePoint[`../assets/flags/${codePoint}.svg`];
  if (!url) {
    throw new Error(`Nenhum SVG vendorizado para a bandeira "${codePoint}"`);
  }
  return url;
}

export default function TeamButton({ team, onClick }) {
  return (
    <button className="team-button" onClick={onClick}>
      <span className="team-button__flag" aria-hidden="true">
        <img
          className="emoji"
          alt=""
          draggable="false"
          src={flagUrl(team.flag)}
        />
      </span>
      <span className="team-button__name">{team.name}</span>
    </button>
  );
}
