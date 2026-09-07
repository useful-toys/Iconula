<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0002: Bandeiras como emoji Unicode via Twemoji

## Status

Aceito (revisado após teste manual)

## Contexto

O botão precisa mostrar a bandeira de cada uma das 48 seleções. As opções
avaliadas foram emoji Unicode nativo, um CDN de imagens de bandeira
(ex.: flagcdn.com), ou arquivos SVG locais.

Decisão inicial: usar emoji Unicode nativo (`"🇦🇷"` etc.), por não exigir
nenhuma dependência externa nem assets no repositório.

**Problema encontrado em teste manual**: no Windows, a fonte de emoji do
sistema (Segoe UI Emoji) não possui glifos coloridos de bandeira — o
navegador cai no fallback de mostrar as duas letras do código ISO como
texto simples (ex.: "AR" em vez de 🇦🇷). Isso não é um caso isolado; afeta
as 48 bandeiras para qualquer usuário Windows sem fonte de emoji colorida
adicional instalada.

## Decisão

Manter os dados como emoji Unicode em `src/data/teams.js` (continua sendo
a forma mais simples de representar e ler o dado), mas renderizar a
bandeira no componente `TeamButton` convertendo o emoji em uma imagem SVG
via [`@twemoji/api`](https://github.com/jdecked/twemoji) (fork mantido do
Twemoji original do Twitter), que serve os assets por CDN
(`cdn.jsdelivr.net`). Isso garante bandeiras visualmente consistentes em
qualquer sistema operacional/navegador, incluindo as sequências "tag" de
England e Scotland (que não têm código de país ISO próprio).

## Consequências

- Depende de uma requisição de rede por bandeira exibida (SVG pequeno,
  servido por CDN com boa disponibilidade); em uso normal do app (só a
  bandeira do time atual é renderizada por vez) o impacto é mínimo.
- O dado em `teams.js` continua sendo só o caractere emoji — a lógica de
  renderização fica isolada em `TeamButton.jsx`, então trocar a estratégia
  de exibição no futuro (ex. self-host dos SVGs) não exige tocar nos dados.

## Alternativas consideradas

- **Emoji Unicode nativo sem Twemoji**: mais simples, mas quebra no
  Windows conforme descrito acima — descartado.
- **CDN de bandeiras (flagcdn.com)**: bandeiras com aparência mais
  "realista" que emoji, mas exigiria mapear cada país para seu código
  ISO 3166-1 alpha-2 e não resolveria England/Scotland (sem código
  próprio) sem tratamento especial.
- **SVGs locais no repositório**: funciona 100% offline, mas exige
  baixar e versionar 48 arquivos; adiado — pode ser revisitado se a
  dependência de CDN externo em runtime se tornar um problema.
