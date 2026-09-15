<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0022-0001: cartão de 60×70px e paisagem de 70×60px

## Data
2026-09-15

## Resumo
Antes: cartão retrato de 60×68px nas duas disposições e paisagem de 126×68px
(a largura de duas trilhas de 60px mais o gap de 6px) com a altura do retrato;
linhas do álbum de 68px; a única paisagem era a 13, e a largura da paisagem
não caberia numa trilha. Depois: retrato de 60×70px e paisagem de 70×60px —
as medidas do retrato com largura e altura trocadas, preservando a proporção
do cromo —, nas duas disposições; linhas do álbum de 70px.

- `src/components/Figurinha.css`: retrato 60×70px; a variante paisagem passa a
  fixar largura **e** altura (70×60px) em vez de só os 126px de duas trilhas; o
  comentário da área de toque do menos passa a citar 60×70px (retrato) e
  70×60px (paisagem), ambas com o alvo de 22×22px contido.
- `src/components/PaginaDoAlbum.css`: linhas do grid de 70px; a célula da
  paisagem segue reservando as trilhas 3–4 e centralizando o cartão nos dois
  eixos (o `align-items`/`justify-content: center` já existente, agora com
  sobra de 28px de cada lado).
- `src/components/Secao.css`: `align-items: center` na grade da lista — a
  paisagem de 60px de altura centraliza na linha de cartões de 70px; os
  retratos preenchem a linha e não mudam.
- `src/theme.css`: `--secao-altura-estimada` escalada de 370px para 381px
  (370 × 70/68 ≈ 381), com a conta no comentário.
- `docs/interface.md`: § Corpo, § Disposição "Como no álbum" › Seleções — 4
  trilhas por página e § Medidas com as medidas novas, citando o IDR 0047.

Divergências: nenhuma — código, `interface.md` e o IDR 0047 concordam.

## Discovery
- Código: cartão medido em `src/components/Figurinha.css` (retrato 60×68,
  paisagem 126×68 = duas trilhas mais o gap) e linhas do álbum em
  `src/components/PaginaDoAlbum.css` (`grid-template-rows: repeat(3, 68px)`).
  A paisagem é marcada por `paisagem` em `Figurinha.jsx:186` e pela posição
  `trilhas === 2` em `PaginaDoAlbum.jsx:37`. Na lista, os cartões ficam em
  `.secao__grade` (flex com `flex-wrap`, `gap: var(--card-gap-list)`), que
  hoje não define `align-items` — a paisagem de 60px de altura ficaria colada
  no topo da linha de 70px. No álbum, `.pagina-album__celula` já centraliza
  nos dois eixos (`align-items: center; justify-content: center`), então a
  paisagem mais estreita que as duas trilhas já nasce centralizada, sem
  `width: 100%` interferir no tamanho do cartão. O menos (18px, alvo +4px)
  segue contido com folga nas duas medidas novas (22 ≤ 60 e 22 ≤ 70), então
  `Figurinha.css` só precisa atualizar o comentário da área de toque.
  Único token dependente da altura: `--secao-altura-estimada` em
  `src/theme.css` (placeholder do `content-visibility`, TDR 0021).
  Testes de `Secao.test.jsx` e `PaginaDoAlbum.test.jsx` não afirmam medidas
  de cartão e citam as trilhas 3–4, que não mudam — seguem verdes sem
  alteração.
- Documentação: as referências bastaram; confirmei no `IDR 0047` (Decisão e
  Consequências) as medidas 60×70/70×60, as metades de 33px/28px, a
  centralização no álbum (28px dos lados, 5px em cima e embaixo) e a conta
  `370 × 70/68 ≈ 381px` do `--secao-altura-estimada`.

## Plano da alteração
1. `src/components/Figurinha.css` — retrato 60×70 nas duas variantes;
   paisagem passa a fixar largura e altura (70×60); comentários citam o IDR
   0047 e o cartão de 60×70 no comentário da área de toque.
2. `src/components/Secao.css` — `align-items: center` em `.secao__grade` para
   a paisagem de 60px centralizar na altura da linha de 70px (retratos de
   70px não mudam); comentário cita o IDR 0047.
3. `src/components/PaginaDoAlbum.css` — `grid-template-rows` de 70px;
   comentário do `--paisagem` explicando a centralização do cartão de 70×60
   no espaço das trilhas 3–4.
4. `src/theme.css` — `--secao-altura-estimada: 381px` (370 × 70/68), com a
   conta no comentário.
5. `docs/interface.md` — § Corpo (linha 209–211), § Disposição "Como no
   álbum" › Seleções — 4 trilhas (linha 232–233 e 243) e § Medidas (linha
   768–776) com as medidas novas, citando o IDR 0047.
6. Status: tarefa e README (`Em andamento` → `Concluída`).
- Verificação prevista: critérios por trecho (`Figurinha.css`,
  `PaginaDoAlbum.css`, `theme.css`), por busca (`126×68`/`60×68` em
  `interface.md`), por `git diff --name-only` (sem `catalogoLayout.js` nem
  `preferenciasDeVista.js`) e visual em `npm run dev`.
- Riscos: nenhum estrutural; a centralização na lista afeta só a paisagem de
  60px de altura porque os retratos preenchem a linha de 70px.
- Desvios: nenhum até aqui.

## Decisões tomadas
- Centralizar a paisagem na lista pela grade inteira (`align-items: center`
  em `.secao__grade`) em vez de só no cartão paisagem (`align-self`) —
  mantém a regra de tamanho da paisagem isolada e não tem efeito visível nos
  retratos, que preenchem a linha; sem registro por ser nível 1.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- `npm run lint` → `Found 0 warnings and 0 errors.` (79 arquivos).
- `npm run test` → `Test Files 41 passed (41)`, `Tests 489 passed (489)`.
- `npm run build` → `✓ 136 modules transformed`, `✓ built in 525ms`; único
  aviso, pré-existente e documentado (chunk `index.esm` > 500 kB, TDR 0021).
- `test:rules` não se aplica (não tocou `firestore.rules`).
- `git diff --name-only` → só `Figurinha.css`, `PaginaDoAlbum.css`, `Secao.css`,
  `theme.css`, `docs/interface.md`, arquivo da tarefa, `docs/plano/README.md`
  e o log; `catalogoLayout.js` e `preferenciasDeVista.js` intocados.
- Busca por `126×68`/`60×68`/`68px` em `docs/interface.md` → nenhuma
  ocorrência.

## Critérios de aceite
- [x] Retrato de 60×70px e paisagem de 70×60px nas duas variantes —
  `Figurinha.css:17-27`.
- [x] Linhas do álbum de 70px e colunas de 60px —
  `PaginaDoAlbum.css:5` e `PaginaDoAlbum.jsx:31`.
- [x] Paisagem centralizada nos dois eixos no espaço das trilhas 3–4 e na
  altura da linha na lista — `PaginaDoAlbum.css:10-14` (flex centrado) e
  `Secao.css:150-158` (`align-items: center`); verificação visual pendente.
- [x] `--secao-altura-estimada` recalculada, com a conta no comentário —
  `theme.css:110-113`.
- [x] `catalogoLayout.js` e `preferenciasDeVista.js` sem alteração —
  `git diff --name-only`.
- [x] `interface.md` § Corpo, § Seleções — 4 trilhas por página e § Medidas
  com as medidas novas, citando o IDR 0047; sem `126×68`/`60×68` — busca.

## Arquivos alterados
- `src/components/Figurinha.css` — retrato 60×70px; paisagem 70×60px; comentário
  da área de toque atualizado.
- `src/components/Secao.css` — `align-items: center` na `.secao__grade`.
- `src/components/PaginaDoAlbum.css` — linhas de 70px; comentário da célula
  paisagem.
- `src/theme.css` — `--secao-altura-estimada: 381px` e comentário.
- `docs/interface.md` — § Corpo, § Seleções — 4 trilhas, § Medidas.
- `docs/plano/0022-proporcao-e-nome-das-figurinhas-paisagem/0001-…md` — status
  `Concluída`.
- `docs/plano/README.md` — fase e tarefa 0001 `Concluída`.
