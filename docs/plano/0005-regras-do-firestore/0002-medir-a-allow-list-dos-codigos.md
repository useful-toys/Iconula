<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0005-0002]: medir a allow-list dos 994 códigos

## Status
Concluída

## Documentos de referência (ler antes de implementar)
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Decisão — "a allow-list entra se couber": gerar, medir o ruleset e exercitar no emulador; os dois desfechos já estão decididos
- `docs/tdr/0009-validacao-do-mapa-nas-regras.md` § Consequências — a medição é tarefa do PR das regras, não pendência de desenho
- `docs/adr/0008-schema-da-colecao-mapa-esparso.md` § Consequências — a allow-list entra "se couber no orçamento de expressões"
- `docs/persistencia.md` § Regras de segurança — a linguagem não itera; só comparação de conjunto contra listas escritas à mão
- `src/data/catalogo.js` — a fonte dos 994 códigos

## Objetivo
Descobrir empiricamente se a lista dos 994 códigos cabe no ruleset e, com o
resultado, fechar a validação de chaves: se couber, `contagens.keys().hasOnly([…])`
entra; se não couber, as chaves seguem limitadas só em quantidade. Os dois
desfechos já foram decididos — esta tarefa apenas mede e registra qual valeu.

## Padrões e convenções aplicáveis
- A allow-list é gerada a partir do catálogo, nunca digitada à mão —
  `docs/tdr/0009-*` § Decisão
- Se o ruleset não couber, ficar sem ela é o desfecho já aceito: **não** inventar
  terceira via (subcoleção está descartada por custo de cota) —
  `docs/tdr/0009-*` e `docs/adr/0008-*`
- A limitação que sobra — abuso via nomes de chave, teto de 1 MiB por conta — é
  conhecida e registrada de propósito; não tentar fechá-la aqui —
  `docs/tdr/0009-*` § Decisão
- Se um script de geração for criado, ele abre com o cabeçalho de copyright e
  não vira dependência do build — `AGENTS.md` § Convenções
- A medição real vai para o log da tarefa, com números — `docs/plano/README.md`

## Escopo e instruções de implementação
1. Gerar a lista dos 994 códigos a partir de `src/data/catalogo.js` e produzir a
   cláusula `contagens.keys().hasOnly([...])` correspondente.
2. Medir: tamanho do arquivo de regras resultante e comportamento do deploy e da
   avaliação no emulador. Os limites do Firestore a observar são o tamanho do
   ruleset e o custo de avaliação por requisição.
3. Exercitar no emulador com um documento de coleção cheia (994 chaves) e com uma
   chave forjada fora do catálogo, para confirmar que a cláusula de fato nega.
4. Decidir pelo resultado da medição:
   - **coube**: a cláusula entra no `firestore.rules`, e a lista fica gerada e
     versionada junto (com um comentário dizendo de onde ela sai)
   - **não coube**: a cláusula fica de fora; as chaves seguem limitadas por
     `size() <= 994`, e o log registra os números que motivaram
5. Registrar a medição — números, não impressões — no log da tarefa, e o desfecho
   em `docs/persistencia.md` (Tarefa 0005-0004).
6. Se a lista entrar, deixar explícito como regenerá-la quando o catálogo mudar —
   um catálogo alterado sem a lista regenerada quebraria a gravação em produção.

**Fora do escopo**: mudar o schema; adotar subcoleção; ativar App Check; qualquer
alteração no cliente.

## Decisões já tomadas (não reabrir)
- A allow-list entra se couber, e fica de fora se não couber — ver `docs/tdr/0009-validacao-do-mapa-nas-regras.md`
- A subcoleção foi descartada por custo de cota — ver `docs/adr/0008-schema-da-colecao-mapa-esparso.md`
- O teto real de abuso é 1 MiB por conta; App Check é o gatilho de revisão — ver `docs/tdr/0009-*` e `docs/adr/0007-*`

## Decisões em aberto nesta tarefa
- Qual dos dois desfechos vale — resolvido pela medição, não por preferência; o
  resultado é registrado no log e refletido em `docs/persistencia.md`
- Se a lista entrar, como mantê-la em sincronia com o catálogo — encaminhamento:
  um teste que compara a lista das regras com os códigos de `src/data/catalogo.js`
  e falha quando divergirem; nasce um **TDR**

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
- `firestore.rules` — modificar (só se a lista couber)
- `firestore.rules.test.js` — modificar (caso de chave fora do catálogo)
- `scripts/gerar-allow-list.js` — criar (opcional, se a geração for automatizada)

## Critérios de aceite
- [ ] A lista foi gerada a partir do catálogo, não digitada
- [ ] A medição foi feita contra o emulador e os números estão no log
- [ ] O desfecho escolhido é o que a medição indicou, entre os dois já decididos
- [ ] Se a lista entrou: chave fora do catálogo é negada, comprovado por teste
- [ ] Se a lista entrou: existe forma de detectar divergência entre a lista e o catálogo
- [ ] Se a lista não entrou: o log explica com números por que não coube
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas
- [ ] `docs/plano/0005-regras-do-firestore/logs/0002-log-medir-a-allow-list-dos-codigos.md` gerado

## Validação
`npm run lint && npm run test && npm run build && npm run test:rules` (exige JDK 21+).
No log, incluir a saída real do emulador e o tamanho medido do ruleset.
