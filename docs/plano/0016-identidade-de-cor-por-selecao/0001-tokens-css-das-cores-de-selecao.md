<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0016-0001: Tokens CSS das cores de seleção

## Status
Pendente

## Objetivo
Criar 50 tokens CSS em `theme.css` para as cores individuais das 48 seleções e dos 2 especiais (FWC e COC), convertidos para OKLCH.

## Documentos de referência
- `src/theme.css` — tokens existentes da paleta (OKLCH)
- `docs/interface.md` § Identidade visual — paleta e tokens
- Tabela de cores fornecida pelo humano (48 seleções + FWC + COC)

## Padrões e convenções aplicáveis
- Tokens em OKLCH, seguindo o padrão dos existentes (`--turf`, `--gold`, etc.)
- Cabeçalho de copyright no arquivo (`AGENTS.md` § Convenções)

## Escopo e instruções de implementação
1. Adicionar 50 tokens de cor em `src/theme.css`, agrupados sob comentário "Cores de seleção":
   - `--selection-alg` a `--selection-uzb` (48 seleções, em ordem alfabética pela sigla)
   - `--selection-fwc` (Extras FIFA — reaproveitar `var(--gold)`)
   - `--selection-coc` (Coca-Cola — vermelho característico)
2. Converter as cores hex fornecidas para OKLCH:
   - ALG: `#3FA65A` → `oklch(0.65 0.15 145)`
   - ARG: `#4A6FA5` → `oklch(0.52 0.12 255)`
   - AUS: `#3D6FB0` → `oklch(0.51 0.13 255)`
   - AUT: `#D2603A` → `oklch(0.58 0.18 35)`
   - BEL: `#D2402E` → `oklch(0.55 0.20 25)`
   - BIH: `#3B6EA5` → `oklch(0.51 0.12 255)`
   - BRA: `#3FA65A` → `oklch(0.65 0.15 145)`
   - CAN: `#E8836B` → `oklch(0.65 0.14 35)`
   - CIV: `#3A9A5C` → `oklch(0.62 0.14 145)`
   - COD: `#4A6FA5` → `oklch(0.52 0.12 255)`
   - COL: `#D89A3E` → `oklch(0.68 0.14 75)`
   - CPV: `#6B7FB5` → `oklch(0.58 0.10 265)`
   - CRO: `#D2603A` → `oklch(0.58 0.18 35)`
   - CUW: `#3A6EA8` → `oklch(0.51 0.13 255)`
   - CZE: `#5B7FA6` → `oklch(0.57 0.10 255)`
   - ECU: `#C8862E` → `oklch(0.62 0.14 65)`
   - EGY: `#D89A3E` → `oklch(0.68 0.14 75)`
   - ENG: `#D2402E` → `oklch(0.55 0.20 25)`
   - ESP: `#D2603A` → `oklch(0.58 0.18 35)`
   - FRA: `#6B7FB5` → `oklch(0.58 0.10 265)`
   - GER: `#D2402E` → `oklch(0.55 0.20 25)`
   - GHA: `#D89A3E` → `oklch(0.68 0.14 75)`
   - HAI: `#3D5FA0` → `oklch(0.47 0.14 265)`
   - IRN: `#3FA65A` → `oklch(0.65 0.15 145)`
   - IRQ: `#D2603A` → `oklch(0.58 0.18 35)`
   - JOR: `#3FA65A` → `oklch(0.65 0.15 145)`
   - JPN: `#D2603A` → `oklch(0.58 0.18 35)`
   - KOR: `#2E5FA3` → `oklch(0.47 0.15 260)`
   - KSA: `#4A9A3A` → `oklch(0.62 0.16 130)`
   - MAR: `#C05A3A` → `oklch(0.55 0.16 35)`
   - MEX: `#3FA65A` → `oklch(0.65 0.15 145)`
   - NED: `#6B7FB5` → `oklch(0.58 0.10 265)`
   - NOR: `#6B7FB5` → `oklch(0.58 0.10 265)`
   - NZL: `#3D6FB0` → `oklch(0.51 0.13 255)`
   - PAN: `#D2402E` → `oklch(0.55 0.20 25)`
   - PAR: `#D2603A` → `oklch(0.58 0.18 35)`
   - POR: `#3FA65A` → `oklch(0.65 0.15 145)`
   - QAT: `#C97A85` → `oklch(0.60 0.10 5)`
   - RSA: `#F4941F` → `oklch(0.70 0.17 65)`
   - SCO: `#2E8FA5` → `oklch(0.60 0.12 210)`
   - SEN: `#E8942A` → `oklch(0.70 0.16 65)`
   - SUI: `#C8792A` → `oklch(0.60 0.15 55)`
   - SWE: `#4A6FA5` → `oklch(0.52 0.12 255)`
   - TUN: `#D2603A` → `oklch(0.58 0.18 35)`
   - TUR: `#E05A4E` → `oklch(0.58 0.19 25)`
   - URU: `#4A6FA5` → `oklch(0.52 0.12 255)`
   - USA: `#4A6FA5` → `oklch(0.52 0.12 255)`
   - UZB: `#3D8FA5` → `oklch(0.60 0.12 215)`
   - FWC: `var(--gold)`
   - COC: `oklch(0.58 0.22 29)` (vermelho Coca-Cola)
3. Ajustar luminosidade se necessário para contraste mínimo 4.5:1 sobre `--panel`

**Fora do escopo**: aplicar as cores nos componentes (coberto pela tarefa 0002).

## Decisões já tomadas (não reabrir)
- Tema escuro único — ver [IDR 0022](../../idr/0022-tema-escuro-unico-paleta-do-prototipo.md)
- FWC abre e COC fecha o catálogo — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `src/theme.css` — modificar (adicionar tokens de cores de seleção)

## Critérios de aceite
- [ ] 50 tokens de cor criados em `theme.css`
- [ ] Cores convertidas para OKLCH mantendo identidade visual
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
