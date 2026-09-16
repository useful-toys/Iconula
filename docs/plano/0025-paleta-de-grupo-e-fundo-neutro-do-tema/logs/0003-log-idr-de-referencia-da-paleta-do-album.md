<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0025-0003: IDR de referência da paleta do álbum

## Data
2026-09-16

## Resumo
Tarefa só de documentação: conferir que o IDR 0054 (criado no planejamento
da Fase 25) segue a estrutura do guia de IDR e está indexado, e acrescentar
a linha dele no índice de decisões de `docs/arquitetura.md`. Nenhum arquivo
de `src/` é tocado; comportamento do app inalterado.

Antes: o IDR 0054 já existia e já tinha linha em `docs/idr/README.md`, mas
não aparecia em `docs/arquitetura.md` § Decisões-chave e onde vivem, que
lista decisões de interface por número. Depois: a tabela de arquitetura
ganha uma linha para o IDR 0054, completando a indexação. O conteúdo do IDR
(15 cores e o texto da decisão) é decisão já tomada no planejamento e não
foi reaberto.

## Discovery
- Código: não se aplica — nenhum arquivo de `src/`, teste, estilo ou
  configuração muda.
- Documentação: li `docs/idr/CLAUDE.md` (estrutura obrigatória e regra do
  índice), `docs/idr/README.md` (linha do IDR 0054 presente com título,
  status, tags e resumo), `docs/idr/0054-paleta-da-capa-do-album-fifa-2026.md`
  (Status/Contexto/Decisão/Consequências/Histórico; sem `Alternativas
  consideradas`, omissão permitida pelo guia) e `docs/arquitetura.md`
  § Decisões-chave e onde vivem (lista IDRs por número, mas parava nos
  IDR 0022/0042/0043). Conferi que os arquivos linkados pelo IDR 0054
  (IDR 0022, 0045 e 0046) existem.

## Plano da alteração
1. Conferir o IDR 0054 contra a estrutura obrigatória do guia e contra o
   índice `docs/idr/README.md` — sem edição, já que ambos estão corretos.
2. Acrescentar em `docs/arquitetura.md` § Decisões-chave e onde vivem a linha
   `| Paleta de referência da capa do álbum físico | [IDR 0054](…) |`, logo
   após as demais linhas de IDR.
3. Rodar `npm run lint && npm run test && npm run build` para confirmar
   estado válido sem mudança de comportamento.
- Verificação prevista: critério 1 → leitura das seções do IDR; critério 2 →
  busca da linha em `docs/idr/README.md`; critério 3 → `git diff --name-only`
  sem arquivos de `src/`.
- Riscos: nenhum — só documentação; a validação só confirma o estado atual.
- Desvios: nenhum

## Decisões tomadas
- Nenhuma decisão nova: o conteúdo do IDR 0054 está entre as "Decisões já
  tomadas (não reabrir)" e a linha em `docs/arquitetura.md` é aplicação
  direta do escopo 2.

## Impedimentos
Nenhum

## Setup realizado
Nenhum

## Validação
- `npm run lint` — `Found 0 warnings and 0 errors.` (85 arquivos, 105 regras).
- `npm run test` — `Test Files 41 passed (41)`, `Tests 514 passed (514)`.
  Permanecem os avisos pré-existentes `An update to Avisos inside a test was
  not wrapped in act(...)` em testes de `App.jsx` (importar, copiar,
  gravação, exportar, compartilhar), não tocados por esta tarefa.
- `npm run build` — `✓ built in 598ms`; aviso pré-existente de chunk acima
  de 500 kB (`index.esm-*.js` 505.90 kB, SDK do Firebase).
- `git diff --name-only -- src` — vazio.

## Critérios de aceite
- [x] `docs/idr/0054-paleta-da-capa-do-album-fifa-2026.md` segue a
      estrutura obrigatória do guia (Status/Contexto/Decisão/Consequências/Histórico)
      — conferido no arquivo: `# IDR 0054:`, `## Status` (Aceito.), `## Contexto`,
      `## Decisão`, `## Consequências`, `## Histórico`; `## Alternativas
      consideradas` omitido, como o guia permite.
- [x] Linha do IDR 0054 existe em `docs/idr/README.md` — linha 65, com
      título, status, tags e resumo coerentes com o arquivo.
- [x] Nenhum arquivo de `src/` foi tocado por esta tarefa — `git diff
      --name-only -- src` não retorna nada.

## Arquivos alterados
- `docs/arquitetura.md` — linha do IDR 0054 em § Decisões-chave e onde vivem
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/0003-idr-de-referencia-da-paleta-do-album.md` — status para `Em andamento` / `Concluída`
- `docs/plano/README.md` — status da tarefa 0003
- `docs/plano/0025-paleta-de-grupo-e-fundo-neutro-do-tema/logs/0003-log-idr-de-referencia-da-paleta-do-album.md` — este log (criar)
