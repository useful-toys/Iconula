<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0032-0005]: registro de operações e plano de incidente

## Status
Pendente

## Objetivo

Completar `docs/privacidade.md` como documento único de conformidade:
registro das operações de tratamento (art. 37), plano de resposta a
incidente (art. 48) e o passo a passo do atendimento ao titular.

## Documentos de referência

- `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`
  § Decisão — o que o documento cobre e o que fica manual.
- `docs/privacidade.md` (gerado pela Tarefa 0031-0006) — o inventário e
  o runbook da purga, que esta tarefa completa.
- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  § Decisão — prazo e critério de identificação, aqui descritos do lado
  de dentro.
- `docs/model-dr/0009-campos-de-aceite-dos-textos.md` — os campos novos,
  que entram no inventário.
- `SECURITY.md` — o texto atual sobre relato de vulnerabilidade.

## Padrões e convenções aplicáveis

- Segredos e dados pessoais reais nunca aparecem em documento.
- Todo `docs/*.md` alterado cita o registro que o lastreia.
- `docs/devops.md` é o ponto de entrada do panorama; os DDRs são o
  detalhe.

## Escopo e instruções de implementação

1. Em `docs/privacidade.md`, completar o registro das operações de
   tratamento: cada operação com dado, finalidade, base legal, retenção,
   operador e transferência, incluindo os campos de aceite da Fase 0032,
   mais o ciclo de revisão (a cada mudança de schema ou de dependência,
   e uma revisão anual).
2. Acrescentar o plano de resposta a incidente: detecção, contenção,
   avaliação de risco e comunicação à ANPD e aos titulares, com o prazo
   regulamentar vigente. Descrever os cenários concretos deste app —
   regra do Firestore aberta por engano, conta do controlador
   comprometida, link de catálogo indexado — e o único canal disponível
   para avisar o titular, o e-mail da conta.
3. Acrescentar o passo a passo do atendimento ao titular, incluindo a
   conferência do e-mail de origem e o prazo declarado na política.
4. Em `SECURITY.md`, distinguir relato de vulnerabilidade de incidente
   com dado pessoal, remetendo à seção nova.
5. Em `docs/devops.md` § Segurança, atualizar a subseção de privacidade
   para citar também o plano de incidente.

**Fora do escopo**: o texto voltado ao usuário (Tarefa 0032-0004);
qualquer automação (DDR 0011).

## Decisões já tomadas (não reabrir)

- Purga e incidente manuais, com runbook próprio — ver
  `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`.
- Prazo de 15 dias e identificação pelo e-mail da conta — ver
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.

## Decisões em aberto nesta tarefa

- O prazo exato de comunicação de incidente à ANPD deve ser conferido na
  redação regulamentar vigente na data da execução (nível 1): escreva o
  prazo conferido e cite a norma; divergência com o que o planejamento
  supôs é ajuste de texto, não decisão nova.

## Arquivos impactados

- `docs/privacidade.md` — modificar
- `SECURITY.md` — modificar
- `docs/devops.md` — modificar (§ Segurança)

## Critérios de aceite

- [ ] O registro das operações cobre todos os campos de `users/{uid}`,
      inclusive os três da Fase 0032
- [ ] O plano de incidente traz detecção, contenção, avaliação,
      comunicação e os três cenários concretos
- [ ] O prazo de comunicação à ANPD cita a norma conferida
- [ ] O atendimento ao titular descreve a conferência do e-mail de
      origem
- [ ] `SECURITY.md` distingue vulnerabilidade de incidente com dado
      pessoal
- [ ] `npm run lint && npm run test && npm run build` verdes
