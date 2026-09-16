<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# ADR 0010: Testes E2E com Playwright e emuladores do Firebase

## Status

Aceito.

## Contexto

- O login com Google é a guarda do app (`docs/requisitos.md` § Acesso):
  sem sessão só a tela de login existe. Validar visualmente qualquer
  mudança de tela exige login real, e o ambiente de execução automatizada
  não tem — nem pode ter, com segurança — uma conta Google real.
- Sintoma concreto: na revisão da Fase 23 (disposição álbum dos Extras
  FIFA), a verificação visual ficou marcada como pendente em duas
  tarefas por esse motivo, e uma regressão (faixa de bandeiras rolando a
  tela inteira no mobile) só foi corrigida porque um humano a notou no
  preview — nenhum teste automatizado cobria esse comportamento.
- O projeto já usa emulador do Firebase para um propósito estreito: as
  regras do Firestore (`npm run test:rules`), contra o projeto fake
  `demo-iconula` (prefixo `demo-` = offline, sem credencial —
  [DDR 0004](../devops-dr/0004-deploy-e-teste-das-regras-do-firestore.md)).
  Não existe hoje nenhum teste que abra a aplicação inteira num
  navegador.
- `src/lib/firebase.js` (único ponto de inicialização do Auth) e
  `src/lib/colecaoRemota.js` (único módulo que toca o SDK do Firestore —
  [ADR 0005](0005-persistencia-no-firestore.md)) nunca chamam
  `connectAuthEmulator`/`connectFirestoreEmulator`: sempre falam com o
  Firebase real.
- O app só oferece Google como provedor de login
  ([ADR 0004](0004-login-google-sdk-modular.md)), mas nada no código
  verifica *qual* provedor autenticou — só se existe sessão
  (`onAuthStateChanged`). O Firebase Auth Emulator aceita qualquer método
  de autenticação para um projeto fake, incluindo um IdP falso do Google
  (popup próprio do emulador, sem tocar o Google real) e e-mail/senha
  comuns.
- Testes são co-localizados por padrão
  ([ADR 0009](0009-testes-co-localizados.md)), com uma única exceção já
  aberta (regras do Firestore, config e script próprios). Testes E2E não
  testam um módulo único — não há "ao lado de quê" co-localizar.

## Decisão

- **Ferramenta**: [Playwright](https://playwright.dev/). Suporta múltiplas
  janelas/popups de forma nativa — necessário para o fluxo de login via
  popup do Google — e navegadores múltiplos.
- **Localização**: diretório `e2e/` na raiz do repositório, paralelo a
  `src/`. Segunda exceção à co-localização do
  [ADR 0009](0009-testes-co-localizados.md) (atualizado por este ADR),
  no mesmo molde da primeira (regras do Firestore): config e scripts
  próprios, fora do padrão `.test.js`/`.test.jsx`.
- **Emuladores**: Auth (novo) e Firestore (já configurado) rodando juntos
  via `firebase emulators:exec --only auth,firestore --project
  demo-iconula`. Mesmo projeto fake `demo-iconula` já usado pelas regras
  — sem credencial real, sem custo. O emulador de Auth roda em Node (sem
  JVM); o de Firestore continua exigindo JDK 21+ (inalterado, já exigido
  por `test:rules`).
- **Conexão condicionada por variável de ambiente dedicada**, ausente por
  padrão: `VITE_USE_FIREBASE_EMULATOR`. Só quando definida,
  `src/lib/firebase.js` chama `connectAuthEmulator` e
  `colecaoRemota.js` chama `connectFirestoreEmulator`, ambos apontando
  para `127.0.0.1`. Nunca definida em `.env.local`, nos workflows de
  preview/produção nem em `.env.example` — só no ambiente/script dos
  testes E2E. Descartada a alternativa de detectar `import.meta.env.DEV`
  (afetaria todo `npm run dev` comum, mesmo com Firebase real
  configurado).
- **Login duplo**, cada teste usa o que precisa:
  - **Popup fake do Google**: só nos testes que validam o próprio fluxo
    de login (clique em "Entrar com Google", atestação de menores no
    primeiro acesso). Dirige a UI fake que o emulador abre para
    `GoogleAuthProvider` (e-mail/nome fictícios, sem tocar o Google
    real) — o mesmo `LoginButton.jsx`/`signInWithPopup` de produção, sem
    mudança de código.
  - **E-mail/senha instantâneo**: para todo o resto (catálogo, álbum,
    faixa de bandeiras, contagens). Um usuário fixo é criado/autenticado
    direto contra o emulador antes de abrir a página, sem depender de
    uma segunda janela — mais rápido e menos sujeito a instabilidade
    quando repetido em muitos testes.
- **Fixture no Firestore Emulator**: depois de autenticado, o teste pode
  gravar um `users/{uid}` com contagens conhecidas antes de abrir a
  tela, para cenários além da coleção vazia (ex.: seção parcialmente
  colada).
- **Dois scripts**, ambos contra os emuladores:
  - `npm run test:e2e` — **padrão/oficial**: builda (`vite build`) e
    serve o resultado (`vite preview`) antes do Playwright rodar — o
    mesmo bundle publicado em preview/produção. É o que a documentação
    referencia e o que uma eventual integração futura com CI usaria.
  - `npm run test:e2e:dev` — atalho contra `npm run dev`, só para
    iterar rápido escrevendo um teste novo; não substitui o padrão.
- **Escopo desta entrega**: só a infraestrutura (emuladores, os dois
  helpers de login, o helper de fixture) e um teste mínimo de fumaça
  (login fake + catálogo carrega) provando que a base funciona. Testes
  de regressão específicos (ex.: a faixa de bandeiras) são pedidos
  futuros, escritos sob demanda.
- **Fora do escopo**: rodar E2E no CI a cada PR — custo de tempo, risco
  de flakiness bloqueando merges e decisão de DevOps (DDR) própria;
  candidato natural de evolução, não comprometido aqui.

## Consequências

- Primeira dependência de teste de navegador do projeto:
  `@playwright/test` (mais os browsers baixados por `npx playwright
  install`) como `devDependency` nova.
- `firebase.json` ganha um bloco `emulators.auth` (porta padrão 9099),
  ao lado do `emulators.firestore` já existente.
- `docs/devops.md` § Validação local ganha uma linha para
  `test:e2e`/`test:e2e:dev`, e `docs/arquitetura.md` § Build, deploy e
  qualidade cita esta decisão — ambos na tarefa que implementa.
- `ADR 0009` passa a listar duas exceções à co-localização (regras do
  Firestore e testes E2E) em vez de uma.
- Testes E2E continuam sem cobertura de CI: falha só aparece rodando
  localmente, até uma decisão futura mudar isso.
- Ambiente local de quem for rodar `test:e2e`/`test:e2e:dev` precisa de
  JDK 21+ (já exigido por `test:rules`) e do download dos browsers do
  Playwright na primeira vez.

Implementação: Fase 0024 (Tarefas 0024-0001 a 0024-0003).

## Alternativas consideradas

- **Cypress**: rejeitado para este caso — suporte a múltiplas
  janelas/popups é mais limitado, e o fluxo de login via popup fake do
  Google depende exatamente disso.
- **Só e-mail/senha instantâneo, sem popup fake do Google** (login
  "bypassed" sempre): mais simples, mas deixaria o próprio fluxo de
  login e a tela de atestação de menores sem nenhuma cobertura E2E —
  rejeitado; os dois convivem, cada um no seu tipo de teste.
- **"Modo de teste" que pula o Firebase Auth inteiramente** (flag faz
  `App.jsx` tratar um usuário fixo como já logado, sem tocar em nenhum
  SDK): mais rápido de implementar, mas introduziria um desvio de
  código só para teste dentro do componente principal do produto — o
  tipo de bifurcação que o projeto evita sem necessidade real
  ([TDR 0014](../tdr/0014-estado-da-colecao-sem-context.md)) — e também
  deixaria login/atestação descobertos. Rejeitada: o login por
  e-mail/senha contra o emulador já entrega velocidade equivalente sem
  tocar `App.jsx`.
- **Rodar E2E no CI a cada PR desde já**: descartado por ora — amplia
  bastante o escopo (novo workflow, tempo de CI, risco de flakiness
  bloqueando merges) além do que este pedido cobre (viabilizar
  localmente); fica como gatilho de revisão futura.
- **Detectar `import.meta.env.DEV` para ligar o emulador**: rejeitado —
  ligaria o emulador em todo `npm run dev` comum, mesmo quando o
  desenvolvedor quer testar contra o Firebase real configurado em
  `.env.local`.
