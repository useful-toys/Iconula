<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0036-0004: Política de privacidade e inventário

## Status
Concluída

## Objetivo
Atualizar a política de privacidade para declarar o analytics consentido
(GA4, região Brasil, retenção de 14 meses), subir a versão da política e
refletir a operação no inventário de `docs/privacidade.md`. É mudança material
— dispara reaceite na entrada.

## Documentos de referência
- `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md` § Consequências — operação de analytics, região Brasil, retenção.
- `docs/idr/0071-banner-de-consentimento-para-analytics.md` § Consequências — reverte o "não exibe banner".
- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md` — estrutura do texto.
- `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md` e `docs/model-dr/0009-campos-de-aceite-dos-textos.md` — só mudança material sobe a versão.
- `src/lib/versoesDosTextos.js` — único lugar das versões.
- `src/components/PoliticaDePrivacidade.jsx` — texto atual.
- `docs/privacidade.md` § Inventário das operações de tratamento — tabela e observações.

## Padrões e convenções aplicáveis
- Só mudança material sobe a versão — `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md`; a data de `versõesDosTextos.js` bate com o `dateTime` "Última atualização" da política.
- `docs/privacidade.md` descreve o estado real e tem ciclo de revisão — `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`.
- Texto em PT-BR; o conteúdo de conformidade segue o `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.

## Escopo e instruções de implementação
1. Em `src/components/PoliticaDePrivacidade.jsx`:
   - § Dados tratados: trocar "nem uso de analytics" por uma linha que declara as métricas de uso via Google Analytics, só com consentimento.
   - § Base legal: acrescentar que o analytics é tratado com consentimento (art. 7º I), revogável ao recusar.
   - § Onde os dados ficam / § Operador e transferência internacional: declarar que os dados de analytics ficam na região Brasil (sem transferência internacional para essa finalidade).
   - § Armazenamento local: remover "não exibe banner" e explicar o banner de consentimento e a chave gravada.
   - § Retenção: declarar os 14 meses do GA4.
   - § Alterações: nova entrada de data; atualizar "Última atualização".
2. Em `src/lib/versoesDosTextos.js`, subir `VERSAO_POLITICA` para a data vigente; `VERSAO_TERMOS` permanece.
3. Atualizar `src/components/PoliticaDePrivacidade.test.jsx` — o trecho que hoje afirma "não pede consentimento de cookies nem exibe banner" passa a descrever o banner.
4. Em `docs/privacidade.md` § Inventário: nova linha para as métricas de uso (cookies/identificadores, finalidade, base legal consentimento, retenção 14 meses, operador Google, transferência "Não — região Brasil"); nas Observações, remover "Não há analytics" e declarar o banner.

**Fora do escopo**: `docs/interface.md` e os demais `docs/*.md` (Tarefa 0036-0005); os termos de uso (não mudam — analytics é matéria de política).

## Decisões já tomadas (não reabrir)
- Analytics consentido, região Brasil, retenção 14 meses — `docs/adr/0011-analytics-de-uso-com-google-analytics-4.md`.
- Banner de consentimento — `docs/idr/0071-banner-de-consentimento-para-analytics.md`.
- Mudança material sobe versão e reabre aceite — `docs/idr/0062-reaceite-reusa-a-tela-de-atestacao.md`.

## Arquivos impactados
- `src/components/PoliticaDePrivacidade.jsx` — modificar
- `src/components/PoliticaDePrivacidade.test.jsx` — modificar
- `src/lib/versoesDosTextos.js` — modificar
- `docs/privacidade.md` — modificar (§ Inventário das operações de tratamento)

## Critérios de aceite
- [ ] A política declara o analytics consentido, a base legal (art. 7º I), a região Brasil e a retenção de 14 meses.
- [ ] A política não diz mais "não exibe banner" nem "sem analytics".
- [ ] `VERSAO_POLITICA` subiu para a data vigente e `VERSAO_TERMOS` não mudou.
- [ ] O teste da política reflete o novo texto (sem a asserção antiga de "sem banner").
- [ ] `docs/privacidade.md` tem a linha de analytics no inventário e as Observações sem "Não há analytics".

## Validação adicional
- `npm run test` cobrindo o teste ajustado da política.
