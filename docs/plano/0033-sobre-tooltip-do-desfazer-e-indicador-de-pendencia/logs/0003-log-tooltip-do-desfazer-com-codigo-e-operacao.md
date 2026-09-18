<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0033-0003: Tooltip do desfazer com código e operação

## Data
2026-09-18

## Resumo
O botão de desfazer passa a dizer o que reverte. Antes, tinha só o
`aria-label` fixo "desfazer a última alteração", sem tooltip visual nem
identificação da figurinha. Agora `App.jsx` deriva `textoDesfazer` do topo do
histórico e da contagem atual — `Desfazer: +1 em BRA05` quando o ajuste subiu
a contagem, `Desfazer: −1 em BRA05` quando desceu; sem histórico, `null`.
`Controles.jsx` usa esse texto no `aria-label` e num `data-tooltip` (só
quando há texto), e `Controles.css` desenha o tooltip abaixo do botão no
padrão do IDR 0048 (hover ~400ms, foco na hora, sem toque). `docs/interface.md`
§ Cabeçalho descreve o comportamento e cita o IDR 0064.

## Discovery
- Código:
  - `App.jsx` mantém `historico` num `useState` (linha 102), com
    `handleAjustar` empilhando `{codigo, contagemAnterior}` e
    `handleDesfazer` revertendo; `Controles` recebe só
    `podeDesfazer={historico.length > 0}` e `onDesfazer` (linhas 917-926).
  - `historico.js` guarda `{codigo, contagemAnterior}` por entrada; a
    direção não está na entrada e é derivável comparando com a contagem
    atual (`obterContagem`), já importada em `App.jsx`.
  - `Controles.jsx` tem `aria-label="desfazer a última alteração"` fixo
    (linha 192), sem `data-tooltip`; os três grupos segmentados usam
    `data-tooltip` com o mesmo texto do `aria-label` e o tooltip CSS em
    `.controles__opcao::after` (`Controles.css`), no padrão IDR 0048.
  - Testes da área: `Controles.test.jsx` busca o desfazer pelo nome fixo
    (linhas 195-213); `App.desfazer.test.jsx` usa um helper
    `botaoDesfazer()` pelo nome fixo (linha 64) e o chama com histórico não
    vazio (linhas 124, 135, 228); `App.importar.test.jsx` tem o mesmo helper
    (linha 67) e o chama com histórico (linhas 164, 168); `Cabecalho.test.jsx`
    (linhas 192, 221, 244) e `App.test.jsx` (linha 265) consultam o nome fixo
    sem histórico (fallback neutro mantém o nome). Impactos não citados:
    `App.importar.test.jsx` (helper com histórico) e `App.desfazer.test.jsx`.
  - Comportamento atual confere com a tarefa.
- Documentação:
  - `docs/idr/0064` define formato (`Desfazer: +1 em BRA05`), ausência de
    tooltip sem histórico e `aria-label` sincronizado.
  - `docs/idr/0048` define o padrão CSS de tooltip (abaixo, hover ~400ms,
    foco na hora, sem toque).
  - `docs/interface.md` § Cabeçalho (linhas 44-47) descreve o comando desfazer
    sem tooltip; § Controles (linhas 113-117) já descreve o tooltip dos grupos.

## Plano da alteração
1. `src/App.jsx` — computar `textoDesfazer` em `useMemo` a partir do topo de
   `historico` e de `contagens` (`+1`/`−1` por `obterContagem`), `null` sem
   histórico; passar a prop `textoDesfazer` ao `Controles`.
2. `src/components/Controles.jsx` — nova prop `textoDesfazer`; `aria-label`
   dinâmico com fallback neutro ("desfazer a última alteração") quando
   ausente; `data-tooltip` só quando há texto.
3. `src/components/Controles.css` — tooltip do `.controles__desfazer`
   (seletor `[data-tooltip]::after`) no padrão do IDR 0048, alinhado à borda
   direita (botão na ponta da linha) para não estourar a viewport.
4. `src/components/Controles.test.jsx` — testes do `aria-label`/`data-tooltip`
   dinâmicos e da ausência de tooltip sem texto.
5. `src/App.desfazer.test.jsx` — helper por regex e testes do sinal `+1`/`−1`.
6. `src/App.importar.test.jsx` — helper por regex (impacto não citado).
7. `docs/interface.md` § Cabeçalho — descreve o tooltip e o `aria-label`
   dinâmico, citando o IDR 0064.
8. Status, README e este log no mesmo commit.
- Verificação prevista:
  - critério 1 → `App.desfazer.test.jsx` (nome acessível e `data-tooltip`
    após incremento e decremento);
  - critério 2 → `Controles.test.jsx` (sem texto, sem `data-tooltip`) e
    `App.desfazer.test.jsx` (sem histórico, sem tooltip);
  - critério 3 → CSS em `Controles.css` + roteiro visual (pendente, sem
    navegador);
  - critério 4 → leitura de `docs/interface.md`;
  - lint/test/build.
- Riscos: testes que buscam o nome fixo quebrarem quando há histórico
  (`App.desfazer.test.jsx`, `App.importar.test.jsx`) — resolvido com busca
  por regex.
- Desvios: nenhum.

## Decisões tomadas
- Fallback neutro do `aria-label` quando não há `textoDesfazer` (botão
  desabilitado): mantém nome acessível sensato e a compatibilidade dos testes
  existentes de `Controles`/`Cabecalho`; previsto na tarefa.
- Tooltip do desfazer alinhado à borda direita, não centralizado: o botão fica
  na ponta da linha; centralizado estouraria a viewport — mesma preocupação do
  IDR 0048 para as pontas dos grupos. Nível 1.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
`npm run lint` — "Found 0 warnings and 0 errors. Finished in 86ms on 102
files with 105 rules".

`npm run test` — 50 arquivos, 654 testes, todos passando (eram 649; +5 dos
testes novos). Os avisos `act(...)` são pré-existentes, de `App.test.jsx` e
outros, fora do escopo. Trecho final:

```
 Test Files  50 passed (50)
      Tests  654 passed (654)
```

`npx vitest run src/components/Controles.test.jsx src/App.desfazer.test.jsx
--reporter=verbose` — 34 testes, incluindo os novos: "usa o texto do desfazer
no nome acessível e no tooltip", "não dá tooltip ao desfazer sem texto (sem
histórico)", "sem histórico, o botão não tem tooltip e mantém o nome neutro",
"o botão anuncia o código e o incremento do topo do histórico" e "o botão
anuncia o decremento com sinal −1".

`npm run build` — 146 módulos, "✓ built in 582ms"; o aviso de chunk acima de
500 kB é pré-existente.

`npm run test:rules` — não se aplica (não tocou `firestore.rules`).

## Critérios de aceite
- [x] Com histórico, o botão tem `aria-label`/tooltip `Desfazer: +1 em
      <código>` ou `Desfazer: −1 em <código>`, coerente com o sinal —
      `src/App.desfazer.test.jsx`, "o botão anuncia o código e o incremento do
      topo do histórico" (+1 após `onAjustar("BRA01", 1)`) e "o botão anuncia
      o decremento com sinal −1" (−1 após dois incrementos e um decremento),
      ambos conferindo `toHaveAccessibleName` e `data-tooltip`;
      `src/components/Controles.test.jsx`, "usa o texto do desfazer no nome
      acessível e no tooltip".
- [x] Sem histórico (botão desabilitado), nenhum tooltip aparece —
      `src/components/Controles.test.jsx`, "não dá tooltip ao desfazer sem
      texto (sem histórico)" (`not.toHaveAttribute('data-tooltip')`); e
      `src/App.desfazer.test.jsx`, "sem histórico, o botão não tem tooltip e
      mantém o nome neutro".
- [ ] O tooltip visual segue o padrão hover ~400ms / foco por teclado / sem
      toque do IDR 0048 — verificação visual pendente (sem navegador); roteiro
      em `npm run dev`: ajustar uma figurinha, passar o mouse sobre o desfazer
      (aparece após ~400ms), tabular até ele (aparece na hora) e decrementar
      para conferir o sinal `−1`. O CSS
      (`src/components/Controles.css:132-165`) reproduz o mesmo
      `@media (hover: hover)` + `transition-delay: 0.4s` e o `:focus-visible`
      com `transition-delay: 0s` do `.controles__opcao`.
- [x] `docs/interface.md` § Cabeçalho cita o tooltip do desfazer e o IDR 0064
      — bullet "Comando desfazer" (`docs/interface.md:44-51`) descreve o
      tooltip, o `aria-label` no mesmo texto e a ausência de tooltip sem
      histórico, com link para `idr/0064-tooltip-do-desfazer-com-codigo-e-operacao.md`.

## Arquivos alterados
- `src/App.jsx` — `textoDesfazer` em `useMemo` (linha 425) e prop passada ao
  `Controles` (linha 946).
- `src/components/Controles.jsx` — prop `textoDesfazer` (default `null`),
  JSDoc, `aria-label` dinâmico com fallback e `data-tooltip` condicional
  (linhas 196-197).
- `src/components/Controles.css` — tooltip do `.controles__desfazer`
  (linhas 132-165), padrão IDR 0048, alinhado à borda direita.
- `src/components/Controles.test.jsx` — dois testes novos.
- `src/App.desfazer.test.jsx` — helper por regex e três testes novos.
- `src/App.importar.test.jsx` — helper por regex (impacto não citado).
- `docs/interface.md` — § Cabeçalho, bullet "Comando desfazer".
- `docs/plano/0033-.../0003-tooltip-do-desfazer-com-codigo-e-operacao.md` —
  status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0033-.../logs/0003-log-tooltip-do-desfazer-com-codigo-e-operacao.md`
  — este log.
