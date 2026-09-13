<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0017-0003]: nome no cartão

## Status
Pendente

## Objetivo
Exibir o nome da figurinha abaixo do código no cartão, incluí-lo no nome
acessível dos dois botões e fazer `propsEquivalentes` compará-lo — nas duas
disposições, sem mudar os três estados, o selo `×N` e o controle de menos.

## Documentos de referência
- `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md` § Decisão — nome abaixo
  do código, nas duas disposições, no aria-label, truncado
- `src/components/Figurinha.jsx` — `propsEquivalentes` compara `codigo`,
  `contagem`, `metalizada`, `variante`, `paisagem`; `aria-label` do corpo é
  `` `${sigla} ${numero}, ${estadoLabel}` ``; o do controle de menos é
  `` `remover uma unidade de ${sigla} ${numero}` ``
- `src/components/Secao.jsx` e `src/components/PaginaDoAlbum.jsx` — os dois
  pontos que renderizam `Figurinha` e passam as props
- `src/data/catalogo.js` — figurinhas com `nome` (gerado pela Tarefa
  0017-0002)
- `docs/tdr/0021-desempenho-do-catalogo.md` — memoização: sem `nome` em
  `propsEquivalentes`, um cartão nunca re-renderizaria ao receber nome novo
- `docs/interface.md` § Figurinha — onde o nome passa a ser descrito

## Padrões e convenções aplicáveis
- Nome acessível escreve por extenso: o nome entra no `aria-label` do corpo e
  do controle de menos — `docs/requisitos.md` § Requisitos Não Funcionais
- O nome visível é `aria-hidden`, como o código e o selo — o `aria-label` é a
  única fonte do leitor de tela — `src/components/Figurinha.jsx`
- `propsEquivalentes` passa a comparar `nome` — TDR 0021
- A aparência do nome (fonte, tamanho, truncamento) é da Tarefa 0004; aqui o
  span nasce com a classe `figurinha__nome` e sem estilo próprio

## Escopo e instruções de implementação
1. Em `Figurinha.jsx`, aceitar a prop `nome = null` e incluí-la em
   `propsEquivalentes`.
2. Renderizar, dentro do corpo e após o código:
   `{nome && <span className="figurinha__nome" aria-hidden="true">{nome}</span>}`.
3. `aria-label` do corpo passa a
   `` `${sigla} ${numero}${nome ? `, ${nome}` : ''}, ${estadoLabel}` ``; o do
   controle de menos a
   `` `remover uma unidade de ${sigla} ${numero}${nome ? `, ${nome}` : ''}` ``.
4. Em `Secao.jsx` e `PaginaDoAlbum.jsx`, passar `nome={figurinha.nome}` ao
   `Figurinha`.
5. Testes em `Figurinha.test.jsx`: nome exibido quando fornecido; ausente
   quando `null`; `aria-label` do corpo e do controle de menos incluem o nome
   ("BRA 05, Gabriel Magalhães, faltante"); sem `nome`, o `aria-label` é o de
   hoje.
6. Descrever o nome no cartão em `docs/interface.md` § Figurinha, citando o
   IDR 0047.

**Fora do escopo**: estilo do nome (Tarefa 0004); mudar estados, selo ou
controle de menos; texto de troca e export/import (continuam só com o código).

## Decisões já tomadas (não reabrir)
- Nome abaixo do código, nas duas disposições, no aria-label — ver
  `docs/idr/0047-nomes-de-jogadores-nas-figurinhas.md`
- Cartão memoizado com comparador próprio — ver
  `docs/tdr/0021-desempenho-do-catalogo.md`
- Estados com reforço não-cromático — ver
  `docs/idr/0006-estados-visuais-e-interacao-da-figurinha.md`

## Arquivos impactados
- `src/components/Figurinha.jsx` — modificar
- `src/components/Figurinha.test.jsx` — modificar
- `src/components/Secao.jsx` — modificar (passar a prop)
- `src/components/PaginaDoAlbum.jsx` — modificar (passar a prop)
- `docs/interface.md` — modificar (§ Figurinha)

## Critérios de aceite
- [ ] Nome exibido abaixo do código nas duas variantes quando presente
      (teste)
- [ ] `aria-label` do corpo e do controle de menos incluem o nome (teste)
- [ ] Sem `nome`, o cartão e os `aria-label` ficam como hoje (teste)
- [ ] `propsEquivalentes` compara `nome` (busca no código)
- [ ] `Secao` e `PaginaDoAlbum` passam a prop (busca no código)
- [ ] `docs/interface.md` § Figurinha descreve o nome citando o IDR 0047
