<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0069: Espaçadores de linha e página na disposição lista

## Status

Aceito.

## Contexto

- Na disposição lista, os cartões fluem em sequência com 8px uniformes
  entre eles (IDR 0050), sem relação visual com a disposição álbum, que
  já reproduz linhas, páginas e trilhas fixas da página física
  (`layoutDeSecao`/`layoutSelecao`/`layoutCocaCola` em
  `catalogoLayout.js`, IDR 0009).
- O humano pediu respiros extras na lista das **seções de seleção**, nas
  fronteiras 2-3, 6-7, 13-14, 17-18 (pequeno) e 10-11 (médio) — que
  coincidem exatamente com as quebras de linha e de página que
  `layoutSelecao()` já descreve: linha 1 (1-2), linha 2 (3-6), linha 3
  (7-10, fim da página 1), linha 1 da página 2 (11-13, com a paisagem 13
  ocupando 2 trilhas), linha 2 (14-17), linha 3 (18-20).
- Discutido com o humano, a regra generaliza para **qualquer seção**,
  usando o layout que ela já tem: pequeno nas quebras de linha dentro da
  mesma página, médio nas quebras de página.
- A Coca-Cola (`layoutCocaCola()`) tem páginas em sequência normal (1-6 na
  página 1, 7-14 na página 2) — a regra se aplica sem ressalvas.
- O FWC (`layoutFWC()`) tem posições que **não crescem em página** ao
  longo da sequência 0-19: a página das posições 5-8 alterna 4, 3, 4, 3
  (`catalogoLayout.js`, `layoutFWC`), porque a numeração oficial não
  segue a ordem física das páginas nesse trecho. Detectar "quebra de
  página" por mudança de número de página geraria vários respiros médios
  seguidos ali, sem corresponder a um bloco visual reconhecível — o
  humano decidiu deixar o FWC de fora.

## Decisão

- Na disposição lista, para **seções de seleção e a Coca-Cola** (não o
  FWC): usa `layoutDeSecao(secao)` para achar, na sequência de posições
  (mesma ordem da lista), onde a linha muda dentro da mesma página e onde
  a página muda.
  - Quebra de linha (mesma página): respiro +2px sobre o padrão do IDR
    0050 (8px → 10px).
  - Quebra de página: respiro +4px (8px → 12px).
  - Sem quebra (dentro da mesma linha): 8px, sem mudança.
- O FWC continua com 8px uniformes na lista, sem espaçadores extras.
- O filtro de status (IDR 0033) pode ocultar cartões da lista; a
  fronteira relevante para o respiro é entre os cartões efetivamente
  visíveis após o filtro, não a posição original — evita respiro colado
  a uma borda quando um vizinho some.

## Consequências

- `interface.md` § Corpo (disposição lista) e § Medidas ganham a regra
  dos dois respiros extras, condicionada a `secao.tipo` e à exclusão do
  FWC, e a nota sobre a interação com o filtro.
- `Secao.jsx`/`Secao.css`: a grade da lista (`secao__grade`) passa a
  consultar `layoutDeSecao(secao)` para decidir a classe de respiro de
  cada cartão, reaproveitando a mesma fonte de layout da disposição álbum
  (TDR 0012) em vez de números fixos.
- `Secao.test.jsx`: novos testes cobrem as fronteiras de uma seleção
  (2-3, 6-7, 10-11, 13-14, 17-18), da Coca-Cola (3-4, 6-7, 9-10, 12-13) e
  a ausência de respiro extra no FWC.
- Implementação: Fase 0034, Tarefa 0034-0002.

## Alternativas consideradas

- **Números fixos por seção** (2-3, 6-7, 10-11 etc., escritos à parte do
  layout): mais simples de ler, mas duplica uma regra que já existe em
  `catalogoLayout.js` e se desalinha se o layout do álbum mudar —
  recusada em favor de derivar do layout.
- **Estender ao FWC mesmo com os saltos de página**: geraria respiros
  médios em sequência nas posições 4-8, sem bloco visual reconhecível —
  recusada pelo humano.
- **Respiro médio maior (ex.: igual ao gap entre super-grupos, 12px)**:
  o humano fixou +4px (12px total) para manter a diferença perceptível
  sem romper a compactação vertical do IDR 0050.
