<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0011-0003]: bandeiras mais compactas

## Status
Pendente

## Objetivo
Apertar a faixa de bandeiras para caber mais seções sem rolar: 2px entre
bandeiras; na ordenação por página, 4px entre grupos, para a faixa ganhar a
estrutura A–L; área de toque ampliada ajustada sem sobreposição.

## Documentos de referência
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão (tabela, linha
  "Ícone da faixa de bandeiras") e § Histórico — gap 2px, 4px entre grupos
  por página, expansão −1px, alvo 32×32px
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css` —
  `gap: 4px` atual e o `::before` da área de toque em `pointer: coarse`
- `src/components/Cabecalho.jsx` — pai da faixa; `src/App.jsx` detém a
  ordenação vigente
- `src/data/catalogo.js` — campo `grupo` de cada seleção; FWC e COC sem
  grupo
- `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md` — FWC no início,
  COC no fim
- `docs/interface.md` § Medidas — linha "Faixa de bandeiras: … espaçamento
  4px…"

## Padrões e convenções aplicáveis
- Ícone continua 30×30px; só o espaçamento muda — `docs/interface.md`
  § Medidas
- A expansão da área de toque é a metade do menor espaçamento — IDR 0042
- Sem rolagem nova; a rolagem horizontal da faixa não muda — IDR 0008,
  IDR 0016
- A ordenação chega à faixa só por props (`App` → `Cabecalho` →
  `FaixaDeSecoes`) — `AGENTS.md` § Convenções (sem estado global)

## Escopo e instruções de implementação
1. Passar a ordenação vigente de `App.jsx` para `Cabecalho` e dele para
   `FaixaDeSecoes`.
2. Em `FaixaDeSecoes`, espaçamento de 2px entre bandeiras; na ordenação por
   página, a primeira bandeira de cada grupo (e a COC, depois do Grupo L)
   ganha 4px de separação da anterior — a bandeira do Grupo A também se
   separa do FWC por 4px. Na ordenação por sigla, 2px uniforme.
3. Área de toque ampliada (`pointer: coarse`): expansão de 1px em volta do
   ícone.
4. Testes em `FaixaDeSecoes.test.jsx` e `Cabecalho.test.jsx`: na ordenação
   por página, exatamente as bandeiras de início de grupo (e a COC) recebem a
   marca de separação; na ordenação por sigla, nenhuma; a ordenação atravessa
   o `Cabecalho`.
5. Em `docs/interface.md` § Medidas, a linha da faixa passa a dizer:
   espaçamento de 2px, 4px entre grupos na ordenação por página; área de
   toque ampliada de 1px — citando o IDR 0042.

**Fora do escopo**: tamanho do ícone; ordem ou conteúdo da faixa; cores de
grupo na faixa (Fase 15).

## Decisões já tomadas (não reabrir)
- Espaçamentos, expansão e alvo final — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`
- Faixa com as 50 seções, rolagem horizontal — ver
  `docs/idr/0016-salto-pela-faixa-de-bandeiras.md`
- 🏆 no início e 🥤 no fim — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Arquivos impactados
- `src/App.jsx` — modificar (passar a ordenação)
- `src/components/Cabecalho.jsx`, `src/components/Cabecalho.test.jsx` —
  modificar
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css`,
  `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Medidas)

## Critérios de aceite
- [ ] 2px entre bandeiras; 4px antes de cada início de grupo e da COC na
      ordenação por página (teste e CSS)
- [ ] 2px uniforme na ordenação por sigla (teste)
- [ ] Expansão da área de toque de 1px (conferido no CSS)
- [ ] `docs/interface.md` § Medidas com os novos valores, citando o IDR 0042

## Validação adicional
Verificação visual em `npm run dev`, em largura de celular: nas duas
ordenações, mais seções cabem sem rolar; por página, os grupos se leem como
blocos; o toque numa bandeira não aciona a vizinha.
