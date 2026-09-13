<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0012-0001: persistência do colapso manual

## Data
2026-09-13

## Resumo
Antes: o estado aberto/fechado das seções vivia num `Set` em memória dentro de
`Catalogo.jsx` e o dos super-grupos num `useState` interno de `SuperGrupo.jsx`;
recarregar a página abria tudo. Depois: o conjunto do que foi fechado à mão
(seções por sigla e super-grupos por letra) é gravado em `localStorage` na
chave `iconula.colapso-manual.v1` e restaurado na abertura; o salto pela faixa
remove do conjunto as seções/super-grupos que abre, de modo que a recarga
mostra o que está na tela.

A persistência foi centralizada em `Catalogo.jsx`, que passa a ser o dono
único do colapso dos dois níveis: `SuperGrupo` deixa de ter estado interno e
passa a ser controlado por `expandida`/`onToggle`, como já acontecia com
`Secao`. O novo módulo `src/lib/colapsoManual.js` lê/grava o conjunto no
`localStorage` com a mesma degradação segura de `preferenciasDeVista.js`
(storage ausente/bloqueado ou JSON inválido → tudo aberto, sem erro). Siglas e
letras desconhecidas são descartadas na leitura.

`MDR 0007` (forma gravada), `MDR 0005` (representação em memória), o índice
`docs/model-dr/README.md`, `docs/modelo-memoria.md` e `docs/modelo-firebase.md`
foram atualizados, porque afirmavam que o colapso era volátil. `docs/interface.md`
§ Controles passa a dizer que o colapso manual é lembrado.

## Discovery
- Código: `Catalogo.jsx:68` guardava `colapsadas` como `Set` de siglas;
  `toggleSecao`/`expandirSecao`/`isExpandida` manipulavam esse `Set` e
  passavam `expandida`/`onToggle` controlados a `Secao`. `SuperGrupo.jsx:67`
  tinha `expandido` em `useState(true)` próprio, exposto por
  `useImperativeHandle(ref, { expandir })`; `Catalogo` guardava um mapa de
  refs (`superGrupoRefs`) e um mapa de handlers (`superGrupoRefHandlers`) para
  saltar. Os comparadores de `memo` (`propsEquivalentes`) de `Secao.jsx:105` e
  `SuperGrupo.jsx:22` não incluíam nenhuma prop de colapso de super-grupo
  porque ele não as tinha. `preferenciasDeVista.js` já estabelece o padrão de
  chave versionada e degradação silenciosa (IDR 0026). Comportamento atual
  confere com a tarefa: o colapso é volátil hoje, como os MDRs 0005/0007
  afirmam — e é isso que a tarefa muda.
- Testes: `Catalogo.test.jsx` cobre colapso de seção e preservação ao trocar
  ordenação, com `localStorage` não limpo entre testes (a persistência exige
  `beforeEach`). `SuperGrupo.test.jsx` exercita o estado interno não
  controlado. `preferenciasDeVista.test.js` é o modelo de teste de storage
  (mock de `getItem`/`setItem` lançando). Nenhum teste usa `expandir()` pelo
  ref.
- Documentação: além das referências, li `docs/model-dr/0005`, `MDR 0007`
  (a observação da delegação), `docs/modelo-memoria.md`,
  `docs/modelo-firebase.md:83`, `docs/interface.md` § Controles, `TDR 0021`
  (memoização) e `IDR 0016` (salto expande o caminho). Divergência
  encontrada: `MDR 0005:36,50`, `MDR 0007:45,54`, `modelo-memoria.md:175` e
  `modelo-firebase.md:83` ainda dizem que o colapso some ao recarregar,
  contrariando os IDRs 0020/0026 (já revisados no planejamento) — atualizados
  nesta tarefa por serem exatamente o estado que ela muda.

## Plano da alteração
1. Criar `src/lib/colapsoManual.js`: chave `iconula.colapso-manual.v1`,
   formato `{secoes: string[], grupos: string[]}`, `lerColapsoManual()` →
   `{secoes: Set, grupos: Set}` (vazio em falha/JSON inválido/não-objeto) e
   `gravarColapsoManual({secoes, grupos})` (falha de escrita silenciosa).
2. `Catalogo.jsx`: trocar o estado para `{secoes: Set, grupos: Set}`
   inicializado por `lerColapsoManual()` filtrando siglas/letras válidas de
   `secoes`; `toggleSecao`/`expandirSecao` passam a operar em `secoes`;
   acrescentar `toggleGrupo`/`expandirGrupo`/`estaExpandidoGrupo` e o mapa
   estável de handlers de grupo; `useEffect` grava a cada mudança; `saltarPara`
   chama `expandirGrupo`; remover `superGrupoRefs`/`superGrupoRefHandlers`.
3. `SuperGrupo.jsx`: remover `forwardRef`/`useImperativeHandle`; aceitar
   `expandida`/`onToggle` controlados com queda para estado interno (como
   `Secao`) e incluir as duas props no comparador de `memo`.
4. Testes: novo `src/lib/colapsoManual.test.js`; em `Catalogo.test.jsx`,
   `beforeEach` limpando o storage e testes de fechar/reabrir com remontagem,
   salto abrindo grupo+seção, storage indisponível e chave desconhecida; em
   `SuperGrupo.test.jsx`, teste do modo controlado.
5. `docs/interface.md` § Controles: reescrever a linha do colapso citando
   IDR 0020/0026; `MDR 0007` e `MDR 0005` ganham a forma/estado persistido e
   `## Histórico`; `modelo-memoria.md` e `modelo-firebase.md` corrigem o
   "volátil"; índices `docs/model-dr/README.md` e status da tarefa.
- Verificação prevista: fechar/recarregar (teste de remontagem), reabrir,
  salto, storage ausente, chave desconhecida; `npm run lint && npm run test &&
  npm run build`; verificação visual do roteiro da tarefa.
- Riscos: `useEffect` gravar na montagem (inofensivo, só o conjunto do
  usuário); mudar `SuperGrupo` para controlado quebrar testes que dependem do
  estado interno (mitigado mantendo a queda não controlada); vazamento de
  `localStorage` entre testes de `Catalogo` (mitigado pelo `beforeEach`).
- Desvios: nenhum no código; o `MDR 0005` e o `modelo-firebase.md` entraram
  além do citado na tarefa por serem divergência do mesmo fato que ela toca
  (a delegação já apontava o MDR 0005).

## Decisões tomadas
- Módulo próprio `src/lib/colapsoManual.js` com chave própria
  (`iconula.colapso-manual.v1`), em vez de ampliar a chave de
  `preferenciasDeVista.js`: o colapso é conjunto de strings, sem padrões por
  faixa de tela, e a validação por domínio existente não se aplica (nível 1).
- Estado do super-grupo sobe para `Catalogo`, que centraliza o colapso dos
  dois níveis e a persistência; `SuperGrupo` vira controlado (nível 1).
- Forma gravada e estado documentados no `MDR 0007` e no `MDR 0005`, em vez
  de criar TDR (a tarefa permitia qualquer um dos dois; nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (o aviso `react(refs)` que o
  TDR 0021 registrava sobre o mapa de `ref` de `SuperGrupo` desapareceu junto
  com o mapa, e o ref não existe mais).
- `npm run test` → `Test Files 36 passed (36)`, `Tests 404 passed (404)`.
  `src/lib/colapsoManual.test.js` (9) e `src/components/SuperGrupo.test.jsx`
  (7, com o novo caso controlado) verdes; `Catalogo.test.jsx` de 17 para 23
  (seis testes novos de persistência). Os avisos de `act` em
  `App.gravacao.test.jsx`/`App.importar.test.jsx`/`App.copiar.test.jsx`/
  `App.exportar.test.jsx` são pré-existentes (Avisos atualiza fora de `act`),
  não vêm destas mudanças.
- `npm run build` → `✓ 131 modules transformed`, `✓ built in 1.11s`. O aviso
  de chunk >500 kB é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] Seção e super-grupo fechados à mão continuam fechados após recarregar —
  `Catalogo.test.jsx` "seção fechada à mão continua fechada após recarregar" e
  "super-grupo fechado à mão continua fechado após recarregar" (remontagem).
- [x] Reaberto à mão, continua aberto após recarregar — `Catalogo.test.jsx`
  "seção reaberta à mão continua aberta após recarregar".
- [x] Salto abre seção e super-grupo fechados e a recarga os mostra abertos —
  `Catalogo.test.jsx` "salto abre seção e super-grupo fechados e a recarga os
  mantém abertos".
- [x] Sem `localStorage` disponível, tudo abre e nada quebra —
  `Catalogo.test.jsx` "sem localStorage disponível, tudo abre e nada quebra" e
  `colapsoManual.test.js` com `getItem`/`setItem` lançando.
- [x] Nenhuma requisição de rede nova — `src/lib/colapsoManual.js` só usa
  `window.localStorage`; nenhum import de Firestore (busca no arquivo).
- [x] `docs/interface.md` § Controles descreve a persistência citando os IDRs
  0020 e 0026 — linha reescrita no § Controles.
- [ ] Verificação visual em `npm run dev` — pendente, sem navegador
  autenticável neste ambiente. Roteiro: (1) fechar duas seções e um
  super-grupo, recarregar e conferir que continuam fechados; (2) reabrir uma
  delas, recarregar e conferir aberta; (3) fechar uma seção dentro de um
  super-grupo fechado, saltar pela faixa até ela, recarregar e conferir os dois
  abertos; (4) navegação privada (storage bloqueado) abre tudo sem erro no
  console.

## Arquivos alterados
- `src/lib/colapsoManual.js` — novo; lê/grava o conjunto de colapso no
  `localStorage` com degradação silenciosa.
- `src/components/Catalogo.jsx` — estado do colapso vira `{secoes, grupos}` lido
  do storage, gravação a cada mudança, helpers de grupo, `saltarPara` expande
  grupo+seção pelo estado (sem refs de super-grupo).
- `src/components/SuperGrupo.jsx` — colapso controlado por `expandida`/
  `onToggle` (com queda para estado interno); sem `forwardRef`; comparador
  atualizado.
- `src/lib/colapsoManual.test.js`, `src/components/Catalogo.test.jsx`,
  `src/components/SuperGrupo.test.jsx` — testes da persistência.
- `docs/interface.md` § Controles — texto da persistência do colapso.
- `docs/model-dr/0007-persistencia-no-armazenamento-local.md` — nova seção da
  chave de colapso, Consequências, Alternativas e Histórico.
- `docs/model-dr/0005-representacao-em-memoria-na-spa.md` — estado do colapso
  persistido, Consequências e Histórico.
- `docs/model-dr/README.md` — resumos dos MDRs 0005 e 0007.
- `docs/modelo-memoria.md` — seção Colapso manual, voláteis e persistentes.
- `docs/modelo-firebase.md` — preferências + colapso no `localStorage`.
- `docs/plano/README.md` e arquivo da tarefa — status.
