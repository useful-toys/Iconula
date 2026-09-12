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

## Consequências

- O documento só cresce com o que o usuário tem (mapa esparso).
- As regras conseguem validar os valores do mapa (`values().hasOnly([1…99])`).
- `updatedAt` é carimbo do servidor, não do relógio do cliente — o relógio do cabeçalho exibe exatamente esse valor.
- Tamanho no pior caso (coleção completa): ~994 chaves de ~5 caracteres — poucos KB.

## Alternativas consideradas

- **Subcoleção `users/{uid}/contagens/{código}`**: uma escrita por figurinha (cota em rajada), leitura em query, regras por subcaminho — só compensaria se a coleção não coubesse num documento. Descartado.
- **Mapa inteiro a cada gravação**: escrita maior e conflito bruto entre sessões — as chaves alteradas bastam (ver [MDR 0003](0003-gravacao-agregada-da-colecao.md)). Descartado.
- **Teto diferente de 99**: sem teto, as regras não conseguem validar os valores (a linguagem não itera). Descartado.
