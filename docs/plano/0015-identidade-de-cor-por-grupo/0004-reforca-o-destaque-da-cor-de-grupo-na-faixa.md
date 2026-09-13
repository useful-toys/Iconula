<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0015-0004]: reforça o destaque da cor de grupo na faixa de bandeiras

## Status
Pendente

## Objetivo
Os 20% de mistura da cor do grupo sobre `--panel` na faixa de bandeiras se
mostraram sutis demais no primeiro uso real. Elevar a mistura para 55–60% faz
cada bandeira se ler como pertencente ao seu grupo, sem mudar a hierarquia de
cores nem a área de toque, o espaçamento, o hover ou o foco.

## Documentos de referência
- `docs/idr/0045-cores-de-super-grupos.md` § Decisão — faixa com mistura de
  55–60% sobre `--panel`, só na ordenação por página; § Histórico — o ajuste
  dos 20%
- `docs/idr/0046-cores-de-selecoes.md` § Hierarquia de cores — o valor da faixa
- `docs/plano/0015-identidade-de-cor-por-grupo/0003-cor-na-faixa-de-bandeiras.md`
  — tarefa entregue que introduziu a cor na faixa (precedente)
- `src/theme.css` — `--group-a` a `--group-l`, `--group-fwc`, `--group-coc`
- `src/components/FaixaDeSecoes.jsx`, `src/components/FaixaDeSecoes.css` —
  `--group-color` por bandeira e `background: color-mix(in oklch, …, 20%, …)`
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` § Decisão — área de toque,
  espaçamento e foco inalterados
- `docs/interface.md` § Medidas — linha "Faixa de bandeiras"

## Padrões e convenções aplicáveis
- Cor é reforço, nunca o único sinal — `docs/requisitos.md` § Requisitos Não
  Funcionais
- Área de toque ampliada, espaçamento de 2px/4px, hover em `--border` e foco
  em `--gold` não mudam — IDR 0042, `docs/interface.md` § Medidas
- Só a ordenação por página recebe cor; na ordenação por sigla, neutra —
  IDR 0045
- FWC e COC com as suas cores (alias de `--gold` e `--coc-red`) — IDR 0045

## Escopo e instruções de implementação
1. Em `src/components/FaixaDeSecoes.css`, elevar a mistura do `background`
   (`color-mix`) de 20% para 55–60% da cor do grupo sobre `--panel`.
2. Manter o preenchimento como único tratamento — sem borda ou anel —, para
   não repetir a hierarquia do cabeçalho de seção (IDR 0046).
3. Testes em `FaixaDeSecoes.test.jsx`: ajustar a asserção do valor da mistura;
   as classes por grupo e a neutralidade na ordenação por sigla permanecem.
4. Em `docs/interface.md` § Medidas, a linha "Faixa de bandeiras" passa a
   citar que, na ordenação por página, o fundo mistura 55–60% da cor do grupo
   a `--panel` — citando o IDR 0045.
5. Registrar o valor confirmado (entre 55% e 60%) no IDR 0045 § Decisão
   (linha da faixa) e no log.

**Fora do escopo**: título do super-grupo e cabeçalho de seção (IDRs 0045 e
0046); tamanho do ícone, espaçamento, área de toque e foco (IDR 0042); a
neutralidade na ordenação por sigla (permanece).

## Decisões já tomadas (não reabrir)
- Faixa colorida só na ordenação por página, FWC e COC incluídos, neutra por
  sigla — ver `docs/idr/0045-cores-de-super-grupos.md`
- Preenchimento como tratamento de grupo; a borda completa fica para a seleção
  — ver `docs/idr/0046-cores-de-selecoes.md`
- Área de toque, espaçamento e foco — ver
  `docs/idr/0042-foco-visivel-e-area-de-toque.md`

## Impedimentos específicos
- **Ponto de decisão**: valor exato dentro da faixa 55–60% — medir/verificar no
  navegador, em contraste com os 20% atuais; alternativas: [A — 55%, mais
  contido, ~2,75× a mistura atual], [B — 60%, mais evidente, ainda um
  tingimento que não vira bloco saturado]; registro que muda:
  `docs/idr/0045-cores-de-super-grupos.md` § Decisão (linha da faixa), com o
  valor confirmado no log.

## Arquivos impactados
- `src/components/FaixaDeSecoes.css` — modificar
- `src/components/FaixaDeSecoes.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Medidas)
- `docs/idr/0045-cores-de-super-grupos.md` — modificar (valor confirmado)

## Critérios de aceite
- [ ] `background` da faixa com `color-mix` de 55–60% da cor do grupo sobre
      `--panel` (conferido no CSS)
- [ ] Só na ordenação por página; na ordenação por sigla, nenhuma cor (teste)
- [ ] FWC e COC com as suas cores (teste)
- [ ] Área de toque, espaçamento, hover e foco inalterados (diff)
- [ ] `docs/interface.md` § Medidas descreve o novo valor citando o IDR 0045
- [ ] O IDR 0045 § Decisão registra o valor confirmado dentro de 55–60%

## Validação adicional
Verificação visual em `npm run dev`, ordenação por página: as 50 bandeiras
legíveis como blocos por grupo, FWC dourado e COC vermelho no fim; alternar
para a ordenação por sigla e conferir a faixa neutra; rolar e tocar numa
bandeira.
