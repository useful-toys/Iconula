<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0005-0001: regras do Firestore para o mapa esparso

## Data
2026-09-10

## Resumo
Reescrito o bloco `match /users/{userId}` de `firestore.rules` para o schema
novo (ADR 0008), substituindo o `hasOnly(["teamName"])` da era do botão:

- `allow get` inalterado (`request.auth != null && request.auth.uid == userId`),
  seguindo o TDR 0008 (`get`, nunca `read`).
- `allow create, update` agora exige
  `request.resource.data.keys().hasOnly(["contagens", "updatedAt", "atestadoEm"])`.
- `contagens` validado sob a guarda de campo ausente do TDR 0009
  (`!("contagens" in request.resource.data) || (…)`): `is map`,
  `size() <= 994` e `values().hasOnly([1, …, 99])`.
- `updatedAt == request.time` quando presente; `atestadoEm is timestamp`
  quando presente — cada um também sob a própria guarda de campo ausente.
- `delete` e `list` continuam sem regra e portanto negados; não há regra
  catch-all `if false` (deny-by-default, TDR 0008).

Não há cláusula especial para o `teamName`: um update com `deleteField`
remove o campo do documento, e o `hasOnly` novo passa porque ele já não
está em `request.resource.data` (confirmado por teste temporário; os casos
oficiais são a Tarefa 0005-0003).

Acrescentados comentários no estilo já existente explicando por que o teto
de 99 existe (é a única forma de validar valores numa linguagem que não
itera) e por que a validação de chaves é limitada (sem laço nem regex por
chave — só `size() <= 994`; a allow-list dos 994 códigos fica para a
Tarefa 0005-0002).

## Decisões tomadas
- **`updatedAt` obrigatório em toda escrita de `contagens`** — seguido o
  encaminhamento já registrado na seção "Decisões em aberto" da própria
  tarefa: exigir `updatedAt == request.time` sempre que `contagens` for
  escrito, para o relógio do título nunca ficar parado com a coleção
  mudando. Expresso na cláusula
  `&& "updatedAt" in request.resource.data` dentro da guarda de `contagens`,
  combinada com `updatedAt == request.time` quando presente. Como o
  encaminhamento foi seguido (e não afrouxado), **não nasce TDR** — a
  própria tarefa só prevê TDR "se a implementação precisar afrouxar isso".

Nenhum ADR/TDR/IDR novo foi necessário: as decisões de fundo já estão no
ADR 0008 e nos TDR 0008/0009.

## Impedimentos
Nenhum de nível 2 ou 3. Dois contratempos de ambiente, contornados sem
mudança de repositório:

1. O `java` no `PATH` é o JDK 8, anterior ao 21 exigido pelo emulador
   (`AGENTS.md` § Como rodar já avisa). A validação de regras rodou com o
   `JAVA_HOME` apontado para `C:\Users\dffwe\.jdks\temurin-21.0.9`.
2. `@firebase/rules-unit-testing` constava no `package.json` e no
   `package-lock.json`, mas não estava instalado em `node_modules`; um
   `npm install` trouxe o pacote localmente. O `package-lock.json` foi
   reajustado pelo `npm install` (campo `name`), e esse ajuste foi
   revertido por estar fora do escopo desta tarefa.

## Validação

### `npm run lint`
```
Found 0 warnings and 0 errors.
Finished in 36ms on 39 files with 105 rules using 4 threads.
```

### `npm run test`
```
Test Files  16 passed (16)
     Tests  137 passed (137)
```

### `npm run build`
```
✓ 106 modules transformed.
✓ built in 986ms
```

### `npm run test:rules` (JDK 21 via JAVA_HOME)
```
Test Files  1 failed (1)
     Tests  2 failed | 13 passed (15)
```

Os dois testes vermelhos são exatamente os da era do botão que a mudança
torna obsoletos — `o dono grava o próprio time` e
`o dono atualiza o próprio time`, que escrevem `teamName` e agora são
recusados pelo `hasOnly` novo. Não é erro de sintaxe: o ruleset carrega e
avalia (a negação é `PERMISSION_DENIED`, e os demais 13 casos — isolamento
entre usuários, `list` negado, `delete` negado, caminhos fora de
`users/{uid}` — passam). A reescrita desses casos é a Tarefa 0005-0003.

Além disso, para garantir a correção do ruleset antes dos testes oficiais,
foi exercitado um teste temporário (removido ao final, não entregue) que
confirmou: criar com `contagens` + `updatedAt` passa; documento só com
`atestadoEm` passa; update apagando `teamName` (`deleteField`) passa;
`contagens` sem `updatedAt`, valor 0, 100, string, `contagens` que não é
map, campo extra, mais de 994 chaves e `teamName` na escrita — todos
negados. 11/11 verdes.

## Arquivos alterados
- `firestore.rules` — bloco `match /users/{userId}` reescrito para o schema novo
- `docs/plano/0005-regras-do-firestore/0001-regras-do-mapa-esparso.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0001 da Fase 5 atualizado
- `docs/plano/0005-regras-do-firestore/logs/0001-log-regras-do-mapa-esparso.md` — este log
