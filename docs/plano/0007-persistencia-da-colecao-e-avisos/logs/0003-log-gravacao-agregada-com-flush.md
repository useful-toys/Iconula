<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0007-0003: gravação agregada com flush garantido

## Data
2026-09-11

## Resumo
Os ajustes de contagem passam a chegar ao Firestore sozinhos: uma escrita por
agregação (debounce de ~2s, teto de ~10s em rajada contínua), com as chaves
alteradas e `deleteField` para as zeradas, e garantia de flush ao fechar a
página, ao ocultar a aba e antes de sair da conta.

- `src/lib/gravacaoAgregada.js` — criado. Módulo sem React: acumula o valor
  absoluto atual de cada chave alterada num mapa, agenda uma escrita com
  debounce de 2s renovado a cada ajuste e um teto de 10s contado do primeiro
  ajuste da rajada (armado uma vez, cancelado só quando a escrita acontece).
  Expõe `registrarAjuste(uid, codigo, valor)`, `flush()` (grava imediatamente,
  cancelando os temporizadores — devolve a promise da gravação, para quem
  precisa esperar antes de continuar) e `temPendencia()` (só para teste). A
  função de gravação é injetada (`gravar`), o que manteve o módulo testável
  com temporizador falso sem tocar o SDK do Firestore. Em falha, as chaves
  voltam para a fila em vez de se perderem — sem política de retentativa ou
  aviso visível própria, que ficam para a Tarefa 0007-0005 (fora do escopo
  desta).
- `src/lib/colecaoRemota.js` — acrescido `gravarAlteracoes(uid, alteracoes)`.
  Usa `setDoc(ref, { contagens, updatedAt: serverTimestamp() }, { merge: true
  })`, não `updateDoc` — decisão registrada no TDR 0017 (ver abaixo). Cada
  chave do mapa `alteracoes` vira valor absoluto (`> 0`) ou `deleteField()`
  (`0`). Nunca lança: devolve resultado discriminado
  `sucesso | erro | indisponivel`, como `carregarColecao`.
- `src/App.jsx` — uma instância de `gravacaoAgregada` por sessão de App,
  criada com o mesmo padrão de inicializador preguiçoso do `useState` já usado
  para as preferências de vista (evita o aviso de lint sobre acessar
  `ref.current` durante a renderização, tentado primeiro). `handleAjustar`
  chama `registrarAjuste` dentro do próprio updater do `setContagens` — seguro
  porque, mesmo com o StrictMode invocando o updater duas vezes em
  desenvolvimento, as duas chamadas recebem o mesmo `anterior` e produzem o
  mesmo `codigo`/`valor`, tornando a segunda chamada um no-op idêntico à
  primeira. Um efeito novo liga `pagehide` (sempre) e `visibilitychange`
  (só ao ficar `hidden`) ao `flush()`. `signOut` foi trocado por
  `handleSignOut`, que `await`a o `flush()` antes de chamar `signOut(auth)` —
  a gravação pendente termina (ou falha) com o token ainda válido, antes do
  logout.
- `src/lib/colecaoRemota.test.js`, `src/lib/gravacaoAgregada.test.js` (criado)
  — cobrem exatamente os casos do passo 8 da tarefa: rajada gera uma escrita;
  atividade contínua grava no teto; escrita só com as chaves alteradas;
  `deleteField` para a chave zerada; flush imediato; falha devolve a chave
  para a fila sem perdê-la.
- `src/App.gravacao.test.jsx` (criado) — integração em `App.jsx`: debounce e
  teto observados através de `onAjustar`, `pagehide` e `visibilitychange`
  disparando a gravação, sucesso movendo o relógio e emitindo "Coleção
  gravada", e a ordem `flush → signOut` (gravação represada por uma promise
  controlada; `signOut` só é chamado depois de ela resolver).
- `src/App.test.jsx`, `src/App.persistencia.test.jsx` — mocks de
  `colecaoRemota.js` atualizados com `gravarAlteracoes`, exigido porque
  `App.jsx` agora importa essa função (mesmo sem os testes de auth/carga
  exercitarem gravação, o módulo mockado precisa expor todos os nomes
  importados).

## Decisões tomadas
- **TDR 0017** — duas lacunas de implementação que o ADR 0008 não resolvia ao
  pé da letra:
  1. `setDoc(..., { merge: true })` em vez de `updateDoc`: a mesma chamada
     cria o documento na primeira gravação de uma conta nova (que ainda não
     tem `users/{uid}`) e mescla o mapa nas gravações seguintes, sem leitura
     extra para descobrir se o documento já existe. `deleteField()` funciona
     igual dentro do mapa aninhado em `update()` e em `set(merge:true)`.
  2. `atualizadoEm` do resultado de sucesso é `new Date()` (instante local no
     momento em que a escrita é confirmada), não uma leitura do carimbo real
     do servidor — ler de volta para pegar o `updatedAt` exato reintroduziria
     a leitura extra por gravação que a RNF de economia de requisições
     proíbe.
- **TDR 0014 (revisitado)** — Context × prop-drilling: mantido. A gravação
  agregada é criada e usada inteiramente dentro de `App.jsx`; nenhum
  componente novo passou a consumir ou modificar a coleção, e a profundidade
  de prop-drilling não mudou. Registrado como revisão no próprio TDR 0014,
  como a tarefa 0002-0004 já previa.

## Impedimentos
Nenhum nível 2 ou 3. As duas lacunas acima eram ambiguidades de nível 1,
resolvidas pelo TDR 0017.

## Números do ADR 0008 (debounce, teto)
Aceitos como estão: debounce de 2000ms, teto de 10000ms — a "forma" (debounce
+ teto) não mudou, só os valores continuam os mesmos, então não nasce ADR
novo (README § "Onde cada pendência foi alocada"). **Medição em uso real**
não foi possível neste ambiente: não há usuários nem deploy de produção
disponíveis durante a execução automatizada desta tarefa (mesmo limite já
registrado no log da Tarefa 0007-0002 para a verificação em preview deploy).
Os números seguem como ponto de partida aceito, a confirmar com uso real após
o merge — se mostrarem desconfortáveis (gravação percebida como lenta ou
rápida demais), ajustá-los é mudança de valor, não de forma, e não exige novo
ADR.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: `Found 0 warnings and 0 errors.`
- `vitest run`: **22 arquivos de teste, 202 testes, todos passando** —
  incluindo os 9 novos de `src/lib/gravacaoAgregada.test.js`, os 6 novos de
  `gravarAlteracoes` em `src/lib/colecaoRemota.test.js` e os 8 de
  `src/App.gravacao.test.jsx` (debounce, teto, chaves alteradas, `pagehide`,
  `visibilitychange` — hidden e visible —, sucesso mexe no relógio/aviso,
  ordem flush→signOut).
- `vite build`: bundle principal `index-wfeG1Wa3.js` (393,42 KB) e o chunk sob
  demanda do Firestore `index.esm-mnfsRb0P.js` (505,90 KB, gzip 148,77 KB) —
  o Firestore continua fora do bundle principal; o aviso de chunk > 500 KB é
  do chunk sob demanda, como no log da Tarefa 0007-0002.

### Verificação visual / preview
A verificação em preview deploy real (logar, ajustar dez figurinhas em
rajada, conferir na aba Network que houve **uma** escrita, nenhuma violação
de CSP, e que o valor sobrevive a fechar/reabrir a aba com ajuste pendente)
não pôde ser executada neste ambiente automatizado, pela mesma razão do log
da Tarefa 0007-0002 (sem deploy nem navegador reais disponíveis aqui). A
única escrita por rajada, o teto sem esperar a rajada acabar, as chaves
alteradas com `deleteField` e a ordem flush-antes-do-signOut estão cobertas
por teste com temporizador falso, que exercita exatamente esses
comportamentos.

## Arquivos alterados
- `src/lib/gravacaoAgregada.js` — criar (acúmulo, debounce, teto, flush)
- `src/lib/gravacaoAgregada.test.js` — criar
- `src/lib/colecaoRemota.js` — acrescentar `gravarAlteracoes`
- `src/lib/colecaoRemota.test.js` — acrescentar testes de `gravarAlteracoes`
- `src/App.jsx` — instância de gravação agregada, `handleAjustar` registra
  ajustes, `pagehide`/`visibilitychange` fazem flush, `handleSignOut` aguarda
  o flush antes do `signOut`
- `src/App.gravacao.test.jsx` — criar
- `src/App.test.jsx` — mock de `colecaoRemota` acrescido de `gravarAlteracoes`
- `src/App.persistencia.test.jsx` — idem, mais valor padrão de sucesso
- `docs/tdr/0017-escrita-por-setdoc-merge-e-carimbo-local-pos-gravacao.md` — criar
- `docs/tdr/0014-estado-da-colecao-sem-context.md` — revisão (mantido)
- `docs/plano/0007-persistencia-da-colecao-e-avisos/0003-gravacao-agregada-com-flush.md` — status `Concluída`
- `docs/plano/README.md` — status da tarefa 0003 atualizado
- `docs/plano/0007-persistencia-da-colecao-e-avisos/logs/0003-log-gravacao-agregada-com-flush.md` — este log
