<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0018-0001]: faixa de bandeiras com cor mais reconhecível

## Status
Concluída

## Objetivo
Na ordenação por página, o fundo de cada bandeira sobe de 20% para 60% da cor
do grupo misturada a `--panel`, ganha uma barra inferior de 2px com 80% da cor
e o hover passa a intensificar o fundo para 80% da cor (em vez do cinza
`--border`). Na ordenação por sigla nada muda: fundo neutro e hover cinza.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — faixa: 60% + barra de
  2px a 80%, hover intensificando a 80%, só na ordenação por página
- `src/components/FaixaDeSecoes.css` — o fundo e o hover atuais (Fase 15,
  Tarefa 0015-0003)
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — área de toque (`::before`)
  e foco visível da faixa
- `docs/interface.md` § Medidas — linha "Faixa de bandeiras"

## Padrões e convenções aplicáveis
- Área de toque ampliada, espaçamentos e foco visível não mudam — IDR 0042
- Na ordenação por sigla nenhuma bandeira recebe cor — IDR 0045
- A barra inferior não pode deslocar o layout nem sobrepor a bandeira vizinha

## Escopo e instruções de implementação
1. Em `FaixaDeSecoes.css`, o fundo das bandeiras com classe de cor
   (`--grupo-*`) passa a `color-mix(in oklch, var(--group-color) 60%,
   var(--panel))`.
2. A barra inferior entra como `::after` (o `::before` já é a área de toque do
   IDR 0042): altura 2px, no rodapé do botão, cantos acompanhando o
   `border-radius: 8px`, fundo `color-mix(in oklch, var(--group-color) 80%,
   var(--panel))`, visível apenas nas bandeiras com classe de cor (ordenação
   por página).
3. O hover das bandeiras com cor passa a `color-mix(in oklch,
   var(--group-color) 80%, var(--panel))`; na ordenação por sigla, o hover
   continua em `--border`.
4. Em `docs/interface.md` § Medidas, a linha "Faixa de bandeiras" passa a
   descrever: na ordenação por página, fundo com 60% da cor do grupo e barra
   inferior de 2px a 80%, com hover intensificando — citando o IDR 0045.

**Fora do escopo**: ícone, espaçamento e área de toque (IDR 0042); cor por
seleção na faixa (permanece a de grupo — IDR 0046); título do super-grupo
(Tarefa 0018-0002).

## Decisões já tomadas (não reabrir)
- Fundo a 60%, barra inferior de 2px a 80% e hover a 80% — ver
  `docs/idr/0045-cores-de-super-grupos.md`
- Cores só na ordenação por página, FWC e COC incluídos — ver
  `docs/idr/0045-cores-de-super-grupos.md`

## Arquivos impactados
- `src/components/FaixaDeSecoes.css` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Na ordenação por página, cada bandeira com fundo
      `color-mix(... 60% ...)` e `::after` de 2px com `color-mix(... 80% ...)`
- [ ] Na ordenação por sigla, nenhuma bandeira com classe de cor nem barra —
      o teste existente de presença de classe segue verde
- [ ] Hover com cor intensifica a 80%; hover sem cor continua `--border`
- [ ] `docs/interface.md` § Medidas descreve a faixa citando o IDR 0045

## Validação adicional
Verificação visual em `npm run dev`: alternar as ordenações e conferir a faixa
ganhando cor e barra e o hover intensificando; tocar numa bandeira e conferir
o salto.
