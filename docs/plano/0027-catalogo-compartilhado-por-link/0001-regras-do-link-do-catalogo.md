<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0001]: regras do Firestore para o link do catálogo

## Status
Concluída

## Objetivo
Aceitar o campo `linkAtivo` no documento `users/{uid}` e liberar a leitura
desse documento a qualquer requisição, mesmo sem login, enquanto
`linkAtivo == true`. É a base que a vista do link (Tarefa 0027-0003) e a
chave do popup (Tarefa 0027-0004) usam, e as regras sobem antes do código
que grava o campo (DDR 0004).

## Documentos de referência
- `docs/model-dr/0002-schema-do-documento-da-colecao.md` § Decisão
  (`linkAtivo` e leitura pública condicionada) e § Consequências
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — link único ligado/desligado; `uid` no link
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — `diff`
  `affectedKeys()` no `update` e guarda de campo ausente
- `firestore.rules` — blocos `allow get`, `allow create`, `allow update`
- `firestore.rules.test.js` — padrão dos `describe` existentes
- `docs/modelo-firebase.md` § Formato do documento, § Regras de segurança,
  § Operações sobre o documento, § Custos e cotas

## Padrões e convenções aplicáveis
- `get`, nunca `read`: `list` continua negado — MDR 0002, comentário em
  `firestore.rules`
- `hasOnly` sobre o documento resultante inteiro, nos dois `allow` —
  MDR 0002
- No `update`, cada cláusula pergunta se a operação escreveu o campo
  (`diff(resource.data).affectedKeys()`) — TDR 0009
- Gravar `linkAtivo` não exige `updatedAt` — MDR 0002 (como `atestadoEm`)
- Leitura de campo que pode faltar sem erro de avaliação (ex.: `get` com
  valor padrão no mapa) — TDR 0009

## Escopo e instruções de implementação
1. `firestore.rules`:
   - `allow get` passa a valer para o próprio usuário autenticado **ou**
     quando o documento existente tem `linkAtivo == true`, sem exigir
     `request.auth`; documento sem o campo ou com `false` segue negado a
     terceiros;
   - `hasOnly` de `create` e `update` inclui `linkAtivo`;
   - quando a operação escreve `linkAtivo`, ele é `bool`; escrever só
     `linkAtivo` (sem `contagens` e sem `updatedAt`) é aceito, criando ou
     atualizando o documento;
   - comentários no estilo do arquivo explicando a exceção ao isolamento,
     citando MDR 0002 e IDR 0055.
2. `firestore.rules.test.js`: novo `describe` "link do catálogo" cobrindo:
   - sem login, `get` de documento com `linkAtivo: true` → permitido;
   - sem login, `get` com `linkAtivo: false`, sem o campo e de documento
     inexistente → negado;
   - outro usuário autenticado lê documento ligado → permitido; desligado →
     negado;
   - `list` na coleção `users` sem login, mesmo havendo documentos ligados
     → negado;
   - dono grava só `linkAtivo: true` e depois `false`, em documento
     inexistente e em documento com `contagens`/`updatedAt`/`atestadoEm`
     → permitido;
   - `linkAtivo` não booleano → negado; terceiro (autenticado ou não)
     gravando `linkAtivo` no documento de outro → negado.
   Os testes existentes continuam verdes.
3. `docs/modelo-firebase.md`, citando MDR 0002:
   - § Formato do documento: o campo `linkAtivo` no exemplo e na lista de
     regras do formato ("Nada além disso" com quatro campos);
   - § Regras de segurança: `get` do próprio documento **ou** público com
     `linkAtivo == true`; `hasOnly` com quatro campos; `linkAtivo is bool`;
   - § Operações sobre o documento: linhas "Ligar/desligar o link"
     (`setDoc` merge só com `linkAtivo`, sem `updatedAt`) e "Abrir o link"
     (1 leitura, sem login);
   - § Custos e cotas: 1 escrita por ligar ou desligar e 1 leitura por
     abertura do link.

**Fora do escopo**: código do cliente que grava ou lê `linkAtivo`
(Tarefas 0027-0003 e 0027-0004); App Check e mitigação de cota (ADR 0005,
decidido fora); allow-list das chaves.

## Decisões já tomadas (não reabrir)
- Campo `linkAtivo` no próprio `users/{uid}` e `get` público condicionado,
  sem documento espelho — ver
  `docs/model-dr/0002-schema-do-documento-da-colecao.md`
- Link único por conta com o `uid` — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- App Check e mitigações de cota fora por ora — ver
  `docs/adr/0005-persistencia-no-firestore.md`
- Deploy das regras antes do Hosting no merge — ver
  `docs/devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md`

## Arquivos impactados
- `firestore.rules` — modificar
- `firestore.rules.test.js` — modificar
- `docs/modelo-firebase.md` — modificar (§ Formato do documento, § Regras
  de segurança, § Operações sobre o documento, § Custos e cotas)

## Critérios de aceite
- [ ] Sem login, `get` de documento com `linkAtivo: true` é permitido e,
      com `false`, sem o campo ou inexistente, negado (testes)
- [ ] `list` em `users` segue negado sem login (teste)
- [ ] Dono grava só `linkAtivo`, com ou sem documento prévio, e valor não
      booleano é negado (testes)
- [ ] Terceiro não grava `linkAtivo` em documento alheio (teste)
- [ ] Todos os testes anteriores de `firestore.rules.test.js` verdes
- [ ] `docs/modelo-firebase.md` descreve o campo, a regra, as duas
      operações e o custo, citando MDR 0002
