<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0015-0001: Tokens CSS das cores de grupo

## Status
Pendente

## Objetivo
Criar 14 tokens CSS em `theme.css` para as cores dos 12 grupos da Copa (A–L) e dos 2 especiais (FWC dourado, COC vermelho Coca-Cola), convertidos para OKLCH com ajuste de contraste para o tema escuro.

## Documentos de referência
- `src/theme.css` — tokens existentes da paleta (OKLCH)
- `docs/interface.md` § Identidade visual — paleta e tokens

## Padrões e convenções aplicáveis
- Tokens em OKLCH, seguindo o padrão dos existentes (`--turf`, `--gold`, etc.)
- Cabeçalho de copyright no arquivo (`AGENTS.md` § Convenções)

## Escopo e instruções de implementação
1. Adicionar 14 tokens de cor em `src/theme.css`, agrupados sob comentário "Cores de grupo":
   - `--group-a` a `--group-l` (12 grupos da Copa)
   - `--group-fwc` (Extras FIFA — dourado, reaproveitar `var(--gold)`)
   - `--group-coc` (Coca-Cola — vermelho característico)
2. Converter as cores hex propostas para OKLCH:
   - A (Verde): `#4CAF50` → `oklch(0.65 0.17 142)`
   - B (Vermelho): `#E53935` → `oklch(0.58 0.22 29)`
   - C (Verde-limão): `#C0CA33` → `oklch(0.72 0.16 95)`
   - D (Azul-índigo): `#3F51B5` → `oklch(0.45 0.17 275)`
   - E (Laranja): `#F4511E` → `oklch(0.62 0.20 35)`
   - F (Verde-azulado): `#00695C` → `oklch(0.50 0.12 195)`
   - G (Lilás): `#B39DDB` → `oklch(0.70 0.12 295)`
   - H (Azul-petróleo): `#26A69A` → `oklch(0.65 0.13 185)`
   - I (Roxo): `#6A1B9A` → `oklch(0.52 0.20 305)`
   - J (Salmão): `#E8B4A8` → `oklch(0.75 0.10 25)`
   - K (Rosa): `#EC407A` → `oklch(0.63 0.20 355)`
   - L (Vermelho-vinho): `#8D2E2E` → `oklch(0.48 0.15 25)`
   - FWC: `var(--gold)`
   - COC: `oklch(0.58 0.22 29)` (vermelho Coca-Cola)
3. Ajustar luminosidade se necessário para contraste mínimo 4.5:1 sobre `--panel`

**Fora do escopo**: aplicar as cores nos componentes (coberto pelas tarefas 0002, 0003 e 0004).

## Decisões já tomadas (não reabrir)
- Tema escuro único — ver [IDR 0022](../../idr/0022-tema-escuro-unico-paleta-do-prototipo.md)
- FWC abre e COC fecha o catálogo — ver [IDR 0028](../../idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md)

## Arquivos impactados
- `src/theme.css` — modificar (adicionar tokens de cores de grupo)

## Critérios de aceite
- [ ] 14 tokens de cor criados em `theme.css`
- [ ] Cores convertidas para OKLCH mantendo identidade visual
- [ ] `npm run lint` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
