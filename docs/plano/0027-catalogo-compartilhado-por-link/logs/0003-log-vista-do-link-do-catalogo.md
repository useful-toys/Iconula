<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0027-0003: vista do link do catálogo

## Data
2026-09-16

## Resumo
`/catalogo/<uid>` abre a vista somente leitura do catálogo do dono, sem login
e antes da guarda de login, com uma leitura do documento, os estados de
carregando, não compartilhado e falha, e as preferências lidas sem gravação.
`colecaoRemota.js` ganha `carregarCatalogoCompartilhado`, que lê `users/{uid}`
sem sessão e distingue `compartilhado` (contagens e `updatedAt`),
`nao-compartilhado` (permissão negada ou documento inexistente) e `erro`,
sem expor `atestadoEm`. `App.jsx` passa a ler `location.pathname` na abertura
(depois das vistas internas e antes de `!auth`/`!authResolvido`/`!user`/
atestação) e, no caminho do link, renderiza o componente novo
`CatalogoCompartilhado.jsx`, que não usa a sessão: não carrega a coleção do
visitante, não grava preferências e não ajusta cartões. `docs/interface.md`,
`docs/arquitetura.md` e `AGENTS.md` refletem a vista.

## Discovery

- Código: `App.jsx` concentra o estado e decide a tela por ramos de retorno
  (`vistaInterna` antes de tudo, depois `!auth`, `!authResolvido`, `!user`,
  atestação, tela principal). Não há leitura de `location`/`pathname`/
  `history` em lugar nenhum do `src` hoje — o caminho `/catalogo/<uid>` é o
  primeiro endereço próprio (TDR 0020). `colecaoRemota.js` é o único módulo
  que toca o SDK do Firestore (ADR 0005), com `obterFirestore` memoizado,
  `comAvisoDeEspera` (~5s) e resultados discriminados que nunca lançam;
  `carregarColecao` devolve `encontrado`/`vazio`/`erro`/`indisponivel`.
  `Catalogo`, `Cabecalho`, `Controles`, `Figurinha` já aceitam a forma
  somente leitura (Tarefa 0027-0002): `onAjustar` opcional, `gravarColapso`,
  `somenteLeitura` e `tituloComoLink`. `Rodape` recebe `onAbrirPolitica` e
  `onAbrirTermos`; `Avisos` lê a fila global. As preferências de vista
  (`preferenciasDeVista.js`) são lidas com `lerPreferenciasDeVista` e
  gravadas por `App.jsx` num `useEffect`; na vista do link a gravação precisa
  ser suprimida. Os testes de `App` mockam `./lib/colecaoRemota.js` e
  `./components/Catalogo.jsx` (Vitest tolera export ausente no mock — os
  mocks atuais já omitem `gravarImportacao`/`gravarAtestacao` e a suíte está
  verde), então os arquivos existentes não precisam de alteração. O
  comportamento atual confere com a tarefa; impacto fora dos arquivos
  citados: nenhum.
- Documentação: além das referências, li `docs/idr/0020` (colapso manual
  persistido), `docs/interface.md` § Tela principal, § Avisos, § Demais
  telas e § Pendências, e `docs/arquitetura.md` § Visão geral, § Camadas no
  cliente, § Dados e fluxo. As referências bastaram para os textos; a
  descrição dos `docs/*.md` na tarefa foi seguida.

## Plano da alteração
1. `src/lib/colecaoRemota.js`: `carregarCatalogoCompartilhado(uid,
   { aoEsperar })` — `getDoc` de `users/{uid}` sem exigir sessão, mesmo
   contrato discriminado de `carregarColecao` (inclui `comAvisoDeEspera` e
   `indisponivel`); `compartilhado` só com `linkAtivo == true` (para o dono
   ver o mesmo que o visitante — IDR 0055), `nao-compartilhado` para
   documento inexistente ou `linkAtivo` ausente/falso e para
   `permission-denied`, `erro` para o resto; sem `atestadoEm` no retorno.
2. `src/components/CatalogoCompartilhado.jsx` (+ `.css`): componente novo
   (decisão de nível 1) que recebe `uid`, `onAbrirPolitica` e `onAbrirTermos`;
   carrega uma vez ao montar, com `aoEsperar` virando aviso dourado e falha
   virando aviso vermelho `Falha ao carregar o catálogo — toque para
   detalhes`; estados carregando (`.app` vazio, IDR 0035), não compartilhado
   (`Este catálogo não está compartilhado.` + `Conhecer o Iconula` + rodapé)
   e compartilhado (cabeçalho com `somenteLeitura`/`tituloComoLink`, placar,
   relógio, faixa e tooltip; controles sem desfazer; catálogo sem `onAjustar`
   e com `gravarColapso={false}`; avisos; rodapé). Ordenação, disposição e
   filtro vêm de `lerPreferenciasDeVista` e mudam só em memória.
3. `src/App.jsx`: helper `extrairAlvoDoCatalogo(caminho)` (só
   `/catalogo/<uid>` de um segmento não vazio; demais formatos sob
   `/catalogo/` viram `{ uid: null }` — premissa conservadora, nível 2) e
   ramo do link logo após as vistas internas e antes de `!auth`; os efeitos
   de carga da coleção e de gravação de preferências pulam quando o alvo do
   link está ativo.
4. Testes: `describe` novo em `src/lib/colecaoRemota.test.js` (uma leitura,
   compartilhado sem `atestadoEm`, `linkAtivo` ausente/falso, inexistente,
   `permission-denied`, erro, indisponível, espera sem rede) e
   `src/App.catalogoCompartilhado.test.jsx` (sem sessão; dono logado; não
   compartilhado e inexistente; erro com aviso; uma leitura e nenhuma carga
   da coleção do visitante; nenhuma gravação de preferência; cartões inertes
   e colapso não gravado; nenhum nome/foto/e-mail; `/` segue a guarda).
5. `docs/interface.md` (IDR 0055, TDR 0020), `docs/arquitetura.md` (IDR 0055,
   MDR 0002, TDR 0020) e `AGENTS.md` § Onde fica cada coisa.
- Verificação prevista: cada critério pelos novos `it`; regressão por
  `npm run lint && npm run test && npm run build` (sem tocar `firestore.rules`,
  `test:rules` não se aplica); roteiro visual pendente se não houver ambiente.
- Riscos: (a) o `useEffect` de preferências do `App` gravar na vista do link
  — mitigado com a guarda do alvo; (b) a carga da coleção do dono logado
  disparar leitura extra — mitigada com a mesma guarda; (c) `Catalogo`
  memoizado com props inertes — já coberto pela Tarefa 0027-0002.
- Desvios: nenhum.

## Decisões tomadas
- Vista num componente novo, `CatalogoCompartilhado.jsx`, e não como ramo de
  `App.jsx` — nível 1 previsto na tarefa; evita entrelaçar as contagens do
  link com as da sessão e mantém o `App` decidindo só o caminho.
- `uid` vazio ou barra final (`/catalogo/`, `/catalogo/<uid>/`) tratados como
  não compartilhado, sem leitura — nível 2, premissa conservadora da tarefa.
- `compartilhado` só com `linkAtivo == true` também para o dono — nível 1,
  para o dono ver exatamente o que o visitante vê (IDR 0055).
- Falha de leitura (`erro` ou `indisponivel`) cai na tela de não
  compartilhado somada ao aviso de falha, como a tarefa descreve para `erro`.
- Nome `carregarCatalogoCompartilhado` e status `nao-compartilhado` — nível 1
  (API interna do módulo).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
> oxlint

Found 0 warnings and 0 errors.
Finished in 64ms on 87 files with 105 rules using 4 threads.
```

### `npm run test`
```
 Test Files  42 passed (42)
      Tests  548 passed (548)
```
Os 527 testes anteriores seguem verdes; os 21 novos passam (11 em
`colecaoRemota.test.js`, 10 em `App.catalogoCompartilhado.test.jsx`).

### `npm run build`
```
dist/assets/index-BROuy_9T.css   47.62 kB │ gzip:   7.94 kB
dist/assets/index-Poog8Olz.js   444.22 kB │ gzip: 136.40 kB
✓ built in 536ms
```
`exit=0`. O aviso de chunk > 500 kB (`index.esm`, o SDK do Firestore sob
demanda) é pré-existente, sem relação com a tarefa.

### `npm run test:rules`
Não se aplica: a tarefa não toca `firestore.rules`.

### Verificação visual
`pendente` — sem navegador/emulador neste ambiente. Roteiro (Validação
adicional da tarefa): `npm run dev` com o emulador (`test:e2e:dev` ou
`VITE_USE_FIREBASE_EMULATOR`) e um documento com `linkAtivo: true` gravado
pela fixture; abrir `/catalogo/<uid>` numa janela anônima e conferir
cabeçalho (placar, relógio, rótulo `somente leitura`, título como link),
controles sem desfazer, disposição álbum, faixa de bandeiras com tooltip e
cartões inertes.

## Critérios de aceite
- [x] `/catalogo/<uid>` sem sessão mostra o catálogo do dono em somente
      leitura, sem tela de login nem atestação — "sem sessão,
      /catalogo/<uid> mostra o catálogo do dono em somente leitura"
      (`src/App.catalogoCompartilhado.test.jsx`): cartões sem `onAjustar`,
      sem botão do Google e sem botão "Confirmar"
- [x] O dono logado abrindo o próprio link vê a mesma vista — "o dono
      logado abrindo o próprio link vê a mesma vista, sem carga da coleção
      própria" (`src/App.catalogoCompartilhado.test.jsx`)
- [x] Desligado e inexistente mostram `Este catálogo não está
      compartilhado.` com `Conhecer o Iconula`; erro soma o aviso de falha —
      "link desligado…", "uid inexistente…" e "falha de leitura soma o aviso
      de falha à mesma tela, com o detalhe técnico"
      (`src/App.catalogoCompartilhado.test.jsx`); a origem de cada estado em
      `src/lib/colecaoRemota.test.js` (`nao-compartilhado` para `linkAtivo`
      ausente/falso, documento inexistente e `permission-denied`; `erro`
      para o resto)
- [x] Uma única chamada de leitura por abertura, sem carga da coleção do
      visitante (teste com contagem de chamadas) — os dois primeiros testes
      de `src/App.catalogoCompartilhado.test.jsx` afirmam
      `carregarCatalogoCompartilhado` chamada 1× e `carregarColecao` nunca;
      "lê exatamente um documento por abertura" em
      `src/lib/colecaoRemota.test.js`
- [x] Trocar ordenação, disposição, filtro ou colapso na vista não grava no
      `localStorage` — "trocar ordenação, disposição, filtro ou colapso não
      grava preferência" (`src/App.catalogoCompartilhado.test.jsx`), que
      afirma a chave ausente e `gravarColapso === false`; a não gravação do
      colapso em si é a "com gravarColapso=false, alternar o colapso não
      chama gravarColapsoManual" (`src/components/Catalogo.test.jsx`,
      Tarefa 0027-0002)
- [x] Nenhum nome, foto ou e-mail na vista — "não mostra nome, foto nem
      e-mail do dono" (`src/App.catalogoCompartilhado.test.jsx`)
- [x] `/` segue a guarda de login como antes — "caminho / segue a guarda de
      login como antes" (`src/App.catalogoCompartilhado.test.jsx`) e os
      testes existentes de `App` verdes (42 arquivos, 548 testes)
- [x] `docs/interface.md`, `docs/arquitetura.md` e `AGENTS.md` atualizados
      nas seções indicadas, citando os registros — § Demais telas
      ("Catálogo compartilhado") e § Avisos em `docs/interface.md` (IDR 0055,
      TDR 0020, IDR 0026, IDR 0035); § Visão geral, § Camadas no cliente e
      § Dados e fluxo em `docs/arquitetura.md` (IDR 0055, MDR 0002, TDR 0020);
      § Onde fica cada coisa em `AGENTS.md`

## Arquivos alterados
- `src/lib/colecaoRemota.js` — `carregarCatalogoCompartilhado`, leitura do
  link sem sessão e sem expor `atestadoEm`
- `src/components/CatalogoCompartilhado.jsx` — componente novo da vista
- `src/components/CatalogoCompartilhado.css` — tela de não compartilhado
- `src/App.jsx` — leitura de `location.pathname`, ramo do link e guardas da
  carga/preferências
- `src/lib/colecaoRemota.test.js` — testes da função nova
- `src/App.catalogoCompartilhado.test.jsx` — testes de integração da vista
- `docs/interface.md` — § Demais telas e § Avisos
- `docs/arquitetura.md` — § Visão geral, § Camadas no cliente e § Dados e fluxo
- `AGENTS.md` — § Onde fica cada coisa
- `docs/plano/README.md`, `docs/plano/0027-catalogo-compartilhado-por-link/0003-vista-do-link-do-catalogo.md`
  — status
