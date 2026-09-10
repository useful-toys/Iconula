<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0005-0001]: regras do Firestore para o mapa esparso

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão e § Consequências — o que dá e o que não dá para validar, o teto de 99, a guarda de campo ausente e o limite de abuso que sobra
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — os três campos, `updatedAt` de servidor, `atestadoEm` sem `updatedAt` junto
- `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md` § Decisão — `get` em vez de `read`, `create, update` sem `delete`, deny-by-default sem catch-all
- `docs/persistencia.md` § Formato dos dados — o schema alvo e as regras de formato
- `docs/persistencia.md` § Regras de segurança — o que muda com o produto novo
- `firestore.rules` — o arquivo atual, com `hasOnly(["teamName"])`

## Objetivo
Trocar as regras da era do botão pelas do schema novo, antes de qualquer código
que escreva `contagens`. Ao fim desta fase a produção já aceita o schema novo e
recusa o antigo — e nada no cliente escreve, então a troca é inócua.

## Padrões e convenções aplicáveis
- `allow get`, nunca `read`: `read` abrangeria `list` e faria uma query na
  coleção ser avaliada — `docs/tdr/0008-*` § Decisão
- `create, update` apenas; `delete` e `list` seguem negados —
  `docs/tdr/0008-*` § Decisão e `docs/persistencia.md` § Regras de segurança
- Sem regra catch-all `if false`: deny-by-default já cobre —
  `docs/tdr/0008-*` § Decisão
- **Guarda de campo ausente**: toda cláusula sobre `contagens` sob
  `!("contagens" in request.resource.data) || (…)`, senão a regra erra em vez de
  negar — `docs/tdr/0009-*` § Decisão
- A linguagem de regras **não itera**: nada de regex por chave nem condição por
  valor — só comparação de conjunto — `docs/persistencia.md` § Regras de segurança
- O arquivo mantém o cabeçalho de copyright e o estilo de comentário que explica
  o porquê de cada cláusula — `AGENTS.md` § Convenções e o `firestore.rules` atual

## Escopo e instruções de implementação
1. Reescrever o bloco `match /users/{userId}` para o schema novo:
   - `allow get` como hoje, comparando `request.auth.uid == userId`
   - `allow create, update` exigindo `hasOnly(["contagens", "updatedAt", "atestadoEm"])`
   - `contagens is map`, `contagens.size() <= 994` e
     `contagens.values().hasOnly([1, 2, …, 99])`, tudo sob a guarda de campo ausente
   - `updatedAt == request.time` quando presente
   - `atestadoEm is timestamp` quando presente
   - `delete` e `list` continuam sem regra, portanto negados
2. Aceitar o update que **apaga** o `teamName`: com `deleteField`, o campo não
   está em `request.resource.data`, então o `hasOnly` novo passa. Confirmar isso é
   tarefa dos testes (0005-0003) — aqui, não escrever cláusula especial para o
   `teamName`.
3. A gravação da atestação cria o documento só com `atestadoEm`, sem `contagens` e
   sem `updatedAt`: as regras precisam aceitar esse documento. É exatamente o caso
   que a guarda de campo ausente cobre.
4. Comentar no arquivo, no estilo já existente, por que o teto de 99 existe (é a
   única forma de validar valores) e por que a validação de chaves é limitada.
5. Não mexer em `firebase.json`, workflows ou IAM: o deploy das regras já existe
   e continua igual (TDR 0008).

**Fora do escopo**: a allow-list dos 994 códigos (Tarefa 0005-0002); os testes
(Tarefa 0005-0003); a atualização da documentação (Tarefa 0005-0004); qualquer
código de cliente.

## Decisões já tomadas (não reabrir)
- Mapa esparso com três campos, valores 1–99 — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- Teto de 99 é o que torna os valores validáveis — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`
- `delete` negado: "apagar meus dados" saiu do MVP — ver `docs/persistencia.md` § Regras de segurança
- App Check fica de fora por ora — ver `docs/adr/0007-persistencia-do-time-no-firestore.md`
- O teto de abuso de 1 MiB por conta é limitação conhecida e aceita — ver `docs/tdr/0009-*` § Decisão

## Decisões em aberto nesta tarefa
- Se `updatedAt` é obrigatório em toda escrita de `contagens` — encaminhamento:
  sim, exigir `updatedAt == request.time` sempre que `contagens` for escrito, para
  que o relógio do título nunca fique parado com a coleção mudando; nasce um
  **TDR** se a implementação precisar afrouxar isso

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.
   **Caso concreto previsto aqui**: qualquer necessidade de mudar IAM, workflow
   de deploy ou plano de faturamento para publicar as regras.

## Arquivos impactados
- `firestore.rules` — modificar

## Critérios de aceite
- [ ] `hasOnly` aceita exatamente `contagens`, `updatedAt` e `atestadoEm`
- [ ] `contagens.size() <= 994` e valores validados por `values().hasOnly([1…99])`
- [ ] Toda cláusula sobre `contagens` está sob a guarda de campo ausente
- [ ] Documento só com `atestadoEm` é aceito
- [ ] `delete` e `list` continuam negados, sem regra catch-all
- [ ] `firebase.json`, workflows e IAM não foram alterados
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0005-regras-do-firestore/logs/0001-log-regras-do-mapa-esparso.md` gerado

## Validação
`npm run lint && npm run test && npm run build && npm run test:rules` (exige JDK 21+).
Os casos de teste completos são a Tarefa 0005-0003; aqui basta que a suíte
existente não fique vermelha por erro de sintaxe do ruleset.
