<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0002]: cor no título do super-grupo

## Status
Pendente

## Objetivo
Aplicar a cor do grupo no título de cada super-grupo — borda esquerda de 3px
e fundo com 15% da cor sobre transparente —, com o texto do título em
`--gold`.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — título do
  super-grupo: borda esquerda 3px, fundo 15% misturado ao transparente
- `src/theme.css` — tokens `--group-a` a `--group-l` (gerados pela Tarefa
  0015-0001)
- `src/components/SuperGrupo.jsx` — prop `grupo` com a letra; título é o
  botão `super-grupo__titulo`
- `src/components/SuperGrupo.css` — título sem painel, fundo transparente
- `docs/adr/0008-css-modular-por-componente.md` — nomenclatura de classes
- `docs/tdr/0021-desempenho-do-catalogo.md` — comparador de `memo` do
  `SuperGrupo`
- `docs/interface.md` § Medidas — "Título de super-grupo: 13px/600 em
  `--gold`, com chevron, sem painel"

## Padrões e convenções aplicáveis
- CSS modular por componente — ADR 0008
- Cor reforça; "Grupo A" continua no título — `docs/requisitos.md`
  § Requisitos Não Funcionais
- A cor deriva da prop `grupo`, já comparada no `memo` — TDR 0021

## Escopo e instruções de implementação
1. Em `SuperGrupo.jsx`, uma classe modificadora por letra do grupo.
2. Em `SuperGrupo.css`, para cada uma das 12 letras, o título ganha borda
   esquerda de 3px na cor do grupo e fundo com 15% da cor misturada ao
   transparente.
3. Testes em `SuperGrupo.test.jsx`: cada letra recebe a sua classe.
4. Em `docs/interface.md` § Medidas, a linha do título de super-grupo passa
   a: 13px/600 em `--gold`, com chevron, borda esquerda de 3px e fundo 15% na
   cor do grupo — citando o IDR 0045.

**Fora do escopo**: FWC e COC (fora de super-grupos); cabeçalho de seção
(Fase 16); faixa de bandeiras (Tarefa 0015-0003).

## Decisões já tomadas (não reabrir)
- Borda, fundo e texto do título — ver
  `docs/idr/0045-cores-de-super-grupos.md`
- FWC e COC fora dos super-grupos — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Arquivos impactados
- `src/components/SuperGrupo.jsx`, `src/components/SuperGrupo.css`,
  `src/components/SuperGrupo.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Cada título tem borda esquerda de 3px e fundo 15% da cor do seu grupo
      (CSS e teste da classe por letra)
- [ ] Texto do título continua em `--gold`
- [ ] `docs/interface.md` § Medidas descreve o título citando o IDR 0045

## Validação adicional
Verificação visual em `npm run dev`, ordenação por página: os 12 super-grupos
abertos e fechados, títulos legíveis.
