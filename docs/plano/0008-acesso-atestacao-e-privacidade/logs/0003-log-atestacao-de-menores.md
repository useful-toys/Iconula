<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0008-0003: atestação de menores e `atestadoEm`

## Data
2026-09-11

## Resumo
Implementada a exigência de LGPD art. 14 (`requisitos.md` § Acesso): antes de
liberar o catálogo, uma conta sem `atestadoEm` vê um passo explícito de
atestação, uma única vez.

- `src/lib/colecaoRemota.js`: `carregarColecao` passa a devolver
  `atestadoEm` (booleano) no resultado `encontrado`, sem leitura extra —
  mesmo documento que a Tarefa 0007-0002 já lê. Nova função
  `gravarAtestacao(uid)`, que grava só `{ atestadoEm: serverTimestamp() }`
  com `setDoc(..., { merge: true })` — deliberadamente **sem** `updatedAt`
  junto (ADR 0008), por isso não reaproveita `gravarAlteracoes`. Nunca
  lança; resultado discriminado igual às demais funções do módulo.
- `src/components/Atestacao.jsx` (novo): tela com o texto exato de
  `interface.md` § Tela de login e um botão "Confirmar", reaproveitando o
  cartão e os tokens de `TelaDeLogin.css` (Tarefa 0008-0002) — sem layout
  novo, só uma classe nova (`.tela-de-login__confirmar`, dourado — o branco
  segue exclusivo do botão do Google, IDR 0022).
- `src/App.jsx`: novo estado `precisaAtestar` (`false` no início, como
  `contagens`), corrigido pela carga da coleção assim que ela resolve —
  `encontrado` sem `atestadoEm` ou `vazio` (documento inexistente = nunca
  atestou) → `true`; `encontrado` com `atestadoEm`, `erro` ou
  `indisponivel` → `false` (a política de erro visível do ADR 0008 não
  também trava a guarda de atestação). Um novo ramo de retorno mostra
  `<Atestacao />` quando `precisaAtestar` é verdadeiro, entre a tela de
  login e a tela principal. `handleConfirmarAtestacao` chama
  `gravarAtestacao`, emite aviso de falha se não for sucesso, e **sempre**
  libera o app (`setPrecisaAtestar(false)`) — a falha nunca retém.

## Decisões tomadas
**IDR 0036 — Atestação como passo explícito, e falha libera o app**
(`docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md`), fechando
as duas pendências que a própria tarefa já encaminhava (passos 1 e 5 do
Escopo):
1. Passo explícito, uma única vez por conta — o clique de login não é o
   clique de atestação; o protótipo (que a exibe a cada login) é só
   referência visual.
2. Falha ao gravar `atestadoEm` libera o app assim mesmo, com aviso; sem
   fila de retentativa própria — o campo ausente no documento já é o sinal
   de que falta atestar, então a próxima vez que a conta logar sem
   `atestadoEm` o passo aparece de novo, sem custo extra de leitura.

Decisão de nível 2 (implementação conservadora, registrada aqui e no IDR
acima, não uma decisão de arquitetura à parte): o Escopo da tarefa permitia
duas ordens de implementação — "a carga acontece antes da decisão" (bloquear
a tela até a carga da coleção resolver) ou "a decisão usa o que ela trouxe"
(reagir ao resultado sem bloquear). A primeira opção, tentada inicialmente,
quebrava a proteção de corrida já testada e protegida da Tarefa 0007-0002
("ajuste feito durante a leitura não é sobrescrito pela resposta do
servidor") — aquele teste dispara um ajuste no catálogo **enquanto a carga
ainda está pendente**, o que exige o catálogo já montado nesse instante.
Bloquear a tela até a carga resolver contrariaria "não reabra decisões já
tomadas" (a Tarefa 0007-0002 decidiu carregamento otimista). Escolhida a
segunda opção: `precisaAtestar` nasce `false` (otimista) e a carga o corrige
assim que chega — a mesma política já usada para `contagens`. A consequência
(uma conta nova pode, em teoria, ver o catálogo por um instante antes de a
carga confirmar a falta de atestação) está documentada no IDR 0036 §
Consequências.

## Impedimentos
Nenhum nível 3. O nível 2 acima está registrado e resolvido pela premissa
mais conservadora que não reabre uma decisão já tomada.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 25 arquivos de teste, 239 testes, todos passando — inclui
  `src/lib/colecaoRemota.test.js` (3 casos novos: `atestadoEm` no resultado
  de carga, e os 3 desfechos de `gravarAtestacao`), `Atestacao.test.jsx`
  (3 casos) e o novo `App.atestacao.test.jsx` (4 casos de integração: conta
  sem/com `atestadoEm`, confirmar libera, falha libera com aviso e sem mover
  o relógio). `App.gravacao.test.jsx` e `App.persistencia.test.jsx`
  atualizados para continuarem exercitando gravação/carga sem a atestação
  interferir (contas já atestadas nos mocks, exceto o teste do documento
  vazio, que passou a clicar "Confirmar" antes de checar o travessão — o
  cenário real de uma conta nova).
- `vite build`: build de produção concluído com sucesso (CSS de 11,10 kB
  para 11,33 kB; aviso pré-existente sobre chunk grande, não relacionado a
  esta tarefa).

**Não realizado**: a verificação em preview deploy real com uma conta nova
(conferir no console do Firebase que o documento ganha `atestadoEm` e nenhum
`updatedAt` criado por ele) — combinado com o usuário adiar o PR da Fase 8
para o fim da fase. Repetir essa checagem no preview deploy antes de
mesclar, junto da checagem equivalente pendente da Tarefa 0008-0002.

## Arquivos alterados
- `src/lib/colecaoRemota.js` — `atestadoEm` no resultado de carga; nova função `gravarAtestacao`
- `src/lib/colecaoRemota.test.js` — testes dos dois pontos acima
- `src/components/Atestacao.jsx` — criado
- `src/components/Atestacao.test.jsx` — criado
- `src/components/TelaDeLogin.css` — nova classe `.tela-de-login__confirmar`, reaproveitada por `Atestacao.jsx`
- `src/App.jsx` — estado `precisaAtestar`, decisão na carga, `handleConfirmarAtestacao`, novo ramo de retorno
- `src/App.gravacao.test.jsx` — mocks de carga passam a incluir `atestadoEm: true` (consequência direta e necessária, não listada nos arquivos impactados)
- `src/App.persistencia.test.jsx` — idem, e o teste do documento vazio passa a clicar "Confirmar" primeiro (idem)
- `src/App.atestacao.test.jsx` — criado (consequência direta do item 7 do Escopo, não listado nos arquivos impactados)
- `docs/idr/0036-atestacao-passo-explicito-e-falha-de-gravacao.md` — novo IDR
- `docs/plano/0008-acesso-atestacao-e-privacidade/0003-atestacao-de-menores.md` — status e critérios atualizados
- `docs/plano/README.md` — status da tarefa 0008-0003 atualizado
- `docs/plano/0008-acesso-atestacao-e-privacidade/logs/0003-log-atestacao-de-menores.md` — este log
