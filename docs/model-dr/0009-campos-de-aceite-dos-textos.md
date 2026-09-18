<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# MDR 0009: Campos de aceite dos textos, com data ISO como versão

## Status

Aceito — implementação na Fase 0032, Tarefas 0032-0001 e 0032-0002.

## Contexto

- A base legal dos textos é a execução do contrato
  ([IDR 0061](../idr/0061-conteudo-de-conformidade-da-politica-e-dos-termos.md)),
  e o ônus de provar o aceite é do controlador.
- Hoje o documento guarda só `atestadoEm`: a conta prova que atestou a
  idade, não **qual texto** aceitou.
- O [MDR 0002](0002-schema-do-documento-da-colecao.md) fixa quatro campos
  e o `hasOnly` das regras os trava — campo novo exige regra nova
  publicada antes do código que o escreve
  ([TDR 0008](../tdr/0008-deploy-e-teste-das-regras-do-firestore.md)).
- Os dois textos passam a exibir "Última atualização" no topo
  (IDR 0061).

## Decisão

- Três campos novos em `users/{uid}`:
  - `termosVersao` e `politicaVersao` — string com a data de vigência em
    ISO (`"2026-09-17"`), no máximo 10 caracteres;
  - `aceitoEm` — timestamp.
- Gravados juntos, com `setDoc(..., { merge: true })` e **sem**
  `updatedAt`: o carimbo da coleção segue significando apenas alteração
  de contagens, como já vale para `atestadoEm` e `linkAtivo`.
- `gravarAtestacao` vira `gravarAceite(uid, { atestar })`: grava as duas
  versões e `aceitoEm`, e só inclui `atestadoEm` no primeiro acesso.
- `carregarColecao` passa a devolver as duas versões junto com
  `atestadoEm`.
- A versão é a **data de vigência do texto**, e só mudança material a
  altera — correção de digitação ou de estilo não muda versão nem reabre
  o aceite de ninguém.

## Consequências

- O `hasOnly` do `create` e do `update` passa a listar sete campos, cada
  um validado sob a guarda de `affectedKeys()`, no mesmo formato de
  `atestadoEm`.
- A gravação do aceite continua custando uma escrita, agora com três
  campos em vez de um.
- Documento antigo sem os campos é indistinguível de quem nunca aceitou:
  a conta vê o passo de aceite uma vez e segue
  ([IDR 0062](../idr/0062-reaceite-reusa-a-tela-de-atestacao.md)).
- `docs/modelo-firebase.md` passa a descrever sete campos e a função
  renomeada.

## Alternativas consideradas

- **Contador inteiro de versão (`1`, `2`, …)**: menor e mais fácil de
  comparar, mas cria um segundo eixo de numeração que precisaria ser
  mantido em sincronia com a data de vigência exibida no texto — duas
  fontes para o mesmo fato.
- **Hash do texto**: dispensaria manutenção manual, mas qualquer
  correção de digitação mudaria o hash e reabriria o aceite de todos —
  exatamente o que a regra de "mudança material" evita.
- **Um mapa `aceite: { termos, politica, em }`**: agruparia melhor, mas
  a linguagem de regras valida mapa com muito mais dificuldade que campos
  planos (TDR 0009), sem ganho real.
- **Guardar o aceite fora do documento do usuário**: exigiria segunda
  coleção, segunda leitura e regras próprias, contra a RNF de uma leitura
  por login.
