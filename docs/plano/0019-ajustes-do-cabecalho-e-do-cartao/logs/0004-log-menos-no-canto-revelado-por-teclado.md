<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0004: controle de menos no canto, revelado só por hover e teclado

## Data
2026-09-14

## Resumo
Antes: o controle de menos ficava recuado 3px das bordas inferior e esquerda do
cartão, e a visibilidade acumulava `:hover`, `:focus-within` e `:focus` — o
foco deixado por um clique de mouse mantinha o menos aceso no cartão anterior,
mesmo depois de o cursor sair. Depois: o círculo encosta no canto inferior
esquerdo (recuo 0, cobrindo a borda de 2px, sem transbordar) e o revela só o
hover no cartão, o foco por teclado (`:focus-visible`) no corpo ou no próprio
controle; `:focus-within` e `:focus` simples saem. Em tela sem hover, segue
sempre visível. A área de toque ampliada de `(pointer: coarse)` passa a crescer
só para dentro do cartão (para cima e para a direita), já que o círculo agora
encosta nas bordas.

## Discovery
- Código: `src/components/Figurinha.css` é a fonte da verdade do cartão
  (IDR 0047). `.figurinha__menos` (`Figurinha.css:174-194`) está em
  `left: 3px; bottom: 3px`, com `opacity: 0` por padrão e transição de 0.08s.
  O bloco de visibilidade (`Figurinha.css:196-200`) acende em
  `.figurinha:hover`, `.figurinha:focus-within` e `.figurinha__menos:focus`.
  `@media (hover: none)` (`Figurinha.css:202-206`) mantém `opacity: 1`.
  O `@media (pointer: coarse)` (`Figurinha.css:214-220`) aplica um `::before`
  invisível com `inset: -4px` — alvo 26×26px que, com o recuo 3px, extravasa
  1px o cartão (IDR 0042). Não há regras por variante: `.figurinha--lista` e
  `.figurinha--album` compartilham as mesmas medidas (comentário em
  `Figurinha.css:15-21`), então o recuo 0 vale para as duas de uma vez.
  `Figurinha.jsx` não muda: o foco devolvido ao corpo no decremento de 1 para 0
  está em `Figurinha.jsx:240-242` (`corpoRef.current?.focus()`). Comportamento
  atual confere com a tarefa.
- Testes: `Figurinha.test.jsx` cobre estrutura, nomes acessíveis, o foco
  devolvido ao corpo (`Figurinha.test.jsx:224-236`) e a pressão longa; nenhum
  teste lê CSS nem pseudo-classes (jsdom não calcula layout nem `:hover`).
  Nenhum outro teste da área (Secao/PaginaDoAlbum) depende da geometria do
  menos.
- Convenções locais: comentários citam o IDR entre parênteses; seletores de
  estado agrupados numa única regra de `opacity`; nenhum `:has()` no projeto
  (o irmão `~` resolve o foco por teclado sem depender de suporte novo);
  `src/theme.css` concentra o `:focus-visible` global.
- Impactos fora de "Arquivos impactados": nenhum. O `−` do controle mantém o
  mesmo botão e a mesma marcação — só CSS e `docs/interface.md` mudam.
- Documentação: reli o IDR 0032 (§ Decisão e § Consequências, com a entrada de
  2026-09-13 que já fixa recuo 0 e `:focus-visible`), o IDR 0042 (§ Decisão,
  com a tabela de áreas de toque e o parágrafo do caso do menos) e o IDR 0051
  (§ Decisão, gesto que não pode ser afetado). Reli `docs/interface.md`
  § Figurinha (`interface.md:252-257`) e § Medidas (`interface.md:702-705`).
  As referências bastaram, com uma ressalva registrada em Impedimentos:
  o IDR 0042 não foi atualizado no planejamento e ainda descreve o alvo do
  menos como 26×26px com expansão `inset: -4px` em todos os lados, medida
  atrelada ao recuo antigo de 3px.

## Plano da alteração
1. `src/components/Figurinha.css` — `.figurinha__menos`: `left: 3px; bottom:
   3px` → `left: 0; bottom: 0`; atualizar o comentário para citar o canto e o
   IDR 0032.
2. `src/components/Figurinha.css` — visibilidade: trocar
   `.figurinha:focus-within .figurinha__menos` e `.figurinha__menos:focus` por
   `.figurinha__corpo:focus-visible ~ .figurinha__menos` e
   `.figurinha__menos:focus-visible`, mantendo `.figurinha:hover` e o
   `@media (hover: none)`.
3. `src/components/Figurinha.css` — `@media (pointer: coarse)`:
   `inset: -4px` → `inset: -4px -4px 0 0` (cresce só para cima e para a
   direita), com o comentário explicando que o alvo fica contido no cartão.
4. `docs/interface.md` § Figurinha — o item do controle de menos passa a
   "encostado no canto inferior esquerdo, sobre a borda, sem transbordar;
   aparece no hover e no foco por teclado; sempre visível em tela sem hover",
   citando o IDR 0032.
5. `docs/interface.md` § Medidas — a linha "Controle de menos" troca o recuo
   de 3px por recuo 0 e descreve a área de toque ampliada só para dentro do
   cartão, citando o IDR 0042.
6. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (recuo 0 nas duas variantes) → trecho de `Figurinha.css`
    (regra única, sem variante);
  - critério 2 (sem `:focus-within`/`:focus`; teclado revela) → `grep` por
    `focus-within`/`focus` e leitura dos seletores `:focus-visible`;
  - critério 3 (`(hover: none)` sempre visível) → trecho do `@media`;
  - critério 4 (área de toque contida) → trecho do `::before` com
    `inset: -4px -4px 0 0`;
  - critério 5 (testes de `Figurinha` verdes, inclusive o foco no decremento)
    → `npm run test`;
  - critério 6 (`interface.md` citando o IDR 0032) → leitura das duas seções.
- Riscos: trocar `:focus-within` por `:focus-visible` no corpo do cartão
  depende de o irmão `~` alcançar o botão do menos (é irmão posterior — sim);
  o foco programático após o decremento 1→0 continua funcionando, porque o
  `focus()` está no `Figurinha.jsx` e o teste correspondente segue verde;
  `:focus-visible` em jsdom não é avaliado, então nenhum teste quebra.
- Desvios: nenhum.

## Decisões tomadas
- **Expansão da área de toque só para dentro com os mesmos 4px**
  (`inset: -4px -4px 0 0`; alvo de 22×22px, contido): a tarefa manda crescer só
  para dentro, para cima e para a direita, e o recuo 0 ancora o alvo no canto.
  Os 4px já documentados no IDR 0042 são mantidos, agora só nos dois lados que
  não encostam na borda. O IDR 0042 ainda diz 26×26px/`inset: -4px` em todos
  os lados (medida do recuo antigo); a divergência não é corrigida aqui porque
  o registro não foi atualizado no planejamento e a tarefa não o lista em
  "Arquivos impactados" (nível 2, sinalizada no relatório).
- **Sem `:has()`**: uso o irmão `.figurinha__corpo:focus-visible ~
  .figurinha__menos`, que resolve o foco por teclado no corpo sem depender de
  suporte a `:has()` — coerente com o restante do projeto (nível 1).
- **Sem teste novo**: a mudança é só CSS e jsdom não avalia `:hover`/
  `:focus-visible`; a estrutura do `Figurinha.jsx` não muda, então
  `Figurinha.test.jsx` fica intacto e seus testes provam que o foco volta ao
  corpo no decremento de 1 para 0 (nível 1, como nas Tarefas 0012-0002/0003).

## Impedimentos
Nenhum bloqueio. Ressalva de documentação: o IDR 0042 § Decisão ainda descreve
o alvo de toque do menos como 26×26px com expansão `inset: -4px` em todos os
lados e a § Consequências fala em "quase 40% maior" — medidas do recuo antigo
de 3px. O planejamento atualizou o IDR 0032 (que remete ao IDR 0042) mas não o
IDR 0042, e a Tarefa 0019-0004 não lista o IDR 0042 em "Arquivos impactados";
por isso o registro não é tocado (seria alterar decisão documentada sem
previsão); a divergência fica nas observações do relatório.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 43ms on 73
  files with 105 rules using 4 threads.`
- `npm run test` → `Test Files 37 passed (37)`, `Tests 449 passed (449)`;
  `src/components/Figurinha.test.jsx` passou com 31 testes (inclui "remove o
  controle ao decrementar de 1 para 0 e devolve o foco ao cartão"). O stderr
  traz avisos `An update to Avisos inside a test was not wrapped in act(...)`
  nos testes de `App.importar/gravacao/copiar/exportar` — pré-existentes e
  alheios a esta tarefa (a mudança é só CSS de `Figurinha`, sem JS).
- `npm run build` → `✓ built in 560ms`. O aviso de chunk >500 kB
  (`index.esm-DBBFYl4y.js`, 505,90 kB) é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] Recuo 0 no canto inferior esquerdo nas duas variantes — `Figurinha.css`
      (`left: 0; bottom: 0`), regra única `.figurinha__menos`, compartilhada
      por `.figurinha--lista` e `.figurinha--album`.
- [x] Nenhum `:focus-within` nem `:focus` simples revelando o menos; foco por
      teclado revela — busca sem `focus-within` em `Figurinha.css`; os
      seletores são `.figurinha:hover .figurinha__menos`,
      `.figurinha__corpo:focus-visible ~ .figurinha__menos` e
      `.figurinha__menos:focus-visible` (`Figurinha.css:201-203`).
- [x] Em `(hover: none)` o menos continua sempre visível —
      `@media (hover: none) { .figurinha__menos { opacity: 1 } }`
      (`Figurinha.css:207-211`).
- [x] Área de toque ampliada contida no cartão — `inset: -4px -4px 0 0`
      (`Figurinha.css:223`), crescendo só para cima e para a direita.
- [x] Testes existentes de `Figurinha` verdes, inclusive o foco no decremento
      de 1 para 0 — 31 testes em `Figurinha.test.jsx`.
- [x] `docs/interface.md` § Figurinha e § Medidas citando o IDR 0032 —
      § Figurinha cita `[IDR 0032]` (`interface.md:252-258`); § Medidas cita
      `(IDR 0032, IDR 0042)` (`interface.md:703-705`).

Verificação visual pendente (sem navegador autenticável), roteiro: em
`npm run dev`, na lista e no álbum, clicar num cartão colado, passar o mouse
para outro e conferir o menos apagado no primeiro; Tab até um cartão e conferir
o menos aceso; conferir o círculo encostado no canto sem sair do cartão; em
emulação de toque, o menos sempre visível.

## Arquivos alterados
- `src/components/Figurinha.css` — `.figurinha__menos` com recuo 0; visibilidade
  só por hover e `:focus-visible` (fora `:focus-within` e `:focus`); `::before`
  de `(pointer: coarse)` com `inset: -4px -4px 0 0`.
- `docs/interface.md` § Figurinha e § Medidas — controle de menos encostado no
  canto (recuo 0), revelado no hover e no foco por teclado, área de toque
  ampliada só para dentro do cartão; citando o IDR 0032.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0004-menos-no-canto-revelado-por-teclado.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/logs/0004-log-menos-no-canto-revelado-por-teclado.md`
  — este log.
