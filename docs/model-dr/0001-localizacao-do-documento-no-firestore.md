<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0001: Localização do documento no Firestore

## Status

Aceito.

## Contexto

- A aplicação persiste a coleção de cada usuário no Cloud Firestore.
- É necessário definir onde e como o documento de cada usuário é localizado.

## Decisão

- **Um documento por usuário**, com o uid no caminho: `users/{uid}`.
- **Documento raiz**, não subcoleção (`users/{uid}/preferences/current` foi descartado): preferências futuras entram como campos do mesmo documento, sem leitura adicional e sem dobrar a superfície das regras.
- **O uid no caminho, não num campo**: é o que torna a regra de segurança uma comparação direta (`request.auth.uid == userId`), sem consulta e sem índice.
- **Nenhuma query** ⇒ nenhum índice composto ⇒ nenhum `firestore.indexes.json`.

## Consequências

- A autorização nas regras do Firestore é uma comparação direta, sem consulta.
- A subcoleção continua possível no futuro, sem mover este documento.
- Sem queries, não há custo de índice composto nem manutenção de `firestore.indexes.json`.

## Alternativas consideradas

- **`users/{uid}/preferences/current` (subcoleção)**: dois segmentos de caminho para um campo, fragmentaria os dados do usuário conforme a SPA crescer. Descartado.
- **Coleção nomeada por feature** (`teamSelections/{uid}`): fragmentaria os dados do usuário. Descartado.
