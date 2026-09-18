<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0027: Autorização e ordem da exclusão de dados

## Status

Aceito — implementação na Fase 0031, Tarefas 0031-0001, 0031-0002 e
0031-0003.

## Contexto

- `firestore.rules` não tem regra de `delete`: a operação é negada por
  padrão, com o comentário "não é operação que o app faça". O
  [MDR 0002](../model-dr/0002-schema-do-documento-da-colecao.md) e
  `docs/modelo-firebase.md` registram que a exclusão voltaria exigindo
  "re-autenticação e autorização nova nas regras".
- Apagar a coleção não basta para o art. 18, VI: nome, e-mail e foto
  vivem na conta do Firebase Auth, não no Firestore.
- `deleteUser` falha com `auth/requires-recent-login` quando o login não
  é recente, e o momento em que isso acontece não é previsível pelo
  cliente.
- A gravação agregada ([IDR 0003](../idr/0003-gravacao-agrega-ajustes.md))
  mantém alterações em fila, com debounce e flush em `pagehide` — uma
  gravação pendente recria o documento depois de apagado.
- Depois do `signOut` ou do `deleteUser` o ID token some e as regras
  negam qualquer escrita (o mesmo motivo do
  [IDR 0038](../idr/0038-sair-da-conta-aborta-se-o-flush-falhar.md)).
- `apagarColecao` (apagar `users/{uid}`) não exige re-login: só um token
  válido. Re-login só é exigido pelo `deleteUser` quando o login é antigo
  (`auth/requires-recent-login`).

## Decisão

- **Regra**: `allow delete: if request.auth != null && request.auth.uid
  == userId` — só o dono, sem validar formato; apagar não tem conteúdo a
  validar. O link do catálogo ativo libera `get`, nunca `delete`.
- **Ordem da exclusão**, fixa:
  1. `descartarPendencias()` na gravação agregada;
  2. apagar `users/{uid}` — sem popup, só um token válido;
  3. apagar a conta do Firebase Auth;
  4. reautenticar por popup **somente se** `deleteUser` devolver
     `auth/requires-recent-login`, e então tentar `deleteUser` de novo.
- **Desistência**: o popup só existe depois de o documento já ter saído;
  fechar/cancelar (`auth/popup-closed-by-user`,
  `auth/cancelled-popup-request`) vira o caso de "coleção apagada, conta
  permanece" — aviso dourado e `signOut`, não mais "cancela tudo sem
  apagar".
- **Falhas parciais**: erro ao apagar o documento aborta antes de tocar
  a conta (falha, `tipo: 'apagar'`, sem reautenticação); erro final ao
  apagar a conta (direto, popup fechado, falha na reautenticação ou no
  retry), com o documento já apagado, emite aviso dourado dizendo que a
  coleção foi apagada e a conta de login permanece, e faz `signOut`.

## Consequências

- Sem reautenticação no caso comum (login recente): nenhum popup aparece
  na exclusão, e o fluxo fica com um passo a menos de atrito.
- O popup deixa de virar um "novo login" — era ele que, ao trazer outra
  conta, fazia o SDK devolver `auth/user-mismatch` sem apagar nada.
- O passo que pode exigir interação acontece **depois** da destruição do
  documento: fechar/cancelar já não deixa nada intacto — vira "coleção
  apagada, conta permanece".
- O descarte de pendências é obrigatório e não opcional: sem ele, o
  debounce ou o `pagehide` recriam o documento recém-apagado — é o único
  ponto do fluxo capaz de desfazer a exclusão sozinho.
- `firestore.rules.test.js` inverte o caso que hoje afirma que apagar o
  próprio documento é negado.
- O app passa a depender de mais duas funções do SDK de Auth
  (`reauthenticateWithPopup`, `deleteUser`), ambas em `src/lib/firebase.js`.

## Alternativas consideradas

- **Reautenticar só quando `deleteUser` pedir**: é a escolha agora. No
  caso comum (login recente) não aparece popup; o popup só surge quando o
  login é antigo e o `deleteUser` exige `auth/requires-recent-login`.
  Menos atrito e, principalmente, o popup não vira um "novo login" (com
  outra conta) que resultava em `auth/user-mismatch` e nada apagado.
- **Reautenticação incondicional antes de tudo**: a decisão anterior.
  Determinística, mas o popup virava uma barreira antes de qualquer
  destruição que, na prática, se comportava como um novo login e causava
  `auth/user-mismatch` sem apagar nada — revertida por decisão do humano
  (2026-09-18), ver `## Histórico`.
- **Apagar a conta antes do documento**: impossível — sem ID token as
  regras negam a exclusão do documento, e o dado pessoal sobreviveria à
  conta.
- **Apagar só o documento e manter a conta**: mais simples, dispensa
  reautenticação, mas deixa nome, e-mail e foto no Firebase Auth e não
  atende o art. 18, VI.
- **Regra de `delete` validando `resource.data`**: sem propósito —
  apagar não escreve conteúdo.

## Histórico

- **2026-09-18** — revertida por decisão do humano (Fase 0031): a ordem
  "descartar pendências → reautenticar por popup incondicional → apagar
  documento → apagar conta" foi substituída por "descartar pendências →
  apagar documento → apagar conta, reautenticando só quando o `deleteUser`
  exige login recente". Motivo: no teste do preview, o popup de
  reautenticação virou um novo login — o usuário entrou com outra conta e
  o SDK devolveu `auth/user-mismatch`, sem apagar nada.
