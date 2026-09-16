<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0025-0001]: cores de grupo com a tabela oficial de sorteio

## Status
Concluída

## Objetivo
Trocar a origem das 12 cores de super-grupo (A–L) pela tabela oficial do
sorteio da Copa 2026, com uma variante original (sem ajuste, para bordas) e
uma ajustada (contraste mínimo, para fundos tingidos) por grupo.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § "Cores dos super-grupos" — RGB
  de origem, valores OKLCH original/ajustada e contraste já calculados;
  usar exatamente esses valores
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — onde a cor original e
  a ajustada entram (barra/borda × fundo tingido)
- `docs/interface.md` § Paleta — tabela de tokens a atualizar

## Padrões e convenções aplicáveis
- Cor só pelos tokens OKLCH de `docs/interface.md` § Paleta — nada de
  literal espalhado por componente (regra geral do plano, aplicável aqui
  porque a tarefa está justamente trocando o valor desses tokens)

## Escopo e instruções de implementação
1. Em `src/theme.css`, atualizar os 12 tokens `--group-a` a `--group-l`
   para os valores de "Cor ajustada" da tabela do IDR 0045 (mesmo papel de
   hoje: fundo tingido do título do super-grupo e da faixa de bandeiras).
2. Criar tokens novos só para os 4 grupos cuja cor original difere da
   ajustada (D, F, I, L) — nome sugerido `--group-d-raw`, `--group-f-raw`,
   `--group-i-raw`, `--group-l-raw`, com os valores de "Cor original" da
   mesma tabela. Nos outros 8 grupos, o token existente já serve às duas
   finalidades — não criar token redundante.
3. Em `src/components/SuperGrupo.css`: a barra esquerda de 3px do título do
   super-grupo passa a usar o token de cor original (o `-raw` nos 4 grupos
   que o têm, o token normal nos demais); o fundo tingido (`color-mix` 30%)
   continua usando o token ajustado (sem mudança de comportamento nesse
   ponto, só a fonte do valor).
4. Em `src/components/FaixaDeSecoes.css`: a barra inferior de 2px (destaque)
   passa a usar a cor original, pelo mesmo critério; o fundo tingido (60%)
   e o hover (80%) continuam com a cor ajustada.
5. Atualizar `docs/interface.md` § Paleta com os 12 valores ajustados e os
   4 valores `-raw` novos, citando o IDR 0045.

**Fora do escopo**: cores de seleção (Tarefa 0026-0001); fundo geral do
tema (Tarefa 0025-0002); qualquer mudança em `--coc-red`, `--group-fwc` ou
`--group-coc`, que não mudam nesta tarefa.

## Decisões já tomadas (não reabrir)
- RGB de origem, valores OKLCH (original e ajustada) e contraste de cada
  grupo — ver `docs/idr/0045-cores-de-super-grupos.md` § "Cores dos
  super-grupos"
- Cor original na barra/borda, cor ajustada no fundo tingido — ver
  `docs/idr/0045-cores-de-super-grupos.md` § Decisão

## Arquivos impactados
- `src/theme.css` — modificar
- `src/components/SuperGrupo.css` — modificar
- `src/components/FaixaDeSecoes.css` — modificar
- `docs/interface.md` — modificar (§ Paleta)
- `docs/idr/0045-cores-de-super-grupos.md` — já atualizado no planejamento; conferir que a implementação bate com a tabela

## Critérios de aceite
- [ ] Os 12 tokens `--group-a`...`--group-l` têm os valores de "Cor
      ajustada" do IDR 0045
- [ ] Existem tokens `-raw` para D, F, I e L com os valores de "Cor
      original", e nenhum token `-raw` redundante nos outros 8 grupos
- [ ] A barra/borda do título do super-grupo e a barra inferior da faixa de
      bandeiras usam a cor original; o fundo tingido de ambos usa a cor
      ajustada
- [ ] `docs/interface.md` § Paleta reflete os valores novos

## Validação
`npm run lint && npm run test && npm run build`.
Verificação visual em `npm run dev`: cada super-grupo com a barra na cor
mais viva (original) e o fundo tingido na cor ajustada; conferir D, F, I e
L especificamente, já que são os únicos com as duas variantes distintas.
