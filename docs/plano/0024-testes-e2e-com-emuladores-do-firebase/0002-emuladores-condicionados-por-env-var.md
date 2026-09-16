<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0024-0002]: Emuladores condicionados por variável de ambiente

## Status
Pendente

## Objetivo
Ligar `src/lib/firebase.js` e `src/lib/colecaoRemota.js` aos emuladores
do Firebase (Auth novo, Firestore já existente) só quando uma variável
de ambiente dedicada está definida — nunca em dev normal, preview ou
produção.

## Documentos de referência
- `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`
  § Decisão — variável `VITE_USE_FIREBASE_EMULATOR`, portas dos
  emuladores, projeto fake `demo-iconula`.
- `src/lib/firebase.js` — único ponto de inicialização do Auth.
- `src/lib/colecaoRemota.js` — único módulo que toca o SDK do Firestore
  (ver [ADR 0005](../../adr/0005-persistencia-no-firestore.md)).
- `firebase.json` § `emulators.firestore` — bloco já existente (porta
  8080), modelo para o novo bloco `emulators.auth`.
- `docs/setup-firebase.md` § Emulador (desenvolvimento) — texto atual,
  só sobre o Firestore.

## Padrões e convenções aplicáveis
- `src/lib/firebase.js` nunca importa `firebase/firestore` estaticamente
  (ver [ADR 0007](../../adr/0007-estrutura-de-pastas-e-separacao-de-responsabilidades.md))
  — a mudança em `colecaoRemota.js` não pode contrariar isso.
- Login e persistência são features adicionais cuja ausência não trava
  o app (`src/lib/firebase.js` atual) — a condicional do emulador não
  pode enfraquecer essa garantia fora do modo de teste.

## Escopo e instruções de implementação
1. `firebase.json`: acrescentar bloco `emulators.auth` com porta
   `9099` (padrão do Firebase), ao lado do `emulators.firestore` já
   existente.
2. `src/lib/firebase.js`: quando `import.meta.env.VITE_USE_FIREBASE_EMULATOR`
   estiver definida (e `isConfigured` for verdadeiro), chamar
   `connectAuthEmulator(auth, "http://127.0.0.1:9099")` logo após
   `getAuth(app)`.
3. `src/lib/colecaoRemota.js`: no ponto em que `getFirestore(app)` é
   chamado (carga sob demanda), aplicar a mesma condição com
   `connectFirestoreEmulator(db, "127.0.0.1", 8080)`.
4. Atualizar `docs/setup-firebase.md` § Emulador (desenvolvimento):
   descrever os dois emuladores (Firestore já existente; Auth novo —
   porta 9099, roda em Node, sem exigir JVM) e a variável
   `VITE_USE_FIREBASE_EMULATOR` que liga ambos no cliente, citando a
   ADR 0010.
5. Conferir que os testes unitários existentes de `firebase.js` e
   `colecaoRemota.js` continuam passando sem a variável definida — a
   condicional não deve exigir teste novo só por si, mas a tarefa
   confirma que nada quebrou.

**Fora do escopo**: helpers de login/fixture, scripts npm, teste de
fumaça, `docs/teste-e2e.md` — Tarefa 0024-0003.

## Decisões já tomadas (não reabrir)
- Variável `VITE_USE_FIREBASE_EMULATOR`, ausente por padrão, nunca em
  `.env.local`/preview/produção — ver
  `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`.
- Projeto fake `demo-iconula`, mesmo do `test:rules` — ver o mesmo ADR.

## Arquivos impactados
- `firebase.json` — modificar (bloco `emulators.auth`).
- `src/lib/firebase.js` — modificar.
- `src/lib/colecaoRemota.js` — modificar.
- `docs/setup-firebase.md` — modificar (§ Emulador (desenvolvimento)).

## Critérios de aceite
- [ ] `firebase.json` tem `emulators.auth.port: 9099`.
- [ ] Sem `VITE_USE_FIREBASE_EMULATOR`, o comportamento de
      `firebase.js`/`colecaoRemota.js` é idêntico ao atual — nenhuma
      chamada a `connect*Emulator`.
- [ ] Com `VITE_USE_FIREBASE_EMULATOR` definida, `connectAuthEmulator`
      e `connectFirestoreEmulator` são chamados nos módulos certos.
- [ ] `docs/setup-firebase.md` § Emulador (desenvolvimento) descreve os
      dois emuladores e a variável, citando a ADR 0010.
- [ ] `npm run lint && npm run test && npm run build` verdes.
