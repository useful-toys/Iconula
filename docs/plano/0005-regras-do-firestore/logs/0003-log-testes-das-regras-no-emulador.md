<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0005-0003: testes das regras no emulador

## Data
2026-09-10

## Resumo
Reescrito `firestore.rules.test.js` para o schema novo (mapa esparso do
ADR 0008), substituindo a suíte da era do botão. A suíte agora tem **23
testes, todos verdes** no `npm run test:rules`, cobrindo:

- **Isolamento** (preservado): dono lê o próprio documento; outro uid
  negado (leitura e gravação); anônimo negado (leitura e gravação);
  `list` da coleção negado; `delete` do próprio documento negado.
- **Valores**: extremos `1` e `99` aceitos; `0`, negativo, `100`,
  não-inteiro (`1.5`) e string negados.
- **Campos e timestamps**: campo extra negado; `updatedAt` forjado
  (`Timestamp.fromMillis(0)`) negado; `contagens` sem `updatedAt` negado
  (o `updatedAt` obrigatório da 0005-0001); documento só com `atestadoEm`
  aceito.
- **Migração do `teamName`**: update que grava `contagens`/`updatedAt` e
  apaga `teamName` com `deleteField` é **aceito**; o que grava
  `contagens` e **mantém** `teamName` é **negado**.
- **Limite do mapa**: 994 chaves aceito, 995 negado.
- **Caminhos não previstos**: escrita/leitura fora de `users/{uid}` e
  escrita em subcoleção negadas.

`firestore.rules` **não** precisou mudar: nenhum teste revelou defeito na
regra (o único arquivo alterado é o de testes).

## Decisões tomadas
Nenhuma decisão nova; nenhum ADR/TDR/IDR criado.

- **Testes do schema antigo: apagados** — seguido o encaminhamento da
  própria tarefa ("apagados; o schema antigo deixa de ser aceito, e um
  teste que afirma o contrário passaria a mentir"). Os testes de
  `teamName` (grava/atualiza o time, string vazia, >64, etc.) saíram; o
  `teamName` só permanece nos dois casos de **migração**, que afirmam
  exatamente o comportamento novo.
- **`chave fora do catálogo` sem teste** — a allow-list não entrou
  (Tarefa 0005-0002: a avaliação estoura o limite de 1.000 expressões),
  então não há como negar chave fora do catálogo; chaves seguem limitadas
  só em quantidade. Registrado aqui, não silenciado.
- **`contagens` sem `updatedAt`** ganhou um teste próprio — não está na
  lista literal do TDR 0009, mas é consequência direta da decisão da
  0005-0001 (`updatedAt` obrigatório sempre que `contagens` é escrito).

## Impedimentos
Nenhum. A validação exigiu `JAVA_HOME` apontado para o JDK 21
(`C:\Users\dffwe\.jdks\temurin-21.0.9`) porque o `java` do `PATH` é o
JDK 8 — mesmo contratempo já registrado nos logs da 0005-0001/0002.

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
✓ built in 1.19s
```

### `npm run test:rules` (JDK 21 via JAVA_HOME)
```
 RUN  v5.0.0 C:/git/Iconula

 ✓ firestore.rules.test.js (23 tests) 6338ms
   ✓ firestore.rules — isolamento entre usuários (7)
   ✓ firestore.rules — validação de valores nas contagens (6)
   ✓ firestore.rules — validação de campos e timestamps (4)
   ✓ firestore.rules — migração do teamName (2)
   ✓ firestore.rules — limite do mapa (2)
   ✓ firestore.rules — caminhos não previstos (2)

 Test Files  1 passed (1)
      Tests  23 passed (23)

 ✓ Script exited successfully (code 0)
```

## Arquivos alterados
- `firestore.rules.test.js` — suíte reescrita para o schema novo
- `docs/plano/0005-regras-do-firestore/0003-testes-das-regras-no-emulador.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0003 da Fase 5 atualizado
- `docs/plano/0005-regras-do-firestore/logs/0003-log-testes-das-regras-no-emulador.md` — este log

(`firestore.rules` inalterado — nenhum defeito revelado pelos testes.)
