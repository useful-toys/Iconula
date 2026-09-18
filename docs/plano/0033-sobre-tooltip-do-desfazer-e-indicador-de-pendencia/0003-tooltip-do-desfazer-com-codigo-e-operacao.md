<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0033-0003]: Tooltip do desfazer com código e operação

## Status
Pendente

## Objetivo
O botão de desfazer passa a mostrar, num tooltip visual e no `aria-label`
sincronizado, qual operação será revertida (`Desfazer: +1 em BRA05` ou
`Desfazer: −1 em BRA05`), no lugar do texto fixo genérico atual.

## Documentos de referência
- `docs/idr/0064-tooltip-do-desfazer-com-codigo-e-operacao.md` — conteúdo,
  formato e paridade de acessibilidade
- `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md` — o padrão
  CSS de tooltip a reaproveitar (hover ~400ms, foco por teclado, sem toque)
- `src/lib/historico.js` § `registrarAjuste`/`retirarUltimoAjuste` — formato
  da entrada (`{codigo, contagemAnterior}`, sem direção)
- `src/components/Controles.jsx` linha do botão `controles__desfazer`
  (`aria-label="desfazer a última alteração"` fixo, sem tooltip)

## Padrões e convenções aplicáveis
- Nenhuma regra geral é violada.

## Escopo e instruções de implementação
1. Em `App.jsx`: computar o texto do desfazer a partir do topo de
   `historico` e da coleção atual — quando há histórico, o topo tem
   `{codigo, contagemAnterior}`; a direção é `sinal = obterContagem(contagens, codigo) > contagemAnterior ? '+1' : '−1'`;
   texto = `` `Desfazer: ${sinal} em ${codigo}` ``. Sem histórico, texto
   `null` (equivalente a "sem tooltip", botão desabilitado).
2. Passar esse texto como nova prop de `Controles.jsx` (ex.:
   `textoDesfazer`), substituindo o `aria-label` fixo por esse valor (com
   uma alternativa neutra só para o caso de prop ausente/compatibilidade de
   teste, se necessário) e usando-o também como conteúdo do tooltip visual.
3. Em `Controles.css`: tooltip do botão `controles__desfazer` no mesmo
   padrão CSS de `IDR 0048` (classe/seletor equivalente ao dos grupos
   segmentados) — hover ~400ms, foco por teclado, nunca em toque, abaixo do
   botão.
4. `docs/interface.md` § Cabeçalho (comando desfazer): acrescenta o tooltip
   e o `aria-label` dinâmico, citando o IDR 0064.

**Fora do escopo**: mudar o histórico para 10+ entradas ou expor uma lista;
nome da seção no texto (recusado no IDR 0064).

## Decisões já tomadas (não reabrir)
- Formato do texto (`Desfazer: +1 em BRA05`) e `aria-label` sincronizado —
  ver `docs/idr/0064-tooltip-do-desfazer-com-codigo-e-operacao.md`
- Padrão visual do tooltip (hover ~400ms, foco, sem toque) — ver
  `docs/idr/0048-contorno-e-tooltip-nos-grupos-de-controles.md`

## Arquivos impactados
- `src/App.jsx` — modificar (texto do desfazer)
- `src/components/Controles.jsx` — modificar (prop, `aria-label`, tooltip)
- `src/components/Controles.css` — modificar (CSS do tooltip)
- `src/components/Controles.test.jsx` — modificar
- `src/App.test.jsx` ou `src/App.desfazer.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Cabeçalho)

## Critérios de aceite
- [ ] Com histórico, o botão de desfazer tem `aria-label`/tooltip
      `Desfazer: +1 em <código>` ou `Desfazer: −1 em <código>`, coerente com
      o sinal do ajuste — coberto por teste
- [ ] Sem histórico (botão desabilitado), nenhum tooltip aparece — coberto
      por teste
- [ ] O tooltip visual segue o padrão hover ~400ms / foco por teclado / sem
      toque do IDR 0048 — verificação visual
- [ ] `docs/interface.md` § Cabeçalho cita o tooltip do desfazer e o
      IDR 0064

## Validação adicional
- Roteiro visual em `npm run dev`: ajustar uma figurinha, passar o mouse
  sobre o desfazer (tooltip some/aparece após ~400ms) e tabular até ele
  (aparece na hora); decrementar e conferir o sinal `−1`.
