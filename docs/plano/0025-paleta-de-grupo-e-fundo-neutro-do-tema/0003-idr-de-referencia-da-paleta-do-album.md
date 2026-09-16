<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0025-0003]: IDR de referência da paleta do álbum

## Status
Pendente

## Objetivo
Nenhuma mudança de código: só conferir que o registro `docs/idr/0054-*.md`
(criado no planejamento) está correto e referenciado onde apropriado.

## Documentos de referência
- `docs/idr/0054-paleta-da-capa-do-album-fifa-2026.md` — já escrito no
  planejamento desta fase

## Escopo e instruções de implementação
1. Conferir que `docs/idr/0054-paleta-da-capa-do-album-fifa-2026.md` segue
   a estrutura do guia (`docs/idr/CLAUDE.md`) e tem linha em
   `docs/idr/README.md`.
2. Se `docs/arquitetura.md` § índice de decisões existir e listar IDRs por
   número, acrescentar a linha do IDR 0054 lá também.
3. Nenhum token CSS nasce desta tarefa — não editar `theme.css` nem
   nenhum componente.

**Fora do escopo**: qualquer alteração de cor de grupo ou de seção
(Tarefas 0025-0001, 0026-0001).

## Decisões já tomadas (não reabrir)
- Conteúdo do IDR 0054 (as 15 cores e o texto de decisão) — já registrado
  no planejamento; esta tarefa só confere e referencia

## Arquivos impactados
- `docs/arquitetura.md` — modificar, só se houver índice de decisões por
  número (§ a localizar)

## Critérios de aceite
- [ ] `docs/idr/0054-paleta-da-capa-do-album-fifa-2026.md` segue a
      estrutura obrigatória do guia (Status/Contexto/Decisão/Consequências/Histórico)
- [ ] Linha do IDR 0054 existe em `docs/idr/README.md`
- [ ] Nenhum arquivo de `src/` foi tocado por esta tarefa

## Validação
`npm run lint && npm run test && npm run build` (deve passar sem qualquer
mudança de comportamento, já que nada em `src/` muda).
