<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Fontes vendorizadas (SIL Open Font License)

Os arquivos `.woff2` desta pasta fazem parte do bundle e são servidos
pelo próprio Firebase Hosting. Nenhum `@import` nem `<link>` para
domínio externo em runtime — a CSP em vigor tem `style-src 'self'` e
`font-src 'self'`, sem exceção para `fonts.googleapis.com` nem
`fonts.gstatic.com` (ver
[DDR 0001](../../../docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md) e
[TDR 0013](../../../docs/tdr/0013-tipografia-vendorizada.md)).

## Poppins

Os quatro arquivos `.woff2` da [Poppins](https://github.com/itfoundry/Poppins),
de Indian Type Foundry, licenciados sob
[SIL Open Font License 1.1](OFL.txt).
Copyright 2020 The Poppins Project Authors.

| Arquivo | Peso | Subset | Tamanho |
|---|---|---|---|
| `Poppins-600-latin.woff2` | 600 | U+0000–00FF e caracteres latinos básicos | ~8 KB |
| `Poppins-600-latin-ext.woff2` | 600 | U+0100–02BA, extensões latinas (PT-BR, europeus) | ~5,5 KB |
| `Poppins-700-latin.woff2` | 700 | U+0000–00FF e caracteres latinos básicos | ~7,8 KB |
| `Poppins-700-latin-ext.woff2` | 700 | U+0100–02BA, extensões latinas (PT-BR, europeus) | ~5,4 KB |

Total: ~26,7 KB.

## Roboto Condensed

Os dois arquivos `.woff2` da
[Roboto Condensed](https://github.com/googlefonts/roboto-classic),
licenciados sob [SIL Open Font License 1.1](OFL-RobotoCondensed.txt).
Copyright 2011 The Roboto Project Authors.

| Arquivo | Peso | Subset | Tamanho |
|---|---|---|---|
| `RobotoCondensed-500-latin.woff2` | 500 | U+0000–00FF e caracteres latinos básicos | ~20,5 KB |
| `RobotoCondensed-500-latin-ext.woff2` | 500 | U+0100–02BA, extensões latinas (PT-BR, europeus) | ~13,8 KB |

Total: ~34,4 KB. Cobre os caracteres dos nomes de jogadores
(ğ ı ş İ ø č š ž ć), distribuídos entre os subsets latin e latin-ext.

Os `@font-face` das duas famílias estão declarados em `src/index.css`,
com `font-display: swap` e fallback `system-ui, sans-serif`.

## Como reproduzir

Os arquivos foram obtidos via CSS do Google Fonts (User-Agent de
navegador moderno), que devolve URLs diretos do `fonts.gstatic.com`:

```bash
curl -sf "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2" \
  -o src/assets/fonts/Poppins-600-latin.woff2
# repita para os demais pesos/subsets
```

A Roboto Condensed 500 veio do CSS
`https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@500&display=swap`;
a licença, de `google/fonts` (`ofl/robotocondensed/OFL.txt`).
