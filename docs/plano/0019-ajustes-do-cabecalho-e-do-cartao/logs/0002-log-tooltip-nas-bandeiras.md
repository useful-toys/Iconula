<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0002: tooltip nas bandeiras, com sigla, nome e progresso

## Data
2026-09-14

## Resumo
A faixa de bandeiras passa a identificar a seção e o seu placar sem obrigar o
salto: passar o mouse (depois de ~400ms) ou chegar por teclado mostra, logo
abaixo da bandeira, um único tooltip com `BRA · Brasil · 12/20 · 60% · ▢8 ·
×3` — sigla, nome e progresso na notação compacta dos títulos. Tocar continua
saltando e nunca abre o tooltip.

Antes, a faixa era um `<nav class="faixa-de-secoes">` rolável direto; agora o
contêiner raiz é um `<div class="faixa-de-secoes">` (flex-item de 100% no
cabeçalho) com a rolagem numa trilha interna (`__trilha`) e o tooltip fora
dela. Foi preciso separar a rolagem do contêiner externo porque o
`overflow: hidden` da faixa recortaria qualquer `::after`/elemento posicionado
dentro dela (IDR 0052). Como o posicionamento depende de JS, o tooltip é um
único `position: fixed`, medido e preso à largura da janela.

O progresso por seção nasce em `App.jsx` (`placarPorSecao`, um `Map` sigla →
placar por `calcularPlacar`), é repassado pelo `Cabecalho` e lido pela faixa
enquanto o tooltip está visível — o texto acompanha a contagem vigente sem
estado próprio. `docs/interface.md` ganhou o item do tooltip no § Cabeçalho, a
camada intermediária no § Camadas e a medida no § Medidas.

## Discovery
- Código: `FaixaDeSecoes.jsx` renderiza um `<nav class="faixa-de-secoes">`
  rolável (`overflow-x: auto`, `overflow-y: hidden`) com 50 botões, cada um
  com `aria-label="Saltar para {nome}"` e `onClick` que chama `onSaltar`. A
  faixa recebe `secoes`/`ordenacao` de `Cabecalho`, que as recebe de
  `App.jsx` (`secoesOrdenadas` memoizado por `ordenacao`). `App.jsx` guarda
  `contagens` e já calcula o placar global com `calcularPlacar`
  (`src/lib/progresso.js`); o progresso por seção pode sair da mesma função,
  sobre os códigos da seção. `src/data/catalogo.js` dá `secao.total` (20 nas
  seleções e no FWC, 14 no COC) e cada `figurinha` traz `secao` (sigla), o
  que permite agrupar os códigos por seção uma única vez. `Secao.jsx` mostra
  a notação compacta `12/20 · 60% · ▢8 · ×3` no título, mas a identificação
  lá é `nome sigla página`; o IDR 0052 pede `SIGLA · Nome`. O tooltip de
  referência (`.controles__opcao::after`, `Controles.css`) é um `::after`
  puro-CSS com `top: calc(100% + 6px)`, `z-index: 20`, 11px/600, raio 6px e
  atraso de 0.4s no `:hover` (sob `@media (hover: hover)`) e imediato no
  `:focus-visible`. `Cabecalho.css` faz `.cabecalho .faixa-de-secoes {
  flex-basis: 100% }` e usa `overflow` recortando descendentes; o
  `Cabecalho` é `position: sticky; z-index: 10` (sem `transform`), e o menu
  de ações usa `z-index: 30`. Comportamento atual confere com a tarefa (não
  há tooltip algum hoje). Impactos fora de "Arquivos impactados": nenhum;
  nenhum teste consulta a estrutura interna da faixa além das classes dos
  botões e do `role="navigation"`, que permanecem (o `role` passou para a
  trilha interna, mas continua acessível pelo mesmo nome).
- Documentação: lidos `docs/idr/0052`, `docs/idr/0048`, `docs/tdr/0021` e
  `docs/interface.md` § Cabeçalho, § Controles, § Menu de ações, § Camadas,
  § Wireframe da tela principal e § Medidas. As referências bastaram para o
  conteúdo, o visual, os gatilhos e o mecanismo; a § Camadas confirma que o
  cabeçalho (10) fica abaixo do menu (30), faixa em que o tooltip entra.

## Plano da alteração
1. `src/App.jsx`: agrupar os códigos de `figurinhas` por `secao` uma única
   vez (constante de módulo) e memoizar `placarPorSecao` (um `Map`
   sigla → `{ coladas, faltantes, repetidas, percentual }` via
   `calcularPlacar`) sobre `contagens`; passar ao `Cabecalho`.
2. `src/components/Cabecalho.jsx`: receber `placarPorSecao` e repassá-lo à
   `FaixaDeSecoes`.
3. `src/components/FaixaDeSecoes.jsx`: novo contêiner raiz
   `.faixa-de-secoes` (flex-item de 100%) contendo o `<nav
   class="faixa-de-secoes__trilha">` rolável e, fora dele, um único
   `.faixa-de-secoes__tooltip` (`aria-hidden`, `position: fixed`,
   `z-index: 20`) posicionado por JS abaixo da bandeira e preso à viewport.
   Gatilhos: `pointerenter` de mouse agenda ~400ms; `focus` por teclado
   mostra na hora (via `:focus-visible`, com fallback para ausência de
   `pointerdown`); `pointerleave`/`blur`, `scroll` (captura, cobre faixa e
   página) e o clique de salto escondem; toque nunca mostra (guarda por
   `pointerType`).
4. `src/components/FaixaDeSecoes.css`: mover a rolagem e as barras de
   rolagem para `__trilha`; estilo do tooltip no visual do IDR 0048.
5. Testes: `FaixaDeSecoes.test.jsx` com texto/sigla/nome/progresso, atraso
   do hover, foco imediato, saída/blur, toque, FWC/COC, tooltip único fora
   da trilha e salto preservado; `Cabecalho.test.jsx` com o progresso
   repassado até o tooltip.
6. `docs/interface.md` § Cabeçalho, § Camadas e § Medidas, citando o
   IDR 0052.
- Verificação prevista: testes novos; busca do tooltip fora da trilha;
  critério visual (clamp nas pontas) dependente de navegador → pendente com
  roteiro.
- Riscos: sem navegador, a conferência do clamp e do empilhamento é visual
  pendente; o gatilho por `pointerenter` precisou ser validado no jsdom
  (confirmado, ver validação).
- Desvios: nenhum.

## Decisões tomadas
- Progresso por seção pré-calculado em `App.jsx` (`Map` sigla → placar) e
  repassado por `Cabecalho`, em vez de passar `contagens` à faixa e
  recalcular no componente — nível 1, sem registro; mantém a faixa simples e
  o `calcularPlacar` como única fonte.
- Mecanismo dos gatilhos com um único elemento `position: fixed` e
  posicionamento por JS medido no layout, preso à viewport — nível 1, dentro
  da exceção já registrada no IDR 0052; já previsto como "Decisões em aberto
  nesta tarefa".
- Hover por `onPointerEnter`/`onPointerLeave` com guarda `pointerType ===
  'mouse'`, e foco por teclado reconhecido por `:focus-visible` (quando o
  ambiente suporta o seletor) ou pela ausência de `pointerdown` — nível 1,
  sem registro; é o "como" do gatilho, já decidido no IDR 0052.
- Nome acessível da bandeira (nível 2): mantido o atual `Saltar para {nome}`,
  premissa conservadora; o tooltip é `aria-hidden` e não entra na árvore de
  acessibilidade, como no IDR 0048.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 50ms on 73
  files with 105 rules using 4 threads`.
- `npm run test` → `Test Files 37 passed (37)` / `Tests 449 passed (449)`.
  (Subiu de 440 para 449: 8 testes novos em `FaixaDeSecoes.test.jsx` e 1 em
  `Cabecalho.test.jsx`.)
- `npm run build` → `✓ built in 704ms` (aviso pré-existente de chunk >
  500 kB no `index.esm`, 505.9 kB, sem relação com esta tarefa).
- `npm run test:rules` não se aplica (`firestore.rules` intocado).
- Busca `0052` em `docs/interface.md` → linhas 71 (§ Cabeçalho), 317
  (§ Camadas) e 662 (§ Medidas).
- Busca `overflow`/`__trilha`/`__tooltip` em `FaixaDeSecoes.css` → a
  rolagem (`overflow-x`/`overflow-y`) fica só na `__trilha`; o tooltip é uma
  regra separada, fora dela.
- Teste "renderiza um único tooltip, fora do contêiner rolável da faixa"
  confirma um só elemento e que ele não é descendente da `__trilha`.

## Critérios de aceite
- [x] Tooltip com `SIGLA · Nome` e o progresso na notação dos títulos,
      inclusive FWC e COC — `src/components/FaixaDeSecoes.test.jsx` ("mostra
      no foco por teclado a sigla…", "identifica os especiais…").
- [x] Hover mostra depois de ~400ms, foco por teclado na hora, toque nunca;
      some ao sair, ao perder o foco e ao rolar — `FaixaDeSecoes.test.jsx`
      ("no hover de mouse aparece só depois do atraso", "não mostra o tooltip
      enquanto o ponteiro é de toque", "some ao sair o ponteiro e ao perder o
      foco", "some ao rolar a página").
- [x] Um único elemento de tooltip, fora do contêiner rolável —
      `FaixaDeSecoes.test.jsx` ("renderiza um único tooltip, fora do
      contêiner rolável da faixa") e busca em `FaixaDeSecoes.css`.
- [ ] Tooltip inteiro, sem corte, contido na janela nas bandeiras das pontas
      — verificação visual pendente (sem navegador); roteiro abaixo.
- [x] Clique na bandeira continua saltando — teste existente ("chama
      onSaltar com a sigla ao clicar em um botão") e novo ("mantém o clique
      saltando e esconde o tooltip").
- [x] `docs/interface.md` § Cabeçalho, § Camadas e § Medidas citando o
      IDR 0052 — linhas 71, 317 e 662.

Roteiro visual (pendente): em `npm run dev`, a 1440px e 768px, passar o mouse
na primeira, numa do meio e na última bandeira (tooltip inteiro, sem corte,
preso à janela nas pontas); Tab até a faixa (aparece na hora) e Tab para fora
(some); rolar a faixa e a página com o tooltip aberto (some); ajustar uma
figurinha com o tooltip aberto e conferir o progresso atualizado; repetir nas
duas ordenações.

## Arquivos alterados
- `src/App.jsx` — agrupamento dos códigos por seção e `placarPorSecao`
  memoizado, passado ao `Cabecalho`.
- `src/components/Cabecalho.jsx` — recebe e repassa `placarPorSecao` à faixa.
- `src/components/FaixaDeSecoes.jsx` — contêiner raiz + trilha rolável,
  tooltip único posicionado por JS e os gatilhos.
- `src/components/FaixaDeSecoes.css` — rolagem movida para `__trilha`; estilo
  do tooltip (visual do IDR 0048, `z-index: 20`).
- `src/components/FaixaDeSecoes.test.jsx` — testes do tooltip.
- `src/components/Cabecalho.test.jsx` — teste do progresso repassado.
- `docs/interface.md` — § Cabeçalho, § Camadas e § Medidas (IDR 0052).
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0002-tooltip-nas-bandeiras.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
