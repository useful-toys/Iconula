// Copyright (c) 2026 Daniel Felix Ferber
//
// 48 seleções classificadas para a Copa do Mundo FIFA 2026, ordenadas
// alfabeticamente pelo nome (independente do agrupamento em grupos).
//
// Observação sobre England/Scotland: não possuem código de país ISO
// próprio (fazem parte do Reino Unido). Usamos as sequências Unicode
// "tag" de bandeira de subdivisão, renderizadas corretamente via Twemoji
// (ver TeamButton.jsx) mesmo em plataformas sem suporte nativo a elas.
export const teams = [
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Bosnia & Herzegovina", flag: "🇧🇦" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Cape Verde", flag: "🇨🇻" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Curaçao", flag: "🇨🇼" },
  { name: "Czechia", flag: "🇨🇿" },
  { name: "DR Congo", flag: "🇨🇩" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Haiti", flag: "🇭🇹" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Türkiye", flag: "🇹🇷" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Uzbekistan", flag: "🇺🇿" },
];

// Salvaguarda: garante ordem alfabética mesmo que `teams` acima seja
// editado fora de ordem no futuro.
export const sortedTeams = [...teams].sort((a, b) =>
  a.name.localeCompare(b.name),
);
