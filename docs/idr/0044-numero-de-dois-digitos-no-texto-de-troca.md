<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0044: Número de dois dígitos no texto de troca

## Status

Aceito.

## Contexto

Os textos de troca (`src/lib/textoDeTroca.js`) imprimiam o número da
figurinha **cru**: `Brasil BRA: 5 8 12 19` para faltantes e `5×2` para
repetidas (a segunda parte de `nn×k` já é a contagem, não o número).
Enquanto todas as seções começavam em `01`, isso nunca produzia um número
de um dígito só.

A Tarefa 0014-0001 renumerou a seção Extras FIFA para `FWC00`…`FWC19`,
indexada a partir de zero. A partir daí, a linha dos Extras FIFA passaria a
sair como `Extras FIFA FWC: 0 3 7` — e um `0` solto num grupo de WhatsApp
lê como erro de digitação ou como "nenhuma quantidade", não como o número
da figurinha. O texto é feito para ser colado e comparado entre pessoas
(IDR 0039), então essa ambiguidade atrapalha exatamente o uso a que ele se
destina.

O cartão e o código, em contrapartida, sempre exibem o número com dois
dígitos (`FWC 00`, `BRA 05`) — `src/components/Figurinha.jsx` deriva a
segunda metade direto do código. A decisão era entre padronizar o texto
com o cartão ou abrir uma exceção só para o FWC.

## Decisão

- **Todo número nos textos de troca sai com dois dígitos**, em todas as
  seções, como no cartão e no código: `Brasil BRA: 05 08 12 19`,
  `Extras FIFA FWC: 00 03 19`; nas repetidas, `05×2` e `00×1`.
- A formatação é `String(posicao).padStart(2, "0")` — o mesmo `padStart`
  usado para montar o código em `src/data/catalogo.js`. O `×k` continua
  sendo as unidades sobrando (contagem − 1), sem mudança (IDR 0021).
- O **separador entre números continua o espaço**, e não a vírgula: é o
  que `docs/requisitos.md` § Compartilhamento especifica
  (`Brasil BRA: 05 08 12 19`). Esta decisão muda só a quantidade de
  dígitos, não o formato da linha.
- A ordem das seções (álbum, IDR 0039) e a ordem crescente dos números
  ficam intactas.

## Consequências

- O texto colado fica alinhado com o que está impresso na figurinha: a
  mesma sequência `05 08 12 19` que se lê no cartão.
- O exemplo de `docs/requisitos.md` § Compartilhamento foi atualizado de
  `Brasil BRA: 5 8 12 19` para `Brasil BRA: 05 08 12 19`, e o de repetidas
  de `5×2` para `05×2`, no mesmo commit — requisito e comportamento não
  podem divergir.
- O texto fica, no pior caso, um caractere mais largo por número de um
  dígito; irrelevante para uma mensagem de texto.
- Listas já coladas em grupos continuam válidas como registro: são saída
  efêmera, sem consumidor automático — nada lê o texto de volta.
- **Premissa explícita (decisão de nível 2)**: adotou-se a regra única para
  o app inteiro, e não "dois dígitos só no FWC". Se o humano preferir
  preservar o texto enxuto das seleções, a variante "só no FWC" é aceitável
  e cabe neste mesmo IDR; a escolha está registrada no log da Tarefa
  0014-0002.

## Alternativas consideradas

- **Dois dígitos só no FWC**: resolveria o `0` sem mexer nas seleções, mas
  deixaria duas convenções convivendo na mesma mensagem colada
  (`Brasil BRA: 5 8` ao lado de `Extras FIFA FWC: 00 03`) — pior de
  comparar do que a regra única, que é o objetivo do texto (IDR 0039).
- **Manter o número cru e omitir o `FWC00`**: esconderia uma figurinha real
  do catálogo na lista de troca, o que contraria o propósito de faltantes e
  repetidas.
- **Prefixar cada número com a sigla** (`FWC 00`, `BRA 05`): elimina a
  ambiguidade, mas a sigla já está no início da linha e repeti-la em cada
  número infla o texto sem ganho de clareza.
