<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0003: Gravação agregada da coleção

## Status

Aceito — os valores numéricos (debounce, teto de espera) são pontos de partida, ajustáveis sem novo MDR.

## Contexto

- A coleção é persistida no Firestore (ver [MDR 0002](0002-schema-do-documento-da-colecao.md)).
- O usuário pode ajustar contagens em rajada (várias figurinhas em sequência).
- Cada escrita no Firestore conta para a cota diária.

## Decisão

### Três funções de escrita, semânticas diferentes

- **`gravarAlteracoes`** — `setDoc` com `merge: true` e os caminhos aninhados acumulados (valor absoluto ou `deleteField`); toca só as chaves presentes em `alteracoes`, preservando as demais no mapa `contagens`. Idempotente (regravar o valor completo após falha é seguro). A mesma chamada cria o documento na primeira gravação da conta, sem leitura extra para descobrir se ele já existe (ver [TDR 0017](../tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md)).
- **`gravarImportacao`** — `setDoc` com `mergeFields: ['contagens', 'updatedAt']`; substitui o mapa `contagens` inteiro pelo recebido (ao contrário de `gravarAlteracoes`, que só toca as chaves presentes). `atestadoEm` fica de fora da lista e continua intocado. É por isso que a importação precisa desta função à parte: expressar "substituir tudo" como uma lista de chaves alteradas exigiria comparar com o estado anterior e gerar `deleteField()` para cada chave ausente — mais uma fonte de bug para o mesmo resultado.
- **`gravarAtestacao`** — `setDoc` com `merge: true`, grava só `atestadoEm: serverTimestamp()`, deliberadamente sem `updatedAt` — o carimbo da coleção continua significando só alteração de contagens.

### Gravação agregada

- **Debounce de ~2s** após o último ajuste, **teto de espera de ~10s** em rajada contínua.
- **Flush imediato ao fechar a página** (`pagehide`/`visibilitychange`).
- **Flush garantido por persistência local**: cache IndexedDB do SDK, `persistentLocalCache` com `persistentMultipleTabManager()` — o gerenciador multi-aba não é opcional: no modo padrão (aba única) a segunda aba não obtém o lease do IndexedDB e perde o cache, e com ele a garantia de flush. Escritas pendentes sobrevivem ao fechamento e completam na carga seguinte.
- **Sem rede, a escrita não resolve**: com cache local, a promise de `setDoc` só resolve quando o servidor confirma — offline ela fica pendente para sempre, sem sucesso nem falha. Um tempo-limite de ~5s emite o aviso "sem conexão, será gravado depois".
- **Sair da conta dá flush antes**: depois do `signOut` o ID token some e as regras negam a escrita — a gravação pendente precisa ir embora primeiro, senão o logout descarta ajustes.
- **Contagem chegando a 0 apaga a chave** (`deleteField`), não grava zero.

### Consistência de dados

- **Proteção de corrida na carga**: se o usuário ajusta contagens enquanto a leitura do Firestore está em voo, a resposta do servidor é descartada (`ajustesRef` em `App.jsx`). O ajuste local já foi registrado na gravação agregada e será gravado na próxima escrita — o valor do servidor, mais antigo, não pode sobrescrever o valor local.
- **Importação descarta pendências**: `descartarPendencias()` limpa as alterações acumuladas e os temporizadores antes de aplicar a importação. Sem isso, uma escrita agendada de ajustes anteriores poderia disparar depois e reintroduzir dado que a importação já apagou.
- **Falha na gravação não perde dados**: as chaves voltam para a fila (`alteracoes = { ...paraGravar, ...alteracoes }`) e a próxima gravação regrava o valor completo — escrita idempotente.

## Consequências

- 1 escrita por agregação, independente do número de figurinhas alteradas.
- Cache IndexedDB espelha o documento — escritas pendentes sobrevivem ao fechamento da aba.
- Sem rede, a escrita fica enfileirada no cache local e a promise só resolve quando o servidor responde.
- A gravação seguinte regrava o valor completo após falha (idempotente).
- `gravarImportacao` substitui o mapa inteiro sem precisar comparar com o estado anterior.
- `gravarAtestacao` não move o `updatedAt` — o relógio do título não se move com a atestação.
- Ajustes locais durante a carga não são sobrescritos pela resposta do servidor.
- A importação descarta pendências para não reintroduzir dado já substituído.

## Alternativas consideradas

- **`increment()` atômico por chave**: robusto sob concorrência, mas complica a semântica de "regravar o valor completo" após falha e o apagar-chave-em-zero. Descartado.
- **Fila própria de flush em `localStorage`**: reinventaria a fila que o SDK já mantém com o cache IndexedDB. Descartado.
- **Sem debounce**: uma escrita por clique — bateria a cota em rajada. Descartado.
