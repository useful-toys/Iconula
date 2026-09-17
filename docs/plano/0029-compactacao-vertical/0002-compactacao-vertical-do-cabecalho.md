<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0029-0002]: compactação vertical do cabeçalho

## Status
Concluída

## Objetivo
Apertar os respiros verticais do cabeçalho sticky: `padding` `12px 10px → 8px
2px`, `gap` entre linhas `8px → 4px`, `padding` da faixa de bandeiras `8px →
4px` e `padding-top` do corpo `20px → 4px` — reduzindo o vão entre a faixa e a
primeira seção em ~70% e a margem superior à metade.

## Documentos de referência
- `docs/idr/0057-compactacao-vertical-do-cabecalho.md` § Decisão — os valores.
- `docs/interface.md` § Medidas — valores vigentes (cabeçalho, faixa, corpo).

## Padrões e convenções aplicáveis
- O cabeçalho continua sticky, com título → controles → faixa (IDR 0018).
- `interface.md` § Medidas no estado atual, com lastro em registro.

## Escopo e instruções de implementação
1. Em `theme.css`: `--header-padding: 12px var(--page-gutter) 10px → 8px
   var(--page-gutter) 2px`; `--body-padding: 20px var(--page-gutter) 64px →
   4px var(--page-gutter) 64px`.
2. Em `Cabecalho.css`: `.cabecalho` `gap: 8px var(--page-gutter) → 4px
   var(--page-gutter)` (só o row-gap).
3. Em `FaixaDeSecoes.css`: `.faixa-de-secoes__trilha` `padding: 8px
   var(--page-gutter) → 4px var(--page-gutter)`.
4. Atualizar `interface.md` § Medidas.

**Fora do escopo**: a data/hora em Roboto Condensed (Tarefa 0029-0003); a
compactação do catálogo (Tarefa 0029-0001).

## Decisões já tomadas (não reabrir)
- Valores da compactação vertical do cabeçalho — ver
  `docs/idr/0057-compactacao-vertical-do-cabecalho.md`.

## Arquivos impactados
- `src/theme.css` — modificar
- `src/components/Cabecalho.css` — modificar
- `src/components/FaixaDeSecoes.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `--header-padding` com `8px … 2px`; `--body-padding` com `4px … 64px`.
- [ ] `.cabecalho` com row-gap de 4px; trilha da faixa com `padding: 4px`.
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- `npm run dev` — verificar o vão entre a faixa e a primeira seção reduzido, e
  o cabeçalho sticky sem sobrepor o conteúdo.
