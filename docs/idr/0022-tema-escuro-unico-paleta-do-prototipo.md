<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0022: Tema escuro único, com a paleta do protótipo

## Status

Aceito — resolve a contradição entre a identidade visual declarada em
interface.md ("tema escuro verde-gramado com detalhes dourados") e a
base herdada do botão (`App.css` com dark mode via
`prefers-color-scheme`, preservada pela RNF de responsividade).

## Contexto

interface.md declarava a identidade — escuro verde-gramado com dourado
— e, na linha seguinte, mandava preservar o `App.css` do botão, que
alterna claro/escuro conforme a preferência do sistema. As duas coisas
não convivem: ou existe um tema claro, ou a identidade é sempre escura.

A pergunta não era estética apenas: os estados do cartão
([IDR 0006](0006-estados-visuais-e-interacao-da-figurinha.md)) são
cinza, verde e laranja, e o verde do cartão sobre um fundo verde-gramado
é o par mais frágil de contraste — precisaria de duas afinações se
houvesse dois temas.

O protótipo de tela (`docs/prototype/`) materializou a identidade com
uma paleta fechada em OKLCH e virou a referência: o usuário decidiu
adotar o esquema de cores, o layout e a aparência dele.

## Decisão

- **Tema único escuro**: o app não segue `prefers-color-scheme` e não
  oferece tema claro — a identidade verde-gramado com dourado é a única
  aparência
- A paleta, a tipografia e as medidas são as do protótipo, transcritas
  em interface.md ("Identidade visual") como fonte para o CSS
- O `App.css` da era do botão deixa de ser base a preservar: a RNF de
  responsividade continua valendo para o comportamento (funcionar bem
  em celular, tablet e navegador), não para aquele arquivo

## Consequências

- Um só conjunto de cores para afinar contraste — o par verde-cartão
  sobre fundo gramado é ajustado uma vez
- Perde-se o tema claro; para leitura sob sol forte (feira de troca ao
  ar livre) o recurso é o brilho do aparelho — aceito
- As cores viram tokens CSS (`--turf`, `--gold`, `--green-card`…), não
  literais espalhados pelos componentes
- A regra de acessibilidade permanece: cor nunca é o único sinal — o
  reforço vazio/preenchido do cartão (IDR 0006) segue obrigatório

## Alternativas consideradas

- **Manter os dois temas** (`prefers-color-scheme`): respeita a
  preferência do sistema, mas dobra o trabalho de contraste e dilui a
  identidade — o verde-gramado é o produto
- **Tema claro como opção configurável**: contraria "sem configurações"
  do [IDR 0018](0018-usuario-especialista-e-minimalismo.md)
