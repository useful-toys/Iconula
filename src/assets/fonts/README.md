<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Poppins (vendorizada, SIL Open Font License)

Os quatro arquivos `.woff2` desta pasta são subconjuntos da fonte
[Poppins](https://github.com/itfoundry/Poppins), de Indian Type Foundry,
licenciados sob [SIL Open Font License 1.1](OFL.txt).
Copyright 2020 The Poppins Project Authors.

Baixados uma única vez do Google Fonts (não são gerados em build nem em
runtime), para eliminar a dependência de CDN externo em runtime — a CSP
em vigor tem `style-src 'self'` e `font-src 'self'`, sem exceção para
`fonts.googleapis.com` nem `fonts.gstatic.com` (ver
[TDR 0005](../../../docs/tdr/0005-csp-firebase-auth-google-oauth.md) e
[TDR 0013](../../../docs/tdr/0013-tipografia-vendorizada.md)).

## Arquivos

| Arquivo | Peso | Subset |
|---|---|---|
| `Poppins-600-latin.woff2` | ~8 KB | U+0000–00FF e caracteres latinos básicos |
| `Poppins-600-latin-ext.woff2` | ~5,5 KB | U+0100–02BA, extensões latinas (PT-BR, europeus) |
| `Poppins-700-latin.woff2` | ~7,8 KB | U+0000–00FF e caracteres latinos básicos |
| `Poppins-700-latin-ext.woff2` | ~5,4 KB | U+0100–02BA, extensões latinas (PT-BR, europeus) |

Total: ~26,7 KB. Os `@font-face` estão declarados em `src/index.css`,
com `font-display: swap` e fallback `system-ui, sans-serif`.

## Como reproduzir

Os arquivos foram obtidos via CSS do Google Fonts (User-Agent de
navegador moderno), que devolve URLs diretos do `fonts.gstatic.com`:

```bash
curl -sf "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2" \
  -o src/assets/fonts/Poppins-600-latin.woff2
# repita para os demais pesos/subsets
```
