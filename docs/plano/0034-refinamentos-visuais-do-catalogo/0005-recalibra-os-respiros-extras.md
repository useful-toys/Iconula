<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0034-0005]: Recalibra os respiros extras

## Status
Concluída

## Objetivo
Na verificação visual do preview do PR da Fase 34, os respiros extras das
Tarefas 0034-0002 e 0034-0003 se mostraram quase imperceptíveis sobre o
`gap` de 8px. Dobrar os valores: +4px nas quebras de linha e +8px nas
quebras de página da lista (IDR 0069) e +4px no respiro por mudança de
letra na ordenação por sigla (IDR 0067). O selo `×N` (Tarefa 0034-0004)
foi aprovado e não muda.

## Documentos de referência
- `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md` — decisão a
  atualizar com os valores dobrados
- `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
  — decisão a atualizar com o valor dobrado
- `src/components/Secao.css` `--secao__item--respiro-linha` /
  `--respiro-pagina` — valores atuais 2px/4px
- `src/components/Catalogo.css` `.catalogo__secao--respiro-letra` — valor
  atual 2px

## Padrões e convenções aplicáveis
- As classes de respiro são a única fonte dos valores; os testes
  (`Secao.test.jsx`, `Catalogo.test.jsx`) verificam classes, não pixels —
  não mudam.
- Decisão vigente (IDR 0067/0069) alterada: atualizar o **próprio**
  registro, com a anterior em `## Histórico`, no mesmo commit.

## Escopo e instruções de implementação
1. `Secao.css`: `.secao__item--respiro-linha` de `2px` para `4px`;
   `.secao__item--respiro-pagina` de `4px` para `8px`; ajustar o
   comentário para os novos valores.
2. `Catalogo.css`: `.catalogo__secao--respiro-letra` de `2px` para `4px`;
   ajustar o comentário.
3. Atualizar os comentários de `Secao.jsx`, `Catalogo.jsx` e
   `catalogoOrdenacoes.js` que citam `+2px`/`+4px`.
4. `docs/idr/0069-...md` e `docs/idr/0067-...md`: atualizar Contexto,
   Decisão e Consequências para os valores novos e mover a decisão
   anterior para `## Histórico`, com a data e o motivo (verificação
   visual do preview). Atualizar as linhas correspondentes em
   `docs/idr/README.md`.
5. `docs/interface.md` § Corpo e § Medidas: atualizar os valores
   descritos (`+4px` linha, `+8px` página, `+4px` letra) mantendo as
   citações aos IDR 0067/0069.

**Fora do escopo**: mudar o `gap` padrão de 8px, a exclusão do FWC ou o
gradiente do selo (IDR 0066, aprovado); qualquer mudança de classe ou de
teste.

## Decisões já tomadas (não reabrir)
- Dobrar os respiros extras — confirmado pelo humano (2026-09-18) após a
  verificação visual do preview; atualiza
  `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md` e
  `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
- `gap` padrão de 8px e exclusão do FWC — ver
  `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md`

## Arquivos impactados
- `src/components/Secao.css` — modificar
- `src/components/Secao.jsx` — modificar (comentário)
- `src/components/Catalogo.css` — modificar
- `src/components/Catalogo.jsx` — modificar (comentário)
- `src/data/catalogoOrdenacoes.js` — modificar (comentário)
- `docs/idr/0069-espacadores-de-linha-e-pagina-na-lista.md` — modificar
- `docs/idr/0067-respiro-entre-secoes-ao-mudar-de-letra-na-ordenacao-por-sigla.md`
  — modificar
- `docs/idr/README.md` — modificar (linhas dos IDR 0067/0069)
- `docs/interface.md` — modificar (§ Corpo, § Medidas)

## Critérios de aceite
- [ ] `.secao__item--respiro-linha` vale 4px e `--respiro-pagina` vale
      8px — verificação por trecho
- [ ] `.catalogo__secao--respiro-letra` vale 4px — verificação por trecho
- [ ] `docs/idr/0067` e `docs/idr/0069` trazem os valores novos e a
      decisão anterior em `## Histórico`; `docs/idr/README.md` acompanha
- [ ] `docs/interface.md` § Corpo e § Medidas descrevem os valores novos
      e citam os IDR 0067/0069
- [ ] Suíte existente continua verde (as classes não mudam)
