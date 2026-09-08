<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0008: Schema da coleção — mapa esparso em `users/{uid}`

## Status

Aceito — valores numéricos (debounce, teto de espera, teto por
contagem) são pontos de partida, ajustáveis na implementação sem novo
ADR.

## Contexto

O ADR 0007 definiu a infraestrutura de persistência para a era do botão
(`users/{uid}`, regras, SDK sob demanda, falha invisível). O produto
novo mudou o quadro: contagens de 994 figurinhas, gravação agregada
(IDR 0003), avisos visíveis (IDRs 0002/0017), `updatedAt` exibido no
cabeçalho, desfazer (IDRs 0010/0012), atestação de menores por conta
(LGPD art. 14), campo `teamName` órfão a migrar e a pendência de que
gravações pendentes não se percam ao fechar a página. Sessões
simultâneas ficam deliberadamente sem tratamento (requisitos.md: a
última gravação vence).

Dois formatos físicos eram candidatos (persistencia.md): mapa no
documento e subcoleção. Uma coleção completa são ~994 chaves de ~5
caracteres — poucos KB, muito abaixo do limite de 1 MiB por documento.

O usuário confirmou: mapa.

## Decisão

- **Mapa esparso no documento `users/{uid}`** — campos `contagens`
  (`map<string, int 1–99>`), `updatedAt` e `atestadoEm`, timestamps com
  carimbo do servidor:
  - chave = código do catálogo; chave ausente = contagem 0; zeros nunca
    gravados; contagem chegando a 0 apaga a chave
  - `atestadoEm`: gravado uma única vez, na atestação de menores do
    primeiro login — sem `updatedAt` junto (o carimbo da coleção segue
    significando alteração de contagens)
- **Gravação agregada**: debounce de ~2s após o último ajuste, teto de
  espera de ~10s em rajada contínua, flush imediato ao fechar a página
  (`pagehide`/`visibilitychange`)
- **Escrita por chaves alteradas**: `updateDoc` com os caminhos aninhados
  acumulados — valor absoluto ou `deleteField` — numa única operação de
  escrita por agregação; idempotente (regravar o valor completo após
  falha é seguro); `increment()` descartado
- **Flush garantido por persistência local**: cache IndexedDB do SDK
  (`persistentLocalCache`) — escritas pendentes sobrevivem ao
  fechamento e completam na carga seguinte; é também a primeira pedra
  do futuro "consulta sem rede"
- **Política de erro visível** (revê o ADR 0007): falha notificada na
  tela (IDR 0017), a interface segue utilizável, a gravação seguinte
  regrava o valor completo
- **Migração do `teamName`**: ao carregar um documento que ainda o
  tenha, a primeira gravação do schema novo o apaga (`deleteField`) —
  regras estritas para sempre depois disso
- **Sessões simultâneas**: sem tratamento — chaves distintas convivem
  naturalmente (a escrita endereça só as chaves alteradas); sobre a
  mesma chave, a última gravação vence

## Consequências

- Cota (detalhe em [persistencia.md](../persistencia.md)): 1 leitura
  por login — e menos, servindo do cache local; 1 escrita por
  agregação, independente do número de figurinhas alteradas; +1
  escrita única de atestação por conta; import = 1 escrita — folga
  grande na cota do Spark
- Regras novas (TDR das regras): `hasOnly` os três campos; `contagens`
  map com int 1–99; chaves = códigos do catálogo (regex × allow-list);
  `updatedAt`/`atestadoEm` timestamps; `delete` segue negado
- `updatedAt` passa a existir — reverte o "sem updatedAt" do ADR 0007;
  carimbo da última escrita no documento (o cabeçalho exibe a última
  transação bem-sucedida, leitura ou escrita — requisitos.md)
- Dado local (IndexedDB) espelha o documento — novo componente no
  cliente, já exigido pelo SDK; sem backend, sem mudança de deploy
- Sincronização ao vivo (futuro) trocará o modelo de leitura — gatilho
  de revisão deste ADR

## Alternativas consideradas

- **Subcoleção `users/{uid}/contagens/{código}`**: uma escrita por
  figurinha (cota em rajada), leitura em query, regras por subcaminho —
  só compensaria se a coleção não coubesse num documento
- **Mapa inteiro a cada gravação**: escrita maior e conflito bruto
  entre sessões — as chaves alteradas bastam
- **`increment()` atômico por chave**: robusto sob concorrência, mas
  complica a semântica de "regravar o valor completo" após falha e o
  apagar-chave-em-zero
- **Fila própria de flush em `localStorage`**: reinventaria a fila que
  o SDK já mantém com o cache IndexedDB
