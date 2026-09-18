<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Log — Tarefa 0032-0005: registro de operações e plano de incidente

## Data
2026-09-18

## Resumo

Completa o `docs/privacidade.md` como documento único de conformidade:
o inventário do art. 37 passa a cobrir todos os sete campos de `users/{uid}`
(incluindo `termosVersao`, `politicaVersao` e `aceitoEm`, da Fase 0032),
acrescenta o passo a passo do atendimento ao titular (conferência do e-mail
de origem e prazo de 15 dias) e o plano de resposta a incidente (LGPD
art. 48) — detecção, contenção, avaliação de risco, comunicação à ANPD e
aos titulares, registro e correção, com três cenários concretos deste app e
o e-mail da conta como único canal de aviso. O `SECURITY.md` ganha a
distinção entre relato de vulnerabilidade e incidente com dado pessoal, e o
`docs/devops.md` § Segurança passa a citar o atendimento e o plano. Nenhum
código mudou: é a implementação manual já decidida no DDR 0011.

## Discovery

- Código: não se aplica — a tarefa não altera `src/`, testes, estilos,
  regras, configuração nem workflows. O inventário descreve o schema de
  `users/{uid}` publicado em `firestore.rules`; os campos `termosVersao`,
  `politicaVersao` e `aceitoEm` já estão publicados e descritos em
  `docs/modelo-firebase.md` (MDR 0009), então entram no inventário sem
  código novo.
- Documentação: li o `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`
  (§ Decisão e § Consequências — runbook manual em `docs/privacidade.md`,
  subseção em `docs/devops.md` § Segurança, `SECURITY.md` distinguindo os
  dois casos), o `docs/privacidade.md` inteiro (inventário e runbook da
  purga gerados pela Tarefa 0031-0006), o
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  (§ Decisão — prazo de 15 dias e identificação pelo e-mail da conta), o
  `docs/model-dr/0009-campos-de-aceite-dos-textos.md`, o
  `docs/modelo-firebase.md` § Formato do documento (os sete campos),
  o `SECURITY.md` atual (só relato de vulnerabilidade) e a `docs/devops.md`
  § Segurança › Procedimentos de privacidade (ainda não cita o plano de
  incidente). Conferi o prazo regulamentar vigente na data: a
  [Resolução CD/ANPD nº 15, de 24 de abril de 2024](https://www.in.gov.br/en/web/dou/-/resolucao-cd/anpd-n-15-de-24-de-abril-de-2024-556243024)
  fixa **três dias úteis** para comunicar a ANPD (art. 6º) e o titular
  (art. 9º), contados do conhecimento de que o incidente afetou dados
  pessoais, e prazos **em dobro** para agentes de tratamento de pequeno
  porte (art. 6º, §8º, e art. 9º, §6º; Res. CD/ANPD nº 2/2022).

## Plano da alteração

1. `docs/privacidade.md`: atualizar a introdução e a "Cobertura" (some o
   "a completar na Tarefa 0032-0005"); acrescentar ao inventário a linha
   dos campos de aceite; acrescentar a seção "Atendimento ao titular";
   acrescentar a seção "Plano de resposta a incidente" (detecção, contenção,
   avaliação, comunicação, registro e correção; prazo de 3 dias úteis
   citando a norma; os cenários regra do Firestore aberta, conta do
   controlador comprometida e link de catálogo indexado; o e-mail da conta
   como único canal); anotar a revisão em "Revisões".
2. `SECURITY.md`: nova seção distinguindo relato de vulnerabilidade de
   incidente com dado pessoal, remetendo ao plano.
3. `docs/devops.md` § Segurança › Procedimentos de privacidade: citar
   também o atendimento ao titular e o plano de resposta a incidente.
4. Fechar o log, marcar a tarefa e a linha do `docs/plano/README.md` como
   `Concluída` e commitar.

- Verificação prevista: cada critério por leitura e busca nos documentos;
  lint, test e build ao final (tarefa só de documentação).
- Riscos: não vazar dado pessoal real no registro; manter a citação do
  prazo correta e coerente com a norma conferida; não tocar em nada fora
  de `docs/privacidade.md`, `SECURITY.md` e `docs/devops.md`.
- Desvios: nenhum.

## Decisões tomadas

- Prazo de comunicação de incidente: **3 dias úteis** à ANPD (art. 6º) e ao
  titular (art. 9º) da Resolução CD/ANPD nº 15/2024, com a nota de que o
  dobro dos prazos vale só para agentes de pequeno porte e que o Iconula,
  projeto sem fins econômicos, não se enquadra. Nível 1 (questão já deixada
  em aberto na tarefa, com o encaminhamento de conferir a norma), sem
  registro novo.
- O plano de incidente é implementação manual da decisão já vigente do DDR
  0011 e o atendimento ao titular segue o IDR 0061; nada disso pede registro
  novo.

## Impedimentos

Nenhum.

## Setup realizado

Nenhum.

## Validação

- `npm run lint`:
  ```
  > oxlint
  Found 0 warnings and 0 errors.
  Finished in 62ms on 99 files with 105 rules using 4 threads.
  ```
- `npm run test`:
  ```
  Test Files  48 passed (48)
       Tests  635 passed (635)
  ```
  Os avisos `An update to Avisos inside a test was not wrapped in act(...)`
  são pré-existentes (aparecem também na `main` e na Tarefa 0032-0004).
- `npm run build`:
  ```
  ✓ 144 modules transformed.
  ✓ built in 463ms
  ```
  O aviso de chunk > 500 kB é pré-existente.
- `npm run test:rules`: não se aplica — a tarefa não toca `firestore.rules`.

## Critérios de aceite

- [x] O registro das operações cobre todos os campos de `users/{uid}`,
      inclusive os três da Fase 0032 — o inventário tem `contagens` e
      `updatedAt` (linha da coleção), `atestadoEm`, `termosVersao`,
      `politicaVersao`, `aceitoEm` e `linkAtivo`
      (`docs/privacidade.md:29-34`); conferido contra os sete campos de
      `docs/modelo-firebase.md` § Formato do documento.
- [x] O plano de incidente traz detecção, contenção, avaliação, comunicação
      e os três cenários concretos — subseções `Detecção`, `Contenção`,
      `Avaliação de risco`, `Comunicação`, `Registro e correção` e
      `Cenários concretos deste app` (`docs/privacidade.md:155-248`).
- [x] O prazo de comunicação à ANPD cita a norma conferida — "três dias
      úteis ... (Resolução CD/ANPD nº 15/2024, art. 6º)"
      (`docs/privacidade.md:201-204`).
- [x] O atendimento ao titular descreve a conferência do e-mail de origem —
      passo 1 de "Atendimento ao titular" (`docs/privacidade.md:127-153`);
      o prazo de 15 dias aparece no passo 4 (`docs/privacidade.md:149`).
- [x] `SECURITY.md` distingue vulnerabilidade de incidente com dado pessoal —
      seção "Vulnerabilidade e incidente com dado pessoal", com link para o
      plano em `docs/privacidade.md`.
- [x] `npm run lint && npm run test && npm run build` verdes — saídas acima.

## Arquivos alterados

- `docs/privacidade.md` — inventário com os campos de aceite; seções
  "Atendimento ao titular" e "Plano de resposta a incidente"; introdução e
  registro de revisão.
- `SECURITY.md` — seção "Vulnerabilidade e incidente com dado pessoal".
- `docs/devops.md` — § Segurança › Procedimentos de privacidade citando o
  atendimento e o plano de incidente.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/0005-registro-de-operacoes-e-plano-de-incidente.md`
  — status para `Concluída`.
- `docs/plano/README.md` — linha da tarefa 0005 para `Concluída`.
- `docs/plano/0032-prova-de-aceite-atendimento-e-incidentes/logs/0005-log-registro-de-operacoes-e-plano-de-incidente.md`
  — este log (novo).
