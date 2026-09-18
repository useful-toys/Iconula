<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# Tarefa [0031-0006]: inventário e documentação de privacidade

## Status
Pendente

## Objetivo

Criar `docs/privacidade.md` — o documento de conformidade que hoje não
existe — com o inventário das operações de tratamento e o runbook da
purga por inatividade, e deixar os documentos de setup e de panorama
coerentes com a fase.

## Documentos de referência

- `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`
  § Decisão — o que é manual, o que o runbook cobre e por que nada é
  automatizado.
- `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`
  § Decisão — os prazos de retenção e as bases legais que o inventário
  tabula.
- `docs/modelo-firebase.md` §§ Onde os dados vivem, Formato do documento
  — a fonte do inventário.
- `docs/setup-gcloud.md` — estrutura e estilo dos passos de setup já
  registrados.
- `docs/arquitetura.md` § Decisões-chave e onde vivem — a tabela que
  recebe os registros desta fase.

## Padrões e convenções aplicáveis

- `docs/setup-*.md` só recebe passos de setup reais, com o estado final
  e como reproduzir (`AGENTS.md` § Convenções).
- Segredos nunca em claro, nem em documento nem em log.
- Arquivo novo abre com o cabeçalho de copyright.
- Todo `docs/*.md` alterado cita o registro que o lastreia.

## Escopo e instruções de implementação

1. Criar `docs/privacidade.md` com: inventário das operações de
   tratamento (dado, finalidade, base legal, retenção, operador,
   transferência), a partir do que `modelo-firebase.md` e o IDR 0061 já
   fixam; o runbook da purga por inatividade — como listar contas sem
   login há 24 meses no console do Firebase, como apagá-las, com que
   periodicidade e o que registrar a cada execução; e o ciclo de revisão
   do próprio documento.
2. Em `docs/setup-gcloud.md`, acrescentar seção com o aceite do Data
   Processing Addendum do Google Cloud — o que é, onde se aceita, e por
   que a política depende dele (declara o Google como operador). É passo
   do controlador, executado por ele; a tarefa **documenta**, não
   executa.
3. Em `docs/setup-firebase.md` § Cloud Firestore, remeter à seção nova
   de `setup-gcloud.md`.
4. Em `docs/devops.md` § Segurança, acrescentar subseção apontando
   `docs/privacidade.md` como o lugar dos procedimentos de privacidade,
   citando o DDR 0011.
5. Em `docs/arquitetura.md` § Decisões-chave e onde vivem, acrescentar
   as linhas dos registros criados no planejamento desta fase (IDR 0060,
   IDR 0061, TDR 0027, TDR 0028, DDR 0011).
6. Em `AGENTS.md` § Onde fica cada coisa, acrescentar a linha de
   `docs/privacidade.md`.

**Fora do escopo**: executar qualquer configuração no Google Cloud ou no
Firebase — nenhum comando de conta é rodado por esta tarefa; o plano de
resposta a incidente e o registro completo do art. 37 (Tarefa
0032-0005); `docs/requisitos.md`, alterado no PR do planejamento.

## Decisões já tomadas (não reabrir)

- Purga e incidente são manuais, sem Cloud Functions e sem promessa de
  aviso por e-mail — ver
  `docs/devops-dr/0011-procedimentos-manuais-de-privacidade.md`.
- Os prazos de retenção — ver
  `docs/idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md`.

## Arquivos impactados

- `docs/privacidade.md` — criar
- `docs/setup-gcloud.md` — modificar (seção nova de proteção de dados)
- `docs/setup-firebase.md` — modificar (§ Cloud Firestore)
- `docs/devops.md` — modificar (§ Segurança)
- `docs/arquitetura.md` — modificar (§ Decisões-chave e onde vivem)
- `AGENTS.md` — modificar (§ Onde fica cada coisa)

## Critérios de aceite

- [ ] `docs/privacidade.md` existe e traz o inventário com as seis
      colunas e o runbook da purga, com periodicidade definida
- [ ] O runbook não promete aviso individual por e-mail
- [ ] `docs/setup-gcloud.md` descreve o aceite do DPA como passo do
      controlador, com onde conferir o estado atual
- [ ] `docs/arquitetura.md` § Decisões-chave lista os cinco registros
      novos, com links relativos válidos
- [ ] `docs/devops.md` § Segurança aponta o documento novo citando o
      DDR 0011
- [ ] Nenhum comando foi executado em Firebase ou Google Cloud por esta
      tarefa
- [ ] `npm run lint && npm run test && npm run build` verdes
