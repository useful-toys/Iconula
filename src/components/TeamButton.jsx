// Copyright (c) 2026 Daniel Felix Ferber

import twemoji from "@twemoji/api";

// O Windows não possui glifos coloridos de bandeira na fonte de emoji do
// sistema: navegadores caem no fallback de mostrar as letras do código ISO
// (ex.: "AR") em vez da bandeira. Para garantir a bandeira em qualquer SO,
// convertemos o emoji Unicode em um <img> via Twemoji (SVG servido por CDN).
export default function TeamButton({ team, onClick }) {
  const flagHtml = twemoji.parse(team.flag, { folder: "svg", ext: ".svg" });

  return (
    <button className="team-button" onClick={onClick}>
      <span
        className="team-button__flag"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: flagHtml }}
      />
      <span className="team-button__name">{team.name}</span>
    </button>
  );
}
