<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0003]: cor na faixa de bandeiras

## Status
Pendente

## Objetivo
Fundo com 20% de opacidade da cor do grupo em cada bandeira da faixa de salto,
somente na ordenação por página — FWC e COC incluídos, com as suas cores; na
ordenação por sigla, todas as bandeiras ficam com o fundo neutro de hoje.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — "faixa de bandeiras:
  fundo com 20% de opacidade, apenas na ordenação por página; na ordenação
  por sigla, fundo neutro, inclusive FWC e COC"
- `src/components/FaixaDeSecoes.jsx` — recebe `secoes` e `onSaltar`; é
  renderizada por `Cabecalho.jsx`, não por `App.jsx`
- `src/components/Cabecalho.jsx` — pai direto da faixa; `App.jsx` é quem detém
  o estado `ordenacao` (`'pagina' | 'sigla'`)
- `src/components/FaixaDeSecoes.css` — estilos atuais dos botões da faixa
  (`--panel`, hover em `--border`) e a área de toque ampliada do IDR 0042
- `docs/idr/0016-salto-pela-faixa-de-bandeiras.md` — a faixa lista as 50
  seções sempre, com rolagem horizontal
- `docs/interface.md` § Cabeçalho — faixa de bandeiras

## Padrões e convenções aplicáveis
- A cor depende da ordenação vigente: a prop `ordenacao` atravessa
  `App.jsx → Cabecalho.jsx → FaixaDeSecoes.jsx` — nenhum outro canal
- Área de toque ampliada do IDR 0042 inalterada: o `::before` de
  `@media (pointer: coarse)` continua como está
- Na ordenação por sigla nenhuma classe de cor é aplicada, inclusive FWC e
  COC — IDR 0045
- Hover e foco mantêm o comportamento atual (`--border`, `:focus-visible`)

## Escopo e instruções de implementação
1. Em `App.jsx`, passar `ordenacao` para `Cabecalho`.
2. Em `Cabecalho.jsx`, repassar `ordenacao` para `FaixaDeSecoes`.
3. Em `FaixaDeSecoes.jsx`, aceitar `ordenacao` e, só quando `'pagina'`,
   aplicar a classe de cor de cada seção: `faixa-de-secoes__botao--grupo-{letra}`
   para seleções e `faixa-de-secoes__botao--fwc`/`--coc` para os especiais.
4. Em `FaixaDeSecoes.css`, criar os modificadores com
   `background: color-mix(in srgb, var(--group-{letra}) 20%, var(--panel))`
   — e o equivalente com `--group-fwc`/`--group-coc`.
5. Testes em `FaixaDeSecoes.test.jsx` e `Cabecalho.test.jsx`: na ordenação
   `pagina` as classes de cor aparecem (inclusive FWC e COC); na `sigla`,
   nenhuma aparece; a prop atravessa o `Cabecalho`.
6. Descrever em `docs/interface.md` § Cabeçalho (faixa de bandeiras), citando
   o IDR 0045.

**Fora do escopo**: mudar ícone, espaçamento ou área de toque da faixa
(Tarefa 0011-0003); cores por seleção na faixa (mantém cor de grupo —
`docs/idr/0046-cores-de-selecoes.md`).

## Decisões já tomadas (não reabrir)
- Faixa com as 50 seções sempre, rolagem horizontal — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- Cores só na ordenação por página, FWC e COC incluídos com as suas cores —
  ver `docs/idr/0045-cores-de-super-grupos.md`

## Arquivos impactados
- `src/App.jsx` — modificar (passar `ordenacao` ao `Cabecalho`)
- `src/components/Cabecalho.jsx` — modificar (repassar a prop)
- `src/components/Cabecalho.test.jsx` — modificar
- `src/components/FaixaDeSecoes.jsx` — modificar
- `src/components/FaixaDeSecoes.css` — modificar
- `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho)

## Critérios de aceite
- [ ] Na ordenação `pagina`, cada bandeira exibe fundo com 20% da cor do seu
      grupo; FWC e COC com as suas (teste)
- [ ] Na ordenação `sigla`, nenhuma bandeira recebe classe de cor — fundo
      neutro `--panel` (teste)
- [ ] A prop `ordenacao` atravessa `App → Cabecalho → FaixaDeSecoes` (teste)
- [ ] Área de toque e foco visível inalterados (o diff só acrescenta classes
      e regras de fundo)

## Validação adicional
Verificação visual em `npm run dev`: alternar as duas ordenações e conferir a
faixa ganhando e perdendo as cores de grupo; tocar numa bandeira e conferir
que o salto para a seção continua funcionando.
