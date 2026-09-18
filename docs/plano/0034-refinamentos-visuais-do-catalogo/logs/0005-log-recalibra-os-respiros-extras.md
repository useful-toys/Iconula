<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0034-0005: Recalibra os respiros extras

## Data
2026-09-18

## Resumo
Dobra os respiros extras criados nas Tarefas 0034-0002 e 0034-0003, que se
mostraram quase imperceptíveis sobre o `gap` de 8px na verificação visual do
preview do PR da Fase 34. Na lista, a quebra de linha passa de +2px para +4px
(8px → 12px) e a quebra de página de +4px para +8px (8px → 16px); na
ordenação por sigla, a mudança de letra passa de +2px para +4px (8px →
12px). Os valores vivem só no CSS (`Secao.css`, `Catalogo.css`); as classes e
os testes (`Secao.test.jsx`, `Catalogo.test.jsx`) não mudam, porque verificam
classes, não pixels. As decisões vigentes (IDR 0067 e IDR 0069) são
atualizadas no próprio registro, com a versão anterior em `## Histórico`, e
os valores de `docs/interface.md` acompanham; o selo `×N` (IDR 0066,
Tarefa 0034-0004) não muda.

## Discovery
- Código: os valores estão só em `Secao.css` (`.secao__item--respiro-linha`
  `margin-inline-end: 2px` e `.secao__item--respiro-pagina` `4px`) e em
  `Catalogo.css` (`.catalogo__secao--respiro-letra` `margin-top: 2px`); as
  classes são atribuídas em `Secao.jsx` (`classeDoItem`) e `Catalogo.jsx`
  (`letraMudou`). A busca por `respiro-linha|respiro-pagina|respiro-letra`
  no `src/` confirma que só os testes citam as classes e nenhum teste lê
  pixels. Comentários com `+2px`/`+4px` em `Secao.css`, `Secao.jsx`,
  `Catalogo.css`, `Catalogo.jsx` e `catalogoOrdenacoes.js` também citam os
  valores. Comportamento atual confere com a tarefa.
- Documentação: li o IDR 0067 e o IDR 0069 inteiros (Contexto, Decisão,
  Consequências, Alternativas) e o `docs/idr/CLAUDE.md` antes de editar os
  registros; confirmei que os registros ainda não têm `## Histórico`. As
  linhas de `docs/idr/README.md` e os trechos de `docs/interface.md`
  § Corpo e § Medidas foram localizados por busca.

## Plano da alteração
1. `Secao.css`: `.secao__item--respiro-linha` 2px → 4px e
   `.secao__item--respiro-pagina` 4px → 8px; comentário para os novos valores.
2. `Catalogo.css`: `.catalogo__secao--respiro-letra` 2px → 4px; comentário.
3. Comentários de `Secao.jsx`, `Catalogo.jsx` e `catalogoOrdenacoes.js` com
   os valores novos.
4. IDR 0069 e IDR 0067: Contexto, Decisão, Consequências e Alternativas para
   os valores novos, com a decisão anterior em `## Histórico` (data e motivo:
   verificação visual do preview); linhas correspondentes em
   `docs/idr/README.md`.
5. `docs/interface.md` § Corpo e § Medidas com os valores novos, mantendo as
   citações aos IDR 0067/0069.
6. Log, status e commit (`feat(catalogo): ...`, `Tarefa 0034-0005`).
- Verificação prevista: critério 1 e 2 → trecho de `Secao.css`/`Catalogo.css`;
  critério 3 → leitura dos IDRs e do índice; critério 4 → leitura de
  `interface.md`; critério 5 → `npm run test`.
- Riscos: nenhum funcional — só valores de `margin` e comentários; os testes
  verificam classes e devem continuar verdes.
- Desvios: nenhum.

## Decisões tomadas
- Dobrar os respiros extras (+4px linha, +8px página, +4px letra) — decisão
  já confirmada pelo humano (2026-09-18) e registrada nas atualizações do
  IDR 0067 e do IDR 0069.

## Impedimentos
Nenhum.

## Setup realizado
Nenhum.

## Validação

`npm run lint`:
```
> iconula@0.0.0 lint
> oxlint
```
(sem avisos)

`npm run test`:
```
 Test Files  50 passed (50)
      Tests  671 passed (671)
```

`npm run build`:
```
✓ 146 modules transformed.
✓ built in 2.06s
(!) Some chunks are larger than 500 kB after minification. Consider:
```
(aviso pré-existente, já registrado nas Tarefas 0034-0001 a 0034-0004)

## Critérios de aceite
- [x] `.secao__item--respiro-linha` vale 4px e `--respiro-pagina` vale 8px —
      `src/components/Secao.css:363-369` (`margin-inline-end: 4px` e `8px`).
- [x] `.catalogo__secao--respiro-letra` vale 4px —
      `src/components/Catalogo.css:13-15` (`margin-top: 4px`).
- [x] `docs/idr/0067` e `docs/idr/0069` trazem os valores novos e a decisão
      anterior em `## Histórico`; `docs/idr/README.md` acompanha —
      `docs/idr/0067-*.md:32-33,59-64`, `docs/idr/0069-*.md:44-46,81-88`,
      `docs/idr/README.md:78,80`.
- [x] `docs/interface.md` § Corpo e § Medidas descrevem os valores novos e
      citam os IDR 0067/0069 — `docs/interface.md:271-281,1081-1087`.
- [x] Suíte existente continua verde (as classes não mudam) —
      `npm run test`: 671 testes em 50 arquivos, todos verdes.

## Arquivos alterados
- `src/components/Secao.css` — `respiro-linha` 2px → 4px e `respiro-pagina`
  4px → 8px; comentário do IDR 0069.
- `src/components/Catalogo.css` — `respiro-letra` 2px → 4px; comentário do
  IDR 0067.
- `src/components/Secao.jsx` — comentário do respiro com os valores novos.
- `src/components/Catalogo.jsx` — comentário do respiro por letra.
- `src/data/catalogoOrdenacoes.js` — comentário do `letraMudou`.
- `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md` — decisão
  atualizada e `## Histórico`.
- `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
  — decisão atualizada e `## Histórico`.
- `docs/idr/README.md` — resumos dos IDR 0067/0069.
- `docs/interface.md` — § Corpo e § Medidas com os valores novos.
- `docs/plano/0034-refinamentos-visuais-do-catalogo/0005-recalibra-os-respiros-extras.md`
  — status.
- `docs/plano/README.md` — status da tarefa 0034-0005.
- `docs/plano/0034-refinamentos-visuais-do-catalogo/logs/0005-log-recalibra-os-respiros-extras.md`
  — este log.
