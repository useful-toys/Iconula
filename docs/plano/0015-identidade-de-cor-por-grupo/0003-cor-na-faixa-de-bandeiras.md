<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0003]: cor na faixa de bandeiras

## Status
Pendente

## Objetivo
Fundo de cada bandeira com 20% da cor do seu grupo misturada a `--panel`,
só na ordenação por página — FWC e COC com as suas cores; na ordenação por
sigla, todas neutras.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — faixa: 20% sobre
  `--panel`, só por página, neutra por sigla inclusive FWC e COC
- `src/theme.css` — `--group-*` (gerados pela Tarefa 0015-0001)
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css` —
  a faixa já recebe a ordenação vigente (Fase 11,
  `docs/plano/0011-refinamento-do-cabecalho/0003-bandeiras-mais-compactas.md`)
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — área de toque e foco da
  faixa
- `docs/interface.md` § Medidas — linha "Faixa de bandeiras"

## Padrões e convenções aplicáveis
- Área de toque ampliada, espaçamentos e foco visível não mudam — IDR 0042
- Hover continua em `--border` — `docs/interface.md` § Medidas
- Na ordenação por sigla nenhuma bandeira recebe cor — IDR 0045

## Escopo e instruções de implementação
1. Em `FaixaDeSecoes.jsx`, na ordenação por página, cada bandeira recebe uma
   classe com a letra do grupo da seção, ou de FWC/COC; na ordenação por
   sigla, nenhuma.
2. Em `FaixaDeSecoes.css`, cada classe pinta o fundo com 20% da cor do grupo
   (ou `--group-fwc`/`--group-coc`) misturada a `--panel`.
3. Testes em `FaixaDeSecoes.test.jsx`: por página, as 50 bandeiras com a
   classe certa (inclusive FWC e COC); por sigla, nenhuma.
4. Em `docs/interface.md` § Medidas, a linha da faixa acrescenta: na
   ordenação por página, fundo com 20% da cor do grupo — citando o IDR 0045.

**Fora do escopo**: ícone, espaçamento e área de toque (Tarefa 0011-0003);
cor por seleção na faixa (fica a de grupo — IDR 0046).

## Decisões já tomadas (não reabrir)
- Cores só na ordenação por página, FWC e COC incluídos — ver
  `docs/idr/0045-cores-de-super-grupos.md`
- Faixa com as 50 seções e rolagem horizontal — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`

## Arquivos impactados
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css`,
  `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] Por página, cada bandeira com fundo 20% da cor do grupo; FWC e COC com
      as suas (teste)
- [ ] Por sigla, nenhuma bandeira com classe de cor (teste)
- [ ] Área de toque, espaçamentos e foco inalterados (diff)
- [ ] `docs/interface.md` § Medidas descreve a cor da faixa citando o
      IDR 0045

## Validação adicional
Verificação visual em `npm run dev`: alternar as ordenações e conferir a faixa
ganhando e perdendo cor; tocar numa bandeira e conferir o salto.
