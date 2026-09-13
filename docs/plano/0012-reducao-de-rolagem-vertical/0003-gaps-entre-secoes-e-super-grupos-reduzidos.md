<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0003]: gaps entre seções e super-grupos reduzidos

## Status
Concluída

## Objetivo
Apertar os espaçamentos entre blocos do catálogo — 16→12px entre
super-grupos, 14→10px entre seções, 10→8px do cabeçalho à grade —, que se
repetem dezenas de vezes e somam quase uma tela de rolagem.

## Documentos de referência
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — os três
  valores e os dois espaçamentos que não mudam
- `docs/interface.md` § Medidas — "Corpo: … 16px entre super-grupos" e
  "Espaçamentos internos: 14px entre seções…, 10px entre o cabeçalho da seção
  e a sua grade, 8px entre cartões… e 20px entre as duas páginas"
- `src/theme.css` — tokens `--super-group-gap`, `--section-gap`,
  `--section-body-gap`, `--card-gap-list`, `--album-page-gap`
- Consumidores: `src/components/SuperGrupo.css`, `src/components/Catalogo.css`,
  `src/components/Secao.css`

## Padrões e convenções aplicáveis
- Só os valores dos tokens mudam, não a arquitetura de espaçamento —
  `src/theme.css`
- `--card-gap-list` e `--album-page-gap` não mudam — IDR 0050
- Blocos distintos continuam parecendo distintos — IDR 0050

## Escopo e instruções de implementação
1. `--super-group-gap` 16px → 12px; `--section-gap` 14px → 10px;
   `--section-body-gap` 10px → 8px.
2. Registrar no log a economia estimada (token × ocorrências).
3. Em `docs/interface.md` § Medidas, as linhas "Corpo" e "Espaçamentos
   internos" passam a 12px, 10px e 8px, citando o IDR 0050.

**Fora do escopo**: `--card-gap-list`, `--album-page-gap`; padding do cabeçalho
de seção (Tarefa 0012-0002); margem inferior (Tarefa 0012-0004).

## Decisões já tomadas (não reabrir)
- Os novos valores e os que ficam — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`

## Arquivos impactados
- `src/theme.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Os três tokens com 12px, 10px e 8px (conferido no CSS)
- [ ] `--card-gap-list` e `--album-page-gap` inalterados (conferido no diff)
- [ ] Economia estimada registrada no log
- [ ] `docs/interface.md` § Medidas com os novos valores, citando o IDR 0050

## Validação adicional
Verificação visual em `npm run dev`: rolar pelas duas ordenações e pelas duas
disposições, conferindo a separação entre blocos.
