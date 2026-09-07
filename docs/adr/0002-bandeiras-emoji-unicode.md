<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0002: Bandeiras como emoji Unicode via Twemoji

## Status

Aceito (revisado após teste manual; revisado novamente para remover a
dependência de CDN em runtime)

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
do [Twemoji](https://github.com/jdecked/twemoji) (fork mantido do Twemoji
original do Twitter). Isso garante bandeiras visualmente consistentes em
qualquer sistema operacional/navegador, incluindo as sequências "tag" de
England e Scotland (que não têm código de país ISO próprio).

**Revisão (dependência de CDN externo removida)**: os 48 SVGs foram
baixados uma única vez de `cdn.jsdelivr.net` e passaram a ser vendorizados
em `src/assets/flags/`, nomeados pelo code point Unicode da bandeira
(ex.: `1f1e6-1f1f7.svg` para Argentina). `TeamButton.jsx` resolve o
arquivo correspondente via `import.meta.glob` do Vite e renderiza um
`<img>` React normal — sem CDN em runtime e sem `dangerouslySetInnerHTML`
(ver decisão relacionada sobre o item de segurança correspondente). A
função `twemoji.convert.toCodePoint` (de `@twemoji/api`) continua em uso
só para calcular o nome do arquivo a partir do emoji — não há mais
`twemoji.parse()` nem geração de HTML.

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
