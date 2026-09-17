<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0027-0006]: política de privacidade, noindex e e2e do link

## Status
Concluída

## Objetivo
Fechar a fase com o que torna o link seguro de publicar: a política de
privacidade declara a visibilidade da coleção por link, `/catalogo/**`
responde com `X-Robots-Tag: noindex`, e um e2e prova a vista sem login e o
link desligado contra os emuladores.

## Documentos de referência
- `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
  § Decisão — texto da política e `noindex`
- `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`
  § Decisão › Indexação do catálogo compartilhado
- `docs/requisitos.md` § Privacidade — a política declara a visibilidade
  por link
- `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`
  § Decisão; `docs/teste-e2e.md`
- `src/components/PoliticaDePrivacidade.jsx` e teste
- `firebase.json` — `hosting.headers`
- `e2e/helpers/fixture.js`, `e2e/helpers/login.js`, `e2e/catalogo.spec.js`
- `docs/interface.md` § Demais telas › Política de privacidade;
  `docs/devops.md` § CSP e headers

## Padrões e convenções aplicáveis
- Texto da política exatamente o do IDR 0055 — IDR 0055
- Header só em `/catalogo/**`; CSP e demais headers intocados — DDR 0001
- Fixture continua gravando com as regras desligadas; o teste da regra em
  si é `npm run test:rules` — ADR 0010
- Vista aberta em contexto sem login no e2e (sem `login.js`) — IDR 0055

## Escopo e instruções de implementação
1. `src/components/PoliticaDePrivacidade.jsx`: em § Onde os dados ficam, a
   frase dos terceiros passa a "Nenhum outro terceiro tem acesso a esses
   dados além do Google, que já processa o login pelo próprio provedor, e,
   se você ligar o link do catálogo, de quem tiver o link."; seção nova
   "Link do catálogo", depois de § Onde os dados ficam, com o texto do
   IDR 0055. Teste ao lado cobre a seção e as frases.
2. `firebase.json`: entrada em `hosting.headers` com `source`
   `/catalogo/**` e `X-Robots-Tag: noindex`.
3. `e2e/helpers/fixture.js`: aceitar campos extras do documento (ao menos
   `linkAtivo`) sem mudar o uso atual.
4. Novo `e2e/catalogoCompartilhado.spec.js`: documento com contagens
   conhecidas e `linkAtivo: true` → contexto sem login abre
   `/catalogo/<uid>` e vê o placar esperado e o rótulo `somente leitura`;
   tocar num cartão não muda o placar; com `linkAtivo: false` → `Este
   catálogo não está compartilhado.`.
5. `docs/interface.md` § Demais telas › Política de privacidade: a seção
   "Link do catálogo", citando IDR 0055.
6. `docs/devops.md` § CSP e headers: `X-Robots-Tag: noindex` em
   `/catalogo/**`, citando DDR 0001.
7. `docs/teste-e2e.md` e `AGENTS.md` § Onde fica cada coisa: o novo spec e
   a fixture com campos extras.

**Fora do escopo**: App Check e mitigação de cota (ADR 0005); Open Graph
específico do link; mudar CSP.

## Decisões já tomadas (não reabrir)
- Texto da política e `noindex` — ver
  `docs/idr/0055-catalogo-compartilhado-por-link-somente-leitura.md`
- Header de indexação — ver
  `docs/devops-dr/0001-csp-headers-e-configuracao-de-hosting.md`
- E2E com Playwright e emuladores — ver
  `docs/adr/0010-testes-e2e-com-playwright-e-emuladores-do-firebase.md`

## Arquivos impactados
- `src/components/PoliticaDePrivacidade.jsx`,
  `src/components/PoliticaDePrivacidade.test.jsx` — modificar
- `firebase.json` — modificar
- `e2e/helpers/fixture.js` — modificar
- `e2e/catalogoCompartilhado.spec.js` — criar
- `docs/interface.md` — modificar (§ Demais telas › Política de
  privacidade)
- `docs/devops.md` — modificar (§ CSP e headers)
- `docs/teste-e2e.md` — modificar
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] A política traz a frase dos terceiros e a seção "Link do catálogo"
      com o texto do IDR 0055 (teste)
- [ ] `firebase.json` tem `X-Robots-Tag: noindex` só para `/catalogo/**`
      (trecho); CSP inalterada (diff)
- [ ] `npm run test:e2e` verde, com o spec novo cobrindo link ligado sem
      login, cartão inerte e link desligado
- [ ] `e2e/catalogo.spec.js` continua verde com a fixture alterada
- [ ] `docs/interface.md`, `docs/devops.md`, `docs/teste-e2e.md` e
      `AGENTS.md` atualizados, citando os registros

## Validação adicional
- `npm run test:e2e` (emuladores; JDK 21+).
- Depois do deploy do preview: `curl -sI <preview>/catalogo/x` traz
  `X-Robots-Tag: noindex` e `curl -sI <preview>/` não traz; sem acesso,
  verificação `pendente` com este roteiro.
