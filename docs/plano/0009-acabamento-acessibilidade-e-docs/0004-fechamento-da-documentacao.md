<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0009-0004]: fechamento da documentação

## Status
Pendente

## Documentos de referência (ler antes de implementar)
- `AGENTS.md` § Convenções — os documentos devem sempre corresponder ao estado real; divergência notada se corrige
- `docs/interface.md` § Pendências de interface — a lista que precisa ficar vazia (ou justificada) ao fim do plano
- `docs/arquitetura.md` § Pontos em aberto (fase de implementação) — os cinco pontos que o plano alocou
- `docs/requisitos.md` § Decisões Pendentes — as três pendências que o plano alocou
- `docs/persistencia.md` § Pronto × falta — a tabela que precisa refletir o produto implementado
- `docs/plano/README.md` — a tabela de alocação, que diz onde cada pendência foi resolvida

## Objetivo
Deixar a documentação correspondendo ao produto que existe: pendências
resolvidas saem das listas, pontos em aberto fechados saem de `arquitetura.md`, e
cada decisão tomada durante a execução tem um registro apontado no lugar certo.

## Padrões e convenções aplicáveis
- Os documentos devem sempre corresponder ao estado real; divergência notada se
  corrige junto — `AGENTS.md` § Convenções
- Pendência resolvida **sai** da lista e aponta para o registro que a resolveu —
  `AGENTS.md` § Convenções
- Registro existente não se reescreve: ADRs, TDRs e IDRs ficam como estão, e o
  que muda é o documento de estado — `AGENTS.md` § Convenções
- `docs/requisitos.md` é a fonte de escopo; em conflito, ele vence — não ajustar
  requisito para caber no que foi implementado — `docs/interface.md` § O que é este documento
- Pendência que **não** foi resolvida continua listada, com o motivo — não some
  em silêncio

## Escopo e instruções de implementação
1. `docs/interface.md`: percorrer § Pendências de interface item a item e remover
   os resolvidos, apontando o IDR que os resolveu; preencher § Demais telas com o
   que foi desenhado (política de privacidade, confirmação de importação);
   atualizar § Apresentação por faixa de tela.
2. `docs/arquitetura.md`: fechar os cinco pontos de § Pontos em aberto — aceite
   do ADR 0008, router, Context, virtualização e pipeline do catálogo —,
   apontando o registro de cada um; atualizar § Camadas no cliente para descrever
   os módulos e componentes que passaram a existir; conferir § Decisões-chave e
   onde vivem com os registros novos.
3. `docs/requisitos.md`: remover de § Decisões Pendentes as três resolvidas,
   apontando os registros; conferir se algum item de § Requisitos futuros deixou
   de ser futuro (não deve ter acontecido) e se o § Fora de Escopo continua
   exato.
4. `docs/persistencia.md`: atualizar § Pronto × falta para o produto implementado
   e conferir se § Operações sobre o formato bate com o que o código faz.
5. `AGENTS.md`: conferir a tabela § Onde fica cada coisa contra `src/` de
   verdade — arquivo por arquivo — e a seção § Stack, que ainda descreve
   dependências e escolhas da era do botão.
6. `docs/plano/README.md`: marcar as fases e tarefas como Concluídas e conferir se
   a tabela de alocação de pendências corresponde ao que de fato aconteceu; onde
   divergir, corrigir a tabela, não a história.
7. Listar no log toda pendência que **permanece** aberta ao fim do plano, com o
   motivo — o que não foi feito precisa ficar visível.

**Fora do escopo**: reescrever ADRs, TDRs ou IDRs existentes; mudar requisitos
para acomodar o que foi implementado; documentar requisitos futuros como se
tivessem sido feitos.

## Decisões já tomadas (não reabrir)
- A documentação de ambiente e de estado acompanha a realidade — ver `AGENTS.md` § Convenções
- `requisitos.md` vence em conflito com `interface.md` — ver `docs/interface.md` § O que é este documento
- Registros são história: não se reescrevem, se substituem por outros — ver `AGENTS.md` § Convenções

## Decisões em aberto nesta tarefa
- Nenhuma. Se a redação exigir uma decisão nova, ela pertence à tarefa que a
  originou — volte lá em vez de decidir aqui.

## Impedimentos
1. Ambiguidade menor, reversível, interna ao código: decida, implemente e
   **registre um TDR ou IDR** conforme o AGENTS.md.
2. Ambiguidade que muda o comportamento visível ao usuário: implemente sob a
   premissa mais conservadora, deixe-a explícita no log e sinalize ao humano.
3. **PARE e pergunte** quando: contradiz `docs/requisitos.md`; exige mudança de
   configuração pública (provedor de login, authorized domains, DNS, branch
   protection, secrets); tem custo em cota/plano; ou é irreversível.
   Ao parar, formule uma pergunta objetiva e apresente 2–3 alternativas com
   prós e contras.
   **Caso concreto previsto aqui**: se a conferência revelar que algo
   especificado em `requisitos.md` não foi implementado, isso não se resolve
   editando o requisito — PARE e reporte.

## Arquivos impactados
- `docs/interface.md` — modificar
- `docs/arquitetura.md` — modificar
- `docs/requisitos.md` — modificar
- `docs/persistencia.md` — modificar
- `AGENTS.md` — modificar
- `docs/plano/README.md` — modificar

## Critérios de aceite
- [ ] § Pendências de interface só lista o que continua aberto, com motivo
- [ ] § Pontos em aberto de `arquitetura.md` está vazio ou justificado, com registro apontado
- [ ] § Decisões Pendentes de `requisitos.md` não lista as três resolvidas
- [ ] `docs/persistencia.md` § Pronto × falta reflete o produto implementado
- [ ] A tabela § Onde fica cada coisa do `AGENTS.md` bate arquivo por arquivo com `src/`
- [ ] § Stack do `AGENTS.md` descreve o produto atual, não o botão
- [ ] O `README.md` do plano tem os status corretos
- [ ] O log lista o que permanece aberto, com o motivo
- [ ] Registros ADR/TDR/IDR criados para as decisões tomadas (nenhum esperado)
- [ ] `docs/plano/0009-acabamento-acessibilidade-e-docs/logs/0004-log-fechamento-da-documentacao.md` gerado

## Validação
`npm run lint && npm run test && npm run build`.
Conferência documental: percorrer `src/` e comparar com a tabela do `AGENTS.md`;
percorrer as listas de pendências e conferir que cada item removido tem um
registro que o resolveu.
