<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0006: política de privacidade, noindex e e2e do link

## Data
2026-09-16

## Resumo
A fase fecha com o que torna o link seguro de publicar. Antes, a política de
privacidade não mencionava a visibilidade por link, o Hosting não pedia aos
buscadores que ignorassem `/catalogo/**`, e nenhum e2e cobria a vista sem
login. Depois:

- `PoliticaDePrivacidade.jsx` — a frase dos terceiros em "Onde os dados
  ficam" passa a citar "e, se você ligar o link do catálogo, de quem tiver o
  link.", e nasce a seção "Link do catálogo", depois de "Onde os dados
  ficam", com o texto exato do IDR 0055.
- `firebase.json` — bloco novo em `hosting.headers` com `source:
  "/catalogo/**"` e `X-Robots-Tag: noindex`; CSP e demais headers intocados.
- `e2e/helpers/fixture.js` — terceiro parâmetro opcional (`extras`) que
  acrescenta campos ao documento (ex.: `linkAtivo`), sem mudar o uso atual.
- `e2e/catalogoCompartilhado.spec.js` (novo) — sem login, link ligado abre o
  catálogo do dono com o placar conhecido e o rótulo `somente leitura`, e
  tocar num cartão inerte não muda o placar; link desligado mostra "Este
  catálogo não está compartilhado.".
- `docs/interface.md`, `docs/devops.md`, `docs/teste-e2e.md` e `AGENTS.md` no
  estado atual.

Divergências: nenhuma. O texto da política e o header saem exatamente do
IDR 0055 e do DDR 0001; o código confere com a tarefa.

## Discovery
- Código: a frase dos terceiros está em
  `src/components/PoliticaDePrivacidade.jsx:43-44`, entre as seções "Onde os
  dados ficam" e "Retenção"; a seção nova entra depois de "Onde os dados
  ficam". O teste ao lado cobria só títulos e o e-mail — o teste novo
  acrescenta a frase e a seção. `firebase.json` tem `hosting.headers` com um
  bloco `**` (CSP + headers) e três blocos de cache; o `X-Robots-Tag` entra
  como bloco novo `source: "/catalogo/**"`, sem tocar na CSP.
  `e2e/helpers/fixture.js` gravava `contagens`, `updatedAt` e `atestadoEm`
  fixos; passa a aceitar campos extras (ao menos `linkAtivo`) mantendo
  `gravarFixture(uid, contagens)`. `e2e/catalogo.spec.js` era o único spec; o
  novo `e2e/catalogoCompartilhado.spec.js` abre `/catalogo/<uid>` sem login,
  com a fixture gravada antes do `goto`. A vista renderiza o placar e o
  rótulo em `.cabecalho__titulo`/`.cabecalho__rotulo` (Cabecalho.jsx) e os
  cartões inertes como `div[role="img"].figurinha__corpo--leitura`
  (Figurinha.jsx). Comportamento atual confere com a tarefa; sem impacto
  fora dos arquivos impactados.
- Documentação: as referências bastaram. Conferi `docs/interface.md`
  § Demais telas › Política de privacidade e `docs/devops.md` § CSP e
  headers, além de `docs/idr/0055` § Decisão (texto exato da política) e
  `docs/devops-dr/0001` § Decisão › Indexação do catálogo compartilhado.

## Plano da alteração
1. `src/components/PoliticaDePrivacidade.jsx`: frase dos terceiros com o
   acréscimo do link; seção "Link do catálogo" depois de "Onde os dados
   ficam", com o texto do IDR 0055.
2. `src/components/PoliticaDePrivacidade.test.jsx`: cobre a seção e as
   frases novas.
3. `firebase.json`: bloco `source: "/catalogo/**"` com
   `X-Robots-Tag: noindex`; CSP e demais headers intocados.
4. `e2e/helpers/fixture.js`: parâmetro opcional de campos extras do
   documento.
5. `e2e/catalogoCompartilhado.spec.js` (novo): ligado, sem login, placar e
   `somente leitura`; cartão inerte não muda o placar; desligado, a tela de
   não compartilhado.
6. `docs/interface.md` § Demais telas › Política de privacidade: a seção
   "Link do catálogo", citando IDR 0055.
7. `docs/devops.md` § CSP e headers: `X-Robots-Tag: noindex` em
   `/catalogo/**`, citando DDR 0001.
8. `docs/teste-e2e.md` e `AGENTS.md` § Onde fica cada coisa: o novo spec e a
   fixture com campos extras.
- Verificação prevista: critério 1 → `PoliticaDePrivacidade.test.jsx`;
  critério 2 → trecho do `firebase.json` e `git diff` da CSP; critério 3 →
  `npm run test:e2e`; critério 4 → `npm run test:e2e` (fumaça); critério 5 →
  leitura dos trechos.
- Riscos: o e2e depende de emuladores Auth+Firestore e JDK 21+ no `PATH`
  (o `PATH` desta máquina traz JDK 8 — prefixei Temurin 21). A mudança da
  fixture não pode quebrar `catalogo.spec.js` (terceiro parâmetro opcional);
  o `firebase.json` foi conferido byte a byte para não perder o bloco
  `/index.html`.
- Desvios: nenhum.

## Decisões tomadas
- `gravarFixture` ganha um terceiro parâmetro posicional opcional (`extras`,
  padrão `{}`), espalhado no documento depois de `contagens`/`updatedAt`/
  `atestadoEm` — nível 1, API interna, sem mudar a chamada existente.
- Texto da seção, ordem (depois de "Onde os dados ficam") e o header vêm do
  IDR 0055 e do DDR 0001; nada sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (89 files, 105 rules).
- `npm run test` → `Test Files 43 passed (43)` / `Tests 581 passed (581)`
  (eram 580 na Tarefa 0027-0005: +1 teste desta tarefa na política). Os
  avisos de `act(...)` do componente `Avisos` são os já presentes nos testes
  de App pré-existentes, não novos.
- `npm run build` → `✓ built in 1.12s`; aviso de chunk > 500 kB já conhecido
  (SDK do Firebase carregado sob demanda).
- `npm run test:rules` → não se aplica (não tocou `firestore.rules`).
- `npm run test:e2e` (PATH com Temurin 21.0.9) → `3 passed (13.9s)`:
  `catalogo.spec.js` (fumaça) e os dois casos do spec novo.

## Critérios de aceite
- [x] A política traz a frase dos terceiros e a seção "Link do catálogo" com
      o texto do IDR 0055 — `PoliticaDePrivacidade.test.jsx` › "declara a
      visibilidade por link, com o texto do IDR 0055" e o título na lista de
      seções.
- [x] `firebase.json` tem `X-Robots-Tag: noindex` só para `/catalogo/**`
      (trecho) e a CSP inalterada (`git diff -- firebase.json` mostra só o
      bloco novo).
- [x] `npm run test:e2e` verde, com o spec novo cobrindo link ligado sem
      login, cartão inerte e link desligado — `3 passed`.
- [x] `e2e/catalogo.spec.js` continua verde com a fixture alterada —
      `ok 2 [chromium] › e2e\catalogo.spec.js:21:1`.
- [x] `docs/interface.md`, `docs/devops.md`, `docs/teste-e2e.md` e
      `AGENTS.md` atualizados, citando IDR 0055 e DDR 0001.

## Arquivos alterados
- `src/components/PoliticaDePrivacidade.jsx` — frase dos terceiros e seção
  "Link do catálogo".
- `src/components/PoliticaDePrivacidade.test.jsx` — teste da seção e das
  frases novas.
- `firebase.json` — `X-Robots-Tag: noindex` em `/catalogo/**`.
- `e2e/helpers/fixture.js` — parâmetro opcional `extras`.
- `e2e/catalogoCompartilhado.spec.js` — criar: vista do link sem login.
- `docs/interface.md` — § Demais telas › Política de privacidade.
- `docs/devops.md` — § CSP e headers.
- `docs/teste-e2e.md` — fixture com extras, estrutura e limitações.
- `AGENTS.md` — § Onde fica cada coisa, linha do `e2e/`.
- `docs/plano/0027-catalogo-compartilhado-por-link/0006-politica-noindex-e-e2e-do-link.md`
  e `docs/plano/README.md` — status.
