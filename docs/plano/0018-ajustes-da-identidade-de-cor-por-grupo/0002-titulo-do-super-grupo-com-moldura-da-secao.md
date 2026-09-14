<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0018-0002]: título do super-grupo com moldura da seção

## Status
Concluída

## Objetivo
O título do super-grupo ganha a moldura arredondada do cabeçalho de seção
(`--panel`, `border-radius: 12px`, `padding: 7px 12px`), mantém a barra
esquerda de 3px na cor do grupo e passa o fundo de 15% sobre transparente para
30% sobre `--panel`; o texto continua em `--gold`.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — título: moldura da
  seção + barra esquerda de 3px + fundo 30% sobre `--panel`, texto `--gold`
- `src/components/SuperGrupo.css` — o título atual (Fase 15, Tarefa 0015-0002)
- `src/components/Secao.css` — a moldura do cabeçalho de seção a reproduzir
  (`.secao__cabecalho`)
- `docs/interface.md` § Medidas — linha "Título de super-grupo"

## Padrões e convenções aplicáveis
- A cor nunca é o único sinal: o nome "Grupo A" continua no título — IDR 0045
- O texto do título continua em `--gold` — IDR 0045

## Escopo e instruções de implementação
1. Em `SuperGrupo.css`, `.super-grupo__titulo` passa a: `background:
   color-mix(in oklch, var(--group-color) 30%, var(--panel))`; `border: 1px
   solid var(--border)` com `border-left: 3px solid var(--group-color)`;
   `border-radius: 12px`; `padding: 7px 12px`; `align-items: center`.
2. O `--group-color` continua vindo das classes `--titulo--<letra>` (A–L),
   inalteradas.
3. Em `docs/interface.md` § Medidas, a linha "Título de super-grupo" passa a
   descrever a moldura, a barra esquerda de 3px e o fundo a 30% — citando o
   IDR 0045.

**Fora do escopo**: faixa de bandeiras (Tarefa 0018-0001); cor do texto
(continua `--gold`); chevron e progresso agregado (inalterados).

## Decisões já tomadas (não reabrir)
- Moldura da seção, barra esquerda de 3px, fundo 30% sobre `--panel` e texto
  `--gold` — ver `docs/idr/0045-cores-de-super-grupos.md`

## Arquivos impactados
- `src/components/SuperGrupo.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] `.super-grupo__titulo` com moldura (`--panel` + raio 12px + padding
      7px 12px), barra esquerda de 3px e fundo a 30% sobre `--panel`
- [ ] Texto do título permanece `--gold`
- [ ] `docs/interface.md` § Medidas descreve o título citando o IDR 0045

## Validação adicional
Verificação visual em `npm run dev`: conferir o título do super-grupo com a
moldura arredondada e a barra esquerda na cor do grupo, em contraste com o
cabeçalho de seção.
