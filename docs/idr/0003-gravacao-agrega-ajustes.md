<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0003: Gravação agrega ajustes, sem escrita por clique

## Status

Aceito — revê, para este produto, o fire-and-forget por clique do
[ADR 0007](../adr/0007-persistencia-do-time-no-firestore.md) (um
`setDoc` por clique, sem debounce). A revisão formal fica registrada
como pendência do ADR do schema.

## Contexto

- ADR 0007 decidiu escrita sem debounce — um `setDoc` por clique —
  fiel ao pedido da época; certa para o botão.
- No produto novo, cada ajuste de contagem dispararia uma escrita **e**
  uma notificação de "gravado" (ver
  [IDR 0002](0002-avisos-de-sincronizacao-visiveis.md)). Em sessões de
  registro em rajada — abrir envelopes e lançar 7 números, conferir o
  álbum página a página — isso vira centenas de escritas e
  notificações.
- Pedido do usuário: salvamento relativamente rápido, mas não a cada
  alteração; persistência transparente, sem botões de ler/salvar.

## Decisão

- A persistência é automática e transparente: **sem botões de ler ou
  salvar** — o usuário nunca dispara gravação
- Gravações **agregam ajustes**: relativamente rápidas, sem precisar
  acontecer a cada alteração (frequência exata no ADR do schema)
- A tela aplica o ajuste na hora; a gravação seguinte o leva

## Consequências

- Menos escritas (cota gratuita do Spark) e menos notificações — alivia
  o ruído apontado pelo IDR 0002
- Abre o caso de borda "gravação pendente ao fechar a página": a
  garantia de flush entra como pendência do ADR do schema
- Testes passam a lidar com tempo (debounce/agregação), que o
  fire-and-forget não tinha

## Alternativas consideradas

- **Escrita por clique** (ADR 0007 intacto): ruído de notificações e
  custo de escrita desnecessários em rajada
- **Botão salvar**: violaria a transparência exigida — persistência
  nunca é ação do usuário
