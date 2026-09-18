<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0003: tela de reaceite

## Data
2026-09-18

## Resumo

A atestação passa a reabrir quando a versão dos textos aceita pela conta
difere da publicada. `Atestacao.jsx` ganha a prop `motivo`: `'primeiro-acesso'`
mantém o texto e o botão "Confirmar" de hoje; `'atualizacao'` mostra que os
termos e a política mudaram, com os dois links e o botão "Li e concordo", sem
repetir a atestação de idade (IDR 0062). `App.jsx` guarda as versões lidas na
carga e deriva a condição de reaceite comparando-as com as publicadas em
`versoesDosTextos.js`; documento sem versão nenhuma cai no reaceite uma vez e,
gravado o aceite, não reabre. Falha de gravação segue o IDR 0036: libera o
catálogo, avisa e a próxima carga repete o passo. Os testes de integração e do
componente cobrem os dois motivos e os três desfechos. `docs/interface.md`
§ Tela de login e `docs/modelo-memoria.md` § Estado do App.jsx descrevem o
passo novo.

## Discovery

- Código: `src/components/Atestacao.jsx` tinha texto único e o botão
  "Confirmar"; `src/App.jsx` guardava só `precisaAtestar`, derivado de
  `!atestadoEm` na carga (linhas 250–268) e confirmado por
  `handleConfirmarAtestacao` (linhas 284–295), que chama
  `gravarAceite(uid, { atestar: true })`. `carregarColecao` já devolve
  `termosVersao`/`politicaVersao` (Tarefa 0032-0002, `?? null`), e
  `versoesDosTextos.js` publica as duas versões (`'2026-09-17'`). O padrão da
  tela é reaproveitar `TelaDeLogin.css` e ligar as vistas internas por
  `onAbrirPolitica`/`onAbrirTermos`, como `TelaDeLogin.jsx`. Impacto fora de
  "Arquivos impactados": onze testes de integração de `App` mockam
  `carregarColecao` como `encontrado` com `atestadoEm: true` e sem os campos
  de versão; como documento sem versão passa a reabrir o reaceite, esses mocks
  precisam trazer as versões publicadas para continuarem vendo o catálogo
  (mesma correção em `App.termos`/`App.politica`, cujo mock está no factory).
- Documentação: reli o IDR 0062 (§ Decisão — os dois motivos e o que cada um
  mostra; § Consequências — a condição ao lado de `precisaAtestar`) e o
  IDR 0036 (§ Decisão — falha libera o app). `docs/interface.md` § Tela de
  login descreve a frase de atestação da tela de login, mas não o passo
  separado `Atestacao.jsx`; `docs/modelo-memoria.md` § Estado do App.jsx lista
  `precisaAtestar` e ainda não tinha as versões nem a condição de reaceite. O
  MDR 0009 já dá o lastro dos campos de versão.

## Plano da alteração

1. `src/components/Atestacao.jsx`: prop `motivo` (`'primeiro-acesso'` padrão ×
   `'atualizacao'`), com os links das vistas internas no motivo de atualização
   e o botão "Li e concordo"; sem atestação de idade no texto novo.
2. `src/App.jsx`: importar as versões publicadas; guardar `termosVersao` e
   `politicaVersao` (começam iguais às publicadas — otimista, como
   `contagens`), atualizá-las na carga (`?? null`) e derivar `precisaReaceitar`
   da comparação; trocar `handleConfirmarAtestacao` por um
   `handleConfirmarAceite(atestar)` que grava com `atestar` conforme o motivo,
   avisa na falha e limpa as versões para as publicadas; renderizar
   `Atestacao` com o motivo `'primeiro-acesso'` quando `precisaAtestar` e
   `'atualizacao'` quando `precisaReaceitar`, passando os callbacks das vistas
   internas.
3. `src/components/Atestacao.test.jsx`: casos dos dois motivos (texto, botão e
   links) e dos links.
4. `src/App.atestacao.test.jsx`: ajustar os mocks para as versões; casos de
   versão divergente reabre, versão igual não reabre, documento sem versão
   reabre uma vez e depois de gravado não reabre, e falha ao gravar o reaceite
   libera o catálogo.
5. Ajustar os mocks de `carregarColecao` nos onze testes de `App` que esperam
   o catálogo, com as versões publicadas.
6. `docs/interface.md` § Tela de login: os dois motivos da atestação.
7. `docs/modelo-memoria.md` § Estado do App.jsx: as versões carregadas e a
   condição de reaceite.

- Verificação prevista: cada critério por teste (`App.atestacao.test.jsx`,
  `Atestacao.test.jsx`) ou leitura de documento; lint, test e build ao final.
- Riscos: os mocks dos onze testes de `App` esquecidos deixariam o reaceite
  aparecer no lugar do catálogo; a rodada de testes cobre. As versões
  começarem iguais às publicadas mantém a janela otimista do IDR 0036, sem
  piscar o reaceite antes da carga.
- Desvios: nenhum.

## Decisões tomadas

- Guardar `termosVersao`/`politicaVersao` em estado (em vez de só um booleano)
  e derivar `precisaReaceitar` da comparação — decisão de nível 1 (estrutura
  de estado), sem registro.
- Iniciar as duas versões pelas publicadas: mantém a carga otimista já
  estabelecida pelo IDR 0036 (sem tela de espera e sem piscar o reaceite),
  decisão de nível 1.
- Mensagem de falha própria para o reaceite ("Falha ao gravar o aceite"), sem
  mudar a do primeiro acesso ("Falha ao gravar a atestação") — nível 1.
- Atualizar também os mocks dos onze testes de `App`: impacto descoberto no
  discovery, exigido para a suíte seguir verde.

## Impedimentos

Nenhum.

## Setup realizado

Nenhum.

## Validação

- `npm run lint`:
  ```
  Found 0 warnings and 0 errors.
  Finished in 62ms on 99 files with 105 rules using 4 threads.
  ```
- `npm run test`:
  ```
  Test Files  48 passed (48)
       Tests  633 passed (633)
  ```
  Seis testes a mais que a base (627): três do `describe` novo do reaceite em
  `App.atestacao.test.jsx` e três do `Atestacao.test.jsx` (dois motivos, links
  e o confirmar do reaceite). Os avisos `An update to Avisos inside a test was
  not wrapped in act(...)` são pré-existentes (aparecem também na `main`).
- `npm run build`:
  ```
  ✓ 144 modules transformed.
  ✓ built in 571ms
  ```
  O aviso de chunk > 500 kB é pré-existente.
- `npm run test:rules`: não se aplica — a tarefa não toca `firestore.rules`.

## Critérios de aceite

- [x] Versão divergente reabre a tela; versão igual não reabre — testes
      "versão divergente reabre com o texto de atualização" e "versão igual à
      publicada não reabre o passo" em `src/App.atestacao.test.jsx`.
- [x] O texto de atualização não repete a atestação de idade e traz links para
      os dois textos — teste "no reaceite mostra que os textos mudaram, com os
      dois links e sem a atestação de idade" em
      `src/components/Atestacao.test.jsx`; texto em
      `src/components/Atestacao.jsx:41-61`.
- [x] Conta sem campo de versão vê o passo uma vez só — teste "conta sem campo
      de versão reabre uma vez e, depois de gravado, não reabre" em
      `src/App.atestacao.test.jsx`.
- [x] Falha ao gravar o aceite não impede o uso do catálogo — teste "falha ao
      gravar o reaceite libera o catálogo com aviso" em
      `src/App.atestacao.test.jsx`.
- [x] `docs/modelo-memoria.md` descreve a condição nova —
      `docs/modelo-memoria.md` § Estado do App.jsx, linhas de `termosVersao`,
      `politicaVersao` e `precisaReaceitar`.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.
- [ ] Verificação visual com emuladores — pendente (sem navegador no
      ambiente). Roteiro: subir `VERSAO_TERMOS`/`VERSAO_POLITICA` em
      `src/lib/versoesDosTextos.js` para uma data nova, logar com uma conta
      cujo documento já tem as versões antigas e confirmar que o passo aparece
      uma vez só, com o texto de atualização; conferir que os links abrem os
      dois textos e que, após "Li e concordo", o catálogo aparece e um
      recarregamento não reabre mais o passo (a menos que a gravação tenha
      falhado).

## Arquivos alterados

- `src/components/Atestacao.jsx` — prop `motivo` com os dois textos e os links
  das vistas internas.
- `src/App.jsx` — versões carregadas, `precisaReaceitar` derivada e
  `handleConfirmarAceite` com o motivo.
- `src/components/Atestacao.test.jsx` — casos dos dois motivos, links e
  confirmar do reaceite.
- `src/App.atestacao.test.jsx` — reaceite: versão divergente, igual, sem
  versão e falha de gravação.
- `src/App.apagarDados.test.jsx`, `src/App.compartilhar.test.jsx`,
  `src/App.copiar.test.jsx`, `src/App.desfazer.test.jsx`,
  `src/App.exportar.test.jsx`, `src/App.gravacao.test.jsx`,
  `src/App.importar.test.jsx`, `src/App.linkDoCatalogo.test.jsx`,
  `src/App.persistencia.test.jsx`, `src/App.politica.test.jsx`,
  `src/App.termos.test.jsx` — mocks de `carregarColecao` com as versões
  publicadas.
- `docs/interface.md` — § Tela de login com os dois motivos da atestação.
- `docs/modelo-memoria.md` — § Estado do App.jsx com as versões e a condição.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0003-tela-de-reaceite.md`
  — status para `Concluída`.
- `docs/plano/README.md` — linha da tarefa 0003 para `Concluída`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0003-log-tela-de-reaceite.md`
  — este log (novo).
