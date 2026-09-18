<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# DDR 0011: Procedimentos manuais de privacidade — purga e incidente

## Status

Aceito — implementação nas Fases 0031 (Tarefa 0031-0006) e 0032
(Tarefa 0032-0005).

## Contexto

- O [IDR 0061](../idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)
  declara retenção de 24 meses de inatividade e descarte em até 90 dias
  no encerramento do projeto — obrigações que alguém precisa executar.
- O projeto está no plano Spark: **não há Cloud Functions**, nem tarefa
  agendada, nem envio de e-mail. O único workflow agendado existente
  (`firebase-preview-domains-sweep.yml`) roda no GitHub Actions contra
  APIs públicas, não contra dados de usuário.
- O art. 48 exige comunicação de incidente à ANPD e aos titulares; o
  `SECURITY.md` cobre relato de vulnerabilidade, não incidente com dado
  pessoal.
- O art. 37 exige registro das operações de tratamento; hoje o assunto
  está espalhado entre `requisitos.md`, `modelo-firebase.md` e a própria
  política.

## Decisão

- A purga por inatividade e a resposta a incidente são **procedimentos
  manuais do controlador**, com runbook em `docs/privacidade.md` — um
  documento novo, que também consolida o registro das operações de
  tratamento.
- A política **não** promete aviso individual por e-mail antes da purga:
  só o que dá para cumprir é declarado.
- `docs/devops.md` § Segurança ganha uma subseção apontando o runbook, e
  o `SECURITY.md` distingue vulnerabilidade de incidente com dado
  pessoal, remetendo à seção correspondente.
- Automatizar a purga fica condicionado a migrar para o plano Blaze —
  gatilho de revisão registrado aqui, não requisito.

## Consequências

- O controlador assume uma rotina recorrente: listar contas sem login há
  24 meses no console do Firebase e apagá-las, na periodicidade definida
  no runbook.
- `docs/privacidade.md` passa a ser o documento único de conformidade —
  inventário, retenção, atendimento ao titular e incidente —, e precisa
  ser revisto a cada mudança de schema ou de dependência.
- O compromisso público fica menor que o compromisso interno: a política
  declara o prazo, o runbook descreve a execução.
- Nenhum workflow novo, nenhum custo de plano, nenhuma credencial nova.

## Alternativas consideradas

- **Cloud Function agendada**: apagaria contas inativas sozinha e
  permitiria aviso prévio por e-mail, mas exige o plano Blaze — decisão
  de custo que o projeto não tomou, com o agravante de dar a uma função
  automática permissão para apagar contas.
- **Workflow do GitHub Actions com service account**: dispensaria o
  Blaze, mas poria uma credencial capaz de apagar dados de usuário no
  CI, aumentando a superfície de ataque do repositório para uma rotina
  que roda duas vezes por ano.
- **Não declarar prazo de retenção**: evitaria a rotina inteira, mas
  deixa o art. 16 sem resposta.
- **Seção no `SECURITY.md` em vez de documento novo**: o `SECURITY.md` é
  endereçado a quem relata falha de segurança; misturar inventário de
  tratamento e runbook de purga confundiria os dois públicos.
