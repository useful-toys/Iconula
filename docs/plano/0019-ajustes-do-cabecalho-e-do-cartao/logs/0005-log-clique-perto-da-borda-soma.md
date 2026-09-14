<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0005: clique perto da borda do cartão soma

## Data
2026-09-14

## Resumo
Antes: o próprio botão do cartão (`.figurinha__corpo`) encolhia no `:active`
(`transform: scale(0.92)`, transição de 60ms) — a caixa que recebe o ponteiro
diminuía no instante do pressionar, e perto da borda o soltar caía fora dela,
de modo que o navegador não gerava o `click` e a unidade não era somada.
Depois: a pintura do cartão (fundo, borda, raio e opacidade do estado) e a
escala do toque passam para um `<span class="figurinha__visual">` dentro do
botão; o botão mantém o tamanho e a área de hit-test o tempo todo, e o cartão
continua encolhendo e voltando com o mesmo efeito percebido. Pressão longa,
escurecimento da espera e supressão do clique após o gesto seguem intactos.
A descoberta entra no `## Contexto` do IDR 0042 e a mudança no `## Histórico`.

## Discovery
- Código: `src/components/Figurinha.css` é a fonte da verdade do cartão
  (IDR 0047). `.figurinha__corpo` (`Figurinha.css:28-49`) concentra o layout
  flex e a pintura (border, border-radius, transição de transform) e
  `.figurinha__corpo:active` (`Figurinha.css:53-55`) aplica `scale(0.92)`. Os
  estados pintam direto no corpo (`Figurinha.css:124-143`: color, background,
  border, opacity). `.figurinha` (`Figurinha.css:3-9`) é `position: relative` —
  é ele o bloco de contenção de `.figurinha__metalizada` (top/right 3px) e do
  `.figurinha__selo` (−6px no canto), não o botão. `src/theme.css:116-124` fixa
  `box-sizing: border-box` global, então mover a borda de 2px para o wrapper
  não muda a medida externa. `Figurinha.jsx:191-249` monta o botão com os
  filhos visuais (metalizada, código, nome, selo) e o `.figurinha__menos` como
  irmão; `corpoRef` e o foco programático (`Figurinha.jsx:241`) apontam para o
  botão e não mudam. Nenhuma outra regra ou componente estiliza
  `.figurinha__corpo`. Comportamento atual confere com a tarefa (a escala está
  no elemento que recebe o clique).
- Testes: `Figurinha.test.jsx` cobre o clique que soma
  (`Figurinha.test.jsx:111-126`), a pressão longa que decrementa sem somar
  (`Figurinha.test.jsx:570-582`), rótulos acessíveis e estados. Nenhum teste lê
  `:active` nem layout (jsdom não avalia pseudo-classe de ativação); os testes
  usam `container.querySelector('.figurinha__corpo')` e rótulos, que
  permanecem. A estrutura nova precisa manter esses seletores e rótulos.
- Convenções locais: comentários citam o IDR entre parênteses; a pintura do
  estado fica em regras próprias por classe `.figurinha--*`; o `:active` é a
  única transição de transform do cartão.
- Impactos fora de "Arquivos impactados": nenhum. `docs/interface.md:695-696`
  descreve só o efeito ("encolhe e volta, `scale(0.92)`, 60ms"), não o
  seletor, e continua correto.
- Documentação: reli o IDR 0042 (§ Contexto, § Decisão — em especial o
  parágrafo "Retorno de toque no cartão", que nomeia `.figurinha__corpo:active`
  — e § Consequências) e o IDR 0051 (§ Decisão, gesto que não pode mudar). Reli
  `docs/interface.md` § Figurinha (`interface.md:695-696`). As referências
  bastaram; o texto da § Decisão do IDR 0042 nomeia o seletor antigo e precisa
  acompanhar a mudança para não contradizer o código.

## Plano da alteração
1. `src/components/Figurinha.jsx` — envolver os filhos visuais do botão
   (metalizada, código, nome, selo) num `<span className="figurinha__visual"
   aria-hidden="true">`; o botão, os rótulos, os manipuladores e o `corpoRef`
   não mudam.
2. `src/components/Figurinha.css` — `.figurinha__corpo` deixa de ser flex e de
   pintar (sem border, fundo transparente, sem transição de transform);
   `.figurinha__visual` vira `position: absolute; inset: 0`, recebe o flex, a
   borda de 2px, o raio de 5px e a transição; a escala passa a
   `.figurinha__corpo:active .figurinha__visual`. As regras de estado
   (`.figurinha--faltante/colada/repetida`) passam a pintar
   `.figurinha__visual`.
3. `docs/idr/0042-foco-visivel-e-area-de-toque.md` — § Contexto: registrar a
   descoberta (escala no `:active` do próprio botão perde o `click` perto da
   borda); § Decisão: o parágrafo do retorno de toque passa a nomear o
   elemento visual interno; § Histórico: entrada datada.
4. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (sem escala no alvo do clique) → busca por `scale(` em
    `Figurinha.css` e leitura do trecho (a regra é
    `.figurinha__corpo:active .figurinha__visual`);
  - critério 2 (cartão continua encolhendo) → verificação visual (pendente,
    sem navegador) com roteiro;
  - critério 3 (clique soma; pressão longa decrementa sem somar) →
    `npm run test` em `Figurinha.test.jsx`;
  - critério 4 (IDR 0042 com a descoberta e o histórico) → leitura das seções.
- Riscos: a posição de metalizada e selo era relativa a `.figurinha`
  (`position: relative`), mas o botão não tinha `position`; com o wrapper
  absoluto eles passam a se posicionar relativo a ele, que ocupa o cartão
  inteiro (`inset: 0`) — as coordenadas não mudam. O outline de
  `:focus-visible` continua no botão e não no wrapper, mantendo o realce
  externo. jsdom não avalia `:active`, então nenhum teste quebra.
- Desvios: nenhum.

## Decisões tomadas
- **Pintura e escala num filho visual do botão** (`.figurinha__visual`), em
  vez de escalar o próprio botão: é a forma de manter o efeito percebido sem
  encolher a caixa de hit-test. Contorno previsto pela tarefa ("um elemento
  visual dentro dele (ou equivalente)"), sem novo registro (nível 1).
- **Wrapper `position: absolute; inset: 0`** para não alterar layout nem as
  coordenadas de metalizada/selo, que passam a se referenciar a ele (nível 1).
- **Sem teste novo**: a falha é de geometria/hit-test que o jsdom não
  reproduz; os testes existentes de clique e pressão longa provam que o
  comportamento se mantém (nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 44ms on 73
  files with 105 rules using 4 threads.`
- `npm run test` → `Test Files 37 passed (37)`, `Tests 449 passed (449)`;
  `src/components/Figurinha.test.jsx` passou com 31 testes, incluindo "incrementa
  ao clicar no cartão" e "toque de 500ms decrementa uma vez e não soma ao
  soltar".
- `npm run build` → `✓ built in 721ms`. O aviso de chunk >500 kB
  (`index.esm-DyenrGhE.js`, 505,90 kB) é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] Nenhuma transformação de escala no próprio elemento que recebe o clique —
      busca em `Figurinha.css`: `transform: scale(0.92)` só em
      `.figurinha__corpo:active .figurinha__visual` (`Figurinha.css:67-68`), um
      filho do botão; `.figurinha__corpo` não tem `transform`.
- [ ] O cartão continua encolhendo e voltando ao toque — verificação visual
      pendente (sem navegador autenticável), roteiro abaixo.
- [x] Clique soma e pressão longa decrementa sem somar — `npm run test`:
      `Figurinha.test.jsx` 31 testes verdes, com "incrementa ao clicar no
      cartão" e "toque de 500ms decrementa uma vez e não soma ao soltar".
- [x] IDR 0042 com a descoberta no contexto e entrada no histórico —
      § Contexto com o parágrafo do `click` perdido perto da borda
      (`0042:26-32`); § Histórico com a entrada de 2026-09-14 (Tarefa
      0019-0005); § Decisão nomeia o elemento visual interno (`0042:62-66`).

Verificação visual pendente (sem navegador autenticável), roteiro: em
`npm run dev`, na lista e no álbum, clicar a 1–3px de cada borda de um cartão
e conferir que soma; clicar no centro e conferir o encolhimento e a volta;
em emulação de toque, segurar 500ms e conferir o decremento.

## Arquivos alterados
- `src/components/Figurinha.jsx` — os filhos visuais do botão passam a viver
  num `<span class="figurinha__visual" aria-hidden="true">`; botão, rótulos,
  manipuladores e `corpoRef` inalterados.
- `src/components/Figurinha.css` — `.figurinha__corpo` deixa de ser flex e de
  pintar; `.figurinha__visual` (`position: absolute; inset: 0`) recebe o flex,
  a borda, o raio e a transição; a escala vai para
  `.figurinha__corpo:active .figurinha__visual`; os estados
  (`.figurinha--faltante/colada/repetida`) passam a pintar
  `.figurinha__visual`.
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — § Contexto (descoberta do
  `click` perdido perto da borda), § Decisão (escala no elemento visual
  interno) e § Histórico (entrada de 2026-09-14).
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0005-clique-perto-da-borda-soma.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/logs/0005-log-clique-perto-da-borda-soma.md`
  — este log.

