<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0013-0001]: pressão longa decrementa no mobile

## Status
Pendente

## Objetivo
Pressionar e segurar o cartão, em qualquer ponto, decrementa a contagem em uma
unidade no toque — atalho para quem já usa o botão de menos, sem precisar
mirar no alvo pequeno do canto. No desktop nada muda.

## Documentos de referência
- `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` § Decisão —
  "tocar soma, ícone de menos remove"
- `docs/idr/0030-controle-de-menos-do-cartao.md` e
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
  § Decisão — o controle de menos, sempre visível em tela sem hover
- `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md` § Decisão — uma
  entrada no histórico por alteração
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — retorno de toque
  (`figurinha__corpo:active { transform: scale(0.92) }`)
- `docs/plano/README.md` § Fase 13 — gestos de desktop avaliados e descartados
  (duplo clique, clique direito, botão do meio)
- `src/components/Figurinha.jsx` — `figurinha__corpo` é um `<button>` cujo
  `onClick` incrementa; `figurinha__menos` sobreposto
- `src/components/Figurinha.css` — `@media (hover: none)` e `user-select: none`
- `src/lib/historico.js` — `registrarAjuste` empilha uma entrada por chamada de
  `onAjustar`
- `docs/interface.md` § Figurinha — onde o gesto passa a ser descrito

## Padrões e convenções aplicáveis
- **Só em toque** (`pointerType === 'touch'`), nunca em mouse — `docs/plano/README.md`
  § Fase 13
- Uma pressão longa reconhecida gera **exatamente uma** chamada a
  `onDecrementar`; o clique sintético ao soltar é suprimido — IDR 0012
- Mover o dedo além de um limiar pequeno cancela o reconhecimento (é rolagem)
  — IDR 0008
- Retorno visual **durante** a espera, distinto do `scale(0.92)` de toque
  simples — IDR 0042
- Teclado (Enter/Espaço) continua incrementando direto, sem temporizador —
  IDR 0042
- Contagem em 0 não decrementa abaixo de 0 — IDR 0032

## Escopo e instruções de implementação
1. Registrar o gesto (ver "Decisões em aberto").
2. Implementar com Pointer Events (`onPointerDown`/`onPointerUp`/
   `onPointerMove`/`onPointerCancel`) em `Figurinha.jsx`, filtrando por
   `pointerType === 'touch'`: iniciar temporizador e retorno visual no toque;
   cancelar ao mover além do limiar ou soltar antes (toque normal incrementa);
   ao completar, chamar `onDecrementar()` uma vez e marcar a interação como
   consumida para o `onClick` seguinte não incrementar.
3. Retorno visual contínuo do início do toque até o limiar.
4. Acrescentar `-webkit-touch-callout: none` a `.figurinha__corpo` em
   `Figurinha.css`, para o iOS não abrir menu de seleção/cópia.
5. Testes em `Figurinha.test.jsx` com Pointer Events simulados: pressão longa
   decrementa uma vez; soltar antes incrementa; mover cancela; mouse não
   aciona; teclado incrementa; contagem 0 não vai abaixo de 0.
6. Descrever o gesto em `docs/interface.md` § Figurinha, citando o registro.

**Fora do escopo**: qualquer atalho de clique no desktop; mudar o botão de
menos existente.

## Decisões já tomadas (não reabrir)
- Tocar soma, ícone de menos remove — ver
  `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` (mantido; a
  pressão longa é um segundo caminho para remover)
- Botão de menos visível em toque, a partir da contagem 1 — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
- Uma entrada no histórico por alteração — ver
  `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md`
- Sem atalho de clique no desktop — ver `docs/plano/README.md` § Fase 13

## Decisões em aberto nesta tarefa
- Limiar de tempo (recomendado ~500ms, padrão de menus de contexto nativos),
  limiar de movimento que cancela e forma do retorno visual — registro: nasce
  um IDR sobre a pressão longa no cartão, com os gestos de desktop descartados
  como alternativas, citado a partir do IDR 0006. Se, pelo guia
  `docs/idr/CLAUDE.md`, o gesto couber como evolução da interação já decidida,
  atualize o IDR 0006 em vez de criar.

## Arquivos impactados
- `src/components/Figurinha.jsx` — modificar
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Figurinha)
- `docs/idr/` — criar (pressão longa no cartão), ou
  `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md` — modificar

## Critérios de aceite
- [ ] Segurar o cartão além do limiar decrementa uma unidade, em qualquer
      ponto do cartão (teste)
- [ ] Soltar antes do limiar incrementa normalmente (teste)
- [ ] Nenhuma pressão longa gera mais de uma chamada a `onAjustar` (teste)
- [ ] Mover o dedo cancela o reconhecimento sem decrementar (teste)
- [ ] Mouse sem toque não aciona o gesto (teste)
- [ ] Teclado continua incrementando direto (teste)
- [ ] Retorno visual perceptível durante a espera
- [ ] iOS não abre menu de seleção/cópia no toque longo
      (`-webkit-touch-callout: none` presente)

## Validação adicional
Verificação visual em `npm run dev` com emulação de toque ou dispositivo real:
segurar além do limiar e conferir o decremento único e o retorno visual;
soltar antes e conferir o incremento; rolar a página a partir de um toque no
cartão e conferir que não decrementa.
