<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0001-0004: vendorizar ícones e tipografia

## Data
2026-09-09

## Resumo
Vendorizados os dois ícones temáticos dos especiais (🏆 e 🥤) e os quatro
arquivos da fonte Poppins (600 e 700, subsets latin e latin-ext), todos
servidos pelo próprio Hosting sem CDN em runtime.

**Arquivos criados:**

- `src/assets/flags/1f3c6.svg` — SVG Twemoji de 🏆 (Extras FIFA), 1,2 KB.
- `src/assets/flags/1f964.svg` — SVG Twemoji de 🥤 (Coca-Cola), 2,6 KB.
- `src/assets/fonts/Poppins-600-latin.woff2` — 8,0 KB.
- `src/assets/fonts/Poppins-600-latin-ext.woff2` — 5,5 KB.
- `src/assets/fonts/Poppins-700-latin.woff2` — 7,8 KB.
- `src/assets/fonts/Poppins-700-latin-ext.woff2` — 5,4 KB.
- `src/assets/fonts/OFL.txt` — licença SIL Open Font License 1.1 da Poppins.
- `src/assets/fonts/README.md` — crédito, licença e instruções de reprodução.
- `docs/tdr/0013-tipografia-vendorizada.md` — registra a decisão de
  vendorizar a fonte (CSP em vigor, propriedade de não entregar IP/UA a
  terceiros).

**Arquivos modificados:**

- `src/assets/flags/README.md` — título e descrição atualizados para
  mencionar que a pasta também guarda os ícones temáticos dos especiais,
  não só bandeiras.
- `src/index.css` — quatro `@font-face` declarados (Poppins 600/700,
  latin/latin-ext), com `font-display: swap` e fallback
  `system-ui, sans-serif`. Nenhum `@import` nem `<link>` para domínio
  externo.

## Decisões tomadas
- **Vendorizar Poppins × trocar por `system-ui`** (TDR 0013): vendorizar,
  porque `docs/interface.md` especifica Poppins 600/700 no título,
  códigos e nomes de seção, e a CSP proíbe CDN de fonte. A propriedade
  de não entregar IP/UA a terceiros (ADR 0006) se estende à tipografia.
- **Subsets latin e latin-ext**: suficientes para PT-BR e para os nomes
  das seções do catálogo (ASCII estendido latino). Devanagari e outros
  subsets ficaram de fora — o app não os usa.
- **@font-face em `src/index.css`**: CSS global do projeto, sem `@import`
  de arquivo externo — os `@font-face` estão no mesmo arquivo que o
  reset, evitando qualquer dependência de domínio externo.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: 0 warnings, 0 errors em 21 arquivos.
- `vitest run`: 7 arquivos de teste, 55 testes, todos passando.
- `vite build`: build de produção concluído com sucesso. Os quatro
  `.woff2` foram emitidos como assets separados no `dist/` (com hash no
  nome); os dois SVGs novos (🏆 e 🥤) foram incluídos no bundle JS via
  `import.meta.glob` (inline como data URI, junto com os demais SVGs
  pequenos). Aviso pré-existente sobre chunk grande, não relacionado a
  esta tarefa.

## Tamanhos
- Quatro `.woff2` somados: **26,7 KB** (8,0 + 5,5 + 7,8 + 5,4).
- Dois SVGs novos: **3,8 KB** (1,2 + 2,6).
- Impacto no bundle de produção: não material — os `.woff2` são servidos
  sob demanda pelo browser (só carrega o peso que a página usa), e os
  SVGs já estavam no padrão de inline do `import.meta.glob`.

## Critérios de aceite
- [x] `src/assets/flags/` tem os SVGs de 🏆 e 🥤, nomeados pelo code point
- [x] As 48 bandeiras cobrem as 48 seleções do catálogo, Inglaterra e Escócia inclusive
- [x] Poppins 600 e 700 em `.woff2` dentro do repositório, com licença creditada
- [x] Nenhuma referência a `fonts.googleapis.com`, `fonts.gstatic.com` ou a qualquer outro domínio externo no CSS ou no HTML
- [x] `firebase.json` não foi alterado
- [x] Registros ADR/TDR/IDR criados para as decisões tomadas (TDR 0013)
- [x] `docs/plano/0001-fundacao-catalogo-e-assets/logs/0004-log-vendorizar-icones-e-tipografia.md` gerado

## Arquivos alterados
- `src/assets/flags/1f3c6.svg` — criar
- `src/assets/flags/1f964.svg` — criar
- `src/assets/flags/README.md` — modificar
- `src/assets/fonts/Poppins-600-latin.woff2` — criar
- `src/assets/fonts/Poppins-600-latin-ext.woff2` — criar
- `src/assets/fonts/Poppins-700-latin.woff2` — criar
- `src/assets/fonts/Poppins-700-latin-ext.woff2` — criar
- `src/assets/fonts/OFL.txt` — criar
- `src/assets/fonts/README.md` — criar
- `src/index.css` — modificar (@font-face)
- `docs/tdr/0013-tipografia-vendorizada.md` — criar
- `docs/plano/0001-fundacao-catalogo-e-assets/0004-vendorizar-icones-e-tipografia.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0004 atualizado
- `docs/plano/0001-fundacao-catalogo-e-assets/logs/0004-log-vendorizar-icones-e-tipografia.md` — este log
