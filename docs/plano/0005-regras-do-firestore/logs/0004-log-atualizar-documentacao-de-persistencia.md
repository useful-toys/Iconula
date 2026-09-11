<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0005-0004: atualizar a documentação de persistência

## Data
2026-09-10

## Resumo
Documentação alinhada ao `firestore.rules` publicado (tarefas 0005-0001 a
0005-0003), incluindo o desfecho da medição da allow-list (não coube).

- **`docs/persistencia.md`**
  - § Formato dos dados: o schema novo passou a **Vigente** e o do botão
    a **Histórico** (títulos trocados); a bullet de tipos deixou de
    afirmar "chaves = códigos do catálogo" e agora diz que as regras
    limitam as chaves só em quantidade (`size() <= 994`), porque a
    allow-list não coube.
  - § Regras de segurança: a seção "O que muda com o produto novo" virou
    "O que está publicado (schema novo)", descrevendo as cláusulas reais:
    `get` (nunca `read`), `hasOnly` dos três campos, `contagens` map com
    `size() <= 994` e `values().hasOnly([1…99])`, `updatedAt == request.time`,
    `atestadoEm is timestamp`, guarda de campo ausente, allow-list **não
    entrou** (estouro de 1.000 expressões) e `delete`/`list` negados sem
    catch-all.
  - § Pronto × falta: "Regras novas (schema, `updatedAt`, `atestadoEm`)"
    saiu de "falta" e entrou em "pronto"; "Revisar/aceitar o ADR 0008
    (redigido)" virou "Aceitar os números do ADR 0008 (debounce, teto de
    espera, timeout)", que continua em "falta" (Fase 7).
- **`docs/firebase.md`**
  - § Regras de segurança: os bullets de resumo deixaram de falar em
    `teamName` e agora descrevem o schema novo (`hasOnly` dos três campos,
    `contagens` map ≤ 994 com valores 1–99, `updatedAt == request.time`,
    `atestadoEm` timestamp).
  - § Deploy das regras: **conferido — continua correto** (deploy no merge,
    sem canal de preview, comando manual idempotente). Nada mudou nesta
    fase.
- **`docs/requisitos.md`**: **nada era necessário** — a § Contagem já diz
  "a contagem vai até 99... o teto não é preferência de produto — é o que
  permite às regras do Firestore validarem os valores" (TDR 0009). O ajuste
  pedido pelo TDR 0009 já estava aplicado.
- **`docs/arquitetura.md`**
  - § Decisões-chave e onde vivem: já apontava para TDR 0008, TDR 0009 e
    ADR 0008 — nenhuma mudança necessária.
  - § Pontos em aberto: o item "Aceite do ADR 0008: redigido... o teto
    por contagem foi removido" estava desatualizado (o ADR está **aceito**
    e o teto voltou a 99). Reescrito para "Aceite dos números do ADR
    0008", deixando explícito que só os números operacionais seguem em
    aberto até a Fase 7.

## Decisões tomadas
Nenhuma decisão nova; nenhum ADR/TDR/IDR criado (o esperado pela tarefa).
A única "decisão" — qual redação usar — é de documentação, derivada
diretamente do `firestore.rules` publicado e do desfecho já medido na
0005-0002.

## Impedimentos
Nenhum.

## Nota: divergências notadas, fora do escopo desta tarefa
- `docs/firebase.md` § Cloud Firestore ainda diz que a coleção tem "um
  único campo `teamName`" e que o Firestore "guarda a preferência de
  bandeira". Isso descreve o **dado** ainda em produção (nada escreve
  `contagens` até a Fase 7); a descrição do dado deve migrar junto com a
  Fase 7, não aqui.
- `docs/arquitetura.md` (abertura e "Camadas no cliente") ainda mencionam
  "o app do botão" e `teams.js` — resíduos da Fase 2, fora do escopo desta
  tarefa de regras.

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
✓ built in 840ms
```

### Conferência documental
Comparado, cláusula a cláusula, o `firestore.rules` do repositório com o
que `docs/persistencia.md` e `docs/firebase.md` afirmam: `allow get`
(uid), `allow create, update` com `hasOnly(["contagens", "updatedAt",
"atestadoEm"])`, `contagens is map` + `size() <= 994` +
`values().hasOnly([1…99])`, `updatedAt == request.time`, `atestadoEm is
timestamp`, sem `delete`/`list` e sem catch-all — tudo descrito nos dois
documentos, incluindo a guarda de campo ausente e o desfecho da
allow-list.

## Arquivos alterados
- `docs/persistencia.md` — formato, regras e tabela Pronto × falta atualizados
- `docs/firebase.md` — § Regras de segurança atualizada (§ Deploy conferida, sem mudança)
- `docs/arquitetura.md` — item "Aceite do ADR 0008" de § Pontos em aberto corrigido
- `docs/plano/0005-regras-do-firestore/0004-atualizar-documentacao-de-persistencia.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0004 da Fase 5 atualizado
- `docs/plano/0005-regras-do-firestore/logs/0004-log-atualizar-documentacao-de-persistencia.md` — este log

(`docs/requisitos.md`, `docs/gcloud.md` e `docs/github.md` inalterados —
nenhum deles exigia mudança.)
