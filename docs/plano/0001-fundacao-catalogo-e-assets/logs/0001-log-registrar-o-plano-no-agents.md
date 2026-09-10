<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0001-0001: registrar o plano no AGENTS.md

## Data
2026-09-09

## Resumo
Acrescentada, na tabela "Onde fica cada coisa" do `AGENTS.md`, a linha
correspondente a `docs/plano/`, descrevendo-a como o plano de implementação
em fases e tarefas, com `docs/plano/README.md` como índice e mapa de status.

A linha entrou logo depois de `docs/arquitetura.md` e antes de `docs/adr/`:
`docs/plano/` reúne o roteiro de execução, no mesmo bloco temático dos demais
documentos conceituais do produto (requisitos, interface, persistência,
arquitetura), antes das pastas de registro de decisões (`adr/`, `tdr/`,
`idr/`) e dos documentos de ambiente (`firebase.md`, `gcloud.md`,
`github.md`, `registrobr.md`).

Conferido que a descrição de `docs/requisitos.md` como fonte de escopo
continua correta e não precisou mudar. Nenhuma outra seção do `AGENTS.md`
foi tocada.

## Decisões tomadas
Nenhuma. O posicionamento da linha na tabela é uma escolha editorial
reversível (ordem por afinidade dentro de um índice), não uma decisão de
arquitetura, técnica ou de interface — não gera ADR/TDR/IDR.

## Impedimentos
Nenhum.

## Validação
```
npm run lint && npm run test && npm run build
```
- `oxlint`: sem erros.
- `vitest run`: 6 arquivos de teste, 29 testes, todos passando.
- `vite build`: build de produção concluído com sucesso (aviso pré-existente
  sobre chunk grande, não relacionado a esta tarefa).

## Arquivos alterados
- `AGENTS.md` — linha nova na tabela "Onde fica cada coisa"
- `docs/plano/0001-fundacao-catalogo-e-assets/0001-registrar-o-plano-no-agents.md` — status atualizado
- `docs/plano/README.md` — status da tarefa 0001 atualizado
- `docs/plano/0001-fundacao-catalogo-e-assets/logs/0001-log-registrar-o-plano-no-agents.md` — este log
