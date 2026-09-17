<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0030-0001: faixa de bandeiras sem barra de rolagem

## Data
2026-09-17

## Resumo
A faixa de bandeiras (`FaixaDeSecoes`) deixa de mostrar barra de rolagem em
qualquer plataforma. Antes, o desktop tinha uma barra fina de 6px
(`scrollbar-width: thin` + pseudo-elementos `::-webkit-scrollbar-*`) e só o
toque a escondia (`@media (pointer: coarse)`). Agora a trilha nunca mostra
barra (`scrollbar-width: none` incondicional) e dois indicadores substituem a
dica de continuidade: um fade em degradê `--turf` → transparente em cada
borda, ligado por JS conforme a posição de rolagem (esquerdo só depois de
rolar, direito só enquanto há conteúdo à frente), e, no mouse, arrastar a
trilha rola (`cursor: grab` no hover, `grabbing` durante o arrasto),
distinguido do clique por um limiar de ~5px de movimento — mover mais rola e
não salta, mover menos salta e não rola. `overscroll-behavior-x: contain` na
trilha trava o "voltar página" do swipe horizontal no toque. A rodinha do
mouse não foi interceptada (nenhum listener de `wheel`): a página continua
rolando por cima da faixa, como já acontecia. `FaixaDeSecoes.jsx` ganhou
`trilhaRef`, o estado do fade (`useLayoutEffect` no mount e a cada mudança de
`secoes`/`ordenacao`, mais um listener de `resize`) e o arrasto por mouse
(`mousedown` no componente, `mousemove`/`mouseup` na `window`, com um ref que
sobrevive ao `mouseup` até o `click` seguinte para saber se deve suprimir o
salto). `docs/interface.md` § Cabeçalho e § Medidas passam a descrever o fade
e o arrasto, citando o IDR 0058 (decisão já registrada no planejamento desta
fase).

## Discovery
- Código: `FaixaDeSecoes.jsx` já tinha JS próprio (tooltip com atraso,
  posicionamento por `getBoundingClientRect`, listener de `scroll` em fase de
  captura) — mesmo padrão reaproveitado para o fade e o arrasto. `.css`
  reservava a barra ao mouse (`@media (pointer: coarse)` escondia só no
  toque); `Cabecalho.css` confirma que `.faixa-de-secoes` sempre corre sobre
  `--turf` (`.cabecalho { background: var(--turf) }`), então o fade em
  `--turf` → transparente não precisa de token novo. Testes existentes
  (`FaixaDeSecoes.test.jsx`) cobrem tooltip, ordenação e clique — nenhum
  tocava rolagem ou arrasto; o padrão de teste usa `fireEvent`/`act` com
  `vi.useFakeTimers()` quando há atraso.
- Documentação: `docs/idr/0058-rolagem-da-faixa-de-bandeiras-sem-barra.md`
  (Contexto/Decisão/Consequências) já cobre a decisão por completo — fade,
  arrasto, limiar, overscroll, rodinha não interceptada — nada a
  esclarecer. `docs/idr/0016` e `docs/idr/0008` confirmam que o salto por
  clique/teclado e a exceção de rolagem própria continuam vigentes, sem
  mudança.

## Plano da alteração
1. `FaixaDeSecoes.css`: remover a barra do desktop (unificar com o toque:
   `scrollbar-width: none` sempre, sem `@media (pointer: coarse)`); somar
   `overscroll-behavior-x: contain` à trilha; `cursor: grab` em
   `@media (pointer: fine)` e uma classe `--arrastando` com `grabbing`; duas
   `div` de fade (`--esquerda`/`--direita`), `position: absolute` dentro de
   `.faixa-de-secoes` (já `position: relative`), degradê `--turf` →
   transparente, `pointer-events: none`, opacidade 0/1 por classe
   `--visivel` com transição.
2. `FaixaDeSecoes.jsx`: `trilhaRef` na `<nav>`; estado `fade` atualizado por
   `atualizarFade()` (lê `scrollLeft`/`scrollWidth`/`clientWidth`), chamada no
   `onScroll` da trilha, num `useLayoutEffect` (mount e mudança de
   `secoes`/`ordenacao`) e num listener de `resize`; arrasto por
   `onMouseDown` (guarda `inicioX`/`inicioScrollLeft`) com `mousemove`/
   `mouseup` na `window` (limiar `ARRASTO_LIMIAR_PX = 5`, ajusta
   `scrollLeft`, liga a classe `--arrastando`); `aoClicar` ignora o salto
   quando o clique encerra um arrasto que passou do limiar.
3. `FaixaDeSecoes.test.jsx`: testes novos para o fade condicional
   (`scrollWidth`/`clientWidth`/`scrollLeft` simulados + `fireEvent.scroll`)
   e para o arrasto (`mouseDown`/`mouseMove`/`mouseUp` simulados, com
   asserção de classe `--arrastando`, `scrollLeft` resultante e supressão do
   `onSaltar`; e o caso de movimento ≤5px, que ainda salta).
4. `docs/interface.md` § Cabeçalho (novo bullet sobre fade/arrasto/rodinha) e
   § Medidas (bullet da faixa menciona "sem barra"; novo bullet com a medida
   do fade), citando o IDR 0058.
- Verificação prevista: `npm run lint && npm run test && npm run build`
  verdes; critérios de aceite por teste (fade condicional, arrasto vs.
  clique, classe de cursor) e por leitura do CSS (`scrollbar-width: none`
  incondicional).
- Riscos: distinguir corretamente clique de arrasto em jsdom (sem layout
  real) — mitigado simulando `scrollWidth`/`clientWidth` via
  `Object.defineProperty` nos testes, como o próprio componente lê.
- Desvios: nenhum.

## Decisões tomadas
- Nome do ref/estado do arrasto (`arrastoRef`, `ultimoArrastoMoveuRef`,
  `arrastando`) e da função de recálculo do fade (`atualizarFade`) — nível 1,
  API interna, sem registro.
- O ref `ultimoArrastoMoveuRef` sobrevive ao `mouseup` até o `click`
  seguinte (em vez de ser limpo no `mouseup`), porque o `click` do React
  chega depois do listener de `mouseup` da `window` — nível 1, contorno
  necessário para a ordem dos eventos do DOM, sem registro.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
> oxlint
(sem erros nem avisos)

$ npm run test
 Test Files  43 passed (43)
      Tests  584 passed (584)

$ npm run build
✓ 138 modules transformed.
✓ built in 379ms
(aviso pré-existente de chunk >500kB, sem relação com esta tarefa)
```

## Critérios de aceite
- [x] Nenhuma barra de rolagem visível na faixa, no desktop e no mobile —
      `FaixaDeSecoes.css`: `scrollbar-width: none` e
      `::-webkit-scrollbar { display: none }` incondicionais (sem `@media`).
- [x] Arrastar rola a trilha; clicar sem mover salta; mover >5px não salta —
      `src/components/FaixaDeSecoes.test.jsx` "arrastar o mouse além do
      limiar..." e "mover até o limiar (≤5px) ainda salta ao clicar".
- [x] Fade esquerdo só com conteúdo à esquerda; direito só com conteúdo à
      direita — `FaixaDeSecoes.test.jsx` "mostra o fade esquerdo só depois de
      rolar e o direito enquanto há conteúdo".
- [x] `cursor: grab` no hover e `grabbing` ao arrastar —
      `FaixaDeSecoes.css`: `@media (pointer: fine) { .faixa-de-secoes__trilha
      { cursor: grab } }` e `.faixa-de-secoes__trilha--arrastando { cursor:
      grabbing }`; a classe liga/desliga com o estado `arrastando`
      (`FaixaDeSecoes.jsx`), coberta pelo teste de arrasto acima.
- [x] `npm run lint && npm run test && npm run build` verdes — saída acima.

## Arquivos alterados
- `src/components/FaixaDeSecoes.jsx` — `trilhaRef`, fade condicional
  (estado + `atualizarFade`), arrasto por mouse com limiar, `aoClicar` ignora
  clique de arrasto, `<nav>` ganha `onScroll`/`onMouseDown`/classe de
  arrasto, duas `div` de fade na marcação.
- `src/components/FaixaDeSecoes.css` — barra removida em toda plataforma,
  `overscroll-behavior-x: contain`, `cursor: grab`/`grabbing`, regras do
  fade.
- `src/components/FaixaDeSecoes.test.jsx` — testes do fade condicional e do
  arrasto vs. clique (limiar de 5px).
- `docs/interface.md` — § Cabeçalho (bullet do fade/arrasto/rodinha) e §
  Medidas (faixa "sem barra visível" + bullet da medida do fade), IDR 0058.

## Validação adicional
Sem navegador disponível nesta execução: roteiro visual pendente —
`npm run dev`, abrir o app, conferir na faixa de bandeiras do cabeçalho (1)
nenhuma barra de rolagem visível, (2) arrastar com o mouse rola a faixa com
cursor `grab`/`grabbing`, (3) clicar numa bandeira sem arrastar salta até a
seção, (4) rolar a página com o cursor sobre a faixa rola a página (rodinha
não interceptada), (5) o fade aparece só do lado com conteúdo oculto.
