<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0019-0003: faixa de aviso com respiro de 6px

## Data
2026-09-14

## Resumo
Antes: a faixa de aviso tinha `padding: 12px var(--page-gutter)` e o corpo
reservava `--body-padding` inferior de 76px, derivado da faixa de falha
expandida medida a 375px com o respiro antigo (67,78px + 8px). Depois: o
respiro vertical cai para 6px em cima e embaixo (lateral inalterada) e a
margem inferior do corpo é remedida pelo mesmo método do IDR 0050 — altura da
pior faixa única mais 8px, arredondada para cima.

A medição real em navegador headless confirma a estimativa do IDR 0050:
faixa de falha expandida = **55,78px**; `+ 8px` → 63,78px → **64px**. A
economia de 12px na margem inferior (76px → 64px) e de 12px na altura da faixa
enquanto visível.

## Discovery
- Código: `.avisos__faixa` está em `src/components/Avisos.css:19-26`
  (`padding: 12px var(--page-gutter)`, `border-top: 2px`,
  `display: flex; align-items: center`). `.avisos__mensagem` declara
  `font-size: 13px; line-height: 1.4`, mas `.avisos__mensagem--botao`
  (`Avisos.css:50-59`) aplica `font: inherit` e, por vir depois com a mesma
  especificidade, sobrepõe a `font-size` — a mensagem de falha (única que usa
  o botão) renderiza a 16px, herdado do corpo. `.avisos__detalhe` tem
  `margin-top: 4px; font-size: 11px; line-height: 1.4` (`Avisos.css:65-73`).
  `.avisos__dispensar` tem `font-size: 16px; line-height: 1; padding: 4px;
  margin-left: 12px` (`Avisos.css:75-86`). `--body-padding` está em
  `src/theme.css:97` (`20px var(--page-gutter) 76px`); o único consumidor é
  `.catalogo` (`src/components/Catalogo.css:7`, `padding: var(--body-padding)`).
  `--page-gutter` (`theme.css:94`) é `clamp(16px, 4vw, 40px)`.
  Comportamento atual confere com a tarefa. Nenhum JS ou teste depende da
  altura: `Avisos.test.jsx` cobre estrutura e `aria`, nunca layout (jsdom não
  calcula layout). O `×` de dispensar tem 24px de caixa (16px + 2×4px), menor
  que o conteúdo da faixa (41,78px), então não limita a altura — premissa
  conservadora da tarefa confirmada.
- Documentação: reli o IDR 0050 (§ Decisão e § Histórico) e o log da Tarefa
  0012-0004, que traz o método de medição em Chrome headless e a conta
  anterior (respiro de 12px → 67,78px → 76px). As referências bastaram.

## Plano da alteração
1. Medir em Chrome headless real a altura da faixa de falha com o detalhe
   técnico expandido, a 375px, com o CSS de `Avisos.css` (respiro de 6px) e os
   tokens de `theme.css`, e as mensagens de produção — mesmo método do log da
   Tarefa 0012-0004.
2. `src/components/Avisos.css` — `.avisos__faixa`: `padding` de
   `12px var(--page-gutter)` para `6px var(--page-gutter)`.
3. `src/theme.css` — `--body-padding` inferior de `76px` para
   `medição + 8px` (arredondado para cima).
4. `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — trocar a
   estimativa de 64px pela medição real (conta em passos curtos); § Histórico
   — nova entrada com a medição.
5. `docs/interface.md` § Medidas — "Área de avisos" com
   `padding: 6px clamp(16px, 4vw, 40px)`; "Corpo" com a nova margem inferior;
   ambos citando o IDR 0050.
6. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (respiro 6px, lateral inalterada) → trecho de `Avisos.css`;
  - critério 2 (`--body-padding` = medição + 8px, conta no log) → trecho de
    `theme.css` contra a medição;
  - critério 3 (IDR 0050 com medição e histórico) → leitura do registro;
  - critério 4 (`interface.md` § Medidas citando o IDR 0050) → leitura;
  - critério 5 (testes de `Avisos` verdes) → `npm run test`.
- Riscos: a mensagem renderiza a 16px por `font: inherit`; a medição em
  navegador real captura isso. O número é robusto à mensagem de detalhe
  enquanto ela couber em uma linha (mesmo racional da Tarefa 0012-0004).
- Desvios: nenhum.

### Método da medição
Medida em navegador headless **real** (mesmo método do log da Tarefa
0012-0004): `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
`--headless=new --disable-gpu --no-sandbox --force-device-scale-factor=1
--virtual-time-budget=3000 --dump-dom`, com um HTML isolado reproduzindo o CSS
de `Avisos.css` (respiro de 6px) e os tokens de `theme.css`, as mensagens de
produção (`Falha ao gravar — toque para detalhes` e o detalhe canônico de
negação de regra: `Missing or insufficient permissions.`) e largura de 375px.

Premissas:
- 375px de largura → `4vw = 15px`, logo `--page-gutter = clamp(16px, 4vw,
  40px) = 16px`; largura útil da faixa = `375 − 2 × 16 = 343px`.
- `--window-size` não foi aplicado pelo `--headless=new` (viewport ficou em
  500px); a largura foi fixada no CSS da medição (`.avisos { width: 375px }`)
  e o gutter no valor determinístico de 375px (`padding: 6px 16px`).

Conta (valores lidos via `getBoundingClientRect`):
- conteúdo (botão da mensagem, 1 linha) = **41,78px** — mensagem `16px × 1,4`,
  detalhe `4px + 11px × 1,4`, ambos em 1 linha; maior que o botão dispensar
  (24px);
- faixa = `border-top 2px` + `padding 6px` + 41,78 + `padding 6px` =
  **55,78px**;
- margem inferior = 55,78 + 8 = 63,78 → **64px**.

Comando: `chrome --headless=new --dump-dom file:///.../medir-faixa-0003.html` →
`{"faixaAltura":55.78125,"mensagemFonte":"16px","detalheFonte":"11px",
"botaoAltura":41.78125,"gutterLido":"16px","paddingTopLido":"6px"}`. A medição
confirma a estimativa do IDR 0050 (`67,78 − 12 = 55,78`).

## Decisões tomadas
- **Adotar 64px**, arredondando 63,78px para cima: nunca reservar menos que a
  altura medida + 8px (nível 1, mesma regra do IDR 0050, já registrada).
- **Não mexer no botão `×`**: medido, ele tem 24px (16px + 2×4px), abaixo do
  conteúdo de 41,78px, então não limita a altura da faixa; a premissa
  conservadora da tarefa se confirma e o botão fica intacto (nível 2,
  registrado neste log).
- **Sem teste unitário** para a mudança: é valor de CSS e o jsdom não calcula
  layout; os critérios pedem conferência no CSS e a medição registrada, como
  nas Tarefas 0012-0002/0003/0004 (nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors. Finished in 53ms on 73
  files with 105 rules`.
- `npm run test` → `Test Files 37 passed (37)`, `Tests 449 passed (449)`.
  `src/components/Avisos.test.jsx` passou com 6 testes.
- `npm run build` → `✓ built in 657ms`. O aviso de chunk >500 kB é
  pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] `.avisos__faixa` com respiro vertical de 6px e lateral
      `var(--page-gutter)` — `src/components/Avisos.css:22`
      (`padding: 6px var(--page-gutter)`).
- [x] `--body-padding` com a margem = medição + 8px, conta no log — medido
      55,78px, `+ 8px` → 64px; `src/theme.css:97`
      (`--body-padding: 20px var(--page-gutter) 64px`).
- [x] IDR 0050 com a medição no lugar da estimativa e entrada no histórico —
      § Decisão com a conta `2 + 6 + 6 + 22,4 + 4 + 15,4 = 55,78` → 64px;
      § Histórico com a entrada de 2026-09-14.
- [x] `docs/interface.md` § Medidas citando o IDR 0050 — linha "Corpo"
      (`64px`) e linha "Área de avisos" (`6px`), ambas com `(IDR 0050)`.
- [x] Testes existentes de `Avisos` verdes — 6 testes em
      `Avisos.test.jsx`.

Verificação visual pendente (sem navegador autenticável): a 375px, provocar um
sucesso, um aviso e uma falha expandida; rolar até o fim do catálogo com a
falha aberta e conferir a última linha acima da faixa.

## Arquivos alterados
- `src/components/Avisos.css` — `.avisos__faixa` com `padding: 6px
  var(--page-gutter)`.
- `src/theme.css` — `--body-padding` inferior de `76px` para `64px`.
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão e § Histórico —
  medição real no lugar da estimativa.
- `docs/interface.md` § Medidas — "Corpo" com `64px` e "Área de avisos" com
  `6px`, citando o IDR 0050.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/0003-aviso-com-respiro-de-6px.md`
  — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0019-ajustes-do-cabecalho-e-do-cartao/logs/0003-log-aviso-com-respiro-de-6px.md`
  — este log.

