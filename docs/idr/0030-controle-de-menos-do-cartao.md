<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0030: O controle de menos do cartão surge no hover, no foco e em telas sem hover

## Status

Aceito — desbloqueia a Tarefa 0002-0003, que deixava em aberto como o
controle de menos "surge ao tocar" num dispositivo sem toque (mouse e
teclado).

Revisto pelo [IDR 0032](0032-controle-de-menos-so-com-unidade-e-dentro-do-cartao.md):
o controle só existe a partir da contagem 1 e fica dentro do cartão, no
canto inferior esquerdo. O que esta decisão diz sobre *quando* revelá-lo
continua valendo — agora só nos cartões que o têm.

## Contexto

O IDR 0006 decide que a figurinha soma uma unidade ao tocar e que um
ícone de menos "surge ao tocar" para remover. Em celulares e tablets o
toque é o gesto natural; em desktop, o cursor de mouse e a navegação por
teclado precisam de um comportamento equivalente, sob pena de o decremento
ficar inacessível.

## Decisão

- O controle de menos fica **visualmente oculto por padrão** no cartão,
  para não competir com o gesto principal (tocar para somar) nem poluir
  visualmente a grade densa de figurinhas.
- Ele se torna visível quando:
  - o cursor passa sobre o cartão (`:hover`);
  - o cartão ou o próprio controle recebe foco (`:focus-within`);
  - o dispositivo não oferece hover (`@media (hover: none)`), caso comum
    de celulares e tablets — aí o controle fica sempre visível, já que
    não há outro gatilho confiável para revelá-lo sem interferir no toque
    de soma.
- O controle de menos é um botão separado, focável e com nome acessível
  próprio ("remover uma unidade de BRA 05"), nunca `dangerouslySetInnerHTML`.

## Consequências

- O decremento continua acessível por teclado: ao navegar até o cartão,
  o controle aparece e pode receber foco.
- Em celular/tablet o controle fica sempre visível, o que é aceitável
  porque a tela sensível já lida bem com dois alvos próximos (soma no
  corpo do cartão, remoção no canto).
- O gesto de toque no corpo do cartão continua somando; o controle de
  menos é atingido por um toque direto, sem risco de acionar a soma por
  propagação de evento.

## Alternativas consideradas

- **Sempre visível**: mais direto, mas polui a grade e reduz a área de
  toque da soma — descartado pelo minimalismo do IDR 0018.
- **Surge ao pressionar e segurar**: comum em apps móveis, mas esconde
  a ação do usuário desktop e dificulta a descoberta por teclado.
- **Menu de contexto / botão de ações por figurinha**: escalável, mas
  adiciona um passo a cada decremento, contra o fluxo essencial.
