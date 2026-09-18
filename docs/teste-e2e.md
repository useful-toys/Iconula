<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Testes E2E

## Por que existe

O login com Google é a guarda do app (`docs/requisitos.md` § Acesso): sem
sessão só a tela de login existe. Validar qualquer mudança de tela em
navegador exige login real, e o ambiente de execução automatizada não tem
— nem pode ter, com segurança — uma conta Google real. Sem isso, mudanças
de interface só eram verificadas visualmente por um humano no preview, e
uma regressão (faixa de bandeiras rolando a tela inteira no mobile, Fase
23) só foi corrigida porque alguém a notou por acaso — nenhum teste
automatizado cobria esse comportamento (ver
[ADR 0010](adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)).

## Visão geral

- **Ferramenta**: [Playwright](https://playwright.dev/), contra o
  navegador Chromium.
- **Emuladores do Firebase**: Auth e Firestore, ambos do projeto fake
  `demo-iconula` (prefixo `demo-` = totalmente offline, sem credencial
  real, sem custo) — o mesmo projeto já usado pelas regras do Firestore
  (`npm run test:rules`).
- Os testes abrem a aplicação inteira num navegador de verdade — ao
  contrário dos testes de unidade/integração (Vitest + jsdom +
  `src/**/*.test.jsx`), que nunca renderizam num motor de navegador real
  nem tocam o Firebase.

## Como o app liga aos emuladores

`src/lib/firebase.js` e `src/lib/colecaoRemota.js` só chamam
`connectAuthEmulator`/`connectFirestoreEmulator` quando a variável de
ambiente `VITE_USE_FIREBASE_EMULATOR` está definida no processo que roda
`vite build`/`vite preview`/`vite dev` — nunca em dev normal, preview ou
produção, onde a variável nunca é definida. Os dois `playwright*.config.js`
(ver § Scripts disponíveis) definem essa variável só para o servidor que
sobem, via `webServer.env` (ver [ADR 0010](adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)
e [docs/setup-firebase.md](setup-firebase.md#emulador-desenvolvimento)).

## Estratégia de login dupla

Cada teste usa o helper que precisa, de `e2e/helpers/login.js`:

- **`loginComPopupFake`** — dirige a UI fake do Google que o Auth Emulator
  abre numa popup (mesmo `LoginButton.jsx`/`signInWithPopup` de produção,
  sem mudança de código): clica em "Entrar com Google", "Add new account",
  preenche e-mail/nome fictícios e confirma. Use só nos testes que validam
  o próprio fluxo de login (clique no botão, atestação de menores no
  primeiro acesso) — mais lento e uma segunda janela por teste.
- **`loginComEmailSenha`** — autentica um usuário fixo por e-mail/senha
  direto pelo SDK do Firebase, sem abrir popup: cria a conta na primeira
  chamada, reaproveita nas seguintes. Roda inteiramente do lado do
  Playwright (Node), com uma instância própria do SDK (não a do bundle do
  app) apontada para o emulador, e grava a sessão resultante no IndexedDB
  do navegador — o mesmo formato que `firebase/auth` usa para persistir
  `currentUser`. Ao recarregar a página, `App.jsx` encontra a sessão já
  pronta no primeiro `onAuthStateChanged`, como um login real restaurado.
  Use para todo o resto (catálogo, álbum, faixa de bandeiras, contagens) —
  mais rápido e sem a instabilidade de repetir uma segunda janela em
  muitos testes.

Pré-condição de `loginComEmailSenha`: a página já precisa estar navegada
para a origem do app (o IndexedDB é isolado por origem); recarregue a
página depois da chamada para que a sessão semeada valha.

## Fixture de dados no Firestore Emulator

`e2e/helpers/fixture.js` exporta `gravarFixture(uid, contagens, extras?)`:
grava `users/{uid}` com as contagens passadas, para testar cenários além da
coleção vazia do primeiro login (ex.: uma seção parcialmente colada).
`extras` acrescenta campos ao documento — ex.: `linkAtivo: true` para a
vista do catálogo compartilhado ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md))
— sem mudar o uso sem ele. Grava `atestadoEm` junto sempre — sem isso a
conta cairia na tela de atestação de menores em vez do catálogo, que
normalmente não é o que a fixture está preparando.

Usa `@firebase/rules-unit-testing` (o mesmo de `firestore.rules.test.js`)
com as regras de segurança desligadas (`withSecurityRulesDisabled`): a
fixture não testa as regras — isso continua sendo `npm run test:rules` —
só popula dados antes de abrir a página.

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm run test:e2e` | **Padrão/oficial**: builda (`vite build`) e serve com `vite preview` (o mesmo bundle publicado em preview/produção), sobe os emuladores Auth+Firestore (`firebase emulators:exec --only auth,firestore --project demo-iconula`) e roda `playwright test` (`playwright.config.js`). |
| `npm run test:e2e:dev` | Atalho de iteração: mesma ideia, servindo com `vite` (dev server) em vez de buildar (`playwright.dev.config.js`) — só para escrever um teste novo mais rápido; não substitui o padrão. |

Pré-requisitos para rodar localmente:

- **JDK 21+** no `PATH` — o emulador do Firestore roda na JVM (o mesmo
  exigido por `npm run test:rules`); com um JDK mais antigo, falha por
  ambiente, não por teste.
- **Browsers do Playwright baixados**: `npx playwright install chromium`
  (feito uma vez, ver Tarefa 0024-0001).
- `.env.local` configurado com as `VITE_FIREBASE_*` (ver
  [docs/setup-firebase.md](setup-firebase.md#firebase-authentication)):
  `loginComEmailSenha` lê `VITE_FIREBASE_API_KEY` de lá para montar a
  chave de sessão no navegador — o Auth Emulator não valida o valor, mas
  ele precisa bater com o que o app usa.

## Estrutura de arquivos

```
e2e/
├── README.md              — propósito da pasta (exceção de co-localização)
├── catalogo.spec.js        — teste de fumaça
├── catalogoCompartilhado.spec.js — vista do link sem login (IDR 0055)
├── apagarDados.spec.js     — exclusão da coleção e da conta (IDR 0060, TDR 0027)
└── helpers/
    ├── login.js             — loginComPopupFake, loginComEmailSenha
    └── fixture.js           — gravarFixture
playwright.config.js         — config padrão (test:e2e, build + preview)
playwright.dev.config.js     — config de atalho (test:e2e:dev, dev server)
```

## Limitações e fora do escopo atual

- **Sem CI**: os testes E2E não rodam a cada PR — só localmente, por ora.
  Decisão de DevOps (DDR) própria, deixada para um pedido futuro
  (ADR 0010 § Fora do escopo).
- **Poucos testes de regressão específicos ainda**: a infraestrutura
  (emuladores, os dois helpers de login, o helper de fixture) e o teste de
  fumaça `catalogo.spec.js` provam que login instantâneo + fixture funcionam
  de ponta a ponta; `catalogoCompartilhado.spec.js` cobre a vista do link sem
  login ([IDR 0055](idr/0055-catalogo-compartilhado-por-link-somente-leitura.md));
  `apagarDados.spec.js` cobre a exclusão pelo painel da política, com o
  login pelo popup fake do Google e a exclusão sem reautenticação (login
  recente)
  ([IDR 0060](idr/0060-apagar-meus-dados-na-politica-em-dois-passos.md),
  [TDR 0027](tdr/0027-autorizacao-e-ordem-da-exclusao-de-dados.md)).
  Testes de outras funcionalidades específicas (ex.: a faixa de bandeiras)
  são escritos sob demanda, em pedidos futuros.
- **`loginComPopupFake` sem teste dedicado ainda**: o helper passou a ser
  exercitado de ponta a ponta por `apagarDados.spec.js` (login por popup e
  atestação de menores), mas a verificação do próprio fluxo de login via
  popup, num teste dedicado, segue fora deste escopo (ADR 0010 § Escopo
  desta entrega).

## Referências

- [ADR 0010](adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md)
  — decisão completa: ferramenta, localização, emuladores, login duplo,
  fixture, scripts, escopo.
- [ADR 0009](adr/0009-testes-co-localizados.md) — `e2e/` como segunda
  exceção à co-localização de testes.
