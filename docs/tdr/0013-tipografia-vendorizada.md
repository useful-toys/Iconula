<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0013: Tipografia vendorizada (Poppins via Hosting)

## Status

Aceito

## Contexto

A Tarefa 0001-0004 (`docs/plano/0001-fundacao-catalogo-e-assets/0004-vendorizar-icones-e-tipografia.md`)
precisa colocar no repositório os arquivos da fonte Poppins (600 e 700),
especificada em `docs/interface.md` § Tipografia para o título, os
códigos dos cartões e os nomes de seção.

A CSP em vigor (`docs/tdr/0005-csp-firebase-auth-google-oauth.md`) tem
`style-src 'self'` e `font-src 'self'`, sem exceção para
`fonts.googleapis.com` nem `fonts.gstatic.com` — essas origens foram
removidas de propósito quando o FirebaseUI saiu
(`docs/adr/0006-login-google-sdk-modular.md` § Consequências). O
[ADR 0006](../adr/0006-login-google-sdk-modular.md) estabeleceu como
propriedade do projeto o "fim das requisições a terceiros em runtime":
nenhum visitante entrega IP ou User-Agent a CDN externo, inclusive quem
nunca faz login.

## Decisão

Vendorizar os quatro arquivos `.woff2` (Poppins 600 e 700, subsets
latin e latin-ext) em `src/assets/fonts/`, com os `@font-face`
declarados em `src/index.css` — `font-display: swap`, fallback
`system-ui, sans-serif`. Nenhum `@import` nem `<link>` para domínio
externo. A licença SIL Open Font License 1.1 é incluída junto dos
arquivos (`src/assets/fonts/OFL.txt`) e creditada no `README.md` da
pasta.

Subsets escolhidos: latin e latin-ext são suficientes para PT-BR e para
os nomes das seções do catálogo (todos em ASCII estendido latino). Os
demais subsets (devanagari, etc.) ficaram de fora — o app não os usa.

## Consequências

- **Nenhuma requisição de rede em runtime para carregar a fonte.** Os
  `.woff2` fazem parte do bundle, servidos pelo mesmo Firebase Hosting
  do resto do app — a CSP não precisa abrir `font-src` nem `style-src`
  para origem externa.
- **Custo de bundle: ~26,7 KB** (quatro `.woff2` somados). Não muda
  materialmente o tamanho do bundle de produção.
- **Propriedade preservada**: visitante nenhum entrega IP ou User-Agent
  ao Google Fonts — mesma propriedade que o
  [ADR 0002](../adr/0002-bandeiras-emoji-unicode.md) estabeleceu para
  os SVGs de bandeira.
- Se no futuro o app precisar de pesos ou famílias tipográficas
  adicionais, a regra é a mesma: vendorizar em `src/assets/fonts/`,
  nunca abrir a CSP para CDN de fonte.

## Alternativas consideradas

- **Poppins via Google Fonts CDN (`fonts.googleapis.com` + `fonts.gstatic.com`)**:
  rejeitado — exigiria reabrir `font-src` e `style-src` na CSP,
  revertendo decisão do ADR 0006 e do TDR 0005, e entregaria IP e
  User-Agent de todo visitante ao Google.
- **Trocar Poppins por `system-ui`**: rejeitado — `docs/interface.md`
  especifica Poppins 600/700 no título, códigos e nomes de seção; a
  decisão de interface é anterior e não foi revista.
- **Incluir todos os subsets do Google Fonts** (devanagari, etc.):
  rejeitado — o app é em PT-BR com nomes em ASCII estendido; os outros
  subsets aumentariam o bundle sem benefício.
