<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0036-0004: Política de privacidade e inventário

## Data
2026-09-18

## Resumo
A política de privacidade passa a declarar a operação de analytics consentido e
a versão sobe, disparando o reaceite na entrada. Antes, o texto dizia "não há
uso de analytics" e "não pede consentimento de cookies nem exibe banner";
depois, declara as métricas de uso pelo Google Analytics 4 (região Brasil,
retenção de 14 meses) na base legal de consentimento (art. 7º, I) e descreve o
banner e a chave `iconula.consentimento-analytics.v1`. `VERSAO_POLITICA` sobe
de `2026-09-17` para `2026-09-18`; `VERSAO_TERMOS` permanece.

`src/components/PoliticaDePrivacidade.jsx` — mudanças em § Dados tratados,
§ Base legal, § Onde os dados ficam, § Operador e transferência internacional,
§ Armazenamento local, § Retenção e § Alterações, com "Última atualização" em
18 de setembro de 2026. `src/lib/versoesDosTextos.js` — só `VERSAO_POLITICA`.
`src/components/PoliticaDePrivacidade.test.jsx` — data nova e asserções do
banner, da chave, do analytics consentido, da região Brasil e dos 14 meses no
lugar da asserção do "sem banner". `docs/privacidade.md` — linha das métricas
no inventário, Observações sem "Não há analytics", ADR 0011 entre as fontes e
revisão de 2026-09-18 anotada.

Como a versão publicada mudou, os fixtures de "conta em dia" de 13 testes de
integração de `App` (e as duas expectativas de `gravarAceite` em
`colecaoRemota.test.js`) precisaram acompanhar `politicaVersao`; sem isso o
reaceite reabria e os testes que esperam o catálogo quebravam. Divergência
encontrada fora do que a tarefa toca, registrada nas Observações:
`docs/requisitos.md` § Privacidade (`:297-299`) e `docs/interface.md` § Tela de
privacidade (`:775`) ainda dizem "sem banner de cookies" — o primeiro é
`docs/requisitos.md`, que a execução não altera, e o segundo é a Tarefa
0036-0005.

## Discovery
- Código: `src/components/PoliticaDePrivacidade.jsx` é a vista interna (TDR 0020)
  com o texto de conformidade (IDR 0061); a data de "Última atualização" é o
  mesmo literal de `VERSAO_POLITICA` em `src/lib/versoesDosTextos.js` (o único
  lugar das versões, MDR 0009/IDR 0062). `App.jsx:788` compara as versões da
  conta com as constantes para decidir o reaceite; `src/lib/colecaoRemota.js`
  grava as constantes no aceite. `src/components/PoliticaDePrivacidade.test.jsx`
  cobria os itens do IDR 0061 e ainda afirmava "não pede consentimento de cookies
  nem exibe banner" (`:52-54`).
  **Impacto não citado no "Arquivos impactados"**: os testes de integração de
  `App` montam a conta "em dia" com `politicaVersao: "2026-09-17"` fixo em 13
  arquivos (`App.apagarDados`, `App.apoie`, `App.compartilhar`, `App.copiar`,
  `App.desfazer`, `App.exportar`, `App.gravacao`, `App.importar`,
  `App.linkDoCatalogo`, `App.persistencia`, `App.politica`, `App.sobre`,
  `App.termos`). Subir `VERSAO_POLITICA` faz esses fixtures caírem no reaceite e
  quebrarem todo teste que espera o `catalogo-mock`; só `App.atestacao.test.jsx`
  já usa as constantes importadas. `src/lib/colecaoRemota.test.js` também fixa a
  versão publicada nas expectativas de `gravarAceite`. Comportamento atual
  confere com a tarefa. Testes: Vitest + Testing Library; o fixture da política
  segue o padrão das vistas.
- Documentação: li o ADR 0011 § Decisão/Consequências (GA4, região Brasil,
  retenção de 14 meses, consentimento art. 7º I, reaceite) e o IDR 0071
  § Decisão/Consequências (banner nas duas telas, gate rígido, recusa 100%
  funcional, chave no `localStorage`), o IDR 0061 (estrutura do texto de
  conformidade), o IDR 0062 e o MDR 0009 (só mudança material sobe a versão), o
  MDR 0007 § consentimento de analytics (chave
  `iconula.consentimento-analytics.v1`) e `docs/privacidade.md`
  § Inventário/Observações/Revisões. As referências bastaram.

## Plano da alteração
1. `src/components/PoliticaDePrivacidade.jsx` — declarar as métricas de uso
   consentidas no § Dados tratados; acrescentar o consentimento do analytics no
   § Base legal (art. 7º, I); declarar a região Brasil no § Onde os dados ficam e
   o "sem transferência internacional para essa finalidade" no § Operador e
   transferência internacional; trocar "não pede consentimento de cookies nem
   exibe banner" pela descrição do banner e da chave
   `iconula.consentimento-analytics.v1` no § Armazenamento local; declarar a
   retenção de 14 meses no § Retenção; subir "Última atualização" para
   18 de setembro de 2026 e abrir a entrada da nova versão no § Alterações.
2. `src/lib/versoesDosTextos.js` — `VERSAO_POLITICA = '2026-09-18'`;
   `VERSAO_TERMOS` permanece `'2026-09-17'`.
3. `src/components/PoliticaDePrivacidade.test.jsx` — trocar a data de vigência
   para 2026-09-18/18 de setembro de 2026; substituir a asserção do "sem banner"
   pela do banner e da chave; acrescentar as asserções de analytics consentido,
   região Brasil e retenção de 14 meses.
4. 13 arquivos `src/App.*.test.jsx` e `src/lib/colecaoRemota.test.js` —
   atualizar para `"2026-09-18"` as expectativas de `politicaVersao` que
   representam a versão publicada (fixtures de conta em dia; saída de
   `gravarAceite`), mantendo `termosVersao` em `"2026-09-17"`. **Desvio** em
   relação ao "Arquivos impactados" da tarefa: sem isso o reaceite reabre nos
   testes e a suíte não fica verde.
5. `docs/privacidade.md` § Inventário — nova linha das métricas de uso
   (cookies/identificadores, finalidade, base legal consentimento, retenção 14
   meses, operador Google, transferência "Não — região Brasil"); Observações sem
   "Não há analytics", com o banner; acrescentar o ADR 0011 às fontes; anotar a
   revisão de 2026-09-18 no § Ciclo de revisão.
6. Sem registro de decisão novo: a operação de analytics já está no ADR 0011 e o
   banner no IDR 0071; a tarefa implementa decisões já tomadas.
7. Verificação: `npm run lint && npm run test && npm run build`; roteiro visual
   da política no `npm run dev` (sem navegador → pendente).
- Verificação prevista: analytics/base legal/região/14 meses → asserções no
  teste da política; `VERSAO_POLITICA` subiu e `VERSAO_TERMOS` não → trecho de
  `versoesDosTextos.js` e teste; inventário → trecho de `docs/privacidade.md`.
- Riscos: fixtures dos testes de `App` e `colecaoRemota` (mitigado pelo passo 4);
  a data da política e a constante precisam continuar batendo (mitigado por
  manter o mesmo literal). Nenhum outro.
- Desvios: o passo 4 (arquivos de teste além do "Arquivos impactados"),
  justificado no próprio passo.

## Decisões tomadas
- Fixtures de "conta em dia" passam a `politicaVersao: "2026-09-18"` (nível 1,
  sem registro): representam a versão publicada que subiu com esta tarefa; sem
  isso o reaceite reabre e a suíte não fica verde. A alternativa de importar as
  constantes esbarraria nas factories de `vi.mock` hoisted de alguns arquivos.
- Trocar "trata dois grupos de dados" por "trata os seguintes dados" no
  § Dados tratados (nível 1, sem registro): com as métricas de uso o texto
  deixaria de contar corretamente os grupos; ajuste redacional.

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
$ npx vitest run src/components/PoliticaDePrivacidade.test.jsx
 Test Files  1 passed (1)
      Tests  11 passed (11)
```

```
$ npm run test
 Test Files  55 passed (55)
      Tests  711 passed (711)
   Duration  119.33s
```

```
$ npm run build
✓ 180 modules transformed.
✓ built in 624ms
(!) Some chunks are larger than 500 kB after minification.
```
(O aviso de chunk grande é pré-existente — já registrado no log da Tarefa
0036-0002 — e não tem relação com a tarefa. `npm run test:rules` não se aplica:
`firestore.rules` não foi tocado.)

Roteiro visual pendente (sem navegador): `npm run dev`, abrir a política pela
tela de login → "Última atualização: 18 de setembro de 2026"; § Dados tratados
declara as métricas de uso pelo Google Analytics 4; § Base legal traz o
consentimento do analytics (art. 7º, I); § Onde os dados ficam e § Operador
dizem região Brasil, sem transferência internacional para essa finalidade;
§ Armazenamento local descreve o banner e a chave; § Retenção diz 14 meses;
§ Alterações lista 18/09/2026 antes de 17/09/2026.

## Critérios de aceite
- [x] A política declara o analytics consentido, a base legal (art. 7º, I), a
      região Brasil e a retenção de 14 meses — `PoliticaDePrivacidade.jsx:65-68`
      (métricas de uso consentidas), `:84-85` (art. 7º, I), `:93-94` e
      `:101-104` (região Brasil / sem transferência), `:136-137` (14 meses);
      asserções no teste da política.
- [x] A política não diz mais "não exibe banner" nem "sem analytics" — busca em
      `PoliticaDePrivacidade.jsx` e `docs/privacidade.md` sem resultado;
      asserção negativa no teste.
- [x] `VERSAO_POLITICA` subiu para a data vigente e `VERSAO_TERMOS` não mudou —
      `versoesDosTextos.js:23` (`2026-09-18`) e `:22` (`2026-09-17`);
      "Última atualização" em `PoliticaDePrivacidade.jsx:47`.
- [x] O teste da política reflete o novo texto (sem a asserção antiga de "sem
      banner") — `PoliticaDePrivacidade.test.jsx` cobre banner, chave,
      analytics, região e 14 meses; 11 testes verdes.
- [x] `docs/privacidade.md` tem a linha de analytics no inventário e as
      Observações sem "Não há analytics" — `docs/privacidade.md:35` (linha) e
      `:47-52` (Observações com banner, lastro no ADR 0011/IDR 0071).

## Arquivos alterados
- `src/components/PoliticaDePrivacidade.jsx` — analytics consentido, região
  Brasil, 14 meses, banner/chave e nova versão no texto.
- `src/components/PoliticaDePrivacidade.test.jsx` — data nova e asserções do
  analytics/banner no lugar da asserção do "sem banner".
- `src/lib/versoesDosTextos.js` — `VERSAO_POLITICA` para `2026-09-18`.
- `src/lib/colecaoRemota.test.js` — expectativas de `gravarAceite` com a versão
  publicada nova.
- `src/App.apagarDados.test.jsx`, `src/App.apoie.test.jsx`,
  `src/App.compartilhar.test.jsx`, `src/App.copiar.test.jsx`,
  `src/App.desfazer.test.jsx`, `src/App.exportar.test.jsx`,
  `src/App.gravacao.test.jsx`, `src/App.importar.test.jsx`,
  `src/App.linkDoCatalogo.test.jsx`, `src/App.persistencia.test.jsx`,
  `src/App.politica.test.jsx`, `src/App.sobre.test.jsx`,
  `src/App.termos.test.jsx` — fixture de conta em dia com a versão publicada
  nova.
- `docs/privacidade.md` — inventário, Observações, fontes e revisão.
- `docs/plano/0036-analytics-de-uso/0004-politica-de-privacidade-e-inventario.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0036-analytics-de-uso/logs/0004-log-politica-de-privacidade-e-inventario.md`
  — este log.
