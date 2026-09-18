<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0004: histórico, prazo e identificação nos textos

## Data
2026-09-18

## Resumo

Fecha o conteúdo de conformidade dos dois textos: a política de privacidade
declara que os pedidos de titular são respondidos em até 15 dias (LGPD
art. 19, §1º, II) e atendidos quando partem do mesmo e-mail da conta Google
usada no app, e os dois textos ganham uma seção "Alterações" com o histórico
de versões (data e uma linha do que mudou) e a nota de que mudança material
pede novo aceite na entrada. Nenhum código de app mudou além dos textos e dos
testes das duas vistas; `docs/interface.md` §§ Política de privacidade e
Termos de uso passam a descrever o conteúdo novo.

## Discovery

- Código: `src/components/PoliticaDePrivacidade.jsx` tem hoje as seções
  Controlador/encarregado, Dados tratados, Finalidade, Base legal, Onde ficam,
  Operador/transferência, Link do catálogo, Armazenamento local, Retenção,
  Direitos do titular (+ painel de exclusão), Dados de menores e Contato;
  `src/components/TermosDeUso.jsx` segue o roteiro do IDR 0053, com a seção
  "Alterações dos termos" já existente (cláusula de continuidade, sem
  histórico). As duas vistas exibem "Última atualização" com `dateTime`
  `2026-09-17`, que bate com `VERSAO_TERMOS`/`VERSAO_POLITICA` em
  `src/lib/versoesDosTextos.js`. Os testes co-localizados cobrem as seções
  (a lista `SECOES` de `TermosDeUso.test.jsx` fixa a ordem dos `h2`; o teste
  de `PoliticaDePrivacidade.test.jsx` verifica cada `h2` e o conteúdo do
  IDR 0061), então a lista de seções dos dois arquivos precisa acompanhar as
  seções novas. Comportamento atual confere com a tarefa: prazo, identificação
  e histórico ainda não estão nos textos. Impacto fora de "Arquivos
  impactados": nenhum outro consumidor lê o texto interno das vistas.
- Documentação: reli o IDR 0061 (§ Decisão — prazo de 15 dias pelo art. 19,
  §1º, II; identificação pelo mesmo e-mail da conta Google; vigência e
  histórico de versões; mudança material pede novo aceite), o IDR 0062 (§ o
  reaceite que o texto de alterações menciona) e `docs/interface.md`
  §§ Política de privacidade e Termos de uso, que descrevem o conteúdo atual
  e ainda não têm prazo, identificação nem histórico. O MDR 0009 e o
  `versoesDosTextos.js` dão a data de vigência (`2026-09-17`) para o
  histórico.

## Plano da alteração

1. `src/components/PoliticaDePrivacidade.jsx`: na seção "Direitos do titular",
   declarar o prazo de resposta de até 15 dias (art. 19, §1º, II) e que os
   pedidos são atendidos quando partem do mesmo e-mail da conta Google usada
   no app, com a confirmação pedida antes de qualquer resposta quando vêm de
   outro endereço; acrescentar a seção "Alterações" antes de "Contato", com o
   histórico de versões (data + linha do que mudou) e a nota de que mudança
   material pede novo aceite na entrada.
2. `src/components/TermosDeUso.jsx`: acrescentar a seção "Alterações", com o
   mesmo histórico e a nota do novo aceite, substituindo a cláusula de
   "Alterações dos termos" — o texto passa a datar a versão e registrar o que
   mudou.
3. `src/components/PoliticaDePrivacidade.test.jsx`: verificar a seção nova, o
   prazo com o art. 19, §1º, II e a identificação pelo e-mail da conta.
4. `src/components/TermosDeUso.test.jsx`: incluir a seção na lista `SECOES` e
   verificar o histórico e a nota do novo aceite.
5. `docs/interface.md` §§ Política de privacidade e Termos de uso: descrever
   o prazo, a identificação e a seção de alterações, citando o IDR 0061.

- Verificação prevista: cada critério por teste (`PoliticaDePrivacidade.test.jsx`
  e `TermosDeUso.test.jsx`) ou leitura de `docs/interface.md`; lint, test e
  build ao final.
- Riscos: a lista `SECOES` de `TermosDeUso.test.jsx` é ordenada — manter a
  seção nova na posição do roteiro (substituindo "Alterações dos termos");
  o histórico precisa ser coerente com as versões publicadas em
  `versoesDosTextos.js` (`2026-09-17`).
- Desvios: nenhum.

## Decisões tomadas

- O histórico traz uma linha por versão; a única versão publicada até aqui é
  `2026-09-17` (as versões nasceram na Tarefa 0032-0002), então o histórico
  registra essa data como a versão inicial do conteúdo de conformidade —
  coerente com `VERSAO_TERMOS`/`VERSAO_POLITICA`. Nível 1 (conteúdo de texto
  já decidido pelo IDR 0061), sem registro novo.
- Em Termos de uso, a seção "Alterações" substitui "Alterações dos termos" no
  lugar do roteiro do IDR 0053, em vez de acrescentar uma seção: evita duas
  seções sobre o mesmo assunto. Nível 1.

## Impedimentos

Nenhum.

## Setup realizado

Nenhum.

## Validação

- `npm run lint`:
  ```
  > oxlint
  Found 0 warnings and 0 errors.
  Finished in 63ms on 99 files with 105 rules using 4 threads.
  ```
- `npm run test`:
  ```
  Test Files  48 passed (48)
       Tests  635 passed (635)
  ```
  Dois testes a mais que a base da tarefa anterior (633): o caso novo da
  política e o dos termos. Os avisos `An update to Avisos inside a test was
  not wrapped in act(...)` são pré-existentes (aparecem também na `main`).
  Ajuste no teste antigo do IDR 0061: a asserção que provava a ausência de
  "endereço" (endereço do controlador) colidia com "outro endereço" da
  identificação; passou a procurar "endereço do controlador".
- `npm run build`:
  ```
  ✓ 144 modules transformed.
  ✓ built in 486ms
  ```
  O aviso de chunk > 500 kB é pré-existente.
- `npm run test:rules`: não se aplica — a tarefa não toca `firestore.rules`.

## Critérios de aceite

- [x] Os dois textos têm seção de alterações com histórico de versões — seção
      "Alterações" em `src/components/PoliticaDePrivacidade.jsx` e em
      `src/components/TermosDeUso.jsx`; testes "declara o prazo e a
      identificação do titular e o histórico (IDR 0061)" e "traz a seção de
      alterações com o histórico e o novo aceite (IDR 0061)".
- [x] A política declara o prazo de 15 dias citando o art. 19, §1º, II —
      `src/components/PoliticaDePrivacidade.jsx:143-149` e teste que verifica
      `/15 dias \(LGPD art\. 19, §1º, II\)/`.
- [x] A política declara a identificação pelo e-mail da conta —
      `src/components/PoliticaDePrivacidade.jsx:149-155` e teste que verifica
      `/mesmo e-mail da conta Google/`.
- [x] O histórico menciona que mudança material pede novo aceite — nota nas
      duas seções "Alterações"; testes que verificam `/pede um novo aceite/` e
      `/novo aceite/`.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.

## Arquivos alterados

- `src/components/PoliticaDePrivacidade.jsx` — prazo de 15 dias,
  identificação pelo e-mail da conta e seção "Alterações".
- `src/components/TermosDeUso.jsx` — seção "Alterações" com histórico e nota
  do novo aceite.
- `src/components/PoliticaDePrivacidade.test.jsx` — casos do prazo, da
  identificação e do histórico.
- `src/components/TermosDeUso.test.jsx` — seção na lista `SECOES` e casos do
  histórico e do novo aceite.
- `docs/interface.md` — §§ Política de privacidade e Termos de uso com o
  conteúdo novo, citando o IDR 0061.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0004-historico-prazo-e-identificacao-nos-textos.md`
  — status para `Concluída`.
- `docs/plano/README.md` — linha da tarefa 0004 para `Concluída`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0004-log-historico-prazo-e-identificacao-nos-textos.md`
  — este log (novo).
