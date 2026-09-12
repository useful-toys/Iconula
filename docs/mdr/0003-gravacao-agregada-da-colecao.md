<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0003: Gravação agregada da coleção

## Status

Aceito — os valores numéricos (debounce, teto de espera) são pontos de partida, ajustáveis sem novo MDR.

## Contexto

- A coleção é persistida no Firestore (ver [MDR 0002](0002-schema-do-documento-da-colecao.md)).
- O usuário pode ajustar contagens em rajada (várias figurinhas em sequência).
- Cada escrita no Firestore conta para a cota diária.

## Decisão

- **Escrita por chaves alteradas**: `setDoc` com `merge: true` e os caminhos aninhados acumulados — valor absoluto ou `deleteField` — numa única operação de escrita por agregação; idempotente (regravar o valor completo após falha é seguro).
- **Gravação agregada**: debounce de ~2s após o último ajuste, teto de espera de ~10s em rajada contínua.
- **Flush imediato ao fechar a página** (`pagehide`/`visibilitychange`).
- **Flush garantido por persistência local**: cache IndexedDB do SDK, `persistentLocalCache` com `persistentMultipleTabManager()` — o gerenciador multi-aba não é opcional: no modo padrão (aba única) a segunda aba não obtém o lease do IndexedDB e perde o cache, e com ele a garantia de flush. Escritas pendentes sobrevivem ao fechamento e completam na carga seguinte.
- **Sem rede, a escrita não resolve**: com cache local, a promise de `setDoc` só resolve quando o servidor confirma — offline ela fica pendente para sempre, sem sucesso nem falha. Um tempo-limite de ~5s emite o aviso "sem conexão, será gravado depois".
- **Sair da conta dá flush antes**: depois do `signOut` o ID token some e as regras negam a escrita — a gravação pendente precisa ir embora primeiro, senão o logout descarta ajustes.
- **Contagem chegando a 0 apaga a chave** (`deleteField`), não grava zero.

## Consequências

- 1 escrita por agregação, independente do número de figurinhas alteradas.
- Cache IndexedDB espelha o documento — escritas pendentes sobrevivem ao fechamento da aba.
- Sem rede, a escrita fica enfileirada no cache local e a promise só resolve quando o servidor responde.
- A gravação seguinte regrava o valor completo após falha (idempotente).

## Alternativas consideradas

- **`increment()` atômico por chave**: robusto sob concorrência, mas complica a semântica de "regravar o valor completo" após falha e o apagar-chave-em-zero. Descartado.
- **Fila própria de flush em `localStorage`**: reinventaria a fila que o SDK já mantém com o cache IndexedDB. Descartado.
- **Sem debounce**: uma escrita por clique — bateria a cota em rajada. Descartado.
