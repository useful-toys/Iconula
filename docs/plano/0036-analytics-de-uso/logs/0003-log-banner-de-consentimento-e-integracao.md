<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0003: Banner de consentimento e integração

## Data
2026-09-18

## Resumo
Cria o `BannerDeConsentimento` e o monta nas telas de login e principal, com o
gate rígido do IDR 0071: "Aceitar" grava `'aceito'` no `localStorage` e carrega
o gtag; "Recusar" grava `'recusado'` e mantém o app funcional, sem analytics.
Antes, o módulo de analytics (Tarefa 0036-0002) existia mas ninguém o usava;
depois, o consentimento vira interface e o aceite lembrado carrega o gtag na
abertura seguinte.

`src/components/BannerDeConsentimento.jsx` e `.css` — o componente lê
`consentimentoAnalytics()` na inicialização e só renderiza enquanto o valor é
`'nao-decidido'`; as duas ações gravam e somem com o banner, e o link da
política aciona `onAbrirPolitica`. A faixa é **em fluxo** no topo do conteúdo
(não fixa): a borda inferior fixa do app já é a área de avisos (`z-index: 20`),
e uma faixa fixa colidiria com ela e cobriria os links do rodapé — inclusive o
clique do E2E. O escopo pedia "aparece antes do conteúdo, sem travar nada", que
a faixa em fluxo atende sem a sobreposição; desvio da premissa "fixa junto à
borda inferior" registrado em "Decisões tomadas".

`src/App.jsx` — importa o banner e o `iniciarAnalyticsSeConsentido`; monta o
banner antes de `TelaDeLogin` (linha 902) e como primeiro filho de `.app` na
tela principal (linha 943); chama `iniciarAnalyticsSeConsentido()` num
`useEffect` de montagem (linha 227), fora da guarda de sessão, para o aceite
lembrado carregar o gtag na abertura seguinte (IDR 0071, MDR 0007).

`src/components/BannerDeConsentimento.test.jsx` cobre os quatro casos do escopo
e o link da política. O caminho de leitura/gravação do consentimento é real; só
o carregador é espiado (`vi.mock` com `importOriginal`), para provar que
"Aceitar" chama o carregador e "Recusar" não.

Divergências: nenhuma entre tarefa, documentação e código. A única tensão foi a
posição da faixa (nível 2 do próprio planejamento), resolvida pela premissa mais
conservadora.

## Discovery
- Código: `App.jsx` é o único componente com estado e decide a tela por uma
  sequência de retornos antecipados (vistas internas, vista do link, guarda de
  sessão, atestação/reaceite e tela principal). O banner cobre a tela de login
  (ramo `!user`) e a principal (retorno final). `src/lib/analytics.js` (Tarefa
  0036-0002) já expõe `consentimentoAnalytics()`,
  `gravarConsentimentoAnalytics(valor)`, `carregarAnalytics()` e
  `iniciarAnalyticsSeConsentido()` — nenhuma outra peça usa o módulo ainda.
  Convenções locais: componente de função com export default, CSS co-localizado
  importado pelo próprio componente e comentário de topo explicando a decisão;
  `Avisos.jsx`/`Avisos.css` é o precedente de faixa reutilizando tokens
  (`--panel`, `--border`, `--cream`, `--gold`, `--bg-deep`, `--page-gutter`),
  com ordem de camadas documentada em `docs/interface.md` § Camadas (cabeçalho
  10, avisos 20). Testes de componente: Vitest + Testing Library + `userEvent`
  + `@testing-library/jest-dom/vitest`, com `localStorage.clear()` no
  `beforeEach`. Os testes de App consultam botões por nome acessível exato
  (`Política de privacidade`) e o E2E `e2e/apagarDados.spec.js:96` consulta o
  mesmo nome por Playwright, que casa por **substring**: o rótulo do link do
  banner não pode conter a frase "política de privacidade". Comportamento atual
  confere com a tarefa.
- Documentação: li o ADR 0011 § Decisão/Consequências (gtag por módulo mínimo,
  sob consentimento), o IDR 0071 § Decisão/Alternativas (banner nas duas telas,
  gate rígido, recusar mantém o app funcional, escolha lembrada, previews sem
  analytics, componente próprio "montado antes do conteúdo") e o MDR 0007
  § localStorage — consentimento de analytics (chave e valores). As referências
  bastaram.

## Plano da alteração
1. Criar `src/components/BannerDeConsentimento.jsx` — componente de função com
   `onAbrirPolitica` (padrão no-op, como em `TelaDeLogin`); estado local
   inicializado por leitura preguiçosa de `consentimentoAnalytics()`, só
   renderiza enquanto o valor é `'nao-decidido'`; "Aceitar" chama
   `gravarConsentimentoAnalytics('aceito')` + `carregarAnalytics()` e some;
   "Recusar" chama `gravarConsentimentoAnalytics('recusado')` e some; link
   "Ver a política" aciona `onAbrirPolitica`.
2. Criar `src/components/BannerDeConsentimento.css` — faixa em fluxo no topo do
   conteúdo (não fixa), reusando os tokens do tema; ações separadas por filete
   visual implícito no espaçamento, sem rolagem própria.
3. Criar `src/components/BannerDeConsentimento.test.jsx` — os quatro casos do
   escopo (visível sem decisão; some no aceite gravando `'aceito'` e chamando o
   carregador; some na recusa gravando `'recusado'` sem carregar; não renderiza
   já decidido) e o link da política aciona o callback. O carregador é
   espiado com `vi.mock('./analytics.js')` preservando o restante do módulo
   (`importOriginal`).
4. `src/App.jsx` — importar `BannerDeConsentimento` e
   `iniciarAnalyticsSeConsentido`; montar o banner na tela de login (fragmento
   antes de `TelaDeLogin`) e na principal (primeiro filho de `.app`); chamar
   `iniciarAnalyticsSeConsentido()` num `useEffect` de montagem, para o aceite
   lembrado carregar o gtag na abertura seguinte (IDR 0071, MDR 0007).
5. Sem registros de decisão novos e sem `docs/*.md` (o comportamento visível
   já está no IDR 0071; `interface.md` é a Tarefa 0036-0005 e a política, a
   0036-0004).
6. Verificação: `npm run lint && npm run test && npm run build`; roteiro visual
   em `npm run dev` (sem consentimento → banner nas duas telas; aceitar → some;
   recarregar → não reaparece).
- Verificação prevista: os quatro casos + link da política → testes de
  componente; banner nas duas telas → trecho de `App.jsx` (login e principal);
  aceite lembrado → trecho do `useEffect` de `App.jsx`; app funcional na recusa
  → teste (banner some e `carregarAnalytics` não é chamado).
- Riscos: posição/tokens são nível 2. A premissa do planejamento era "faixa
  fixa junto à borda inferior"; a faixa fixa colidiria com os Avisos (também
  fixos no rodapé, `z-index: 20`) e cobriria o rodapé e seus links — inclusive
  o clique do E2E. Adotei a premissa mais conservadora: faixa **em fluxo**
  antes do conteúdo (o próprio escopo diz "aparece antes do conteúdo, sem
  travar nada"), reusando tokens. Desvio registrado em "Decisões tomadas".
  Nenhum outro.
- Desvios: nenhum.

## Decisões tomadas
- Faixa em fluxo no topo do conteúdo, em vez de fixa na borda inferior (nível
  2, sem registro): evita sobrepor os Avisos (fixos no rodapé) e os links do
  rodapé/tela de login, e não introduz regressão nos testes E2E; atende
  "aparece antes do conteúdo, sem travar nada". O IDR 0071 não fixa posição.
- Rótulo do link da política como "Ver a política" (nível 1, sem registro):
  manter "Política de privacidade" criaria nome acessível duplicado com o
  rodapé/tela de login nos testes e casaria por substring no E2E do Playwright.
- Carregamento do aceite lembrado em `useEffect` de `App.jsx` via
  `iniciarAnalyticsSeConsentido()` (nível 1, sem registro): é o ponto de
  entrada da abertura documentado no próprio módulo (Tarefa 0036-0002) e cobre
  a regra "aceito carrega direto na próxima abertura" do MDR 0007/IDR 0071.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem saída; exit 0)
```

```
$ npx vitest run src/components/BannerDeConsentimento.test.jsx
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

```
$ npm run test
 Test Files  55 passed (55)
      Tests  711 passed (711)
   Duration  124.55s
```

```
$ npm run build
✓ 180 modules transformed.
✓ built in 757ms
(!) Some chunks are larger than 500 kB after minification.
```
(O aviso de chunk grande é pré-existente — já registrado no log da Tarefa
0036-0002 — e não tem relação com a tarefa. `npm run test:rules` não se aplica:
`firestore.rules` não foi tocado.)

Roteiro visual pendente (sem navegador): `npm run dev`, sem consentimento no
`localStorage` → o banner aparece nas duas telas; "Aceitar" → some; recarregar
→ não reaparece.

## Critérios de aceite
- [x] O banner aparece na tela de login e na principal com consentimento não
      decidido — montado em `src/App.jsx:902` (login) e `src/App.jsx:943`
      (principal); teste "aparece com consentimento não decidido".
- [x] "Aceitar" grava `'aceito'` e dispara o carregamento do gtag — teste "some
      ao aceitar, grava 'aceito' e chama o carregador".
- [x] "Recusar" grava `'recusado'` e não carrega o gtag; o app segue funcional
      — teste "some ao recusar, grava 'recusado' e não chama o carregador".
- [x] Consentimento já decidido não exibe o banner — testes "não renderiza com
      consentimento já decidido" e "aceito lembrado da sessão anterior também
      não exibe o banner"; o aceite lembrado carrega o gtag por
      `src/App.jsx:227` (`iniciarAnalyticsSeConsentido`).
- [x] Testes cobrem os quatro casos e passam em `npm run test` — 711 testes,
      6 em `src/components/BannerDeConsentimento.test.jsx`.

## Arquivos alterados
- `src/components/BannerDeConsentimento.jsx` — criado; faixa de consentimento
  com as ações Aceitar/Recusar e o link da política.
- `src/components/BannerDeConsentimento.css` — criado; faixa em fluxo com
  tokens do tema.
- `src/components/BannerDeConsentimento.test.jsx` — criado; casos do escopo e
  link da política.
- `src/App.jsx` — importa e monta o banner no login e na principal; carrega o
  gtag consentido na abertura (`iniciarAnalyticsSeConsentido`).
- `docs/plano/0036-analytics-de-uso/0003-banner-de-consentimento-e-integracao.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0003-log-banner-de-consentimento-e-integracao.md`
  — este log.
