<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Modelo de dados — Persistência no Firebase

Como a aplicação representa a coleção do usuário no Cloud Firestore. As decisões de modelagem estão nos [MDRs](model-dr/); este documento mostra o estado atual do modelo em produção.

## Onde os dados vivem

- Projeto Firebase `iconula`, banco Firestore `(default)`, modo Native, região `southamerica-east1` (São Paulo), faixa gratuita confirmada no plano Spark
- Um documento por usuário: `users/{uid}` — o uid no caminho é o que torna a autorização uma comparação direta nas regras, sem consulta e sem índice ([MDR 0001](model-dr/0001-localizacao-do-documento-no-firestore.md))
- Fora isso, só a identidade Google (nome, e-mail, foto) — que mora no Firebase Auth, não no Firestore; nenhum outro dado de usuário existe

## Formato do documento

```
users/{uid}
{
  "contagens": {
    "BRA05": 3,           // código → unidades registradas
    "FWC12": 1,
    "COC03": 2
                          // chave ausente = contagem 0
  },
  "updatedAt": <timestamp>,  // carimbo do servidor
  "atestadoEm": <timestamp>, // quando atestou ser maior/autorizado
                             // (uma vez por conta)
  "linkAtivo": <boolean>     // liga o catálogo compartilhado por link;
                             // ausente equivale a desligado
}
```

### Regras do formato

- **Chave = código da figurinha** — três letras da seção + dois dígitos (`BRA05`, `FWC12`, `COC03`), identidade imutável do catálogo; nunca índice, nunca nome
- **Valor = contagem, inteiro ≥ 1** — o mapa é **esparso**: chave ausente significa contagem 0, e zeros nunca são gravados; o documento só cresce com o que o usuário tem
- **Contagem chegando a 0 = apagar a chave** do mapa (não gravar 0)
- **Teto de 99 por contagem** — imposto pelas regras e respeitado pela interface
- **`updatedAt`** é carimbo **do servidor** (`serverTimestamp()`), não do relógio do cliente — carimbo da última escrita no documento; o relógio do cabeçalho exibe uma aproximação local do instante de confirmação da escrita ([TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md))
- **`atestadoEm`** é gravado uma única vez, na atestação de menores do primeiro login — sem `updatedAt` junto
- **`linkAtivo`** é boolean e liga o catálogo compartilhado por link ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md)); ausente equivale a desligado; gravado só ao ligar ou desligar, sem `updatedAt` junto (como `atestadoEm`)
- **Nada além disso**: os únicos campos são `contagens`, `updatedAt`, `atestadoEm` e `linkAtivo`
- **Tamanho**: no pior caso (coleção completa), ~994 chaves de ~5 caracteres — poucos KB, muito abaixo do limite de 1 MiB por documento

Detalhes no [MDR 0002](model-dr/0002-schema-do-documento-da-colecao.md).

## Mecanismo de gravação

Quatro funções de escrita, cada uma com semântica própria ([MDR 0003](model-dr/0003-gravacao-agregada-da-colecao.md); `linkAtivo`, no [MDR 0002](model-dr/0002-schema-do-documento-da-colecao.md)):

- **`gravarAlteracoes`** — `setDoc` com `merge: true`, toca só as chaves alteradas acumuladas pelo debounce; valor absoluto ou `deleteField`; cria o documento na primeira gravação sem leitura extra ([TDR 0017](tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md))
- **`gravarImportacao`** — `setDoc` com `mergeFields: ['contagens', 'updatedAt']`, substitui o mapa `contagens` inteiro; `atestadoEm` fica de fora e continua intocado
- **`gravarAtestacao`** — `setDoc` com `merge: true`, grava só `atestadoEm`, sem `updatedAt` (o carimbo da coleção continua significando só alteração de contagens)
- **`gravarLinkAtivo`** — `setDoc` com `merge: true`, grava só `linkAtivo` (ao ligar ou desligar o catálogo compartilhado, fora da gravação agregada), sem `updatedAt`; desligar grava `false` e revoga a leitura pública ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md))

### Gravação agregada

- **Debounce de ~2s** após o último ajuste, **teto de espera de ~10s** em rajada contínua
- **Flush imediato ao fechar a página** (`pagehide`/`visibilitychange`)
- **Flush garantido por persistência local**: cache IndexedDB do SDK, `persistentLocalCache` com `persistentMultipleTabManager()` — escritas pendentes sobrevivem ao fechamento e completam na carga seguinte
- **Sem rede, a escrita não resolve**: com cache local, a promise só resolve quando o servidor confirma — offline ela fica pendente para sempre; um tempo-limite de ~5s emite o aviso "sem conexão, será gravado depois"
- **Sair da conta dá flush antes**: depois do `signOut` o ID token some e as regras negam a escrita

### Consistência

- **Proteção de corrida na carga**: ajustes locais durante a leitura do Firestore fazem a resposta do servidor ser descartada — o valor local, mais recente, prevalece
- **Importação descarta pendências**: `descartarPendencias()` limpa alterações acumuladas antes de aplicar a importação, para não reintroduzir dado já substituído
- **Falha não perde dados**: as chaves voltam para a fila e a próxima gravação regrava o valor completo (idempotente)

### Migração de schema

- **Campo legado `teamName`**: documentos da era do botão ainda têm este campo; a carga detecta sua presença e agenda `deleteField()` piggyback na próxima gravação de contagens — sem escrita à parte ([TDR 0018](tdr/0018-marca-de-apagar-teamname-via-chave-reservada.md))

## Operações sobre o documento

| Operação | Função | Efeito no documento |
|---|---|---|
| Carregar (login) | `carregarColecao` | 1 leitura de `users/{uid}` → mapa inteiro no estado da tela; detecta `teamName` legado |
| Ajustar (+1/−1) | `gravarAlteracoes` | gravação agregada com `merge: true`, só as chaves alteradas — valores absolutos ou `deleteField` |
| Chegar a 0 (decremento) | `gravarAlteracoes` | apaga a chave do mapa (`deleteField`) |
| Atestação de menores | `gravarAtestacao` | grava `atestadoEm` com `merge: true`, sem `updatedAt` — uma única vez por conta |
| Importar JSON | `gravarImportacao` | **substitui** o campo `contagens` inteiro via `mergeFields` + `updatedAt`; `atestadoEm` intocado |
| Migrar `teamName` | `gravarAlteracoes` | `deleteField()` piggyback na próxima gravação de contagens — sem escrita à parte |
| Ligar/desligar o link | cliente da Tarefa 0027-0004 | `setDoc` com `merge: true` só com `linkAtivo`, **sem** `updatedAt`; desligar revoga a leitura pública |
| Abrir o link | vista do link (Tarefa 0027-0003) | 1 leitura de `users/{uid}`, sem login, permitida só enquanto `linkAtivo == true` |

## O que **não** vai para o Firestore

- **Preferências de vista e colapso manual** — ordenação, disposição, filtro e as seções/super-grupos fechados à mão — vivem no `localStorage` do navegador, por dispositivo, e custam zero requisição (ver [MDR 0007](model-dr/0007-persistencia-no-armazenamento-local.md))
- **Histórico de desfazer** (últimas 10 alterações) vive em memória
- **Cache do SDK** (IndexedDB, `persistentLocalCache` com `persistentMultipleTabManager()`) espelha o documento e sustenta o flush de gravações pendentes

## Regras de segurança

`firestore.rules` é a única garantia de isolamento entre usuários: o bundle é público e qualquer requisição pode ser forjada — a autorização é avaliada no servidor, contra o ID token. Cobertura por testes no emulador (`npm run test:rules`) rodando no CI a cada PR.

O que está publicado:

- `allow get` apenas do próprio documento (`request.auth.uid == userId`), com `get` — nunca `read` — para que uma query na coleção `users` não seja avaliada; `list` segue negado
  - **exceção**: `get` também é permitido a qualquer requisição, **mesmo sem login**, quando o documento tem `linkAtivo == true` ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md), [MDR 0002](model-dr/0002-schema-do-documento-da-colecao.md)); documento inexistente, sem o campo ou com `false` segue negado — a leitura pública não revela se a conta existe
- **`allow create` e `allow update` são regras separadas**: no `create`, `request.resource.data` é só o que está sendo escrito; no `update` com `merge: true`, é o documento resultante inteiro — por isso cada cláusula de validação pergunta "esta operação escreveu este campo?" via `diff(resource.data).affectedKeys()`, não "este campo está no resultado?" ([TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md))
- Ambas exigem `hasOnly(["contagens", "updatedAt", "atestadoEm", "linkAtivo"])` sobre o documento resultante — nenhum campo estranho pode sobreviver
- `contagens` é `map` com `size() <= 994` e `values().hasOnly([1…99])` — o teto de 99 é o que torna os valores validáveis
- `updatedAt == request.time` quando presente na operação (e obrigatório sempre que `contagens` é escrito); `atestadoEm is timestamp` e `linkAtivo is bool` quando escritos na operação
- **Guarda de campo ausente**: a gravação da atestação cria o documento só com `atestadoEm`, sem `contagens` — toda cláusula sobre `contagens` fica sob `!("contagens" in …)`, senão a regra erra em vez de negar
- **allow-list das chaves não entrou**: gerada a partir do catálogo e medida, a cláusula `contagens.keys().hasOnly([994 códigos])` compila, mas a avaliação estoura o limite de 1.000 expressões por requisição — as chaves seguem limitadas só em quantidade (`size() <= 994`), não em conteúdo
- `delete` segue negado — "apagar meus dados" saiu do MVP (requisito futuro em [requisitos.md](requisitos.md); quando voltar, exigirá re-autenticação e autorização nova nas regras)
- sem regra catch-all: o resto é negado por padrão
- **A linguagem de regras não itera**: não há como aplicar um regex a cada chave nem uma condição a cada valor — só comparação de conjunto contra listas escritas à mão (detalhes no [TDR 0009](tdr/0009-validacao-do-mapa-nas-regras.md))
- **App Check** segue de fora, com gatilho de revisão já registrado no [ADR 0005](adr/0005-persistencia-no-firestore.md) (abuso de cota ou migração para o Blaze)
- Deploy das regras pelo próprio `firebase deploy` ([DDR 0004](devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md))

## Custos e cotas

- Plano Spark (gratuito): ~50 mil leituras e ~20 mil escritas por dia; esgotada a cota, as requisições falham até o dia seguinte
- Custo por operação:

| Ação | Operações cobradas |
|---|---|
| Login (carga) | 1 leitura; com o cache local (IndexedDB), cargas repetidas podem servir do cache |
| Ajustes em rajada | 1 escrita por agregação — debounce de ~2s, no máximo 1 escrita a cada ~10s de atividade contínua |
| Chegar a 0 | vai na escrita da agregação (`deleteField` conta como escrita, não como exclusão) |
| Atestação de menores | 1 escrita na vida da conta |
| Ligar ou desligar o link | 1 escrita ao ligar e 1 ao desligar — fora da gravação agregada |
| Abrir o link do catálogo | 1 leitura por abertura, **sem login** |
| Import JSON | 1 escrita (substitui `contagens` + `updatedAt`) |
| Export JSON, texto WhatsApp, desfazer | 0 — leem o estado em memória |
| Trocar ordenação, disposição ou filtro | 0 — preferência de vista vai para o `localStorage` |

- Teto estimado: um usuário pesado (1 h/dia registrando sem parar) ≈ 360 escritas/dia — a cota comporta dezenas de usuários pesados simultâneos; leituras (1 por login) são irrelevantes
- O risco de cota vem dos futuros, não do MVP: sincronização ao vivo (`onSnapshot` — cada entrega cobrada como leitura, multiplicada por dispositivo) é o primeiro candidato; import usado como "salvar" é o segundo (import é substituição rara, não gravação) — gatilhos de revisão já no [ADR 0005](adr/0005-persistencia-no-firestore.md)
- Região: `southamerica-east1` tem faixa gratuita; no Blaze é mais cara por operação que `us-*` — gatilho de revisão se o projeto vincular faturamento
- A RNF de economia de requisições está em [requisitos.md](requisitos.md): uma leitura por login, escritas agregadas, nenhuma requisição por figurinha

## Futuro

- Consulta sem rede (cache local do SDK) e sincronização ao vivo entre dispositivos (`onSnapshot`) — futuros registrados em requisitos.md; o segundo mudaria o modelo de leitura, hoje uma carga por login, e tornaria a aproximação local do `atualizadoEm` desnecessária (o carimbo viria do próprio servidor via listener)
- Allow-list dos 994 códigos nas regras — avaliada à parte, depende de caber no limite de 1.000 expressões por requisição
