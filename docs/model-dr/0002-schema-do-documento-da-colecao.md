<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0002: Schema do documento da coleção

## Status

Aceito.

## Contexto

- A coleção de figurinhas de cada usuário precisa ser persistida no Firestore.
- O catálogo tem 994 figurinhas, identificadas por código imutável (ex.: `BRA05`, `FWC12`, `COC03`).
- A coleção completa cabe em poucos KB, muito abaixo do limite de 1 MiB por documento.

## Decisão

- **Mapa esparso no documento `users/{uid}`** com três campos:
  - `contagens`: `map<string, int 1–99>` — chave é o código da figurinha; chave ausente significa contagem 0; zeros nunca são gravados; contagem chegando a 0 apaga a chave (`deleteField`).
  - `updatedAt`: timestamp do servidor (`serverTimestamp()`) — carimbo da última escrita no documento.
  - `atestadoEm`: timestamp — gravado uma única vez, na atestação de menores do primeiro login; sem `updatedAt` junto (o carimbo da coleção segue significando alteração de contagens).
- **Teto de 99 por contagem**, imposto pelas regras e respeitado pela interface — é o que torna os valores validáveis no servidor.
- **Nada além disso**: os únicos campos são `contagens`, `updatedAt` e `atestadoEm`.

### Evolução do schema

- **Campo legado `teamName`**: documentos da era do botão (antes do schema atual) ainda têm o campo `teamName`. A carga (`carregarColecao`) detecta sua presença (`temTeamName`) e agenda sua remoção na próxima gravação agregada — `deleteField()` piggyback na mesma escrita de contagens, sem escrita à parte (ver [MDR 0003](0003-gravacao-agregada-da-colecao.md) e [TDR 0018](../tdr/0018-marca-de-apagar-teamname-via-chave-reservada.md)).
- **Regras `create` vs `update`**: o `firestore.rules` tem regras separadas para `create` e `update`. No `create`, `request.resource.data` é só o que está sendo escrito. No `update` com `merge: true`, `request.resource.data` é o documento resultante inteiro (campos antigos preservados pelo merge aparecem junto) — por isso cada cláusula de validação pergunta "esta operação escreveu este campo?" via `diff(resource.data).affectedKeys()`, não "este campo está no resultado?" (ver [TDR 0009](../tdr/0009-validacao-do-mapa-nas-regras.md)).
- **`hasOnly` sobre o documento inteiro**: mesmo no `update`, a allow-list de campos (`hasOnly(["contagens", "updatedAt", "atestadoEm"])`) é avaliada sobre o documento resultante — nenhum campo estranho pode sobreviver a um `update`, escrito nesta operação ou não.

## Consequências

- O documento só cresce com o que o usuário tem (mapa esparso).
- As regras conseguem validar os valores do mapa (`values().hasOnly([1…99])`).
- `updatedAt` é carimbo do servidor, não do relógio do cliente — o relógio do cabeçalho exibe uma aproximação local do instante de confirmação da escrita (ver [TDR 0017](../tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md)).
- Tamanho no pior caso (coleção completa): ~994 chaves de ~5 caracteres — poucos KB.
- Documentos legados com `teamName` são migrados sem escrita extra, na próxima gravação de contagens.

## Alternativas consideradas

- **Subcoleção `users/{uid}/contagens/{código}`**: uma escrita por figurinha (cota em rajada), leitura em query, regras por subcaminho — só compensaria se a coleção não coubesse num documento. Descartado.
- **Mapa inteiro a cada gravação**: escrita maior e conflito bruto entre sessões — as chaves alteradas bastam (ver [MDR 0003](0003-gravacao-agregada-da-colecao.md)). Descartado.
- **Teto diferente de 99**: sem teto, as regras não conseguem validar os valores (a linguagem não itera). Descartado.
- **Regra única `create, update`**: o `merge: true` da atestação preservava o `updatedAt` antigo no documento resultante, e a checagem `updatedAt == request.time` falhava — o valor antigo nunca é `request.time`. Separar `create` e `update` resolveu (Tarefa 0008-0005). Descartado.
