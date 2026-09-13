<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0011-0005: avatar do usuário como botão do menu

## Data
2026-09-13

## Resumo
O gatilho do popup de ações deixa de ser o botão com o glifo `⋯` e passa a
ser o avatar do usuário (IDR 0024, IDR 0049): a foto da conta Google quando
existe e carrega; a inicial maiúscula do `displayName` quando não há foto ou
a imagem falha; o glifo atual quando não há nome. O popup, o foco, a área de
toque ampliada e os cinco comandos continuam iguais — a única mudança visível
é o desenho do alvo, que passa a identificar a conta autenticada.

`App.jsx` passa `photoURL` e `displayName` do `user` ao `Controles`, que os
repassa ao `MenuDeAcoes` (o único caminho de props até o botão). Em
`MenuDeAcoes.jsx`, o botão ganhou estado `falhouFoto` e escolhe o conteúdo e a
classe pela combinação foto → inicial → glifo; o nome acessível passou a
acrescentar `de <nome>` ao texto de hoje. Em `MenuDeAcoes.css`, a foto é
circular de 30×30px sem borda (`overflow: hidden`) e o fallback de inicial usa
fundo `--panel` com a borda `--gold` do botão atual. `App`/`Controles`
mantiveram o resto intacto. `docs/interface.md` § Cabeçalho, § Controles,
§ Menu de ações e § Medidas passam a descrever o avatar citando os IDRs 0049 e
0024. Nenhum registro novo: as decisões já estavam no IDR 0049 (forma,
fallback e nome acessível) e no IDR 0024 (o avatar como gatilho).

## Discovery
- Código: `App.jsx:43` guarda o `user` do `onAuthStateChanged` e passa os
  callbacks do menu a `Controles` (`App.jsx:497`); `Controles.jsx:165`
  renderiza `MenuDeAcoes`, hoje um único `<button>` com o glifo `⋯` e
  `aria-label` `menu de ações, aberto|fechado` (`MenuDeAcoes.jsx:93`). É o
  único caminho de props até o botão, então `photoURL`/`displayName` precisam
  passar por ele. `MenuDeAcoes.test.jsx` usa RTL + jest-dom e consulta o botão
  por `/menu de ações/`; `App.test.jsx`, `App.copiar/exportar/importar/
  gravacao.test.jsx`, `Controles.test.jsx` e `Cabecalho.test.jsx` fazem o
  mesmo — o nome acessível precisa manter o prefixo `menu de ações` para não
  quebrá-los. O popup, o foco e os cinco comandos ficam intactos.
  Comportamento atual confere com a tarefa.
- Documentação: li o `## Decisão` e o `## Consequências` do IDR 0049 (forma,
  fallback, nome acessível, sem referrer) e do IDR 0024 (o avatar como
  gatilho, o popup inalterado); confirmei que o IDR 0042 já cobre foco e área
  de toque do alvo de 30×30px e que o DDR 0001 libera
  `lh3.googleusercontent.com` no `img-src`. As referências bastaram; nenhum
  registro novo.

## Plano da alteração
1. `src/components/MenuDeAcoes.jsx` — receber `photoURL` e `displayName`;
   mostrar a foto circular quando houver e não tiver falhado, senão a inicial
   maiúscula do nome, senão o glifo; `onError` da imagem cai na inicial; o
   nome acessível do botão acrescenta o nome da conta.
2. `src/components/MenuDeAcoes.css` — foto circular de 30×30px sem borda e
   `overflow: hidden`; botão de fallback com fundo `--panel` e a inicial em
   `--gold`; área de toque e foco inalterados (IDR 0042).
3. `src/components/Controles.jsx` — repassar `photoURL`/`displayName` ao
   `MenuDeAcoes`.
4. `src/App.jsx` — passar `photoURL`/`displayName` do `user` ao `Controles`.
5. `src/components/MenuDeAcoes.test.jsx` — foto aparece; sem foto, inicial;
   sem nome, glifo; falha de carregamento cai na inicial; o alvo abre o popup;
   o nome acessível inclui o nome da conta.
6. `docs/interface.md` — § Cabeçalho, § Controles e § Menu de ações passam a
   citar o avatar como gatilho; § Medidas descreve o avatar de 30×30px
   circular citando os IDRs 0049 e 0024.
- Verificação prevista: cada critério → teste correspondente em
  `MenuDeAcoes.test.jsx`; documentação → leitura; `firebase.json` → busca no
  diff.
- Riscos: manter o prefixo `menu de ações` no nome acessível para não quebrar
  os testes de `App`/`Controles`; o jsdom não dispara `onError` sozinho — o
  teste de falha aciona o evento explicitamente; a foto do Google não é
  carregada no jsdom, sem efeito nos demais testes.
- Desvios: nenhum.

## Decisões tomadas
- Acrescentar `de <nome>` ao nome acessível mantendo o prefixo `menu de ações`,
  em vez de trocá-lo por `avatar...`: preserva as queries por papel dos testes
  existentes e o nome continua dizendo o que o botão faz — nível 1, sem
  registro (a decisão do nome acessível está no IDR 0049).
- Modificador de classe no botão (`--foto`/`--inicial`) em vez de reescrever a
  base: o glifo sem nome segue com o desenho atual; nível 1, sem registro.
- Estado `falhouFoto` que não tenta a foto de novo: o alvo do login é
  substituído por inteiro ao deslogar (o componente desmonta), então não há
  troca de foto sem desmontar — nível 1, sem registro.
- Atualizar também § Controles de `docs/interface.md`, além das três seções
  nomeadas na tarefa, por descrever o mesmo comando à direita da linha —
  nível 1, dentro do escopo de documentação.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 1 warning and 0 errors.` Aviso pré-existente e alheio
  à tarefa: `react(refs)` em `src/components/Catalogo.jsx:195`.
- `npm run test` → `Test Files 35 passed (35)` e `Tests 388 passed (388)`
  (antes: 383; +5 testes desta tarefa). `MenuDeAcoes.test.jsx` (19, antes 14),
  `App.test.jsx` (13), `Controles.test.jsx` (26), `Cabecalho.test.jsx` (9).
- `npm run build` → `✓ built in 520ms`, exit 0. O aviso de chunk > 500 kB é
  pré-existente (bundle do Firebase/SDK).
- `npm run test:rules` → não se aplica: `firestore.rules` não foi tocado.
- `git diff --name-only` → sem `firebase.json`.
- Verificação visual em `npm run dev` → **pendente**: sem navegador no
  ambiente; roteiro abaixo.

## Critérios de aceite
- [x] Com `photoURL`, o botão do menu mostra a foto — teste "com photoURL, o
      botão mostra a foto da conta e abre o popup"
      (`src/components/MenuDeAcoes.test.jsx`), que checa `img.menu-de-acoes__foto`
      com `src` e `referrerpolicy="no-referrer"`.
- [x] Sem foto ou com falha de carregamento, mostra a inicial; sem nome, o
      glifo — testes "sem photoURL, o botão mostra a inicial maiúscula do
      displayName", "sem displayName, o botão mantém o glifo do menu" e "se a
      foto falhar ao carregar, o botão cai na inicial"
      (`src/components/MenuDeAcoes.test.jsx`).
- [x] Um único alvo abre o popup e o nome acessível inclui o nome da conta —
      testes "com photoURL, ... abre o popup" e "o nome acessível do avatar
      inclui o nome da conta" (`src/components/MenuDeAcoes.test.jsx`); o
      clique no único `button` do componente abre o `role="menu"`.
- [x] `firebase.json` não foi alterado — `git diff --name-only` listou só
      `src/` e `docs/`; a CSP já liberava `lh3.googleusercontent.com`
      (DDR 0001).
- [x] `docs/interface.md` descreve o avatar citando os IDRs 0049 e 0024 —
      `docs/interface.md:48-51` (§ Cabeçalho), `:97-99` (§ Controles),
      `:107-108` e `:123` (§ Menu de ações) e `:576-583` (§ Medidas).

## Arquivos alterados
- `src/App.jsx` — passa `photoURL`/`displayName` do `user` ao `Controles`
- `src/components/Controles.jsx` — repassa `photoURL`/`displayName` ao
  `MenuDeAcoes`
- `src/components/MenuDeAcoes.jsx` — avatar (foto/inicial/glifo), `onError` e
  nome acessível com o nome da conta
- `src/components/MenuDeAcoes.css` — foto circular sem borda e fallback da
  inicial
- `src/components/MenuDeAcoes.test.jsx` — 5 testes do avatar
- `docs/interface.md` — § Cabeçalho, § Controles, § Menu de ações e § Medidas
- `docs/plano/0011-refinamento-do-cabecalho/0005-avatar-do-usuario-no-titulo.md` — status
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0011-refinamento-do-cabecalho/logs/0005-log-avatar-do-usuario-no-titulo.md` — este log
