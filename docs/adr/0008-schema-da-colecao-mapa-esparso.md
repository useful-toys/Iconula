<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0008: Persistência da coleção de figurinhas no Firestore

## Status

Aceito. Os detalhes do modelo de dados estão nos [MDRs](../mdr/):

- Localização do documento: [MDR 0001](../mdr/0001-localizacao-do-documento-no-firestore.md)
- Schema do documento: [MDR 0002](../mdr/0002-schema-do-documento-da-colecao.md)
- Gravação agregada: [MDR 0003](../mdr/0003-gravacao-agregada-da-colecao.md)
- Persistência no armazenamento local: [MDR 0007](../mdr/0007-persistencia-no-armazenamento-local.md)

## Contexto

- ADR 0007 definiu a infraestrutura de persistência no Firestore (serviço, região, SDK sob demanda, política de erro).
- O produto evoluiu do "time visível" (uma string) para a coleção de figurinhas (994 contagens).
- Sessões simultâneas ficam sem tratamento por decisão (requisitos.md: última gravação vence).

## Decisão

- **Usar o Firestore para a coleção de figurinhas**, estendendo a infraestrutura do ADR 0007.
- **Política de erro visível** (revê o ADR 0007): falha notificada na tela (IDR 0017), a interface segue utilizável, a gravação seguinte regrava o valor completo.
- **Sessões simultâneas**: sem tratamento — a última gravação vence.

## Consequências

- Cota: 1 leitura por login (e menos, servindo do cache local); 1 escrita por agregação; +1 escrita única de atestação por conta; import = 1 escrita — folga grande na cota do Spark.
- Sincronização ao vivo (futuro) trocará o modelo de leitura — gatilho de revisão deste ADR.

## Alternativas consideradas

- **Subcoleção `users/{uid}/contagens/{código}`**: uma escrita por figurinha (cota em rajada), leitura em query, regras por subcaminho — só compensaria se a coleção não coubesse num documento. Decisão de modelagem detalhada no [MDR 0002](../mdr/0002-schema-do-documento-da-colecao.md).
