<!-- Copyright (c) 2026 Daniel Felix Ferber -->

# IDR 0027: O relógio do título é o `updatedAt` do documento

## Status

Aceito — corrige o "última transação bem-sucedida (leitura ou escrita)"
dos [IDRs 0017](0017-aviso-so-na-falha-com-detalhe-tecnico.md) e
[0018](0018-usuario-especialista-e-minimalismo.md), que discordava do
`updatedAt` descrito em persistencia.md.

## Contexto

- O título termina com um relógio (`… · 12:34`). Duas leituras
  conviviam na especificação:
  - **relógio de evento local**: ticka a cada transação bem-sucedida,
    leitura ou escrita — a leitura dos IDRs 0017/0018
  - **carimbo do documento**: o `updatedAt` gravado pelo servidor na
    última escrita — a leitura de persistencia.md, ADR 0008 e
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

## Consequências

- O relógio ganha um significado só, verificável contra o banco: é o
  campo `updatedAt` de `users/{uid}`
- A carga perde feedback próprio: entrar e ver a coleção na tela é o
  sinal de que carregou; falha de leitura, como qualquer falha, avisa
  (IDR 0017)
- "Meus ajustes estão salvos?" continua legível: hora recente = gravado;
  ajuste feito e relógio parado = gravação ainda pendente ou falha
- A `atestadoEm` não mexe no relógio — ela não grava `updatedAt`
  (ADR 0008)

## Alternativas consideradas

- **Relógio de evento local** (leitura dos IDRs 0017/0018): tickaria
  também na carga, mas mistura "conversei com o servidor" com "meus
  dados estão salvos" — e o valor exibido não corresponderia a nada
  gravado
- **Dois relógios** (carga e escrita): mais informação, contra o título
  de uma linha do IDR 0018
