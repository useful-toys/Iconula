<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0002: versões dos textos e gravação do aceite

## Data
2026-09-18

## Resumo

Cria `src/lib/versoesDosTextos.js` como lugar único das versões dos textos
(`VERSAO_TERMOS` e `VERSAO_POLITICA`, `'2026-09-17'`, com a regra de mudança
material no JSDoc), renomeia `gravarAtestacao(uid)` para
`gravarAceite(uid, { atestar })` e faz a carga devolver os campos de versão.
Antes, a gravação só carimbava `atestadoEm` e a conta não provava **qual
texto** aceitou; agora a mesma escrita grava `termosVersao`, `politicaVersao`
e `aceitoEm`, incluindo `atestadoEm` apenas quando a atestação de idade
acompanha (primeiro acesso), sempre sem `updatedAt`. `carregarColecao` passa a
devolver `termosVersao`/`politicaVersao` (ou `null` quando ausentes) da mesma
leitura, sem requisição extra. `App.jsx` chama `gravarAceite(uid, { atestar:
true })` no primeiro acesso, mantendo o comportamento atual; os testes de
`colecaoRemota` cobrem a escrita nova e a carga, e os mocks de `App` foram
renomeados. `docs/modelo-firebase.md` (§ Mecanismo de gravação, § Operações
sobre o documento e § Custos e cotas) e `AGENTS.md` (§ Onde fica cada coisa)
descrevem a função renomeada e o módulo novo.

## Discovery

- Código: `src/lib/colecaoRemota.js` é o único módulo que toca o SDK do
  Firestore; `gravarAtestacao` (linha 393 na base) era `setDoc` com
  `merge: true` gravando só `atestadoEm`, sem `updatedAt`, e `carregarColecao`
  devolvia `contagens`, `atualizadoEm`, `temTeamName`, `atestadoEm` e
  `linkAtivo`. O padrão do módulo é resultado discriminado sem lançar. Os
  testes co-localizados (`colecaoRemota.test.js`) usam `vi.hoisted` + mock de
  `firebase/firestore`, com `CARIMBO_SERVIDOR`/`CAMPO_APAGAR` como sentinelas.
  A busca por `gravarAtestacao` em `src/` achou 7 referências a mais fora dos
  arquivos de "Arquivos impactados": os mocks de `App.catalogoCompartilhado`,
  `App.persistencia`, `App.linkDoCatalogo`, `App.politica` e `App.termos`
  exportam `gravarAtestacao` do módulo mockado, e o comentário de
  `Atestacao.jsx` cita a função — todos precisam acompanhar a renomeação por
  causa do critério de "nenhuma referência ao nome antigo em `src/`". Os dois
  textos exibem `dateTime="2026-09-17"` (`PoliticaDePrivacidade.jsx:47`,
  `TermosDeUso.jsx:22`), que é o valor a publicar no módulo. Comportamento
  atual confere com a tarefa; nada de impacto fora dos arquivos citados e
  desses mocks.
- Documentação: reli o MDR 0009 (§ Decisão — os três campos, `gravarAtestacao`
  vira `gravarAceite(uid, { atestar })` e a carga devolve as versões; §
  Consequências — uma escrita com três campos) e o IDR 0062 (§ Decisão — só
  mudança material sobe a versão, critério humano que fica junto das
  constantes). Busquei `gravarAtestacao`/`atestadoEm` nos `docs/*.md` para
  delimitar o que a tarefa toca: `docs/modelo-firebase.md` já foi atualizado
  pela Tarefa 0032-0001 em § Formato do documento (sete campos) e § Regras de
  segurança; restavam as duas seções do escopo. Outros registros ainda citam
  `gravarAtestacao` (MDR 0002, MDR 0003, TDR 0009, IDR 0036, modelo-intercambio,
  setup-firebase, teste-e2e) — fora do escopo desta tarefa (ver observações).

## Plano da alteração

1. Criar `src/lib/versoesDosTextos.js` com `VERSAO_TERMOS` e
   `VERSAO_POLITICA` (`'2026-09-17'`) e o JSDoc da regra de mudança material
   (MDR 0009, IDR 0062).
2. `src/lib/colecaoRemota.js`: importar as versões; renomear
   `gravarAtestacao` para `gravarAceite(uid, { atestar })` gravando
   `termosVersao`, `politicaVersao` e `aceitoEm` (`serverTimestamp()`), com
   `atestadoEm` só quando `atestar`; `carregarColecao` devolve
   `termosVersao`/`politicaVersao` (`?? null`); atualizar JSDoc e a menção em
   `gravarLinkAtivo`.
3. `src/App.jsx`: importar `gravarAceite` e chamar `{ atestar: true }` no
   primeiro acesso; comentário alinhado.
4. `src/lib/colecaoRemota.test.js`: renomear import/describe; casos de versões
   gravadas, `atestadoEm` só sob `atestar`, ausência de `updatedAt`, falha,
   indisponível; caso de carga devolvendo as versões e ajuste do `toEqual`
   existente para os campos novos.
5. `src/App.atestacao.test.jsx`: renomear o mock e esperar
   `("uid1", { atestar: true })`.
6. Renomear o mock nos demais testes que o exportavam
   (`App.catalogoCompartilhado`, `App.persistencia`, `App.linkDoCatalogo`,
   `App.politica`, `App.termos`) e o comentário de `Atestacao.jsx`.
7. `docs/modelo-firebase.md` (§ Mecanismo de gravação, § Operações sobre o
   documento) e `AGENTS.md` (§ Onde fica cada coisa): função renomeada e
   módulo novo.

- Verificação prevista: cada critério por teste (`colecaoRemota.test.js`,
  `App.atestacao.test.jsx`) ou busca (`gravarAtestacao` em `src/`); lint, test
  e build ao final.
- Riscos: os mocks de `App` que não exportavam `gravarAceite` deixariam o
  import `undefined` (só quebraria se o passo fosse acionado); a renomeação em
  todos eles elimina o risco. `serverTimestamp()` chamado duas vezes devolve o
  mesmo carimbo de servidor, então `atestadoEm` e `aceitoEm` compartilham
  `request.time`.
- Desvios: nenhum.

## Decisões tomadas

- Nome e forma do módulo: constantes nomeadas `VERSAO_TERMOS` e
  `VERSAO_POLITICA` exportadas de `versoesDosTextos.js` — decisão de nível 1
  (nome de módulo e API interna), sem registro próprio.
- Incluir § Custos e cotas de `docs/modelo-firebase.md` no ajuste, além das
  duas seções pedidas: a linha "Atestação de menores | 1 escrita na vida da
  conta" ficaria falsa com o aceite por versão. Nível 1 (documentação viva,
  sem mudar decisão); lastro no MDR 0009.
- Renomear também os cinco mocks de `App` e o comentário de `Atestacao.jsx`:
  necessário para o critério "nenhuma referência ao nome antigo em `src/`".

## Impedimentos

Nenhum.

## Setup realizado

Nenhum.

## Validação

- `npm run lint`:
  ```
  > oxlint
  Found 0 warnings and 0 errors.
  Finished in 58ms on 99 files with 105 rules using 4 threads.
  ```
- `npm run test`:
  ```
  Test Files  48 passed (48)
       Tests  627 passed (627)
  ```
  Os avisos `An update to Avisos inside a test was not wrapped in act(...)`
  são pré-existentes (aparecem também na `main`). Três testes a mais que a
  base (624): dois do `describe` de `gravarAceite` e um da carga das versões.
- `npm run build`:
  ```
  ✓ 144 modules transformed.
  ✓ built in 464ms
  ```
  O aviso de chunk > 500 kB é pré-existente.
- `npm run test:rules`: não se aplica — a tarefa não toca `firestore.rules`
  (os campos já foram publicados pela Tarefa 0032-0001).

## Critérios de aceite

- [x] As duas versões existem num módulo só, com a regra de mudança material
      documentada — `src/lib/versoesDosTextos.js:22-23` (`VERSAO_TERMOS`,
      `VERSAO_POLITICA`) e JSDoc `:17-20` ("Só mudança material sobe a
      versão"), citando MDR 0009 e IDR 0062.
- [x] A gravação do aceite grava as duas versões e o instante, e só inclui a
      atestação quando pedida — `src/lib/colecaoRemota.js:409` (`gravarAceite`)
      e testes `colecaoRemota.test.js` "grava as duas versões e aceitoEm…" e
      "inclui atestadoEm só quando a atestação de idade acompanha".
- [x] Nenhuma gravação de aceite carimba `updatedAt` (verificável por teste) —
      teste "nunca carimba updatedAt — o relógio da coleção não se move com o
      aceite" em `colecaoRemota.test.js`.
- [x] A carga devolve as duas versões — `src/lib/colecaoRemota.js:181-182` e
      teste "devolve as versões aceitas quando o documento as tem (Tarefa
      0032-0002)".
- [x] Nenhuma referência ao nome antigo da função resta em `src/` (verificável
      por busca) — `grep -r gravarAtestacao src/` sem resultados.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.

## Arquivos alterados

- `src/lib/versoesDosTextos.js` — novo: as duas versões e a regra de mudança
  material no JSDoc.
- `src/lib/colecaoRemota.js` — `gravarAtestacao` vira `gravarAceite(uid, {
  atestar })`; carga devolve as versões; JSDoc atualizado.
- `src/lib/colecaoRemota.test.js` — testes de `gravarAceite` e da carga das
  versões.
- `src/App.jsx` — importa e chama `gravarAceite(uid, { atestar: true })`.
- `src/App.atestacao.test.jsx` — mock e expectativa renomeados
  (`{ atestar: true }`).
- `src/App.catalogoCompartilhado.test.jsx`, `src/App.persistencia.test.jsx`,
  `src/App.linkDoCatalogo.test.jsx`, `src/App.politica.test.jsx`,
  `src/App.termos.test.jsx` — mock `gravarAtestacao` renomeado para
  `gravarAceite`.
- `src/components/Atestacao.jsx` — comentário cita `gravarAceite`.
- `docs/modelo-firebase.md` — § Mecanismo de gravação, § Operações sobre o
  documento e § Custos e cotas com a função renomeada.
- `AGENTS.md` — § Onde fica cada coisa: linha de `colecaoRemota.js` e módulo
  `versoesDosTextos.js`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0002-versoes-dos-textos-e-gravacao-do-aceite.md`
  — status para `Concluída`.
- `docs/plano/README.md` — linha da tarefa 0002 para `Concluída`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0002-log-versoes-dos-textos-e-gravacao-do-aceite.md`
  — este log (novo).
