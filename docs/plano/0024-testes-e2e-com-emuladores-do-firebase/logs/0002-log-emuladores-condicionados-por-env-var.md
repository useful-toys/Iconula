<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0024-0002: Emuladores condicionados por variável de ambiente

## Data
2026-09-16

## Resumo
`src/lib/firebase.js` e `src/lib/colecaoRemota.js` passam a se conectar aos
emuladores do Firebase (Auth novo, Firestore já existente) quando —
e só quando — `VITE_USE_FIREBASE_EMULATOR` está definida no ambiente do
cliente Vite. `firebase.json` ganha o bloco `emulators.auth` (porta 9099),
ao lado do `emulators.firestore` já existente. Sem a variável (dev normal,
preview, produção) o comportamento é idêntico ao anterior: nenhuma chamada a
`connect*Emulator`. `docs/setup-firebase.md` § Emulador (desenvolvimento)
passa a descrever os dois emuladores e a variável, citando a ADR 0010.

## Discovery
- Código: `src/lib/firebase.js` é o único ponto de inicialização do Auth
  (`getAuth(app)`, dentro do bloco `if (isConfigured)`) e já importa
  estaticamente `firebase/auth` — acrescentar `connectAuthEmulator` a essa
  mesma importação não muda o padrão de carga do módulo (ADR 0007 restringe
  só `firebase/firestore`, não `firebase/auth`). `src/lib/colecaoRemota.js`
  é o único módulo que toca o SDK do Firestore, carregado sob demanda por
  `import()` dinâmico dentro de `obterFirestore()`; `firebase.json` já tem
  `emulators.firestore` na porta 8080, servindo de modelo para o bloco
  `emulators.auth`. Não existe `firebase.test.js` (o módulo é sempre
  mockado por inteiro — `vi.mock("./lib/firebase")` — nos testes de
  `App.*.test.jsx`, então o código real de `firebase.js` nunca roda sob
  teste); `colecaoRemota.test.js` mocka `firebase/firestore` via factory
  (`vi.mock('firebase/firestore', () => ({...}))`) com exports explícitos.
- Documentação: só a ADR 0010 § Decisão (variável, portas, projeto fake) foi
  necessária; nenhuma leitura além das referências da tarefa.

## Plano da alteração
1. `firebase.json`: acrescentar bloco `emulators.auth` com `port: 9099`,
   ao lado de `emulators.firestore`.
2. `src/lib/firebase.js`: importar `connectAuthEmulator` de `firebase/auth`
   junto das demais importações; depois de `auth = getAuth(app)`, dentro do
   `if (isConfigured)`, chamar `connectAuthEmulator(auth,
   "http://127.0.0.1:9099")` quando `import.meta.env.VITE_USE_FIREBASE_EMULATOR`
   for verdadeiro.
3. `src/lib/colecaoRemota.js`: dentro de `obterFirestore()`, depois de
   `initializeFirestore`, chamar `connectFirestoreEmulator(db, '127.0.0.1',
   8080)` sob a mesma condição.
4. `docs/setup-firebase.md` § Emulador (desenvolvimento): descrever os dois
   emuladores (Firestore já existente; Auth novo, porta 9099, roda em Node)
   e a variável `VITE_USE_FIREBASE_EMULATOR`, citando a ADR 0010.
5. Rodar `npm run lint && npm run test && npm run build` e conferir que os
   testes existentes de `firebase.js`/`colecaoRemota.js` continuam verdes
   sem a variável definida.
- Verificação prevista: `firebase.json` com `emulators.auth.port: 9099` →
  ler o arquivo; ausência da variável não chama `connect*Emulator` → leitura
  do código (condicional) + suíte de testes existente verde; presença da
  variável chama os dois `connect*Emulator` → leitura do código;
  `docs/setup-firebase.md` cita a ADR 0010 → ler a seção; lint/test/build →
  rodar e conferir saída.
- Riscos: destructurar `connectFirestoreEmulator` do módulo mockado
  `firebase/firestore` incondicionalmente quebraria `colecaoRemota.test.js`
  (o mock da suíte usa uma factory com exports explícitos, e o Vitest lança
  erro ao acessar um export não declarado nela) — mitigado importando
  `connectFirestoreEmulator` só dentro do `if`, quando a variável está
  definida.
- Desvios: o risco acima se confirmou na validação (ver `## Decisões
  tomadas`) e foi corrigido antes do commit.

## Decisões tomadas
- `connectFirestoreEmulator` importado por um segundo `await
  import('firebase/firestore')` **dentro** do `if
  (import.meta.env.VITE_USE_FIREBASE_EMULATOR)`, em vez de desestruturado
  junto com `initializeFirestore`/`persistentLocalCache`/
  `persistentMultipleTabManager` no topo de `obterFirestore()` — nível 1,
  contorno de limitação de teste: a primeira versão, testada, quebrou 19
  testes de `colecaoRemota.test.js` porque o mock de `firebase/firestore`
  (`vi.mock('firebase/firestore', () => ({...}))`) só declara os exports
  que os testes usam, e o Vitest lança ao desestruturar um export ausente
  do mock — mesmo que o valor nunca seja chamado. O módulo já é o mesmo
  (import de módulo ES é cacheado), então o segundo `import()` não pesa
  em tempo de execução; sem registro próprio (ADR 0007/0010 não preveem
  este detalhe de implementação).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
npm run lint
> oxlint
(sem avisos ou erros)

npm run test
> vitest run
Test Files  117 passed (117)
     Tests  1430 passed (1430)

npm run build
> vite build
✓ 136 modules transformed.
✓ built in 1.40s
(!) Some chunks are larger than 500 kB after minification.
```
O aviso de chunk grande é pré-existente (mesmo caso já documentado no log da
Tarefa 0024-0001 e em `docs/arquitetura.md` § Build, deploy e qualidade —
SDK do Firestore, ADR 0005) — nenhuma mudança de bundling nesta tarefa.

## Critérios de aceite
- [x] `firebase.json` tem `emulators.auth.port: 9099` — `firebase.json`.
- [x] Sem `VITE_USE_FIREBASE_EMULATOR`, o comportamento de
      `firebase.js`/`colecaoRemota.js` é idêntico ao atual — nenhuma
      chamada a `connect*Emulator` — ambas as chamadas estão dentro de um
      `if (import.meta.env.VITE_USE_FIREBASE_EMULATOR)`
      (`src/lib/firebase.js`, `src/lib/colecaoRemota.js`); suíte de testes
      existente (117 arquivos, 1430 testes) continua verde sem a variável
      definida em nenhum ambiente de teste.
- [x] Com `VITE_USE_FIREBASE_EMULATOR` definida, `connectAuthEmulator` e
      `connectFirestoreEmulator` são chamados nos módulos certos —
      `src/lib/firebase.js` (`connectAuthEmulator(auth,
      "http://127.0.0.1:9099")`) e `src/lib/colecaoRemota.js`
      (`connectFirestoreEmulator(db, '127.0.0.1', 8080)`).
- [x] `docs/setup-firebase.md` § Emulador (desenvolvimento) descreve os
      dois emuladores e a variável, citando a ADR 0010 —
      `docs/setup-firebase.md` § Emulador (desenvolvimento).
- [x] `npm run lint && npm run test && npm run build` verdes — ver
      `## Validação`.

## Arquivos alterados
- `firebase.json` — bloco `emulators.auth` (porta 9099).
- `src/lib/firebase.js` — `connectAuthEmulator` condicionado por
  `VITE_USE_FIREBASE_EMULATOR`.
- `src/lib/colecaoRemota.js` — `connectFirestoreEmulator` condicionado por
  `VITE_USE_FIREBASE_EMULATOR`.
- `docs/setup-firebase.md` — § Emulador (desenvolvimento) descreve os dois
  emuladores e a variável, citando a ADR 0010.
- `docs/plano/0024-testes-e2e-com-emuladores-do-firebase/0002-emuladores-condicionados-por-env-var.md` — status `Concluída`.
- `docs/plano/README.md` — linha da Tarefa 0002 → `Concluída`.
