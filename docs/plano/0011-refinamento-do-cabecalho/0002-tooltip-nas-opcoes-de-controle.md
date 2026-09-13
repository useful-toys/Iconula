<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0002]: tooltip nas opções de controle

## Status
Concluída

## Objetivo
Ao passar o mouse ou levar o foco de teclado a qualquer opção dos três grupos
de controle, exibir abaixo dela a explicação por extenso que já existe como
nome acessível — os rótulos curtos continuam, e quem tem dúvida descobre o
sentido sem texto novo na tela.

## Documentos de referência
- `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md` § Decisão —
  tooltip abaixo do botão, hover após ~400ms, foco imediato, sem toque,
  alinhamento nas pontas, CSS sem biblioteca
- `src/components/Controles.jsx` — `ORDENACOES`, `DISPOSICOES` e `FILTROS`
  com `nomeAcessivel` por opção
- `src/components/Controles.css` — estilos dos grupos
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — padrão de
  `:focus-visible`
- `docs/interface.md` § Controles — onde o tooltip passa a ser descrito

## Padrões e convenções aplicáveis
- Um texto, duas saídas: o `nomeAcessivel` alimenta o `aria-label` e o
  tooltip — nunca duas fontes — `src/components/Controles.jsx`
- O tooltip não entra na árvore de acessibilidade: o leitor de tela lê só o
  `aria-label` — IDR 0048
- Nenhuma rolagem própria e nada cortado pela borda da viewport — IDR 0008,
  IDR 0048
- Sem biblioteca nem JS de posicionamento — IDR 0048

## Escopo e instruções de implementação
1. Em `Controles.jsx`, expor o `nomeAcessivel` de cada opção dos três grupos
   num atributo de dados do botão, lido pelo CSS do tooltip.
2. Em `Controles.css`, o tooltip: abaixo do botão, oculto por padrão,
   revelado no hover com atraso de ~400ms e no `:focus-visible` sem atraso;
   nenhum gatilho em toque (`hover: none`); nas opções das pontas de cada
   grupo, alinhado à borda do grupo em vez de centralizado.
3. Testes em `Controles.test.jsx`: todo botão dos três grupos tem o atributo
   do tooltip igual ao seu `aria-label`.
4. Em `docs/interface.md` § Controles, acrescentar: cada opção mostra, abaixo
   dela, o nome por extenso no hover (~400ms) e no foco por teclado; em
   toque, não — citando o IDR 0048.

**Fora do escopo**: tooltip no desfazer, no avatar/menu ou na faixa de
bandeiras; contorno dos grupos (Tarefa 0011-0001).

## Decisões já tomadas (não reabrir)
- Técnica, posição, atrasos e comportamento em toque — ver
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`
- Rótulos curtos com forma por extenso só no nome acessível — ver
  `docs/idr/0018-usuario-especialista-e-minimalismo.md`

## Arquivos impactados
- `src/components/Controles.jsx` — modificar
- `src/components/Controles.css` — modificar
- `src/components/Controles.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Controles)

## Critérios de aceite
- [ ] Toda opção dos três grupos tem o atributo do tooltip igual ao
      `aria-label` (teste)
- [ ] Tooltip abaixo do botão, no hover após ~400ms e no `:focus-visible` sem
      atraso (conferido no CSS e na verificação visual)
- [ ] Nenhum tooltip em `hover: none` (conferido no CSS)
- [ ] Em largura de celular, os tooltips das pontas não são cortados pela
      viewport (verificação visual)
- [ ] `docs/interface.md` § Controles descreve o tooltip citando o IDR 0048

## Validação adicional
Verificação visual em `npm run dev`: passar o mouse por cada opção; tabular
por cada opção; em largura de celular (emulação de toque), conferir que o
toque alterna sem tooltip e que as pontas não cortam com mouse.
