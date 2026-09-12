<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0008: Schema da coleção — mapa esparso em `users/{uid}`

## Status

Aceito — os valores numéricos (debounce, teto de espera) são pontos de
partida, ajustáveis na implementação sem novo ADR. Dois pontos foram
revistos desde a redação:

- O **teto por contagem** saiu e voltou. A decisão original dizia 1–99;
  foi removida a pedido ("tantas quantas a arquitetura suportar") e
  restabelecida em 99 pelo
  [TDR 0009](../tdr/0009-validacao-do-mapa-nas-regras.md), que mostrou
  ser o teto a única forma de as regras validarem os valores do mapa
- O `updatedAt` exibido no cabeçalho é o carimbo do documento, não um
  relógio de evento local
  ([IDR 0027](../idr/0027-relogio-do-titulo-e-o-updatedat-do-documento.md))

## Contexto

- ADR 0007 definiu a infraestrutura de persistência da era do botão
  (`users/{uid}`, regras, SDK sob demanda, falha invisível). O produto
  novo muda o quadro: contagens de 994 figurinhas, gravação agregada
  (IDR 0003), avisos visíveis (IDRs 0002/0017), `updatedAt` no cabeçalho,
  desfazer (IDRs 0010/0012), atestação de menores por conta (LGPD
  art. 14), campo `teamName` órfão a migrar, gravações pendentes que não
  podem se perder ao fechar a página. Sessões simultâneas ficam sem
  tratamento por decisão (requisitos.md: última gravação vence).
- Dois formatos físicos candidatos (persistencia.md): mapa no documento
  vs. subcoleção. Coleção completa: ~994 chaves de ~5 caracteres — poucos
  KB, bem abaixo do limite de 1 MiB por documento.
- Usuário confirmou: mapa.

## Decisão

- **Mapa esparso no documento `users/{uid}`** — campos `contagens`
  (`map<string, int ≥ 1>`), `updatedAt` e `atestadoEm`, timestamps com
  carimbo do servidor:
  - chave = código do catálogo; chave ausente = contagem 0; zeros nunca
    gravados; contagem chegando a 0 apaga a chave
  - **teto de 99 por contagem**, imposto pelas regras e respeitado pela
    interface (o incremento para em 99, como o decremento para em 0) —
    é o que torna os valores validáveis no servidor
    ([TDR 0009](../tdr/0009-validacao-do-mapa-nas-regras.md)); dois
    dígitos é o que o selo já reserva
    ([IDR 0021](../idr/0021-selo-conta-unidades-sobrando.md))
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
- **Flush garantido por persistência local**: cache IndexedDB do SDK,
  `persistentLocalCache` com `persistentMultipleTabManager()` — o
  gerenciador multi-aba não é opcional: no modo padrão (aba única) a
  segunda aba não obtém o lease do IndexedDB e perde o cache, e com ele
  a garantia de flush. Escritas pendentes sobrevivem ao fechamento e
  completam na carga seguinte; é também a primeira pedra do futuro
  "consulta sem rede"
- **Sem rede, a escrita não resolve**: com cache local, a promise de
  `updateDoc` só resolve quando o servidor confirma — offline ela fica
  pendente para sempre, sem sucesso nem falha. Um tempo-limite de ~5s
  emite o **aviso** "sem conexão, será gravado depois"
  ([IDR 0029](../idr/0029-avisos-flutuantes-com-tres-severidades.md)),
  que é a verdade: a escrita está enfileirada no IndexedDB
- **Sair da conta dá flush antes**: depois do `signOut` o ID token some
  e as regras negam a escrita — a gravação pendente precisa ir embora
  primeiro, senão o logout descarta ajustes
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
- Regras novas: `hasOnly` os três campos; `contagens` map de tamanho
  ≤ 994 com valores validados por `values().hasOnly([1…99])`;
  `updatedAt == request.time`; `delete` e `list` negados. A allow-list
  dos 994 códigos entra se couber no orçamento de expressões — o que a
  linguagem permite e o que não permite está no
  [TDR 0009](../tdr/0009-validacao-do-mapa-nas-regras.md), inclusive o
  teto de abuso de 1 MiB por conta que nenhum desenho de mapa fecha
- `updatedAt` passa a existir — reverte o "sem updatedAt" do ADR 0007;
  carimbo da última escrita no documento, e é esse valor que o cabeçalho
  exibe (IDR 0027) — a carga apenas o traz, não o atualiza
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
