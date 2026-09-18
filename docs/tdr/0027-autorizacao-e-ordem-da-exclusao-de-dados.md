<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0027: Autorização e ordem da exclusão de dados

## Status

Aceito — implementação na Fase 0031, Tarefas 0031-0001 e 0031-0003.

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

## Decisão

- **Regra**: `allow delete: if request.auth != null && request.auth.uid
  == userId` — só o dono, sem validar formato; apagar não tem conteúdo a
  validar. O link do catálogo ativo libera `get`, nunca `delete`.
- **Ordem da exclusão**, fixa:
  1. `descartarPendencias()` na gravação agregada;
  2. reautenticar por popup do Google — **sempre**, não só em
     `auth/requires-recent-login`;
  3. apagar `users/{uid}`;
  4. apagar a conta do Firebase Auth.
- **Desistência**: popup fechado (`auth/popup-closed-by-user`,
  `auth/cancelled-popup-request`) cancela tudo, sem apagar nada e sem
  aviso de falha — mesmo tratamento que `LoginButton.jsx` já dá.
- **Falhas parciais**: erro ao apagar o documento aborta antes de tocar
  a conta (falha, `tipo: 'apagar'`); erro ao apagar a conta, com o
  documento já apagado, emite aviso dourado dizendo que a coleção foi
  apagada e a conta de login permanece, e faz `signOut`.

## Consequências

- A reautenticação incondicional torna a ordem determinística: o passo
  que pode exigir interação acontece antes de qualquer destruição, e
  nunca sobra um estado meio-apagado por causa dela.
- O popup do Google vira uma barreira a mais contra o acidente, somada
  ao painel de dois passos do [IDR 0060](../idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md).
- O descarte de pendências é obrigatório e não opcional: sem ele, o
  debounce ou o `pagehide` recriam o documento recém-apagado — é o único
  ponto do fluxo capaz de desfazer a exclusão sozinho.
- `firestore.rules.test.js` inverte o caso que hoje afirma que apagar o
  próprio documento é negado.
- O app passa a depender de mais duas funções do SDK de Auth
  (`reauthenticateWithPopup`, `deleteUser`), ambas em `src/lib/firebase.js`.

## Alternativas consideradas

- **Reautenticar só quando `deleteUser` pedir**: menos atrito no caso
  comum, mas se o popup falhar ou for fechado, o documento já foi
  apagado e a conta fica órfã — estado meio-apagado sem caminho de
  volta.
- **Apagar a conta antes do documento**: impossível — sem ID token as
  regras negam a exclusão do documento, e o dado pessoal sobreviveria à
  conta.
- **Apagar só o documento e manter a conta**: mais simples, dispensa
  reautenticação, mas deixa nome, e-mail e foto no Firebase Auth e não
  atende o art. 18, VI.
- **Regra de `delete` validando `resource.data`**: sem propósito —
  apagar não escreve conteúdo.
