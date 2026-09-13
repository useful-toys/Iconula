<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0005]: nome no cartão

## Status
Pendente

## Objetivo
Exibir o nome da figurinha entre o código e a faixa inferior do cartão, em
duas linhas de Roboto Condensed 10px — prenomes em caixa normal, sobrenome em
caixa alta —, e incluí-lo no nome acessível, nas duas disposições.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — linhas,
  caixa, nomes sem corte, truncamento, nome acessível
- `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md` § Decisão — campos
  `nome` e `nomeLinhas`
- `src/data/catalogo.js` — figurinhas com `nome` e `nomeLinhas` (gerado pela
  Tarefa 0017-0002)
- `src/index.css` — `@font-face` da Roboto Condensed (gerado pela Tarefa
  0017-0003)
- `src/components/Figurinha.css` — cartão de 60×84px (gerado pela Tarefa
  0017-0004)
- `src/components/Figurinha.jsx` — `propsEquivalentes`; `aria-label` do corpo
  ("BRA 05, faltante") e do menos ("remover uma unidade de BRA 05")
- `src/components/Secao.jsx`, `src/components/PaginaDoAlbum.jsx` — os dois
  pontos que renderizam `Figurinha`
- `docs/tdr/0021-desempenho-do-catalogo.md` — props novas entram no
  comparador
- `docs/interface.md` § Figurinha, § Tipografia

## Padrões e convenções aplicáveis
- O nome visível fica fora da árvore de acessibilidade, como código e selo;
  o nome acessível é a única leitura — `src/components/Figurinha.jsx`
- `nome` e `nomeLinhas` entram no comparador do `memo` — TDR 0021
- Caixa alta só visual; o dado e o nome acessível ficam em caixa normal —
  IDR 0047
- O nome nunca empurra o layout nem invade a faixa do menos e do selo —
  IDR 0047

## Escopo e instruções de implementação
1. `Figurinha` aceita `nome` e `nomeLinhas` (ausentes = cartão como antes) e
   os compara em `propsEquivalentes`; `Secao` e `PaginaDoAlbum` repassam os
   campos da figurinha.
2. Com `nomeLinhas`: primeira linha com os prenomes (omitida quando vazia),
   segunda com o sobrenome; sem `nomeLinhas`: o `nome` numa caixa de até duas
   linhas.
3. Estilo: Roboto Condensed 500, 10px, centralizado, `--cream`
   (ou a cor de texto do estado), truncamento com ellipsis por linha; a linha
   do sobrenome em caixa alta.
4. O nome acessível do corpo e do menos inclui o `nome` entre o código e o
   estado ("BRA 05, Gabriel Magalhães, faltante"; "remover uma unidade de
   BRA 05, Gabriel Magalhães").
5. Testes em `Figurinha.test.jsx`: duas linhas com classes distintas para
   prenomes e sobrenome; nome único só com a linha do sobrenome; nome sem
   corte numa caixa só; sem nome, cartão e rótulos como antes; rótulos com o
   nome; `Secao` e `PaginaDoAlbum` repassam os campos.
6. Em `docs/interface.md` § Figurinha, o nome entre código e faixa inferior,
   com as regras de linha e caixa; § Tipografia, "Roboto Condensed 500 no nome
   das figurinhas" — citando o IDR 0047.

**Fora do escopo**: tamanho do cartão (Tarefa 0017-0004); fonte (Tarefa
0017-0003); texto de troca e export/import, que seguem só com o código.

## Decisões já tomadas (não reabrir)
- Exibição, tipografia, truncamento e nome acessível — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Campos do catálogo — ver
  `docs/model-dr/0008-dados-dos-nomes-das-figurinhas.md`
- Cartão memoizado com comparador próprio — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`

## Arquivos impactados
- `src/components/Figurinha.jsx`, `src/components/Figurinha.css`,
  `src/components/Figurinha.test.jsx` — modificar
- `src/components/Secao.jsx`, `src/components/PaginaDoAlbum.jsx` — modificar
- `docs/interface.md` — modificar (§ Figurinha, § Tipografia)

## Critérios de aceite
- [ ] Prenomes e sobrenome em linhas distintas; nome único só na segunda;
      nome sem corte numa caixa (teste)
- [ ] Nome acessível do corpo e do menos com o nome (teste)
- [ ] Sem nome, cartão e rótulos como antes (teste)
- [ ] `nome` e `nomeLinhas` no comparador; `Secao` e `PaginaDoAlbum` repassam
      (busca e teste)
- [ ] Sobrenome em caixa alta, Roboto Condensed 10px, ellipsis por linha
      (CSS e verificação visual)
- [ ] `docs/interface.md` § Figurinha e § Tipografia citando o IDR 0047

## Validação adicional
Verificação visual em `npm run dev`, nas duas disposições, com uma seção
aberta: Trent/Alexander-Arnold, Juan José/Cáceres e Rodri truncam ou cabem sem
empurrar o layout; FWC e COC com nomes sem corte; selo `×N` e menos na faixa
inferior sem cobrir o nome.
