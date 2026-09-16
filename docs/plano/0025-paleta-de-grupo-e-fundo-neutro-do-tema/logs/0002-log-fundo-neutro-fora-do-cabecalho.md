<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0025-0002: fundo neutro fora do cabeçalho

## Data
2026-09-16

## Resumo
O fundo da aplicação deixou de ser verde-gramado (`--turf`) fora do cabeçalho.
`theme.css` ganhou `--bg: oklch(0.22 0 0)`, o antigo `--turf-deep` virou
`--bg-deep: oklch(0.15 0 0)` e `--panel`/`--border` perderam o matiz
(`oklch(0.19 0 0)` e `oklch(0.32 0 0)`). `--turf` **não mudou de valor**
(`oklch(0.22 0.06 150)`) e passou a ser consumido só em `Cabecalho.css`; a
identidade verde-gramado com dourado fica restrita à barra fixa do topo e o
resto da tela (corpo, tela de login, termos, política, menus e estados da
figurinha) fica em cinza neutro.

Mudanças: `src/theme.css` (tokens + fundo do `body`), os consumidores de
`--turf` (`TelaDeLogin.css`, `TermosDeUso.css`, `PoliticaDePrivacidade.css`) e
os de `--turf-deep` (`Figurinha.css` ×2, `Controles.css`,
`MenuDeCompartilhar.css`, `MenuDeAcoes.css`); `docs/interface.md` § Identidade
visual reflete os tokens novos. Nenhuma divergência de comportamento: é troca
de valor de token, sem marcação nova.

## Discovery
- Código: `src/theme.css` define os tokens OKLCH e o `background: var(--turf)`
  do `body`. Busca por `--turf(-deep)` em `src/` achou 15 ocorrências em 8
  arquivos. `Cabecalho.css:20` é o único consumidor de `--turf` que **deve**
  manter o verde-gramado. Os demais consumidores de `--turf` são os fundos de
  página de `TelaDeLogin.css:7`, `TermosDeUso.css:5` e
  `PoliticaDePrivacidade.css:5`. `--turf-deep` aparece como fundo do selo
  `×N` e do controle de menos (`Figurinha.css:190,211`), fundo de hover dos
  itens de menu (`MenuDeCompartilhar.css:78`, `MenuDeAcoes.css:100`) e **cor de
  texto sobre `--gold`** (`Controles.css:38` e `TelaDeLogin.css:85`). Nenhum
  teste toca em tokens CSS: buscas por `turf`/`--bg`/`--panel`/`--border` nos
  `*.test.*` não retornaram nada, então não há teste a ajustar (a verificação é
  por leitura, busca, build e visual). Nenhum impacto fora de "Arquivos
  impactados": trocar o valor em `theme.css` já alcança todos os consumidores
  de `--panel`/`--border`, e nenhum outro arquivo de `src/` usa os tokens
  renomeados.
- Documentação: li o IDR 0022 revisado (§ Status, Contexto, Decisão,
  Consequências, Histórico) e `docs/requisitos.md` § Requisitos Não Funcionais
  › Aparência (já ajustado no planejamento, confere com a implementação). Li
  também o IDR 0045 (§ Cores dos super-grupos) para conferir se o `--turf` da
  prosa de contraste das cores de grupo ainda vale — o IDR 0045 mantém o
  cálculo contra `--turf`, então `interface.md` é atualizado em § Paleta e §
  Identidade visual sem tocar nessa prosa.

## Plano da alteração
1. `src/theme.css`: criar `--bg: oklch(0.22 0 0)`; renomear `--turf-deep` para
   `--bg-deep: oklch(0.15 0 0)`; `--panel: oklch(0.19 0 0)`; `--border:
   oklch(0.32 0 0)`; manter `--turf` e demais tokens; trocar o
   `background: var(--turf)` do `body` por `var(--bg)`.
2. `src/components/TelaDeLogin.css`: `var(--turf)` → `var(--bg)` no fundo;
   `var(--turf-deep)` (cor do texto do botão dourado) → `var(--bg-deep)` —
   consequência mecânica do rename, coberta pelo critério "nenhuma ocorrência
   de `--turf-deep` fora de `Cabecalho.css`".
3. `src/components/TermosDeUso.css` e `PoliticaDePrivacidade.css`: fundo
   `var(--turf)` → `var(--bg)`.
4. `src/components/Figurinha.css` (2×), `Controles.css`,
   `MenuDeCompartilhar.css`, `MenuDeAcoes.css`: `var(--turf-deep)` →
   `var(--bg-deep)`.
5. `docs/interface.md` § Identidade visual: introdução (cabeçalho
   verde-gramado + resto neutro, citando o IDR 0022), tabela § Paleta
   (`--turf` restrito ao cabeçalho, `--bg`, `--bg-deep`, `--panel` e `--border`
   sem matiz) e as referências de § Medidas e da tela de login que citam
   `--turf-deep`/fundo gramado.
6. Status `Em andamento` na tarefa e no README (sem commit) e este log.
7. Validação: `npm run lint && npm run test && npm run build`.

- Verificação prevista:
  - tokens novos e sem matiz → leitura de `src/theme.css`;
  - `--turf` inalterado e só em `Cabecalho.css` → busca `var(--turf)`;
  - nenhum `var(--turf-deep)` no código → busca `var(--turf-deep)`;
  - `docs/interface.md` § Paleta reflete o estado atual → leitura do trecho.
- Riscos: o token `--turf-deep` era usado como **cor de texto sobre `--gold`**
  em `Controles.css` e `TelaDeLogin.css`; o valor novo (`oklch(0.15 0 0)`)
  mantém a luminosidade baixa, então o contraste do texto escuro sobre dourado
  permanece — é a mesma troca prevista para `Controles.css` na tarefa. Nenhum
  risco funcional: sem JS, sem estado, sem testes que dependam dos tokens.
- Desvios: nenhum até aqui.

## Decisões tomadas
- Nível 1 (sem registro): trocar também `var(--turf-deep)` por `var(--bg-deep)`
  em `TelaDeLogin.css:85` (cor do texto do botão dourado "continuar"), embora a
  tarefa só liste esse arquivo na troca de `--turf`. O rename de `--turf-deep`
  torna a referência inválida, e o critério "nenhuma ocorrência de
  `var(--turf-deep)` fora de `Cabecalho.css`" exige a troca; o papel é o mesmo
  de `Controles.css` (texto escuro sobre `--gold`), já previsto na tarefa.
- Nível 1 (sem registro): atualizar em `docs/interface.md` as referências de
  `--turf-deep` fora da tabela (tela de login, § Medidas, selo `×N` e controle
  de menos) para `--bg-deep`, e a menção "sobre o fundo gramado" da tela de
  login para o fundo neutro — são descrições visuais afetadas por esta tarefa,
  necessárias para o documento refletir o estado atual (lastro IDR 0022).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
```
$ npm run lint
Found 0 warnings and 0 errors.
Finished in 81ms on 85 files with 105 rules using 4 threads.

$ npm run test
 Test Files  41 passed (41)
      Tests  514 passed (514)

$ npm run build
✓ 136 modules transformed.
dist/assets/index-BXsqzCMu.css   29.30 kB │ gzip:   5.64 kB
dist/assets/index.esm-C_XpY4Pe.js 505.90 kB │ gzip: 148.77 kB
✓ built in 1.08s
```
`npm run build` emite o aviso `Some chunks are larger than 500 kB after
minification` (chunk `index.esm-C_XpY4Pe.js`, 505.90 kB) — pré-existente,
relativo ao bundle do SDK do Firebase, não tocado por esta tarefa.
`npm run test` emite avisos `An update to Avisos inside a test was not wrapped
in act(...)` — pré-existentes, de testes de `App.jsx` não tocados por esta
tarefa (nenhum teste foi alterado).

## Critérios de aceite
- [x] `--bg` e `--bg-deep` existem com os valores neutros; `--panel` e
      `--border` estão sem matiz — `src/theme.css:8-12`: `--bg: oklch(0.22 0
      0)`, `--bg-deep: oklch(0.15 0 0)`, `--panel: oklch(0.19 0 0)`,
      `--border: oklch(0.32 0 0)`
- [x] `--turf` continua `oklch(0.22 0.06 150)`, usado só em `Cabecalho.css` —
      `src/theme.css:10` mantém o valor; a busca por `var(--turf` em `src/` só
      encontra `src/components/Cabecalho.css:20`
- [x] Nenhuma ocorrência de `var(--turf)` ou `var(--turf-deep)` fora de
      `Cabecalho.css` (busca no código) — busca por `var(--turf` retorna
      somente `Cabecalho.css:20`; `var(--turf-deep)` não existe mais em `src/`
      (as 7 ocorrências viraram `var(--bg-deep)` em `Figurinha.css:190,211`,
      `Controles.css:38`, `TelaDeLogin.css:85`, `MenuDeCompartilhar.css:78` e
      `MenuDeAcoes.css:100`); os 3 fundos de `--turf` viraram `var(--bg)` em
      `theme.css:146` (`body`), `TelaDeLogin.css:7`, `TermosDeUso.css:5` e
      `PoliticaDePrivacidade.css:5`
- [x] `docs/interface.md` § Paleta reflete os tokens novos/renomeados —
      `docs/interface.md:742-746` (linhas `--bg`, `--bg-deep`, `--turf`
      restrito ao cabeçalho, `--panel` e `--border` sem matiz) e a introdução
      de § Identidade visual (`:732-735`) descreve o cabeçalho verde-gramado
      com o resto neutro, citando o IDR 0022; as referências de `--turf-deep`
      fora da tabela também foram atualizadas (`:816`, `:883`, `:889`)
- [ ] Verificação visual em `npm run dev` — pendente: sem navegador neste
      ambiente; roteiro no relatório (cabeçalho verde-gramado; corpo, tela de
      login, termos, política, menus e estados da figurinha em cinza neutro,
      sem matiz verde)

## Arquivos alterados
- `src/theme.css` — novos `--bg` e `--bg-deep` (rename de `--turf-deep`);
  `--panel` e `--border` sem matiz; `--turf` mantido e comentário do bloco
  atualizado; `background` do `body` passa a `var(--bg)`
- `src/components/TelaDeLogin.css` — fundo `var(--bg)`; cor do texto do botão
  dourado `var(--bg-deep)`
- `src/components/TermosDeUso.css` — fundo `var(--bg)`
- `src/components/PoliticaDePrivacidade.css` — fundo `var(--bg)`
- `src/components/Figurinha.css` — selo `×N` e controle de menos com
  `var(--bg-deep)`
- `src/components/Controles.css` — texto do controle ativo `var(--bg-deep)`
- `src/components/MenuDeCompartilhar.css` — hover do item `var(--bg-deep)`
- `src/components/MenuDeAcoes.css` — hover do item `var(--bg-deep)`
- `docs/interface.md` — § Identidade visual e § Paleta: `--bg`, `--bg-deep`,
  `--turf` restrito ao cabeçalho, `--panel`/`--border` neutros e as demais
  referências de token atualizadas
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/0002-fundo-neutro-fora-do-cabecalho.md`
  — status
- `docs/plano/README.md` — status da tarefa
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/logs/0002-log-fundo-neutro-fora-do-cabecalho.md`
  — este log
