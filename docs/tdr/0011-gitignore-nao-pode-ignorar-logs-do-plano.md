<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# TDR 0011: `.gitignore` não pode ignorar os logs de execução do plano

## Status

Aceito

## Contexto

- Achado durante a Tarefa 0001-0002, ao tentar commitar o log de execução
  exigido pelo `docs/plano/README.md` § Legenda de status: `git status`
  não listava `docs/plano/0001-fundacao-catalogo-e-assets/logs/0002-log-*.md`
  como novo.
- Causa (`git check-ignore -v`): a regra `logs` em `.gitignore` (linha 4,
  pensada para um diretório de logs de execução local, tipo
  `npm-debug.log*`) não tem `/` — em `.gitignore`, um padrão sem barra
  casa em **qualquer profundidade**, então ela ignora todo diretório
  chamado `logs`, incluindo `docs/plano/*/logs/`.
- Consequência mais grave: o log da Tarefa 0001-0001
  (`docs/plano/0001-fundacao-catalogo-e-assets/logs/0001-log-registrar-o-plano-no-agents.md`)
  já existia no disco e é citado como critério de aceite cumprido
  daquela tarefa, mas nunca foi de fato commitado — `git ls-files` não o
  lista. O bug é anterior a esta tarefa; só ficou visível agora porque
  este é o primeiro log a nascer depois que aquela tarefa fechou.

## Decisão

- Restringir a regra ao diretório de topo: `logs` → `/logs` em
  `.gitignore`. Continua ignorando um eventual diretório `logs/` na raiz
  do projeto (nenhum existe hoje — a regra é preventiva, herdada do
  template padrão de `.gitignore` para projetos Node), mas para de casar
  `docs/plano/*/logs/`, que o próprio plano de implementação exige
  versionar.
- O log da Tarefa 0001-0001, órfão do rastreamento por causa do bug,
  entra no controle de versão nesta mesma alteração — não é trabalho da
  Tarefa 0001-0002, é a correção do efeito colateral do bug que esta
  tarefa encontrou.

## Consequências

- Todo log de tarefa futuro em `docs/plano/*/logs/` passa a ser
  commitável normalmente.
- O histórico do repositório passa a incluir, de fato, o log da Tarefa
  0001-0001 — sem isso, a garantia do `README.md` de que "o log aponta
  para o registro" audita um arquivo que não existia no repositório
  remoto.
- Nenhum outro diretório do projeto se chama `logs`; a mudança não expõe
  nada que a regra original pretendia esconder.

## Alternativas consideradas

- **Regra negativa (`!docs/plano/**/logs/`) mantendo `logs` genérico**:
  funciona, mas é mais frágil a novos diretórios `logs` fora do plano no
  futuro (cada um exigiria sua própria exceção); `/logs` resolve a causa
  raiz com uma linha mais simples.
- **Remover a regra `logs` por completo**: perderia a proteção original
  contra um diretório de logs de execução na raiz, sem necessidade —
  nenhuma parte do produto grava logs ali.
