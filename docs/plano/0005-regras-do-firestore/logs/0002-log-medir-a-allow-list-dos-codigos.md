<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0005-0002: medir a allow-list dos 994 códigos

## Data
2026-09-10

## Resumo
Gerada a allow-list dos 994 códigos a partir de `src/data/catalogo.js`
(`figurinhas.map(f => f.codigo)`) e medida contra o emulador do Firestore.

**Resultado: a allow-list não cabe no ruleset.** O ruleset com a cláusula
`contagens.keys().hasOnly([…994 códigos…])` **compila** — 14.692 bytes,
bem abaixo do limite de 256 KB —, mas a **avaliação** estoura o limite de
**1.000 expressões por requisição**. O emulador responde
`Unable to evaluate the expression as the maximum of 1000 expressions to
evaluate has been reached` tanto para a coleção cheia (994 chaves) quanto
para uma gravação com uma única chave forjada — ou seja, não é o número de
chaves do documento que estoura, é a própria cláusula da allow-list, que
somada às demais (3 campos do `hasOnly` de nível 1, 99 literais do
`values().hasOnly([1…99])`, `is map`, `size()`, `updatedAt`, `atestadoEm`)
passa do teto.

Valeu, portanto, o desfecho "não coube" — o segundo dos dois já decididos
no TDR 0009. As chaves seguem limitadas apenas em quantidade
(`contagens.size() <= 994`); `firestore.rules` **não** foi alterado, e não
há teste de "chave fora do catálogo" a acrescentar (sem allow-list, não há
como negar chave fora do catálogo — confirmado: `{ BRA99: 1 }` é aceito).

## Números medidos

| Medida | Valor |
|---|---|
| Códigos gerados do catálogo | 994 |
| Cláusula `keys().hasOnly([…])` (bytes) | 9.399 |
| Ruleset atual, sem allow-list (bytes) | 5.292 |
| Ruleset com a allow-list (bytes) | 14.692 |
| Limite de tamanho do ruleset | 256 KB — **não** é o gargalo |
| Limite de expressões por requisição | 1.000 — **estourado** pela avaliação |

### Comportamento no emulador

- Ruleset com a allow-list, coleção cheia (994 chaves válidas): **negado** por
  `maximum of 1000 expressions to evaluate has been reached`.
- Ruleset com a allow-list, uma chave forjada (`BRA99`): **negado** pela
  mesma mensagem de limite de expressões — a negação veio do estouro, não da
  allow-list; logo, a cláusula não se sustenta nem para o caso mínimo.
- Ruleset atual (sem allow-list), coleção cheia (994 chaves): **aceito** —
  `size() <= 994` segura o formato e a avaliação fica dentro do teto.
- Ruleset atual (sem allow-list), `995` chaves: **negado** por `size() <= 994`.
- Ruleset atual (sem allow-list), chave fora do catálogo (`BRA99`): **aceito**
  — limitação conhecida e registrada de propósito (TDR 0009): chaves só se
  limitam em quantidade, não em conteúdo.

## Decisões tomadas
Nenhuma decisão nova. O desfecho "não coube" é um dos dois já decididos no
TDR 0009 ("se o deploy ou a avaliação esbarrar no limite, ela fica de fora");
a medição apenas apontou qual valeu. O encaminhamento "um teste que compara
a lista das regras com os códigos do catálogo" só se aplicava se a lista
entrasse — como não entrou, **não nasce TDR**. A medição numérica fica
registrada aqui e será refletida em `docs/persistencia.md` pela Tarefa
0005-0004.

## Impedimentos
Nenhum. A medição exigiu `JAVA_HOME` apontado para o JDK 21
(`C:\Users\dffwe\.jdks\temurin-21.0.9`), porque o `java` do `PATH` é o JDK 8
— mesmo contratempo de ambiente já registrado no log da 0005-0001.

## Validação

### `npm run lint`
```
Found 0 warnings and 0 errors.
```

### `npm run test`
```
Test Files  16 passed (16)
     Tests  137 passed (137)
```

### `npm run build`
```
✓ built in 986ms
```

### `npm run test:rules` (JDK 21 via JAVA_HOME)
`firestore.rules` não mudou, então a suíte continua no estado deixado pela
0005-0001: 13 verdes, 2 vermelhos (os dois testes da era do botão que
escrevem `teamName`, recusados de propósito; reescrita é a 0005-0003).

A medição em si rodou com dois testes temporários (não entregues, removidos
ao final), um contra o ruleset com a allow-list e outro contra o ruleset
atual. Saída real relevante do emulador, com a allow-list:

```
PERMISSION_DENIED: Unable to evaluate the expression as the maximum of
1000 expressions to evaluate has been reached. for 'create' @ L45
```

## Arquivos alterados
- `docs/plano/0005-regras-do-firestore/0002-medir-a-allow-list-dos-codigos.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0002 da Fase 5 atualizado
- `docs/plano/0005-regras-do-firestore/logs/0002-log-medir-a-allow-list-dos-codigos.md` — este log

(`firestore.rules` e `firestore.rules.test.js` ficaram **inalterados**: a
lista não coube, então não há cláusula a acrescentar nem teste de chave fora
do catálogo a escrever.)
