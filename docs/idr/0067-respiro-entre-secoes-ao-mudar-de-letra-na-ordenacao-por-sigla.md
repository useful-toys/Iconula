<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0067: Respiro extra entre seções ao mudar de letra na ordenação por sigla

## Status

Aceito.

## Contexto

- Na ordenação por sigla (`ordenarPorSigla`, sem super-grupos — IDR 0028),
  as 50 seções ficam soltas em sequência, com 8px uniformes entre elas
  (IDR 0050).
- O humano pediu um respiro adicional quando a seção muda de letra em
  relação à anterior, para ajudar quem organiza figurinhas físicas e
  navega a tela pela sigla a perceber os blocos alfabéticos (ARG/AUS/AUT
  → bloco "A", BEL/BIH/BRA → bloco "B" etc.), sem introduzir rótulo ou
  elemento novo (minimalismo, IDR 0018).
- FWC (código começa com F) sempre abre e COC (começa com C) sempre fecha
  a ordenação (IDR 0028); não são seleções, mas continuam sendo seções
  como as demais na sequência.

## Decisão

- Compara a primeira letra da sigla de cada seção com a da seção
  imediatamente anterior na sequência de `ordenarPorSigla`; **inclui FWC e
  COC** nessa comparação, como qualquer outra seção — nenhuma exceção nas
  pontas.
- Quando a letra muda, o respiro entre as duas seções ganha +2px sobre o
  padrão do IDR 0050 (8px → 10px); quando a letra se repete, o respiro
  permanece 8px.
- Só se aplica à ordenação por sigla — a ordenação por página (com
  super-grupos A–L) não muda.

## Consequências

- `interface.md` § Corpo e § Medidas ganham a regra do respiro condicional
  por letra, junto da tabela de espaçamentos do IDR 0050.
- `Catalogo.jsx`/`Catalogo.css`: a lista de seções soltas precisa saber a
  letra da seção anterior para aplicar o respiro maior — implementação a
  cargo da tarefa (ex.: classe modificadora no contêiner da seção).
- Implementação: Fase 0034, Tarefa 0034-0003.

## Alternativas consideradas

- **Excluir FWC/COC da regra** (respiro maior só entre seleções, padrão
  nas pontas): recusada pelo humano — o respiro maior vale também entre
  FWC e a primeira seleção e entre a última seleção e COC.
- **Rótulo de letra flutuante** (como lista de contatos): mais explícito,
  mas introduz elemento novo e reforço redundante, contra o minimalismo
  do produto (IDR 0018) — não avançou.
- **Respiro maior que +2px**: o humano fixou +2px (10px total) para não
  competir com a compactação vertical do IDR 0050.
