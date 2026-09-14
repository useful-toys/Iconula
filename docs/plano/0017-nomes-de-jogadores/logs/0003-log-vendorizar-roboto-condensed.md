<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0017-0003: vendorizar a Roboto Condensed

## Data
2026-09-14

## Resumo
Vendoriza a Roboto Condensed 500 (subsets latin e latin-ext) em
`src/assets/fonts/`, servida pelo próprio Hosting, no mesmo padrão da
Poppins: `.woff2` no repositório, `@font-face` em `src/index.css` com
`font-display: swap` e `unicode-range` por subset, licença OFL 1.1 junto
dos arquivos. Nenhum CDN em runtime, CSP inalterada. A aplicação da fonte
no cartão fica para a Tarefa 0017-0005.

## Discovery
- Código: `src/index.css` declara os quatro `@font-face` da Poppins com
  `font-display: swap` e `unicode-range` por subset (latin e latin-ext);
  `src/assets/fonts/` guarda os `.woff2`, `OFL.txt` (com o copyright da
  Poppins no topo) e `README.md`. `firebase.json` tem `font-src 'self'`
  (DDR 0001); nenhum outro módulo referencia a pasta. Comportamento atual
  confere com a tarefa.
- Documentação: as referências bastaram. O TDR 0013 § Decisão já fixa
  Roboto Condensed 500, latin e latin-ext, `@font-face` em
  `src/index.css`, OFL 1.1 junto dos arquivos; o IDR 0047 § Decisão fixa
  o uso no nome em 10px (aplicação na Tarefa 0017-0005).

## Plano da alteração
1. Baixar os `.woff2` oficiais do Google Fonts (Roboto Condensed 500,
   latin e latin-ext) e copiá-los para `src/assets/fonts/` como
   `RobotoCondensed-500-latin.woff2` e
   `RobotoCondensed-500-latin-ext.woff2`; copiar a OFL 1.1 do projeto
   Roboto (`google/fonts` ofl/robotocondensed) como
   `OFL-RobotoCondensed.txt` — o `OFL.txt` existente traz o copyright da
   Poppins e é mantido.
2. Declarar dois `@font-face` de `Roboto Condensed` em `src/index.css`,
   peso 500, com os mesmos `unicode-range` de latin e latin-ext que a
   Poppins já usa (idênticos aos devolvidos pelo Google Fonts).
3. Atualizar `src/assets/fonts/README.md`: acrescentar a família, os dois
   arquivos, o peso, os subsets, os tamanhos e a licença.
4. Anotar no log a cobertura dos caracteres ğ ı ş İ ø č š ž ć e o
   tamanho somado dos arquivos novos.
- Verificação prevista: `.woff2` + licença presentes → arquivos em disco
  e no build; `@font-face` com `font-display: swap` → trecho de
  `src/index.css`; `firebase.json` inalterado → `git diff`; build inclui
  os arquivos → `dist/assets/` com os `.woff2`; cobertura e tamanho →
  análise do `unicode-range` e `Measure-Object`.
- Riscos: nenhum CDN em runtime (arquivos vendorizados); CSP não muda
  (sem `<link>` externo). Peso do bundle aumenta ~34,4 KB — esperado e
  aceito pelo TDR 0013.
- Desvios: nenhum

## Decisões tomadas
- Licença do Roboto Condensed em arquivo próprio
  (`OFL-RobotoCondensed.txt`), sem renomear o `OFL.txt` da Poppins — cada
  família tem o seu copyright no topo da OFL; renomear mexeria no TDR
  0013 e no README por motivo cosmético.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação

```
> npm run lint
Found 0 warnings and 0 errors.
Finished in 116ms on 73 files with 105 rules using 4 threads.

> npm run test
 Test Files  37 passed (37)
      Tests  435 passed (435)
(warnings de act(...) em App.importar/App.copiar/App.gravacao são
pré-existentes, não introduzidos aqui)

> npm run build
✓ 132 modules transformed.
dist/assets/RobotoCondensed-500-latin-ext-CcSTXKtO.woff2   14.16 kB
dist/assets/RobotoCondensed-500-latin-3p2daRJW.woff2       21.04 kB
✓ built in 849ms
```

`npm run test:rules` não se aplica: `firestore.rules` não foi tocado.

Cobertura dos caracteres exigidos pela Tarefa (análise do `unicode-range`
declarado em `src/index.css`):

| Caractere | Code point | Subset que cobre |
|---|---|---|
| ğ | U+011F | latin-ext |
| ı | U+0131 | latin (+ latin-ext) |
| ş | U+015F | latin-ext |
| İ | U+0130 | latin-ext |
| ø | U+00F8 | latin |
| č | U+010D | latin-ext |
| š | U+0161 | latin-ext |
| ž | U+017E | latin-ext |
| ć | U+0107 | latin-ext |

Tamanho somado dos dois `.woff2`: 35.208 bytes (~34,4 KB) — 21.040 bytes
(latin) + 14.168 bytes (latin-ext).

## Critérios de aceite
- [x] `.woff2` da Roboto Condensed 500 (latin e latin-ext) em
      `src/assets/fonts/`, com licença — `RobotoCondensed-500-latin.woff2`
      (21.040 bytes), `RobotoCondensed-500-latin-ext.woff2` (14.168 bytes)
      e `OFL-RobotoCondensed.txt` (OFL 1.1, Copyright 2011 The Roboto
      Project Authors)
- [x] `@font-face` declarados em `src/index.css` com `font-display: swap` —
      `src/index.css:40` e `src/index.css:49`
- [x] `firebase.json` inalterado (`git diff` vazio); `npm run build`
      inclui os arquivos — `dist/assets/RobotoCondensed-500-latin*.woff2`
- [x] Cobertura dos caracteres e tamanho anotados no log — tabela em
      § Validação e total de ~34,4 KB

## Arquivos alterados
- `src/assets/fonts/RobotoCondensed-500-latin.woff2` — criar (fonte 500, latin)
- `src/assets/fonts/RobotoCondensed-500-latin-ext.woff2` — criar (fonte 500, latin-ext)
- `src/assets/fonts/OFL-RobotoCondensed.txt` — criar (licença OFL 1.1 do Roboto)
- `src/index.css` — acrescenta dois `@font-face` da Roboto Condensed 500
- `src/assets/fonts/README.md` — documenta as duas famílias e a licença
- `docs/plano/0017-nomes-de-jogadores/0003-vendorizar-roboto-condensed.md` — status
- `docs/plano/README.md` — status da tarefa
