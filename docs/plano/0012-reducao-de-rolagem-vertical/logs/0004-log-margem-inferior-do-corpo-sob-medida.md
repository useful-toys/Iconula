<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0012-0004: margem inferior do corpo sob medida

## Data
2026-09-13

## Resumo
Antes: o corpo do catálogo tinha `padding` inferior fixo de 60px
(`--body-padding: 20px var(--page-gutter) 60px`), um número do protótipo
(IDR 0022) que não vinha da altura real da faixa de avisos. Depois: o valor
inferior passa a **76px**, derivado da altura medida da pior faixa única — a
falha com o detalhe técnico expandido, a 375px de largura — mais 8px de folga
(IDR 0050).

A medição foi feita em navegador headless real (Chrome instalado), com o CSS
de `src/components/Avisos.css` e os tokens de `src/theme.css` extraídos, as
mensagens de falha de produção e uma área de 375px. A faixa resultou em
**67,78px**; somados os 8px, 75,78px → adotado **76px** (arredondado para
cima, para nunca reservar menos que a altura medida).

A mudança é só de valor: nenhum seletor, componente, comportamento ou teste
muda. `--body-padding` continua o token único, consumido por
`src/components/Catalogo.css`. `docs/interface.md` § Medidas passa ao novo
valor citando o IDR 0050, e o IDR 0050 ganha a medição anotada na linha da
margem inferior.

## Discovery
- Código: `--body-padding` está em `src/theme.css:21`
  (`20px var(--page-gutter) 60px`); o único consumidor é `.catalogo`
  (`src/components/Catalogo.css:7`, `padding: var(--body-padding)`).
  `--page-gutter` (`theme.css:18`) é `clamp(16px, 4vw, 40px)`. A faixa de
  avisos é `src/components/Avisos.jsx` + `src/components/Avisos.css`:
  `.avisos__faixa` tem `padding: 12px var(--page-gutter)`, `border-top: 2px`,
  `display: flex; align-items: center`; `.avisos__mensagem` declara
  `font-size: 13px; line-height: 1.4`, mas `.avisos__mensagem--botao`
  (aplicada só à falha, que sempre tem detalhe) declara `font: inherit` e,
  por vir **depois** no arquivo com a mesma especificidade, sobrepõe a
  `font-size` de 13px — a mensagem de falha renderiza a **16px** (herdado do
  corpo), não a 13px. `.avisos__detalhe` tem `margin-top: 4px; font-size:
  11px; line-height: 1.4`. O botão de dispensar tem `font-size: 16px;
  line-height: 1; padding: 4px; margin-left: 12px`.
  Comportamento atual confere com a tarefa: o padding inferior vale 60px.
  Nenhum JS ou teste depende do valor do token (jsdom não calcula layout);
  `Avisos.test.jsx` cobre estrutura e `aria`, nunca a altura.
- Documentação: além das referências, reli o `TDR 0021` (o token
  `--secao-altura-estimada` e o `content-visibility`) para confirmar que a
  tarefa não o afeta, e o log da Tarefa 0012-0003 como precedente de mudança
  só de CSS. A `docs/interface.md:594` traz a linha "Corpo" com os 60px. As
  referências bastaram; a decisão da regra já está no IDR 0050, só o valor
  medido faltava.

## Plano da alteração
1. Medir a altura da faixa de falha com o detalhe expandido a 375px — CSS
   real + mensagem real, em Chrome headless (método e conta abaixo).
2. `src/theme.css` — `--body-padding` inferior de `60px` para `76px`.
3. `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — anotar a
   altura medida e o valor final na linha da margem inferior.
4. `docs/interface.md` § Medidas — a linha "Corpo" passa a `padding: 20px
   clamp(16px, 4vw, 40px) 76px` (citando o IDR 0050).
5. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (margem = altura medida + 8px) → leitura de `src/theme.css`
    contra a medição no log e no IDR 0050;
  - critério 2 (a falha expandida não cobre o último cartão) → conta
    `76px ≥ 67,78px` (folga de 8,22px) e roteiro visual;
  - critério 3 (`interface.md` § Medidas com o novo valor e o IDR 0050) →
    leitura da seção.
- Riscos: a mensagem de falha renderiza a 16px (e não 13px) por causa de
  `font: inherit`; a medição em navegador real captura isso. O número base
  (67,78px) é robusto à mensagem de detalhe enquanto ela couber em uma linha
  (~47 caracteres em monoespaçada 11px na largura útil): a mensagem canônica
  de falha de gravação ("Missing or insufficient permissions.", 36
  caracteres) cabe.
- Desvios: nenhum.

### Método da medição
Sem navegador autenticável para medir o app interativamente, a altura foi
medida em navegador headless **real** (`C:\Program Files (x86)\Google\Chrome\
Application\chrome.exe`, `--headless=new`), com um HTML isolado que reproduz
o CSS de `Avisos.css` e os tokens de `theme.css`, as mensagens de produção
(`Falha ao gravar — toque para detalhes` e o detalhe canônico de
`mensagemDeErro()` para uma negação de regra: `Missing or insufficient
permissions.`) e uma área de exatamente 375px.

Premissas:
- 375px de largura → `4vw = 15px`, logo `--page-gutter = clamp(16px, 4vw,
  40px) = 16px`; largura útil da faixa = `375 − 2 × 16 = 343px`.
- `system-ui` resolve para a fonte do sistema (Segoe UI no Windows), como no
  app; o detalhe usa a pilha monoespaçada do `Avisos.css`.

Conta (valores lidos via `getBoundingClientRect`):
- mensagem de falha: 16px, `line-height 1.4` → **22,4px** (1 linha; a
  mensagem tem 273,66px < 312,05px úteis, medido por GDI+ com a fonte do
  sistema);
- detalhe: `margin-top 4px` + 11px × 1.4 = **19,4px** (1 linha; 232,03px em
  Cascadia Mono < 312,05px úteis);
- conteúdo = 22,4 + 19,4 = **41,78px** (maior que o botão dispensar, 24px);
- faixa = `border-top 2px` + `padding 12px` + 41,78 + `padding 12px` =
  **67,78px**;
- margem inferior = 67,78 + 8 = 75,78 → **76px**.

Comando: `chrome --headless=new --disable-gpu --no-sandbox
--window-size=375,800 --force-device-scale-factor=1 --virtual-time-budget=3000
--dump-dom file:///.../medir-faixa.html` → `faixaAltura: 67.78125`,
`mensagemFonte: "16px"`, `textoLinhas: 1`, `detalheFonte: "11px"`,
`detalheLinhas: 1`.

## Decisões tomadas
- **Adotar 76px**, arredondando 75,78px para cima: nunca reservar menos que a
  altura medida + 8px; 0,22px é irrelevante e o inteiro é mais legível
  (nível 1, registrado neste log e anotado no IDR 0050, que já previa a
  anotação do valor medido).
- **Medir com o detalhe canônico de negação de regra** ("Missing or
  insufficient permissions."), a falha de gravação real mais provável (regra
  do Firestore nega a escrita); qualquer mensagem até ~47 caracteres produz a
  mesma altura (uma linha) (nível 1).
- **Sem teste unitário** para a mudança: é só valor de CSS e o jsdom não
  calcula layout; os critérios pedem conferência no CSS e a medição
  registrada, como nas Tarefas 0011-0003, 0012-0002 e 0012-0003 (nível 1).
- **Não alterar a faixa de avisos** (a mensagem de falha renderizar a 16px
  por `font: inherit` é um comportamento observado, mas a tarefa o põe fora
  do escopo) — observação registrada neste log.

## Impedimentos
Nenhum. A medição não exigiu decisão significativa: a regra (altura medida +
8px) já está no IDR 0050; só o valor faltava, e foi medido de forma
determinística em navegador headless.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.`
- `npm run test` → `Test Files 36 passed (36)`, `Tests 404 passed (404)`.
  Avisos de `act` em `App.gravacao.test.jsx`/`App.importar.test.jsx`/
  `App.copiar.test.jsx`/`App.exportar.test.jsx` são pré-existentes (Avisos
  atualiza fora de `act`), não vêm desta mudança.
- `npm run build` → `✓ 131 modules transformed`, `✓ built in 514ms`. O aviso
  de chunk >500 kB é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] Margem inferior = altura medida + 8px (medição no log e no IDR 0050) —
  `src/theme.css:21` `--body-padding: 20px var(--page-gutter) 76px`;
  medição 67,78px + 8px nesta seção; IDR 0050 § Decisão com o valor.
- [x] A falha expandida não cobre o último cartão ao fim da rolagem —
  `76px ≥ 67,78px`, folga de 8,22px acima do topo da faixa; roteiro visual
  abaixo (não executado por falta de navegador autenticável).
- [x] `docs/interface.md` § Medidas com o novo valor, citando o IDR 0050.

Roteiro visual pendente (sem navegador autenticável): provocar falha de
gravação (offline/regra negada), expandir o detalhe técnico, rolar até o fim
do catálogo e conferir o último cartão inteiro visível acima da faixa.

## Arquivos alterados
- `src/theme.css` — `--body-padding` inferior de `60px` para `76px`.
- `docs/idr/0050-compactacao-vertical-do-catalogo.md` § Decisão — valor
  medido da margem inferior.
- `docs/interface.md` § Medidas — linha "Corpo" com `76px`, citando o
  IDR 0050.
- `docs/plano/0012-reducao-de-rolagem-vertical/0004-margem-inferior-do-corpo-sob-medida.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0012-reducao-de-rolagem-vertical/logs/0004-log-margem-inferior-do-corpo-sob-medida.md` — este log.
