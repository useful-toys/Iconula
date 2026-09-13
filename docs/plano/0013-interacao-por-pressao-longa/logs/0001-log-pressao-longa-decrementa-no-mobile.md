<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0013-0001: pressão longa decrementa no mobile

## Data
2026-09-13

## Resumo
Antes, tocar no cartão sempre somava e remover uma unidade exigia o controle
de menos. Agora, em tela sensível, segurar o corpo do cartão por 500ms
remove uma unidade; o cartão escurece progressivamente durante a espera;
mover o dedo mais de 10px cancela (rolagem nunca decrementa); soltar antes
do limiar é o toque normal e soma; a contagem 0 não inicia a espera nem
decrementa; o menu de contexto do navegador deixa de abrir no toque e o
callout do iOS é suprimido no corpo do cartão. Mouse, caneta e teclado
seguem como estavam.

Arquivos e papéis:
- `src/components/Figurinha.jsx` — handlers de Pointer Events no botão do
  corpo (só `pointerType === 'touch'`): espera de 500ms com estado local
  `pressionando`, cancelamento por movimento > 10px, supressão do clique
  seguinte quando a pressão longa é reconhecida e supressão do
  `contextmenu` no toque. Props e comparador do `memo` intactos.
- `src/components/Figurinha.css` — escurecimento progressivo
  (`filter: brightness(0.6)` com transição de 0.5s no `.figurinha`),
  `-webkit-touch-callout: none` no `.figurinha__corpo`.
- `src/components/Figurinha.test.jsx` — 10 testes novos com Pointer Events e
  tempo controlado.
- `docs/interface.md` § Figurinha — descreve o gesto, citando o IDR 0051.

Divergências: nenhuma entre tarefa, código e documentação. O comportamento
segue o IDR 0051, já registrado no planejamento.

## Discovery
- Código:
  - `src/components/Figurinha.jsx` — cartão `memo` com comparador
    `propsEquivalentes` (TDR 0021). O corpo é um `<button
    className="figurinha__corpo">` cujo `onClick` chamava `onIncrementar`; o
    controle de menos é um `<button>` separado, renderizado a partir da
    contagem 1. Não havia handler de pointer no projeto (a busca por
    `pointer|onContextMenu|touch` só achou `pointer: coarse`/`pointer-events`
    em CSS e comentários).
  - `src/components/Secao.jsx` (lista) e `src/components/PaginaDoAlbum.jsx`
    (álbum) criam `onIncrementar={() => onAjustar(codigo, 1)}` e
    `onDecrementar={() => onAjustar(codigo, -1)}` por cartão; `codigo` é
    estável e os fechos são equivalentes entre renders (TDR 0021).
  - `src/App.jsx` — `handleAjustar` empilha uma entrada no histórico e chama
    `aplicarAjuste`, com piso 0 em `ajustarContagem`; por isso o gesto não
    deve começar na contagem 0.
  - `src/components/Figurinha.css` — `.figurinha__corpo` já tinha
    `user-select: none` e `-webkit-tap-highlight-color: transparent`;
    `.figurinha__corpo:active` encolhe com `scale(0.92)` (IDR 0042). O
    `.figurinha` externo é `position: relative`; aplicar `filter` nele não
    muda o bloco contentor do selo/da marca, mas aplicar `filter` no próprio
    botão o tornaria o ancestral posicionado e deslocaria ambos — evitado.
  - `src/components/Figurinha.test.jsx` — testes com `userEvent`/`fireEvent`;
    `Avisos.test.jsx` mostra o padrão `vi.useFakeTimers()` + `act`. `jsdom`
    30 expõe `PointerEvent`, então `fireEvent.pointerDown/Up/Move/Cancel`
    funcionam. Comportamento atual conferia com a tarefa: não havia gesto de
    pressão longa, `onClick` sempre somava.
- Documentação: as referências bastaram. Lidos o IDR 0051 (limiar,
  cancelamento, retorno, contagem 0, menu do navegador), o IDR 0032
  (controle de menos), o IDR 0012 (uma entrada por ajuste), o IDR 0042
  (`:active` e área de toque), o TDR 0021 (memoização) e o `docs/interface.md`
  § Figurinha/§ Interações. Nenhuma decisão precisa nascer nesta tarefa.

## Plano da alteração
1. `src/components/Figurinha.jsx` — Pointer Events no botão do corpo, só
   para toque: `pointerdown` com contagem ≥ 1 guarda ponteiro/coordenadas,
   liga `pressionando` e agenda o decremento em 500ms; `pointermove` além de
   10px cancela; `pointerup`/`pointercancel` encerram a espera; ao completar
   o limiar, decrementa uma vez e marca para suprimir o `click` seguinte;
   `onClick` consulta a marca; `onContextMenu` só suprime se o último
   ponteiro foi de toque.
2. `src/components/Figurinha.css` — transição de `filter` no `.figurinha`,
   classe `.figurinha--pressionando` e `-webkit-touch-callout: none` no
   `.figurinha__corpo`.
3. `src/components/Figurinha.test.jsx` — testes com Pointer Events e
   `vi.useFakeTimers()`.
4. `docs/interface.md` § Figurinha — acrescentar o gesto citando o IDR 0051.
5. Log e status da tarefa e do README.
- Verificação prevista: cada critério por teste; callout do iOS por busca no
  CSS; `docs/interface.md` por busca; lint, test e build.
- Riscos: um `click` sintetizado após cancelamento poderia engolir o próximo
  toque — mitigado resetando a marca a cada `pointerdown` de toque.
- Desvios: o teste de teclado ficou fora do bloco com fake timers (no bloco
  principal, timers reais) porque `userEvent` não progride sob
  `vi.useFakeTimers` de forma simples; o comportamento coberto é o mesmo.

## Decisões tomadas
- Escurecer com `filter` no `.figurinha` externo, não no botão — aplicar no
  botão mudaria o bloco contentor do selo e da marca de metalizada (os dois
  são `position: absolute`), deslocando-os; no `.figurinha` já posicionado
  isso não acontece. Nível 1, sem registro (aparência já fixada pelo IDR
  0051).
- Rastrear o tipo do último `pointerdown` para decidir o `contextmenu`, já
  que o evento `contextmenu` não carrega `pointerType`. Nível 1, sem
  registro (implementação do já decidido no IDR 0051).
- No teste, mover o caso de teclado para timers reais. Nível 1, sem registro
  (detalhe de teste).

## Impedimentos
Nenhum de nível 2 ou 3. Ruído de ambiente: `package-lock.json` do worktree
vinha com o campo `name` reajustado por `npm install` (`iconula-button` →
`iconula`); revertido antes de começar, por estar fora do escopo — mesmo
precedente da Tarefa 0005-0001.

## Setup realizado
Nenhum.

## Validação

### `npm run lint`
```
Found 0 warnings and 0 errors.
Finished in 58ms on 71 files with 105 rules using 4 threads.
```

### `npm run test`
```
Test Files  36 passed (36)
     Tests  413 passed (413)
```

Foco novo (`npx vitest run src/components/Figurinha.test.jsx`):
```
Test Files  1 passed (1)
     Tests  23 passed (23)
```

### `npm run build`
```
✓ 131 modules transformed.
dist/assets/index-CbgXKIKE.css                     16.33 kB │ gzip:   3.84 kB
dist/assets/index-Ct2QEhdx.js                     411.85 kB │ gzip: 124.26 kB
✓ built in 655ms
```
Aviso de chunk > 500 kB (chunk do Firebase) já existia antes da mudança.

## Critérios de aceite
- [x] Toque de 500ms decrementa uma unidade, sem somar ao soltar — teste
  "toque de 500ms decrementa uma vez e não soma ao soltar"
  (`src/components/Figurinha.test.jsx`); `onDecrementar` 1× e `onIncrementar`
  0× após soltar e clicar.
- [x] Soltar antes de 500ms soma — teste "soltar antes de 500ms soma";
  `onDecrementar` 0× e `onIncrementar` 1×.
- [x] Mover mais de 10px cancela sem efeito — teste "mover mais de 10px
  cancela sem decrementar"; `onDecrementar` 0×.
- [x] Mouse e teclado não acionam o gesto — testes "mouse não aciona o
  gesto" (`onDecrementar` 0×) e "teclado soma, sem acionar o gesto de
  pressão longa" (`onIncrementar` 1×, `onDecrementar` 0×).
- [x] Contagem 0 não decrementa nem mostra espera — teste "contagem 0 não
  decrementa nem mostra a espera"; sem `.figurinha--pressionando` e
  `onDecrementar` 0×.
- [x] Nenhuma pressão longa gera mais de uma chamada de ajuste — teste "não
  gera mais de uma chamada de ajuste numa pressão longa"; `onDecrementar`
  1× no reconhecimento e o clique suprimido, com o toque seguinte voltando a
  somar.
- [x] Menu de contexto suprimido só em toque — teste "suprime o menu de
  contexto no toque e mantém no mouse" (`defaultPrevented` true no toque,
  false no mouse). Callout do iOS — `Figurinha.css:44`
  (`-webkit-touch-callout: none`).
- [x] `docs/interface.md` § Figurinha descreve o gesto citando o IDR 0051 —
  `docs/interface.md:240` (gesto) e `:243` (link
  `idr/0051-pressao-longa-decrementa-no-toque.md`).

## Arquivos alterados
- `src/components/Figurinha.jsx` — Pointer Events do gesto, supressão do
  clique e do menu de contexto.
- `src/components/Figurinha.css` — escurecimento progressivo e callout do
  iOS.
- `src/components/Figurinha.test.jsx` — testes de pressão longa (fake
  timers) e de teclado.
- `docs/interface.md` § Figurinha — descreve o gesto citando o IDR 0051.
- `docs/plano/0013-interacao-por-pressao-longa/0001-pressao-longa-decrementa-no-mobile.md`
  — status `Concluída`.
- `docs/plano/README.md` — linha da tarefa `Concluída`; fase `Em andamento`.

## Validação adicional (visual) — pendente
Sem navegador/aparelho neste ambiente. Roteiro em `npm run dev`, com
emulação de toque: (1) segurar um cartão com contagem ≥ 1 e conferir o
escurecimento ao longo de ~500ms e um único decremento; (2) soltar antes e
conferir a soma; (3) iniciar a rolagem sobre um cartão e conferir que nada
muda; (4) segurar e conferir que o menu do navegador não abre (Android) e
que o callout não aparece (iOS).
