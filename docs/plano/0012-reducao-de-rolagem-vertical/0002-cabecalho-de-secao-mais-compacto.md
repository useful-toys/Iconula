<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0012-0002]: cabeçalho de seção mais compacto

## Status
Pendente

## Objetivo
Reduzir a altura do cabeçalho de cada seção — repetido 50 vezes no catálogo —
com `padding` de `7px 12px`, sem mexer em ícone, tipografia, borda ou raio.

## Documentos de referência
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — padding
  do cabeçalho de seção
- `docs/interface.md` § Medidas — "Cabeçalho de seção: painel com borda, raio
  12px, `padding: 10px 14px`; ícone 18px, nome 14px/600"
- `src/components/Secao.css` — `.secao__cabecalho`
- `src/theme.css` — `--secao-altura-estimada`, usado por
  `content-visibility` (TDR 0021)

## Padrões e convenções aplicáveis
- O cabeçalho continua um único botão de largura total — `src/components/Secao.jsx`
- Ícone e chevron continuam presentes; cor nunca é o único sinal —
  `docs/requisitos.md` § Requisitos Não Funcionais
- Ícone (18px) e tipografia (14px/600) não mudam — IDR 0050

## Escopo e instruções de implementação
1. `padding` de `.secao__cabecalho` passa a `7px 12px`.
2. Conferir se `--secao-altura-estimada` ainda aproxima a altura média de uma
   seção; se não, recalibrar (nível 1, TDR 0021).
3. Registrar no log a altura do cabeçalho antes e depois e a economia × 50.
4. Em `docs/interface.md` § Medidas, o cabeçalho de seção passa a
   `padding: 7px 12px`, citando o IDR 0050.

**Fora do escopo**: ícone, chevron, tipografia, borda, raio; espaçamentos
entre blocos (Tarefa 0012-0003); margem inferior (Tarefa 0012-0004).

## Decisões já tomadas (não reabrir)
- Padding `7px 12px` — ver `docs/idr/0050-compactacao-vertical-do-catalogo.md`
- Painel com borda, raio 12px, ícone 18px, nome 14px/600 — ver
  `docs/idr/0022-tema-escuro-unico-paleta-do-prototipo.md`

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `src/theme.css` — modificar, se `--secao-altura-estimada` for recalibrado
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.secao__cabecalho` com `padding: 7px 12px` (conferido no CSS)
- [ ] Ícone, texto e chevron sem corte (verificação visual)
- [ ] Economia × 50 registrada no log
- [ ] `docs/interface.md` § Medidas com o novo padding, citando o IDR 0050

## Validação adicional
Verificação visual em `npm run dev`, em largura de celular: rolar por vários
super-grupos e conferir cabeçalhos legíveis e fáceis de tocar.
