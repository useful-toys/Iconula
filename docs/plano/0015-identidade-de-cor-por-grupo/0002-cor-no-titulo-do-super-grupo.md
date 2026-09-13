<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0002]: cor no título do super-grupo

## Status
Pendente

## Objetivo
Aplicar a cor do grupo no título do `SuperGrupo.jsx` — borda esquerda de 3px e
fundo com 15% de opacidade — usando os tokens da Tarefa 0001, com o texto do
título mantendo `--gold`.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — "título do
  super-grupo: borda esquerda 3px + fundo com 15% de opacidade"; FWC e COC
  ficam de fora (não têm super-grupo)
- `src/components/SuperGrupo.jsx` — a prop `grupo` já é a letra (A–L); o
  título é o `button.super-grupo__titulo`, com texto em `--gold`
- `src/components/SuperGrupo.css` — estilos atuais do título
- `docs/adr/0008-css-modular-por-componente.md` — convenção de nomenclatura
  de classes
- `docs/tdr/0021-desempenho-do-catalogo.md` — memoização: a classe derivada
  da prop existente não muda o comportamento de `propsEquivalentes`
- `docs/interface.md` § Corpo — cabeçalho de super-grupo

## Padrões e convenções aplicáveis
- CSS modular por componente (prefixo `super-grupo--`) — ADR 0008
- Cor nunca é o único sinal: a cor reforça a identidade do grupo; o nome
  "Grupo A" continua no título — `docs/requisitos.md` § Requisitos Não
  Funcionais
- O texto do título mantém `--gold` para contraste — IDR 0045

## Escopo e instruções de implementação
1. Em `SuperGrupo.jsx`, acrescentar a classe dinâmica
   `super-grupo--grupo-{letra}` derivada da prop `grupo`.
2. Em `SuperGrupo.css`, criar os 12 modificadores (`.super-grupo--grupo-a` a
   `.super-grupo--grupo-l`) aplicando ao `.super-grupo__titulo`:
   `border-left: 3px solid var(--group-{letra})` e
   `background: color-mix(in srgb, var(--group-{letra}) 15%, transparent)`.
3. Testes em `SuperGrupo.test.jsx`: cada super-grupo renderizado recebe a
   classe da sua letra.
4. Descrever o estilo em `docs/interface.md` § Corpo (cabeçalho de
   super-grupo), citando o IDR 0045.

**Fora do escopo**: FWC e COC (não têm super-grupo — ver
`docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`); cabeçalho de seção
(Fase 16); faixa de bandeiras (Tarefa 0003).

## Decisões já tomadas (não reabrir)
- Borda esquerda 3px + fundo com 15% de opacidade no título — ver
  `docs/idr/0045-cores-de-super-grupos.md`
- FWC e COC fora dos super-grupos — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`
- Super-grupos colapsáveis com progresso agregado — ver
  `docs/idr/0019-ordem-do-album-agrupada-e-colapsavel.md`

## Arquivos impactados
- `src/components/SuperGrupo.jsx` — modificar
- `src/components/SuperGrupo.css` — modificar
- `src/components/SuperGrupo.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Corpo)

## Critérios de aceite
- [ ] Cada título de super-grupo exibe borda esquerda de 3px e fundo com 15%
      da cor do seu grupo
- [ ] O texto do título continua em `--gold`
- [ ] Teste confirma a classe `super-grupo--grupo-{letra}` para cada grupo
- [ ] `docs/interface.md` § Corpo descreve o estilo citando o IDR 0045

## Validação adicional
Verificação visual em `npm run dev`, na ordenação por página: os 12
super-grupos com suas cores, colapsados e expandidos, sem perda de legibilidade
do título.
