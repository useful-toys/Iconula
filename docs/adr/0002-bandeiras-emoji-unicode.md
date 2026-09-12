<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0002: Bandeiras como emoji Unicode via Twemoji

## Status

Aceito (revisado após teste manual; revisado novamente para remover a
dependência de CDN em runtime)

## Contexto

- Bandeira de cada uma das 48 seleções — opções avaliadas: emoji Unicode
  nativo, CDN de imagens (ex.: flagcdn.com), SVG locais.
- Decisão inicial: emoji Unicode nativo (`"🇦🇷"` etc.) — sem dependência
  externa nem assets no repositório.
- **Problema em teste manual**: no Windows, a fonte de emoji do sistema
  (Segoe UI Emoji) não tem glifos coloridos de bandeira — cai no fallback
  de mostrar o código ISO como texto ("AR" em vez de 🇦🇷). Afeta as 48
  bandeiras para qualquer usuário Windows sem fonte de emoji colorida
  adicional, não é caso isolado.

## Decisão

- Dado continua emoji Unicode em `src/data/teams.js` — forma mais simples
  de representar/ler.
- `TeamButton` converte o emoji em SVG do
  [Twemoji](https://github.com/jdecked/twemoji) (fork mantido do original
  do Twitter) — bandeiras visualmente consistentes em qualquer
  SO/navegador, incluindo as sequências "tag" de England/Scotland (sem
  código ISO próprio).

**Revisão — dependência de CDN externo removida**:
- Os 48 SVGs foram baixados uma vez de `cdn.jsdelivr.net` e vendorizados
  em `src/assets/flags/`, nomeados pelo code point Unicode (ex.:
  `1f1e6-1f1f7.svg` para Argentina).
- `TeamButton.jsx` resolve o arquivo via `import.meta.glob` do Vite e
  renderiza um `<img>` normal — sem CDN em runtime, sem
  `dangerouslySetInnerHTML`.
- `twemoji.convert.toCodePoint` (`@twemoji/api`) segue em uso só para
  calcular o nome do arquivo — sem `twemoji.parse()` nem geração de HTML.

## Consequências

- Nenhuma requisição de rede em runtime para exibir bandeiras: os SVGs
  fazem parte do bundle, servidos pelo mesmo Firebase Hosting do resto do
  app.
- `Content-Security-Policy` do Hosting não precisa mais abrir `img-src`
  para `cdn.jsdelivr.net` — fica restrita a `'self' data:'`.
- O dado em `teams.js` continua sendo só o caractere emoji — a lógica de
  renderização (e de resolução do SVG local) fica isolada em
  `TeamButton.jsx`.
- Adicionar um time novo no futuro exige também baixar o SVG
  correspondente para `src/assets/flags/` (nome do arquivo = code point
  Unicode do emoji, gerado com `twemoji.convert.toCodePoint`).

## Alternativas consideradas

- **Emoji Unicode nativo sem Twemoji**: mais simples, mas quebra no
  Windows conforme descrito acima — descartado.
- **CDN de bandeiras (flagcdn.com)**: bandeiras com aparência mais
  "realista" que emoji, mas exigiria mapear cada país para seu código
  ISO 3166-1 alpha-2 e não resolveria England/Scotland (sem código
  próprio) sem tratamento especial.
- **Twemoji via CDN em runtime** (decisão original): simples de
  implementar, mas depende de rede em runtime e impede fechar a CSP —
  substituída pelos SVGs vendorizados acima.
