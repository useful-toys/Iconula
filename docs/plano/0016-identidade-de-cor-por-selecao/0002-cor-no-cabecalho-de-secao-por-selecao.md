<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0016-0002]: cor no cabeçalho de seção por seleção

## Status
Pendente

## Objetivo
Aplicar a cor individual da seleção no cabeçalho de cada seção — borda
completa de 1px e fundo com 15% de opacidade — usando os tokens da Tarefa
0001; FWC e COC com as suas cores. É o único lugar onde o cabeçalho de seção
ganha cor: a cor de grupo mora no título do super-grupo e na faixa de
bandeiras (IDR 0045).

## Documentos de referência
- `docs/idr/0046-cores-de-selecoes.md` § Decisão — "cabeçalho de seção: borda
  completa 1px + fundo com 15% de opacidade" e a hierarquia com o IDR 0045
- `src/components/Secao.jsx` — o cabeçalho de seção é o
  `button.secao__cabecalho`; recebe a seção com `sigla`
- `src/components/Secao.css` — `.secao__cabecalho` com `border: 1px solid
  var(--border)` e fundo `--panel` atuais; texto em `--cream`, números em
  `--muted`
- `src/data/catalogo.js` — campo `sigla` de cada seção (48 seleções + FWC +
  COC)
- `docs/adr/0008-css-modular-por-componente.md` — convenção de nomenclatura
- `docs/interface.md` § Corpo — cabeçalho de seção

## Padrões e convenções aplicáveis
- A borda colorida substitui a borda atual do cabeçalho em todas as bordas
  (`border: 1px solid var(--selection-{sigla})`), sem mudar raio nem padding
- Texto em `--cream` e números em `--muted` continuam como estão — contraste
  textual garantido pelos tokens existentes
- Cor nunca é o único sinal: a identificação segue por ícone, nome e sigla —
  `docs/requisitos.md` § Requisitos Não Funcionais
- CSS modular por componente (prefixo `secao--`) — ADR 0008

## Escopo e instruções de implementação
1. Em `Secao.jsx`, acrescentar a classe dinâmica: `secao--selecao-{sigla}`
   em minúsculas para seleções, `secao--fwc` e `secao--coc` para os especiais.
2. Em `Secao.css`, criar os modificadores: 48 `.secao--selecao-{sigla}` com
   `border: 1px solid var(--selection-{sigla})` e
   `background: color-mix(in srgb, var(--selection-{sigla}) 15%, var(--panel))`;
   `.secao--fwc` e `.secao--coc` com o equivalente usando
   `--selection-fwc`/`--selection-coc`.
3. Testes em `Secao.test.jsx`: cada seleção recebe a classe da sua sigla; FWC
   recebe `secao--fwc` e COC `secao--coc`.
4. Descrever em `docs/interface.md` § Corpo (cabeçalho de seção), citando o
   IDR 0046.

**Fora do escopo**: faixa de bandeiras (mantém cor de grupo — Tarefa
0015-0003); título do super-grupo (Tarefa 0015-0002); tamanho do ícone, do
chevron ou da tipografia do cabeçalho.

## Decisões já tomadas (não reabrir)
- Borda completa 1px + fundo 15% no cabeçalho, hierarquia com o IDR 0045 —
  ver `docs/idr/0046-cores-de-selecoes.md`
- Seções colapsáveis em qualquer visualização — ver
  `docs/idr/0020-secoes-colapsaveis-em-qualquer-visualizacao.md`
- FWC e COC como especiais — ver
  `docs/idr/0028-fwc-abre-e-coca-cola-fecha-o-catalogo.md`

## Arquivos impactados
- `src/components/Secao.jsx` — modificar
- `src/components/Secao.css` — modificar
- `src/components/Secao.test.jsx` — modificar
- `docs/interface.md` — modificar (§ Corpo)

## Critérios de aceite
- [ ] Cada cabeçalho de seção exibe borda completa de 1px e fundo com 15% da
      cor da sua seleção; FWC e COC com as suas cores (teste)
- [ ] Texto em `--cream` e números em `--muted` inalterados
- [ ] Teste confirma a classe de cada sigla, inclusive `secao--fwc` e
      `secao--coc`
- [ ] `docs/interface.md` § Corpo descreve o estilo citando o IDR 0046

## Validação adicional
Verificação visual em `npm run dev`, nas duas ordenações e disposições:
cabeçalhos das 48 seleções com as suas cores, legíveis e distinguíveis dos
vizinhos, e os especiais com dourado e vermelho.
