<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0024-0003]: Login duplo, fixture, scripts, teste de fumaça e documentação

## Status
Concluída

## Objetivo
Entregar os helpers de login (popup fake do Google e e-mail/senha
instantâneo) e de fixture no Firestore Emulator, os dois scripts npm,
um teste de fumaça que prova a infraestrutura de ponta a ponta, e
`docs/teste-e2e.md` documentando tudo, da visão geral ao específico.

## Documentos de referência
- `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`
  § Decisão — login duplo, fixture, scripts `test:e2e`/`test:e2e:dev`,
  escopo da entrega (só infraestrutura + fumaça).
- `src/components/LoginButton.jsx` e `src/lib/firebase.js` §
  `signInWithGoogle` — fluxo de login real que o popup fake do
  emulador substitui, sem mudar código de produção.
- `docs/devops.md` § Validação local — tabela de scripts existente,
  modelo para as novas linhas.
- `docs/arquitetura.md` § Build, deploy e qualidade — texto atual
  sobre testes.
- `AGENTS.md` § Onde fica cada coisa — tabela de arquivos, para incluir
  `docs/teste-e2e.md` e `e2e/`.

## Padrões e convenções aplicáveis
- `e2e/` fora da co-localização (ADR 0009 atualizado) — os arquivos
  desta tarefa vivem lá, não ao lado de módulos de `src/`.
- `docs/requisitos.md` nunca muda por tarefa — nada aqui altera
  requisito, é infraestrutura de teste.

## Escopo e instruções de implementação
1. `e2e/helpers/login.js`: duas funções — uma que dirige a UI fake do
   Google que o emulador abre numa popup (preenche e-mail/nome
   fictícios, confirma) para testes que validam o próprio login; outra
   que autentica um usuário fixo por e-mail/senha direto contra o
   emulador, sem popup, para os demais testes.
2. `e2e/helpers/fixture.js`: função que grava um documento
   `users/{uid}` no Firestore Emulator (contagens conhecidas) antes de
   abrir a página, para cenários além da coleção vazia.
3. `package.json`: scripts `test:e2e` (builda com `vite build`, serve
   com `vite preview`, sobe os emuladores via `firebase emulators:exec
   --only auth,firestore --project demo-iconula` e roda `playwright
   test` — script **padrão**) e `test:e2e:dev` (mesma ideia, servindo
   com `npm run dev` em vez do build — atalho de iteração).
4. `e2e/catalogo.spec.js` (ou nome equivalente): teste de fumaça — login
   instantâneo (helper de e-mail/senha), grava um estado conhecido com
   o helper de fixture (algumas contagens, não a coleção vazia) e
   confere que o placar exibido corresponde exatamente a esse estado
   (ex.: título mostra o total e o percentual certos para as contagens
   gravadas). Exercita os dois helpers desta tarefa (login rápido e
   fixture) numa só verificação; o helper de popup fica para um teste
   dedicado futuro (fora do escopo desta entrega, ver ADR 0010).
5. Criar `docs/teste-e2e.md`, do geral para o específico:
   - por que existe (login como guarda do app, sem conta Google real
     no ambiente de automação — motivação da ADR 0010);
   - visão geral (Playwright + emuladores de Auth e Firestore, projeto
     fake `demo-iconula`);
   - como o app liga aos emuladores (`VITE_USE_FIREBASE_EMULATOR`);
   - estratégia de login dupla (quando usar popup fake vs. e-mail/senha
     instantâneo);
   - fixture de dados no Firestore Emulator;
   - scripts disponíveis (`test:e2e`, `test:e2e:dev`) e como rodar
     localmente (pré-requisitos: JDK 21+, `npx playwright install`);
   - estrutura de arquivos (`e2e/`);
   - limitações e fora do escopo atual (sem CI, sem testes de
     regressão específicos ainda);
   - referências: ADR 0010, ADR 0009.
6. `AGENTS.md` § Onde fica cada coisa: acrescentar linhas para `e2e/`
   e `docs/teste-e2e.md`.
7. `docs/devops.md` § Validação local: nova linha na tabela para
   `test:e2e`/`test:e2e:dev` (ferramenta Playwright, o que valida),
   citando a ADR 0010.
8. `docs/arquitetura.md` § Build, deploy e qualidade: acrescentar
   menção aos testes E2E (Playwright + emuladores), citando a ADR 0010.

**Fora do escopo**: testes de regressão específicos (ex.: a faixa de
bandeiras), qualquer integração com CI — ambos ficam para pedidos
futuros (ver ADR 0010 § Alternativas consideradas).

## Decisões já tomadas (não reabrir)
- Login duplo (popup fake + e-mail/senha) — ver
  `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`.
- Fixture no Firestore Emulator — ver o mesmo ADR.
- Scripts `test:e2e` (padrão, build) e `test:e2e:dev` (dev server) —
  ver o mesmo ADR.
- Escopo da entrega limitado a infraestrutura + fumaça — ver o mesmo
  ADR.

## Arquivos impactados
- `e2e/helpers/login.js` — criar.
- `e2e/helpers/fixture.js` — criar.
- `e2e/catalogo.spec.js` — criar.
- `package.json` — modificar (scripts `test:e2e`, `test:e2e:dev`).
- `docs/teste-e2e.md` — criar.
- `AGENTS.md` — modificar (§ Onde fica cada coisa).
- `docs/devops.md` — modificar (§ Validação local).
- `docs/arquitetura.md` — modificar (§ Build, deploy e qualidade).

## Critérios de aceite
- [ ] `npm run test:e2e` passa localmente (build + preview +
      emuladores + Playwright).
- [ ] `npm run test:e2e:dev` passa localmente (dev server +
      emuladores + Playwright).
- [ ] O teste de fumaça usa o helper de e-mail/senha, grava um estado
      conhecido com o helper de fixture e confere que o placar exibido
      corresponde a esse estado — não à coleção vazia.
- [ ] O helper de popup fake do Google existe e está pronto para uso
      por um teste futuro dedicado ao fluxo de login — verificação
      funcional desse caminho fica fora desta entrega (ADR 0010).
- [ ] `docs/teste-e2e.md` existe e cobre, nesta ordem, do geral ao
      específico: motivação, visão geral, conexão com o emulador,
      estratégia de login, fixture, scripts, estrutura de arquivos e
      limitações — citando a ADR 0010.
- [ ] `AGENTS.md`, `docs/devops.md` e `docs/arquitetura.md` atualizados
      conforme o escopo, citando a ADR 0010.
- [ ] `npm run lint && npm run test && npm run build` verdes.

## Validação adicional
- `npm run test:e2e` e `npm run test:e2e:dev`, além de lint/test/build.
