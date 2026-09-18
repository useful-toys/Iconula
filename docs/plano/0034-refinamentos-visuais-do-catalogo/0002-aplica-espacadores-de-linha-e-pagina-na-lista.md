<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0034-0002]: Aplica espaçadores de linha e página na lista

## Status
Pendente

## Objetivo
Na disposição lista, os cartões de uma seção de seleção ou da Coca-Cola
ganham respiro extra nas fronteiras que já existem no layout do álbum:
+2px nas quebras de linha dentro da mesma página e +4px nas quebras de
página. O FWC continua com o respiro uniforme de hoje.

## Documentos de referência
- `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md` — decisão
  completa, com a exclusão do FWC e o porquê
- `src/data/catalogoLayout.js` `layoutDeSecao(secao)` — fonte única das
  posições/linha/página de cada figurinha (retorna `null` haveria; aqui
  sempre um layout, TDR 0012)
- `src/components/Secao.jsx` — `secao__grade` (disposição lista) e
  `layoutDeSecao`/`usaAlbum` já importados
- `src/components/Secao.css` — `.secao__grade { gap: var(--card-gap-list) }`
  (8px, IDR 0050)
- `src/theme.css` — `--card-gap-list: 8px`

## Padrões e convenções aplicáveis
- Nenhuma requisição por figurinha nem re-render fora do necessário: a
  seção é memoizada (`propsEquivalentes` em `Secao.jsx`, TDR 0021) — o
  cálculo do respiro por cartão não pode invalidar essa memoização.

## Escopo e instruções de implementação
1. Só quando `secao.tipo === "selecao"` ou `secao.sigla === "COC"` (nunca
   FWC): a partir de `layoutDeSecao(secao).posicoes`, ordenadas por
   `posicao` (mesma ordem da lista), calcular para cada figurinha (exceto
   a última) se o próximo cartão está numa linha diferente da mesma
   página (pequeno) ou numa página diferente (médio), comparando
   `pagina`/`linha` do item atual com o próximo.
   - Pseudocódigo: `if (prox.pagina !== atual.pagina) → médio; else if
     (prox.linha !== atual.linha) → pequeno; else → padrão`.
2. Aplicar o respiro como `margin-inline-end` (ou equivalente) no cartão
   que antecede a fronteira, complementando o `gap` de 8px do
   `.secao__grade` — não substituir o `gap` por margens em todos os
   cartões.
3. O filtro de status (`listaFiltrada` em `Secao.jsx`) pode ocultar
   cartões: calcular as fronteiras sobre a sequência já filtrada (os
   cartões efetivamente visíveis), não sobre `layoutDeSecao` bruto — evita
   respiro colado a uma borda quando o vizinho da fronteira some.
4. `docs/interface.md` § Corpo (disposição lista) e § Medidas: descreve os
   dois respiros extras, condicionados a `secao.tipo`/`COC` e à exclusão
   do FWC, citando o IDR 0069.

**Fora do escopo**: aplicar ao FWC (IDR 0069 já registra o motivo:
páginas fora de ordem crescente nas posições 5-8); mudar o `gap` padrão de
8px; mudar a disposição álbum.

## Decisões já tomadas (não reabrir)
- Os dois respiros (+2px linha, +4px página), a exclusão do FWC e a fonte
  (`layoutDeSecao`) — ver
  `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md`
- `--card-gap-list: 8px` como padrão inalterado — ver
  `docs/idr/0050-compactacao-vertical-do-catalogo.md`

## Arquivos impactados
- `src/components/Secao.jsx` — modificar (`secao__grade`)
- `src/components/Secao.css` — modificar (classes/modificadores de
  respiro)
- `src/components/Secao.test.jsx` — modificar: acrescentar testes para
  uma seleção (fronteiras 2-3, 6-7, 10-11 e 13-14, 17-18) e para a
  Coca-Cola (3-4, 6-7 [página], 9-10, 12-13), e um teste confirmando que o
  FWC não ganha nenhum respiro extra na lista
- `docs/interface.md` — modificar (§ Corpo, § Medidas)

## Critérios de aceite
- [ ] Seção de seleção tem respiro pequeno em 2-3, 6-7, 13-14, 17-18 e
      médio em 10-11 na lista — coberto por teste
- [ ] Coca-Cola tem respiro pequeno em 3-4, 9-10, 12-13 e médio em 6-7 —
      coberto por teste
- [ ] FWC não ganha respiro extra na lista — coberto por teste
- [ ] Com filtro ativo ocultando um cartão de fronteira, nenhum respiro
      extra sobra colado à borda — coberto por teste
- [ ] `docs/interface.md` § Corpo e § Medidas descrevem a regra e citam o
      IDR 0069

## Validação adicional
- Roteiro visual em `npm run dev`: abrir uma seleção e a Coca-Cola na
  disposição lista e conferir visualmente os respiros nas fronteiras
  acima; alternar para o FWC e conferir que o espaçamento continua
  uniforme.
