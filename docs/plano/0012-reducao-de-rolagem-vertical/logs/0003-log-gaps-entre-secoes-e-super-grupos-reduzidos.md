<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0012-0003: gaps entre seções e super-grupos reduzidos

## Data
2026-09-13

## Resumo
Antes: os três tokens de espaçamento entre blocos do catálogo valiam
`--super-group-gap: 16px`, `--section-gap: 14px` e `--section-body-gap:
10px`. Depois: `12px`, `10px` e `8px` — 4px a menos entre super-grupos,
4px a menos entre seções e 2px a menos do título/cabeçalho ao corpo.
A mudança é só de valor, em `src/theme.css`; nenhum seletor, componente,
teste ou comportamento muda. Os tokens `--card-gap-list` (8px) e
`--album-page-gap` (20px) ficam intactos, como o IDR 0050 fixa.

`docs/interface.md` § Medidas passa a citar os novos valores, com o
IDR 0050 — o registro que já fixou a compactação no planejamento.

## Discovery
- Código: os três tokens são definidos em `src/theme.css:23-25` e
  consumidos por:
  - `--super-group-gap` → `.super-grupo + .super-grupo { margin-top }`
    (`src/components/SuperGrupo.css:9`), um vão entre cada par de
    super-grupos consecutivos;
  - `--section-gap` → `.catalogo { gap }` entre blocos de topo
    (`src/components/Catalogo.css:6`), `.super-grupo__corpo { gap }` entre
    as seções de um grupo (`src/components/SuperGrupo.css:53`) e
    `.super-grupo + .super-grupo` usa `--super-group-gap` no lugar;
  - `--section-body-gap` → `.secao { gap }` entre o cabeçalho e o corpo
    (`src/components/Secao.css:6`), `.super-grupo__corpo { margin-top }`
    do título ao corpo (`SuperGrupo.css:54`) e `.secao__corpo { gap }`
    (`Secao.css:84`) — este último envolve **um único filho** (a grade ou
    o álbum, `src/components/Secao.jsx:179-203`), então o `gap` não tem
    par e não contribui para a altura: não entra na conta.
  - Estrutura: 50 seções. Na ordenação por página, FWC abre e COC fecha
    soltos, com os 12 super-grupos A–L no meio, 4 seleções cada
    (`src/components/Catalogo.jsx:15-16`, `:59-64`); na ordenação por
    sigla, as 50 seções ficam no mesmo nível (`Catalogo.jsx:242-268`).
  - Comportamento atual confere com a tarefa: os três tokens valem 16/14/10px.
  - Nenhum JS ou teste depende do valor dos tokens (jsdom não calcula
    layout): `Secao.test.jsx`/`SuperGrupo.test.jsx` afirmam estrutura e
    `aria`, nunca CSS de folha.
- Documentação: além das referências, reli o `TDR 0021` § Decisão (o token
  `--secao-altura-estimada` e como o `content-visibility: auto` o usa) para
  decidir a recalibração, e o log da Tarefa 0012-0002 como precedente de
  mudança só de CSS. As referências bastaram para o resto; nenhum registro
  novo é necessário — a decisão já está no IDR 0050.

## Plano da alteração
1. `src/theme.css` — `--super-group-gap` 16 → 12px; `--section-gap` 14 →
   10px; `--section-body-gap` 10 → 8px. Nenhuma outra linha de CSS muda.
2. `docs/interface.md` § Medidas — a linha "Corpo" passa a "12px entre
   super-grupos" (o `padding` de 60px fica para a Tarefa 0012-0004) e a
   linha "Espaçamentos internos" passa a "10px entre seções…, 8px entre o
   cabeçalho da seção e a sua grade…", ambas citando o IDR 0050.
3. Arquivo da tarefa e `docs/plano/README.md` — status; este log.

- Verificação prevista:
  - critério 1 (três tokens em 12/10/8px) → leitura de `src/theme.css`;
  - critério 2 (`--card-gap-list` e `--album-page-gap` inalterados) →
    `git diff src/theme.css`;
  - critério 3 (economia × ocorrências) → conta no log;
  - critério 4 (`interface.md` § Medidas com os novos valores e o IDR 0050)
    → leitura da seção;
  - validação adicional (visual em `npm run dev`) → roteiro (sem navegador
    autenticável no ambiente).
- Riscos: nenhum espaçamento chega a zero (12/10/8px), então blocos
  distintos continuam distintos (IDR 0050); a mudança é só de valor, sem
  tocar em arquitetura de espaçamento.
- Desvios: nenhum.

## Decisões tomadas
- Manter `--secao-altura-estimada` em `360px`, sem recalibrar: só
  `--section-body-gap` entra na altura de uma seção, e 2px sobre ~360px é
  ~0,6%; o token é só o placeholder antes da primeira medição real e o
  modificador `auto` do `content-visibility` passa a lembrar a altura de
  fato renderizada (TDR 0021). Recalibrar exigiria medição em navegador,
  que este ambiente não oferece, e não muda o comportamento (nível 1,
  registrado neste log). Mesma conclusão da Tarefa 0012-0002.
- Mudança puramente de estilo, sem teste unitário: jsdom não calcula
  layout nem CSS de folha; os critérios pedem conferência no CSS, como nas
  Tarefas 0011-0003 e 0012-0002 (nível 1).

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.`
- `npm run test` → `Test Files 36 passed (36)`, `Tests 404 passed (404)`. Os
  avisos de `act` em `App.gravacao.test.jsx`/`App.importar.test.jsx`/
  `App.copiar.test.jsx`/`App.exportar.test.jsx` são pré-existentes (Avisos
  atualiza fora de `act`), não vêm desta mudança.
- `npm run build` → `✓ 131 modules transformed`, `✓ built in 1.95s`. O aviso
  de chunk >500 kB é pré-existente.
- `npm run test:rules` não se aplica: `firestore.rules` intocado.

## Critérios de aceite
- [x] Os três tokens com 12px, 10px e 8px (conferido no CSS) —
  `src/theme.css:23-25`: `--super-group-gap: 12px`, `--section-gap: 10px`,
  `--section-body-gap: 8px`.
- [x] `--card-gap-list` e `--album-page-gap` inalterados (conferido no diff) —
  `git diff src/theme.css` só mostra as três linhas mudadas; `:26` segue
  `--card-gap-list: 8px` e `:27` segue `--album-page-gap: 20px`.
- [x] Economia estimada registrada no log — conta abaixo.
- [x] `docs/interface.md` § Medidas com os novos valores, citando o IDR 0050 —
  `docs/interface.md:594-595` (12px entre super-grupos) e `:600-602`
  (10px entre seções, 8px do cabeçalho à grade), ambos com `(IDR 0050)`.

Economia estimada, por token × ocorrências (valores: 16→12px = 4px;
14→10px = 4px; 10→8px = 2px):

| Token | Ocorrências | Onde | Economia |
|---|---:|---|---:|
| `--super-group-gap` | 11 | entre os 12 super-grupos A–L (`.super-grupo + .super-grupo`) | 44px |
| `--section-gap` (página) | 13 | entre os 14 blocos de topo: FWC + 12 grupos + COC (`.catalogo`) | 52px |
| `--section-gap` (página) | 36 | dentro dos grupos: 12 × (4 seleções − 1) (`.super-grupo__corpo`) | 144px |
| `--section-body-gap` (página) | 50 | cabeçalho → corpo de cada seção (`.secao`) | 100px |
| `--section-body-gap` (página) | 12 | título → corpo de cada super-grupo (`.super-grupo__corpo`) | 24px |
| **Total na ordenação por página** | | | **364px** |
| `--section-gap` (sigla) | 49 | entre as 50 seções de topo (`.catalogo`) | 196px |
| `--section-body-gap` (sigla) | 50 | cabeçalho → corpo de cada seção (`.secao`) | 100px |
| **Total na ordenação por sigla** | | | **296px** |

(`.secao__corpo { gap }` não entra: envolve um único filho — a grade ou o
álbum —, então não tem par de itens e não gera altura. A conta supõe todas as
seções e super-grupos expandidos; colapsados, a economia é menor, mas os vãos
entre blocos de topo permanecem.)

## Arquivos alterados
- `src/theme.css` — `--super-group-gap`, `--section-gap` e
  `--section-body-gap` com os novos valores.
- `docs/interface.md` § Medidas — linhas "Corpo" e "Espaçamentos internos"
  com os novos valores citando o IDR 0050.
- `docs/plano/0012-reducao-de-rolagem-vertical/0003-gaps-entre-secoes-e-super-grupos-reduzidos.md` — status.
- `docs/plano/README.md` — status da tarefa.
- `docs/plano/0012-reducao-de-rolagem-vertical/logs/0003-log-gaps-entre-secoes-e-super-grupos-reduzidos.md` — este log.
