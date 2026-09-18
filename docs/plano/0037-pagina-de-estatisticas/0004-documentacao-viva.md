<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa 0037-0004: Documentação viva da página de estatísticas

## Status
Concluída

## Objetivo
Refletir a página de estatísticas na documentação de referência: arquitetura
(camadas e índice de decisões) e a tabela de componentes e módulos do
AGENTS.md, cada trecho com lastro no IDR 0072 e no TDR 0030.

## Documentos de referência
- `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md` — lastro da
  vista e do botão
- `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md` — lastro
  dos gráficos à mão
- `docs/arquitetura.md` § Camadas no cliente e § Decisões-chave — onde entram
  o módulo e o componente
- `AGENTS.md` § Onde fica cada coisa — tabela de componentes e módulos

## Padrões e convenções aplicáveis
- `docs/*.md` descrevem o estado atual, com lastro em registro — guia
  `docs/plano/CLAUDE.md` § Documentação viva

## Escopo e instruções de implementação
1. `docs/arquitetura.md` § Camadas no cliente: citar `src/lib/estatisticas.js`
   (derivação pura dos cinco blocos) na camada `src/lib/`, e
   `Estatisticas.jsx` na camada `src/components/` (vista interna de
   estatísticas).
2. `docs/arquitetura.md` § Decisões-chave: acrescentar linhas para
   [IDR 0072](../idr/0072-pagina-de-estatisticas-como-vista-interna.md) e
   [TDR 0030](../tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md).
3. `AGENTS.md` § Onde fica cada coisa: acrescentar as linhas de
   `src/lib/estatisticas.js` e `src/components/Estatisticas.jsx`.

**Fora do escopo**: código, teste ou estilo — entregues pelas Tarefas
0037-0001 a 0037-0003; `docs/requisitos.md` (já atualizado no esmiuçamento).

## Decisões já tomadas (não reabrir)
- Vista interna e conteúdo — ver
  `docs/idr/0072-pagina-de-estatisticas-como-vista-interna.md`
- Gráficos à mão — ver
  `docs/tdr/0030-graficos-de-estatisticas-a-mao-sem-biblioteca.md`

## Arquivos impactados
- `docs/arquitetura.md` — modificar (§ Camadas no cliente, § Decisões-chave)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite
- [ ] `docs/arquitetura.md` cita `estatisticas.js` e `Estatisticas.jsx` e
      tem linhas para IDR 0072 e TDR 0030 no índice de decisões
- [ ] `AGENTS.md` tem as linhas de `src/lib/estatisticas.js` e
      `src/components/Estatisticas.jsx`
- [ ] Links relativos válidos; nenhum arquivo de código alterado
