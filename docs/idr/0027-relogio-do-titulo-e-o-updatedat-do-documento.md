<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0027: O relógio do título é o `updatedAt` do documento

## Status

Aceito — corrige o "última transação bem-sucedida (leitura ou escrita)"
dos [IDRs 0017](0017-aviso-so-na-falha-com-detalhe-tecnico.md) e
[0018](0018-usuario-especialista-e-minimalismo.md), que discordava do
`updatedAt` descrito em modelo-firebase.md. Revisado no esmiuçamento
para tornar explícito o estado de pendência (ver Histórico).

## Contexto

- O título termina com um relógio (`… · 12:34`). Duas leituras
  conviviam na especificação:
  - **relógio de evento local**: ticka a cada transação bem-sucedida,
    leitura ou escrita — a leitura dos IDRs 0017/0018
   - **carimbo do documento**: o `updatedAt` gravado pelo servidor na
     última escrita — a leitura de modelo-firebase.md, ADR 0005 e
     arquitetura.md
- São coisas diferentes: numa carga bem-sucedida o `updatedAt` do
  documento pode ser de dias atrás. O usuário decidiu: `updatedAt`, a
  última escrita do documento.

## Decisão

- O relógio do título exibe o **`updatedAt` do documento** — carimbo do
  servidor na última escrita bem-sucedida da coleção
- Uma **carga** bem-sucedida não muda o relógio: ela traz o `updatedAt`
  que estiver gravado — o número que aparece responde "quando minha
  coleção foi salva pela última vez", não "quando falei com o servidor"
- Uma **gravação** bem-sucedida atualiza o relógio — que deixou de ser
  o único feedback de sucesso: o
  [IDR 0029](0029-avisos-flutuantes-com-tres-severidades.md) devolveu o
  aviso efêmero, e o relógio fica como registro do estado ("quando minha
  coleção foi salva")
- Documento sem `updatedAt` (conta nova, coleção ainda vazia) exibe um
  travessão no lugar do relógio
- O formato mostra data quando o carimbo não é de hoje — hora sozinha só
  para o mesmo dia
- **Pendência de salvar** (esmiuçamento): enquanto houver alguma
  alteração ainda não gravada (`gravacaoAgregada.temPendencia()` true —
  do primeiro ajuste da rajada até a gravação seguinte confirmar), o
  relógio some e o texto **"não salvo"** ocupa o lugar dele, na mesma
  notação compacta de uma linha (IDR 0018). Um único estado, sem
  distinguir "esperando o debounce" de "gravação em voo" — a gravação só
  dispara depois do debounce (IDR 0003/MDR 0003), então "salvando…"
  seria impreciso durante a espera. Ver
  [IDR 0065](0065-sem-modal-ao-sair-indicador-de-pendencia-no-titulo.md):
  esse indicador não bloqueante substitui um popup/modal de aviso ao
  sair da página.

## Consequências

- O relógio ganha um significado só, verificável contra o banco: é o
  campo `updatedAt` de `users/{uid}`
- A carga perde feedback próprio: entrar e ver a coleção na tela é o
  sinal de que carregou; falha de leitura, como qualquer falha, avisa
  (IDR 0017)
- "Meus ajustes estão salvos?" fica explícito, não só dedutível: hora
  recente = gravado; "não salvo" = há pendência (esperando o debounce,
  em rajada, ou aguardando a gravação); falha continua avisada à parte
  (IDR 0017)
- A `atestadoEm` não mexe no relógio nem no indicador de pendência — ela
  não grava `updatedAt` nem passa por `gravacaoAgregada` (ADR 0005)

## Alternativas consideradas

- **Relógio de evento local** (leitura dos IDRs 0017/0018): tickaria
  também na carga, mas mistura "conversei com o servidor" com "meus
  dados estão salvos" — e o valor exibido não corresponderia a nada
  gravado
- **Dois relógios** (carga e escrita): mais informação, contra o título
  de uma linha do IDR 0018
- **"salvando…"** no lugar de "não salvo": sugere ação em curso, mas a
  gravação só dispara após o debounce — o texto ficaria impreciso
  durante a espera. Descartado.
- **"pendente"** no lugar de "não salvo": mais neutro/técnico, menos
  alinhado ao tom direto do resto do título. Descartado.

## Histórico

- 2026-09-18 — Esmiuçamento de UX de edição e saída: acrescenta o estado
  "não salvo" no lugar do relógio enquanto há pendência de gravação, e
  liga essa decisão ao IDR 0065 (sem modal ao sair). Implementação: Fase
  0033, Tarefa 0033-0004. Antes: o relógio só mostrava o `updatedAt` ou o
  travessão de conta nova, sem indicar pendência de forma explícita.
