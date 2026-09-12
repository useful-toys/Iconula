<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0010-0001: acessibilidade e foco visível

## Data
2026-09-12

## Resumo
Fechadas as duas pendências de `interface.md` § Pendências de interface que
atravessaram todas as fases (foco/hover/pressionado e área de toque
ampliada), registradas no **IDR 0042**, e feito o varrimento de nomes
acessíveis, de teclado, de contraste e de reforço não-cromático pedido pela
tarefa.

- `src/theme.css`: regra global `:focus-visible { outline: 2px solid
  var(--gold); outline-offset: 2px; }` (com `:focus { outline: none; }`
  para não acender em clique de mouse/toque) — cobre todo elemento focável
  do app com um único realce, em vez de repetir a regra componente a
  componente.
- `src/components/Figurinha.css`: `.figurinha__corpo:active { transform:
  scale(0.92); }` — retorno imediato ao toque, além da mudança de cor do
  estado; e, só em `@media (pointer: coarse)`, um `::before` invisível que
  amplia a área de toque do controle de menos (26px efetivos na lista,
  22px no álbum) sem mudar o círculo visível de 18px/16px.
- `src/components/Controles.css`, `MenuDeAcoes.css`, `FaixaDeSecoes.css`:
  mesma técnica (`::before` + `pointer: coarse`) para desfazer, menu de
  ações (ambos 30×30px → 38×38px de toque) e cada ícone da faixa de
  bandeiras (30×30px → 34×34px), com a expansão de cada lado limitada à
  metade do espaçamento até o vizinho, para não disputar toque com ele.
- `src/components/Figurinha.jsx`: nome acessível passa a dizer
  `, metalizada` quando a figurinha é metalizada — a marca dourada é
  `aria-hidden`, e o estado precisa valer por extenso também para quem usa
  leitor de tela.
- `src/components/PoliticaDePrivacidade.jsx`: o glifo `←` do botão
  "Voltar" ganhou `aria-hidden`, deixando o nome acessível só "Voltar" (o
  varrimento notou que o glifo entrava no nome acessível, ao contrário do
  padrão já usado nos chevrons `▾`/`▸` do resto do app).
- `src/components/MenuDeAcoes.jsx`: achado do varrimento de teclado —
  tabular para fora do último item do popup (sem escolher nada, sem `Esc`)
  deixava o popup visualmente aberto com o foco já em outro elemento da
  tela; a checagem de "tocar fora" só ouvia `mousedown`. Acrescentado
  `onBlur` no container que fecha o popup quando o foco sai dele
  (`relatedTarget` não contido) — documentado como achado no Contexto do
  IDR 0024, não como um novo registro (é conserto de um comportamento já
  especificado, não uma decisão nova).
- Testes novos: `Figurinha.test.jsx` (nome acessível com metalizada),
  `MenuDeAcoes.test.jsx` (fecha ao tabular para fora, foco segue o Tab).
  Testes existentes de `Secao.test.jsx` e `Catalogo.test.jsx` ajustados: a
  fixture/catálogo real tem `BRA01` metalizada (TDR 0010 — metalizada só
  na posição 01), então os `getByLabelText` que citavam `BRA 01` passaram
  a incluir `, metalizada`.
- `docs/interface.md`: as duas pendências resolvidas saíram de §
  Pendências de interface; § Medidas ganhou as menções ao novo realce de
  foco, ao retorno de toque do cartão e à área de toque ampliada de cada
  alvo, todas apontando para o IDR 0042.

## Varrimentos pedidos pela tarefa

**Nomes acessíveis** (placar, cabeçalho de seção, cabeçalho de
super-grupo, cartão, alternadores, faixa de salto, desfazer, itens do
menu): já escreviam números e glifos por extenso desde as tarefas que os
criaram. Únicos achados: a marca de metalizada do cartão (corrigido acima)
e o glifo `←` da política de privacidade (fora da lista da tarefa, mas
coberto pelo critério de aceite geral — corrigido acima).

**Teclado** (entrar, atestar, navegar, ajustar contagens, colapsar,
saltar, abrir o menu, sair): todo controle interativo do app é um
`<button>` nativo (conferido lendo os 15 componentes com elemento
clicável) — a ativação por `Enter`/`Espaço` é garantida pela própria
plataforma, sem nenhum `onKeyDown`/`preventDefault` no código que pudesse
interferir (único `onKeyDown` do app é o `Esc` do menu de ações,
inalterado). O foco alcança e revela cada controle na ordem esperada,
inclusive o controle de menos (que só aparece com contagem ≥ 1 e já reage
a `:focus-within`). Único defeito real encontrado: o fechamento do menu de
ações ao tabular para fora (corrigido acima e verificado ao vivo, ver
"Verificação visual" abaixo).

**Contraste dos pares críticos** — medido com a fórmula de luminância
relativa do WCAG a partir da conversão OKLCH → sRGB linear (script
descartável, não commitado; Björn Ottosson, conversão padrão OKLab →
linear sRGB):

| Par | Uso | Contraste | Mínimo WCAG | Resultado |
|---|---|---|---|---|
| `--green-card` / `--turf` | cartão colada vs. fundo da página (não-texto) | 4.94:1 | 3:1 (1.4.11) | Aprovado |
| `--orange-card` / `--turf` | cartão repetida vs. fundo da página (não-texto) | 5.65:1 | 3:1 (1.4.11) | Aprovado |
| `--ink-on-light` / `--green-card` | texto do cartão colada | 5.24:1 | 4.5:1 (1.4.3) | Aprovado |
| `--ink-on-light` / `--orange-card` | texto do cartão repetida | 6.00:1 | 4.5:1 (1.4.3) | Aprovado |
| `--muted` / `--panel` | texto secundário sobre painel | 6.40:1 | 4.5:1 (1.4.3) | Aprovado |
| `--cream` / fundo da faixa de sucesso | texto da faixa de aviso | 10.43:1 | 4.5:1 (1.4.3) | Aprovado |
| `--cream` / fundo da faixa de aviso | texto da faixa de aviso | 10.26:1 | 4.5:1 (1.4.3) | Aprovado |
| `--cream` / fundo da faixa de falha | texto da faixa de aviso | 11.67:1 | 4.5:1 (1.4.3) | Aprovado |
| `--gold` / `--turf`, `--gold` / `--panel` | realce de foco (não-texto) | 8.44:1 / 9.05:1 | 3:1 (1.4.11) | Aprovado |

Todos os pares aprovaram com folga — nenhum exigiu mudar um token da
paleta, então o impedimento de nível 3 previsto no Caso concreto da
própria tarefa ("se o contraste exigir mudar a paleta, sinalize") não se
concretizou.

**Reforço não-cromático de ponta a ponta**: conferido ao vivo com
`document.documentElement.style.filter = 'grayscale(1)'` no `npm run dev`
(ver abaixo) — faltante (tracejado, opacidade reduzida), colada (sólido) e
repetida (sólido + selo `×N`) continuam distinguíveis em escala de cinza,
na disposição lista, na disposição álbum e com o filtro de status ativo.

## Decisões tomadas
**IDR 0042 — Foco visível, retorno de toque e área de toque ampliada**
(`docs/idr/0042-foco-visivel-e-area-de-toque.md`): fecha as duas
"Decisões em aberto nesta tarefa" — realce de foco único em `--gold` via
`:focus-visible`, retorno de toque do cartão via `transform: scale(0.92)`
no `:active`, e área de toque ampliada só em `pointer: coarse` via
pseudo-elemento invisível, com a tabela de medidas (visual × toque) para
cada alvo. Inclui a nota sobre o conserto do fechamento do menu de ações
por teclado.

Adição de Contexto ao **IDR 0024** (não um novo registro — é o achado que
motivou o conserto do `onBlur`, por AGENTS.md § Convenções: descobertas
relevantes entram no Contexto do registro correspondente).

Decisão de nível 1 (ambiguidade menor, reversível, registrada aqui em vez
de em IDR próprio): o nome acessível da figurinha metalizada e o
`aria-hidden` no glifo `←` de "Voltar" são correções pontuais de nome
acessível, não decisões de interface — mesma categoria de ajuste que os
`aria-hidden` já existentes nos chevrons `▾`/`▸`.

## Impedimentos
Nenhum nível 3. O contraste (Caso concreto previsto na própria tarefa)
aprovou todos os pares sem precisar tocar a paleta, então a pergunta
prevista para o humano não chegou a existir.

## Verificação visual e de teclado (`npm run dev`)
A guarda de login (Tarefa 0008-0001) exige login real via popup do Google,
que não pode ser automatizado nem realizado em nome do usuário — mesma
limitação já registrada nos logs da Fase 9. Diferente dessas tarefas,
desta vez foi possível verificar a tela principal de verdade: o listener
real do `onAuthStateChanged` foi **temporariamente** substituído, só na
cópia local não commitada do `App.jsx`, por um `setUser`/`setAuthResolvido`
fixos (sem tocar Firebase, sem inserir credencial alguma) — só para abrir
caminho até o catálogo no navegador local. Confirmado com `git diff` que o
arquivo voltou byte-a-byte ao original antes de qualquer commit ou da
validação final abaixo.

Com isso, confirmado ao vivo, no Chrome real (via CDP), lendo o CSSOM e
`getComputedStyle` do `document.activeElement`:

- `Tab` percorre login → política de privacidade → catálogo (faixa de
  bandeiras, super-grupo, cabeçalho de seção, cartão) sempre com o
  contorno `oklch(0.78 0.14 85) solid 2px` / `outline-offset: 2px`
  aparecendo só no foco por teclado — um clique de mouse no mesmo elemento
  não acende o contorno (`outline-style: none`), confirmando a semântica
  de `:focus-visible` pretendida.
- As quatro regras `@media (pointer: coarse)` e a regra global
  `:focus-visible` (mais as duas específicas pré-existentes) estão de fato
  na folha de estilos computada do navegador.
- Ativar um cartão por clique incrementa a contagem (confirmado por
  `aria-label` mudando de "faltante" → "colada" → "colada, N sobrando");
  o filtro "Repetidas" e a escala de cinza mostram só o cartão com selo
  `×N`, confirmando o reforço não-cromático.
- Abrir o menu de ações leva o foco ao primeiro item habilitado; tabular
  através dos cinco itens e uma vez mais fecha o popup
  (`document.querySelector('[role="menu"]')` passa a `null`) com o foco
  seguindo para o próximo elemento da página — o conserto do `onBlur`
  funciona no navegador real, não só no teste com `jsdom`.
- **Limitação da ferramenta de automação**: o disparo sintético de tecla
  `Return`/`Espaço` deste ambiente não aciona a ativação nativa de
  `<button>` (testado em três botões nativos diferentes, sem nenhum
  `onKeyDown` do app no caminho) — `element.click()` via script e clique
  de mouse real funcionam normalmente. Isso não é um defeito do app: a
  ativação de `<button>` por `Enter`/`Espaço` é comportamento padrão do
  HTML, garantido pela própria plataforma em qualquer navegador real, e é
  exatamente coberto pela suíte automatizada via `@testing-library/user-event`
  (que simula esses eventos fielmente em `jsdom` e passa em todos os
  casos, incluindo os dois testes novos desta tarefa).

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 35 arquivos de teste, 359 testes, todos passando — inclui
  os dois casos novos (`Figurinha.test.jsx`: nome acessível com
  metalizada; `MenuDeAcoes.test.jsx`: fecha ao tabular para fora do popup)
  e os ajustes em `Secao.test.jsx`/`Catalogo.test.jsx` para `BRA 01,
  metalizada`.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

## Nota sobre o repositório compartilhado
Durante a execução, `docs/plano/README.md` e um novo diretório
`docs/plano/0011-refinamento-do-cabecalho/` (Fase 11, ainda não prevista
no plano no início desta tarefa) apareceram no diretório de trabalho sem
relação com esta tarefa — sinal de outro processo escrevendo no mesmo
diretório de trabalho principal (não uma worktree isolada). Nada desse
conteúdo foi tocado ou revertido: o commit desta tarefa foi montado com
`git update-index`/`git hash-object` para incluir só a linha de status da
Tarefa 0010-0001 em `docs/plano/README.md`, preservando no diretório de
trabalho (não commitado por mim) o que quer que o outro processo esteja
escrevendo.

## Arquivos alterados
- `src/theme.css` — realce de foco global
- `src/components/Figurinha.css` — retorno de toque e área de toque do controle de menos
- `src/components/Figurinha.jsx` — nome acessível inclui metalizada
- `src/components/Figurinha.test.jsx` — teste novo
- `src/components/Controles.css` — área de toque do desfazer
- `src/components/MenuDeAcoes.css` — área de toque do botão do menu
- `src/components/MenuDeAcoes.jsx` — fecha ao perder o foco por Tab
- `src/components/MenuDeAcoes.test.jsx` — teste novo
- `src/components/FaixaDeSecoes.css` — área de toque dos ícones da faixa
- `src/components/PoliticaDePrivacidade.jsx` — `aria-hidden` no glifo do botão Voltar
- `src/components/Secao.test.jsx`, `src/components/Catalogo.test.jsx` — nome acessível de `BRA 01` inclui metalizada
- `docs/interface.md` — Pendências de interface encolhe; § Medidas documenta o IDR 0042
- `docs/idr/0042-foco-visivel-e-area-de-toque.md` — novo IDR
- `docs/idr/0024-acoes-raras-em-menu-do-cabecalho.md` — nota de Contexto sobre o achado do fechamento por Tab
- `docs/plano/0010-acabamento-acessibilidade-e-docs/0001-acessibilidade-e-foco-visivel.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0010-0001 atualizado
- `docs/plano/0010-acabamento-acessibilidade-e-docs/logs/0001-log-acessibilidade-e-foco-visivel.md` — este log
