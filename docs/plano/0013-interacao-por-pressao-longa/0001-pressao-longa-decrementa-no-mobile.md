<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0013-0001]: pressão longa decrementa no mobile

## Status
Concluída

## Objetivo
Segurar o cartão por 500ms, em tela sensível, tira uma unidade — atalho para
não mirar no controle de menos do canto. Mouse, caneta e teclado continuam
como estão.

## Documentos de referência
- `docs/idr/0051-pressao-longa-decrementa-no-toque.md` § Decisão — limiar,
  cancelamento, retorno, contagem 0, menu do navegador
- `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
  § Decisão — o controle de menos, que continua existindo
- `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md` § Decisão — uma
  entrada por alteração
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — encolhimento
  do toque rápido
- `src/components/Figurinha.jsx` — `figurinha__corpo` é um botão cujo clique
  soma; `propsEquivalentes` do `memo`
- `src/components/Figurinha.css` — `user-select: none`, `:active` com
  `scale(0.92)`
- `src/lib/historico.js` — `registrarAjuste` empilha uma entrada por ajuste
- `docs/interface.md` § Figurinha — onde o gesto passa a ser descrito

## Padrões e convenções aplicáveis
- Só `pointerType` de toque aciona o gesto — IDR 0051
- Um reconhecimento gera exatamente um decremento e suprime o clique
  seguinte — IDR 0051, IDR 0012
- Mover além de 10px cancela: rolagem nunca decrementa — IDR 0051, IDR 0008
- Nada de estado novo nas props do cartão que quebre a memoização —
  `docs/tdr/0021-desempenho-do-catalogo.md`

## Escopo e instruções de implementação
1. Em `Figurinha.jsx`, com Pointer Events no corpo do cartão, só para toque:
   ao encostar, iniciar a espera de 500ms e o retorno visual; mover mais de
   10px ou cancelar o ponteiro interrompe sem efeito; soltar antes do limiar
   segue o clique normal (soma); ao completar o limiar, decrementar uma vez e
   marcar que o próximo clique não soma.
2. Contagem 0: a espera não começa e nada acontece.
3. Em `Figurinha.css`, o escurecimento progressivo do cartão durante a espera
   e a supressão do callout do iOS no corpo do cartão.
4. Suprimir o menu de contexto do navegador no cartão quando o ponteiro ativo
   é de toque (Android).
5. Testes em `Figurinha.test.jsx` com Pointer Events simulados e tempo
   controlado: 500ms decrementa uma vez e não soma ao soltar; soltar antes
   soma; mover 11px cancela; mouse não aciona; teclado soma; contagem 0 não
   decrementa; menu de contexto suprimido em toque e não em mouse.
6. Em `docs/interface.md` § Figurinha, acrescentar: em tela sensível, segurar
   o cartão por 500ms tira uma unidade; o cartão escurece durante a espera;
   mover o dedo cancela — citando o IDR 0051.

**Fora do escopo**: qualquer atalho de desktop; vibração; dica de descoberta;
mudar o controle de menos.

## Decisões já tomadas (não reabrir)
- Limiar, cancelamento, retorno, contagem 0 e menu do navegador — ver
  `docs/idr/0051-pressao-longa-decrementa-no-toque.md`
- Tocar soma, menos remove — ver
  `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md`
- Controle de menos a partir da contagem 1, dentro do cartão — ver
  `docs/idr/0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md`
- Uma entrada no histórico por alteração — ver
  `docs/idr/0012-desfazer-no-cabecalho-historico-de-10.md`

## Arquivos impactados
- `src/components/Figurinha.jsx` — modificar
- `src/components/Figurinha.css` — modificar
- `src/components/Figurinha.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Figurinha)

## Critérios de aceite
- [ ] Toque de 500ms decrementa uma unidade, sem somar ao soltar (teste)
- [ ] Soltar antes de 500ms soma (teste)
- [ ] Mover mais de 10px cancela sem efeito (teste)
- [ ] Mouse e teclado não acionam o gesto (teste)
- [ ] Contagem 0 não decrementa nem mostra espera (teste)
- [ ] Nenhuma pressão longa gera mais de uma chamada de ajuste (teste)
- [ ] Menu de contexto suprimido só em toque (teste) e callout do iOS
      suprimido (conferido no CSS)
- [ ] `docs/interface.md` § Figurinha descreve o gesto citando o IDR 0051

## Validação adicional
Verificação em `npm run dev` com emulação de toque ou aparelho real: segurar e
conferir escurecimento e decremento único; soltar antes e conferir soma; rolar
começando sobre um cartão e conferir que nada muda; conferir que o menu do
navegador não abre.
