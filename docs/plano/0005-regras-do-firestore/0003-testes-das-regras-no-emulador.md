<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0005-0003]: testes das regras no emulador

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Consequências — a lista dos casos a cobrir: valor 0, negativo, 100, não-inteiro, string; chave fora do catálogo; campo extra; `updatedAt` forjado; documento só com `atestadoEm`; acesso cruzado
- `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md` § Decisão — projeto `demo-iconula`, config separada, `npm run test:rules` idêntico local e no CI
- `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md` § Consequências — o emulador roda na JVM e exige Java; regras não têm canal de preview
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Decisão — a migração do `teamName` por `deleteField`
- `firestore.rules.test.js` — a suíte atual, escrita para o schema do botão

## Objetivo
Transformar as regras novas em garantia executável: uma suíte que falha quando o
isolamento ou a validação do schema regride. Sem isso, "as regras estão certas" é
afirmação, não fato — e uma regressão só apareceria em produção.

## Padrões e convenções aplicáveis
- Projeto `demo-iconula`: o prefixo `demo-` faz o emulador rodar offline, sem
  credencial, e por isso a suíte roda no `ci.yml`, que vale até para PR de fork —
  `docs/tdr/0008-*` § Decisão
- Os testes de regras ficam em `**/*.rules.test.js`, excluídos do `npm test`
  normal, com config e script próprios — `docs/tdr/0008-*` § Decisão
- O isolamento entre usuários é testado explicitamente: outro uid negado, anônimo
  negado, `list` negado, `delete` negado — `docs/tdr/0008-*` § Decisão
- Um único script `npm run test:rules`, idêntico local e no CI — nada de caminho
  que só funcione num dos dois — `docs/tdr/0008-*` § Decisão
- Arquivo novo abre com `// Copyright (c) 2026 Daniel Felix Ferber` —
  `AGENTS.md` § Convenções

## Escopo e instruções de implementação
1. Reescrever `firestore.rules.test.js` para o schema novo, preservando os testes
   de isolamento que continuam válidos (dono lê o próprio; outro uid negado;
   anônimo negado; `list` negado; `delete` negado).
2. Cobrir os casos enumerados pelo TDR 0009:
   - valores recusados: `0`, negativo, `100`, não-inteiro, string
   - valor aceito nos extremos: `1` e `99`
   - chave fora do catálogo (só se a allow-list tiver entrado na Tarefa 0005-0002)
   - campo extra além dos três
   - `updatedAt` forjado (diferente de `request.time`)
   - documento criado só com `atestadoEm`, sem `contagens`
   - acesso cruzado entre usuários
3. Acrescentar o caso da **migração**: documento existente com `teamName`, e um
   update que grava `contagens`/`updatedAt` e apaga `teamName` com `deleteField` —
   precisa ser **aceito**. Um update que grave `contagens` e **mantenha**
   `teamName` precisa ser **negado**.
4. Cobrir o mapa no limite: 994 chaves aceito, 995 negado.
5. Manter o teste rodando no `ci.yml` como já roda; não alterar o workflow.
6. Se algum caso do TDR 0009 não for expressável no emulador, registrar no log
   qual e por quê — não silenciar.

**Fora do escopo**: alterar as regras para fazer um teste passar sem antes
entender se o teste é que está errado; mexer em workflows; código de cliente.

## Decisões já tomadas (não reabrir)
- Os casos a cobrir estão enumerados no TDR 0009 — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Consequências
- Projeto `demo-iconula` e config separada — ver `docs/tdr/0008-deploy-e-teste-das-regras-do-firestore.md`
- A migração do `teamName` acontece pela primeira gravação do schema novo — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- Regras não têm canal de preview: um PR roda o cliente novo contra as regras antigas — ver `docs/tdr/0008-*` § Consequências

## Decisões em aberto nesta tarefa
- Se os testes do schema antigo são apagados ou mantidos como histórico —
  encaminhamento: apagados; o schema antigo deixa de ser aceito, e um teste que
  afirma o contrário passaria a mentir; registrar no log

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

## Arquivos impactados
- `firestore.rules.test.js` — modificar
- `firestore.rules` — modificar (só se um teste revelar defeito na regra)

## Critérios de aceite
- [ ] Todos os casos do TDR 0009 § Consequências têm teste
- [ ] `1` e `99` são aceitos; `0`, negativo, `100`, não-inteiro e string são negados
- [ ] Documento só com `atestadoEm` é aceito; campo extra é negado
- [ ] O update que apaga `teamName` é aceito; o que o mantém é negado
- [ ] 994 chaves aceito, 995 negado
- [ ] Isolamento: outro uid, anônimo, `list` e `delete` negados
- [ ] `npm run test:rules` passa local e no CI, sem caminho divergente
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0005-regras-do-firestore/logs/0003-log-testes-das-regras-no-emulador.md` gerado

## Validação
`npm run lint && npm run test && npm run build && npm run test:rules` (exige JDK 21+).
O log traz a saída real do `npm run test:rules`, não um resumo.
